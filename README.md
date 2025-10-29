# Fluxwing Skills - Design at the Speed of Conversation

**Rapid iterative design with progressive fidelity.**

Fluxwing enables rapid iteration using ASCII—a format both humans and AI read natively:

1. **Start low-fidelity** - ASCII layouts in minutes, not hours
2. **Iterate with AI** - "Move this" → quick changes. "Add that" → done.
3. **Add fidelity progressively** - Metadata, tokens, behaviors as design solidifies
4. **Review and validate** - Get it right at low-fidelity before high-fidelity

**Why ASCII?** It's rapid. Both humans and AI read it natively. Structure first, pixels later.

---

## Progressive Fidelity Workflow

**Level 1: ASCII Layout**
```
╭──────────────────────╮
│  Welcome Back        │
│  ┌────────────────┐  │
│  │ Email          │  │
│  └────────────────┘  │
│  [    Sign In    ]   │
╰──────────────────────╯
```
Iterate with Claude: "Move button up" → quick changes. Try multiple layouts rapidly.

**Level 2: Component Metadata**
```json
{
  "id": "submit-button",
  "variant": "primary",
  "states": { "hover": {...}, "disabled": {...} }
}
```
Add behavior, states, accessibility as design solidifies.

**Level 3: Review and Move to High-Fidelity**
- Validate with stakeholders at low-fidelity
- Get feedback fast, iterate rapidly
- THEN build in React, design visually, implement

Get it right before investing in high-fidelity.

---

## What is Fluxwing?

**Fluxwing** is the AI-powered design tool. **uxscii** is the open standard it uses.

Think of it this way:
- **uxscii** = The language (like HTML/CSS)
- **Fluxwing** = The tool that speaks it (like a code editor for design)

---

## Installation

### Claude Code (CLI)

Get started in 10 seconds:

```bash
# In Claude Code, add the marketplace
/plugin marketplace add trabian/fluxwing-skills

# Install the plugin
/plugin install fluxwing-skills
```

**That's it!** Start designing by talking to Claude naturally.

### Claude Desktop App (macOS/Windows)

For the GUI Claude app:

