#!/usr/bin/env npx tsx
/**
 * Fluxwing Validator
 *
 * Validates component JSX and custom component definitions.
 *
 * Usage:
 *   npx tsx validate.tsx < design.jsx
 *   npx tsx validate.tsx --input ./fluxwing/screens/login.tsx
 *   npx tsx validate.tsx -c components/finance.yml --check-components
 */

import * as fs from 'fs';
import * as parser from '@babel/parser';
import * as t from '@babel/types';

// ============================================================================
// Known Components and Their Props
// ============================================================================

interface PropDef {
  type: 'string' | 'number' | 'boolean' | 'array' | 'enum';
  required?: boolean;
  enum?: string[];
  description?: string;
}

interface ComponentDef {
  props: Record<string, PropDef>;
  description?: string;
  children?: 'required' | 'optional' | 'none';
}

const knownComponents: Record<string, ComponentDef> = {
  // Layout
  Box: {
    props: {
      width: { type: 'number', description: 'Width in characters' },
      height: { type: 'number', description: 'Height in characters' },
      padding: { type: 'number', description: 'Padding level (0-3)' },
      margin: { type: 'number', description: 'Margin level (0-3)' },
    },
    children: 'optional',
  },
  Stack: {
    props: {
      gap: { type: 'number', description: 'Gap between children (0-3)' },
      align: { type: 'enum', enum: ['start', 'center', 'end', 'stretch'] },
    },
    children: 'required',
  },
  Row: {
    props: {
      gap: { type: 'number', description: 'Gap between children (0-3)' },
      justify: { type: 'enum', enum: ['start', 'center', 'end', 'between', 'around'] },
      align: { type: 'enum', enum: ['start', 'center', 'end'] },
    },
    children: 'required',
  },
  Spacer: {
    props: {},
    children: 'none',
  },
  Divider: {
    props: {
      style: { type: 'enum', enum: ['single', 'double', 'dashed'] },
    },
    children: 'none',
  },

  // Text
  Text: {
    props: {
      bold: { type: 'boolean' },
      italic: { type: 'boolean' },
      underline: { type: 'boolean' },
      dimmed: { type: 'boolean' },
      dimColor: { type: 'boolean' },
      color: { type: 'enum', enum: ['green', 'red', 'blue', 'yellow', 'gray', 'white'] },
    },
    children: 'required',
  },
  Heading: {
    props: {
      level: { type: 'enum', enum: ['1', '2', '3', '4'] },
    },
    children: 'required',
  },

  // Interactive
  Button: {
    props: {
      variant: { type: 'enum', enum: ['primary', 'secondary', 'outline', 'danger', 'success'] },
      disabled: { type: 'boolean' },
      borderStyle: { type: 'enum', enum: ['single', 'double', 'round', 'bold'] },
    },
    children: 'required',
    description: 'Clickable button component',
  },
  Input: {
    props: {
      label: { type: 'string', description: 'Field label' },
      placeholder: { type: 'string', description: 'Placeholder text' },
      type: { type: 'enum', enum: ['text', 'password', 'email', 'number'] },
      disabled: { type: 'boolean' },
      width: { type: 'number' },
    },
    children: 'none',
  },
  Select: {
    props: {
      label: { type: 'string' },
      options: { type: 'array', required: true, description: 'Array of option strings' },
      disabled: { type: 'boolean' },
    },
    children: 'none',
  },
  Checkbox: {
    props: {
      label: { type: 'string' },
      checked: { type: 'boolean' },
      disabled: { type: 'boolean' },
    },
    children: 'optional',
  },

  // Containers
  Card: {
    props: {
      title: { type: 'string', description: 'Card header title' },
      borderStyle: { type: 'enum', enum: ['single', 'double', 'round', 'bold'] },
    },
    children: 'required',
    description: 'Container with optional title and border',
  },
  Panel: {
    props: {
      title: { type: 'string' },
    },
    children: 'required',
  },

  // Feedback
  Alert: {
    props: {
      variant: { type: 'enum', enum: ['info', 'success', 'warning', 'error'], required: true },
    },
    children: 'required',
  },
  Badge: {
    props: {
      variant: { type: 'enum', enum: ['default', 'primary', 'success', 'warning', 'danger'] },
    },
    children: 'required',
  },
  ProgressBar: {
    props: {
      value: { type: 'number', required: true, description: 'Progress percentage (0-100)' },
      color: { type: 'enum', enum: ['blue', 'green', 'red', 'yellow'] },
    },
    children: 'none',
  },
  Spinner: {
    props: {
      size: { type: 'enum', enum: ['sm', 'md', 'lg'] },
    },
    children: 'none',
  },

  // Navigation
  Link: {
    props: {
      href: { type: 'string' },
    },
    children: 'required',
  },
  Tabs: {
    props: {
      tabs: { type: 'array', required: true },
      activeIndex: { type: 'number' },
    },
    children: 'none',
  },

  // Table
  Table: { props: {}, children: 'required' },
  TableHeader: { props: {}, children: 'required' },
  TableBody: { props: {}, children: 'required' },
  TableRow: { props: {}, children: 'required' },
  TableCell: { props: {}, children: 'required' },
  TableHeaderCell: { props: {}, children: 'required' },
};

