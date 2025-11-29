#!/usr/bin/env npx tsx
/**
 * Fluxwing Import Helper
 *
 * Saves imported JSX with source metadata.
 *
 * Usage:
 *   npx tsx import.tsx --source screenshot.png --save ./fluxwing/screens/login <<'EOF'
 *   <Card title="Login">...</Card>
 *   EOF
 */

import * as fs from 'fs';
import * as path from 'path';
import { render } from 'ink-testing-library';
import React from 'react';

// ============================================================================
// CLI
// ============================================================================

interface CliArgs {
  source?: string;
  savePath?: string;
  width: number;
  notes?: string;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    width: 60,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-s' || arg === '--source') {
      result.source = args[++i];
    } else if (arg === '--save') {
      result.savePath = args[++i];
    } else if (arg === '-w' || arg === '--width') {
      result.width = parseInt(args[++i], 10);
    } else if (arg === '-n' || arg === '--notes') {
      result.notes = args[++i];
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
    setTimeout(() => resolve(data), 100);
  });
}

function saveImport(
  savePath: string,
  jsx: string,
  source: string | undefined,
  notes: string | undefined,
  width: number
): void {
  const dir = path.dirname(savePath);
  const baseName = path.basename(savePath).replace(/\.[^.]+$/, '');

  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Create .tsx source file with import metadata
  const timestamp = new Date().toISOString();
  const sourceComment = source ? `\n * Source: ${source}` : '';
  const notesComment = notes ? `\n * Notes: ${notes}` : '';

  const tsxContent = `/**
 * Fluxwing Import
 * Generated: ${timestamp}${sourceComment}${notesComment}
 */

// Design JSX
const Design = () => (
  <>
    ${jsx.split('\n').join('\n    ')}
  </>
);

export default Design;
`;

  fs.writeFileSync(`${savePath}.tsx`, tsxContent);

  // Create .meta.json with import metadata
  const meta = {
    version: '1.0.0',
    created: timestamp,
    type: 'import',
    source: source || null,
    notes: notes || null,
    width,
  };

  fs.writeFileSync(`${savePath}.meta.json`, JSON.stringify(meta, null, 2));

  console.log(`Saved:`);
  console.log(`  ${savePath}.tsx (source)`);
  console.log(`  ${savePath}.meta.json (metadata)`);
}

async function main() {
  const args = parseArgs();
  const jsx = await readStdin();

  if (!jsx.trim()) {
    console.error('No JSX input provided');
    console.error('Usage: npx tsx import.tsx --source screenshot.png --save ./path <<< "<JSX>"');
    process.exit(1);
  }

  if (args.savePath) {
    saveImport(args.savePath, jsx.trim(), args.source, args.notes, args.width);
  } else {
    // Just output the JSX with metadata as comments
    const sourceComment = args.source ? `{/* Imported from: ${args.source} */}\n` : '';
    const notesComment = args.notes ? `{/* Notes: ${args.notes} */}\n` : '';
    console.log(sourceComment + notesComment + jsx.trim());
  }
}

main();
