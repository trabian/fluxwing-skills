#!/usr/bin/env node
/**
 * Simple render utility for fluxwing-ink designs
 *
 * Usage: Each design file should import and call renderDesign() at the end
 * Then run: npx tsx examples/login-screen.tsx
 */

import { render } from 'ink';
import React from 'react';

export function renderDesign(element: React.ReactElement): void {
  render(element);
}

// For static rendering (capture output)
import { render as renderToString } from 'ink-testing-library';

export function captureDesign(element: React.ReactElement): string {
  const { lastFrame } = renderToString(element);
  return lastFrame() || '';
}
