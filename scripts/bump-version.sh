#!/bin/bash

# Fluxwing Skills Version Bump Script
# Updates version across all package files atomically
# Supports semantic versioning and version keywords (patch, minor, major)

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PACKAGE_JSON="$PROJECT_ROOT/package.json"
PLUGIN_JSON="$PROJECT_ROOT/.claude-plugin/plugin.json"
MARKETPLACE_JSON="$PROJECT_ROOT/.claude-plugin/marketplace.json"

# Function to print colored messages
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

# Function to print header
print_header() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║           Fluxwing Version Bump Script                     ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
}

# Function to show usage
show_help() {
    cat << EOF
Usage: $0 [OPTIONS] <version>

Bump version across all Fluxwing package files atomically.

ARGUMENTS:
    version             New version number (e.g., 0.0.3) or keyword

VERSION KEYWORDS:
    patch               Increment patch version (0.0.2 → 0.0.3)
    minor               Increment minor version (0.0.2 → 0.1.0)
    major               Increment major version (0.0.2 → 1.0.0)

OPTIONS:
    --dry-run, -d       Show what would be changed without making changes
    --no-commit         Update files but don't create git commit
    --help, -h          Show this help message

EXAMPLES:
    $0 0.0.3                    # Set version to 0.0.3
    $0 patch                    # Increment patch version
    $0 minor                    # Increment minor version
    $0 --dry-run 0.1.0          # Preview changes without applying

FILES UPDATED:
    - package.json
    - .claude-plugin/plugin.json
    - .claude-plugin/marketplace.json

EOF
}

# Function to validate semantic version format
validate_semver() {
    local version="$1"
    if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        print_error "Invalid semantic version format: $version"
        print_info "Expected format: X.Y.Z (e.g., 0.0.3, 1.2.0)"
        exit 1
    fi
}

# Function to parse current version from package.json
get_current_version() {
    if ! command -v jq &> /dev/null; then
        print_error "jq is required but not installed"
        print_info "Install with: sudo apt-get install jq (Debian/Ubuntu) or brew install jq (macOS)"
        exit 1
    fi

    local version=$(jq -r '.version' "$PACKAGE_JSON" 2>/dev/null)
    if [ -z "$version" ] || [ "$version" = "null" ]; then
        print_error "Could not read version from package.json"
        exit 1
    fi
    echo "$version"
}

# Function to increment version
increment_version() {
    local version="$1"
    local bump_type="$2"

    IFS='.' read -r major minor patch <<< "$version"

    case "$bump_type" in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
        *)
            print_error "Invalid bump type: $bump_type"
            exit 1
            ;;
    esac

    echo "$major.$minor.$patch"
}

# Function to verify all files exist
verify_files() {
    local missing_files=()

    if [ ! -f "$PACKAGE_JSON" ]; then
        missing_files+=("package.json")
    fi

    if [ ! -f "$PLUGIN_JSON" ]; then
        missing_files+=(".claude-plugin/plugin.json")
    fi

    if [ ! -f "$MARKETPLACE_JSON" ]; then
        missing_files+=(".claude-plugin/marketplace.json")
    fi

    if [ ${#missing_files[@]} -gt 0 ]; then
        print_error "Missing required files:"
        for file in "${missing_files[@]}"; do
            echo "  - $file"
        done
        exit 1
    fi
}

# Function to check for version drift
check_version_drift() {
    local package_version=$(jq -r '.version' "$PACKAGE_JSON")
    local plugin_version=$(jq -r '.version' "$PLUGIN_JSON")
    local marketplace_version=$(jq -r '.plugins[0].version' "$MARKETPLACE_JSON")

    if [[ "$package_version" != "$plugin_version" ]] || \
       [[ "$package_version" != "$marketplace_version" ]]; then
        print_warning "Version drift detected!"
        echo ""
        echo "  package.json:                   $package_version"
        echo "  .claude-plugin/plugin.json:     $plugin_version"
        echo "  .claude-plugin/marketplace.json: $marketplace_version"
        echo ""
        print_info "This script will synchronize all versions"
        echo ""
    fi
}

# Function to update version in file
update_version_in_file() {
    local file="$1"
    local new_version="$2"
    local dry_run="$3"
    local temp_file="${file}.tmp"

    case "$file" in
        *"marketplace.json")
            # Update version in plugins[0].version
            jq --arg version "$new_version" '.plugins[0].version = $version' "$file" > "$temp_file"
            ;;
        *)
            # Update version field directly
            jq --arg version "$new_version" '.version = $version' "$file" > "$temp_file"
            ;;
    esac

    if [ "$dry_run" = true ]; then
        rm -f "$temp_file"
    else
        mv "$temp_file" "$file"
    fi
}

