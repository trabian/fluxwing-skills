#!/usr/bin/env node
/**
 * Test suite for screen validator
 * Tests bundled screen templates against the schema
 */

const fs = require('fs');
const path = require('path');
const { validateScreen } = require('./validate-screen.js');

// ANSI color codes
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

console.log('Testing Fluxwing Screen Validator\n');
console.log('==================================================\n');

// Test configuration
const schemaPath = path.join(__dirname, '..', 'fluxwing-component-creator', 'schemas', 'uxm-component.schema.json');
const templatesDir = path.join(__dirname, '..', 'fluxwing-screen-scaffolder', 'templates');

// Find all .uxm files in templates directory
const screenFiles = fs.readdirSync(templatesDir)
  .filter(file => file.endsWith('.uxm'))
  .map(file => path.join(templatesDir, file));

if (screenFiles.length === 0) {
  console.log(`${YELLOW}⚠ No screen templates found in ${templatesDir}${RESET}`);
  process.exit(0);
}

// Test results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0
};

// Run tests
for (const screenFile of screenFiles) {
  const screenName = path.basename(screenFile, '.uxm');
  console.log(`Testing: ${screenName}`);

  try {
    const result = validateScreen(screenFile, schemaPath);

    if (result.valid) {
      console.log(`  ${GREEN}✓ PASS${RESET} - ${screenName}`);
      results.passed++;

      if (result.warnings.length > 0) {
        console.log(`    (${result.warnings.length} warnings)`);
        results.warnings += result.warnings.length;
      }
    } else {
      console.log(`  ${RED}✗ FAIL${RESET} - ${screenName}`);
      console.log(`    Errors: ${result.errors.length}`);
      results.failed++;

      // Show first few errors
      result.errors.slice(0, 3).forEach((error, i) => {
        console.log(`      ${i + 1}. ${error.message}`);
      });

      if (result.errors.length > 3) {
        console.log(`      ... and ${result.errors.length - 3} more errors`);
      }
    }
  } catch (error) {
    console.log(`  ${RED}✗ ERROR${RESET} - ${screenName}`);
    console.log(`    ${error.message}`);
    results.failed++;
  }

  console.log('');
}

// Print summary
console.log('==================================================');
console.log(`Results: ${GREEN}${results.passed} passed${RESET}, ${results.failed > 0 ? RED : ''}${results.failed} failed${RESET}`);

if (results.warnings > 0) {
  console.log(`Warnings: ${YELLOW}${results.warnings} total${RESET}`);
}

// Exit with appropriate code
process.exit(results.failed > 0 ? 1 : 0);
