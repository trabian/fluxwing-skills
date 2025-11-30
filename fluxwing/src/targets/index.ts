/**
 * Code Generation Targets
 *
 * Each target transforms Fluxwing JSX to platform-specific code.
 *
 * Supports:
 * - Built-in targets (react-tailwind, netsuite-suitelet)
 * - npm package targets (@company/fluxwing-target-banking)
 * - Local file targets (./targets/internal-ds.ts)
 * - Config-based aliases (fluxwing.config.ts)
 *
 * @example
 * ```typescript
 * import { getTarget, loadTarget, getAvailableTargets } from './src/targets/index.js';
 *
 * // Sync: Get built-in target (fast, no async)
 * const target = getTarget('react-tailwind');
 *
 * // Async: Load any target (built-in, npm, or local file)
 * const target = await loadTarget('@acme/banking-components');
 * const target = await loadTarget('./targets/internal.ts');
 *
 * // Generate code
 * const output = target.generate(jsx, customComponents);
 * ```
 */

import type { GeneratorTarget } from './types.js';
import { reactTailwind } from './react-tailwind/index.js';
import { netsuiteSuitelet } from './netsuite-suitelet/index.js';

// Export types
export type { ComponentMapping, ComponentMappings, GeneratorTarget } from './types.js';
export type { FluxwingConfig, TargetConfig, LoadTargetOptions } from './loader.js';

// Export loader functions for async/external target loading
export {
  loadTarget,
  getAvailableTargets as getAvailableTargetsAsync,
  getTargetInfo,
  clearCache,
  preloadTargets,
} from './loader.js';

// Registry of built-in targets (for sync access)
export const targets: Record<string, GeneratorTarget> = {
  'react-tailwind': reactTailwind,
  'netsuite-suitelet': netsuiteSuitelet,
};

/**
 * Get a built-in generator target by name (synchronous)
 *
 * For external targets (npm packages, local files), use loadTarget() instead.
 *
 * @param name Built-in target name
 * @throws Error if target not found in built-ins
 */
export function getTarget(name: string): GeneratorTarget {
  const target = targets[name];
  if (!target) {
    const available = Object.keys(targets).join(', ');
    throw new Error(
      `Unknown built-in target: ${name}. Available: ${available}. ` +
      `For external targets, use loadTarget() instead.`
    );
  }
  return target;
}

/**
 * Get list of built-in target names (synchronous)
 *
 * For all targets including external ones, use getAvailableTargetsAsync().
 */
export function getAvailableTargets(): string[] {
  return Object.keys(targets);
}

// Re-export individual targets for direct access
export { reactTailwind } from './react-tailwind/index.js';
export { netsuiteSuitelet } from './netsuite-suitelet/index.js';
