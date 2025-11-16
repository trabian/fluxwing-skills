# Fluxwing Validator

Deterministic validation for uxscii components and screens.

## Two Modes of Operation

### Interactive Mode (User Invocation)

When users say "Validate my components", the skill:
1. Presents menu (everything/components/screens/custom)
2. Runs appropriate validators
3. Shows minimal summary with optional details

**Example:**
```
✓ 12/14 components valid
✗ 2/14 components failed

Show error details? (yes/no)
```

### Direct Mode (Skill-to-Skill)

Other skills call validator scripts directly:
```bash
node {SKILL_ROOT}/../fluxwing-validator/validate-component.js \
  ./fluxwing/components/button.uxm \
  {SKILL_ROOT}/schemas/uxm-component.schema.json
```

Output: Always verbose (full errors, warnings, stats)
Exit codes: 0 = valid, 1 = errors, 2 = invalid args

---

## Overview

This skill contains validation scripts that can be called from Claude Code skills to validate `.uxm` component files against JSON Schema with additional uxscii-specific checks.

**Key features:**
- ✅ **Deterministic** - Locked dependencies via `package-lock.json`
- ✅ **Zero setup** - `node_modules` bundled in repository
- ✅ **Fast** - ~80ms execution time with ajv
- ✅ **Comprehensive** - Schema validation + uxscii-specific rules
- ✅ **Structured output** - JSON and human-readable formats

## Installation

This skill is bundled with fluxwing-skills plugin.

**Plugin install:**
```bash
/plugin install fluxwing-skills
```

**Script install (development):**
```bash
./scripts/install.sh
```

No npm install required - dependencies bundled with skill.

## Files

```
skills/fluxwing-validator/
├── SKILL.md                    # Interactive validation workflow
├── validate-component.js       # Component validator
├── validate-screen.js          # Screen validator
├── validate-batch.js           # Batch validator
├── test-validator.js           # Component test suite
├── test-screen-validator.js    # Screen test suite
├── package.json                # Dependencies (ajv 8.12.0)
├── package-lock.json           # Locked versions
├── node_modules/               # Bundled dependencies (~7.4 MB)
└── README.md                   # This file
```

## Usage

### From Command Line

```bash
# From project root
node skills/fluxwing-validator/validate-component.js \
  ./fluxwing/components/component.uxm \
  skills/fluxwing-component-creator/schemas/uxm-component.schema.json

# JSON output (for programmatic use)
node skills/fluxwing-validator/validate-component.js \
  ./fluxwing/components/component.uxm \
  skills/fluxwing-component-creator/schemas/uxm-component.schema.json \
  --json
```

### From Other Skills (using SKILL_ROOT)

```bash
# In SKILL.md - Direct mode validation
node {SKILL_ROOT}/../fluxwing-validator/validate-component.js \
  ./fluxwing/components/button.uxm \
  {SKILL_ROOT}/schemas/uxm-component.schema.json
```

### Exit Codes

- `0` - Component is valid
- `1` - Validation errors found
- `2` - Missing dependencies or invalid arguments

## Validation Checks

### 1. JSON Schema Validation

Validates against `uxm-component.schema.json` using ajv (Draft 7):
- Required fields (id, type, version, metadata, props, ascii)
- Field types and formats
- Enum constraints (type, category, fidelity)
- Pattern matching (id format, version format)
- Array and object structures

### 2. ASCII Template File

- Checks that corresponding `.md` file exists
- Validates path: `component.uxm` → `component.md`

### 3. Template Variables

- Extracts `{{variables}}` from `.md` template
- Compares against `ascii.variables` in `.uxm`
- Warns if variables in `.md` are not defined in `.uxm`
- Supports both formats:
  - Array of strings: `["text", "value"]`
  - Array of objects: `[{"name": "text", "type": "string"}]`

### 4. Accessibility

For interactive components (with `behavior.interactions`):
- Warns if missing `behavior.accessibility.role`
- Warns if `focusable` is not set

### 5. ASCII Dimensions

- Warns if `ascii.width` > 120 (terminal width limit)
- Warns if `ascii.height` > 50 (single viewport limit)

