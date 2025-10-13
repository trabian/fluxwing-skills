# Claude Code Plugin Development Guide

> A comprehensive guide to creating, testing, and publishing Claude Code plugins

## Table of Contents
1. [Overview](#overview)
2. [Plugin Architecture](#plugin-architecture)
3. [Directory Structure](#directory-structure)
4. [Plugin Components](#plugin-components)
5. [Creating Your First Plugin](#creating-your-first-plugin)
6. [Plugin Manifest (plugin.json)](#plugin-manifest-pluginjson)
7. [Slash Commands](#slash-commands)
8. [Subagents](#subagents)
9. [Hooks](#hooks)
10. [MCP Servers](#mcp-servers)
11. [Including Data Files](#including-data-files)
12. [Testing Your Plugin](#testing-your-plugin)
13. [Publishing to a Marketplace](#publishing-to-a-marketplace)
14. [Best Practices](#best-practices)

---

## Overview

Claude Code plugins are custom collections of slash commands, subagents, MCP servers, and hooks that extend Claude Code's functionality. Plugins can be installed with a single command and toggled on/off as needed.

### What Plugins Can Do
- **Slash Commands**: Create custom shortcuts for frequently-used operations
- **Subagents**: Install purpose-built agents for specialized development tasks
- **MCP Servers**: Connect to tools and data sources through the Model Context Protocol
- **Hooks**: Customize Claude Code's behavior at key points in its workflow

### Common Use Cases
- Enforcing standards (code reviews, testing workflows)
- Supporting users (documentation, package usage guidance)
- Sharing workflows (debugging setups, deployment pipelines)
- Connecting tools (internal APIs, data sources)
- Bundling customizations (framework-specific configurations)

---

## Plugin Architecture

Plugins are lightweight packages that can include any combination of:
- Custom slash commands (markdown files)
- Specialized subagents (YAML configuration files)
- MCP servers (JSON configuration)
- Event hooks (JSON configuration)

All components are optional - create only what you need.

---

## Directory Structure

### Basic Plugin Structure
```
my-plugin/
├── .claude-plugin/
│   ├── plugin.json          # Required: Plugin manifest
│   └── marketplace.json     # Optional: For marketplace hosting
├── commands/                # Optional: Slash commands
│   ├── command1.md
│   └── subfolder/
│       └── command2.md
├── agents/                  # Optional: Subagent definitions
│   └── specialist.yml
├── hooks/                   # Optional: Hook configurations
│   └── hooks.json
├── .mcp.json               # Optional: MCP server config
├── data/                   # Optional: Plugin data files
│   ├── templates/
│   └── examples/
├── scripts/                # Optional: Helper scripts
├── README.md               # Recommended: Plugin documentation
├── LICENSE                 # Recommended: License file
└── CHANGELOG.md            # Recommended: Version history
```

### Advanced Plugin Structure
```
enterprise-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── deploy/
│   │   ├── staging.md
│   │   └── production.md
│   └── test/
│       └── integration.md
├── agents/
│   ├── code-reviewer.yml
│   ├── security-scanner.yml
│   └── documentation-writer.yml
├── hooks/
│   ├── hooks.json
│   └── scripts/
│       ├── pre-commit.sh
│       └── validate-bash.py
├── .mcp.json
├── data/
│   ├── templates/
│   │   └── component-template.tsx
│   └── configs/
│       └── eslint-rules.json
├── scripts/
│   └── setup.sh
├── README.md
├── LICENSE
└── CHANGELOG.md
```

---

## Plugin Components

### 1. Plugin Manifest (.claude-plugin/plugin.json)
**Required** - Defines plugin metadata and component locations

### 2. Commands Directory (commands/)
**Optional** - Contains markdown files for slash commands

### 3. Agents Directory (agents/)
**Optional** - Contains YAML files defining specialized subagents

### 4. Hooks Configuration (hooks/hooks.json)
**Optional** - Defines event handlers and automation

### 5. MCP Configuration (.mcp.json)
**Optional** - Configures Model Context Protocol servers

---

## Creating Your First Plugin

### Step 1: Create Plugin Directory
```bash
mkdir my-first-plugin
cd my-first-plugin
mkdir -p .claude-plugin commands agents hooks
```

### Step 2: Create Plugin Manifest
Create `.claude-plugin/plugin.json`:
```json
{
  "name": "my-first-plugin",
  "version": "1.0.0",
  "description": "My first Claude Code plugin",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "homepage": "https://github.com/yourusername/my-first-plugin",
  "repository": "https://github.com/yourusername/my-first-plugin",
  "license": "MIT",
  "keywords": ["productivity", "development"]
}
```

### Step 3: Add Your First Command
Create `commands/hello.md`:
```markdown
---
description: Say hello to the user
argument-hint: [name]
---

Greet the user warmly by saying "Hello, $1!" and ask how you can help them today.
```

### Step 4: Test Locally (see [Testing Your Plugin](#testing-your-plugin))

---

## Plugin Manifest (plugin.json)

The `plugin.json` file is the required manifest that defines your plugin's metadata and configuration.

### Location
**Required path**: `.claude-plugin/plugin.json`

### Required Fields

```json
{
  "name": "unique-plugin-name"
}
```

- `name`: Unique identifier (kebab-case recommended)

### Recommended Metadata Fields

```json
{
  "name": "deployment-tools",
  "version": "1.2.0",
  "description": "Tools for deploying applications",
  "author": {
    "name": "Jane Developer",
    "email": "jane@example.com",
    "url": "https://janedeveloper.com"
  },
  "homepage": "https://github.com/jane/deployment-tools",
  "repository": "https://github.com/jane/deployment-tools",
  "license": "MIT",
  "keywords": ["deployment", "devops", "automation"]
}
```

### Component Path Configuration

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "commands": ["./commands", "./extra-commands"],
  "agents": ["./agents", "./custom-agents"],
  "hooks": "./hooks/hooks.json",
  "mcpServers": "./.mcp.json"
}
```

**Important Notes:**
- All paths must be relative and start with `./`
- Default directories (`commands/`, `agents/`) are always included
- Custom paths supplement (don't replace) default directories
- You can specify multiple directories for commands and agents

### Environment Variables

Your plugin has access to:
- `${CLAUDE_PLUGIN_ROOT}`: Absolute path to plugin directory

Example usage in hooks:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"
          }
        ]
      }
    ]
  }
}
```

### Complete Example

```json
{
  "name": "enterprise-dev-tools",
  "version": "2.1.3",
  "description": "Enterprise development tools for standardized workflows",
  "author": {
    "name": "Enterprise Team",
    "email": "dev-tools@enterprise.com",
    "url": "https://enterprise.com/dev-tools"
  },
  "homepage": "https://enterprise.com/dev-tools/docs",
  "repository": "https://github.com/enterprise/dev-tools",
  "license": "Apache-2.0",
  "keywords": ["enterprise", "workflow", "standards", "testing"],
  "commands": ["./commands", "./workflows"],
  "agents": ["./agents"],
  "hooks": "./hooks/hooks.json",
  "mcpServers": "./.mcp.json"
}
```

---

## Slash Commands

Slash commands are custom shortcuts that trigger predefined prompts or workflows.

### Location
- Project-level: `.claude/commands/`
- User-level: `~/.claude/commands/`
- Plugin: `commands/` directory

### File Format
- **Extension**: `.md` (Markdown)
- **Command name**: Derived from filename (without `.md`)
- **Format**: Markdown with optional YAML frontmatter

### Basic Command

Create `commands/test.md`:
```markdown
Run the project's test suite and report any failures.
```

Usage: `/test`

### Command with Arguments

Create `commands/commit.md`:
```markdown
---
description: Create a git commit with a message
argument-hint: [message]
---

Create a git commit with the message: $ARGUMENTS

Make sure to:
1. Review staged changes
2. Use conventional commit format
3. Ask for confirmation before committing
```

Usage: `/commit "feat: add new feature"`

### Argument Variables

- `$ARGUMENTS`: All arguments as a single string
- `$1`, `$2`, `$3`, etc.: Individual positional arguments

Example `commands/deploy.md`:
```markdown
---
description: Deploy application to specified environment
argument-hint: [environment] [branch]
---

Deploy the application to $1 environment using branch $2.

Steps:
1. Validate environment is valid (staging, production)
2. Check branch exists
3. Run pre-deployment checks
4. Execute deployment
5. Run post-deployment verification
```

Usage: `/deploy staging main`

### Frontmatter Options

```markdown
---
description: Brief description shown in /help menu
argument-hint: [arg1] [arg2]
allowed-tools: Bash(git:*), Read, Write
---
```

- `description`: Shows in command listing
- `argument-hint`: Displays expected arguments
- `allowed-tools`: Restricts which tools Claude can use

### Advanced Features

#### File References
```markdown
---
description: Review specific files
argument-hint: [@file1] [@file2]
---

Review the following files for code quality:
$ARGUMENTS
```

Usage: `/review @src/app.ts @src/utils.ts`

#### Bash Command Execution
```markdown
---
description: Run custom script
---

!./scripts/deploy.sh staging
```

#### Subdirectory Organization
```
commands/
├── git/
│   ├── commit.md         # /git/commit
│   ├── push.md           # /git/push
│   └── status.md         # /git/status
└── deploy/
    ├── staging.md        # /deploy/staging
    └── production.md     # /deploy/production
```

### Complete Example

Create `commands/pr-review.md`:
```markdown
---
description: Perform comprehensive PR review
argument-hint: [pr-number]
allowed-tools: Bash(gh:*), Read, Grep, Write
---

Perform a comprehensive pull request review for PR #$1.

Review Process:
1. Fetch PR details using gh CLI
2. Review all changed files
3. Check for:
   - Code quality issues
   - Security vulnerabilities
   - Test coverage
   - Documentation updates
4. Provide constructive feedback
5. Generate review summary

Output a markdown file with findings: pr-${1}-review.md
```

---

## Subagents

Subagents are specialized AI assistants with their own context windows, system prompts, and tool access.

### Location
- Project-level: `.claude/agents/`
- User-level: `~/.claude/agents/`
- Plugin: `agents/` directory

### File Format
- **Extension**: `.yml` or `.yaml`
- **Format**: YAML with frontmatter

### Basic Agent

Create `agents/code-reviewer.yml`:
```yaml
---
name: code-reviewer
description: Expert code reviewer focusing on best practices and security
tools: Read, Grep, Glob
model: sonnet
---

You are an expert code reviewer with deep knowledge of software engineering best practices.

Your responsibilities:
- Review code for bugs, security issues, and performance problems
- Suggest improvements following SOLID principles
- Check for proper error handling and edge cases
- Verify test coverage
- Ensure code follows project conventions

Always provide:
1. Summary of findings
2. Critical issues (if any)
3. Suggested improvements
4. Positive feedback on well-written code
```

### Configuration Options

```yaml
---
name: agent-name              # Required: Unique identifier
description: Purpose          # Required: When to use this agent
tools: tool-list             # Optional: Specific tools allowed
model: sonnet|opus|haiku     # Optional: Model selection
---
```

### Tool Access Control

**Allow specific tools:**
```yaml
---
name: security-scanner
description: Scans code for security vulnerabilities
tools: Read, Grep, Glob
---
```

**Allow all tools:**
```yaml
---
name: full-stack-developer
description: Full-stack development agent
tools: "*"
---
```

**Restrict tools:**
```yaml
---
name: read-only-analyst
description: Analyzes code without making changes
tools: Read, Grep, Glob, Bash(test:*)
---
```

### Model Selection

```yaml
---
name: documentation-writer
model: opus          # Use Opus for creative writing
---
```

```yaml
---
name: quick-helper
model: haiku         # Use Haiku for fast responses
---
```

```yaml
---
name: complex-debugger
model: sonnet        # Use Sonnet (default) for complex tasks
---
```

### Complete Examples

#### Security Scanner
Create `agents/security-scanner.yml`:
```yaml
---
name: security-scanner
description: Scans code for security vulnerabilities and compliance issues
tools: Read, Grep, Glob, Bash(test:*)
model: sonnet
---

You are a security expert specializing in application security and compliance.

Scan for:
1. SQL injection vulnerabilities
2. XSS vulnerabilities
3. Insecure dependencies
4. Hardcoded secrets
5. Improper authentication/authorization
6. Insecure cryptography
7. OWASP Top 10 issues

For each finding provide:
- Severity level (Critical/High/Medium/Low)
- Location (file and line number)
- Description of the vulnerability
- Remediation steps
- Code example of the fix

Use security scanning tools where available and provide actionable recommendations.
```

#### Documentation Writer
Create `agents/docs-writer.yml`:
```yaml
---
name: docs-writer
description: Creates comprehensive technical documentation
tools: Read, Write, Glob, Grep
model: opus
---

You are a technical writer specialized in creating clear, comprehensive documentation.

Documentation Standards:
- Use clear, concise language
- Include code examples
- Add diagrams where helpful (using mermaid)
- Follow project documentation style
- Include table of contents for long docs
- Add cross-references to related docs

Documentation Types:
- API documentation
- User guides
- Architecture diagrams
- Tutorials
- README files
- Changelog entries

Always ensure documentation is:
1. Accurate
2. Complete
3. Easy to understand
4. Well-structured
5. Up-to-date with code changes
```

#### Test Engineer
Create `agents/test-engineer.yml`:
```yaml
---
name: test-engineer
description: Creates comprehensive test suites and finds edge cases
tools: Read, Write, Edit, Bash(npm:*, pytest:*, jest:*)
model: sonnet
---

You are a test engineer focused on comprehensive test coverage and quality assurance.

Testing Approach:
1. Analyze code to understand functionality
2. Identify edge cases and boundary conditions
3. Create unit tests for individual functions
4. Create integration tests for component interactions
5. Consider negative test cases
6. Ensure proper test isolation

Test Quality Standards:
- Arrange-Act-Assert pattern
- Clear test names describing what is tested
- Mock external dependencies
- Test both success and failure paths
- Aim for >80% code coverage
- Fast execution time

Use the project's testing framework and follow existing test patterns.
```

---

## Hooks

Hooks allow you to execute custom commands at specific points in Claude Code's workflow.

### Location
- User settings: `~/.claude/settings.json`
- Project settings: `.claude/settings.json`
- Local settings: `.claude/settings.local.json`
- Plugin: `hooks/hooks.json`

### File Format
JSON configuration file defining event handlers

### Supported Events

1. **PreToolUse**: Before tool execution
2. **PostToolUse**: After tool execution
3. **Notification**: System notifications
4. **UserPromptSubmit**: When user submits a prompt
5. **Stop**: Main agent response completion
6. **SubagentStop**: Subagent response completion
7. **PreCompact**: Before context compaction
8. **SessionStart**: Session initialization
9. **SessionEnd**: Session termination

### Basic Hook Structure

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here"
          }
        ]
      }
    ]
  }
}
```

### Hook Examples

#### Validate Bash Commands
Create `hooks/hooks.json`:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ${CLAUDE_PLUGIN_ROOT}/scripts/validate-bash.py"
          }
        ]
      }
    ]
  }
}
```

Create `scripts/validate-bash.py`:
```python
#!/usr/bin/env python3
import sys
import json
import re

# Read hook input from stdin
hook_input = json.load(sys.stdin)
bash_command = hook_input.get("params", {}).get("command", "")

# Define dangerous patterns
dangerous_patterns = [
    r"rm\s+-rf\s+/",
    r"dd\s+if=",
    r"mkfs",
    r":\(\)\{.*\}",  # Fork bomb
]

# Check for dangerous patterns
for pattern in dangerous_patterns:
    if re.search(pattern, bash_command):
        print(json.dumps({
            "block": True,
            "message": f"Blocked potentially dangerous command: {bash_command}"
        }))
        sys.exit(2)

# Allow the command
sys.exit(0)
```

#### Auto-format on Write
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write $TOOL_RESULT_FILE"
          }
        ]
      }
    ]
  }
}
```

#### Session Logging
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"Session started at $(date)\" >> ${CLAUDE_PROJECT_DIR}/logs/sessions.log"
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"Session ended at $(date)\" >> ${CLAUDE_PROJECT_DIR}/logs/sessions.log"
          }
        ]
      }
    ]
  }
}
```

#### Git Commit Validation
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash.*git commit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/validate-commit.sh"
          }
        ]
      }
    ]
  }
}
```

### Hook Output Methods

#### Exit Code Method
```bash
#!/bin/bash
# 0 = Success (allow)
# 2 = Block with error
# Other = Non-blocking error