// ============================================================================
// Validation Types
// ============================================================================

interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  location?: { line: number; column: number };
  component?: string;
  prop?: string;
}

interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  stats: {
    components: number;
    customComponents: number;
    comments: number;
  };
}

// ============================================================================
// Validators
// ============================================================================

function validateJSX(jsx: string, customComponents: Map<string, string>): ValidationResult {
  const issues: ValidationIssue[] = [];
  const stats = { components: 0, customComponents: 0, comments: 0 };

  // Try to parse the JSX
  try {
    const ast = parser.parse(`<>${jsx}</>`, {
      sourceType: 'module',
      plugins: ['jsx'],
    });

    const expr = (ast.program.body[0] as t.ExpressionStatement).expression;

    if (t.isJSXFragment(expr) || t.isJSXElement(expr)) {
      validateNode(expr, issues, stats, customComponents);
    }
  } catch (error: any) {
    issues.push({
      type: 'error',
      message: `Parse error: ${error.message}`,
      location: error.loc ? { line: error.loc.line, column: error.loc.column } : undefined,
    });
  }

  return {
    valid: !issues.some(i => i.type === 'error'),
    issues,
    stats,
  };
}

function validateNode(
  node: t.Node,
  issues: ValidationIssue[],
  stats: { components: number; customComponents: number; comments: number },
  customComponents: Map<string, string>
): void {
  if (t.isJSXElement(node)) {
    const name = (node.openingElement.name as t.JSXIdentifier).name;
    stats.components++;

    // Check if it's a known component
    const componentDef = knownComponents[name];
    const isCustom = customComponents.has(name);

    if (!componentDef && !isCustom) {
      issues.push({
        type: 'warning',
        message: `Unknown component: ${name}`,
        component: name,
        location: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : undefined,
      });
    } else if (isCustom) {
      stats.customComponents++;
    }

    // Validate props if we have a definition
    if (componentDef) {
      validateProps(node.openingElement, componentDef, name, issues);
      validateChildren(node, componentDef, name, issues);
    }

    // Recursively validate children
    for (const child of node.children) {
      validateNode(child, issues, stats, customComponents);
    }
  } else if (t.isJSXFragment(node)) {
    for (const child of node.children) {
      validateNode(child, issues, stats, customComponents);
    }
  } else if (t.isJSXExpressionContainer(node)) {
    // Count comments
    if (t.isJSXEmptyExpression(node.expression)) {
      const comments = (node.expression as any).innerComments || [];
      stats.comments += comments.length;
    }
  }
}

function validateProps(
  openingElement: t.JSXOpeningElement,
  componentDef: ComponentDef,
  componentName: string,
  issues: ValidationIssue[]
): void {
  const providedProps = new Set<string>();

  for (const attr of openingElement.attributes) {
    if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
      const propName = attr.name.name;
      providedProps.add(propName);

      // Skip special props
      if (propName === 'state' || propName === 'key') continue;

      const propDef = componentDef.props[propName];

      if (!propDef) {
        issues.push({
          type: 'warning',
          message: `Unknown prop "${propName}" on ${componentName}`,
          component: componentName,
          prop: propName,
        });
        continue;
      }

      // Validate prop value type
      const value = extractPropValue(attr);
      if (value !== undefined) {
        validatePropValue(value, propDef, propName, componentName, issues);
      }
    }
  }

  // Check for required props
  for (const [propName, propDef] of Object.entries(componentDef.props)) {
    if (propDef.required && !providedProps.has(propName)) {
      issues.push({
        type: 'error',
        message: `Missing required prop "${propName}" on ${componentName}`,
        component: componentName,
        prop: propName,
      });
    }
  }
}

