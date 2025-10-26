# Fluxwing Skills Installation Guide

This guide covers installing the Fluxwing skills for Claude Code.

## Recommended Installation (Plugin)

### Quick Start

Install via Claude Code's plugin system:

```bash
# In Claude Code, add the marketplace
/plugin marketplace add trabian/fluxwing-skills

# Install the plugin
/plugin install fluxwing-skills
```

That's it! The skills are now available in Claude Code.

**Verify installation:**
```bash
/plugin list
```

You should see `fluxwing-skills` in the installed plugins list.

---

## Alternative Installation Methods

### Development Installation

For local development and testing:

```bash
# Clone the repository
git clone https://github.com/trabian/fluxwing-skills.git
cd fluxwing-skills

# Run the development installer
./scripts/install.sh
```

The development installer will:
- ✅ Prompt for confirmation (since plugin installation is recommended)
- ✅ Auto-detect the best installation location
- ✅ Copy all 6 skills to Claude Code
- ✅ Verify the installation
- ✅ Show usage examples

#### Development Installation Options

**Auto-Detect Mode (Recommended):**
```bash
./scripts/install.sh
```

The installer automatically chooses:
- If `.claude/` exists in current directory → Install locally (project-specific)
- Otherwise → Install globally (`~/.claude/skills/`)

**Global Installation:**
```bash
./scripts/install.sh --global
```

**Location:** `~/.claude/skills/`

**Use when:** You want skills available in all Claude Code sessions during development.

**Local Installation:**
```bash
./scripts/install.sh --local
```

**Location:** `./.claude/skills/`

**Use when:** You want skills isolated to this project during development.

---

## Manual Installation

If you prefer to install manually:

### 1. Choose Installation Directory

**Global:**
```bash
mkdir -p ~/.claude/skills
```

**Local (project-specific):**
```bash
mkdir -p ./.claude/skills
```

### 2. Copy Skills

```bash
# Clone the repository
git clone https://github.com/trabian/fluxwing-skills.git
cd fluxwing-skills

# Copy to global location
cp -r skills/* ~/.claude/skills/

# OR copy to local location
cp -r skills/* ./.claude/skills/
```

### 3. Verify Installation

Check that all 6 skills are present:

```bash
# Global
ls ~/.claude/skills/

# Local
ls ./.claude/skills/
```

You should see:
- `fluxwing-component-creator/`
- `fluxwing-library-browser/`
- `fluxwing-component-expander/`
- `fluxwing-screen-scaffolder/`
- `fluxwing-component-viewer/`
- `fluxwing-screenshot-importer/`

---

## Verification

After installation, test the skills by asking Claude:

```
"Show me all available components"
```

This should activate the **fluxwing-library-browser** skill.

Other test prompts:
- "Create a button component" (activates fluxwing-component-creator)
- "Build a login screen" (activates fluxwing-screen-scaffolder)
- "Show me the primary-button" (activates fluxwing-component-viewer)

---

## Uninstallation

### Plugin Uninstallation

```bash
/plugin uninstall fluxwing-skills
/plugin marketplace remove trabian/fluxwing-skills
```

### Development Uninstallation

Using the uninstall script:

```bash
# Preview what would be removed
./scripts/uninstall.sh --dry-run

# Remove skills with confirmation
./scripts/uninstall.sh

# Remove without confirmation
./scripts/uninstall.sh --force
```

### Manual Uninstallation

```bash
# Global
rm -rf ~/.claude/skills/fluxwing-*

# Local
rm -rf ./.claude/skills/fluxwing-*
```

**Important:** User data in `./fluxwing/` is NEVER deleted during uninstallation.

---

## Troubleshooting

### Skills Don't Activate

**Problem:** Claude doesn't recognize natural language triggers.

**Solutions:**
1. Verify skills are installed: `/plugin list` or `ls ~/.claude/skills/`
2. Check each skill has a `SKILL.md` file
3. Restart Claude Code
4. Try more explicit triggers: "Use the fluxwing-component-creator skill to create a button"

### Installation Fails

**Problem:** Permission errors during installation.

**Solutions:**
1. Check directory permissions: `ls -la ~/.claude/`
2. Create directory manually: `mkdir -p ~/.claude/skills`
3. Use development installer with `--global` flag

### Skills Installed in Wrong Location

**Problem:** Skills installed globally but you want local (or vice versa).

**Solutions:**
1. Uninstall: `./scripts/uninstall.sh --force`
2. Reinstall with explicit flag: `./scripts/install.sh --local` or `--global`

### Plugin Installation Fails

**Problem:** Cannot add marketplace or install plugin.

**Solutions:**
1. Verify you're using Claude Code (not Claude.ai web interface)
2. Check internet connection
3. Try development installation method instead
4. Check Claude Code version is up to date

---

## Installation Locations

### Plugin Installation
- Skills bundled within plugin
- Managed by Claude Code plugin system
- Location varies by platform and Claude Code version

### Development Installation

**Global:**
- macOS/Linux: `~/.claude/skills/`
- Windows: `%USERPROFILE%\.claude\skills\`

**Local:**
- Any OS: `./.claude/skills/` (relative to current directory)

---

## What Gets Installed

### The 6 Skills

1. **fluxwing-component-creator** - Create UI components
2. **fluxwing-library-browser** - Browse component library
3. **fluxwing-component-expander** - Add interactive states
4. **fluxwing-screen-scaffolder** - Build complete screens
5. **fluxwing-component-viewer** - View component details
6. **fluxwing-screenshot-importer** - Import screenshots

### Bundled Data (Per Skill)

- `SKILL.md` - Skill activation and workflow instructions
- `templates/` - Pre-built component templates (11 for component-creator)
- `schemas/` - JSON Schema validation rules
- `docs/` - Modular documentation (6-8 docs per skill)

**Total size:** ~2MB

---

## Updates

### Plugin Updates

```bash
# Check for updates
/plugin list

# Update plugin
/plugin update fluxwing-skills
```

### Development Updates

```bash
# Pull latest changes
cd fluxwing-skills
git pull

# Reinstall
./scripts/install.sh
```

---

## Next Steps

After installation:

1. **Read the [README.md](README.md)** for quick start examples
2. **Try the six skills** with natural language prompts
3. **Check [CLAUDE.md](CLAUDE.md)** for architectural details
4. **Explore bundled templates** in each skill's `templates/` directory

---

## Support

**Issues:** https://github.com/trabian/fluxwing-skills/issues

**Documentation:** See [README.md](README.md) and [CLAUDE.md](CLAUDE.md)

**uxscii Standard:** See `skills/*/docs/` for detailed guides
