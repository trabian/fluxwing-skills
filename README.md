# Fluxwing - AI-Native UX Design Plugin

<p align="left">
  <a href="https://www.trabian.com">
    <img src="docs/assets/trabian.svg" alt="Trabian logo" width="150" style="vertical-align:middle; margin-right:12px;">
  </a>
  <span style="vertical-align:middle; font-size:1rem;">A product by <a href="https://www.trabian.com">Trabian</a>.</span>
</p>

**Design beautiful UX and screens with AI using the uxscii standard.**

Fluxwing leverages AI's natural ability to create ASCII art specifications that humans can instantly understand and provide feedback on. Built on the open **uxscii standard**, it enables a rapid design feedback loop: AI generates visual specs using ASCII, humans review and iterate naturally, and the system captures increasing levels of fidelity through structured metadata.

**The perfect collaboration:** AI excels at creating ASCII layouts. Humans excel at giving feedback on ASCII drawings. Together, they create production-ready designs through progressive refinement.

---

## What is Fluxwing?

**Fluxwing** is the AI agent that helps you design. **uxscii** is the standard format it uses.

Think of it this way:
- **uxscii** = The language (like HTML/CSS)
- **Fluxwing** = The designer who speaks that language (like Figma, but AI-powered)

---

## Installation

Get started in 30 seconds:

```bash
# Add the marketplace
/plugin marketplace add fluxwing/claude-code-plugins

# Install the plugin
/plugin install fluxwing
```

That's it! Start designing with `/fluxwing-create` or `/fluxwing-library`

