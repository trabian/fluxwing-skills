# Quick Start - Create a Component in 30 Seconds

The fastest way to create a uxscii component.

## The Two-File System

Every component needs exactly TWO files:

### 1. `component-name.uxm` (JSON metadata)
```json
{
  "id": "submit-button",
  "type": "button",
  "version": "1.0.0",
  "metadata": {
    "name": "Submit Button",
    "created": "2024-10-11T12:00:00Z",
    "modified": "2024-10-11T12:00:00Z"
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

### 2. `submit-button.md` (ASCII template)
````markdown
# Submit Button

## Default State

```
╭──────────────────╮
│   {{text}}       │
╰──────────────────╯
```

## Variables

- `text` (string): Button label text
````

## That's It!

Save both files to `./fluxwing/components/` and you have a working MVP component.

## Expanding States (When Needed)

Components are created with **default state only** for fast prototyping. After MVP validation, add interaction states:

```bash
/fluxwing-expand-component submit-button
```

This automatically adds standard states for the component type:
- **button** → hover, active, disabled
- **input** → focus, error, disabled
- **card** → hover, selected

The command updates both files:
- `.uxm`: Adds state definitions to `behavior.states`
- `.md`: Adds ASCII representations for each state

**Before expansion** (default only):
```
╭──────────────────╮
│   Submit         │
╰──────────────────╯
```

**After expansion** (interactive states):
```
Default:
╭──────────────────╮
│   Submit         │
╰──────────────────╯

Hover:
┏━━━━━━━━━━━━━━━━━━┓
┃   Submit         ┃
┗━━━━━━━━━━━━━━━━━━┛

Disabled:
┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐
┆   Submit         ┆
└┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘
```

## Next Steps

- **More details?** Read `03-component-creation.md`
- **ASCII patterns?** See `06-ascii-patterns.md`
- **Build a screen?** Use `/fluxwing-scaffold`

**You're ready to create!**
