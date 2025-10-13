# Fluxwing Consistency Improvement - Implementation Tracking

**Created:** 2025-10-12
**Reference:** See `CONSISTENCY_IMPROVEMENT_PLAN.md` for full details
**Total Tasks:** 34 tasks across 6 phases

---

## Quick Progress Summary

- [x] **Phase 1:** Create Missing Command (1 task) ✅ **COMPLETE**
- [ ] **Phase 2:** Update Agent System Prompts (3 tasks)
- [ ] **Phase 3:** Update Command Files (4 tasks)
- [ ] **Phase 4:** Add Data Location Headers (3 tasks)
- [ ] **Phase 5:** Documentation Updates (4 tasks)
- [ ] **Phase 6:** Testing & Validation (4 tasks)

**Progress:** 1/34 tasks completed (3%)

---

## Phase 1: Create Missing Command 🔴 HIGH PRIORITY

### 1.1 Create `/fluxwing-get` Command ✅ **COMPLETE**
**File:** `fluxwing/commands/fluxwing-get.md`
**Status:** ✅ Complete (2025-10-12)
**Priority:** 🔴 High
**Estimated Time:** 30 minutes
**Actual Time:** 25 minutes

**Requirements:**
- [x] Create new markdown file with frontmatter
- [x] Add `description` field: "View details of a single uxscii component"
- [x] Add `argument-hint` field: "[component-name]"
- [x] Implement search order logic:
  1. `./fluxwing/components/[name].uxm`
  2. `./fluxwing/library/[name].uxm`
  3. `{PLUGIN_ROOT}/data/examples/[name].uxm`
- [x] Display component metadata from .uxm file
- [x] Display ASCII template from .md file
- [x] Show file location and modification date
- [x] Offer interactive options:
  - Copy to project (if bundled template)
  - Edit component (if project file)
  - Validate component
  - View related components
- [x] Handle component not found gracefully
- [x] Add "Data Location Rules" header
- [x] Include usage examples in command documentation

**Acceptance Criteria:**
- ✅ Command finds components from all three locations
- ✅ Clear indication of which location component came from
- ✅ Helpful error message if component not found (fuzzy matching)
- ✅ Interactive options work correctly (context-aware)

**Dependencies:** None

**Notes:**
- ✅ Modeled after the detail view in fluxwing-library.md (lines 146-199)
- ✅ Consistent formatting with existing commands
- ✅ 420 lines with comprehensive coverage
- ✅ Includes 4 detailed example interactions
- ✅ Special cases: screens vs components, duplicate names, missing files
- ✅ All design decisions implemented (first match, concise display, truncation, no auto-delete)

---

## Phase 2: Update Agent System Prompts 🔴 HIGH PRIORITY

### 2.1 Update `fluxwing-composer.md`
**File:** `fluxwing/agents/fluxwing-composer.md`
**Status:** ⬜ Not Started
**Priority:** 🔴 High
**Estimated Time:** 20 minutes

**Requirements:**
- [ ] Add "Data Location Rules" section after frontmatter
- [ ] Update Phase 1 inventory section (lines 28-45) to clarify search order
- [ ] Emphasize writing ONLY to `./fluxwing/screens/`
- [ ] Update resource references (line 371-375) to use consistent paths
- [ ] Add warning: "NEVER write to {PLUGIN_ROOT}/data/"
- [ ] Verify all path references use correct variables

**Changes:**
- Insert new section after line 23
- Update lines 32-42 (component inventory)
- Update lines 371-375 (resources)

**Testing:**
- Verify agent can find components from all locations
- Verify agent only writes to ./fluxwing/screens/

---

### 2.2 Update `fluxwing-designer.md`
**File:** `fluxwing/agents/fluxwing-designer.md`
**Status:** ⬜ Not Started
**Priority:** 🔴 High
**Estimated Time:** 20 minutes

**Requirements:**
- [ ] Add "Data Location Rules" section after frontmatter
- [ ] Update Phase 2 inventory section (lines 32-44) to clarify search order
- [ ] Emphasize components go to `./fluxwing/components/`
- [ ] Emphasize screens go to `./fluxwing/screens/`
- [ ] Update resource references (lines 152-173) to use consistent paths
- [ ] Add warning: "NEVER write to {PLUGIN_ROOT}/data/"
- [ ] Verify all path references use correct variables

