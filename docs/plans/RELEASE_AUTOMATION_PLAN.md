# Release Automation Plan

## Current State Analysis

### Version Management
Currently, version numbers are managed in **3 separate files**:
- `package.json` → `version: "0.0.1"`
- `.claude-plugin/plugin.json` → `version: "0.0.2"`
- `.claude-plugin/marketplace.json` → `plugins[0].version: "0.0.2"`

**Problem**: Manual synchronization is error-prone and versions are currently out of sync.

### Current Release Process (Manual)
Based on git history (PR #16, commit 8d34106):
1. Create release branch (e.g., `release/v0.0.2`)
2. Manually update version in 3 files
3. Create PR to main branch
4. Merge PR
5. **Missing**: Git tags, GitHub releases, distribution zip files

### Current Automation
- ✅ `deploy-docs.yml` - GitHub Pages deployment
- ❌ No release automation
- ❌ No git tags
- ❌ No GitHub releases
- ❌ No distribution packages

---

## Proposed Automation Solution

### Phase 1: Version Management Script
**Goal**: Single source of truth for version updates

**Deliverable**: `scripts/bump-version.sh`
- Accept version argument (e.g., `0.0.3` or `patch`/`minor`/`major`)
- Update all 3 version files atomically
- Validate semantic versioning format
- Create git commit with standardized message
- Dry-run mode for safety

**Benefits**:
- Eliminates version drift
- Reduces human error
- Consistent commit messages

### Phase 2: Release Script
**Goal**: Semi-automated local release workflow

**Deliverable**: `scripts/release.sh`
- Interactive mode: prompt for version type
- Validate working directory is clean
- Run `bump-version.sh` to update versions
- Create release branch (`release/v{VERSION}`)
- Create annotated git tag (`v{VERSION}`)
- Generate changelog from commits
- Push branch and tag to remote
- Open browser to create PR (or auto-create with `gh` CLI)

**Benefits**:
- Standardized release workflow
- Reduced manual steps
- Git tag creation
- Changelog generation

### Phase 3: Distribution Packaging
**Goal**: Create distributable assets for GitHub releases

**Deliverable**: `scripts/package.sh`
- Create zip of skills directory (`fluxwing-skills-{VERSION}.zip`)
- Create minimal plugin package (`fluxwing-plugin-{VERSION}.zip`)
- Include README, LICENSE, and installation instructions
- Validate package contents
- Generate checksums (SHA256)

**Package Contents**:
```
fluxwing-skills-v0.0.3.zip
├── skills/                    # All 7 skills
├── .claude-plugin/           # Plugin metadata
├── README.md
├── LICENSE
└── INSTALL.md
```

### Phase 4: GitHub Actions Workflow
**Goal**: Automated release creation on tag push

**Deliverable**: `.github/workflows/release.yml`

**Triggers**:
- Push of tags matching `v*.*.*` pattern
- Manual workflow dispatch (for reruns)

**Steps**:
1. Checkout code
2. Validate tag matches version in files
3. Run `package.sh` to create distribution zips
4. Generate release notes from commits since last tag
5. Create GitHub release (draft mode initially)
6. Upload zip files as release assets
7. Publish release (or require manual approval)

**Benefits**:
- Automatic asset creation
- Consistent release format
- Release notes generation
- Distribution hosting

### Phase 5: PR Automation (Optional)
**Goal**: Auto-create PR after release branch creation

**Options**:
1. **GitHub CLI (`gh`)**: Add to `release.sh` script
2. **GitHub Actions**: Trigger on release branch push
3. **Manual**: Keep current PR creation process

**Recommendation**: Start with option 1 (gh CLI in release.sh)

---

## Implementation Roadmap

### Sprint 1: Foundation (Core Scripts)
**Estimated effort**: 2-3 hours

1. ✅ Create `scripts/bump-version.sh`
   - Version validation
   - Multi-file updates
   - Commit creation
   - Tests with dry-run mode

2. ✅ Create `scripts/package.sh`
   - Zip creation
   - Checksum generation
   - Content validation

3. ✅ Testing and validation
   - Test on feature branch
   - Verify file updates
   - Validate zip contents

### Sprint 2: Release Workflow (End-to-End)
**Estimated effort**: 2-3 hours

1. ✅ Create `scripts/release.sh`
   - Interactive prompts
   - Branch/tag creation
   - Integration with bump-version and package scripts
   - Changelog generation

2. ✅ Documentation
   - Update CLAUDE.md with release process
   - Create RELEASE.md with step-by-step guide
   - Add examples to script help text

3. ✅ Test full release cycle
   - Create test release (v0.0.3-beta)
   - Validate all artifacts
   - Document any issues

### Sprint 3: GitHub Actions (CI/CD)
**Estimated effort**: 2-4 hours

1. ✅ Create `.github/workflows/release.yml`
   - Tag-triggered workflow
   - Asset upload
   - Release creation

2. ✅ Testing
   - Test with pre-release tag
   - Verify asset creation
   - Validate release notes

3. ✅ Production validation
   - Create real release
   - Verify installation via plugin system
   - Update marketplace

### Sprint 4: Polish & Documentation
**Estimated effort**: 1-2 hours

1. ✅ Error handling improvements
2. ✅ User documentation updates
3. ✅ Team training materials
4. ✅ Rollback procedures

---

## Success Criteria

### Must-Have
- ✅ Single command to bump version across all files
- ✅ Single command to create release branch + tag
- ✅ Automated zip creation for distribution
- ✅ GitHub releases created automatically on tag push
- ✅ All scripts have help text and dry-run modes

### Nice-to-Have
- ✅ Automated PR creation
- ✅ Changelog generation from commits
- ✅ Release notes from commit messages
- ✅ Validation that versions match before release
- ✅ Rollback script for failed releases

### Future Enhancements
- 🔮 Automated testing before release
- 🔮 Slack/Discord notifications on release
- 🔮 Automated marketplace submission
- 🔮 Pre-release/beta release workflows
- 🔮 Semantic versioning enforcement from commit messages

---

## Risk Assessment

### Low Risk
- Version bumping script (easily reversible with git)
- Package script (read-only, creates files)

### Medium Risk
- Release script (creates branches/tags, but can be deleted)
- GitHub Actions (runs on tag push, need good testing)

### Mitigation Strategies
1. **Dry-run modes**: All scripts support `--dry-run` flag
2. **Validation checks**: Pre-flight checks before destructive operations
3. **Testing protocol**: Test on feature branch before main
4. **Rollback procedures**: Document how to undo releases
5. **Permissions**: Limit who can trigger releases

---

## Example Release Workflow (Final State)

### Current Manual Process (6 steps)
```bash
# 1. Create branch manually
git checkout -b release/v0.0.3

# 2. Edit 3 files manually
vim package.json .claude-plugin/plugin.json .claude-plugin/marketplace.json

# 3. Commit manually
git add .
git commit -m "Bump version to 0.0.3"

# 4. Push manually
git push -u origin release/v0.0.3

# 5. Create PR manually (via GitHub UI)

# 6. After merge, no tag/release created
```

### Proposed Automated Process (1-2 steps)
```bash
# Single command for entire release
./scripts/release.sh 0.0.3

# What it does:
# ✅ Updates versions in all 3 files
# ✅ Creates release branch
# ✅ Creates git commit
# ✅ Creates git tag
# ✅ Pushes branch and tag
# ✅ Creates distribution zips
# ✅ Opens PR (or creates with gh CLI)
# ✅ GitHub Actions creates release automatically on tag push
```

### Even Simpler (Semantic Versioning)
```bash
# Patch release (0.0.2 → 0.0.3)
./scripts/release.sh patch

# Minor release (0.0.3 → 0.1.0)
./scripts/release.sh minor

# Major release (0.1.0 → 1.0.0)
./scripts/release.sh major
```

---

## File Structure (After Implementation)

```
fluxwing-skills/
├── .github/
│   └── workflows/
│       ├── deploy-docs.yml          # Existing
│       └── release.yml              # NEW - Automated releases
├── scripts/
│   ├── install.sh                   # Existing
│   ├── uninstall.sh                 # Existing
│   ├── bump-version.sh              # NEW - Version management
│   ├── package.sh                   # NEW - Create distribution zips
│   └── release.sh                   # NEW - Full release workflow
├── RELEASE_AUTOMATION_PLAN.md       # NEW - This document
├── RELEASE.md                       # NEW - Release guide
└── TODO.md                          # Updated with automation tasks
```

---

## Next Steps

1. Review this plan with team
2. Approve approach and priorities
3. Begin Sprint 1 implementation
4. Test on feature branch
5. Iterate based on feedback
6. Deploy to production

## Questions for Discussion

1. **Version strategy**: Should we use semantic versioning keywords (patch/minor/major)?
2. **PR automation**: Auto-create PR or keep manual?
3. **Release approval**: Auto-publish releases or keep as drafts?
4. **Changelog**: Auto-generate or maintain manual CHANGELOG.md?
5. **Pre-releases**: Need beta/rc release support?
6. **Notifications**: Slack/Discord notifications desired?

---

## Appendix: Version Sync Validation

To prevent version drift, add pre-release validation:

```bash
# Ensure all versions match before release
PACKAGE_VERSION=$(jq -r '.version' package.json)
PLUGIN_VERSION=$(jq -r '.version' .claude-plugin/plugin.json)
MARKETPLACE_VERSION=$(jq -r '.plugins[0].version' .claude-plugin/marketplace.json)

if [[ "$PACKAGE_VERSION" != "$PLUGIN_VERSION" ]] || \
   [[ "$PACKAGE_VERSION" != "$MARKETPLACE_VERSION" ]]; then
    echo "ERROR: Version mismatch detected!"
    exit 1
fi
```

This validation will be added to `release.sh` and the GitHub Actions workflow.
