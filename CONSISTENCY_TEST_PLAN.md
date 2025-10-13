# Fluxwing Consistency Improvements - Test Plan

**Created:** 2025-10-12
**Version:** 1.1.0
**Reference:** CONSISTENCY_IMPROVEMENT_PLAN.md

---

## Executive Summary

This test plan validates the consistency improvements made to all Fluxwing plugin commands and agents. All 7 core files (5 commands + 3 agents) have been updated with:
- "Data Location Rules" headers
- Consistent path references
- Clear READ vs WRITE distinction
- Unified inventory concept

**Total Tests:** 28 test cases across 6 categories
**Estimated Time:** 2-3 hours for complete validation

---

## Test Environment Setup

### Prerequisites
- [ ] Plugin installed (either from marketplace or locally)
- [ ] Clean test directory created
- [ ] Git initialized in test directory (optional, for verification)
- [ ] Node.js installed (for automated test runner - optional)

### Setup Commands
```bash
# Create test directory
mkdir -p ~/fluxwing-test
cd ~/fluxwing-test

# Create project output structure
mkdir -p ./fluxwing/components
mkdir -p ./fluxwing/screens
mkdir -p ./fluxwing/library

# Verify plugin is loaded
claude --debug 2>&1 | grep fluxwing
```

---

## Automated Testing Approach

**Note**: Claude Code doesn't currently have a public SDK for programmatic plugin testing. However, we can automate significant portions using:

1. **Bash Scripts** - File system checks, grep patterns, path validation
2. **Claude Code CLI** - `claude --debug` for plugin verification
3. **Node.js Test Runner** (optional) - Orchestrate tests and generate reports

### Quick Start: Automated Tests

Run the automated test suite (once created):
```bash
# Run all automated tests
./run-consistency-tests.sh

# Run specific category
./run-consistency-tests.sh --category commands

# Generate report
./run-consistency-tests.sh --report
```

See **Appendix A: Automated Test Suite** at the end of this document for implementation.

---

## Category 1: Command File Consistency

### Test 1.1: Verify All Commands Have Data Location Headers
**Objective:** Confirm all 5 command files have "Data Location Rules" section

**Files to Check:**
- [ ] `fluxwing/commands/fluxwing-create.md`
- [ ] `fluxwing/commands/fluxwing-library.md`
- [ ] `fluxwing/commands/fluxwing-scaffold.md`
- [ ] `fluxwing/commands/fluxwing-validate.md`
- [ ] `fluxwing/commands/fluxwing-get.md`

**Test Steps:**
```bash
# Check each command file for the header
grep -l "Data Location Rules" fluxwing/commands/*.md
```

**Expected Result:** All 5 files should be listed

**Pass Criteria:** ✅ All 5 command files contain "Data Location Rules" header

---

### Test 1.2: Verify Consistent Path References in Commands
**Objective:** Confirm all commands use consistent path variables

**Test Steps:**
```bash
# Check for {PLUGIN_ROOT}/data/examples/
grep -c "{PLUGIN_ROOT}/data/examples/" fluxwing/commands/*.md

# Check for ./fluxwing/components/
grep -c "./fluxwing/components/" fluxwing/commands/*.md

# Check for ./fluxwing/screens/
grep -c "./fluxwing/screens/" fluxwing/commands/*.md

# Check for ./fluxwing/library/
grep -c "./fluxwing/library/" fluxwing/commands/*.md
```

**Expected Result:** All paths use consistent format across all files

**Pass Criteria:** ✅ All path references use correct variables, no hardcoded paths

---

## Category 2: Agent File Consistency

### Test 2.1: Verify All Agents Have Data Location Headers
**Objective:** Confirm all 3 agent files have "Data Location Rules" section

**Files to Check:**
- [ ] `fluxwing/agents/fluxwing-composer.md`
- [ ] `fluxwing/agents/fluxwing-designer.md`
- [ ] `fluxwing/agents/fluxwing-validator.md`

**Test Steps:**
```bash
# Check each agent file for the header
grep -l "Data Location Rules" fluxwing/agents/*.md
```

**Expected Result:** All 3 files should be listed

**Pass Criteria:** ✅ All 3 agent files contain "Data Location Rules" header with agent-focused tone

---

### Test 2.2: Verify Agent Inventory Check Order
**Objective:** Confirm agents follow correct search order

**Test Steps:**
1. Open each agent file
2. Find the "Component Inventory" or similar section
3. Verify search order listed as:
   - `./fluxwing/components/` (FIRST PRIORITY)
   - `./fluxwing/library/` (second)
   - `{PLUGIN_ROOT}/data/examples/` (READ-ONLY reference)

