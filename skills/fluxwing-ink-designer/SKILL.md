---
name: Fluxwing Ink Designer
description: Design UIs with JSX that render to ASCII for preview, then generate React/Tailwind code. Use when user wants to design, prototype, or create UI screens interactively with live ASCII preview. Triggers on "design a", "create UI", "build a screen", "prototype", or mentions of ASCII/terminal UI preview.
version: 0.0.1
author: Trabian
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, TodoWrite
---

# Fluxwing Ink Designer

You are helping the user design UIs using **JSX components** that render to **ASCII art** for terminal preview, then generate **production React/Tailwind code**.

## Tool Location

All tools are in `{SKILL_ROOT}/../../packages/fluxwing-ink/`:
- `render.tsx` - Render JSX to ASCII preview
- `generate.tsx` - Generate React/Tailwind code
- `validate.tsx` - Validate JSX and components

**Run from the package directory:**
```bash
cd {SKILL_ROOT}/../../packages/fluxwing-ink && npx tsx render.tsx ...
```

## Core Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. DESIGN                    2. ITERATE                        │
│  ┌─────────┐                  ┌─────────┐                       │
│  │  JSX    │ ──render.tsx──▶  │  ASCII  │ ◀── User feedback     │
│  └─────────┘                  └─────────┘         │              │
│       ▲                            │              │              │
│       └────────────────────────────┴──────────────┘              │
│                                                                  │
│  3. GENERATE                  4. SHIP                           │
│  ┌─────────┐                  ┌─────────┐                       │
│  │  JSX    │ ─generate.tsx─▶  │ React + │ ──▶ Production        │
│  └─────────┘                  │Tailwind │                       │
│                               └─────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

## Available Components

### Layout
| Component | Props | Description |
|-----------|-------|-------------|
| `Stack` | `gap={0-3}`, `align` | Vertical flex container |
| `Row` | `gap={0-3}`, `justify`, `align` | Horizontal flex container |
| `Box` | `width`, `height`, `padding` | Generic container |
| `Spacer` | - | Flexible space |
| `Divider` | `style` | Horizontal rule |

### Text
| Component | Props | Description |
|-----------|-------|-------------|
| `Text` | `bold`, `italic`, `dimmed`, `color` | Inline text |
| `Heading` | `level={1-4}` | Headings h1-h4 |

### Interactive
| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `variant`, `disabled`, `borderStyle` | Clickable button |
| `Input` | `label`, `placeholder`, `type` | Text input field |
| `Select` | `label`, `options={[...]}` | Dropdown select |
| `Checkbox` | `label`, `checked` | Checkbox input |

### Containers
| Component | Props | Description |
|-----------|-------|-------------|
| `Card` | `title`, `borderStyle` | Bordered card |
| `Panel` | `title` | Light background panel |

### Feedback
| Component | Props | Description |
|-----------|-------|-------------|
| `Alert` | `variant` (info/success/warning/error) | Alert message |
| `Badge` | `variant` | Small label |
| `ProgressBar` | `value`, `color` | Progress indicator |
| `Spinner` | `size` | Loading spinner |

### Navigation
| Component | Props | Description |
|-----------|-------|-------------|
| `Link` | `href` | Hyperlink |
| `Tabs` | `tabs={[...]}`, `activeIndex` | Tab navigation |

### Table
| Component | Description |
|-----------|-------------|
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHeaderCell` | Table structure |

## Design Session Workflow

### Step 1: Understand the Request

When user asks to design a UI:
1. Clarify the purpose (login form, dashboard, settings page, etc.)
2. Identify key elements needed
3. Ask about any specific requirements or constraints

### Step 2: Create Initial Design

Render JSX to ASCII and display directly in your response:

```bash
cd {SKILL_ROOT}/../../packages/fluxwing-ink && npx tsx render.tsx -w 60 <<'EOF'
<Card title="Login">
  <Stack gap={1}>
    {/* User credentials */}
    <Input label="Email" placeholder="you@example.com" />
    <Input label="Password" type="password" />
    <Button variant="primary">Sign In</Button>
  </Stack>
</Card>
EOF
```

**IMPORTANT**: Always display the ASCII output directly in your response so the user can see the design.

### Step 3: Iterate Based on Feedback

When user requests changes:
1. Modify the JSX
2. Re-render and show the updated preview
3. Repeat until user is satisfied

**Use comments to document intent:**
```jsx
{/* Primary action - should be prominent */}
<Button variant="primary">Submit</Button>
{/* TODO: Add forgot password link */}
```

### Step 4: Save the Design (Optional)

When user is happy with the design:

```bash
npx tsx render.tsx -w 60 --save ./fluxwing/screens/login <<'EOF'
... final JSX ...
EOF
```

This creates:
- `login.tsx` - JSX source
- `login.preview.txt` - ASCII preview
- `login.meta.json` - Metadata

### Step 5: Generate Production Code

When ready to ship:

```bash
npx tsx generate.tsx -t react-tailwind --component LoginForm <<'EOF'
... final JSX ...
EOF
```

Output is production-ready React with Tailwind CSS.

## Custom Components

### Inline Definition

Define reusable components in the JSX input:

```bash
npx tsx render.tsx -w 60 <<'EOF'
--- components
FormField: <Stack gap={0}><Text dimmed>{label}</Text><Input placeholder={placeholder} /></Stack>
SubmitButton: <Button variant="primary">{label}</Button>
SubmitButton[hover]: <Button variant="primary" borderStyle="double">{label}</Button>
---
<Card title="Contact">
  <Stack gap={1}>
    <FormField label="Name" placeholder="Your name" />
    <FormField label="Email" placeholder="you@example.com" />
    <SubmitButton label="Send" />
  </Stack>
