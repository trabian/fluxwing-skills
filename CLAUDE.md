# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fluxwing Skills** is a Claude Code skills system that enables AI-native UX design using the **uxscii standard**. This repository contains skills that allow Claude to create, validate, and compose UI designs through natural language using ASCII art and structured JSON metadata.

**Key Distinction**:
- **Fluxwing** = The AI bot/agent system (the tool)
- **uxscii** = The standard format (the language)
- Think: Figma vs HTML/CSS

**Development Location**: This repository (`fluxwing-skills`) is the development location for six Claude Code skills packaged as a Claude Code plugin.

## Repository Structure

```
fluxwing-skills/                # Repository root (Claude Code Plugin)
├── .claude-plugin/
│   ├── marketplace.json        # Plugin marketplace catalog
│   └── plugin.json             # Plugin manifest
├── skills/                     # 6 Skills (primary focus)
│   ├── fluxwing-component-creator/
│   ├── fluxwing-library-browser/
│   ├── fluxwing-component-expander/
│   ├── fluxwing-screen-scaffolder/
│   ├── fluxwing-component-viewer/
│   └── fluxwing-screenshot-importer/
├── scripts/
│   ├── install.sh              # Development installation script
│   └── uninstall.sh            # Skills removal script
├── .gitignore
├── CLAUDE.md                   # This file
├── INSTALL.md                  # Installation guide
├── LICENSE
├── package.json                # Minimal metadata
├── README.md                   # User-facing overview
└── TODO.md                     # Development tasks
```

## Core Architecture - Skills System

### The Two-File System

Every uxscii component consists of **two files**:

1. **`.uxm` file** (JSON metadata) - Component structure, behavior, props, accessibility
2. **`.md` file** (ASCII template) - Visual representation with `{{variable}}` placeholders

Screens add a third file:
3. **`.rendered.md`** (Example with REAL data) - Shows actual visual intent, not just templates

### Skills Overview

The seven skills handle different aspects of UX design:

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

4. **fluxwing-enhancer** - Enhance components from sketch to production fidelity
   - Triggers: "Enhance this component", "Add detail to this component"
   - Modifies: Existing `.uxm` and `.md` files in place
   - Adds: Visual polish, detail, and production-ready refinement

5. **fluxwing-screen-scaffolder** - Build complete screens from components
   - Triggers: "Create a login screen", "Build a dashboard"
   - Uses: `general-purpose` agent for component creation and screen composition
   - Outputs: `./fluxwing/screens/{name}.uxm` + `.md` + `.rendered.md`

6. **fluxwing-component-viewer** - View component details
   - Triggers: "Show me the submit-button", "View component details"
   - Tools: Read-only (Read, Glob, Grep)
   - Displays: Full metadata, ASCII preview, all states

7. **fluxwing-screenshot-importer** - Convert screenshots to uxscii components
   - Triggers: "Import this screenshot", "Convert screenshot to uxscii"
   - Uses: `general-purpose` agent for vision analysis and component generation
   - Outputs: Components extracted from screenshot images

### Data Location Philosophy

**Critical Distinction**: Skills have READ-ONLY bundled templates and READ-WRITE project workspace:

#### Skill Bundled Data (READ-ONLY)
```
skills/{skill-name}/            # Within each skill directory
├── templates/                  # Component templates (READ-ONLY)
├── schemas/                    # JSON Schema validation rules
└── docs/                       # Documentation modules
```

**These files are:**
- ✅ READ-ONLY reference materials
- ✅ Pre-validated and tested
- ✅ Bundled with skill installation
- ❌ NEVER modified by skills or agents
- ❌ NEVER written to by user

#### Project Workspace (READ-WRITE)
```
./fluxwing/                     # In user's project - ALL outputs go here
├── components/                 # User/agent-created components (.uxm + .md)
├── screens/                    # User/agent-created screens (.uxm + .md + .rendered.md)
└── library/                    # Customized copies of bundled templates
```

**These files are:**
- ✅ User's project files
- ✅ Fully editable
- ✅ Version controlled with user's code
- ✅ Where ALL skill/agent outputs go

### The Golden Rules

1. **READ from bundled templates**: Reference `{SKILL_ROOT}/templates/` for patterns
2. **WRITE to project workspace**: All outputs go to `./fluxwing/`
3. **NEVER mix**: Never write to skill directory, never assume skill files are editable
4. **Inventory check order**: components → library → bundled templates (preference for user files)
5. **Git operations**: Never add claude code attribution to commits or prs

