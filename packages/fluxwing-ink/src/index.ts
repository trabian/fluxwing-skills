// Re-export all components
export * from './components/index.js';

// Re-export React Ink's render for convenience
export { render } from 'ink';

// Helper to render a design to string (for preview without clearing terminal)
import { render } from 'ink';
import React from 'react';

/**
 * Renders a React element to the terminal
 * Use this for interactive preview mode
 */
export function renderDesign(element: React.ReactElement): void {
  render(element);
}

/**
 * Design file metadata
 */
export interface DesignMeta {
  name: string;
  description?: string;
  author?: string;
  version?: string;
  platform?: 'web' | 'mobile' | 'universal';
}

/**
 * Decorator for design files (for future tooling)
 */
export function design(meta: DesignMeta) {
  return function <T extends React.ComponentType>(Component: T): T {
    (Component as any).__designMeta = meta;
    return Component;
  };
}