</Card>
EOF
```

### From File

Load components from a YAML file:

```bash
npx tsx render.tsx -w 60 -c components/finance.yml <<'EOF'
<Card title="Portfolio">
  <HoldingRow symbol="AAPL" shares="100" value="$17,500" change="+2.5%" />
</Card>
EOF
```

### State Variants

Components can have state-specific templates:

```
ComponentName: <default template>
ComponentName[hover]: <hover state template>
ComponentName[focus]: <focus state template>
ComponentName[disabled]: <disabled state template>
```

Use with the `state` prop:
```jsx
<SubmitButton label="Send" state="hover" />
```

Show all states:
```bash
npx tsx render.tsx -w 60 --states <<'EOF'
--- components
MyButton: <Button variant="primary">{label}</Button>
MyButton[hover]: <Button variant="outline">{label}</Button>
---
<MyButton label="Test" />
EOF
```

## Validation

Validate JSX before generating:

```bash
npx tsx validate.tsx <<'EOF'
<Card title="Test">
  <Button variant="invalid">Oops</Button>
</Card>
EOF
```

Output shows:
- Component count
- Custom component usage
- Comment count
- Errors (invalid values, missing required props)
- Warnings (unknown components, wrong types)

## CLI Reference

### render.tsx
```
npx tsx render.tsx [options] <<< '<JSX>'

Options:
  -w, --width <n>      Fixed width (default: terminal width)
  -c, --components <f> Load components from YAML file
  -s, --save <path>    Save design to files (no extension)
  --states             Show all component states
```

### generate.tsx
```
npx tsx generate.tsx [options] <<< '<JSX>'

Options:
  -t, --target <t>     Target platform (react-tailwind)
  -i, --input <file>   Read from saved .tsx file
  -o, --output <file>  Write to file
  -c, --components <f> Load components from YAML file
  --component <name>   Wrap output in named React component
  --no-format          Skip formatting
```

### validate.tsx
```
npx tsx validate.tsx [options] <<< '<JSX>'

Options:
  -i, --input <file>   Read from file
  -c, --components <f> Load component definitions
  --check-components   Validate component definitions
  --json               Output as JSON
```

## Example Design Session

```
User: Design a settings page with user profile and notifications

Agent: I'll create a settings page with profile and notification sections.

[Renders initial design]

╭────────────────────────────────────────────────────────────╮
│ Settings                                                    │
│                                                             │
│ Profile                                                     │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Name                                                    │ │
│ │ ┌──────────────────────────────────┐                   │ │
│ │ │John Doe                          │                   │ │
│ │ └──────────────────────────────────┘                   │ │
│ │                                                         │ │
│ │ Email                                                   │ │
│ │ ┌──────────────────────────────────┐                   │ │
│ │ │john@example.com                  │                   │ │
│ │ └──────────────────────────────────┘                   │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                             │
│ Notifications                                               │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ ☑ Email notifications                                   │ │
│ │ ☐ SMS notifications                                     │ │
│ │ ☑ Push notifications                                    │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌────────┐ ┌────────────┐                                  │
│ │ Cancel │ │ Save       │                                  │
│ └────────┘ └────────────┘                                  │
╰────────────────────────────────────────────────────────────╯

User: Move the buttons to the right side

Agent: [Re-renders with buttons right-aligned]

...iteration continues...

User: Looks good, generate the React code

Agent: [Generates React/Tailwind code]

export function SettingsPage() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      ...
    </div>
  );
}
```

## Best Practices

1. **Start simple** - Begin with basic structure, add detail iteratively
2. **Use comments** - Document intent with `{/* comments */}` for collaboration
3. **Validate early** - Check for issues before generating code
4. **Save milestones** - Use `--save` to preserve good iterations
5. **Define custom components** - Create reusable pieces for consistency
6. **Show the preview** - Always display ASCII output so user can see changes

## Success Criteria

- ✓ User can see ASCII preview of their design
- ✓ Iteration is fast (seconds, not minutes)
- ✓ Comments document design decisions
- ✓ Custom components enable consistency
- ✓ Generated code is production-ready React/Tailwind
- ✓ Validation catches issues before code generation
