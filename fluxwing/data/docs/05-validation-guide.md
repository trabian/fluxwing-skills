# Validation Guide - Quality Standards

Complete guide to validating uxscii components for production readiness.

## Validation Levels

Components are validated at 5 levels, from critical to nice-to-have:

### Level 1: Schema Compliance ✓ (MUST PASS)
**Blocks Usage** - Fix immediately

- [ ] Valid JSON structure
- [ ] All required fields present
- [ ] Correct data types
- [ ] ID format: kebab-case, 2-64 chars
- [ ] Version: semantic (X.Y.Z)
- [ ] Component type: valid enum or "custom"
- [ ] ASCII dimensions: width 1-120, height 1-50

### Level 2: File Integrity ✓ (MUST PASS)
**Causes Runtime Errors** - Fix before deployment

- [ ] Template file exists
- [ ] Template is readable
- [ ] All `{{variables}}` in template defined in .uxm
- [ ] Variable naming: camelCase
- [ ] No orphaned files

### Level 3: Best Practices ⚡ (SHOULD PASS)
**UX Quality** - Strongly recommended

- [ ] Description present and meaningful
- [ ] Multiple states defined (not just default)
- [ ] Accessibility attributes present
- [ ] Tags for searchability
- [ ] Appropriate category
- [ ] Author documented

### Level 4: Quality & Consistency ⭐ (RECOMMENDED)
**Maintainability** - Improves long-term quality

- [ ] Usage examples in template
- [ ] Variables documented
- [ ] Consistent ASCII patterns
- [ ] Disabled state for interactive components
- [ ] Error state for form inputs
- [ ] Keyboard support documented

### Level 5: Accessibility ♿ (ESSENTIAL FOR PUBLIC USE)
**Legal/Ethical** - Required for WCAG compliance

- [ ] ARIA role appropriate
- [ ] aria-label or aria-labelledby present
- [ ] Focusable if interactive
- [ ] Keyboard shortcuts documented
- [ ] Color not sole indicator
- [ ] Focus states visually distinct

## Common Errors and Fixes

### Schema Errors

**Error**: "Missing required field: metadata.modified"
```json
// Fix: Add timestamp
"metadata": {
  "name": "My Component",
  "created": "2024-10-11T12:00:00Z",
  "modified": "2024-10-11T12:00:00Z"  ← ADD THIS
}
```

**Error**: "Invalid ID format: 'MyComponent'"
```json
// Fix: Use kebab-case
"id": "my-component"  // ✓ Correct
"id": "MyComponent"   // ✗ Wrong
```

**Error**: "Version must follow semantic versioning"
```json
// Fix: Use X.Y.Z format
"version": "1.0.0"  // ✓ Correct
"version": "1.0"    // ✗ Wrong
"version": "v1"     // ✗ Wrong
```

### File Integrity Errors

**Error**: "Template file not found: button.md"
```
Fix:
1. Check file exists in same directory
2. Verify filename matches exactly (case-sensitive)
3. Ensure .md extension
```

**Error**: "Variable '{{userName}}' used but not defined"
```json
// Fix: Add to ascii.variables
"ascii": {
  "variables": [
    {
      "name": "userName",  ← ADD THIS
      "type": "string",
      "description": "User's display name"
    }
  ]
}
```

### Best Practice Warnings

**Warning**: "Only default state defined"
```json
// Fix: Add interaction states
"behavior": {
  "states": [
    {"name": "default", "properties": {}},
    {"name": "hover", "properties": {}, "triggers": ["mouseenter"]},
    {"name": "focus", "properties": {}, "triggers": ["focus"]},
    {"name": "disabled", "properties": {}}
  ]
}
```

**Warning**: "Missing accessibility attributes"
```json
// Fix: Add accessibility config
"behavior": {
  "accessibility": {
    "role": "button",
    "ariaLabel": "Submit form",
    "focusable": true,
    "keyboardSupport": ["Enter", "Space"]
  }
}
```

### Quality Issues

**Issue**: "No usage examples"
````markdown
// Fix: Add to template
## Usage Examples

### Basic Usage
```
╭──────────────╮
│ Click Here   │
╰──────────────╯
```

### With Icon
```
╭──────────────╮
│ 🔍 Search    │
╰──────────────╯
```
````

## Validation Checklist

Use this before considering a component complete:

### Required (Must Have)
- [ ] Valid `.uxm` with all required fields
- [ ] Matching `.md` template file
- [ ] All variables defined in both files
- [ ] Passes schema validation

### Recommended (Should Have)
- [ ] Rich metadata (description, tags, author)
- [ ] Multiple states (default + hover/focus/disabled)
- [ ] Accessibility attributes
- [ ] Usage examples in template
- [ ] Variable documentation

### Optional (Nice to Have)
- [ ] Animation properties
- [ ] Responsive variants
- [ ] Dark mode support
- [ ] Extended documentation

## Quick Validation Commands

### Validate One Component
```bash
/fluxwing-validate ./fluxwing/components/my-component.uxm
```

### Validate All Components
```bash
/fluxwing-validate
```

### Deep Analysis (Use Agent)
For comprehensive quality review, dispatch the validator agent:
- More thorough pattern analysis
- Consistency checks across all components
- Specific fix recommendations with code examples

## Scoring Guide

**90-100**: Excellent - Production ready
**80-89**: Good - Minor improvements needed
**70-79**: Acceptable - Needs work
**60-69**: Poor - Significant issues
**< 60**: Failing - Major rework required

## Common Validation Patterns

### Button Validation
```
✓ Interactive states: default, hover, focus, disabled
✓ Accessibility: role="button", focusable, keyboard support
✓ Variables: text property with validation
```

### Input Validation
```
✓ Form states: default, focus, error, success, disabled
✓ Accessibility: role="textbox", ariaLabel, describedBy
✓ Variables: value, placeholder, error message
```

### Screen Validation
```
✓ All component references exist
✓ Layout is clear and aligned
✓ Three files: .uxm, .md, .rendered.md
✓ Rendered example uses real data
```

## When to Use Deep Validation

Use the `fluxwing-validator` agent when:
- Building for production
- Need comprehensive quality report
- Want consistency analysis across all components
- Require specific fix recommendations
- Preparing for code review

## Next Steps

- **Fix errors**: Address all Level 1 & 2 issues immediately
- **Improve quality**: Work through Level 3 & 4 recommendations
- **Ensure accessibility**: Complete Level 5 for public components
- **Document**: Add examples and variable descriptions

Quality components are accessible, well-documented, and maintainable!
