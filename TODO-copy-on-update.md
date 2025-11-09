# TODO: Copy-on-Update Implementation

**Project**: Fluxwing Skills - Copy-on-Update Behavior
**Plan**: See `PLAN-copy-on-update.md`
**Date**: 2025-11-08
**Status**: Not Started

---

## Implementation Phases

### ✅ Phase 0: Planning (COMPLETED)

- [x] Analyze current update behaviors across all skills
- [x] Create detailed implementation plan (PLAN-copy-on-update.md)
- [x] Create implementation TODO checklist (this file)

---

### Phase 1: Shared Utility Module

**Goal**: Create reusable copy-versioning documentation module

#### Tasks

- [ ] **Create directory structure**
  - [ ] Create `skills/shared/` directory (if not exists)
  - [ ] Create `skills/shared/docs/` directory

- [ ] **Create copy-versioning.md documentation**
  - [ ] Write overview and core concepts
  - [ ] Add version numbering rules
  - [ ] Add detection algorithm (bash examples)
  - [ ] Add metadata update patterns (JSON examples)
  - [ ] Add user communication guidelines
  - [ ] Add file system layout examples
  - [ ] Document edge cases:
    - [ ] User mentions .md file only
    - [ ] Multiple rapid updates
    - [ ] Version number conflicts
  - [ ] Add integration instructions for skills

- [ ] **Test shared module**
  - [ ] Verify markdown syntax is correct
  - [ ] Check all code examples are valid
  - [ ] Ensure documentation is clear and complete

**Deliverable**: `skills/shared/docs/copy-versioning.md`

---

### Phase 2: Update Skills

#### Phase 2.1: fluxwing-component-expander

**File**: `skills/fluxwing-component-expander/SKILL.md`

**Goal**: ✅ **NO CHANGES NEEDED** - Keep in-place update behavior

**Rationale**: Component expansion adds states to the same component, not creating a new version. In-place updates are correct.

##### Tasks

- [x] **No changes required** - component-expander keeps in-place update behavior
- [x] **Rationale documented** - State expansion enhances same component

##### Optional Enhancement (UXM-First Consistency)

- [ ] **Verify UXM-first processing**
  - [ ] Check if skill reads .uxm first when user mentions .md
  - [ ] If not, add UXM-first instruction (consistency with other skills)

**Deliverable**: ✅ No changes to `skills/fluxwing-component-expander/SKILL.md`

---

#### Phase 2.2: fluxwing-component-creator

**File**: `skills/fluxwing-component-creator/SKILL.md`

**Goal**: Add existence checking and offer copy-on-update when component exists

##### Pre-Implementation

- [ ] **Backup current version**
  ```bash
  cp skills/fluxwing-component-creator/SKILL.md \
     skills/fluxwing-component-creator/SKILL.md.backup
  ```

- [ ] **Read current SKILL.md**
  - [ ] Note fast mode section (Lines 127-196)
  - [ ] Note detailed mode section (Lines 198-252)
  - [ ] Understand agent invocation patterns

##### Implementation Tasks

- [ ] **Add copy-versioning module reference**
  - [ ] Add after "READ from" section (~Line 20)
  - [ ] Include shared documentation module

- [ ] **Add "Pre-Creation Validation" section**
  - [ ] Insert before "Fast Mode" section (~Line 115)
  - [ ] Add existence check logic:
    - [ ] Check if `./fluxwing/components/{component-id}.uxm` exists
    - [ ] If exists: Enter interactive mode
    - [ ] If not exists: Proceed with creation
  - [ ] Add user interaction:
    - [ ] Ask: "Component exists. Options: (a) Create version (b) Different name (c) Cancel"
    - [ ] Handle user choice
  - [ ] Add copy-on-update path:
    - [ ] Read existing component
    - [ ] Find highest version
    - [ ] Pass version info to designer agent

