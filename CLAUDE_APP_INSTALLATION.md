# Fluxwing Skills Installation for Claude Desktop App

## Overview

Fluxwing skills work with both **Claude Code CLI** and the **Claude Desktop App**. They use the same storage location (`~/.claude/skills/`), making installation identical across both platforms.

## Quick Installation

### Automated Installation (Recommended)

```bash
# Clone or download the Fluxwing repository
cd /path/to/fluxwing-marketplace

# Run the installation script
./install-skills.sh
```

This installs all 6 Fluxwing skills to your personal skills directory, making them available in:
- ✅ Claude Code CLI (terminal)
- ✅ Claude Desktop App (GUI application)

### Manual Installation

If you prefer to install manually or the script doesn't work:

```bash
# Create the skills directory if it doesn't exist
mkdir -p ~/.claude/skills/

# Copy all Fluxwing skills
cp -r /path/to/fluxwing-marketplace/.claude/skills/* ~/.claude/skills/

# Verify installation
ls ~/.claude/skills/
```

## Platform Support

| Platform | Support | Notes |
|----------|---------|-------|
| **Claude Desktop (macOS)** | ✅ Full | Uses `~/.claude/skills/` |
| **Claude Desktop (Windows)** | ✅ Full | Uses `%USERPROFILE%\.claude\skills\` |
| **Claude Desktop (Linux)** | ✅ Full | Uses `~/.claude/skills/` |
| **Claude Code CLI** | ✅ Full | Same directory structure |

## Windows Installation

### Using PowerShell

```powershell
# Create skills directory
New-Item -ItemType Directory -Path "$env:USERPROFILE\.claude\skills" -Force

# Copy skills (adjust source path as needed)
Copy-Item -Path "C:\path\to\fluxwing-marketplace\.claude\skills\*" `
          -Destination "$env:USERPROFILE\.claude\skills\" `
          -Recurse -Force

# Verify installation
Get-ChildItem "$env:USERPROFILE\.claude\skills\"
```

### Using Command Prompt

```cmd
# Create skills directory
mkdir "%USERPROFILE%\.claude\skills"

# Copy skills (adjust source path)
xcopy "C:\path\to\fluxwing-marketplace\.claude\skills\*" ^
      "%USERPROFILE%\.claude\skills\" /E /I /Y

