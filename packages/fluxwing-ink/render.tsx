#!/usr/bin/env node
/**
 * Fluxwing Ink - Clean Renderer
 *
 * Renders JSX to ASCII string with fixed width for consistent output.
 * Output is clean and ready for display.
 *
 * Usage:
 *   npx tsx render.tsx <<< '<Button>Click</Button>'
 *   npx tsx render.tsx --width 60 <<< '<Card><Text>Hello</Text></Card>'
 *
 * Options:
 *   --width, -w    Set render width (default: 70)
 *   --safe, -s     Use safe AST-only mode (no eval)
 */

import React from 'react';
import { render } from 'ink-testing-library';
import { Box, Text as InkText } from 'ink';
import { transform } from 'sucrase';
import { parse } from '@babel/parser';
import type { Node, JSXElement, JSXFragment, JSXText, JSXExpressionContainer } from '@babel/types';

// Import all components
import {
  Text, Heading, Label, Link,
  Button, ButtonGroup,
  Input, TextArea, Select, Checkbox, Radio,
  Card, Panel, Stack, Row, Screen, Divider, Spacer,
  Alert, Badge, Progress, Spinner, Toast,
  TabBar, Nav, NavItem, Breadcrumb, Pagination,
  Table, List,
} from './src/components/index.js';

// All available components
const COMPONENTS: Record<string, React.ComponentType<any>> = {
  Box, InkText,
  Text, Heading, Label, Link,
  Button, ButtonGroup,
  Input, TextArea, Select, Checkbox, Radio,
  Card, Panel, Stack, Row, Screen, Divider, Spacer,
  Alert, Badge, Progress, Spinner, Toast,
  TabBar, Nav, NavItem, Breadcrumb, Pagination,
  Table, List,
};

// Parse CLI args
function parseArgs(): { width: number; safe: boolean } {
  const args = process.argv.slice(2);
  let width = 70;
  let safe = false;

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--width' || args[i] === '-w') && args[i + 1]) {
      width = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--safe' || args[i] === '-s') {
      safe = true;
    }
  }

  return { width, safe };
}

// Read stdin
async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

// === FAST MODE (eval-based) ===
function renderFast(jsx: string, width: number): string {
  const code = `
    const Component = () => (
      <Box flexDirection="column" width={${width}}>
        ${jsx}
      </Box>
    );
    return Component;
  `;

  const transformed = transform(code, {
    transforms: ['jsx'],
    jsxRuntime: 'classic',
    jsxPragma: 'React.createElement',
    jsxFragmentPragma: 'React.Fragment',
  }).code;

  const factory = new Function(
    'React', 'Box', 'InkText',
    ...Object.keys(COMPONENTS).filter(k => k !== 'Box' && k !== 'InkText'),
    transformed
  );

  const Component = factory(
    React, Box, InkText,
    ...Object.keys(COMPONENTS).filter(k => k !== 'Box' && k !== 'InkText').map(k => COMPONENTS[k])
  );

  const { lastFrame } = render(React.createElement(Component));
  return lastFrame() || '';
}

// === SAFE MODE (AST-based, no eval) ===
function parseValue(node: Node): any {
  switch (node.type) {
    case 'StringLiteral': return node.value;
    case 'NumericLiteral': return node.value;
    case 'BooleanLiteral': return node.value;
    case 'NullLiteral': return null;
    case 'Identifier':
      if (node.name === 'undefined') return undefined;
      if (node.name === 'true') return true;
      if (node.name === 'false') return false;
      throw new Error(`Unsafe identifier: ${node.name}`);
    case 'ArrayExpression':
      return node.elements.map((el) => el ? parseValue(el) : null);
    case 'ObjectExpression':
      const obj: Record<string, any> = {};
      for (const prop of node.properties) {
        if (prop.type === 'ObjectProperty') {
          const key = prop.key.type === 'Identifier' ? prop.key.name :
                      prop.key.type === 'StringLiteral' ? prop.key.value : null;
          if (key) obj[key] = parseValue(prop.value);
        }
      }
      return obj;
    case 'UnaryExpression':
      if (node.operator === '-' && node.argument.type === 'NumericLiteral') {
        return -node.argument.value;
      }
      throw new Error(`Unsafe unary: ${node.operator}`);
    default:
      throw new Error(`Unsafe node type: ${node.type}`);
  }
}

function parseProps(attrs: JSXElement['openingElement']['attributes']): Record<string, any> {
  const props: Record<string, any> = {};
  for (const attr of attrs) {
    if (attr.type === 'JSXAttribute') {
      const name = attr.name.type === 'JSXIdentifier' ? attr.name.name : null;
      if (!name) continue;
      if (attr.value === null) {
        props[name] = true;
      } else if (attr.value.type === 'StringLiteral') {
        props[name] = attr.value.value;
      } else if (attr.value.type === 'JSXExpressionContainer') {
        props[name] = parseValue(attr.value.expression as Node);
      }
    }
  }
  return props;
}

function jsxToReact(node: Node): React.ReactNode {
  if (node.type === 'JSXElement') {
    const el = node as JSXElement;
    const tagName = el.openingElement.name;
    const componentName = tagName.type === 'JSXIdentifier' ? tagName.name : null;
    if (!componentName) throw new Error('Invalid tag');

    const Component = COMPONENTS[componentName];
    if (!Component) throw new Error(`Unknown component: ${componentName}`);

    const props = parseProps(el.openingElement.attributes);
    const children = el.children.map(c => jsxToReact(c)).filter(c => c !== null && c !== '');

    return React.createElement(Component, props, ...children);
  }
  if (node.type === 'JSXFragment') {
    const children = (node as JSXFragment).children.map(c => jsxToReact(c)).filter(c => c !== null && c !== '');
    return React.createElement(React.Fragment, null, ...children);
  }
  if (node.type === 'JSXText') {
    const text = (node as JSXText).value.trim();
    return text || null;
  }
  if (node.type === 'JSXExpressionContainer') {
    const container = node as JSXExpressionContainer;
    if (container.expression.type === 'JSXEmptyExpression') return null;
    return parseValue(container.expression as Node);
  }
  return null;
}

function renderSafe(jsx: string, width: number): string {
  const wrapped = `<>${jsx}</>`;
  const ast = parse(wrapped, { sourceType: 'module', plugins: ['jsx'] });
  const stmt = ast.program.body[0];
  if (stmt.type !== 'ExpressionStatement') throw new Error('Expected JSX');

  const element = jsxToReact(stmt.expression);
  const Container = () => React.createElement(Box, { flexDirection: 'column', width }, element);

  const { lastFrame } = render(React.createElement(Container));
  return lastFrame() || '';
}

// === MAIN ===
async function main() {
  const { width, safe } = parseArgs();
  const jsx = await readStdin();

  if (!jsx.trim()) {
    console.error('Error: No JSX provided via stdin');
    process.exit(1);
  }

  try {
    const output = safe ? renderSafe(jsx, width) : renderFast(jsx, width);

    // Output with clear delimiters for easy parsing
    console.log('```');
    console.log(output);
    console.log('```');
  } catch (error) {
    console.error('Render error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