**Changes:**
- Insert new section after line 21
- Update lines 36-44 (component inventory)
- Update lines 56-78 (systematic creation phase)
- Update lines 152-173 (resources)

**Testing:**
- Verify agent saves components to correct location
- Verify agent saves screens to correct location
- Verify agent reads templates from bundled examples

---

### 2.3 Update `fluxwing-validator.md`
**File:** `fluxwing/agents/fluxwing-validator.md`
**Status:** ⬜ Not Started
**Priority:** 🟡 Medium
**Estimated Time:** 15 minutes

**Requirements:**
- [ ] Add "Data Location Rules" section after frontmatter
- [ ] Clarify validator checks files in all three project locations
- [ ] Add note: "Bundled templates are pre-validated, focus on user files"
- [ ] Update resource references to use consistent paths
- [ ] Add warning: "NEVER write to {PLUGIN_ROOT}/data/"
- [ ] Ensure validation reports show file locations clearly

**Changes:**
- Insert new section after frontmatter
- Update validation scope section
- Update resource references

**Testing:**
- Verify validator finds files in all project locations
- Verify validator skips bundled templates appropriately
- Verify validation reports are clear about file locations

---

## Phase 3: Update Command Files 🟡 MEDIUM PRIORITY

### 3.1 Update `fluxwing-create.md`
**File:** `fluxwing/commands/fluxwing-create.md`
**Status:** ⬜ Not Started
**Priority:** 🟡 Medium
**Estimated Time:** 15 minutes

**Requirements:**
- [ ] Add "Data Location Rules" section after frontmatter (after line 11)
- [ ] Strengthen line 52: "Save files to: `./fluxwing/components/`"
- [ ] Update line 28-29 to explicitly mention bundled templates are in `{PLUGIN_ROOT}/data/examples/`
- [ ] Update resource section (lines 63-70) with consistent paths
- [ ] Add note about option to copy bundled template first
- [ ] Verify example interaction uses correct paths (line 89)

**Changes:**
- Insert new section after line 11
- Update lines 28-29, 52, 63-70, 89

**Testing:**
- Verify command saves to ./fluxwing/components/
- Verify command can reference bundled templates
- Verify paths in examples are correct

---

### 3.2 Update `fluxwing-library.md`
**File:** `fluxwing/commands/fluxwing-library.md`
**Status:** ⬜ Not Started
**Priority:** 🔴 High
**Estimated Time:** 25 minutes

**Requirements:**
- [ ] Add "Data Location Rules" section after frontmatter
- [ ] Strengthen "three sources" explanation (lines 11-14)
- [ ] Update interactive options (lines 133-144) to include:
  - `1️⃣ View component details (/fluxwing-get [name])`
- [ ] Emphasize bundled templates are read-only (line 271)
- [ ] Update resource section (lines 263-267) with consistent paths
- [ ] Add visual indicator for read-only vs editable in display format

**Changes:**
- Insert new section after line 3
- Update lines 11-14 (three sources)
- Update lines 133-144 (interactive options)
- Update line 271 (important notes)
- Update lines 263-267 (resources)

**Testing:**
- Verify all three sources are shown
- Verify new /fluxwing-get option appears
- Verify clear distinction between read-only and editable

---

### 3.3 Update `fluxwing-scaffold.md`
**File:** `fluxwing/commands/fluxwing-scaffold.md`
**Status:** ⬜ Not Started
**Priority:** 🟡 Medium
**Estimated Time:** 20 minutes

**Requirements:**
- [ ] Add "Data Location Rules" section after frontmatter
- [ ] Clarify screens save to `./fluxwing/screens/`
- [ ] Update component inventory section to check all three sources
- [ ] Update resource references with consistent paths
- [ ] Add note about copying templates before customizing
- [ ] Verify example outputs use correct paths

**Changes:**
- Insert new section after frontmatter
- Update save location references
- Update component inventory instructions
- Update resource section

**Testing:**
- Verify scaffold saves to ./fluxwing/screens/
- Verify scaffold can find components from all locations
- Verify paths in examples are correct

---

