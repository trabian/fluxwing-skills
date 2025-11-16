# Validator Skill Design

**Date:** 2025-11-15
**Status:** Approved
**Branch:** `feat/determnistic-validation`

## Overview

Move validators from `validators/` to `skills/fluxwing-validator/` to ensure they travel with plugin installation and can be used both interactively by users and directly by other skills.

## Problem

Current state:
- Validators in `validators/` at repository root
- Not included in plugin install (only `skills/` is packaged)
- `./scripts/install.sh` only copies `skills/` directory
- Other skills reference validators via `../../validators/`
- Validators won't be available after plugin install

## Solution

Create `fluxwing-validator` skill with dual modes:
1. **Interactive mode**: User invocation with menu and minimal output
2. **Direct mode**: Script calls from other skills with verbose output

## Design

### 1. Skill Structure and Location

Move everything from `validators/` to `skills/fluxwing-validator/`:

```
skills/fluxwing-validator/
├── SKILL.md                      # Interactive validation workflow
├── validate-component.js         # Component validator
├── validate-screen.js            # Screen validator
├── validate-batch.js             # Batch validator
├── test-validator.js             # Component tests
├── test-screen-validator.js      # Screen tests
├── package.json                  # npm config with scripts
├── package-lock.json             # Locked dependencies
├── node_modules/                 # Bundled (ajv, ajv-formats, glob)
│   └── [48 packages, ~2.7 MB]
└── README.md                     # Technical documentation
```

**Benefits:**
- Validators automatically included in plugin install (in `skills/`)
- `./scripts/install.sh` copies validators (copies entire `skills/`)
- Self-contained skill with bundled dependencies
- Works immediately after installation (no npm install needed)

### 2. Dual-Mode Operation

#### Mode 1: Interactive User Invocation

**User says:** "Validate my components"

**Skill workflow:**
1. Present menu via AskUserQuestion:
   ```
   What would you like to validate?

   1. Everything in this project
   2. Just components
   3. Just screens
   4. Let me specify a file or pattern
   ```

2. Run appropriate validator based on selection
   - Everything: `validate-batch.js` for components, then screens
   - Components: `validate-batch.js ./fluxwing/components/*.uxm`
   - Screens: `validate-batch.js ./fluxwing/screens/*.uxm --screens`
   - Custom: User-provided glob pattern

3. Parse results and show minimal summary:
   ```
   ✓ 12/14 components valid
   ✗ 2/14 components failed
   ⚠ 3 warnings total

   Show error details? (yes/no)
   ```

4. If user says "yes" → display full validation output
   If user says "no" → clean exit

**Why minimal output:**
- Users don't want spam about successful files
- Quick scan: pass/fail ratio
- Optional details on demand

#### Mode 2: Direct Script Calls (Skill-to-Skill)

**Other skills call scripts directly:**

```bash
# component-creator calls validator script
node {SKILL_ROOT}/../fluxwing-validator/validate-component.js \
  ./fluxwing/components/button.uxm \
  {SKILL_ROOT}/schemas/uxm-component.schema.json
```

**Output:** Always verbose (full errors, warnings, stats)

**Why verbose output:**
- Skills need complete information to proceed/fail
- No interactive prompts during automated workflows
- Deterministic behavior
- Fast, synchronous execution

**No changes to validator scripts needed** - they already support verbose output by default.

### 3. Integration with Existing Skills

#### Component Creator

Update path references:
```bash
# Old
node {SKILL_ROOT}/../../validators/validate-component.js

# New
node {SKILL_ROOT}/../fluxwing-validator/validate-component.js
```

**Files to update:**
- `skills/fluxwing-component-creator/SKILL.md` (8 references)

**No workflow changes:**
- Still calls script directly after component creation
- Still gets verbose output automatically
- Still fails on validation errors (exit code 1)

#### Screen Scaffolder

Update path references:
```bash
# Old (Step 5.5)
node {SKILL_ROOT}/../../validators/validate-screen.js

# New
node {SKILL_ROOT}/../fluxwing-validator/validate-screen.js
```

**Files to update:**
- `skills/fluxwing-screen-scaffolder/SKILL.md` (Step 5.5)

**No workflow changes:**
- Still validates after screen composition
- Still gets verbose output with warnings
- Still checks for composed components and .rendered.md

### 4. Installation and Distribution

#### Plugin Install (Production)
```bash
/plugin install fluxwing-skills
```
- Downloads release zip from GitHub
- Release zip includes `skills/fluxwing-validator/` with bundled node_modules
- Extracts to `~/.claude/skills/`
- Works immediately (no npm install required)

#### Script Install (Development)
```bash
./scripts/install.sh
```
- Copies entire `skills/` directory to `~/.claude/skills/`
- Includes `fluxwing-validator/` with bundled node_modules
- Works immediately (no npm install required)

#### Package Creation
```bash
./scripts/package.sh
```
- Already packages entire `skills/` directory
- No changes needed - will include `fluxwing-validator/` automatically
- Bundled node_modules included in zip (~2.7 MB)

**Why bundle node_modules:**
- Works immediately after installation
- No Node.js/npm required for users
- Deterministic (locked versions)
- Simplifies installation (one step)

### 5. SKILL.md Structure

```yaml
---
name: fluxwing-validator
description: Validate uxscii components and screens against schema with interactive menu or direct script calls
version: 1.0.0
author: Fluxwing Team
allowed-tools: Read, Bash, AskUserQuestion, TodoWrite
---
```

