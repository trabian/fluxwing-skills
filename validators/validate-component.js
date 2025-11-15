#!/usr/bin/env node
/**
 * Fast, deterministic component validation using JSON Schema (ajv).
 * Validates .uxm component files against schema with uxscii-specific checks.
 *
 * Usage:
 *   node validate-component.js <component.uxm> <schema.json>
 *   node validate-component.js <component.uxm> <schema.json> --json
 *
 * Exit codes:
 *   0 - Valid component
 *   1 - Validation errors found
 *   2 - Missing dependencies or invalid arguments
 */

const fs = require('fs');
const path = require('path');

// Check for ajv dependency
let Ajv, addFormats;
try {
  Ajv = require('ajv');
  addFormats = require('ajv-formats');
} catch (error) {
  console.error('Error: ajv libraries not found');
  console.error('Install with: npm install ajv ajv-formats');
  process.exit(2);
}

/**
 * Validate a .uxm component file against the schema
 * @param {string} uxmFilePath - Path to .uxm file
 * @param {string} schemaPath - Path to JSON schema file
 * @returns {Object} Validation result object
 */
function validateComponent(uxmFilePath, schemaPath) {
  const result = {
    valid: true,
    errors: [],
    warnings: [],
    stats: {}
  };

  // Load component file
  let component;
  try {
    const uxmContent = fs.readFileSync(uxmFilePath, 'utf8');
    component = JSON.parse(uxmContent);
  } catch (error) {
    if (error.code === 'ENOENT') {
      result.valid = false;
      result.errors.push({
        path: [],
        message: `Component file not found: ${uxmFilePath}`,
        type: 'file_not_found'
      });
      return result;
    }
    if (error instanceof SyntaxError) {
      result.valid = false;
      result.errors.push({
        path: [],
        message: `Invalid JSON: ${error.message}`,
        type: 'json_error'
      });
      return result;
    }
    throw error;
  }

  // Load schema file
  let schema;
  try {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    schema = JSON.parse(schemaContent);
  } catch (error) {
    if (error.code === 'ENOENT') {
      result.valid = false;
      result.errors.push({
        path: [],
        message: `Schema file not found: ${schemaPath}`,
        type: 'file_not_found'
      });
      return result;
    }
    throw error;
  }

  // Validate against JSON schema
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);

  const validate = ajv.compile(schema);
  const valid = validate(component);

  if (!valid) {
    for (const error of validate.errors) {
      result.errors.push({
        path: error.instancePath.split('/').filter(p => p),
        message: error.message,
        type: 'schema_violation',
        details: error.params
      });
    }
    result.valid = false;
  }

  // uxscii-specific validation checks
  performUxsciiChecks(component, uxmFilePath, result);

  // Collect stats
  result.stats = {
    id: component.id,
    type: component.type,
    version: component.version,
    states: component.behavior?.states?.length || 0,
    props: Object.keys(component.props || {}).length,
    interactive: component.behavior?.interactions?.length > 0,
    hasAccessibility: !!component.behavior?.accessibility
  };

  return result;
}

/**
 * Perform uxscii-specific validation checks
 * @param {Object} component - Parsed component object
 * @param {string} uxmFilePath - Path to .uxm file
 * @param {Object} result - Result object to populate
 */
function performUxsciiChecks(component, uxmFilePath, result) {
  // Check 1: ASCII template file exists
  const mdFilePath = uxmFilePath.replace('.uxm', '.md');
  let mdContent = null;

  try {
    mdContent = fs.readFileSync(mdFilePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      result.valid = false;
      result.errors.push({
        path: ['ascii', 'templateFile'],
        message: `ASCII template file not found: ${mdFilePath}`,
        type: 'missing_file'
      });
      return; // Can't do variable checks without .md file
    }
  }

  // Check 2: Template variables match
  if (mdContent) {
    checkTemplateVariables(component, mdContent, result);
  }

  // Check 3: Accessibility requirements for interactive components
  checkAccessibility(component, result);

  // Check 4: ASCII dimensions
  checkAsciiDimensions(component, result);

  // Check 5: States have properties
  checkStates(component, result);
}

/**
 * Check that template variables in .md match those defined in .uxm
 * @param {Object} component - Component object
 * @param {string} mdContent - Content of .md file
 * @param {Object} result - Result object
 */