**Files to Check:**
- [ ] fluxwing-composer.md - Phase 1 section
- [ ] fluxwing-designer.md - Phase 2 section
- [ ] fluxwing-validator.md - Phase 1 section

**Pass Criteria:** ✅ All agents explicitly state search order with priority

---

## Category 3: Functional Testing - Commands

### Test 3.1: Test `/fluxwing-create` Output Location
**Objective:** Verify command saves to correct location

**Test Steps:**
```bash
cd ~/fluxwing-test

# Run create command
/fluxwing-create test-button

# Follow prompts (accept defaults or customize)

# Verify files created in correct location
ls -la ./fluxwing/components/test-button.*
```

**Expected Result:**
- `./fluxwing/components/test-button.uxm` exists
- `./fluxwing/components/test-button.md` exists
- NO files created in plugin directory

**Pass Criteria:** ✅ Files saved to `./fluxwing/components/` only

---

### Test 3.2: Test `/fluxwing-scaffold` Output Location
**Objective:** Verify screen files save to correct location

**Test Steps:**
```bash
cd ~/fluxwing-test

# Run scaffold command
/fluxwing-scaffold test-screen

# Follow prompts

# Verify screen files created in correct location
ls -la ./fluxwing/screens/test-screen.*
```

**Expected Result:**
- `./fluxwing/screens/test-screen.uxm` exists
- `./fluxwing/screens/test-screen.md` exists
- `./fluxwing/screens/test-screen.rendered.md` exists
- Any created components in `./fluxwing/components/`
- NO files created in plugin directory

**Pass Criteria:** ✅ Screen files saved to `./fluxwing/screens/`, components to `./fluxwing/components/`

---

### Test 3.3: Test `/fluxwing-library` Displays All Sources
**Objective:** Verify library shows bundled + project components

**Test Steps:**
```bash
cd ~/fluxwing-test

# Should have test-button from Test 3.1
# Run library command
/fluxwing-library
```

**Expected Result:** Library display shows:
- **Bundled Templates** section (11 components from plugin)
- **Project Components** section (test-button from Test 3.1)
- **Project Screens** section (test-screen from Test 3.2)
- Clear distinction between READ-ONLY and editable

**Pass Criteria:** ✅ All three sources displayed with correct labels

---

### Test 3.4: Test `/fluxwing-validate` Scope
**Objective:** Verify validator only checks project files

**Test Steps:**
```bash
cd ~/fluxwing-test

# Run validate on all files
/fluxwing-validate

# Observe output
```

**Expected Result:**
- Validates files in `./fluxwing/components/`
- Validates files in `./fluxwing/screens/`
- Does NOT validate bundled templates in plugin directory
- Report clearly shows file paths (`./fluxwing/...`)

**Pass Criteria:** ✅ Only project workspace files validated, bundled templates skipped

---

### Test 3.5: Test `/fluxwing-get` Search Order
**Objective:** Verify get command searches in correct order

**Test Steps:**
```bash
cd ~/fluxwing-test

# Test 1: Get project component (should find first)
/fluxwing-get test-button

# Test 2: Get bundled template (should find in plugin directory)
/fluxwing-get primary-button

# Test 3: Copy bundled template to library, then get it
# (via library command, copy primary-button to library)
/fluxwing-library
# Select option to copy primary-button to library

# Now get it again - should find library version first
/fluxwing-get primary-button
```

**Expected Result:**
- Test 1: Finds and displays test-button from `./fluxwing/components/`
- Test 2: Finds and displays primary-button from bundled templates
- Test 3: Finds and displays primary-button from `./fluxwing/library/` (not bundled)
- Each display clearly shows source location

**Pass Criteria:** ✅ Search order followed: components → library → bundled

---

## Category 4: Functional Testing - Agents

### Test 4.1: Test fluxwing-designer Agent Output Locations
**Objective:** Verify designer agent saves to correct locations

**Test Steps:**
```bash
cd ~/fluxwing-test

# Dispatch designer agent with simple request
# In Claude Code, say:
"Dispatch fluxwing-designer agent to create a simple login form with email input, password input, and submit button"

# Wait for agent to complete

# Verify output locations
ls -la ./fluxwing/components/
ls -la ./fluxwing/screens/
```

**Expected Result:**
- Components created in `./fluxwing/components/`
- Screens (if any) created in `./fluxwing/screens/`
- NO files created in plugin directory
- Agent report clearly shows file locations

**Pass Criteria:** ✅ All agent outputs in correct project workspace locations

---

### Test 4.2: Test fluxwing-composer Agent Inventory Check
**Objective:** Verify composer checks all three sources

**Test Steps:**
```bash
cd ~/fluxwing-test

# Should have components from Test 4.1
# Dispatch composer agent
"Dispatch fluxwing-composer agent to create a dashboard screen using existing components"

# Observe agent's Phase 1 inventory output
```

