# Screen Composition - Building Complete UIs

How to compose complete screens from existing components.

## What is a Screen?

A **screen** is a complete page or view composed of multiple components. Unlike individual components, screens:
- Reference existing components by ID
- Define layout and positioning
- Show complete user flows
- Include rendered examples with real data

## The Three-File System for Screens

Every screen needs THREE files:

### 1. `screen-name.uxm` (Metadata)
Defines which components are used and how they're arranged

### 2. `screen-name.md` (Template)
Shows the layout with {{variables}} for dynamic content

### 3. `screen-name.rendered.md` (Example)
**Critical**: Shows the screen with REAL data (not variables)

## Creating a Screen

### Step 1: Inventory Components

Before composing, list what's available:
- Check `./fluxwing/components/` for user-created components
- Check `./fluxwing/library/` for customized templates
- Check `../examples/` for bundled components

**If missing components**, create them first with `/fluxwing-create`

### Step 2: Design the Layout

Choose a layout pattern (see patterns below) and plan:
- Component placement
- Visual hierarchy
- Spacing and alignment
- User flow

### Step 3: Create screen-name.uxm

```json
{
  "id": "login-screen",
  "type": "container",
  "version": "1.0.0",
  "metadata": {
    "name": "Login Screen",
    "description": "User authentication screen",
    "created": "2024-10-11T12:00:00Z",
    "modified": "2024-10-11T12:00:00Z",
    "tags": ["auth", "login", "screen"],
    "category": "display"
  },
  "props": {
    "title": "Welcome Back",
    "components": [
      "email-input",
      "password-input",
      "submit-button",
      "error-alert"
    ]
  },
  "layout": {
    "display": "flex",
    "positioning": "relative",
    "spacing": {
      "padding": 16
    }
  },
  "behavior": {
    "states": [
      {"name": "idle", "properties": {}},
      {"name": "loading", "properties": {"showSpinner": true}},
      {"name": "error", "properties": {"showError": true}}
    ],
    "accessibility": {
      "role": "main",
      "ariaLabel": "Login form"
    }
  },
  "ascii": {
    "templateFile": "login-screen.md",
    "width": 40,
    "height": 25
  }
}
```

### Step 4: Create screen-name.md (Template)

````markdown
# Login Screen

User authentication screen with email/password.

## Layout

```
╭────────────────────────────────────────╮
│          {{title}}                     │
├────────────────────────────────────────┤
│                                        │
│  Email                                 │
│  {{emailInput}}                        │
│                                        │
│  Password                              │
│  {{passwordInput}}                     │
│                                        │
│  {{error}}                             │
│                                        │
│         {{submitButton}}               │
│                                        │
╰────────────────────────────────────────╯
```

## Components Used

- `email-input`: Email address field
- `password-input`: Password field with show/hide
- `submit-button`: Form submission
- `error-alert`: Error messages

## States

### Idle (default)
User has not yet interacted

### Loading
While authenticating

### Error
When authentication fails

## Variables

- `title` (string): Screen heading
- `emailInput` (component): Email input component
- `passwordInput` (component): Password input component
- `submitButton` (component): Submit button
- `error` (component): Error alert (hidden by default)
````

### Step 5: Create screen-name.rendered.md (REAL DATA)

**This is critical** - show actual rendered output:

```markdown
# Login Screen - Rendered Example

This shows the actual screen with example data.

╭────────────────────────────────────────╮
│          Welcome Back                  │
├────────────────────────────────────────┤
│                                        │
│  Email                                 │
│  ┌──────────────────────────────────┐ │
│  │ john@example.com                 │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Password                              │
│  ┌──────────────────────────────────┐ │
│  │ ••••••••                         │👁│
│  └──────────────────────────────────┘ │
│                                        │
│  ╭──────────────────────────────────╮ │
│  │        Sign In                   │ │
│  ╰──────────────────────────────────╯ │
│                                        │
╰────────────────────────────────────────╯

## Data Context

- Email: john@example.com (valid email)
- Password: ******** (8 characters, masked)
- State: Idle (ready for submission)

## User Flow

1. User enters email address
2. User enters password
3. Optional: Toggle password visibility with 👁 icon
4. Click "Sign In" button
5. If error: Alert shows above button
6. If success: Navigate to dashboard
```

