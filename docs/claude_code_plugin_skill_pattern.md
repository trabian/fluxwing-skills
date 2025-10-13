# Two-Tier Plugin Architecture Pattern for Claude Code

## Overview

A **two-tier plugin architecture** separates plugin infrastructure (commands, hooks, agents) from content (documentation, skills, knowledge). This pattern enables:

- **Auto-updating content** - Fetch latest without reinstalling plugin
- **Community contributions** - Users can fork and contribute content
- **Lightweight plugins** - Keep core small, content in separate repo
- **Version control** - Content evolves independently from plugin structure

## Architecture Components

```
┌─────────────────────────────────────────────────────────────────────┐
│ Tier 1: Plugin Repository (installed via Claude Code)              │
│ ├── .claude-plugin/                                                 │
│ │   └── plugin.json              # Plugin metadata                 │
│ ├── commands/                     # Slash commands (optional)       │
│ ├── agents/                       # Custom agents (optional)        │
│ ├── hooks/                        # Event handlers                  │
│ │   ├── hooks.json               # Hook configuration              │
│ │   └── session-start.sh         # SessionStart event script       │
│ └── lib/                          # Utility scripts (custom)        │
│     └── initialize-content.sh    # Manages content repository      │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    clones/updates  │  at SessionStart
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│ Tier 2: Content Repository (cloned to user's system)               │
│ ~/.config/PLUGIN_NAME/content/                                      │
│ ├── skills/                       # Procedural knowledge            │
│ │   ├── category-1/                                                 │
│ │   │   ├── skill-name/                                             │
│ │   │   │   └── SKILL.md         # Skill document                  │
│ ├── docs/                         # Reference documentation         │
│ ├── templates/                    # Reusable templates              │
│ └── scripts/                      # Helper utilities                │
└─────────────────────────────────────────────────────────────────────┘
```

## When to Use This Pattern

**Use this pattern when:**
- Content updates frequently (knowledge base, best practices, templates)
- Community contributions expected
- Content is large (many skills, docs, examples)
- Content needs independent versioning
- Users should be able to customize locally

**Don't use this pattern when:**
- Simple plugin with static commands
- All functionality in commands/agents
- No collaborative content
- Content rarely changes

## Implementation Guide

### Step 1: Create Content Repository

First, create a separate repository for your content:

```bash
# Create content repo
mkdir my-plugin-content
cd my-plugin-content
git init

# Create directory structure
mkdir -p skills/category-name
mkdir -p docs
mkdir -p templates
mkdir -p scripts

# Add README
cat > README.md << 'EOF'
# My Plugin Content

Community-editable content for my-plugin.

## Structure
- `skills/` - Procedural knowledge and workflows
- `docs/` - Reference documentation
- `templates/` - Reusable templates
- `scripts/` - Helper utilities

## Contributing
Fork this repo and submit PRs with improvements.
EOF

git add .
git commit -m "Initial content structure"
git remote add origin https://github.com/YOUR_ORG/my-plugin-content.git
git push -u origin main
```

### Step 2: Create Plugin Repository

Create the plugin repository with the two-tier structure:

```bash
mkdir my-plugin
cd my-plugin

# Standard Claude Code plugin structure
mkdir -p .claude-plugin
mkdir -p commands
mkdir -p agents
mkdir -p hooks
mkdir -p lib

# Create plugin.json
cat > .claude-plugin/plugin.json << 'EOF'
{
  "name": "my-plugin",
  "description": "Description of your plugin",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "homepage": "https://github.com/YOUR_ORG/my-plugin",
  "repository": "https://github.com/YOUR_ORG/my-plugin",
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "category": "productivity"
}
EOF
```

### Step 3: Create Content Initialization Script

Create `lib/initialize-content.sh` to manage the content repository:

