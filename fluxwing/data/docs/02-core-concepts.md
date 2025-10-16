# Core Concepts - Understanding uxscii

The fundamental concepts you need to understand the uxscii standard.

## The Philosophy

**uxscii** is an AI-native design markup language that combines:
- **Human-readable** ASCII art (visual representation)
- **Machine-parseable** JSON metadata (component definition)
- **Version-control friendly** text files (meaningful diffs)

## The Two-File System

Every component consists of exactly TWO files that work together:

### File 1: `.uxm` (Component Metadata)

JSON file containing:
- **Identity**: ID, type, version
- **Metadata**: Name, description, author, timestamps
- **Properties**: Configurable props with defaults
- **Behavior**: States, interactions, accessibility
- **ASCII Reference**: Template file, dimensions, variables

**Purpose**: Tells agents WHAT the component is and HOW it behaves.

### File 2: `.md` (Visual Template)

Markdown file containing:
- **ASCII Art**: Visual representation of the component
- **Variables**: `{{variableName}}` placeholders for dynamic content
- **States**: Visual variants (default, hover, focus, disabled, etc.)
- **Documentation**: Usage examples and variable descriptions

**Purpose**: Shows agents WHAT the component looks like.

## How They Connect

```
submit-button.uxm says:
  "ascii": {
    "templateFile": "submit-button.md",  ← Points to template
    "variables": [
      {"name": "text", "type": "string"}  ← Defines variables
    ]
  }

submit-button.md contains:
  ╭──────────────────╮
  │   {{text}}       │  ← Uses the variable
  ╰──────────────────╯
```

The `.uxm` **defines** variables, the `.md` **uses** them.

## Component Anatomy

### Minimal Required Fields (.uxm)

```json
{
  "id": "kebab-case-name",           // Required: Unique identifier
  "type": "button|input|card|...",   // Required: Component type
  "version": "1.0.0",                // Required: Semantic version
  "metadata": {
    "name": "Human Name",            // Required: Display name
    "created": "ISO-timestamp",      // Required: Creation date
    "modified": "ISO-timestamp"      // Required: Last modified
  },
  "props": {},                       // Required: Can be empty object
  "ascii": {
    "templateFile": "name.md",       // Required: Template filename
    "width": 20,                     // Required: Character width
    "height": 3                      // Required: Character height
  }
}
```

### Optional But Recommended Fields

```json
{
  "metadata": {
    "description": "What this component does",
    "author": "Your name",
    "tags": ["searchable", "keywords"],
    "category": "input|display|layout|..."
  },
  "behavior": {
    "states": [/* multiple states */],
    "interactions": [/* user interactions */],
    "accessibility": {/* ARIA attributes */}
  },
  "extends": "base-component-id"  // Component inheritance
}
```

## Variable Substitution

### In .uxm (Definition)
```json
"props": {
  "text": "Click me",        // Default value
  "disabled": false
},
"ascii": {
  "variables": [
    {
      "name": "text",
      "type": "string",
      "required": true,
      "description": "Button label"
    }
  ]
}
```

### In .md (Usage)
```
╭──────────────────╮
│   {{text}}       │  ← Replaced with prop value
╰──────────────────╯
```

### Result
```
╭──────────────────╮
│   Click me       │  ← Actual rendered output
╰──────────────────╯
```

## States and Behaviors

Components can have multiple visual states:

```json
"behavior": {
  "states": [
    {
      "name": "default",
      "properties": {"border": "solid"}
    },
    {
      "name": "hover",
      "properties": {"border": "highlighted"},
      "triggers": ["mouseenter"]
    },
    {
      "name": "disabled",
      "properties": {"border": "dashed", "opacity": 0.5}
    }
  ]
}
```

Each state can have a corresponding ASCII representation in the `.md` file.

## Two-Phase Component Creation

Fluxwing optimizes for fast MVP prototyping with a two-phase approach:

### Phase 1: Create with Default State

When you create a component, it starts with **only the default state**:
- Fast creation for quick prototyping
- MVP-ready for early discussions
- Minimal file size and complexity

```bash
/fluxwing-create submit-button
# Creates component with default state only
```

### Phase 2: Expand with Interactive States

After MVP validation, add interaction states on demand:
- Adds hover, focus, disabled states
- Smart defaults based on component type
- Preserves all existing data

```bash
/fluxwing-expand-component submit-button
# Adds hover, active, disabled states
```

### Why Two Phases?

**Benefits**:
- **60-80% faster** component creation
- Focus on core functionality first
- Add polish when needed, not upfront
- Cleaner diffs in version control

**Workflow**:
```
1. Create → Default state only (fast)
2. Discuss → Review with stakeholders
3. Validate → Confirm design works
4. Expand → Add interactive states (polish)
```

This approach aligns with agile development: ship fast, iterate based on feedback.

## Component Types

Standard types:
- **button**: Clickable action triggers
- **input**: Text entry fields
- **card**: Content containers
- **navigation**: Menu and navigation
- **form**: Multi-field forms
- **list**: Data displays
- **modal**: Overlay dialogs
- **table**: Tabular data
- **badge**: Small indicators
- **alert**: Notifications
- **container**: Layout wrappers
- **text**: Text displays
- **image**: Image placeholders
- **divider**: Visual separators
- **custom**: Anything else

## Naming Conventions

### Component IDs (kebab-case)
- ✓ `submit-button`
- ✓ `email-input`
- ✓ `user-profile-card`
- ✗ `submitButton` (camelCase)
- ✗ `Submit Button` (spaces)

### Variables (camelCase)
- ✓ `userName`
- ✓ `isDisabled`
- ✓ `maxLength`
- ✗ `user-name` (kebab-case)
- ✗ `user_name` (snake_case)

### Files (kebab-case + extension)
- ✓ `submit-button.uxm`
- ✓ `submit-button.md`
- ✗ `submitButton.uxm`

## Accessibility

Every interactive component should include accessibility attributes:

```json
"behavior": {
  "accessibility": {
    "role": "button",              // ARIA role
    "ariaLabel": "Submit form",    // Screen reader label
    "focusable": true,             // Can receive focus
    "keyboardSupport": ["Enter", "Space"]  // Key bindings
  }
}
```

## Composition

Components can reference other components to create screens:

```json
{
  "id": "login-screen",
  "type": "container",
  "props": {
    "components": [
      "email-input",    // References another component
      "password-input",
      "submit-button"
    ]
  }
}
```

## Key Takeaways

1. **Two files, one component**: `.uxm` for logic, `.md` for visuals
2. **Variables bridge them**: Defined in `.uxm`, used in `.md`
3. **States create interactivity**: Multiple visual representations
4. **Types organize components**: Standard categories for consistency
5. **Naming matters**: Conventions ensure compatibility
6. **Accessibility is essential**: ARIA roles for all interactive elements

## Next Steps

- **See it in action**: Check `../examples/primary-button.{uxm,md}`
- **Create your own**: Follow `03-component-creation.md`
- **Learn patterns**: Browse `06-ascii-patterns.md`

You now understand the foundation of uxscii!