### 3.4 Update `fluxwing-validate.md`
**File:** `fluxwing/commands/fluxwing-validate.md`
**Status:** ⬜ Not Started
**Priority:** 🟡 Medium
**Estimated Time:** 15 minutes

**Requirements:**
- [ ] Add "Data Location Rules" section after frontmatter
- [ ] Clarify validation works on project files (not bundled templates)
- [ ] Update path references to accept files from any project location
- [ ] Add note: "Bundled templates are pre-validated"
- [ ] Update resource references with consistent paths
- [ ] Ensure validation reports show file locations

**Changes:**
- Insert new section after frontmatter
- Update validation scope description
- Update path handling
- Update resource section

**Testing:**
- Verify validates files from all project locations
- Verify skips bundled templates appropriately
- Verify helpful messages about file locations

---

## Phase 4: Add Data Location Headers 🔴 HIGH PRIORITY

### 4.1 Add Header Template to All Commands
**Files:** All 4 command files + new fluxwing-get.md
**Status:** ⬜ Not Started
**Priority:** 🔴 High
**Estimated Time:** 30 minutes

**Standard Header Template:**
```markdown
## Data Location Rules

**READ from (bundled templates - reference only):**
- `{PLUGIN_ROOT}/data/examples/` - 11 component templates
- `{PLUGIN_ROOT}/data/screens/` - 2 screen examples
- `{PLUGIN_ROOT}/data/docs/` - Documentation
- `{PLUGIN_ROOT}/data/schema/` - JSON Schema

**WRITE to (project workspace):**
- `./fluxwing/components/` - Your created components
- `./fluxwing/screens/` - Your created screens
- `./fluxwing/library/` - Customized template copies

**NEVER write to plugin data directory - it's read-only!**
```

**Requirements:**
- [ ] Add header to `fluxwing-create.md`
- [ ] Add header to `fluxwing-library.md`
- [ ] Add header to `fluxwing-scaffold.md`
- [ ] Add header to `fluxwing-validate.md`
- [ ] Add header to `fluxwing-get.md`
- [ ] Adapt wording to fit each command's context
- [ ] Place after frontmatter, before main content

**Acceptance Criteria:**
- All 5 command files have consistent header
- Headers appear in same location in each file
- Wording is adapted appropriately for context

---

### 4.2 Add Header Template to All Agents
**Files:** All 3 agent files
**Status:** ⬜ Not Started
**Priority:** 🔴 High
**Estimated Time:** 20 minutes

**Standard Header Template (adapted for agents):**
```markdown
## Data Location Rules

**Your READ sources (bundled templates - reference only):**
- `{PLUGIN_ROOT}/data/examples/` - 11 component templates
- `{PLUGIN_ROOT}/data/screens/` - 2 screen examples
- `{PLUGIN_ROOT}/data/docs/` - Load documentation as needed
- `{PLUGIN_ROOT}/data/schema/` - JSON Schema for validation

**Your WRITE destinations (project workspace):**
- `./fluxwing/components/` - Created components
- `./fluxwing/screens/` - Created screens
- `./fluxwing/library/` - Customized template copies

**CRITICAL: Never write to {PLUGIN_ROOT}/data/ - it's read-only bundled assets!**
```

**Requirements:**
- [ ] Add header to `fluxwing-composer.md`
- [ ] Add header to `fluxwing-designer.md`
- [ ] Add header to `fluxwing-validator.md`
- [ ] Adapt wording for agent audience (use "your")
- [ ] Place after frontmatter, after mission statement

**Acceptance Criteria:**
- All 3 agent files have consistent header
- Headers appear in same location in each file
- Wording emphasizes autonomous decision-making

---

### 4.3 Verify Header Consistency
**Status:** ⬜ Not Started
**Priority:** 🟡 Medium
**Estimated Time:** 15 minutes

**Requirements:**
- [ ] Read all 8 files (5 commands + 3 agents)
- [ ] Verify headers are present and consistent
- [ ] Verify headers are in correct location
- [ ] Verify path references use correct variables
- [ ] Check formatting is consistent
- [ ] Fix any inconsistencies found

**Acceptance Criteria:**
- All 8 files have "Data Location Rules" header
- All headers use same path structure
- All headers emphasize read-only vs read-write distinction

