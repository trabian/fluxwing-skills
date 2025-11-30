/**
 * Code Generation Targets
 *
 * Each target transforms Fluxwing JSX to platform-specific code.
 *
 * @example
 * ```typescript
 * import { targets, getTarget } from './src/targets/index.js';
 *
 * // Get available target names
 * const available = Object.keys(targets); // ['react-tailwind']
 *
 * // Get a specific target
 * const target = getTarget('react-tailwind');
 * const output = target.generate(jsx, customComponents);
 * ```
 */

import type { GeneratorTarget } from './types.js';
import { reactTailwind } from './react-tailwind/index.js';

// Export types
export type { ComponentMapping, ComponentMappings, GeneratorTarget } from './types.js';

// Registry of available targets
export const targets: Record<string, GeneratorTarget> = {
  'react-tailwind': reactTailwind,
};

/**
 * Get a generator target by name
 * @throws Error if target not found
 */
export function getTarget(name: string): GeneratorTarget {
  const target = targets[name];
  if (!target) {
    const available = Object.keys(targets).join(', ');
    throw new Error(`Unknown target: ${name}. Available: ${available}`);
  }
  return target;
}

/**
 * Get list of available target names
 */
export function getAvailableTargets(): string[] {
  return Object.keys(targets);
}

// Re-export individual targets for direct access
export { reactTailwind } from './react-tailwind/index.js';
