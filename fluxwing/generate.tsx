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
 */

import * as fs from 'fs';
import * as path from 'path';
import * as parser from '@babel/parser';
import generate from '@babel/generator';
import * as t from '@babel/types';

// ============================================================================
// Tailwind Component Mappings
// ============================================================================

interface TailwindMapping {
  tag: string;
  baseClasses: string;
  variantClasses?: Record<string, string>;
  propsToAttrs?: Record<string, string>;
  propsToClasses?: Record<string, Record<string, string>>;
  wrapperTag?: string;
  wrapperClasses?: string;
  childrenWrapper?: { tag: string; classes: string };
  transform?: (props: Record<string, any>, children: string) => string;
}

const tailwindMappings: Record<string, TailwindMapping> = {
  // Layout Components
  Box: {
    tag: 'div',
    baseClasses: '',
    propsToClasses: {
      padding: { '1': 'p-2', '2': 'p-4', '3': 'p-6' },
      margin: { '1': 'm-2', '2': 'm-4', '3': 'm-6' },
    },
  },

  Stack: {
    tag: 'div',
    baseClasses: 'flex flex-col',
    propsToClasses: {
      gap: { '0': 'gap-0', '1': 'gap-2', '2': 'gap-4', '3': 'gap-6' },
      align: {
        'start': 'items-start',
        'center': 'items-center',
        'end': 'items-end',
        'stretch': 'items-stretch',
      },
    },
  },

  Row: {
    tag: 'div',
    baseClasses: 'flex flex-row',
    propsToClasses: {
      gap: { '0': 'gap-0', '1': 'gap-2', '2': 'gap-4', '3': 'gap-6' },
      justify: {
        'start': 'justify-start',
        'center': 'justify-center',
        'end': 'justify-end',
        'between': 'justify-between',
        'around': 'justify-around',
      },
      align: {
        'start': 'items-start',
        'center': 'items-center',
        'end': 'items-end',
      },
    },
  },

  Spacer: {
    tag: 'div',
    baseClasses: 'flex-1',
  },

  Divider: {
    tag: 'hr',
    baseClasses: 'border-t border-gray-200 my-4',
  },

  // Text Components
  Text: {
    tag: 'span',
    baseClasses: 'text-base',
    propsToClasses: {
      bold: { 'true': 'font-bold' },
      italic: { 'true': 'italic' },
      underline: { 'true': 'underline' },
      dimmed: { 'true': 'text-gray-500' },
      dimColor: { 'true': 'text-gray-500' },
      color: {
        'green': 'text-green-600',
        'red': 'text-red-600',
        'blue': 'text-blue-600',
        'yellow': 'text-yellow-600',
        'gray': 'text-gray-500',
      },
    },
  },

  Heading: {
    tag: 'h2',
    baseClasses: 'font-bold',
    propsToClasses: {
      level: {
        '1': 'text-3xl',
        '2': 'text-2xl',
        '3': 'text-xl',
        '4': 'text-lg',
      },
    },
    transform: (props, children) => {
      const level = props.level || '2';
      const tag = `h${level}`;
      const sizeClass = { '1': 'text-3xl', '2': 'text-2xl', '3': 'text-xl', '4': 'text-lg' }[level] || 'text-2xl';
      return `<${tag} className="font-bold ${sizeClass}">${children}</${tag}>`;
    },
  },

  // Interactive Components
  Button: {
    tag: 'button',
    baseClasses: 'px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    variantClasses: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    },
    propsToClasses: {
      disabled: { 'true': 'opacity-50 cursor-not-allowed' },
    },
    propsToAttrs: {
      disabled: 'disabled',
    },
  },

  Input: {
    tag: 'input',
    baseClasses: 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    wrapperTag: 'div',
    wrapperClasses: 'space-y-1',
    propsToAttrs: {
      placeholder: 'placeholder',
      type: 'type',
      disabled: 'disabled',
    },
    transform: (props, children) => {
      const label = props.label ? `<label className="block text-sm font-medium text-gray-700">${props.label}</label>` : '';
      const type = props.type || 'text';
      const placeholder = props.placeholder ? ` placeholder="${props.placeholder}"` : '';
      const disabled = props.disabled ? ' disabled' : '';
      const inputClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
      return `<div className="space-y-1">${label}<input type="${type}"${placeholder}${disabled} className="${inputClasses}" /></div>`;
    },
  },

  Select: {
    tag: 'select',
    baseClasses: 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    wrapperTag: 'div',
    wrapperClasses: 'space-y-1',
    transform: (props, children) => {
      const label = props.label ? `<label className="block text-sm font-medium text-gray-700">${props.label}</label>` : '';
      const selectClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
      const options = (props.options || []).map((opt: string) => `<option value="${opt}">${opt}</option>`).join('');
      return `<div className="space-y-1">${label}<select className="${selectClasses}">${options}</select></div>`;
    },
  },

  Checkbox: {
    tag: 'input',
    baseClasses: 'h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500',
    transform: (props, children) => {
      const label = props.label || children;
      const checked = props.checked ? ' defaultChecked' : '';
      return `<label className="flex items-center gap-2"><input type="checkbox"${checked} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /><span className="text-sm text-gray-700">${label}</span></label>`;
    },
  },

  // Container Components
  Card: {
    tag: 'div',
    baseClasses: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    transform: (props, children) => {
      const title = props.title ? `<div className="px-4 py-3 border-b border-gray-200"><h3 className="text-lg font-medium text-gray-900">${props.title}</h3></div>` : '';
      return `<div className="bg-white border border-gray-200 rounded-lg shadow-sm">${title}<div className="p-4">${children}</div></div>`;
    },
  },

  Panel: {
    tag: 'div',
    baseClasses: 'bg-gray-50 border border-gray-200 rounded-lg p-4',
    transform: (props, children) => {
      const title = props.title ? `<h3 className="text-sm font-medium text-gray-700 mb-2">${props.title}</h3>` : '';
      return `<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">${title}${children}</div>`;
    },
  },

  // Feedback Components
  Alert: {
    tag: 'div',
    baseClasses: 'p-4 rounded-md',
    variantClasses: {
      info: 'bg-blue-50 text-blue-800 border border-blue-200',
      success: 'bg-green-50 text-green-800 border border-green-200',
      warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
      error: 'bg-red-50 text-red-800 border border-red-200',
    },
  },

  Badge: {
    tag: 'span',
    baseClasses: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    variantClasses: {
      default: 'bg-gray-100 text-gray-800',
      primary: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
    },
  },

  ProgressBar: {
    tag: 'div',
    baseClasses: 'w-full bg-gray-200 rounded-full h-2',
    transform: (props, children) => {
      const value = props.value || 0;
      const color = props.color || 'blue';
      const colorClass = { blue: 'bg-blue-600', green: 'bg-green-600', red: 'bg-red-600', yellow: 'bg-yellow-600' }[color] || 'bg-blue-600';
      return `<div className="w-full bg-gray-200 rounded-full h-2"><div className="${colorClass} h-2 rounded-full" style={{ width: '${value}%' }}></div></div>`;
    },
  },

  Spinner: {
    tag: 'div',
    baseClasses: 'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
    transform: (props, children) => {
      const size = props.size || 'md';
      const sizeClass = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' }[size] || 'h-6 w-6';
      return `<div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClass}"></div>`;
    },
  },

  // Navigation Components
  Link: {
    tag: 'a',
    baseClasses: 'text-blue-600 hover:text-blue-800 hover:underline',
    propsToAttrs: {
      href: 'href',
    },
  },

  Tabs: {
    tag: 'div',
    baseClasses: 'border-b border-gray-200',
    transform: (props, children) => {
      const tabs = (props.tabs || []).map((tab: string, i: number) => {
        const isActive = i === (props.activeIndex || 0);
        const classes = isActive
          ? 'border-b-2 border-blue-500 text-blue-600 px-4 py-2 text-sm font-medium'
          : 'text-gray-500 hover:text-gray-700 px-4 py-2 text-sm font-medium';
        return `<button className="${classes}">${tab}</button>`;
      }).join('');
      return `<div className="border-b border-gray-200"><nav className="flex gap-2">${tabs}</nav></div>`;
    },
  },

  // Table Components
  Table: {
    tag: 'table',
    baseClasses: 'min-w-full divide-y divide-gray-200',
    transform: (props, children) => {
      return `<div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200">${children}</table></div>`;
    },
  },

  TableHeader: {
    tag: 'thead',
    baseClasses: 'bg-gray-50',
  },

  TableBody: {
    tag: 'tbody',
    baseClasses: 'bg-white divide-y divide-gray-200',
  },

  TableRow: {
    tag: 'tr',
    baseClasses: 'hover:bg-gray-50',
  },

  TableCell: {
    tag: 'td',
    baseClasses: 'px-4 py-3 text-sm text-gray-900',
  },

  TableHeaderCell: {
    tag: 'th',
    baseClasses: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
  },
};

