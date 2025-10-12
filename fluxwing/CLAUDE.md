# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fluxwing** is a Claude Code plugin that enables AI-native UX design using the **uxscii standard**. It consists of slash commands, autonomous agents, and a complete library of component templates that allow Claude to create, validate, and compose UI designs using ASCII art and structured JSON metadata.

**Key Distinction**:
- **Fluxwing** = The AI bot/agent (the tool)
- **uxscii** = The standard format (the language)
- Think: Figma vs HTML/CSS

## Repository Structure

This is the **Fluxwing Claude Code plugin marketplace**:

```
fluxwing-marketplace/            # Marketplace root (THIS REPO)
├── .claude-plugin/
│   └── marketplace.json        # Marketplace definition
└── fluxwing/                   # The plugin
    ├── .claude-plugin/         # Plugin manifest
    ├── commands/               # 4 slash commands
    ├── agents/                 # 3 autonomous agents
    ├── data/                   # All uxscii assets (portable)
    │   ├── schema/             # JSON Schema validation
    │   ├── examples/           # 11 component templates
    │   ├── screens/            # 2 screen examples
    │   └── docs/               # Modular documentation
    └── [Documentation files]
```

**Working directory**: `/Users/tranqy/projects/fluxwing-marketplace` is now the primary development location for the plugin.

**IMPORTANT**: The plugin is **self-contained**. It bundles all uxscii assets and requires NO external dependencies. Users don't need to install any CLI tools.

## The Two-File System

Every uxscii component consists of **two files**:

1. **`.uxm` file** (JSON metadata) - Component structure, behavior, props, accessibility
2. **`.md` file** (ASCII template) - Visual representation with `{{variable}}` placeholders

Screens add a third file:
3. **`.rendered.md`** (Example with REAL data) - Shows actual visual intent, not just templates

## Core Architecture Principles

### 1. Fluxwing vs uxscii Naming
- Commands use `/fluxwing-*` prefix (NOT `/uxscii-*`)
- This distinguishes the bot from the standard
- Allows uxscii to remain tool-agnostic

### 2. Self-Contained Portability
- All schemas, examples, and docs bundled in plugin
- NO external dependencies at runtime
- Users don't need to install uxscii CLI separately
- Single installation unit

### 3. Modular Documentation
- Docs split into 7 modules (500-800 tokens each)
- Load only what's needed to save context
- `data/docs/00-INDEX.md` provides navigation
- Full reference docs available when needed

### 4. Rendered Examples as Truth
- Templates with `{{variables}}` don't show visual intent
- Screens include `.rendered.md` with real data (names, emails, numbers)
- Helps Claude understand actual layout and spacing
- Only for screens (components are self-explanatory)

## Working with Plugin Commands

### Command Files (commands/)
Each command is a markdown file with:
- Frontmatter (description, author, version)
- Task description for Claude
- Workflow steps
- Resource locations
- Example interactions

**Location pattern**: `{PLUGIN_ROOT}` resolves to plugin installation directory

### Agent Files (agents/)
Similar structure but for autonomous workflows:
- More complex multi-step processes
- Use TodoWrite to track progress
- Make reasonable decisions without constant user input
- Reference documentation when needed

## Plugin Development Commands

### Working with the Plugin
- **Validate schema**: Read `data/schema/uxm-component.schema.json`
- **Browse examples**: Read files in `data/examples/`
- **Read docs**: Start with `data/docs/00-INDEX.md`
- **Test commands**: Reference command markdown files in `commands/`
- **Test agents**: Reference agent markdown files in `agents/`

## Schema and Validation

**Definitive source of truth**: `data/schema/uxm-component.schema.json`

This JSON Schema (Draft-07) defines:
- Required fields (id, type, version, metadata, props, ascii)
- Field constraints (patterns, lengths, types)
- Optional fields (behavior, layout, extends, slots)
- Validation rules for all `.uxm` files

**Validation levels**:
1. **Schema** - Structure correct, fields present
2. **Semantic** - Template exists, variables match
3. **Quality** - Multiple states, accessibility complete

