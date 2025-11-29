# Fluxwing - Design UIs at Conversation Speed

**JSX → ASCII Preview → Production Code**

Design UIs through natural conversation with Claude. See changes instantly as ASCII art, then generate production React/Tailwind code.

```
┌─────────────────────────────────────────────────────────────────┐
│  You: "Design a login form"                                     │
│                                                                 │
│  Claude renders:                                                │
│  ╭────────────────────────────────────────╮                     │
│  │ Sign In                                │                     │
│  │                                        │                     │
│  │ Email                                  │                     │
│  │ ┌────────────────────────────────────┐ │                     │
│  │ │you@example.com                     │ │                     │
│  │ └────────────────────────────────────┘ │                     │
│  │                                        │                     │
│  │ Password                               │                     │
│  │ ┌────────────────────────────────────┐ │                     │
│  │ │••••••••                            │ │                     │
│  │ └────────────────────────────────────┘ │                     │
│  │                                        │                     │
│  │ ┌────────────────────────────────────┐ │                     │
│  │ │            Sign In                 │ │                     │
│  │ └────────────────────────────────────┘ │                     │
│  ╰────────────────────────────────────────╯                     │
│                                                                 │
│  You: "Add a forgot password link"                              │
│  Claude: [updates instantly]                                    │
│                                                                 │
│  You: "Generate the React code"                                 │
│  Claude: [outputs production React/Tailwind]                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Why Fluxwing?

**Fast Iteration** - See changes in seconds, not minutes. ASCII renders instantly.

**Familiar Syntax** - Write JSX. No new language to learn.

**Production Ready** - Generate React with Tailwind CSS when you're done.

**Human + AI Native** - ASCII is readable by both humans and AI without vision models.

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/trabian/fluxwing-skills.git
cd fluxwing-skills

# Install dependencies
cd packages/fluxwing-ink
npm install
```

### Your First Design

```bash
npx tsx render.tsx -w 50 <<< '<Card title="Hello"><Text>Welcome to Fluxwing!</Text></Card>'
```

Output:
```
╭────────────────────────────────────────────────╮
│ Hello                                          │
│                                                │
│ Welcome to Fluxwing!                           │
╰────────────────────────────────────────────────╯
```

### Generate Production Code

```bash
npx tsx generate.tsx --component HelloCard <<< '<Card title="Hello"><Text>Welcome!</Text></Card>'
```

Output:
```jsx
export function HelloCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Hello</h3>
      </div>
      <div className="p-4">
        <span className="text-base">Welcome!</span>
      </div>
    </div>
  );
}
```

---

## The Workflow

### 1. Design with JSX

Write familiar JSX using Fluxwing components:

```jsx
<Card title="Contact Us">
  <Stack gap={1}>
    <Input label="Name" placeholder="Your name" />
    <Input label="Email" placeholder="you@example.com" />
    <Button variant="primary">Send Message</Button>
  </Stack>
</Card>
```

### 2. Preview as ASCII

Render to see instant visual feedback:

```bash
npx tsx render.tsx -w 50 <<< '...'
```

### 3. Iterate with Feedback

- "Move the button to the right"
- "Add a cancel button"
- "Make the card wider"

Changes render in seconds.

### 4. Generate Production Code

When satisfied, generate React/Tailwind:

```bash
npx tsx generate.tsx --component ContactForm <<< '...'
```

---

## Available Components

### Layout
| Component | Props | Description |
|-----------|-------|-------------|
| `Stack` | `gap={0-3}` | Vertical flex |
| `Row` | `gap`, `justify` | Horizontal flex |
| `Box` | `width`, `padding` | Container |
| `Spacer` | - | Flex spacer |
| `Divider` | - | Horizontal rule |

### Text
| Component | Props | Description |
|-----------|-------|-------------|
| `Text` | `bold`, `dimmed`, `color` | Inline text |
| `Heading` | `level={1-4}` | Headings |

### Interactive
| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `variant` | primary, outline, danger |
| `Input` | `label`, `placeholder`, `type` | Text input |
| `Select` | `label`, `options` | Dropdown |
| `Checkbox` | `label`, `checked` | Checkbox |

### Containers
| Component | Props | Description |
|-----------|-------|-------------|
| `Card` | `title` | Bordered card |
| `Panel` | `title` | Light panel |