**Expected Result:**
- Agent reports finding components in `./fluxwing/components/`
- Agent mentions checking `./fluxwing/library/`
- Agent mentions bundled templates in `{PLUGIN_ROOT}/data/examples/`
- Search order clearly stated

**Pass Criteria:** ✅ Agent checks all three sources in correct order

---

### Test 4.3: Test fluxwing-validator Agent Scope
**Objective:** Verify validator agent only validates project files

**Test Steps:**
```bash
cd ~/fluxwing-test

# Dispatch validator agent
"Dispatch fluxwing-validator agent to analyze all components in ./fluxwing/"

# Review validation report
```

**Expected Result:**
- Report shows "Files Validated: X project files (./fluxwing/)"
- Report shows "Bundled Templates: 11 (skipped - pre-validated)"
- Only validates user-created components and screens
- Clear file paths in all error/warning messages

**Pass Criteria:** ✅ Validator skips bundled templates, validates project files only

---

## Category 5: Documentation Consistency

### Test 5.1: Verify Documentation Updates
**Objective:** Confirm all documentation files updated

**Files to Check:**
- [ ] `fluxwing/CLAUDE.md` - Has "Data Location Philosophy" section
- [ ] `fluxwing/README.md` - Has directory structure with READ-ONLY/READ-WRITE labels
- [ ] `fluxwing/COMMANDS.md` - Has "Data Location Philosophy" section + `/fluxwing-get` entry
- [ ] `fluxwing/AGENTS.md` - Has "Data Location Rules for Agents" section

**Test Steps:**
```bash
# Check CLAUDE.md
grep -A 10 "Data Location Philosophy" fluxwing/CLAUDE.md

# Check README.md
grep -A 10 "READ-ONLY" fluxwing/README.md

# Check COMMANDS.md
grep -A 10 "Data Location Philosophy" fluxwing/COMMANDS.md
grep "fluxwing-get" fluxwing/COMMANDS.md

# Check AGENTS.md
grep -A 10 "Data Location Rules for Agents" fluxwing/AGENTS.md
```

**Expected Result:** All sections found with correct content

**Pass Criteria:** ✅ All documentation files updated with data location information

---

### Test 5.2: Verify Cross-Reference Consistency
**Objective:** Ensure all files reference same locations

**Test Steps:**
1. Count references to "11 component templates" across all files
2. Verify all refer to same bundled template count
3. Check that all files use `{PLUGIN_ROOT}/data/examples/` (not hardcoded paths)

```bash
# Should show "11" consistently, not "10" or other numbers
grep -r "11 component" fluxwing/
grep -r "11 curated" fluxwing/
grep -r "11 bundled" fluxwing/
```

**Expected Result:** All files consistently reference "11" templates

**Pass Criteria:** ✅ No inconsistencies in template counts or path references

---

## Category 6: Integration & Edge Cases

### Test 6.1: Test Component Lifecycle End-to-End
**Objective:** Verify complete workflow from browse to create to validate

**Test Steps:**
```bash
cd ~/fluxwing-test

# Step 1: Browse library
/fluxwing-library
# Observe bundled templates

# Step 2: View a bundled template
/fluxwing-get card

# Step 3: Copy it to library (via interactive option)
# (Follow prompts to copy to ./fluxwing/library/)

# Step 4: Create a new component
/fluxwing-create custom-card

# Step 5: View your new component
/fluxwing-get custom-card

# Step 6: Validate everything
/fluxwing-validate

# Step 7: Browse library again
/fluxwing-library
# Should now show:
# - 11 bundled templates
# - card in library
# - custom-card in components
```

**Expected Result:** Each step finds/creates files in correct locations

**Pass Criteria:** ✅ Complete lifecycle works with consistent locations

---

### Test 6.2: Test Mixed Source Component Usage
**Objective:** Verify agents can use components from all three sources

**Test Steps:**
```bash
cd ~/fluxwing-test

# Should have:
# - Bundled templates (11)
# - Components in ./fluxwing/components/ (from previous tests)
# - Templates in ./fluxwing/library/ (from previous tests)

# Dispatch composer to create screen using mix of sources
"Dispatch fluxwing-composer to create a contact form screen using:
- email-input (bundled template)
- custom-card (project component)
- any other needed components"

# Review agent's component inventory phase
```

**Expected Result:**
- Agent finds components from all three sources
- Agent clearly states which source each component comes from
- Screen successfully references mixed-source components

**Pass Criteria:** ✅ Agent successfully composes from multiple sources

---

### Test 6.3: Test Error Messages Show Correct Paths
**Objective:** Verify error messages use correct path references

