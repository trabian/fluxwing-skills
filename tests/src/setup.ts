/**
 * Jest setup file - runs before each test file
 */

// Set extended timeout for SDK operations
jest.setTimeout(60000);

// Ensure API key is available
beforeAll(() => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY not set. SDK-based tests will be skipped.');
  }
});
