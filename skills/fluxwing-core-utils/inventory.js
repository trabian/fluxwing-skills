#!/usr/bin/env node

/**
 * inventory.js - Unified Component Discovery
 *
 * Discovers uxm files across bundled templates, project workspace, and library.
 * Supports dual-mode operation: interactive (human-friendly) and programmatic (JSON).
 *
 * Usage:
 *   node inventory.js --type components --format json
 *   node inventory.js --interactive --type screens
 */

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

// ============================================================================
// Configuration
// ============================================================================

const SKILL_ROOT = __dirname;
const PROJECT_ROOT = process.cwd();

const SEARCH_PATHS = {
  components: [
    path.join(PROJECT_ROOT, 'fluxwing/components'),
    path.join(PROJECT_ROOT, 'fluxwing/library'),
    path.join(SKILL_ROOT, '../fluxwing-component-creator/templates')
  ],
  screens: [
    path.join(PROJECT_ROOT, 'fluxwing/screens')
  ]
};

// ============================================================================
// CLI Argument Parsing
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    type: 'components',
    format: 'text',
    interactive: false,
    filter: null,
    componentType: null
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
    } else if (arg === '--filter' && args[i + 1]) {
      options.filter = args[++i];
    } else if (arg === '--component-type' && args[i + 1]) {
      options.componentType = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    }
  }

  // Validate type
  if (!['components', 'screens'].includes(options.type)) {
    console.error(`Error: Invalid type "${options.type}". Must be "components" or "screens".`);
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
  console.log(`Usage: node inventory.js [OPTIONS]

Options:
  --type <components|screens>    Type of inventory (default: components)
  --format <json|text>           Output format (default: text)
  --interactive                  Enable interactive mode
  --filter <pattern>             Filter by ID pattern (regex)
  --component-type <type>        Filter by component type
  --help, -h                     Show this help message

Exit Codes:
  0  Success
  1  Invalid arguments
  2  No items found
  3  File system error`);
}

// ============================================================================
// File Discovery
// ============================================================================

function findUxmFiles(searchPaths) {
  const results = {
    bundled: [],
    components: [],
    library: []
  };

  searchPaths.forEach((searchPath, index) => {
    if (!fs.existsSync(searchPath)) {
      return;
    }

    try {
      const pattern = path.join(searchPath, '*.uxm');
      const files = globSync(pattern, { absolute: true });

      files.forEach(filePath => {
        const metadata = extractMetadata(filePath);
        if (metadata) {
          // Determine category based on path
          if (filePath.includes('/templates/')) {
            results.bundled.push(metadata);
          } else if (filePath.includes('/library/')) {
            results.library.push(metadata);
          } else {
            results.components.push(metadata);
          }
        }
      });
    } catch (error) {
      console.error(`Error scanning ${searchPath}:`, error.message);
      process.exit(3);
    }
  });

  return results;
}

function findScreenFiles(searchPaths) {
  const results = {
    screens: []
  };

  searchPaths.forEach(searchPath => {
    if (!fs.existsSync(searchPath)) {
      return;
    }

    try {
      const pattern = path.join(searchPath, '*.uxm');
      const files = globSync(pattern, { absolute: true });

      files.forEach(filePath => {
        const metadata = extractMetadata(filePath);
        if (metadata) {
          results.screens.push(metadata);
        }
      });
    } catch (error) {
      console.error(`Error scanning ${searchPath}:`, error.message);
      process.exit(3);
    }
  });

  return results;
}

function extractMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    return {
      path: filePath,
      id: data.id || path.basename(filePath, '.uxm'),
      type: data.type || 'unknown',
      version: data.version || '0.0.0'
    };
  } catch (error) {
    console.error(`Warning: Could not parse ${filePath}:`, error.message);
    return null;
  }
}

// ============================================================================
// Filtering
// ============================================================================

function applyFilters(results, options) {
  const filtered = {};

  Object.keys(results).forEach(category => {
    filtered[category] = results[category].filter(item => {
      // Filter by ID pattern
      if (options.filter) {
        try {
          const regex = new RegExp(options.filter);
          if (!regex.test(item.id)) {
            return false;
          }
        } catch (error) {
          console.error(`Error: Invalid filter pattern "${options.filter}":`, error.message);
          process.exit(1);
        }
      }

      // Filter by component type
      if (options.componentType && item.type !== options.componentType) {
        return false;
      }

      return true;
    });
  });

  return filtered;
}

// ============================================================================
// Deduplication
// ============================================================================

function deduplicateResults(results) {
  const seen = new Map();
  const deduplicated = {};

  // Priority order: components > library > bundled
  const categories = ['components', 'library', 'bundled', 'screens'];

  categories.forEach(category => {
    if (!results[category]) return;

    deduplicated[category] = results[category].filter(item => {
      if (seen.has(item.id)) {
        return false; // Skip duplicate (lower priority)
      }
      seen.set(item.id, item);
      return true;
    });
  });

  return deduplicated;
}

// ============================================================================
// Output Formatting
// ============================================================================

function formatAsJson(results) {
  return JSON.stringify(results, null, 2);
}

function formatAsText(results, options) {
  const isComponents = options.type === 'components';

  if (isComponents) {
    const bundledCount = results.bundled?.length || 0;
    const componentsCount = results.components?.length || 0;
    const libraryCount = results.library?.length || 0;
    const total = bundledCount + componentsCount + libraryCount;

    if (options.interactive) {
      return `┌─────────────────────────────────────────┐
│ Component Inventory                      │
├─────────────────────────────────────────┤
│ Bundled Templates:      ${String(bundledCount).padStart(2)} components    │
│ Project Components:      ${String(componentsCount).padStart(2)} components    │
│ Project Library:         ${String(libraryCount).padStart(2)} components    │
│ Total:                  ${String(total).padStart(2)} components    │
└─────────────────────────────────────────┘`;
    } else {
      return `Component Inventory:
  Bundled Templates:  ${bundledCount}
  Project Components: ${componentsCount}
  Project Library:    ${libraryCount}
  Total:              ${total}`;
    }
  } else {
    const screensCount = results.screens?.length || 0;

    if (options.interactive) {
      return `┌─────────────────────────────────────────┐
│ Screen Inventory                         │
├─────────────────────────────────────────┤
│ Project Screens:        ${String(screensCount).padStart(2)} screens       │
└─────────────────────────────────────────┘`;
    } else {
      return `Screen Inventory:
  Project Screens: ${screensCount}`;
    }
  }
}

// ============================================================================
// Main Execution
// ============================================================================

function main() {
  const options = parseArgs();

  // Find files based on type
  let results;
  if (options.type === 'components') {
    results = findUxmFiles(SEARCH_PATHS.components);
  } else {
    results = findScreenFiles(SEARCH_PATHS.screens);
  }

  // Apply filters
  results = applyFilters(results, options);

  // Deduplicate (prefer user files over bundled)
  results = deduplicateResults(results);

  // Check if any items found
  const totalCount = Object.values(results).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  if (totalCount === 0) {
    if (options.format === 'json') {
      console.log(formatAsJson(results));
    } else {
      console.log(`No ${options.type} found.`);
    }
    process.exit(2);
  }

  // Output results
  if (options.format === 'json') {
    console.log(formatAsJson(results));
  } else {
    console.log(formatAsText(results, options));
  }

  process.exit(0);
}

// Run if executed directly
if (require.main === module) {
  main();
}

// Export for module usage
module.exports = {
  findUxmFiles,
  findScreenFiles,
  extractMetadata,
  applyFilters,
  deduplicateResults
};
