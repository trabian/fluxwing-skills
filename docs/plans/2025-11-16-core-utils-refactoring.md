# Core Utilities Refactoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor fluxwing-validator into fluxwing-core-utils with deterministic scripts for inventory, file I/O, and schema operations.

**Architecture:** Extend existing validator skill into a comprehensive utility library with dual-mode scripts (interactive + programmatic). All scripts follow the established pattern from validate-*.js files.

**Tech Stack:** Node.js scripts, JSON Schema (AJV), CommonJS modules, bash integration

---

## Phase 1: Rename & Core Scripts

### Task 1: Rename Skill Directory

**Files:**
- Rename: `skills/fluxwing-validator/` → `skills/fluxwing-core-utils/`

**Step 1: Rename the directory**

```bash
cd /workspaces/uxm-tools
mv skills/fluxwing-validator skills/fluxwing-core-utils
```

Expected: Directory renamed successfully

**Step 2: Update SKILL.md frontmatter**

Modify: `skills/fluxwing-core-utils/SKILL.md:1-10`

```yaml
---
name: fluxwing-core-utils
description: Core utilities for validation, inventory, file I/O, and schema operations
version: 1.0.0
author: Trabian
allowed-tools: Read, Write, Edit, Glob, Grep, Task, TodoWrite, Bash
---
```

**Step 3: Verify rename**

```bash
ls -la skills/ | grep fluxwing
```

Expected: Should see `fluxwing-core-utils`, NOT `fluxwing-validator`

**Step 4: Commit rename**

```bash
git add -A
git commit -m "refactor: rename fluxwing-validator to fluxwing-core-utils

Expands validator into comprehensive utility library for inventory,
file I/O, and schema operations."
```

---

### Task 2: Create load-schema.js Script

**Files:**
- Create: `skills/fluxwing-core-utils/load-schema.js`

**Step 1: Write the script skeleton**

Create: `skills/fluxwing-core-utils/load-schema.js`

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    type: 'component',
    format: 'text',
    interactive: false,
    statsOnly: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--type':
        options.type = args[++i];
        break;
      case '--format':
        options.format = args[++i];
        break;
      case '--interactive':
        options.interactive = true;
        break;
      case '--stats-only':
        options.statsOnly = true;
        break;
      case '--help':
        printHelp();
        process.exit(0);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Usage: node load-schema.js [OPTIONS]

Options:
  --type <component|screen>      Schema type (default: component)
  --format <json|text>           Output format (default: text)
  --interactive                  Enable interactive mode
  --stats-only                   Return only schema statistics
  --help                         Show this help message

Exit Codes:
  0  Success
  1  Invalid arguments
  2  Schema file not found
  3  Schema compilation failed
`);
}

// Load schema file
function loadSchemaFile(type) {
  const schemaPath = path.join(__dirname, 'schemas', `uxm-${type}.schema.json`);

  if (!fs.existsSync(schemaPath)) {
    console.error(`Error: Schema file not found: ${schemaPath}`);
    process.exit(2);
  }

  try {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    return JSON.parse(schemaContent);
  } catch (error) {
    console.error(`Error: Failed to parse schema: ${error.message}`);
    process.exit(2);
  }
}

// Compile schema with AJV
function compileSchema(schema) {
  try {
    const ajv = new Ajv({ allErrors: true, strict: false });
    const validator = ajv.compile(schema);
    return validator;
  } catch (error) {
    console.error(`Error: Failed to compile schema: ${error.message}`);
    process.exit(3);
  }
}

// Extract schema statistics
function extractStats(schema) {
  const required = schema.required || [];
  const properties = schema.properties || {};
  const allProps = Object.keys(properties);
  const optional = allProps.filter(p => !required.includes(p));

  // Extract component types from enum
  const componentTypes = properties.type?.enum || [];

  return {
    requiredFields: required.length,
    optionalFields: optional.length,
    totalFields: allProps.length,
    componentTypes: componentTypes.length
  };
}

// Format output for interactive mode
function formatInteractive(schema, stats) {
  console.log('┌─────────────────────────────────────────┐');
  console.log('│ uxscii Component Schema                  │');
  console.log('├─────────────────────────────────────────┤');
  console.log(`│ Draft: 7                                 │`);
  console.log(`│ Required fields: ${stats.requiredFields.toString().padEnd(23)}│`);
  console.log(`│ Optional fields: ${stats.optionalFields.toString().padEnd(23)}│`);
  console.log(`│ Component types: ${stats.componentTypes.toString().padEnd(23)}│`);
  console.log('│                                          │');
  console.log('│ Validation rules:                        │');
  console.log('│  • ID pattern: ^[a-z0-9-]+$             │');
  console.log('│  • Version: semantic (X.Y.Z)             │');
  console.log('│  • ASCII: max 120×50                     │');
  console.log('└─────────────────────────────────────────┘');
}

// Format output for programmatic mode
function formatProgrammatic(schema, stats, schemaPath) {
  const output = {
    schema: schema,
    path: schemaPath,
    compiled: true,
    stats: stats
  };
  console.log(JSON.stringify(output, null, 2));
}

// Main execution
function main() {
  const options = parseArgs();

  // Validate type
  if (!['component', 'screen'].includes(options.type)) {
    console.error('Error: Invalid type. Must be "component" or "screen"');
    process.exit(1);
  }

  // Load schema
  const schema = loadSchemaFile(options.type);
  const schemaPath = path.join(__dirname, 'schemas', `uxm-${options.type}.schema.json`);

  // Extract stats
  const stats = extractStats(schema);

  // Output based on mode
  if (options.interactive) {
    formatInteractive(schema, stats);
  } else if (options.statsOnly) {
    console.log(JSON.stringify(stats, null, 2));
  } else if (options.format === 'json') {
    formatProgrammatic(schema, stats, schemaPath);
  } else {
    formatInteractive(schema, stats);
  }

  process.exit(0);
}

// Module exports for require()
if (require.main === module) {
  main();
} else {
  module.exports = {
    loadSchemaFile,
    compileSchema,
    extractStats,
    validator: (data, type = 'component') => {
      const schema = loadSchemaFile(type);
      const validate = compileSchema(schema);
      return validate(data);
    }
  };
}
```

**Step 2: Test the script manually**

```bash
cd skills/fluxwing-core-utils
node load-schema.js --type component --format json
```

Expected: JSON output with schema, path, compiled: true, stats

**Step 3: Test interactive mode**

```bash
node load-schema.js --interactive
```

Expected: ASCII box with schema info

**Step 4: Test stats-only mode**

```bash
node load-schema.js --stats-only
```

Expected: JSON with requiredFields, optionalFields, totalFields, componentTypes

**Step 5: Commit**

```bash
git add skills/fluxwing-core-utils/load-schema.js
git commit -m "feat: add load-schema.js for centralized schema operations

- Dual-mode support (interactive + programmatic)
- Module exports for require() usage
- Schema compilation with AJV
- Statistics extraction"
```

---

### Task 3: Create inventory.js Script

**Files:**
- Create: `skills/fluxwing-core-utils/inventory.js`

**Step 1: Write the script**

Create: `skills/fluxwing-core-utils/inventory.js`

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    type: null,
    format: 'text',
    interactive: false,
    filter: null,
    componentType: null
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--type':
        options.type = args[++i];
        break;
      case '--format':
        options.format = args[++i];
        break;
      case '--interactive':
        options.interactive = true;
        break;
      case '--filter':
        options.filter = args[++i];
        break;
      case '--component-type':
        options.componentType = args[++i];
        break;
      case '--help':
        printHelp();
        process.exit(0);
    }
  }

  if (!options.type) {
    console.error('Error: --type is required');
    process.exit(1);
  }

  return options;
}

