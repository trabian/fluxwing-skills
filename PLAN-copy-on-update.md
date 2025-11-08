# Plan: Copy-on-Update Behavior for Component/Screen Modifications

**Date**: 2025-11-08
**Status**: Planning
**Priority**: High
**Scope**: Skills system modification

---

## Executive Summary

Update Fluxwing skills to implement a **copy-on-update** pattern where modification requests create new versioned copies instead of modifying existing files. This ensures non-destructive editing and preserves component history.

**Exception**: `component-expander` continues to update in place, as expanding states is an enhancement to the same component, not a new version.

---

## Current State Analysis

### Existing Behaviors (per skill)

| Skill | Current Behavior | File Tool | Status |
|-------|-----------------|-----------|--------|
| **component-expander** | Overwrites `.uxm` and `.md` in-place | Edit | ✅ **Keep as-is** - Expanding states = enhancement |
| **component-creator** | Creates new, but silently overwrites if exists | Write | ❌ No existence check - data loss risk |
| **screen-scaffolder** | Creates new, checks existence for `.md` | Write/Task | ❌ Inconsistent - only checks `.md` files |
| **enhancer** | Overwrites in-place with fidelity updates | Edit | ❌ Destructive - loses previous fidelity levels |

### Critical Gaps

1. ❌ **No versioning strategy** - Components don't auto-increment versions
2. ❌ **No backup/history** - Modifications destroy previous work
3. ❌ **Inconsistent file handling** - Some skills overwrite, others don't check
4. ❌ **MD-first requests mishandled** - User asks to "update button.md" but needs UXM-first approach

---

## Desired Behavior

### Core Principle: UXM-First, Copy-on-Update

When a user requests to update an existing component or screen:

```
User Request: "Enhance my button to production fidelity"
User Request: "Change button.md to use different colors"
User Request: "Modify the login-screen layout"
```

**New Workflow:**

1. **Always start with UXM file** - Even if user mentions `.md` file
2. **Check if component/screen exists** - Read `./fluxwing/components/{name}.uxm`
3. **Create versioned copy** - Never modify original
4. **Update both files** - `.uxm` and `.md` together
5. **Preserve original** - Keep old version accessible

**Exception - State Expansion:**
```
User Request: "Add hover state to my button"
```
This uses `component-expander` which **updates in place** because adding states enhances the same component ID, not creating a new version.

### Versioning Strategy

```
Original: submit-button.uxm (version 1.0.0)
         submit-button.md

Update 1: submit-button-v2.uxm (version 1.1.0)
         submit-button-v2.md

Update 2: submit-button-v3.uxm (version 1.2.0)
         submit-button-v3.md
```

**Rules:**
- Minor version bump for state additions/enhancements
- Keep same base name + `-v{N}` suffix
- Update `metadata.version` field in `.uxm`
- Update `metadata.modified` timestamp
- Preserve `metadata.created` from original

---

## Implementation Plan

### Phase 1: Core Copy-on-Update Function (Shared Utility)

**Location**: `skills/shared/copy-versioning.md` (new documentation module)

**Purpose**: Provide reusable instructions for all skills to implement copy-on-update

**Contents**:
```markdown
# Copy-on-Update Pattern

## Detection Phase
1. Parse user request for component/screen name
2. Check if .uxm exists in ./fluxwing/components/ or ./fluxwing/screens/
3. If exists → COPY mode, If not exists → CREATE mode

## Copy Mode Workflow
1. Read existing {name}.uxm
2. Parse metadata.version (e.g., "1.0.0")
3. Find highest versioned copy (check {name}-v2, {name}-v3, etc.)
4. Generate next version:
   - ID: {original-id}-v{N}
   - File: {original-name}-v{N+1}.uxm/.md
   - Version: Increment minor (1.0.0 → 1.1.0)
5. Apply modifications to new copy
6. Validate new copy
7. Save both .uxm and .md with new names

## Create Mode Workflow
(Existing behavior - no change)
```

### Phase 2: Update Individual Skills

#### 2.1 fluxwing-component-expander

**File**: `skills/fluxwing-component-expander/SKILL.md`

**Changes Required**: ✅ **NONE - Keep existing in-place update behavior**

**Rationale**:
- Component expansion adds states to the SAME component
- The component ID remains unchanged
- This is enhancement, not versioning
- In-place updates are correct behavior here

