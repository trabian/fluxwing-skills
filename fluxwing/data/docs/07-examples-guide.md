# Component Examples

This directory contains **fully expanded** component examples showing complete interaction states.

## Important Note

**These examples show expanded components** - they include all interactive states (hover, focus, disabled, error, etc.).

When you create new components using `/fluxwing-create`, they will have **only the default state** for fast MVP prototyping. This is by design to optimize for speed and agile development.

## Two-Phase Creation Workflow

### Phase 1: Fast MVP Creation
```bash
/fluxwing-create my-button
# Creates component with default state only
```

**Result**: Minimal, MVP-ready component for quick prototyping and stakeholder discussions.

### Phase 2: Add Interactive Polish
```bash
/fluxwing-expand-component my-button
# Adds hover, active, disabled states automatically
```

**Result**: Fully interactive component like the examples in this directory.

## What's in This Directory

All examples are **production-ready templates** showing:
- Complete state coverage (default, hover, focus, disabled, etc.)
- Full metadata and accessibility attributes
- Proper variable definitions
- ASCII art for all states

These serve as:
1. **Reference patterns** for component structure
2. **Visual examples** of what expanded components look like
3. **Templates** you can copy and customize

## Using These Examples

### View an Example
```bash
/fluxwing-get primary-button
```

### Copy to Your Project
```bash
/fluxwing-library
# Browse and copy bundled templates
```

### Create from Scratch
```bash
/fluxwing-create my-component
# Then expand when needed:
/fluxwing-expand-component my-component
```

## Available Examples

- **Buttons**: primary-button, secondary-button
- **Inputs**: email-input, password-input, text-input
- **Cards**: card, pricing-card
- **Forms**: form components
- **Navigation**: navigation components
- **Feedback**: alert, badge components

All examples follow uxscii standards and best practices.

## Need More?

- **Component creation guide**: See `../docs/03-component-creation.md`
- **ASCII patterns**: See `../docs/06-ascii-patterns.md`
- **Quick start**: See `../docs/01-quick-start.md`
