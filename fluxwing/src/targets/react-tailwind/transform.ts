/**
 * React + Tailwind CSS transformation utilities
 */

import type { ComponentMapping } from '../types.js';

/**
 * Build CSS classes from mapping and props
 */
export function buildClasses(mapping: ComponentMapping, props: Record<string, any>): string {
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

/**
 * Build HTML attributes string from mapping and props
 */
export function buildAttributes(mapping: ComponentMapping, props: Record<string, any>, classes: string): string {
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

/**
 * Generate output for unknown/passthrough components
 */
export function generateUnknownComponent(name: string, props: Record<string, any>, children: string): string {
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

/**
 * Expand template string with prop values
 */
export function expandTemplate(template: string, props: Record<string, any>): string {
  let result = template;

  // Replace {propName} with values
  for (const [key, value] of Object.entries(props)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, String(value));
  }

  return result;
}

/**
 * Format generated code with proper indentation
 */
export function formatOutput(code: string): string {
  let indentLevel = 0;
  const lines: string[] = [];

  // Split by > and < to process tags
  const tokens = code.split(/(<\/?[^>]+>)/g).filter(Boolean);

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

/**
 * Wrap generated code in a React component
 */
export function wrapInComponent(code: string, name: string): string {
  return `export function ${name}() {
  return (
${code.split('\n').map(line => '    ' + line).join('\n')}
  );
}`;
}
