# Copy-on-Update Versioning Pattern

**Version**: 1.0.0
**Purpose**: Non-destructive component and screen modifications
**Applies to**: component-creator, screen-scaffolder, enhancer
**Does NOT apply to**: component-expander (uses in-place updates)

---

## Overview

When modifying existing components or screens, create versioned copies instead of overwriting originals. This ensures non-destructive editing and preserves component history.

**Core Principle**: Always start with UXM file, even if user mentions `.md` file.

---

## When to Use Copy-on-Update

### ✅ Use Copy-on-Update For:

1. **Creating component that already exists** (component-creator)
   - User: "Create a submit button"
   - Existing: `submit-button.uxm` already exists
   - Action: Ask user, offer to create versioned copy

2. **Enhancing component fidelity** (enhancer)
   - User: "Enhance button to production fidelity"
   - Existing: `button.uxm` (fidelity=sketch)
   - Action: Create `button-v2.uxm` (fidelity=production)

3. **Creating screen that already exists** (screen-scaffolder)
   - User: "Create a login screen"
   - Existing: `login-screen.uxm` already exists
   - Action: Ask user, offer to create versioned copy

4. **Modifying layout/structure** (any skill)
   - User: "Change button.md to use different colors"
   - Existing: `button.uxm` exists
   - Action: Create `button-v2.uxm` and `button-v2.md` with changes

### ❌ Do NOT Use Copy-on-Update For:

1. **Adding states to components** (component-expander only)
   - User: "Add hover state to my button"
   - Action: Modify `button.uxm` in place (same component, enhanced)
   - Reason: Adding states enhances the same component ID

---

## Version Numbering

### File Naming Pattern

```
Original:  {base-name}.uxm         (e.g., submit-button.uxm)
Version 2: {base-name}-v2.uxm      (e.g., submit-button-v2.uxm)
Version 3: {base-name}-v3.uxm      (e.g., submit-button-v3.uxm)
```

**Rules**:
- Original file has NO version suffix
- Versions start at `-v2` (not `-v1`)
- Version number matches across `.uxm` and `.md` files
- For screens: All three files use same suffix (`.uxm`, `.md`, `.rendered.md`)

### Component ID Pattern

The `id` field in the `.uxm` file must match the filename:

```json
// Original: submit-button.uxm
{
  "id": "submit-button",
  "version": "1.0.0"
}

// Version 2: submit-button-v2.uxm
{
  "id": "submit-button-v2",
  "version": "1.1.0"
}
```

### Semantic Versioning

**Format**: `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)

**Increment rules**:
- **Minor version** (1.X.0): New features, fidelity enhancements, layout changes
  - Original: 1.0.0 → First copy: 1.1.0 → Second copy: 1.2.0
- **Major version** (X.0.0): Breaking changes (manual only, not auto-incremented)
- **Patch version** (1.0.X): Not used in copy-on-update pattern

**Copy-on-update always increments minor version**.

---

## Detection Algorithm

### Step 1: Parse Component/Screen Name

Extract the base name from user request, ignoring `.uxm` or `.md` extensions:

```bash
# Examples:
"Update submit-button.md"     → componentName="submit-button"
"Enhance button to production" → componentName="button"
"Create a login screen"        → screenName="login-screen"
```

### Step 2: Check if Original Exists

```bash
# For components:
if [[ -f "./fluxwing/components/${componentName}.uxm" ]]; then
  echo "Component exists - entering copy-on-update mode"
else
  echo "Component does not exist - entering create mode"
fi

# For screens:
if [[ -f "./fluxwing/screens/${screenName}.uxm" ]]; then
  echo "Screen exists - entering copy-on-update mode"
else
  echo "Screen does not exist - entering create mode"
fi
```

### Step 3: Find Highest Existing Version

If original exists, find the highest versioned copy:

```bash
# Initialize
maxVersion=1  # Original is considered v1

# Find all versioned files
for file in ./fluxwing/components/${componentName}-v*.uxm; do
  if [[ -f "$file" ]]; then
    # Extract version number (e.g., submit-button-v3.uxm → 3)
    version=$(echo "$file" | grep -oP 'v\K\d+')
    if [[ $version -gt $maxVersion ]]; then
      maxVersion=$version
    fi
  fi
done

# Calculate next version
nextVersion=$((maxVersion + 1))
newId="${componentName}-v${nextVersion}"

echo "Creating version: ${newId}"
```

**Edge case - Version gaps**: If v2 is missing but v3 and v5 exist, use MAX(versions)+1 = v6. Gaps are acceptable.

### Step 4: Load Source for Copying

Determine which file to base the new version on:

```bash
# Check if highest version exists
if [[ -f "./fluxwing/components/${componentName}-v${maxVersion}.uxm" ]]; then
  # Copy from highest version (e.g., v3 if it exists)
  sourceFile="${componentName}-v${maxVersion}.uxm"
