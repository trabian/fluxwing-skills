/**
 * Parse inline component definitions from input strings
 */

import type { ComponentDefinition, ParsedInput, ParsedComponentLine } from './types.js';

/**
 * Parse a single component definition line
 *
 * Formats supported:
 * - `ComponentName: <template>`
 * - `ComponentName[state]: <template>`
 *
 * @param line - The line to parse
 * @returns Parsed component info or null if not a valid definition
 */
export function parseComponentLine(line: string): ParsedComponentLine | null {
  // Match: ComponentName[state]: <template> or ComponentName: <template>
  const match = line.match(/^(\w+)(?:\[(\w+)\])?:\s*(.+)$/);
  if (!match) return null;

  const [, name, state, template] = match;
  return {
    name,
    state: state || undefined,
    template: template.trim(),
  };
}

/**
 * Parse inline component definitions from input string
 *
 * Supports two block formats:
 *
 * 1. Raw block (used in stdin/direct input):
 * ```
 * --- components
 * MyButton: <Button variant="primary">{label}</Button>
 * MyButton[hover]: <Button color="cyan">{label}</Button>
 * ---
 * <MyButton label="Click" />
 * ```
 *
 * 2. Comment block (used in .tsx files):
 * ```
 * /*
 * --- components
 * MyButton: <Button variant="primary">{label}</Button>
 * ---
 * *​/
 * const Design = () => (<><MyButton label="Click" /></>);
 * ```
 *
 * @param input - Input string potentially containing component definitions
 * @returns Parsed components and remaining JSX
 */
export function parseInlineComponents(input: string): ParsedInput {
  const components: Record<string, ComponentDefinition> = {};

  // Try raw block format first: --- components\n...\n---
  const rawBlockMatch = input.match(/---\s*components\s*\n([\s\S]*?)\n---/);

  // Try comment block format: /* --- components\n...\n--- */
  const commentBlockMatch = input.match(/\/\*\s*\n?---\s*components\s*\n([\s\S]*?)\n---\s*\n?\*\//);

  const blockMatch = rawBlockMatch || commentBlockMatch;

  if (blockMatch) {
    const block = blockMatch[1];
    const lines = block.split('\n');

    for (const line of lines) {
      // Skip empty lines and comments
      if (!line.trim() || line.trim().startsWith('#') || line.trim().startsWith('//')) {
        continue;
      }

      const parsed = parseComponentLine(line);
      if (parsed) {
        const { name, state, template } = parsed;

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

    // Remove the component block from input
    let jsx = input;
    if (rawBlockMatch) {
      jsx = input.replace(/---\s*components\s*\n[\s\S]*?\n---\s*/, '').trim();
    }
    // For comment blocks, try to extract JSX from Design component
    if (commentBlockMatch) {
      const jsxMatch = input.match(/const Design = \(\) => \(\s*<>\s*([\s\S]*?)\s*<\/>\s*\)/);
      if (jsxMatch) {
        jsx = jsxMatch[1].trim();
      }
    }

    return { components, jsx };
  }

  return { components, jsx: input.trim() };
}

/**
 * Merge component definitions, with later definitions taking precedence
 *
 * @param base - Base component definitions
 * @param override - Component definitions to merge in (takes precedence)
 * @returns Merged component definitions
 */
export function mergeComponentDefinitions(
  base: Record<string, ComponentDefinition>,
  override: Record<string, ComponentDefinition>
): Record<string, ComponentDefinition> {
  const result: Record<string, ComponentDefinition> = {};

  // Copy base
  for (const [name, def] of Object.entries(base)) {
    result[name] = { default: def.default, states: { ...def.states } };
  }

  // Merge override
  for (const [name, def] of Object.entries(override)) {
    if (result[name]) {
      // Merge: override default if provided, merge states
      result[name].default = def.default || result[name].default;
      result[name].states = { ...result[name].states, ...def.states };
    } else {
      result[name] = { default: def.default, states: { ...def.states } };
    }
  }

  return result;
}

/**
 * Get only the default templates (no states) as a simple Map
 * Useful for generators that don't need state support
 *
 * @param components - Full component definitions with states
 * @returns Map of component name to default template only
 */
export function getDefaultTemplates(
  components: Record<string, ComponentDefinition>
): Map<string, string> {
  const defaults = new Map<string, string>();
  for (const [name, def] of Object.entries(components)) {
    if (def.default) {
      defaults.set(name, def.default);
    }
  }
  return defaults;
}
