# Core Utilities Refactoring Design

**Date**: 2025-11-16
**Status**: Design Approved
**Version**: 1.0.0

## Executive Summary

This design refactors the `fluxwing-validator` skill into `fluxwing-core-utils`, expanding it from pure validation to a comprehensive utility library that provides deterministic scripts for inventory discovery, file I/O operations, and schema management.

**Motivation**:
- **Performance**: Reduce bash overhead by providing fast, deterministic scripts
- **Consistency**: Eliminate duplicate implementations of common operations across skills
- **Context Efficiency**: Free up agent tokens for creative work instead of repetitive file operations

## Architecture

### Skill Rename & Structure

**Before**:
```
skills/fluxwing-validator/
├── SKILL.md
├── validate-component.js
├── validate-screen.js
├── validate-batch.js
└── schemas/
    └── uxm-component.schema.json
```

**After**:
```
skills/fluxwing-core-utils/
├── SKILL.md                          # Dual-mode menu interface
├── schemas/
│   └── uxm-component.schema.json    # Existing schema
├── validate-component.js             # Existing validator
├── validate-screen.js                # Existing validator
├── validate-batch.js                 # Existing validator
├── inventory.js                      # NEW: Component/screen discovery
├── read-pair.js                      # NEW: Atomic .uxm + .md reading
├── write-pair.js                     # NEW: Atomic .uxm + .md writing
├── load-schema.js                    # NEW: Schema loading & compilation
└── docs/
    ├── inventory-api.md              # NEW: Inventory documentation
    ├── file-io-api.md                # NEW: File I/O documentation
    └── schema-api.md                 # NEW: Schema operations documentation
```

### Dual-Mode Interface Pattern

All scripts support two operating modes:

1. **Interactive Mode**: User invokes skill directly → menu interface → human-friendly output
2. **Programmatic Mode**: Skill calls script → JSON output → machine-parseable results

This pattern provides:
- User-facing features (interactive access to utilities)
- Skill-to-skill API (programmatic consumption)
- Consistent interface across all operations

## Component Specifications

### 1. inventory.js - Unified Component Discovery

**Purpose**: Single script to find all uxm files across bundled templates, project workspace, and library.

**Search Strategy**:
- Searches in priority order: `./fluxwing/components/` → `./fluxwing/library/` → `{SKILL_ROOT}/templates/`
- Screens searched in: `./fluxwing/screens/`
- Returns metadata (id, type, version) without full file reads for performance

**Interactive Mode**:
```bash
$ node inventory.js --interactive --type components
┌─────────────────────────────────────────┐
│ Component Inventory                      │
├─────────────────────────────────────────┤
│ Bundled Templates:      11 components    │
│ Project Components:      3 components    │
│ Project Library:         2 components    │
│ Total:                  16 components    │
└─────────────────────────────────────────┘
```

**Programmatic Mode**:
```bash
$ node inventory.js --type components --format json
{
  "bundled": [
    {
      "path": "{SKILL_ROOT}/fluxwing-component-creator/templates/button.uxm",
      "id": "button",
      "type": "button",
      "version": "1.0.0"
    }
  ],
  "components": [
    {
      "path": "./fluxwing/components/submit-button.uxm",
      "id": "submit-button",
      "type": "button",
      "version": "1.0.0"
    }
  ],
  "library": [
    {
      "path": "./fluxwing/library/custom-button.uxm",
      "id": "custom-button",
      "type": "button",
      "version": "1.0.0"
    }
  ]
}
```

**CLI Options**:
- `--type [components|screens]` - Type of inventory to retrieve
- `--format [json|text]` - Output format (default: text)
- `--interactive` - Enable interactive mode
- `--filter <pattern>` - Filter by id pattern (regex)
- `--component-type <type>` - Filter by component type (button, input, etc.)

**Key Features**:
- Fast: Reads only JSON metadata, not markdown files
- Handles skill root path resolution automatically
- Returns full paths for immediate use by other scripts
- Deduplicates if same component exists in multiple locations (prefers user files)

### 2. read-pair.js - Atomic Component Reading

**Purpose**: Read .uxm + .md files as a validated unit, ensuring consistency.