else
  # Copy from original (v1)
  sourceFile="${componentName}.uxm"
fi

echo "Basing new version on: ${sourceFile}"
```

---

## Metadata Updates

### Required Changes in .uxm File

When creating a versioned copy, update these fields:

```json
{
  "id": "submit-button-v2",           // Add -v{N} suffix
  "version": "1.1.0",                  // Increment minor version
  "metadata": {
    "created": "2024-10-11T12:00:00Z",    // Preserve from original
    "modified": "2024-10-12T15:30:00Z",   // Update to current timestamp
    "fidelity": "detailed"                 // Update if enhancing
  }
}
```

### Field-by-Field Rules

| Field | Action | Example |
|-------|--------|---------|
| `id` | Add `-v{N}` suffix | `submit-button` → `submit-button-v2` |
| `version` | Increment minor | `1.0.0` → `1.1.0` → `1.2.0` |
| `metadata.created` | **Preserve** from original | `2024-10-11T12:00:00Z` (unchanged) |
| `metadata.modified` | **Update** to current time | `2024-10-12T15:30:00Z` (new) |
| `metadata.fidelity` | Update if enhancing | `sketch` → `detailed` |
| `metadata.name` | Keep same display name | `Submit Button` (unchanged) |
| `metadata.description` | Preserve or enhance | May be improved |

### Current Timestamp Format

Use ISO 8601 format:

```bash
# Generate current timestamp
currentTimestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
# Example: 2024-10-12T15:30:45Z
```

---

## User Communication

### Clear Messaging Patterns

Always inform user about versioning actions:

**✅ Good examples**:
```
"Found existing submit-button (v1.0.0). Creating submit-button-v2..."
"Created submit-button-v2 (v1.1.0) with production fidelity. Original preserved."
"Enhanced login-screen → login-screen-v2. Files created:
  - ./fluxwing/screens/login-screen-v2.uxm
  - ./fluxwing/screens/login-screen-v2.md
  - ./fluxwing/screens/login-screen-v2.rendered.md"