// ============================================================================
// AST Transformation
// ============================================================================

function transformJSXElement(node: t.JSXElement, customComponents: Map<string, string>): string {
  const openingElement = node.openingElement;
  const componentName = (openingElement.name as t.JSXIdentifier).name;

  // Check for custom component first
  if (customComponents.has(componentName)) {
    // Get the custom component template and expand it
    const template = customComponents.get(componentName)!;
    const props = extractProps(openingElement);
    const expandedJsx = expandTemplate(template, props);

    // Parse and transform the expanded template
    try {
      const ast = parser.parse(`<>${expandedJsx}</>`, {
        sourceType: 'module',
        plugins: ['jsx'],
      });
      const expr = (ast.program.body[0] as t.ExpressionStatement).expression as t.JSXFragment;
      return expr.children.map(child => transformJSXChild(child, customComponents)).join('');
    } catch {
      return `<!-- Error expanding ${componentName} -->`;
    }
  }

  // Get mapping for standard component
  const mapping = tailwindMappings[componentName];
  const props = extractProps(openingElement);
  const children = node.children.map(child => transformJSXChild(child, customComponents)).join('');

  if (!mapping) {
    // Pass through unknown components
    return generateUnknownComponent(componentName, props, children);
  }

  // Use custom transform if available
  if (mapping.transform) {
    return mapping.transform(props, children);
  }

  // Build classes
  const classes = buildClasses(mapping, props);

  // Build attributes
  const attrs = buildAttributes(mapping, props, classes);

  // Generate output
  const tag = mapping.tag;
  const selfClosing = ['input', 'hr', 'br', 'img'].includes(tag) && !children;

  if (selfClosing) {
    return `<${tag}${attrs} />`;
  }

  return `<${tag}${attrs}>${children}</${tag}>`;
}