- [ ] **Update "Fast Mode" agent prompts**
  - [ ] Lines 130-167: Add versioning parameters
  - [ ] Add conditional: If creating version, base on original
  - [ ] Add: New ID should be {original-id}-v{N+1}
  - [ ] Add: Increment version number

- [ ] **Update "Detailed Mode" agent prompts**
  - [ ] Lines 198-252: Same versioning logic as fast mode
  - [ ] Ensure both .uxm and .md use versioned names

- [ ] **Update validation section**
  - [ ] Lines 388-425: Handle both new and versioned components
  - [ ] Update file path references

##### Testing Tasks

- [ ] **New component creation (no conflict)**
  - [ ] Test: "Create a button component"
  - [ ] Verify: button.uxm created (no version suffix)

- [ ] **Existing component (conflict)**
  - [ ] Setup: Create button.uxm manually
  - [ ] Test: "Create a button component"
  - [ ] Verify: Claude asks for choice
  - [ ] Choose: "Create new version"
  - [ ] Verify: button-v2.uxm created

- [ ] **Multiple versions**
  - [ ] Setup: button.uxm and button-v2.uxm exist
  - [ ] Test: "Create a button component" → choose version
  - [ ] Verify: button-v3.uxm created

##### Completion Criteria

- [ ] Existence check runs before creation
- [ ] User asked for choice when conflict detected
- [ ] Versioned components created correctly
- [ ] No silent overwrites
- [ ] All tests passing

**Deliverable**: Updated `skills/fluxwing-component-creator/SKILL.md`

---

#### Phase 2.3: fluxwing-screen-scaffolder

**File**: `skills/fluxwing-screen-scaffolder/SKILL.md`

**Goal**: Add screen existence checking and copy-on-update for screens

##### Pre-Implementation

- [ ] **Backup current version**
  ```bash
  cp skills/fluxwing-screen-scaffolder/SKILL.md \
     skills/fluxwing-screen-scaffolder/SKILL.md.backup
  ```

- [ ] **Read current SKILL.md**
  - [ ] Note Phase 1 (fast component creation, Lines 135-240)
  - [ ] Note Phase 2 (composition, Lines 242-359)
  - [ ] Note component existence checking (Lines 273-276)

##### Implementation Tasks

- [ ] **Add copy-versioning module reference**
  - [ ] Add after "READ from" section (~Line 22)
  - [ ] Include shared documentation module

- [ ] **Add "Pre-Scaffolding Validation" section**
  - [ ] Insert before "Phase 1" section (~Line 120)
  - [ ] Add screen existence check:
    - [ ] Check if `./fluxwing/screens/{screen-name}.uxm` exists
    - [ ] If exists: Ask user for choice
    - [ ] Options: (a) Create version (b) Different name (c) Cancel
  - [ ] Add versioning logic:
    - [ ] Read existing screen
    - [ ] Find highest version
    - [ ] Pass to composer agent

- [ ] **Update Phase 2 (Composition) section**
  - [ ] Lines 242-359: Update composer agent prompts
  - [ ] Add versioning parameters if creating screen version
  - [ ] Update screen file outputs:
    - [ ] {screen-name}-v{N}.uxm
    - [ ] {screen-name}-v{N}.md
    - [ ] {screen-name}-v{N}.rendered.md
  - [ ] Ensure all three files use same version suffix

- [ ] **Keep component existence checking unchanged**
  - [ ] Lines 273-276: No changes needed
  - [ ] Components still use existing if available

##### Testing Tasks

- [ ] **New screen (no conflict)**
  - [ ] Test: "Create a login screen"
  - [ ] Verify: login-screen.uxm/.md/.rendered.md created

- [ ] **Existing screen (conflict)**
  - [ ] Setup: login-screen.uxm exists
  - [ ] Test: "Create a login screen"
  - [ ] Verify: Claude asks for choice
  - [ ] Choose: "Create new version"
  - [ ] Verify: login-screen-v2.* files created (all 3)

