# Validator Skill Migration - Remaining Tasks

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the migration of validators to skills/fluxwing-validator/ by updating remaining skill references, testing functionality, and updating documentation.

**Architecture:** Path-only updates to screen-scaffolder skill, verification that direct script calls work, installation testing, and documentation updates.

**Tech Stack:** Bash (path replacements, testing), Markdown (documentation)

**Context:** Batch 1 completed (created skill, moved files, updated component-creator). This plan covers remaining integration and verification.

---

## Task 1: Update Screen Scaffolder Path References

**Files:**
- Modify: `skills/fluxwing-screen-scaffolder/SKILL.md` (Step 5.5 validation section)

**Step 1: Find current validator references**

```bash
grep -n "validators/" skills/fluxwing-screen-scaffolder/SKILL.md
```

Expected: Shows line numbers with `../../validators/validate-screen.js` references

**Step 2: Replace validator paths**

```bash
sed -i '' 's|{SKILL_ROOT}/../../validators/|{SKILL_ROOT}/../fluxwing-validator/|g' skills/fluxwing-screen-scaffolder/SKILL.md
```

Expected: Command completes without errors

**Step 3: Verify replacements**

```bash
grep -c "fluxwing-validator" skills/fluxwing-screen-scaffolder/SKILL.md
```

Expected: Shows count of replacements (should be 1-2 references)

```bash
grep -n "fluxwing-validator/validate-screen.js" skills/fluxwing-screen-scaffolder/SKILL.md
```

Expected: Shows updated path in Step 5.5

**Step 4: Verify no old paths remain**

```bash
grep "../../validators/" skills/fluxwing-screen-scaffolder/SKILL.md
```

Expected: No output (no matches)

**Step 5: Commit**

```bash
git add skills/fluxwing-screen-scaffolder/SKILL.md
git commit -m "refactor: update screen-scaffolder to use fluxwing-validator skill

- Update validation path from ../../validators/ to ../fluxwing-validator/
- No workflow changes, just path update for Step 5.5"
```

---

## Task 2: Test Direct Mode Validator Calls

**Files:**
- Test: `skills/fluxwing-validator/validate-component.js`
- Test: `skills/fluxwing-validator/validate-batch.js`
- Test: `fluxwing/components/test-button.uxm` (should exist from previous work)

**Step 1: Test single component validation**

```bash
node skills/fluxwing-validator/validate-component.js \
  fluxwing/components/test-button.uxm \
  skills/fluxwing-component-creator/schemas/uxm-component.schema.json
```

Expected output:
```
✓ Valid: test-button
  Type: button
  Version: 1.0.0
  States: 1
  Props: 2
```

Expected: Exit code 0

**Step 2: Test batch validation**

```bash
node skills/fluxwing-validator/validate-batch.js \
  "./fluxwing/components/test-button*.uxm" \
  skills/fluxwing-component-creator/schemas/uxm-component.schema.json
```

Expected output:
```
Batch Validation Results

Total files: 4
Passed: 4
Failed: 0

Fully Passed:
  ✓ test-button
  ✓ test-button-1
  ✓ test-button-2
  ✓ test-button-3
```

Expected: Exit code 0

**Step 3: Test JSON output mode**

```bash
node skills/fluxwing-validator/validate-component.js \
  fluxwing/components/test-button.uxm \
  skills/fluxwing-component-creator/schemas/uxm-component.schema.json \
  --json | jq '.valid'
```

Expected output: `true`

**Step 4: Test bundled templates validation**

```bash
cd skills/fluxwing-validator
npm test
```

Expected output:
```
Testing Fluxwing Component Validator
...
Results: 5 passed, 0 failed
```

Expected: Exit code 0

**Step 5: Verify path resolution from another skill**

Simulate path from component-creator:

```bash
# Set SKILL_ROOT to component-creator
SKILL_ROOT="$PWD/skills/fluxwing-component-creator"

# Resolve path as skill would
VALIDATOR_PATH="${SKILL_ROOT}/../fluxwing-validator/validate-component.js"

# Test it works
node "$VALIDATOR_PATH" \
  fluxwing/components/test-button.uxm \
  skills/fluxwing-component-creator/schemas/uxm-component.schema.json
```

Expected: Validation runs successfully (same output as Step 1)

**Step 6: Document test results**

No commit - these are verification tests only.

---

## Task 3: Test Script Install

**Files:**
- Test: `scripts/install.sh`
- Test: `~/.claude/skills/fluxwing-validator/` (installation target)

**Step 1: Backup current installation (if exists)**

```bash
if [ -d ~/.claude/skills/fluxwing-validator ]; then
  mv ~/.claude/skills/fluxwing-validator ~/.claude/skills/fluxwing-validator.backup
  echo "Backed up existing installation"
fi
```

Expected: Creates backup if directory exists

**Step 2: Run installation script**

```bash
./scripts/install.sh
```

Expected output includes:
```
╔════════════════════════════════════════════════════════════╗
║         Fluxwing Skills Development Installer              ║
╚════════════════════════════════════════════════════════════╝

✓ Found 8 skills to install
...
✓ Successfully installed 8 skills
```