**Interactive Mode**:
```bash
$ node read-pair.js --interactive --id submit-button
┌─────────────────────────────────────────┐
│ Component: submit-button                 │
├─────────────────────────────────────────┤
│ Type: button                             │
│ Version: 1.0.0                           │
│ Template variables: 3                    │
│ States: default, hover, disabled         │
│ Files: ✓ .uxm  ✓ .md                    │
└─────────────────────────────────────────┘
```

**Programmatic Mode**:
```bash
$ node read-pair.js --id submit-button --format json
{
  "uxm": {
    "id": "submit-button",
    "type": "button",
    "version": "1.0.0",
    ...
  },
  "md": "<!-- ASCII template content -->",
  "paths": {
    "uxm": "./fluxwing/components/submit-button.uxm",
    "md": "./fluxwing/components/submit-button.md"
  },
  "valid": true,
  "variables": {
    "declared": ["label", "variant", "state"],
    "used": ["label", "variant", "state"],
    "consistent": true
  }
}
```

**CLI Options**:
- `--id <component-id>` - Component ID to read
- `--path <directory>` - Explicit directory path (bypasses inventory search)
- `--format [json|text]` - Output format (default: text)
- `--interactive` - Enable interactive mode
- `--validate` - Run schema validation on read (default: true)

**Key Features**:
- Validates .uxm against schema
- Checks template variable consistency between .uxm and .md
- Returns both files atomically
- Searches inventory if only ID provided
- Error handling for missing files or mismatched pairs

### 3. write-pair.js - Atomic Component Writing

**Purpose**: Write .uxm + .md files atomically with validation.

**Programmatic Mode** (primary use):
```bash
$ node write-pair.js --uxm-file /tmp/button.uxm --md-file /tmp/button.md --output ./fluxwing/components/
{
  "success": true,
  "paths": {
    "uxm": "./fluxwing/components/button.uxm",
    "md": "./fluxwing/components/button.md"
  },
  "validated": true,
  "id": "button",
  "version": "1.0.0"
}
```

**Interactive Mode**:
```bash
$ node write-pair.js --interactive
? Enter path to .uxm file: /tmp/button.uxm
? Enter path to .md file: /tmp/button.md
? Output directory [./fluxwing/components/]:
✓ Validated button.uxm
✓ Wrote ./fluxwing/components/button.uxm
✓ Wrote ./fluxwing/components/button.md
```

**CLI Options**:
- `--uxm-file <path>` - Path to .uxm file to write
- `--md-file <path>` - Path to .md file to write
- `--output <directory>` - Output directory (default: ./fluxwing/components/)
- `--format [json|text]` - Output format (default: text)
- `--interactive` - Enable interactive mode
- `--skip-validation` - Skip schema validation (not recommended)
- `--overwrite` - Overwrite existing files without prompting

**Key Features**:
- Validates .uxm against schema before writing
- Checks template variable consistency
- Atomic operation: both files written or neither (rollback on failure)
- Auto-creates output directory if needed
- Prevents accidental overwrites (prompts in interactive, fails in programmatic unless --overwrite)
- Returns paths for skill consumption

### 4. load-schema.js - Centralized Schema Loading

**Purpose**: Load and compile JSON schemas once, cache for reuse across operations.

**Interactive Mode**:
```bash
$ node load-schema.js --interactive --type component
┌─────────────────────────────────────────┐
│ uxscii Component Schema                  │
├─────────────────────────────────────────┤
│ Draft: 7                                 │
│ Required fields: 5                       │
│ Optional fields: 8                       │
│ Component types: 35                      │
│                                          │
│ Validation rules:                        │
│  • ID pattern: ^[a-z0-9-]+$             │
│  • Version: semantic (X.Y.Z)             │
│  • ASCII: max 120×50                     │
└─────────────────────────────────────────┘
```

**Programmatic Mode**:
```bash
$ node load-schema.js --type component --format json
{
  "schema": {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    ...
  },
  "path": "{SKILL_ROOT}/schemas/uxm-component.schema.json",
  "compiled": true,
  "stats": {
    "requiredFields": 5,
    "optionalFields": 8,
    "componentTypes": 35
  }
}
```

**Module Usage** (for Node.js scripts):
```javascript
// Import compiled validator
const { validator, schema } = require('./load-schema.js');

// Validate component data
const component = { id: 'button', type: 'button', ... };
const isValid = validator(component);

if (!isValid) {
  console.error('Validation errors:', validator.errors);
}
```