---

## Phase 5: Documentation Updates 🟡 MEDIUM PRIORITY

### 5.1 Update `fluxwing/CLAUDE.md`
**File:** `fluxwing/CLAUDE.md`
**Status:** ⬜ Not Started
**Priority:** 🟡 Medium
**Estimated Time:** 20 minutes

**Requirements:**
- [ ] Add "Data Location Philosophy" section after "Project Overview"
- [ ] Update "Repository Structure" section (lines 14-34) to clarify read-only vs read-write
- [ ] Update "File Locations Users Create" section (lines 155-161)
- [ ] Add subsection explaining the three sources for inventory
- [ ] Add diagram showing plugin vs project files
- [ ] Emphasize NEVER write to plugin data directory

**Changes:**
- Insert new section after line 22
- Update lines 14-34 (structure)
- Update lines 155-161 (user files)
- Add new diagram section

**Testing:**
- Verify documentation is clear
- Verify examples are accurate
- Verify paths are consistent

---

### 5.2 Update `fluxwing/COMMANDS.md`
**File:** `fluxwing/COMMANDS.md`
**Status:** ⬜ Not Started
**Priority:** 🟡 Medium
**Estimated Time:** 25 minutes

**Requirements:**
- [ ] Add `/fluxwing-get` command to command list
- [ ] Add "Data Location Philosophy" section at top
- [ ] Update all command descriptions to mention data locations
- [ ] Update examples to use correct paths
- [ ] Add section about component lifecycle (browse → get → copy → create)
- [ ] Update table of contents

**Changes:**
- Add new command entry
- Add new philosophy section
- Update existing descriptions
- Update examples

**Testing:**
- Verify all commands are documented
- Verify examples are accurate
- Verify paths are consistent

---

### 5.3 Update `fluxwing/AGENTS.md`
**File:** `fluxwing/AGENTS.md`
**Status:** ⬜ Not Started
**Priority:** 🟡 Medium
**Estimated Time:** 20 minutes

**Requirements:**
- [ ] Add "Data Location Rules" section at top
- [ ] Update agent workflow descriptions to mention locations
- [ ] Clarify where each agent reads from and writes to
- [ ] Add table showing agent read/write patterns
- [ ] Update examples to use correct paths
- [ ] Update table of contents

**Changes:**
- Add new rules section at top
- Update workflow descriptions
- Add comparison table
- Update examples

**Testing:**
- Verify agent descriptions are clear
- Verify read/write patterns are accurate
- Verify examples use correct paths

---

### 5.4 Update `fluxwing/README.md`
**File:** `fluxwing/README.md`
**Status:** ⬜ Not Started
**Priority:** 🔴 High
**Estimated Time:** 25 minutes

**Requirements:**
- [ ] Add "Plugin vs Project Files" section to overview
- [ ] Add directory structure diagram showing both locations
- [ ] Update quick start to mention data locations
- [ ] Add "Understanding the Inventory" section
- [ ] Update installation section if needed
- [ ] Ensure examples use correct paths

**Changes:**
- Add new explanatory sections
- Add visual diagram
- Update quick start
- Update examples

**Testing:**
- Verify README is clear for new users
- Verify diagram is accurate
- Verify examples work correctly

---

## Phase 6: Testing & Validation 🟢 LOW PRIORITY

### 6.1 Test `/fluxwing-get` Command
**Status:** ⬜ Not Started
**Priority:** 🟢 Low (after Phase 1)
**Estimated Time:** 20 minutes

**Test Cases:**
- [ ] Test with bundled template name (e.g., "primary-button")
  - Expected: Find in {PLUGIN_ROOT}/data/examples/
  - Expected: Offer to copy to project
- [ ] Test with project component name
  - Expected: Find in ./fluxwing/components/
  - Expected: Show as editable
- [ ] Test with library component name
  - Expected: Find in ./fluxwing/library/
  - Expected: Show as editable
- [ ] Test with nonexistent component
  - Expected: Helpful error message
  - Expected: Suggest similar names if available
- [ ] Test with partial name match
  - Expected: Suggest completions
- [ ] Test interactive options work correctly

**Acceptance Criteria:**
- All test cases pass
- Error messages are helpful
- Interactive options function correctly
- Paths are displayed correctly

