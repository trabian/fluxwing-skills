# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fluxwing Skills** is a Claude Code skills system that enables AI-native UX design using the **uxscii standard**. This repository contains skills that allow Claude to create, validate, and compose UI designs through natural language using ASCII art and structured JSON metadata.

**Key Distinction**:
- **Fluxwing** = The AI bot/agent system (the tool)
- **uxscii** = The standard format (the language)
- Think: Figma vs HTML/CSS

**Development Location**: This repository (`fluxwing-skills`) is the primary development location for both:
1. Six Claude Code skills (in `.claude/skills/`)
2. The legacy Fluxwing plugin (in `fluxwing/`) - maintained for backwards compatibility

## Repository Structure

```
fluxwing-skills/                # Repository root (THIS REPO)
├── .claude/
│   └── skills/                 # 6 Skills (primary focus)
│       ├── uxscii-component-creator/
│       ├── uxscii-library-browser/
│       ├── uxscii-component-expander/
│       ├── uxscii-screen-scaffolder/
│       ├── uxscii-component-viewer/
│       └── uxscii-screenshot-importer/
├── fluxwing/                   # Legacy plugin (backwards compatible)
│   ├── commands/               # 6 slash commands
│   ├── agents/                 # 7 autonomous agents
│   └── data/                   # Bundled assets (schemas, templates, docs)
├── scripts/
│   ├── install.sh              # Skills installation script
│   └── uninstall.sh            # Skills removal script
├── tests/                      # Automated test suite
└── docs/                       # Development documentation
```

## Core Architecture - Skills System

### The Two-File System

Every uxscii component consists of **two files**:

1. **`.uxm` file** (JSON metadata) - Component structure, behavior, props, accessibility
2. **`.md` file** (ASCII template) - Visual representation with `{{variable}}` placeholders

Screens add a third file:
3. **`.rendered.md`** (Example with REAL data) - Shows actual visual intent, not just templates

### Skills Overview

The six skills handle different aspects of UX design:

1. **uxscii-component-creator** - Create new components (buttons, inputs, cards, etc.)
   - Triggers: "Create a button", "I need an input component"
   - Uses: `general-purpose` agent with component creation instructions
   - Outputs: `./fluxwing/components/{name}.uxm` + `.md`

2. **uxscii-library-browser** - Browse available templates and user components
   - Triggers: "Show me all components", "Browse the library"
   - Tools: Read-only (Read, Glob, Grep)
   - Searches: bundled templates, library, user components

3. **uxscii-component-expander** - Add states to existing components
   - Triggers: "Add hover state to my button", "Make this component interactive"
   - Modifies: Existing `.uxm` and `.md` files in place
   - Adds: hover, focus, disabled, active, error states

4. **uxscii-screen-scaffolder** - Build complete screens from components
   - Triggers: "Create a login screen", "Build a dashboard"
   - Uses: `general-purpose` agent for component creation and screen composition
   - Outputs: `./fluxwing/screens/{name}.uxm` + `.md` + `.rendered.md`

5. **uxscii-component-viewer** - View component details
   - Triggers: "Show me the submit-button", "View component details"
   - Tools: Read-only (Read, Glob, Grep)
   - Displays: Full metadata, ASCII preview, all states

6. **uxscii-screenshot-importer** - Convert screenshots to uxscii components
   - Triggers: "Import this screenshot", "Convert screenshot to uxscii"
   - Uses: `general-purpose` agent for vision analysis and component generation
   - Outputs: Components extracted from screenshot images

### Data Location Philosophy

**Critical Distinction**: Skills have READ-ONLY bundled templates and READ-WRITE project workspace:

#### Skill Bundled Data (READ-ONLY)
```
.claude/skills/{skill-name}/    # Within each skill directory
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

## Development Workflows

### Installing Skills

```bash
# Auto-detect installation location (local project vs global)
./scripts/install.sh

# Force global installation
./scripts/install.sh --global

# Force local project installation
./scripts/install.sh --local
```

The installer:
- Copies `.claude/skills/` to `~/.claude/skills/` or project `.claude/skills/`
- Runs automated verification (YAML, templates, schemas, references)
- Provides colored status output and usage examples
- Backs up existing skills before overwriting

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

1. Create skill directory in `.claude/skills/{skill-name}/`
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
6. Run `./scripts/install.sh` to test

#### Modifying Existing Skills

1. Edit `SKILL.md` in `.claude/skills/{skill-name}/`
2. Update templates or docs as needed
3. Test locally by running `./scripts/install.sh --force`
4. Verify with natural language trigger phrases
5. Update `TODO.md` if workflow changes

#### Adding Component Templates

1. Create `.uxm` + `.md` pair in appropriate skill's `templates/` directory
2. Validate against schema (`.claude/skills/uxscii-component-creator/schemas/uxm-component.schema.json`)
3. Document in skill's `SKILL.md` if notable
4. Reinstall skills to apply changes

### Working with the Legacy Plugin

The `fluxwing/` directory contains the legacy plugin for backwards compatibility:

```bash
# Link plugin for development
npm run dev:link

# Check development status
npm run dev:status

