#!/bin/bash
# Fluxwing Skills Uninstallation Script
# Removes all Fluxwing skills from the personal skills directory (~/.claude/skills/)

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

SKILLS_DEST="$HOME/.claude/skills"

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}  Fluxwing Skills Uninstallation${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""

# Check if skills directory exists
if [ ! -d "$SKILLS_DEST" ]; then
    echo -e "${YELLOW}Personal skills directory not found:${NC}"
    echo "  $SKILLS_DEST"
    echo -e "${GREEN}Nothing to uninstall.${NC}"
    exit 0
fi

# Find Fluxwing skills
FLUXWING_SKILLS=$(find "$SKILLS_DEST" -maxdepth 1 -type d -name "uxscii-*")

if [ -z "$FLUXWING_SKILLS" ]; then
    echo -e "${YELLOW}No Fluxwing skills found in:${NC}"
    echo "  $SKILLS_DEST"
    echo -e "${GREEN}Nothing to uninstall.${NC}"
    exit 0
fi

# Count skills
SKILL_COUNT=$(echo "$FLUXWING_SKILLS" | wc -l | tr -d ' ')

echo -e "${BLUE}Found $SKILL_COUNT Fluxwing skill(s) to uninstall:${NC}"
echo ""

# List skills that will be removed
for skill_dir in $FLUXWING_SKILLS; do
    skill_name=$(basename "$skill_dir")
    if [ -f "$skill_dir/SKILL.md" ]; then
        skill_display_name=$(grep "^name:" "$skill_dir/SKILL.md" | sed 's/name: *//')
        echo -e "  ${YELLOW}•${NC} $skill_display_name"
        echo "    Location: ~/.claude/skills/$skill_name/"
    else
        echo -e "  ${YELLOW}•${NC} $skill_name"
    fi
done

echo ""
echo -e "${YELLOW}This will permanently remove these skills from your system.${NC}"
echo -n "Continue? (y/N): "
read -r response

if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${BLUE}Uninstallation cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}Uninstalling skills...${NC}"
echo ""

# Remove each skill
for skill_dir in $FLUXWING_SKILLS; do
    skill_name=$(basename "$skill_dir")

    if [ -f "$skill_dir/SKILL.md" ]; then
        skill_display_name=$(grep "^name:" "$skill_dir/SKILL.md" | sed 's/name: *//')
    else
        skill_display_name="$skill_name"
    fi

    echo -e "${BLUE}Removing: $skill_display_name${NC}"

    # Create backup before removal
    backup_dir="${skill_dir}.uninstall-backup.$(date +%Y%m%d_%H%M%S)"
    mv "$skill_dir" "$backup_dir"

    echo -e "${GREEN}✓ Removed${NC}"
    echo -e "  ${YELLOW}Backup saved to: $(basename "$backup_dir")${NC}"
    echo ""
done

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}  Uninstallation Complete!${NC}"
echo -e "${GREEN}==================================================${NC}"
echo ""
echo -e "${BLUE}All Fluxwing skills have been removed.${NC}"
echo ""
echo -e "${YELLOW}Backups are saved in:${NC}"
echo "  $SKILLS_DEST/"
echo ""
echo -e "You can restore from backup by renaming the backup directories,"
echo -e "or permanently delete them to free up space."
echo ""
echo -e "${GREEN}To reinstall, run: ./install-skills.sh${NC}"
echo ""
