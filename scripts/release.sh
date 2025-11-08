#!/bin/bash

# Fluxwing Skills Release Script
# End-to-end release workflow automation
# Creates release branch, updates versions, tags, and prepares for GitHub release

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BUMP_VERSION_SCRIPT="$SCRIPT_DIR/bump-version.sh"
PACKAGE_SCRIPT="$SCRIPT_DIR/package.sh"

# Function to print colored messages
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_step() { echo -e "${CYAN}▸${NC} $1"; }

# Function to print header
print_header() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║         Fluxwing Skills Release Workflow                  ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
}

# Function to show usage
show_help() {
    cat << EOF
Usage: $0 [OPTIONS] <version>

Automated release workflow for Fluxwing Skills.

ARGUMENTS:
    version             New version number (e.g., 0.0.3) or keyword

VERSION KEYWORDS:
    patch               Increment patch version (0.0.2 → 0.0.3)
    minor               Increment minor version (0.0.2 → 0.1.0)
    major               Increment major version (0.0.2 → 1.0.0)

OPTIONS:
    --dry-run, -d       Show what would happen without making changes
    --no-push           Don't push branch and tag to remote
    --skip-package      Skip package creation step
    --base-branch NAME  Base branch for release (default: main or master)
    --help, -h          Show this help message

EXAMPLES:
    $0 0.0.3                # Create release for version 0.0.3
    $0 patch                # Increment patch version
    $0 minor --dry-run      # Preview minor version release
    $0 major --no-push      # Create major release locally only

WORKFLOW STEPS:
    1. Verify working directory is clean
    2. Fetch latest changes from remote
    3. Create release branch (release/vX.Y.Z)
    4. Update version in all files
    5. Create git commit
    6. Create annotated git tag (vX.Y.Z)
    7. Create distribution packages
    8. Push branch and tag to remote
    9. Display next steps (PR creation)

EOF
}

