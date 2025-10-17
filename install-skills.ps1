# Fluxwing Skills Installation Script for Windows PowerShell
# Installs all Fluxwing skills to the personal skills directory

$ErrorActionPreference = "Stop"

# Script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SkillsSource = Join-Path $ScriptDir ".claude\skills"
$SkillsDest = Join-Path $env:USERPROFILE ".claude\skills"

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Blue "=================================================="
Write-ColorOutput Blue "  Fluxwing Skills Installation (Windows)"
Write-ColorOutput Blue "=================================================="
Write-Output ""

# Check if source directory exists
if (-not (Test-Path $SkillsSource)) {
    Write-ColorOutput Red "Error: Skills source directory not found at:"
    Write-Output "  $SkillsSource"
    exit 1
}

# Create destination directory if it doesn't exist
if (-not (Test-Path $SkillsDest)) {
    Write-ColorOutput Yellow "Creating personal skills directory..."
    New-Item -ItemType Directory -Path $SkillsDest -Force | Out-Null
    Write-ColorOutput Green "✓ Created: $SkillsDest"
    Write-Output ""
}

# Count skills
$SkillDirs = Get-ChildItem -Path $SkillsSource -Directory
$SkillCount = $SkillDirs.Count

Write-ColorOutput Blue "Found $SkillCount skills to install:"
Write-Output ""

# Install each skill
foreach ($SkillDir in $SkillDirs) {
    $SkillName = $SkillDir.Name
    $SkillPath = $SkillDir.FullName
    $SkillMdPath = Join-Path $SkillPath "SKILL.md"

    # Check if SKILL.md exists
    if (-not (Test-Path $SkillMdPath)) {
        Write-ColorOutput Yellow "⚠ Skipping $SkillName (no SKILL.md found)"
        continue
    }

    $DestSkillDir = Join-Path $SkillsDest $SkillName

    # Backup existing skill if it exists
    if (Test-Path $DestSkillDir) {
        $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $BackupDir = "${DestSkillDir}.backup.${Timestamp}"
        Write-ColorOutput Yellow "⚠ Backing up existing $SkillName to:"
        Write-Output "  $(Split-Path $BackupDir -Leaf)"
        Move-Item -Path $DestSkillDir -Destination $BackupDir
    }

    # Copy skill
    Write-ColorOutput Blue "Installing: $SkillName"
    Copy-Item -Path $SkillPath -Destination $DestSkillDir -Recurse -Force

    # Verify installation
    $DestSkillMd = Join-Path $DestSkillDir "SKILL.md"
    if (Test-Path $DestSkillMd) {
        # Extract skill name from YAML frontmatter
        $Content = Get-Content $DestSkillMd
        $NameLine = $Content | Where-Object { $_ -match "^name:" } | Select-Object -First 1
        if ($NameLine) {
            $SkillDisplayName = $NameLine -replace "^name:\s*", ""
            Write-ColorOutput Green "✓ Installed: $SkillDisplayName"
        } else {
            Write-ColorOutput Green "✓ Installed: $SkillName"
        }
        Write-Output "  Location: $DestSkillDir"
    } else {
        Write-ColorOutput Red "✗ Failed to install $SkillName"
        exit 1
    }
    Write-Output ""
}

Write-ColorOutput Green "=================================================="
Write-ColorOutput Green "  Installation Complete!"
Write-ColorOutput Green "=================================================="
Write-Output ""
Write-ColorOutput Blue "Installed Skills:"
Write-Output ""

# List installed skills with descriptions
$InstalledSkills = Get-ChildItem -Path $SkillsDest -Directory -Filter "uxscii-*"
foreach ($SkillDir in $InstalledSkills) {
    $SkillMdPath = Join-Path $SkillDir.FullName "SKILL.md"
    if (Test-Path $SkillMdPath) {
        $Content = Get-Content $SkillMdPath
        $NameLine = $Content | Where-Object { $_ -match "^name:" } | Select-Object -First 1
        $DescLine = $Content | Where-Object { $_ -match "^description:" } | Select-Object -First 1

        if ($NameLine) {
            $SkillName = $NameLine -replace "^name:\s*", ""
            Write-ColorOutput Green "✓ " -NoNewline
            Write-ColorOutput Blue $SkillName
        }

        if ($DescLine) {
            $SkillDesc = $DescLine -replace "^description:\s*", ""
            Write-Output "  $SkillDesc"
        }
        Write-Output ""
    }
}

Write-ColorOutput Blue "=================================================="
Write-ColorOutput Blue "  Next Steps"
Write-ColorOutput Blue "=================================================="
Write-Output ""
Write-Output "1. Skills are now available globally in Claude Code and Claude Desktop"
Write-Output "2. You can use them from any directory"
Write-Output "3. Try these commands to test:"
Write-Output ""
Write-ColorOutput Yellow "   Test Component Creator:"
Write-Output "   'Create a submit button'"
Write-Output ""
Write-ColorOutput Yellow "   Test Library Browser:"
Write-Output "   'Show me all available components'"
Write-Output ""
Write-ColorOutput Yellow "   Test Component Viewer:"
Write-Output "   'View details about the primary-button component'"
Write-Output ""
Write-ColorOutput Green "To uninstall, run: .\uninstall-skills.ps1"
Write-Output ""
