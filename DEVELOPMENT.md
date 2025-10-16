# Development Guide

This guide explains how to work on the Fluxwing plugin locally.

## Quick Start

The plugin is currently **symlinked** for development. This means:
- ✅ Edit files directly in `./fluxwing/`
- ✅ Changes are instantly available in Claude Code (after restart)
- ✅ No manual sync required
- ✅ Version control works seamlessly

### Check Development Status

```bash
npm run dev:status
```

### Setup Development Mode (Already Done)

```bash
npm run dev:link
```

This creates a symlink from `./fluxwing/` to `~/.claude/plugins/fluxwing/`.

### Test Your Changes

1. **Make changes** to files in `./fluxwing/`
2. **Restart Claude Code** to reload the plugin
3. **Test the command/agent** in a Claude Code session

### Stop Development Mode

```bash
npm run dev:unlink
```

## Plugin Structure

```
fluxwing/                           # Plugin directory (symlinked)
├── .claude-plugin/
│   └── plugin.json                 # Plugin manifest (auto-discovers commands/agents)
├── commands/                       # Slash commands (auto-discovered)
│   ├── fluxwing-create.md
│   ├── fluxwing-expand-component.md
│   ├── fluxwing-get.md
│   ├── fluxwing-import-screenshot.md
│   ├── fluxwing-library.md
│   └── fluxwing-scaffold.md
├── agents/                         # Autonomous agents (auto-discovered)
│   ├── fluxwing-composer.md
│   ├── fluxwing-designer.md
│   ├── screenshot-component-detection.md
│   ├── screenshot-component-generator.md
│   ├── screenshot-layout-discovery.md
│   ├── screenshot-vision-coordinator.md
│   └── screenshot-visual-properties.md
└── data/                           # Plugin data (schemas, examples, docs)
    ├── schema/
    ├── examples/
    ├── screens/
    └── docs/
```

## Plugin Manifest Schema

The `plugin.json` manifest uses the following schema:

```json
{
  "name": "fluxwing",                    // Required: kebab-case identifier
  "description": "...",                   // Plugin description
  "version": "1.0.0",                     // Semantic version
  "author": { "name": "..." },           // Author info
  "keywords": [...],                      // Search keywords
  "license": "MIT"                        // License type
}
```

**Auto-Discovery**: Commands and agents are automatically discovered from `commands/` and `agents/` directories. No need to list them explicitly in the manifest.

## Common Development Tasks

### Adding a New Command

1. Create `fluxwing/commands/my-command.md`
2. Add frontmatter with description and version
3. Write the command prompt/instructions
4. Restart Claude Code to load the command
5. Test with `/fluxwing-my-command`

### Adding a New Agent

1. Create `fluxwing/agents/my-agent.md`
2. Define agent responsibilities and workflow
3. Restart Claude Code to load the agent
4. Test by referencing in commands or directly

### Modifying Existing Commands/Agents

1. Edit the `.md` file in `fluxwing/commands/` or `fluxwing/agents/`
2. Restart Claude Code
3. Test the changes

### Adding New Component Examples

1. Create `.uxm` + `.md` files in `fluxwing/data/examples/`
2. Validate against schema at `fluxwing/data/schema/uxm-component.schema.json`
3. Restart Claude Code
4. Test with `/fluxwing-get component-name`

## Troubleshooting

### Plugin Won't Load

**Error**: "Plugin fluxwing has an invalid manifest file"

**Solution**: Check `fluxwing/.claude-plugin/plugin.json` for valid JSON syntax and required fields.

### Commands Not Appearing

**Issue**: New commands don't show up in slash command autocomplete

**Solution**:
1. Verify `.md` file exists in `fluxwing/commands/`
2. Restart Claude Code completely
3. Run `npm run dev:status` to confirm symlink is active

### Changes Not Taking Effect

**Issue**: Modified command/agent still uses old version

**Solution**:
1. Ensure you're editing files in `./fluxwing/` (not `~/.claude/plugins/fluxwing/`)
2. Restart Claude Code after changes
3. Check symlink with `npm run dev:status`

### Symlink Broken

**Issue**: `npm run dev:status` shows plugin not linked

**Solution**: Run `npm run dev:link` to recreate the symlink

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Generate HTML report
npm run test:report
```

## Best Practices

1. **Always test commands/agents** after making changes
2. **Validate component JSON** against the schema before committing
3. **Keep documentation in sync** with code changes
4. **Use meaningful commit messages** that explain the "why"
5. **Test with real-world examples** to ensure usability

## Additional Resources

- [CLAUDE.md](./fluxwing/CLAUDE.md) - Claude Code guidance
- [ARCHITECTURE.md](./fluxwing/ARCHITECTURE.md) - Technical design decisions
- [COMMANDS.md](./fluxwing/COMMANDS.md) - Command reference
- [AGENTS.md](./fluxwing/AGENTS.md) - Agent reference
- [TROUBLESHOOTING.md](./fluxwing/TROUBLESHOOTING.md) - Common issues
- [Claude Code Plugin Docs](https://docs.claude.com/en/docs/claude-code/plugins)