if [ -z "$VALIDATION" ]; then
  echo "Validation failed"
  exit 2
fi

exit 0
```

#### JSON Output Method
```python
import json
import sys

output = {
    "block": True,  # or False
    "message": "Custom message to Claude",
    "context": "Additional context for decision"
}

print(json.dumps(output))
sys.exit(0)
```

### Environment Variables Available in Hooks

- `CLAUDE_PROJECT_DIR`: Current project directory
- `CLAUDE_PLUGIN_ROOT`: Plugin installation directory
- `TOOL_NAME`: Name of the tool being executed
- `TOOL_PARAMS`: JSON string of tool parameters
- `TOOL_RESULT`: Result from tool execution (PostToolUse only)

### Security Best Practices

1. **Always validate inputs**
```python
import json
import sys
import shlex

hook_input = json.load(sys.stdin)
# Sanitize inputs before use
command = shlex.quote(hook_input.get("command", ""))
```

2. **Use absolute paths**
```json
{
  "command": "${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"
}
```

3. **Set timeouts**
Hooks have a default 60-second timeout

4. **Handle errors gracefully**
```bash
#!/bin/bash
set -euo pipefail

# Your validation logic
if ! validate_something; then
  echo "Validation failed" >&2
  exit 2
fi
```

---

## MCP Servers

MCP (Model Context Protocol) servers connect Claude Code to external tools and data sources.

### Location
- Project-level: `.claude/.mcp.json`
- User-level: `~/.claude/.mcp.json`
- Plugin: `.mcp.json`

### File Format
JSON configuration for MCP servers

### Basic MCP Configuration

Create `.mcp.json`:
```json
{
  "mcpServers": {
    "weather-api": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/weather-server.js"]
    }
  }
}
```

### Using SDK to Create MCP Servers

Create `servers/custom-tools.ts`:
```typescript
import { createSdkMcpServer, tool } from "@anthropic/sdk";
import { z } from "zod";

