# Contributing to Fluxwing

Thank you for your interest in contributing to Fluxwing! This guide will help you extend the plugin, add features, and contribute back to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Plugin Architecture](#plugin-architecture)
- [Adding Commands](#adding-commands)
- [Adding Agents](#adding-agents)
- [Adding Component Examples](#adding-component-examples)
- [Adding Documentation](#adding-documentation)
- [Testing Your Changes](#testing-your-changes)
- [Submitting Contributions](#submitting-contributions)
- [Code Style Guidelines](#code-style-guidelines)

---

## Getting Started

### Prerequisites

- Claude Code installed and working
- Basic understanding of:
  - Markdown
  - JSON and JSON Schema
  - ASCII art
  - Claude Code plugin system

### Useful Resources

- **Claude Code Plugin Docs**: `docs.claude.com/claude-code/plugins`
- **uxscii Standard**: `data/docs/UXSCII_README.md`
- **Plugin Architecture**: `ARCHITECTURE.md`
- **JSON Schema**: `data/schema/uxm-component.schema.json`

---

## Development Setup

### 1. Clone/Fork the Repository

```bash
git clone https://github.com/yourusername/fluxwing-plugin.git
cd fluxwing-plugin
```

### 2. Install Plugin Locally

```bash
# In Claude Code
/plugin install /absolute/path/to/fluxwing-plugin
```

### 3. Make Changes

Edit files in your local copy:
```
fluxwing-plugin/
├── commands/        # Add/modify commands here
├── agents/          # Add/modify agents here
├── data/examples/   # Add component examples here
└── data/docs/       # Add/modify documentation here
```

### 4. Test Changes

```bash
# Reload plugin to pick up changes
/plugin reload fluxwing

# Test your new command
/fluxwing-your-new-command

# Or dispatch your new agent
```

### 5. Iterate

Make changes → Reload → Test → Repeat

---

## Plugin Architecture

### Core Components

**Commands** (`commands/*.md`):
- Slash commands for quick tasks
- Interactive prompts and workflows
- Format: Markdown with instructions to Claude

**Agents** (`agents/*.md`):
- Autonomous workflows for complex tasks
- Multi-phase processes with TodoWrite tracking
- Format: Markdown with frontmatter + instructions

**Data** (`data/`):
- `schema/` - JSON Schema
- `examples/` - Component templates
- `screens/` - Screen examples
- `docs/` - Documentation modules

**Plugin Manifest** (`.claude-plugin/plugin.json`):
- Defines plugin metadata
- Entry points for commands, agents, hooks, MCP

### Key Principles

1. **Self-contained**: No external dependencies
2. **Modular**: Load only what's needed
3. **Documented**: Every feature has docs
4. **AI-friendly**: Optimized for agent consumption

---

## Adding Commands

### Command Structure

Commands are markdown files with instructions to Claude.

**Location**: `commands/fluxwing-{command-name}.md`

**Template**:
```markdown
---
description: One-line description of what this command does
version: 1.0.0
---

# Command Name

Brief introduction to what this command does and when to use it.

## Your Task

You are helping the user [do specific thing].

## Steps

1. **Step 1 Name**
   - Do this
   - Then this
   - Check that

2. **Step 2 Name**
   - Do this next
   - Validate it
   - Move to step 3

3. **Step 3 Name**
   - Final actions
   - Report results

## Output

Create files at:
- `./fluxwing/{output-location}/{filename}.{extension}`

Format:
[Specify expected output format]

## Resources

Load these documentation files as needed:
- `{PLUGIN_ROOT}/data/docs/relevant-doc.md`
- `{PLUGIN_ROOT}/data/schema/uxm-component.schema.json`

## Success Criteria

You have succeeded when:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] User knows next steps
```

### Example: Adding `/fluxwing-duplicate`

**File**: `commands/fluxwing-duplicate.md`

```markdown
---
description: Duplicate an existing component with a new name
version: 1.0.0
---

# Fluxwing Duplicate Command

Duplicate an existing component with a new ID and name.

## Your Task

Help the user duplicate a component, creating a copy with new ID/name
while preserving all other attributes.

## Steps

1. **Identify Source Component**
   - Ask user which component to duplicate
   - Check if file exists in:
     - `./fluxwing/components/`
     - `./fluxwing/library/`
     - `{PLUGIN_ROOT}/data/examples/`

2. **Get New Name**
   - Ask for new component ID (kebab-case)
   - Check format: ^[a-z0-9]+(?:-[a-z0-9]+)*$
   - Check no conflict with existing components

3. **Copy and Modify**
   - Read source `.uxm` and `.md` files
   - Update `id` field in .uxm
   - Update `metadata.name` field
   - Update `ascii.templateFile` reference
   - Reset `metadata.created` to current timestamp
   - Set `metadata.modified` to current timestamp

4. **Write New Files**
   - Write new `.uxm` to `./fluxwing/components/{new-id}.uxm`
   - Write new `.md` to `./fluxwing/components/{new-id}.md`

5. **Report**
   - Confirm creation with file paths
   - Suggest next steps (customize, etc.)

## Success Criteria

- [ ] New component files created
- [ ] ID and name updated correctly
- [ ] No conflicts with existing components
```

**Register Command**:

No registration needed! Claude Code auto-discovers commands in `commands/` directory.

**Test**:
```bash
/plugin reload fluxwing
/fluxwing-duplicate
```

---

## Adding Agents

### Agent Structure

Agents are markdown files with frontmatter and detailed instructions.

**Location**: `agents/fluxwing-{agent-name}.md`

**Template**:
```markdown
---
description: One-line description of agent purpose
version: 1.0.0
tools: [Read, Write, Edit, Glob, Grep, Bash, TodoWrite]
---

# Agent Name

You are a specialized agent that [does specific complex task].

## Your Mission

[High-level goal and scope]

## Core Responsibilities

1. **Responsibility 1** - What and why
2. **Responsibility 2** - What and why
3. **Responsibility 3** - What and why

## Workflow

### Phase 1: Phase Name

**Purpose**: What this phase accomplishes

**Steps**:
1. Step 1
2. Step 2
3. Use TodoWrite to track tasks

### Phase 2: Phase Name

[Continue with phases...]

### Phase N: Reporting

Provide comprehensive summary:
```
# Agent Name Session Summary

## Request
[What user asked for]

## What Was Created
[Detailed results]

## Validation Results
[Quality checks]

## Next Steps
[What user should do]
```

## Resources Available to You

- `{PLUGIN_ROOT}/data/docs/relevant-doc.md`
- `{PLUGIN_ROOT}/data/examples/`
- `{PLUGIN_ROOT}/data/schema/uxm-component.schema.json`

## Quality Standards

- [ ] Standard 1
- [ ] Standard 2
- [ ] Standard 3

## Success Criteria

You have succeeded when:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] User can immediately use output
```

### Example: Adding `fluxwing-optimizer` Agent

**File**: `agents/fluxwing-optimizer.md`

```markdown
---
description: Optimize component ASCII art and metadata for performance
version: 1.0.0
tools: [Read, Write, Edit, Glob, Grep, TodoWrite]
---

# Fluxwing Optimizer Agent

Analyze and optimize components for reduced file size and improved performance.

## Your Mission

Analyze components and optimize:
- ASCII art (remove unnecessary characters)
- Metadata (remove unused fields)
- Variables (consolidate duplicates)
- States (merge similar states)

## Core Responsibilities

1. **Analyze current usage** - Understand how components are used
2. **Identify optimization opportunities** - Find redundancy and waste
3. **Apply optimizations safely** - Don't break existing functionality
4. **Validate results** - Ensure quality maintained
5. **Report improvements** - Show metrics and savings

## Workflow

### Phase 1: Discovery

1. Find all components in `./fluxwing/components/`
2. Read each .uxm and .md file
3. Create TodoWrite list of components to optimize
4. Prioritize by file size / complexity

### Phase 2: Analysis

For each component:
1. **ASCII Analysis**:
   - Count characters
   - Identify repeated patterns
   - Check for trailing spaces
   - Measure dimensions vs declared

2. **Metadata Analysis**:
   - Check for empty fields
   - Find duplicate tags
   - Identify unused props

3. **State Analysis**:
   - Count defined states
   - Check if states are redundant
   - Validate state triggers

### Phase 3: Optimization

Apply safe optimizations:

**ASCII Optimization**:
- Remove trailing spaces
- Consolidate repeated patterns
- Update width/height if incorrect

**Metadata Optimization**:
- Remove empty string values
- Deduplicate tags
- Sort arrays consistently

**State Optimization**:
- Merge identical states
- Remove unreachable states

### Phase 4: Reporting

```
# Optimization Report

## Components Optimized: 8

## Size Reduction
Before: 145 KB
After: 98 KB
Saved: 47 KB (32% reduction)

## Optimizations Applied

### Component: submit-button
- Removed 3 trailing spaces
- Consolidated duplicate tags (button, submit)
- Removed unused "borderStyle" prop
- Saved: 156 bytes

[Continue for each component...]

## Validation Results
✓ All components pass schema validation
✓ All templates render correctly
✓ No breaking changes detected

## Next Steps
- Review optimized components
- Test in your application
- Commit changes
```

## Resources

- Schema: `{PLUGIN_ROOT}/data/schema/uxm-component.schema.json`

## Success Criteria

- [ ] All optimizations are safe (no breaking changes)
- [ ] File size reduced by at least 10%
- [ ] Detailed report shows improvements
```

**Test**:
```bash
/plugin reload fluxwing

# Dispatch the agent
# Claude Code will recognize it and allow dispatching
```

---

## Adding Component Examples

### Component Example Structure

Each example needs two files:

**1. `{component-id}.uxm`** (JSON metadata)

Template:
```json
{
  "id": "component-id",
  "type": "button|input|card|etc",
  "version": "1.0.0",
  "metadata": {
    "name": "Human-Readable Name",
    "description": "What this component does",
    "author": "Your Name",
    "created": "2024-10-11T12:00:00Z",
    "modified": "2024-10-11T12:00:00Z",
    "tags": ["tag1", "tag2"],
    "category": "input|display|layout|navigation|feedback|data|custom"
  },
  "props": {
    "propName": "default value"
  },
  "behavior": {
    "states": [
      {
        "name": "default",
        "properties": {}
      }
    ],
    "accessibility": {
      "role": "button",
      "focusable": true,
      "ariaLabel": "Descriptive label"
    }
  },
  "ascii": {
    "templateFile": "component-id.md",
    "width": 20,
    "height": 3
  }
}
```

**2. `{component-id}.md`** (ASCII template)

````markdown
# Component Name

Brief description of component.

## Default State

```
╭──────────────────╮
│   {{propName}}   │
╰──────────────────╯
```

## Hover State

```
╔══════════════════╗
║   {{propName}}   ║
╚══════════════════╝
```

## Variables

- `propName` (string): Description of what this variable does

## Usage

Explain when and how to use this component.
````

### Adding a New Example

**1. Create files in `data/examples/`**:

```bash
# Create .uxm file
touch data/examples/your-component.uxm

# Create .md file
touch data/examples/your-component.md
```

**2. Fill in metadata and ASCII art**

**3. Test usage**:

```bash
/fluxwing-library
# Your component should appear in bundled templates

# Try copying it
# Select "copy" and specify destination
```

### ASCII Art Guidelines

**Use consistent box-drawing**:
```
Rounded: ╭─╮│╰╯
Square:  ┌─┐│└┘
Double:  ╔═╗║╚╝
Heavy:   ┏━┓┃┗┛
```

**Show multiple states**:
- Default (normal appearance)
- Hover (highlighted/focused)
- Disabled (grayed/dashed)
- Active (pressed/selected)
- Error (for inputs)

**Proper alignment**:
```
Good:
╭──────────────────╮
│   Button Text    │
╰──────────────────╯

Bad:
╭──────────────────╮
│Button Text       │
╰──────────────────╯
```

**Consistent width**:
- Declare correct width in .uxm
- Ensure all lines in .md match

---

## Adding Documentation

### Documentation Module Structure

**Location**: `data/docs/{number}-{name}.md`

**Numbering**:
- `00-` = Index/navigation
- `01-09` = Modular guides (task-specific)
- `10-99` = Reserved for future modules
- No number = Full reference docs (UXSCII_*.md)

**Template**:
```markdown
# Doc Module Title

Brief introduction to what this doc covers.

## When to Use This Doc

This doc is for:
- Use case 1
- Use case 2

## Overview

High-level concept explanation.

## Key Concepts

### Concept 1

Explanation with examples.

### Concept 2

Explanation with examples.

## Step-by-Step Guide

### Step 1: Step Name

1. Do this
2. Then this
3. Check that

### Step 2: Step Name

[Continue...]

## Examples

### Example 1: Title

```
Code or ASCII here
```

Explanation.

## Common Patterns

- Pattern 1: When and how
- Pattern 2: When and how

## Troubleshooting

**Problem**: Issue description
**Solution**: How to fix

## See Also

- Related doc 1
- Related doc 2
```

### Adding a New Module

**1. Choose number and name**:
```
08-component-testing.md  (next available number)
```

**2. Update `00-INDEX.md`**:
```markdown
## Complete Index

| File | Size | Content |
|------|------|---------|
| [08-component-testing](08-component-testing.md) | ~600 | Testing components |
```

**3. Add loading strategy**:
```markdown
## Loading Strategies

### Testing Components
Load: 08-component-testing.md (~600 tokens)
```

**4. Write content following template**

**5. Update related docs** to link to new module

---

## Testing Your Changes

### Manual Testing Checklist

**For Commands**:
- [ ] Command appears in `/` autocomplete
- [ ] Command executes without errors
- [ ] Output files created in correct locations
- [ ] Help text is clear and accurate
- [ ] Edge cases handled (missing files, invalid input, etc.)

**For Agents**:
- [ ] Agent can be dispatched
- [ ] TodoWrite tasks created and tracked
- [ ] All phases complete successfully
- [ ] Comprehensive report generated
- [ ] No errors in console

**For Examples**:
- [ ] Files appear in `/fluxwing-library`
- [ ] Can be copied successfully
- [ ] ASCII art renders correctly
- [ ] All variables defined and used

**For Documentation**:
- [ ] Markdown renders correctly
- [ ] Links work (internal and external)
- [ ] Code examples are accurate
- [ ] No typos or formatting errors
- [ ] Referenced in 00-INDEX.md

### Integration Testing

**Create workflow**:
```bash
# Create using your command
/fluxwing-your-command

# Check files manually
cat ./fluxwing/components/output.uxm
cat ./fluxwing/components/output.md
```

**Agent → Command workflow**:
```bash
# Dispatch your agent
# Then use command to modify output
```

---

## Submitting Contributions

### Before Submitting

**1. Test thoroughly** using checklist above

**2. Update documentation**:
- Add new command/agent to README.md quick reference
- Update COMMANDS.md or AGENTS.md with details
- Add example usage to relevant docs

**4. Write clear commit messages**:
```
feat(commands): Add /fluxwing-duplicate command

- Duplicates components with new ID
- Checks new name format
- Updates metadata timestamps
- Includes comprehensive error handling

Closes #123
```

### Submission Process

**1. Fork the repository**

**2. Create feature branch**:
```bash
git checkout -b feat/your-feature-name
```

**3. Make changes and commit**:
```bash
git add .
git commit -m "feat: Add your feature"
```

**4. Push to your fork**:
```bash
git push origin feat/your-feature-name
```

**5. Create Pull Request**:
- Clear title describing the change
- Description of what and why
- Screenshots/examples if relevant
- Checklist of what was tested

**6. Respond to feedback**:
- Address review comments
- Make requested changes
- Re-test after modifications

---

## Code Style Guidelines

### Markdown

**Headings**:
```markdown
# H1 - Main Title
## H2 - Major Sections
### H3 - Subsections
#### H4 - Details (rarely needed)
```

**Lists**:
```markdown
- Unordered list
- Second item
  - Nested item

1. Ordered list
2. Second item
```

**Code**:
````markdown
Inline: `code here`

Block:
```json
{
  "key": "value"
}
```
````

**Emphasis**:
```markdown
**Bold** for important terms
*Italic* for emphasis
`code` for technical terms
```

### JSON

**Formatting**:
```json
{
  "id": "component-id",
  "type": "button",
  "props": {
    "text": "Submit"
  }
}
```

**Conventions**:
- Use 2-space indentation
- Double quotes for strings
- No trailing commas
- Alphabetical key order (where sensible)

### ASCII Art

**Alignment**:
```
Good:
╭────────────────╮
│  Centered      │
╰────────────────╯

Bad:
╭────────────────╮
│Centered        │
╰────────────────╯
```

**Consistency**:
- Use same box-drawing characters throughout component
- Match declared width/height
- No trailing spaces

### Variable Naming

**IDs** (kebab-case):
```
submit-button
email-input
user-profile-card
```

**Variables** (camelCase):
```
userName
emailAddress
submitButtonText
```

**Files** (kebab-case, lowercase):
```
submit-button.uxm
email-input.md
login-screen.rendered.md
```

---

## Getting Help

### Resources

- **Architecture**: `ARCHITECTURE.md` - Technical design details
- **Commands**: `COMMANDS.md` - Command reference
- **Agents**: `AGENTS.md` - Agent reference
- **uxscii Docs**: `data/docs/` - Complete uxscii documentation

### Community

- **Issues**: GitHub Issues for bugs and feature requests
- **Discussions**: GitHub Discussions for questions and ideas
- **Discord**: [Link if available] for real-time chat

### Maintainers

When in doubt, ask! Tag maintainers in your PR or issue.

---

## Thank You!

Your contributions make Fluxwing better for everyone. Whether you're adding a command, creating examples, fixing bugs, or improving docs - thank you for being part of the Fluxwing community!

**Happy contributing!** 🎨
