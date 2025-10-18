# Component Creation - Step-by-Step Workflow

Complete guide for creating uxscii components from scratch.

## Before You Start

1. **Understand the concept** - Read `02-core-concepts.md` if you haven't
2. **Check examples** - Browse `../examples/` for similar components
3. **Plan your component** - Know what you're building

## Step-by-Step Process

### Step 1: Plan Your Component

Answer these questions:
- **What is it?** Button, input, card, modal, etc.
- **What does it do?** Primary purpose and use case
- **What's configurable?** Props users can change
- **What states does it have?** Default, hover, focus, disabled, error, success
- **How will it look?** Sketch ASCII layout

### Step 2: Create the .uxm File

Start with required fields:

```json
{
  "id": "my-component",
  "type": "button",
  "version": "1.0.0",
  "metadata": {
    "name": "My Component",
    "created": "2024-10-11T12:00:00Z",
    "modified": "2024-10-11T12:00:00Z"
  },
  "props": {},
  "ascii": {
    "templateFile": "my-component.md",
    "width": 20,
    "height": 3
  }
}
```

**Tips:**
- ID must be kebab-case, 2-64 characters
- Version must be semantic (major.minor.patch)
- Timestamps should be ISO 8601 format
- Template file must end with `.md`

### Step 3: Add Props and Variables

Define what users can configure:

```json
{
  "props": {
    "text": "Click me",          // Default values
    "variant": "primary",
    "disabled": false
  },
  "ascii": {
    "templateFile": "my-component.md",
    "width": 20,
    "height": 3,
    "variables": [
      {
        "name": "text",
        "type": "string",
        "required": true,
        "description": "Button label text",
        "validation": {
          "min": 1,
          "max": 20
        }
      },
      {
        "name": "variant",
        "type": "string",
        "defaultValue": "primary",
        "validation": {
          "enum": ["primary", "secondary", "outline"]
        }
      }
    ]
  }
}
```

### Step 4: Define Default State and Behaviors

Components are created with **default state only** for fast MVP prototyping:

```json
{
  "behavior": {
    "states": [
      {
        "name": "default",
        "properties": {
          "border": "solid",
          "background": "primary"
        }
      }
    ],
    "interactions": [
      {
        "trigger": "click",
        "action": "emit-click-event"
      }
    ],
    "accessibility": {
      "role": "button",
      "ariaLabel": "{{text}}",
      "focusable": true,
      "keyboardSupport": ["Enter", "Space"]
    }
  }
}
```

**Adding more states**: After MVP validation, use `/fluxwing-expand-component` to add hover, focus, disabled states. The command will automatically add appropriate states based on component type.

### Step 5: Add Metadata (Recommended)

Help others discover and understand your component:

```json
{
  "metadata": {
    "name": "My Component",
    "description": "A customizable button component with multiple variants and states",
    "author": "Your Name",
    "created": "2024-10-11T12:00:00Z",
    "modified": "2024-10-11T12:00:00Z",
    "tags": ["button", "interactive", "form"],
    "category": "input"
  }
}
```

### Step 6: Create the .md Template

Basic structure:

````markdown
# My Component

Brief description of what this component does.

## Default State

```
╭──────────────────╮
│   {{text}}       │
╰──────────────────╯
```

## Variables

- `text` (string, required): Button label text. Max 20 characters.
- `variant` (string): Visual style - "primary", "secondary", or "outline"

## Accessibility

- **Role**: button
- **Focusable**: Yes
- **Keyboard**: Enter or Space to activate

## Usage Examples

### Primary Button
```
╭──────────────────╮
│   Submit Form    │
╰──────────────────╯
```

### Secondary Button
```
┌──────────────────┐
│   Cancel         │
└──────────────────┘
```
````

**Tips:**
- Start with default state only (fast MVP creation)
- Document ALL variables used in template
- Include usage examples with real data
- Add accessibility notes for interactive components

**Adding more states**: After creating the component, run `/fluxwing-expand-component my-component` to add hover, focus, disabled states automatically.

### Step 7: Save Files

Save both files together:
```
./fluxwing/components/my-component.uxm
./fluxwing/components/my-component.md
```

Create the directory if it doesn't exist:
```bash
mkdir -p ./fluxwing/components
```

## Common Patterns

### Form Input
```json
{
  "id": "text-input",
  "type": "input",
  "props": {
    "placeholder": "Enter text",
    "value": "",
    "error": "",
    "disabled": false
  },
  "behavior": {
    "states": ["default", "focus", "error", "disabled"],
    "interactions": [
      {"trigger": "focus", "action": "highlight-field"},
      {"trigger": "blur", "action": "validate-field"}
    ]
  }
}
```

### Data Card
```json
{
  "id": "metric-card",
  "type": "card",
  "props": {
    "title": "Metric",
    "value": "1,234",
    "change": "+12%",
    "trend": "up"
  }
}
```

### Modal Dialog
```json
{
  "id": "confirm-dialog",
  "type": "modal",
  "props": {
    "title": "Confirm",
    "message": "Are you sure?",
    "confirmText": "Yes",
    "cancelText": "No"
  },
  "behavior": {
    "states": ["open", "closed"],
    "interactions": [
      {"trigger": "click", "action": "close-modal", "target": "backdrop"},
      {"trigger": "keydown", "action": "close-modal", "condition": "key === 'Escape'"}
    ]
  }
}
```

## Troubleshooting

### "Template file not found"
**Fix**: Ensure `.md` file exists and `templateFile` path is correct

### "Variable not defined"
**Fix**: Add variable to `ascii.variables` array in `.uxm`

### "Invalid JSON"
**Fix**: Validate JSON syntax (no trailing commas, proper quotes)

### "ASCII art looks broken"
**Fix**: Use monospace font, check for consistent character width

## Quick Reference

**Required .uxm fields**: id, type, version, metadata (name, created, modified), props, ascii (templateFile, width, height)

**Required .md sections**: Title, default state, variables documentation

**Recommended additions**: Multiple states, accessibility attributes, usage examples, detailed metadata

## Next Steps

- **Compose screens**: Use `/fluxwing-scaffold` to build complete screens
- **Browse library**: Use `/fluxwing-library` to see all components
- **Learn patterns**: Check `06-ascii-patterns.md` for ASCII art reference

You can now create production-ready uxscii components!
