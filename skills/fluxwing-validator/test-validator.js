#!/usr/bin/env node
/**
 * Test script for validate-component.js
 * Tests against bundled template components
 */

const { validateComponent } = require('./validate-component.js');
const path = require('path');
const fs = require('fs');

// Test components from templates
const testComponents = [
  '../fluxwing-component-creator/templates/primary-button.uxm',
  '../fluxwing-component-creator/templates/email-input.uxm',
  '../fluxwing-component-creator/templates/card.uxm',
  '../fluxwing-component-creator/templates/badge.uxm',
  '../fluxwing-component-creator/templates/alert.uxm'
];

const schemaPath = path.join(__dirname, '../fluxwing-component-creator/schemas/uxm-component.schema.json');

console.log('Testing Fluxwing Component Validator\n');
console.log('='.repeat(50));
console.log('');

let passed = 0;
let failed = 0;

for (const componentRelPath of testComponents) {
  const componentPath = path.join(__dirname, componentRelPath);
  const componentName = path.basename(componentPath);

  if (!fs.existsSync(componentPath)) {
    console.log(`⊘ SKIP: ${componentName} (file not found)`);
    continue;
  }

  console.log(`Testing: ${componentName}`);

  try {
    const result = validateComponent(componentPath, schemaPath);

    if (result.valid) {
      passed++;
      console.log(`  ✓ PASS - ${result.stats.id}`);
      if (result.warnings.length > 0) {
        console.log(`    (${result.warnings.length} warnings)`);
      }
    } else {
      failed++;
      console.log(`  ✗ FAIL - ${result.errors.length} errors`);
      result.errors.slice(0, 2).forEach(err => {
        console.log(`    • ${err.message}`);
      });
    }
  } catch (error) {
    failed++;
    console.log(`  ✗ ERROR: ${error.message}`);
  }

  console.log('');
}

console.log('='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('');

process.exit(failed > 0 ? 1 : 0);
