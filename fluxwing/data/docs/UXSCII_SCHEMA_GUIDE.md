# UXSCII Schema Reference Guide

> **Complete reference for uxscii component schema and format specifications**

## Overview

UXSCII uses a two-file system for component definitions:
- **`.uxm` files**: JSON metadata defining component structure, behavior, and properties
- **`.md` files**: ASCII visual templates with variable interpolation

## .uxm Component Schema

### Required Fields

```json
{
  "id": "component-name",           // kebab-case, 2-64 chars, unique identifier
  "type": "button|input|card|...",  // component type from standard library
  "version": "1.0.0",               // semantic version (major.minor.patch)
  "metadata": { ... },              // component metadata (required)
  "props": { ... },                 // component properties (required)
  "ascii": { ... }                  // ASCII template configuration (required)
}
```

### Schema Structure

#### 1. Component Identity
```json
{
  "id": "primary-button",           // Pattern: ^[a-z0-9][a-z0-9-]*[a-z0-9]$
  "type": "button",                 // Enum: button, input, card, navigation, form,
                                    //       list, modal, table, badge, alert,
                                    //       container, text, image, divider, custom
  "version": "1.0.0"                // Pattern: ^\d+\.\d+\.\d+(?:-[a-zA-Z0-9-]+)?$
}
```

#### 2. Metadata Section
```json
{
  "metadata": {
    "name": "Primary Button",                    // Required: Human-readable name (1-100 chars)
    "description": "A primary action button...", // Optional: Purpose description (max 500 chars)
    "author": "UXscii Team",                     // Optional: Author/organization (max 100 chars)
    "created": "2024-01-01T00:00:00Z",          // Required: ISO 8601 timestamp
    "modified": "2024-01-01T00:00:00Z",         // Required: ISO 8601 timestamp
    "tags": ["button", "primary", "action"],     // Optional: Array of kebab-case tags (max 10)
    "category": "input"                          // Optional: layout|input|display|navigation|
                                                 //           feedback|utility|overlay|custom
  }
}
```

#### 3. Properties Section
```json
{
  "props": {
    "text": "Button",           // Any type: string, number, boolean, array, object
    "disabled": false,        // Properties define component configuration
    "size": "medium",         // Used for template variable substitution
    "fullWidth": false,       // No restrictions on property names or types
    "ariaLabel": ""
  }
}
```

#### 4. Behavior Section (Optional)
```json
{
  "behavior": {
    "states": [                         // Component visual/interaction states
      {
        "name": "default",              // Required: state identifier
        "properties": {                 // Required: state-specific properties
          "background": "primary",
          "textColor": "white",
          "border": "solid"
        },
        "triggers": ["mouseenter"]      // Optional: events that trigger this state
      }
    ],
    "interactions": [                   // User interactions component responds to
      {
        "trigger": "click",             // Required: click|hover|focus|blur|keydown|
                                        //           keyup|change|submit|timeout|reset
        "action": "emit-click-event",   // Required: action identifier
        "target": "parent",             // Optional: target element
        "condition": "key === 'Enter'"  // Optional: condition for interaction
      }
    ],
    "animations": [                     // Animations for state transitions
      {
        "name": "hover-transition",     // Required: animation identifier
        "duration": 200,                // Required: duration in ms
        "easing": "ease-out",           // Optional: linear|ease|ease-in|ease-out|
                                        //           ease-in-out|cubic-bezier
        "properties": {                 // Required: animated properties
          "background": "primary-dark"
        }
      }
    ],
    "accessibility": {                  // Accessibility requirements
      "role": "button",                 // ARIA role
      "focusable": true,                // Whether component can receive focus
      "keyboardSupport": ["Enter", "Space"], // Supported keyboard interactions
      "ariaLabel": "{{ariaLabel || text}}"    // Accessible label (supports variables)
    }
  }
}
```

#### 5. Layout Section (Optional)
```json
{
  "layout": {
    "display": "inline-block",          // block|inline|inline-block|flex|grid|none|overlay|table
    "positioning": "static",            // static|relative|absolute|fixed|sticky
    "spacing": {
      "margin": {                       // Can be number or object
        "top": 1, "right": 2, "bottom": 1, "left": 2
      },
      "padding": 16                     // Can be single number for all sides
    },
    "sizing": {
      "width": 200,                     // number or "auto"|"fit-content"|"max-content"|"min-content"
      "height": "auto",
      "minWidth": 100,
      "maxWidth": 400,
      "minHeight": 30,
      "maxHeight": 200
    }
  }
}
```