function printHelp() {
  console.log(`
Usage: node inventory.js [OPTIONS]

Options:
  --type <components|screens>    Type of inventory (required)
  --format <json|text>           Output format (default: text)
  --interactive                  Enable interactive mode
  --filter <pattern>             Filter by ID pattern (regex)
  --component-type <type>        Filter by component type

Exit Codes:
  0  Success
  1  Invalid arguments
  2  No items found
  3  File system error
`);
}

// Find skill root by searching for fluxwing-component-creator
function findSkillRoot() {
  // Try relative path from core-utils
  const relativeSkillRoot = path.join(__dirname, '..');
  const creatorPath = path.join(relativeSkillRoot, 'fluxwing-component-creator');

  if (fs.existsSync(creatorPath)) {
    return relativeSkillRoot;
  }

  // Fallback: search upward
  let current = __dirname;
  for (let i = 0; i < 5; i++) {
    current = path.dirname(current);
    const skillPath = path.join(current, 'skills');
    const creatorPath = path.join(skillPath, 'fluxwing-component-creator');
    if (fs.existsSync(creatorPath)) {
      return skillPath;
    }
  }

  console.error('Error: Could not find skill root directory');
  process.exit(3);
}

// Read UXM file metadata without full parse
function readUxmMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    return {
      path: filePath,
      id: data.id || path.basename(filePath, '.uxm'),
      type: data.type || 'unknown',
      version: data.version || '0.0.0'
    };
  } catch (error) {
    console.error(`Warning: Failed to read ${filePath}: ${error.message}`);
    return null;
  }
}

// Find all .uxm files in directory
function findUxmFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = [];

  function walk(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.uxm')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Warning: Failed to read directory ${dir}: ${error.message}`);
    }
  }

  walk(directory);
  return files;
}

// Apply filters to inventory items
function applyFilters(items, options) {
  let filtered = items;

  // Filter by ID pattern
  if (options.filter) {
    const regex = new RegExp(options.filter);
    filtered = filtered.filter(item => regex.test(item.id));
  }

  // Filter by component type
  if (options.componentType) {
    filtered = filtered.filter(item => item.type === options.componentType);
  }

  return filtered;
}

// Gather inventory
function gatherInventory(options) {
  const inventory = {
    bundled: [],
    components: [],
    library: [],
    screens: []
  };

  const skillRoot = findSkillRoot();
  const projectRoot = process.cwd();

  if (options.type === 'components') {
    // Bundled templates
    const templatesPath = path.join(skillRoot, 'fluxwing-component-creator', 'templates');
    const bundledFiles = findUxmFiles(templatesPath);
    inventory.bundled = bundledFiles.map(readUxmMetadata).filter(Boolean);

    // Project components
    const componentsPath = path.join(projectRoot, 'fluxwing', 'components');
    const componentFiles = findUxmFiles(componentsPath);
    inventory.components = componentFiles.map(readUxmMetadata).filter(Boolean);

    // Project library
    const libraryPath = path.join(projectRoot, 'fluxwing', 'library');
    const libraryFiles = findUxmFiles(libraryPath);
    inventory.library = libraryFiles.map(readUxmMetadata).filter(Boolean);

  } else if (options.type === 'screens') {
    // Project screens
    const screensPath = path.join(projectRoot, 'fluxwing', 'screens');
    const screenFiles = findUxmFiles(screensPath);
    inventory.screens = screenFiles.map(readUxmMetadata).filter(Boolean);
  }

  // Apply filters
  inventory.bundled = applyFilters(inventory.bundled, options);
  inventory.components = applyFilters(inventory.components, options);
  inventory.library = applyFilters(inventory.library, options);
  inventory.screens = applyFilters(inventory.screens, options);

  return inventory;
}

// Format interactive output
function formatInteractive(inventory, type) {
  if (type === 'components') {
    console.log('┌─────────────────────────────────────────┐');
    console.log('│ Component Inventory                      │');
    console.log('├─────────────────────────────────────────┤');
    console.log(`│ Bundled Templates:      ${inventory.bundled.length.toString().padEnd(17)}│`);
    console.log(`│ Project Components:      ${inventory.components.length.toString().padEnd(16)}│`);
    console.log(`│ Project Library:         ${inventory.library.length.toString().padEnd(16)}│`);
    console.log(`│ Total:                  ${(inventory.bundled.length + inventory.components.length + inventory.library.length).toString().padEnd(17)}│`);
    console.log('└─────────────────────────────────────────┘');
  } else {
    console.log('┌─────────────────────────────────────────┐');
    console.log('│ Screen Inventory                         │');
    console.log('├─────────────────────────────────────────┤');
    console.log(`│ Project Screens:         ${inventory.screens.length.toString().padEnd(16)}│`);
    console.log('└─────────────────────────────────────────┘');
  }
}

// Format programmatic output
function formatProgrammatic(inventory) {
  console.log(JSON.stringify(inventory, null, 2));
}