```

**❌ Bad examples**:
```
"Updated submit-button"              (doesn't mention versioning)
"Modified button.md"                 (implies in-place change)
"Created new component"              (vague, no version info)
```

### Interactive Prompts

When component/screen already exists, ask user for choice:

```
Component 'submit-button' already exists (v1.0.0).

Options:
(a) Create new version (submit-button-v2)
(b) Create with different name
(c) Cancel operation

What would you like to do?
```

**Handle user responses**:
- **(a)**: Proceed with copy-on-update (create v2)
- **(b)**: Ask for new name, create with that name
- **(c)**: Cancel, no files created

---

## File System Layout

### Components Example

```
./fluxwing/components/
├── submit-button.uxm          # Original (v1.0.0, fidelity=sketch)
├── submit-button.md
├── submit-button-v2.uxm       # First update (v1.1.0, fidelity=detailed)
├── submit-button-v2.md
├── submit-button-v3.uxm       # Second update (v1.2.0, fidelity=production)
└── submit-button-v3.md
```

### Screens Example

```
./fluxwing/screens/
├── login-screen.uxm           # Original (v1.0.0)
├── login-screen.md
├── login-screen.rendered.md
├── login-screen-v2.uxm        # First update (v1.1.0)
├── login-screen-v2.md
└── login-screen-v2.rendered.md
```

**Important**: Screens have THREE files per version, all with matching suffix.

---

## Edge Cases

### Edge Case 1: User Mentions .md File Only

**Request**: "Update submit-button.md to use darker colors"

**Handling**:
1. Parse component name: `submit-button`
2. Check for `submit-button.uxm` (ALWAYS start with UXM, not .md)
3. If `.uxm` exists: Enter copy-on-update mode
4. Create `submit-button-v2.uxm` AND `submit-button-v2.md`
5. Apply color changes to BOTH files
6. Inform user: "Updated both submit-button-v2.uxm and .md (UXM-first approach)"

**Why**: UXM file is source of truth. Changes to .md alone would break synchronization.

### Edge Case 2: Multiple Rapid Updates

**Requests**:
1. User: "Enhance button to detailed fidelity"
2. User: "Now enhance to production fidelity"

**Handling**:
1. First request: Create `button-v2.uxm` (detailed fidelity)
2. Second request:
   - Find highest version (v2)
   - Create `button-v3.uxm` (production fidelity)
   - Base v3 on v2 content

**Result**: Three versions exist (original, v2, v3), each preserved.

**Note**: If user says "Add hover state" then "Add focus state", component-expander handles this with in-place updates (NO versioning).

### Edge Case 3: Version Number Gaps

**Scenario**: `button.uxm` exists, `button-v3.uxm` exists, but `button-v2.uxm` is missing

**Handling**:
1. Find ALL versions: v1 (original), v3
2. MAX(versions) = 3
3. Next version = 4
4. Create `button-v4.uxm`

**Result**: Gaps in sequence are acceptable. Always use MAX+1.

### Edge Case 4: Mixing Versioned and Original References

**Scenario**: User creates `button-v2`, then says "enhance button to production"

**Handling**:
1. "enhance button" likely refers to latest version
2. Check for highest version: v2
3. Base new version (v3) on v2
4. User can explicitly reference: "enhance button-v1 to production" if they want original

**Guideline**: Default to highest version when ambiguous.

---

## Integration with Skills

### For component-creator

**Load this module**: ✅ Yes

**When to use**:
- Before invoking designer agent
- Check if `./fluxwing/components/{component-id}.uxm` exists
- If exists: Ask user, offer copy-on-update
- If creating version: Pass base component info to agent

**Agent prompt addition**:
```
If creating versioned copy:
1. Read existing {component-id}.uxm
2. Find highest version using algorithm above
3. Generate new ID: {component-id}-v{N+1}
4. Copy content from source version
5. Apply requested changes
6. Update metadata (created, modified, version)
7. Save as {component-id}-v{N+1}.uxm and .md
```

### For screen-scaffolder

**Load this module**: ✅ Yes

**When to use**:
- Before Phase 1 (component creation)
- Check if `./fluxwing/screens/{screen-name}.uxm` exists
- If exists: Ask user, offer copy-on-update
- If creating version: Pass to composer agent

**Agent prompt addition**:
```
If creating versioned screen:
1. Read existing {screen-name}.uxm
2. Find highest version
3. Generate new ID: {screen-name}-v{N+1}
4. Create THREE files:
   - {screen-name}-v{N+1}.uxm
   - {screen-name}-v{N+1}.md
   - {screen-name}-v{N+1}.rendered.md
5. All files use same version suffix
```

### For enhancer

**Load this module**: ✅ Yes

**When to use**:
- Always use copy-on-update for fidelity enhancements
- Each fidelity level creates new version
- Original fidelity preserved

**Agent prompt addition**:
```
When enhancing component:
1. Read current {component-id}.uxm
2. Note current fidelity level
3. Find highest version
4. Create {component-id}-v{N+1}.uxm and .md
5. Apply fidelity enhancements to new version
6. Update metadata.fidelity field
7. Update metadata.version (increment minor)
8. DO NOT overwrite original
```

### For component-expander

**Load this module**: ❌ **NO - Do not load**

**Reason**: component-expander uses in-place updates. Adding states enhances the same component ID, not creating a new version.

**Keep existing behavior**:
```
When adding states:
1. Read {component-name}.uxm
2. Modify in place (same file)
3. Add new states to behavior.states array
4. Append state sections to .md file
5. Update metadata.modified timestamp
6. Save (overwrite existing files)
```

---

## Validation Checklist

After creating versioned copy, verify:

- [ ] Filename has `-v{N}` suffix (e.g., `submit-button-v2.uxm`)
- [ ] `id` field matches filename (e.g., `"id": "submit-button-v2"`)
- [ ] `version` field incremented correctly (e.g., `1.0.0` → `1.1.0`)
- [ ] `metadata.created` preserved from original
- [ ] `metadata.modified` set to current timestamp
- [ ] Both `.uxm` and `.md` created with same version suffix
- [ ] For screens: All three files created (`.uxm`, `.md`, `.rendered.md`)
- [ ] Original files unchanged
- [ ] JSON schema validation passes
- [ ] Variables match between `.uxm` and `.md`

---

## Quick Reference

### Version Suffix Rules

| Item | Format | Example |
|------|--------|---------|
| Original filename | `{name}.uxm` | `button.uxm` |
| Original ID | `{name}` | `button` |
| Original version | `1.0.0` | `1.0.0` |
| First copy filename | `{name}-v2.uxm` | `button-v2.uxm` |
| First copy ID | `{name}-v2` | `button-v2` |
| First copy version | `1.1.0` | `1.1.0` |
| Second copy filename | `{name}-v3.uxm` | `button-v3.uxm` |
| Second copy ID | `{name}-v3` | `button-v3` |
| Second copy version | `1.2.0` | `1.2.0` |

### Skills Decision Tree

```
User requests modification
    │
    ├─ "Add hover/focus/disabled state"
    │   └─ Use component-expander
    │       └─ In-place update (NO versioning)
    │
    ├─ "Enhance to X fidelity"
    │   └─ Use enhancer
    │       └─ Copy-on-update (create v2)
    │
    ├─ "Create component" (exists)
    │   └─ Use component-creator
    │       └─ Ask user, offer copy-on-update
    │
    ├─ "Create screen" (exists)
    │   └─ Use screen-scaffolder
    │       └─ Ask user, offer copy-on-update
    │
    └─ "Update/modify .md file"
        └─ Any skill
            └─ UXM-first, then copy-on-update
```

---

## Examples

### Example 1: Enhance Component Fidelity

**User request**: "Enhance button to production fidelity"

**Current state**:
- `button.uxm` exists (v1.0.0, fidelity=sketch)
- `button.md` exists

**Process**:
1. Parse name: `button`
2. Check existence: `button.uxm` exists ✓
3. Find versions: Only original (v1) exists
4. Next version: v2
5. Create: `button-v2.uxm` and `button-v2.md`
6. Copy content from `button.uxm`
7. Update:
   - `id`: `button` → `button-v2`
   - `version`: `1.0.0` → `1.1.0`
   - `metadata.fidelity`: `sketch` → `production`
   - `metadata.modified`: current timestamp
   - `metadata.created`: preserve from original
8. Apply production-level enhancements
9. Validate both files

**Result**:
- `button.uxm` unchanged (v1.0.0, sketch)
- `button-v2.uxm` created (v1.1.0, production)
- `button-v2.md` created
- User message: "Enhanced button → button-v2 (fidelity: production). Original preserved."

### Example 2: Create Existing Screen

**User request**: "Create a login screen"

**Current state**:
- `login-screen.uxm` exists (v1.0.0)
- `login-screen.md` exists
- `login-screen.rendered.md` exists

**Process**:
1. Parse name: `login-screen`
2. Check existence: `login-screen.uxm` exists ✓
3. Ask user:
   ```
   Screen 'login-screen' already exists (v1.0.0).

   Options:
   (a) Create new version (login-screen-v2)
   (b) Create with different name
   (c) Cancel operation

   What would you like to do?
   ```
4. User chooses: (a) Create new version
5. Find versions: Only original (v1) exists
6. Next version: v2
7. Create THREE files:
   - `login-screen-v2.uxm`
   - `login-screen-v2.md`
   - `login-screen-v2.rendered.md`
8. Copy and update metadata
9. Apply any requested changes

**Result**:
- Original files unchanged
- Three new files created with `-v2` suffix
- User message: "Created login-screen-v2. Original login-screen preserved."

### Example 3: User Mentions .md Only

**User request**: "Update button.md to use Unicode box drawing"

**Current state**:
- `button.uxm` exists (v1.0.0)
- `button.md` exists (ASCII box drawing)

**Process**:
1. Parse name: `button` (strip .md extension)
2. **UXM-first**: Check `button.uxm` exists ✓
3. Find versions: Only original exists
4. Next version: v2
5. Create: `button-v2.uxm` AND `button-v2.md`
6. Apply Unicode box drawing to `.md`
7. Update `.uxm` metadata

**Result**:
- Both `button-v2.uxm` and `button-v2.md` created
- User message: "Updated both button-v2.uxm and .md with Unicode box drawing (UXM-first approach). Original preserved."

---

## Troubleshooting

### Issue: Can't find highest version

**Symptom**: Multiple versions exist but algorithm fails

**Debug**:
```bash
# List all versions
ls -1 ./fluxwing/components/button*.uxm
# Should show: button.uxm, button-v2.uxm, button-v3.uxm

# Test regex extraction
for f in ./fluxwing/components/button-v*.uxm; do
  echo "$f" | grep -oP 'v\K\d+'
done
# Should output: 2, 3
```

**Fix**: Ensure version suffix matches pattern `-v{digits}` exactly.

### Issue: Version number collision

**Symptom**: Two processes create same version number

**Prevention**: Always re-check highest version immediately before creating new file.

**Recovery**: If collision occurs, increment again and retry.

### Issue: Metadata.created not preserved

**Symptom**: New version has different created timestamp

**Fix**: Always read original's `metadata.created` and copy to new version.

```bash
# Extract created timestamp from original
originalCreated=$(jq -r '.metadata.created' ./fluxwing/components/button.uxm)

# Use in new version
jq --arg created "$originalCreated" '.metadata.created = $created' button-v2.uxm
```

---

## Summary

**Copy-on-update ensures**:
- ✅ Non-destructive editing
- ✅ Component history preserved
- ✅ Clear version progression
- ✅ UXM-first consistency
- ✅ User awareness and control

**Remember**:
- Start with UXM, even if user mentions .md
- Always ask user when component/screen exists
- Increment minor version automatically
- Preserve created timestamp
- Update modified timestamp
- Create matching .uxm and .md files together

---

**End of Copy-on-Update Versioning Pattern Documentation**
