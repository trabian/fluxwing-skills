#!/usr/bin/env node
/**
 * Batch validation for multiple .uxm files
 * Validates multiple component or screen files in one command
 *
 * Usage:
 *   node validate-batch.js "./fluxwing/components/FILE.uxm" <schema.json>
 *   node validate-batch.js "./fluxwing/screens/FILE.uxm" <schema.json> --json
 *   node validate-batch.js "./fluxwing/ALL/FILE.uxm" <schema.json> --screens
 *
 * Options:
 *   --json       Output results as JSON
 *   --screens    Use screen validator instead of component validator
 *
 * Exit codes:
 *   0 - All files valid
 *   1 - One or more files invalid
 *   2 - Missing dependencies or invalid arguments
 */

const fs = require('fs');
const path = require('path');

// Check for glob dependency
let glob;
try {
  glob = require('glob');
} catch (error) {
  console.error('Error: glob library not found');
  console.error('Install with: npm install glob');
  process.exit(2);
}

// Import validators
const { validateComponent } = require('./validate-component.js');
const { validateScreen } = require('./validate-screen.js');

// ANSI color codes
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

/**
 * Validate multiple files matching a glob pattern
 * @param {string} pattern - Glob pattern for files to validate
 * @param {string} schemaPath - Path to JSON schema file
 * @param {Object} options - Validation options
 * @returns {Object} Batch validation results
 */
function validateBatch(pattern, schemaPath, options = {}) {
  const useScreenValidator = options.screens || false;
  const validator = useScreenValidator ? validateScreen : validateComponent;

  // Find all matching files
  const files = glob.sync(pattern);

  if (files.length === 0) {
    return {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      files: [],
      message: `No files found matching pattern: ${pattern}`
    };
  }

  const results = {
    total: files.length,
    passed: 0,
    failed: 0,
    warnings: 0,
    files: []
  };

  // Validate each file
  for (const file of files) {
    const result = validator(file, schemaPath);

    const fileResult = {
      file: file,
      id: result.stats?.id || path.basename(file, '.uxm'),
      valid: result.valid,
      errors: result.errors.length,
      warnings: result.warnings.length,
      errorDetails: result.errors,
      warningDetails: result.warnings
    };

    results.files.push(fileResult);

    if (result.valid) {
      results.passed++;
    } else {
      results.failed++;
    }

    results.warnings += result.warnings.length;
  }

  return results;
}

/**
 * Print human-readable batch results
 * @param {Object} results - Batch validation results
 */
function printHumanReadable(results) {
  if (results.total === 0) {
    console.log(`${YELLOW}${results.message}${RESET}`);
    return;
  }

  console.log(`${BLUE}Batch Validation Results${RESET}\n`);
  console.log(`Total files: ${results.total}`);
  console.log(`${GREEN}Passed: ${results.passed}${RESET}`);

  if (results.failed > 0) {
    console.log(`${RED}Failed: ${results.failed}${RESET}`);
  }

  if (results.warnings > 0) {
    console.log(`${YELLOW}Total warnings: ${results.warnings}${RESET}`);
  }

  console.log('');

  // Show failed files
  const failedFiles = results.files.filter(f => !f.valid);
  if (failedFiles.length > 0) {
    console.log(`${RED}Failed Files:${RESET}\n`);
    failedFiles.forEach(file => {
      console.log(`  ${RED}✗${RESET} ${file.id} (${file.file})`);
      console.log(`    Errors: ${file.errors}`);

      // Show first 2 errors
      file.errorDetails.slice(0, 2).forEach((error, i) => {
        console.log(`      ${i + 1}. ${error.message}`);
      });

      if (file.errors > 2) {
        console.log(`      ... and ${file.errors - 2} more errors`);
      }
      console.log('');
    });
  }

  // Show passed files with warnings
  const passedWithWarnings = results.files.filter(f => f.valid && f.warnings > 0);
  if (passedWithWarnings.length > 0) {
    console.log(`${YELLOW}Passed with Warnings:${RESET}\n`);
    passedWithWarnings.forEach(file => {
      console.log(`  ${GREEN}✓${RESET} ${file.id} ${YELLOW}(${file.warnings} warnings)${RESET}`);
    });
    console.log('');
  }

  // Show fully passed files (compact)
  const fullPassed = results.files.filter(f => f.valid && f.warnings === 0);
  if (fullPassed.length > 0) {
    console.log(`${GREEN}Fully Passed:${RESET}\n`);
    fullPassed.forEach(file => {
      console.log(`  ${GREEN}✓${RESET} ${file.id}`);
    });
  }
}

/**
 * Print JSON results
 * @param {Object} results - Batch validation results
 */
function printJSON(results) {
  console.log(JSON.stringify(results, null, 2));
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node validate-batch.js <pattern> <schema.json> [--json] [--screens]');
    console.error('');
    console.error('Examples:');
    console.error('  node validate-batch.js "./fluxwing/components/*.uxm" schema.json');
    console.error('  node validate-batch.js "./fluxwing/**/*.uxm" schema.json --json');
    console.error('  node validate-batch.js "./fluxwing/screens/*.uxm" schema.json --screens');
    process.exit(2);
  }

  const pattern = args[0];
  const schemaPath = args[1];
  const jsonOutput = args.includes('--json');
  const useScreens = args.includes('--screens');

  const results = validateBatch(pattern, schemaPath, { screens: useScreens });

  if (jsonOutput) {
    printJSON(results);
  } else {
    printHumanReadable(results);
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

module.exports = { validateBatch };