**Current behavior to PRESERVE:**
```markdown
**Write updated files**:
- Overwrite `{component-name}.uxm` with expanded states array
- Append new state sections to `{component-name}.md`
```

**Minor enhancement (optional):**
- Ensure UXM-first processing (if user mentions .md file, read .uxm first)
- This maintains consistency with other skills' UXM-first principle

#### 2.2 fluxwing-component-creator

**File**: `skills/fluxwing-component-creator/SKILL.md`

**Changes Required**:

**Current (No existence checking):**
```markdown
**WRITE to (project workspace - via designer agent):**
- `./fluxwing/components/` - Your created components
```

**New (Add before agent invocation, Lines ~115-126):**
```markdown
## Pre-Creation Validation

**Before invoking designer agent:**

1. **Check if component exists**:
   ```bash
   # Check for existing component
   test -f ./fluxwing/components/{component-id}.uxm
   ```

2. **If component EXISTS**:
   - Ask user: "Component '{component-id}' already exists. Would you like to:"
     - a) Create a new version (copy-on-update)
     - b) Create with different name
     - c) Cancel operation

3. **If user chooses (a) - Create new version**:
   - Read existing component
   - Find highest version (check {id}-v2, {id}-v3, etc.)
   - Pass to designer agent: "Create version {N+1} based on {component-id}"
   - Designer creates {id}-v{N+1}.uxm and .md files
   - Increment minor version number

4. **If component DOES NOT exist**:
   - Proceed with normal creation workflow (no change)

**IMPORTANT**: Always check existence before creating to prevent accidental overwrites
```

**Agent Prompt Updates (Lines 130-252)**:
Add to designer agent prompts:
```
If creating a versioned copy:
- Base new component on existing {original-id}
- New ID: {original-id}-v{N+1}
- New version: {incremented version}
- Preserve original concept, apply requested changes
```

#### 2.3 fluxwing-screen-scaffolder

**File**: `skills/fluxwing-screen-scaffolder/SKILL.md`

**Changes Required**:

**Current (Lines 273-276):**
```markdown
For each component in [${componentList}]:
1. Read component .uxm from ./fluxwing/components/
2. Check if .md exists:
   - If EXISTS: Skip to next component
   - If MISSING: Generate .md file
```

**New (Enhanced existence checking):**
```markdown
## Pre-Scaffolding Validation

**Before starting screen creation:**

1. **Check if screen exists**:
   ```bash
   test -f ./fluxwing/screens/{screen-name}.uxm
   ```

2. **If screen EXISTS**:
   - Ask user: "Screen '{screen-name}' already exists. Would you like to:"
     - a) Create a new version (copy-on-update)
     - b) Create with different name
     - c) Cancel operation

3. **If user chooses (a)**:
   - Read existing screen .uxm
   - Find highest version (check {name}-v2, {name}-v3, etc.)
   - Create {name}-v{N+1}.uxm, .md, .rendered.md
   - Increment minor version

4. **If screen DOES NOT exist**:
   - Proceed with normal scaffolding (no change)

**Component existence handling** (same as before):
For each component in [${componentList}]:
1. Check if .uxm exists in ./fluxwing/components/
   - If EXISTS: Use existing (no changes)
   - If MISSING: Create via designer agent
```

#### 2.4 fluxwing-enhancer

**File**: `skills/fluxwing-enhancer/SKILL.md`

**Changes Required**:

**Current (Lines 117-194):**
```typescript
prompt: "Enhance uxscii component from ${currentFidelity} to ${targetFidelity}...
6. Save updated files (overwrite existing)
```

**New:**
```markdown
## Enhancement with Copy-on-Update

**For each component to enhance:**

1. **Read current component**:
   - Load `./fluxwing/components/{component-id}.uxm`
   - Check `metadata.fidelity` level
   - Determine target fidelity

2. **Create enhanced version**:
   - Find highest version (check {id}-v2, {id}-v3, etc.)
   - Generate new IDs:
     - ID: {component-id}-v{N+1}
     - Files: {component-id}-v{N+1}.uxm/.md
   - Increment minor version (1.0.0 → 1.1.0)

3. **Apply enhancements to new copy**:
   - Copy all content from source
   - Apply fidelity-specific improvements
   - Update `metadata.fidelity` field
   - Update `metadata.version` field
   - Update `metadata.modified` timestamp

4. **Validate and save**:
   - Validate new .uxm against schema
   - Save both .uxm and .md files
   - Report: "Enhanced {id} → {id}-v{N+1} (fidelity: {level})"

**IMPORTANT**: Never overwrite original - always create versioned copy
```

