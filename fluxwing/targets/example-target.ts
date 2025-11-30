/**
 * Example Custom Target
 *
 * This file demonstrates how to create a custom code generation target.
 *
 * To use this target:
 *   npx tsx generate.tsx --target ./targets/example-target.ts --input design.tsx
 *
 * Or add it to fluxwing.config.ts:
 *   targets: {
 *     example: { source: './targets/example-target.ts' }
 *   }
 *
 * Then use:
 *   npx tsx generate.tsx --target example --input design.tsx
 */

import * as parser from '@babel/parser';
import generate from '@babel/generator';
import * as t from '@babel/types';
import type { GeneratorTarget, ComponentMappings } from '../src/targets/types.js';

// ============================================================================
// Component Mappings
// ============================================================================

/**
 * Define how each Fluxwing component maps to your target platform.
 *
 * Each mapping can include:
 * - tag: The output element/component name
 * - baseClasses: Default CSS classes
 * - variantClasses: Classes based on prop values
 * - propsToAttrs: Prop name transformations
 * - propsToClasses: Convert prop values to classes
 * - transform: Custom transformation function
 */
export const mappings: ComponentMappings = {
  // Example: Simple text output
  Text: {
    tag: 'span',
    baseClasses: 'text-base',
    transform: (props, children) => {
      const classes = ['text-base'];
      if (props.bold) classes.push('font-bold');
      if (props.dimmed) classes.push('text-gray-500');
      return `<span class="${classes.join(' ')}">${children}</span>`;
    },
  },

  // Example: Button with variants
  Button: {
    tag: 'button',
    baseClasses: 'btn',
    variantClasses: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      danger: 'btn-danger',
    },
    transform: (props, children) => {
      const classes = ['btn'];
      if (props.variant) {
        classes.push(`btn-${props.variant}`);
      }
      if (props.disabled) {
        classes.push('btn-disabled');
      }
      return `<button class="${classes.join(' ')}"${props.disabled ? ' disabled' : ''}>${children}</button>`;
    },
  },

  // Example: Input field
  Input: {
    tag: 'input',
    baseClasses: 'input',
    transform: (props) => {
      const attrs = [`type="${props.type || 'text'}"`, 'class="input"'];
      if (props.placeholder) attrs.push(`placeholder="${props.placeholder}"`);
      if (props.required) attrs.push('required');
      if (props.disabled) attrs.push('disabled');
      return `<input ${attrs.join(' ')} />`;
    },
  },

  // Example: Container/layout
  Card: {
    tag: 'div',
    baseClasses: 'card',
    transform: (props, children) => {
      let html = '<div class="card">';
      if (props.title) {
        html += `\n  <div class="card-header">${props.title}</div>`;
      }
      html += `\n  <div class="card-body">${children}</div>`;
      html += '\n</div>';
      return html;
    },
  },
};

// ============================================================================
// Code Generator
// ============================================================================

/**
 * Transform a JSX element to your target format
 */
function transformJSXElement(node: t.JSXElement, customComponents: Map<string, string>): string {
  const openingElement = node.openingElement;
  const componentName = (openingElement.name as t.JSXIdentifier).name;

  // Get props
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
        } else if (t.isBooleanLiteral(attr.value.expression)) {
          props[name] = attr.value.expression.value;
        }
      }
    }
  }

  // Get children
  const children = node.children
    .map(child => {
      if (t.isJSXElement(child)) {
        return transformJSXElement(child, customComponents);
      }
      if (t.isJSXText(child)) {
        return child.value.trim();
      }
      if (t.isJSXExpressionContainer(child) && t.isStringLiteral(child.expression)) {
        return child.expression.value;
      }
      return '';
    })
    .filter(Boolean)
    .join('\n');

  // Check for mapping
  const mapping = mappings[componentName];
  if (mapping?.transform) {
    return mapping.transform(props, children);
  }

  // Fallback: render as generic element
  return `<!-- Unknown: ${componentName} -->\n${children}`;
}

/**
 * Main generation function
 */
function generateCode(jsx: string, customComponents: Map<string, string>): string {
  const wrappedJsx = `<>${jsx}</>`;

  try {
    const ast = parser.parse(wrappedJsx, {
      sourceType: 'module',
      plugins: ['jsx'],
    });

    const expr = (ast.program.body[0] as t.ExpressionStatement).expression;

    if (t.isJSXFragment(expr)) {
      return expr.children
        .filter(child => t.isJSXElement(child))
        .map(child => transformJSXElement(child as t.JSXElement, customComponents))
        .join('\n\n');
    }

    if (t.isJSXElement(expr)) {
      return transformJSXElement(expr, customComponents);
    }

    return '<!-- Unable to parse JSX -->';
  } catch (error) {
    return `<!-- Parse error: ${error} -->`;
  }
}

/**
 * Optional: Format the output
 */
function formatOutput(code: string): string {
  // Simple formatting - add consistent indentation
  return code
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n');
}

/**
 * Optional: Wrap output in a component/module
 */
function wrapInComponent(code: string, name: string): string {
  return `<!-- Component: ${name} -->\n${code}\n<!-- End ${name} -->`;
}

// ============================================================================
// Export Target
// ============================================================================

/**
 * The target definition - this is what gets loaded
 */
export const target: GeneratorTarget = {
  name: 'example-target',
  description: 'Example custom target for demonstration',
  mappings,
  generate: generateCode,
  format: formatOutput,
  wrapInComponent,
};

// Default export for convenience
export default target;