**Why this matters**: Other agents can see the actual intended output, not just templates with {{variables}}.

## Common Layout Patterns

### Pattern 1: Vertical Stack (Login/Signup)
```
╭──────────────────╮
│ [Logo/Header]    │
├──────────────────┤
│ [Form Fields]    │
│ [Input 1]        │
│ [Input 2]        │
│ [Input 3]        │
├──────────────────┤
│ [Submit Button]  │
├──────────────────┤
│ [Footer Links]   │
╰──────────────────╯
```

### Pattern 2: Sidebar + Main (Dashboard)
```
╭──────╮╭──────────────────────────╮
│      ││                          │
│ Nav  ││  Main Content            │
│      ││                          │
│ Menu ││  [Components Grid]       │
│      ││                          │
│ Items││  [Data/Charts/Cards]     │
│      ││                          │
╰──────╯╰──────────────────────────╯
```

### Pattern 3: Tabbed Content (Settings)
```
╭────────────────────────────────────╮
│ Settings                    [Save] │
├────────────────────────────────────┤
│ [Tab1] [Tab2] [Tab3] [Tab4]       │
├────────────────────────────────────┤
│                                    │
│ [Tab Content - Form Fields]        │
│                                    │
╰────────────────────────────────────╯
```

### Pattern 4: Grid Layout (Gallery/Cards)
```
╭───────────╮ ╭───────────╮ ╭───────────╮
│  Card 1   │ │  Card 2   │ │  Card 3   │
╰───────────╯ ╰───────────╯ ╰───────────╯
╭───────────╮ ╭───────────╮ ╭───────────╮
│  Card 4   │ │  Card 5   │ │  Card 6   │
╰───────────╯ ╰───────────╯ ╰───────────╯
```

### Pattern 5: List/Table (Data View)
```
╭──────────────────────────────────────╮
│ [Search] [Filters] [Actions]         │
├──────────────────────────────────────┤
│ Header1 │ Header2 │ Header3 │ Action │
├─────────┼─────────┼─────────┼────────┤
│ Data    │ Data    │ Data    │  [•]   │
│ Data    │ Data    │ Data    │  [•]   │
│ Data    │ Data    │ Data    │  [•]   │
├──────────────────────────────────────┤
│ [Pagination]                         │
╰──────────────────────────────────────╯
```

## Responsive Considerations

Show mobile and desktop layouts when needed:

````markdown
## Desktop Layout (> 768px)

```
╭────╮╭────────────────────────────╮
│Nav ││ Main Content               │
╰────╯╰────────────────────────────╯
```

## Mobile Layout (<= 768px)

```
╭──────────────╮
│ [☰] Header   │
├──────────────┤
│ Main Content │
╰──────────────╯
```
````

## Tips for Great Screens

1. **Start with wireframe**: Sketch layout before coding
2. **Reuse components**: Don't recreate what exists
3. **Consistent spacing**: Use multiples of 4 characters
4. **Visual hierarchy**: Important items prominent
5. **Real examples**: Always create .rendered.md with actual data
6. **Document flows**: Explain what users can do

## Troubleshooting

**"Component not found"**
- Check component ID spelling (case-sensitive)
- Ensure component file exists in ./fluxwing/components/

**"Layout looks misaligned"**
- Use monospace font
- Check for consistent box-drawing characters
- Ensure spacing is uniform

**"Too complex"**
- Break into smaller sections
- Consider nested layouts
- Use clear visual dividers

## Next Steps

- **View library**: Use `/fluxwing-library` to see all screens
- **Create more**: Build additional screens for your app

You can now compose complete, production-ready screen designs!