### Feedback
| Component | Props | Description |
|-----------|-------|-------------|
| `Alert` | `variant` | info, success, warning, error |
| `Badge` | `variant` | Status indicator |
| `ProgressBar` | `value` | Progress (0-100) |

---

## Advanced Features

### Custom Components

Define reusable components inline:

```bash
npx tsx render.tsx -w 60 <<'EOF'
--- components
FormField: <Stack gap={0}><Text dimmed>{label}</Text><Input placeholder={placeholder} /></Stack>
SubmitBtn: <Button variant="primary">{label}</Button>
---
<Card title="Register">
  <Stack gap={1}>
    <FormField label="Email" placeholder="you@example.com" />
    <FormField label="Password" placeholder="••••••••" />
    <SubmitBtn label="Create Account" />
  </Stack>
</Card>
EOF
```

Or load from a file:

```bash
npx tsx render.tsx -c components/forms.yml <<< '<FormField label="Name" />'
```

### State Variants

Define component states (hover, focus, disabled):

```
--- components
MyButton: <Button variant="primary">{label}</Button>
MyButton[hover]: <Button variant="outline">{label}</Button>
MyButton[disabled]: <Button dimColor>{label}</Button>
---
<MyButton label="Click me" state="hover" />
```

### Comments for Collaboration

Comments pass through to generated code:

```jsx
<Card title="Checkout">
  {/* Payment section - integrates with Stripe */}
  <Input label="Card Number" />
  {/* TODO: Add expiry and CVV fields */}
</Card>
```

### Screenshot Import

Convert existing UI screenshots to JSX:

1. Share a screenshot with Claude
2. Claude analyzes and generates JSX
3. Preview and iterate
4. Generate production code

### Validation

Check for issues before generating:

```bash
npx tsx validate.tsx <<< '<Button variant="invalid">Oops</Button>'
```

```
Errors:
  ✗ Invalid value "invalid" for prop "variant" on Button
```

### Save Designs

Persist designs with metadata:

```bash
npx tsx render.tsx --save ./designs/login -w 60 <<< '<Card>...</Card>'
```

Creates:
- `login.tsx` - JSX source
- `login.preview.txt` - ASCII preview
- `login.meta.json` - Metadata

---

## CLI Reference

### render.tsx - Preview

```bash
npx tsx render.tsx [options] <<< '<JSX>'

-w, --width <n>       Fixed width (default: terminal width)
-c, --components <f>  Load components from YAML file
-s, --save <path>     Save design to files
--states              Show all component states
```

### generate.tsx - Generate Code

```bash
npx tsx generate.tsx [options] <<< '<JSX>'

-t, --target <t>      Target: react-tailwind (default)
--component <name>    Wrap in named React component
-i, --input <file>    Read from saved .tsx file
-o, --output <file>   Write to file
```

### validate.tsx - Validate

```bash
npx tsx validate.tsx [options] <<< '<JSX>'

-c, --components <f>  Load component definitions
--check-components    Validate component definitions
--json                Output as JSON
```

---

## Using with Claude Code

Install the skill for guided workflows:

```bash
# Copy skill to Claude's skills directory
cp -r skills/fluxwing-ink-designer ~/.claude/skills/
```

Then talk to Claude naturally:
- "Design a settings page"
- "Import this screenshot"
- "Generate React code for the dashboard"

---

## Project Structure

```
fluxwing-skills/
├── packages/
│   └── fluxwing-ink/           # Core tools
│       ├── render.tsx          # ASCII preview
│       ├── generate.tsx        # Code generation
│       ├── validate.tsx        # Validation
│       ├── import.tsx          # Import helper
│       ├── src/components/     # React Ink components
│       └── components/         # Example component libraries
├── skills/
│   └── fluxwing-ink-designer/  # Claude Code skill
│       ├── SKILL.md            # Workflow instructions
│       └── docs/               # Component reference
└── README.md
```

---

## Why ASCII?

**Speed** - Renders instantly. No graphics pipeline.

**Universal** - Humans read it. AI reads it. No vision model needed.

**Diff-friendly** - Text-based changes show clearly in version control.

**Low fidelity first** - Get structure right before pixel-perfect details.

---

## License

MIT License

---

<div align="center">

**Design at the speed of conversation.**

`npx tsx render.tsx <<< '<Card title="Hello"><Text>World</Text></Card>'`

</div>
