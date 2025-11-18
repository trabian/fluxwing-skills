#!/usr/bin/env node

/**
 * write-pair.js - Atomic Component Writing
 *
 * Writes .uxm + .md files atomically with validation.
 * Supports dual-mode operation: interactive (human-friendly) and programmatic (JSON).
 *
 * Usage:
 *   node write-pair.js --uxm-file /tmp/button.uxm --md-file /tmp/button.md
 *   node write-pair.js --interactive
 *   node write-pair.js --uxm-file /tmp/button.uxm --md-file /tmp/button.md --output ./fluxwing/library/
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================================
// Configuration
// ============================================================================

const SKILL_ROOT = __dirname;
const PROJECT_ROOT = process.cwd();
const DEFAULT_OUTPUT_DIR = path.join(PROJECT_ROOT, 'fluxwing/components');

// ============================================================================
// CLI Argument Parsing
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    uxmFile: null,
    mdFile: null,
    output: DEFAULT_OUTPUT_DIR,
    format: 'text',
    interactive: false,
    validate: true,
    overwrite: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--uxm-file' && args[i + 1]) {
      options.uxmFile = args[++i];
    } else if (arg === '--md-file' && args[i + 1]) {
      options.mdFile = args[++i];
    } else if (arg === '--output' && args[i + 1]) {
      options.output = args[++i];
    } else if (arg === '--format' && args[i + 1]) {
      options.format = args[++i];
    } else if (arg === '--interactive') {
      options.interactive = true;
      options.format = 'text';
    } else if (arg === '--skip-validation') {
      options.validate = false;
    } else if (arg === '--overwrite') {
      options.overwrite = true;
    } else if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    }
  }

  // Validate arguments (unless interactive)
  if (!options.interactive) {
    if (!options.uxmFile || !options.mdFile) {
      console.error('Error: Both --uxm-file and --md-file must be provided.');
      process.exit(1);
    }
  }

  // Validate format
  if (!['json', 'text'].includes(options.format)) {
    console.error(`Error: Invalid format "${options.format}". Must be "json" or "text".`);
    process.exit(1);
  }

  return options;
}

function printUsage() {
  console.log(`Usage: node write-pair.js [OPTIONS]

Options:
  --uxm-file <path>              Path to .uxm file to write (required)
  --md-file <path>               Path to .md file to write (required)
  --output <directory>           Output directory (default: ./fluxwing/components/)
  --format <json|text>           Output format (default: text)
  --interactive                  Enable interactive mode
  --skip-validation              Skip schema validation
  --overwrite                    Overwrite existing files without prompting
  --help, -h                     Show this help message

Exit Codes:
  0  Success
  1  Invalid arguments
  2  Input file not found
  3  Validation failed
  4  Write failed (rollback performed)
  5  Overwrite prevented (file exists)`);
}

// ============================================================================
// Validation
// ============================================================================

function validateFiles(uxmFile, mdFile, options) {
  // Check input files exist
  if (!fs.existsSync(uxmFile)) {
    console.error(`Error: .uxm file not found: ${uxmFile}`);
    process.exit(2);
  }

  if (!fs.existsSync(mdFile)) {
    console.error(`Error: .md file not found: ${mdFile}`);
    process.exit(2);
  }

  // Validate .uxm against schema if requested
  if (options.validate) {
    try {
      const validatorPath = path.join(SKILL_ROOT, 'validate-component.js');
      const schemaPath = path.join(
        SKILL_ROOT,
        '../fluxwing-component-creator/schemas/uxm-component.schema.json'
      );

      execSync(
        `node "${validatorPath}" "${uxmFile}" "${schemaPath}"`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
    } catch (error) {
      console.error('Validation failed:', error.message);
      process.exit(3);
    }
  }

  // Read and parse .uxm to get component metadata
  let uxmData;
  try {
    const uxmContent = fs.readFileSync(uxmFile, 'utf8');
    uxmData = JSON.parse(uxmContent);
  } catch (error) {
    console.error(`Error reading/parsing .uxm file: ${error.message}`);
    process.exit(2);
  }

  // Check template variable consistency
  const mdContent = fs.readFileSync(mdFile, 'utf8');
  const consistency = checkVariableConsistency(uxmData, mdContent);

  if (!consistency.consistent && options.validate) {
    console.error('Warning: Template variable inconsistency detected.');
    console.error(`  Declared in .uxm: ${consistency.declared.join(', ')}`);
    console.error(`  Used in .md: ${consistency.used.join(', ')}`);
    console.error(`  Missing declarations: ${consistency.used.filter(v => !consistency.declared.includes(v)).join(', ')}`);
  }

  return uxmData;
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
// File Writing
// ============================================================================

function writePair(uxmFile, mdFile, outputDir, options) {
  // Validate files first
  const uxmData = validateFiles(uxmFile, mdFile, options);

  // Determine output file paths
  const componentId = uxmData.id;
  const outputUxmPath = path.join(outputDir, `${componentId}.uxm`);
  const outputMdPath = path.join(outputDir, `${componentId}.md`);

  // Check for existing files
  if (!options.overwrite) {
    if (fs.existsSync(outputUxmPath) || fs.existsSync(outputMdPath)) {
      if (options.interactive) {
        console.error(`Error: Files already exist at output location.`);
        console.error(`  ${outputUxmPath}`);
        console.error(`  ${outputMdPath}`);
        console.error(`Use --overwrite to force overwrite.`);
      } else {
        console.error(`Error: Component "${componentId}" already exists. Use --overwrite to force.`);
      }
      process.exit(5);
    }
  }

  // Create output directory if needed
  if (!fs.existsSync(outputDir)) {
    try {
      fs.mkdirSync(outputDir, { recursive: true });
    } catch (error) {
      console.error(`Error creating output directory: ${error.message}`);
      process.exit(4);
    }
  }

  // Atomic write: write both files or rollback
  let uxmWritten = false;
  let mdWritten = false;

  try {
    // Read input files
    const uxmContent = fs.readFileSync(uxmFile, 'utf8');
    const mdContent = fs.readFileSync(mdFile, 'utf8');

    // Write .uxm file
    fs.writeFileSync(outputUxmPath, uxmContent, 'utf8');
    uxmWritten = true;

    // Write .md file
    fs.writeFileSync(outputMdPath, mdContent, 'utf8');
    mdWritten = true;

    return {
      success: true,
      paths: {
        uxm: outputUxmPath,
        md: outputMdPath
      },
      validated: options.validate,
      id: componentId,
      version: uxmData.version
    };
  } catch (error) {
    // Rollback on failure
    if (uxmWritten && fs.existsSync(outputUxmPath)) {
      try {
        fs.unlinkSync(outputUxmPath);
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError.message);
      }
    }

    if (mdWritten && fs.existsSync(outputMdPath)) {
      try {
        fs.unlinkSync(outputMdPath);
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError.message);
      }
    }

    console.error(`Error writing files: ${error.message}`);
    process.exit(4);
  }
}

// ============================================================================
// Output Formatting
// ============================================================================

function formatAsJson(result) {
  return JSON.stringify(result, null, 2);
}

function formatAsText(result, options) {
  if (options.interactive) {
    return `✓ Validated ${result.id}.uxm
✓ Wrote ${result.paths.uxm}
✓ Wrote ${result.paths.md}`;
  } else {
    return `Success: ${result.id} (v${result.version})
  .uxm: ${result.paths.uxm}
  .md:  ${result.paths.md}
  Validated: ${result.validated ? 'Yes' : 'No'}`;
  }
}

// ============================================================================
// Main Execution
// ============================================================================

function main() {
  const options = parseArgs();

  // Interactive mode (not implemented in detail for now)
  if (options.interactive) {
    console.log('Interactive mode not yet implemented. Use --help for usage.');
    process.exit(1);
  }

  // Write the component pair
  const result = writePair(options.uxmFile, options.mdFile, options.output, options);

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
  writePair,
  validateFiles,
  checkVariableConsistency
};