1. **Download ZIP files** from [latest release](https://github.com/trabian/fluxwing-skills/releases/latest)
2. **Open Claude Desktop** > Settings > Capabilities
3. **Click "Upload skill"** and select a ZIP file
4. **Repeat** for each skill you want to install

**Available skills:** 6 ZIP files (one per skill)
- `fluxwing-component-creator.zip` (60KB)
- `fluxwing-library-browser.zip` (7.6KB)
- `fluxwing-component-expander.zip` (9.3KB)
- `fluxwing-screen-scaffolder.zip` (15KB)
- `fluxwing-component-viewer.zip` (6.6KB)
- `fluxwing-screenshot-importer.zip` (24KB)

**Requirements:** Pro, Max, Team, or Enterprise plan with code execution enabled

---

**See [INSTALL.md](INSTALL.md) for detailed instructions, development setup, and troubleshooting.**

---

## Quick Start

### Create Your First Component

Simply ask Claude:
```
"Create a button component"
```

The **fluxwing-component-creator** skill activates and guides you through creating a button with interactive states, accessibility attributes, and clean ASCII visualization.

### Browse the Library

Ask Claude:
```
"Show me all available components"
```

The **fluxwing-library-browser** skill shows you 11 bundled templates (buttons, inputs, cards, modals, etc.) and your project components.

### Build a Complete Screen

Ask Claude:
```
"Build a login screen"
```

The **fluxwing-screen-scaffolder** skill creates missing components, composes them into a screen, and generates rendered examples with real data.

### Add Component States

Ask Claude:
```
"Add hover state to my button"
```

The **fluxwing-component-expander** skill adds interactive states (hover, focus, disabled, active, error) to existing components.

---

## The Six Skills

| Skill | Triggers | Purpose |
|-------|----------|---------|
| **fluxwing-component-creator** | "Create a button", "I need an input component" | Create new components (buttons, inputs, cards, etc.) |
| **fluxwing-library-browser** | "Show me all components", "Browse the library" | Browse available templates and user components |
| **fluxwing-component-expander** | "Add hover state", "Make this interactive" | Add states to existing components |
| **fluxwing-screen-scaffolder** | "Create a login screen", "Build a dashboard" | Build complete screens from components |
| **fluxwing-component-viewer** | "Show me the submit-button", "View details" | View component details and metadata |
| **fluxwing-screenshot-importer** | "Import this screenshot", "Convert screenshot" | Convert screenshots to uxscii components |

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

### Rapid Iterative Design

**Iterate at conversation speed.** ASCII layouts enable rapid iteration through natural language.

You: "Create a login screen"
Claude: [ASCII layout in minutes]
You: "Move the button up, add forgot password"
Claude: [Updated quickly]

**Try multiple layouts rapidly.** Structure first. Pixels later.

### Progressive Fidelity = Progressive Commitment

Don't make detailed decisions too early. Start simple:

1. **ASCII layout** - Structure and hierarchy
2. **Component metadata** - Behavior and states
3. **Review and validate** - Fast feedback at low-fidelity
4. **Move to high-fidelity** - Build, design, implement when ready

Add detail as the design solidifies. Get it right before high-fidelity.

### Why ASCII? Rapid + Universal

ASCII enables rapid iteration and universal comprehension:

**Rapid:** No dragging, no resizing, just structure. Changes happen quickly through conversation.

**Universal:** Both humans AND AI read it natively.
- **Humans:** See structure instantly. Layout relationships clear. Visual feedback natural.
- **AI agents:** No vision models needed. Text-based. Zero ambiguity. Perfect comprehension.

One format. Two audiences. Conversation-speed iteration.

### Review Before High-Fidelity

Validate at low-fidelity before investing in high-fidelity:

- **Fast iteration** - Try multiple layouts rapidly at low-fidelity
- **Progressive fidelity** - Add metadata, states, tokens as design solidifies
- **Stakeholder review** - Get feedback fast using .uxm specs
- **Move when ready** - Build in React, design visually, implement

.uxm becomes your **implementation spec**.

**The complete workflow:**
1. Iterate rapidly at low-fidelity using ASCII
2. Add fidelity progressively (metadata, states, tokens)
3. Review and validate with stakeholders
4. Move to high-fidelity when ready (React, visual design, etc.)

Start fast. Get it right. Then invest in high-fidelity.

### What Fluxwing Enables

**Version Control Native** - Text-based diffs. See design changes in PRs. Collaborative editing. Track every change.

**Component Derivation** - Start with a base component, derive variations from it. Document relationships with `extends`. AI helps propagate changes when you ask.

**Living Documentation** - .uxm files are living specs. Review with stakeholders. Iterate rapidly. Always up to date.

**Open Standard** - uxscii is open, not proprietary. No vendor lock-in. Works with any text editor.

---

## Example Workflow

### From Idea to Implementation in Minutes

**Step 1: Start Low-Fidelity**

You: "Create a login screen with email, password, and submit button"

Claude generates ASCII layout:
```
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
```

**Step 2: Iterate Rapidly**

You: "Add forgot password link, make button more prominent"

Claude updates:
```
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
```

**Step 3: Add Fidelity Progressively**

You: "Add accessibility metadata and hover states"

Claude creates `.uxm` with ARIA labels, keyboard navigation, interaction states.

**Step 4: Review and Validate**

Share .uxm with stakeholders. Get feedback. Iterate rapidly. Get it right at low-fidelity.

**Step 5: Move to High-Fidelity**

Use .uxm as implementation spec. Build in React. Design visually. Implement with confidence.

**Total:** Fast iteration from idea to validated spec, ready for high-fidelity implementation.

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