#### 6. ASCII Configuration (Required)
```json
{
  "ascii": {
    "templateFile": "primary-button.md",  // Required: filename.md pattern
    "width": 16,                          // Required: 1-120 character width
    "height": 3,                          // Required: 1-50 character height
    "variables": [                        // Optional: template variable definitions
      {
        "name": "text",                   // Required: camelCase variable name
        "type": "string",                 // Required: string|number|boolean|color|size|array|object
        "defaultValue": "Button",         // Optional: default value
        "description": "Button text",     // Optional: variable description (max 200 chars)
        "required": true,                 // Optional: whether variable is required (default: false)
        "validation": {                   // Optional: validation rules
          "min": 1,                       // For numbers/strings
          "max": 20,                      // For numbers/strings
          "pattern": "^[a-zA-Z ]+$",     // For strings (regex)
          "enum": ["small", "medium", "large"] // Allowed values
        }
      }
    ]
  }
}
```

#### 7. Extension (Optional)
```json
{
  "extends": "base-button"              // Component ID this component extends
}
```

## .md Template File Format

### Basic Structure
```markdown
# Component Name

Component description text.

## Default State

```
ASCII art representation using {{variables}}
```

## Additional States

```
ASCII art for hover, focus, disabled, etc.
```

## Variables

- `variableName` (type): Description

## Usage Examples

```
Example ASCII representations
```
```

### Variable Syntax
- Use `{{variableName}}` for variable interpolation
- Variables must match those defined in `.uxm` file
- Supports string, number, and boolean substitution
- Example: `{{text}}`, `{{width}}`, `{{disabled}}`

### ASCII Art Guidelines
- Use standard ASCII characters (0x20-0x7E)
- Common patterns for visual hierarchy:
  - `▓` = Primary/filled elements
  - `█` = Hover/active states
  - `░` = Shadow/pressed effects
  - `┌─┐` = Borders and containers
  - `┏━┓` = Emphasized/focused borders
  - `─ ─` = Disabled/dashed borders

### Template Sections
1. **Component description**: Brief overview
2. **State representations**: ASCII for each interaction state
3. **Variables documentation**: List all template variables
4. **Usage examples**: Practical ASCII examples
5. **Accessibility notes**: Screen reader and keyboard support
6. **Implementation notes**: Framework-specific guidance

## Validation Rules

### Schema Validation
- All required fields must be present
- Field types must match schema definitions
- String patterns must conform to regex requirements
- Enum values must be from allowed lists
- Array items must meet uniqueness/length constraints

### Template Validation
- Template file must exist and be readable
- Variable syntax must be well-formed (`{{varName}}`)
- All template variables should be defined in `.uxm`
- ASCII content should use printable characters
- Template dimensions should match declared width/height

### Linting Checks
- Component should have description and author
- Accessibility configuration should be present
- Template file should exist and be valid
- Variables should have proper validation rules
- Tags should follow naming conventions

## File Organization

### Standard Structure
```
project/
├── components/
│   ├── primary-button.uxm
│   ├── primary-button.md
│   ├── text-input.uxm
│   ├── text-input.md
│   └── ...
└── .uxscii/
    ├── components/     # Local component library
    └── templates/      # Shared templates
```

### Search Paths
Component resolution follows this order:
1. Absolute paths
2. Relative to component file directory
3. Current working directory
4. `./examples/`
5. `./.uxscii/components/`
6. `./node_modules/@uxscii/components/`

## Component Types

### Standard Types
- **button**: Interactive action elements
- **input**: Form input fields
- **card**: Content containers
- **navigation**: Navigation elements
- **form**: Form layouts
- **list**: List and table structures
- **modal**: Overlay dialogs
- **table**: Data tables
- **badge**: Status indicators
- **alert**: Notification messages
- **container**: Layout containers
- **text**: Text elements
- **image**: Image placeholders
- **divider**: Section separators
- **custom**: Custom component types

### Categories
- **layout**: Structural components (containers, grids)
- **input**: Interactive form elements
- **display**: Content presentation components
- **navigation**: Navigation and routing elements
- **feedback**: Status and notification components
- **utility**: Helper and functional components
- **overlay**: Modal and popup components
- **custom**: Project-specific components

## Best Practices

### Component Design
1. Use semantic IDs and clear naming
2. Provide comprehensive accessibility configuration
3. Include multiple interaction states
4. Document all template variables
5. Use consistent ASCII visual patterns
6. Follow semantic versioning for updates

### Template Creation
1. Design for readability and clarity
2. Use consistent character patterns
3. Provide examples for all states
4. Include accessibility documentation
5. Test with various screen widths
6. Validate template syntax regularly

### Schema Compliance
1. Validate components before committing
2. Use linting for quality assurance
3. Include comprehensive metadata
4. Test template rendering with various inputs
5. Follow component naming conventions
6. Document any extensions or customizations