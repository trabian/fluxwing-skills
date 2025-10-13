import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { glob } from 'glob';

/**
 * File system utilities for testing
 */
export class FileTestUtils {
  private testWorkspaceRoot?: string;

  /**
   * Setup a clean test workspace
   */
  async setupTestWorkspace(): Promise<string> {
    const timestamp = Date.now();
    const testDir = path.join(os.tmpdir(), `fluxwing-test-${timestamp}`);

    await fs.mkdir(testDir, { recursive: true });

    // Create Fluxwing directory structure
    await fs.mkdir(path.join(testDir, 'fluxwing/components'), { recursive: true });
    await fs.mkdir(path.join(testDir, 'fluxwing/screens'), { recursive: true });
    await fs.mkdir(path.join(testDir, 'fluxwing/library'), { recursive: true });

    this.testWorkspaceRoot = testDir;
    return testDir;
  }

  /**
   * Cleanup test workspace
   */
  async cleanupTestWorkspace(): Promise<void> {
    if (this.testWorkspaceRoot) {
      try {
        await fs.rm(this.testWorkspaceRoot, { recursive: true, force: true });
      } catch (error) {
        console.warn(`Failed to cleanup test workspace: ${error}`);
      }
    }
  }

  /**
   * Verify path structure exists
   */
  async verifyPathStructure(basePath: string): Promise<boolean> {
    const requiredPaths = [
      path.join(basePath, 'fluxwing/components'),
      path.join(basePath, 'fluxwing/screens'),
      path.join(basePath, 'fluxwing/library'),
    ];

    try {
      for (const dirPath of requiredPaths) {
        await fs.access(dirPath);
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Count files in a directory
   */
  async countFilesInDirectory(dirPath: string, pattern: string = '*'): Promise<number> {
    try {
      const files = await glob(path.join(dirPath, pattern));
      return files.length;
    } catch {
      return 0;
    }
  }

  /**
   * Get file timestamps for change detection
   */
  async getFileTimestamps(dirPath: string): Promise<Map<string, Date>> {
    const timestamps = new Map<string, Date>();

    try {
      const files = await glob(path.join(dirPath, '**/*'));

      for (const file of files) {
        const stats = await fs.stat(file);
        if (stats.isFile()) {
          timestamps.set(file, stats.mtime);
        }
      }
    } catch (error) {
      console.warn(`Failed to get timestamps for ${dirPath}: ${error}`);
    }

    return timestamps;
  }

  /**
   * Check if a file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Read directory contents
   */
  async readDirectory(dirPath: string): Promise<string[]> {
    try {
      return await fs.readdir(dirPath);
    } catch {
      return [];
    }
  }

  /**
   * Copy a file from source to destination
   */
  async copyFile(source: string, destination: string): Promise<void> {
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(source, destination);
  }

  /**
   * Get the plugin root directory
   */
  getPluginRoot(): string {
    // In real environment, this would be ~/.claude/plugins/cache/fluxwing
    // For testing, we use the current project directory
    return path.join(__dirname, '../../../fluxwing');
  }

  /**
   * Get plugin data examples directory
   */
  getPluginDataDir(): string {
    return path.join(this.getPluginRoot(), 'data/examples');
  }

  /**
   * Find files matching a pattern
   */
  async findFiles(pattern: string, cwd?: string): Promise<string[]> {
    return glob(pattern, { cwd: cwd || process.cwd() });
  }

  /**
   * Read file content
   */
  async readFile(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8');
  }

  /**
   * Write file content
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * Create a test component file
   */
  async createTestComponent(name: string, dirPath: string): Promise<void> {
    const uxmContent = {
      id: name,
      type: 'component',
      metadata: {
        title: name,
        category: 'test',
      },
      structure: {
        type: 'container',
        content: `Test component: ${name}`,
      },
    };

    const mdContent = `# ${name}\n\nTest component for automated testing.\n`;

    await this.writeFile(path.join(dirPath, `${name}.uxm`), JSON.stringify(uxmContent, null, 2));
    await this.writeFile(path.join(dirPath, `${name}.md`), mdContent);
  }
}
