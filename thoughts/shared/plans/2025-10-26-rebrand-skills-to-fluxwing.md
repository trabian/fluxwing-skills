# Rebrand Skills from UXscii to Fluxwing Implementation Plan

## Overview

Rebrand all 6 Claude Code skills from "uxscii-*" prefix to "fluxwing-*" prefix to correctly distinguish the tool (Fluxwing) from the standard (uxscii). Additionally, optimize skill descriptions to ensure priority activation when working with `.uxm` files.

**Rationale**:
- Fluxwing = The AI tool/agent system
- uxscii = The file format standard (like JSON)
- Skills represent the tool capabilities, not the standard itself

## Current State Analysis

### Existing Skills (6 total)
1. `uxscii-component-creator` → Creates new uxscii components
2. `uxscii-library-browser` → Browses available templates
3. `uxscii-component-expander` → Adds states to components
4. `uxscii-screen-scaffolder` → Builds complete screens
5. `uxscii-component-viewer` → Views component details
6. `uxscii-screenshot-importer` → Converts screenshots to uxscii

### Files Requiring Changes
- **Skill directories**: 6 directories in `.claude/skills/`
- **SKILL.md frontmatter**: 6 files (name field)
- **SKILL.md descriptions**: 6 files (add .uxm triggers)
- **Documentation**: README.md, CLAUDE.md, TODO.md, INSTALL.md
- **Scripts**: install.sh, uninstall.sh
- **Cross-references**: Multiple internal references between docs

### Key Discoveries

**Claude Code Activation Mechanism**:
- No file-extension-specific activation exists
- Skills activate based on description keyword matching
- To prioritize for `.uxm` files, must include explicit triggers in descriptions
- Multiple mentions increase activation reliability

**Naming Strategy**:
- Keep descriptive full names: `fluxwing-component-creator` (not `fluxwing-creator`)
- Maintains clarity and self-documentation
- Follows Claude Code naming conventions

## Desired End State

### New Skill Names
1. `fluxwing-component-creator`
2. `fluxwing-library-browser`
3. `fluxwing-component-expander`
4. `fluxwing-screen-scaffolder`
5. `fluxwing-component-viewer`
6. `fluxwing-screenshot-importer`

### Enhanced Descriptions (with .uxm triggers)

Each description will include aggressive .uxm file triggers:

**Pattern**: `[Core function] when user wants to [action]. Use when working with .uxm files, when user mentions .uxm components, or when [specific context].`

**Examples**:
- Component Creator: "Create uxscii components with ASCII art and structured metadata when user wants to create, build, or design UI components. Use when working with .uxm files, when user mentions .uxm components, or when creating buttons, inputs, cards, forms, modals, or navigation."
- Library Browser: "Browse and view all available uxscii components including bundled templates, user components, and screens. Use when working with .uxm files, when user wants to see, list, browse, or search .uxm components or screens."

### Verification Criteria