**Step 3: Verify validator skill installed**

```bash
ls -la ~/.claude/skills/fluxwing-validator/
```

Expected: Directory exists with all validator files

```bash
ls ~/.claude/skills/fluxwing-validator/ | sort
```

Expected output:
```
README.md
node_modules
package-lock.json
package.json
SKILL.md
test-screen-validator.js
test-validator.js
validate-batch.js
validate-component.js
validate-screen.js
```

**Step 4: Verify node_modules bundled**

```bash
du -sh ~/.claude/skills/fluxwing-validator/node_modules/
```

Expected: Shows size ~2.7M (bundled dependencies)

```bash
ls ~/.claude/skills/fluxwing-validator/node_modules/ | grep -E "ajv|glob"
```

Expected output includes:
```
ajv
ajv-formats
glob
```

**Step 5: Test validator works from installed location**

```bash
cd ~/.claude/skills/fluxwing-validator
node validate-component.js --help 2>&1 | head -5
```

Expected: Shows usage instructions (not errors)

**Step 6: Restore original installation (if backed up)**

```bash
if [ -d ~/.claude/skills/fluxwing-validator.backup ]; then
  rm -rf ~/.claude/skills/fluxwing-validator
  mv ~/.claude/skills/fluxwing-validator.backup ~/.claude/skills/fluxwing-validator
  echo "Restored original installation"
fi
```

**Step 7: Re-run install for working state**

```bash
./scripts/install.sh
```

Expected: Installation succeeds, ready for use

No commit - these are installation tests only.

---

## Task 4: Update README.md in fluxwing-validator

**Files:**
- Modify: `skills/fluxwing-validator/README.md`

**Step 1: Read current README**

```bash
head -30 skills/fluxwing-validator/README.md
```

Expected: Shows current technical documentation (from validators/)

**Step 2: Add dual-mode section at top**

Insert after title, before current content:

```markdown
# Fluxwing Validator

Deterministic validation for uxscii components and screens.

## Two Modes of Operation

### Interactive Mode (User Invocation)

When users say "Validate my components", the skill:
1. Presents menu (everything/components/screens/custom)
2. Runs appropriate validators
3. Shows minimal summary with optional details

**Example:**
```
✓ 12/14 components valid
✗ 2/14 components failed

Show error details? (yes/no)
```

### Direct Mode (Skill-to-Skill)

Other skills call validator scripts directly:
```bash
node {SKILL_ROOT}/../fluxwing-validator/validate-component.js \
  ./fluxwing/components/button.uxm \
  {SKILL_ROOT}/schemas/uxm-component.schema.json
```

Output: Always verbose (full errors, warnings, stats)
Exit codes: 0 = valid, 1 = errors, 2 = invalid args

---

## [Rest of existing README content]
```

**Step 3: Update installation section**

Find the installation section and update:

OLD:
```markdown
## Installation

Install dependencies:
```bash
npm install
```
```

NEW:
```markdown
## Installation

This skill is bundled with fluxwing-skills plugin.

**Plugin install:**
```bash
/plugin install fluxwing-skills
```

**Script install (development):**
```bash
./scripts/install.sh
```

No npm install required - dependencies bundled with skill.
```

**Step 4: Update usage section paths**

Find validator command examples and update paths:

OLD:
```bash
node validate-component.js component.uxm schema.json
```

NEW:
```bash
# From project root
node skills/fluxwing-validator/validate-component.js \
  ./fluxwing/components/component.uxm \
  skills/fluxwing-component-creator/schemas/uxm-component.schema.json

# From other skills (using SKILL_ROOT)
node {SKILL_ROOT}/../fluxwing-validator/validate-component.js \
  component.uxm \
  {SKILL_ROOT}/schemas/uxm-component.schema.json
```

**Step 5: Verify README formatting**

```bash
head -80 skills/fluxwing-validator/README.md
```

Expected: Clean markdown, dual-mode section visible, updated paths

**Step 6: Commit**

```bash
git add skills/fluxwing-validator/README.md
git commit -m "docs: update fluxwing-validator README for dual-mode operation

- Add dual-mode section (interactive vs direct)
- Update installation instructions (bundled with plugin)
- Update usage examples with correct paths
- Document that npm install not required"
```

---

## Task 5: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Find validator references in CLAUDE.md**

```bash
grep -n "validator" CLAUDE.md
```

Expected: Shows references to old validators/ location

**Step 2: Update validator location references**

Find section about validators (likely in "Repository Structure" or similar) and update:

OLD:
```markdown
validators/
├── validate-component.js
├── validate-screen.js
...
```

NEW:
```markdown
skills/fluxwing-validator/         # Validation skill
├── SKILL.md                       # Interactive validation workflow
├── validate-component.js          # Component validator
├── validate-screen.js             # Screen validator
├── validate-batch.js              # Batch validator
├── node_modules/                  # Bundled dependencies (~2.7 MB)
...
```

**Step 3: Add validator skill to skills list**

Find where skills are documented (likely after "skills/" in structure) and add:

