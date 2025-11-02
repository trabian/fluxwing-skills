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
- ✅ Install all 7 skills to `~/.claude/skills/`
- ✅ Verify the installation
- ✅ Show usage examples

**Location:** Skills are always installed globally to `~/.claude/skills/`

---

## Manual Installation

If you prefer to install manually:

```bash
# Create skills directory
mkdir -p ~/.claude/skills

# Clone the repository
git clone https://github.com/trabian/fluxwing-skills.git
cd fluxwing-skills

# Copy skills to global location
cp -r skills/* ~/.claude/skills/
```

### Verify Installation

Check that all 7 skills are present:

```bash
ls ~/.claude/skills/
```

You should see:
- `fluxwing-component-creator/`
- `fluxwing-library-browser/`
- `fluxwing-component-expander/`
- `fluxwing-enhancer/`
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
./scripts/uninstall.sh
```

The uninstaller will:
- Remove all fluxwing-* and uxscii-* (legacy) skills from `~/.claude/skills/`
- Preserve user data in `./fluxwing/` (never deleted)

### Manual Uninstallation

```bash
rm -rf ~/.claude/skills/fluxwing-*
rm -rf ~/.claude/skills/uxscii-*  # Legacy skills if present
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
3. Try manual installation method (see above)

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

- macOS/Linux: `~/.claude/skills/`
- Windows: `%USERPROFILE%\.claude\skills\`

---

## What Gets Installed

### The 7 Skills

1. **fluxwing-component-creator** - Create UI components
2. **fluxwing-library-browser** - Browse component library
3. **fluxwing-component-expander** - Add interactive states
4. **fluxwing-enhancer** - Enhance components from sketch to production
5. **fluxwing-screen-scaffolder** - Build complete screens
6. **fluxwing-component-viewer** - View component details
7. **fluxwing-screenshot-importer** - Import screenshots

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
2. **Try the seven skills** with natural language prompts
3. **Check [CLAUDE.md](CLAUDE.md)** for architectural details
4. **Explore bundled templates** in each skill's `templates/` directory

---

## Support

**Issues:** https://github.com/trabian/fluxwing-skills/issues

**Documentation:** See [README.md](README.md) and [CLAUDE.md](CLAUDE.md)

**uxscii Standard:** See `skills/*/docs/` for detailed guides
