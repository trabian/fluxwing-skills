/**
 * Load component definitions from external files
 */

import * as fs from 'fs';
import type { ComponentDefinition } from './types.js';
import { parseComponentLine } from './parse-inline.js';

/**
 * Load component definitions from a YAML-like file
 *
 * File format:
 * ```yaml
 * # Comment lines start with #
 * ComponentName: <JSX template>
 * ComponentName[hover]: <JSX template for hover state>
 * ComponentName[disabled]: <JSX template for disabled state>
 * ```
 *
 * @param filepath - Path to the component definition file
 * @returns Parsed component definitions (empty object if file doesn't exist)
 */
export function loadComponentsFromFile(filepath: string): Record<string, ComponentDefinition> {
  const components: Record<string, ComponentDefinition> = {};

  if (!fs.existsSync(filepath)) {
    return components;
  }

  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split('\n');

    for (const line of lines) {
      // Skip comments and empty lines
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
  } catch (e) {
    console.error(`Warning: Could not load components from ${filepath}`);
  }

  return components;
}

/**
 * Load component definitions from multiple files and merge them
 *
 * @param filepaths - Array of paths to component definition files
 * @returns Merged component definitions (later files take precedence)
 */
export function loadComponentsFromFiles(filepaths: string[]): Record<string, ComponentDefinition> {
  const result: Record<string, ComponentDefinition> = {};

  for (const filepath of filepaths) {
    const fileComponents = loadComponentsFromFile(filepath);

    for (const [name, def] of Object.entries(fileComponents)) {
      if (result[name]) {
        // Merge states
        result[name].default = def.default || result[name].default;
        result[name].states = { ...result[name].states, ...def.states };
      } else {
        result[name] = { default: def.default, states: { ...def.states } };
      }
    }
  }

  return result;
}
