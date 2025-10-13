import { FileTestUtils } from '../utils/file-utils';
import { FluxwingAssertions } from '../utils/assertions';
import * as path from 'path';

describe('Category 2: Agent File Consistency', () => {
  let fileUtils: FileTestUtils;
  let pluginRoot: string;

  beforeAll(() => {
    fileUtils = new FileTestUtils();
    pluginRoot = fileUtils.getPluginRoot();
  });

  describe('Test 2.1: Verify All Agents Have Data Location Headers', () => {
    const agentFiles = [
      'fluxwing-composer.md',
      'fluxwing-designer.md',
      'fluxwing-validator.md',
    ];

    test.each(agentFiles)(
      'Agent file %s should have "Data Location Rules" header',
      async (fileName) => {
        const filePath = path.join(pluginRoot, 'agents', fileName);

        await FluxwingAssertions.assertPathExists(
          filePath,
          `Agent file should exist: ${fileName}`
        );

        await FluxwingAssertions.assertFileContains(
          filePath,
          'Data Location Rules',
          `Agent file ${fileName} should contain "Data Location Rules" header`
        );
      }
    );

    test('All 3 agent files have Data Location Rules header with agent-focused tone', async () => {
      const agentsDir = path.join(pluginRoot, 'agents');
      const issues: string[] = [];

      for (const fileName of agentFiles) {
        const filePath = path.join(agentsDir, fileName);
        const content = await fileUtils.readFile(filePath);

        // Should have the header
        if (!content.includes('Data Location Rules')) {
          issues.push(`${fileName}: Missing "Data Location Rules" header`);
        }

        // Agent-focused tone check: should address "you" (the agent)
        const headerSection = content.split('Data Location Rules')[1]?.split('\n\n')[0] || '';
        if (headerSection && !headerSection.toLowerCase().includes('you')) {
          issues.push(`${fileName}: Data Location Rules section should use agent-focused language (e.g., "you")`);
        }
      }

      if (issues.length > 0) {
        throw new Error(`Agent header issues:\n${issues.join('\n')}`);
      }
    });
  });

  describe('Test 2.2: Verify Agent Inventory Check Order', () => {
    const agentInventoryTests = [
      {
        file: 'fluxwing-composer.md',
        section: 'Phase 1',
        description: 'composer Phase 1',
      },
      {
        file: 'fluxwing-designer.md',
        section: 'Phase 2',
        description: 'designer Phase 2',
      },
      {
        file: 'fluxwing-validator.md',
        section: 'Phase 1',
        description: 'validator Phase 1',
      },
    ];

    test.each(agentInventoryTests)(
      'Agent $file should list correct search order in $section',
      async ({ file, section }) => {
        const filePath = path.join(pluginRoot, 'agents', file);
        const content = await fileUtils.readFile(filePath);

        // Find the relevant section
        const sectionRegex = new RegExp(`${section}[^#]*`, 'i');
        const sectionContent = content.match(sectionRegex)?.[0] || content;

        // Should mention all three locations
        expect(sectionContent).toMatch(/\.\/fluxwing\/components\//);
        expect(sectionContent).toMatch(/\.\/fluxwing\/library\//);
        expect(sectionContent).toMatch(/{PLUGIN_ROOT}\/data\/examples/);
      }
    );

    test.each(agentInventoryTests)(
      'Agent $file should explicitly state priority order',
      async ({ file }) => {
        const filePath = path.join(pluginRoot, 'agents', file);
        const content = await fileUtils.readFile(filePath);

        // Should indicate that components directory is checked first
        const priorityIndicators = [
          /first\s+priority/i,
          /check.*first/i,
          /start.*components/i,
          /1\.\s*`\.\/fluxwing\/components/,
        ];

        const hasPriorityIndication = priorityIndicators.some((pattern) =>
          pattern.test(content)
        );

        expect(hasPriorityIndication).toBe(true);
      }
    );

    test('All agents follow the same search order: components → library → bundled', async () => {
      const agentsDir = path.join(pluginRoot, 'agents');
      const issues: string[] = [];

      for (const { file } of agentInventoryTests) {
        const filePath = path.join(agentsDir, file);
        const content = await fileUtils.readFile(filePath);

        // Extract search order mentions
        const componentsPos = content.indexOf('./fluxwing/components/');
        const libraryPos = content.indexOf('./fluxwing/library/');
        const bundledPos = content.indexOf('{PLUGIN_ROOT}/data/examples/');

        // All should be mentioned
        if (componentsPos === -1 || libraryPos === -1 || bundledPos === -1) {
          issues.push(`${file}: Not all locations mentioned`);
          continue;
        }

        // Components should come before library
        if (componentsPos > libraryPos) {
          issues.push(
            `${file}: Components should be mentioned before library in search order`
          );
        }

        // Library should come before bundled
        if (libraryPos > bundledPos) {
          issues.push(
            `${file}: Library should be mentioned before bundled templates in search order`
          );
        }
      }

      if (issues.length > 0) {
        throw new Error(`Search order issues:\n${issues.join('\n')}`);
      }
    });

    test('All agents specify that bundled templates are READ-ONLY references', async () => {
      const agentsDir = path.join(pluginRoot, 'agents');
      const issues: string[] = [];

      for (const { file } of agentInventoryTests) {
        const filePath = path.join(agentsDir, file);
        const content = await fileUtils.readFile(filePath);

        // Should mention READ-ONLY for bundled templates
        const readOnlyIndicators = [
          /READ-ONLY/i,
          /read only/i,
          /reference only/i,
          /do not (?:write|modify)/i,
        ];

        // Find the section about bundled templates
        const bundledSection = content.split('{PLUGIN_ROOT}/data/examples')[1]?.substring(0, 300) || '';

        const hasReadOnlyIndication = readOnlyIndicators.some((pattern) =>
          pattern.test(bundledSection)
        );

        if (!hasReadOnlyIndication) {
          issues.push(
            `${file}: Should specify that bundled templates are READ-ONLY`
          );
        }
      }

      if (issues.length > 0) {
        throw new Error(`READ-ONLY specification issues:\n${issues.join('\n')}`);
      }
    });
  });
});