**Agent Prompt Updates**:
```typescript
Task({
  subagent_type: "general-purpose",
  model: "sonnet",
  description: "Enhance ${componentId} to ${targetFidelity} (copy)",
  prompt: "Enhance uxscii component with copy-on-update pattern...

  1. Read ./fluxwing/components/${componentId}.uxm
  2. Parse current fidelity: ${currentFidelity}
  3. Find highest version (check ${componentId}-v2, v3, etc.)
  4. Create NEW files: ${componentId}-v{N+1}.uxm/.md
  5. Copy all content, apply enhancements
  6. Increment version: ${currentVersion} → {new minor version}
  7. Update fidelity: ${currentFidelity} → ${targetFidelity}
  8. Update modified timestamp
  9. Save new files (DO NOT overwrite original)
  10. Validate against schema"
})
```

---

## Phase 3: Shared Documentation Module

**File**: `skills/shared/docs/copy-versioning.md` (NEW)

**Purpose**: Reusable reference for all skills

**Contents**:
```markdown
# Copy-on-Update Versioning Pattern

## Overview
When modifying existing components or screens, always create versioned copies instead of overwriting originals.

## Version Numbering

**Format**: `{base-name}-v{N}`
- Original: `submit-button` (no suffix)
- Version 2: `submit-button-v2`
- Version 3: `submit-button-v3`

**Semantic Versioning**:
- Major (X.0.0): Breaking changes (manual only)
- Minor (1.X.0): New features, states, enhancements
- Patch (1.0.X): Bug fixes (not used in copy-on-update)

## Detection Algorithm

```bash
# 1. Check if original exists
if [[ -f "./fluxwing/components/${componentId}.uxm" ]]; then
  echo "Component exists - entering copy mode"

  # 2. Find highest version
  maxVersion=1
  for file in ./fluxwing/components/${componentId}-v*.uxm; do
    if [[ -f "$file" ]]; then
      version=$(echo "$file" | grep -oP 'v\K\d+')
      if [[ $version -gt $maxVersion ]]; then
        maxVersion=$version
      fi
    fi
  done

  # 3. Generate next version
  nextVersion=$((maxVersion + 1))
  newId="${componentId}-v${nextVersion}"

  echo "Creating version: ${newId}"
else
  echo "Component does not exist - entering create mode"
fi
```

## Metadata Updates

**Required changes in .uxm file:**

```json
{
  "id": "submit-button-v2",  // Add -v{N} suffix
  "version": "1.1.0",         // Increment minor version
  "metadata": {
    "created": "2024-10-11T12:00:00Z",   // Preserve original
    "modified": "2024-10-12T15:30:00Z",  // Update to current
    "fidelity": "detailed"                // Update if enhanced
  }
}
```

## User Communication

**Good examples:**
- "Created submit-button-v2 with hover state added"
- "Enhanced login-screen → login-screen-v2 (fidelity: production)"
- "Updated message-bubble → message-bubble-v3 (version 1.2.0)"

**Bad examples:**
- "Updated submit-button" (doesn't mention versioning)
- "Modified button.md" (implies in-place change)

## File System Layout

```
./fluxwing/components/
├── submit-button.uxm          # Original (v1.0.0)
├── submit-button.md
├── submit-button-v2.uxm       # First update (v1.1.0)
├── submit-button-v2.md
├── submit-button-v3.uxm       # Second update (v1.2.0)
└── submit-button-v3.md
```

## Edge Cases

### User mentions .md file only
```
User: "Update submit-button.md to use darker colors"
```
**Handling:**
1. Parse component name: "submit-button"
2. Check for submit-button.uxm (ALWAYS start with UXM)
3. If exists: Enter copy mode
4. Create submit-button-v2.uxm AND submit-button-v2.md
5. Apply color changes to both files

### Multiple rapid updates
```
User: "Enhance button to detailed fidelity"
User: "Now enhance to production fidelity"
```
**Handling:**
1. First request: Create button-v2 (detailed fidelity)
2. Second request: Check highest version (v2), create button-v3 (production fidelity)
3. Each enhancement gets its own version

**Note**: If user says "Add hover state" then "Add focus state", component-expander updates the SAME file in place (no versioning).

### Version number conflicts
If somehow button-v3 exists but button-v2 doesn't:
- Find ALL versions: v3, v4, v5
- Use MAX(versions) + 1 for next
- Gaps in sequence are okay

## Integration with Existing Skills

**component-expander**: ❌ **Do NOT load** - Keep in-place update behavior
**component-creator**: ✅ Load before designer agent invocation
**screen-scaffolder**: ✅ Load before composer agent invocation
**enhancer**: ✅ Load before enhancement logic
```

