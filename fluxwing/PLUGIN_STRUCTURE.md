# Fluxwing Plugin - Complete Structure

## Overview

Self-contained Claude Code plugin for AI-native UX design using the uxscii standard.

## Directory Structure

```
plugin/
├── .claude-plugin/
│   └── plugin.json                    # Plugin manifest with fluxwing branding
│
├── commands/                           # 4 Slash Commands (Quick Tasks)
│   ├── fluxwing-create.md            # Create single component
│   ├── fluxwing-scaffold.md          # Build complete screen
│   ├── fluxwing-library.md           # Browse library
│   └── fluxwing-get.md               # View component details
│
├── agents/                             # 2 Autonomous Agents (Complex Work)
│   ├── fluxwing-designer.md          # Multi-component design
│   └── fluxwing-composer.md          # Screen composition
│
├── data/                               # All uxscii assets (portable)
│   ├── schema/
│   │   └── uxm-component.schema.json # JSON Schema for validation
│   │
│   ├── examples/                      # 11 Curated Components
│   │   ├── primary-button.{uxm,md}
│   │   ├── secondary-button.{uxm,md}
│   │   ├── email-input.{uxm,md}
│   │   ├── card.{uxm,md}
│   │   ├── modal.{uxm,md}
│   │   ├── navigation.{uxm,md}
│   │   ├── alert.{uxm,md}
│   │   ├── badge.{uxm,md}
│   │   ├── list.{uxm,md}
│   │   ├── form.{uxm,md}
│   │   └── custom-widget.{uxm,md}
│   │
│   ├── screens/                       # 2 Complete Screen Examples
│   │   ├── login-screen.{uxm,md,rendered.md}
│   │   └── dashboard.{uxm,md,rendered.md}
│   │
│   ├── docs/                          # Modular Documentation (10 files)
│   │   ├── 00-INDEX.md               # Navigation & loading strategies
│   │   ├── 01-quick-start.md         # 30-second component creation
│   │   ├── 02-core-concepts.md       # Understanding uxscii
│   │   ├── 03-component-creation.md  # Step-by-step workflow
│   │   ├── 04-screen-composition.md  # Building complete screens
│   │   ├── 05-validation-guide.md    # Quality standards
│   │   ├── 06-ascii-patterns.md      # Visual toolkit
│   │   ├── 07-schema-reference.md    # Schema documentation
│   │   ├── UXSCII_AGENT_GUIDE.md     # Comprehensive guide
│   │   ├── UXSCII_SCHEMA_GUIDE.md    # Schema deep-dive
│   │   └── UXSCII_README.md          # uxscii overview
│   │
│   └── helpers/                       # (Reserved for future use)
│
├── hooks/                              # Event hooks (empty - available for extension)
├── mcp/                                # MCP servers (empty - available for extension)
├── uxscii/                             # Original uxscii source (for development)
│
├── README.md                           # High-level overview & quick start
├── COMMANDS.md                         # Detailed command reference
├── AGENTS.md                           # Detailed agent reference
├── ARCHITECTURE.md                     # Technical design & decisions
├── CONTRIBUTING.md                     # Developer guidelines
├── TROUBLESHOOTING.md                  # Common issues & solutions
├── PLUGIN_STRUCTURE.md                 # This file - complete structure
└── .gitignore                          # Git ignore rules
```

## File Counts

- **Commands**: 4
- **Agents**: 2
- **Component Examples**: 11 (22 files: .uxm + .md pairs)
- **Screen Examples**: 2 (6 files: .uxm + .md + .rendered.md)
- **Module Documentation**: 10 files (in data/docs/)
- **Root Documentation**: 6 files (README, COMMANDS, AGENTS, ARCHITECTURE, CONTRIBUTING, TROUBLESHOOTING)
- **Schema**: 1 definitive JSON Schema
- **Total Assets**: ~48 files (excluding source)

## Key Features

### ✅ Self-Contained
- No external dependencies on uxscii CLI
- Everything needed bundled in plugin
- Portable across installations

### ✅ Dual Interface
- **Slash commands** for quick tasks
- **Agents** for autonomous complex work

### ✅ Complete Documentation
- Modular docs optimized for agents (~4000 tokens total)
- Full reference docs for deep dives
- Context-saving loading strategies

