#!/bin/bash

# Fluxwing Skills Package Script
# Creates distribution zip files for GitHub releases
# Generates checksums for verification

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
DIST_DIR="$PROJECT_ROOT/dist"
PACKAGE_JSON="$PROJECT_ROOT/package.json"

# Function to print colored messages
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

# Function to print header
print_header() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║         Fluxwing Package Creation Script                  ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
}

# Function to show usage
show_help() {
    cat << EOF
Usage: $0 [OPTIONS]

Create distribution packages for Fluxwing Skills.

OPTIONS:
    --output-dir DIR    Custom output directory (default: ./dist)
    --version VERSION   Override version from package.json
    --clean             Remove output directory before creating packages
    --dry-run, -d       Show what would be created without creating files
    --help, -h          Show this help message

EXAMPLES:
    $0                          # Create packages in ./dist
    $0 --clean                  # Clean dist directory first
    $0 --output-dir ./releases  # Use custom output directory
    $0 --dry-run                # Preview without creating files

PACKAGES CREATED:
    - fluxwing-skills-vX.Y.Z.zip         # Full plugin package
    - fluxwing-skills-vX.Y.Z.zip.sha256  # SHA256 checksum

EOF
}

# Function to get version from package.json
get_version() {
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

# Function to verify required files/directories exist
verify_structure() {
    local missing_items=()

    if [ ! -d "$PROJECT_ROOT/skills" ]; then
        missing_items+=("skills/")
    fi

    if [ ! -d "$PROJECT_ROOT/.claude-plugin" ]; then
        missing_items+=(".claude-plugin/")
    fi

    if [ ! -f "$PROJECT_ROOT/README.md" ]; then
        missing_items+=("README.md")
    fi

    if [ ! -f "$PROJECT_ROOT/LICENSE" ]; then
        missing_items+=("LICENSE")
    fi

    if [ ${#missing_items[@]} -gt 0 ]; then
        print_error "Missing required files/directories:"
        for item in "${missing_items[@]}"; do
            echo "  - $item"
        done
        exit 1
    fi
}

# Function to count skills
count_skills() {
    local skill_count=$(find "$PROJECT_ROOT/skills" -maxdepth 1 -type d -name "fluxwing-*" | wc -l | tr -d ' ')
    echo "$skill_count"
}

# Function to create distribution directory
create_dist_directory() {
    local output_dir="$1"
    local clean="$2"
    local dry_run="$3"

    if [ "$clean" = true ] && [ -d "$output_dir" ]; then
        print_info "Cleaning output directory: $output_dir"
        if [ "$dry_run" = false ]; then
            rm -rf "$output_dir"
        fi
    fi

    if [ ! -d "$output_dir" ] && [ "$dry_run" = false ]; then
        mkdir -p "$output_dir"
        print_success "Created output directory: $output_dir"
    fi
}

# Function to create package zip
create_package() {
    local version="$1"
    local output_dir="$2"
    local dry_run="$3"

    local package_name="fluxwing-skills-v${version}.zip"
    local package_path="$output_dir/$package_name"

    print_info "Creating package: $package_name"

    if [ "$dry_run" = true ]; then
        print_info "Would include:"
        echo "  - skills/ ($(count_skills) skills)"
        echo "  - .claude-plugin/"
        echo "  - README.md"
        echo "  - LICENSE"
        echo "  - INSTALL.md"
        return 0
    fi

    # Create temporary directory for package contents
    local temp_dir=$(mktemp -d)
    local package_root="$temp_dir/fluxwing-skills"
    mkdir -p "$package_root"

    # Copy files to temp directory
    cp -r "$PROJECT_ROOT/skills" "$package_root/"
    cp -r "$PROJECT_ROOT/.claude-plugin" "$package_root/"
    cp "$PROJECT_ROOT/README.md" "$package_root/"
    cp "$PROJECT_ROOT/LICENSE" "$package_root/"

    if [ -f "$PROJECT_ROOT/INSTALL.md" ]; then
        cp "$PROJECT_ROOT/INSTALL.md" "$package_root/"
    fi

    # Create zip file
    (cd "$temp_dir" && zip -r "$package_path" "fluxwing-skills" -q)

    # Clean up temp directory
    rm -rf "$temp_dir"

    if [ -f "$package_path" ]; then
        local size=$(du -h "$package_path" | cut -f1)
        print_success "Created package: $package_name ($size)"
        return 0
    else
        print_error "Failed to create package: $package_name"
        return 1
    fi
}

# Function to generate checksum
generate_checksum() {
    local package_path="$1"
    local dry_run="$2"

    local package_name=$(basename "$package_path")
    local checksum_path="${package_path}.sha256"

    print_info "Generating SHA256 checksum"

    if [ "$dry_run" = true ]; then
        print_info "Would create: ${package_name}.sha256"
        return 0
    fi

    if [ ! -f "$package_path" ]; then
        print_error "Package not found: $package_path"
        return 1
    fi

    # Generate checksum (compatible with both macOS and Linux)
    if command -v sha256sum &> /dev/null; then
        (cd "$(dirname "$package_path")" && sha256sum "$(basename "$package_path")" > "$checksum_path")
    elif command -v shasum &> /dev/null; then
        (cd "$(dirname "$package_path")" && shasum -a 256 "$(basename "$package_path")" > "$checksum_path")
    else
        print_warning "No SHA256 tool found (sha256sum or shasum)"
        return 1
    fi

    if [ -f "$checksum_path" ]; then
        print_success "Created checksum: ${package_name}.sha256"
        return 0
    else
        print_error "Failed to create checksum"
        return 1
    fi
}

# Function to verify package contents
verify_package() {
    local package_path="$1"

    print_info "Verifying package contents"

    if ! command -v unzip &> /dev/null; then
        print_warning "unzip not found, skipping verification"
        return 0
    fi

    # List contents without extracting
    local contents=$(unzip -l "$package_path" 2>/dev/null)

    local checks_passed=true

    # Check for required directories/files
    if echo "$contents" | grep -q "fluxwing-skills/skills/"; then
        print_success "Contains skills/"
    else
        print_error "Missing skills/"
        checks_passed=false
    fi

    if echo "$contents" | grep -q "fluxwing-skills/.claude-plugin/"; then
        print_success "Contains .claude-plugin/"
    else
        print_error "Missing .claude-plugin/"
        checks_passed=false
    fi

    if echo "$contents" | grep -q "fluxwing-skills/README.md"; then
        print_success "Contains README.md"
    else
        print_error "Missing README.md"
        checks_passed=false
    fi

    if [ "$checks_passed" = true ]; then
        print_success "Package verification passed"
        return 0
    else
        print_error "Package verification failed"
        return 1
    fi
}

# Function to display summary
show_summary() {
    local output_dir="$1"
    local version="$2"

    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                   Package Summary                          ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    print_info "Output directory: $output_dir"
    print_info "Version: $version"
    echo ""
    print_info "Created files:"
    for file in "$output_dir"/*; do
        if [ -f "$file" ]; then
            local filename=$(basename "$file")
            local size=$(du -h "$file" | cut -f1)
            echo "  - $filename ($size)"
        fi
    done
    echo ""
}

# Main function
main() {
    local output_dir="$DIST_DIR"
    local version_override=""
    local clean=false
    local dry_run=false

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --output-dir)
                output_dir="$2"
                shift 2
                ;;
            --version)
                version_override="$2"
                shift 2
                ;;
            --clean)
                clean=true
                shift
                ;;
            --dry-run|-d)
                dry_run=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                echo ""
                show_help
                exit 1
                ;;
        esac
    done

    print_header

    # Verify project structure
    verify_structure

    # Get version
    local version
    if [ -n "$version_override" ]; then
        version="$version_override"
        print_info "Using version (override): $version"
    else
        version=$(get_version)
        print_info "Using version: $version"
    fi

    # Check skill count
    local skill_count=$(count_skills)
    print_info "Found $skill_count skills"
    echo ""

    if [ "$dry_run" = true ]; then
        print_info "Dry run - no files will be created"
        echo ""
    fi

    # Create output directory
    create_dist_directory "$output_dir" "$clean" "$dry_run"

    # Create package
    if create_package "$version" "$output_dir" "$dry_run"; then
        if [ "$dry_run" = false ]; then
            local package_path="$output_dir/fluxwing-skills-v${version}.zip"

            # Verify package
            verify_package "$package_path"

            # Generate checksum
            generate_checksum "$package_path" "$dry_run"

            # Show summary
            show_summary "$output_dir" "$version"

            print_success "Package creation completed successfully!"
            echo ""
            print_info "Next steps:"
            echo "  1. Test installation: unzip $package_path"
            echo "  2. Upload to GitHub release"
            echo ""
        else
            print_success "Dry run completed"
            echo ""
        fi
    else
        print_error "Package creation failed"
        exit 1
    fi
}

# Run main function
main "$@"