// Main execution
function main() {
  const options = parseArgs();

  // Validate type
  if (!['components', 'screens'].includes(options.type)) {
    console.error('Error: Invalid type. Must be "components" or "screens"');
    process.exit(1);
  }

  // Gather inventory
  const inventory = gatherInventory(options);

  // Check if empty
  const total = options.type === 'components'
    ? inventory.bundled.length + inventory.components.length + inventory.library.length
    : inventory.screens.length;

  if (total === 0) {
    if (options.format === 'json') {
      console.log(JSON.stringify(inventory, null, 2));
    } else {
      console.log(`No ${options.type} found.`);
    }
    process.exit(2);
  }

  // Output
  if (options.interactive || options.format === 'text') {
    formatInteractive(inventory, options.type);
  } else {
    formatProgrammatic(inventory);
  }

  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = {
  gatherInventory,
  findUxmFiles,
  readUxmMetadata
};
```

**Step 2: Test with empty project**

```bash
cd /workspaces/uxm-tools
node skills/fluxwing-core-utils/inventory.js --type components --format json
```

Expected: JSON with bundled templates (if they exist), empty components/library arrays

**Step 3: Test interactive mode**

```bash
node skills/fluxwing-core-utils/inventory.js --type components --interactive
```

Expected: ASCII box showing inventory counts

**Step 4: Test filters**

```bash
node skills/fluxwing-core-utils/inventory.js --type components --filter "^button" --format json
```

Expected: Only components with IDs starting with "button"

**Step 5: Commit**

```bash
git add skills/fluxwing-core-utils/inventory.js
git commit -m "feat: add inventory.js for component/screen discovery

- Searches bundled templates, components, library, screens
- Dual-mode support (interactive + programmatic)
- Filter by ID pattern and component type
- Fast metadata reading (no full file parse)"
```

---

### Task 4: Create read-pair.js Script

**Files:**
- Create: `skills/fluxwing-core-utils/read-pair.js`

**Step 1: Write the script**

Create: `skills/fluxwing-core-utils/read-pair.js`

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { gatherInventory } = require('./inventory.js');
const { loadSchemaFile, compileSchema } = require('./load-schema.js');

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    id: null,
    path: null,
    format: 'text',
    interactive: false,
    validate: true
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--id':
        options.id = args[++i];
        break;
      case '--path':
        options.path = args[++i];
        break;
      case '--format':
        options.format = args[++i];
        break;
      case '--interactive':
        options.interactive = true;
        break;
      case '--validate':
        options.validate = args[++i] !== 'false';
        break;
      case '--help':
        printHelp();
        process.exit(0);
    }
  }

  if (!options.id && !options.path) {
    console.error('Error: Either --id or --path is required');
    process.exit(1);
  }

  return options;
}

function printHelp() {
  console.log(`
Usage: node read-pair.js [OPTIONS]

Options:
  --id <component-id>            Component ID to read (required unless --path)
  --path <directory>             Explicit directory path
  --format <json|text>           Output format (default: text)
  --interactive                  Enable interactive mode
  --validate                     Run schema validation (default: true)
  --help                         Show this help message

Exit Codes:
  0  Success
  1  Invalid arguments
  2  Component not found
  3  File read error
  4  Validation failed
`);
}

// Find component by ID using inventory
function findComponentById(id) {
  const inventory = gatherInventory({ type: 'components', format: 'json' });

  // Search in order: components → library → bundled
  const allComponents = [
    ...inventory.components,
    ...inventory.library,
    ...inventory.bundled
  ];

  const found = allComponents.find(item => item.id === id);

  if (!found) {
    return null;
  }

  return path.dirname(found.path);
}

// Read .uxm and .md files
function readPair(directory, id) {
  const uxmPath = path.join(directory, `${id}.uxm`);
  const mdPath = path.join(directory, `${id}.md`);

  if (!fs.existsSync(uxmPath)) {
    console.error(`Error: File not found: ${uxmPath}`);
    process.exit(2);
  }

  if (!fs.existsSync(mdPath)) {
    console.error(`Error: File not found: ${mdPath}`);
    process.exit(2);
  }

  try {
    const uxmContent = fs.readFileSync(uxmPath, 'utf8');
    const mdContent = fs.readFileSync(mdPath, 'utf8');
    const uxmData = JSON.parse(uxmContent);

    return {
      uxm: uxmData,
      md: mdContent,
      paths: {
        uxm: uxmPath,
        md: mdPath
      }
    };
  } catch (error) {
    console.error(`Error: Failed to read files: ${error.message}`);
    process.exit(3);
  }
}

// Validate component
function validateComponent(uxmData) {
  const schema = loadSchemaFile('component');
  const validate = compileSchema(schema);
  const isValid = validate(uxmData);

  return {
    valid: isValid,
    errors: validate.errors || []
  };
}

// Check template variable consistency
function checkVariableConsistency(uxmData, mdContent) {
  const declaredVars = Object.keys(uxmData.props || {});

  // Find all {{variable}} patterns in markdown
  const varPattern = /\{\{(\w+)\}\}/g;
  const usedVars = new Set();
  let match;

  while ((match = varPattern.exec(mdContent)) !== null) {
    usedVars.add(match[1]);
  }

  const usedVarArray = Array.from(usedVars);

  return {
    declared: declaredVars,
    used: usedVarArray,
    consistent: usedVarArray.every(v => declaredVars.includes(v))
  };
}

// Format interactive output
function formatInteractive(data, validation, variables) {
  const states = data.uxm.behavior?.states
    ? Object.keys(data.uxm.behavior.states).join(', ')
    : 'default';

  console.log('┌─────────────────────────────────────────┐');
  console.log(`│ Component: ${data.uxm.id.padEnd(30)}│`);
  console.log('├─────────────────────────────────────────┤');
  console.log(`│ Type: ${data.uxm.type.padEnd(36)}│`);
  console.log(`│ Version: ${data.uxm.version.padEnd(33)}│`);
  console.log(`│ Template variables: ${variables.declared.length.toString().padEnd(20)}│`);
  console.log(`│ States: ${states.padEnd(34)}│`);
  console.log(`│ Files: ✓ .uxm  ✓ .md${' '.padEnd(21)}│`);

  if (validation) {
    const validStr = validation.valid ? '✓ Valid' : '✗ Invalid';
    console.log(`│ Validation: ${validStr.padEnd(28)}│`);
  }

  console.log('└─────────────────────────────────────────┘');
}

// Format programmatic output
function formatProgrammatic(data, validation, variables) {
  const output = {
    ...data,
    valid: validation ? validation.valid : null,
    validationErrors: validation && !validation.valid ? validation.errors : [],
    variables: variables
  };

  console.log(JSON.stringify(output, null, 2));
}

// Main execution
function main() {
  const options = parseArgs();

  // Find component directory
  let directory;
  if (options.path) {
    directory = options.path;
  } else {
    directory = findComponentById(options.id);
    if (!directory) {
      console.error(`Error: Component not found: ${options.id}`);
      process.exit(2);
    }
  }

  // Determine ID
  const id = options.id || path.basename(directory);

  // Read files
  const data = readPair(directory, id);

  // Validate if requested
  let validation = null;
  if (options.validate) {
    validation = validateComponent(data.uxm);
    if (!validation.valid) {
      if (options.format === 'json') {
        formatProgrammatic(data, validation, null);
      } else {
        console.error('Error: Validation failed');
        console.error(JSON.stringify(validation.errors, null, 2));
      }
      process.exit(4);
    }
  }

  // Check variable consistency
  const variables = checkVariableConsistency(data.uxm, data.md);

  // Output
  if (options.interactive || options.format === 'text') {
    formatInteractive(data, validation, variables);
  } else {
    formatProgrammatic(data, validation, variables);
  }

  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = {
  readPair,
  validateComponent,
  checkVariableConsistency
};
```

**Step 2: Create test component for validation**

Create: `/tmp/test-button.uxm`

```json
{
  "id": "test-button",
  "type": "button",
  "version": "1.0.0",
  "metadata": {
    "created": "2025-11-16T00:00:00Z",
    "modified": "2025-11-16T00:00:00Z",
    "author": "test"
  },
  "props": {
    "label": { "type": "string", "default": "Click" }
  },
  "ascii": {
    "width": 10,
    "height": 3
  }
}
```

Create: `/tmp/test-button.md`

```markdown
┌────────┐
│{{label}}│
└────────┘
```

**Step 3: Test reading the test component**

```bash
mkdir -p /tmp/test-component
cp /tmp/test-button.uxm /tmp/test-component/
cp /tmp/test-button.md /tmp/test-component/
node skills/fluxwing-core-utils/read-pair.js --path /tmp/test-component --id test-button --format json
```

Expected: JSON with uxm, md, paths, valid: true, variables

**Step 4: Test interactive mode**

```bash
node skills/fluxwing-core-utils/read-pair.js --path /tmp/test-component --id test-button --interactive
```

Expected: ASCII box with component info

**Step 5: Commit**

```bash
git add skills/fluxwing-core-utils/read-pair.js
git commit -m "feat: add read-pair.js for atomic .uxm + .md reading

- Finds components via inventory or explicit path
- Validates against schema
- Checks template variable consistency
- Dual-mode support (interactive + programmatic)"
```

---

### Task 5: Create write-pair.js Script

**Files:**
- Create: `skills/fluxwing-core-utils/write-pair.js`

**Step 1: Write the script**

Create: `skills/fluxwing-core-utils/write-pair.js`

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { loadSchemaFile, compileSchema } = require('./load-schema.js');
const { checkVariableConsistency } = require('./read-pair.js');

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    uxmFile: null,
    mdFile: null,
    output: './fluxwing/components/',
    format: 'text',
    interactive: false,
    skipValidation: false,
    overwrite: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--uxm-file':
        options.uxmFile = args[++i];
        break;
      case '--md-file':
        options.mdFile = args[++i];
        break;
      case '--output':
        options.output = args[++i];
        break;
      case '--format':
        options.format = args[++i];
        break;
      case '--interactive':
        options.interactive = true;
        break;
      case '--skip-validation':
        options.skipValidation = true;
        break;
      case '--overwrite':
        options.overwrite = true;
        break;
      case '--help':
        printHelp();
        process.exit(0);
    }
  }

  if (!options.interactive && (!options.uxmFile || !options.mdFile)) {
    console.error('Error: --uxm-file and --md-file are required');
    process.exit(1);
  }

  return options;
}

function printHelp() {
  console.log(`
Usage: node write-pair.js [OPTIONS]

Options:
  --uxm-file <path>              Path to .uxm file to write (required)
  --md-file <path>               Path to .md file to write (required)
  --output <directory>           Output directory (default: ./fluxwing/components/)
  --format <json|text>           Output format (default: text)
  --interactive                  Enable interactive mode
  --skip-validation              Skip schema validation
  --overwrite                    Overwrite existing files without prompting
  --help                         Show this help message

Exit Codes:
  0  Success
  1  Invalid arguments
  2  Input file not found
  3  Validation failed
  4  Write failed (rollback performed)
  5  Overwrite prevented (file exists)
`);
}

