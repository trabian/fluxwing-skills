#!/usr/bin/env node
/**
 * Fluxwing Ink - Renderer with Custom Components, States, and Persistence
 *
 * Features:
 * - Custom reusable components (inline or from file)
 * - State variants (hover, focus, disabled, etc.)
 * - Save designs to files with metadata
 *
 * Usage:
 *   # Basic render
 *   npx tsx render.tsx -w 60 <<< '<Button>Click</Button>'
 *
 *   # With custom components
 *   npx tsx render.tsx -w 60 <<'EOF'
 *   --- components
 *   MyButton: <Button variant="primary">{label}</Button>
 *   MyButton[hover]: <Button variant="primary" color="cyan">{label}</Button>
 *   MyButton[disabled]: <Button variant="outline" disabled>{label}</Button>
 *   ---
 *   <MyButton label="Click Me" />
 *   <MyButton label="Hovered" state="hover" />
 *   <MyButton label="Disabled" state="disabled" />
 *   EOF
 *
 *   # Save to file
 *   npx tsx render.tsx -w 60 --save ./fluxwing/screens/login <<< '<Card>...</Card>'
 *
 *   # Load components from file
 *   npx tsx render.tsx -c components/finance.yml <<< '<HoldingRow ... />'
 */

import React from 'react';
import { render } from 'ink-testing-library';
import { Box, Text as InkText } from 'ink';
import { transform } from 'sucrase';
import * as fs from 'fs';
import * as path from 'path';

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

// CLI arguments
interface CliArgs {
  width: number;
  componentsFile?: string;
  savePath?: string;
  showStates?: boolean;
}

// Parse CLI args
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  let width = 70;
  let componentsFile: string | undefined;
  let savePath: string | undefined;
  let showStates = false;

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--width' || args[i] === '-w') && args[i + 1]) {
      width = parseInt(args[i + 1], 10);
      i++;
    } else if ((args[i] === '--components' || args[i] === '-c') && args[i + 1]) {
      componentsFile = args[i + 1];
      i++;
    } else if ((args[i] === '--save' || args[i] === '-s') && args[i + 1]) {
      savePath = args[i + 1];
      i++;
    } else if (args[i] === '--states') {
      showStates = true;
    }
  }

  return { width, componentsFile, savePath, showStates };
}

// Read stdin
async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

// Component with states
interface ComponentDefinition {
  default: string;
  states: Record<string, string>;  // hover, focus, disabled, active, error, etc.
}

// Parse inline component definitions with state support
// Format:
// --- components
// Button: <Box borderStyle="single">...</Box>
// Button[hover]: <Box borderStyle="double">...</Box>
// Button[disabled]: <Box borderColor="gray">...</Box>
// ---
function parseInlineComponents(input: string): {
  components: Record<string, ComponentDefinition>;
  jsx: string;
} {
  const components: Record<string, ComponentDefinition> = {};

  const componentBlockMatch = input.match(/---\s*components\s*\n([\s\S]*?)\n---/);

  if (componentBlockMatch) {
    const block = componentBlockMatch[1];
    const lines = block.split('\n');

    for (const line of lines) {
      // Match: ComponentName[state]: <template> or ComponentName: <template>
      const match = line.match(/^(\w+)(?:\[(\w+)\])?:\s*(.+)$/);
      if (match) {
        const [, name, state, template] = match;

        if (!components[name]) {
          components[name] = { default: '', states: {} };
        }

        if (state) {
          components[name].states[state] = template.trim();
        } else {
          components[name].default = template.trim();
        }
      }
    }

    // Remove the component block from input
    const jsx = input.replace(/---\s*components\s*\n[\s\S]*?\n---\s*/, '').trim();
    return { components, jsx };
  }

  return { components, jsx: input.trim() };
}

// Load components from a YAML-like file (with state support)
function loadComponentsFromFile(filepath: string): Record<string, ComponentDefinition> {
  const components: Record<string, ComponentDefinition> = {};

  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split('\n');

    for (const line of lines) {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || !line.trim()) continue;

      // Match: ComponentName[state]: <template> or ComponentName: <template>
      const match = line.match(/^(\w+)(?:\[(\w+)\])?:\s*(<.+>)$/);
      if (match) {
        const [, name, state, template] = match;

        if (!components[name]) {
          components[name] = { default: '', states: {} };
        }

        if (state) {
          components[name].states[state] = template;
        } else {
          components[name].default = template;
        }
      }
    }
  } catch (e) {
    console.error(`Warning: Could not load components from ${filepath}`);
  }

  return components;
}