---

### 6.2 Test Inventory Consistency
**Status:** ⬜ Not Started
**Priority:** 🟢 Low (after Phase 3)
**Estimated Time:** 25 minutes

**Test Cases:**
- [ ] Create test component in ./fluxwing/components/
- [ ] Copy bundled template to ./fluxwing/library/
- [ ] Run `/fluxwing-library`
  - Expected: Shows bundled templates (11)
  - Expected: Shows library component (1)
  - Expected: Shows project component (1)
- [ ] Use fluxwing-composer agent to create screen
  - Expected: Agent finds components from all locations
  - Expected: Screen references components correctly
- [ ] Use fluxwing-designer agent to create components
  - Expected: Agent checks all locations for existing components
  - Expected: Agent doesn't duplicate existing components

**Acceptance Criteria:**
- All three sources visible in inventory
- Agents can find components from all locations
- No duplicate components created
- Clear distinction between bundled and project files

---

### 6.3 Test Output Locations
**Status:** ⬜ Not Started
**Priority:** 🟢 Low (after Phase 3)
**Estimated Time:** 20 minutes

**Test Cases:**
- [ ] Use `/fluxwing-create` to create new component
  - Expected: Saves to ./fluxwing/components/
  - Expected: Creates both .uxm and .md files
  - Verify: Files exist in correct location
- [ ] Use `/fluxwing-scaffold` to create screen
  - Expected: Saves to ./fluxwing/screens/
  - Expected: Creates .uxm, .md, and .rendered.md files
  - Verify: Files exist in correct location
- [ ] Copy bundled template via `/fluxwing-library`
  - Expected: Copies to ./fluxwing/library/
  - Expected: Original template unchanged
  - Verify: Both files exist in correct locations
- [ ] Edit project component
  - Verify: Changes saved to project file
  - Verify: Bundled template unchanged

**Acceptance Criteria:**
- All outputs go to correct locations
- Bundled templates never modified
- Project files are editable
- File creation is consistent

---

### 6.4 Verify Read-Only Enforcement
**Status:** ⬜ Not Started
**Priority:** 🟢 Low (after all phases)
**Estimated Time:** 15 minutes

**Requirements:**
- [ ] Grep all command files for write operations to plugin data
  ```bash
  grep -r "PLUGIN_ROOT.*write" fluxwing/commands/
  grep -r "data/examples.*write" fluxwing/commands/
  ```
- [ ] Grep all agent files for write operations to plugin data
  ```bash
  grep -r "PLUGIN_ROOT.*write" fluxwing/agents/
  grep -r "data/examples.*write" fluxwing/agents/
  ```
- [ ] Verify no files reference writing to:
  - `{PLUGIN_ROOT}/data/examples/`
  - `{PLUGIN_ROOT}/data/screens/`
  - `{PLUGIN_ROOT}/data/docs/`
  - `{PLUGIN_ROOT}/data/schema/`
- [ ] Verify all write operations target:
  - `./fluxwing/components/`
  - `./fluxwing/screens/`
  - `./fluxwing/library/`

**Acceptance Criteria:**
- No write operations to plugin data directory
- All write operations target project workspace
- Warnings added where appropriate
- Documentation clearly states read-only nature

---

## Phase 7: Final Checks & Release 🟢

### 7.1 Consistency Review
**Status:** ⬜ Not Started
**Priority:** 🟢 Low
**Estimated Time:** 30 minutes

**Requirements:**
- [ ] Review all 8 modified files (commands + agents)
- [ ] Review all 4 documentation files
- [ ] Verify "Data Location Rules" headers are consistent
- [ ] Verify path references use correct variables
- [ ] Verify examples are accurate
- [ ] Check for typos and formatting issues
- [ ] Verify internal links work
- [ ] Update any outdated references

**Acceptance Criteria:**
- All files are consistent
- No broken links
- No typos or formatting errors
- All examples are accurate

---

### 7.2 Update Plugin Version
**File:** `fluxwing/.claude-plugin/plugin.json`
**Status:** ⬜ Not Started
**Priority:** 🟢 Low
**Estimated Time:** 5 minutes

