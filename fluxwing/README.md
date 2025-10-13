# Fluxwing - AI-Native UX Design Plugin

**Design beautiful UX and screens with AI using the uxscii standard.**

Fluxwing is your AI design assistant that creates production-ready UI components and complete screen designs using ASCII art and structured metadata. Built on the open **uxscii standard**, Fluxwing enables AI agents to design, validate, and compose interfaces that are human-readable, version-control friendly, and machine-parseable.

---

## What is Fluxwing?

**Fluxwing** is the AI agent that helps you design. **uxscii** is the standard format it uses.

Think of it this way:
- **uxscii** = The language (like HTML/CSS)
- **Fluxwing** = The designer who speaks that language (like Figma, but AI-powered)

---

## Quick Start

### Create Your First Component

```bash
/fluxwing-create button
```

Fluxwing guides you through creating a button with interactive states, accessibility attributes, and clean ASCII visualization.

### Browse the Library

```bash
/fluxwing-library
```

Explore 11 bundled templates (buttons, inputs, cards, modals, etc.) and your project components.

### Build a Complete Screen

```bash
/fluxwing-scaffold login-screen
```

Fluxwing creates missing components, composes them into a screen, and generates rendered examples with real data.

### Validate Your Work

```bash
/fluxwing-validate
```

Get instant feedback on schema compliance, accessibility, and best practices.

---

## Features

### Slash Commands (Quick Tasks)

| Command | Purpose |
|---------|---------|
| `/fluxwing-create [name]` | Create a single component |
| `/fluxwing-scaffold [screen]` | Build a complete screen |
| `/fluxwing-validate [file]` | Validate components |
| `/fluxwing-library` | Browse all components |

📖 **[See detailed command reference →](COMMANDS.md)**

### AI Agents (Complex Work)

| Agent | Purpose |
|-------|---------|
| **fluxwing-designer** | Autonomous multi-component design from descriptions |
| **fluxwing-validator** | Deep quality analysis with recommendations |
| **fluxwing-composer** | Assemble screens from existing components |

🤖 **[See detailed agent reference →](AGENTS.md)**

### What's Included

**11 Curated Component Templates:**
Buttons, inputs, cards, modals, navigation, alerts, badges, lists, forms, and more.

**2 Complete Screen Examples:**
Login screen and dashboard with rendered examples showing real data.

**Complete Documentation:**
Modular guides optimized for AI agents, full uxscii reference, ASCII pattern library, and validation standards.

**Production-Ready Schema:**
JSON Schema for validation with complete field reference and extensible architecture.

---

## How It Works

### The Two-File System

Every component consists of two files:

**1. `.uxm` file** (JSON metadata):
```json
{
  "id": "submit-button",
  "type": "button",
  "version": "1.0.0",
  "metadata": {
    "name": "Submit Button",
    "created": "2024-10-11T12:00:00Z"
  },
  "props": {
    "text": "Submit"
  },
  "ascii": {
    "templateFile": "submit-button.md",
    "width": 20,
    "height": 3
  }
}
```

**2. `.md` file** (ASCII template):
````markdown
# Submit Button

## Default State

```
╭──────────────────╮
│   {{text}}       │
╰──────────────────╯
```
````

### Output Structure & Data Locations

**Critical Understanding**: Fluxwing has TWO separate file locations:

#### Plugin Data (READ-ONLY)
```
{PLUGIN_ROOT}/data/          # Bundled with plugin - reference only
├── schema/                  # JSON Schema for validation
├── examples/                # 11 component templates (READ-ONLY)
├── screens/                 # 2 screen examples (READ-ONLY)
└── docs/                    # Documentation modules
```

**These are bundled reference materials - NEVER modified by commands or agents.**

#### Your Project Workspace (READ-WRITE)
```
./fluxwing/                  # Your project files - ALL outputs go here
├── components/              # Your created components
├── screens/                 # Your created screens
│   └── *.rendered.md        # Examples with REAL data
└── library/                 # Your customized template copies
```

**All command and agent outputs are saved here. These are YOUR files.**

**The Golden Rule**: READ from plugin data, WRITE to project workspace.

🏗️ **[See complete architecture →](ARCHITECTURE.md)**

---

## Why Fluxwing?

### AI-Native Design
Optimized for AI agents to create and understand. No visual tools required - pure text and structure.

### Version Control Friendly
Text-based format with meaningful diffs. Collaborative editing without binary conflicts.

### Production Ready
Schema validation ensures quality. Accessibility built-in (ARIA roles, keyboard support). Multiple states for all interactive elements.

### Tool Independent
Open uxscii standard, not proprietary. Works with any text editor. No vendor lock-in.

### Portable & Self-Contained
Everything needed is in the plugin. No external dependencies on uxscii CLI. Works in any Claude Code installation.

---

## Example Workflow

**Design a Login Screen:**

