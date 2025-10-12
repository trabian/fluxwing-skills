# Fluxwing Plugin Fixes - 2025-10-12

## Issues Found and Fixed

### 1. plugin.json - Removed Extra Fields
**Issue:** The plugin.json contained fields that aren't part of the core spec and may have been causing issues.

**Fixed:**
- Removed `email` from author object (only `name` is needed)
- Removed `keywords` array (not in spec)
- Removed `hooks` and `mcp` directory references (empty dirs not needed)
- Removed `repository` object (not required)

**Before:**
```json
{
  "name": "fluxwing",
  "version": "1.0.0",
  "description": "...",
  "author": {
    "name": "Fluxwing Team",
    "email": "hello@fluxwing.dev"
  },
  "keywords": ["uxscii", "design", ...],
  "commands": "./commands",
  "agents": "./agents",
  "hooks": "./hooks",
  "mcp": "./mcp",
  "repository": {...}
}
```

**After:**
```json
{
  "name": "fluxwing",
  "description": "...",
  "version": "1.0.0",
  "author": {
    "name": "Fluxwing Team"
  },
  "commands": "./commands",
  "agents": "./agents"
}
```

### 2. Command Files - Fixed Frontmatter
**Issue:** Command markdown files had extra frontmatter fields (`author`, `version`) that aren't part of the spec.

**Fixed:** Removed `author` and `version` from frontmatter in:
- `fluxwing-create.md`
- `fluxwing-library.md`
- `fluxwing-scaffold.md`
- `fluxwing-validate.md`

**Before:**
```yaml
---
description: Create a single uxscii component
author: Fluxwing Team
version: 1.0.0
---
```

**After:**
```yaml
---
description: Create a single uxscii component
---
```

### 3. Agent Files - Fixed Frontmatter
**Issue:** Agent markdown files had extra frontmatter fields (`version`, `tools`) that aren't part of the spec.

**Fixed:** Removed `version` and `tools` from frontmatter in:
- `fluxwing-composer.md`
- `fluxwing-designer.md`
- `fluxwing-validator.md`

**Before:**
```yaml
---
description: Compose complete screens from existing components
version: 1.0.0
tools: Read, Write, Glob, Grep, TodoWrite
---
```

**After:**
```yaml
---
description: Compose complete screens from existing components
---
```

## Current Structure (Validated)

### marketplace.json ✅
```json
{
  "name": "fluxwing-marketplace",
  "owner": {
    "name": "Fluxwing Team"
  },
  "plugins": [
    {
      "name": "fluxwing",
      "source": "./fluxwing",
      "description": "AI-native UX design using the uxscii standard. Create components and screens with ASCII art and structured metadata."
    }
  ]
}
```

### plugin.json ✅
```json
{
  "name": "fluxwing",
  "description": "Fluxwing - AI-native UX design using the uxscii standard. Create components and screens with ASCII art and structured metadata.",
  "version": "1.0.0",
  "author": {
    "name": "Fluxwing Team"
  },
  "commands": "./commands",
  "agents": "./agents"
}
```

### Directory Structure ✅
```
fluxwing-marketplace/
├── .claude-plugin/
│   └── marketplace.json          ✅ Valid
├── fluxwing/
│   ├── .claude-plugin/
│   │   └── plugin.json           ✅ Valid
│   ├── commands/
│   │   ├── fluxwing-create.md    ✅ Fixed
│   │   ├── fluxwing-library.md   ✅ Fixed
│   │   ├── fluxwing-scaffold.md  ✅ Fixed
│   │   └── fluxwing-validate.md  ✅ Fixed
│   ├── agents/
│   │   ├── fluxwing-composer.md  ✅ Fixed
│   │   ├── fluxwing-designer.md  ✅ Fixed
│   │   └── fluxwing-validator.md ✅ Fixed
│   └── data/                     ✅ Assets
```

## Testing Instructions

### Step 1: Remove old marketplace (if added)
```bash
/plugin marketplace remove fluxwing-marketplace
```

### Step 2: Add marketplace
```bash
/plugin marketplace add /Users/tranqy/projects/fluxwing-marketplace
```

### Step 3: Verify marketplace is listed
```bash
/plugin marketplace list
```

Should show:
- fluxwing-marketplace with 1 plugin available

### Step 4: Install the plugin
```bash
/plugin install fluxwing
```

### Step 5: Restart Claude Code
Exit and restart Claude Code to load the plugin.

### Step 6: Verify plugin is loaded
```bash
/plugin list
```

Should show fluxwing as installed and enabled.

### Step 7: Test commands
```bash
/fluxwing-library
```

Should show the component library browser.

## What Was Wrong?

The main issues were:
1. **Extra fields in JSON files** - Claude Code's plugin system is strict about the schema
2. **Extra frontmatter fields** - Only `description` is recognized in command/agent frontmatter
3. **Empty directory references** - hooks and mcp dirs were empty but referenced

## Reference Documentation

Based on https://docs.claude.com/en/docs/claude-code/plugins

**Required fields in plugin.json:**
- `name` (string)
- `description` (string)
- `version` (string)

**Optional fields in plugin.json:**
- `author` (object with `name`)
- `commands` (path to commands directory)
- `agents` (path to agents directory)

**Command/Agent frontmatter:**
- `description` (string) - ONLY field recognized

## Next Steps

After confirming the plugin works:
1. Test all 4 commands work correctly
2. Test agents can be dispatched
3. Verify plugin persists after restart
4. Consider publishing to a public marketplace