```bash
cat > lib/initialize-content.sh << 'EOF'
#!/usr/bin/env bash
set -euo pipefail

# Configuration
CONTENT_DIR="${HOME}/.config/my-plugin/content"
CONTENT_REPO="https://github.com/YOUR_ORG/my-plugin-content.git"

# Check if content directory exists and is a valid git repo
if [ -d "$CONTENT_DIR/.git" ]; then
    cd "$CONTENT_DIR"

    # Get the remote name for the current tracking branch
    TRACKING_REMOTE=$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null | cut -d'/' -f1 || echo "")

    # Fetch from tracking remote if set, otherwise try upstream then origin
    if [ -n "$TRACKING_REMOTE" ]; then
        git fetch "$TRACKING_REMOTE" 2>/dev/null || true
    else
        git fetch upstream 2>/dev/null || git fetch origin 2>/dev/null || true
    fi

    # Check if we can fast-forward
    LOCAL=$(git rev-parse @ 2>/dev/null || echo "")
    REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")
    BASE=$(git merge-base @ @{u} 2>/dev/null || echo "")

    # Try to fast-forward merge first
    if [ -n "$LOCAL" ] && [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
        # Check if we can fast-forward (local is ancestor of remote)
        if [ "$LOCAL" = "$BASE" ]; then
            # Fast-forward merge is possible - local is behind
            echo "Updating content to latest version..."
            if git merge --ff-only @{u} 2>&1; then
                echo "✓ Content updated successfully"
                echo "CONTENT_UPDATED=true"
            else
                echo "Failed to update content"
            fi
        elif [ "$REMOTE" != "$BASE" ]; then
            # Remote has changes (local is behind or diverged)
            echo "CONTENT_BEHIND=true"
        fi
        # If REMOTE = BASE, local is ahead - no action needed
    fi

    exit 0
fi

# Content directory doesn't exist or isn't a git repo - initialize it
echo "Initializing content repository..."

# Clone the content repository
mkdir -p "${HOME}/.config/my-plugin"
git clone "$CONTENT_REPO" "$CONTENT_DIR"

cd "$CONTENT_DIR"

# Offer to fork if gh is installed
if command -v gh &> /dev/null; then
    echo ""
    echo "GitHub CLI detected. Would you like to fork my-plugin-content?"
    echo "Forking allows you to share content improvements with the community."
    echo ""
    read -p "Fork my-plugin-content? (y/N): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        gh repo fork YOUR_ORG/my-plugin-content --remote=true
        echo "Forked! You can now contribute content back to the community."
    else
        git remote add upstream "$CONTENT_REPO"
    fi
else
    # No gh, just set up upstream remote
    git remote add upstream "$CONTENT_REPO"
fi

echo "Content repository initialized at $CONTENT_DIR"
EOF

chmod +x lib/initialize-content.sh
```

### Step 4: Create SessionStart Hook

Create `hooks/session-start.sh` to run at session start:

```bash
cat > hooks/session-start.sh << 'EOF'
#!/usr/bin/env bash
# SessionStart hook for my-plugin

set -euo pipefail

# Set environment variable for content location
export MY_PLUGIN_CONTENT_ROOT="${HOME}/.config/my-plugin/content"

# Run content initialization script (handles clone/fetch/auto-update)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
init_output=$("${PLUGIN_ROOT}/lib/initialize-content.sh" 2>&1 || echo "")

# Extract status flags
content_updated=$(echo "$init_output" | grep "CONTENT_UPDATED=true" || echo "")
content_behind=$(echo "$init_output" | grep "CONTENT_BEHIND=true" || echo "")
# Remove status flags from display output
init_output=$(echo "$init_output" | grep -v "CONTENT_UPDATED=true" | grep -v "CONTENT_BEHIND=true" || true)

# Gather content to inject into context (customize based on your needs)
# Example: List available skills
if [ -d "${MY_PLUGIN_CONTENT_ROOT}/skills" ]; then
    skills_list=$(find "${MY_PLUGIN_CONTENT_ROOT}/skills" -name "*.md" -type f | sed "s|${MY_PLUGIN_CONTENT_ROOT}/||" || echo "")
else
    skills_list="Content not initialized"
fi

# Escape outputs for JSON
init_escaped=$(echo "$init_output" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | awk '{printf "%s\\n", $0}')
skills_escaped=$(echo "$skills_list" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | awk '{printf "%s\\n", $0}')

# Build initialization output message if present
init_message=""
if [ -n "$init_escaped" ]; then
    init_message="${init_escaped}\n\n"
fi

# Build status messages that go at the end
status_message=""
if [ -n "$content_behind" ]; then
    status_message="\n\n⚠️ New content available from upstream. Use 'cd ${MY_PLUGIN_CONTENT_ROOT} && git pull' to update."
fi

# Output context injection as JSON
cat <<EOFHOOK
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "<plugin_context>\n# My Plugin Active\n\n${init_message}**Content Location:** ${MY_PLUGIN_CONTENT_ROOT}\n\n**Available Skills:**\n\n${skills_escaped}${status_message}\n\n**How to use:**\n- Read skills from: ${MY_PLUGIN_CONTENT_ROOT}/skills/category/skill-name/SKILL.md\n- Access templates from: ${MY_PLUGIN_CONTENT_ROOT}/templates/\n- Run utilities from: ${MY_PLUGIN_CONTENT_ROOT}/scripts/\n</plugin_context>"
  }
}
EOFHOOK

exit 0
EOF

chmod +x hooks/session-start.sh
```