## Component Types

Standard types: button, input, checkbox, radio, select, slider, toggle, text, heading, label, badge, icon, image, divider, container, card, modal, panel, tabs, navigation, breadcrumb, pagination, link, alert, toast, progress, spinner, list, table, tree, chart, form, fieldset, legend, custom

**Hierarchy**:
- Atomic (no dependencies): button, input, badge
- Composite (reference others): form, card
- Screens (top-level): use type "container"

## File Locations Users Create

When users run commands, files are saved to:
```
./fluxwing/                    # In user's project
├── components/                # .uxm + .md pairs
├── screens/                   # .uxm + .md + .rendered.md
└── library/                   # Copied/customized templates
```

## Important Implementation Notes

### Variable Substitution
- Templates use `{{variableName}}` syntax
- All template variables MUST be defined in corresponding `.uxm` file
- Variables in .uxm but not .md are okay (runtime binding)
- Variables in .md but not .uxm will cause validation errors

### ASCII Dimension Constraints
- Width: 1-120 characters (reasonable terminal width)
- Height: 1-50 lines (single viewport without scrolling)

### ID and Version Formats
- IDs: kebab-case, 2-64 chars, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- Versions: semantic versioning, pattern: `^\d+\.\d+\.\d+$`
- Timestamps: ISO 8601 format

### Accessibility Requirements
All interactive components should include:
- ARIA role appropriate for type
- Focusable flag for keyboard navigation
- ARIA labels for screen readers
- Keyboard shortcuts where applicable

## Testing Philosophy

- Test all commands and agents before committing
- Validate components against the schema
- Check examples for consistency
- Verify documentation accuracy

## Common Workflows

### Creating a New Command
1. Create markdown file in `commands/` with frontmatter
2. Follow existing command structure (see fluxwing-create.md)
3. Update documentation to reference new command

### Creating a New Agent
1. Create markdown file in `agents/` with frontmatter
2. Define mission, responsibilities, workflow phases
3. Include resource references and success criteria

### Adding New Component Examples
1. Create `.uxm` + `.md` pair in `data/examples/`
2. Validate against schema
3. Document in COMMANDS.md or README.md if notable

### Adding New Documentation
1. Create markdown file in `data/docs/`
2. Add entry to `00-INDEX.md` with token estimate
3. Keep files focused (500-800 tokens) for modularity

## Documentation References

- **README.md** - High-level overview and quick start
- **ARCHITECTURE.md** - Technical design decisions and rationale (~1000 lines)
- **COMMANDS.md** - Detailed command reference (~3400 lines)
- **AGENTS.md** - Detailed agent reference (~900 lines)
- **CONTRIBUTING.md** - Development guidelines (~800 lines)
- **TROUBLESHOOTING.md** - Common issues (~700 lines)
- **PLUGIN_STRUCTURE.md** - Complete file structure reference

## Key Files to Reference

### When Creating Components
- `data/docs/01-quick-start.md` - Fast component creation
- `data/docs/03-component-creation.md` - Detailed workflow
- `data/examples/` - Template references
- `data/schema/uxm-component.schema.json` - Validation rules

### When Building Screens
- `data/docs/04-screen-composition.md` - Screen building guide
- `data/screens/` - Complete screen examples with rendered versions

### When Validating
- `data/docs/05-validation-guide.md` - Quality standards
- Schema validation levels and criteria

### When Working with ASCII
- `data/docs/06-ascii-patterns.md` - Box-drawing characters and patterns

## Version Control Notes

- `.gitignore` excludes build artifacts and OS files
- **Marketplace is the git repo** (primary development location)
- Plugin is contained in `fluxwing/` subdirectory
- Commit both .uxm and .md files together (two-file system)
- Keep documentation synchronized with examples

## Performance Considerations

- **Documentation loading**: Load docs lazily based on task (use 00-INDEX.md)
- **Schema validation**: Compile schema once, reuse validator
- **File operations**: Batch reads/writes when possible
- **Context tokens**: Prefer modular docs over full reference guides