# Function to verify dependencies
verify_dependencies() {
    local missing_deps=()

    if [ ! -f "$BUMP_VERSION_SCRIPT" ]; then
        print_error "bump-version.sh not found: $BUMP_VERSION_SCRIPT"
        exit 1
    fi

    if [ ! -f "$PACKAGE_SCRIPT" ]; then
        print_error "package.sh not found: $PACKAGE_SCRIPT"
        exit 1
    fi

    if ! command -v git &> /dev/null; then
        missing_deps+=("git")
    fi

    if ! command -v jq &> /dev/null; then
        missing_deps+=("jq")
    fi

    if ${#missing_deps[@]} -gt 0 ]; then
        print_error "Missing required dependencies:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        exit 1
    fi
}

# Function to check if git working directory is clean
check_git_clean() {
    if ! git diff-index --quiet HEAD --; then
        print_error "Working directory has uncommitted changes"
        print_info "Please commit or stash your changes before creating a release"
        echo ""
        git status --short
        echo ""
        exit 1
    fi
}

# Function to get current branch
get_current_branch() {
    git rev-parse --abbrev-ref HEAD
}

# Function to determine base branch
get_base_branch() {
    local override="$1"

    if [ -n "$override" ]; then
        echo "$override"
        return
    fi

    # Check if main exists
    if git show-ref --verify --quiet refs/heads/main; then
        echo "main"
    # Check if master exists
    elif git show-ref --verify --quiet refs/heads/master; then
        echo "master"
    else
        print_error "Could not determine base branch (neither 'main' nor 'master' found)"
        exit 1
    fi
}

# Function to fetch latest changes
fetch_latest() {
    local base_branch="$1"
    local dry_run="$2"

    print_step "Fetching latest changes from origin"

    if [ "$dry_run" = true ]; then
        print_info "Would run: git fetch origin $base_branch"
        return
    fi

    if git fetch origin "$base_branch"; then
        print_success "Fetched latest changes"
    else
        print_warning "Could not fetch from remote (continuing anyway)"
    fi
}

# Function to create release branch
create_release_branch() {
    local version="$1"
    local base_branch="$2"
    local dry_run="$3"

    local branch_name="release/v${version}"
    print_step "Creating release branch: $branch_name"

    if [ "$dry_run" = true ]; then
        print_info "Would create branch: $branch_name from $base_branch"
        echo "$branch_name"
        return
    fi

    # Check if branch already exists
    if git show-ref --verify --quiet "refs/heads/$branch_name"; then
        print_error "Branch already exists: $branch_name"
        print_info "Delete it first with: git branch -D $branch_name"
        exit 1
    fi

    # Create and checkout new branch
    if git checkout -b "$branch_name" "$base_branch"; then
        print_success "Created and switched to branch: $branch_name"
        echo "$branch_name"
    else
        print_error "Failed to create release branch"
        exit 1
    fi
}

# Function to update version
update_version() {
    local version_arg="$1"
    local dry_run="$2"

    print_step "Updating version files"

    local cmd="$BUMP_VERSION_SCRIPT"
    if [ "$dry_run" = true ]; then
        cmd="$cmd --dry-run"
    fi
    cmd="$cmd $version_arg"

    if $cmd; then
        print_success "Version updated"
    else
        print_error "Version update failed"
        exit 1
    fi
}

# Function to create git tag
create_git_tag() {
    local version="$1"
    local dry_run="$2"

    local tag_name="v${version}"
    print_step "Creating annotated git tag: $tag_name"

    if [ "$dry_run" = true ]; then
        print_info "Would create tag: $tag_name"
        return
    fi

    # Check if tag already exists
    if git show-ref --verify --quiet "refs/tags/$tag_name"; then
        print_error "Tag already exists: $tag_name"
        print_info "Delete it first with: git tag -d $tag_name"
        exit 1
    fi

    # Create annotated tag
    if git tag -a "$tag_name" -m "Release version $version"; then
        print_success "Created tag: $tag_name"
    else
        print_error "Failed to create tag"
        exit 1
    fi
}

# Function to create packages
create_packages() {
    local dry_run="$1"
    local skip="$2"

    if [ "$skip" = true ]; then
        print_info "Skipping package creation (--skip-package flag)"
        return
    fi

    print_step "Creating distribution packages"

    local cmd="$PACKAGE_SCRIPT --clean"
    if [ "$dry_run" = true ]; then
        cmd="$cmd --dry-run"
    fi

    if $cmd; then
        print_success "Packages created"
    else
        print_error "Package creation failed"
        exit 1
    fi
}

# Function to push to remote
push_to_remote() {
    local branch_name="$1"
    local version="$2"
    local dry_run="$3"
    local no_push="$4"

    if [ "$no_push" = true ]; then
        print_info "Skipping push to remote (--no-push flag)"
        return
    fi

    print_step "Pushing to remote"

    local tag_name="v${version}"

    if [ "$dry_run" = true ]; then
        print_info "Would run: git push -u origin $branch_name"
        print_info "Would run: git push origin $tag_name"
        return
    fi

    # Push branch
    if git push -u origin "$branch_name"; then
        print_success "Pushed branch: $branch_name"
    else
        print_error "Failed to push branch"
        exit 1
    fi

    # Push tag
    if git push origin "$tag_name"; then
        print_success "Pushed tag: $tag_name"
    else
        print_error "Failed to push tag"
        exit 1
    fi
}

# Function to generate changelog preview
generate_changelog_preview() {
    local base_branch="$1"

    print_info "Recent commits (for changelog):"
    echo ""
    git log "$base_branch"..HEAD --oneline --max-count=10 2>/dev/null || true
    echo ""
}

# Function to display next steps
show_next_steps() {
    local branch_name="$1"
    local version="$2"
    local no_push="$3"
    local repo_url=$(git config --get remote.origin.url | sed 's/\.git$//')

    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                     Next Steps                             ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""

    if [ "$no_push" = true ]; then
        print_info "Local release created successfully!"
        echo ""
        print_info "To push to remote:"
        echo "  git push -u origin $branch_name"
        echo "  git push origin v${version}"
        echo ""
    else
        print_info "Release branch and tag pushed to remote"
        echo ""
    fi

    print_info "1. Create Pull Request:"
    if [[ "$repo_url" =~ github.com ]]; then
        local pr_url="${repo_url}/compare/${branch_name}?expand=1"
        echo "     $pr_url"
        echo ""
        print_info "   Or use GitHub CLI:"
        echo "     gh pr create --title \"Release v${version}\" --body \"Release version ${version}\""
    else
        echo "     Create PR from: $branch_name"
    fi
    echo ""

    print_info "2. Review and merge the PR"
    echo ""

    print_info "3. GitHub Actions will automatically:"
    echo "   - Create a GitHub release"
    echo "   - Upload distribution packages"
    echo "   - Generate release notes"
    echo ""

    print_info "4. After merge, verify the release:"
    if [[ "$repo_url" =~ github.com ]]; then
        echo "     ${repo_url}/releases/tag/v${version}"
    fi
    echo ""

    if [ -d "$PROJECT_ROOT/dist" ]; then
        print_info "Distribution packages available in: ./dist/"
        echo ""
    fi
}

# Function to confirm action
confirm_action() {
    local message="$1"
    local dry_run="$2"

    if [ "$dry_run" = true ]; then
        return 0
    fi

    echo ""
    read -p "$(echo -e ${YELLOW}?${NC}) $message (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Release cancelled"
        exit 0
    fi
}

# Main function
main() {
    local version_arg=""
    local dry_run=false
    local no_push=false
    local skip_package=false
    local base_branch_override=""

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run|-d)
                dry_run=true
                shift
                ;;
            --no-push)
                no_push=true
                shift
                ;;
            --skip-package)
                skip_package=true
                shift
                ;;
            --base-branch)
                base_branch_override="$2"
                shift 2
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            -*)
                print_error "Unknown option: $1"
                echo ""
                show_help
                exit 1
                ;;
            *)
                version_arg="$1"
                shift
                ;;
        esac
    done

    # Validate arguments
    if [ -z "$version_arg" ]; then
        print_error "Version argument required"
        echo ""
        show_help
        exit 1
    fi

    print_header

    # Verify dependencies
    verify_dependencies

    # Store current branch
    local original_branch=$(get_current_branch)

    # Determine base branch
    local base_branch=$(get_base_branch "$base_branch_override")
    print_info "Base branch: $base_branch"

    # Check git status
    if [ "$dry_run" = false ]; then
        check_git_clean
    fi

    # Fetch latest changes
    fetch_latest "$base_branch" "$dry_run"

    # Calculate new version (by running bump-version in dry-run to see result)
    local version_output=$("$BUMP_VERSION_SCRIPT" --dry-run "$version_arg" 2>&1 || true)
    local new_version=$(echo "$version_output" | grep "New version:" | awk '{print $3}')

    if [ -z "$new_version" ]; then
        print_error "Could not determine new version"
        exit 1
    fi

    print_info "Release version: $new_version"
    echo ""

    # Confirm release
    if [ "$dry_run" = false ]; then
        confirm_action "Create release v${new_version}?" false
    fi

    echo ""
    print_info "Starting release workflow..."
    echo ""

    # Create release branch
    local branch_name=$(create_release_branch "$new_version" "$base_branch" "$dry_run")

    # Update version
    update_version "$version_arg" "$dry_run"

    # Create git tag
    create_git_tag "$new_version" "$dry_run"

    # Create packages
    create_packages "$dry_run" "$skip_package"

    # Generate changelog preview
    if [ "$dry_run" = false ]; then
        generate_changelog_preview "$base_branch"
    fi

    # Push to remote
    push_to_remote "$branch_name" "$new_version" "$dry_run" "$no_push"

    echo ""
    if [ "$dry_run" = true ]; then
        print_success "Dry run completed successfully!"
        echo ""
        print_info "Run without --dry-run to execute the release"
    else
        print_success "Release v${new_version} created successfully!"
        show_next_steps "$branch_name" "$new_version" "$no_push"
    fi
    echo ""
}

# Run main function
main "$@"