## Development Workflows

### Installing Skills (Production)

```bash
# Recommended: Install via Claude Code plugin system
/plugin marketplace add trabian/fluxwing-skills
/plugin install fluxwing-skills
```

### Installing Skills (Development)

For local development and testing:

```bash
# Auto-detect installation location (local project vs global)
./scripts/install.sh

# Force global installation
./scripts/install.sh --global

# Force local project installation
./scripts/install.sh --local
```

The development installer:
- Copies `skills/` to `~/.claude/skills/` or project `.claude/skills/`
- Runs automated verification (YAML, templates, schemas, references)
- Provides colored status output and usage examples
- Prompts for confirmation before installing

### Uninstalling Skills

```bash
# Preview what would be removed
./scripts/uninstall.sh --dry-run

# Remove skills with confirmation
./scripts/uninstall.sh

# Remove without confirmation
./scripts/uninstall.sh --force
```

**Important**: User data in `./fluxwing/` is NEVER deleted during uninstallation.

### Working with Skills

#### Adding a New Skill

1. Create skill directory in `skills/{skill-name}/`
2. Create `SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: Skill Name
   description: One-line description for activation triggers
   version: 1.0.0
   author: Trabian
   allowed-tools: Read, Write, Edit, Glob, Grep, Task, TodoWrite, Bash
   ---
   ```
3. Add skill workflow instructions in markdown
4. Copy necessary templates/schemas to skill directory
5. Update `TODO.md` with new phase
6. Run `./scripts/install.sh` to test locally

#### Modifying Existing Skills

1. Edit `SKILL.md` in `skills/{skill-name}/`
2. Update templates or docs as needed
3. Test locally by running `./scripts/install.sh`
4. Verify with natural language trigger phrases
5. Update `TODO.md` if workflow changes

#### Adding Component Templates

1. Create `.uxm` + `.md` pair in appropriate skill's `templates/` directory
2. Validate against schema (`skills/fluxwing-component-creator/schemas/uxm-component.schema.json`)
3. Document in skill's `SKILL.md` if notable
4. Reinstall skills to apply changes


## Schema and Validation

**Definitive source of truth**: `skills/fluxwing-component-creator/schemas/uxm-component.schema.json`

This JSON Schema (Draft-07) defines:
- Required fields (id, type, version, metadata, props, ascii)
- Field constraints (patterns, lengths, types)
- Optional fields (behavior, layout, extends, slots)

### Component Types

Standard types: button, input, checkbox, radio, select, slider, toggle, text, heading, label, badge, icon, image, divider, container, card, modal, panel, tabs, navigation, breadcrumb, pagination, link, alert, toast, progress, spinner, list, table, tree, chart, form, fieldset, legend, custom

**Hierarchy**:
- Atomic (no dependencies): button, input, badge
- Composite (reference others): form, card
- Screens (top-level): use type "container"

### Validation Constraints

**ID Format**:
```
Pattern: ^[a-z0-9]+(?:-[a-z0-9]+)*$
Length: 2-64 characters
Example: submit-button, email-input, user-profile-card
```

**Version Format**:
```
Pattern: ^\d+\.\d+\.\d+$
Example: 1.0.0, 2.1.3
```

**Timestamp Format**:
```
Format: ISO 8601 (date-time)
Example: 2024-10-11T12:00:00Z
```

**ASCII Dimensions**:
```
width: 1-120 (reasonable terminal width)
height: 1-50 (single viewport without scrolling)
```

## Agent System

### Agent Invocation from Skills

**IMPORTANT**: Claude Code skills can only invoke built-in agent types:
- `general-purpose` - General-purpose task agent
- `Explore` - Codebase exploration agent
- `statusline-setup` - Status line configuration
- `output-style-setup` - Output style configuration

**Custom agent types (like `fluxwing:fluxwing-designer`) are NOT supported** by Claude Code's skills system.

Skills use the built-in `general-purpose` agent with embedded instructions:

```typescript
Task({
  subagent_type: "general-purpose",
  description: "Create uxscii component",
  prompt: `You are a uxscii component designer creating production-ready components.

Component requirements:
- Name: ${componentName}
- Type: ${componentType}
...

Your task:
1. Load schema from {SKILL_ROOT}/schemas/uxm-component.schema.json
2. Create .uxm file (valid JSON)
3. Create .md file (ASCII template)
4. Save to ./fluxwing/components/
...

Follow uxscii standard strictly.`
})
```