# Unlink plugin
npm run dev:unlink
```

Changes to plugin files are instantly available after restarting Claude Code.

### Testing

```bash
# Run all automated tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage

# Generate HTML report
npm run test:report
```

Test files are in `tests/src/tests/`:
- `01-command-consistency.test.ts` - Command validation
- `02-agent-consistency.test.ts` - Agent validation
- `03-functional-commands.test.ts` - Command execution
- `04-functional-agents.test.ts` - Agent execution
- `05-documentation.test.ts` - Documentation completeness
- `06-integration.test.ts` - End-to-end workflows

## Schema and Validation

**Definitive source of truth**: `.claude/skills/uxscii-component-creator/schemas/uxm-component.schema.json`

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

### Agent Reference Documentation

The `fluxwing/agents/` directory contains reference documentation for complex workflows:
- `fluxwing-designer.md` - Component creation workflows (reference only)
- `fluxwing-composer.md` - Screen composition workflows (reference only)
- `screenshot-*.md` - Screenshot analysis workflows (reference only)

**These files are NOT custom agent types**, but rather documentation that skills can reference when constructing prompts for the `general-purpose` agent. The plugin slash commands can reference these as autonomous agent workflows, but the skills system cannot register custom agents.

## Key Architectural Principles

### 1. Fluxwing vs uxscii Naming
- Skills use `uxscii-*` prefix for skill names
- Agents use `fluxwing-*` prefix for agent names
- This distinguishes tool from standard

### 2. Self-Contained Portability
- All schemas, examples, and docs bundled in skills
- NO external dependencies at runtime
- Users install with single script (`./scripts/install.sh`)

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

## Migration Status

**Current State**: Skills system complete and ready for testing
- ✅ All 6 skills implemented
- ✅ Installation scripts created (`install.sh`, `uninstall.sh`)
- ✅ Automated verification implemented
- ⏳ Manual testing pending
- 📝 Documentation updates needed

**See**: `TODO.md` for detailed migration status and testing checklist

## File References by Task

### Creating Components
- `.claude/skills/uxscii-component-creator/SKILL.md` - Component creation workflow
- `.claude/skills/uxscii-component-creator/templates/` - 11 bundled templates
- `.claude/skills/uxscii-component-creator/schemas/uxm-component.schema.json` - Validation
- `.claude/skills/uxscii-component-creator/docs/03-component-creation.md` - Detailed guide
- `.claude/skills/uxscii-component-creator/docs/06-ascii-patterns.md` - Box-drawing characters

### Building Screens
- `.claude/skills/uxscii-screen-scaffolder/SKILL.md` - Screen scaffolding workflow
- `.claude/skills/uxscii-screen-scaffolder/templates/` - 2 complete screen examples
- `.claude/skills/uxscii-screen-scaffolder/docs/04-screen-composition.md` - Screen guide

### Browsing Library
- `.claude/skills/uxscii-library-browser/SKILL.md` - Library browsing workflow
- `.claude/skills/uxscii-library-browser/docs/07-examples-guide.md` - Template reference

### Expanding Components
- `.claude/skills/uxscii-component-expander/SKILL.md` - State expansion workflow
- `.claude/skills/uxscii-component-expander/docs/03-component-creation.md` - Creation details
- `.claude/skills/uxscii-component-expander/docs/06-ascii-patterns.md` - ASCII patterns

### Viewing Components
- `.claude/skills/uxscii-component-viewer/SKILL.md` - Component viewing workflow
- `.claude/skills/uxscii-component-viewer/docs/02-core-concepts.md` - Core concepts

### Importing Screenshots
- `.claude/skills/uxscii-screenshot-importer/SKILL.md` - Import workflow
- `.claude/skills/uxscii-screenshot-importer/docs/` - 6 screenshot analysis guides

## Documentation References

### Repository Documentation
- `README.md` - High-level overview and quick start
- `TODO.md` - Migration status and testing checklist
- `INSTALL.md` - Comprehensive installation guide (405 lines)
- `DEVELOPMENT.md` - Development guide for plugin
- `IMPLEMENTATION_SUMMARY.md` - Skills migration summary

### Plugin Documentation (Legacy)
- `fluxwing/ARCHITECTURE.md` - Technical design decisions (~1000 lines)
- `fluxwing/COMMANDS.md` - Slash command reference (~3400 lines)
- `fluxwing/AGENTS.md` - Agent reference (~900 lines)
- `fluxwing/CONTRIBUTING.md` - Contribution guidelines
- `fluxwing/TROUBLESHOOTING.md` - Common issues
- `fluxwing/PLUGIN_STRUCTURE.md` - Plugin structure reference

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

# Run tests
npm test

# Generate test report
npm run test:report

# Development mode (plugin)
npm run dev:link
npm run dev:status
```

### Natural Language Testing
After installing skills, test with these triggers:
1. "Create a button" → uxscii-component-creator
2. "Show me all components" → uxscii-library-browser
3. "Add hover state to my button" → uxscii-component-expander
4. "Build a login screen" → uxscii-screen-scaffolder
5. "Show me the primary-button" → uxscii-component-viewer
6. "Import this screenshot" → uxscii-screenshot-importer