### Step 5: Create hooks.json Configuration

```bash
cat > hooks/hooks.json << 'EOF'
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh"
          }
        ]
      }
    ]
  }
}
EOF
```

### Step 6: Add Helper Commands (Optional)

You can add slash commands to interact with content:

```bash
cat > commands/find-content.md << 'EOF'
---
description: Search for content in the plugin content repository
---

Search the plugin content repository for relevant skills, docs, or templates.

# Instructions

When the user runs `/find-content [PATTERN]`:

1. Set the content root path:
   ```bash
   CONTENT_ROOT="${MY_PLUGIN_CONTENT_ROOT}"
   ```

2. If no pattern provided, list all content:
   ```bash
   find "${CONTENT_ROOT}" -name "*.md" -type f | sed "s|${CONTENT_ROOT}/||"
   ```

3. If pattern provided, search for it:
   ```bash
   grep -r -l "${PATTERN}" "${CONTENT_ROOT}" --include="*.md" | sed "s|${CONTENT_ROOT}/||"
   ```

4. Display results in a formatted list with brief descriptions.

5. Offer to read any file the user selects.
EOF
```

## Key Implementation Details

### Environment Variable Pattern

Use a consistent environment variable to reference the content location:

```bash
export MY_PLUGIN_CONTENT_ROOT="${HOME}/.config/my-plugin/content"
```

This allows:
- Hooks to find content
- Commands to reference content
- Claude to read files with full paths

### Content Auto-Update Strategy

The `initialize-content.sh` script implements a safe update strategy:

1. **Check if repo exists** - If not, clone it
2. **Fetch remote changes** - Don't pull yet
3. **Check if fast-forward possible** - Only update if safe
4. **Merge with --ff-only** - Never create merge commits
5. **Report status flags** - Let hook know what happened

This ensures:
- User's local changes aren't overwritten
- Updates happen automatically when safe
- User is notified when manual intervention needed

### Fork Support Pattern

The script detects `gh` CLI and offers to fork:

```bash
if command -v gh &> /dev/null; then
    read -p "Fork my-plugin-content? (y/N): " -n 1 -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        gh repo fork YOUR_ORG/my-plugin-content --remote=true
    fi
fi
```

This enables:
- Users can contribute back via PR
- Users work on their own fork
- Upstream remote automatically configured

### Context Injection Pattern

The SessionStart hook outputs JSON to inject context:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "<plugin_context>...</plugin_context>"
  }
}
```

Claude receives this context at the start of every session, making it aware of:
- What content is available
- Where content is located
- How to access content

## Content Organization Patterns

### Skill Documents

Structure skill documents with frontmatter for metadata:

```markdown
---
name: Skill Name
description: Brief description of what this skill does
when_to_use: When to apply this skill
version: 1.0.0
languages: all
---

# Skill Name

## Overview
Core principle and purpose

## When to Use
Specific situations

## The Process
Step-by-step instructions

## Examples
Concrete examples

## Related Skills
References to other skills
```

### Discovery Mechanism

Provide tools for finding content:

```bash
#!/usr/bin/env bash
# scripts/find-skills

CONTENT_ROOT="${MY_PLUGIN_CONTENT_ROOT}"
PATTERN="${1:-}"

if [ -z "$PATTERN" ]; then
    # List all skills with descriptions
    find "${CONTENT_ROOT}/skills" -name "SKILL.md" | while read -r skill; do
        name=$(grep "^name:" "$skill" | cut -d':' -f2- | xargs)
        desc=$(grep "^description:" "$skill" | cut -d':' -f2- | xargs)
        path=$(echo "$skill" | sed "s|${CONTENT_ROOT}/||")
        echo "- $name: $desc"
        echo "  Path: $path"
        echo ""
    done
else
    # Search for pattern
    grep -r -i "$PATTERN" "${CONTENT_ROOT}/skills" --include="SKILL.md"
fi
```

### Version Management

Use git tags in content repo for versioning:

```bash
# In content repo
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0

