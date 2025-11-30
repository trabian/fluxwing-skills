/**
 * Fluxwing Configuration Example
 *
 * Copy this file to `fluxwing.config.ts` and customize for your project.
 *
 * Targets can be loaded from:
 * - npm packages: '@company/fluxwing-target-name'
 * - Local files: './targets/my-target.ts'
 */

import type { FluxwingConfig } from './src/targets/index.js';

const config: FluxwingConfig = {
  targets: {
    // Alias for an npm package target
    banking: {
      source: '@acme/fluxwing-target-banking',
      description: 'ACME Banking Design System',
    },

    // Alias for a local file target
    internal: {
      source: './targets/internal-ds.ts',
      name: 'Internal DS',
      description: 'Internal design system components',
    },

    // Override built-in target (use sparingly)
    // 'react-tailwind': {
    //   source: './targets/custom-tailwind.ts',
    //   description: 'Custom Tailwind variant',
    // },
  },
};

export default config;
