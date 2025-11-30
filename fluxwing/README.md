# Fluxwing

**Design UIs at conversation speed.**

```
JSX → ASCII Preview → React/Tailwind
```

```bash
npx tsx render.tsx <<< '<Card title="Hello"><Button>World</Button></Card>'
```

```
╭──────────────────────────────────────╮
│ Hello                                │
│                                      │
│ ┌─────────┐                          │
│ │  World  │                          │
│ └─────────┘                          │
╰──────────────────────────────────────╯
```

## Install

```bash
npm install
```

## Usage

### Preview

```bash
npx tsx render.tsx -w 60 <<< '<Card title="Login"><Input label="Email" /><Button variant="primary">Sign In</Button></Card>'
```

### Generate React/Tailwind

```bash
npx tsx generate.tsx --component LoginForm <<< '<Card title="Login">...</Card>'
```

### Validate

```bash
npx tsx validate.tsx <<< '<Button variant="invalid">Oops</Button>'
```

## Components

| Component | Props |
|-----------|-------|
| `Stack` | `gap={0-3}` |
| `Row` | `gap`, `justify` |
| `Card` | `title` |
| `Button` | `variant` (primary/outline/danger) |
| `Input` | `label`, `placeholder`, `type` |
| `Text` | `bold`, `dimmed`, `color` |
| `Checkbox` | `label`, `checked` |
| `Select` | `label`, `options` |
| `Alert` | `variant` (info/success/warning/error) |
| `Badge` | `variant` |

## Custom Components

```bash
npx tsx render.tsx <<'EOF'
--- components
FormField: <Stack gap={0}><Text dimmed>{label}</Text><Input placeholder={placeholder} /></Stack>
---
<FormField label="Email" placeholder="you@example.com" />
EOF
```

## State Variants

```
--- components
MyButton: <Button variant="primary">{label}</Button>
MyButton[hover]: <Button variant="outline">{label}</Button>
---
<MyButton label="Click" state="hover" />
```

## Save Designs

```bash
npx tsx render.tsx --save ./designs/login <<< '<Card>...</Card>'
```

Creates: `login.tsx`, `login.preview.txt`, `login.meta.json`

## Claude Code Skill

```bash
cp -r skill ~/.claude/skills/fluxwing-designer
```

## License

MIT
