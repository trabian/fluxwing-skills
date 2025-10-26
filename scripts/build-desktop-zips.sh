#!/bin/bash

# Build ZIP files for Claude Desktop App
# Creates properly structured ZIP files for each Fluxwing skill

set -e  # Exit on error

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILLS_DIR="$PROJECT_ROOT/skills"
DIST_DIR="$PROJECT_ROOT/dist/claude-desktop"
TEMP_DIR="$PROJECT_ROOT/dist/temp"

# Print functions
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

# Print header
print_header() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║     Claude Desktop ZIP Builder for Fluxwing Skills        ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
}

# Clean and create directories
setup_directories() {
    print_info "Setting up build directories..."

    # Clean dist directory
    rm -rf "$DIST_DIR"
    rm -rf "$TEMP_DIR"

    # Create fresh directories
    mkdir -p "$DIST_DIR"
    mkdir -p "$TEMP_DIR"

    print_success "Directories ready"
}

# Build a single skill ZIP
build_skill_zip() {
    local skill_name="$1"
    local skill_dir="$SKILLS_DIR/$skill_name"

    if [ ! -d "$skill_dir" ]; then
        print_error "Skill directory not found: $skill_name"
        return 1
    fi

    print_info "Building: $skill_name"

    # Create temp skill directory
    local temp_skill_dir="$TEMP_DIR/$skill_name"
    mkdir -p "$temp_skill_dir"

    # Copy SKILL.md and rename to Skill.md
    if [ -f "$skill_dir/SKILL.md" ]; then
        # Read the original SKILL.md
        local skill_content=$(cat "$skill_dir/SKILL.md")

        # Extract frontmatter and adjust description if needed
        # For Claude Desktop, description max is 200 chars
        # We'll keep it as-is and let users know if it needs trimming

        # Copy as Skill.md (capital S, lowercase kill)
        cp "$skill_dir/SKILL.md" "$temp_skill_dir/Skill.md"
        print_success "  ✓ Copied Skill.md"
    else
        print_error "  ✗ SKILL.md not found"
        return 1
    fi

    # Copy supporting directories
    for dir in templates docs schemas scripts; do
        if [ -d "$skill_dir/$dir" ]; then
            cp -r "$skill_dir/$dir" "$temp_skill_dir/"
            print_success "  ✓ Copied $dir/"
        fi
    done

    # Create ZIP file
    local zip_file="$DIST_DIR/${skill_name}.zip"
    cd "$TEMP_DIR"
    zip -r "$zip_file" "$skill_name" > /dev/null 2>&1
    cd "$PROJECT_ROOT"

    # Verify ZIP structure
    local zip_contents=$(unzip -l "$zip_file" | head -10)
    if echo "$zip_contents" | grep -q "$skill_name/Skill.md"; then
        print_success "  ✓ Created ${skill_name}.zip"

        # Show ZIP size
        local zip_size=$(du -h "$zip_file" | cut -f1)
        print_info "    Size: $zip_size"
    else
        print_error "  ✗ ZIP structure invalid"
        return 1
    fi

    # Clean up temp directory for this skill
    rm -rf "$temp_skill_dir"
}

# Build all skills
build_all_skills() {
    echo ""
    print_info "Building ZIP files for all skills..."
    echo ""

    local success_count=0
    local fail_count=0

    # List of skills
    local skills=(
        "fluxwing-component-creator"
        "fluxwing-library-browser"
        "fluxwing-component-expander"
        "fluxwing-screen-scaffolder"
        "fluxwing-component-viewer"
        "fluxwing-screenshot-importer"
    )

    for skill in "${skills[@]}"; do
        if build_skill_zip "$skill"; then
            success_count=$((success_count + 1))
        else
            fail_count=$((fail_count + 1))
        fi
        echo ""
    done

    # Summary
    print_info "Build Summary:"
    print_success "  $success_count skills built successfully"
    if [ "$fail_count" -gt 0 ]; then
        print_error "  $fail_count skills failed"
    fi
}

# Show usage instructions
show_instructions() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                Installation Instructions                   ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "To install these skills in Claude Desktop app:"
    echo ""
    echo "1. Open Claude Desktop (macOS/Windows app)"
    echo "2. Go to ${GREEN}Settings > Capabilities${NC}"
    echo "3. Click ${GREEN}Upload skill${NC}"
    echo "4. Select a ZIP file from: ${BLUE}$DIST_DIR${NC}"
    echo "5. Repeat for each skill you want to install"
    echo ""
    echo "Available ZIP files:"
    for zip_file in "$DIST_DIR"/*.zip; do
        if [ -f "$zip_file" ]; then
            local filename=$(basename "$zip_file")
            local size=$(du -h "$zip_file" | cut -f1)
            echo "  • $filename (${size})"
        fi
    done
    echo ""
    print_warning "Note: Skills require Pro, Max, Team, or Enterprise plan"
    print_warning "Note: Code execution must be enabled"
    echo ""
}

# Main function
main() {
    print_header

    # Setup
    setup_directories

    # Build all skills
    build_all_skills

    # Clean up temp directory
    rm -rf "$TEMP_DIR"

    # Show instructions
    show_instructions

    print_success "Build complete!"
    echo ""
}

# Run main
main "$@"
