---
name: Fluxwing Ink Designer
description: Design UIs with JSX that render to ASCII for preview, then generate React/Tailwind code. Use when user wants to design, prototype, or create UI screens interactively with live ASCII preview. Also handles screenshot import - converting UI screenshots to JSX. Triggers on "design a", "create UI", "build a screen", "prototype", "import screenshot", "convert this UI", or mentions of ASCII/terminal UI preview.
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
- `import.tsx` - Helper for screenshot imports

**Run from the package directory:**
```bash
cd {SKILL_ROOT}/../../packages/fluxwing-ink && npx tsx render.tsx ...
```

## Core Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│  0. IMPORT (optional)                                           │
│  ┌─────────┐                  ┌─────────┐                       │
│  │Screenshot│ ──Claude Vision─▶│  JSX    │                       │
│  └─────────┘                  └─────────┘                       │
│                                    │                             │
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

## Screenshot Import Workflow

When user provides a screenshot or asks to "import", "convert", or "recreate" a UI:

### Step 1: Read the Screenshot

Use the Read tool to view the image:

```typescript
Read({ file_path: "/path/to/screenshot.png" })
```

### Step 2: Analyze the UI Structure

Examine the screenshot and identify:

1. **Layout Structure**
   - Overall layout (single column, sidebar, grid)
   - Major sections and their arrangement
   - Spacing and alignment patterns

2. **Components**
   - Cards, panels, containers
   - Form elements (inputs, buttons, selects)
   - Text elements (headings, labels, body text)
   - Navigation elements
   - Feedback elements (alerts, badges, progress)

3. **Visual Hierarchy**
   - Primary vs secondary actions
   - Emphasis and de-emphasis
   - Grouping and separation

### Step 3: Map to Available Components

Map UI elements to fluxwing-ink components:

| Screenshot Element | JSX Component |
|-------------------|---------------|
| Bordered container with title | `<Card title="...">` |
| Text input with label | `<Input label="..." />` |
| Primary button | `<Button variant="primary">` |
| Secondary/ghost button | `<Button variant="outline">` |
| Vertical stack of elements | `<Stack gap={1}>` |
| Horizontal row | `<Row gap={1}>` |
| Section heading | `<Heading level={2}>` |
| Muted/secondary text | `<Text dimmed>` |
| Checkbox with label | `<Checkbox label="..." />` |
| Dropdown | `<Select options={[...]} />` |
| Alert/notification | `<Alert variant="...">` |
| Status indicator | `<Badge variant="...">` |

### Step 4: Generate JSX

Create JSX that recreates the structure:

```jsx
{/* Imported from screenshot: login-page.png */}
<Card title="Sign In">
  <Stack gap={1}>
    {/* Email field - prominent position */}
    <Input label="Email" placeholder="you@example.com" />
    {/* Password with show/hide toggle in original */}
    <Input label="Password" type="password" />
    {/* Remember me was a checkbox in original */}
    <Checkbox label="Remember me" />
    {/* Primary CTA - full width in original */}
    <Button variant="primary">Sign In</Button>
    {/* Secondary link below - convert to outline button */}
    <Button variant="outline">Forgot Password?</Button>
  </Stack>
</Card>
```

**Use comments to document:**
- Source of the import
- Elements that couldn't be exactly replicated
- Decisions made during conversion
- TODOs for features not yet supported

### Step 5: Render and Compare

Render the JSX and show alongside original intent:

```bash
cd {SKILL_ROOT}/../../packages/fluxwing-ink && npx tsx render.tsx -w 60 <<'EOF'
... generated JSX ...
EOF
```

Ask user: "Here's my interpretation. What would you like to adjust?"

### Step 6: Iterate

Refine based on feedback until the ASCII preview matches user's expectations.

### Import Tips

1. **Start with structure** - Get the layout right first, then refine details
2. **Use comments liberally** - Document what you saw vs what you created
3. **Note limitations** - Some UI elements may not have exact ASCII equivalents
4. **Offer alternatives** - If a component doesn't exist, suggest closest match
5. **Extract patterns** - If you see repeated elements, define custom components

### Example Import Session

```
User: Import this screenshot [provides path to login-form.png]

Agent: [Reads the image]

I can see a login form with:
- Card container with "Welcome Back" title
- Email input field
- Password input field
- "Remember me" checkbox
- Blue "Sign In" button
- "Forgot password?" link

Let me recreate this:

[Renders ASCII preview]

╭────────────────────────────────────────────╮
│ Welcome Back                               │
│                                            │
│ Email                                      │
│ ┌────────────────────────────────────────┐ │
│ │Enter your email                        │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Password                                   │
│ ┌────────────────────────────────────────┐ │
│ │••••••••                                │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ ☑ Remember me                              │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │              Sign In                   │ │
│ └────────────────────────────────────────┘ │
│                                            │
│         Forgot password?                   │
╰────────────────────────────────────────────╯

Notes:
- The blue button color will appear in generated Tailwind
- "Forgot password?" converted to centered text (could be Link)

Would you like any adjustments?
```

---

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