# Function to show diff preview
show_diff_preview() {
    local file="$1"
    local old_version="$2"
    local new_version="$3"

    local relative_path="${file#$PROJECT_ROOT/}"
    echo "  $relative_path:"
    echo "    ${RED}- \"version\": \"$old_version\"${NC}"
    echo "    ${GREEN}+ \"version\": \"$new_version\"${NC}"
}

# Function to create git commit
create_commit() {
    local version="$1"
    local dry_run="$2"

    if [ "$dry_run" = true ]; then
        print_info "Would create commit: \"Bump version to $version\""
        return
    fi

    # Check if there are changes to commit
    if git diff --quiet "$PACKAGE_JSON" "$PLUGIN_JSON" "$MARKETPLACE_JSON"; then
        print_warning "No changes to commit"
        return
    fi

    git add "$PACKAGE_JSON" "$PLUGIN_JSON" "$MARKETPLACE_JSON"
    git commit -m "Bump version to $version"
    print_success "Created git commit"
}

# Main function
main() {
    local new_version=""
    local dry_run=false
    local no_commit=false

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run|-d)
                dry_run=true
                shift
                ;;
            --no-commit)
                no_commit=true
                shift
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
                new_version="$1"
                shift
                ;;
        esac
    done

    # Validate arguments
    if [ -z "$new_version" ]; then
        print_error "Version argument required"
        echo ""
        show_help
        exit 1
    fi

    print_header

    # Verify files exist
    verify_files

    # Get current version
    local current_version=$(get_current_version)
    print_info "Current version: $current_version"

    # Check for version drift
    check_version_drift

    # Process version argument (keyword or explicit version)
    case "$new_version" in
        patch|minor|major)
            new_version=$(increment_version "$current_version" "$new_version")
            print_info "Bumping $1 version"
            ;;
        *)
            validate_semver "$new_version"
            ;;
    esac

    # Check if version is unchanged
    if [ "$current_version" = "$new_version" ]; then
        print_warning "Version unchanged: $new_version"
        exit 0
    fi

    print_info "New version: $new_version"
    echo ""

    # Show what will change
    if [ "$dry_run" = true ]; then
        print_info "Dry run - no changes will be made"
        echo ""
    fi

    print_info "Changes to be made:"
    echo ""
    show_diff_preview "$PACKAGE_JSON" "$current_version" "$new_version"
    show_diff_preview "$PLUGIN_JSON" "$current_version" "$new_version"
    show_diff_preview "$MARKETPLACE_JSON" "$current_version" "$new_version"
    echo ""

    if [ "$dry_run" = true ]; then
        print_success "Dry run completed - no files were modified"
        exit 0
    fi

    # Update files
    print_info "Updating version files..."
    update_version_in_file "$PACKAGE_JSON" "$new_version" false
    print_success "Updated package.json"

    update_version_in_file "$PLUGIN_JSON" "$new_version" false
    print_success "Updated .claude-plugin/plugin.json"

    update_version_in_file "$MARKETPLACE_JSON" "$new_version" false
    print_success "Updated .claude-plugin/marketplace.json"

    echo ""

    # Create git commit (unless --no-commit)
    if [ "$no_commit" = false ]; then
        create_commit "$new_version" false
    else
        print_info "Skipping git commit (--no-commit flag)"
    fi

    echo ""
    print_success "Version bumped successfully: $current_version → $new_version"
    echo ""

    if [ "$no_commit" = false ]; then
        print_info "Next steps:"
        echo "  1. Review the changes: git show"
        echo "  2. Push to remote: git push"
        echo ""
    fi
}

# Run main function
main "$@"
