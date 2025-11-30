/**
 * External Target Loader
 *
 * Supports loading code generation targets from:
 * 1. Built-in targets (bundled with generator)
 * 2. npm packages (@company/fluxwing-target-banking)
 * 3. Local files (./targets/my-target.ts)
 * 4. Config file (fluxwing.config.ts with target definitions)
 *
 * @example
 * ```typescript
 * // Load built-in target
 * const target = await loadTarget('react-tailwind');
 *
 * // Load from npm package
 * const target = await loadTarget('@acme/fluxwing-target-banking');
 *
 * // Load from local file
 * const target = await loadTarget('./targets/internal-ds.ts');
 *
 * // Load with config resolution
 * const target = await loadTarget('banking', { configPath: './fluxwing.config.ts' });
 * ```
 */

import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import type { GeneratorTarget } from './types.js';

// Built-in targets (imported statically for bundling)
import { reactTailwind } from './react-tailwind/index.js';
import { netsuiteSuitelet } from './netsuite-suitelet/index.js';

/**
 * Registry of built-in targets
 */
const builtinTargets: Record<string, GeneratorTarget> = {
  'react-tailwind': reactTailwind,
  'netsuite-suitelet': netsuiteSuitelet,
};

/**
 * Configuration file structure
 */
export interface FluxwingConfig {
  targets?: Record<string, TargetConfig>;
}

/**
 * Target configuration entry
 */
export interface TargetConfig {
  /** npm package name or local file path */
  source: string;
  /** Optional display name override */
  name?: string;
  /** Optional description override */
  description?: string;
}

/**
 * Options for loading targets
 */
export interface LoadTargetOptions {
  /** Path to fluxwing.config.ts for alias resolution */
  configPath?: string;
  /** Base directory for resolving relative paths */
  basePath?: string;
  /** Preloaded config (avoids re-reading file) */
  config?: FluxwingConfig;
}

/**
 * Cache for loaded external targets
 */
const targetCache: Map<string, GeneratorTarget> = new Map();

/**
 * Cache for loaded configs
 */
const configCache: Map<string, FluxwingConfig> = new Map();

/**
 * Load a code generation target by name or path
 *
 * Resolution order:
 * 1. Check built-in targets
 * 2. Check config file aliases
 * 3. Try as npm package
 * 4. Try as local file path
 *
 * @param name Target name, package, or path
 * @param options Loading options
 * @returns Loaded GeneratorTarget
 * @throws Error if target cannot be loaded
 */
export async function loadTarget(
  name: string,
  options: LoadTargetOptions = {}
): Promise<GeneratorTarget> {
  const basePath = options.basePath || process.cwd();

  // 1. Check built-in targets first
  if (builtinTargets[name]) {
    return builtinTargets[name];
  }

  // 2. Check cache
  const cacheKey = `${basePath}:${name}`;
  if (targetCache.has(cacheKey)) {
    return targetCache.get(cacheKey)!;
  }

  // 3. Check config file for alias
  const config = options.config || await loadConfig(options.configPath, basePath);
  if (config?.targets?.[name]) {
    const targetConfig = config.targets[name];
    const target = await loadFromSource(targetConfig.source, basePath);

    // Apply config overrides
    const finalTarget: GeneratorTarget = {
      ...target,
      name: targetConfig.name || target.name,
      description: targetConfig.description || target.description,
    };

    targetCache.set(cacheKey, finalTarget);
    return finalTarget;
  }

  // 4. Try loading directly (npm package or file path)
  const target = await loadFromSource(name, basePath);
  targetCache.set(cacheKey, target);
  return target;
}

/**
 * Load target from a source (npm package or file path)
 */
async function loadFromSource(source: string, basePath: string): Promise<GeneratorTarget> {
  // Check if it's a file path (starts with ./ or ../ or /)
  if (isFilePath(source)) {
    return loadFromFile(source, basePath);
  }

  // Try as npm package
  return loadFromPackage(source);
}

/**
 * Check if a source string looks like a file path
 */
function isFilePath(source: string): boolean {
  return (
    source.startsWith('./') ||
    source.startsWith('../') ||
    source.startsWith('/') ||
    source.endsWith('.ts') ||
    source.endsWith('.js') ||
    source.endsWith('.mjs')
  );
}

/**
 * Load target from a local file
 */