After implementation:
- [ ] All 6 skill directories renamed
- [ ] No references to old `uxscii-*` skill names in documentation
- [ ] Installation script installs `fluxwing-*` skills
- [ ] Uninstallation script removes `fluxwing-*` skills
- [ ] All skill descriptions include .uxm file triggers
- [ ] Internal references to "uxscii standard" preserved (it's the format standard)
- [ ] Skills activate reliably when user mentions .uxm files

## What We're NOT Doing

- NOT changing references to "uxscii standard" (it's the format name, like JSON)
- NOT changing .uxm file extension (part of uxscii standard)
- NOT changing the `./fluxwing/` output directory (already correct)
- NOT adding backward compatibility notes for old skill names
- NOT changing template file formats or schemas

## Implementation Approach

**Strategy**: Rename in place with comprehensive find-replace, then verify all cross-references.

**Order of Operations**:
1. Rename physical skill directories
2. Update SKILL.md frontmatter (name + description)
3. Update repository documentation (README, CLAUDE, TODO, INSTALL)
4. Update installation/uninstallation scripts
5. Verify all cross-references
6. Test installation workflow

---

## Phase 1: Rename Skill Directories

### Overview
Rename all 6 skill directories from `uxscii-*` to `fluxwing-*` prefix.

### Changes Required

#### 1. Rename Skill Directories

**Location**: `.claude/skills/`

**Commands**:
```bash
cd .claude/skills/

# Rename all 6 skill directories
mv uxscii-component-creator fluxwing-component-creator
mv uxscii-library-browser fluxwing-library-browser
mv uxscii-component-expander fluxwing-component-expander
mv uxscii-screen-scaffolder fluxwing-screen-scaffolder
mv uxscii-component-viewer fluxwing-component-viewer
mv uxscii-screenshot-importer fluxwing-screenshot-importer
```

**Verification**:
```bash
# Should show 6 directories starting with fluxwing-
ls -d fluxwing-*/

# Should show 0 directories starting with uxscii-
ls -d uxscii-*/ 2>/dev/null || echo "No uxscii- directories found (expected)"
```

### Success Criteria

#### Automated Verification:
- [ ] All 6 directories renamed: `ls .claude/skills/fluxwing-*/ | wc -l` returns 6
- [ ] No old directories remain: `ls .claude/skills/uxscii-*/ 2>&1 | grep -c "No such file"` returns 1
- [ ] All SKILL.md files exist: `ls .claude/skills/fluxwing-*/SKILL.md | wc -l` returns 6

#### Manual Verification:
- [ ] Directory structure looks correct in file browser
- [ ] No broken symlinks or references

---

## Phase 2: Update SKILL.md Frontmatter

### Overview
Update the `name` and `description` fields in all 6 SKILL.md files to reflect new naming and add .uxm file triggers.

### Changes Required

#### 1. fluxwing-component-creator/SKILL.md

**File**: `.claude/skills/fluxwing-component-creator/SKILL.md`

**Old frontmatter**:
```yaml
---
name: UXscii Component Creator
description: Create uxscii components with ASCII art and structured metadata when user wants to create, build, or design UI components like buttons, inputs, cards, forms, modals, or navigation
version: 1.0.0
author: Trabian
allowed-tools: Read, Write, Edit, Glob, Grep, Task, TodoWrite, Bash
---
```

**New frontmatter**:
```yaml
---
name: Fluxwing Component Creator
description: Create uxscii components with ASCII art and structured metadata when user wants to create, build, or design UI components. Use when working with .uxm files, when user mentions .uxm components, or when creating buttons, inputs, cards, forms, modals, or navigation.
version: 1.0.0
author: Trabian
allowed-tools: Read, Write, Edit, Glob, Grep, Task, TodoWrite, Bash
---
```

#### 2. fluxwing-library-browser/SKILL.md

**File**: `.claude/skills/fluxwing-library-browser/SKILL.md`

**Old frontmatter**:
```yaml
---
name: UXscii Library Browser
description: Browse and view all available uxscii components including bundled templates, user components, and screens when user wants to see, list, browse, or search components
version: 1.0.0
author: Trabian
allowed-tools: Read, Glob, Grep
---
```

**New frontmatter**:
```yaml
---
name: Fluxwing Library Browser
description: Browse and view all available uxscii components including bundled templates, user components, and screens. Use when working with .uxm files, when user wants to see, list, browse, or search .uxm components or screens.
version: 1.0.0
author: Trabian
allowed-tools: Read, Glob, Grep
---
```

#### 3. fluxwing-component-expander/SKILL.md

**File**: `.claude/skills/fluxwing-component-expander/SKILL.md`

**Old frontmatter**:
```yaml
---
name: UXscii Component Expander
description: Add interaction states like hover, focus, disabled, active, error to existing uxscii components when user wants to expand, enhance, or add states to components
version: 1.0.0
author: Trabian
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---
```

**New frontmatter**:
```yaml
---
name: Fluxwing Component Expander
description: Add interaction states like hover, focus, disabled, active, error to existing uxscii components. Use when working with .uxm files, when user wants to expand, enhance, or add states to .uxm components.
version: 1.0.0
author: Trabian
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---
```

#### 4. fluxwing-screen-scaffolder/SKILL.md

**File**: `.claude/skills/fluxwing-screen-scaffolder/SKILL.md`

**Old frontmatter**:
```yaml
---
name: UXscii Screen Scaffolder
description: Build complete UI screens by composing multiple components when user wants to create, scaffold, or build screens like login, dashboard, profile, settings, checkout pages
version: 1.0.0
author: Trabian
allowed-tools: Read, Write, Glob, Grep, Task, TodoWrite
---
```

**New frontmatter**:
```yaml
---
name: Fluxwing Screen Scaffolder
description: Build complete UI screens by composing multiple uxscii components. Use when working with .uxm files, when user wants to create, scaffold, or build .uxm screens like login, dashboard, profile, settings, or checkout pages.
version: 1.0.0
author: Trabian
allowed-tools: Read, Write, Glob, Grep, Task, TodoWrite
---
```

#### 5. fluxwing-component-viewer/SKILL.md

**File**: `.claude/skills/fluxwing-component-viewer/SKILL.md`

**Old frontmatter**:
```yaml
---
name: UXscii Component Viewer
description: View detailed information about a specific uxscii component including metadata, states, props, and ASCII preview when user wants to see, view, inspect, or get details about a component
version: 1.0.0
author: Trabian
allowed-tools: Read, Glob, Grep
---
```

**New frontmatter**:
```yaml
---
name: Fluxwing Component Viewer
description: View detailed information about a specific uxscii component including metadata, states, props, and ASCII preview. Use when working with .uxm files, when user wants to see, view, inspect, or get details about a .uxm component.
version: 1.0.0
author: Trabian
allowed-tools: Read, Glob, Grep
---
```

#### 6. fluxwing-screenshot-importer/SKILL.md

**File**: `.claude/skills/fluxwing-screenshot-importer/SKILL.md`

**Old frontmatter**:
```yaml
---
name: UXscii Screenshot Importer
description: Import UI screenshots and generate uxscii components automatically using vision analysis when user wants to import, convert, or generate components from screenshots or images
version: 1.0.0
author: Trabian
allowed-tools: Read, Write, Task, TodoWrite, Glob
---
```

**New frontmatter**:
```yaml
---
name: Fluxwing Screenshot Importer
description: Import UI screenshots and generate uxscii components automatically using vision analysis. Use when user wants to import, convert, or generate .uxm components from screenshots or images.
version: 1.0.0
author: Trabian
allowed-tools: Read, Write, Task, TodoWrite, Glob
---
```

### Success Criteria

#### Automated Verification:
- [ ] All frontmatter valid YAML: `for f in .claude/skills/fluxwing-*/SKILL.md; do head -n 7 "$f" | python -c "import sys, yaml; yaml.safe_load(sys.stdin)" || echo "YAML error in $f"; done`
- [ ] All names updated: `grep -h "^name:" .claude/skills/fluxwing-*/SKILL.md | grep -c "Fluxwing"` returns 6
- [ ] All descriptions include .uxm: `grep -h "^description:" .claude/skills/fluxwing-*/SKILL.md | grep -c ".uxm"` returns 6
- [ ] No old names remain: `grep -h "^name:" .claude/skills/fluxwing-*/SKILL.md | grep -c "UXscii"` returns 0

#### Manual Verification:
- [ ] Each description reads naturally
- [ ] .uxm triggers are prominent and clear
- [ ] Skill purposes remain accurate

---

## Phase 3: Update SKILL.md Body Headers

### Overview
Update the main H1 headers in each SKILL.md file to match the new skill names.

### Changes Required

#### Update all 6 SKILL.md files

For each file in `.claude/skills/fluxwing-*/SKILL.md`:

**Pattern**:
- Old: `# UXscii [Skill Name]`
- New: `# Fluxwing [Skill Name]`

**Files to update**:
1. `fluxwing-component-creator/SKILL.md`: `# UXscii Component Creator` → `# Fluxwing Component Creator`
2. `fluxwing-library-browser/SKILL.md`: `# UXscii Library Browser` → `# Fluxwing Library Browser`
3. `fluxwing-component-expander/SKILL.md`: `# UXscii Component Expander` → `# Fluxwing Component Expander`
4. `fluxwing-screen-scaffolder/SKILL.md`: `# UXscii Screen Scaffolder` → `# Fluxwing Screen Scaffolder`
5. `fluxwing-component-viewer/SKILL.md`: `# UXscii Component Viewer` → `# Fluxwing Component Viewer`
6. `fluxwing-screenshot-importer/SKILL.md`: `# UXscii Screenshot Importer` → `# Fluxwing Screenshot Importer`

### Success Criteria

#### Automated Verification:
- [ ] All headers updated: `grep -h "^# Fluxwing" .claude/skills/fluxwing-*/SKILL.md | wc -l` returns 6
- [ ] No old headers remain: `grep -h "^# UXscii" .claude/skills/fluxwing-*/SKILL.md | wc -l` returns 0

#### Manual Verification:
- [ ] Headers match frontmatter names
- [ ] No broken markdown formatting

---

## Phase 4: Update Repository Documentation

### Overview
Update all repository-level documentation to reflect the new skill names.

### Changes Required

#### 1. README.md

**File**: `README.md`

**Changes**:
- Line 55: `The **uxscii-component-creator** skill` → `The **fluxwing-component-creator** skill`
- Line 63: `The **uxscii-library-browser** skill` → `The **fluxwing-library-browser** skill`
- Line 70: `The **uxscii-screen-scaffolder** skill` → `The **fluxwing-screen-scaffolder** skill`
- Line 82: `The **uxscii-component-expander** skill` → `The **fluxwing-component-expander** skill`
- Lines 88-95 (table): Replace all `uxscii-*` with `fluxwing-*` in skill names column

**Table update** (Lines 88-95):
```markdown
| Skill | Triggers | Purpose |
|-------|----------|---------|
| **fluxwing-component-creator** | "Create a button", "I need an input component" | Create new components (buttons, inputs, cards, etc.) |
| **fluxwing-library-browser** | "Show me all components", "Browse the library" | Browse available templates and user components |
| **fluxwing-component-expander** | "Add hover state", "Make this interactive" | Add states to existing components |
| **fluxwing-screen-scaffolder** | "Create a login screen", "Build a dashboard" | Build complete screens from components |
| **fluxwing-component-viewer** | "Show me the submit-button", "View details" | View component details and metadata |
| **fluxwing-screenshot-importer** | "Import this screenshot", "Convert screenshot" | Convert screenshots to uxscii components |
```

- Line 153: `.claude/skills/{skill-name}/` (no change - pattern is correct)
- Lines 292-297: Update skill directory references in documentation section

**Documentation section update**:
```markdown
### Skill Documentation
Each skill includes its own documentation:
- `.claude/skills/{skill-name}/SKILL.md` - Skill workflow and instructions
- `.claude/skills/{skill-name}/docs/` - Modular documentation modules
- `.claude/skills/{skill-name}/templates/` - Component templates
- `.claude/skills/{skill-name}/schemas/` - JSON Schema validation
```

#### 2. CLAUDE.md

**File**: `CLAUDE.md`

**Changes**:
- Line 22-27 (skill list): Replace all `uxscii-*` with `fluxwing-*`

```markdown
├── .claude/
│   └── skills/                 # 6 Skills (primary focus)
│       ├── fluxwing-component-creator/
│       ├── fluxwing-library-browser/
│       ├── fluxwing-component-expander/
│       ├── fluxwing-screen-scaffolder/
│       ├── fluxwing-component-viewer/
│       └── fluxwing-screenshot-importer/
```

- Lines 56-84 (Skills Overview section): Replace all `uxscii-*` with `fluxwing-*` in skill names

**Skills Overview section**:
```markdown
1. **fluxwing-component-creator** - Create new components (buttons, inputs, cards, etc.)
   - Triggers: "Create a button", "I need an input component"
   - Uses: `general-purpose` agent with component creation instructions
   - Outputs: `./fluxwing/components/{name}.uxm` + `.md`

2. **fluxwing-library-browser** - Browse available templates and user components
   - Triggers: "Show me all components", "Browse the library"
   - Tools: Read-only (Read, Glob, Grep)
   - Searches: bundled templates, library, user components

3. **fluxwing-component-expander** - Add states to existing components
   - Triggers: "Add hover state to my button", "Make this component interactive"
   - Modifies: Existing `.uxm` and `.md` files in place
   - Adds: hover, focus, disabled, active, error states

4. **fluxwing-screen-scaffolder** - Build complete screens from components
   - Triggers: "Create a login screen", "Build a dashboard"
   - Uses: `general-purpose` agent for component creation and screen composition
   - Outputs: `./fluxwing/screens/{name}.uxm` + `.md` + `.rendered.md`

5. **fluxwing-component-viewer** - View component details
   - Triggers: "Show me the submit-button", "View component details"
   - Tools: Read-only (Read, Glob, Grep)
   - Displays: Full metadata, ASCII preview, all states

6. **fluxwing-screenshot-importer** - Convert screenshots to uxscii components
   - Triggers: "Import this screenshot", "Convert screenshot to uxscii"
   - Uses: `general-purpose` agent for vision analysis and component generation
   - Outputs: Components extracted from screenshot images
```

- Lines 283-286: Update "Fluxwing vs uxscii Naming" section

```markdown
### 1. Fluxwing vs uxscii Naming
- Skills use `fluxwing-*` prefix for skill names (the tool)
- Format uses `uxscii` standard (the language, like JSON)
- This distinguishes tool from standard
```

- Lines 320-349 (File References by Task): Replace all `uxscii-*` with `fluxwing-*`

**File References section**:
```markdown
### Creating Components
- `.claude/skills/fluxwing-component-creator/SKILL.md` - Component creation workflow
- `.claude/skills/fluxwing-component-creator/templates/` - 11 bundled templates
- `.claude/skills/fluxwing-component-creator/schemas/uxm-component.schema.json` - Validation
- `.claude/skills/fluxwing-component-creator/docs/03-component-creation.md` - Detailed guide
- `.claude/skills/fluxwing-component-creator/docs/06-ascii-patterns.md` - Box-drawing characters

### Building Screens
- `.claude/skills/fluxwing-screen-scaffolder/SKILL.md` - Screen scaffolding workflow
- `.claude/skills/fluxwing-screen-scaffolder/templates/` - 2 complete screen examples
- `.claude/skills/fluxwing-screen-scaffolder/docs/04-screen-composition.md` - Screen guide

### Browsing Library
- `.claude/skills/fluxwing-library-browser/SKILL.md` - Library browsing workflow
- `.claude/skills/fluxwing-library-browser/docs/07-examples-guide.md` - Template reference

### Expanding Components
- `.claude/skills/fluxwing-component-expander/SKILL.md` - State expansion workflow
- `.claude/skills/fluxwing-component-expander/docs/03-component-creation.md` - Creation details
- `.claude/skills/fluxwing-component-expander/docs/06-ascii-patterns.md` - ASCII patterns

### Viewing Components
- `.claude/skills/fluxwing-component-viewer/SKILL.md` - Component viewing workflow
- `.claude/skills/fluxwing-component-viewer/docs/02-core-concepts.md` - Core concepts

### Importing Screenshots
- `.claude/skills/fluxwing-screenshot-importer/SKILL.md` - Import workflow
- `.claude/skills/fluxwing-screenshot-importer/docs/` - 6 screenshot analysis guides
```

- Lines 376-383 (Natural Language Testing): Replace all `uxscii-*` with `fluxwing-*`

```markdown
### Natural Language Testing
After installing skills, test with these triggers:
1. "Create a button" → fluxwing-component-creator
2. "Show me all components" → fluxwing-library-browser
3. "Add hover state to my button" → fluxwing-component-expander
4. "Build a login screen" → fluxwing-screen-scaffolder
5. "Show me the primary-button" → fluxwing-component-viewer
6. "Import this screenshot" → fluxwing-screenshot-importer
```

#### 3. TODO.md

**File**: `TODO.md`

**Changes**:
- Lines 23-31 (The Six Skills): Replace all `uxscii-*` with `fluxwing-*`

```markdown
### The Six Skills

1. **fluxwing-component-creator** - Create new components
2. **fluxwing-library-browser** - Browse available templates
3. **fluxwing-component-expander** - Add states to components
4. **fluxwing-screen-scaffolder** - Build complete screens
5. **fluxwing-component-viewer** - View component details
6. **fluxwing-screenshot-importer** - Convert screenshots to uxscii
```

- Lines 192-197 (Quick Verification): Update grep patterns

```bash
# Check all skills exist
ls .claude/skills/fluxwing-*/SKILL.md

# Count supporting files
find .claude/skills/fluxwing-* -name "*.uxm" -o -name "*.schema.json" | wc -l

# Verify SKILL_ROOT usage
grep -r "SKILL_ROOT" .claude/skills/*/SKILL.md | head -5
```

- Lines 202-209 (Natural Language Test Prompts): Replace skill names

```markdown
### Natural Language Test Prompts
1. "Create a button" → fluxwing-component-creator
2. "Show me all components" → fluxwing-library-browser
3. "Add hover state to my button" → fluxwing-component-expander
4. "Build a login screen" → fluxwing-screen-scaffolder
5. "Show me the primary-button" → fluxwing-component-viewer
6. "Import this screenshot" → fluxwing-screenshot-importer
```

- Lines 252-259 (Test with Natural Language): Replace skill names (same as above)

#### 4. INSTALL.md

**File**: `INSTALL.md`

**Changes**:
- Line 1: `# UXscii Skills Installation Guide` → `# Fluxwing Skills Installation Guide`
- Line 3: `This guide covers installing the UXscii skills` → `This guide covers installing the Fluxwing skills`
- Line 30: `║         UXscii Skills Installer for Claude Code` → `║         Fluxwing Skills Installer for Claude Code`
- Lines 90-92 (Manual copy): Replace `uxscii-*` with `fluxwing-*`

```bash
cp -r .claude/skills/fluxwing-* ~/.claude/skills/
# or
cp -r .claude/skills/fluxwing-* .claude/skills/
```

- Line 100: `ls ~/.claude/skills/uxscii-*/SKILL.md` → `ls ~/.claude/skills/fluxwing-*/SKILL.md`
- Lines 125-142 (Manual Verification): Replace all `uxscii-*` with `fluxwing-*`

```bash
1. "Create a button"
   → Should activate fluxwing-component-creator

2. "Show me all components"
   → Should activate fluxwing-library-browser

3. "Add hover state to my button"
   → Should activate fluxwing-component-expander

4. "Build a login screen"
   → Should activate fluxwing-screen-scaffolder

5. "Show me the primary-button"
   → Should activate fluxwing-component-viewer

6. "Import this screenshot"
   → Should activate fluxwing-screenshot-importer
```

- Lines 149-156 (6 Skills): Replace all skill names

```markdown
### 6 Skills

1. **fluxwing-component-creator** - Create UI components
2. **fluxwing-library-browser** - Browse available components
3. **fluxwing-component-expander** - Add interaction states
4. **fluxwing-screen-scaffolder** - Build complete screens
5. **fluxwing-component-viewer** - View component details
6. **fluxwing-screenshot-importer** - Import from screenshots
```

- Lines 173-176 (Component Creation): Replace skill name

```markdown
You: Create a button
Claude: [Activates fluxwing-component-creator skill]
        [Creates ./fluxwing/components/button.uxm]
```

- Lines 180-183 (Library Browsing): Replace skill name

```markdown
You: Show me all components
Claude: [Activates fluxwing-library-browser skill]
        [Displays tree of bundled + user components]
```

- Lines 187-190 (State Expansion): Replace skill name

```markdown
You: Add hover state to my button
Claude: [Activates fluxwing-component-expander skill]
        [Updates button.uxm with hover state]
```

- Lines 194-197 (Screen Scaffolding): Replace skill name

```markdown
You: Build a login screen
Claude: [Activates fluxwing-screen-scaffolder skill]
        [Creates ./fluxwing/screens/login-screen.uxm]
```

- Line 212: `ls ~/.claude/skills/uxscii-*/SKILL.md` → `ls ~/.claude/skills/fluxwing-*/SKILL.md`
- Line 213: `head -n 10 ~/.claude/skills/uxscii-component-creator/SKILL.md` → `head -n 10 ~/.claude/skills/fluxwing-component-creator/SKILL.md`
- Line 214: `"Use the uxscii component creator to make a button"` → `"Use the fluxwing component creator to make a button"`
- Line 230: `ls .claude/skills/uxscii-component-creator/templates/*.uxm` → `ls .claude/skills/fluxwing-component-creator/templates/*.uxm`
- Line 265: `Removes all uxscii-* skills` → `Removes all fluxwing-* skills`
- Line 296: `Only skill files in .claude/skills/uxscii-*` → `Only skill files in .claude/skills/fluxwing-*`
- Lines 318-340 (Directory Structure): Replace all `uxscii-*` with `fluxwing-*`

```markdown
~/.claude/skills/
├── fluxwing-component-creator/
│   ├── SKILL.md
│   ├── templates/           # 11 component templates
│   ├── schemas/             # JSON Schema
│   └── docs/                # Documentation
├── fluxwing-library-browser/
│   ├── SKILL.md
│   └── docs/
├── fluxwing-component-expander/
│   ├── SKILL.md
│   └── docs/
├── fluxwing-screen-scaffolder/
│   ├── SKILL.md
│   ├── templates/           # 2 screen templates
│   └── docs/
├── fluxwing-component-viewer/
│   ├── SKILL.md
│   └── docs/
└── fluxwing-screenshot-importer/
    ├── SKILL.md
    └── docs/                # 6 screenshot docs
```

- Line 389: `Check `~/.claude/skills/uxscii-*/docs/`` → `Check `~/.claude/skills/fluxwing-*/docs/``

### Success Criteria

#### Automated Verification:
- [ ] No uxscii-skill references in README: `grep -c "uxscii-component-creator\|uxscii-library-browser\|uxscii-component-expander\|uxscii-screen-scaffolder\|uxscii-component-viewer\|uxscii-screenshot-importer" README.md` returns 0
- [ ] No uxscii-skill references in CLAUDE.md: `grep -c "uxscii-component-creator\|uxscii-library-browser\|uxscii-component-expander\|uxscii-screen-scaffolder\|uxscii-component-viewer\|uxscii-screenshot-importer" CLAUDE.md` returns 0
- [ ] No uxscii-skill references in TODO.md: `grep -c "uxscii-component-creator\|uxscii-library-browser\|uxscii-component-expander\|uxscii-screen-scaffolder\|uxscii-component-viewer\|uxscii-screenshot-importer" TODO.md` returns 0
- [ ] No uxscii-skill references in INSTALL.md: `grep -c "uxscii-component-creator\|uxscii-library-browser\|uxscii-component-expander\|uxscii-screen-scaffolder\|uxscii-component-viewer\|uxscii-screenshot-importer" INSTALL.md` returns 0
- [ ] All fluxwing-skill references consistent: `grep -o "fluxwing-[a-z-]*" README.md CLAUDE.md TODO.md INSTALL.md | sort -u | wc -l` returns 6

#### Manual Verification:
- [ ] Documentation reads naturally
- [ ] No broken internal links
- [ ] Examples and usage instructions clear
- [ ] References to "uxscii standard" preserved (it's the format name)

---

## Phase 5: Update Installation Scripts

### Overview
Update install.sh and uninstall.sh to work with new `fluxwing-*` skill names.

### Changes Required

#### 1. scripts/install.sh

**File**: `scripts/install.sh`

**Changes**:
- Line 4: `# Installs Fluxwing skills` (already correct, verify)
- Line 30: `║         UXscii Skills Installer for Claude Code` → `║         Fluxwing Skills Installer for Claude Code`

**Verification check** (around line 110-120):
Ensure the installer looks for `fluxwing-*` directories:
```bash
# Find all skill directories (should start with fluxwing-)
SKILLS=$(ls -d "$SOURCE_SKILLS_DIR"/fluxwing-* 2>/dev/null)
```

**Count check** (around line 140):
```bash
# Verify 6 skills installed
SKILL_COUNT=$(ls -d "$DEST_SKILLS_DIR"/fluxwing-* 2>/dev/null | wc -l | tr -d ' ')
if [ "$SKILL_COUNT" -ne 6 ]; then
    print_warning "Expected 6 skills but found $SKILL_COUNT"
fi
```

**Template validation** (around line 160):
```bash
# Check templates exist
TEMPLATE_COUNT=$(find "$SOURCE_SKILLS_DIR"/fluxwing-component-creator/templates -name "*.uxm" 2>/dev/null | wc -l | tr -d ' ')
```

**SKILL.md validation**:
```bash
for skill_dir in "$SOURCE_SKILLS_DIR"/fluxwing-*; do
    # Verify frontmatter
    if ! head -n 7 "$skill_dir/SKILL.md" | grep -q "^name: Fluxwing"; then
        print_error "Frontmatter error in $skill_dir/SKILL.md"
    fi
done
```

**Usage examples** (end of script):
```bash
# Example usage
echo ""
echo "Try these prompts:"
echo "  - 'Create a button' → fluxwing-component-creator"
echo "  - 'Show me all components' → fluxwing-library-browser"
echo "  - 'Build a login screen' → fluxwing-screen-scaffolder"
```

#### 2. scripts/uninstall.sh

**File**: `scripts/uninstall.sh`

**Changes**:
- Line 3-4: Update header comment if needed
- Line 30 (or similar): `║         UXscii Skills Uninstaller` → `║         Fluxwing Skills Uninstaller`

**Skill removal** (main uninstall logic):
```bash
# Remove fluxwing-* skills
for skill_dir in "$SKILLS_DIR"/fluxwing-*; do
    if [ -d "$skill_dir" ]; then
        rm -rf "$skill_dir"
        print_success "Removed $(basename "$skill_dir")"
    fi
done
```

**Verification after removal**:
```bash
# Verify all removed
REMAINING=$(ls -d "$SKILLS_DIR"/fluxwing-* 2>/dev/null | wc -l | tr -d ' ')
if [ "$REMAINING" -eq 0 ]; then
    print_success "All Fluxwing skills removed successfully"
else
    print_warning "Some skills may remain: $REMAINING found"
fi
```

### Success Criteria

#### Automated Verification:
- [ ] install.sh references fluxwing-*: `grep -c "fluxwing-" scripts/install.sh` returns > 0
- [ ] install.sh no uxscii-* references: `grep -c "uxscii-" scripts/install.sh` returns 0
- [ ] uninstall.sh references fluxwing-*: `grep -c "fluxwing-" scripts/uninstall.sh` returns > 0
- [ ] uninstall.sh no uxscii-* references: `grep -c "uxscii-" scripts/uninstall.sh` returns 0
- [ ] Scripts are executable: `test -x scripts/install.sh && test -x scripts/uninstall.sh && echo "OK"`

#### Manual Verification:
- [ ] Dry-run install.sh successfully: `./scripts/install.sh --dry-run` (if supported)
- [ ] Dry-run uninstall.sh successfully: `./scripts/uninstall.sh --dry-run`
- [ ] Error messages reference correct skill names

---

## Phase 6: Verify and Test Installation Workflow

### Overview
Test the complete installation and uninstallation workflow with new skill names.

### Changes Required

#### 1. Test Installation

**Commands**:
```bash
# Test local installation
./scripts/install.sh --local

# Verify all 6 skills installed
ls .claude/skills/fluxwing-*/SKILL.md

# Verify no old skills remain
! ls .claude/skills/uxscii-* 2>/dev/null

# Check frontmatter
head -n 7 .claude/skills/fluxwing-component-creator/SKILL.md | grep "^name: Fluxwing Component Creator"

# Check templates exist
ls .claude/skills/fluxwing-component-creator/templates/*.uxm | wc -l
# Should return 11

# Check schemas exist
test -f .claude/skills/fluxwing-component-creator/schemas/uxm-component.schema.json && echo "Schema found"
```

#### 2. Test Uninstallation

**Commands**:
```bash
# Test uninstallation (dry run first)
./scripts/uninstall.sh --dry-run --local

# Actual uninstall
./scripts/uninstall.sh --force --local

# Verify all removed
! ls .claude/skills/fluxwing-* 2>/dev/null && echo "All removed"

# Verify user data preserved
test -d ./fluxwing/components && echo "User components preserved"
test -d ./fluxwing/screens && echo "User screens preserved"
```

#### 3. Test Reinstallation

**Commands**:
```bash
# Reinstall
./scripts/install.sh --local --force

# Verify successful
test $(ls .claude/skills/fluxwing-*/SKILL.md | wc -l) -eq 6 && echo "Reinstall successful"
```

### Success Criteria

#### Automated Verification:
- [ ] Installation completes without errors: `./scripts/install.sh --local 2>&1 | grep -c "error" ` returns 0
- [ ] All 6 skills installed: `ls .claude/skills/fluxwing-*/SKILL.md | wc -l` returns 6
- [ ] No old skills remain: `ls .claude/skills/uxscii-* 2>&1 | grep -c "No such file"` returns 1
- [ ] Templates accessible: `ls .claude/skills/fluxwing-component-creator/templates/*.uxm | wc -l` returns 11
- [ ] Uninstallation works: `./scripts/uninstall.sh --force --local && ! ls .claude/skills/fluxwing-* 2>/dev/null`
- [ ] User data preserved after uninstall: `test -d ./fluxwing && echo "Preserved"`

#### Manual Verification:
- [ ] Installation messages clear and accurate
- [ ] No warnings about missing files
- [ ] Uninstall confirmation shows correct skill names
- [ ] User data in `./fluxwing/` untouched

---

## Phase 7: Final Verification - Skill Activation

### Overview
Verify that skills activate correctly with natural language and .uxm file mentions.

### Testing Strategy

Test in a clean Claude Code session with the skills installed.

#### 1. Natural Language Activation Tests

**Test prompts**:
```
1. "Create a button component"
   Expected: fluxwing-component-creator activates

2. "Show me all available components"
   Expected: fluxwing-library-browser activates

3. "Add a hover state to my button"
   Expected: fluxwing-component-expander activates

4. "Build a login screen"
   Expected: fluxwing-screen-scaffolder activates

5. "Show me the submit-button component"
   Expected: fluxwing-component-viewer activates

6. "Import this screenshot and create components"
   Expected: fluxwing-screenshot-importer activates
```

#### 2. .uxm File Trigger Tests

**Test prompts with explicit .uxm mentions**:
```
1. "I need to create a new .uxm file for a button"
   Expected: fluxwing-component-creator activates

2. "Show me all .uxm files in the library"
   Expected: fluxwing-library-browser activates

3. "I want to add states to this .uxm component"
   Expected: fluxwing-component-expander activates

4. "Create a .uxm screen for a dashboard"
   Expected: fluxwing-screen-scaffolder activates

5. "View the details of this .uxm component"
   Expected: fluxwing-component-viewer activates

6. "Import this screenshot as .uxm components"
   Expected: fluxwing-screenshot-importer activates
```

#### 3. File Context Tests

**Test with existing .uxm files**:
```
1. Open an existing .uxm file, then ask: "Add a disabled state to this"
   Expected: fluxwing-component-expander activates

2. In a directory with .uxm files, ask: "What components do I have?"
   Expected: fluxwing-library-browser activates

3. With a .uxm file open, ask: "Show me the full details of this component"
   Expected: fluxwing-component-viewer activates
```

### Success Criteria

#### Manual Verification:
- [ ] All 6 skills activate correctly with natural language
- [ ] Skills activate when .uxm is explicitly mentioned
- [ ] Skills activate in context of existing .uxm files
- [ ] No skill conflicts or ambiguity
- [ ] Activation is reliable across multiple invocations
- [ ] Skills complete their tasks successfully

---

## Testing Strategy

### Unit Tests
N/A - This is primarily a rename/rebrand operation with no code logic changes

### Integration Tests

**Skill Installation**:
1. Clean install from scratch
2. Install over existing uxscii-* skills (migration scenario)
3. Reinstall with --force flag
4. Uninstall and verify cleanup

**Skill Activation**:
1. Natural language triggers for each skill
2. .uxm file mention triggers
3. File context triggers (editing .uxm files)

### Manual Testing Steps

1. **Pre-Migration Snapshot**:
   - Document current installed skills: `ls ~/.claude/skills/`
   - Note any user components: `ls ./fluxwing/components/`

2. **Install New Skills**:
   ```bash
   ./scripts/install.sh --local
   ```

3. **Test Each Skill**:
   - Use natural language prompts from Phase 7
   - Verify skill activates correctly
   - Verify skill completes task successfully

4. **Test .uxm Priority**:
   - Create test .uxm file
   - Ask to "modify this file"
   - Verify Fluxwing skill activates (not generic file editing)

5. **Test Uninstall**:
   ```bash
   ./scripts/uninstall.sh --dry-run
   ./scripts/uninstall.sh --force
   ```

6. **Verify User Data Preserved**:
   - Check `./fluxwing/components/` untouched
   - Check `./fluxwing/screens/` untouched

---

## Performance Considerations

**No Performance Impact Expected** - This is a rename operation that doesn't change:
- File formats
- Schema validation logic
- Template loading
- Agent spawning patterns
- Documentation structure

**Potential Improvements**:
- More reliable skill activation with aggressive .uxm triggers
- Clearer branding distinction (tool vs. standard)

---

## Migration Notes

### For Users with Existing uxscii-* Skills

**Recommendation**: Uninstall old skills before installing new ones.

```bash
# Remove old uxscii-* skills manually
rm -rf ~/.claude/skills/uxscii-*
# Or
rm -rf .claude/skills/uxscii-*

# Install new fluxwing-* skills
./scripts/install.sh
```

**User Data Safety**: All user components in `./fluxwing/` are preserved regardless of skill installation/uninstallation.

### No Schema Changes

The .uxm file format and schema remain unchanged. All existing .uxm files continue to work without modification.

---

## References

- Original repository: `/Users/tranqy/projects/fluxwing-skills`
- Claude Code skills documentation: https://docs.claude.com/en/docs/claude-code/skills
- Skill activation best practices: Research conducted 2025-10-26

---

## Summary

This plan renames all 6 Claude Code skills from `uxscii-*` to `fluxwing-*` to correctly brand the tool (Fluxwing) separately from the standard (uxscii). It also adds aggressive .uxm file triggers to skill descriptions to ensure priority activation when working with uxscii files.

**Total Changes**:
- 6 skill directories renamed
- 6 SKILL.md files updated (frontmatter + headers)
- 4 documentation files updated (README, CLAUDE, TODO, INSTALL)
- 2 scripts updated (install.sh, uninstall.sh)
- ~150+ individual text replacements
- Enhanced skill descriptions with .uxm triggers

**Estimated Effort**: 2-3 hours for implementation + 1 hour for testing = 3-4 hours total

**Risk Level**: Low - This is a straightforward rename with no logic changes. User data is unaffected.
