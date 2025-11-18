#!/usr/bin/env node

/**
 * read-pair.js - Atomic Component Reading
 *
 * Reads .uxm + .md files as a validated unit, ensuring consistency.
 * Supports dual-mode operation: interactive (human-friendly) and programmatic (JSON).
 *
 * Usage:
 *   node read-pair.js --id submit-button --format json
 *   node read-pair.js --interactive --id button
 *   node read-pair.js --path ./fluxwing/components/button --format json
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================================
// Configuration
// ============================================================================

const SKILL_ROOT = __dirname;
const PROJECT_ROOT = process.cwd();

// ============================================================================
// CLI Argument Parsing
// ============================================================================

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
    const arg = args[i];

    if (arg === '--id' && args[i + 1]) {
      options.id = args[++i];
    } else if (arg === '--path' && args[i + 1]) {
      options.path = args[++i];
    } else if (arg === '--format' && args[i + 1]) {
      options.format = args[++i];
    } else if (arg === '--interactive') {
      options.interactive = true;
      options.format = 'text';
    } else if (arg === '--validate') {
      options.validate = args[i + 1] === 'false' ? false : true;
      i++;
    } else if (arg === '--skip-validation') {
      options.validate = false;
    } else if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    }
  }

  // Validate arguments
  if (!options.id && !options.path) {
    console.error('Error: Either --id or --path must be provided.');
    process.exit(1);
  }

  // Validate format
  if (!['json', 'text'].includes(options.format)) {
    console.error(`Error: Invalid format "${options.format}". Must be "json" or "text".`);
    process.exit(1);
  }

  return options;
}

function printUsage() {
  console.log(`Usage: node read-pair.js [OPTIONS]

Options:
  --id <component-id>            Component ID to read (required unless --path)
  --path <directory>             Explicit directory path
  --format <json|text>           Output format (default: text)
  --interactive                  Enable interactive mode
  --validate                     Run schema validation (default: true)
  --skip-validation              Skip schema validation
  --help, -h                     Show this help message

Exit Codes:
  0  Success
  1  Invalid arguments
  2  Component not found
  3  File read error
  4  Validation failed`);
}

// ============================================================================
// Component Discovery
// ============================================================================

function findComponentPath(id) {
  // Use inventory.js to find component
  try {
    const inventoryPath = path.join(SKILL_ROOT, 'inventory.js');
    const result = execSync(
      `node "${inventoryPath}" --type components --format json`,
      { encoding: 'utf8', cwd: PROJECT_ROOT }
    );

    const inventory = JSON.parse(result);

    // Search in priority order: components > library > bundled
    const categories = ['components', 'library', 'bundled'];

    for (const category of categories) {
      if (inventory[category]) {
        const item = inventory[category].find(i => i.id === id);
        if (item) {
          // Return the full .uxm file path
          return item.path;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error searching inventory:', error.message);
    return null;
  }
}

// ============================================================================
// File Reading
// ============================================================================

function readPair(componentPath, options) {
  // componentPath can be either:
  // 1. A directory path (e.g., ./fluxwing/components/button)
  // 2. A full path to .uxm file (e.g., ./fluxwing/components/button.uxm)

  let actualUxmPath, actualMdPath;

  if (componentPath.endsWith('.uxm')) {
    // Full path to .uxm file provided
    actualUxmPath = componentPath;
    actualMdPath = componentPath.replace(/\.uxm$/, '.md');
  } else {
    // Directory path provided - construct file paths
    const baseName = path.basename(componentPath);
    actualUxmPath = path.join(componentPath, baseName + '.uxm');
    actualMdPath = path.join(componentPath, baseName + '.md');
  }

  const result = {
    uxm: null,
    md: null,
    paths: {
      uxm: actualUxmPath,
      md: actualMdPath
    },
    valid: false,
    variables: {
      declared: [],
      used: [],
      consistent: true
    }
  };

  // Read .uxm file
  try {
    if (!fs.existsSync(actualUxmPath)) {
      console.error(`Error: .uxm file not found: ${actualUxmPath}`);
      process.exit(2);
    }

    const uxmContent = fs.readFileSync(actualUxmPath, 'utf8');
    result.uxm = JSON.parse(uxmContent);
  } catch (error) {
    console.error(`Error reading .uxm file: ${error.message}`);
    process.exit(3);
  }

  // Read .md file
  try {
    if (!fs.existsSync(actualMdPath)) {
      console.error(`Error: .md file not found: ${actualMdPath}`);
      process.exit(2);
    }

    result.md = fs.readFileSync(actualMdPath, 'utf8');
  } catch (error) {
    console.error(`Error reading .md file: ${error.message}`);
    process.exit(3);
  }

  // Validate if requested
  if (options.validate) {
    result.valid = validateComponent(actualUxmPath);
    if (!result.valid) {
      process.exit(4);
    }
  } else {
    result.valid = true;
  }

  // Check template variable consistency
  result.variables = checkVariableConsistency(result.uxm, result.md);

  return result;
}

function validateComponent(uxmPath) {
  try {
    const validatorPath = path.join(SKILL_ROOT, 'validate-component.js');
    const schemaPath = path.join(
      SKILL_ROOT,
      '../fluxwing-component-creator/schemas/uxm-component.schema.json'
    );

    execSync(
      `node "${validatorPath}" "${uxmPath}" "${schemaPath}"`,
      { encoding: 'utf8', stdio: 'pipe' }
    );

    return true;
  } catch (error) {
    console.error('Validation failed:', error.message);
    return false;
  }
}

function checkVariableConsistency(uxm, md) {
  // Extract declared variables from .uxm
  const declared = uxm.templateVariables || [];

  // Extract used variables from .md (find all {{variableName}} patterns)
  const usedSet = new Set();
  const regex = /\{\{([a-zA-Z0-9_-]+)\}\}/g;
  let match;

  while ((match = regex.exec(md)) !== null) {
    usedSet.add(match[1]);
  }

  const used = Array.from(usedSet);

  // Check consistency: all used variables must be declared
  const consistent = used.every(varName => declared.includes(varName));

  return {
    declared,
    used,
    consistent
  };
}

// ============================================================================
// Output Formatting
// ============================================================================

function formatAsJson(result) {
  return JSON.stringify(result, null, 2);
}

function formatAsText(result, options) {
  const uxm = result.uxm;
  const states = uxm.states ? Object.keys(uxm.states).join(', ') : 'default';
  const uxmExists = result.paths.uxm && fs.existsSync(result.paths.uxm);
  const mdExists = result.paths.md && fs.existsSync(result.paths.md);

  if (options.interactive) {
    const varCount = result.variables.declared.length;
    return `┌─────────────────────────────────────────┐
│ Component: ${uxm.id.padEnd(27)} │
├─────────────────────────────────────────┤
│ Type: ${uxm.type.padEnd(34)} │
│ Version: ${uxm.version.padEnd(31)} │
│ Template variables: ${String(varCount).padEnd(20)} │
│ States: ${states.padEnd(32)} │
│ Files: ${uxmExists ? '✓' : '✗'} .uxm  ${mdExists ? '✓' : '✗'} .md${' '.repeat(20)} │
└─────────────────────────────────────────┘`;
  } else {
    return `Component: ${uxm.id}
  Type: ${uxm.type}
  Version: ${uxm.version}
  Template Variables: ${result.variables.declared.length}
  States: ${states}
  Files: ${uxmExists ? '✓' : '✗'} .uxm, ${mdExists ? '✓' : '✗'} .md
  Valid: ${result.valid ? '✓' : '✗'}
  Variables Consistent: ${result.variables.consistent ? '✓' : '✗'}`;
  }
}

// ============================================================================
// Main Execution
// ============================================================================

function main() {
  const options = parseArgs();

  // Determine component path
  let componentPath;

  if (options.path) {
    componentPath = options.path;
  } else if (options.id) {
    componentPath = findComponentPath(options.id);
    if (!componentPath) {
      console.error(`Error: Component "${options.id}" not found in inventory.`);
      process.exit(2);
    }
  }

  // Read the component pair
  const result = readPair(componentPath, options);

  // Output results
  if (options.format === 'json') {
    console.log(formatAsJson(result));
  } else {
    console.log(formatAsText(result, options));
  }

  process.exit(0);
}

// Run if executed directly
if (require.main === module) {
  main();
}

// Export for module usage
module.exports = {
  readPair,
  findComponentPath,
  checkVariableConsistency,
  validateComponent
};
