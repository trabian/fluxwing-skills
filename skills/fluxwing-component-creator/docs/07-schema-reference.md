# Schema Reference

Pointer to the definitive uxscii component schema and how to use it.

## The Schema File

**Location**: `../schema/uxm-component.schema.json`

This is the **definitive source of truth** for the uxscii `.uxm` file format.

## What the Schema Defines

The schema specifies:
- All valid field names and types
- Required vs optional fields
- Validation rules (min/max, patterns, enums)
- Nested object structures
- Field descriptions

## How to Use the Schema

### For Reference

When creating components, refer to the schema to understand:
- What fields are available
- What values are allowed
- What's required vs optional

### For Autocompletion

Many editors can use the schema for:
- Field suggestions
- Type checking
- Documentation on hover

Add to your `.uxm` file:
```json
{
  "$schema": "../data/schema/uxm-component.schema.json",
  ...
}
```

## Key Schema Sections

### Required Root Fields

```
id          - Component identifier (kebab-case, 2-64 chars)
type        - Component type (enum or "custom")
version     - Semantic version (X.Y.Z)
metadata    - Component metadata object
props       - Component properties object
ascii       - ASCII template reference
```

### Metadata Object (required fields)

```
name        - Human-readable name (1-100 chars)
created     - ISO 8601 timestamp
modified    - ISO 8601 timestamp
```

### Metadata Object (optional fields)

```
description - Component description (max 500 chars)
author      - Creator name (max 100 chars)
tags        - Array of search tags (max 10)
category    - Component category (enum)
```

### ASCII Object (required)

```
templateFile - Template filename (must end in .md)
width        - Character width (1-120)
height       - Character height (1-50)
```

### ASCII Object (optional)

```
variables    - Array of template variable definitions
```

### Behavior Object (optional)

```
states       - Array of component states
interactions - Array of user interactions
animations   - Array of animation definitions
accessibility- Accessibility attributes
```

## Component Types (Enum)

Valid `type` values:
```
button, input, card, navigation, form, list, modal,
table, badge, alert, container, text, image, divider, custom
```

## Categories (Enum)

Valid `metadata.category` values:
```
layout, input, display, navigation, feedback,
utility, overlay, custom
```

## Variable Types (Enum)

Valid `ascii.variables[].type` values:
```
string, number, boolean, color, size, array, object
```

## Quick Reference Examples

### Minimal Valid Component

```json
{
  "id": "simple",
  "type": "button",
  "version": "1.0.0",
  "metadata": {
    "name": "Simple",
    "created": "2024-01-01T00:00:00Z",
    "modified": "2024-01-01T00:00:00Z"
  },
  "props": {},
  "ascii": {
    "templateFile": "simple.md",
    "width": 10,
    "height": 3
  }
}
```

### Complete Component

See `../examples/primary-button.uxm` for a fully-featured example using all available fields.

## Schema Version

Current schema version: **1.1.0**

Schema follows semantic versioning:
- Major: Breaking changes to structure
- Minor: New optional fields
- Patch: Documentation or validation updates

## Validation Rules Summary

### ID Rules
- Pattern: `^[a-z0-9][a-z0-9-]*[a-z0-9]$`
- Length: 2-64 characters
- Format: kebab-case only

### Version Rules
- Pattern: `^\d+\.\d+\.\d+(?:-[a-zA-Z0-9-]+)?$`
- Examples: `1.0.0`, `2.1.3`, `1.0.0-beta`

### Timestamp Rules
- Format: ISO 8601 date-time
- Example: `2024-10-11T12:00:00Z`

### Variable Name Rules
- Pattern: `^[a-zA-Z][a-zA-Z0-9_]*$`
- Format: camelCase recommended
- Examples: `text`, `userName`, `isDisabled`

## Common Schema Errors

**"Additional property not allowed"**
- You used a field name that doesn't exist in the schema
- Check field spelling and location in object hierarchy

**"Missing required property"**
- You omitted a required field
- Add the field with a valid value

**"Value does not match pattern"**
- Field value doesn't match regex pattern
- Check format requirements (kebab-case, semver, etc.)

**"Value not in enum"**
- You used a value not in the allowed list
- Use one of the valid enum values

## Deep Dive

For comprehensive schema documentation, see:
- **Full guide**: `UXSCII_SCHEMA_GUIDE.md` (detailed explanations)
- **Agent guide**: `UXSCII_AGENT_GUIDE.md` (practical examples)

## Next Steps

- **View schema**: Open `../schema/uxm-component.schema.json`
- **See examples**: Browse `../examples/*.uxm`

The schema ensures all uxscii components are compatible and machine-readable!