**CLI Options**:
- `--type [component|screen]` - Schema type to load
- `--format [json|text]` - Output format (default: text)
- `--interactive` - Enable interactive mode
- `--stats-only` - Return only schema statistics (faster)

**Key Features**:
- Single source of truth for schema loading
- Compiles schema once using AJV, reuses validator (performance)
- Supports both component and screen schemas
- Exposes as CommonJS module for `require()` or CLI for programmatic calls
- Caches compiled validators to avoid recompilation

**Integration with Existing Validators**:
- `validate-component.js` refactored to use `load-schema.js` internally
- `validate-screen.js` refactored to use `load-schema.js` internally
- Eliminates duplicate schema-loading code across validators

## Interactive Mode UX

### Unified Menu Interface (SKILL.md)

When users invoke the skill interactively, they see a menu:

```
┌─────────────────────────────────────────┐
│ Fluxwing Core Utilities                  │
├─────────────────────────────────────────┤
│ What would you like to do?               │
│                                          │
│ [1] Show inventory                       │
│     • List all components and screens    │
│                                          │
│ [2] Read component/screen                │
│     • View .uxm + .md files              │
│                                          │
│ [3] Validate files                       │
│     • Check component/screen validity    │
│                                          │
│ [4] View schema info                     │
│     • Inspect validation rules           │
│                                          │
│ [5] Exit                                 │
└─────────────────────────────────────────┘
```

### Natural Language Triggers

**Skill Description Update**:
```yaml
name: fluxwing-core-utils
description: Core utilities for validation, inventory, file I/O, and schema operations
```

**Trigger Phrases**:
- "Show inventory" / "List components" → inventory.js --interactive
- "Read component X" / "Show me X" → read-pair.js --interactive --id X
- "Validate" / "Check my components" → validate-batch.js --interactive
- "Schema info" / "What are the validation rules" → load-schema.js --interactive

### Output Philosophy

**Interactive Mode**:
- Clean ASCII boxes and tables
- Minimal text, user-friendly
- Color coding (✓ success, ✗ errors)
- Human-readable summaries

**Programmatic Mode**:
- JSON output for machine parsing
- Verbose details for skill consumption
- Exit codes: 0 = success, 1 = error
- Structured error messages with context

## Migration Plan

### Phase 1: Rename & Core Scripts

**Tasks**:
1. Rename `skills/fluxwing-validator/` → `skills/fluxwing-core-utils/`
2. Update SKILL.md frontmatter with new name and description
3. Create new scripts:
   - `inventory.js` (discovery)
   - `read-pair.js` (atomic reading)
   - `write-pair.js` (atomic writing)
   - `load-schema.js` (schema operations)
4. Refactor existing validators to use `load-schema.js` internally
5. Create documentation files in `docs/` subdirectory

**Timeline**: 1 development session

### Phase 2: Update Skill References

**Tasks**:
1. Update all skill SKILL.md files that reference validator scripts
2. Change path references from `fluxwing-validator` to `fluxwing-core-utils`

**Affected Skills** (6 total):
- `fluxwing-component-creator`
- `fluxwing-component-expander`
- `fluxwing-screen-scaffolder`
- `fluxwing-enhancer`
- `fluxwing-component-viewer`
- `fluxwing-library-browser`

**Example Change**:
```diff
- {SKILL_ROOT}/../fluxwing-validator/validate-component.js
+ {SKILL_ROOT}/../fluxwing-core-utils/validate-component.js
```

**Timeline**: 1 development session

### Phase 3: Integrate New Scripts

**Tasks**:
1. Replace bash file discovery with `inventory.js` calls
2. Replace manual .uxm/.md reading with `read-pair.js` calls
3. Replace manual .uxm/.md writing with `write-pair.js` calls
4. Update skill documentation to reference new utilities

**Example Refactoring** (component-creator):
```diff
# BEFORE
- bash: find {SKILL_ROOT}/templates -name "*.uxm"
- bash: find ./fluxwing/components -name "*.uxm"

# AFTER
+ node {SKILL_ROOT}/../fluxwing-core-utils/inventory.js --type components --format json
```

