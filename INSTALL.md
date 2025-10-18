# UXscii Skills Installation Guide

This guide covers installing the UXscii skills for Claude Code.

## Quick Start

### One-Line Installation

```bash
./scripts/install.sh
```

That's it! The installer will:
- ✅ Auto-detect the best installation location
- ✅ Copy all 6 skills to Claude Code
- ✅ Verify the installation
- ✅ Show usage examples

---

## Installation Options

### Auto-Detect Mode (Recommended)

The installer automatically chooses the best location:

```bash
./scripts/install.sh
```

**Logic:**
- If `.claude/` exists in current directory → Install locally (project-specific)
- Otherwise → Install globally (`~/.claude/skills/`)

### Global Installation

Install skills for all projects:

```bash
./scripts/install.sh --global
```

**Location:** `~/.claude/skills/`

**Use when:** You want skills available in all Claude Code sessions.

### Local Installation

Install skills for current project only:

```bash
./scripts/install.sh --local
```

**Location:** `./.claude/skills/`

**Use when:** You want skills isolated to this project.

### Force Overwrite

Update existing skills:

```bash
./scripts/install.sh --force
```

**Use when:** You want to reinstall or update skills that are already installed.

---

## Manual Installation

If you prefer to install manually:

### 1. Choose Installation Directory

**Global:**
```bash
mkdir -p ~/.claude/skills
```

**Local:**
```bash
mkdir -p .claude/skills
```

### 2. Copy Skills

```bash
cp -r .claude/skills/uxscii-* ~/.claude/skills/
# or
cp -r .claude/skills/uxscii-* .claude/skills/
```

### 3. Verify Installation

Check that all skills are present:

```bash
ls ~/.claude/skills/uxscii-*/SKILL.md
# Should show 6 files
```

---

## Verification

### Automated Verification

The installer runs these checks automatically:

1. **SKILL.md files exist** - All 6 skills have their main file
2. **YAML frontmatter validates** - Metadata is properly formatted
3. **Templates exist** - 11+ component templates (.uxm files)
4. **Schema exists** - JSON Schema validation file
5. **No PLUGIN_ROOT references** - Skills use SKILL_ROOT correctly
6. **SKILL_ROOT usage** - Skills reference their own directories

### Manual Verification

Test each skill with natural language:

```bash
# In Claude Code, try these prompts:

1. "Create a button"
   → Should activate uxscii-component-creator

2. "Show me all components"
   → Should activate uxscii-library-browser

3. "Add hover state to my button"
   → Should activate uxscii-component-expander

4. "Build a login screen"
   → Should activate uxscii-screen-scaffolder

5. "Show me the primary-button"
   → Should activate uxscii-component-viewer

6. "Import this screenshot"
   → Should activate uxscii-screenshot-importer
```

---

## What Gets Installed

### 6 Skills

1. **uxscii-component-creator** - Create UI components
2. **uxscii-library-browser** - Browse available components
3. **uxscii-component-expander** - Add interaction states
4. **uxscii-screen-scaffolder** - Build complete screens
5. **uxscii-component-viewer** - View component details
6. **uxscii-screenshot-importer** - Import from screenshots

### Supporting Files

- **Templates:** 11 component templates (.uxm + .md)
- **Schemas:** JSON Schema for validation
- **Screen Examples:** 2 screen templates
- **Documentation:** 13 documentation files

**Total:** 6 skills + 42 supporting files = **48 files**

---

## Usage Examples

### Component Creation

```
You: Create a button
Claude: [Activates uxscii-component-creator skill]
        [Creates ./fluxwing/components/button.uxm]
```

### Library Browsing

```
You: Show me all components
Claude: [Activates uxscii-library-browser skill]
        [Displays tree of bundled + user components]
```

### State Expansion

```
You: Add hover state to my button
Claude: [Activates uxscii-component-expander skill]
        [Updates button.uxm with hover state]
```

### Screen Scaffolding

```
You: Build a login screen
Claude: [Activates uxscii-screen-scaffolder skill]
        [Creates ./fluxwing/screens/login-screen.uxm]
```

---

## Troubleshooting

### Skills Not Activating

**Problem:** Natural language doesn't trigger skills.

**Solutions:**
1. Verify installation location: `ls ~/.claude/skills/uxscii-*/SKILL.md`
2. Check YAML frontmatter: `head -n 10 ~/.claude/skills/uxscii-component-creator/SKILL.md`
3. Restart Claude Code
4. Try more explicit language: "Use the uxscii component creator to make a button"

### "SKILL.md not found" Errors

**Problem:** Skill files missing after installation.

