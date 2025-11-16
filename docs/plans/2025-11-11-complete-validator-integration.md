# Complete Validator Integration Plan

**Date:** 2025-11-11
**Status:** Ready for Implementation
**Branch:** `feat/determnistic-validation`

## Overview

Complete the integration of the new Node.js deterministic validation system into Fluxwing skills by fixing templates, testing workflows, and adding optional enhancements.

## Context

We've built a deterministic Node.js validator (`validators/validate-component.js`) that replaces the Python validation scripts. The validator is working correctly, but needs:
1. Template fixes (missing `fidelity` field)
2. Production testing
3. Optional screen validation support
4. Optional batch validation support

## Current State

### ✅ Completed
- Node.js validator implementation (`validators/validate-component.js`)
- Package management with locked dependencies (`package.json`, `package-lock.json`)
- Bundled `node_modules/` (2.7 MB, 6 packages)
- Test suite (`test-validator.js`)
- Documentation (`validators/README.md`)
- Updated `skills/fluxwing-component-creator/SKILL.md` to use new validator

### ❌ Issues Found
- All template components missing required `metadata.fidelity` field
- Validator correctly rejects invalid templates
- Need to add `fidelity` field to 11 template files

### 📁 File Locations
```
validators/
├── validate-component.js       # ✅ Complete
├── test-validator.js           # ✅ Complete
├── package.json                # ✅ Complete
├── package-lock.json           # ✅ Complete
├── node_modules/               # ✅ Complete (2.7 MB)
└── README.md                   # ✅ Complete

skills/fluxwing-component-creator/
├── SKILL.md                    # ✅ Updated to use new validator
├── templates/                  # ❌ Need fidelity field
│   ├── primary-button.uxm
│   ├── secondary-button.uxm
│   ├── email-input.uxm
│   ├── badge.uxm
│   ├── alert.uxm
│   ├── card.uxm
│   ├── custom-widget.uxm
│   ├── form.uxm
│   ├── list.uxm
│   ├── modal.uxm
│   └── navigation.uxm
└── schemas/
    └── uxm-component.schema.json  # ✅ Requires fidelity field
```

## Phase 1: Fix Template Components

**Goal:** Add required `fidelity` field to all template components

### Tasks

#### 1.1 Read Current Template Structure
```bash
# Check one template to understand structure
cat skills/fluxwing-component-creator/templates/primary-button.uxm | jq '.metadata'
```

#### 1.2 Add Fidelity Field to All Templates

For each of the 11 template files in `skills/fluxwing-component-creator/templates/`:

**File list:**
- `primary-button.uxm`
- `secondary-button.uxm`
- `email-input.uxm`
- `badge.uxm`
- `alert.uxm`
- `card.uxm`
- `custom-widget.uxm`
- `form.uxm`
- `list.uxm`
- `modal.uxm`
- `navigation.uxm`

**Change required:**
```json
{
  "metadata": {
    "name": "...",
    "description": "...",
    "author": "...",
    "created": "...",
    "modified": "...",
    "tags": [...],
    "category": "...",
    "fidelity": "detailed"    // ← ADD THIS LINE
  }
}
```

**Fidelity value to use:** `"detailed"`
**Rationale:** These are bundled templates, so they should be high-quality "detailed" fidelity, not "sketch"

**Implementation:**
```bash
# For each template file:
# 1. Read the file
# 2. Use Edit tool to add '"fidelity": "detailed"' after "category" line
# 3. Save and move to next file
```

#### 1.3 Verify All Templates Pass Validation

```bash
# Run test suite
cd validators
node test-validator.js

# Expected output: "Results: 5 passed, 0 failed" (or 11 passed if all tested)
```

### Acceptance Criteria
- ✅ All 11 template `.uxm` files have `metadata.fidelity` field
- ✅ All templates validate successfully
- ✅ Test suite passes (0 failures)

### Time Estimate
**30-45 minutes** (11 files × 3 minutes per file)

---

## Phase 2: Production Testing

**Goal:** Test the validator in actual component creation workflows

### Tasks

#### 2.1 Test Single Component Creation

**Test case:** Create a new component from scratch

