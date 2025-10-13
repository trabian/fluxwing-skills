#!/usr/bin/env node

/**
 * Generate HTML and JSON reports from Jest test results
 *
 * Usage: node dist/generate-report.js
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { TestReporter, TestResult } from './utils/reporters';

interface JestTestResult {
  numFailedTests: number;
  numPassedTests: number;
  numPendingTests: number;
  numTotalTests: number;
  testResults: Array<{
    testFilePath: string;
    testResults: Array<{
      ancestorTitles: string[];
      title: string;
      status: 'passed' | 'failed' | 'pending' | 'skipped';
      duration: number;
      failureMessages: string[];
    }>;
  }>;
}

async function generateReports() {
  console.log('📊 Generating test reports...\n');

  try {
    // Try to find Jest output file
    const jestOutputPath = path.join(__dirname, '../jest-output.json');
    let jestResults: JestTestResult | null = null;

    try {
      const jestOutput = await fs.readFile(jestOutputPath, 'utf-8');
      jestResults = JSON.parse(jestOutput);
    } catch {
      console.log('⚠️  Jest output not found. Using placeholder data.');
      console.log('   Run tests with: npm test -- --json --outputFile=jest-output.json\n');
    }

    const reporter = new TestReporter();

    // Convert Jest results to our format
    if (jestResults) {
      for (const fileResult of jestResults.testResults) {
        const fileName = path.basename(fileResult.testFilePath);
        const category = getCategoryFromFileName(fileName);

        for (const test of fileResult.testResults) {
          const testName = [...test.ancestorTitles, test.title].join(' > ');

          const result: TestResult = {
            category,
            testName,
            status: test.status === 'pending' ? 'skipped' : test.status,
            duration: test.duration || 0,
            error: test.failureMessages.join('\n') || undefined,
          };

          reporter.addResult(result);
        }
      }
    }

    // Generate reports
    const reportsDir = path.join(__dirname, '../reports');
    await fs.mkdir(reportsDir, { recursive: true });

    const jsonPath = path.join(reportsDir, 'test-results.json');
    const htmlPath = path.join(reportsDir, 'test-results.html');

    await reporter.generateJSONReport(jsonPath);
    await reporter.generateHTMLReport(htmlPath);

    // Print console report
    reporter.printConsoleReport();

    console.log(`\n✅ Reports generated:`);
    console.log(`   JSON: ${jsonPath}`);
    console.log(`   HTML: ${htmlPath}\n`);

    // Exit with appropriate code
    const summary = reporter.getSummary();
    process.exit(summary.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Failed to generate reports:', error);
    process.exit(1);
  }
}

function getCategoryFromFileName(fileName: string): string {
  const categoryMap: Record<string, string> = {
    '01-command-consistency': 'Category 1: Command File Consistency',
    '02-agent-consistency': 'Category 2: Agent File Consistency',
    '03-functional-commands': 'Category 3: Functional Commands',
    '04-functional-agents': 'Category 4: Functional Agents',
    '05-documentation': 'Category 5: Documentation Consistency',
    '06-integration': 'Category 6: Integration & Edge Cases',
  };

  for (const [key, value] of Object.entries(categoryMap)) {
    if (fileName.includes(key)) {
      return value;
    }
  }

  return 'Other';
}

// Run if this is the main module
if (require.main === module) {
  generateReports().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { generateReports };
