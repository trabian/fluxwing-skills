# Fluxwing Plugin Installation Guide

## ✅ Pre-Installation Cleanup Complete

The following items have been removed from the plugin:
- ✓ `uxscii/` - CLI tool implementation (not needed for plugin)
- ✓ `hooks/` - Empty directory
- ✓ `mcp/` - Empty directory with only README

**What remains** (all necessary for the plugin):
- ✓ `data/` - uxscii standard assets (schema, examples, docs)
- ✓ `commands/` - 4 slash commands
- ✓ `agents/` - 3 subagents
- ✓ All documentation files

## Installation Steps

### Step 1: Verify Prerequisites

Check that you have ripgrep installed (required for plugin commands):

```bash
rg --version
```

If not installed:
```bash
# macOS
brew install ripgrep

# Windows
winget install BurntSushi.ripgrep.MSVC

# Ubuntu/Debian
sudo apt install ripgrep
```

### Step 2: Remove Previous Installation (if exists)

```bash
/plugin marketplace remove fluxwing-marketplace
/plugin uninstall fluxwing
```

### Step 3: Add Marketplace

```bash
/plugin marketplace add /Users/tranqy/projects/fluxwing-marketplace
```

**Expected output:** Success message confirming marketplace was added

### Step 4: Verify Marketplace

```bash
/plugin marketplace list
```

**Expected output:**
```
fluxwing-marketplace
  - 1 plugin available
```

### Step 5: Install Plugin

```bash
/plugin install fluxwing
```

**Expected output:** Success message confirming installation

### Step 6: Verify Installation

```bash
/plugin list
```

**Expected output:** Should show `fluxwing` as installed and enabled

### Step 7: Restart Claude Code

**Important:** Exit and restart Claude Code to fully load the plugin.

### Step 8: Verify Commands are Available

```bash
/help
```

**Expected output:** Should show these new commands:
- `/fluxwing-create` - Create a single uxscii component
- `/fluxwing-library` - Browse uxscii component library
- `/fluxwing-scaffold` - Scaffold a complete screen with multiple components
- `/fluxwing-validate` - Validate uxscii components for quality and compliance

### Step 9: Test a Command

```bash
/fluxwing-library
```

**Expected output:** Interactive component library browser

## Plugin Structure (Final)

```
fluxwing-marketplace/
├── .claude-plugin/
│   └── marketplace.json          ✓ Valid
├── fluxwing/                      ← The Plugin
│   ├── .claude-plugin/
│   │   └── plugin.json           ✓ Valid
│   ├── commands/                 ✓ 4 slash commands
│   │   ├── fluxwing-create.md
│   │   ├── fluxwing-library.md
│   │   ├── fluxwing-scaffold.md
│   │   └── fluxwing-validate.md
│   ├── agents/                   ✓ 3 subagents
│   │   ├── fluxwing-composer.md
│   │   ├── fluxwing-designer.md
│   │   └── fluxwing-validator.md
│   ├── data/                     ✓ uxscii standard assets
│   │   ├── schema/              ← JSON Schema validation
│   │   ├── examples/            ← Component templates
│   │   ├── screens/             ← Screen examples
│   │   └── docs/                ← Documentation modules
│   └── [documentation files]
└── INSTALLATION_GUIDE.md (this file)
```

## Troubleshooting

### Issue: Marketplace not found

**Check:**
1. Path is correct: `/Users/tranqy/projects/fluxwing-marketplace`
2. `.claude-plugin/marketplace.json` exists at that path
3. JSON is valid (we verified this already ✓)

### Issue: Plugin install fails

**Try:**
```bash
# Run diagnostics
/doctor

# Check marketplace is added
/plugin marketplace list

# Try with explicit marketplace name
/plugin install fluxwing@fluxwing-marketplace
```

### Issue: Commands don't appear

**Solutions:**
1. Restart Claude Code (required after installation)
2. Check plugin is enabled: `/plugin list`
3. Re-enable if needed: `/plugin enable fluxwing`

### Issue: Permission or path errors

**Check:**
- All paths in plugin.json are relative with `./` prefix ✓
- Command and agent files exist ✓
- Files have proper frontmatter (we verified ✓)

## What Changed

### Removed (cleanup):
- `uxscii/` directory - TypeScript CLI implementation (users don't need this)
- `hooks/` directory - Was empty
- `mcp/` directory - Only had a README, no actual servers

### Kept (all necessary):
- All uxscii **standard** documentation and schema
- All uxscii component examples and templates
- All plugin commands and agents
- All documentation

## Success Criteria

✅ Marketplace added successfully
✅ Plugin installed without errors
✅ Plugin shows as enabled in `/plugin list`
✅ All 4 commands appear in `/help`
✅ `/fluxwing-library` command works
✅ Plugin persists after Claude Code restart

## Next Steps After Installation

1. **Create a component:**
   ```bash
   /fluxwing-create
   ```

2. **Browse the library:**
   ```bash
   /fluxwing-library
   ```

3. **Scaffold a screen:**
   ```bash
   /fluxwing-scaffold
   ```

4. **Validate your work:**
   ```bash
   /fluxwing-validate
   ```

## Support

If issues persist:
1. Run `/doctor` for diagnostics
2. Check Claude Code logs for errors
3. Verify ripgrep is installed: `rg --version`
4. Review this guide's troubleshooting section
