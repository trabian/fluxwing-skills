#!/usr/bin/env node
/**
 * Fluxwing Ink - Renderer with Custom Components
 *
 * Supports defining reusable components in the input.
 *
 * Usage:
 *   npx tsx render.tsx -w 60 <<'EOF'
 *   --- components
 *   HoldingRow: <Row><Text bold>{symbol}</Text><Text>{value}</Text><Text color={change.startsWith("+") ? "green" : "red"}>{change}</Text></Row>
 *   ---
 *   <Card>
 *     <HoldingRow symbol="AAPL" value="$142K" change="+2.3%" />
 *     <HoldingRow symbol="MSFT" value="$128K" change="+1.8%" />
 *     <HoldingRow symbol="BRK.B" value="$87K" change="-0.2%" />
 *   </Card>
 *   EOF
 *
 * Or load from a file:
 *   npx tsx render.tsx -w 60 --components ./my-components.yml <<< '<MyComponent />'
 */

import React from 'react';
import { render } from 'ink-testing-library';
import { Box, Text as InkText } from 'ink';
import { transform } from 'sucrase';
import * as fs from 'fs';

// Import all built-in components
import {
  Text, Heading, Label, Link,
  Button, ButtonGroup,
  Input, TextArea, Select, Checkbox, Radio,
  Card, Panel, Stack, Row, Screen, Divider, Spacer,
  Alert, Badge, Progress, Spinner, Toast,
  TabBar, Nav, NavItem, Breadcrumb, Pagination,
  Table, List,
} from './src/components/index.js';

// Built-in components registry
const BUILTIN_COMPONENTS: Record<string, React.ComponentType<any>> = {
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
function parseArgs(): { width: number; componentsFile?: string } {
  const args = process.argv.slice(2);
  let width = 70;
  let componentsFile: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--width' || args[i] === '-w') && args[i + 1]) {
      width = parseInt(args[i + 1], 10);
      i++;
    } else if ((args[i] === '--components' || args[i] === '-c') && args[i + 1]) {
      componentsFile = args[i + 1];
      i++;
    }
  }

  return { width, componentsFile };
}

// Read stdin
async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

// Parse inline component definitions
// Format:
// --- components
// ComponentName: <JSX template with {prop} placeholders>
// ---
function parseInlineComponents(input: string): { components: Record<string, string>; jsx: string } {
  const components: Record<string, string> = {};

  const componentBlockMatch = input.match(/---\s*components\s*\n([\s\S]*?)\n---/);

  if (componentBlockMatch) {
    const block = componentBlockMatch[1];
    const lines = block.split('\n');

    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const [, name, template] = match;
        components[name] = template.trim();
      }
    }

    // Remove the component block from input
    const jsx = input.replace(/---\s*components\s*\n[\s\S]*?\n---\s*/, '').trim();
    return { components, jsx };
  }

  return { components, jsx: input.trim() };
}

// Load components from a YAML-like file
function loadComponentsFromFile(filepath: string): Record<string, string> {
  const components: Record<string, string> = {};

  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split('\n');

    let currentName: string | null = null;
    let currentTemplate: string[] = [];

    for (const line of lines) {
      // New component definition
      const nameMatch = line.match(/^(\w+):$/);
      if (nameMatch) {
        // Save previous component
        if (currentName && currentTemplate.length > 0) {
          components[currentName] = currentTemplate.join('\n').trim();
        }
        currentName = nameMatch[1];
        currentTemplate = [];
        continue;
      }

      // Single-line definition: ComponentName: <template>
      const inlineMatch = line.match(/^(\w+):\s*(<.+>)$/);
      if (inlineMatch) {
        components[inlineMatch[1]] = inlineMatch[2];
        continue;
      }

      // Multi-line template content (indented)
      if (currentName && (line.startsWith('  ') || line.startsWith('\t'))) {
        currentTemplate.push(line.trim());
      }
    }

    // Save last component
    if (currentName && currentTemplate.length > 0) {
      components[currentName] = currentTemplate.join('\n').trim();
    }
  } catch (e) {
    console.error(`Warning: Could not load components from ${filepath}`);
  }

  return components;
}

