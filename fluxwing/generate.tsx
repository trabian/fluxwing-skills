#!/usr/bin/env npx tsx
/**
 * Fluxwing Code Generator
 *
 * Transforms component JSX to platform-specific code.
 * Currently supports: react-tailwind
 *
 * Usage:
 *   npx tsx generate.tsx --target react-tailwind < design.tsx
 *   npx tsx generate.tsx --target react-tailwind --input ./fluxwing/screens/login.tsx
 *   echo '<Button>Click</Button>' | npx tsx generate.tsx -t react-tailwind
 *   npx tsx generate.tsx --list-targets
 */

import * as fs from 'fs';

// Shared parser module
import {
  parseInlineComponents,
  loadComponentsFromFile,
  getDefaultTemplates,
} from './src/parser/index.js';

// Code generation targets
import { getTarget, getAvailableTargets } from './src/targets/index.js';

// ============================================================================
// CLI
// ============================================================================

interface CliArgs {
  target: string;
  inputFile?: string;
  outputFile?: string;
  format: boolean;
  componentFile?: string;
  componentName?: string;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    target: 'react-tailwind',
    format: true,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-t' || arg === '--target') {
      result.target = args[++i];
    } else if (arg === '-i' || arg === '--input') {
      result.inputFile = args[++i];
    } else if (arg === '-o' || arg === '--output') {
      result.outputFile = args[++i];
    } else if (arg === '-c' || arg === '--components') {
      result.componentFile = args[++i];
    } else if (arg === '--component') {
      result.componentName = args[++i];
    } else if (arg === '--no-format') {
      result.format = false;
    } else if (arg === '--list-targets' || arg === '-l') {
      console.log('Available targets:');
      for (const name of getAvailableTargets()) {
        console.log(`  - ${name}`);
      }
      process.exit(0);
    }
  }

  return result;
}

async function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => data += chunk);
    process.stdin.on('end', () => resolve(data));

    // Timeout for stdin
    setTimeout(() => resolve(data), 100);
  });
}

async function main() {
  const args = parseArgs();

  // Get the target generator
  let target;
  try {
    target = getTarget(args.target);
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }

  let source: string;
  let allComponents: Record<string, { default: string; states: Record<string, string> }> = {};

  // Load external component file if specified
  if (args.componentFile) {
    allComponents = loadComponentsFromFile(args.componentFile);
  }

  // Read input
  if (args.inputFile) {
    source = fs.readFileSync(args.inputFile, 'utf-8');
    const { jsx, components: inlineComponents } = parseInlineComponents(source);
    source = jsx;
    // Merge components (inline override external)
    for (const [k, v] of Object.entries(inlineComponents)) {
      allComponents[k] = v;
    }
  } else {
    source = await readStdin();

    // Check if it's a full source file or just JSX
    if (source.includes('const Design') || source.includes('--- components')) {
      const { jsx, components: inlineComponents } = parseInlineComponents(source);
      source = jsx;
      for (const [k, v] of Object.entries(inlineComponents)) {
        allComponents[k] = v;
      }
    }
  }

  if (!source.trim()) {
    console.error('No input provided');
    console.error('Usage: npx tsx generate.tsx --target react-tailwind < input.jsx');
    console.error('       npx tsx generate.tsx --target react-tailwind --input design.tsx');
    console.error('       npx tsx generate.tsx --list-targets');
    process.exit(1);
  }

  // Get default templates only (generator doesn't need state variants)
  const components = getDefaultTemplates(allComponents);

  // Generate code using the target
  let output = target.generate(source.trim(), components);

  // Format if requested and target supports it
  if (args.format && target.format) {
    output = target.format(output);
  }

  // Wrap in component if requested and target supports it
  if (args.componentName && target.wrapInComponent) {
    output = target.wrapInComponent(output, args.componentName);
  }

  // Output
  if (args.outputFile) {
    fs.writeFileSync(args.outputFile, output);
    console.log(`Generated: ${args.outputFile}`);
  } else {
    console.log(output);
  }
}

main();