- [ ] **Screen with components**
  - [ ] Test: "Create a dashboard with user-card and metric-panel"
  - [ ] Verify: Components created if missing
  - [ ] Verify: Screen created with references

##### Completion Criteria

- [ ] Screen existence check runs before scaffolding
- [ ] All three screen files created with version suffix
- [ ] Component handling unchanged (existing behavior)
- [ ] User receives clear feedback
- [ ] All tests passing

**Deliverable**: Updated `skills/fluxwing-screen-scaffolder/SKILL.md`

---

#### Phase 2.4: fluxwing-enhancer

**File**: `skills/fluxwing-enhancer/SKILL.md`

**Goal**: Create versioned copies when enhancing fidelity instead of overwriting

##### Pre-Implementation

- [ ] **Backup current version**
  ```bash
  cp skills/fluxwing-enhancer/SKILL.md \
     skills/fluxwing-enhancer/SKILL.md.backup
  ```

- [ ] **Read current SKILL.md**
  - [ ] Note fidelity levels (Lines 46-66)
  - [ ] Note enhancement workflow (Lines 82-100)
  - [ ] Note agent invocation (Lines 117-194)

##### Implementation Tasks

- [ ] **Add copy-versioning module reference**
  - [ ] Add after "READ from" section (~Line 17)
  - [ ] Include shared documentation module

- [ ] **Update "Enhancement Workflow" section**
  - [ ] Replace Lines 82-100 (current in-place logic)
  - [ ] Add copy-on-update workflow:
    - [ ] Read current component
    - [ ] Find highest version
    - [ ] Create new version: {id}-v{N+1}
    - [ ] Apply fidelity enhancements to copy
    - [ ] Update metadata.fidelity
    - [ ] Update metadata.version (increment minor)
    - [ ] Update metadata.modified
    - [ ] Preserve metadata.created

- [ ] **Update agent prompts**
  - [ ] Lines 117-194: Modify Task invocations
  - [ ] Change description to include "(copy)"
  - [ ] Update prompt instructions:
    - [ ] "Create NEW files: {id}-v{N+1}.uxm/.md"
    - [ ] "DO NOT overwrite original"
    - [ ] "Copy all content, apply enhancements"
    - [ ] "Save new files"

- [ ] **Update fidelity progression examples**
  - [ ] Lines 46-66: Update examples to show versioning
  - [ ] Example: "sketch (button.uxm) → basic (button-v2.uxm) → detailed (button-v3.uxm)"

- [ ] **Update WRITE to section**
  - [ ] Lines 20-22: Change from "in place" to "new versions"
  - [ ] Example paths with -v{N} suffix

##### Testing Tasks

- [ ] **Single fidelity enhancement**
  - [ ] Setup: Create button.uxm (fidelity=sketch)
  - [ ] Test: "Enhance button to basic fidelity"
  - [ ] Verify: button-v2.uxm created (fidelity=basic)
  - [ ] Verify: Original button.uxm unchanged (still sketch)

- [ ] **Progressive enhancements**
  - [ ] Setup: button.uxm (sketch), button-v2.uxm (basic)
  - [ ] Test: "Enhance button to detailed fidelity"
  - [ ] Verify: button-v3.uxm created (fidelity=detailed)
  - [ ] Verify: Copies from v2 (highest version)

- [ ] **Multiple components in parallel**
  - [ ] Setup: button.uxm, input.uxm (both sketch)
  - [ ] Test: "Enhance button and input to production"
  - [ ] Verify: button-v2.uxm and input-v2.uxm created
  - [ ] Verify: Both have production fidelity

##### Completion Criteria

- [ ] Each fidelity level creates new version
- [ ] Original fidelity levels preserved
- [ ] Metadata updated correctly
- [ ] Parallel enhancement works
- [ ] All tests passing