```markdown
├── skills/                     # 8 Skills (primary focus)
│   ├── fluxwing-component-creator/
│   ├── fluxwing-library-browser/
│   ├── fluxwing-component-expander/
│   ├── fluxwing-screen-scaffolder/
│   ├── fluxwing-component-viewer/
│   ├── fluxwing-screenshot-importer/
│   ├── fluxwing-enhancer/
│   └── fluxwing-validator/        # NEW: Validation skill
```

**Step 4: Update skill count**

If document says "7 skills", update to "8 skills"

```bash
sed -i '' 's/7 Skills/8 Skills/g' CLAUDE.md
```

**Step 5: Add validator skill description**

Find skills overview section and add:

```markdown
8. **fluxwing-validator** - Validate components and screens
   - Triggers: "Validate my components", "Check if everything is valid"
   - Tools: Interactive menu or direct script calls
   - Outputs: Minimal summary with optional details (interactive) or verbose (direct)
```

**Step 6: Update validation workflow documentation**

Find references to how validation works and update:

OLD:
```markdown
Validation is done via validators/ directory scripts
```

NEW:
```markdown
Validation is done via fluxwing-validator skill:
- Interactive: User invokes skill, gets menu and minimal output
- Direct: Other skills call scripts for verbose validation
- Path: {SKILL_ROOT}/../fluxwing-validator/validate-*.js
```

**Step 7: Verify CLAUDE.md structure**

```bash
grep "fluxwing-validator" CLAUDE.md | wc -l
```

Expected: At least 3-4 references (structure, list, description, usage)

**Step 8: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for fluxwing-validator skill

- Add fluxwing-validator to skills list (8 skills total)
- Update repository structure to show validators in skills/
- Document dual-mode operation (interactive vs direct)
- Update validation workflow documentation"
```

---

## Task 6: Final Verification

**Files:**
- Verify: All skill paths
- Verify: Installation works
- Verify: Validators execute

**Step 1: Verify no old validator paths remain**

```bash
grep -r "../../validators/" skills/ 2>/dev/null || echo "No old paths found ✓"
```

Expected: "No old paths found ✓"

**Step 2: Verify all skills reference correct path**

```bash
grep -r "fluxwing-validator/" skills/ | grep -v ".git" | grep -v "node_modules"
```

Expected output includes:
```
skills/fluxwing-component-creator/SKILL.md: references to ../fluxwing-validator/
skills/fluxwing-screen-scaffolder/SKILL.md: references to ../fluxwing-validator/
skills/fluxwing-validator/SKILL.md: self-references to {SKILL_ROOT}/
```

**Step 3: Count total references**

```bash
grep -r "../fluxwing-validator/" skills/fluxwing-component-creator/ skills/fluxwing-screen-scaffolder/ | wc -l
```

Expected: 8-10 references total

**Step 4: Test validator skill exists and is complete**

```bash
ls -1 skills/fluxwing-validator/ | wc -l
```

Expected: 10 files/directories (SKILL.md, 5 .js files, 3 package files, node_modules)

**Step 5: Verify git status**

```bash
git status
```

Expected: Clean working tree (all changes committed)

**Step 6: Show commit history**

```bash
git log --oneline -8
```

Expected: Shows all commits from migration:
- validator skill creation
- SKILL.md creation
- component-creator update
- screen-scaffolder update
- README.md update
- CLAUDE.md update

No commit - this is final verification only.

---

## Success Criteria

### Functionality
- ✅ Interactive validation works with menu (SKILL.md created)
- ✅ Direct script calls from other skills work (paths updated)
- ✅ All validation modes work (tested in Task 2)

### Installation
- ✅ `./scripts/install.sh` includes validators (tested in Task 3)
- ✅ No npm install required (node_modules bundled)
- ✅ Works immediately after installation

### Integration
- ✅ component-creator validation works (paths updated in Batch 1)
- ✅ screen-scaffolder validation works (paths updated in Task 1)
- ✅ Path resolution verified (tested in Task 2)

### Documentation
- ✅ README.md updated with dual-mode docs (Task 4)
- ✅ CLAUDE.md updated with skill location (Task 5)
- ✅ No old validator references remain (Task 6)

### Git
- ✅ All changes committed
- ✅ Descriptive commit messages
- ✅ Clean working tree

---

## Notes for Engineer

**Context:**
- This continues work from Batch 1 (skill creation, file move, component-creator update)
- No code changes to validators themselves - only path updates and docs
- Validators already work correctly - just relocating them

**Testing philosophy:**
- Tasks 2-3 are verification only (no commits)
- Each test must pass before proceeding
- If test fails, stop and investigate
- Don't skip verification steps

**Path resolution:**
- `{SKILL_ROOT}` expands to skill's directory (e.g., `~/.claude/skills/fluxwing-component-creator`)
- `../fluxwing-validator` resolves to `~/.claude/skills/fluxwing-validator`
- Paths are relative between peer skills in same parent directory

**Installation:**
- `scripts/install.sh` copies entire `skills/` directory
- Validators included automatically (now in skills/)
- node_modules travels with skill (bundled)

---

**Plan Status:** Ready for execution
**Estimated Time:** 30-45 minutes
**Tasks:** 6 tasks, 30 steps total