function extractPropValue(attr: t.JSXAttribute): any {
  if (attr.value === null) {
    return true; // Boolean shorthand
  }
  if (t.isStringLiteral(attr.value)) {
    return attr.value.value;
  }
  if (t.isJSXExpressionContainer(attr.value)) {
    if (t.isStringLiteral(attr.value.expression)) {
      return attr.value.expression.value;
    }
    if (t.isNumericLiteral(attr.value.expression)) {
      return attr.value.expression.value;
    }
    if (t.isBooleanLiteral(attr.value.expression)) {
      return attr.value.expression.value;
    }
    if (t.isArrayExpression(attr.value.expression)) {
      return attr.value.expression.elements
        .filter(el => t.isStringLiteral(el))
        .map(el => (el as t.StringLiteral).value);
    }
  }
  return undefined;
}

function validatePropValue(
  value: any,
  propDef: PropDef,
  propName: string,
  componentName: string,
  issues: ValidationIssue[]
): void {
  if (propDef.type === 'enum' && propDef.enum) {
    if (!propDef.enum.includes(String(value))) {
      issues.push({
        type: 'error',
        message: `Invalid value "${value}" for prop "${propName}" on ${componentName}. Expected: ${propDef.enum.join(', ')}`,
        component: componentName,
        prop: propName,
      });
    }
  }

  if (propDef.type === 'number' && typeof value !== 'number') {
    issues.push({
      type: 'warning',
      message: `Prop "${propName}" on ${componentName} expects a number, got ${typeof value}`,
      component: componentName,
      prop: propName,
    });
  }

  if (propDef.type === 'boolean' && typeof value !== 'boolean') {
    issues.push({
      type: 'warning',
      message: `Prop "${propName}" on ${componentName} expects a boolean, got ${typeof value}`,
      component: componentName,
      prop: propName,
    });
  }

  if (propDef.type === 'array' && !Array.isArray(value)) {
    issues.push({
      type: 'error',
      message: `Prop "${propName}" on ${componentName} expects an array`,
      component: componentName,
      prop: propName,
    });
  }
}

function validateChildren(
  node: t.JSXElement,
  componentDef: ComponentDef,
  componentName: string,
  issues: ValidationIssue[]
): void {
  const hasChildren = node.children.some(child => {
    if (t.isJSXText(child)) {
      return child.value.trim().length > 0;
    }
    return t.isJSXElement(child) || t.isJSXExpressionContainer(child);
  });

  if (componentDef.children === 'required' && !hasChildren) {
    issues.push({
      type: 'error',
      message: `${componentName} requires children`,
      component: componentName,
    });
  }

  if (componentDef.children === 'none' && hasChildren) {
    issues.push({
      type: 'warning',
      message: `${componentName} should not have children`,
      component: componentName,
    });
  }
}

function validateComponentDefinitions(defs: Map<string, string>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const [name, template] of defs) {
    // Check naming convention (PascalCase)
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
      issues.push({
        type: 'warning',
        message: `Component name "${name}" should be PascalCase`,
        component: name,
      });
    }

    // Try to parse the template
    try {
      parser.parse(`<>${template}</>`, {
        sourceType: 'module',
        plugins: ['jsx'],
      });
    } catch (error: any) {
      issues.push({
        type: 'error',
        message: `Invalid template for component "${name}": ${error.message}`,
        component: name,
      });
    }

    // Check for prop placeholders
    const propMatches = template.match(/\{(\w+)\}/g);
    if (!propMatches) {
      issues.push({
        type: 'info',
        message: `Component "${name}" has no prop placeholders`,
        component: name,
      });
    }
  }

  return issues;
}

// ============================================================================
// CLI
// ============================================================================

interface CliArgs {
  inputFile?: string;
  componentFile?: string;
  checkComponents: boolean;
  format: 'text' | 'json';
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    checkComponents: false,
    format: 'text',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-i' || arg === '--input') {
      result.inputFile = args[++i];
    } else if (arg === '-c' || arg === '--components') {
      result.componentFile = args[++i];
    } else if (arg === '--check-components') {
      result.checkComponents = true;
    } else if (arg === '--json') {
      result.format = 'json';
    }
  }

  return result;
}

function loadComponentFile(filepath: string): Map<string, string> {
  const components = new Map<string, string>();

  if (!fs.existsSync(filepath)) {
    return components;
  }

  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(/^(\w+)(?:\[\w+\])?:\s*(.+)$/);
    if (match && !line.includes('[')) {
      const [, name, template] = match;
      components.set(name, template.trim());
    }
  }

  return components;
}