**Deliverable**: Updated `skills/fluxwing-enhancer/SKILL.md`

---

### Phase 3: Documentation Updates

**Goal**: Update all user-facing documentation to reflect new behavior

#### Repository Documentation

- [ ] **Update README.md**
  - [ ] Add "Copy-on-Update Pattern" section
  - [ ] Explain versioning behavior
  - [ ] Add examples of versioned components
  - [ ] Update workflow examples

- [ ] **Update INSTALL.md**
  - [ ] Note behavior changes in "What's New" section
  - [ ] Explain copy-on-update for existing users
  - [ ] Add migration guide if needed

- [ ] **Update CLAUDE.md**
  - [ ] Add copy-on-update to "Key Architectural Principles"
  - [ ] Update "File References by Task" section
  - [ ] Add versioning to "Variable Substitution" section
  - [ ] Update examples throughout

- [ ] **Update TODO.md**
  - [ ] Mark copy-on-update implementation as complete
  - [ ] Update development status
  - [ ] Add any discovered follow-up tasks

#### Skill-Specific Documentation

Each skill has bundled docs in `skills/{skill-name}/docs/`. Update relevant modules:

- [ ] **component-expander docs**
  - [ ] Update `03-component-creation.md` if present
  - [ ] Add copy-versioning examples

- [ ] **component-creator docs**
  - [ ] Update `03-component-creation.md`
  - [ ] Add existence checking workflow
  - [ ] Add versioned component examples

- [ ] **screen-scaffolder docs**
  - [ ] Update `04-screen-composition.md`
  - [ ] Add screen versioning examples

- [ ] **enhancer docs**
  - [ ] Update any fidelity progression docs
  - [ ] Show progressive versioning

#### Marketplace and Plugin Metadata

- [ ] **Update .claude-plugin/plugin.json**
  - [ ] Increment version number
  - [ ] Update changelog if present

- [ ] **Update .claude-plugin/marketplace.json**
  - [ ] Update descriptions if needed
  - [ ] Note new versioning behavior

#### Examples and Templates

- [ ] **Review bundled templates**
  - [ ] Ensure templates still valid
  - [ ] Add versioned examples if helpful

---

### Phase 4: Testing and Validation

**Goal**: Comprehensive testing of all copy-on-update behavior

#### Test Environment Setup

- [ ] **Create test project**
  ```bash
  mkdir -p /tmp/fluxwing-test
  cd /tmp/fluxwing-test
  ```

- [ ] **Install updated skills**
  ```bash
  cd /home/user/fluxwing-skills
  ./scripts/install.sh --local
  ```

#### Test Cases (Detailed)

##### TC1: Component Expander - In-Place Update

- [ ] **Setup**
  - [ ] Create baseline component: "Create a submit button"
  - [ ] Verify: `./fluxwing/components/submit-button.uxm` exists
  - [ ] Note version: Should be 1.0.0
  - [ ] Note: No hover state initially

- [ ] **Execute**
  - [ ] Request: "Add hover state to submit-button"
  - [ ] Observe Claude's response

- [ ] **Verify**
  - [ ] File MODIFIED in place: `submit-button.uxm` (still v1.0.0)
  - [ ] File MODIFIED in place: `submit-button.md` (hover section added)
  - [ ] NO new files created (no submit-button-v2.*)
  - [ ] `behavior.states` array now includes hover
  - [ ] `metadata.modified` timestamp updated
  - [ ] `metadata.created` unchanged

##### TC2: Component Expander - Second State Addition

- [ ] **Setup**
  - [ ] Existing: submit-button.uxm (v1.0.0, has hover state from TC1)

- [ ] **Execute**
  - [ ] Request: "Add disabled state to submit-button"

- [ ] **Verify**
  - [ ] File MODIFIED in place: `submit-button.uxm` (still v1.0.0)
  - [ ] File MODIFIED in place: `submit-button.md` (disabled section added)
  - [ ] NO new files created
  - [ ] `behavior.states` array now has [hover, disabled]
  - [ ] `metadata.modified` timestamp updated again