# Users can checkout specific versions if needed
cd ~/.config/my-plugin/content
git checkout v1.0.0
```

## Usage Patterns for Claude

### Reading Content

When Claude needs to use content from the plugin:

1. **Check environment variable** - `${MY_PLUGIN_CONTENT_ROOT}` contains path
2. **Use Read tool with full path**:
   ```
   ${MY_PLUGIN_CONTENT_ROOT}/skills/category/skill-name/SKILL.md
   ```
3. **Announce usage** - Tell user what content is being used
4. **Follow instructions** - Apply the content's guidance

### Discovering Content

Before using content:

1. **Check injected context** - SessionStart hook lists available content
2. **Search if needed** - Use find-content command or grep
3. **Read only what's needed** - Don't load unnecessary content

### Contributing Back

Users can contribute improvements:

```bash
cd ~/.config/my-plugin/content
git checkout -b feature/improved-skill
# Make changes
git add .
git commit -m "Improve skill XYZ"
git push origin feature/improved-skill
# Open PR on GitHub
```

## Testing Your Plugin

### Local Testing

1. **Install plugin locally**:
   ```bash
   cd /path/to/my-plugin
   claude-code plugin install .
   ```

2. **Start Claude Code** and verify:
   - SessionStart hook runs
   - Content repo is cloned
   - Context is injected
   - Commands work

3. **Test updates**:
   - Make changes in content repo
   - Start new Claude session
   - Verify auto-update works

### Testing Content Updates

Simulate content updates:

```bash
# In content repo
echo "New skill" > skills/test/new-skill/SKILL.md
git add .
git commit -m "Add new skill"
git push

# In new Claude session, verify:
# - Content is fetched
# - New skill appears
# - CONTENT_UPDATED flag set
```

## Common Variations

### Multiple Content Repositories

Some plugins need multiple content sources:

```bash
# lib/initialize-content.sh
declare -A REPOS=(
    ["skills"]="https://github.com/org/plugin-skills.git"
    ["docs"]="https://github.com/org/plugin-docs.git"
    ["templates"]="https://github.com/org/plugin-templates.git"
)

for name in "${!REPOS[@]}"; do
    manage_repo "$name" "${REPOS[$name]}"
done
```

### Conditional Content Loading

Load different content based on project type:

```bash
# hooks/session-start.sh
if [ -f "package.json" ]; then
    inject_skills "javascript"
elif [ -f "requirements.txt" ]; then
    inject_skills "python"
fi
```

### Private Content

For enterprise plugins with private content:

```bash
# lib/initialize-content.sh
CONTENT_REPO="git@github.com:private-org/private-content.git"

# Verify SSH auth
if ! ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "Error: Cannot access private repository. Configure SSH keys."
    exit 1
fi
```

## Real-World Example: Superpowers Plugin

The pattern described here is based on the [superpowers plugin](https://github.com/obra/superpowers):

**Plugin Repo** (`obra/superpowers`):
- Small shim plugin (< 100 lines of code)
- `lib/initialize-skills.sh` - Manages skills repo
- `hooks/session-start.sh` - Injects skills into context
- Commands that delegate to skills repo

**Content Repo** (`obra/superpowers-skills`):
- 50+ skill documents
- Organized by category (testing, debugging, collaboration, etc.)
- Community-contributed improvements
- Versioned independently

**User Experience**:
- Install plugin once: `/plugin install superpowers`
- Skills auto-update on session start
- User can fork and customize locally
- Contributions via PR to skills repo

## Benefits Summary

**For Plugin Authors:**
- Separate concerns (infrastructure vs content)
- Content updates without plugin reinstall
- Community contributions easier
- Version control for content

**For Users:**
- Always get latest content
- Can customize locally
- Can contribute improvements
- Content persists across plugin updates

**For Claude:**
- Rich, updated knowledge base
- Clear content location (`${MY_PLUGIN_CONTENT_ROOT}`)
- Structured, parseable content
- Discovery mechanisms built-in

## Checklist for Implementation

- [ ] Create content repository with structure
- [ ] Create plugin repository with `.claude-plugin/plugin.json`
- [ ] Implement `lib/initialize-content.sh` with git management
- [ ] Create `hooks/session-start.sh` for context injection
- [ ] Configure `hooks/hooks.json` to run SessionStart hook
- [ ] Add environment variable for content location
- [ ] Implement content discovery tools
- [ ] Add fork support for contributions
- [ ] Test local installation and updates
- [ ] Document usage in plugin README
- [ ] Publish both repositories
- [ ] Test installation from published repos

## References

- [Superpowers Plugin](https://github.com/obra/superpowers)
- [Superpowers Skills](https://github.com/obra/superpowers-skills)
- [Claude Code Plugin Documentation](https://docs.claude.com/en/docs/claude-code/plugins)
- [Claude Code Hooks Reference](https://docs.claude.com/en/docs/claude-code/hooks)
