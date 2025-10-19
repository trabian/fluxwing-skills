# Fluxwing Skills - AI-Native UX Design for Claude Code

**Design beautiful UX and screens with AI using the uxscii standard.**

Fluxwing Skills brings AI-native UX design to Claude Code through six specialized skills. Built on the open **uxscii standard**, it enables a rapid design feedback loop: AI generates visual specs using ASCII art, humans review and iterate naturally, and the system captures increasing levels of fidelity through structured metadata.

**The perfect collaboration:** AI excels at creating ASCII layouts. Humans excel at giving feedback on ASCII drawings. Together, they create production-ready designs through progressive refinement.

---

## What is Fluxwing?

**Fluxwing** is the AI agent system that helps you design. **uxscii** is the standard format it uses.

Think of it this way:
- **uxscii** = The language (like HTML/CSS)
- **Fluxwing** = The designer who speaks that language (like Figma, but AI-powered)

---

## Installation

Get started in 30 seconds:

```bash
# Clone the repository
git clone https://github.com/trabian/fluxwing-skills.git
cd fluxwing-skills

# Run the installation script
./scripts/install.sh
```

The installer will:
- Auto-detect installation location (global or local project)
- Copy skills to the appropriate location
- Verify all templates and schemas
- Provide usage examples

**That's it!** Start designing by talking to Claude naturally.

**See [INSTALL.md](INSTALL.md) for detailed installation options.**

---

## Quick Start

### Create Your First Component

Simply ask Claude:
```
"Create a button component"
```

The **uxscii-component-creator** skill activates and guides you through creating a button with interactive states, accessibility attributes, and clean ASCII visualization.

### Browse the Library

Ask Claude:
```
"Show me all available components"
```

The **uxscii-library-browser** skill shows you 11 bundled templates (buttons, inputs, cards, modals, etc.) and your project components.

### Build a Complete Screen

Ask Claude:
```
"Build a login screen"
```

The **uxscii-screen-scaffolder** skill creates missing components, composes them into a screen, and generates rendered examples with real data.

### Add Component States

Ask Claude:
```
"Add hover state to my button"
```

The **uxscii-component-expander** skill adds interactive states (hover, focus, disabled, active, error) to existing components.

---

## The Six Skills

| Skill | Triggers | Purpose |
|-------|----------|---------|
| **uxscii-component-creator** | "Create a button", "I need an input component" | Create new components (buttons, inputs, cards, etc.) |
| **uxscii-library-browser** | "Show me all components", "Browse the library" | Browse available templates and user components |
| **uxscii-component-expander** | "Add hover state", "Make this interactive" | Add states to existing components |
| **uxscii-screen-scaffolder** | "Create a login screen", "Build a dashboard" | Build complete screens from components |
| **uxscii-component-viewer** | "Show me the submit-button", "View details" | View component details and metadata |
| **uxscii-screenshot-importer** | "Import this screenshot", "Convert screenshot" | Convert screenshots to uxscii components |

**Skills activate automatically** based on your natural language requests to Claude.

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

### Output Structure

**All component and screen outputs are saved to your project:**

```
./fluxwing/                  # Your project files
├── components/              # Your created components (.uxm + .md)
├── screens/                 # Your created screens (.uxm + .md + .rendered.md)
└── library/                 # Customized copies of templates
```

**Skills include bundled templates** (READ-ONLY reference materials):

```
.claude/skills/{skill-name}/
├── templates/               # 11 component templates
├── schemas/                 # JSON Schema validation
└── docs/                    # Documentation modules
```

**The Golden Rule**: Skills READ from bundled templates, WRITE to your project workspace.

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

**Portable & Self-Contained** - Everything needed is bundled in the skills. No external dependencies. Works in any Claude Code installation.

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
╰──────────────────────╯

You: "Perfect! Now add the metadata for accessibility"

AI: [Adds structured .uxm metadata with ARIA labels, roles, keyboard navigation]
```

**Design converges through natural feedback on ASCII drawings.**

---

## What's Included

**Six Specialized Skills:**
Component creation, library browsing, state expansion, screen scaffolding, component viewing, and screenshot importing.

**11 Curated Component Templates:**
Buttons, inputs, cards, modals, navigation, alerts, badges, lists, forms, and more.

**2 Complete Screen Examples:**
Login screen and dashboard with rendered examples showing real data.

**Complete Documentation:**
Modular guides optimized for AI agents, full uxscii reference, ASCII pattern library, and validation standards.

**Production-Ready Schema:**
JSON Schema for validation with complete field reference and extensible architecture.

---

## Documentation

### Getting Started
- **[README.md](README.md)** (you are here) - Overview and quick start
- **[INSTALL.md](INSTALL.md)** - Comprehensive installation guide

### Development
- **[CLAUDE.md](CLAUDE.md)** - Guidance for Claude Code when working with this repository
- **[TODO.md](TODO.md)** - Current development status and tasks

### Skill Documentation
Each skill includes its own documentation:
- `.claude/skills/{skill-name}/SKILL.md` - Skill workflow and instructions
- `.claude/skills/{skill-name}/docs/` - Modular documentation modules
- `.claude/skills/{skill-name}/templates/` - Component templates
- `.claude/skills/{skill-name}/schemas/` - JSON Schema validation

---

## Uninstallation

To remove the skills:

```bash
./scripts/uninstall.sh
```

Your project data in `./fluxwing/` is **never deleted** during uninstallation.

---

## Support

### Need Help?

- **Issues**: Report bugs or request features on GitHub
- **Documentation**: Check [INSTALL.md](INSTALL.md) and [CLAUDE.md](CLAUDE.md)
- **Examples**: Browse `.claude/skills/*/templates/` for component patterns

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

Install with `./scripts/install.sh` and start talking to Claude naturally.

*Design beautiful UX with Fluxwing - your AI design assistant*

</div>