// Create component factories from templates with state support
function createCustomComponents(
  definitions: Record<string, ComponentDefinition>,
  allBuiltins: Record<string, React.ComponentType<any>>
): Record<string, React.ComponentType<any>> {
  const customComponents: Record<string, React.ComponentType<any>> = {};

  for (const [name, def] of Object.entries(definitions)) {
    customComponents[name] = (props: Record<string, any>) => {
      // Select template based on state prop
      const state = props.state as string | undefined;
      let template = def.default;

      if (state && def.states[state]) {
        template = def.states[state];
      }

      if (!template) {
        console.error(`No template for ${name}${state ? `[${state}]` : ''}`);
        return null;
      }

      let jsx = template;

      // 1. Handle ternary expressions: {prop.startsWith("+") ? "green" : "red"}
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

      // 2. Handle simple ternary: {prop ? "a" : "b"}
      jsx = jsx.replace(
        /\{(\w+)\s*\?\s*"([^"]+)"\s*:\s*"([^"]+)"\}/g,
        (match, propName, ifTrue, ifFalse) => {
          const value = props[propName];
          return `"${value ? ifTrue : ifFalse}"`;
        }
      );

      // 3. Handle prop substitution
      jsx = jsx.replace(/\{(\w+)\}/g, (match, propName) => {
        if (propName === 'state') return ''; // Don't substitute state prop
        const value = props[propName];
        if (value === undefined) return match;
        if (typeof value === 'number') return `{${value}}`;
        return String(value);
      });

      // Render the JSX
      const code = `return (${jsx});`;
      const transformed = transform(code, {
        transforms: ['jsx'],
        jsxRuntime: 'classic',
        jsxPragma: 'React.createElement',
        jsxFragmentPragma: 'React.Fragment',
      }).code;

      const allComponents = { ...allBuiltins, ...customComponents };
      const componentNames = Object.keys(allComponents);
      const componentValues = componentNames.map(k => allComponents[k]);

      const factory = new Function('React', ...componentNames, transformed);
      return factory(React, ...componentValues);
    };
  }

  return customComponents;
}

// Main render function
function renderJsx(
  jsx: string,
  width: number,
  customComponents: Record<string, React.ComponentType<any>>
): string {
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

// Save design to files
function saveDesign(
  savePath: string,
  jsx: string,
  asciiOutput: string,
  componentDefs: Record<string, ComponentDefinition>,
  width: number
): void {
  // Ensure directory exists
  const dir = path.dirname(savePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Save the JSX source
  const jsxPath = savePath.endsWith('.tsx') ? savePath : `${savePath}.tsx`;
  const jsxContent = generateJsxFile(jsx, componentDefs);
  fs.writeFileSync(jsxPath, jsxContent);

  // Save the ASCII preview
  const previewPath = savePath.replace(/\.tsx$/, '') + '.preview.txt';
  fs.writeFileSync(previewPath, asciiOutput);

  // Save metadata
  const metaPath = savePath.replace(/\.tsx$/, '') + '.meta.json';
  const metadata = {
    version: '1.0.0',
    created: new Date().toISOString(),
    width,
    components: Object.keys(componentDefs),
    states: Object.fromEntries(
      Object.entries(componentDefs).map(([name, def]) => [
        name,
        ['default', ...Object.keys(def.states)]
      ])
    ),
  };
  fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));

  console.error(`Saved:`);
  console.error(`  ${jsxPath} (source)`);
  console.error(`  ${previewPath} (preview)`);
  console.error(`  ${metaPath} (metadata)`);
}

// Generate a complete JSX file
function generateJsxFile(
  jsx: string,
  componentDefs: Record<string, ComponentDefinition>
): string {
  const hasCustomComponents = Object.keys(componentDefs).length > 0;

  let content = `/**
 * Fluxwing Design
 * Generated: ${new Date().toISOString()}
 */

`;

  // Add component definitions as comments for reference
  if (hasCustomComponents) {
    content += `/*
--- components
${Object.entries(componentDefs).map(([name, def]) => {
  const lines = [`${name}: ${def.default}`];
  for (const [state, template] of Object.entries(def.states)) {
    lines.push(`${name}[${state}]: ${template}`);
  }
  return lines.join('\n');
}).join('\n')}
---
*/

`;
  }

  content += `// Design JSX
const Design = () => (
  <>
${jsx.split('\n').map(line => `    ${line}`).join('\n')}
  </>
);

export default Design;
`;

  return content;
}

// Show all states for components
function showAllStates(
  componentDefs: Record<string, ComponentDefinition>,
  customComponents: Record<string, React.ComponentType<any>>,
  width: number
): string {
  const outputs: string[] = [];

  for (const [name, def] of Object.entries(componentDefs)) {
    const states = ['default', ...Object.keys(def.states)];

    outputs.push(`\n### ${name}`);
    outputs.push('');

    for (const state of states) {
      const stateLabel = state === 'default' ? '' : ` state="${state}"`;
      const jsx = `<${name} label="Example"${stateLabel} />`;

      const rendered = renderJsx(jsx, width, customComponents);
      outputs.push(`**${state}:**`);
      outputs.push('```');
      outputs.push(rendered);
      outputs.push('```');
    }
  }

  return outputs.join('\n');
}

// === MAIN ===
async function main() {
  const { width, componentsFile, savePath, showStates } = parseArgs();
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

    // Merge all component definitions
    const allDefs: Record<string, ComponentDefinition> = {};
    for (const [name, def] of Object.entries(fileComponents)) {
      allDefs[name] = def;
    }
    for (const [name, def] of Object.entries(inlineComponents)) {
      if (allDefs[name]) {
        // Merge states
        allDefs[name].default = def.default || allDefs[name].default;
        allDefs[name].states = { ...allDefs[name].states, ...def.states };
      } else {
        allDefs[name] = def;
      }
    }

    // Create component factories
    const customComponents = createCustomComponents(allDefs, BUILTIN_COMPONENTS);

    // Show all states if requested
    if (showStates && Object.keys(allDefs).length > 0) {
      const statesOutput = showAllStates(allDefs, customComponents, width);
      console.log(statesOutput);
      return;
    }

    // Render
    const output = renderJsx(jsx, width, customComponents);

    // Save if requested
    if (savePath) {
      saveDesign(savePath, jsx, output, allDefs, width);
    }

    // Output
    console.log('```');
    console.log(output);
    console.log('```');
  } catch (error) {
    console.error('Render error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
