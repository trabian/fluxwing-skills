# Fluxwing Skills Installation Guide

## Overview

Fluxwing provides 6 Claude skills that enable AI-native UX design with the uxscii standard. Skills are automatically discovered by Claude and work from any directory once installed.

**Works with:**
- ✅ **Claude Code CLI** (terminal/command line)
- ✅ **Claude Desktop App** (macOS, Windows, Linux)

Both use the same installation process and skills directory!

## Available Skills

1. **UXscii Component Creator** - Create uxscii components with ASCII art
2. **UXscii Component Expander** - Add interaction states (hover, focus, disabled)
3. **UXscii Component Viewer** - View component details and previews
4. **UXscii Library Browser** - Browse all available components
5. **UXscii Screen Scaffolder** - Build complete UI screens
6. **UXscii Screenshot Importer** - Import screenshots and generate components

## Platform Support

| Platform | Installation Script | Notes |
|----------|-------------------|-------|
| **macOS** | `./install-skills.sh` | Bash script |
| **Linux** | `./install-skills.sh` | Bash script |
| **Windows** | `.\install-skills.ps1` | PowerShell script |

## Quick Installation

### macOS / Linux

```bash
# Make script executable
chmod +x install-skills.sh

# Run installation
./install-skills.sh
```

### Windows (PowerShell)

```powershell
# Run installation
.\install-skills.ps1
```

### Windows (Git Bash)

```bash
# Same as macOS/Linux
chmod +x install-skills.sh
./install-skills.sh
```

**This will:**
- Copy all skills to `~/.claude/skills/` (macOS/Linux) or `%USERPROFILE%\.claude\skills` (Windows)
- Backup any existing skills
- Make skills available globally in both Claude Code CLI and Claude Desktop App

## Quick Uninstallation

### macOS / Linux

```bash
./uninstall-skills.sh
```

### Windows (PowerShell)

```powershell
.\uninstall-skills.ps1
```

**This will:**
- Remove all Fluxwing skills from personal directory
- Create backups before removal
- Prompt for confirmation before uninstalling

## Manual Installation

### macOS / Linux

```bash
# Create personal skills directory
mkdir -p ~/.claude/skills/

# Copy all skills
cp -r .claude/skills/* ~/.claude/skills/

# Verify installation
ls ~/.claude/skills/
```

### Windows (PowerShell)

```powershell
# Create personal skills directory
New-Item -ItemType Directory -Path "$env:USERPROFILE\.claude\skills" -Force

# Copy all skills
Copy-Item -Path ".claude\skills\*" -Destination "$env:USERPROFILE\.claude\skills\" -Recurse -Force

# Verify installation
Get-ChildItem "$env:USERPROFILE\.claude\skills\"
```

**Expected output (all platforms):**
```
uxscii-component-creator/
uxscii-component-expander/
uxscii-component-viewer/
uxscii-library-browser/
uxscii-screen-scaffolder/
uxscii-screenshot-importer/
```

## Verification

After installation, test that skills are working in **both Claude Code CLI and Claude Desktop App**:

### Test 1: Component Creator
In Claude (CLI or Desktop App), say:
```
Create a submit button
```

**Expected:** Claude activates the "UXscii Component Creator" skill

### Test 2: Library Browser
```
Show me all available components
```

**Expected:** Claude activates the "UXscii Library Browser" skill

### Test 3: Component Viewer
```
View details about the primary-button component
```

**Expected:** Claude activates the "UXscii Component Viewer" skill

### Platform-Specific Testing

**Claude Code CLI:**
```bash
# Start Claude Code
claude

# Test trigger phrase
> Create a submit button
```

**Claude Desktop App:**
1. Open Claude Desktop
2. Start a new conversation
3. Type: "Create a submit button"
4. Claude should activate the skill automatically

## How Skills Work

### Automatic Discovery
Skills are **model-invoked** - Claude automatically decides when to use them based on:
- Your natural language request
- The skill's description and trigger terms
- The context of your conversation

### Trigger Phrases

Each skill responds to natural language:

| Skill | Trigger Examples |
|-------|-----------------|
| Component Creator | "Create a button", "Build an input", "Design a card" |
| Component Expander | "Add hover state", "Expand this component", "Add interactions" |
| Component Viewer | "View the button", "Show component details", "Inspect card" |
| Library Browser | "Show all components", "Browse library", "List components" |
| Screen Scaffolder | "Create a login screen", "Build a dashboard", "Scaffold a page" |
| Screenshot Importer | "Import this screenshot", "Convert image to component" |

### Global Availability

Once installed to `~/.claude/skills/`, skills work from **any directory**:

```bash
# Works from anywhere
cd ~/projects/my-app
# "Create a button" → works!

cd ~/Desktop
# "Show all components" → works!

cd /tmp/test
# "Build a login screen" → works!
```

## Project-Local Skills (Alternative)

If you prefer skills only available in this project:

1. **Don't run install script** - Skills already exist in `.claude/skills/`
2. **Always work from this directory:**
   ```bash
   cd /path/to/fluxwing-marketplace
   ```
3. Skills will only work when Claude Code is in this directory

## Skill Structure

Each skill contains:

```
skill-name/
├── SKILL.md              # Main skill instructions (required)
├── templates/            # Optional: Component templates
├── schemas/              # Optional: JSON schemas
└── docs/                 # Optional: Additional documentation
```

### SKILL.md Format

```yaml
---
name: Skill Name
description: What it does and when Claude should use it
version: 1.0.0
author: Trabian
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Skill Instructions

[Detailed workflow for Claude...]
```

## Troubleshooting

### Skills Not Activating

**Symptom:** Claude doesn't recognize trigger phrases

**Solutions:**

1. **Verify installation:**
   ```bash
   ls ~/.claude/skills/uxscii-*
   ```
   Should show 6 directories

2. **Check you're using trigger phrases:**
   - ✓ "Create a button" (natural language)
   - ✗ "/create-button" (slash command - different system)

3. **Verify YAML frontmatter:**
   ```bash
   head -10 ~/.claude/skills/uxscii-component-creator/SKILL.md
   ```
   Should show valid YAML with `name:` and `description:`

4. **Try different phrasing:**
   - "Create a submit button"
   - "Build a button component"
   - "Design a button"

### Skills Conflict with Project Skills

**Symptom:** Multiple versions of skills exist

**Solution:** Remove project-local versions after installation:

```bash
# After running install-skills.sh
rm -rf .claude/skills/

# Skills are now only in ~/.claude/skills/ (global)
```

### Permission Errors

**Symptom:** Installation script fails with permission errors

**Solution:**

```bash
# Make scripts executable
chmod +x install-skills.sh uninstall-skills.sh

# Verify permissions
ls -la *.sh
```

### Backups Taking Up Space

**Symptom:** Multiple `.backup.*` directories in `~/.claude/skills/`

**Solution:**

```bash
# View backups
ls ~/.claude/skills/*.backup.*

# Remove old backups
rm -rf ~/.claude/skills/*.backup.*
rm -rf ~/.claude/skills/*.uninstall-backup.*
```

## Updating Skills

To update to a newer version:

```bash
# Pull latest changes
git pull

# Uninstall old version
./uninstall-skills.sh

# Install new version
./install-skills.sh
```

Or use the automatic backup feature:

```bash
# Install will automatically backup existing skills
./install-skills.sh

# Old version is saved as *.backup.[timestamp]
```

## File Locations

| Platform | Personal Skills Directory | Project Skills |
|----------|--------------------------|----------------|
| **macOS/Linux** | `~/.claude/skills/` | `.claude/skills/` |
| **Windows** | `%USERPROFILE%\.claude\skills` | `.claude\skills` |

**Other Files:**
- Settings: `~/.claude/settings.json` (macOS/Linux) or `%USERPROFILE%\.claude\settings.json` (Windows)

**Note:** Both Claude Code CLI and Claude Desktop App use the **same directories**!

## Advanced Usage

### Custom Installation Directory

To install to a different location:

```bash
# Edit install-skills.sh and change:
SKILLS_DEST="$HOME/.claude/skills"  # default
SKILLS_DEST="/custom/path/skills"   # custom
```

### Selective Installation

To install only specific skills:

```bash
# Install only Component Creator
mkdir -p ~/.claude/skills/
cp -r .claude/skills/uxscii-component-creator ~/.claude/skills/

# Install only Library Browser
cp -r .claude/skills/uxscii-library-browser ~/.claude/skills/
```

### Sharing with Team

**Option 1: Use project-local skills** (already set up)
- Skills in `.claude/skills/` are committed to git
- Team members get skills automatically when they clone

**Option 2: Share installation scripts**
- Team members clone repo
- Each person runs `./install-skills.sh`
- Skills installed to their personal directory

## Support

For issues:

1. Check this troubleshooting guide
2. Verify installation with verification tests
3. Review skill descriptions to ensure you're using correct trigger phrases
4. Check Claude Code logs for errors

## Comparison: Skills vs Plugin Commands

| Feature | Skills | Plugin Commands |
|---------|--------|-----------------|
| **Invocation** | Automatic (natural language) | Manual (`/command`) |
| **Installation** | Copy to `~/.claude/skills/` | Plugin system |
| **Availability** | Global or project-local | Project-local only |
| **Discovery** | AI-powered matching | Tab completion |
| **Use Case** | Complex workflows | Quick commands |
| **Best For** | "Create a button" | `/fluxwing-create` |

## Next Steps

After installation:

1. **Test skills** - Try the verification commands above
2. **Create components** - "Create a submit button"
3. **Browse library** - "Show me all components"
4. **Build screens** - "Create a login screen"
5. **Import designs** - "Import this screenshot"

Enjoy building with Fluxwing! 🚀
