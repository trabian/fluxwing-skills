import { ClaudeTestClient } from '../utils/claude-client';
import { FileTestUtils } from '../utils/file-utils';
import { FluxwingAssertions } from '../utils/assertions';
import * as path from 'path';

describe('Category 3: Functional Testing - Commands', () => {
  let client: ClaudeTestClient;
  let fileUtils: FileTestUtils;
  let testWorkspace: string;
  let pluginDataDir: string;

  beforeAll(async () => {
    // Skip if no API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('⚠️  Skipping functional tests - ANTHROPIC_API_KEY not set');
      return;
    }

    client = new ClaudeTestClient();
    fileUtils = new FileTestUtils();
    testWorkspace = await fileUtils.setupTestWorkspace();
    pluginDataDir = fileUtils.getPluginDataDir();

    // Change to test workspace
    process.chdir(testWorkspace);
  });

  afterAll(async () => {
    await fileUtils.cleanupTestWorkspace();
  });

  describe('Test 3.1: /fluxwing-create Output Location', () => {
    const skipIfNoApiKey = process.env.ANTHROPIC_API_KEY ? test : test.skip;

    skipIfNoApiKey('should save component to ./fluxwing/components/', async () => {
      const componentName = 'test-button';

      // Execute create command
      await client.executeCommand(`/fluxwing-create ${componentName}`);

      // Verify files created in correct location
      const componentPath = path.join(testWorkspace, 'fluxwing/components');
      const uxmFile = path.join(componentPath, `${componentName}.uxm`);
      const mdFile = path.join(componentPath, `${componentName}.md`);

      await FluxwingAssertions.assertPathExists(
        uxmFile,
        'UXM file should exist in components directory'
      );
      await FluxwingAssertions.assertPathExists(
        mdFile,
        'MD file should exist in components directory'
      );
    });

    skipIfNoApiKey('should NOT create files in plugin directory', async () => {
      const componentName = 'test-button-2';

      // Get initial file count in plugin data directory
      const beforeCount = await fileUtils.countFilesInDirectory(
        pluginDataDir,
        '*.uxm'
      );

      // Execute create command
      await client.executeCommand(`/fluxwing-create ${componentName}`);

      // Verify plugin data directory unchanged
      const afterCount = await fileUtils.countFilesInDirectory(
        pluginDataDir,
        '*.uxm'
      );

      expect(afterCount).toBe(beforeCount);
    });
  });

  describe('Test 3.2: /fluxwing-scaffold Output Location', () => {
    const skipIfNoApiKey = process.env.ANTHROPIC_API_KEY ? test : test.skip;

    skipIfNoApiKey('should save screen to ./fluxwing/screens/', async () => {
      const screenName = 'test-screen';

      // Execute scaffold command
      await client.executeCommand(`/fluxwing-scaffold ${screenName}`);

      // Verify screen files created in correct location
      const screenPath = path.join(testWorkspace, 'fluxwing/screens');
      const uxmFile = path.join(screenPath, `${screenName}.uxm`);
      const mdFile = path.join(screenPath, `${screenName}.md`);

      await FluxwingAssertions.assertPathExists(
        uxmFile,
        'Screen UXM file should exist in screens directory'
      );
      await FluxwingAssertions.assertPathExists(
        mdFile,
        'Screen MD file should exist in screens directory'
      );
    });

    skipIfNoApiKey('should save components to ./fluxwing/components/', async () => {
      const screenName = 'test-screen-2';

      // Execute scaffold command
      await client.executeCommand(`/fluxwing-scaffold ${screenName}`);

      // Check if any components were created
      const componentPath = path.join(testWorkspace, 'fluxwing/components');
      const componentCount = await fileUtils.countFilesInDirectory(
        componentPath,
        '*.uxm'
      );

      // Should have at least some components (from this or previous tests)
      expect(componentCount).toBeGreaterThan(0);
    });

    skipIfNoApiKey('should NOT create files in plugin directory', async () => {
      const screenName = 'test-screen-3';

      // Get initial timestamps
      const beforeTimestamps = await fileUtils.getFileTimestamps(pluginDataDir);

      // Execute scaffold command
      await client.executeCommand(`/fluxwing-scaffold ${screenName}`);

      // Verify plugin data directory unchanged
      const afterTimestamps = await fileUtils.getFileTimestamps(pluginDataDir);

      FluxwingAssertions.assertTimestampsUnchanged(
        beforeTimestamps,
        afterTimestamps,
        'Plugin data directory should remain unchanged'
      );
    });
  });

  describe('Test 3.3: /fluxwing-library Displays All Sources', () => {
    const skipIfNoApiKey = process.env.ANTHROPIC_API_KEY ? test : test.skip;

    skipIfNoApiKey('should display bundled templates section', async () => {
      const output = await client.executeCommand('/fluxwing-library');

      FluxwingAssertions.assertContains(
        output,
        /bundled.*template/i,
        'Should mention bundled templates'
      );

      FluxwingAssertions.assertContains(
        output,
        '11',
        'Should reference 11 bundled components'
      );
    });

    skipIfNoApiKey('should display project components section', async () => {
      // Create a component first
      await fileUtils.createTestComponent(
        'library-test',
        path.join(testWorkspace, 'fluxwing/components')
      );

      const output = await client.executeCommand('/fluxwing-library');

      FluxwingAssertions.assertContains(
        output,
        /project.*component/i,
        'Should mention project components'
      );

      FluxwingAssertions.assertContains(
        output,
        'library-test',
        'Should list the created test component'
      );
    });

    skipIfNoApiKey('should distinguish READ-ONLY vs editable sources', async () => {
      const output = await client.executeCommand('/fluxwing-library');

      FluxwingAssertions.assertContains(
        output,
        /READ-ONLY/i,
        'Should label bundled templates as READ-ONLY'
      );
    });
  });

  describe('Test 3.4: /fluxwing-validate Scope', () => {
    const skipIfNoApiKey = process.env.ANTHROPIC_API_KEY ? test : test.skip;

    skipIfNoApiKey('should only validate project workspace files', async () => {
      // Create a test component
      await fileUtils.createTestComponent(
        'validate-test',
        path.join(testWorkspace, 'fluxwing/components')
      );

      const output = await client.executeCommand('/fluxwing-validate');

      // Should show project file paths
      FluxwingAssertions.assertContains(
        output,
        './fluxwing/components/',
        'Should validate files in project components directory'
      );

      // Should NOT show plugin directory paths in validation results
      FluxwingAssertions.assertNotContains(
        output,
        /.claude\/plugins/,
        'Should not validate plugin directory files'
      );
    });

    skipIfNoApiKey('should skip bundled templates', async () => {
      const output = await client.executeCommand('/fluxwing-validate');

      // Should mention that bundled templates are skipped
      const skippedIndicators = [
        /bundled.*skip/i,
        /skip.*bundled/i,
        /pre-validated/i,
      ];

      const mentionsSkipped = skippedIndicators.some((pattern) =>
        pattern.test(output)
      );

      expect(mentionsSkipped).toBe(true);
    });

    skipIfNoApiKey('should show clear file paths in report', async () => {
      const output = await client.executeCommand('/fluxwing-validate');

      // Paths should be project-relative
      expect(output).toMatch(/\.\/fluxwing\//);

      // Should NOT contain absolute system paths
      expect(output).not.toMatch(/\/Users\/.*\/\.claude/);
      expect(output).not.toMatch(/\/home\/.*\/\.claude/);
    });
  });

  describe('Test 3.5: /fluxwing-get Search Order', () => {
    const skipIfNoApiKey = process.env.ANTHROPIC_API_KEY ? test : test.skip;

    skipIfNoApiKey('should find project component first (highest priority)', async () => {
      const componentName = 'priority-test';

      // Create in project components
      await fileUtils.createTestComponent(
        componentName,
        path.join(testWorkspace, 'fluxwing/components')
      );

      const output = await client.executeCommand(`/fluxwing-get ${componentName}`);

      // Should find and display from project components
      FluxwingAssertions.assertContains(
        output,
        './fluxwing/components/',
        'Should find component in project components directory'
      );
    });

    skipIfNoApiKey('should find bundled template if not in project', async () => {
      // Use a known bundled template name
      const bundledName = 'primary-button';

      const output = await client.executeCommand(`/fluxwing-get ${bundledName}`);

      // Should find in bundled templates
      FluxwingAssertions.assertContains(
        output,
        /{PLUGIN_ROOT}|bundled|template/i,
        'Should indicate component is from bundled templates'
      );
    });

    skipIfNoApiKey('should find library copy before bundled', async () => {
      const componentName = 'card';

      // Copy bundled template to library
      const pluginExamplePath = path.join(pluginDataDir, `${componentName}.uxm`);
      const libraryPath = path.join(
        testWorkspace,
        'fluxwing/library',
        `${componentName}.uxm`
      );

      // Check if bundled template exists, if so, copy it
      const bundledExists = await fileUtils.fileExists(pluginExamplePath);
      if (bundledExists) {
        await fileUtils.copyFile(pluginExamplePath, libraryPath);

        const output = await client.executeCommand(`/fluxwing-get ${componentName}`);

        // Should find library version first
        FluxwingAssertions.assertContains(
          output,
          './fluxwing/library/',
          'Should find component in library directory first'
        );
      } else {
        console.log('⚠️  Bundled card template not found, skipping library precedence test');
      }
    });

    skipIfNoApiKey('should clearly show source location in output', async () => {
      const componentName = 'location-test';

      // Create test component
      await fileUtils.createTestComponent(
        componentName,
        path.join(testWorkspace, 'fluxwing/components')
      );

      const output = await client.executeCommand(`/fluxwing-get ${componentName}`);

      // Output should clearly indicate the source
      expect(output).toMatch(/\.\/fluxwing\/components\/|location|source|found/i);
    });
  });
});
