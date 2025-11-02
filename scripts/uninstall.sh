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

# Global uninstall directory
UNINSTALL_DIR="$HOME/.claude/skills"

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

    # List both fluxwing-* and legacy uxscii-* skills
    for skill_dir in "$target_dir"/fluxwing-* "$target_dir"/uxscii-*; do
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

# Function to remove skills
remove_skills() {
    local target_dir="$1"

    local removed_count=0
    local failed_count=0

    echo ""
    print_info "Removing skills from $target_dir"
    echo ""

    # Remove both fluxwing-* and legacy uxscii-* skills
    for skill_dir in "$target_dir"/fluxwing-* "$target_dir"/uxscii-*; do
        if [ -d "$skill_dir" ]; then
            local skill_name=$(basename "$skill_dir")

            # Remove macOS extended attributes if on macOS
            if command -v xattr >/dev/null 2>&1; then
                xattr -cr "$skill_dir" 2>/dev/null || true
            fi

            if rm -rf "$skill_dir"; then
                print_success "Removed: $skill_name"
                removed_count=$((removed_count + 1))
            else
                print_error "Failed to remove: $skill_name"
                failed_count=$((failed_count + 1))
            fi
        fi
    done

    echo ""

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
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                  Uninstall Complete                        ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    print_success "Fluxwing skills have been removed from ~/.claude/skills"
    echo ""
    print_warning "To reinstall, run: ./scripts/install.sh"
    echo ""
}

# Function to show usage
show_help() {
    cat << EOF
Usage: $0

Uninstall Fluxwing skills from Claude Code.

Removes skills from: ~/.claude/skills

OPTIONS:
    --help, -h          Show this help message

IMPORTANT:
    User data in ./fluxwing/ is NEVER removed by this script.
    Your components, screens, and library will remain intact.

EOF
}

# Main uninstallation logic
main() {
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
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

    # Check if directory exists
    if [ ! -d "$UNINSTALL_DIR" ]; then
        print_info "No skills directory found at $UNINSTALL_DIR"
        echo ""
        exit 0
    fi

    # Check if any skills exist
    local skill_count=$(find "$UNINSTALL_DIR" -maxdepth 1 -type d \( -name "fluxwing-*" -o -name "uxscii-*" \) 2>/dev/null | wc -l | tr -d ' ')

    if [ "$skill_count" -eq 0 ]; then
        print_info "No Fluxwing skills found in $UNINSTALL_DIR"
        echo ""
        exit 0
    fi

    # List skills (disable set -e temporarily since we use return code for count)
    set +e
    list_skills "$UNINSTALL_DIR"
    set -e

    # Remove skills
    if remove_skills "$UNINSTALL_DIR"; then
        # Show user data status
        check_user_data

        # Show summary
        show_summary
    else
        echo ""
        print_error "Uninstall failed"
        echo ""
        exit 1
    fi
}

# Run main function
main "$@"
