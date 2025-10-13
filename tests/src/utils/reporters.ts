import * as fs from 'fs/promises';
import * as path from 'path';

export interface TestResult {
  category: string;
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  details?: string;
}

export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  timestamp: string;
}

export interface CategorySummary {
  category: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
}

/**
 * Test report generator
 */
export class TestReporter {
  private results: TestResult[] = [];
  private startTime: Date;

  constructor() {
    this.startTime = new Date();
  }

  /**
   * Add a test result
   */
  addResult(result: TestResult): void {
    this.results.push(result);
  }

  /**
   * Get test summary
   */
  getSummary(): TestSummary {
    const endTime = new Date();
    const duration = endTime.getTime() - this.startTime.getTime();

    return {
      total: this.results.length,
      passed: this.results.filter((r) => r.status === 'passed').length,
      failed: this.results.filter((r) => r.status === 'failed').length,
      skipped: this.results.filter((r) => r.status === 'skipped').length,
      duration,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get summary by category
   */
  getCategorySummaries(): CategorySummary[] {
    const categories = new Map<string, CategorySummary>();

    this.results.forEach((result) => {
      if (!categories.has(result.category)) {
        categories.set(result.category, {
          category: result.category,
          total: 0,
          passed: 0,
          failed: 0,
          skipped: 0,
        });
      }

      const summary = categories.get(result.category)!;
      summary.total++;

      if (result.status === 'passed') summary.passed++;
      else if (result.status === 'failed') summary.failed++;
      else if (result.status === 'skipped') summary.skipped++;
    });

    return Array.from(categories.values());
  }

  /**
   * Generate JSON report
   */
  async generateJSONReport(outputPath: string): Promise<void> {
    const report = {
      summary: this.getSummary(),
      categories: this.getCategorySummaries(),
      results: this.results,
    };

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(report, null, 2), 'utf-8');
  }

  /**
   * Generate HTML report
   */
  async generateHTMLReport(outputPath: string): Promise<void> {
    const summary = this.getSummary();
    const categories = this.getCategorySummaries();

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fluxwing Consistency Test Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { color: #333; margin-bottom: 10px; }
    .timestamp { color: #666; font-size: 14px; margin-bottom: 30px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .summary-card { padding: 20px; border-radius: 8px; text-align: center; }
    .summary-card h3 { font-size: 36px; margin-bottom: 5px; }
    .summary-card p { color: #666; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
    .passed { background: #d4edda; color: #155724; }
    .failed { background: #f8d7da; color: #721c24; }
    .skipped { background: #fff3cd; color: #856404; }
    .total { background: #d1ecf1; color: #0c5460; }
    .categories { margin-bottom: 40px; }
    .category { margin-bottom: 30px; }
    .category h2 { color: #333; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #007bff; }
    .category-stats { display: flex; gap: 15px; margin-bottom: 15px; font-size: 14px; }
    .category-stats span { padding: 5px 10px; border-radius: 4px; }
    .test-list { list-style: none; }
    .test-item { padding: 12px; margin-bottom: 8px; border-radius: 4px; border-left: 4px solid; display: flex; justify-content: space-between; align-items: center; }
    .test-item.passed { background: #f0f9f4; border-color: #28a745; }
    .test-item.failed { background: #fef5f5; border-color: #dc3545; }
    .test-item.skipped { background: #fffcf0; border-color: #ffc107; }
    .test-name { font-weight: 500; }
    .test-duration { color: #666; font-size: 12px; }
    .error-details { margin-top: 8px; padding: 10px; background: #fff; border-radius: 4px; font-family: monospace; font-size: 12px; color: #dc3545; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🧪 Fluxwing Consistency Test Report</h1>
    <p class="timestamp">Generated: ${summary.timestamp} | Duration: ${(summary.duration / 1000).toFixed(2)}s</p>

    <div class="summary">
      <div class="summary-card total">
        <h3>${summary.total}</h3>
        <p>Total Tests</p>
      </div>
      <div class="summary-card passed">
        <h3>${summary.passed}</h3>
        <p>Passed</p>
      </div>
      <div class="summary-card failed">
        <h3>${summary.failed}</h3>
        <p>Failed</p>
      </div>
      <div class="summary-card skipped">
        <h3>${summary.skipped}</h3>
        <p>Skipped</p>
      </div>
    </div>

    <div class="categories">
      ${categories
        .map(
          (cat) => `
        <div class="category">
          <h2>${cat.category}</h2>
          <div class="category-stats">
            <span class="passed">✓ ${cat.passed} passed</span>
            <span class="failed">✗ ${cat.failed} failed</span>
            <span class="skipped">⊘ ${cat.skipped} skipped</span>
          </div>
          <ul class="test-list">
            ${this.results
              .filter((r) => r.category === cat.category)
              .map(
                (result) => `
              <li class="test-item ${result.status}">
                <span class="test-name">${result.testName}</span>
                <span class="test-duration">${result.duration.toFixed(0)}ms</span>
              </li>
              ${result.error ? `<div class="error-details">${this.escapeHtml(result.error)}</div>` : ''}
            `
              )
              .join('')}
          </ul>
        </div>
      `
        )
        .join('')}
    </div>
  </div>
</body>
</html>`;

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, html, 'utf-8');
  }

  /**
   * Generate console report
   */
  printConsoleReport(): void {
    const summary = this.getSummary();
    const categories = this.getCategorySummaries();

    console.log('\n' + '='.repeat(60));
    console.log('  FLUXWING CONSISTENCY TEST REPORT');
    console.log('='.repeat(60));
    console.log(`\nTimestamp: ${summary.timestamp}`);
    console.log(`Duration: ${(summary.duration / 1000).toFixed(2)}s\n`);

    console.log('Summary:');
    console.log(`  Total:   ${summary.total}`);
    console.log(`  ✓ Passed:  ${summary.passed}`);
    console.log(`  ✗ Failed:  ${summary.failed}`);
    console.log(`  ⊘ Skipped: ${summary.skipped}\n`);

    console.log('By Category:');
    categories.forEach((cat) => {
      console.log(`\n  ${cat.category}:`);
      console.log(`    Total: ${cat.total} | Passed: ${cat.passed} | Failed: ${cat.failed} | Skipped: ${cat.skipped}`);
    });

    if (summary.failed > 0) {
      console.log('\n' + '='.repeat(60));
      console.log('  FAILED TESTS');
      console.log('='.repeat(60));

      this.results
        .filter((r) => r.status === 'failed')
        .forEach((result) => {
          console.log(`\n✗ ${result.category} > ${result.testName}`);
          if (result.error) {
            console.log(`  Error: ${result.error}`);
          }
        });
    }

    console.log('\n' + '='.repeat(60) + '\n');
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
