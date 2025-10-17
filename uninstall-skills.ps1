# Fluxwing Skills Uninstallation Script for Windows PowerShell
# Removes all Fluxwing skills from the personal skills directory

$ErrorActionPreference = "Stop"

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
Write-ColorOutput Blue "  Fluxwing Skills Uninstallation (Windows)"
Write-ColorOutput Blue "=================================================="
Write-Output ""

# Check if skills directory exists
if (-not (Test-Path $SkillsDest)) {
    Write-ColorOutput Yellow "Personal skills directory not found:"
    Write-Output "  $SkillsDest"
    Write-ColorOutput Green "Nothing to uninstall."
    exit 0
}

# Find Fluxwing skills
$FluxwingSkills = Get-ChildItem -Path $SkillsDest -Directory -Filter "uxscii-*"

if ($FluxwingSkills.Count -eq 0) {
    Write-ColorOutput Yellow "No Fluxwing skills found in:"
    Write-Output "  $SkillsDest"
    Write-ColorOutput Green "Nothing to uninstall."
    exit 0
}

# Count skills
$SkillCount = $FluxwingSkills.Count

Write-ColorOutput Blue "Found $SkillCount Fluxwing skill(s) to uninstall:"
Write-Output ""

# List skills that will be removed
foreach ($SkillDir in $FluxwingSkills) {
    $SkillName = $SkillDir.Name
    $SkillMdPath = Join-Path $SkillDir.FullName "SKILL.md"

    if (Test-Path $SkillMdPath) {
        $Content = Get-Content $SkillMdPath
        $NameLine = $Content | Where-Object { $_ -match "^name:" } | Select-Object -First 1
        if ($NameLine) {
            $SkillDisplayName = $NameLine -replace "^name:\s*", ""
            Write-ColorOutput Yellow "  • $SkillDisplayName"
        } else {
            Write-ColorOutput Yellow "  • $SkillName"
        }
    } else {
        Write-ColorOutput Yellow "  • $SkillName"
    }
    Write-Output "    Location: $($SkillDir.FullName)"
}

Write-Output ""
Write-ColorOutput Yellow "This will permanently remove these skills from your system."
$Response = Read-Host "Continue? (y/N)"

if ($Response -notmatch "^[yY](es)?$") {
    Write-ColorOutput Blue "Uninstallation cancelled."
    exit 0
}

Write-Output ""
Write-ColorOutput Blue "Uninstalling skills..."
Write-Output ""

# Remove each skill
foreach ($SkillDir in $FluxwingSkills) {
    $SkillName = $SkillDir.Name
    $SkillPath = $SkillDir.FullName
    $SkillMdPath = Join-Path $SkillPath "SKILL.md"

    $SkillDisplayName = $SkillName
    if (Test-Path $SkillMdPath) {
        $Content = Get-Content $SkillMdPath
        $NameLine = $Content | Where-Object { $_ -match "^name:" } | Select-Object -First 1
        if ($NameLine) {
            $SkillDisplayName = $NameLine -replace "^name:\s*", ""
        }
    }

    Write-ColorOutput Blue "Removing: $SkillDisplayName"

    # Create backup before removal
    $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $BackupDir = "${SkillPath}.uninstall-backup.${Timestamp}"
    Move-Item -Path $SkillPath -Destination $BackupDir

    Write-ColorOutput Green "✓ Removed"
    Write-ColorOutput Yellow "  Backup saved to: $(Split-Path $BackupDir -Leaf)"
    Write-Output ""
}

Write-ColorOutput Green "=================================================="
Write-ColorOutput Green "  Uninstallation Complete!"
Write-ColorOutput Green "=================================================="
Write-Output ""
Write-ColorOutput Blue "All Fluxwing skills have been removed."
Write-Output ""
Write-ColorOutput Yellow "Backups are saved in:"
Write-Output "  $SkillsDest"
Write-Output ""
Write-Output "You can restore from backup by renaming the backup directories,"
Write-Output "or permanently delete them to free up space."
Write-Output ""
Write-ColorOutput Green "To reinstall, run: .\install-skills.ps1"
Write-Output ""