const customServer = createSdkMcpServer({
  name: "my-custom-tools",
  version: "1.0.0",
  tools: [
    tool(
      "get_weather",
      "Get current weather for a location",
      {
        location: z.string().describe("City name or coordinates"),
        units: z.enum(["celsius", "fahrenheit"]).default("celsius")
      },
      async (args) => {
        // Implementation
        const response = await fetch(
          `https://api.weather.com/v1/weather?location=${args.location}&units=${args.units}`
        );
        const data = await response.json();
        return {
          temperature: data.temp,
          conditions: data.conditions,
          humidity: data.humidity
        };
      }
    ),

    tool(
      "search_docs",
      "Search project documentation",
      {
        query: z.string().describe("Search query"),
        limit: z.number().optional().default(10)
      },
      async (args) => {
        // Search implementation
        const results = await searchDocs(args.query, args.limit);
        return results;
      }
    )
  ]
});

// Start the server
customServer.listen();
```

### Tool Naming Convention

Tools are exposed as: `mcp__{server_name}__{tool_name}`

Example:
- Server name: `my-custom-tools`
- Tool name: `get_weather`
- Called as: `mcp__my-custom-tools__get_weather`

### Complete MCP Server Example

Create `servers/database-tools.ts`:
```typescript
import { createSdkMcpServer, tool } from "@anthropic/sdk";
import { z } from "zod";
import { Database } from "./db-client";