```bash
# Trigger the component-creator skill
# User message: "Create a test-button component"

# Expected workflow:
# 1. Skill spawns designer agent
# 2. Agent creates component files
# 3. Agent validates using: node ../../validators/validate-component.js
# 4. Validation should pass
```

**Verification:**
- Component files created: `./fluxwing/components/test-button.uxm` + `.md`
- Validation runs automatically
- Validation passes (exit code 0)
- Component has `fidelity: "detailed"` or `"sketch"` (depending on mode)

#### 2.2 Test Multi-Component Creation

**Test case:** Create multiple components in parallel

```bash
# User message: "Create test-button-1, test-button-2, test-button-3"

# Expected workflow:
# 1. Skill spawns 3 designer agents in parallel
# 2. Each agent creates component files
# 3. Each agent validates
# 4. All validations should pass
```

**Verification:**
- 6 files created (3 × `.uxm` + 3 × `.md`)
- All validations pass
- Performance: ~80ms per validation

#### 2.3 Test Validation Failure Handling

**Test case:** Intentionally create invalid component to test error reporting

```bash
# Manually create invalid component
echo '{"invalid": "json without required fields"}' > ./fluxwing/components/invalid-test.uxm

# Run validation
node validators/validate-component.js \
  ./fluxwing/components/invalid-test.uxm \
  skills/fluxwing-component-creator/schemas/uxm-component.schema.json

# Expected: Clear error messages about missing required fields
```

**Verification:**
- Validator exits with code 1 (failure)
- Error messages are clear and actionable
- Shows which fields are missing

#### 2.4 Test JSON Output Mode

**Test case:** Verify JSON output for programmatic use

```bash
node validators/validate-component.js \
  ./fluxwing/components/test-button.uxm \
  skills/fluxwing-component-creator/schemas/uxm-component.schema.json \
  --json

# Expected: Valid JSON output with structure:
# {
#   "valid": true|false,
#   "errors": [...],
#   "warnings": [...],
#   "stats": {...}
# }
```

**Verification:**
- Output is valid JSON (can be parsed by `jq`)
- Contains expected fields (valid, errors, warnings, stats)
- Can be consumed by other tools

### Acceptance Criteria
- ✅ Single component creation works end-to-end
- ✅ Multi-component creation works in parallel
- ✅ Invalid components are caught and reported clearly
- ✅ JSON output mode works for programmatic use
- ✅ Validation runs in ~80ms per component

### Time Estimate
**45-60 minutes** (15 minutes per test case)

---

## Phase 3: Add Screen Validator (Optional)

**Goal:** Create `validate-screen.js` for screen validation

### Background

Screens differ from components:
- Type is typically "container"
- Have additional `.rendered.md` file
- May compose multiple components
- Different validation rules

### Tasks

#### 3.1 Create Screen Schema (if needed)

Check if screen schema exists:
```bash
ls skills/fluxwing-screen-scaffolder/schemas/
```

If no screen-specific schema exists, screens likely use same `uxm-component.schema.json`.

#### 3.2 Implement validate-screen.js

Create `validators/validate-screen.js` based on `validate-component.js`:

**Key differences:**
- Check for `.rendered.md` file (in addition to `.md`)
- Validate that composed components exist
- Check screen-specific patterns

**Structure:**
```javascript
#!/usr/bin/env node
const { validateComponent } = require('./validate-component.js');

function validateScreen(uxmFile, schemaFile) {
  // 1. Run standard component validation
  const result = validateComponent(uxmFile, schemaFile);

  // 2. Screen-specific checks
  checkRenderedFile(uxmFile, result);
  checkComposedComponents(uxmFile, result);

  // 3. Return results
  return result;
}

function checkRenderedFile(uxmFile, result) {
  const renderedFile = uxmFile.replace('.uxm', '.rendered.md');
  if (!fs.existsSync(renderedFile)) {
    result.warnings.push({
      path: ['screen'],
      message: `Rendered example file recommended: ${renderedFile}`,
      type: 'missing_rendered'
    });
  }
}

function checkComposedComponents(uxmFile, result) {
  // Check if components referenced in screen exist
  const screen = JSON.parse(fs.readFileSync(uxmFile));
  const composedComponents = extractComponentReferences(screen);

  for (const componentId of composedComponents) {
    const componentPath = `./fluxwing/components/${componentId}.uxm`;
    if (!fs.existsSync(componentPath)) {
      result.warnings.push({
        path: ['composed'],
        message: `Referenced component not found: ${componentId}`,
        type: 'missing_component'
      });
    }
  }
}
```

