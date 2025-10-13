#!/bin/bash

# Fluxwing Consistency Test Runner
# Usage: ./run-tests.sh [options]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "======================================================================"
echo "  🧪 FLUXWING CONSISTENCY TEST SUITE"
echo "======================================================================"
echo -e "${NC}"

# Check if in correct directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ Error: Must run from tests/ directory${NC}"
  exit 1
fi

# Parse arguments
CATEGORY=""
GENERATE_REPORT=false
COVERAGE=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --category)
      CATEGORY="$2"
      shift 2
      ;;
    --report)
      GENERATE_REPORT=true
      shift
      ;;
    --coverage)
      COVERAGE=true
      shift
      ;;
    --help)
      echo "Usage: ./run-tests.sh [options]"
      echo ""
      echo "Options:"
      echo "  --category <name>   Run specific category (commands, agents, documentation, etc.)"
      echo "  --report            Generate HTML/JSON reports after tests"
      echo "  --coverage          Generate coverage report"
      echo "  --help              Show this help message"
      echo ""
      echo "Examples:"
      echo "  ./run-tests.sh                          # Run all tests"
      echo "  ./run-tests.sh --category commands      # Run command tests only"
      echo "  ./run-tests.sh --report                 # Run tests and generate reports"
      echo "  ./run-tests.sh --coverage               # Run tests with coverage"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Run './run-tests.sh --help' for usage information"
      exit 1
      ;;
  esac
done

# Check for API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo -e "${YELLOW}⚠️  WARNING: ANTHROPIC_API_KEY not set${NC}"
  echo "   Static tests will run, but SDK-based tests will be skipped."
  echo "   Set the environment variable to run all tests:"
  echo "   export ANTHROPIC_API_KEY=\"your-api-key\""
  echo ""
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo -e "${BLUE}📦 Installing dependencies...${NC}"
  pnpm install
  echo ""
fi

# Build TypeScript
echo -e "${BLUE}🔨 Building TypeScript...${NC}"
pnpm run build
echo ""

# Construct test command
TEST_CMD="pnpm test"

if [ -n "$CATEGORY" ]; then
  echo -e "${BLUE}🎯 Running Category: ${CATEGORY}${NC}"

  case $CATEGORY in
    commands|command)
      TEST_CMD="$TEST_CMD -- --testPathPattern=01-command"
      ;;
    agents|agent)
      TEST_CMD="$TEST_CMD -- --testPathPattern=02-agent"
      ;;
    functional-commands)
      TEST_CMD="$TEST_CMD -- --testPathPattern=03-functional"
      ;;
    functional-agents)
      TEST_CMD="$TEST_CMD -- --testPathPattern=04-functional"
      ;;
    documentation|docs)
      TEST_CMD="$TEST_CMD -- --testPathPattern=05-documentation"
      ;;
    integration)
      TEST_CMD="$TEST_CMD -- --testPathPattern=06-integration"
      ;;
    static)
      TEST_CMD="$TEST_CMD -- --testPathPattern=\"(01-command|02-agent|05-documentation)\""
      ;;
    sdk)
      TEST_CMD="$TEST_CMD -- --testPathPattern=\"(03-functional|04-functional|06-integration)\""
      ;;
    *)
      echo -e "${RED}Unknown category: ${CATEGORY}${NC}"
      echo "Valid categories: commands, agents, functional-commands, functional-agents, documentation, integration, static, sdk"
      exit 1
      ;;
  esac
fi

if [ "$COVERAGE" = true ]; then
  TEST_CMD="$TEST_CMD -- --coverage"
fi

# Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
echo ""

if eval $TEST_CMD; then
  TEST_RESULT=0
  echo ""
  echo -e "${GREEN}✅ Tests completed successfully!${NC}"
else
  TEST_RESULT=$?
  echo ""
  echo -e "${RED}❌ Some tests failed${NC}"
fi

# Generate reports if requested
if [ "$GENERATE_REPORT" = true ]; then
  echo ""
  echo -e "${BLUE}📊 Generating reports...${NC}"
  npm run test:report || true

  if [ -f "reports/test-results.html" ]; then
    echo -e "${GREEN}✅ Reports generated:${NC}"
    echo "   HTML: $(pwd)/reports/test-results.html"
    echo "   JSON: $(pwd)/reports/test-results.json"
  fi
fi

# Show coverage if generated
if [ "$COVERAGE" = true ] && [ -d "coverage" ]; then
  echo ""
  echo -e "${BLUE}📈 Coverage report:${NC}"
  echo "   HTML: $(pwd)/coverage/lcov-report/index.html"
fi

echo ""
echo -e "${BLUE}======================================================================"
echo -e "${NC}"

exit $TEST_RESULT
