# UXSCII Agent Design Guide

> **The definitive guide for AI agents to create, design, and implement uxscii components**

---

**⚠️ IMPORTANT NOTE:**

This document is a **UXSCII language specification reference** that describes the standard format and includes CLI command examples for illustration purposes.

**If you're using the Fluxwing Claude Code plugin**, you don't need to run any CLI commands manually. The Fluxwing plugin handles validation and component creation automatically through its `/fluxwing-*` commands.

**For Fluxwing Plugin Users:**
- Use `/fluxwing-create` to create components
- Use `/fluxwing-scaffold` to build complete screens
- Everything is self-contained in the plugin

This specification document is provided for reference and understanding the UXSCII standard itself.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Core Concepts](#core-concepts)
3. [Component Creation Workflow](#component-creation-workflow)
4. [Template Design Patterns](#template-design-patterns)
5. [Complete Examples](#complete-examples)
6. [Quality Standards](#quality-standards)
7. [Advanced Techniques](#advanced-techniques)
8. [Troubleshooting](#troubleshooting)
9. [Quick Reference](#quick-reference)

---

## Quick Start

### What You Need to Know
UXSCII is a two-file system for AI-native component design:
- **`.uxm` files**: JSON metadata defining component behavior, props, states
- **`.md` files**: ASCII visual templates with variable substitution

### 30-Second Component Creation
```bash
# 1. Create the JSON metadata file
echo '{
  "id": "simple-button",
  "type": "button",
  "version": "1.0.0",
  "metadata": {"name": "Simple Button", "created": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'", "modified": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"},
  "props": {"text": "Click me"},
  "ascii": {"templateFile": "simple-button.md", "width": 12, "height": 3}
}' > simple-button.uxm

# 2. Create the ASCII template
echo '```
▓▓▓▓▓▓▓▓▓▓▓▓
▓ {{text}} ▓
▓▓▓▓▓▓▓▓▓▓▓▓
```' > simple-button.md

# 3. Validate your component
uxscii validate simple-button.uxm
```

### Essential Commands
```bash
# Validate component
uxscii validate component.uxm

# Lint for best practices
uxscii lint component.uxm --strict

# Test template rendering
uxscii template component.md --validate

# Get component with template
uxscii uxm get component.uxm
```

---

## Core Concepts

### The UXSCII Philosophy

1. **AI-Native Design**: Components designed for machine parsing and generation
2. **Human-Readable**: ASCII representations anyone can understand
3. **Version Control Friendly**: Text-based, meaningful diffs
4. **Tool Independent**: Open specification, not tied to specific software

### Component Anatomy

```
simple-button.uxm  ←── Component definition (JSON)
├── id: "simple-button"
├── type: "button"
├── props: {"text": "Click me"}
└── ascii: {templateFile: "simple-button.md"}

simple-button.md   ←── Visual template (ASCII + Markdown)
├── ASCII art with {{variables}}
├── State representations
├── Usage examples
└── Documentation
```

### Key Principles for Agents

1. **Start Simple**: Begin with minimal required fields, add complexity incrementally
2. **Be Consistent**: Follow naming conventions and pattern libraries
3. **Think States**: Design for default, hover, focus, disabled states
4. **Document Everything**: Include descriptions, examples, and usage notes
5. **Validate Early**: Use CLI tools to catch issues immediately

---

## Component Creation Workflow

### Step 1: Plan Your Component

**Ask Yourself:**
- What is the component's primary purpose?
- What states will it have? (default, hover, focus, disabled)
- What properties should be configurable?
- How should it look in ASCII form?

**Example Planning:**
```
Component: Loading Spinner
Purpose: Show loading state to users
States: spinning, stopped
Props: size (small/medium/large), text (optional)
ASCII: Use rotating character patterns
```

### Step 2: Create the .uxm File

**Template Structure:**
```json
{
  "id": "kebab-case-name",
  "type": "component-type",
  "version": "1.0.0",
  "metadata": {
    "name": "Human Readable Name",
    "description": "What this component does",
    "created": "ISO-8601-timestamp",
    "modified": "ISO-8601-timestamp"
  },
  "props": {
    "configurableProperty": "defaultValue"
  },
  "ascii": {
    "templateFile": "component-name.md",
    "width": 20,
    "height": 3
  }
}
```

**Practical Example:**
```json
{
  "id": "loading-spinner",
  "type": "feedback",
  "version": "1.0.0",
  "metadata": {
    "name": "Loading Spinner",
    "description": "Animated spinner to indicate loading state",
    "author": "AI Agent",
    "created": "2024-01-15T10:30:00Z",
    "modified": "2024-01-15T10:30:00Z",
    "tags": ["loading", "spinner", "feedback"],
    "category": "feedback"
  },
  "props": {
    "size": "medium",
    "text": "",
    "speed": "normal"
  },
  "behavior": {
    "states": [
      {
        "name": "spinning",
        "properties": {
          "animation": "rotate",
          "visible": true
        }
      },
      {
        "name": "stopped",
        "properties": {
          "animation": "none",
          "visible": false
        }
      }
    ],
    "accessibility": {
      "role": "progressbar",
      "ariaLabel": "Loading content"
    }
  },
  "ascii": {
    "templateFile": "loading-spinner.md",
    "width": 15,
    "height": 5,
    "variables": [
      {
        "name": "text",
        "type": "string",
        "defaultValue": "",
        "description": "Optional loading text"
      },
      {
        "name": "size",
        "type": "string",
        "defaultValue": "medium",
        "validation": {
          "enum": ["small", "medium", "large"]
        }
      }
    ]
  }
}
```

### Step 3: Design ASCII Templates

**Start with Basic Structure:**
```markdown
# Component Name

Brief description of what this component does.

## Default State

```
Your ASCII art here with {{variables}}
```

## Variables

- `variableName` (type): Description

## Usage Examples

```
Example with real values
```
```

**Practical Example:**
```markdown
# Loading Spinner

Animated spinner to indicate loading state.

## Spinning State

```
    ╭─────╮
    │  ◐  │ {{text}}
    ╰─────╯
```

## With Text

```
    ╭─────╮
    │  ◑  │ Loading...
    ╰─────╯
```

## Size Variants

### Small
```
  ◐ {{text}}
```

### Medium
```
    ╭─────╮
    │  ◐  │ {{text}}
    ╰─────╯
```

### Large
```
    ╭─────────╮
    │    ◐    │
    │ {{text}} │
    ╰─────────╯
```

## Variables

- `text` (string): Optional loading message to display
- `size` (string): Spinner size - small, medium, or large

## Accessibility

- **Role**: progressbar
- **ARIA**: aria-label="Loading content"
- **Animation**: Indicates progress to screen readers

## Usage Examples

```
    ╭─────╮
    │  ◐  │ Loading data...
    ╰─────╯
```
```

### Step 4: Add Behavior and Interactivity

**Common Behavior Patterns:**

```json
{
  "behavior": {
    "states": [
      {"name": "default", "properties": {...}},
      {"name": "hover", "properties": {...}, "triggers": ["mouseenter"]},
      {"name": "focus", "properties": {...}, "triggers": ["focus"]},
      {"name": "disabled", "properties": {...}}
    ],
    "interactions": [
      {
        "trigger": "click",
        "action": "emit-click-event"
      }
    ],
    "accessibility": {
      "role": "button",
      "focusable": true,
      "keyboardSupport": ["Enter", "Space"]
    }
  }
}
```

---

## Template Design Patterns

### ASCII Character Patterns

**Borders and Containers:**
```
┌─────┐  ╭─────╮  ▓▓▓▓▓▓▓  ═══════
│ Box │  │ Box │  ▓ Box ▓  ║ Box ║
└─────┘  ╰─────╯  ▓▓▓▓▓▓▓  ═══════
 Light    Rounded   Filled   Double
```

**State Representations:**
```
Default:  ┌─────┐    Hover:   ┏━━━━━┓    Focus:   ┏━━━━━┓✨
          │ Click│             ┃ Click┃             ┃ Click┃
          └─────┘             ┗━━━━━┛             ┗━━━━━┛

Disabled: ┌ ─ ─ ┐    Active:  ░▓▓▓▓▓░    Error:   ┌─────┐
          │ Click│             ░▓Click▓░            │⚠Click│
          └ ─ ─ ┘             ░▓▓▓▓▓░            └─────┘
```

**Form Elements:**
```
Text Input:    [________________]    Select:      [Option ▼]
               │cursor here      │

Checkbox:      [✓] Checked       Radio:       ◉ Selected
               [□] Unchecked                  ○ Unselected

Slider:        ├────●─────────┤    Progress:  ████▓▓▓▓▓▓ 40%
```

**Data Display:**
```
Table:         ┌─────┬─────┬─────┐
               │ Col1│ Col2│ Col3│
               ├─────┼─────┼─────┤
               │ Data│ Data│ Data│
               └─────┴─────┴─────┘

List:          • Item 1              Card:    ╭───────────╮
               • Item 2                       │ Title     │
               • Item 3                       ├───────────┤
                                              │ Content   │
                                              ╰───────────╯
```

### Variable Substitution Patterns

**Text Variables:**
```
{{title}}           - Direct substitution
{{title || "Default"}} - With fallback (not supported yet)
{{text | uppercase}}    - With filters (not supported yet)
```

**Layout Variables:**
```
Width/Height:     {{width}} characters wide
Conditional:      {{#hasFooter}}Footer content{{/hasFooter}} (not supported yet)
Loops:           {{#items}}• {{name}}{{/items}} (not supported yet)
```

**Best Practices:**
- Keep variable names short and descriptive
- Use camelCase for consistency
- Provide sensible defaults in .uxm file
- Document all variables in template

### Responsive Design Patterns

**Adaptive Width:**
```markdown
## Small (< 20 chars)
```
[{{text}}]
```

## Medium (20-40 chars)
```
┌────────────────────┐
│     {{text}}       │
└────────────────────┘
```

## Large (> 40 chars)
```
╭──────────────────────────────────────╮
│              {{text}}                │
╰──────────────────────────────────────╯
```
```

---

## Complete Examples

### Example 1: Simple Contact Card

**.uxm file:**
```json
{
  "id": "contact-card",
  "type": "card",
  "version": "1.0.0",
  "metadata": {
    "name": "Contact Card",
    "description": "Display contact information in a card format",
    "created": "2024-01-15T10:00:00Z",
    "modified": "2024-01-15T10:00:00Z",
    "tags": ["card", "contact", "profile"],
    "category": "display"
  },
  "props": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 555-0123",
    "title": "Software Engineer"
  },
  "behavior": {
    "accessibility": {
      "role": "article",
      "ariaLabel": "Contact information for {{name}}"
    }
  },
  "ascii": {
    "templateFile": "contact-card.md",
    "width": 30,
    "height": 8,
    "variables": [
      {"name": "name", "type": "string", "required": true},
      {"name": "email", "type": "string", "required": true},
      {"name": "phone", "type": "string"},
      {"name": "title", "type": "string"}
    ]
  }
}
```

**.md file:**
```markdown
# Contact Card

Display contact information in a professional card format.

## Default Layout

```
┌────────────────────────────┐
│ {{name}}                   │
│ {{title}}                  │
├────────────────────────────┤
│ 📧 {{email}}               │
│ 📞 {{phone}}               │
└────────────────────────────┘
```

## Compact Layout

```
┌──────────────────┐
│ {{name}}         │
│ {{email}}        │
└──────────────────┘
```

## Variables

- `name` (string, required): Full name of the contact
- `email` (string, required): Email address
- `phone` (string): Phone number
- `title` (string): Job title or role

## Usage Examples

```
┌────────────────────────────┐
│ Sarah Johnson             │
│ Senior Designer           │
├────────────────────────────┤
│ 📧 sarah@designco.com     │
│ 📞 +1 555-0199           │
└────────────────────────────┘
```
```

### Example 2: Interactive Form Field

**.uxm file:**
```json
{
  "id": "validated-input",
  "type": "input",
  "version": "1.0.0",
  "metadata": {
    "name": "Validated Input",
    "description": "Input field with validation states and error messages",
    "created": "2024-01-15T11:00:00Z",
    "modified": "2024-01-15T11:00:00Z",
    "tags": ["input", "form", "validation"],
    "category": "input"
  },
  "props": {
    "label": "Email Address",
    "placeholder": "Enter your email",
    "value": "",
    "required": true,
    "error": "",
    "disabled": false
  },
  "behavior": {
    "states": [
      {
        "name": "default",
        "properties": {
          "border": "solid-gray",
          "background": "white"
        }
      },
      {
        "name": "focus",
        "properties": {
          "border": "solid-primary",
          "background": "white"
        },
        "triggers": ["focus"]
      },
      {
        "name": "error",
        "properties": {
          "border": "solid-red",
          "background": "red-light"
        }
      },
      {
        "name": "success",
        "properties": {
          "border": "solid-green",
          "background": "green-light"
        }
      },
      {
        "name": "disabled",
        "properties": {
          "border": "dashed-gray",
          "background": "gray-light"
        }
      }
    ],
    "interactions": [
      {
        "trigger": "focus",
        "action": "highlight-field"
      },
      {
        "trigger": "blur",
        "action": "validate-field"
      },
      {
        "trigger": "change",
        "action": "clear-error"
      }
    ],
    "accessibility": {
      "role": "textbox",
      "focusable": true,
      "ariaLabel": "{{label}}",
      "ariaDescribedBy": "error-message"
    }
  },
  "ascii": {
    "templateFile": "validated-input.md",
    "width": 40,
    "height": 6,
    "variables": [
      {"name": "label", "type": "string", "required": true},
      {"name": "placeholder", "type": "string"},
      {"name": "value", "type": "string"},
      {"name": "error", "type": "string"},
      {"name": "required", "type": "boolean"}
    ]
  }
}
```

**.md file:**
```markdown
# Validated Input

Form input field with comprehensive validation states and error handling.

## Default State

```
{{label}}{{#required}} *{{/required}}
┌──────────────────────────────────────┐
│ {{value || placeholder}}             │
└──────────────────────────────────────┘
```

## Focus State

```
{{label}}{{#required}} *{{/required}}
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ {{value || placeholder}}|            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## Error State

```
{{label}}{{#required}} *{{/required}}
┌──────────────────────────────────────┐
│ {{value}}                            │⚠️
└──────────────────────────────────────┘
❌ {{error}}
```

## Success State

```
{{label}}{{#required}} *{{/required}}
┌──────────────────────────────────────┐
│ {{value}}                            │✅
└──────────────────────────────────────┘
```

## Disabled State

```
{{label}}{{#required}} *{{/required}}
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
│ {{placeholder}}                      │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
```

## Variables

- `label` (string, required): Field label text
- `placeholder` (string): Placeholder text when empty
- `value` (string): Current field value
- `error` (string): Error message text
- `required` (boolean): Whether field is required

## Accessibility

- **Role**: textbox
- **Focusable**: Yes
- **ARIA Labels**: Uses label text and error descriptions
- **Keyboard**: Standard text input navigation

## Usage Examples

### Basic Email Input
```
Email Address *
┌──────────────────────────────────────┐
│ user@example.com                     │✅
└──────────────────────────────────────┘
```

### With Validation Error
```
Email Address *
┌──────────────────────────────────────┐
│ invalid-email                        │⚠️
└──────────────────────────────────────┘
❌ Please enter a valid email address
```
```

### Example 3: Data Dashboard Widget

**.uxm file:**
```json
{
  "id": "metric-widget",
  "type": "display",
  "version": "1.0.0",
  "metadata": {
    "name": "Metric Widget",
    "description": "Dashboard widget displaying key metrics with trend indicators",
    "created": "2024-01-15T12:00:00Z",
    "modified": "2024-01-15T12:00:00Z",
    "tags": ["dashboard", "metrics", "analytics"],
    "category": "display"
  },
  "props": {
    "title": "Revenue",
    "value": "24,567",
    "unit": "$",
    "change": "+12.5%",
    "trend": "up",
    "period": "vs last month"
  },
  "ascii": {
    "templateFile": "metric-widget.md",
    "width": 25,
    "height": 8,
    "variables": [
      {"name": "title", "type": "string", "required": true},
      {"name": "value", "type": "string", "required": true},
      {"name": "unit", "type": "string"},
      {"name": "change", "type": "string"},
      {"name": "trend", "type": "string", "validation": {"enum": ["up", "down", "flat"]}},
      {"name": "period", "type": "string"}
    ]
  }
}
```

**.md file:**
```markdown
# Metric Widget

Dashboard widget for displaying key business metrics with trend visualization.

## Trending Up

```
╭───────────────────────╮
│ {{title}}             │
├───────────────────────┤
│ {{unit}}{{value}}     │
│ {{change}} ↗️         │
│ {{period}}            │
╰───────────────────────╯
```

## Trending Down

```
╭───────────────────────╮
│ {{title}}             │
├───────────────────────┤
│ {{unit}}{{value}}     │
│ {{change}} ↘️         │
│ {{period}}            │
╰───────────────────────╯
```

## Flat Trend

```
╭───────────────────────╮
│ {{title}}             │
├───────────────────────┤
│ {{unit}}{{value}}     │
│ {{change}} →          │
│ {{period}}            │
╰───────────────────────╯
```

## Variables

- `title` (string, required): Metric name or description
- `value` (string, required): The metric value to display
- `unit` (string): Unit symbol (e.g., $, %, €)
- `change` (string): Change amount with + or - prefix
- `trend` (string): Direction - "up", "down", or "flat"
- `period` (string): Time period for comparison

## Usage Examples

### Revenue Widget
```
╭───────────────────────╮
│ Monthly Revenue       │
├───────────────────────┤
│ $24,567               │
│ +12.5% ↗️             │
│ vs last month         │
╰───────────────────────╯
```

### User Engagement
```
╭───────────────────────╮
│ Active Users          │
├───────────────────────┤
│ 1,234                 │
│ -3.2% ↘️              │
│ vs last week          │
╰───────────────────────╯
```
```

---

## Quality Standards

### Essential Quality Checklist

**Schema Compliance:**
- [ ] All required fields present (`id`, `type`, `version`, `metadata`, `props`, `ascii`)
- [ ] Valid ID format (kebab-case, 2-64 chars)
- [ ] Semantic version format (`major.minor.patch`)
- [ ] Template file has `.md` extension
- [ ] ASCII dimensions within limits (1-120 width, 1-50 height)

**Content Quality:**
- [ ] Component has meaningful name and description
- [ ] All template variables defined in `.uxm` file
- [ ] ASCII art uses printable characters only
- [ ] Template file exists and is readable
- [ ] Variables use consistent naming (camelCase)

**Accessibility:**
- [ ] ARIA role specified for interactive components
- [ ] Focusable state defined for interactive elements
- [ ] Keyboard support documented
- [ ] Screen reader labels provided

### Common Schema Errors

**Structure Errors:**
```
❌ Missing required field: id
❌ Invalid ID format: 'MyComponent' (should be 'my-component')
❌ Version must follow semantic versioning: '1.0' → '1.0.0'
❌ Template file not found: 'template.md'
❌ ASCII width exceeds maximum: 150 > 120
```

**Template Errors:**
```
❌ Malformed variable syntax: '{text}' → '{{text}}'
❌ Undefined variable in template: '{{undefinedVar}}'
❌ Non-ASCII characters detected in line 5
❌ Template dimensions don't match declared size
```

### Quality Improvement Tips

1. **Add Comprehensive Metadata:**
   ```json
   "metadata": {
     "name": "Clear, descriptive name",
     "description": "Detailed purpose and usage",
     "author": "Your name or team",
     "tags": ["relevant", "searchable", "keywords"],
     "category": "appropriate-category"
   }
   ```

2. **Include Multiple States:**
   ```json
   "behavior": {
     "states": [
       {"name": "default", "properties": {...}},
       {"name": "hover", "properties": {...}},
       {"name": "focus", "properties": {...}},
       {"name": "disabled", "properties": {...}}
     ]
   }
   ```

3. **Document Template Variables:**
   ```json
   "ascii": {
     "variables": [
       {
         "name": "text",
         "type": "string",
         "description": "Button label text",
         "required": true,
         "validation": {"min": 1, "max": 20}
       }
     ]
   }
   ```

---

## Advanced Techniques

### Component Inheritance

Use the `extends` field to build on existing components:

```json
{
  "id": "icon-button",
  "extends": "primary-button",
  "props": {
    "icon": "star",
    "iconPosition": "left"
  }
}
```

### Dynamic Content with Conditional Logic

While uxscii doesn't support complex templating, you can design for conditional content:

```markdown
## With Icon (iconPosition: left)
```
┌──────────────────┐
│ ⭐ {{text}}      │
└──────────────────┘
```

## Text Only
```
┌──────────────────┐
│ {{text}}         │
└──────────────────┘
```
```

### Complex Layout Patterns

**Multi-column Layouts:**
```
╭──────────────╮ ╭──────────────╮ ╭──────────────╮
│ Column 1     │ │ Column 2     │ │ Column 3     │
│ {{content1}} │ │ {{content2}} │ │ {{content3}} │
╰──────────────╯ ╰──────────────╯ ╰──────────────╯
```

**Nested Components:**
```
╭─────────────────────────────────────╮
│ {{title}}                           │
├─────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────────┐ │
│ │ {{sidebar}} │ │ {{mainContent}} │ │
│ └─────────────┘ └─────────────────┘ │
├─────────────────────────────────────┤
│ {{footer}}                          │
╰─────────────────────────────────────╯
```

### Animation Representation

Show animation frames for dynamic components:

```markdown
## Loading Animation Sequence

### Frame 1
```
⠋ Loading...
```

### Frame 2
```
⠙ Loading...
```

### Frame 3
```
⠹ Loading...
```

### Frame 4
```
⠸ Loading...
```
```

### Responsive Breakpoints

Design for different screen sizes:

```json
{
  "ascii": {
    "width": 40,
    "height": 8,
    "variables": [
      {
        "name": "compact",
        "type": "boolean",
        "description": "Use compact layout for small screens"
      }
    ]
  }
}
```

```markdown
## Desktop Layout (compact: false)
```
╭──────────────────────────────────────╮
│ {{title}}                            │
├──────────────────────────────────────┤
│ {{description}}                      │
│                                      │
│ [{{primaryAction}}] [{{secondary}}]  │
╰──────────────────────────────────────╯
```

## Mobile Layout (compact: true)
```
╭──────────────────╮
│ {{title}}        │
├──────────────────┤
│ {{description}}  │
├──────────────────┤
│ [{{primary}}]    │
│ [{{secondary}}]  │
╰──────────────────╯
```
```

---

## Troubleshooting

### Common Issues and Solutions

**1. Template File Not Found**
```bash
❌ Error: Template file not found: button.md

✅ Solutions:
- Ensure .md file exists in same directory as .uxm
- Check templateFile path in ascii.templateFile
- Verify file extension is exactly ".md"
```

**2. Variable Substitution Not Working**
```bash
❌ Template shows: {{text}} instead of actual text

✅ Solutions:
- Check variable syntax: {{variableName}} (double braces)
- Ensure variable defined in ascii.variables array
- Verify variable name matches exactly (case-sensitive)
- Test with: uxscii uxm get component.uxm
```

**3. Validation Fails on Schema**
```bash
❌ JSON Schema validation failed

✅ Solutions:
- Check required fields: id, type, version, metadata, props, ascii
- Verify ID format: kebab-case only
- Ensure version follows semver: X.Y.Z
- Check metadata has name, created, modified
```

**4. ASCII Art Looks Broken**
```bash
❌ ASCII characters not displaying correctly

✅ Solutions:
- Use only ASCII chars (hex 20-7E)
- Test in monospace font
- Check for tabs vs spaces consistency
- Validate with: uxscii template file.md
```

**5. Component Not Found by CLI**
```bash
❌ Component 'my-button' not found

✅ Solutions:
- Check current directory has .uxm file
- Try full filename: my-button.uxm
- Verify file in examples/ directory
- Use absolute path if needed
```

### Debugging Workflows

**1. Step-by-step Checking:**
```bash
# 1. Check basic JSON syntax
cat component.uxm | python -m json.tool

# 2. Check template syntax
cat component.md

# 3. Verify variables match
grep -o '{{[^}]*}}' component.md
```

---

## Quick Reference

### Component Template

**Minimal .uxm:**
```json
{
  "id": "component-name",
  "type": "button",
  "version": "1.0.0",
  "metadata": {
    "name": "Component Name",
    "created": "2024-01-15T10:00:00Z",
    "modified": "2024-01-15T10:00:00Z"
  },
  "props": {},
  "ascii": {
    "templateFile": "component-name.md",
    "width": 20,
    "height": 3
  }
}
```

**Minimal .md:**
```markdown
# Component Name

Brief description.

## Default State

```
ASCII art with {{variables}}
```

## Variables

- `variableName` (type): Description
```

### ASCII Pattern Library

```
Buttons:    ▓▓▓▓▓▓▓  [Button]  ╭─Button─╮
Inputs:     [_______]  ┌─────────┐  ╭─────────╮
                       │ Input   │  │ Input   │
                       └─────────┘  ╰─────────╯
Cards:      ┌─────────┐  ╭─────────╮  ▓▓▓▓▓▓▓▓▓
            │ Content │  │ Content │  ▓ Content▓
            └─────────┘  ╰─────────╯  ▓▓▓▓▓▓▓▓▓
States:     ✅ Success  ❌ Error  ⚠️ Warning  ℹ️ Info
Icons:      ⭐ Star  🔒 Lock  📧 Email  📞 Phone
Loading:    ⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏  (spinner frames)
Arrows:     ↑↓←→ ↗↘↙↖  ▲▼◀▶  ⬆⬇⬅➡
```

### Variable Naming Conventions

```bash
# Component IDs: kebab-case
primary-button, text-input, contact-card

# Variable names: camelCase
text, buttonText, isDisabled, maxLength

# File names: kebab-case.extension
primary-button.uxm, primary-button.md

# Property names: camelCase
backgroundColor, fontSize, marginTop
```

### Best Practices Checklist

**Before Creating:**
- [ ] Plan component purpose and states
- [ ] Sketch ASCII layout on paper/text editor
- [ ] Identify required vs optional properties
- [ ] Consider accessibility requirements

**During Creation:**
- [ ] Start with minimal required fields
- [ ] Add one feature at a time
- [ ] Test template variable substitution

**Before Committing:**
- [ ] Schema compliance verified
- [ ] Template renders correctly
- [ ] All variables documented
- [ ] Usage examples included
- [ ] Accessibility considered

### Component Categories

| Category | Types | Purpose |
|----------|-------|---------|
| **Input** | button, input, form | User interaction |
| **Display** | text, image, badge | Content presentation |
| **Layout** | container, card, divider | Structure |
| **Navigation** | navigation, modal | User movement |
| **Feedback** | alert, progress | Status communication |
| **Utility** | custom | Special functionality |

---

## Getting Help

### Community Resources
- **Documentation**: Browse `./docs/` directory
- **Examples**: Browse `./examples/` directory

### Advanced Topics
- **Component Libraries**: Sharing and distributing components
- **Integration**: Using uxscii with build tools and frameworks
- **Performance**: Optimizing component parsing and rendering

---

*This guide covers the complete workflow for creating uxscii components. Start with the Quick Start section, then dive deeper into specific areas as needed. Remember to validate early and often, and don't hesitate to start simple and add complexity incrementally.*