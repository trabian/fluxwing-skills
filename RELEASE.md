# Fluxwing Skills Release Guide

This guide explains how to create releases for Fluxwing Skills using the automated release system.

## Table of Contents

- [Quick Start](#quick-start)
- [Release Scripts](#release-scripts)
- [Step-by-Step Release Process](#step-by-step-release-process)
- [GitHub Actions](#github-actions)
- [Troubleshooting](#troubleshooting)
- [Rollback Procedures](#rollback-procedures)

---

## Quick Start

### Standard Release

```bash
# Patch release (0.0.2 → 0.0.3)
./scripts/release.sh patch

# Minor release (0.0.2 → 0.1.0)
./scripts/release.sh minor

# Major release (0.1.0 → 1.0.0)
./scripts/release.sh major

# Specific version
./scripts/release.sh 0.0.3
```

### Preview Before Releasing

```bash
# Dry run to see what would happen
./scripts/release.sh patch --dry-run
```

That's it! The script handles everything:
- ✅ Version updates across all files
- ✅ Release branch creation
- ✅ Git commit and tag
- ✅ Distribution package creation
- ✅ Push to remote
- ✅ GitHub Actions creates the release automatically

---

## Release Scripts

### 1. bump-version.sh

Updates version numbers across all package files.

**Files Updated:**
- `package.json`
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

**Usage:**
```bash
# Increment versions
./scripts/bump-version.sh patch   # 0.0.2 → 0.0.3
./scripts/bump-version.sh minor   # 0.0.2 → 0.1.0
./scripts/bump-version.sh major   # 0.0.2 → 1.0.0

# Set specific version
./scripts/bump-version.sh 0.0.3

# Preview changes
./scripts/bump-version.sh 0.0.3 --dry-run

# Update files without creating commit
./scripts/bump-version.sh 0.0.3 --no-commit
```

**Features:**
- Validates semantic versioning format
- Checks for version drift across files
- Creates git commit automatically
- Dry-run mode for safety

### 2. package.sh

Creates distribution zip files for GitHub releases.

**Usage:**
```bash
# Create packages
./scripts/package.sh

# Clean dist directory first
./scripts/package.sh --clean

# Preview without creating files
./scripts/package.sh --dry-run

# Custom output directory
./scripts/package.sh --output-dir ./releases
```

**Output:**
```
dist/
├── fluxwing-skills-v0.0.3.zip         # Plugin package
└── fluxwing-skills-v0.0.3.zip.sha256  # Checksum
```

**Package Contents:**
- `skills/` - All 7 Fluxwing skills
- `.claude-plugin/` - Plugin metadata
- `README.md` - Project overview
- `LICENSE` - MIT license
- `INSTALL.md` - Installation guide

### 3. release.sh

End-to-end release workflow automation.

**Usage:**
```bash
# Full release workflow
./scripts/release.sh 0.0.3

# Using version keywords
./scripts/release.sh patch
./scripts/release.sh minor
./scripts/release.sh major

# Preview without making changes
./scripts/release.sh 0.0.3 --dry-run

# Create release but don't push
./scripts/release.sh 0.0.3 --no-push

# Skip package creation (faster testing)
./scripts/release.sh 0.0.3 --skip-package

# Use different base branch
./scripts/release.sh 0.0.3 --base-branch develop
```

**Workflow Steps:**
1. ✅ Verify working directory is clean
2. ✅ Fetch latest changes from remote
3. ✅ Create release branch (`release/vX.Y.Z`)
4. ✅ Update versions in all files
5. ✅ Create git commit
6. ✅ Create annotated git tag (`vX.Y.Z`)
7. ✅ Create distribution packages
8. ✅ Push branch and tag to remote
9. ✅ Display next steps

---

## Step-by-Step Release Process

### Option 1: Automated Release (Recommended)

**Single Command:**
```bash
./scripts/release.sh patch
```

**What Happens:**
1. Script checks git status is clean
2. Creates release branch (`release/v0.0.3`)
3. Updates all version files
4. Creates git commit ("Bump version to 0.0.3")
5. Creates git tag (`v0.0.3`)
6. Creates distribution packages
7. Pushes branch and tag to GitHub
8. GitHub Actions detects tag and creates release
9. GitHub Actions uploads distribution packages

**Time:** ~30 seconds + GitHub Actions time (~1-2 minutes)

### Option 2: Manual Steps (If Needed)

**1. Update Version**
```bash
./scripts/bump-version.sh 0.0.3
```

**2. Create Release Branch**
```bash
git checkout -b release/v0.0.3
git push -u origin release/v0.0.3
```

**3. Create Tag**
```bash
git tag -a v0.0.3 -m "Release version 0.0.3"
git push origin v0.0.3
```

**4. Create Packages**
```bash
./scripts/package.sh --clean
```

**5. Create GitHub Release**
- Go to GitHub > Releases > New Release
- Select tag `v0.0.3`
- Upload packages from `dist/`
- Publish release

**Time:** ~5-10 minutes

---

## GitHub Actions

### Automatic Release Creation

The `.github/workflows/release.yml` workflow runs automatically when:
- A tag matching `v*.*.*` is pushed (e.g., `v0.0.3`)
- Manually triggered via workflow dispatch

### What It Does

1. **Validates tag format** - Ensures `vX.Y.Z` format
2. **Verifies version consistency** - Checks all files match tag version
3. **Creates packages** - Runs `package.sh` script
4. **Verifies package contents** - Ensures all required files present
5. **Generates release notes** - From git commits since last tag
6. **Creates GitHub release** - With packages attached
7. **Uploads artifacts** - Keeps packages for 90 days

### Manual Workflow Trigger

If needed, you can manually trigger the workflow:

```bash
# Using GitHub CLI
gh workflow run release.yml -f tag=v0.0.3

# Or via GitHub UI
# Actions > Release > Run workflow > Enter tag
```

### Monitoring

View workflow runs:
```bash
gh run list --workflow=release.yml
```

View logs:
```bash
gh run view <run-id> --log
```

---

## Troubleshooting

### "Working directory has uncommitted changes"

**Problem:** Git working directory is not clean

**Solution:**
```bash
# Option 1: Commit changes
git add .
git commit -m "Your commit message"

# Option 2: Stash changes
git stash

# Then retry release
./scripts/release.sh patch
```

### "Branch already exists: release/v0.0.3"

**Problem:** Release branch from previous attempt exists

**Solution:**
```bash
# Delete local branch
git branch -D release/v0.0.3

# Delete remote branch (if pushed)
git push origin --delete release/v0.0.3

# Then retry release
./scripts/release.sh 0.0.3
```

### "Tag already exists: v0.0.3"

**Problem:** Git tag from previous attempt exists

**Solution:**
```bash
# Delete local tag
git tag -d v0.0.3

# Delete remote tag (if pushed)
git push origin --delete v0.0.3

# Then retry release
./scripts/release.sh 0.0.3
```

### "Version mismatch detected"

**Problem:** Version files are out of sync

**Solution:**
```bash
# Fix all versions at once
./scripts/bump-version.sh 0.0.2  # Set to current version

# Then create release
./scripts/release.sh 0.0.3
```

### "jq is required but not installed"

**Problem:** Missing `jq` dependency

**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get install jq

# macOS
brew install jq

# Then retry
./scripts/release.sh patch
```

### GitHub Actions Workflow Fails

**Check workflow logs:**
```bash
gh run list --workflow=release.yml
gh run view <run-id> --log
```

**Common issues:**
1. **Version mismatch** - Tag doesn't match files
   - Fix: Delete tag, update versions, recreate tag
2. **Package creation failed** - Missing files
   - Fix: Ensure all required files exist
3. **Permission denied** - Missing GitHub token permissions
   - Fix: Check repository settings > Actions > Permissions

---

## Rollback Procedures

### Undo Local Release (Before Push)

If you haven't pushed yet:

```bash
# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Switch back to main
git checkout main

# Delete release branch
git branch -D $CURRENT_BRANCH

# Delete tag
git tag -d v0.0.3
```

### Undo Pushed Release (After Push)

If already pushed but **before PR merge**:

```bash
# Delete remote branch
git push origin --delete release/v0.0.3

# Delete remote tag
git push origin --delete v0.0.3

# Delete local branch
git branch -D release/v0.0.3

# Delete local tag
git tag -d v0.0.3

# Delete GitHub release (if created)
gh release delete v0.0.3 --yes
```

### Undo Released Version (After Merge)

If already merged and released:

**Do NOT delete the release!** Instead:

1. **Create a patch release** with fixes:
   ```bash
   ./scripts/release.sh patch  # Creates v0.0.4
   ```

2. **Or create a major release** if breaking changes:
   ```bash
   ./scripts/release.sh major  # Creates v1.0.0
   ```

3. **Mark release as deprecated** (in GitHub):
   - Go to release page
   - Edit release
   - Add "⚠️ DEPRECATED - Use v0.0.4 instead" to description

**Why not delete?**
- Users may have already downloaded the version
- Git tags should be immutable once published
- Semantic versioning expects forward-only progression

---

## Best Practices

### Before Releasing

✅ **Test locally**
```bash
./scripts/install.sh
# Test all skills work correctly
```

✅ **Run dry-run**
```bash
./scripts/release.sh patch --dry-run
```

✅ **Check version numbers**
```bash
jq '.version' package.json .claude-plugin/plugin.json
jq '.plugins[0].version' .claude-plugin/marketplace.json
```

✅ **Review git status**
```bash
git status
git log --oneline -5
```

### During Release

✅ **Use semantic versioning keywords**
```bash
./scripts/release.sh patch  # Bug fixes
./scripts/release.sh minor  # New features
./scripts/release.sh major  # Breaking changes
```

✅ **Monitor GitHub Actions**
- Watch workflow run to completion
- Check for any errors or warnings

### After Release

✅ **Verify release**
- Check GitHub release page
- Download and test package
- Verify checksum

✅ **Test installation**
```bash
# Via plugin system
/plugin marketplace add trabian/fluxwing-skills
/plugin install fluxwing-skills
```

✅ **Update documentation** (if needed)
- Update README.md with new features
- Update CHANGELOG.md

---

## Release Checklist

**Pre-Release:**
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (if maintained)
- [ ] Git working directory clean
- [ ] On correct base branch (main/master)

**Release:**
- [ ] Run `./scripts/release.sh <version>`
- [ ] Verify output looks correct
- [ ] Check branch and tag pushed
- [ ] Monitor GitHub Actions workflow

**Post-Release:**
- [ ] Create and merge PR
- [ ] Verify GitHub release created
- [ ] Test package installation
- [ ] Announce release (if applicable)

---

## Version Strategy

### Semantic Versioning (X.Y.Z)

- **Major (X)**: Breaking changes, major new features
  ```bash
  ./scripts/release.sh major  # 0.1.0 → 1.0.0
  ```

- **Minor (Y)**: New features, backward compatible
  ```bash
  ./scripts/release.sh minor  # 0.0.3 → 0.1.0
  ```

- **Patch (Z)**: Bug fixes, backward compatible
  ```bash
  ./scripts/release.sh patch  # 0.0.2 → 0.0.3
  ```

### Pre-Release Versions

For beta/alpha releases, manually specify version:

```bash
# Alpha release
./scripts/release.sh 0.1.0-alpha.1

# Beta release
./scripts/release.sh 0.1.0-beta.1

# Release candidate
./scripts/release.sh 0.1.0-rc.1
```

**Note:** GitHub Actions will mark these as "pre-release" automatically.

---

## Additional Resources

- [RELEASE_AUTOMATION_PLAN.md](RELEASE_AUTOMATION_PLAN.md) - Detailed automation plan
- [INSTALL.md](INSTALL.md) - Installation guide for users
- [CLAUDE.md](CLAUDE.md) - Project overview for developers
- [GitHub Releases Guide](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [Semantic Versioning](https://semver.org/)

---

## Support

If you encounter issues with the release process:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review script help: `./scripts/release.sh --help`
3. Check GitHub Actions logs: `gh run list --workflow=release.yml`
4. Create an issue on GitHub

---

**Last Updated:** 2025-11-08
**Release System Version:** 1.0.0