**Skills to Update**:
- `fluxwing-component-creator`: Use inventory + write-pair
- `fluxwing-component-expander`: Use inventory + read-pair + write-pair
- `fluxwing-screen-scaffolder`: Use inventory + write-pair
- `fluxwing-enhancer`: Use read-pair + write-pair
- `fluxwing-component-viewer`: Use inventory + read-pair
- `fluxwing-library-browser`: Use inventory

**Timeline**: 2-3 development sessions

### Phase 4: Testing & Release

**Testing Strategy**:
1. **Unit Tests**: Each script in both interactive and programmatic modes
2. **Integration Tests**: Each skill using new utilities
3. **End-to-End Tests**: Full workflows (create → expand → validate → view)
4. **Regression Tests**: Ensure existing functionality unchanged

**Test Cases**:
- inventory.js: Empty project, with components, with screens, mixed
- read-pair.js: Valid pairs, missing files, invalid JSON, variable mismatches
- write-pair.js: New files, overwrite scenarios, validation failures
- load-schema.js: Component schema, screen schema, stats extraction

**Release Plan**:
- Version bump: `0.0.3` → `0.1.0` (minor - backward incompatible due to rename)
- Update `INSTALL.md` with new skill name
- Update `README.md` with new skill description
- Add migration notes to `CHANGELOG.md`
- Tag release: `v0.1.0`

**Timeline**: 1-2 development sessions

## Success Criteria

### Performance Metrics
- [ ] Inventory operations complete in <100ms for projects with <100 components
- [ ] File I/O operations replace 5+ bash commands with 1 script call
- [ ] Agent token usage reduced by 30%+ for common operations

### Consistency Metrics
- [ ] Zero duplicate implementations of file discovery across skills
- [ ] All skills use identical validation logic via load-schema.js
- [ ] Consistent error handling and output formats across all scripts

### User Experience Metrics
- [ ] Interactive mode provides immediate feedback (<1s response time)
- [ ] Natural language triggers work for all new utilities
- [ ] Documentation covers both interactive and programmatic usage

### Technical Metrics
- [ ] All scripts support dual-mode operation
- [ ] All scripts return structured JSON in programmatic mode
- [ ] All scripts include comprehensive error handling
- [ ] Zero breaking changes for existing skill functionality

## Risks & Mitigations

### Risk 1: Breaking Changes for Users
**Impact**: Users with existing fluxwing-validator references will break
**Mitigation**:
- Document migration clearly in CHANGELOG.md
- Version bump to 0.1.0 signals backward incompatibility
- Consider adding deprecation warnings in old path

### Risk 2: Script Complexity
**Impact**: Dual-mode scripts become hard to maintain
**Mitigation**:
- Separate interactive and programmatic logic into functions
- Comprehensive tests for both modes
- Clear documentation of CLI interface

### Risk 3: Performance Regressions
**Impact**: Scripts slower than expected, don't achieve goals
**Mitigation**:
- Benchmark before/after for common operations
- Profile script execution to identify bottlenecks
- Optimize JSON parsing and file I/O

### Risk 4: Skill Integration Issues
**Impact**: Skills fail to call new utilities correctly
**Mitigation**:
- Thorough integration testing
- Update skills incrementally (one at a time)
- Maintain bash fallback temporarily during transition

## Future Enhancements

### Phase 5: Additional Utilities (Post-0.1.0)

**Potential Additions**:
1. `copy-component.js` - Duplicate components with versioning
2. `rename-component.js` - Rename component IDs with validation
3. `diff-components.js` - Compare two component versions
4. `export-library.js` - Export project components as distributable library
5. `import-library.js` - Import external component libraries

### Phase 6: Caching & Performance

**Optimizations**:
- In-memory cache for inventory results
- File watcher for automatic cache invalidation
- Parallel file reading for batch operations
- Streaming JSON parser for large files

### Phase 7: Enhanced Validation

**Advanced Features**:
- Semantic version validation (ensure monotonic increases)
- Cross-component dependency validation
- Unused template variable detection
- ASCII art consistency checking

## Appendix A: Script API Reference

### inventory.js

```bash
# Usage
node inventory.js [OPTIONS]

# Options
--type <components|screens>    Type of inventory (required)
--format <json|text>           Output format (default: text)
--interactive                  Enable interactive mode
--filter <pattern>             Filter by ID pattern (regex)
--component-type <type>        Filter by component type

# Exit Codes
0  Success
1  Invalid arguments
2  No items found
3  File system error
```

