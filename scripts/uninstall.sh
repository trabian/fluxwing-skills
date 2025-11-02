#!/bin/bash

# Fluxwing Skills Uninstallation Script
# Removes Fluxwing skills from Claude Code's skills directory
# PRESERVES user data in ./fluxwing/ directory

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

# Function to print header
print_header() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║        Fluxwing Skills Uninstaller for Claude Code        ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
}

# Function to get global skills location
get_skills_location() {
    echo "$HOME/.claude/skills"
}

# Function to list skills in a directory
list_skills() {
    local target_dir="$1"

    if [ ! -d "$target_dir" ]; then
        return 0
    fi

    local skill_count=0
    echo ""
    print_info "Skills found in $target_dir:"
    echo ""

    for skill_dir in "$target_dir"/fluxwing-*; do
        if [ -d "$skill_dir" ]; then
            local skill_name=$(basename "$skill_dir")
            local file_count=$(find "$skill_dir" -type f | wc -l | tr -d ' ')
            echo "  • $skill_name ($file_count files)"
            skill_count=$((skill_count + 1))
        fi
    done

    if [ "$skill_count" -eq 0 ]; then
        echo "  (none found)"
    fi

    echo ""
    return "$skill_count"
}

# Function to confirm removal
confirm_removal() {
    local target_dir="$1"
    local force="$2"

    if [ "$force" = "yes" ]; then
        return 0
    fi

    echo ""
    print_warning "This will permanently remove all fluxwing-* skills from:"
    echo "  $target_dir"
    echo ""
    print_info "User data in ./fluxwing/ will be preserved (NOT removed)"
    echo ""
    read -p "Continue? (y/N): " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Uninstall cancelled"
        return 1
    fi

    return 0
}

# Function to remove skills
remove_skills() {
    local target_dir="$1"
    local dry_run="$2"

    local removed_count=0
    local failed_count=0

    echo ""
    if [ "$dry_run" = "yes" ]; then
        print_info "DRY RUN: Would remove the following skills:"
    else
        print_info "Removing skills from $target_dir"
    fi
    echo ""

    for skill_dir in "$target_dir"/fluxwing-*; do
        if [ -d "$skill_dir" ]; then
            local skill_name=$(basename "$skill_dir")

            if [ "$dry_run" = "yes" ]; then
                print_info "Would remove: $skill_name"
                removed_count=$((removed_count + 1))
            else
                if rm -rf "$skill_dir"; then
                    print_success "Removed: $skill_name"
                    removed_count=$((removed_count + 1))
                else
                    print_error "Failed to remove: $skill_name"
                    failed_count=$((failed_count + 1))
                fi
            fi
        fi
    done

    echo ""

    if [ "$dry_run" = "yes" ]; then
        print_info "DRY RUN summary: $removed_count skills would be removed"
        return 0
    fi

    if [ "$removed_count" -gt 0 ]; then
        print_success "Successfully removed $removed_count skills"
    fi

    if [ "$failed_count" -gt 0 ]; then
        print_error "Failed to remove $failed_count skills"
        return 1
    fi

    return 0
}

# Function to check for user data
check_user_data() {
    if [ -d "$PWD/fluxwing" ]; then
        echo ""
        print_success "User data preserved in ./fluxwing/"
        echo ""
        print_info "Your components, screens, and library remain intact:"

        if [ -d "$PWD/fluxwing/components" ]; then
            local comp_count=$(find "$PWD/fluxwing/components" -name "*.uxm" 2>/dev/null | wc -l | tr -d ' ')
            echo "  • Components: $comp_count"
        fi

        if [ -d "$PWD/fluxwing/screens" ]; then
            local screen_count=$(find "$PWD/fluxwing/screens" -name "*.uxm" 2>/dev/null | wc -l | tr -d ' ')
            echo "  • Screens: $screen_count"
        fi

        if [ -d "$PWD/fluxwing/library" ]; then
            local lib_count=$(find "$PWD/fluxwing/library" -name "*.uxm" 2>/dev/null | wc -l | tr -d ' ')
            echo "  • Library: $lib_count"
        fi

        echo ""
    fi
}

# Function to display summary
show_summary() {
    local locations_removed="$1"

    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                  Uninstall Complete                        ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    print_success "UXscii skills have been removed"
    echo ""
    print_info "Removed from $locations_removed location(s)"
    echo ""
    print_warning "To reinstall, run: ./scripts/install.sh"
    echo ""
}

# Function to show usage
show_help() {
    cat << EOF
Usage: $0 [OPTIONS]

Uninstall Fluxwing skills from Claude Code.
Removes from: ~/.claude/skills (global)

OPTIONS:
    --force             Skip confirmation prompt
    --dry-run           Show what would be removed without removing
    --help              Show this help message

EXAMPLES:
    # Remove skills (with confirmation)
    $0

    # Remove without confirmation
    $0 --force

    # Preview what would be removed
    $0 --dry-run

IMPORTANT:
    User data in ./fluxwing/ is NEVER removed by this script.
    Your components, screens, and library will remain intact.

EOF
}

# Main uninstallation logic
main() {
    local force="no"
    local dry_run="no"

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --force)
                force="yes"
                shift
                ;;
            --dry-run)
                dry_run="yes"
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

    # Get global skills location
    local target_dir=$(get_skills_location)

    # Check if directory exists and has skills
    if [ ! -d "$target_dir" ]; then
        print_info "Skills directory not found: $target_dir"
        echo ""
        exit 0
    fi

    local skill_count=$(find "$target_dir" -maxdepth 1 -type d -name "fluxwing-*" 2>/dev/null | wc -l | tr -d ' ')

    if [ "$skill_count" -eq 0 ]; then
        print_info "No Fluxwing skills found in $target_dir"
        echo ""
        exit 0
    fi

    # List skills
    list_skills "$target_dir"

    # Confirm and remove
    if confirm_removal "$target_dir" "$force"; then
        if remove_skills "$target_dir" "$dry_run"; then
            # Show user data status
            check_user_data

            # Show summary
            if [ "$dry_run" != "yes" ]; then
                show_summary "1"
            else
                echo ""
                print_info "DRY RUN complete - no files were removed"
                print_info "Run without --dry-run to actually remove skills"
                echo ""
            fi
        fi
    else
        exit 0
    fi
}

# Run main function
main "$@"