function parseComponentsFromSource(source: string): { jsx: string; components: Map<string, string> } {
  const components = new Map<string, string>();
  let jsx = source;

  const componentMatch = source.match(/\/\*\s*\n?---\s*components\s*\n([\s\S]*?)\n---\s*\n?\*\//);
  if (componentMatch) {
    const componentBlock = componentMatch[1];
    const lines = componentBlock.split('\n');

    for (const line of lines) {
      const match = line.match(/^(\w+)(?:\[\w+\])?:\s*(.+)$/);
      if (match && !line.includes('[')) {
        const [, name, template] = match;
        components.set(name, template.trim());
      }
    }
  }

  const jsxMatch = source.match(/const Design = \(\) => \(\s*<>\s*([\s\S]*?)\s*<\/>\s*\)/);
  if (jsxMatch) {
    jsx = jsxMatch[1].trim();
  }

  return { jsx, components };
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

function formatIssue(issue: ValidationIssue): string {
  const icon = issue.type === 'error' ? '✗' : issue.type === 'warning' ? '⚠' : 'ℹ';
  const location = issue.location ? ` (${issue.location.line}:${issue.location.column})` : '';
  return `${icon} ${issue.message}${location}`;
}

async function main() {
  const args = parseArgs();

  let source: string;
  let components = new Map<string, string>();

  // Load external component file
  if (args.componentFile) {
    components = loadComponentFile(args.componentFile);
  }

  // Read input
  if (args.inputFile) {
    source = fs.readFileSync(args.inputFile, 'utf-8');
    const parsed = parseComponentsFromSource(source);
    source = parsed.jsx;
    for (const [k, v] of parsed.components) {
      components.set(k, v);
    }
  } else {
    source = await readStdin();
    if (source.includes('const Design')) {
      const parsed = parseComponentsFromSource(source);
      source = parsed.jsx;
      for (const [k, v] of parsed.components) {
        components.set(k, v);
      }
    }
  }

  const allIssues: ValidationIssue[] = [];

  // Validate component definitions if requested
  if (args.checkComponents && components.size > 0) {
    const defIssues = validateComponentDefinitions(components);
    allIssues.push(...defIssues);
  }

  // Validate JSX
  if (source.trim()) {
    const result = validateJSX(source.trim(), components);
    allIssues.push(...result.issues);

    if (args.format === 'json') {
      console.log(JSON.stringify({ ...result, componentIssues: allIssues }, null, 2));
    } else {
      console.log('Validation Results');
      console.log('==================');
      console.log(`Components: ${result.stats.components}`);
      console.log(`Custom components: ${result.stats.customComponents}`);
      console.log(`Comments: ${result.stats.comments}`);
      console.log('');

      if (allIssues.length === 0) {
        console.log('✓ No issues found');
      } else {
        const errors = allIssues.filter(i => i.type === 'error');
        const warnings = allIssues.filter(i => i.type === 'warning');
        const infos = allIssues.filter(i => i.type === 'info');

        if (errors.length > 0) {
          console.log('Errors:');
          errors.forEach(i => console.log('  ' + formatIssue(i)));
        }
        if (warnings.length > 0) {
          console.log('Warnings:');
          warnings.forEach(i => console.log('  ' + formatIssue(i)));
        }
        if (infos.length > 0) {
          console.log('Info:');
          infos.forEach(i => console.log('  ' + formatIssue(i)));
        }
      }

      console.log('');
      console.log(result.valid ? '✓ Valid' : '✗ Invalid');
    }

    process.exit(result.valid ? 0 : 1);
  } else if (args.checkComponents) {
    // Just checking component definitions
    if (args.format === 'json') {
      console.log(JSON.stringify({ issues: allIssues }, null, 2));
    } else {
      if (allIssues.length === 0) {
        console.log('✓ All component definitions valid');
      } else {
        allIssues.forEach(i => console.log(formatIssue(i)));
      }
    }
    process.exit(allIssues.some(i => i.type === 'error') ? 1 : 0);
  } else {
    console.error('No input provided');
    console.error('Usage: npx tsx validate.tsx < input.jsx');
    console.error('       npx tsx validate.tsx --input design.tsx');
    console.error('       npx tsx validate.tsx -c components.yml --check-components');
    process.exit(1);
  }
}

main();