// Create component factories from templates
function createCustomComponents(templates: Record<string, string>): Record<string, React.ComponentType<any>> {
  const customComponents: Record<string, React.ComponentType<any>> = {};

  for (const [name, template] of Object.entries(templates)) {
    // Create a component that renders the template with props substituted
    customComponents[name] = (props: Record<string, any>) => {
      let jsx = template;

      // 1. Handle ternary expressions FIRST: {prop.startsWith("+") ? "green" : "red"}
      // Returns quoted string result
      jsx = jsx.replace(
        /\{(\w+)\.startsWith\("([^"]+)"\)\s*\?\s*"([^"]+)"\s*:\s*"([^"]+)"\}/g,
        (match, propName, prefix, ifTrue, ifFalse) => {
          const value = props[propName];
          if (typeof value === 'string') {
            return `"${value.startsWith(prefix) ? ifTrue : ifFalse}"`;
          }
          return `"${ifFalse}"`;
        }
      );

      // 2. Handle simple ternary: {prop ? "a" : "b"} (truthy check)
      jsx = jsx.replace(
        /\{(\w+)\s*\?\s*"([^"]+)"\s*:\s*"([^"]+)"\}/g,
        (match, propName, ifTrue, ifFalse) => {
          const value = props[propName];
          return `"${value ? ifTrue : ifFalse}"`;
        }
      );

      // 3. Handle numeric props: {prop} where prop is number -> keep as expression
      // 4. Handle string props in text content: {prop} -> just the value
      jsx = jsx.replace(/\{(\w+)\}/g, (match, propName) => {
        const value = props[propName];
        if (value === undefined) return match;
        if (typeof value === 'number') return `{${value}}`;
        // For strings, just return the value (will be text content or attr value)
        return String(value);
      });

      // Now render this JSX
      const code = `return (${jsx});`;
      const transformed = transform(code, {
        transforms: ['jsx'],
        jsxRuntime: 'classic',
        jsxPragma: 'React.createElement',
        jsxFragmentPragma: 'React.Fragment',
      }).code;

      const allComponents = { ...BUILTIN_COMPONENTS, ...customComponents };
      const componentNames = Object.keys(allComponents);
      const componentValues = componentNames.map(k => allComponents[k]);

      const factory = new Function('React', ...componentNames, transformed);
      return factory(React, ...componentValues);
    };
  }

  return customComponents;
}

// Main render function
function renderJsx(jsx: string, width: number, customComponents: Record<string, React.ComponentType<any>>): string {
  const allComponents = { ...BUILTIN_COMPONENTS, ...customComponents };

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

  const componentNames = Object.keys(allComponents);
  const componentValues = componentNames.map(k => allComponents[k]);

  const factory = new Function('React', ...componentNames, transformed);
  const Component = factory(React, ...componentValues);

  const { lastFrame } = render(React.createElement(Component));
  return lastFrame() || '';
}

// === MAIN ===
async function main() {
  const { width, componentsFile } = parseArgs();
  const input = await readStdin();

  if (!input.trim()) {
    console.error('Error: No JSX provided via stdin');
    process.exit(1);
  }

  try {
    // Parse inline component definitions
    const { components: inlineComponents, jsx } = parseInlineComponents(input);

    // Load components from file if specified
    const fileComponents = componentsFile ? loadComponentsFromFile(componentsFile) : {};

    // Merge all custom component templates
    const allTemplates = { ...fileComponents, ...inlineComponents };

    // Create component factories
    const customComponents = createCustomComponents(allTemplates);

    // Render
    const output = renderJsx(jsx, width, customComponents);

    console.log('```');
    console.log(output);
    console.log('```');
  } catch (error) {
    console.error('Render error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