# Verify installation
dir "%USERPROFILE%\.claude\skills\"
```

### Using Git Bash (Windows)

```bash
# Same as macOS/Linux installation
mkdir -p ~/.claude/skills/
cp -r /path/to/fluxwing-marketplace/.claude/skills/* ~/.claude/skills/
ls ~/.claude/skills/
```

## Verification

### In Claude Desktop App

1. **Open Claude Desktop App**
2. **Start a new conversation**
3. **Test with trigger phrases:**

```
Create a submit button
```

Expected: Claude activates the "UXscii Component Creator" skill and offers to create a uxscii component

```
Show me all available components
```

Expected: Claude activates the "UXscii Library Browser" skill

### In Claude Code CLI

Same verification works in the terminal:

```bash
# Open Claude Code
claude

# Test trigger phrase
> Create a button
```

## Available Skills

Once installed, these 6 skills are available globally:

### 1. UXscii Component Creator
**Trigger phrases:** "Create a button", "Build an input", "Design a card"

**What it does:** Creates uxscii components with ASCII art and metadata

### 2. UXscii Component Expander
**Trigger phrases:** "Add hover state", "Expand this component", "Add interactions"

**What it does:** Adds interaction states (hover, focus, disabled, active, error)

### 3. UXscii Component Viewer
**Trigger phrases:** "View the button", "Show component details", "Inspect card"

**What it does:** Views detailed component information and previews

### 4. UXscii Library Browser
**Trigger phrases:** "Show all components", "Browse library", "List components"

**What it does:** Browses all available uxscii components and templates

### 5. UXscii Screen Scaffolder
**Trigger phrases:** "Create a login screen", "Build a dashboard", "Scaffold a page"

**What it does:** Builds complete UI screens by composing components

### 6. UXscii Screenshot Importer
**Trigger phrases:** "Import this screenshot", "Convert image to component"

**What it does:** Imports UI screenshots and generates components automatically

## How It Works

### Automatic Discovery

Skills use **natural language matching** - Claude automatically activates them based on:
- Your conversation context
- Keywords in the skill description
- Your natural language request

No need to remember slash commands or special syntax!

### Example Workflows

#### Workflow 1: Create a Simple Component
```
You: Create a primary button for my app

Claude: [Activates UXscii Component Creator skill]
I'll create a primary button component for you!

[Creates component files in ./fluxwing/components/]

✓ Component created successfully!
```

#### Workflow 2: Build a Complete Screen
```
You: I need a login screen with email, password, and submit button

Claude: [Activates UXscii Screen Scaffolder skill]
I'll scaffold a login screen with those components!

[Creates screen layout and any missing components]

✓ Screen created successfully!
```

#### Workflow 3: Browse Available Components
```
You: What components do I have available?

Claude: [Activates UXscii Library Browser skill]
Here are all available components:

[Lists bundled templates + user components]
```

## File Structure After Installation

```
~/.claude/
├── skills/                           # Personal skills directory
│   ├── uxscii-component-creator/     # Skill 1
│   │   ├── SKILL.md                  # Main skill instructions
│   │   ├── templates/                # Component templates
│   │   ├── schemas/                  # JSON schemas
│   │   └── docs/                     # Additional docs
│   ├── uxscii-component-expander/    # Skill 2
│   ├── uxscii-component-viewer/      # Skill 3
│   ├── uxscii-library-browser/       # Skill 4
│   ├── uxscii-screen-scaffolder/     # Skill 5
│   └── uxscii-screenshot-importer/   # Skill 6
└── settings.json                      # Claude settings (optional)
```

## Uninstallation

### Automated Uninstallation

```bash
cd /path/to/fluxwing-marketplace
./uninstall-skills.sh
```

This will:
- Remove all Fluxwing skills
- Create backups before removal
- Prompt for confirmation

### Manual Uninstallation

**macOS/Linux:**
```bash
# Remove all Fluxwing skills
rm -rf ~/.claude/skills/uxscii-*

# Or remove entire skills directory
rm -rf ~/.claude/skills/
```

**Windows PowerShell:**
```powershell
# Remove all Fluxwing skills
Remove-Item "$env:USERPROFILE\.claude\skills\uxscii-*" -Recurse -Force

# Or remove entire skills directory
Remove-Item "$env:USERPROFILE\.claude\skills" -Recurse -Force
```

## Troubleshooting

### Skills Not Activating in Claude Desktop App

**Symptom:** Natural language triggers don't activate skills

**Solutions:**

1. **Verify installation location:**
   ```bash
   # macOS/Linux
   ls ~/.claude/skills/

   # Windows (PowerShell)
   Get-ChildItem "$env:USERPROFILE\.claude\skills\"
   ```

2. **Check skill files exist:**
   Each skill directory should contain `SKILL.md`

3. **Restart Claude Desktop App:**
   - Quit completely (Cmd+Q on Mac, Alt+F4 on Windows)
   - Reopen the app
   - Try trigger phrases again

4. **Use clear trigger phrases:**
   - ✅ "Create a submit button"
   - ✅ "Build a login screen"
   - ❌ "/create-button" (wrong - that's for slash commands)

### Different Behavior in Desktop App vs CLI

**Symptom:** Skills work in one but not the other

**Cause:** Both should use the same directory, but check:

```bash
# Verify both use same location
echo $HOME/.claude/skills/        # macOS/Linux
echo %USERPROFILE%\.claude\skills  # Windows
```

**Solution:** Ensure skills are in the correct personal directory, not a project-local `.claude/skills/`

### Permission Errors on Windows

**Symptom:** Can't copy files to skills directory

**Solution:** Run PowerShell/Command Prompt as Administrator:
1. Right-click PowerShell/Command Prompt
2. Select "Run as Administrator"
3. Run installation commands again

### Skills Directory Not Created

**Symptom:** `~/.claude/skills/` doesn't exist after installation

**Solution:**

```bash
# Manually create the directory
mkdir -p ~/.claude/skills/          # macOS/Linux

# Windows (PowerShell)
New-Item -ItemType Directory -Path "$env:USERPROFILE\.claude\skills" -Force
```

Then run installation again.

## Advanced: Project-Local Skills

If you want skills **only for a specific project** (not globally):

### Setup

```bash
# In your project directory
cd ~/my-project

# Copy skills to project
mkdir -p .claude/skills/
cp -r /path/to/fluxwing-marketplace/.claude/skills/* .claude/skills/

# Commit to git for team sharing
git add .claude/
git commit -m "Add Fluxwing skills"
```

### Behavior

- ✅ Skills work when Claude is in this project directory
- ❌ Skills don't work in other directories
- ✅ Team members get skills automatically (committed to git)

**Use case:** Project-specific workflows that shouldn't be global

## Comparison: Global vs Project-Local

| Aspect | Global (`~/.claude/skills/`) | Project-Local (`.claude/skills/`) |
|--------|------------------------------|-----------------------------------|
| **Availability** | All projects | Only this project |
| **Installation** | One-time | Per project |
| **Team Sharing** | Manual | Automatic (via git) |
| **Claude Desktop** | ✅ Works everywhere | ✅ Works in project |
| **Claude Code CLI** | ✅ Works everywhere | ✅ Works in project |
| **Best For** | Personal workflows | Team standards |

## Integration with Claude Desktop Features

### Works With Extensions

Fluxwing skills are **independent** of Claude Desktop extensions:
- Skills: AI workflows and automations
- Extensions: Desktop app integrations (filesystem, calendar, etc.)

Both can be used together!

### Works With Projects

Claude Desktop's project feature works with skills:
1. Create a project in Claude Desktop
2. Skills are automatically available in that project
3. Skills can create files in the project directory

## Package Distribution

### For End Users

Provide a download package with:

```
fluxwing-skills-v1.0.0/
├── README.md                    # Quick start guide
├── install-skills.sh            # macOS/Linux installer
├── install-skills.ps1           # Windows PowerShell installer (create this)
├── uninstall-skills.sh          # Uninstaller
└── skills/                      # All skill directories
    ├── uxscii-component-creator/
    ├── uxscii-component-expander/
    └── ...
```

### Installation Instructions for Users

**macOS/Linux:**
```bash
cd fluxwing-skills-v1.0.0/
chmod +x install-skills.sh
./install-skills.sh
```

**Windows:**
```powershell
cd fluxwing-skills-v1.0.0
.\install-skills.ps1
```

## Support

### Getting Help

1. **Check verification:** Run test trigger phrases
2. **Check file locations:** Verify skills are in `~/.claude/skills/`
3. **Restart app:** Quit and reopen Claude Desktop
4. **Check logs:** Look for errors in Claude Desktop console

### Reporting Issues

When reporting issues, include:
- Platform (Windows/macOS/Linux)
- Claude version (Desktop App or CLI version)
- Installation method (automated script or manual)
- Skills directory listing: `ls ~/.claude/skills/`
- Example trigger phrase that didn't work

## Next Steps

After installation:

1. **Test skills** - Try the verification commands
2. **Create components** - "Create a submit button"
3. **Browse library** - "Show me all components"
4. **Build screens** - "Create a login screen"
5. **Import designs** - "Import this screenshot"

Enjoy building with Fluxwing in Claude Desktop! 🚀
