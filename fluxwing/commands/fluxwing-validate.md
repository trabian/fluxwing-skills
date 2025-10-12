---
description: Validate uxscii components for quality and compliance
---

# Fluxwing Quick Validator

Quick validation of uxscii components against the schema and best practices.

## Usage

```
/fluxwing-validate                    # Validate all components in ./fluxwing/
/fluxwing-validate [file-path]        # Validate specific file
```

## Your Task

Perform quick validation checks on uxscii component files.

## Behavior

### If `[file-path]` is provided:
Validate only that specific file.

### If no path is provided:
Validate ALL `.uxm` files found in:
- `./fluxwing/components/`
- `./fluxwing/screens/`
- `./fluxwing/library/`

## Validation Checklist

### Level 1: Schema Compliance (Must Pass)

- [ ] **Valid JSON**: File parses as valid JSON
- [ ] **Required fields present**: `id`, `type`, `version`, `metadata`, `props`, `ascii`
- [ ] **ID format**: Kebab-case, 2-64 characters, alphanumeric + hyphens
- [ ] **Version format**: Semantic versioning (major.minor.patch)
- [ ] **Component type**: Valid enum value or "custom"
- [ ] **Metadata required**: `name`, `created`, `modified` present
- [ ] **ASCII dimensions**: width 1-120, height 1-50
- [ ] **Template filename**: Ends with `.md` extension

### Level 2: File Integrity (Must Pass)

- [ ] **Template file exists**: File referenced in `ascii.templateFile` exists
- [ ] **Variables defined**: All `{{variables}}` in template are defined in `.uxm`
- [ ] **Variable naming**: camelCase format
- [ ] **File accessibility**: Files are readable

### Level 3: Best Practices (Should Pass)

- [ ] **Description present**: Component has meaningful description
- [ ] **Multiple states**: Not just "default" - includes hover, focus, etc.
- [ ] **Accessibility**: `behavior.accessibility` attributes present
- [ ] **Tags**: Component has relevant tags for searchability
- [ ] **Category**: Component has appropriate category
- [ ] **Author**: Creator is documented

### Level 4: Quality Standards (Nice to Have)

- [ ] **Usage examples**: Template includes example section
- [ ] **Documentation complete**: Variables documented in template
- [ ] **Consistent patterns**: ASCII uses standard box-drawing characters
- [ ] **State completeness**: Has disabled state if interactive
- [ ] **Keyboard support**: Documented if component is focusable

## Output Format

Provide a concise validation report:

```
FLUXWING VALIDATION REPORT
==========================

Files Analyzed: 5 components, 2 screens

✓ PASSED (5 files)
  ✓ ./fluxwing/components/submit-button.uxm
  ✓ ./fluxwing/components/email-input.uxm
  ✓ ./fluxwing/components/user-card.uxm
  ✓ ./fluxwing/screens/login-screen.uxm
  ✓ ./fluxwing/screens/dashboard.uxm

❌ ERRORS (2 files) - Must fix before use
  ❌ ./fluxwing/components/search-box.uxm
     - Missing required field: metadata.modified
     - Template file not found: serach-box.md (typo?)

  ❌ ./fluxwing/screens/profile.uxm
     - Invalid version format: "1.0" (should be "1.0.0")

⚠️ WARNINGS (3 issues) - Should address
  ⚠️ submit-button.uxm: No hover state defined
  ⚠️ user-card.uxm: Missing accessibility.role attribute
  ⚠️ dashboard.uxm: No description provided

💡 SUGGESTIONS (2 issues) - Nice to have
  💡 email-input.md: Add usage examples section
  💡 submit-button.uxm: Consider adding keyboard shortcuts

OVERALL SCORE: 82/100 (Good)
STATUS: 5 ready to use, 2 need fixes

NEXT STEPS:
1. Fix the 2 errors in search-box and profile
2. Add accessibility attributes for WCAG compliance
3. Define interaction states for better UX
```

## For Deeper Analysis

If the user needs more comprehensive analysis, suggest:

> "For deeper quality analysis with detailed recommendations, I recommend using the **fluxwing-validator agent**:
>
> This agent will provide:
> - Comprehensive pattern analysis
> - Reusability suggestions
> - Consistency checks across all components
> - Detailed fix recommendations
>
> Dispatch with: `Task tool → fluxwing-validator → prompt: 'Analyze all components in ./fluxwing/'`"

## Resources

- **Schema**: `{PLUGIN_ROOT}/data/schema/uxm-component.schema.json` - The source of truth
- **Validation Guide**: `{PLUGIN_ROOT}/data/docs/05-validation-guide.md` - Complete validation standards
- **Schema Reference**: `{PLUGIN_ROOT}/data/docs/07-schema-reference.md` - Field-by-field documentation

## Important Notes

- Schema compliance is non-negotiable - components must pass Level 1 & 2
- Best practices (Level 3) are strongly recommended for production use
- Quality standards (Level 4) improve maintainability and reusability
- Fix errors before using components in production
- Warnings indicate potential UX or accessibility issues

## Common Issues & Fixes

### "Template file not found"
**Fix**: Ensure `.md` file exists in same directory and filename matches exactly (case-sensitive)

### "Invalid version format"
**Fix**: Use semantic versioning: "1.0.0" not "1.0" or "v1"

### "Variable used but not defined"
**Fix**: Add variable to `ascii.variables` array in `.uxm` file

### "Missing required metadata"
**Fix**: Add `created` and `modified` timestamps in ISO 8601 format

### "Invalid ID format"
**Fix**: Use kebab-case only: "my-component" not "myComponent" or "My Component"

You are ensuring uxscii components are production-ready and agent-consumable!