**Solutions:**
1. Re-run installer with `--force`: `./scripts/install.sh --force`
2. Check source directory exists: `ls .claude/skills/uxscii-*/SKILL.md`
3. Verify permissions: `ls -la ~/.claude/skills/`

### Templates Not Found

**Problem:** Skills can't find component templates.

**Solutions:**
1. Verify templates exist: `ls .claude/skills/uxscii-component-creator/templates/*.uxm`
2. Check file count: Should be 11+ .uxm files
3. Reinstall: `./scripts/install.sh --force`

### Wrong Installation Location

**Problem:** Skills installed in wrong directory.

**Solutions:**
1. Uninstall: `./scripts/uninstall.sh --all`
2. Reinstall with specific location:
   - Global: `./scripts/install.sh --global`
   - Local: `./scripts/install.sh --local`

### Permission Denied

**Problem:** Can't create skills directory.

**Solutions:**
1. Check directory permissions: `ls -la ~/.claude/`
2. Create manually: `mkdir -p ~/.claude/skills`
3. Run with appropriate permissions (avoid `sudo` unless necessary)

---

## Uninstallation

### Quick Uninstall

```bash
./scripts/uninstall.sh
```

**What happens:**
- ✅ Removes all uxscii-* skills
- ✅ Preserves user data in `./fluxwing/`
- ✅ Shows confirmation before removal

### Uninstall Options

**Remove from specific location:**
```bash
./scripts/uninstall.sh --global  # Remove from ~/.claude/skills
./scripts/uninstall.sh --local   # Remove from ./.claude/skills
./scripts/uninstall.sh --all     # Remove from all locations
```

**Skip confirmation:**
```bash
./scripts/uninstall.sh --force
```

**Preview removal (dry run):**
```bash
./scripts/uninstall.sh --dry-run
```

### What Gets Preserved

**IMPORTANT:** User data is **NEVER** removed:

- ✅ `./fluxwing/components/` - Your custom components
- ✅ `./fluxwing/screens/` - Your screens
- ✅ `./fluxwing/library/` - Your component library

Only skill files in `.claude/skills/uxscii-*` are removed.

---

## Updating Skills

To update to the latest version:

```bash
# 1. Pull latest changes
git pull

# 2. Reinstall with force
./scripts/install.sh --force
```

---

## Directory Structure

### After Installation (Global)

```
~/.claude/skills/
├── uxscii-component-creator/
│   ├── SKILL.md
│   ├── templates/           # 11 component templates
│   ├── schemas/             # JSON Schema
│   └── docs/                # Documentation
├── uxscii-library-browser/
│   ├── SKILL.md
│   └── docs/
├── uxscii-component-expander/
│   ├── SKILL.md
│   └── docs/
├── uxscii-screen-scaffolder/
│   ├── SKILL.md
│   ├── templates/           # 2 screen templates
│   └── docs/
├── uxscii-component-viewer/
│   ├── SKILL.md
│   └── docs/
└── uxscii-screenshot-importer/
    ├── SKILL.md
    └── docs/                # 6 screenshot docs
```

### Your Project Structure (Unchanged)

```
./fluxwing/
├── components/              # Your components (created by skills)
│   ├── button.uxm
│   ├── button.md
│   └── ...
├── screens/                 # Your screens (created by skills)
│   ├── login-screen.uxm
│   └── ...
└── library/                 # Your customized library
    └── ...
```

---

## Getting Help

### Installation Issues

If you encounter problems:

1. **Check the logs:** Installer shows detailed error messages
2. **Run verification:** `./scripts/install.sh` (runs checks automatically)
3. **Try manual install:** See "Manual Installation" section above
4. **File an issue:** https://github.com/USER/REPO/issues (update with actual repo)

### Usage Questions

- **Skills not activating?** See "Troubleshooting" section
- **Want examples?** See "Usage Examples" section
- **Need to uninstall?** See "Uninstallation" section

---

## Next Steps

After successful installation:

1. ✅ **Try the examples** - Use the natural language prompts above
2. ✅ **Create a component** - "Create a button" or "Make an input field"
3. ✅ **Browse the library** - "Show me all components"
4. ✅ **Build a screen** - "Create a login screen"
5. ✅ **Explore documentation** - Check `~/.claude/skills/uxscii-*/docs/`

---

## System Requirements

- **Claude Code:** Latest version
- **Operating System:** macOS, Linux, or Windows (with bash)
- **Disk Space:** ~5 MB for all skills and supporting files

---

## License

See LICENSE file for details.

---

**Last Updated:** 2025-10-18
