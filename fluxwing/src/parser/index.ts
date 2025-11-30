/**
 * Component Parser Module
 *
 * Shared utilities for parsing inline component definitions and loading
 * component definitions from external files.
 *
 * @example
 * ```typescript
 * import {
 *   parseInlineComponents,
 *   loadComponentsFromFile,
 *   mergeComponentDefinitions,
 *   getDefaultTemplates,
 * } from './src/parser/index.js';
 *
 * // Parse inline definitions
 * const { jsx, components } = parseInlineComponents(input);
 *
 * // Load from file
 * const fileComponents = loadComponentsFromFile('./components.yml');
 *
 * // Merge (inline takes precedence)
 * const allComponents = mergeComponentDefinitions(fileComponents, components);
 *
 * // Get defaults only (for generators that don't need states)
 * const defaults = getDefaultTemplates(allComponents);
 * ```
 */

// Types
export type {
  ComponentDefinition,
  ParsedInput,
  ParsedComponentLine,
} from './types.js';

// Parsing functions
export {
  parseComponentLine,
  parseInlineComponents,
  mergeComponentDefinitions,
  getDefaultTemplates,
} from './parse-inline.js';

// File loading functions
export {
  loadComponentsFromFile,
  loadComponentsFromFiles,
} from './load-file.js';
