#!/usr/bin/env node
/**
 * Screen validation using component validator + screen-specific checks.
 * Validates .uxm screen files with additional checks for rendered examples and composed components.
 *
 * Usage:
 *   node validate-screen.js <screen.uxm> <schema.json>
 *   node validate-screen.js <screen.uxm> <schema.json> --json
 *
 * Exit codes:
 *   0 - Valid screen
 *   1 - Validation errors found
 *   2 - Missing dependencies or invalid arguments
 */

const fs = require('fs');
const path = require('path');

// Import component validator
const { validateComponent } = require('./validate-component.js');

/**
 * Validate a .uxm screen file with screen-specific checks
 * @param {string} uxmFilePath - Path to .uxm file
 * @param {string} schemaPath - Path to JSON schema file
 * @returns {Object} Validation result object
 */
function validateScreen(uxmFilePath, schemaPath) {
  // 1. Run standard component validation
  const result = validateComponent(uxmFilePath, schemaPath);

  // If component validation failed completely, return early
  if (!fs.existsSync(uxmFilePath)) {
    return result;
  }

  // Load screen data for screen-specific checks
  let screen;
  try {
    const uxmContent = fs.readFileSync(uxmFilePath, 'utf8');
    screen = JSON.parse(uxmContent);
  } catch (error) {
    // Already handled by validateComponent
    return result;
  }

  // 2. Screen-specific checks
  checkRenderedFile(uxmFilePath, result);
  checkComposedComponents(screen, uxmFilePath, result);

  return result;
}

/**
 * Check if .rendered.md file exists (recommended for screens)
 * @param {string} uxmFilePath - Path to .uxm file
 * @param {Object} result - Result object to populate
 */
function checkRenderedFile(uxmFilePath, result) {
  const renderedFilePath = uxmFilePath.replace('.uxm', '.rendered.md');

  if (!fs.existsSync(renderedFilePath)) {
    result.warnings.push({
      path: ['screen'],
      message: `Rendered example file recommended for screens: ${renderedFilePath}`,
      type: 'missing_rendered',
      severity: 'info'
    });
  }
}

/**
 * Check if components referenced in screen exist
 * @param {Object} screen - Parsed screen object
 * @param {string} uxmFilePath - Path to .uxm file
 * @param {Object} result - Result object to populate
 */
function checkComposedComponents(screen, uxmFilePath, result) {
  // Extract component references from screen
  const composedComponents = extractComponentReferences(screen);

  if (composedComponents.length === 0) {
    return; // No composed components to check
  }

  // Determine base path for component lookups
  const screenDir = path.dirname(uxmFilePath);
  const projectRoot = findProjectRoot(screenDir);
  const componentsDir = path.join(projectRoot, 'fluxwing', 'components');

  for (const componentId of composedComponents) {
    const componentPath = path.join(componentsDir, `${componentId}.uxm`);

    if (!fs.existsSync(componentPath)) {
      result.warnings.push({
        path: ['composed'],
        message: `Referenced component not found: ${componentId} (expected at ${componentPath})`,
        type: 'missing_component',
        severity: 'warning'
      });
    }
  }
}

/**
 * Extract component IDs referenced in screen
 * @param {Object} screen - Parsed screen object
 * @returns {Array<string>} Array of component IDs
 */
function extractComponentReferences(screen) {
  const componentIds = new Set();

  // Check if screen extends another component
  if (screen.extends) {
    componentIds.add(screen.extends);
  }

  // Check slots for component references
  if (screen.slots) {
    for (const slot of Object.values(screen.slots)) {
      if (slot.component) {
        componentIds.add(slot.component);
      }
      if (Array.isArray(slot.components)) {
        slot.components.forEach(c => componentIds.add(c));
      }
    }
  }

  // Check ASCII template content for component references (basic pattern matching)
  // Pattern: {{component:component-id}}
  const mdFilePath = screen.ascii?.templateFile;
  if (mdFilePath) {
    try {
      const screenDir = path.dirname(screen.id);
      const mdContent = fs.readFileSync(mdFilePath, 'utf8');
      const componentPattern = /\{\{component:([a-z0-9-]+)\}\}/g;
      let match;
      while ((match = componentPattern.exec(mdContent)) !== null) {
        componentIds.add(match[1]);
      }
    } catch (error) {
      // Template file not found - already reported by component validator
    }
  }

  return Array.from(componentIds);
}

/**
 * Find project root directory (containing fluxwing/ directory)
 * @param {string} startDir - Starting directory
 * @returns {string} Project root path
 */
function findProjectRoot(startDir) {
  let currentDir = startDir;

  while (currentDir !== path.dirname(currentDir)) {
    const fluxwingDir = path.join(currentDir, 'fluxwing');
    if (fs.existsSync(fluxwingDir)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  // Fallback to current working directory
  return process.cwd();
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node validate-screen.js <screen.uxm> <schema.json> [--json]');
    process.exit(2);
  }

  const uxmFilePath = args[0];
  const schemaPath = args[1];
  const jsonOutput = args.includes('--json');

  const result = validateScreen(uxmFilePath, schemaPath);

  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    if (result.valid) {
      console.log(`✓ Valid: ${result.stats.id || 'screen'}`);
      console.log(`  Type: ${result.stats.type || 'unknown'}`);
      console.log(`  Version: ${result.stats.version || 'unknown'}`);
      console.log(`  States: ${result.stats.states || 0}`);
      console.log(`  Props: ${result.stats.props || 0}`);

      if (result.warnings.length > 0) {
        console.log(`\n⚠ Warnings:`);
        result.warnings.forEach((warning, i) => {
          console.log(`\n  Warning ${i + 1}: ${warning.message}`);
          if (warning.path.length > 0) {
            console.log(`  Location: ${warning.path.join(' → ')}`);
          }
        });
      }
    } else {
      console.error('✗ Validation Failed\n');
      result.errors.forEach((error, i) => {
        console.error(`  Error ${i + 1}: ${error.message}`);
        if (error.path.length > 0) {
          console.error(`  Location: ${error.path.join(' → ')}`);
        }
      });

      if (result.errors.length > 8) {
        console.error(`\n  ... and ${result.errors.length - 8} more errors`);
      }
    }
  }

  process.exit(result.valid ? 0 : 1);
}

module.exports = { validateScreen };