```bash
# 1. Create the screen (auto-creates missing components)
/fluxwing-scaffold login-screen

# 2. Validate quality
/fluxwing-validate

# 3. Review rendered example
cat ./fluxwing/screens/login-screen.rendered.md

# ✓ Ready for development!
```

**Build a Complete Design System:**

```
Dispatch fluxwing-designer agent with:
"Create a dashboard with revenue metrics, user stats, and activity feed"

# Agent autonomously:
# - Creates all needed components
# - Designs layouts
# - Composes screens
# - Validates everything
# - Provides rendered examples
```

---

## Documentation

### Getting Started
- **[README.md](README.md)** (you are here) - Overview and quick start
- **[00-INDEX.md](data/docs/00-INDEX.md)** - Documentation navigation

### Reference
- **[COMMANDS.md](COMMANDS.md)** - Complete command reference
- **[AGENTS.md](AGENTS.md)** - Complete agent reference
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical design and decisions

### Guides
- **[Quick Start](data/docs/01-quick-start.md)** - 30-second component creation
- **[Core Concepts](data/docs/02-core-concepts.md)** - Understanding uxscii
- **[Component Creation](data/docs/03-component-creation.md)** - Step-by-step workflow
- **[Screen Composition](data/docs/04-screen-composition.md)** - Building complete screens
- **[Validation Guide](data/docs/05-validation-guide.md)** - Quality standards
- **[ASCII Patterns](data/docs/06-ascii-patterns.md)** - Visual toolkit
- **[Schema Reference](data/docs/07-schema-reference.md)** - Schema documentation

### Help
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to extend and contribute
- **[PLUGIN_STRUCTURE.md](PLUGIN_STRUCTURE.md)** - Complete structure reference

---

## Installation

### Cloud Installation (Recommended)

Install Fluxwing directly from the plugin marketplace:

**1. Add the Fluxwing marketplace:**

```bash
/plugin marketplace add fluxwing/claude-code-plugins
```

**2. Install the plugin:**

```bash
/plugin install fluxwing
```

That's it! Fluxwing is now available across all your Claude Code sessions (terminal and VS Code).

**Toggle the plugin on/off as needed:**

```bash
/plugin disable fluxwing
/plugin enable fluxwing
```

### Local Installation

For development or offline use, install from a local directory:

**1. Clone or download the marketplace:**

```bash
git clone https://github.com/fluxwing/claude-code-plugins.git
cd claude-code-plugins
```

**2. Add the marketplace:**

```bash
/plugin marketplace add /path/to/claude-code-plugins
```

**3. Install the plugin:**

```bash
/plugin install fluxwing@fluxwing-marketplace
```

**Note**: Replace `/path/to/claude-code-plugins` with the absolute path to the marketplace directory (containing `.claude-plugin/marketplace.json`).

---

## Requirements

- Claude Code (any version with plugin support)
- No external dependencies required
- Everything you need is bundled in the plugin

---

## Project Structure

```
plugin/
├── .claude-plugin/          # Plugin manifest
├── commands/                # 4 slash commands
├── agents/                  # 3 autonomous agents
├── data/                    # All uxscii assets (portable)
│   ├── schema/              # JSON Schema validation
│   ├── examples/            # 11 component templates
│   ├── screens/             # 2 screen examples
│   ├── docs/                # Modular documentation
│   └── helpers/             # (Reserved)
├── hooks/                   # (Available for extension)
├── mcp/                     # (Available for extension)
└── [Documentation files]
```

**[See complete structure →](PLUGIN_STRUCTURE.md)**

---

## Contributing

Contributions welcome! To add features or improvements:

1. Read **[CONTRIBUTING.md](CONTRIBUTING.md)** for guidelines
2. Fork the repository
3. Create a feature branch
4. Make your changes
5. Submit a pull request

---

## Support

### Having Issues?

Check **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for solutions to common problems.

### Need Help?

- **Issues**: Report bugs or request features on GitHub
- **Discussions**: Ask questions and share ideas on GitHub Discussions
- **Examples**: Browse `data/examples/` for component patterns
- **Documentation**: Check `data/docs/00-INDEX.md` for all guides

---

## License

MIT License - free to use and modify

---

## Credits

Built on the **uxscii standard** - an open, AI-native design markup language.

Fluxwing brings uxscii to Claude Code, making AI-powered UX design accessible to everyone.

---

<div align="center">

**Ready to design with AI?**

Start with: `/fluxwing-create` or `/fluxwing-library`

*Design beautiful UX with Fluxwing - your AI design assistant*

---

**[Commands](COMMANDS.md)** • **[Agents](AGENTS.md)** • **[Architecture](ARCHITECTURE.md)** • **[Contributing](CONTRIBUTING.md)** • **[Troubleshooting](TROUBLESHOOTING.md)**

</div>
