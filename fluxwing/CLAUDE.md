# CLAUDE.md

## Project Overview

**Fluxwing** - Design UIs at conversation speed. JSX → ASCII preview → React/Tailwind.

## Core Tools

| Tool | Purpose |
|------|---------|
| `render.tsx` | Render JSX to ASCII preview |
| `generate.tsx` | Generate React/Tailwind code |
| `validate.tsx` | Validate JSX and components |
| `import.tsx` | Save imported designs |

## Usage

```bash
# Preview
npx tsx render.tsx -w 60 <<< '<Card title="Hello"><Text>World</Text></Card>'

# Generate
npx tsx generate.tsx --component MyCard <<< '<Card>...</Card>'

# Validate
npx tsx validate.tsx <<< '<Button variant="primary">OK</Button>'
```

## Project Structure

```
fluxwing/
├── render.tsx          # ASCII preview renderer
├── generate.tsx        # React/Tailwind generator
├── validate.tsx        # JSX validator
├── import.tsx          # Import helper
├── src/components/     # Component implementations
├── components/         # Example component libraries (.yml)
├── skill/              # Claude Code skill
│   ├── SKILL.md
│   └── docs/
├── package.json
└── README.md
```

## Component Library

Components are in `src/components/`:
- `Text.tsx` - Text, Heading
- `Button.tsx` - Button
- `Input.tsx` - Input, Select, Checkbox
- `Layout.tsx` - Stack, Row, Box, Spacer, Divider
- `Feedback.tsx` - Alert, Badge, ProgressBar, Spinner
- `Navigation.tsx` - Link, Tabs
- `Table.tsx` - Table components

## Custom Components

Define in YAML files (`components/*.yml`) or inline:

```yaml
# components/forms.yml
FormField: <Stack gap={0}><Text dimmed>{label}</Text><Input placeholder={placeholder} /></Stack>
SubmitButton: <Button variant="primary">{label}</Button>
SubmitButton[hover]: <Button variant="outline">{label}</Button>
```

## Key Design Decisions

1. **JSX as source** - Familiar syntax, single language
2. **ASCII preview** - Fast iteration, human + AI readable
3. **React/Tailwind output** - Production-ready code generation
4. **Comments preserved** - Agent/human collaboration through inline notes
5. **State variants** - `Component[state]: template` syntax
