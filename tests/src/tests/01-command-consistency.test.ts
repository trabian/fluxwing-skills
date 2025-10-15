import { FileTestUtils } from '../utils/file-utils';
import { FluxwingAssertions } from '../utils/assertions';
import * as path from 'path';

describe('Category 1: Command File Consistency', () => {
  let fileUtils: FileTestUtils;
  let pluginRoot: string;

  beforeAll(() => {
    fileUtils = new FileTestUtils();
    pluginRoot = fileUtils.getPluginRoot();
  });

  describe('Test 1.1: Verify All Commands Have Data Location Headers', () => {
    const commandFiles = [
      'fluxwing-create.md',
      'fluxwing-library.md',
      'fluxwing-scaffold.md',
      'fluxwing-get.md',
    ];

    test.each(commandFiles)(
      'Command file %s should have "Data Location Rules" header',
      async (fileName) => {
        const filePath = path.join(pluginRoot, 'commands', fileName);

        await FluxwingAssertions.assertPathExists(
          filePath,
          `Command file should exist: ${fileName}`
        );

        await FluxwingAssertions.assertFileContains(
          filePath,
          'Data Location Rules',
          `Command file ${fileName} should contain "Data Location Rules" header`
        );
      }
    );

    test('All 4 command files have Data Location Rules header', async () => {
      const commandsDir = path.join(pluginRoot, 'commands');
      let allHaveHeader = true;
      const missingFiles: string[] = [];

      for (const fileName of commandFiles) {
        const filePath = path.join(commandsDir, fileName);
        try {
          await FluxwingAssertions.assertFileContains(
            filePath,
            'Data Location Rules'
          );
        } catch {
          allHaveHeader = false;
          missingFiles.push(fileName);
        }
      }

      expect(allHaveHeader).toBe(true);
      if (missingFiles.length > 0) {
        throw new Error(
          `Missing "Data Location Rules" header in: ${missingFiles.join(', ')}`
        );
      }
    });
  });

  describe('Test 1.2: Verify Consistent Path References in Commands', () => {
    const commandFiles = [
      'fluxwing-create.md',
      'fluxwing-library.md',
      'fluxwing-scaffold.md',
      'fluxwing-get.md',
    ];

    test.each(commandFiles)(
      'Command file %s should NOT contain hardcoded plugin paths',
      async (fileName) => {
        const filePath = path.join(pluginRoot, 'commands', fileName);
        const content = await fileUtils.readFile(filePath);

        // Should NOT contain hardcoded paths
        expect(content).not.toMatch(/\/Users\/.*\/\.claude\/plugins/);
        expect(content).not.toMatch(/~\/\.claude\/plugins\/[^{]/); // Allow {PLUGIN_ROOT}
        expect(content).not.toMatch(/\/home\/.*\/\.claude\/plugins/);
      }
    );

    test.each(commandFiles)(
      'Command file %s should use consistent path variables',
      async (fileName) => {
        const filePath = path.join(pluginRoot, 'commands', fileName);
        const content = await fileUtils.readFile(filePath);

        // If file mentions data/examples, it should use {PLUGIN_ROOT}
        if (content.includes('data/examples')) {
          expect(content).toMatch(/{PLUGIN_ROOT}\/data\/examples/);
        }

        // If file mentions components directory, should use ./fluxwing/components/
        if (content.includes('components') && !content.includes('# Components')) {
          // Allow heading, but require proper path format
          const hasCorrectFormat =
            content.includes('./fluxwing/components/') ||
            content.includes('`./fluxwing/components/`');

          expect(hasCorrectFormat).toBe(true);
        }

        // If file mentions screens directory, should use ./fluxwing/screens/
        if (content.includes('screens') && !content.includes('# Screens')) {
          const hasCorrectFormat =
            content.includes('./fluxwing/screens/') ||
            content.includes('`./fluxwing/screens/`');

          expect(hasCorrectFormat).toBe(true);
        }

        // If file mentions library directory, should use ./fluxwing/library/
        if (content.includes('library') && !content.includes('# Library')) {
          const hasCorrectFormat =
            content.includes('./fluxwing/library/') ||
            content.includes('`./fluxwing/library/`');

          expect(hasCorrectFormat).toBe(true);
        }
      }
    );

    test('All commands use {PLUGIN_ROOT} variable for plugin data', async () => {
      const commandsDir = path.join(pluginRoot, 'commands');
      const issues: string[] = [];

      for (const fileName of commandFiles) {
        const filePath = path.join(commandsDir, fileName);
        const content = await fileUtils.readFile(filePath);

        // Check for data/examples references
        const dataExamplesMatches = content.match(/data\/examples/g);
        if (dataExamplesMatches) {
          const pluginRootMatches = content.match(/{PLUGIN_ROOT}\/data\/examples/g);

          // Every data/examples should be prefixed with {PLUGIN_ROOT}
          if (!pluginRootMatches || pluginRootMatches.length < dataExamplesMatches.length) {
            issues.push(`${fileName}: Found data/examples without {PLUGIN_ROOT} prefix`);
          }
        }
      }

      if (issues.length > 0) {
        throw new Error(`Path consistency issues:\n${issues.join('\n')}`);
      }
    });

    test('All commands use project-relative paths for output', async () => {
      const commandsDir = path.join(pluginRoot, 'commands');
      const issues: string[] = [];

      for (const fileName of commandFiles) {
        const filePath = path.join(commandsDir, fileName);
        const content = await fileUtils.readFile(filePath);

        // Check that output paths start with ./fluxwing/
        const outputPaths = [
          './fluxwing/components/',
          './fluxwing/screens/',
          './fluxwing/library/',
        ];

        // At least one command should mention these output locations
        let hasOutputPath = false;
        for (const outputPath of outputPaths) {
          if (content.includes(outputPath)) {
            hasOutputPath = true;
            break;
          }
        }

        // Commands that create/modify should have output paths
        if (
          (fileName.includes('create') ||
            fileName.includes('scaffold') ||
            fileName.includes('library')) &&
          !hasOutputPath
        ) {
          issues.push(`${fileName}: Missing project-relative output paths`);
        }
      }

      if (issues.length > 0) {
        throw new Error(`Output path issues:\n${issues.join('\n')}`);
      }
    });
  });
});