### read-pair.js

```bash
# Usage
node read-pair.js [OPTIONS]

# Options
--id <component-id>            Component ID to read (required unless --path)
--path <directory>             Explicit directory path
--format <json|text>           Output format (default: text)
--interactive                  Enable interactive mode
--validate                     Run schema validation (default: true)

# Exit Codes
0  Success
1  Invalid arguments
2  Component not found
3  File read error
4  Validation failed
```

### write-pair.js

```bash
# Usage
node write-pair.js [OPTIONS]

# Options
--uxm-file <path>              Path to .uxm file (required)
--md-file <path>               Path to .md file (required)
--output <directory>           Output directory (default: ./fluxwing/components/)
--format <json|text>           Output format (default: text)
--interactive                  Enable interactive mode
--skip-validation              Skip schema validation
--overwrite                    Overwrite existing files without prompting

# Exit Codes
0  Success
1  Invalid arguments
2  Input file not found
3  Validation failed
4  Write failed (rollback performed)
5  Overwrite prevented (file exists)
```

### load-schema.js

```bash
# Usage
node load-schema.js [OPTIONS]

# Options
--type <component|screen>      Schema type (default: component)
--format <json|text>           Output format (default: text)
--interactive                  Enable interactive mode
--stats-only                   Return only schema statistics

# Exit Codes
0  Success
1  Invalid arguments
2  Schema file not found
3  Schema compilation failed
```

## Appendix B: Integration Examples

### Example 1: Component Creator Using New Utilities

```javascript
// Before: Bash-heavy implementation
Task({
  subagent_type: "general-purpose",
  prompt: `
    1. Search for existing components:
       bash: find ./fluxwing/components -name "*.uxm"
       bash: find {SKILL_ROOT}/templates -name "*.uxm"

    2. Read schema:
       bash: cat {SKILL_ROOT}/schemas/uxm-component.schema.json

    3. Create component files:
       bash: mkdir -p ./fluxwing/components
       bash: echo "..." > ./fluxwing/components/button.uxm
       bash: echo "..." > ./fluxwing/components/button.md

    4. Validate:
       bash: node {SKILL_ROOT}/../fluxwing-validator/validate-component.js ...
  `
})

// After: Script-based implementation
Task({
  subagent_type: "general-purpose",
  prompt: `
    1. Check for existing components:
       node {SKILL_ROOT}/../fluxwing-core-utils/inventory.js --type components --format json

    2. Load schema:
       node {SKILL_ROOT}/../fluxwing-core-utils/load-schema.js --type component --format json

    3. Create component files:
       node {SKILL_ROOT}/../fluxwing-core-utils/write-pair.js \
         --uxm-file /tmp/button.uxm \
         --md-file /tmp/button.md \
         --output ./fluxwing/components/

    (Validation happens automatically in write-pair.js)
  `
})
```

### Example 2: Library Browser Using Inventory

```javascript
// Before: Multiple bash commands
bash: find {SKILL_ROOT}/fluxwing-component-creator/templates -name "*.uxm" -exec basename {} .uxm \\;
bash: find ./fluxwing/components -name "*.uxm" -exec basename {} .uxm \\;
bash: find ./fluxwing/library -name "*.uxm" -exec basename {} .uxm \\;
// Then parse and deduplicate in bash...

// After: Single inventory call
const result = JSON.parse(
  bash: node {SKILL_ROOT}/../fluxwing-core-utils/inventory.js --type components --format json
);

// Result structure:
{
  "bundled": [...],
  "components": [...],
  "library": [...]
}
```

### Example 3: Component Viewer Using Read-Pair

```javascript
// Before: Manual file reading
bash: cat ./fluxwing/components/button.uxm
bash: cat ./fluxwing/components/button.md
// Then parse JSON manually...

// After: Atomic read with validation
const result = JSON.parse(
  bash: node {SKILL_ROOT}/../fluxwing-core-utils/read-pair.js --id button --format json
);

// Result structure:
{
  "uxm": { /* parsed JSON */ },
  "md": "/* markdown content */",
  "paths": { "uxm": "...", "md": "..." },
  "valid": true,
  "variables": { "consistent": true }
}
```

## Document History

- **2025-11-16**: Initial design approved
- **Version 1.0.0**: Complete specification for core utilities refactoring