**[See detailed installation options →](#full-installation-guide)**

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

📖 **[See detailed command reference →](fluxwing/COMMANDS.md)**

### AI Agents (Complex Work)

| Agent | Purpose |
|-------|---------|
| **fluxwing-designer** | Autonomous multi-component design from descriptions |
| **fluxwing-validator** | Deep quality analysis with recommendations |
| **fluxwing-composer** | Assemble screens from existing components |

🤖 **[See detailed agent reference →](fluxwing/AGENTS.md)**

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

🏗️ **[See complete architecture →](fluxwing/ARCHITECTURE.md)**

---

## Why Fluxwing?

### The AI-Human Feedback Loop

**AI's Superpower:** Modern AI models are exceptional at generating ASCII art and visual layouts. They can instantly create boxes, borders, layouts, and structured visual representations.

**Human's Superpower:** Humans can instantly parse ASCII drawings and provide immediate, intuitive feedback: "move this left", "make that bigger", "add spacing here".

**The Magic:** This creates a natural feedback loop where:
1. AI generates ASCII specs in seconds
2. Humans review visually and comment naturally
3. AI iterates based on feedback
4. Designs converge rapidly through conversation

### Progressive Fidelity

Start simple, add detail as needed:

**Level 1: ASCII Layout**
```
╭────────────────────╮
│  Login             │
│  ┌──────────────┐  │
│  │ Email        │  │
│  └──────────────┘  │
│  [    Login    ]   │
╰────────────────────╯
```
Quick visual feedback, instant iteration.

**Level 2: Structured Metadata**
Add component types, props, states, and behavior through the `.uxm` file.

**Level 3: Enhanced Details**
Add accessibility, interactions, animations, responsive behavior, and design tokens.

**You control the fidelity.** Start with quick ASCII sketches, refine progressively as the design solidifies.

### Additional Benefits

**Version Control Friendly** - Text-based format with meaningful diffs. Collaborative editing without binary conflicts.

**Production Ready** - Schema validation ensures quality. Accessibility built-in (ARIA roles, keyboard support). Multiple states for all interactive elements.

**Tool Independent** - Open uxscii standard, not proprietary. Works with any text editor. No vendor lock-in.

**Portable & Self-Contained** - Everything needed is in the plugin. No external dependencies. Works in any Claude Code installation.

---

## Example Workflow

### Rapid Iteration with AI

**Natural conversation-based design:**

```
You: "Create a login screen with email, password, and a submit button"

AI: [Generates ASCII layout]
╭──────────────────────╮
│  Welcome Back        │
│  ┌────────────────┐  │
│  │ Email          │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Password       │  │
│  └────────────────┘  │
│  [    Sign In    ]   │
╰──────────────────────╯

You: "Add a forgot password link and make the button more prominent"

AI: [Iterates instantly]
╭──────────────────────╮
│  Welcome Back        │
│  ┌────────────────┐  │
│  │ Email          │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Password       │  │
│  └────────────────┘  │
│  Forgot password?    │
│  ╔════════════════╗  │
│  ║   SIGN IN      ║  │
│  ╚════════════════╝  │
╰──────────────────────╋

You: "Perfect! Now add the metadata for accessibility"

AI: [Adds structured .uxm metadata with ARIA labels, roles, keyboard navigation]
```

**Design converges through natural feedback on ASCII drawings.**

### Using Commands

**Quick single component:**
```bash
/fluxwing-create button
```

**Full screen with multiple components:**
```bash
/fluxwing-scaffold dashboard
```

**Browse the library:**
```bash
/fluxwing-library
```

**Validate your work:**
```bash
/fluxwing-validate
```

### Using Agents

**Let AI design autonomously:**
```
"Create a complete dashboard with revenue cards, user activity chart, and recent notifications"
```

The agent will:
- Generate ASCII layouts for review
- Create all necessary components
- Compose them into screens
- Add progressive levels of fidelity
- Validate everything

---

## Documentation

### Getting Started
- **[README.md](README.md)** (you are here) - Overview and quick start
- **[00-INDEX.md](fluxwing/data/docs/00-INDEX.md)** - Documentation navigation

### Reference
- **[COMMANDS.md](fluxwing/COMMANDS.md)** - Complete command reference
- **[AGENTS.md](fluxwing/AGENTS.md)** - Complete agent reference
- **[ARCHITECTURE.md](fluxwing/ARCHITECTURE.md)** - Technical design and decisions

### Guides
- **[Quick Start](fluxwing/data/docs/01-quick-start.md)** - 30-second component creation
- **[Core Concepts](fluxwing/data/docs/02-core-concepts.md)** - Understanding uxscii
- **[Component Creation](fluxwing/data/docs/03-component-creation.md)** - Step-by-step workflow
- **[Screen Composition](fluxwing/data/docs/04-screen-composition.md)** - Building complete screens
- **[Validation Guide](fluxwing/data/docs/05-validation-guide.md)** - Quality standards
- **[ASCII Patterns](fluxwing/data/docs/06-ascii-patterns.md)** - Visual toolkit
- **[Schema Reference](fluxwing/data/docs/07-schema-reference.md)** - Schema documentation

### Help
- **[TROUBLESHOOTING.md](fluxwing/TROUBLESHOOTING.md)** - Common issues and solutions
- **[CONTRIBUTING.md](fluxwing/CONTRIBUTING.md)** - How to extend and contribute
- **[PLUGIN_STRUCTURE.md](fluxwing/PLUGIN_STRUCTURE.md)** - Complete structure reference

### Development
- **[Development Docs](docs/)** - Internal development documentation and planning

---

## Contributing

Contributions welcome! To add features or improvements:

1. Read **[CONTRIBUTING.md](fluxwing/CONTRIBUTING.md)** for guidelines
2. Fork the repository
3. Create a feature branch
4. Make your changes
5. Submit a pull request

---

## Support

### Having Issues?

Check **[TROUBLESHOOTING.md](fluxwing/TROUBLESHOOTING.md)** for solutions to common problems.

### Need Help?

- **Issues**: Report bugs or request features on GitHub
- **Discussions**: Ask questions and share ideas on GitHub Discussions
- **Examples**: Browse `fluxwing/data/examples/` for component patterns
- **Documentation**: Check `fluxwing/data/docs/00-INDEX.md` for all guides

---

## License

MIT License - free to use and modify

---

## Credits

Built on the **uxscii standard** - an open, AI-native design markup language.

Fluxwing brings uxscii to Claude Code, making AI-powered UX design accessible to everyone.

---

## Full Installation Guide

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
git clone https://github.com/trabian/fluxwing-plugin.git
cd fluxwing-plugin
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

### Local Development Setup

When developing the plugin locally, you need to copy the built-in components to Claude's plugin cache directory:

**1. Navigate to the marketplace root:**

```bash
cd fluxwing-marketplace
```

**2. Run the setup script (first time only):**

```bash
npm run dev:setup
```

**3. After modifying built-in components, sync them:**

```bash
npm run dev:sync-components
```

This script copies the built-in components from `fluxwing/data/examples/` to the well-known location (`~/.claude/plugins/cache/fluxwing/data/examples/`) where Claude Code expects to find them.

### Requirements

- Claude Code (any version with plugin support)
- No external dependencies required
- Everything you need is bundled in the plugin

### Project Structure

```
fluxwing-marketplace/
├── .claude-plugin/          # Marketplace manifest
├── package.json             # Development scripts
├── tests/                   # Automated tests
├── docs/                    # Development documentation
└── fluxwing/               # The plugin
    ├── .claude-plugin/      # Plugin manifest
    ├── commands/            # 4 slash commands
    ├── agents/              # 3 autonomous agents
    ├── data/                # All uxscii assets (portable)
    │   ├── schema/          # JSON Schema validation
    │   ├── examples/        # 11 component templates
    │   ├── screens/         # 2 screen examples
    │   └── docs/            # Documentation modules
    └── [Documentation files]
```

**[See complete structure →](fluxwing/PLUGIN_STRUCTURE.md)**

---

<div align="center">

**Ready to design with AI?**

Start with: `/fluxwing-create` or `/fluxwing-library`

*Design beautiful UX with Fluxwing - your AI design assistant*

---

**[Commands](fluxwing/COMMANDS.md)** • **[Agents](fluxwing/AGENTS.md)** • **[Architecture](fluxwing/ARCHITECTURE.md)** • **[Contributing](fluxwing/CONTRIBUTING.md)** • **[Troubleshooting](fluxwing/TROUBLESHOOTING.md)**

</div>