### 6. State Properties

- Warns if states exist but have no properties defined

## Output Format

### Human-Readable

```
✓ Valid: primary-button
  Type: button
  Version: 1.0.0
  States: 4
  Props: 5

  Warnings: 1
    1. Interactive component should have ARIA role
       Location: behavior → accessibility → role
```

### JSON

```json
{
  "valid": true,
  "errors": [],
  "warnings": [
    {
      "path": ["behavior", "accessibility", "role"],
      "message": "Interactive component should have ARIA role",
      "type": "accessibility"
    }
  ],
  "stats": {
    "id": "primary-button",
    "type": "button",
    "version": "1.0.0",
    "states": 4,
    "props": 5,
    "interactive": true,
    "hasAccessibility": true
  }
}
```

## Dependencies

Only 6 packages, 2.7 MB total:

- `ajv@8.12.0` - JSON Schema validator (industry standard)
- `ajv-formats@2.1.1` - Format validation (date-time, etc.)
- Supporting packages (fast-deep-equal, fast-uri, json-schema-traverse, require-from-string)

**All dependencies are bundled in `node_modules/` and checked into git.**

## Node.js Version

- **Minimum:** Node.js 14.0.0
- **Recommended:** Node.js 18+ or 20+ (LTS)
- **Tested:** Node.js 18, 20, 22

## Testing

```bash
# Run test suite against bundled templates
npm test

# Or directly
node test-validator.js
```

Tests validate components from:
- `skills/fluxwing-component-creator/templates/*.uxm`

## Development

### Updating Validation Logic

1. Edit `validate-component.js`
2. Test changes: `npm test`
3. Commit (no build step needed)

### Updating Dependencies

```bash
npm update
npm audit fix
npm test
git add package-lock.json node_modules/
git commit -m "Update dependencies"
```

### Adding New Validators

Create new scripts following the same pattern:
- `validate-screen.js` - For screen validation
- `validate-variable.js` - For variable substitution

## Why Node.js?

Compared to Python or native binaries:

**Advantages:**
- ✅ No build step (unlike Go/Rust/Deno compiled)
- ✅ Readable source code (easier debugging)
- ✅ Small diffs (text, not binaries)
- ✅ Likely installed (most developers have Node.js)
- ✅ Mature ecosystem (ajv is industry standard)
- ✅ Fast enough (~80ms including startup)

**Tradeoffs:**
- ⚠️ Requires Node.js runtime (not zero-dependency)
- ⚠️ Slower than native (~80ms vs ~5ms for Go)

## Integration Examples

### Component Creator Skill

```bash
# After creating component (from SKILL.md)
node {SKILL_ROOT}/../fluxwing-validator/validate-component.js \
  ./fluxwing/components/${COMPONENT_ID}.uxm \
  {SKILL_ROOT}/schemas/uxm-component.schema.json

if [ $? -eq 0 ]; then
  echo "✓ Component validated successfully"
else
  echo "✗ Validation failed - see errors above"
  exit 1
fi
```

### Pre-commit Hook

```bash
# .claude/hooks/pre-commit.sh
for uxm_file in fluxwing/components/*.uxm; do
  node skills/fluxwing-validator/validate-component.js \
    "$uxm_file" \
    skills/fluxwing-component-creator/schemas/uxm-component.schema.json \
    || exit 1
done
```

## Troubleshooting

### "ajv libraries not found"

The validator couldn't find the ajv dependency. This should never happen since `node_modules/` is bundled, but if it does:

```bash
cd skills/fluxwing-validator
npm install
```

### "Component file not found"

Check that the path to the `.uxm` file is correct. Paths are relative to the current working directory.

### "Invalid JSON"

The `.uxm` file has syntax errors. Use a JSON validator to find the issue:

```bash
cat component.uxm | jq .
```

## Future Enhancements

- [x] Screen validation (`validate-screen.js`)
- [x] Batch validation (`validate-batch.js`)
- [ ] Variable substitution validation
- [ ] Watch mode for development
- [ ] Integration with CI/CD pipelines
- [ ] VSCode extension integration

## License

MIT
