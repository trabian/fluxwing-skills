#!/bin/bash

# Fluxwing Skills Installation Script
# For development/testing: Copies skills to Claude Code's skills directory
# For production: Users should use `/plugin install fluxwing-skills`

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
SOURCE_SKILLS_DIR="$PROJECT_ROOT/skills"

# Function to print colored messages
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

# Function to print header
print_header() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║         Fluxwing Skills Development Installer              ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
}

# Function to show plugin installation info
show_plugin_info() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║              Recommended Installation Method               ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    print_info "For regular users, install via Claude Code plugin system:"
    echo ""
    echo "  ${GREEN}/plugin marketplace add trabian/fluxwing-skills${NC}"
    echo "  ${GREEN}/plugin install fluxwing-skills${NC}"
    echo ""
    print_warning "This script is for development and local testing only"
    echo ""
    read -p "Continue with development installation? [y/N] " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Installation cancelled"
        exit 0
    fi
}

# Function to detect installation location
detect_install_location() {
    local mode="$1"

    if [ "$mode" = "global" ]; then
        echo "$HOME/.claude/skills"
    elif [ "$mode" = "local" ]; then
        echo "$PWD/.claude/skills"
    else
        # Auto-detect mode
        if [ -d "$PWD/.claude" ]; then
            echo "$PWD/.claude/skills"
        else
            echo "$HOME/.claude/skills"
        fi
    fi
}

# Function to verify source skills exist
verify_source_skills() {
    if [ ! -d "$SOURCE_SKILLS_DIR" ]; then
        print_error "Source skills directory not found: $SOURCE_SKILLS_DIR"
        exit 1
    fi

    local skill_count=$(find "$SOURCE_SKILLS_DIR" -maxdepth 1 -type d -name "fluxwing-*" | wc -l | tr -d ' ')

    if [ "$skill_count" -eq 0 ]; then
        print_error "No fluxwing-* skills found in source directory"
        exit 1
    fi

    print_success "Found $skill_count skills to install"
    return 0
}

# Function to create target directory
create_target_directory() {
    local target_dir="$1"

    if [ ! -d "$target_dir" ]; then
        print_info "Creating skills directory: $target_dir"
        mkdir -p "$target_dir"
    fi

    if [ ! -d "$target_dir" ]; then
        print_error "Failed to create target directory: $target_dir"
        exit 1
    fi
}

# Function to copy skills
copy_skills() {
    local source_dir="$1"
    local target_dir="$2"

    print_info "Copying skills from $source_dir to $target_dir"
    echo ""

    local copied_count=0
    local existing_count=$(find "$target_dir" -maxdepth 1 -type d -name "fluxwing-*" 2>/dev/null | wc -l | tr -d ' ')

    # Remove existing fluxwing skills
    if [ "$existing_count" -gt 0 ]; then
        print_info "Removing $existing_count existing Fluxwing skills..."
        rm -rf "$target_dir"/fluxwing-*
    fi

    for skill_dir in "$source_dir"/fluxwing-*; do
        if [ -d "$skill_dir" ]; then
            local skill_name=$(basename "$skill_dir")
            local target_skill_dir="$target_dir/$skill_name"

            cp -r "$skill_dir" "$target_skill_dir"

            if [ -f "$target_skill_dir/SKILL.md" ]; then
                print_success "Installed: $skill_name"
                copied_count=$((copied_count + 1))
            else
                print_error "Failed to install: $skill_name (SKILL.md missing)"
            fi
        fi
    done

    echo ""
    print_success "Installed $copied_count skills"
    return 0
}

