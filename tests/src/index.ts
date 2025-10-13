#!/usr/bin/env node

/**
 * Main test runner for Fluxwing Consistency Tests
 *
 * Usage:
 *   npm test                          # Run all tests
 *   npm test -- --category commands   # Run specific category
 *   npm run test:report               # Run tests and generate reports
 */

import { TestReporter } from './utils/reporters';
import * as fs from 'fs/promises';
import * as path from 'path';

async function main() {
  console.log('🧪 Fluxwing Consistency Test Suite\n');
  console.log('=' .repeat(60));

  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('⚠️  WARNING: ANTHROPIC_API_KEY not set');
    console.log('   Static tests will run, but SDK-based tests will be skipped.\n');
  }

  // Jest will handle the actual test execution
  // This is a placeholder for additional setup/reporting

  console.log('Starting test execution...\n');
  console.log('Tests are running via Jest. Results will be displayed below.\n');
  console.log('=' .repeat(60) + '\n');
}

// Only run if this is the main module
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { main };
