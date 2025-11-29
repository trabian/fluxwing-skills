#!/usr/bin/env node
/**
 * Fluxwing Ink - Safe Stdin Renderer
 *
 * Parses JSX to AST and constructs React elements WITHOUT eval.
 * Only allows whitelisted component types.
 *
 * Usage: echo '<Button>Click</Button>' | npx tsx render-safe.tsx
 */

import React, { ReactNode, ReactElement } from 'react';
import { render, Box, Text as InkText } from 'ink';
import { parse } from '@babel/parser';
import type { JSXElement, JSXFragment, JSXText, JSXExpressionContainer, Node } from '@babel/types';

// Import all components
import {
  Text,
  Heading,
  Label,
  Link,
  Button,
  ButtonGroup,
  Input,
  TextArea,
  Select,
  Checkbox,
  Radio,
  Card,
  Panel,
  Stack,
  Row,
  Screen,
  Divider,
  Spacer,
  Alert,
  Badge,
  Progress,
  Spinner,
  Toast,
  TabBar,
  Nav,
  NavItem,
  Breadcrumb,
  Pagination,
  Table,
  List,
} from './src/components/index.js';

// Whitelist of allowed components - ONLY these can be rendered
const ALLOWED_COMPONENTS: Record<string, React.ComponentType<any>> = {
  // Ink primitives
  Box,
  InkText,
  // Fluxwing components
  Text,
  Heading,
  Label,
  Link,
  Button,
  ButtonGroup,
  Input,
  TextArea,
  Select,
  Checkbox,
  Radio,
  Card,
  Panel,
  Stack,
  Row,
  Screen,
  Divider,
  Spacer,
  Alert,
  Badge,
  Progress,
  Spinner,
  Toast,
  TabBar,
  Nav,
  NavItem,
  Breadcrumb,
  Pagination,
  Table,
  List,
};

// Safe value parser - NO eval, only literals
function parseValue(node: Node): any {
  switch (node.type) {
    case 'StringLiteral':
      return node.value;
    case 'NumericLiteral':
      return node.value;
    case 'BooleanLiteral':
      return node.value;
    case 'NullLiteral':
      return null;
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
          if (key) {
            obj[key] = parseValue(prop.value);
          }
        }
      }
      return obj;
    case 'UnaryExpression':
      if (node.operator === '-' && node.argument.type === 'NumericLiteral') {
        return -node.argument.value;
      }
      throw new Error(`Unsafe unary expression: ${node.operator}`);
    case 'TemplateLiteral':
      // Only allow simple template literals without expressions
      if (node.expressions.length === 0) {
        return node.quasis.map(q => q.value.cooked).join('');
      }
      throw new Error('Template literals with expressions not allowed');
    default:
      throw new Error(`Unsafe node type: ${node.type}`);
  }
}

// Parse JSX attributes safely
function parseProps(attributes: JSXElement['openingElement']['attributes']): Record<string, any> {
  const props: Record<string, any> = {};

  for (const attr of attributes) {
    if (attr.type === 'JSXAttribute') {
      const name = attr.name.type === 'JSXIdentifier' ? attr.name.name : null;
      if (!name) continue;

      if (attr.value === null) {
        // Boolean attribute like `checked`
        props[name] = true;
      } else if (attr.value.type === 'StringLiteral') {
        props[name] = attr.value.value;
      } else if (attr.value.type === 'JSXExpressionContainer') {
        props[name] = parseValue(attr.value.expression as Node);
      }
    }
    // JSXSpreadAttribute not allowed for safety
  }

  return props;
}

// Convert JSX AST to React elements - NO eval
function jsxToReact(node: Node): ReactNode {
  if (node.type === 'JSXElement') {
    const element = node as JSXElement;
    const tagName = element.openingElement.name;

    // Get component name
    let componentName: string;
    if (tagName.type === 'JSXIdentifier') {
      componentName = tagName.name;
    } else {
      throw new Error(`Unsupported JSX tag type: ${tagName.type}`);
    }

    // Check whitelist
    const Component = ALLOWED_COMPONENTS[componentName];
    if (!Component) {
      throw new Error(`Component not allowed: ${componentName}`);
    }

    // Parse props safely
    const props = parseProps(element.openingElement.attributes);

    // Parse children recursively
    const children = element.children
      .map((child) => jsxToReact(child))
      .filter((child) => child !== null && child !== '');

    // Create React element
    return React.createElement(Component, props, ...children);
  }

  if (node.type === 'JSXFragment') {
    const fragment = node as JSXFragment;
    const children = fragment.children
      .map((child) => jsxToReact(child))
      .filter((child) => child !== null && child !== '');
    return React.createElement(React.Fragment, null, ...children);
  }

  if (node.type === 'JSXText') {
    const text = (node as JSXText).value.trim();
    return text || null;
  }

  if (node.type === 'JSXExpressionContainer') {
    const container = node as JSXExpressionContainer;
    if (container.expression.type === 'JSXEmptyExpression') {
      return null;
    }
    // Only allow simple literal expressions
    return parseValue(container.expression as Node);
  }

  return null;
}

// Read stdin
async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

async function main() {
  const jsxInput = await readStdin();

  if (!jsxInput.trim()) {
    console.error('Error: No JSX provided via stdin');
    process.exit(1);
  }

  try {
    // Wrap in fragment for parsing
    const wrapped = `<>${jsxInput}</>`;

    // Parse JSX to AST - no code execution
    const ast = parse(wrapped, {
      sourceType: 'module',
      plugins: ['jsx'],
    });

    // Find the JSX expression
    const statement = ast.program.body[0];
    if (statement.type !== 'ExpressionStatement') {
      throw new Error('Expected JSX expression');
    }

    // Convert AST to React elements - no eval
    const element = jsxToReact(statement.expression);

    // Wrap in container and render
    const Container = () => (
      <Box flexDirection="column" padding={1}>
        {element}
      </Box>
    );

    render(<Container />);
  } catch (error) {
    console.error('Error rendering JSX:', error);
    process.exit(1);
  }
}

main();