### ✅ Production Examples
- 11 production-ready component templates
- 2 complete screen examples with rendered versions
- Real data examples (not just {{variables}})

### ✅ Quality Built-In
- JSON Schema
- Accessibility attributes
- Multiple component states

## User Workflows

### Workflow 1: Quick Component Creation
```
/fluxwing-create button
→ Creates button.{uxm,md} in ./fluxwing/components/
```

### Workflow 2: Complete Screen Design
```
/fluxwing-scaffold dashboard
→ Creates all components + screen in ./fluxwing/
```

### Workflow 3: Library Browsing
```
/fluxwing-library
→ Shows bundled templates + user components
```

### Workflow 4: Autonomous Design
```
Dispatch fluxwing-designer agent
→ Creates entire design system from description
```

## Output Structure (User Project)

When users create designs, files are saved to:

```
./fluxwing/
├── components/              # User-created components
│   ├── submit-button.{uxm,md}
│   └── ...
├── screens/                 # Complete screen compositions
│   ├── login-page.{uxm,md,rendered.md}
│   └── ...
└── library/                 # Copied/customized templates
    └── ...
```

## Design Principles

1. **Fluxwing = Bot**, **uxscii = Standard**
   - Clear branding distinction
   - Fluxwing uses uxscii to design

2. **CLI-Free Operation**
   - No dependency on external CLI tools
   - Pure plugin functionality

3. **Rendered Examples Critical**
   - Every screen has .rendered.md with REAL data
   - Shows actual intended output, not templates

4. **Modular Documentation**
   - Load only what you need
   - Save context tokens
   - Clear navigation

5. **Portability First**
   - Everything required is bundled
   - Works anywhere Claude Code runs

## Documentation Structure

The plugin includes comprehensive documentation organized into two tiers:

### Root-Level Documentation

**Quick Reference & Guides**:
- **README.md** - High-level overview, quick start, features summary
- **COMMANDS.md** - Complete slash command reference with examples
- **AGENTS.md** - Complete autonomous agent reference with workflows
- **ARCHITECTURE.md** - Technical design, decisions, and philosophy
- **CONTRIBUTING.md** - Developer guidelines for extending the plugin
- **TROUBLESHOOTING.md** - Common issues and solutions
- **PLUGIN_STRUCTURE.md** - This file, complete structure reference

### Module Documentation (data/docs/)

**Task-Specific Guides** (optimized for context efficiency):
- **00-INDEX.md** - Documentation navigation and loading strategies
- **01-quick-start.md** - 30-second component creation (~400 tokens)
- **02-core-concepts.md** - Understanding uxscii (~600 tokens)
- **03-component-creation.md** - Step-by-step workflow (~800 tokens)
- **04-screen-composition.md** - Building screens (~600 tokens)
- **05-validation-guide.md** - Quality standards (~800 tokens)
- **06-ascii-patterns.md** - Visual toolkit (~500 tokens)
- **07-schema-reference.md** - Schema documentation (~400 tokens)

**Full Reference Guides** (comprehensive):
- **UXSCII_AGENT_GUIDE.md** - Complete guide for agents (~8000 tokens)
- **UXSCII_SCHEMA_GUIDE.md** - Schema deep-dive (~5000 tokens)
- **UXSCII_README.md** - Standard overview (~3000 tokens)

**Total**: ~21,000 tokens across all docs, but modular loading saves 70-90%

## Version Information

- **Plugin Version**: 1.0.0
- **uxscii Standard**: 1.0.0
- **Schema Version**: 1.1.0

## Installation

```bash
/plugin install /path/to/fluxwing-plugin
```

Or (when published):
```bash
/plugin install fluxwing
```

## Commands Quick Reference

- `/fluxwing-create [name]` - Create component
- `/fluxwing-scaffold [screen]` - Build screen
- `/fluxwing-library` - Browse library
- `/fluxwing-get [name]` - View component details

## Agents Quick Reference

- **fluxwing-designer** - Autonomous design from description
- **fluxwing-composer** - Screen assembly from components

---

**Built with care for AI-native design workflows.**

Fluxwing brings the power of uxscii to Claude Code.