// Validate component data
function validateComponent(uxmData) {
  const schema = loadSchemaFile('component');
  const validate = compileSchema(schema);
  const isValid = validate(uxmData);

  return {
    valid: isValid,
    errors: validate.errors || []
  };
}

// Write files atomically
function writePairAtomic(uxmPath, mdPath, uxmContent, mdContent, overwrite) {
  // Check if files exist
  if (!overwrite && (fs.existsSync(uxmPath) || fs.existsSync(mdPath))) {
    console.error(`Error: Files already exist. Use --overwrite to replace.`);
    console.error(`  ${uxmPath}`);
    console.error(`  ${mdPath}`);
    process.exit(5);
  }

  // Create output directory if needed
  const dir = path.dirname(uxmPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write to temp files first
  const uxmTemp = `${uxmPath}.tmp`;
  const mdTemp = `${mdPath}.tmp`;

  try {
    fs.writeFileSync(uxmTemp, uxmContent, 'utf8');
    fs.writeFileSync(mdTemp, mdContent, 'utf8');

    // Atomic rename
    fs.renameSync(uxmTemp, uxmPath);
    fs.renameSync(mdTemp, mdPath);

    return {
      success: true,
      paths: {
        uxm: uxmPath,
        md: mdPath
      }
    };
  } catch (error) {
    // Rollback on failure
    if (fs.existsSync(uxmTemp)) fs.unlinkSync(uxmTemp);
    if (fs.existsSync(mdTemp)) fs.unlinkSync(mdTemp);

    console.error(`Error: Failed to write files: ${error.message}`);
    process.exit(4);
  }
}

// Format interactive output
function formatInteractive(result, id, version) {
  console.log(`✓ Validated ${id}.uxm`);
  console.log(`✓ Wrote ${result.paths.uxm}`);
  console.log(`✓ Wrote ${result.paths.md}`);
}

// Format programmatic output
function formatProgrammatic(result, id, version) {
  const output = {
    success: result.success,
    paths: result.paths,
    validated: true,
    id: id,
    version: version
  };

  console.log(JSON.stringify(output, null, 2));
}

// Main execution
function main() {
  const options = parseArgs();

  // Read input files
  if (!fs.existsSync(options.uxmFile)) {
    console.error(`Error: File not found: ${options.uxmFile}`);
    process.exit(2);
  }

  if (!fs.existsSync(options.mdFile)) {
    console.error(`Error: File not found: ${options.mdFile}`);
    process.exit(2);
  }

  const uxmContent = fs.readFileSync(options.uxmFile, 'utf8');
  const mdContent = fs.readFileSync(options.mdFile, 'utf8');

  let uxmData;
  try {
    uxmData = JSON.parse(uxmContent);
  } catch (error) {
    console.error(`Error: Invalid JSON in ${options.uxmFile}: ${error.message}`);
    process.exit(2);
  }

  // Validate if not skipped
  if (!options.skipValidation) {
    const validation = validateComponent(uxmData);
    if (!validation.valid) {
      console.error('Error: Validation failed');
      console.error(JSON.stringify(validation.errors, null, 2));
      process.exit(3);
    }

    // Check variable consistency
    const variables = checkVariableConsistency(uxmData, mdContent);
    if (!variables.consistent) {
      console.error('Error: Template variables inconsistent');
      console.error(`Declared: ${variables.declared.join(', ')}`);
      console.error(`Used: ${variables.used.join(', ')}`);
      process.exit(3);
    }
  }

  // Determine output paths
  const id = uxmData.id;
  const version = uxmData.version;
  const uxmPath = path.join(options.output, `${id}.uxm`);
  const mdPath = path.join(options.output, `${id}.md`);

  // Write files atomically
  const result = writePairAtomic(uxmPath, mdPath, uxmContent, mdContent, options.overwrite);

  // Output
  if (options.interactive || options.format === 'text') {
    formatInteractive(result, id, version);
  } else {
    formatProgrammatic(result, id, version);
  }

  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = {
  writePairAtomic,
  validateComponent
};
```

**Step 2: Test writing test component**

```bash
node skills/fluxwing-core-utils/write-pair.js \
  --uxm-file /tmp/test-button.uxm \
  --md-file /tmp/test-button.md \
  --output /tmp/test-output \
  --format json
```

Expected: Success JSON with paths

**Step 3: Verify files were written**

```bash
ls -la /tmp/test-output/
cat /tmp/test-output/test-button.uxm
cat /tmp/test-output/test-button.md
```

Expected: Files exist and match input

**Step 4: Test overwrite prevention**

```bash
node skills/fluxwing-core-utils/write-pair.js \
  --uxm-file /tmp/test-button.uxm \
  --md-file /tmp/test-button.md \
  --output /tmp/test-output \
  --format json
```

Expected: Exit code 5, error about files existing

**Step 5: Test overwrite flag**

```bash
node skills/fluxwing-core-utils/write-pair.js \
  --uxm-file /tmp/test-button.uxm \
  --md-file /tmp/test-button.md \
  --output /tmp/test-output \
  --overwrite \
  --format json
```

Expected: Success, files overwritten

**Step 6: Commit**

```bash
git add skills/fluxwing-core-utils/write-pair.js
git commit -m "feat: add write-pair.js for atomic .uxm + .md writing

- Validates against schema before writing
- Checks template variable consistency
- Atomic operation with rollback on failure
- Overwrite protection
- Dual-mode support (interactive + programmatic)"
```

---

### Task 6: Refactor Existing Validators to Use load-schema.js

**Files:**
- Modify: `skills/fluxwing-core-utils/validate-component.js`

**Step 1: Update validate-component.js to use load-schema.js**

Modify: `skills/fluxwing-core-utils/validate-component.js`

Find the section that loads the schema (likely near the top):

```javascript
// OLD CODE (remove this)
const schemaPath = path.join(__dirname, 'schemas', 'uxm-component.schema.json');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');
const schema = JSON.parse(schemaContent);
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

// NEW CODE (add this)
const { loadSchemaFile, compileSchema } = require('./load-schema.js');
const schema = loadSchemaFile('component');
const validate = compileSchema(schema);
```

**Step 2: Test validate-component.js still works**

```bash
node skills/fluxwing-core-utils/validate-component.js /tmp/test-output/test-button.uxm
```

Expected: Validation passes

**Step 3: Update validate-screen.js similarly**

Modify: `skills/fluxwing-core-utils/validate-screen.js`

Apply the same refactoring as validate-component.js but use 'screen' type:

```javascript
const { loadSchemaFile, compileSchema } = require('./load-schema.js');
const schema = loadSchemaFile('screen');
const validate = compileSchema(schema);
```

**Step 4: Commit**

```bash
git add skills/fluxwing-core-utils/validate-component.js skills/fluxwing-core-utils/validate-screen.js
git commit -m "refactor: use load-schema.js in validators

Eliminates duplicate schema loading code and ensures
consistency across all validation operations."
```

---

### Task 7: Create Documentation for New Scripts

**Files:**
- Create: `skills/fluxwing-core-utils/docs/inventory-api.md`
- Create: `skills/fluxwing-core-utils/docs/file-io-api.md`
- Create: `skills/fluxwing-core-utils/docs/schema-api.md`

**Step 1: Create inventory-api.md**

Create: `skills/fluxwing-core-utils/docs/inventory-api.md`

```markdown
# Inventory API Documentation

## Overview

The `inventory.js` script provides unified component and screen discovery across bundled templates, project components, project library, and project screens.

## Usage

### Interactive Mode

```bash
node inventory.js --type components --interactive
```

Shows ASCII box with inventory counts.

### Programmatic Mode

```bash
node inventory.js --type components --format json
```

Returns JSON with full inventory data.

## CLI Options

- `--type <components|screens>` - Type of inventory (required)
- `--format <json|text>` - Output format (default: text)
- `--interactive` - Enable interactive mode
- `--filter <pattern>` - Filter by ID pattern (regex)
- `--component-type <type>` - Filter by component type

## Output Format

### JSON Output

```json
{
  "bundled": [
    {
      "path": "/path/to/template.uxm",
      "id": "button",
      "type": "button",
      "version": "1.0.0"
    }
  ],
  "components": [...],
  "library": [...],
  "screens": [...]
}
```

### Text Output

```
┌─────────────────────────────────────────┐
│ Component Inventory                      │
├─────────────────────────────────────────┤
│ Bundled Templates:      11 components    │
│ Project Components:      3 components    │
│ Project Library:         2 components    │
│ Total:                  16 components    │
└─────────────────────────────────────────┘
```

## Exit Codes

- `0` - Success
- `1` - Invalid arguments
- `2` - No items found
- `3` - File system error

## Module Usage

```javascript
const { gatherInventory, findUxmFiles, readUxmMetadata } = require('./inventory.js');

const inventory = gatherInventory({ type: 'components', format: 'json' });
console.log(inventory.components);
```

## Examples

### Find all buttons

```bash
node inventory.js --type components --filter "button" --format json
```

### Find all input components

```bash
node inventory.js --type components --component-type input --format json
```

### List all screens

```bash
node inventory.js --type screens --format json
```
```

**Step 2: Create file-io-api.md**

Create: `skills/fluxwing-core-utils/docs/file-io-api.md`

```markdown
# File I/O API Documentation

## Overview

The `read-pair.js` and `write-pair.js` scripts provide atomic operations for reading and writing .uxm + .md file pairs with validation.

## read-pair.js

### Usage

#### Interactive Mode

```bash
node read-pair.js --id submit-button --interactive
```

Shows ASCII box with component details.

#### Programmatic Mode

```bash
node read-pair.js --id submit-button --format json
```

Returns JSON with uxm data, md content, paths, and validation results.

### CLI Options

- `--id <component-id>` - Component ID to read (required unless --path)
- `--path <directory>` - Explicit directory path
- `--format <json|text>` - Output format (default: text)
- `--interactive` - Enable interactive mode
- `--validate` - Run schema validation (default: true)

### Output Format

```json
{
  "uxm": { /* component JSON */ },
  "md": "/* markdown content */",
  "paths": {
    "uxm": "./fluxwing/components/button.uxm",
    "md": "./fluxwing/components/button.md"
  },
  "valid": true,
  "variables": {
    "declared": ["label", "variant"],
    "used": ["label", "variant"],
    "consistent": true
  }
}
```

### Exit Codes

- `0` - Success
- `1` - Invalid arguments
- `2` - Component not found
- `3` - File read error
- `4` - Validation failed

## write-pair.js

### Usage

#### Programmatic Mode

```bash
node write-pair.js \
  --uxm-file /tmp/button.uxm \
  --md-file /tmp/button.md \
  --output ./fluxwing/components/ \
  --format json
```

Writes files atomically with validation.

### CLI Options

- `--uxm-file <path>` - Path to .uxm file (required)
- `--md-file <path>` - Path to .md file (required)
- `--output <directory>` - Output directory (default: ./fluxwing/components/)
- `--format <json|text>` - Output format (default: text)
- `--interactive` - Enable interactive mode
- `--skip-validation` - Skip schema validation
- `--overwrite` - Overwrite existing files without prompting

### Output Format

```json
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

### Exit Codes

- `0` - Success
- `1` - Invalid arguments
- `2` - Input file not found
- `3` - Validation failed
- `4` - Write failed (rollback performed)
- `5` - Overwrite prevented (file exists)

## Module Usage

```javascript
const { readPair } = require('./read-pair.js');
const { writePairAtomic } = require('./write-pair.js');

// Read component
const data = readPair('./fluxwing/components', 'button');

// Write component
const result = writePairAtomic(
  './fluxwing/components/new-button.uxm',
  './fluxwing/components/new-button.md',
  uxmContent,
  mdContent,
  false // overwrite
);
```
```

**Step 3: Create schema-api.md**

Create: `skills/fluxwing-core-utils/docs/schema-api.md`

```markdown
# Schema API Documentation

## Overview

The `load-schema.js` script provides centralized schema loading and compilation for validation operations.

## Usage

### Interactive Mode

```bash
node load-schema.js --type component --interactive
```

Shows ASCII box with schema information.

### Programmatic Mode

```bash
node load-schema.js --type component --format json
```

Returns JSON with full schema, path, and statistics.

## CLI Options

- `--type <component|screen>` - Schema type (default: component)
- `--format <json|text>` - Output format (default: text)
- `--interactive` - Enable interactive mode
- `--stats-only` - Return only schema statistics

## Output Format

### JSON Output

```json
{
  "schema": { /* full JSON schema */ },
  "path": "/path/to/schema.json",
  "compiled": true,
  "stats": {
    "requiredFields": 5,
    "optionalFields": 8,
    "totalFields": 13,
    "componentTypes": 35
  }
}
```

### Text Output

```
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

## Exit Codes

- `0` - Success
- `1` - Invalid arguments
- `2` - Schema file not found
- `3` - Schema compilation failed

## Module Usage

```javascript
const { loadSchemaFile, compileSchema, validator } = require('./load-schema.js');

// Load raw schema
const schema = loadSchemaFile('component');

// Compile schema
const validate = compileSchema(schema);

// Validate data
const isValid = validator(componentData, 'component');
if (!isValid) {
  console.error('Validation failed');
}
```

## Examples

### Get schema statistics

```bash
node load-schema.js --type component --stats-only
```

### View component schema interactively

```bash
node load-schema.js --type component --interactive
```

### Load screen schema

```bash
node load-schema.js --type screen --format json
```
```

**Step 4: Commit**

```bash
git add skills/fluxwing-core-utils/docs/
git commit -m "docs: add API documentation for new utility scripts

- inventory-api.md: Discovery operations
- file-io-api.md: Atomic read/write operations
- schema-api.md: Schema loading and validation"
```

---

## Phase 2: Update Skill References

### Task 8: Update fluxwing-component-creator References

**Files:**
- Modify: `skills/fluxwing-component-creator/SKILL.md`

**Step 1: Find all validator references**

```bash
grep -n "fluxwing-validator" skills/fluxwing-component-creator/SKILL.md
```

**Step 2: Replace all occurrences**

```bash
cd /workspaces/uxm-tools
sed -i 's/fluxwing-validator/fluxwing-core-utils/g' skills/fluxwing-component-creator/SKILL.md
```

**Step 3: Verify changes**

```bash
grep -n "fluxwing-core-utils" skills/fluxwing-component-creator/SKILL.md
```

Expected: All references now point to fluxwing-core-utils

**Step 4: Commit**

```bash
git add skills/fluxwing-component-creator/SKILL.md
git commit -m "refactor: update validator references in component-creator

Changed fluxwing-validator → fluxwing-core-utils"
```

---

### Task 9: Update Remaining Skills (5 skills)

**Files:**
- Modify: `skills/fluxwing-component-expander/SKILL.md`
- Modify: `skills/fluxwing-screen-scaffolder/SKILL.md`
- Modify: `skills/fluxwing-enhancer/SKILL.md`
- Modify: `skills/fluxwing-component-viewer/SKILL.md`
- Modify: `skills/fluxwing-library-browser/SKILL.md`

**Step 1: Batch replace across all skills**

```bash
cd /workspaces/uxm-tools/skills
for skill in fluxwing-component-expander fluxwing-screen-scaffolder fluxwing-enhancer fluxwing-component-viewer fluxwing-library-browser; do
  sed -i 's/fluxwing-validator/fluxwing-core-utils/g' "$skill/SKILL.md"
done
```

**Step 2: Verify all changes**

```bash
grep -r "fluxwing-validator" skills/
```

Expected: No results (all references updated)

**Step 3: Verify new references exist**

```bash
grep -r "fluxwing-core-utils" skills/ | grep -v "Binary"
```

Expected: Multiple matches across all skills

**Step 4: Commit**

```bash
git add skills/*/SKILL.md
git commit -m "refactor: update validator references in all skills

Changed fluxwing-validator → fluxwing-core-utils across:
- fluxwing-component-expander
- fluxwing-screen-scaffolder
- fluxwing-enhancer
- fluxwing-component-viewer
- fluxwing-library-browser"
```

---

## Phase 3: Integrate New Scripts

### Task 10: Integrate inventory.js into component-creator

**Files:**
- Modify: `skills/fluxwing-component-creator/SKILL.md`

**Step 1: Read current SKILL.md**

```bash
head -100 skills/fluxwing-component-creator/SKILL.md
```

**Step 2: Find bash inventory operations**

Look for patterns like:
- `find ./fluxwing/components -name "*.uxm"`
- `find {SKILL_ROOT}/templates -name "*.uxm"`
- Bash commands that list or search for components

**Step 3: Add inventory.js usage instructions**

Add this section after the skill description, before the workflow:

```markdown
## Pre-Creation Inventory Check

Before creating a new component, check if it already exists:

```bash
node {SKILL_ROOT}/../fluxwing-core-utils/inventory.js --type components --format json
```

This returns JSON with all existing components in bundled, components, and library categories.

If the component exists, offer to create a versioned copy (see copy-versioning.md).
```

**Step 4: Update agent prompt section**

Find the Task() call in SKILL.md and add inventory check to the prompt:

```javascript
Task({
  subagent_type: "general-purpose",
  description: "Create uxscii component",
  prompt: `You are a uxscii component designer.

Component requirements:
- Name: ${componentName}
- Type: ${componentType}

STEP 1: Check for existing components
Run: node {SKILL_ROOT}/../fluxwing-core-utils/inventory.js --type components --format json

If component exists, offer to create versioned copy.

STEP 2: Load schema
Run: node {SKILL_ROOT}/../fluxwing-core-utils/load-schema.js --type component --format json

STEP 3: Create component files in /tmp
Create /tmp/${componentName}.uxm (valid JSON)
Create /tmp/${componentName}.md (ASCII template)

STEP 4: Write files atomically
Run: node {SKILL_ROOT}/../fluxwing-core-utils/write-pair.js \\
  --uxm-file /tmp/${componentName}.uxm \\
  --md-file /tmp/${componentName}.md \\
  --output ./fluxwing/components/ \\
  --format json

This validates and writes both files atomically.`
})
```

**Step 5: Commit**

```bash
git add skills/fluxwing-component-creator/SKILL.md
git commit -m "feat: integrate inventory and write-pair into component-creator

- Pre-creation inventory check
- Atomic file writing with write-pair.js
- Schema loading via load-schema.js
- Eliminates bash file operations"
```

---

### Task 11: Integrate scripts into library-browser

**Files:**
- Modify: `skills/fluxwing-library-browser/SKILL.md`

**Step 1: Read current SKILL.md**

```bash
head -100 skills/fluxwing-library-browser/SKILL.md
```

**Step 2: Replace bash inventory with inventory.js**

Find sections with bash commands like:
- `find {SKILL_ROOT}/templates`
- `find ./fluxwing/components`
- `find ./fluxwing/library`

Replace with inventory.js call:

```markdown
## Browsing Components

To see all available components:

```bash
node {SKILL_ROOT}/../fluxwing-core-utils/inventory.js --type components --interactive
```

For programmatic access:

```bash
node {SKILL_ROOT}/../fluxwing-core-utils/inventory.js --type components --format json
```

This returns categorized inventory:
- `bundled`: Bundled templates from fluxwing-component-creator
- `components`: User-created components in ./fluxwing/components
- `library`: Customized components in ./fluxwing/library
```

**Step 3: Add filtering examples**

```markdown
## Filtering Components

### By ID pattern

```bash
node {SKILL_ROOT}/../fluxwing-core-utils/inventory.js \
  --type components \
  --filter "^button" \
  --format json
```

### By component type

```bash
node {SKILL_ROOT}/../fluxwing-core-utils/inventory.js \
  --type components \
  --component-type input \
  --format json
```
```

**Step 4: Commit**

```bash
git add skills/fluxwing-library-browser/SKILL.md
git commit -m "feat: integrate inventory.js into library-browser

- Replace bash file discovery with inventory.js
- Add filtering examples
- Simplify component browsing workflow"
```

---

### Task 12: Integrate scripts into component-viewer

**Files:**
- Modify: `skills/fluxwing-component-viewer/SKILL.md`

**Step 1: Read current SKILL.md**

```bash
head -100 skills/fluxwing-component-viewer/SKILL.md
```

**Step 2: Replace bash read operations with read-pair.js**

Find sections that read .uxm and .md files separately, replace with:

```markdown
## Viewing a Component

To view a specific component by ID:

```bash
node {SKILL_ROOT}/../fluxwing-core-utils/read-pair.js --id submit-button --interactive
```

This shows:
- Component metadata (type, version)
- Template variables
- States (default, hover, disabled, etc.)
- Validation status

For programmatic access:

```bash
node {SKILL_ROOT}/../fluxwing-core-utils/read-pair.js --id submit-button --format json
```

Returns complete component data with .uxm and .md content, paths, and validation results.
```

**Step 3: Update agent workflow**

```markdown
## Agent Workflow

1. Find component using inventory:
   ```bash
   node {SKILL_ROOT}/../fluxwing-core-utils/inventory.js --type components --format json
   ```

2. Read component details:
   ```bash
   node {SKILL_ROOT}/../fluxwing-core-utils/read-pair.js --id <component-id> --format json
   ```

3. Display to user in readable format
```

**Step 4: Commit**

```bash
git add skills/fluxwing-component-viewer/SKILL.md
git commit -m "feat: integrate read-pair.js into component-viewer

- Replace manual file reading with read-pair.js
- Atomic .uxm + .md reading with validation
- Simplified component viewing workflow"
```

---

### Task 13: Integrate scripts into component-expander

**Files:**
- Modify: `skills/fluxwing-component-expander/SKILL.md`

**Step 1: Update to use read-pair.js for reading**

```markdown
## Expanding Component States

To add states to a component:

1. Read existing component:
   ```bash
   node {SKILL_ROOT}/../fluxwing-core-utils/read-pair.js --id button --format json
   ```

2. Modify .uxm to add new state in behavior.states

3. Create new state variation in .md file

4. Write back using write-pair.js with --overwrite:
   ```bash
   node {SKILL_ROOT}/../fluxwing-core-utils/write-pair.js \
     --uxm-file /tmp/button.uxm \
     --md-file /tmp/button.md \
     --output ./fluxwing/components/ \
     --overwrite \
     --format json
   ```

Note: Component-expander uses in-place updates (no versioning).
```

**Step 2: Commit**

```bash
git add skills/fluxwing-component-expander/SKILL.md
git commit -m "feat: integrate read/write-pair into component-expander

- Use read-pair.js for atomic reading
- Use write-pair.js with --overwrite for in-place updates
- Maintains in-place update pattern (no versioning)"
```

---

### Task 14: Integrate scripts into screen-scaffolder

**Files:**
- Modify: `skills/fluxwing-screen-scaffolder/SKILL.md`

**Step 1: Add inventory check for components**

```markdown
## Component Discovery

Before scaffolding a screen, discover available components:

```bash
node {SKILL_ROOT}/../fluxwing-core-utils/inventory.js --type components --format json
```

Use the inventory to compose screen from existing components.
```

**Step 2: Add pre-scaffolding screen check**

```markdown
## Pre-Scaffolding Check

Check if screen already exists:

```bash
node {SKILL_ROOT}/../fluxwing-core-utils/inventory.js --type screens --format json
```

If screen exists, offer to create versioned copy.
```

**Step 3: Update agent workflow to use write-pair.js**

```markdown
## Agent Workflow

1. Check existing screens and components (inventory.js)
2. Create screen .uxm and .md files in /tmp
3. Create .rendered.md example in /tmp
4. Write screen files:
   ```bash
   node {SKILL_ROOT}/../fluxwing-core-utils/write-pair.js \
     --uxm-file /tmp/login-screen.uxm \
     --md-file /tmp/login-screen.md \
     --output ./fluxwing/screens/ \
     --format json
   ```
5. Copy .rendered.md manually (not part of atomic pair)
```

**Step 4: Commit**

```bash
git add skills/fluxwing-screen-scaffolder/SKILL.md
git commit -m "feat: integrate inventory and write-pair into screen-scaffolder

- Pre-scaffolding inventory checks
- Component discovery for composition
- Atomic screen file writing"
```

---

### Task 15: Integrate scripts into enhancer

**Files:**
- Modify: `skills/fluxwing-enhancer/SKILL.md`

**Step 1: Update to use read-pair.js**

```markdown
## Enhancing Components

To enhance a component from sketch to production fidelity:

1. Read existing component:
   ```bash
   node {SKILL_ROOT}/../fluxwing-core-utils/read-pair.js --id button --format json
   ```

2. Enhance ASCII art and metadata

3. Create versioned copy (see copy-versioning.md)

4. Write enhanced version:
   ```bash
   node {SKILL_ROOT}/../fluxwing-core-utils/write-pair.js \
     --uxm-file /tmp/button-v2.uxm \
     --md-file /tmp/button-v2.md \
     --output ./fluxwing/components/ \
     --format json
   ```

Note: Enhancer creates versioned copies, not in-place updates.
```

**Step 2: Commit**

```bash
git add skills/fluxwing-enhancer/SKILL.md
git commit -m "feat: integrate read/write-pair into enhancer

- Use read-pair.js for reading existing components
- Use write-pair.js for creating versioned enhancements
- Maintains copy-on-update pattern"
```

---

## Phase 4: Testing & Release

### Task 16: Create Integration Test Script

**Files:**
- Create: `scripts/test-core-utils.sh`

**Step 1: Write test script**

Create: `scripts/test-core-utils.sh`

```bash
#!/bin/bash
set -e

echo "================================"
echo "Testing Core Utils Integration"
echo "================================"

SKILL_ROOT="/workspaces/uxm-tools/skills/fluxwing-core-utils"
TEST_DIR="/tmp/core-utils-test"

# Clean up from previous runs
rm -rf "$TEST_DIR"
mkdir -p "$TEST_DIR"

echo ""
echo "Test 1: load-schema.js"
echo "----------------------"
node "$SKILL_ROOT/load-schema.js" --type component --stats-only
echo "✓ load-schema.js (stats-only)"

node "$SKILL_ROOT/load-schema.js" --type component --format json > "$TEST_DIR/schema.json"
echo "✓ load-schema.js (JSON output)"

echo ""
echo "Test 2: inventory.js"
echo "--------------------"
node "$SKILL_ROOT/inventory.js" --type components --format json > "$TEST_DIR/inventory.json"
echo "✓ inventory.js (components)"

node "$SKILL_ROOT/inventory.js" --type screens --format json > "$TEST_DIR/screens-inventory.json"
echo "✓ inventory.js (screens)"

echo ""
echo "Test 3: write-pair.js"
echo "---------------------"

# Create test component
cat > "$TEST_DIR/test-button.uxm" <<EOF
{
  "id": "test-button",
  "type": "button",
  "version": "1.0.0",
  "metadata": {
    "created": "2025-11-16T00:00:00Z",
    "modified": "2025-11-16T00:00:00Z",
    "author": "test"
  },
  "props": {
    "label": { "type": "string", "default": "Click" }
  },
  "ascii": {
    "width": 10,
    "height": 3
  }
}
EOF

cat > "$TEST_DIR/test-button.md" <<EOF
┌────────┐
│{{label}}│
└────────┘
EOF

node "$SKILL_ROOT/write-pair.js" \
  --uxm-file "$TEST_DIR/test-button.uxm" \
  --md-file "$TEST_DIR/test-button.md" \
  --output "$TEST_DIR/output" \
  --format json > "$TEST_DIR/write-result.json"

echo "✓ write-pair.js (new files)"

# Test overwrite prevention
if node "$SKILL_ROOT/write-pair.js" \
  --uxm-file "$TEST_DIR/test-button.uxm" \
  --md-file "$TEST_DIR/test-button.md" \
  --output "$TEST_DIR/output" \
  --format json 2>&1 | grep -q "already exist"; then
  echo "✓ write-pair.js (overwrite prevention)"
else
  echo "✗ write-pair.js (overwrite prevention FAILED)"
  exit 1
fi

# Test overwrite flag
node "$SKILL_ROOT/write-pair.js" \
  --uxm-file "$TEST_DIR/test-button.uxm" \
  --md-file "$TEST_DIR/test-button.md" \
  --output "$TEST_DIR/output" \
  --overwrite \
  --format json > /dev/null

echo "✓ write-pair.js (overwrite flag)"

echo ""
echo "Test 4: read-pair.js"
echo "--------------------"

node "$SKILL_ROOT/read-pair.js" \
  --path "$TEST_DIR/output" \
  --id test-button \
  --format json > "$TEST_DIR/read-result.json"

echo "✓ read-pair.js (by path)"

# Verify read output contains expected fields
if grep -q '"valid": true' "$TEST_DIR/read-result.json" && \
   grep -q '"id": "test-button"' "$TEST_DIR/read-result.json"; then
  echo "✓ read-pair.js (validation passed)"
else
  echo "✗ read-pair.js (validation FAILED)"
  exit 1
fi

echo ""
echo "Test 5: Validator Integration"
echo "------------------------------"

node "$SKILL_ROOT/validate-component.js" "$TEST_DIR/output/test-button.uxm"
echo "✓ validate-component.js (using load-schema.js)"

echo ""
echo "================================"
echo "All Tests Passed!"
echo "================================"

# Cleanup
rm -rf "$TEST_DIR"
```

**Step 2: Make script executable**

```bash
chmod +x scripts/test-core-utils.sh
```

**Step 3: Run tests**

```bash
./scripts/test-core-utils.sh
```

Expected: All tests pass

**Step 4: Commit**

```bash
git add scripts/test-core-utils.sh
git commit -m "test: add integration test script for core-utils

Tests all new scripts:
- load-schema.js (stats and JSON output)
- inventory.js (components and screens)
- write-pair.js (new, overwrite prevention, overwrite flag)
- read-pair.js (by path, validation)
- validate-component.js (using load-schema.js)"
```

---

### Task 17: Update Installation Scripts

**Files:**
- Modify: `scripts/install.sh`

**Step 1: Test install script with new name**

```bash
./scripts/install.sh --dry-run
```

Expected: Shows fluxwing-core-utils in skill list (not fluxwing-validator)

**Step 2: If verification errors occur, update install.sh**

Look for any hardcoded references to `fluxwing-validator`:

```bash
grep -n "fluxwing-validator" scripts/install.sh
```

Replace with `fluxwing-core-utils` if found.

**Step 3: Run actual installation**

```bash
./scripts/install.sh
```

Expected: All skills install successfully, including fluxwing-core-utils

**Step 4: Verify installed skills**

```bash
ls -la ~/.claude/skills/ | grep fluxwing
```

Expected: fluxwing-core-utils present, fluxwing-validator absent

**Step 5: Commit if changes made**

```bash
git add scripts/install.sh
git commit -m "fix: update install script for fluxwing-core-utils rename

Ensure installer recognizes new skill name."
```

---

### Task 18: Update Documentation

**Files:**
- Modify: `README.md`
- Modify: `INSTALL.md`
- Modify: `CLAUDE.md`

**Step 1: Update README.md**

Find references to fluxwing-validator, replace with fluxwing-core-utils:

```bash
sed -i 's/fluxwing-validator/fluxwing-core-utils/g' README.md
```

Add description of new utilities:

```markdown
### fluxwing-core-utils

Core utilities for validation, inventory, file I/O, and schema operations.

**Features:**
- Component and screen discovery (inventory.js)
- Atomic .uxm + .md file reading (read-pair.js)
- Atomic .uxm + .md file writing (write-pair.js)
- Centralized schema loading (load-schema.js)
- Component validation (validate-component.js)
- Screen validation (validate-screen.js)
- Batch validation (validate-batch.js)

**Dual-mode interface:** All scripts support interactive (user-facing) and programmatic (skill-to-skill) modes.
```

**Step 2: Update INSTALL.md**

```bash
sed -i 's/fluxwing-validator/fluxwing-core-utils/g' INSTALL.md
```

**Step 3: Update CLAUDE.md**

```bash
sed -i 's/fluxwing-validator/fluxwing-core-utils/g' CLAUDE.md
```

Add section about new utilities:

```markdown
### Core Utilities (fluxwing-core-utils)

The core-utils skill provides deterministic scripts for common operations:

**Inventory Discovery:**
```bash
node {SKILL_ROOT}/../fluxwing-core-utils/inventory.js --type components --format json
```

**Atomic File I/O:**
```bash
# Read
node {SKILL_ROOT}/../fluxwing-core-utils/read-pair.js --id button --format json

# Write
node {SKILL_ROOT}/../fluxwing-core-utils/write-pair.js \
  --uxm-file /tmp/button.uxm \
  --md-file /tmp/button.md \
  --output ./fluxwing/components/
```

**Schema Operations:**
```bash
node {SKILL_ROOT}/../fluxwing-core-utils/load-schema.js --type component --format json
```

All scripts support dual-mode operation (interactive + programmatic).
```

**Step 4: Commit**

```bash
git add README.md INSTALL.md CLAUDE.md
git commit -m "docs: update documentation for core-utils refactoring

- Rename fluxwing-validator → fluxwing-core-utils
- Document new utility scripts
- Add usage examples for inventory, file I/O, schema ops"
```

---

### Task 19: Version Bump and Release Preparation

**Files:**
- Modify: `package.json`
- Modify: `.claude-plugin/plugin.json`
- Modify: `.claude-plugin/marketplace.json`

**Step 1: Bump version to 0.1.0**

```bash
./scripts/bump-version.sh 0.1.0
```

Expected: All version files updated to 0.1.0

**Step 2: Verify version changes**

```bash
jq '.version' package.json .claude-plugin/plugin.json .claude-plugin/marketplace.json
```

Expected: All show "0.1.0"

**Step 3: Update marketplace.json description**

Modify: `.claude-plugin/marketplace.json`

Update the description to mention core-utils:

```json
{
  "name": "fluxwing-skills",
  "version": "0.1.0",
  "description": "AI-native UX design using uxscii standard. Includes core utilities for validation, inventory, and file operations.",
  ...
}
```

**Step 4: Create CHANGELOG entry**

Create: `CHANGELOG.md` (if doesn't exist)

```markdown
# Changelog

## [0.1.0] - 2025-11-16

### Added
- New `fluxwing-core-utils` skill (renamed from `fluxwing-validator`)
- `inventory.js` - Unified component/screen discovery
- `read-pair.js` - Atomic .uxm + .md reading with validation
- `write-pair.js` - Atomic .uxm + .md writing with validation
- `load-schema.js` - Centralized schema loading and compilation
- Dual-mode interface for all utility scripts (interactive + programmatic)
- API documentation for new utilities

### Changed
- Renamed `fluxwing-validator` to `fluxwing-core-utils`
- Refactored existing validators to use `load-schema.js`
- Updated all skills to reference `fluxwing-core-utils`
- Integrated new scripts into all skills (eliminates bash file operations)

### Migration Notes
- Update any custom scripts referencing `fluxwing-validator` to use `fluxwing-core-utils`
- No changes to component/screen file formats
- All existing .uxm files remain compatible

## [0.0.3] - Previous version
...
```

**Step 5: Commit**

```bash
git add package.json .claude-plugin/ CHANGELOG.md
git commit -m "chore: bump version to 0.1.0 for core-utils release

Major refactoring:
- Renamed fluxwing-validator → fluxwing-core-utils
- Added inventory, file I/O, and schema utilities
- Updated all skills to use new utilities"
```

---

### Task 20: Final Testing and Release

**Files:**
- N/A (testing and git operations)

**Step 1: Run full integration test**

```bash
./scripts/test-core-utils.sh
```

Expected: All tests pass

**Step 2: Test manual skill installation**

```bash
./scripts/install.sh --dry-run
```

Expected: No errors, all skills listed

```bash
./scripts/install.sh
```

Expected: Installation successful

**Step 3: Create release branch**

```bash
git checkout -b release/v0.1.0
```

**Step 4: Push release branch**

```bash
git push -u origin release/v0.1.0
```

**Step 5: Create annotated tag**

```bash
git tag -a v0.1.0 -m "Release v0.1.0: Core Utilities Refactoring

Major Changes:
- Renamed fluxwing-validator to fluxwing-core-utils
- Added inventory.js for component/screen discovery
- Added read-pair.js and write-pair.js for atomic file I/O
- Added load-schema.js for centralized schema operations
- Updated all 6 skills to use new utilities
- Dual-mode interface (interactive + programmatic)

Breaking Changes:
- fluxwing-validator skill renamed to fluxwing-core-utils
- Update any custom scripts referencing the old name

Migration:
- Run ./scripts/install.sh to install updated skills
- Update SKILL.md references if using custom skills"
```

**Step 6: Push tag**

```bash
git push origin v0.1.0
```

**Step 7: Create release package**

```bash
./scripts/package.sh --clean
```

Expected: Creates `dist/fluxwing-skills-v0.1.0.zip` and `.sha256` checksum

**Step 8: Verify package contents**

```bash
unzip -l dist/fluxwing-skills-v0.1.0.zip | grep fluxwing-core-utils
```

Expected: Shows all fluxwing-core-utils files

**Step 9: Final verification**

```bash
# Ensure no validator references remain
grep -r "fluxwing-validator" skills/ README.md CLAUDE.md INSTALL.md
```

Expected: No results

```bash
# Ensure core-utils references exist
grep -r "fluxwing-core-utils" skills/ README.md CLAUDE.md INSTALL.md | wc -l
```

Expected: Many results

**Step 10: Mark complete**

The implementation is complete! Release is ready.

---

## Summary

This plan implements the core-utils refactoring in 20 bite-sized tasks across 4 phases:

**Phase 1 (Tasks 1-7):** Rename skill, create 4 new scripts (inventory, read-pair, write-pair, load-schema), refactor validators, add docs

**Phase 2 (Tasks 8-9):** Update all 6 skills to reference fluxwing-core-utils instead of fluxwing-validator

**Phase 3 (Tasks 10-15):** Integrate new scripts into all skills, eliminating bash file operations

**Phase 4 (Tasks 16-20):** Testing, documentation updates, version bump, release preparation

Each task is 2-5 minutes of focused work with clear verification steps and immediate commits.

**Key Benefits:**
- **Performance:** Fast deterministic scripts replace slow bash operations
- **Consistency:** Single implementation eliminates duplicate code across skills
- **Context Efficiency:** Agents spend tokens on creative work, not file operations
- **User Features:** Dual-mode interface makes utilities accessible to users

**Next Steps:** Use @superpowers:executing-plans or @superpowers:subagent-driven-development to implement this plan.
