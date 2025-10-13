import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Custom assertions for Fluxwing testing
 */
export class FluxwingAssertions {
  /**
   * Assert that a path exists
   */
  static async assertPathExists(filePath: string, message?: string): Promise<void> {
    try {
      await fs.access(filePath);
    } catch (error) {
      throw new Error(message || `Expected path to exist: ${filePath}`);
    }
  }

  /**
   * Assert that a path does not exist
   */
  static async assertPathNotExists(filePath: string, message?: string): Promise<void> {
    try {
      await fs.access(filePath);
      throw new Error(message || `Expected path to NOT exist: ${filePath}`);
    } catch (error) {
      // Path doesn't exist - assertion passes
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return;
      }
      throw error;
    }
  }

  /**
   * Assert that a file contains specific content
   */
  static async assertFileContains(
    filePath: string,
    content: string | RegExp,
    message?: string
  ): Promise<void> {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const pattern = typeof content === 'string' ? content : content;

    const matches =
      typeof pattern === 'string'
        ? fileContent.includes(pattern)
        : pattern.test(fileContent);

    if (!matches) {
      throw new Error(
        message || `Expected file "${filePath}" to contain: ${content}`
      );
    }
  }

  /**
   * Assert that a file does not contain specific content
   */
  static async assertFileNotContains(
    filePath: string,
    content: string | RegExp,
    message?: string
  ): Promise<void> {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const pattern = typeof content === 'string' ? content : content;

    const matches =
      typeof pattern === 'string'
        ? fileContent.includes(pattern)
        : pattern.test(fileContent);

    if (matches) {
      throw new Error(
        message || `Expected file "${filePath}" to NOT contain: ${content}`
      );
    }
  }

  /**
   * Assert that a directory has no files
   */
  static async assertNoFilesInDirectory(
    dirPath: string,
    message?: string
  ): Promise<void> {
    try {
      const files = await fs.readdir(dirPath);
      if (files.length > 0) {
        throw new Error(
          message || `Expected directory "${dirPath}" to be empty, but found ${files.length} files`
        );
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // Directory doesn't exist - that's fine for this assertion
        return;
      }
      throw error;
    }
  }

  /**
   * Assert that output is in the correct location
   */
  static assertCorrectOutputLocation(
    actualPath: string,
    expectedPrefix: string,
    message?: string
  ): void {
    if (!actualPath.startsWith(expectedPrefix)) {
      throw new Error(
        message ||
          `Expected path to start with "${expectedPrefix}", but got: ${actualPath}`
      );
    }
  }

  /**
   * Assert that a directory contains a specific number of files
   */
  static async assertFileCount(
    dirPath: string,
    expectedCount: number,
    message?: string
  ): Promise<void> {
    const files = await fs.readdir(dirPath);
    const fileCount = files.length;

    if (fileCount !== expectedCount) {
      throw new Error(
        message ||
          `Expected ${expectedCount} files in "${dirPath}", but found ${fileCount}`
      );
    }
  }

  /**
   * Assert that timestamps haven't changed (for read-only verification)
   */
  static assertTimestampsUnchanged(
    before: Map<string, Date>,
    after: Map<string, Date>,
    message?: string
  ): void {
    const changedFiles: string[] = [];

    before.forEach((beforeTime, filePath) => {
      const afterTime = after.get(filePath);
      if (afterTime && afterTime.getTime() !== beforeTime.getTime()) {
        changedFiles.push(filePath);
      }
    });

    if (changedFiles.length > 0) {
      throw new Error(
        message ||
          `Expected files to be unchanged, but ${changedFiles.length} files were modified:\n${changedFiles.join('\n')}`
      );
    }
  }

  /**
   * Assert that a string contains a pattern
   */
  static assertContains(
    text: string,
    pattern: string | RegExp,
    message?: string
  ): void {
    const matches =
      typeof pattern === 'string'
        ? text.includes(pattern)
        : pattern.test(text);

    if (!matches) {
      throw new Error(
        message || `Expected text to contain: ${pattern}\n\nActual text:\n${text.substring(0, 500)}...`
      );
    }
  }

  /**
   * Assert that a string does not contain a pattern
   */
  static assertNotContains(
    text: string,
    pattern: string | RegExp,
    message?: string
  ): void {
    const matches =
      typeof pattern === 'string'
        ? text.includes(pattern)
        : pattern.test(text);

    if (matches) {
      throw new Error(
        message || `Expected text to NOT contain: ${pattern}\n\nActual text:\n${text.substring(0, 500)}...`
      );
    }
  }
}
