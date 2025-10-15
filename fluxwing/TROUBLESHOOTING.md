# Fluxwing Troubleshooting Guide

Solutions to common issues when using Fluxwing.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Command Issues](#command-issues)
- [Agent Issues](#agent-issues)
- [File Issues](#file-issues)
- [Schema Issues](#schema-issues)
- [Performance Issues](#performance-issues)
- [Getting Additional Help](#getting-additional-help)

---

## Installation Issues

### Plugin Won't Install

**Symptoms**:
```
Error: Failed to install plugin fluxwing
```

**Causes & Solutions**:

**1. Invalid plugin path**:
```bash
# Wrong
/plugin install fluxwing
# Error: Plugin not found

# Right (local install)
/plugin install /absolute/path/to/fluxwing-plugin

# Or (marketplace install, when available)
/plugin install fluxwing
```

**2. Missing plugin.json**:
```bash
# Check if manifest exists
ls /path/to/fluxwing-plugin/.claude-plugin/plugin.json

# If missing, reinstall or fix structure
```

**3. Corrupted download**:
```bash
# Remove and reinstall
/plugin uninstall fluxwing
/plugin install fluxwing
```

### Plugin Installed But Commands Don't Work

**Symptoms**:
```bash
/fluxwing-create
# Command not found
```

**Solutions**:

**1. Reload plugin**:
```bash
/plugin reload fluxwing
```

**2. Check plugin is active**:
```bash
/plugin list
# Should show "fluxwing" as active
```

**3. Verify commands directory**:
```bash
ls ~/.claude/plugins/cache/fluxwing/commands/
# Should show fluxwing-create.md, etc.
```

**4. Reinstall**:
```bash
/plugin uninstall fluxwing
/plugin install fluxwing
```

### Plugin Commands Show But Error When Run

**Symptoms**:
```bash
/fluxwing-create
# Error: Cannot load command file
```

**Solutions**:

**1. Check file permissions**:
```bash
chmod -R 755 ~/.claude/plugins/cache/fluxwing/
```

**2. Check for syntax errors in command files**:
```bash
cat ~/.claude/plugins/cache/fluxwing/commands/fluxwing-create.md
# Look for malformed markdown
```

**3. Clear cache and reinstall**:
```bash
rm -rf ~/.claude/plugins/cache/fluxwing
/plugin reload fluxwing
```

---

## Command Issues

### `/fluxwing-create` Fails to Create Files

**Symptoms**:
```
Error: Cannot write to ./fluxwing/components/
```

**Solutions**:

**1. Create output directory**:
```bash
mkdir -p ./fluxwing/components
mkdir -p ./fluxwing/screens
mkdir -p ./fluxwing/library
```

**2. Check write permissions**:
```bash
ls -ld ./fluxwing
# Should show write permissions (drwxr-xr-x)

# Fix if needed
chmod 755 ./fluxwing
```

**3. Check available disk space**:
```bash
df -h .
# Ensure sufficient space available
```

### `/fluxwing-scaffold` Creates Components But Not Screen

**Symptoms**:
- Components created successfully
- Screen creation fails or incomplete

**Solutions**:

**1. Verify screen template loading**:
```bash
ls ~/.claude/plugins/cache/fluxwing/data/screens/
# Should show example screens
```

**2. Check component references**:
- Ensure all referenced components exist
- IDs match exactly (case-sensitive)

### `/fluxwing-library` Shows Empty

**Symptoms**:
```
Library empty - no components found
```

**Solutions**:

**1. Check bundled examples exist**:
```bash
ls ~/.claude/plugins/cache/fluxwing/data/examples/
# Should show 11 components (22 files)
```

**2. Create your first component**:
```bash
/fluxwing-create button
# Library will show bundled + your components
```

**3. Reload plugin**:
```bash
/plugin reload fluxwing
/fluxwing-library
```

---

## Agent Issues

### Agent Won't Dispatch

**Symptoms**:
```
Agent fluxwing-designer not found
```

**Solutions**:

**1. Check agent files exist**:
```bash
ls ~/.claude/plugins/cache/fluxwing/agents/
# Should show fluxwing-designer.md, etc.
```

**2. Reload plugin**:
```bash
/plugin reload fluxwing
```

**3. Try alternate dispatch syntax**:
```
# Instead of naming agent directly
"I need a complete design system"
# Claude Code should suggest dispatching designer
```

### Agent Starts But Never Completes

**Symptoms**:
- Agent dispatched successfully
- Shows "working" but no output
- Or stops mid-process

**Solutions**:

**1. Check if waiting for input**:
- Agent may be asking for clarification
- Scroll up to see any questions

**2. Check TodoWrite progress**:
```
/todos
# See what agent is working on
```

**3. Check for errors in agent workflow**:
- Review agent output for error messages
- Look for missing files or dependencies

**4. Re-dispatch with more specific instructions**:
```
# Vague
"Create a dashboard"

# Specific
"Create a dashboard with:
- Revenue metric card
- User count metric card
- Activity feed with 5 items
Using existing card and list components"
```

### Agent Reports Missing Resources

**Symptoms**:
```
Error: Cannot find schema/examples/docs
```

**Solutions**:

**1. Verify plugin installation**:
```bash
ls -R ~/.claude/plugins/cache/fluxwing/data/
# Should show schema/, examples/, docs/
```

**2. Reinstall plugin**:
```bash
/plugin uninstall fluxwing
/plugin install fluxwing
```

**3. Check environment variables**:
```bash
echo $CLAUDE_PLUGIN_ROOT
# Should point to plugin cache directory
```

---

## File Issues

### Template File Not Found

**Symptoms**:
```
Error: Template file "component.md" not found
```

**Solutions**:

**1. Check file exists**:
```bash
ls ./fluxwing/components/component.md
```

**2. Check filename matches .uxm reference**:
```json
// In .uxm file
"ascii": {
  "templateFile": "component.md"  // Must match actual filename exactly
}
```

**3. Check file extension**:
```bash
# Wrong
component.markdown

# Right
component.md
```

**4. Check path is relative**:
```json
// Wrong
"templateFile": "/absolute/path/component.md"
"templateFile": "./component.md"

// Right
"templateFile": "component.md"
```

### Variable Mismatch Errors

**Symptoms**:
```
Warning: Variable 'userName' defined in .uxm but not used in template
Warning: Variable '{{userEmail}}' in template but not defined in .uxm
```

**Solutions**:

**1. Check variable definitions** in `.uxm`:
```json
{
  "props": {
    "userName": "Default Name",   // Define here
    "userEmail": "user@example.com"
  }
}
```

**2. Check variable usage** in `.md`:
````markdown
```
Welcome, {{userName}}!
Email: {{userEmail}}
```
````

**3. Match naming exactly** (case-sensitive):
```json
// In .uxm
"props": {
  "userName": "..."  // camelCase
}
```

````markdown
// In .md
{{userName}}  // ✓ Match
{{username}}  // ✗ Won't match
{{UserName}}  // ✗ Won't match
````

**4. Remove unused variables**:
- Either use them in template
- Or remove from props

### Cannot Read/Write Files

**Symptoms**:
```
Error: EACCES: permission denied
```

**Solutions**:

**1. Check file permissions**:
```bash
ls -l ./fluxwing/components/
# Should show readable files (rw-r--r--)
```

**2. Fix permissions**:
```bash
chmod 644 ./fluxwing/components/*.uxm
chmod 644 ./fluxwing/components/*.md
```

**3. Check directory permissions**:
```bash
chmod 755 ./fluxwing
chmod 755 ./fluxwing/components
```

**4. Check file ownership**:
```bash
ls -l ./fluxwing/
# Files should be owned by you

# Fix if needed
chown -R $USER:$USER ./fluxwing/
```

### Files Created in Wrong Location

**Symptoms**:
```
Files created in /Users/you/components/ instead of ./fluxwing/components/
```

**Solutions**:

**1. Check current working directory**:
```bash
pwd
# Should be your project root
```

**2. Change to correct directory**:
```bash
cd /path/to/your/project
/fluxwing-create component-name
```

**3. Move files to correct location**:
```bash
mv components/*.{uxm,md} ./fluxwing/components/
```

### Duplicate Component IDs

**Symptoms**:
```
Error: Component ID 'button' already exists
```

**Solutions**:

**1. Choose unique ID**:
```bash
# Instead of
/fluxwing-create button

# Use specific name
/fluxwing-create submit-button
/fluxwing-create cancel-button
```

**2. Check existing components**:
```bash
/fluxwing-library
# See all existing IDs
```

**3. Remove or rename duplicate**:
```bash
# Remove old version
rm ./fluxwing/components/button.{uxm,md}

# Or rename it
mv button.uxm old-button.uxm
mv button.md old-button.md
```

---

## Schema Issues

### Schema Not Found

**Symptoms**:
```
Error: Cannot load schema for validation
```

**Solutions**:

**1. Check schema location**:
```bash
ls ~/.claude/plugins/cache/fluxwing/data/schema/uxm-component.schema.json
```

**2. If missing, reinstall**:
```bash
/plugin uninstall fluxwing
/plugin install fluxwing
```

**3. Check plugin environment**:
```bash
# Verify CLAUDE_PLUGIN_ROOT is set
echo $CLAUDE_PLUGIN_ROOT
```

### Schema Validation Too Strict

**Symptoms**:
```
Schema validation blocks valid use case
```

**Solutions**:

**1. Check if extension fields allowed**:
```json
{
  "id": "component",
  "type": "button",
  // Standard fields...
  "customField": "value"  // ✓ Extensions allowed
}
```

**2. Use 'custom' type for non-standard components**:
```json
{
  "id": "special-widget",
  "type": "custom",  // When component doesn't fit standard types
  // ...
}
```

**3. Ensure metadata complete**:
```json
{
  "metadata": {
    "name": "...",           // Required
    "created": "...",        // Required
    "modified": "...",       // Required
    "description": "...",    // Recommended
    "author": "...",         // Recommended
    "tags": [...],           // Recommended
    "category": "..."        // Recommended
  }
}
```

### Version Format Errors

**Symptoms**:
```
Error: Version must be semantic (major.minor.patch)
```

**Solutions**:

**Correct formats**:
```json
"version": "1.0.0"     // ✓ Semantic versioning
"version": "0.1.0"     // ✓ Pre-release
"version": "2.3.1"     // ✓ Patch version
```

**Incorrect formats**:
```json
"version": "1.0"       // ✗ Missing patch
"version": "v1.0.0"    // ✗ Don't prefix with 'v'
"version": "1"         // ✗ Too short
"version": "1.0.0.0"   // ✗ Too many parts
```

**Fix**:
```json
{
  "version": "1.0.0"  // Always major.minor.patch
}
```

---

## Performance Issues

### Commands/Agents Are Slow

**Symptoms**:
- Commands take >30 seconds to complete
- Agents take >5 minutes for simple tasks

**Solutions**:

**1. Check file count**:
```bash
find ./fluxwing -type f | wc -l
# If >1000 files, consider cleanup
```

**2. Optimize documentation loading**:
- Don't load all docs upfront
- Use modular loading (per 00-INDEX.md)
- Load only task-specific docs

**3. Cache bundled assets**:
- Examples don't change during session
- Schema doesn't change during session
- Load once, reference many times

**4. Reduce component complexity**:
- Simplify ASCII art
- Remove unused states
- Clean up metadata

### Out of Memory Errors

**Symptoms**:
```
Error: JavaScript heap out of memory
```

**Solutions**:

**1. Increase Node memory limit**:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
```

**2. Reduce file sizes**:
- Simplify ASCII art
- Remove trailing spaces
- Reduce metadata verbosity

---

## Getting Additional Help

### Before Asking for Help

**1. Check this troubleshooting guide** (you're here!)

**2. Search existing issues**:
- GitHub Issues
- Discussions

**3. Gather information**:
```bash
# Plugin version
/plugin list | grep fluxwing

# Claude Code version
claude --version

# OS information
uname -a

# Error messages
# Copy full error output
```

### How to Ask for Help

**Good issue report**:
```markdown
## Problem
Brief description of what's not working

## Steps to Reproduce
1. Run /fluxwing-create button
2. Enter name "submit-button"
3. Error appears: [paste error]

## Expected Behavior
Should create submit-button.uxm and submit-button.md

## Actual Behavior
Error: [paste full error message]

## Environment
- Fluxwing version: 1.0.0
- Claude Code version: 0.5.0
- OS: macOS 14.0

## Additional Context
- Working directory: /Users/me/project
- Files in ./fluxwing/: [list]
```

**Bad issue report**:
```markdown
It doesn't work. Help!
```

### Where to Get Help

**Documentation**:
- `README.md` - Overview
- `COMMANDS.md` - Command reference
- `AGENTS.md` - Agent reference
- `ARCHITECTURE.md` - Technical details
- `CONTRIBUTING.md` - Extending Fluxwing

**Community**:
- GitHub Issues - Bug reports, feature requests
- GitHub Discussions - Questions, ideas, showcase
- Discord - [If available] Real-time help

**Maintainers**:
- Tag in issues/PRs for urgent problems
- Include all information from "How to Ask for Help"

---

## Common Error Messages Explained

### `Error: Cannot find module`
**Meaning**: Missing dependency or incorrect path
**Fix**: Reinstall plugin, check paths

### `Error: ENOENT: no such file or directory`
**Meaning**: File doesn't exist at expected location
**Fix**: Create missing file/directory, check path

### `Error: EACCES: permission denied`
**Meaning**: No permission to read/write file
**Fix**: Check permissions, fix ownership

### `SyntaxError: Unexpected token`
**Meaning**: Invalid JSON syntax
**Fix**: Check JSON with `jq`, fix syntax errors

### `Error: Template file not found`
**Meaning**: .md file missing or misnamed
**Fix**: Create .md file, check filename matches

### `Error: Variable mismatch`
**Meaning**: Variables don't match between .uxm and .md
**Fix**: Sync variables, check spelling

### `Error: Component ID already exists`
**Meaning**: Duplicate component ID
**Fix**: Use unique ID or remove duplicate

---

## Still Having Issues?

If you've tried solutions in this guide and still have problems:

1. **Reinstall from scratch**:
```bash
/plugin uninstall fluxwing
rm -rf ~/.claude/plugins/cache/fluxwing
/plugin install fluxwing
```

2. **Check plugin cache**:
```bash
ls -R ~/.claude/plugins/cache/fluxwing/
# Verify all files present
```

3. **Report the issue**:
- GitHub: [Repository URL]/issues
- Include full error output
- Include steps to reproduce
- Include environment details

We're here to help! 🎨
