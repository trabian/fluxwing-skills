# Fluxwing Installation Documentation Index

> Complete guide to installing Fluxwing skills for Claude Code CLI and Claude Desktop App

## 📖 Documentation Overview

| Document | Purpose | Audience |
|----------|---------|----------|
| **[QUICK_START.md](QUICK_START.md)** | 30-second installation | Everyone (start here!) |
| **[SKILLS_INSTALLATION.md](SKILLS_INSTALLATION.md)** | Complete installation guide | All users |
| **[CLAUDE_APP_INSTALLATION.md](CLAUDE_APP_INSTALLATION.md)** | Claude Desktop App specific | Desktop App users |
| **[README_SKILLS.md](README_SKILLS.md)** | Package overview | Package maintainers |
| **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** | Legacy plugin guide | Plugin users (deprecated) |

## 🎯 Which Guide Should I Read?

### New Users (Start Here!)
👉 **[QUICK_START.md](QUICK_START.md)** - Get up and running in 30 seconds

### All Users
👉 **[SKILLS_INSTALLATION.md](SKILLS_INSTALLATION.md)** - Complete reference for both CLI and Desktop App

### Claude Desktop App Users
👉 **[CLAUDE_APP_INSTALLATION.md](CLAUDE_APP_INSTALLATION.md)** - Desktop-specific instructions and troubleshooting

### Package Maintainers
👉 **[README_SKILLS.md](README_SKILLS.md)** - Technical details, distribution, architecture

### Legacy Plugin Users
👉 **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** - Old plugin system (no longer recommended)

## 🚀 Quick Reference

### Installation Commands

**macOS / Linux:**
```bash
chmod +x install-skills.sh
./install-skills.sh
```

**Windows (PowerShell):**
```powershell
.\install-skills.ps1
```

### Test Installation

In Claude (CLI or Desktop App):
```
Create a submit button
```

### Uninstallation

**macOS / Linux:**
```bash
./uninstall-skills.sh
```

**Windows:**
```powershell
.\uninstall-skills.ps1
```

## 📦 Installation Package Contents

### Scripts (Automated Installation)

| File | Platform | Description |
|------|----------|-------------|
| `install-skills.sh` | macOS/Linux | Bash installation script |
| `install-skills.ps1` | Windows | PowerShell installation script |
| `uninstall-skills.sh` | macOS/Linux | Bash uninstallation script |
| `uninstall-skills.ps1` | Windows | PowerShell uninstallation script |

### Skills (AI Capabilities)

Located in `.claude/skills/`:

