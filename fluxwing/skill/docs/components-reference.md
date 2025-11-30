# Component Reference

Quick reference for all available components in fluxwing-ink.

## Layout Components

### Stack
Vertical flex container.

```jsx
<Stack gap={1} align="center">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</Stack>
```

| Prop | Type | Values | Default |
|------|------|--------|---------|
| `gap` | number | 0-3 | 0 |
| `align` | string | start, center, end, stretch | start |

### Row
Horizontal flex container.

```jsx
<Row gap={2} justify="between">
  <Button>Left</Button>
  <Button>Right</Button>
</Row>
```

| Prop | Type | Values | Default |
|------|------|--------|---------|
| `gap` | number | 0-3 | 0 |
| `justify` | string | start, center, end, between, around | start |
| `align` | string | start, center, end | start |

### Box
Generic container with dimensions.

```jsx
<Box width={20} padding={1}>
  <Text>Content</Text>
</Box>
```

| Prop | Type | Default |
|------|------|---------|
| `width` | number | auto |
| `height` | number | auto |
| `padding` | number | 0 |

### Spacer
Flexible space that expands.

```jsx
<Row>
  <Text>Left</Text>
  <Spacer />
  <Text>Right</Text>
</Row>
```

### Divider
Horizontal rule.

```jsx
<Divider />
```

## Text Components

### Text
Inline text with formatting.

```jsx
<Text bold color="green">Success!</Text>
<Text dimmed>Secondary text</Text>
```

| Prop | Type | Values |
|------|------|--------|
| `bold` | boolean | - |
| `italic` | boolean | - |
| `underline` | boolean | - |
| `dimmed` | boolean | - |
| `color` | string | green, red, blue, yellow, gray |

### Heading
Headings h1-h4.

```jsx
<Heading level={1}>Page Title</Heading>
<Heading level={2}>Section</Heading>
```

| Prop | Type | Values | Default |
|------|------|--------|---------|
| `level` | number | 1-4 | 2 |

## Interactive Components

### Button
Clickable button.

```jsx
<Button variant="primary">Submit</Button>
<Button variant="outline" disabled>Cancel</Button>
```

| Prop | Type | Values | Default |
|------|------|--------|---------|
| `variant` | string | primary, secondary, outline, danger, success | primary |
| `disabled` | boolean | - | false |
| `borderStyle` | string | single, double, round, bold | single |

**ASCII Preview:**
```
┌──────────┐
│  Submit  │
└──────────┘
```

### Input
Text input field.

```jsx
<Input label="Email" placeholder="you@example.com" type="email" />
```

| Prop | Type | Values | Default |
|------|------|--------|---------|
| `label` | string | - | - |
| `placeholder` | string | - | - |
| `type` | string | text, password, email, number | text |
| `disabled` | boolean | - | false |
| `width` | number | - | 30 |

**ASCII Preview:**
```
Email
┌──────────────────────────────┐
│you@example.com               │
└──────────────────────────────┘
```

### Select
Dropdown select.

```jsx
<Select label="Country" options={["USA", "Canada", "UK"]} />
```

| Prop | Type | Required |
|------|------|----------|
| `label` | string | No |
| `options` | array | Yes |
| `disabled` | boolean | No |

**ASCII Preview:**
```
Country
┌──────────────────────────────┐
│ Select...                  ▼│
└──────────────────────────────┘
```

### Checkbox
Checkbox input.

```jsx
<Checkbox label="I agree to terms" checked />
```

| Prop | Type | Default |
|------|------|---------|
| `label` | string | - |
| `checked` | boolean | false |
| `disabled` | boolean | false |

**ASCII Preview:**
```
☑ I agree to terms
```

## Container Components

### Card
Bordered card with optional title.

```jsx
<Card title="User Profile">
  <Text>Card content</Text>
</Card>
```

| Prop | Type | Default |
|------|------|---------|
| `title` | string | - |
| `borderStyle` | string | round |

**ASCII Preview:**
```
╭──────────────────────────────╮
│ User Profile                 │
│                              │
│ Card content                 │
╰──────────────────────────────╯
```

### Panel
Light background panel.

```jsx
<Panel title="Info">
  <Text>Panel content</Text>
</Panel>
```

| Prop | Type |
|------|------|
| `title` | string |

## Feedback Components

### Alert
Alert message box.

```jsx
<Alert variant="success">Operation completed!</Alert>
<Alert variant="error">Something went wrong</Alert>
```

| Prop | Type | Values | Required |
|------|------|--------|----------|
| `variant` | string | info, success, warning, error | Yes |

### Badge
Small label/tag.

```jsx
<Badge variant="success">Active</Badge>
<Badge variant="danger">Expired</Badge>
```

| Prop | Type | Values | Default |
|------|------|--------|---------|
| `variant` | string | default, primary, success, warning, danger | default |

### ProgressBar
Progress indicator.

```jsx
<ProgressBar value={75} color="green" />
```

| Prop | Type | Values | Required |
|------|------|--------|----------|
| `value` | number | 0-100 | Yes |
| `color` | string | blue, green, red, yellow | blue |

**ASCII Preview:**
```
████████████████████░░░░░ 75%
```

### Spinner
Loading indicator.

```jsx
<Spinner size="md" />
```

| Prop | Type | Values | Default |
|------|------|--------|---------|
| `size` | string | sm, md, lg | md |

## Navigation Components

### Link
Hyperlink.

```jsx
<Link href="/about">About Us</Link>
```

| Prop | Type |
|------|------|
| `href` | string |

### Tabs
Tab navigation.

```jsx
<Tabs tabs={["Profile", "Settings", "Billing"]} activeIndex={0} />
```

| Prop | Type | Required |
|------|------|----------|
| `tabs` | array | Yes |
| `activeIndex` | number | No |

**ASCII Preview:**
```
┌─────────┐ ┌──────────┐ ┌─────────┐
│ Profile │ │ Settings │ │ Billing │
└─────────┘ └──────────┘ └─────────┘
```

## Table Components

Build tables with these components:

```jsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHeaderCell>Name</TableHeaderCell>
      <TableHeaderCell>Email</TableHeaderCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**ASCII Preview:**
```
┌──────────┬─────────────────────┐
│ Name     │ Email               │
├──────────┼─────────────────────┤
│ John     │ john@example.com    │
└──────────┴─────────────────────┘
```

## Comments

Use JSX comments to document design intent:

```jsx
<Card title="Login">
  {/* Main authentication form */}
  <Stack gap={1}>
    <Input label="Email" />
    {/* TODO: Add "Remember me" checkbox */}
    <Button variant="primary">Sign In</Button>
  </Stack>
</Card>
```

Comments are preserved in generated React code for documentation.