function transformJSXChild(child: t.JSXElement['children'][0], customComponents: Map<string, string>): string {
  if (t.isJSXElement(child)) {
    return transformJSXElement(child, customComponents);
  }
  if (t.isJSXText(child)) {
    const text = child.value.trim();
    return text ? text : '';
  }
  if (t.isJSXExpressionContainer(child)) {
    // Handle JSX comments: {/* comment */}
    if (t.isJSXEmptyExpression(child.expression)) {
      const comments = (child.expression as any).innerComments || [];
      if (comments.length > 0) {
        return comments.map((c: any) => `{/* ${c.value.trim()} */}`).join('\n');
      }
      return '';
    }
    if (t.isStringLiteral(child.expression)) {
      return child.expression.value;
    }
    if (t.isIdentifier(child.expression)) {
      return `{${child.expression.name}}`;
    }
    // For complex expressions, generate code
    return `{${generate(child.expression).code}}`;
  }
  if (t.isJSXFragment(child)) {
    return child.children.map(c => transformJSXChild(c, customComponents)).join('');
  }
  return '';
}

function extractProps(openingElement: t.JSXOpeningElement): Record<string, any> {
  const props: Record<string, any> = {};

  for (const attr of openingElement.attributes) {
    if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
      const name = attr.name.name;

      if (attr.value === null) {
        props[name] = true;
      } else if (t.isStringLiteral(attr.value)) {
        props[name] = attr.value.value;
      } else if (t.isJSXExpressionContainer(attr.value)) {
        if (t.isStringLiteral(attr.value.expression)) {
          props[name] = attr.value.expression.value;
        } else if (t.isNumericLiteral(attr.value.expression)) {
          props[name] = attr.value.expression.value;
        } else if (t.isBooleanLiteral(attr.value.expression)) {
          props[name] = attr.value.expression.value;
        } else if (t.isArrayExpression(attr.value.expression)) {
          props[name] = attr.value.expression.elements
            .filter(el => t.isStringLiteral(el))
            .map(el => (el as t.StringLiteral).value);
        }
      }
    }
  }

  return props;
}