##### TC3: Component Creator - New Component

- [ ] **Setup**
  - [ ] No existing email-input component

- [ ] **Execute**
  - [ ] Request: "Create an email input component"

- [ ] **Verify**
  - [ ] File created: `email-input.uxm` (no version suffix)
  - [ ] File created: `email-input.md`
  - [ ] Version: 1.0.0
  - [ ] No user prompt about existing files

##### TC4: Component Creator - Existing Component

- [ ] **Setup**
  - [ ] Create: submit-button.uxm (v1.0.0) manually

- [ ] **Execute**
  - [ ] Request: "Create a submit button"
  - [ ] Observe: Claude should ask for choice

- [ ] **User chooses: Create new version**
  - [ ] Verify: Claude creates submit-button-v2.uxm
  - [ ] Verify: Version 1.1.0 or 2.0.0 (depending on implementation)

- [ ] **User chooses: Different name**
  - [ ] Claude should ask for new name
  - [ ] Creates component with user-provided name

- [ ] **User chooses: Cancel**
  - [ ] No new files created

##### TC5: User Mentions .md File Only

- [ ] **Setup**
  - [ ] Existing: submit-button.uxm and submit-button.md (v1.0.0)

- [ ] **Execute**
  - [ ] Request: "Update submit-button.md to use darker colors"

- [ ] **Verify**
  - [ ] Claude finds .uxm file first (mentions in response)
  - [ ] File created: submit-button-v2.uxm
  - [ ] File created: submit-button-v2.md
  - [ ] Both files updated (not just .md)
  - [ ] User informed about UXM-first approach

##### TC6: Screen Scaffolder - New Screen

- [ ] **Setup**
  - [ ] No existing login-screen

- [ ] **Execute**
  - [ ] Request: "Create a login screen with email-input and submit-button"

- [ ] **Verify**
  - [ ] Files created: login-screen.uxm, .md, .rendered.md
  - [ ] No version suffix
  - [ ] Version: 1.0.0
  - [ ] Components created if missing

##### TC7: Screen Scaffolder - Existing Screen

- [ ] **Setup**
  - [ ] Existing: login-screen.uxm (v1.0.0)

- [ ] **Execute**
  - [ ] Request: "Create a login screen"
  - [ ] Observe: Claude asks for choice

- [ ] **User chooses: Create new version**
  - [ ] Verify: login-screen-v2.uxm created
  - [ ] Verify: login-screen-v2.md created
  - [ ] Verify: login-screen-v2.rendered.md created
  - [ ] All three files with same version suffix

##### TC8: Enhancer - Single Fidelity Jump

- [ ] **Setup**
  - [ ] Create: button.uxm (fidelity=sketch, v1.0.0)

- [ ] **Execute**
  - [ ] Request: "Enhance button to basic fidelity"

- [ ] **Verify**
  - [ ] File created: button-v2.uxm
  - [ ] File created: button-v2.md
  - [ ] Original unchanged: button.uxm (still sketch)
  - [ ] New file: fidelity=basic
  - [ ] Version: 1.1.0

##### TC9: Enhancer - Progressive Fidelity

- [ ] **Setup**
  - [ ] button.uxm (sketch, v1.0.0)

- [ ] **Execute**
  - [ ] Request: "Enhance button to production fidelity"
  - [ ] Note: This might create multiple versions

- [ ] **Verify**
  - [ ] Original: button.uxm (sketch, v1.0.0) unchanged
  - [ ] If multi-step:
    - [ ] button-v2.uxm (basic, v1.1.0)
    - [ ] button-v3.uxm (detailed, v1.2.0)
    - [ ] button-v4.uxm (production, v1.3.0)
  - [ ] Or single step:
    - [ ] button-v2.uxm (production, v1.1.0)

##### TC10: Version Gap Handling

- [ ] **Setup**
  - [ ] Manually create: button.uxm, button-v3.uxm (skip v2)

- [ ] **Execute**
  - [ ] Request: "Add hover state to button"

- [ ] **Verify**
  - [ ] Claude detects highest version (v3)
  - [ ] Creates: button-v4.uxm
  - [ ] Version: Based on v3 + 1 minor = 1.X.0
  - [ ] Gap in numbering (v2 missing) is acceptable

#### Schema Validation Testing

- [ ] **Validate all generated .uxm files**
  ```bash
  for file in ./fluxwing/components/*.uxm; do
    echo "Validating: $file"
    uv run skills/fluxwing-component-creator/scripts/quick_validate.py \
      "$file" \
      skills/fluxwing-component-creator/schemas/uxm-component.schema.json
  done
  ```

- [ ] **Check version format**
  - [ ] All versions match: `^\d+\.\d+\.\d+$`

- [ ] **Check ID format**
  - [ ] Original: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
  - [ ] Versioned: `^[a-z0-9]+(?:-[a-z0-9]+)*-v\d+$`

#### Performance Testing

- [ ] **Rapid sequential updates**
  - [ ] Create component
  - [ ] Add state 1
  - [ ] Add state 2
  - [ ] Add state 3
  - [ ] Verify: All versions created correctly (v2, v3, v4)

- [ ] **Parallel enhancements**
  - [ ] Create 5 components
  - [ ] Enhance all 5 to production in one request
  - [ ] Verify: 5 new versions created
  - [ ] Verify: All have -v2 suffix

---

### Phase 5: Cleanup and Final Verification

#### Code Review

- [ ] **Review all SKILL.md changes**
  - [ ] Check for consistency across skills
  - [ ] Verify all references to copy-versioning module
  - [ ] Check examples are accurate

- [ ] **Review documentation updates**
  - [ ] Check for outdated information
  - [ ] Verify examples match new behavior
  - [ ] Check links and references

#### Backup Cleanup

- [ ] **Remove backup files** (if satisfied with changes)
  ```bash
  find skills/ -name "*.backup" -delete
  ```

- [ ] **Or keep backups** (for rollback capability)
  ```bash
  find skills/ -name "*.backup" -ls
  ```

#### Git Operations

- [ ] **Stage changes**
  ```bash
  git add skills/shared/docs/copy-versioning.md
  git add skills/fluxwing-component-creator/SKILL.md
  git add skills/fluxwing-component-expander/SKILL.md
  git add skills/fluxwing-screen-scaffolder/SKILL.md
  git add skills/fluxwing-enhancer/SKILL.md
  git add README.md CLAUDE.md INSTALL.md TODO.md
  git add .claude-plugin/plugin.json
  ```

- [ ] **Review diff**
  ```bash
  git diff --cached
  ```

- [ ] **Commit changes**
  ```bash
  git commit -m "$(cat <<'EOF'
  feat: Implement copy-on-update pattern for component modifications

  - Add versioned file creation instead of in-place overwrites
  - Preserve component history with -v{N} suffix naming
  - Implement UXM-first processing even when .md mentioned
  - Add existence checking to prevent silent overwrites
  - Create shared copy-versioning documentation module

  Updates:
  - component-expander: Create versions when adding states
  - component-creator: Check existence, offer versioning
  - screen-scaffolder: Version screens with all 3 files
  - enhancer: Create versions for each fidelity level

  All original files now preserved. New versions auto-increment
  with proper metadata (version, modified timestamp).

  See PLAN-copy-on-update.md for full implementation details.
  EOF
  )"
  ```

- [ ] **Push to feature branch**
  ```bash
  git push -u origin claude/ask-feature-011CUvcCZ3rfcRfdq1ZeAM1A
  ```

---

## Success Metrics

### Functional Metrics