**Workflow:**
1. Announce skill usage
2. Present menu via AskUserQuestion (4 options)
3. Detect what exists in project (components/screens)
4. Run appropriate validator(s)
5. Parse JSON output from validator
6. Show minimal summary
7. Ask: "Show error details?"
8. Display full output if requested

**Allowed tools:**
- `Read`: Check if fluxwing directories exist
- `Bash`: Run validator scripts
- `AskUserQuestion`: Present menu and prompt for details
- `TodoWrite`: Track validation progress (optional)

## Migration Plan

### Step 1: Create fluxwing-validator skill
```bash
# Create new skill directory
mkdir -p skills/fluxwing-validator

# Move all validator files
mv validators/* skills/fluxwing-validator/

# Remove old validators directory
rmdir validators
```

**Result:** All validator files now in `skills/fluxwing-validator/`

### Step 2: Create SKILL.md (interactive mode)

Create `skills/fluxwing-validator/SKILL.md` with:
- YAML frontmatter
- Interactive menu implementation
- Validation workflows for each option
- Minimal output + optional details prompt

**Tools used:**
- AskUserQuestion for menu (multiSelect: false)
- Bash to run `validate-batch.js --json`
- Parse JSON output to generate summary
- AskUserQuestion to ask about showing details

### Step 3: Update skill references (path changes only)

**component-creator:**
```bash
# Find and replace in SKILL.md
../../validators/ → ../fluxwing-validator/
```

**screen-scaffolder:**
```bash
# Find and replace in SKILL.md
../../validators/ → ../fluxwing-validator/
```

**No workflow changes** - just path updates

### Step 4: Test both modes

**Test interactive mode:**
```
User: "Validate my components"
→ Menu appears
→ Select option
→ See minimal summary
→ Answer details prompt
```

**Test direct mode:**
```bash
# component-creator creates component
# Calls validator script directly
# Gets verbose output
# Proceeds or fails based on exit code
```

**Test installation:**
```bash
# Test script install
./scripts/install.sh
ls ~/.claude/skills/fluxwing-validator/

# Test package creation
./scripts/package.sh
unzip -l dist/fluxwing-skills-v*.zip | grep fluxwing-validator
```

### Step 5: Update documentation

**Update `skills/fluxwing-validator/README.md`:**
- Document both modes (interactive vs direct)
- Script usage examples
- npm scripts reference

**Update `CLAUDE.md`:**
- New skill location: `skills/fluxwing-validator/`
- How other skills reference validators
- Installation includes validators automatically

## Success Criteria

### Functionality
- ✅ Interactive validation works with menu
- ✅ Minimal output + optional details prompt works
- ✅ Direct script calls from other skills work unchanged
- ✅ All validation modes work (components, screens, batch)

### Installation
- ✅ `./scripts/install.sh` includes validators
- ✅ Plugin install includes validators
- ✅ No npm install required (bundled node_modules)
- ✅ Works immediately after installation

### Integration
- ✅ component-creator validation still works
- ✅ screen-scaffolder validation still works
- ✅ Path updates work: `../fluxwing-validator/validate-*.js`

### Backwards Compatibility
- ✅ No breaking changes to validator behavior
- ✅ Verbose output preserved for script calls
- ✅ Exit codes unchanged (0=valid, 1=errors)
- ✅ JSON output mode works

## Edge Cases

### No fluxwing directory exists
Interactive mode: "No components or screens found. Create some first!"

### Empty directories
Show: "✓ 0/0 components valid" (not an error)

### Permission errors on node execution
Skill shows clear error: "Cannot execute validator. Node.js required."

### Invalid glob pattern (custom option)
Validate pattern before running, show: "No files match pattern"

## Future Enhancements

### Optional additions (not in initial implementation):
- CI/CD mode: Exit code from skill matches validation results
- Watch mode: Re-validate on file changes
- Fix suggestions: "Error: missing fidelity → Add 'fidelity: detailed' to line 12"
- Custom validation rules: User-defined schema extensions

## Technical Notes

### Path Resolution
Other skills use `{SKILL_ROOT}/../fluxwing-validator/validate-component.js`

Example resolution:
```
{SKILL_ROOT} = ~/.claude/skills/fluxwing-component-creator
../fluxwing-validator = ~/.claude/skills/fluxwing-validator
Full path = ~/.claude/skills/fluxwing-validator/validate-component.js
```

### Bundled Dependencies
```json
{
  "dependencies": {
    "ajv": "^8.12.0",           // JSON Schema validator
    "ajv-formats": "^2.1.1",    // Format validation (date-time, etc)
    "glob": "^10.3.10"          // File pattern matching
  }
}
```

Total size: ~2.7 MB (48 packages)

### npm Scripts Preserved
```json
{
  "scripts": {
    "test": "node test-validator.js",
    "test:screens": "node test-screen-validator.js",
    "validate:components": "node validate-batch.js '../fluxwing/components/*.uxm' '../fluxwing-component-creator/schemas/uxm-component.schema.json'",
    "validate:screens": "node validate-batch.js '../fluxwing/screens/*.uxm' '../fluxwing-component-creator/schemas/uxm-component.schema.json' --screens",
    "validate:all": "npm run validate:components && npm run validate:screens"
  }
}
```

---

**Design Status:** Approved and ready for implementation
**Next Step:** Execute migration plan