1. **uxscii-component-creator/** - Create UI components with ASCII art
2. **uxscii-component-expander/** - Add interaction states
3. **uxscii-component-viewer/** - View component details
4. **uxscii-library-browser/** - Browse component library
5. **uxscii-screen-scaffolder/** - Build complete screens
6. **uxscii-screenshot-importer/** - Import UI screenshots

### Documentation

| File | Purpose |
|------|---------|
| `QUICK_START.md` | 30-second installation guide |
| `SKILLS_INSTALLATION.md` | Complete installation reference |
| `CLAUDE_APP_INSTALLATION.md` | Claude Desktop App guide |
| `README_SKILLS.md` | Package overview and features |
| `INSTALLATION_INDEX.md` | This file |

## 🔧 Installation Methods

### Method 1: Automated (Recommended)

Use the installation scripts for your platform:

- **Benefits:** Automatic backups, error checking, verification
- **Time:** ~30 seconds
- **Difficulty:** Easy

### Method 2: Manual

Copy files manually to `~/.claude/skills/`:

- **Benefits:** Full control, works when scripts fail
- **Time:** ~2 minutes
- **Difficulty:** Medium

See [SKILLS_INSTALLATION.md#manual-installation](SKILLS_INSTALLATION.md#manual-installation) for instructions.

## 🌍 Platform Support

| Platform | CLI | Desktop App | Installation |
|----------|-----|-------------|--------------|
| **macOS** | ✅ | ✅ | `./install-skills.sh` |
| **Linux** | ✅ | ✅ | `./install-skills.sh` |
| **Windows** | ✅ | ✅ | `.\install-skills.ps1` |

**Note:** Same installation works for both CLI and Desktop App!

## 📍 Installation Locations

| Platform | Directory |
|----------|-----------|
| **macOS/Linux** | `~/.claude/skills/` |
| **Windows** | `%USERPROFILE%\.claude\skills` |

Skills installed here work in:
- ✅ Claude Code CLI (all directories)
- ✅ Claude Desktop App (all projects)

## 🎓 Learning Path

**Step 1:** Quick start
- Read: [QUICK_START.md](QUICK_START.md)
- Run: Installation script
- Test: "Create a submit button"

**Step 2:** Understand skills
- Read: [SKILLS_INSTALLATION.md#how-skills-work](SKILLS_INSTALLATION.md#how-skills-work)
- Try: Different trigger phrases
- Explore: All 6 skills

**Step 3:** Platform-specific
- CLI users: [SKILLS_INSTALLATION.md#verification](SKILLS_INSTALLATION.md#verification)
- Desktop users: [CLAUDE_APP_INSTALLATION.md#verification](CLAUDE_APP_INSTALLATION.md#verification)

**Step 4:** Advanced usage
- Read: [README_SKILLS.md#advanced-usage](README_SKILLS.md#advanced-usage)
- Try: Project-local skills
- Customize: Selective installation

## 🆘 Troubleshooting

### Skills Not Activating

1. **Verify installation:** [SKILLS_INSTALLATION.md#troubleshooting](SKILLS_INSTALLATION.md#troubleshooting)
2. **Check trigger phrases:** [CLAUDE_APP_INSTALLATION.md#troubleshooting](CLAUDE_APP_INSTALLATION.md#troubleshooting)
3. **Platform issues:** See platform-specific guide

### Platform-Specific Issues

- **macOS/Linux:** [SKILLS_INSTALLATION.md#permission-errors](SKILLS_INSTALLATION.md#permission-errors)
- **Windows:** [CLAUDE_APP_INSTALLATION.md#permission-errors-on-windows](CLAUDE_APP_INSTALLATION.md#permission-errors-on-windows)
- **Desktop App:** [CLAUDE_APP_INSTALLATION.md#skills-not-activating-in-claude-desktop-app](CLAUDE_APP_INSTALLATION.md#skills-not-activating-in-claude-desktop-app)

## 📊 Document Comparison

### SKILLS_INSTALLATION.md vs CLAUDE_APP_INSTALLATION.md

| Aspect | SKILLS_INSTALLATION.md | CLAUDE_APP_INSTALLATION.md |
|--------|------------------------|----------------------------|
| **Scope** | Both CLI and Desktop | Desktop App focused |
| **Length** | ~10KB | ~11KB |
| **Platform** | All platforms | Desktop-specific |
| **Best For** | General reference | Desktop App users |

**Recommendation:** Start with SKILLS_INSTALLATION.md, refer to CLAUDE_APP_INSTALLATION.md for Desktop-specific issues.

## 🔄 Migration Guides

### From Plugin System

If you're migrating from the old plugin system:

1. Read: [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) (old system)
2. Understand: Skills vs plugins comparison
3. Install: New skills system with scripts
4. Remove: Old plugin installation (optional)

**Key Differences:**
- **Old:** Slash commands (`/fluxwing-create`)
- **New:** Natural language ("Create a button")
- **Old:** Plugin system, project-local
- **New:** Skills system, global or project-local

## 📦 Distribution

### For End Users

Provide:
1. Installation scripts (`*.sh`, `*.ps1`)
2. Skills directory (`.claude/skills/`)
3. Documentation (start with `QUICK_START.md`)

### For Developers

Additional files:
- `README_SKILLS.md` - Technical overview
- `INSTALLATION_INDEX.md` - This guide
- Full skills source in `.claude/skills/`

## 🤝 Support

### Self-Service

1. Check [QUICK_START.md](QUICK_START.md) for basic setup
2. Read [SKILLS_INSTALLATION.md](SKILLS_INSTALLATION.md) troubleshooting
3. Try [CLAUDE_APP_INSTALLATION.md](CLAUDE_APP_INSTALLATION.md) for Desktop issues
4. Review [README_SKILLS.md](README_SKILLS.md) for advanced topics

### Getting Help

Include in support requests:
- Platform (Windows/macOS/Linux)
- Claude version (CLI or Desktop App)
- Installation method used
- Skills directory listing
- Trigger phrase that didn't work

## 📈 Version History

**Current Version:** Skills-based system (v2.0)
- Natural language activation
- Cross-platform support
- CLI and Desktop App compatibility

**Legacy Version:** Plugin-based system (v1.0)
- Slash command activation
- Plugin marketplace distribution
- See [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)

## 🚀 Quick Links

**Installation:**
- [Quick Start](QUICK_START.md)
- [Complete Guide](SKILLS_INSTALLATION.md)
- [Desktop App Guide](CLAUDE_APP_INSTALLATION.md)

**Reference:**
- [Package Overview](README_SKILLS.md)
- [Legacy Plugins](INSTALLATION_GUIDE.md)

**Troubleshooting:**
- [Skills Troubleshooting](SKILLS_INSTALLATION.md#troubleshooting)
- [Desktop App Issues](CLAUDE_APP_INSTALLATION.md#troubleshooting)
- [Windows Issues](CLAUDE_APP_INSTALLATION.md#permission-errors-on-windows)

---

**Ready to install?** Start with [QUICK_START.md](QUICK_START.md)! 🎉
