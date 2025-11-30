/**
 * React + Tailwind CSS code generator
 *
 * Transforms Fluxwing JSX components to React components with Tailwind classes.
 */

import * as parser from '@babel/parser';
import generate from '@babel/generator';
import * as t from '@babel/types';

import type { GeneratorTarget } from '../types.js';
import { mappings } from './mappings.js';
import {
  buildClasses,
  buildAttributes,
  generateUnknownComponent,
  expandTemplate,
  formatOutput,
  wrapInComponent,
} from './transform.js';

/**
 * Transform a JSX element to React/Tailwind output
 */
function transformJSXElement(node: t.JSXElement, customComponents: Map<string, string>): string {
  const openingElement = node.openingElement;
  const componentName = (openingElement.name as t.JSXIdentifier).name;

  // Check for custom component first
  if (customComponents.has(componentName)) {
    const template = customComponents.get(componentName)!;
    const props = extractProps(openingElement);
    const expandedJsx = expandTemplate(template, props);

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
  const mapping = mappings[componentName];
  const props = extractProps(openingElement);
  const children = node.children.map(child => transformJSXChild(child, customComponents)).join('');

  if (!mapping) {
    return generateUnknownComponent(componentName, props, children);
  }

  // Use custom transform if available
  if (mapping.transform) {
    return mapping.transform(props, children);
  }

  // Build classes and attributes
  const classes = buildClasses(mapping, props);
  const attrs = buildAttributes(mapping, props, classes);

  // Generate output
  const tag = mapping.tag;
  const selfClosing = ['input', 'hr', 'br', 'img'].includes(tag) && !children;

  if (selfClosing) {
    return `<${tag}${attrs} />`;
  }

  return `<${tag}${attrs}>${children}</${tag}>`;
}

/**
 * Transform a JSX child node
 */
function transformJSXChild(child: t.JSXElement['children'][0], customComponents: Map<string, string>): string {
  if (t.isJSXElement(child)) {
    return transformJSXElement(child, customComponents);
  }
  if (t.isJSXText(child)) {
    const text = child.value.trim();
    return text ? text : '';
  }
  if (t.isJSXExpressionContainer(child)) {
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
    return `{${generate(child.expression).code}}`;
  }
  if (t.isJSXFragment(child)) {
    return child.children.map(c => transformJSXChild(c, customComponents)).join('');
  }
  return '';
}

/**
 * Extract props from JSX opening element
 */
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

/**
 * Generate React/Tailwind code from JSX
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

/**
 * React + Tailwind CSS generator target
 */
export const reactTailwind: GeneratorTarget = {
  name: 'react-tailwind',
  description: 'React components with Tailwind CSS',
  mappings,
  generate: generateCode,
  format: formatOutput,
  wrapInComponent,
};

// Re-export for direct access
export { mappings } from './mappings.js';
export * from './transform.js';