async function loadFromFile(filePath: string, basePath: string): Promise<GeneratorTarget> {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(basePath, filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Target file not found: ${absolutePath}`);
  }

  try {
    // Use dynamic import with file:// URL for ESM compatibility
    const fileUrl = pathToFileURL(absolutePath).href;
    const module = await import(fileUrl);

    // Look for default export or named 'target' export
    const target = module.default || module.target;

    if (!isValidTarget(target)) {
      throw new Error(`Invalid target export from ${absolutePath}. Expected GeneratorTarget.`);
    }

    return target;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ERR_MODULE_NOT_FOUND') {
      throw new Error(`Failed to load target from ${absolutePath}: Module not found`);
    }
    throw new Error(`Failed to load target from ${absolutePath}: ${error}`);
  }
}

/**
 * Load target from an npm package
 */
async function loadFromPackage(packageName: string): Promise<GeneratorTarget> {
  try {
    const module = await import(packageName);

    // Look for default export or named 'target' export
    const target = module.default || module.target;

    if (!isValidTarget(target)) {
      throw new Error(
        `Invalid target export from package ${packageName}. ` +
        `Expected GeneratorTarget with name, description, mappings, and generate function.`
      );
    }

    return target;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ERR_MODULE_NOT_FOUND') {
      throw new Error(
        `Target package not found: ${packageName}. ` +
        `Make sure it's installed: npm install ${packageName}`
      );
    }
    throw new Error(`Failed to load target from package ${packageName}: ${error}`);
  }
}

/**
 * Validate that an object is a valid GeneratorTarget
 */
function isValidTarget(obj: unknown): obj is GeneratorTarget {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const target = obj as Record<string, unknown>;

  return (
    typeof target.name === 'string' &&
    typeof target.description === 'string' &&
    typeof target.mappings === 'object' &&
    typeof target.generate === 'function'
  );
}

/**
 * Load fluxwing.config.ts configuration file
 */
async function loadConfig(
  configPath?: string,
  basePath: string = process.cwd()
): Promise<FluxwingConfig | null> {
  // Try explicit path first
  const pathsToTry = configPath
    ? [path.resolve(basePath, configPath)]
    : [
        path.resolve(basePath, 'fluxwing.config.ts'),
        path.resolve(basePath, 'fluxwing.config.js'),
        path.resolve(basePath, 'fluxwing.config.mjs'),
      ];

  for (const configFile of pathsToTry) {
    // Check cache
    if (configCache.has(configFile)) {
      return configCache.get(configFile)!;
    }

    if (fs.existsSync(configFile)) {
      try {
        const fileUrl = pathToFileURL(configFile).href;
        const module = await import(fileUrl);
        const config = module.default || module.config || module;

        if (isValidConfig(config)) {
          configCache.set(configFile, config);
          return config;
        }
      } catch {
        // Config file exists but failed to load - continue to next
        continue;
      }
    }
  }

  return null;
}

/**
 * Validate config structure
 */
function isValidConfig(obj: unknown): obj is FluxwingConfig {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const config = obj as Record<string, unknown>;

  // Config can be empty or have targets
  if (config.targets && typeof config.targets !== 'object') {
    return false;
  }

  return true;
}

/**
 * Get list of all available targets (built-in + config)
 */
export async function getAvailableTargets(
  options: LoadTargetOptions = {}
): Promise<string[]> {
  const builtinNames = Object.keys(builtinTargets);
  const config = await loadConfig(options.configPath, options.basePath);
  const configNames = config?.targets ? Object.keys(config.targets) : [];

  // Combine and deduplicate
  return [...new Set([...builtinNames, ...configNames])];
}

/**
 * Get detailed info about available targets
 */
export async function getTargetInfo(
  options: LoadTargetOptions = {}
): Promise<Array<{ name: string; description: string; source: 'builtin' | 'config' | 'both' }>> {
  const config = await loadConfig(options.configPath, options.basePath);
  const result: Array<{ name: string; description: string; source: 'builtin' | 'config' | 'both' }> = [];

  // Add built-in targets
  for (const [name, target] of Object.entries(builtinTargets)) {
    const inConfig = config?.targets?.[name];
    result.push({
      name,
      description: target.description,
      source: inConfig ? 'both' : 'builtin',
    });
  }

  // Add config-only targets
  if (config?.targets) {
    for (const [name, targetConfig] of Object.entries(config.targets)) {
      if (!builtinTargets[name]) {
        result.push({
          name,
          description: targetConfig.description || `External: ${targetConfig.source}`,
          source: 'config',
        });
      }
    }
  }

  return result;
}

/**
 * Clear the target and config caches
 * Useful for hot reloading during development
 */
export function clearCache(): void {
  targetCache.clear();
  configCache.clear();
}

/**
 * Preload targets from config for faster access
 */
export async function preloadTargets(
  options: LoadTargetOptions = {}
): Promise<Map<string, GeneratorTarget>> {
  const names = await getAvailableTargets(options);
  const targets = new Map<string, GeneratorTarget>();

  for (const name of names) {
    try {
      const target = await loadTarget(name, options);
      targets.set(name, target);
    } catch {
      // Skip targets that fail to load during preload
      console.warn(`Warning: Failed to preload target "${name}"`);
    }
  }

  return targets;
}