#### 3.3 Update package.json

Add screen validator to package.json:
```json
{
  "scripts": {
    "test": "node test-validator.js",
    "test:screens": "node test-screen-validator.js"
  }
}
```

#### 3.4 Create Test Suite for Screens

Create `validators/test-screen-validator.js`:
```javascript
const { validateScreen } = require('./validate-screen.js');

// Test against bundled screen templates
const testScreens = [
  '../skills/fluxwing-screen-scaffolder/templates/login-screen.uxm',
  '../skills/fluxwing-screen-scaffolder/templates/dashboard.uxm'
];

// Run tests...
```

#### 3.5 Update Screen Scaffolder Skill

Update `skills/fluxwing-screen-scaffolder/SKILL.md` to use screen validator:
```bash
node {SKILL_ROOT}/../../validators/validate-screen.js \
  ./fluxwing/screens/${screenId}.uxm \
  {SKILL_ROOT}/schemas/uxm-component.schema.json
```

### Acceptance Criteria
- ✅ `validate-screen.js` created and working
- ✅ Screen-specific checks implemented (rendered file, composed components)
- ✅ Test suite passes for screen templates
- ✅ Screen scaffolder skill updated to use new validator

### Time Estimate
**60-90 minutes**

---

## Phase 4: Add Batch Validation (Optional)

**Goal:** Validate multiple files in one command

### Tasks

#### 4.1 Implement Batch Validation

Create `validators/validate-batch.js`:

```javascript
#!/usr/bin/env node

const { validateComponent } = require('./validate-component.js');
const glob = require('glob'); // Would need to add to dependencies

function validateBatch(pattern, schemaFile) {
  const files = glob.sync(pattern);
  const results = {
    total: files.length,
    passed: 0,
    failed: 0,
    files: []
  };

  for (const file of files) {
    const result = validateComponent(file, schemaFile);
    results.files.push({
      file,
      valid: result.valid,
      errors: result.errors.length,
      warnings: result.warnings.length
    });

    if (result.valid) {
      results.passed++;
    } else {
      results.failed++;
    }
  }

  return results;
}

// Usage: node validate-batch.js "./fluxwing/components/*.uxm" schema.json
```

#### 4.2 Add Glob Dependency

Update `package.json`:
```json
{
  "dependencies": {
    "ajv": "^8.12.0",
    "ajv-formats": "^2.1.1",
    "glob": "^10.3.10"
  }
}
```

Then:
```bash
cd validators
npm install
```

#### 4.3 Create Convenience Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "validate:components": "node validate-batch.js './fluxwing/components/*.uxm' '../skills/fluxwing-component-creator/schemas/uxm-component.schema.json'",
    "validate:screens": "node validate-batch.js './fluxwing/screens/*.uxm' '../skills/fluxwing-screen-scaffolder/schemas/uxm-component.schema.json'",
    "validate:all": "npm run validate:components && npm run validate:screens"
  }
}
```

#### 4.4 Test Batch Validation

```bash
# Validate all components
npm run validate:components

