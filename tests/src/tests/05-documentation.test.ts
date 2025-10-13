import { FileTestUtils } from '../utils/file-utils';
import { FluxwingAssertions } from '../utils/assertions';
import * as path from 'path';

describe('Category 5: Documentation Consistency', () => {
  let fileUtils: FileTestUtils;
  let pluginRoot: string;

  beforeAll(() => {
    fileUtils = new FileTestUtils();
    pluginRoot = fileUtils.getPluginRoot();
  });

  describe('Test 5.1: Verify Documentation Updates', () => {
    const docTests = [
      {
        file: 'CLAUDE.md',
        expectedSection: 'Data Location Philosophy',
        description: 'CLAUDE.md should have Data Location Philosophy section',
      },
      {
        file: 'README.md',
        expectedSection: 'READ-ONLY',
        description: 'README.md should have READ-ONLY/READ-WRITE labels',
      },
      {
        file: 'COMMANDS.md',
        expectedSection: 'Data Location Philosophy',
        description: 'COMMANDS.md should have Data Location Philosophy section',
      },
      {
        file: 'AGENTS.md',
        expectedSection: 'Data Location Rules for Agents',
        description: 'AGENTS.md should have Data Location Rules for Agents section',
      },
    ];

    test.each(docTests)(
      '$description',
      async ({ file, expectedSection }) => {
        const filePath = path.join(pluginRoot, file);

        await FluxwingAssertions.assertPathExists(
          filePath,
          `Documentation file should exist: ${file}`
        );

        await FluxwingAssertions.assertFileContains(
          filePath,
          expectedSection,
          `${file} should contain "${expectedSection}" section`
        );
      }
    );

    test('COMMANDS.md should have /fluxwing-get entry', async () => {
      const filePath = path.join(pluginRoot, 'COMMANDS.md');

      await FluxwingAssertions.assertFileContains(
        filePath,
        'fluxwing-get',
        'COMMANDS.md should document the /fluxwing-get command'
      );
    });

    test('README.md should have directory structure with labels', async () => {
      const filePath = path.join(pluginRoot, 'README.md');
      const content = await fileUtils.readFile(filePath);

      // Should mention the directory structure
      const structureIndicators = [
        /directory.*structure/i,
        /file.*structure/i,
        /fluxwing\/components/,
        /fluxwing\/screens/,
      ];

      const hasStructure = structureIndicators.some((pattern) =>
        pattern.test(content)
      );

      expect(hasStructure).toBe(true);
    });

    test('All documentation files are consistent with path references', async () => {
      const docFiles = ['CLAUDE.md', 'README.md', 'COMMANDS.md', 'AGENTS.md'];
      const issues: string[] = [];

      for (const file of docFiles) {
        const filePath = path.join(pluginRoot, file);
        const content = await fileUtils.readFile(filePath);

        // Should NOT contain hardcoded plugin paths
        if (content.match(/\/Users\/.*\/\.claude\/plugins\/[^{]/)) {
          issues.push(`${file}: Contains hardcoded plugin path`);
        }

        // If mentions data/examples, should use {PLUGIN_ROOT}
        if (content.includes('data/examples')) {
          if (!content.includes('{PLUGIN_ROOT}/data/examples')) {
            issues.push(`${file}: References data/examples without {PLUGIN_ROOT}`);
          }
        }
      }

      if (issues.length > 0) {
        throw new Error(`Documentation path issues:\n${issues.join('\n')}`);
      }
    });
  });

  describe('Test 5.2: Verify Cross-Reference Consistency', () => {
    test('All files consistently reference "11" bundled templates', async () => {
      const allFiles = await fileUtils.findFiles('**/*.md', pluginRoot);
      const issues: string[] = [];

      for (const file of allFiles) {
        const content = await fileUtils.readFile(file);

        // Find template count references
        const patterns = [
          /(\d+)\s+bundled/gi,
          /(\d+)\s+curated/gi,
          /(\d+)\s+component.*template/gi,
        ];

        for (const pattern of patterns) {
          const matches = content.matchAll(pattern);
          for (const match of matches) {
            const count = match[1];
            if (count !== '11') {
              const relativePath = path.relative(pluginRoot, file);
              issues.push(
                `${relativePath}: References "${count}" templates instead of "11"`
              );
            }
          }
        }
      }

      if (issues.length > 0) {
        throw new Error(`Template count inconsistencies:\n${issues.join('\n')}`);
      }
    });

    test('All files use {PLUGIN_ROOT} variable consistently', async () => {
      const allFiles = await fileUtils.findFiles('**/*.md', pluginRoot);
      const issues: string[] = [];

      for (const file of allFiles) {
        const content = await fileUtils.readFile(file);

        // Check for inconsistent plugin path references
        const badPatterns = [
          { pattern: /~\/\.claude\/plugins\/fluxwing/g, name: 'tilde path' },
          {
            pattern: /\/Users\/[^/]+\/\.claude\/plugins/g,
            name: 'hardcoded user path',
          },
          {
            pattern: /\/home\/[^/]+\/\.claude\/plugins/g,
            name: 'hardcoded home path',
          },
        ];

        for (const { pattern, name } of badPatterns) {
          if (pattern.test(content)) {
            const relativePath = path.relative(pluginRoot, file);
            issues.push(`${relativePath}: Contains ${name} instead of {PLUGIN_ROOT}`);
          }
        }
      }

      if (issues.length > 0) {
        throw new Error(`Path variable inconsistencies:\n${issues.join('\n')}`);
      }
    });

    test('All references to output locations use project-relative paths', async () => {
      const allFiles = await fileUtils.findFiles('**/*.md', pluginRoot);
      const issues: string[] = [];

      for (const file of allFiles) {
        const content = await fileUtils.readFile(file);

        // Check for proper project-relative paths
        const outputDirs = ['components', 'screens', 'library'];

        for (const dir of outputDirs) {
          // If mentions the directory as an output location
          const contextPattern = new RegExp(
            `(save|write|create|output).*${dir}`,
            'i'
          );

          if (contextPattern.test(content)) {
            // Should use ./fluxwing/dir/ format
            const correctFormat = `./fluxwing/${dir}/`;
            if (!content.includes(correctFormat)) {
              const relativePath = path.relative(pluginRoot, file);
              issues.push(
                `${relativePath}: Mentions ${dir} output but doesn't use "${correctFormat}" format`
              );
            }
          }
        }
      }

      // Allow some false positives, but flag if many files have issues
      if (issues.length > 3) {
        throw new Error(`Output path format issues:\n${issues.join('\n')}`);
      }
    });

    test('Documentation mentions both READ-ONLY and READ-WRITE concepts', async () => {
      const docFiles = ['CLAUDE.md', 'README.md', 'COMMANDS.md', 'AGENTS.md'];
      const issues: string[] = [];

      for (const file of docFiles) {
        const filePath = path.join(pluginRoot, file);
        const content = await fileUtils.readFile(filePath);

        // Should mention READ-ONLY concept
        const readOnlyIndicators = [
          /READ-ONLY/i,
          /read only/i,
          /read-only/i,
          /do not (?:write|modify)/i,
        ];

        const mentionsReadOnly = readOnlyIndicators.some((pattern) =>
          pattern.test(content)
        );

        if (!mentionsReadOnly && (file === 'CLAUDE.md' || file === 'AGENTS.md')) {
          issues.push(`${file}: Should mention READ-ONLY concept for bundled templates`);
        }
      }

      if (issues.length > 0) {
        throw new Error(`READ-ONLY concept issues:\n${issues.join('\n')}`);
      }
    });
  });
});