function buildClasses(mapping: TailwindMapping, props: Record<string, any>): string {
  const classes: string[] = [];

  // Add base classes
  if (mapping.baseClasses) {
    classes.push(mapping.baseClasses);
  }

  // Add variant classes
  if (mapping.variantClasses && props.variant) {
    const variantClass = mapping.variantClasses[props.variant];
    if (variantClass) {
      classes.push(variantClass);
    }
  } else if (mapping.variantClasses && mapping.variantClasses.default) {
    classes.push(mapping.variantClasses.default);
  }

  // Add prop-based classes
  if (mapping.propsToClasses) {
    for (const [propName, classMap] of Object.entries(mapping.propsToClasses)) {
      const propValue = String(props[propName]);
      if (propValue && classMap[propValue]) {
        classes.push(classMap[propValue]);
      }
    }
  }

  return classes.filter(Boolean).join(' ');
}

function buildAttributes(mapping: TailwindMapping, props: Record<string, any>, classes: string): string {
  const attrs: string[] = [];

  // Add className
  if (classes) {
    attrs.push(`className="${classes}"`);
  }

  // Add mapped attributes
  if (mapping.propsToAttrs) {
    for (const [propName, attrName] of Object.entries(mapping.propsToAttrs)) {
      if (props[propName] !== undefined) {
        if (typeof props[propName] === 'boolean') {
          if (props[propName]) {
            attrs.push(attrName);
          }
        } else {
          attrs.push(`${attrName}="${props[propName]}"`);
        }
      }
    }
  }

  return attrs.length > 0 ? ' ' + attrs.join(' ') : '';
}

function generateUnknownComponent(name: string, props: Record<string, any>, children: string): string {
  const propsStr = Object.entries(props)
    .map(([k, v]) => {
      if (typeof v === 'boolean') return v ? k : '';
      if (typeof v === 'string') return `${k}="${v}"`;
      return `${k}={${JSON.stringify(v)}}`;
    })
    .filter(Boolean)
    .join(' ');

  const attrsStr = propsStr ? ' ' + propsStr : '';

  if (!children) {
    return `<${name}${attrsStr} />`;
  }

  return `<${name}${attrsStr}>${children}</${name}>`;
}

function expandTemplate(template: string, props: Record<string, any>): string {
  let result = template;

  // Replace {propName} with values
  for (const [key, value] of Object.entries(props)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, String(value));
  }

  return result;
}

// ============================================================================
// Main Generator
// ============================================================================

function generateReactTailwind(jsx: string, customComponents: Map<string, string>): string {
  // Wrap in fragment for parsing
  const wrappedJsx = `<>${jsx}</>`;

  try {
    const ast = parser.parse(wrappedJsx, {
      sourceType: 'module',
      plugins: ['jsx'],
    });

    const expr = (ast.program.body[0] as t.ExpressionStatement).expression;

    if (t.isJSXFragment(expr)) {
      return expr.children
        .map(child => transformJSXChild(child, customComponents))
        .join('\n');
    }

    if (t.isJSXElement(expr)) {
      return transformJSXElement(expr, customComponents);
    }

    return '<!-- Unable to parse JSX -->';
  } catch (error) {
    return `<!-- Parse error: ${error} -->`;
  }
}

