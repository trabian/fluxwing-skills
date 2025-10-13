# Fluxwing Consistency Tests

Automated test suite for validating consistency improvements across all Fluxwing plugin commands, agents, and documentation.

## Overview

This test suite validates all aspects of the Fluxwing plugin consistency improvements, including:

- **28 total test cases** across 6 categories
- **Static tests** (file structure, documentation)
- **SDK-based tests** (command execution, agent behavior)
- **Integration tests** (end-to-end workflows)

## Quick Start

### Prerequisites

```bash
# Node.js 20+ required
node --version  # Should be v20.0.0 or higher

# Install dependencies
cd tests
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific category
npm test -- --testPathPattern="01-command"

# Run with coverage
npm test -- --coverage

# Watch mode for development
npm test -- --watch

# Generate HTML/JSON reports
npm run test:report
```

### Environment Setup

For SDK-based tests (Categories 3, 4, 6), you need an Anthropic API key:

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

**Note:** Static tests (Categories 1, 2, 5) run without an API key.

## Test Categories

### Category 1: Command File Consistency (2 tests)
**Type:** Static
**Duration:** ~30 seconds
**Requires API Key:** No

Validates that all command files have:
- "Data Location Rules" headers
- Consistent path references
- No hardcoded plugin paths

**Test Files:** `01-command-consistency.test.ts`

---

### Category 2: Agent File Consistency (2 tests)
**Type:** Static
**Duration:** ~30 seconds
**Requires API Key:** No

Validates that all agent files have:
- "Data Location Rules" headers with agent-focused tone
- Correct inventory search order
- READ-ONLY specifications for bundled templates

**Test Files:** `02-agent-consistency.test.ts`

---

### Category 3: Functional Commands (5 tests)
**Type:** SDK-based
**Duration:** ~10 minutes
**Requires API Key:** Yes

Tests command execution:
- `/fluxwing-create` saves to correct location
- `/fluxwing-scaffold` saves screens and components correctly
- `/fluxwing-library` displays all three sources
- `/fluxwing-validate` only checks project files
- `/fluxwing-get` follows correct search order

**Test Files:** `03-functional-commands.test.ts`

---

### Category 4: Functional Agents (3 tests)
**Type:** SDK-based
**Duration:** ~15 minutes
**Requires API Key:** Yes

Tests agent behavior:
- `fluxwing-designer` saves to correct locations
- `fluxwing-composer` checks all three component sources
- `fluxwing-validator` only validates project files

**Test Files:** `04-functional-agents.test.ts`

---

### Category 5: Documentation Consistency (2 tests)
**Type:** Static
**Duration:** ~1 minute
**Requires API Key:** No

Validates documentation:
- All doc files have data location sections
- Cross-references are consistent (e.g., "11 templates")
- Path variables used consistently

**Test Files:** `05-documentation.test.ts`

---

### Category 6: Integration & Edge Cases (4 tests)
**Type:** SDK-based
**Duration:** ~10 minutes
**Requires API Key:** Yes

Tests complex scenarios:
- Complete component lifecycle (browse → create → validate)
- Mixed-source component usage
- Error messages show correct paths
- Read-only enforcement (plugin directory never modified)

**Test Files:** `06-integration.test.ts`

---

## Project Structure

```
tests/
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── jest.config.js              # Jest test configuration
├── README.md                   # This file
├── src/
│   ├── index.ts                # Main test runner
│   ├── setup.ts                # Jest setup (runs before tests)
│   ├── teardown.ts             # Jest teardown (runs after tests)
│   ├── generate-report.ts      # Report generation script
│   ├── utils/
│   │   ├── claude-client.ts    # Claude Agent SDK wrapper
│   │   ├── file-utils.ts       # File system utilities
│   │   ├── assertions.ts       # Custom test assertions
│   │   └── reporters.ts        # Report generators (HTML/JSON)
│   └── tests/
│       ├── 01-command-consistency.test.ts
│       ├── 02-agent-consistency.test.ts
│       ├── 03-functional-commands.test.ts
│       ├── 04-functional-agents.test.ts
│       ├── 05-documentation.test.ts
│       └── 06-integration.test.ts
├── reports/                    # Generated test reports
│   ├── test-results.json       # Machine-readable results
│   └── test-results.html       # Human-readable HTML report
└── test-workspace/             # Temporary test environment
```

## Test Utilities

### ClaudeTestClient

Wrapper around Claude Agent SDK for testing:

```typescript
const client = new ClaudeTestClient();

// Execute a command
await client.executeCommand('/fluxwing-create test-button');

// Dispatch an agent
await client.dispatchAgent('fluxwing-designer', 'Create a login form');

// Check file content
const hasHeader = await client.searchFileContent('Data Location Rules', filePath);
```

### FileTestUtils

File system utilities:

```typescript
const fileUtils = new FileTestUtils();

// Setup test workspace
const workspace = await fileUtils.setupTestWorkspace();

// Check files
const exists = await fileUtils.fileExists('./fluxwing/components/test.uxm');

// Get timestamps (for read-only verification)
const timestamps = await fileUtils.getFileTimestamps(pluginDataDir);
```

### FluxwingAssertions

Custom assertions:

