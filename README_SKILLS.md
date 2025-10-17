# Fluxwing Skills Package

> AI-native UX design skills for Claude Code CLI and Claude Desktop App

## What's Included

This package contains **6 professional Claude skills** that enable AI-native UX design using the uxscii standard:

1. **UXscii Component Creator** - Create UI components with ASCII art
2. **UXscii Component Expander** - Add interaction states (hover, focus, disabled)
3. **UXscii Component Viewer** - View component details and previews
4. **UXscii Library Browser** - Browse all available components
5. **UXscii Screen Scaffolder** - Build complete UI screens
6. **UXscii Screenshot Importer** - Import screenshots and generate components

## Quick Start

### Installation

**macOS / Linux:**
```bash
chmod +x install-skills.sh
./install-skills.sh
```

**Windows (PowerShell):**
```powershell
.\install-skills.ps1
```

### Verification

Test in Claude (CLI or Desktop App):
```
Create a submit button
```

Claude should activate the "UXscii Component Creator" skill automatically!

## Platform Support

| Platform | Supported | Installation |
|----------|-----------|--------------|
| **Claude Code CLI** (macOS) | ✅ | `./install-skills.sh` |
| **Claude Code CLI** (Linux) | ✅ | `./install-skills.sh` |
| **Claude Code CLI** (Windows) | ✅ | `.\install-skills.ps1` |
| **Claude Desktop App** (macOS) | ✅ | `./install-skills.sh` |
| **Claude Desktop App** (Windows) | ✅ | `.\install-skills.ps1` |
| **Claude Desktop App** (Linux) | ✅ | `./install-skills.sh` |

**Note:** Claude Code CLI and Claude Desktop App **share the same skills directory**, so one installation works for both!

## Documentation

- **[SKILLS_INSTALLATION.md](SKILLS_INSTALLATION.md)** - Complete installation guide (CLI & Desktop)
- **[CLAUDE_APP_INSTALLATION.md](CLAUDE_APP_INSTALLATION.md)** - Claude Desktop App specific guide
- **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** - Legacy plugin installation (deprecated)

## How It Works

### Natural Language Activation

Skills use **automatic discovery** - no slash commands needed! Just talk naturally to Claude:

| What You Say | Skill Activated |
|--------------|-----------------|
| "Create a button" | Component Creator |
| "Show all components" | Library Browser |
| "Add hover state" | Component Expander |
| "Build a login screen" | Screen Scaffolder |
| "Import this screenshot" | Screenshot Importer |

### Example Workflow

```
You: I need a login form with email, password, and submit button

Claude: [Activates Screen Scaffolder skill]
I'll create a login screen with those components!

[Creates screen with all components]

✓ Login screen created successfully!
Files:
- ./fluxwing/screens/login-screen.uxm
- ./fluxwing/screens/login-screen.md
- ./fluxwing/components/email-input.uxm
- ./fluxwing/components/password-input.uxm
- ./fluxwing/components/submit-button.uxm
```

## Installation Files

### Scripts

| File | Platform | Purpose |
|------|----------|---------|
| `install-skills.sh` | macOS/Linux | Install all skills |
| `install-skills.ps1` | Windows | Install all skills |
| `uninstall-skills.sh` | macOS/Linux | Uninstall all skills |
| `uninstall-skills.ps1` | Windows | Uninstall all skills |

### Skills Directory

```
.claude/skills/
├── uxscii-component-creator/    # Create components
├── uxscii-component-expander/   # Add states
├── uxscii-component-viewer/     # View details
├── uxscii-library-browser/      # Browse library
├── uxscii-screen-scaffolder/    # Build screens
└── uxscii-screenshot-importer/  # Import screenshots
```

## Where Skills Are Installed

| Platform | Directory |
|----------|-----------|
| **macOS/Linux** | `~/.claude/skills/` |
| **Windows** | `%USERPROFILE%\.claude\skills` |

**Global Access:** Once installed, skills work from **any directory** in both CLI and Desktop App!

## Features

### ✅ Cross-Platform
- Works on macOS, Windows, and Linux
- Same installation process for all platforms

### ✅ Cross-Application
- Works in Claude Code CLI (terminal)
- Works in Claude Desktop App (GUI)
- Same skills directory for both

### ✅ Automatic Discovery
- No slash commands to remember
- Natural language activation
- Context-aware skill selection

### ✅ Safe Installation
- Automatic backups before installation
- Confirmation prompts before uninstallation
- Easy rollback with timestamps

### ✅ Team-Friendly
- Can be project-local (`.claude/skills/`)
- Can be personal-global (`~/.claude/skills/`)
- Git-friendly for team sharing

## Uninstallation

**macOS / Linux:**
```bash
./uninstall-skills.sh
```

**Windows (PowerShell):**
```powershell
.\uninstall-skills.ps1
```

Creates backups before removal and prompts for confirmation.

## Troubleshooting

### Skills Not Activating

**Check installation:**
```bash
# macOS/Linux
ls ~/.claude/skills/

# Windows (PowerShell)
Get-ChildItem "$env:USERPROFILE\.claude\skills\"
```

Should show 6 skill directories.

**Try clear trigger phrases:**
- ✅ "Create a submit button" (natural language)
- ✅ "Show me all components" (natural language)
- ❌ "/create-button" (slash command - different system)

### Windows Permission Errors

Run PowerShell as Administrator:
1. Right-click PowerShell
2. Select "Run as Administrator"
3. Run installation script again

### Different Behavior in CLI vs Desktop

Both should work identically. Verify skills are in the correct location:
- macOS/Linux: `~/.claude/skills/`
- Windows: `%USERPROFILE%\.claude\skills`

## Advanced Usage

### Project-Local Skills

Keep skills only in specific project:
```bash
# Don't run install-skills.sh
# Skills already exist in .claude/skills/
# Work from this directory only
cd /path/to/fluxwing-marketplace
```

### Selective Installation

Install only specific skills:
```bash
# macOS/Linux
mkdir -p ~/.claude/skills/
cp -r .claude/skills/uxscii-component-creator ~/.claude/skills/

# Windows (PowerShell)
New-Item -ItemType Directory -Path "$env:USERPROFILE\.claude\skills" -Force
Copy-Item -Path ".claude\skills\uxscii-component-creator" -Destination "$env:USERPROFILE\.claude\skills\" -Recurse
```

## Package Distribution

To distribute this package:

1. **Include these files:**
   - Installation scripts (`*.sh`, `*.ps1`)
   - Skills directory (`.claude/skills/`)
   - Documentation (`*.md`)

2. **Users run:**
   - macOS/Linux: `./install-skills.sh`
   - Windows: `.\install-skills.ps1`

3. **Skills automatically available in:**
   - Claude Code CLI
   - Claude Desktop App

## Support

### Getting Help

1. Read the installation guides
2. Check troubleshooting sections
3. Verify installation with test phrases
4. Check skills directory exists

### Reporting Issues

Include:
- Platform (Windows/macOS/Linux)
- Claude version (Code CLI or Desktop App)
- Installation method used
- Skills directory listing
- Trigger phrase that didn't work

## License

See repository for license information.

## Contributing

See repository for contribution guidelines.

---

**Ready to get started?** Run the installation script for your platform and start creating with Claude! 🚀
