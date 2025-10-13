# Quick Start Guide

Get up and running with Fluxwing consistency tests in 5 minutes.

## 1. Install Dependencies

```bash
cd tests
pnpm install
```

## 2. Set API Key (Optional for SDK tests)

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

Skip this step to run only static tests (Categories 1, 2, 5).

## 3. Run Tests

### Option A: Use the Shell Script (Recommended)

```bash
./run-tests.sh
```

### Option B: Use pnpm directly

```bash
pnpm test
```

## 4. View Results

### Console Output
Results are displayed immediately in your terminal.

### HTML Report
```bash
pnpm run test:report
open reports/test-results.html
```

## Common Commands

```bash
# Run only static tests (no API key needed)
./run-tests.sh --category static

# Run only SDK tests (API key required)
./run-tests.sh --category sdk

# Run specific category
./run-tests.sh --category commands

# Generate reports
./run-tests.sh --report

# Run with coverage
./run-tests.sh --coverage
```

## Test Categories

| Category | Type | Duration | API Key? |
|----------|------|----------|----------|
| 1. Command Consistency | Static | 30s | ❌ |
| 2. Agent Consistency | Static | 30s | ❌ |
| 3. Functional Commands | SDK | 10min | ✅ |
| 4. Functional Agents | SDK | 15min | ✅ |
| 5. Documentation | Static | 1min | ❌ |
| 6. Integration | SDK | 10min | ✅ |

## Troubleshooting

### No API Key?
Run static tests only:
```bash
./run-tests.sh --category static
```

### Dependencies Not Installed?
```bash
cd tests
pnpm install
```

### Need Help?
```bash
./run-tests.sh --help
```

Or read the full [README.md](./README.md)

## CI/CD

The test suite automatically runs on:
- Push to `main` (when `fluxwing/` or `tests/` changes)
- Pull requests to `main`
- Manual workflow dispatch

View results in GitHub Actions tab.

---

**Ready to test?** Run `./run-tests.sh` now!
