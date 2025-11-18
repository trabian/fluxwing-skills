#!/usr/bin/env node

/**
 * load-schema.js - Centralized Schema Loading
 *
 * Loads and compiles JSON schemas, caches for reuse across operations.
 * Supports dual-mode operation: interactive (human-friendly), programmatic (JSON), and module import.
 *
 * CLI Usage:
 *   node load-schema.js --type component --format json
 *   node load-schema.js --interactive --type component
 *
 * Module Usage:
 *   const { validator, schema } = require('./load-schema.js');
 *   const isValid = validator(componentData);
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// ============================================================================
// Configuration
// ============================================================================

const SKILL_ROOT = __dirname;
const SCHEMA_DIR = path.join(SKILL_ROOT, '../fluxwing-component-creator/schemas');

const SCHEMA_PATHS = {
  component: path.join(SCHEMA_DIR, 'uxm-component.schema.json'),
  screen: path.join(SCHEMA_DIR, 'uxm-component.schema.json') // Using same schema for now
};

// Global validator cache
let validatorCache = {};

// ============================================================================
// Schema Loading
// ============================================================================

function loadSchema(type = 'component') {
  const schemaPath = SCHEMA_PATHS[type];

  if (!schemaPath) {
    throw new Error(`Invalid schema type: ${type}`);
  }

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found: ${schemaPath}`);
  }

  try {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const schema = JSON.parse(schemaContent);

    return {
      schema,
      path: schemaPath
    };
  } catch (error) {
    throw new Error(`Failed to load schema: ${error.message}`);
  }
}

function compileSchema(schema) {
  try {
    const ajv = new Ajv({ allErrors: true, verbose: true });
    addFormats(ajv);

    const validator = ajv.compile(schema);

    return validator;
  } catch (error) {
    throw new Error(`Failed to compile schema: ${error.message}`);
  }
}

function getValidator(type = 'component') {
  // Return cached validator if available
  if (validatorCache[type]) {
    return validatorCache[type];
  }

  // Load and compile schema
  const { schema } = loadSchema(type);
  const validator = compileSchema(schema);

  // Cache the validator
  validatorCache[type] = validator;

  return validator;
}

// ============================================================================
// Schema Statistics
// ============================================================================

function extractStats(schema) {
  const stats = {
    draft: schema.$schema || 'unknown',
    requiredFields: 0,
    optionalFields: 0,
    componentTypes: 0
  };

  // Count required fields
  if (schema.required) {
    stats.requiredFields = schema.required.length;
  }

  // Count optional fields (properties - required)
  if (schema.properties) {
    const totalProps = Object.keys(schema.properties).length;
    stats.optionalFields = totalProps - stats.requiredFields;
  }

  // Count component types (from enum in type property)
  if (schema.properties && schema.properties.type && schema.properties.type.enum) {
    stats.componentTypes = schema.properties.type.enum.length;
  }

  return stats;
}

function extractValidationRules(schema) {
  const rules = {};

  if (schema.properties) {
    // ID pattern
    if (schema.properties.id && schema.properties.id.pattern) {
      rules.idPattern = schema.properties.id.pattern;
    }

    // Version pattern
    if (schema.properties.version && schema.properties.version.pattern) {
      rules.versionPattern = schema.properties.version.pattern;
    }

    // ASCII dimensions
    if (schema.properties.ascii && schema.properties.ascii.properties) {
      const ascii = schema.properties.ascii.properties;
      if (ascii.width) {
        rules.asciiWidth = `${ascii.width.minimum || 1}-${ascii.width.maximum || 120}`;
      }
      if (ascii.height) {
        rules.asciiHeight = `${ascii.height.minimum || 1}-${ascii.height.maximum || 50}`;
      }
    }
  }

  return rules;
}

// ============================================================================
// CLI Argument Parsing
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    type: 'component',
    format: 'text',
    interactive: false,
    statsOnly: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--type' && args[i + 1]) {
      options.type = args[++i];
    } else if (arg === '--format' && args[i + 1]) {
      options.format = args[++i];
    } else if (arg === '--interactive') {
      options.interactive = true;
      options.format = 'text';
    } else if (arg === '--stats-only') {
      options.statsOnly = true;
    } else if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    }
  }

  // Validate type
  if (!['component', 'screen'].includes(options.type)) {
    console.error(`Error: Invalid type "${options.type}". Must be "component" or "screen".`);
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
  console.log(`Usage: node load-schema.js [OPTIONS]

Options:
  --type <component|screen>      Schema type (default: component)
  --format <json|text>           Output format (default: text)
  --interactive                  Enable interactive mode
  --stats-only                   Return only schema statistics
  --help, -h                     Show this help message

Exit Codes:
  0  Success
  1  Invalid arguments
  2  Schema file not found
  3  Schema compilation failed`);
}

// ============================================================================
// Output Formatting
// ============================================================================

function formatAsJson(result, options) {
  if (options.statsOnly) {
    return JSON.stringify({
      stats: result.stats,
      path: result.path
    }, null, 2);
  }

  return JSON.stringify({
    schema: result.schema,
    path: result.path,
    compiled: result.compiled,
    stats: result.stats
  }, null, 2);
}

function formatAsText(result, options) {
  const stats = result.stats;
  const rules = result.rules;

  if (options.interactive) {
    const draftVersion = stats.draft.includes('draft-07') ? '7' : 'unknown';
    return `┌─────────────────────────────────────────┐
│ uxscii Component Schema                  │
├─────────────────────────────────────────┤
│ Draft: ${draftVersion.padEnd(34)} │
│ Required fields: ${String(stats.requiredFields).padEnd(24)} │
│ Optional fields: ${String(stats.optionalFields).padEnd(24)} │
│ Component types: ${String(stats.componentTypes).padEnd(24)} │
│                                          │
│ Validation rules:                        │
│  • ID pattern: ${(rules.idPattern || 'N/A').padEnd(23)} │
│  • Version: semantic (X.Y.Z)             │
│  • ASCII: max ${(rules.asciiWidth || '120')}×${(rules.asciiHeight || '50').padEnd(21)} │
└─────────────────────────────────────────┘`;
  } else {
    return `uxscii Component Schema
  Draft: ${stats.draft}
  Required Fields: ${stats.requiredFields}
  Optional Fields: ${stats.optionalFields}
  Component Types: ${stats.componentTypes}

Validation Rules:
  ID Pattern: ${rules.idPattern || 'N/A'}
  Version Pattern: ${rules.versionPattern || 'N/A'}
  ASCII Width: ${rules.asciiWidth || 'N/A'}
  ASCII Height: ${rules.asciiHeight || 'N/A'}`;
  }
}

// ============================================================================
// Main Execution (CLI Mode)
// ============================================================================

function main() {
  const options = parseArgs();

  try {
    // Load schema
    const { schema, path: schemaPath } = loadSchema(options.type);

    // Compile schema (unless stats-only)
    let compiled = false;
    if (!options.statsOnly) {
      try {
        compileSchema(schema);
        compiled = true;
      } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(3);
      }
    }

    // Extract statistics
    const stats = extractStats(schema);
    const rules = extractValidationRules(schema);

    const result = {
      schema,
      path: schemaPath,
      compiled,
      stats,
      rules
    };

    // Output results
    if (options.format === 'json') {
      console.log(formatAsJson(result, options));
    } else {
      console.log(formatAsText(result, options));
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.message.includes('not found')) {
      process.exit(2);
    } else {
      process.exit(3);
    }
  }
}

// ============================================================================
// Module Exports
// ============================================================================

// Export for module usage
module.exports = {
  loadSchema,
  compileSchema,
  getValidator,
  extractStats,
  extractValidationRules,
  // Convenience exports for direct import
  get validator() {
    return getValidator('component');
  },
  get schema() {
    const { schema } = loadSchema('component');
    return schema;
  }
};

// Run main if executed directly
if (require.main === module) {
  main();
}