---

## Phase 4: User-Facing Changes

### Updated Behavior Examples

**Before (Destructive):**
```
User: "Add hover state to my button"
Claude: [modifies submit-button.uxm in place]
Result: Original lost forever
```

**After (Copy-on-Update):**
```
User: "Add hover state to my button"
Claude: "Found existing submit-button (v1.0.0). Creating submit-button-v2..."
        [creates submit-button-v2.uxm and .md]
Claude: "Created submit-button-v2 (v1.1.0) with hover state. Original preserved."
Result: Both versions available
```

### User Communication Patterns

**Always inform user about:**
1. ✓ Version detection: "Found existing component (v1.0.0)"
2. ✓ New version created: "Created submit-button-v2 (v1.1.0)"
3. ✓ What changed: "Added hover + focus states"
4. ✓ Original preservation: "Original submit-button preserved"

**File paths in messages:**
```
Created: ./fluxwing/components/submit-button-v2.uxm
Created: ./fluxwing/components/submit-button-v2.md
```

---

## Testing Strategy

### Test Cases

#### TC1: Expand Component (In-Place Update)
```
Setup: submit-button.uxm exists (v1.0.0, no hover state)
Action: "Add hover state to submit-button"
Expected:
  - submit-button.uxm MODIFIED in place (still v1.0.0)
  - submit-button.md MODIFIED in place (hover section added)
  - behavior.states array now includes hover
  - metadata.modified timestamp updated
  - NO new files created (component-expander updates in place)
```

#### TC2: Expand Component (Second State Addition)
```
Setup: submit-button.uxm (v1.0.0, has hover state from TC1)
Action: "Add disabled state to submit-button"
Expected:
  - submit-button.uxm MODIFIED in place (still v1.0.0)
  - submit-button.md MODIFIED in place (disabled section added)
  - behavior.states array now has [hover, disabled]
  - metadata.modified timestamp updated again
  - NO new files created (in-place update)
```

#### TC3: Create New Component (No Conflict)
```
Setup: No existing components
Action: "Create a button component"
Expected:
  - submit-button.uxm created (v1.0.0)
  - submit-button.md created
  - No version suffix
```

#### TC4: Create New Component (Conflict)
```
Setup: submit-button.uxm exists (v1.0.0)
Action: "Create a button component"
Expected:
  - Claude asks: "Component exists. Create new version or different name?"
  - User chooses "new version"
  - submit-button-v2.uxm created
```

#### TC5: User Mentions .md File
```
Setup: submit-button.uxm and .md exist (v1.0.0)
Action: "Update submit-button.md to use Unicode box drawing"
Expected:
  - Claude finds submit-button.uxm first
  - Creates submit-button-v2.uxm AND .md
  - Both files updated
```

#### TC6: Enhance Component
```
Setup: button.uxm exists (v1.0.0, fidelity="sketch")
Action: "Enhance button to detailed fidelity"
Expected:
  - button-v2.uxm created (v1.1.0, fidelity="detailed")
  - button-v2.md created
  - Original button.uxm unchanged (still sketch fidelity)
```

#### TC7: Screen Scaffolding (Conflict)
```
Setup: login-screen.uxm exists (v1.0.0)
Action: "Create a login screen"
Expected:
  - Claude detects existing screen
  - Asks user for choice
  - If "new version": Creates login-screen-v2.*
```

### Validation Checklist

For each test case, verify:
- [ ] Original files unchanged
- [ ] New files have correct -v{N} suffix in filename
- [ ] New files have correct -v{N} suffix in "id" field
- [ ] Version number incremented correctly
- [ ] `metadata.created` preserved from original
- [ ] `metadata.modified` updated to current time
- [ ] Both .uxm and .md created together
- [ ] JSON schema validation passes
- [ ] Variables match between .uxm and .md

