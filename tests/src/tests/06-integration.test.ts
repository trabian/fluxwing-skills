import { ClaudeTestClient } from '../utils/claude-client';
import { FileTestUtils } from '../utils/file-utils';
import { FluxwingAssertions } from '../utils/assertions';
import * as path from 'path';

describe('Category 6: Integration & Edge Cases', () => {
  let client: ClaudeTestClient;
  let fileUtils: FileTestUtils;
  let testWorkspace: string;
  let pluginDataDir: string;

  beforeAll(async () => {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('⚠️  Skipping integration tests - ANTHROPIC_API_KEY not set');
      return;
    }

    client = new ClaudeTestClient();
    fileUtils = new FileTestUtils();
    testWorkspace = await fileUtils.setupTestWorkspace();
    pluginDataDir = fileUtils.getPluginDataDir();

    process.chdir(testWorkspace);
  });

  afterAll(async () => {
    await fileUtils.cleanupTestWorkspace();
  });

  describe('Test 6.1: Complete Component Lifecycle End-to-End', () => {
    const skipIfNoApiKey = process.env.ANTHROPIC_API_KEY ? test : test.skip;

    skipIfNoApiKey('should complete full workflow: browse → view → copy → create', async () => {
      // Step 1: Browse library
      const lib1 = await client.executeCommand('/fluxwing-library');
      FluxwingAssertions.assertContains(lib1, '11', 'Should show 11 bundled templates');

      // Step 2: View a bundled template
      const view1 = await client.executeCommand('/fluxwing-get card');
      FluxwingAssertions.assertContains(
        view1,
        /bundled|template|{PLUGIN_ROOT}/i,
        'Should find bundled card template'
      );

      // Step 3: Copy to library (simulate by creating in library)
      const cardPath = path.join(pluginDataDir, 'card.uxm');
      const libraryCardPath = path.join(testWorkspace, 'fluxwing/library', 'card.uxm');

      if (await fileUtils.fileExists(cardPath)) {
        await fileUtils.copyFile(cardPath, libraryCardPath);
      }

      // Step 4: Create a new component
      await client.executeCommand('/fluxwing-create custom-card');

      // Step 5: View the new component
      const view2 = await client.executeCommand('/fluxwing-get custom-card');
      FluxwingAssertions.assertContains(
        view2,
        './fluxwing/components/',
        'Should find custom-card in components'
      );

      // Step 6: Browse library again
      const lib2 = await client.executeCommand('/fluxwing-library');

      // Should show all sources
      FluxwingAssertions.assertContains(lib2, '11', 'Should still show 11 bundled');
      FluxwingAssertions.assertContains(lib2, 'custom-card', 'Should show custom-card');
    });
  });

  describe('Test 6.2: Mixed Source Component Usage', () => {
    const skipIfNoApiKey = process.env.ANTHROPIC_API_KEY ? test : test.skip;

    skipIfNoApiKey('should compose screen using components from all three sources', async () => {
      // Setup: Create components in different locations
      await fileUtils.createTestComponent(
        'custom-header',
        path.join(testWorkspace, 'fluxwing/components')
      );

      // Copy bundled template to library
      const bundledButton = path.join(pluginDataDir, 'primary-button.uxm');
      const libraryButton = path.join(
        testWorkspace,
        'fluxwing/library',
        'primary-button.uxm'
      );

      if (await fileUtils.fileExists(bundledButton)) {
        await fileUtils.copyFile(bundledButton, libraryButton);
      }

      // Dispatch composer
      const agentPrompt = `
        Create a contact form screen using:
        - custom-header (project component)
        - email-input (bundled template)
        - Any other needed components
      `;

      const output = await client.dispatchAgent('fluxwing-composer', agentPrompt);

      // Verify agent found components from multiple sources
      const mentionsSources =
        output.includes('./fluxwing/components/') ||
        output.includes('./fluxwing/library/') ||
        /bundled|template|{PLUGIN_ROOT}/i.test(output);

      expect(mentionsSources).toBe(true);

      // Verify screen was created
      const screenPath = path.join(testWorkspace, 'fluxwing/screens');
      const screenCount = await fileUtils.countFilesInDirectory(screenPath, '*.uxm');

      expect(screenCount).toBeGreaterThan(0);
    });

    skipIfNoApiKey('should clearly state source for each component used', async () => {
      const agentPrompt = 'Create a simple form with email input and submit button';

      const output = await client.dispatchAgent('fluxwing-composer', agentPrompt);

      // Should mention where components come from
      const sourceIndicators = [
        /found.*in/i,
        /from.*component/i,
        /source/i,
        /\.\/fluxwing\//,
      ];

      const mentionsSource = sourceIndicators.some((pattern) => pattern.test(output));

      expect(mentionsSource).toBe(true);
    });
  });

  describe('Test 6.3: Error Messages Show Correct Paths', () => {
    const skipIfNoApiKey = process.env.ANTHROPIC_API_KEY ? test : test.skip;

    skipIfNoApiKey('should show project-relative paths in error messages', async () => {
      // Create a component with invalid path reference
      const testComponentPath = path.join(
        testWorkspace,
        'fluxwing/components',
        'test-error.uxm'
      );

      await fileUtils.writeFile(
        testComponentPath,
        JSON.stringify({
          id: 'test-error',
          type: 'button',
          // Valid component
        })
      );

      // Try to get a non-existent component (should produce error)
      const output = await client.executeCommand('/fluxwing-get non-existent-component');

      // Error messages should NOT show plugin directory paths
      expect(output).not.toMatch(/\.claude\/plugins/);
    });

    skipIfNoApiKey('should provide actionable error messages', async () => {
      // Try to get a non-existent component
      const output = await client.executeCommand('/fluxwing-get non-existent-test-component');

      // Should have specific error message
      expect(output).toMatch(/not found|doesn't exist|cannot find/i);
    });
  });

  describe('Test 6.4: Read-Only Enforcement', () => {
    const skipIfNoApiKey = process.env.ANTHROPIC_API_KEY ? test : test.skip;

    skipIfNoApiKey('should never write to plugin data directory', async () => {
      // Get initial state
      const beforeTimestamps = await fileUtils.getFileTimestamps(pluginDataDir);
      const beforeCount = await fileUtils.countFilesInDirectory(pluginDataDir);

      // Run multiple operations
      await client.executeCommand('/fluxwing-create test1');
      await client.executeCommand('/fluxwing-scaffold screen1');
      await client.dispatchAgent('fluxwing-designer', 'Create a notification component');

      // Verify plugin directory unchanged
      const afterTimestamps = await fileUtils.getFileTimestamps(pluginDataDir);
      const afterCount = await fileUtils.countFilesInDirectory(pluginDataDir);

      // File count should be identical
      expect(afterCount).toBe(beforeCount);

      // Timestamps should be unchanged
      FluxwingAssertions.assertTimestampsUnchanged(
        beforeTimestamps,
        afterTimestamps,
        'Plugin data directory must remain completely unchanged'
      );
    });

    skipIfNoApiKey('should maintain plugin directory integrity across all operations', async () => {
      const operations = [
        () => client.executeCommand('/fluxwing-create integrity-test-1'),
        () => client.executeCommand('/fluxwing-scaffold integrity-screen'),
        () => client.executeCommand('/fluxwing-library'),
        () => client.dispatchAgent('fluxwing-designer', 'Create a card component'),
      ];

      // Record initial state
      const initialTimestamps = await fileUtils.getFileTimestamps(pluginDataDir);

      // Run all operations
      for (const operation of operations) {
        await operation();

        // Verify after each operation
        const currentTimestamps = await fileUtils.getFileTimestamps(pluginDataDir);

        FluxwingAssertions.assertTimestampsUnchanged(
          initialTimestamps,
          currentTimestamps,
          'Plugin directory should remain unchanged after each operation'
        );
      }
    });
  });
});