## Key Architectural Principles

### 1. Fluxwing vs uxscii Naming
- Skills use `fluxwing-*` prefix for skill names (the tool)
- Format uses `uxscii` standard (the language, like JSON)
- This distinguishes tool from standard

### 2. Self-Contained Portability
- All schemas, examples, and docs bundled in skills
- NO external dependencies at runtime
- Users install via Claude Code plugin system or development script

### 3. Modular Documentation
- Docs split into focused modules (500-800 tokens each)
- Load only what's needed to save context
- Full reference docs available when needed

### 4. Rendered Examples as Truth
- Templates with `{{variables}}` don't show visual intent
- Screens include `.rendered.md` with real data (names, emails, numbers)
- Helps Claude understand actual layout and spacing
- Only for screens (components are self-explanatory)

## Variable Substitution

- Templates use `{{variableName}}` syntax
- All template variables MUST be defined in corresponding `.uxm` file
- Variables in .uxm but not .md are okay (runtime binding)
- Variables in .md but not .uxm will cause validation errors

## Accessibility Requirements

All interactive components should include:
- ARIA role appropriate for type
- Focusable flag for keyboard navigation
- ARIA labels for screen readers
- Keyboard shortcuts where applicable

## File References by Task

### Creating Components
- `skills/fluxwing-component-creator/SKILL.md` - Component creation workflow
- `skills/fluxwing-component-creator/templates/` - 11 bundled templates
- `skills/fluxwing-component-creator/schemas/uxm-component.schema.json` - Validation
- `skills/fluxwing-component-creator/docs/03-component-creation.md` - Detailed guide
- `skills/fluxwing-component-creator/docs/06-ascii-patterns.md` - Box-drawing characters

### Building Screens
- `skills/fluxwing-screen-scaffolder/SKILL.md` - Screen scaffolding workflow
- `skills/fluxwing-screen-scaffolder/templates/` - 2 complete screen examples
- `skills/fluxwing-screen-scaffolder/docs/04-screen-composition.md` - Screen guide

### Browsing Library
- `skills/fluxwing-library-browser/SKILL.md` - Library browsing workflow
- `skills/fluxwing-library-browser/docs/07-examples-guide.md` - Template reference

### Expanding Components
- `skills/fluxwing-component-expander/SKILL.md` - State expansion workflow
- `skills/fluxwing-component-expander/docs/03-component-creation.md` - Creation details
- `skills/fluxwing-component-expander/docs/06-ascii-patterns.md` - ASCII patterns

### Viewing Components
- `skills/fluxwing-component-viewer/SKILL.md` - Component viewing workflow
- `skills/fluxwing-component-viewer/docs/02-core-concepts.md` - Core concepts

### Importing Screenshots
- `skills/fluxwing-screenshot-importer/SKILL.md` - Import workflow
- `skills/fluxwing-screenshot-importer/docs/` - 6 screenshot analysis guides

## Documentation References

### Repository Documentation
- `README.md` - High-level overview and quick start
- `TODO.md` - Development status and tasks
- `INSTALL.md` - Comprehensive installation guide (405 lines)

## Performance Considerations

- **Documentation loading**: Load docs from skills as needed, not all upfront
- **Schema validation**: Compile schema once, reuse validator
- **File operations**: Batch reads/writes when possible
- **Context tokens**: Prefer skill-specific docs over full reference guides
- **Agent spawning**: Use parallel Task calls for independent operations

## Common Commands

### Building and Testing
```bash
# Install skills locally
./scripts/install.sh

# Uninstall skills
./scripts/uninstall.sh
```

### Natural Language Testing
After installing skills, test with these triggers:
1. "Create a button" → fluxwing-component-creator
2. "Show me all components" → fluxwing-library-browser
3. "Add hover state to my button" → fluxwing-component-expander
4. "Build a login screen" → fluxwing-screen-scaffolder
5. "Show me the primary-button" → fluxwing-component-viewer
6. "Import this screenshot" → fluxwing-screenshot-importer

## Active Technologies
- HTML5, CSS3, JavaScript ES6+ (browser native) + IBM Plex Mono (web font), GitHub Pages (hosting) (001-github-pages-ascii-redesign)
- N/A (static site, no backend) (001-github-pages-ascii-redesign)

## Recent Changes
- 001-github-pages-ascii-redesign: Added HTML5, CSS3, JavaScript ES6+ (browser native) + IBM Plex Mono (web font), GitHub Pages (hosting)
