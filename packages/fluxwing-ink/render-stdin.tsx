#!/usr/bin/env node
/**
 * Fluxwing Ink - Stdin Renderer
 *
 * Reads JSX from stdin and renders it to ASCII.
 * Usage: echo '<Button>Click</Button>' | npx tsx render-stdin.tsx
 *
 * Or with heredoc:
 * npx tsx render-stdin.tsx <<'EOF'
 * <Card>
 *   <Heading>Hello</Heading>
 *   <Button variant="primary">Click Me</Button>
 * </Card>
 * EOF
 */

import React from 'react';
import { render } from 'ink';
import { transform } from 'sucrase';

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

// Also expose ink primitives
import { Box, Text as InkText } from 'ink';

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

  // Wrap the JSX in a component
  const code = `
    const Component = () => (
      <Box flexDirection="column" padding={1}>
        ${jsxInput}
      </Box>
    );
    return Component;
  `;

  try {
    // Transform JSX to JS
    const transformed = transform(code, {
      transforms: ['jsx'],
      jsxRuntime: 'classic',
      jsxPragma: 'React.createElement',
      jsxFragmentPragma: 'React.Fragment',
    }).code;

    // Create component factory with all dependencies in scope
    const factory = new Function(
      'React',
      'Box',
      'InkText',
      'Text',
      'Heading',
      'Label',
      'Link',
      'Button',
      'ButtonGroup',
      'Input',
      'TextArea',
      'Select',
      'Checkbox',
      'Radio',
      'Card',
      'Panel',
      'Stack',
      'Row',
      'Screen',
      'Divider',
      'Spacer',
      'Alert',
      'Badge',
      'Progress',
      'Spinner',
      'Toast',
      'TabBar',
      'Nav',
      'NavItem',
      'Breadcrumb',
      'Pagination',
      'Table',
      'List',
      transformed
    );

    // Execute to get the component
    const Component = factory(
      React,
      Box,
      InkText,
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
      List
    );

    // Render it
    render(React.createElement(Component));
  } catch (error) {
    console.error('Error rendering JSX:', error);
    process.exit(1);
  }
}

main();