function formatOutput(code: string): string {
  // Basic formatting - indent nested elements
  let formatted = code;
  let indentLevel = 0;
  const lines: string[] = [];

  // Split by > and < to process tags
  const tokens = formatted.split(/(<\/?[^>]+>)/g).filter(Boolean);

  for (const token of tokens) {
    if (token.startsWith('</')) {
      // Closing tag
      indentLevel = Math.max(0, indentLevel - 1);
      lines.push('  '.repeat(indentLevel) + token);
    } else if (token.startsWith('<') && !token.endsWith('/>')) {
      // Opening tag
      lines.push('  '.repeat(indentLevel) + token);
      indentLevel++;
    } else if (token.startsWith('<') && token.endsWith('/>')) {
      // Self-closing tag
      lines.push('  '.repeat(indentLevel) + token);
    } else if (token.trim()) {
      // Text content
      lines.push('  '.repeat(indentLevel) + token.trim());
    }
  }

  return lines.join('\n');
}

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
    }
  }

  return result;
}

function wrapInComponent(code: string, name: string): string {
  return `export function ${name}() {
  return (
${code.split('\n').map(line => '    ' + line).join('\n')}
  );
}`;
}

function parseComponentsFromSource(source: string): { jsx: string; components: Map<string, string> } {
  const components = new Map<string, string>();
  let jsx = source;

  // Extract component definitions from comment block
  const componentMatch = source.match(/\/\*\s*\n?---\s*components\s*\n([\s\S]*?)\n---\s*\n?\*\//);
  if (componentMatch) {
    const componentBlock = componentMatch[1];
    const lines = componentBlock.split('\n');

    for (const line of lines) {
      const match = line.match(/^(\w+)(?:\[\w+\])?:\s*(.+)$/);
      if (match) {
        const [, name, template] = match;
        // Only store default (non-state) definitions
        if (!line.includes('[')) {
          components.set(name, template.trim());
        }
      }
    }
  }

  // Extract JSX from Design component
  const jsxMatch = source.match(/const Design = \(\) => \(\s*<>\s*([\s\S]*?)\s*<\/>\s*\)/);
  if (jsxMatch) {
    jsx = jsxMatch[1].trim();
  }

  return { jsx, components };
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

  if (args.target !== 'react-tailwind') {
    console.error(`Unknown target: ${args.target}`);
    console.error('Supported targets: react-tailwind');
    process.exit(1);
  }

  let source: string;
  let components = new Map<string, string>();

  // Load external component file if specified
  if (args.componentFile) {
    components = loadComponentFile(args.componentFile);
  }

  // Read input
  if (args.inputFile) {
    source = fs.readFileSync(args.inputFile, 'utf-8');
    const parsed = parseComponentsFromSource(source);
    source = parsed.jsx;
    // Merge components (file components override external)
    for (const [k, v] of parsed.components) {
      components.set(k, v);
    }
  } else {
    source = await readStdin();

    // Check if it's a full source file or just JSX
    if (source.includes('const Design')) {
      const parsed = parseComponentsFromSource(source);
      source = parsed.jsx;
      for (const [k, v] of parsed.components) {
        components.set(k, v);
      }
    }
  }

  if (!source.trim()) {
    console.error('No input provided');
    console.error('Usage: npx tsx generate.tsx --target react-tailwind < input.jsx');
    console.error('       npx tsx generate.tsx --target react-tailwind --input design.tsx');
    process.exit(1);
  }

  // Generate code
  let output = generateReactTailwind(source.trim(), components);

  // Format if requested
  if (args.format) {
    output = formatOutput(output);
  }

  // Wrap in component if requested
  if (args.componentName) {
    output = wrapInComponent(output, args.componentName);
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