# Expected output:
# Total: 15 files
# Passed: 15
# Failed: 0
```

### Acceptance Criteria
- ✅ `validate-batch.js` implemented
- ✅ Glob dependency added and working
- ✅ Convenience scripts work
- ✅ Can validate all components in one command
- ✅ Performance: <5 seconds for 50 files

### Time Estimate
**30-45 minutes**

---

## Implementation Order

### Recommended Sequence

1. **Phase 1 (Required)** - Fix templates first
   - Without this, nothing else will work
   - Straightforward, just add one field per file
   - Should be done immediately

2. **Phase 2 (Required)** - Production testing
   - Validates that Phase 1 worked
   - Ensures validator works in real workflows
   - Catches any integration issues

3. **Phase 3 (Optional)** - Screen validator
   - Only if screens need different validation logic
   - Can be skipped if component validator works for screens
   - Low priority initially

4. **Phase 4 (Optional)** - Batch validation
   - Nice-to-have for CI/CD
   - Not critical for normal workflows
   - Can be added later if needed

### Time Estimates

| Phase | Time | Priority |
|-------|------|----------|
| Phase 1: Fix Templates | 30-45 min | **REQUIRED** |
| Phase 2: Production Testing | 45-60 min | **REQUIRED** |
| Phase 3: Screen Validator | 60-90 min | Optional |
| Phase 4: Batch Validation | 30-45 min | Optional |
| **Total (Required)** | **75-105 min** | |
| **Total (All)** | **165-240 min** | |

## Verification Checklist

After completing each phase, verify:

### Phase 1 Verification
```bash
# All templates should pass validation
cd validators
node test-validator.js
# Expected: "Results: 11 passed, 0 failed"
```

### Phase 2 Verification
```bash
# Component creation should work end-to-end
# Test manually by creating a component through the skill
# Validation should run automatically and pass
```

### Phase 3 Verification (if implemented)
```bash
# Screen validation should work
cd validators
node test-screen-validator.js
# Expected: "Results: 2 passed, 0 failed"
```

### Phase 4 Verification (if implemented)
```bash
# Batch validation should work
cd validators
npm run validate:all
# Expected: All files pass
```

## Rollback Plan

If issues arise:

### Rollback Phase 1
```bash
# Revert template changes
git checkout HEAD -- skills/fluxwing-component-creator/templates/
```

### Rollback Phase 2
No files changed, just testing. Nothing to rollback.

### Rollback Phase 3
```bash
# Remove screen validator
rm validators/validate-screen.js
rm validators/test-screen-validator.js
git checkout HEAD -- skills/fluxwing-screen-scaffolder/SKILL.md
```

### Rollback Phase 4
```bash
# Remove batch validator
rm validators/validate-batch.js
git checkout HEAD -- validators/package.json validators/package-lock.json
```

## Success Criteria

**Minimum success (Required phases only):**
- ✅ All 11 template components validate successfully
- ✅ Single component creation workflow works end-to-end
- ✅ Multi-component creation workflow works in parallel
- ✅ Validation errors are clear and actionable
- ✅ Validator runs in ~80ms per component

**Full success (All phases):**
- ✅ All minimum criteria met
- ✅ Screen validation works independently
- ✅ Batch validation supports CI/CD workflows
- ✅ All tests pass
- ✅ Documentation is complete

## Next Actions After This Plan

Once all phases are complete:

1. **Commit changes:**
   ```bash
   git add validators/ skills/
   git commit -m "feat: complete deterministic validator integration

   - Fix all template components (add fidelity field)
   - Test component creation workflows
   - Add screen validation support
   - Add batch validation support

   All validators now use Node.js with bundled dependencies"
   ```

2. **Merge to main:**
   ```bash
   # Create PR or merge branch
   git push origin feat/determnistic-validation
   ```

3. **Update documentation:**
   - Update CLAUDE.md with validator usage
   - Update skill documentation
   - Add troubleshooting guide

4. **Optional: Remove Python validators:**
   ```bash
   # Clean up old Python scripts
   rm -rf skills/fluxwing-component-creator/scripts/validate_component.py
   rm -rf skills/fluxwing-component-creator/scripts/quick_validate.py
   ```

## Notes

- Node.js is required for validators to work (document this requirement)
- Validator performs well (~80ms) for single files
- Batch validation useful for CI/CD but not critical for MVP
- Screen validator may not be needed if component validator works for screens
- Consider adding validator to pre-commit hooks later

## Questions to Answer During Implementation

1. Do screens need different validation than components?
2. Should we validate `.md` file content (ASCII art quality)?
3. Should we add more uxscii-specific rules (naming patterns, etc.)?
4. Should validation be mandatory or optional in skills?
5. Do we need validator for `.library/` components too?

---

**Plan Status:** Ready for implementation
**Branch:** `feat/determnistic-validation`
**Next Step:** Start with Phase 1 (Fix Templates)