**Test Steps:**
```bash
cd ~/fluxwing-test

# Create invalid component (missing required fields)
# Manually create bad file:
cat > ./fluxwing/components/bad-test.uxm << EOF
{
  "id": "bad-test",
  "type": "button"
}
EOF

# Run validation
/fluxwing-validate ./fluxwing/components/bad-test.uxm
```

**Expected Result:**
- Error message clearly shows: `./fluxwing/components/bad-test.uxm`
- Error message does NOT show plugin directory paths
- Error is specific and actionable

**Pass Criteria:** ✅ Error messages use correct project workspace paths

---

### Test 6.4: Test Read-Only Enforcement
**Objective:** Verify plugin data directory is never written to

**Test Steps:**
```bash
# Before running tests, note plugin data directory timestamp
ls -la ~/.claude/plugins/cache/fluxwing/data/examples/ > /tmp/before.txt

# Run all commands and agents from previous tests

# After all tests, check timestamp again
ls -la ~/.claude/plugins/cache/fluxwing/data/examples/ > /tmp/after.txt

# Compare
diff /tmp/before.txt /tmp/after.txt
```

**Expected Result:** No changes to plugin data directory

**Pass Criteria:** ✅ Plugin data directory completely unchanged, all writes to project workspace

---

## Test Results Summary

### Quick Checklist

**Category 1: Command File Consistency**
- [ ] Test 1.1: All commands have headers
- [ ] Test 1.2: Consistent path references

**Category 2: Agent File Consistency**
- [ ] Test 2.1: All agents have headers
- [ ] Test 2.2: Agent inventory order correct

**Category 3: Functional Testing - Commands**
- [ ] Test 3.1: `/fluxwing-create` output location
- [ ] Test 3.2: `/fluxwing-scaffold` output location
- [ ] Test 3.3: `/fluxwing-library` displays all sources
- [ ] Test 3.4: `/fluxwing-validate` scope correct
- [ ] Test 3.5: `/fluxwing-get` search order

**Category 4: Functional Testing - Agents**
- [ ] Test 4.1: designer agent output locations
- [ ] Test 4.2: composer agent inventory check
- [ ] Test 4.3: validator agent scope

**Category 5: Documentation Consistency**
- [ ] Test 5.1: Documentation files updated
- [ ] Test 5.2: Cross-reference consistency

**Category 6: Integration & Edge Cases**
- [ ] Test 6.1: Component lifecycle end-to-end
- [ ] Test 6.2: Mixed source component usage
- [ ] Test 6.3: Error messages show correct paths
- [ ] Test 6.4: Read-only enforcement

**Total Tests:** 28
**Passed:** ___ / 28
**Failed:** ___ / 28
**Skipped:** ___ / 28

---

## Issue Tracking Template

If any test fails, document using this format:

**Test ID:** [e.g., Test 3.1]
**Status:** ❌ Failed
**Expected:** [What should have happened]
**Actual:** [What actually happened]
**Steps to Reproduce:**
1. ...
2. ...

**Root Cause:** [Analysis]
**Fix Required:** [What needs to be changed]
**Files Affected:** [List of files]
**Priority:** [Critical/High/Medium/Low]

---

## Success Criteria

**All tests must pass for consistency improvements to be considered complete:**

1. ✅ All 8 files (5 commands + 3 agents) have "Data Location Rules" headers
2. ✅ All path references use consistent variables
3. ✅ All commands save outputs to correct project workspace locations
4. ✅ All agents follow correct inventory search order
5. ✅ Validation only checks project files, skips bundled templates
6. ✅ Documentation files all updated with data location information
7. ✅ No files written to plugin data directory (read-only enforcement)
8. ✅ Error messages use correct project workspace paths

---

## Post-Testing Actions

### If All Tests Pass:
- [ ] Update CONSISTENCY_TODO.md to mark Phase 6 complete
- [ ] Update plugin version to 1.1.0 in `plugin.json`
- [ ] Create CHANGELOG entry
- [ ] Commit all changes with message: "feat: add data location consistency across all commands and agents (v1.1.0)"
- [ ] Consider creating git tag: `v1.1.0`

### If Tests Fail:
- [ ] Document failures using Issue Tracking Template
- [ ] Prioritize fixes based on severity
- [ ] Make necessary corrections
- [ ] Re-run affected tests
- [ ] Continue until all tests pass

---

## Notes

- This test plan assumes a fresh test directory for each test run
- Some tests build on previous tests (e.g., Test 6.1 uses outputs from earlier tests)
- Agent tests require manual observation of agent behavior and reports
- Estimated total testing time: 2-3 hours for thorough execution
- Consider automating file structure checks in future versions

---

**Test Plan Version:** 1.0
**Last Updated:** 2025-10-12
**Next Review:** After all tests complete