const db = new Database(process.env.DB_CONNECTION_STRING);

const databaseServer = createSdkMcpServer({
  name: "database-tools",
  version: "1.0.0",
  tools: [
    tool(
      "query_users",
      "Query users from the database",
      {
        filters: z.object({
          email: z.string().optional(),
          active: z.boolean().optional(),
          limit: z.number().default(100)
        })
      },
      async (args) => {
        try {
          const users = await db.users.findMany({
            where: args.filters,
            take: args.filters.limit
          });
          return { users, count: users.length };
        } catch (error) {
          return { error: error.message };
        }
      }
    ),

    tool(
      "create_backup",
      "Create a database backup",
      {
        tables: z.array(z.string()).optional(),
        compressed: z.boolean().default(true)
      },
      async (args) => {
        const timestamp = new Date().toISOString();
        const backupPath = await db.backup({
          tables: args.tables,
          compressed: args.compressed,
          filename: `backup-${timestamp}.sql`
        });
        return { success: true, path: backupPath };
      }
    )
  ]
});

databaseServer.listen();
```

Configure in `.mcp.json`:
```json
{
  "mcpServers": {
    "database-tools": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/database-tools.js"],
      "env": {
        "DB_CONNECTION_STRING": "postgresql://localhost:5432/mydb"
      }
    }
  }
}
```

---

## Including Data Files

Plugins can include data files such as templates, configuration files, examples, and reference materials.

### Recommended Data Directory Structure

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json
├── data/
│   ├── templates/
│   │   ├── component.tsx.template
│   │   ├── test.spec.ts.template
│   │   └── readme.md.template
│   ├── examples/
│   │   ├── basic-usage.ts
│   │   └── advanced-config.json
│   ├── configs/
│   │   ├── eslint.json
│   │   ├── prettier.json
│   │   └── tsconfig.json
│   ├── schemas/
│   │   └── validation.schema.json
│   └── docs/
│       ├── api-reference.md
│       └── troubleshooting.md
├── commands/
└── agents/
```

### Accessing Data Files

#### From Slash Commands