**Requirements:**
- [ ] Update version from "1.0.0" to "1.1.0"
- [ ] Update description if needed
- [ ] Verify all other metadata is current
- [ ] Consider adding changelog entry

**Changes:**
```json
{
  "version": "1.1.0"
}
```

**Reasoning:** Minor version bump for:
- New command added (/fluxwing-get)
- Improved consistency (non-breaking changes)
- Better documentation

---

### 7.3 Create CHANGELOG Entry
**File:** `fluxwing/CHANGELOG.md` (create if doesn't exist)
**Status:** ⬜ Not Started
**Priority:** 🟢 Low
**Estimated Time:** 10 minutes

**Requirements:**
- [ ] Create CHANGELOG.md if it doesn't exist
- [ ] Add entry for version 1.1.0
- [ ] Document all changes:
  - Added: /fluxwing-get command
  - Changed: Improved consistency in data location references
  - Changed: Added "Data Location Rules" to all commands and agents
  - Improved: Documentation clarity around plugin vs project files

**Format:**
```markdown
# Changelog

## [1.1.0] - 2025-10-12

### Added
- New `/fluxwing-get` command to view details of a single component
- "Data Location Rules" section in all commands and agents
- Clear distinction between read-only bundled templates and editable project files

### Changed
- Improved consistency of data location references across all files
- Strengthened inventory concept explanation in `/fluxwing-library`
- Enhanced agent system prompts with explicit data location rules

### Improved
- Documentation clarity around plugin vs project file structure
- Examples now consistently use correct path variables
- Better guidance for where files are read from and written to

## [1.0.0] - 2025-10-11

### Added
- Initial release with 4 commands and 3 agents
- 11 bundled component templates
- Complete uxscii documentation
```

---

### 7.4 Final Testing
**Status:** ⬜ Not Started
**Priority:** 🟢 Low
**Estimated Time:** 30 minutes

**Requirements:**
- [ ] Install plugin locally using test marketplace
- [ ] Test all 5 commands (including new /fluxwing-get)
- [ ] Test all 3 agents
- [ ] Verify help text displays correctly
- [ ] Verify examples in documentation work
- [ ] Create a small test project with components from all sources
- [ ] Verify inventory shows all sources correctly
- [ ] Check for any runtime errors or warnings

**Acceptance Criteria:**
- All commands work correctly
- All agents work correctly
- No errors or warnings
- Documentation examples are accurate
- Plugin is ready for release

---

## Summary Statistics

### Files to Modify
- **Commands:** 5 files (4 updates + 1 new)
- **Agents:** 3 files (3 updates)
- **Documentation:** 4 files (4 updates)
- **Plugin Metadata:** 1 file (1 update)
- **Changelog:** 1 file (1 new)
- **Total:** 14 files

### Time Estimates
- **Phase 1:** 30 minutes (create get command)
- **Phase 2:** 55 minutes (update agents)
- **Phase 3:** 75 minutes (update commands)
- **Phase 4:** 65 minutes (add headers)
- **Phase 5:** 90 minutes (update documentation)
- **Phase 6:** 80 minutes (testing)
- **Phase 7:** 75 minutes (final checks)
- **Total:** ~7.5 hours

### Priority Breakdown
- 🔴 **High Priority:** 8 tasks (do first)
- 🟡 **Medium Priority:** 12 tasks (do second)
- 🟢 **Low Priority:** 14 tasks (do last)

---

## Implementation Order

### Sprint 1 (High Priority - 2 hours)
1. Create `/fluxwing-get` command
2. Add data location headers to all files
3. Update `/fluxwing-library` command
4. Update composer and designer agents
5. Update README.md

### Sprint 2 (Medium Priority - 2.5 hours)
6. Update remaining commands (create, scaffold, validate)
7. Update validator agent
8. Update CLAUDE.md
9. Update COMMANDS.md and AGENTS.md

### Sprint 3 (Testing & Polish - 3 hours)
10. Run all test cases
11. Verify consistency
12. Final review
13. Update version and changelog
14. Final testing

---

## Notes

- Mark tasks complete with `[x]` instead of `[ ]`
- Update progress percentages as you go
- Add notes about any issues or decisions made
- Track actual time spent vs estimated
- This document is your implementation checklist!

---

**Ready to start Phase 1!**
