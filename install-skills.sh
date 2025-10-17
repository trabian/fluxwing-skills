#!/bin/bash
# Fluxwing Skills Installation Script
# Installs all Fluxwing skills to the personal skills directory (~/.claude/skills/)

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SOURCE="$SCRIPT_DIR/.claude/skills"
SKILLS_DEST="$HOME/.claude/skills"

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}  Fluxwing Skills Installation${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""

# Check if source directory exists
if [ ! -d "$SKILLS_SOURCE" ]; then
    echo -e "${RED}Error: Skills source directory not found at:${NC}"
    echo "  $SKILLS_SOURCE"
    exit 1
fi

# Create destination directory if it doesn't exist
if [ ! -d "$SKILLS_DEST" ]; then
    echo -e "${YELLOW}Creating personal skills directory...${NC}"
    mkdir -p "$SKILLS_DEST"
    echo -e "${GREEN}✓ Created: $SKILLS_DEST${NC}"
    echo ""
fi

# Count skills
SKILL_COUNT=$(find "$SKILLS_SOURCE" -maxdepth 1 -type d -not -path "$SKILLS_SOURCE" | wc -l | tr -d ' ')

echo -e "${BLUE}Found $SKILL_COUNT skills to install:${NC}"
echo ""

# Install each skill
for skill_dir in "$SKILLS_SOURCE"/*; do
    if [ -d "$skill_dir" ]; then
        skill_name=$(basename "$skill_dir")

        # Check if SKILL.md exists
        if [ ! -f "$skill_dir/SKILL.md" ]; then
            echo -e "${YELLOW}⚠ Skipping $skill_name (no SKILL.md found)${NC}"
            continue
        fi

        dest_skill_dir="$SKILLS_DEST/$skill_name"

        # Backup existing skill if it exists
        if [ -d "$dest_skill_dir" ]; then
            backup_dir="${dest_skill_dir}.backup.$(date +%Y%m%d_%H%M%S)"
            echo -e "${YELLOW}⚠ Backing up existing $skill_name to:${NC}"
            echo "  $(basename "$backup_dir")"
            mv "$dest_skill_dir" "$backup_dir"
        fi

        # Copy skill
        echo -e "${BLUE}Installing: $skill_name${NC}"
        cp -r "$skill_dir" "$dest_skill_dir"

        # Verify installation
        if [ -f "$dest_skill_dir/SKILL.md" ]; then
            # Extract skill name from YAML frontmatter
            skill_display_name=$(grep "^name:" "$dest_skill_dir/SKILL.md" | sed 's/name: *//')
            echo -e "${GREEN}✓ Installed: $skill_display_name${NC}"
            echo "  Location: ~/.claude/skills/$skill_name/"
        else
            echo -e "${RED}✗ Failed to install $skill_name${NC}"
            exit 1
        fi
        echo ""
    fi
done

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}  Installation Complete!${NC}"
echo -e "${GREEN}==================================================${NC}"
echo ""
echo -e "${BLUE}Installed Skills:${NC}"
echo ""

# List installed skills with descriptions
for skill_dir in "$SKILLS_DEST"/uxscii-*; do
    if [ -f "$skill_dir/SKILL.md" ]; then
        skill_name=$(grep "^name:" "$skill_dir/SKILL.md" | sed 's/name: *//')
        skill_desc=$(grep "^description:" "$skill_dir/SKILL.md" | sed 's/description: *//')
        echo -e "${GREEN}✓${NC} ${BLUE}$skill_name${NC}"
        echo "  $skill_desc"
        echo ""
    fi
done

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}  Next Steps${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""
echo "1. Skills are now available globally in Claude Code"
echo "2. You can use them from any directory"
echo "3. Try these commands to test:"
echo ""
echo -e "   ${YELLOW}Test Component Creator:${NC}"
echo "   'Create a submit button'"
echo ""
echo -e "   ${YELLOW}Test Library Browser:${NC}"
echo "   'Show me all available components'"
echo ""
echo -e "   ${YELLOW}Test Component Viewer:${NC}"
echo "   'View details about the primary-button component'"
echo ""
echo -e "${GREEN}To uninstall, run: ./uninstall-skills.sh${NC}"
echo ""