- [ ] **All update operations create copies** - 0% in-place overwrites
- [ ] **100% UXM-first processing** - Even when user mentions .md
- [ ] **Correct version numbering** - All versions follow -v{N} pattern
- [ ] **Metadata integrity** - created preserved, modified updated
- [ ] **Schema compliance** - All generated files validate

### User Experience Metrics

- [ ] **Clear messaging** - Users informed about versioning
- [ ] **No data loss** - Originals always preserved
- [ ] **Predictable behavior** - Consistent across all skills
- [ ] **Helpful prompts** - Interactive choices when conflicts occur

### Code Quality Metrics

- [ ] **Reusable module** - copy-versioning.md used by all skills
- [ ] **Documentation coverage** - All behaviors documented
- [ ] **Test coverage** - All test cases passing
- [ ] **No regressions** - Existing functionality still works

---

## Rollback Plan

If critical issues discovered:

1. **Revert to backups**
   ```bash
   for skill in component-creator component-expander screen-scaffolder enhancer; do
     cp skills/fluxwing-$skill/SKILL.md.backup \
        skills/fluxwing-$skill/SKILL.md
   done
   ```

2. **Reinstall original skills**
   ```bash
   ./scripts/install.sh
   ```

3. **Git reset** (if committed)
   ```bash
   git reset --hard HEAD~1
   ```

4. **Document issues** in GitHub issues
   - What broke
   - Steps to reproduce
   - Proposed fixes

---

## Post-Implementation Tasks

### Monitoring

- [ ] **Collect user feedback** - First week after release
- [ ] **Monitor GitHub issues** - Copy-on-update related problems
- [ ] **Track disk usage** - Are version files accumulating?

### Potential Enhancements

- [ ] **Version cleanup utility**
  - Skill to compress old versions
  - Keep only N most recent versions
  - Archive to `.fluxwing/archive/`

- [ ] **Version comparison tool**
  - Compare two versions side-by-side
  - Show diff of changes
  - Visual ASCII diff

- [ ] **Version rollback**
  - "Use button-v2 instead of button-v4"
  - Copy older version forward as new version

- [ ] **Smart version detection**
  - "Enhance my latest button" → finds highest version
  - "Add state to button v2" → specific version targeting

---

## Questions and Decisions Log

### Resolved

- **Q**: Version suffix format?
  - **A**: Use `-v{N}` (e.g., submit-button-v2)
  - **Rationale**: Clear, parseable, consistent with common naming

- **Q**: Semantic versioning rules?
  - **A**: Increment minor version for all updates
  - **Rationale**: Simple, predictable, major version reserved for manual breaking changes

- **Q**: Default behavior on conflicts?
  - **A**: Ask user for choice (version / rename / cancel)
  - **Rationale**: Prevents surprises, gives user control

### Pending

- **Q**: Should screens create separate .rendered.md for each version?
  - **A**: TBD - need to decide during Phase 2.3
  - **Options**: (a) Yes, all 3 files versioned (b) Only .uxm and .md versioned

- **Q**: Cleanup strategy for old versions?
  - **A**: TBD - future enhancement
  - **Note**: Out of scope for initial implementation

---

## Completion Checklist

Before marking this TODO as complete:

- [ ] All Phase 1 tasks completed (shared module)
- [ ] All Phase 2 tasks completed (4 skills updated)
- [ ] All Phase 3 tasks completed (documentation)
- [ ] All Phase 4 tasks completed (testing)
- [ ] All Phase 5 tasks completed (cleanup, commit, push)
- [ ] All test cases passing
- [ ] All success metrics met
- [ ] Changes committed to git
- [ ] Changes pushed to feature branch
- [ ] PLAN-copy-on-update.md marked as "Implemented"
- [ ] Main TODO.md updated

---

**TODO Status**: ✅ Ready to Implement
**Next Step**: Begin Phase 1 - Create shared copy-versioning module