function checkTemplateVariables(component, mdContent, result) {
  // Extract {{variables}} from markdown template
  const varPattern = /\{\{(\w+)\}\}/g;
  const mdVars = new Set();
  let match;
  while ((match = varPattern.exec(mdContent)) !== null) {
    mdVars.add(match[1]);
  }

  // Get variables from .uxm (handle both array of strings and array of objects)
  const asciiVars = component.ascii?.variables || [];
  const uxmVars = new Set();

  if (asciiVars.length > 0) {
    if (typeof asciiVars[0] === 'object') {
      // Array of objects format: [{"name": "text", "type": "string"}]
      asciiVars.forEach(v => {
        if (v && typeof v === 'object' && v.name) {
          uxmVars.add(v.name);
        }
      });
    } else {
      // Array of strings format: ["text", "value"]
      asciiVars.forEach(v => uxmVars.add(v));
    }
  }

  // Check for variables in .md but not defined in .uxm
  const missing = [...mdVars].filter(v => !uxmVars.has(v));
  if (missing.length > 0) {
    result.warnings.push({
      path: ['ascii', 'variables'],
      message: `Variables in .md but not defined in .uxm: ${missing.sort().join(', ')}`,
      type: 'variable_mismatch'
    });
  }
}

/**
 * Check accessibility requirements
 * @param {Object} component - Component object
 * @param {Object} result - Result object
 */
function checkAccessibility(component, result) {
  const hasInteractions = component.behavior?.interactions?.length > 0;

  if (hasInteractions) {
    const accessibility = component.behavior?.accessibility || {};

    if (!accessibility.role) {
      result.warnings.push({
        path: ['behavior', 'accessibility', 'role'],
        message: 'Interactive component should have ARIA role',
        type: 'accessibility'
      });
    }

    if (!accessibility.focusable) {
      result.warnings.push({
        path: ['behavior', 'accessibility', 'focusable'],
        message: 'Interactive component should be focusable',
        type: 'accessibility'
      });
    }
  }
}

/**
 * Check ASCII dimensions are within recommended limits
 * @param {Object} component - Component object
 * @param {Object} result - Result object
 */
function checkAsciiDimensions(component, result) {
  const ascii = component.ascii || {};
  const width = ascii.width || 0;
  const height = ascii.height || 0;

  if (width > 120) {
    result.warnings.push({
      path: ['ascii', 'width'],
      message: `Width ${width} exceeds recommended max of 120`,
      type: 'dimensions'
    });
  }

  if (height > 50) {
    result.warnings.push({
      path: ['ascii', 'height'],
      message: `Height ${height} exceeds recommended max of 50`,
      type: 'dimensions'
    });
  }
}

/**
 * Check that states have properties defined
 * @param {Object} component - Component object
 * @param {Object} result - Result object
 */
function checkStates(component, result) {
  const states = component.behavior?.states || [];

  for (const state of states) {
    if (!state.properties || Object.keys(state.properties).length === 0) {
      result.warnings.push({
        path: ['behavior', 'states', state.name || 'unknown'],
        message: `State '${state.name || 'unknown'}' has no properties defined`,
        type: 'incomplete_state'
      });
    }
  }
}

/**
 * Print results in human-readable format
 * @param {Object} result - Validation result
 */
function printHumanReadable(result) {
  if (result.valid) {
    console.log(`✓ Valid: ${result.stats.id}`);
    console.log(`  Type: ${result.stats.type}`);
    console.log(`  Version: ${result.stats.version}`);
    console.log(`  States: ${result.stats.states}`);
    console.log(`  Props: ${result.stats.props}`);

    if (result.warnings.length > 0) {
      console.log(`\n  Warnings: ${result.warnings.length}`);
      result.warnings.forEach((warning, i) => {
        const pathStr = warning.path.join(' → ') || 'root';
        console.log(`    ${i + 1}. ${warning.message}`);
        console.log(`       Location: ${pathStr}`);
      });
    }
  } else {
    console.log(`✗ Validation Failed`);
    console.log('');

    const maxErrors = 5;
    result.errors.slice(0, maxErrors).forEach((error, i) => {
      const pathStr = error.path.join(' → ') || 'root';
      console.log(`  Error ${i + 1}: ${error.message}`);
      console.log(`  Location: ${pathStr}`);
      console.log('');
    });

    if (result.errors.length > maxErrors) {
      console.log(`  ... and ${result.errors.length - maxErrors} more errors`);
    }
  }
}

/**
 * Main entry point
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: validate-component.js <component.uxm> <schema.json> [--json]');
    console.log('');
    console.log('Validates a uxscii component against the JSON schema.');
    console.log('Returns JSON with validation results and exits 0 if valid, 1 if invalid.');
    console.log('');
    console.log('Options:');
    console.log('  --json    Output results as JSON instead of human-readable format');
    process.exit(2);
  }

  const uxmFile = args[0];
  const schemaFile = args[1];
  const jsonOutput = args.includes('--json');

  const result = validateComponent(uxmFile, schemaFile);

  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printHumanReadable(result);
  }

  process.exit(result.valid ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateComponent };
