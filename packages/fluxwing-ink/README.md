# Fluxwing Ink

A React Ink-based UI design system for terminal ASCII/Unicode rendering.

## Concept

Write UI designs in JSX, preview them in the terminal as ASCII art, then transform to platform-specific code.

```
Design JSX ──render──> ASCII Preview ──transform──> React/RN/SwiftUI
```

## Quick Start

```bash
# Install dependencies
npm install

# Run examples
npx tsx examples/login-screen.tsx
npx tsx examples/dashboard.tsx
npx tsx examples/settings-form.tsx
npx tsx examples/component-showcase.tsx
```

## Components

### Typography
- `Text` - Base text with styling (bold, italic, color, etc.)
- `Heading` - Heading levels 1-4
- `Label` - Muted label text
- `Link` - Styled link text

### Buttons
- `Button` - Primary, secondary, outline, ghost, danger variants
- `ButtonGroup` - Horizontal button container

### Form Inputs
- `Input` - Text, password, email inputs with states
- `TextArea` - Multi-line text input
- `Select` - Dropdown selector
- `Checkbox` - Toggle checkbox
- `Radio` - Radio button selection

### Layout
- `Card` - Rounded border container
- `Panel` - Single border container
- `Stack` - Vertical flex container
- `Row` - Horizontal flex container
- `Screen` - Full screen wrapper
- `Divider` - Horizontal line separator
- `Spacer` - Flexible space

### Feedback
- `Alert` - Info, success, warning, error alerts
- `Badge` - Status badges
- `Progress` - Progress bar
- `Spinner` - Loading indicator
- `Toast` - Notification toast

### Navigation
- `TabBar` - Horizontal tabs
- `Nav` / `NavItem` - Navigation menu
- `Breadcrumb` - Breadcrumb trail
- `Pagination` - Page navigation

### Data Display
- `Table` - Data table with columns
- `List` - Bulleted or ordered list

## Example: Login Screen

```tsx
import React from 'react';
import { render } from 'ink';
import { Card, Stack, Heading, Input, Button, Link } from '@fluxwing/ink';

const LoginScreen = () => (
  <Card>
    <Stack gap={1}>
      <Heading level={1} align="center">Welcome Back</Heading>
      <Input label="Email" placeholder="you@example.com" />
      <Input label="Password" type="password" />
      <Button variant="primary" fullWidth>Sign In</Button>
      <Link>Forgot password?</Link>
    </Stack>
  </Card>
);

render(<LoginScreen />);
```

Output:
```
╭─────────────────────────────────────╮
│           Welcome Back              │
│                                     │
│  Email                              │
│  ┌───────────────────────────────┐  │
│  │ you@example.com               │  │
│  └───────────────────────────────┘  │
│                                     │
│  Password                           │
│  ┌───────────────────────────────┐  │
│  │ ••••••••                      │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │           Sign In             │  │
│  └───────────────────────────────┘  │
│                                     │
│       Forgot password?              │
╰─────────────────────────────────────╯
```

## Architecture

```
packages/fluxwing-ink/
├── src/
│   ├── components/        # UI component library
│   │   ├── Text.tsx       # Typography
│   │   ├── Button.tsx     # Buttons
│   │   ├── Input.tsx      # Form inputs
│   │   ├── Layout.tsx     # Layout containers
│   │   ├── Feedback.tsx   # Alerts, badges, progress
│   │   ├── Navigation.tsx # Tabs, nav, breadcrumbs
│   │   ├── Table.tsx      # Data display
│   │   └── index.ts       # Exports
│   └── index.ts           # Main entry
├── examples/              # Example designs
│   ├── login-screen.tsx
│   ├── dashboard.tsx
│   ├── settings-form.tsx
│   └── component-showcase.tsx
└── package.json
```

## Future: Code Generation

The same JSX that renders to ASCII can be transformed to platform code:

```tsx
// Design (what you write)
<Button variant="primary">Submit</Button>

// ASCII Output (terminal preview)
┌──────────────┐
│    Submit    │
└──────────────┘

// React Web Output (generated)
<button className="btn btn-primary">Submit</button>

// React Native Output (generated)
<TouchableOpacity style={styles.primaryButton}>
  <Text style={styles.buttonText}>Submit</Text>
</TouchableOpacity>
```

## Workflow with Claude Code

1. Describe your UI needs
2. Claude generates JSX design
3. System renders ASCII preview in terminal
4. Review and request changes
5. Iterate until satisfied
6. Generate platform-specific code

## License

MIT
