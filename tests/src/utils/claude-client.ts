import { query } from '@anthropic-ai/claude-agent-sdk';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Wrapper around Claude Agent SDK for testing
 */
export class ClaudeTestClient {
  constructor() {
    // API key is read from environment by the SDK
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }
  }

  /**
   * Execute a slash command and return the response
   */
  async executeCommand(command: string): Promise<string> {
    try {
      const responses: string[] = [];

      const result = query({
        prompt: command,
        options: {
          settingSources: ['project'],
          allowedTools: ['Read', 'Write', 'Grep', 'Glob', 'Bash', 'SlashCommand'],
        },
      });

      for await (const message of result) {
        if (message.type === 'assistant') {
          // Extract text from assistant messages
          responses.push(JSON.stringify(message));
        }
      }

      return responses.join('\n');
    } catch (error) {
      throw new Error(`Failed to execute command "${command}": ${error}`);
    }
  }

  /**
   * Dispatch an agent and return the full report
   */
  async dispatchAgent(agentType: string, prompt: string): Promise<string> {
    const fullPrompt = `Dispatch ${agentType} agent: ${prompt}`;
    return this.executeCommand(fullPrompt);
  }

  /**
   * Read a file using Claude's Read tool
   */
  async readFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read file "${filePath}": ${error}`);
    }
  }

  /**
   * Verify a file exists
   */
  async verifyFileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Search file content for a pattern
   */
  async searchFileContent(pattern: string | RegExp, filePath: string): Promise<boolean> {
    try {
      const content = await this.readFile(filePath);
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
      return regex.test(content);
    } catch {
      return false;
    }
  }

  /**
   * Count matches of a pattern in a file
   */
  async countMatches(pattern: string | RegExp, filePath: string): Promise<number> {
    try {
      const content = await this.readFile(filePath);
      const regex = typeof pattern === 'string' ? new RegExp(pattern, 'g') : pattern;
      const matches = content.match(regex);
      return matches ? matches.length : 0;
    } catch {
      return 0;
    }
  }
}
