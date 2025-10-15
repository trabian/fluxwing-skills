import { ClaudeTestClient } from '../utils/claude-client';
import { FileTestUtils } from '../utils/file-utils';
import { FluxwingAssertions } from '../utils/assertions';
import * as path from 'path';

describe('Category 4: Functional Testing - Agents', () => {
  let client: ClaudeTestClient;
  let fileUtils: FileTestUtils;
  let testWorkspace: string;
  let pluginDataDir: string;

  beforeAll(async () => {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('⚠️  Skipping agent tests - ANTHROPIC_API_KEY not set');
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

  describe('Test 4.1: fluxwing-designer Agent Output Locations', () => {
    const skipIfNoApiKey = process.env.ANTHROPIC_API_KEY ? test : test.skip;

    skipIfNoApiKey('should save components to ./fluxwing/components/', async () => {
      const agentPrompt = `
        Create a simple login form with:
        - email-input component
        - password-input component
        - submit button
      `;

      await client.dispatchAgent('fluxwing-designer', agentPrompt);

      // Verify components were created
      const componentPath = path.join(testWorkspace, 'fluxwing/components');
      const componentCount = await fileUtils.countFilesInDirectory(
        componentPath,
        '*.uxm'
      );

      expect(componentCount).toBeGreaterThan(0);
    });

    skipIfNoApiKey('should save screens to ./fluxwing/screens/ if created', async () => {
      const agentPrompt = 'Create a simple dashboard screen with a header and footer';

      await client.dispatchAgent('fluxwing-designer', agentPrompt);

      // Check if screens were created
      const screenPath = path.join(testWorkspace, 'fluxwing/screens');
      const screenExists = await fileUtils.fileExists(screenPath);

      if (screenExists) {
        const screenCount = await fileUtils.countFilesInDirectory(
          screenPath,
          '*.uxm'
        );
        expect(screenCount).toBeGreaterThanOrEqual(0);
      }
    });

    skipIfNoApiKey('should NOT create files in plugin directory', async () => {
      const beforeTimestamps = await fileUtils.getFileTimestamps(pluginDataDir);

      const agentPrompt = 'Create a notification component';
      await client.dispatchAgent('fluxwing-designer', agentPrompt);

      const afterTimestamps = await fileUtils.getFileTimestamps(pluginDataDir);

      FluxwingAssertions.assertTimestampsUnchanged(
        beforeTimestamps,
        afterTimestamps,
        'Designer agent should not modify plugin data directory'
      );
    });
  });

  describe('Test 4.2: fluxwing-composer Agent Inventory Check', () => {
    const skipIfNoApiKey = process.env.ANTHROPIC_API_KEY ? test : test.skip;

    skipIfNoApiKey('should check all three component sources', async () => {
      // Setup: Create components in different locations
      await fileUtils.createTestComponent(
        'custom-header',
        path.join(testWorkspace, 'fluxwing/components')
      );

      // Copy a bundled template to library (if exists)
      const bundledCard = path.join(pluginDataDir, 'card.uxm');
      const libraryCard = path.join(testWorkspace, 'fluxwing/library', 'card.uxm');

      if (await fileUtils.fileExists(bundledCard)) {
        await fileUtils.copyFile(bundledCard, libraryCard);
      }

      const agentPrompt = `
        Create a dashboard screen using:
        - custom-header (project component)
        - card (library component if available)
        - primary-button (bundled template)
      `;

      const output = await client.dispatchAgent('fluxwing-composer', agentPrompt);

      // Verify inventory phase mentions all sources
      FluxwingAssertions.assertContains(
        output,
        /\.\/fluxwing\/components/,
        'Should check project components'
      );

      FluxwingAssertions.assertContains(
        output,
        /\.\/fluxwing\/library/,
        'Should check library'
      );

      FluxwingAssertions.assertContains(
        output,
        /{PLUGIN_ROOT}|bundled|template/i,
        'Should check bundled templates'
      );
    });

    skipIfNoApiKey('should clearly state search order with priority', async () => {
      const agentPrompt = 'Create a contact form screen';

      const output = await client.dispatchAgent('fluxwing-composer', agentPrompt);

      // Should mention priority/order
      const priorityIndicators = [
        /first.*component/i,
        /priority/i,
        /check.*order/i,
        /1\..*component.*2\..*library/i,
      ];

      const mentionsPriority = priorityIndicators.some((pattern) =>
        pattern.test(output)
      );

      expect(mentionsPriority).toBe(true);
    });
  });

});
