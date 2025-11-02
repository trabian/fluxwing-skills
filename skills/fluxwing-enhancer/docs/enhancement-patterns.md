# Enhancement Patterns

How to enhance components from sketch to production fidelity.

## Fidelity Progression Matrix

| Aspect | sketch | basic | detailed | production |
|--------|--------|-------|----------|------------|
| **Description** | Generic | Specific (1-2 sent) | Detailed (3-4 sent) | Complete with edge cases |
| **Tags** | Type only | Type + context | Type + context + features | All applicable tags |
| **ASCII Art** | Missing or minimal | Clean and aligned | Polished with spacing | Pixel-perfect, publication-quality |
| **States** | default only | default only | default + hover + focus | All applicable states |
| **Props** | Minimal | Standard | + examples array | + validation rules |
| **Accessibility** | Basic role | + focusable | + aria-label | + keyboard shortcuts + full a11y |
| **Time** | 10s | 30s | 90s | 180s |

## Enhancement Checklist by Fidelity

### sketch → basic (30s)

**Metadata:**
- [ ] Improve description from generic to specific
- [ ] Add relevant tags beyond just type
- [ ] Keep created/modified timestamps

**ASCII:**
- [ ] Create .md if missing
- [ ] Add clean ASCII art using box-drawing characters
- [ ] Match dimensions from .uxm (ascii.width, ascii.height)
- [ ] Basic alignment (don't need perfect)

**Props:**
- [ ] Document all variables in .md
- [ ] No need to add examples yet

**States:**
- [ ] Keep default state only

**Example:**

Before (sketch):
```json
{
  "metadata": {
    "description": "Button component",
    "tags": ["button"]
  }
}
```

After (basic):
```json
{
  "metadata": {
    "description": "Submit button for form submission with primary action styling",
    "tags": ["button", "submit", "form", "primary-action"],
    "fidelity": "basic"
  }
}
```

### basic → detailed (90s)

**Metadata:**
- [ ] Expand description with usage context
- [ ] Add props.examples array (2-3 examples)

**ASCII:**
- [ ] Polish alignment (consistent spacing)
- [ ] Smooth corners and borders
- [ ] Add visual details

**States:**
- [ ] Add hover state (use hover.json template)
- [ ] Add focus state (use focus.json template)
- [ ] Document state behavior in .md

**Props:**
- [ ] Add examples showing different prop combinations

**Example:**

Before (basic):
```json
{
  "props": {
    "label": "Submit"
  },
  "behavior": {
    "states": [
      {"name": "default", "properties": {}}
    ]
  }
}
```

After (detailed):
```json
{
  "props": {
    "label": "Submit",
    "examples": [
      {"label": "Submit", "context": "Form submission"},
      {"label": "Sign In", "context": "Login form"},
      {"label": "Continue", "context": "Multi-step process"}
    ]
  },
  "behavior": {
    "states": [
      {"name": "default", "properties": {}},
      {"name": "hover", "properties": {
        "backgroundColor": "#e0e0e0",
        "cursor": "pointer"
      }},
      {"name": "focus", "properties": {
        "outline": "2px solid #0066cc",
        "backgroundColor": "#f0f8ff"
      }}
    ]
  },
  "metadata": {
    "fidelity": "detailed"
  }
}
```

### detailed → production (180s)

**Metadata:**
- [ ] Add edge case documentation
- [ ] Complete all optional fields
- [ ] Add keywords for searchability

**ASCII:**
- [ ] Pixel-perfect alignment
- [ ] Publication-quality rendering
- [ ] Consider printing/export appearance

**States:**
- [ ] Add disabled state (if applicable)
- [ ] Add error state (if applicable for forms)
- [ ] Add active/pressed state (for buttons)
- [ ] Add loading state (if async action)

**Accessibility:**
- [ ] Add keyboard shortcuts
- [ ] Add screen reader descriptions
- [ ] Add ARIA label templates
- [ ] Document keyboard navigation

**Props:**
- [ ] Add validation rules
- [ ] Document prop constraints
- [ ] Add deprecation notices if needed

**Example:**

Before (detailed):
```json
{
  "behavior": {
    "states": [
      {"name": "default", "properties": {}},
      {"name": "hover", "properties": {...}},
      {"name": "focus", "properties": {...}}
    ],
    "accessibility": {
      "role": "button",
      "focusable": true
    }
  }
}
```

After (production):
```json
{
  "behavior": {
    "states": [
      {"name": "default", "properties": {}},
      {"name": "hover", "properties": {...}},
      {"name": "focus", "properties": {...}},
      {"name": "disabled", "properties": {
        "opacity": 0.5,
        "cursor": "not-allowed",
        "interactive": false
      }},
      {"name": "active", "properties": {
        "backgroundColor": "#c0c0c0",
        "transform": "translateY(1px)"
      }}
    ],
    "accessibility": {
      "role": "button",
      "focusable": true,
      "ariaLabel": "{{label}} - {{context}}",
      "keyboardShortcuts": [
        {"key": "Enter", "action": "activate"},
        {"key": "Space", "action": "activate"}
      ]
    }
  },
  "metadata": {
    "fidelity": "production",
    "description": "Submit button for form submission with primary action styling. Supports keyboard navigation (Enter/Space), shows visual feedback on hover and focus, and provides disabled state for form validation. Use for primary actions like 'Submit', 'Sign In', 'Continue'."
  }
}
```

## State Addition Guide

### When to Add Each State

**hover:**
- All interactive components (button, input, link)
- Cards if clickable
- Navigation items

**focus:**
- All focusable components
- Required for keyboard navigation
- WCAG AA compliance

**disabled:**
- Form controls (button, input, checkbox, select)
- Actions that may be unavailable
- Not needed for display-only components

**error:**
- Form inputs (text, email, password)
- Validation feedback required
- Not needed for buttons or display components

**active/pressed:**
- Buttons
- Links
- Interactive cards
- Shows immediate feedback

**loading:**
- Buttons triggering async actions
- Forms submitting data
- Components fetching data

## ASCII Art Enhancement

### sketch → basic

Focus: Functionality over beauty
- Use basic box-drawing characters (─│┌┐└┘)
- Align text roughly
- Match dimensions

Example:
```
┌──────────────────┐
│ Submit           │
└──────────────────┘
```

### basic → detailed

Focus: Polish and consistency
- Use rounded corners (╭╮╰╯) for friendly feel
- Careful spacing (center-align text)
- Smooth visual flow

Example:
```
╭──────────────────╮
│     Submit       │
╰──────────────────╯
```

### detailed → production

Focus: Pixel-perfect publication quality
- Perfect alignment (character-level precision)
- Consider all states (how hover/focus changes appearance)
- Professional appearance for screenshots

Example:
```
╭──────────────────╮
│      Submit      │
╰──────────────────╯

Hover:
╔══════════════════╗
║      Submit      ║
╚══════════════════╝
```

## Common Patterns

### Button Enhancement

sketch → basic:
- Add clean box ASCII
- Specific description

basic → detailed:
- Add hover + focus states
- Polish ASCII with rounded corners
- Add usage examples

detailed → production:
- Add disabled + active states
- Add keyboard shortcuts
- Pixel-perfect ASCII

### Input Enhancement

sketch → basic:
- Add input box ASCII with placeholder
- Specific description

basic → detailed:
- Add focus state
- Add label positioning
- Add usage examples

detailed → production:
- Add error state
- Add disabled state
- Add validation rules
- Full accessibility

### Card Enhancement

sketch → basic:
- Add card box with title/content areas
- Specific description

basic → detailed:
- Polish layout and spacing
- Add examples (different content)

detailed → production:
- Add hover state (if interactive)
- Perfect alignment
- Complete metadata

## Performance Targets

| Enhancement | Components | Time Target |
|-------------|-----------|-------------|
| 1 component to basic | 1 | 30s |
| 1 component to detailed | 1 | 90s |
| 1 component to production | 1 | 180s |
| 6 components to basic (parallel) | 6 | 30s |
| 6 components to detailed (parallel) | 6 | 90s |
| 6 components to production (parallel) | 6 | 180s |

Parallel execution: Multiple agents working simultaneously, so total time ≈ single component time!
