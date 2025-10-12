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

Save both files to `./fluxwing/components/` and you have a working component.

## Add More States (Optional)

````markdown
## Hover State

```
░╭──────────────────╮░
░│   {{text}}       │░
░╰──────────────────╯░
```

## Disabled State

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│   {{text}}       │
└ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```
````

And add to `.uxm`:
```json
"behavior": {
  "states": [
    {"name": "default", "properties": {}},
    {"name": "hover", "properties": {}, "triggers": ["mouseenter"]},
    {"name": "disabled", "properties": {}}
  ]
}
```

## Validate

Check your component:
```bash
/fluxwing-validate ./fluxwing/components/submit-button.uxm
```

## Next Steps

- **More details?** Read `03-component-creation.md`
- **ASCII patterns?** See `06-ascii-patterns.md`
- **Build a screen?** Use `/fluxwing-scaffold`

**You're ready to create!**
