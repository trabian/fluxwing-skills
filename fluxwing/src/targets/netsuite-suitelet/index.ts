/**
 * NetSuite Suitelet (SuiteScript 2.x) code generator
 *
 * Transforms Fluxwing JSX components to NetSuite serverWidget API calls.
 *
 * @example
 * Input:
 * ```jsx
 * <Screen title="Customer Form">
 *   <Card title="Details">
 *     <Input label="Name" id="custpage_name" required />
 *     <Select label="Status" id="custpage_status" options={['Active', 'Inactive']} />
 *   </Card>
 *   <Button submit>Save</Button>
 * </Screen>
 * ```
 *
 * Output:
 * ```javascript
 * const form = serverWidget.createForm({ title: 'Customer Form' });
 * form.addFieldGroup({ id: 'custpage_group_details', label: 'Details' });
 * const custpage_name = form.addField({ id: 'custpage_name', type: serverWidget.FieldType.TEXT, label: 'Name' });
 * custpage_name.isMandatory = true;
 * // ...
 * ```
 */

import * as parser from '@babel/parser';
import generate from '@babel/generator';
import * as t from '@babel/types';

import type { GeneratorTarget } from '../types.js';
import { mappings } from './mappings.js';
import { formatOutput, wrapInSuitelet, sanitizeId, escapeString } from './transform.js';

// Counter for generating unique IDs
let idCounter = 0;

function resetIdCounter(): void {
  idCounter = 0;
}

function nextId(prefix: string): string {
  return `${prefix}_${++idCounter}`;
}

/**
 * Transform a JSX element to Suitelet code
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
      return expr.children.map(child => transformJSXChild(child, customComponents)).join('\n');
    } catch {
      return `// Error expanding ${componentName}`;
    }
  }

  // Get mapping for standard component
  const mapping = mappings[componentName];
  const props = extractProps(openingElement);
  const children = node.children
    .map(child => transformJSXChild(child, customComponents))
    .filter(Boolean)
    .join('\n');

  if (!mapping) {
    return `// Unknown component: ${componentName}`;
  }

  // Use custom transform if available
  if (mapping.transform) {
    return mapping.transform(props, children);
  }

  return `// ${componentName} - no transform defined`;
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
    return text || '';
  }
  if (t.isJSXExpressionContainer(child)) {
    if (t.isJSXEmptyExpression(child.expression)) {
      return '';
    }
    if (t.isStringLiteral(child.expression)) {
      return child.expression.value;
    }
    if (t.isIdentifier(child.expression)) {
      return `/* ${child.expression.name} */`;
    }
    return `/* expression: ${generate(child.expression).code} */`;
  }
  if (t.isJSXFragment(child)) {
    return child.children.map(c => transformJSXChild(c, customComponents)).join('\n');
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
        } else if (t.isObjectExpression(attr.value.expression)) {
          // Handle object props like options={[{value: 'a', text: 'A'}]}
          props[name] = extractObjectProps(attr.value.expression);
        }
      }
    }
  }

  return props;
}

/**
 * Extract object properties from an ObjectExpression
 */
function extractObjectProps(expr: t.ObjectExpression): Record<string, any> {
  const result: Record<string, any> = {};

  for (const prop of expr.properties) {
    if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
      const key = prop.key.name;
      if (t.isStringLiteral(prop.value)) {
        result[key] = prop.value.value;
      } else if (t.isNumericLiteral(prop.value)) {
        result[key] = prop.value.value;
      } else if (t.isBooleanLiteral(prop.value)) {
        result[key] = prop.value.value;
      }
    }
  }

  return result;
}

/**
 * Expand template string with prop values
 */
function expandTemplate(template: string, props: Record<string, any>): string {
  let result = template;

  for (const [key, value] of Object.entries(props)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, String(value));
  }

  return result;
}

/**
 * Generate Suitelet code from JSX
 */
function generateCode(jsx: string, customComponents: Map<string, string>): string {
  resetIdCounter();
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
        .filter(Boolean)
        .join('\n\n');
    }

    if (t.isJSXElement(expr)) {
      return transformJSXElement(expr, customComponents);
    }

    return '// Unable to parse JSX';
  } catch (error) {
    return `// Parse error: ${error}`;
  }
}

/**
 * NetSuite Suitelet generator target
 */
export const netsuiteSuitelet: GeneratorTarget = {
  name: 'netsuite-suitelet',
  description: 'NetSuite Suitelet (SuiteScript 2.x)',
  mappings,
  generate: generateCode,
  format: formatOutput,
  wrapInComponent: wrapInSuitelet,
};

// Re-export for direct access
export { mappings } from './mappings.js';
export * from './transform.js';