Create `commands/new-component.md`:
```markdown
---
description: Create a new React component from template
argument-hint: [component-name]
---

Create a new React component named $1 using the template file at:
${CLAUDE_PLUGIN_ROOT}/data/templates/component.tsx.template

Steps:
1. Read the template file
2. Replace {{COMPONENT_NAME}} with $1
3. Create the new file at src/components/$1.tsx
4. Create a corresponding test file using the test template
```

#### From Hooks

Create `hooks/hooks.json`:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write.*\\.tsx$",
        "hooks": [
          {
            "type": "command",
            "command": "node ${CLAUDE_PLUGIN_ROOT}/scripts/validate-component.js ${CLAUDE_PLUGIN_ROOT}/data/schemas/component.schema.json"
          }
        ]
      }
    ]
  }
}
```

#### From MCP Servers

Create `servers/template-server.ts`:
```typescript
import { createSdkMcpServer, tool } from "@anthropic/sdk";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || ".";
const TEMPLATES_DIR = path.join(PLUGIN_ROOT, "data", "templates");

const templateServer = createSdkMcpServer({
  name: "template-tools",
  version: "1.0.0",
  tools: [
    tool(
      "render_template",
      "Render a template with provided variables",
      {
        templateName: z.string(),
        variables: z.record(z.string())
      },
      async (args) => {
        const templatePath = path.join(
          TEMPLATES_DIR,
          `${args.templateName}.template`
        );
        let template = await fs.readFile(templatePath, "utf-8");

        // Replace variables
        for (const [key, value] of Object.entries(args.variables)) {
          template = template.replace(
            new RegExp(`{{${key}}}`, "g"),
            value
          );
        }

        return { content: template };
      }
    )
  ]
});
```

### Template File Examples

#### Component Template
Create `data/templates/component.tsx.template`:
```tsx
import React from 'react';

interface {{COMPONENT_NAME}}Props {
  // Add your props here
}

export const {{COMPONENT_NAME}}: React.FC<{{COMPONENT_NAME}}Props> = (props) => {
  return (
    <div className="{{COMPONENT_NAME_LOWER}}">
      {/* Add your component implementation here */}
    </div>
  );
};

{{COMPONENT_NAME}}.displayName = '{{COMPONENT_NAME}}';
```

#### Test Template
Create `data/templates/test.spec.ts.template`:
```typescript
import { describe, it, expect } from 'vitest';
import { {{COMPONENT_NAME}} } from './{{COMPONENT_NAME}}';

describe('{{COMPONENT_NAME}}', () => {
  it('should render successfully', () => {
    // Add your test implementation
    expect(true).toBe(true);
  });

  it('should handle props correctly', () => {
    // Add your test implementation
  });
});
```

#### Configuration Template
Create `data/configs/eslint.json`:
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
```

### Best Practices for Data Files

1. **Use clear naming conventions**
   - Templates: `.template` extension
   - Examples: descriptive names like `basic-usage.ts`
   - Configs: standard names like `eslint.json`

2. **Document template variables**
   Create `data/templates/README.md`:
   ```markdown
   # Template Variables

   ## component.tsx.template
   - {{COMPONENT_NAME}}: PascalCase component name
   - {{COMPONENT_NAME_LOWER}}: lowercase component name

   ## test.spec.ts.template
   - {{COMPONENT_NAME}}: Component name to test
   ```

3. **Version your data files**
   Include version info in filenames if needed:
   - `component-v1.tsx.template`
   - `component-v2.tsx.template`

4. **Keep data files read-only**
   Data files should be static resources, not modified during plugin execution

---

## Testing Your Plugin

### Local Testing Setup

#### Step 1: Create a Test Marketplace

Create a local directory for testing:
```bash
mkdir ~/claude-plugin-test-marketplace
cd ~/claude-plugin-test-marketplace
mkdir .claude-plugin
```

Create `.claude-plugin/marketplace.json`:
```json
{
  "name": "test-marketplace",
  "owner": {
    "name": "Your Name",
    "url": "https://github.com/yourusername"
  },
  "plugins": [
    {
      "name": "my-plugin",
      "source": "/absolute/path/to/my-plugin"
    }
  ]
}
```

#### Step 2: Add Test Marketplace to Claude Code

```bash
claude /plugin marketplace add ~/claude-plugin-test-marketplace
```

Or if using relative path:
```bash
claude /plugin marketplace add ./claude-plugin-test-marketplace
```

#### Step 3: Install Your Plugin Locally

```bash
claude /plugin install my-plugin@test-marketplace
```

#### Step 4: Test Plugin Components

**Test Slash Commands:**
```bash
claude /help
# Your commands should appear in the list

claude /your-command arg1 arg2
# Test with various arguments
```

**Test Subagents:**
```bash
claude "Use the your-agent subagent to analyze this code"
```

Or explicitly in conversation:
```
Use the code-reviewer agent to review src/app.ts
```

**Test Hooks:**
Hooks run automatically. Check logs:
```bash
# If your hook logs to a file
cat ${CLAUDE_PROJECT_DIR}/logs/hook-activity.log
```

**Test MCP Servers:**
```bash
claude "Use the mcp__your-server__your-tool tool"
```

### Testing Workflow

1. **Iterative Development**
```bash
# Make changes to your plugin
vim my-plugin/commands/test.md

# Restart Claude Code to reload plugin
# Changes should be reflected immediately
```

2. **Test Different Scenarios**
```bash
# Test with no arguments
claude /your-command

# Test with partial arguments
claude /your-command arg1

# Test with all arguments
claude /your-command arg1 arg2 arg3

# Test with edge cases
claude /your-command "argument with spaces"
claude /your-command --flag value
```