---

## Migration Impact

### Breaking Changes

1. **component-expander behavior changes**:
   - Old: Overwrites files
   - New: Creates versioned copies
   - Impact: Users expecting in-place updates will see new files

2. **enhancer behavior changes**:
   - Old: Progressive fidelity overwrites same file
   - New: Each fidelity level creates new version
   - Impact: More files in components directory

### Non-Breaking Changes

1. **component-creator adds existence check**:
   - Old: Silent overwrite
   - New: Asks user before overwriting
   - Impact: Prevents accidental data loss (positive)

2. **screen-scaffolder enhanced checking**:
   - Old: Only checks .md existence
   - New: Checks .uxm existence
   - Impact: More robust (positive)

### User Education

**Documentation updates needed:**
- README.md: Explain copy-on-update pattern
- INSTALL.md: Note behavior changes
- TODO.md: Update development tasks
- Each SKILL.md: Add copy-versioning workflow section

**Example workflows to add:**
```markdown
## Working with Versioned Components

### Creating your first button
"Create a button component"
→ Creates submit-button.uxm (v1.0.0)

### Adding interactivity
"Add hover state to submit-button"
→ Creates submit-button-v2.uxm (v1.1.0)

### Enhancing fidelity
"Enhance submit-button to production quality"
→ Creates submit-button-v3.uxm (v1.2.0)

### Using specific versions
Reference exact version in screens:
"Use submit-button-v2 in login-screen"
```

---

## Implementation Checklist

See `TODO-copy-on-update.md` for detailed task breakdown.

---

## Success Criteria

### Functional Requirements
- [ ] All update operations create versioned copies
- [ ] Original files never modified
- [ ] UXM files always processed first (even if user mentions .md)
- [ ] Version numbers auto-increment correctly
- [ ] Both .uxm and .md created together
- [ ] Metadata fields updated appropriately

### User Experience Requirements
- [ ] Clear communication about version creation
- [ ] No silent overwrites or data loss
- [ ] Intuitive version numbering (-v2, -v3, etc.)
- [ ] Easy to reference specific versions

### Code Quality Requirements
- [ ] Reusable copy-versioning module
- [ ] Consistent behavior across all skills
- [ ] Comprehensive error handling
- [ ] Well-documented workflows

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Version number collisions** | Medium | Use robust MAX(versions)+1 algorithm |
| **Disk space growth** | Low | User's responsibility to clean old versions |
| **Confusion about which version to use** | Medium | Skills default to highest version for updates |
| **Breaking existing workflows** | High | Document behavior changes clearly |
| **Performance (many version checks)** | Low | Version detection is fast (glob + sort) |

---

## Timeline Estimate

| Phase | Duration | Effort |
|-------|----------|--------|
| Phase 1: Shared utility module | 2 hours | Create copy-versioning.md doc |
| Phase 2.1: component-expander | **0 hours** | ✅ No changes (keep in-place) |
| Phase 2.2: Update component-creator | 2 hours | Add existence checks, test |
| Phase 2.3: Update screen-scaffolder | 1.5 hours | Enhance checks, test |
| Phase 2.4: Update enhancer | 2 hours | Implement copy mode, test |
| Phase 3: Documentation | 1.5 hours | Update all docs |
| Phase 4: Testing | 3 hours | Run all test cases |
| **Total** | **12 hours** | ~1.5 working days |

---

## Next Steps

1. **Review this plan** - Get approval from stakeholders
2. **Create TODO-copy-on-update.md** - Detailed implementation checklist
3. **Create shared module** - Build copy-versioning.md first (reusable)
4. **Update skills sequentially** - Start with component-expander (most affected)
5. **Test after each skill** - Ensure no regressions
6. **Update documentation** - Keep docs in sync with code
7. **Commit and push** - Push to feature branch when complete

---

## Questions for Review

1. **Version suffix format**: Is `-v{N}` acceptable? Or prefer `_v{N}` or `.v{N}`?
2. **Semantic versioning**: Minor bump for all updates? Or patch for small changes?
3. **Default behavior**: Should we ask user every time, or auto-create versions?
4. **Cleanup strategy**: Should skills offer "compress old versions" utility?
5. **Screen `.rendered.md`**: Should versions of screens create separate .rendered.md files?

---

**Plan Status**: ✅ Ready for Review
**Next Document**: `TODO-copy-on-update.md`