# Function to run automated verification
verify_installation() {
    local target_dir="$1"

    echo ""
    print_info "Running automated verification..."
    echo ""

    local all_checks_passed=true

    # Check 1: SKILL.md files exist
    local skill_count=$(find "$target_dir" -maxdepth 2 -name "SKILL.md" -path "*/fluxwing-*/SKILL.md" | wc -l | tr -d ' ')
    if [ "$skill_count" -eq 6 ]; then
        print_success "All 6 SKILL.md files found"
    else
        print_error "Expected 6 SKILL.md files, found $skill_count"
        all_checks_passed=false
    fi

    # Check 2: YAML frontmatter validates
    local yaml_errors=0
    for skill_file in "$target_dir"/fluxwing-*/SKILL.md; do
        if [ -f "$skill_file" ]; then
            # Basic YAML check (looking for --- delimiters)
            if head -n 1 "$skill_file" | grep -q "^---$"; then
                local yaml_end=$(grep -n "^---$" "$skill_file" | sed -n '2p' | cut -d: -f1)
                if [ -n "$yaml_end" ]; then
                    continue
                fi
            fi
            yaml_errors=$((yaml_errors + 1))
        fi
    done

    if [ "$yaml_errors" -eq 0 ]; then
        print_success "All YAML frontmatter validated"
    else
        print_error "YAML validation failed for $yaml_errors files"
        all_checks_passed=false
    fi

    # Check 3: Templates exist
    local template_count=$(find "$target_dir/fluxwing-component-creator/templates" -name "*.uxm" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$template_count" -ge 11 ]; then
        print_success "Component templates found ($template_count .uxm files)"
    else
        print_warning "Expected 11+ component templates, found $template_count"
    fi

    # Check 4: Schema exists
    if [ -f "$target_dir/fluxwing-component-creator/schemas/uxm-component.schema.json" ]; then
        print_success "JSON Schema found"
    else
        print_warning "JSON Schema not found"
    fi

    # Check 5: SKILL_ROOT usage
    local skill_root_count=$(grep -r "SKILL_ROOT" "$target_dir"/fluxwing-*/SKILL.md 2>/dev/null | wc -l | tr -d ' ')
    if [ "$skill_root_count" -gt 0 ]; then
        print_success "SKILL_ROOT references found ($skill_root_count)"
    else
        print_warning "No SKILL_ROOT references found"
    fi

    echo ""

    if [ "$all_checks_passed" = true ]; then
        print_success "All automated verification checks passed!"
        return 0
    else
        print_warning "Some verification checks failed (see above)"
        return 1
    fi
}

# Function to display usage examples
show_usage_examples() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                   Usage Examples                           ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Try these natural language prompts in Claude Code:"
    echo ""
    echo "  1. ${GREEN}\"Create a button\"${NC}"
    echo "     → Activates fluxwing-component-creator skill"
    echo ""
    echo "  2. ${GREEN}\"Show me all components\"${NC}"
    echo "     → Activates fluxwing-library-browser skill"
    echo ""
    echo "  3. ${GREEN}\"Add hover state to my button\"${NC}"
    echo "     → Activates fluxwing-component-expander skill"
    echo ""
    echo "  4. ${GREEN}\"Build a login screen\"${NC}"
    echo "     → Activates fluxwing-screen-scaffolder skill"
    echo ""
    echo "  5. ${GREEN}\"Show me the primary-button\"${NC}"
    echo "     → Activates fluxwing-component-viewer skill"
    echo ""
    echo "  6. ${GREEN}\"Import this screenshot\"${NC}"
    echo "     → Activates fluxwing-screenshot-importer skill"
    echo ""
}

# Function to show usage
show_help() {
    cat << EOF
Usage: $0 [OPTIONS]

Development installer for Fluxwing skills.

RECOMMENDED: Use plugin installation instead:
  /plugin marketplace add trabian/fluxwing-skills
  /plugin install fluxwing-skills

This script is for development and local testing only.

OPTIONS:
    --global            Install to ~/.claude/skills (global)
    --local             Install to ./.claude/skills (project-local)
    --help              Show this help message

EXAMPLES:
    # Auto-detect installation location
    $0

    # Install globally
    $0 --global

    # Install to current project
    $0 --local

EOF
}

# Main installation logic
main() {
    local install_mode="auto"

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --global)
                install_mode="global"
                shift
                ;;
            --local)
                install_mode="local"
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

    # Show plugin info and get confirmation
    show_plugin_info

    # Detect installation location
    local target_dir=$(detect_install_location "$install_mode")
    print_info "Installation target: $target_dir"

    # Verify source skills
    verify_source_skills

    # Create target directory
    create_target_directory "$target_dir"

    # Copy skills
    echo ""
    if copy_skills "$SOURCE_SKILLS_DIR" "$target_dir"; then
        # Verify installation
        if verify_installation "$target_dir"; then
            echo ""
            print_success "Fluxwing skills installed successfully!"
            show_usage_examples
            echo ""
            print_info "Location: $target_dir"
            echo ""
        else
            echo ""
            print_warning "Installation completed with warnings"
            echo ""
            print_info "Location: $target_dir"
            echo ""
            exit 1
        fi
    else
        echo ""
        print_error "Installation failed"
        echo ""
        exit 1
    fi
}

# Run main function
main "$@"