3. **Verify Tool Access**
If using `allowed-tools` in commands:
```markdown
---
allowed-tools: Read, Write
---
```

Test that only specified tools are used.

4. **Test Across Projects**
```bash
# Test in different project directories
cd ~/project1
claude /your-command

cd ~/project2
claude /your-command
```

### Debugging Tips

#### Enable Verbose Logging
Check Claude Code settings for debug options.

#### Validate JSON Files
```bash
# Validate plugin.json
cat .claude-plugin/plugin.json | jq .

# Validate marketplace.json
cat .claude-plugin/marketplace.json | jq .

# Validate hooks.json
cat hooks/hooks.json | jq .

# Validate .mcp.json
cat .mcp.json | jq .
```

#### Test Hook Scripts Independently
```bash
# Test bash hook
echo '{"command": "test"}' | ./scripts/validate-bash.sh

# Test python hook
echo '{"command": "test"}' | python3 ./scripts/validate.py
```

#### Check File Paths
```bash
# Verify all referenced files exist
ls -la ${CLAUDE_PLUGIN_ROOT}/data/templates/
ls -la ${CLAUDE_PLUGIN_ROOT}/scripts/
```

#### Test MCP Server Standalone
```bash
# Run MCP server directly
node servers/custom-tools.js

# Or with TypeScript
ts-node servers/custom-tools.ts
```

### Test Checklist

- [ ] Plugin installs without errors
- [ ] All slash commands appear in `/help`
- [ ] Commands work with expected arguments
- [ ] Commands handle missing arguments gracefully
- [ ] Subagents activate when described
- [ ] Subagents have correct tool access
- [ ] Hooks trigger at correct events
- [ ] Hook scripts execute successfully
- [ ] MCP servers start without errors
- [ ] MCP tools are accessible
- [ ] Data files are accessible via ${CLAUDE_PLUGIN_ROOT}
- [ ] Plugin works in different project directories
- [ ] Plugin can be disabled and re-enabled
- [ ] No conflicts with other plugins
- [ ] README documentation is accurate
- [ ] Version number follows semantic versioning

### Automated Testing

Create `tests/test-plugin.sh`:
```bash
#!/bin/bash
set -euo pipefail

echo "Testing plugin installation..."
claude /plugin install my-plugin@test-marketplace

echo "Testing commands..."
claude /help | grep "my-command" || exit 1

echo "Testing command execution..."
claude /my-command test-arg

echo "Validating JSON files..."
jq empty .claude-plugin/plugin.json
jq empty hooks/hooks.json 2>/dev/null || true
jq empty .mcp.json 2>/dev/null || true

echo "All tests passed!"
```

---

## Publishing to a Marketplace

### Step 1: Prepare Your Plugin

1. **Complete all required files**
   - `.claude-plugin/plugin.json` (required)
   - `README.md` (recommended)
   - `LICENSE` (recommended)
   - `CHANGELOG.md` (recommended)

2. **Update version number**
   Use semantic versioning in `plugin.json`:
   ```json
   {
     "version": "1.0.0"
   }
   ```