```typescript
// Path assertions
await FluxwingAssertions.assertPathExists(filePath);
await FluxwingAssertions.assertPathNotExists(filePath);

// Content assertions
await FluxwingAssertions.assertFileContains(filePath, 'Data Location Rules');
await FluxwingAssertions.assertFileNotContains(filePath, 'hardcoded-path');

// Directory assertions
await FluxwingAssertions.assertNoFilesInDirectory(dirPath);
await FluxwingAssertions.assertFileCount(dirPath, 5);

// Timestamp assertions (read-only enforcement)
FluxwingAssertions.assertTimestampsUnchanged(beforeTimestamps, afterTimestamps);
```

## Test Reports

### JSON Report

Machine-readable results at `reports/test-results.json`:

```json
{
  "summary": {
    "total": 28,
    "passed": 26,
    "failed": 2,
    "skipped": 0,
    "duration": 1234567,
    "timestamp": "2025-10-12T10:30:00.000Z"
  },
  "categories": [
    {
      "category": "Category 1: Command File Consistency",
      "total": 5,
      "passed": 5,
      "failed": 0,
      "skipped": 0
    }
  ],
  "results": [...]
}
```

### HTML Report

Human-readable report at `reports/test-results.html`:

- Visual summary with color-coded results
- Breakdown by category
- Detailed error messages for failed tests
- Duration metrics

### Console Report

Printed to stdout after test execution:

```
==========================================================
  FLUXWING CONSISTENCY TEST REPORT
==========================================================

Timestamp: 2025-10-12T10:30:00.000Z
Duration: 37.23s

Summary:
  Total:   28
  ✓ Passed:  26
  ✗ Failed:  2
  ⊘ Skipped: 0

By Category:
  Category 1: Command File Consistency:
    Total: 5 | Passed: 5 | Failed: 0 | Skipped: 0
  ...
```

## CI/CD Integration

### GitHub Actions

Workflow file: `.github/workflows/fluxwing-consistency-tests.yml`

**Triggers:**
- Push to `main` branch (when fluxwing/ or tests/ changes)
- Pull requests to `main`
- Manual workflow dispatch

**Jobs:**
1. Run static tests (no API key required)
2. Run SDK tests (if `ANTHROPIC_API_KEY` secret is set)
3. Generate HTML/JSON reports
4. Upload artifacts (reports, coverage)
5. Comment on PR with results

**Required Secret:**
- `ANTHROPIC_API_KEY` - Anthropic API key for SDK tests

### Running in CI

To enable full test suite in CI:

1. Go to repository Settings → Secrets
2. Add `ANTHROPIC_API_KEY` secret
3. Push changes to trigger workflow

## Development Workflow

### Adding New Tests

1. Choose appropriate test file based on category
2. Add test case using Jest syntax:

```typescript
describe('New Feature Tests', () => {
  test('should validate new feature', async () => {
    // Arrange
    const client = new ClaudeTestClient();

    // Act
    const result = await client.executeCommand('/new-command');

    // Assert
    expect(result).toContain('expected output');
  });
});
```

3. Run tests to verify:

```bash
npm test -- --testNamePattern="New Feature"
```

### Debugging Tests

```bash
# Run specific test file
npm test -- 03-functional-commands.test.ts

# Run with verbose output
npm test -- --verbose

# Run in watch mode
npm test -- --watch

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Test Isolation

Each test suite:
- Creates isolated test workspace
- Cleans up after completion
- Does not affect plugin installation
- Does not modify source files

## Troubleshooting

### "ANTHROPIC_API_KEY not set"

**Issue:** SDK-based tests are skipped
**Solution:** Set the environment variable:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

### "Cannot find module '@anthropic-ai/claude-agent-sdk'"

**Issue:** Dependencies not installed
**Solution:**

```bash
cd tests
npm install
```

### Tests timeout

**Issue:** SDK tests take too long
**Solution:** Increase timeout in `jest.config.js`:

```javascript
testTimeout: 120000, // 2 minutes (default: 60s)
```

### Plugin directory permission errors

**Issue:** Cannot access `~/.claude/plugins/`
**Solution:** Ensure plugin is installed:

```bash
# Check plugin installation
ls -la ~/.claude/plugins/cache/fluxwing/
```

## Performance

**Estimated execution times:**

| Category | Duration | Type |
|----------|----------|------|
| Category 1 | ~30s | Static |
| Category 2 | ~30s | Static |
| Category 3 | ~10min | SDK |
| Category 4 | ~15min | SDK |
| Category 5 | ~1min | Static |
| Category 6 | ~10min | SDK |
| **Total** | **~37min** | Mixed |

**Optimization tips:**
- Run static tests first (fast feedback)
- Run SDK tests in parallel where possible
- Use `--testPathPattern` to run specific categories

## Contributing

When adding new features to Fluxwing:

1. Update relevant command/agent files
2. Add corresponding tests
3. Run full test suite: `npm test`
4. Generate report: `npm run test:report`
5. Ensure all tests pass before committing

## Success Criteria

All 28 tests must pass for consistency improvements to be considered complete:

- ✅ All files have "Data Location Rules" headers
- ✅ All path references use consistent variables
- ✅ All commands save to correct locations
- ✅ All agents follow correct search order
- ✅ Validation only checks project files
- ✅ Documentation is updated and consistent
- ✅ Plugin directory is never written to
- ✅ Error messages use correct paths

## Support

For issues or questions:

1. Check this README
2. Review test output and error messages
3. Examine generated HTML report
4. Open an issue in the repository

---

**Version:** 1.0.0
**Last Updated:** 2025-10-12
**Test Plan Reference:** `CONSISTENCY_TEST_PLAN.md`