3. **Test thoroughly**
   Follow the [Testing Your Plugin](#testing-your-plugin) section

4. **Document your plugin**
   Create comprehensive `README.md`:
   ```markdown
   # My Plugin

   Description of what your plugin does.

   ## Features
   - Feature 1
   - Feature 2

   ## Installation
   \`\`\`bash
   /plugin marketplace add owner/repo
   /plugin install my-plugin
   \`\`\`

   ## Usage
   ### Commands
   - `/command1` - Description
   - `/command2` - Description

   ### Agents
   - `agent-name` - Description

   ## Configuration
   Any required configuration steps.

   ## Examples
   Example usage scenarios.

   ## License
   MIT
   ```

### Step 2: Choose Hosting Method

#### Option A: GitHub (Recommended)

1. **Create a GitHub repository**
```bash
git init
git add .
git commit -m "Initial plugin release"
git remote add origin https://github.com/yourusername/your-plugin.git
git push -u origin main
```

2. **Ensure `.claude-plugin/plugin.json` exists**

3. **Share with users**
```bash
/plugin marketplace add yourusername/your-plugin
/plugin install your-plugin
```

#### Option B: GitLab or Other Git Hosting

1. **Create repository on your Git host**

2. **Share using full URL**
```bash
/plugin marketplace add https://gitlab.com/yourusername/your-plugin.git
```

#### Option C: Create a Marketplace (Multiple Plugins)

1. **Create marketplace repository**
```bash
mkdir my-marketplace
cd my-marketplace
mkdir .claude-plugin
```

2. **Create marketplace.json**

Create `.claude-plugin/marketplace.json`:
```json
{
  "name": "my-marketplace",
  "owner": {
    "name": "Your Name or Organization",
    "email": "contact@example.com",
    "url": "https://yourwebsite.com"
  },
  "description": "Curated collection of Claude Code plugins",
  "plugins": [
    {
      "name": "plugin-one",
      "source": "https://github.com/you/plugin-one"
    },
    {
      "name": "plugin-two",
      "source": "https://github.com/you/plugin-two"
    },
    {
      "name": "plugin-three",
      "source": "git@github.com:you/plugin-three.git"
    }
  ]
}
```

3. **Publish marketplace**
```bash
git init
git add .
git commit -m "Create marketplace"
git push
```

4. **Users add your marketplace**
```bash
/plugin marketplace add yourusername/marketplace-repo
/plugin install plugin-one
```

### Step 3: Version Management

**Use Semantic Versioning:**
- `MAJOR.MINOR.PATCH`
- `1.0.0` - Initial release
- `1.0.1` - Bug fix
- `1.1.0` - New feature (backward compatible)
- `2.0.0` - Breaking change

**Update CHANGELOG.md:**
```markdown
# Changelog

## [1.1.0] - 2025-01-15
### Added
- New `/deploy` command
- Security scanner agent

### Changed
- Improved error handling in hooks

### Fixed
- Bug in template rendering

## [1.0.0] - 2025-01-01
### Added
- Initial release
- Basic commands
- Code reviewer agent
```

**Tag releases in Git:**
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Step 4: Promote Your Plugin

1. **Share on social media**
   - Twitter/X using #ClaudeCode
   - Dev.to
   - Reddit (r/ClaudeAI)

2. **Submit to community marketplaces**
   - Look for community-curated marketplaces
   - Follow their submission guidelines

3. **Create documentation site**
   - GitHub Pages
   - Documentation with examples
   - Video tutorials

4. **Engage with users**
   - Respond to issues
   - Accept pull requests
   - Provide support

### Example Marketplace Configurations

#### Enterprise Marketplace
```json
{
  "name": "enterprise-tools",
  "owner": {
    "name": "Enterprise Corp",
    "email": "devtools@enterprise.com",
    "url": "https://enterprise.com/dev-tools"
  },
  "description": "Official Enterprise development tools and workflows",
  "plugins": [
    {
      "name": "deployment-tools",
      "source": "https://github.com/enterprise/deployment-tools"
    },
    {
      "name": "code-standards",
      "source": "https://github.com/enterprise/code-standards"
    },
    {
      "name": "security-scanner",
      "source": "https://github.com/enterprise/security-scanner"
    }
  ]
}
```

#### Community Marketplace
```json
{
  "name": "awesome-claude-plugins",
  "owner": {
    "name": "Community Contributors",
    "url": "https://github.com/community/awesome-claude-plugins"
  },
  "description": "Community-curated collection of the best Claude Code plugins",
  "plugins": [
    {
      "name": "react-helpers",
      "source": "https://github.com/user1/react-helpers"
    },
    {
      "name": "test-generators",
      "source": "https://github.com/user2/test-generators"
    },
    {
      "name": "docs-writer",
      "source": "https://github.com/user3/docs-writer"
    }
  ]
}
```

---

## Best Practices

### Plugin Design

1. **Single Responsibility**
   - Each plugin should have a clear, focused purpose
   - Don't try to do everything in one plugin
   - Consider splitting complex plugins into multiple smaller ones

2. **Clear Naming**
   - Use descriptive, kebab-case names
   - Good: `deployment-automation`, `react-toolkit`
   - Bad: `plugin`, `helpers`, `utils`

3. **Comprehensive Documentation**
   - README with clear usage examples
   - Document all commands, agents, and hooks
   - Include troubleshooting section
   - Provide real-world examples

4. **Semantic Versioning**
   - Follow semver strictly
   - Document breaking changes
   - Maintain CHANGELOG.md

### Command Design

1. **Clear Command Names**
   ```markdown
   Good:
   - /deploy-staging
   - /run-tests
   - /create-component

   Bad:
   - /d
   - /t
   - /c
   ```

2. **Helpful Descriptions**
   ```markdown
   ---
   description: Deploy application to staging environment
   argument-hint: [branch]
   ---
   ```

3. **Validate Arguments**
   ```markdown
   Check that $1 is provided and is a valid branch name before proceeding.
   If not provided, ask the user which branch to deploy.
   ```

4. **Provide Feedback**
   ```markdown
   After deployment completes, provide:
   1. Deployment status
   2. URL of deployed application
   3. Any warnings or errors
   4. Next steps
   ```

### Agent Design

1. **Focused Expertise**
   - Each agent should have a specific role
   - Don't create "do everything" agents
   - Clear description of when to use the agent

2. **Clear System Prompts**
   ```yaml
   ---
   name: security-scanner
   description: Scans code for security vulnerabilities
   ---

   You are a security expert specializing in [specific area].

   Your responsibilities:
   1. [Specific task]
   2. [Specific task]

   Always provide:
   - [Specific output format]
   ```

3. **Appropriate Tool Access**
   ```yaml
   # Read-only agent
   tools: Read, Grep, Glob

   # Agent that makes changes
   tools: Read, Write, Edit, Bash(test:*)
   ```

4. **Choose Right Model**
   ```yaml
   # Complex analysis
   model: opus

   # Quick tasks
   model: haiku

   # Balanced (default)
   model: sonnet
   ```

### Hook Design

1. **Fail Gracefully**
   ```bash
   #!/bin/bash
   set -euo pipefail

   # If validation fails, provide helpful message
   if ! validate; then
     echo "Validation failed: reason" >&2
     exit 2
   fi
   ```

2. **Keep Hooks Fast**
   - Hooks should complete in < 1 second when possible
   - Use timeouts for external calls
   - Avoid heavy computations

3. **Provide Clear Feedback**
   ```json
   {
     "block": true,
     "message": "Cannot proceed: File contains syntax errors on line 42"
   }
   ```

4. **Security First**
   ```python
   # Always validate and sanitize inputs
   import shlex
   command = shlex.quote(user_input)
   ```

### MCP Server Design

1. **Clear Tool Names**
   ```typescript
   tool(
     "search_database",  // Good
     // Not: "search" or "db"
     "Search the database for records",
     schema,
     implementation
   )
   ```

2. **Type-Safe Schemas**
   ```typescript
   import { z } from "zod";

   {
     query: z.string().min(1).describe("Search query"),
     limit: z.number().min(1).max(100).default(10),
     filters: z.object({
       category: z.enum(["users", "posts", "comments"]),
       active: z.boolean().optional()
     })
   }
   ```

3. **Error Handling**
   ```typescript
   async (args) => {
     try {
       const result = await fetchData(args);
       return { success: true, data: result };
     } catch (error) {
       return {
         success: false,
         error: error.message,
         code: error.code
       };
     }
   }
   ```

4. **Rate Limiting**
   ```typescript
   const rateLimiter = new RateLimiter(100, "1m");

   async (args) => {
     if (!rateLimiter.check()) {
       throw new Error("Rate limit exceeded");
     }
     // ... implementation
   }
   ```

### Security Best Practices

1. **Never Hardcode Secrets**
   ```json
   // Bad
   {
     "env": {
       "API_KEY": "secret123"
     }
   }

   // Good
   {
     "env": {
       "API_KEY": "${PLUGIN_API_KEY}"
     }
   }
   ```

2. **Validate All Inputs**
   ```python
   import re

   def validate_branch_name(branch):
       if not re.match(r'^[a-zA-Z0-9/_-]+$', branch):
           raise ValueError("Invalid branch name")
   ```

3. **Use Least Privilege**
   ```yaml
   # Only give agents the tools they need
   tools: Read, Grep  # Not: "*"
   ```

4. **Audit Dangerous Operations**
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "Bash.*(rm|dd|mkfs)",
           "hooks": [{ "command": "audit-log.sh" }]
         }
       ]
     }
   }
   ```

### Testing Best Practices

1. **Test All Paths**
   - Success cases
   - Error cases
   - Edge cases
   - Missing arguments

2. **Test Across Projects**
   ```bash
   # Test in different project structures
   cd ~/project-with-package-json
   claude /your-command

   cd ~/project-with-pom-xml
   claude /your-command
   ```

3. **Automated Testing**
   ```bash
   # Create test script
   ./tests/run-tests.sh
   ```

4. **Version Compatibility**
   - Test with different Claude Code versions
   - Document minimum required version
   ```json
   {
     "engines": {
       "claude-code": ">=1.0.0"
     }
   }
   ```

### Distribution Best Practices

1. **Clear Installation Instructions**
   ```markdown
   ## Installation

   1. Add the marketplace:
   \`\`\`bash
   /plugin marketplace add owner/repo
   \`\`\`

   2. Install the plugin:
   \`\`\`bash
   /plugin install plugin-name
   \`\`\`

   3. Verify installation:
   \`\`\`bash
   /help
   \`\`\`
   ```

2. **Dependency Management**
   ```markdown
   ## Requirements

   - Node.js 18+ (for MCP servers)
   - Python 3.8+ (for hook scripts)
   - Git (for deployment commands)
   ```

3. **Configuration Documentation**
   ```markdown
   ## Configuration

   Set the following environment variables:

   - `PLUGIN_API_KEY`: Your API key
   - `PLUGIN_ENV`: Environment (staging/production)
   ```

4. **Support Channels**
   ```markdown
   ## Support

   - GitHub Issues: https://github.com/owner/plugin/issues
   - Email: support@example.com
   - Discord: https://discord.gg/plugin
   ```

---

## Additional Resources

### Official Documentation
- [Claude Code Docs](https://docs.claude.com/en/docs/claude-code)
- [Plugin Reference](https://docs.claude.com/en/docs/claude-code/plugins-reference)
- [Plugin Marketplaces](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces)
- [Slash Commands](https://docs.claude.com/en/docs/claude-code/slash-commands)
- [Subagents](https://docs.claude.com/en/docs/claude-code/subagents)
- [Hooks](https://docs.claude.com/en/docs/claude-code/hooks)
- [Custom Tools](https://docs.claude.com/en/docs/claude-code/sdk/custom-tools)

### Community Resources
- [Anthropic Claude Code GitHub](https://github.com/anthropics/claude-code)
- [Example Plugins](https://github.com/anthropics/claude-code/tree/main/examples)
- [Community Marketplaces](https://github.com/topics/claude-code-plugin)

### Tools & Libraries
- [Anthropic SDK](https://www.npmjs.com/package/@anthropic-ai/sdk)
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [Model Context Protocol](https://modelcontextprotocol.io/)

---

## Quick Reference

### Essential Commands
```bash
# Add marketplace
/plugin marketplace add owner/repo

# List marketplaces
/plugin marketplace list

# Install plugin
/plugin install plugin-name@marketplace

# List installed plugins
/plugin list

# Remove plugin
/plugin remove plugin-name

# View help
/help
```

### Required Files
```
my-plugin/
└── .claude-plugin/
    └── plugin.json          # REQUIRED
```

### Minimum plugin.json
```json
{
  "name": "my-plugin"
}
```

### Environment Variables
- `${CLAUDE_PLUGIN_ROOT}` - Plugin directory path
- `${CLAUDE_PROJECT_DIR}` - Current project directory

### Tool Naming
- Commands: `/<command-name>`
- Agents: Use name in conversation
- MCP Tools: `mcp__<server>__<tool>`

---

This guide covers everything you need to create, test, and publish Claude Code plugins. Start with a simple plugin and gradually add more advanced features as needed.

For the latest updates and detailed API documentation, always refer to the [official Claude Code documentation](https://docs.claude.com/en/docs/claude-code).
