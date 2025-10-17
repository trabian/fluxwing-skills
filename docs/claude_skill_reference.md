# Claude Code Skill Reference

**Complete reference for building ideal Claude Code skills**

Last updated: 2025-10-16

---

## Table of Contents

1. [Overview](#overview)
2. [Skills vs Slash Commands](#skills-vs-slash-commands)
3. [Skill Anatomy](#skill-anatomy)
4. [SKILL.md Structure](#skillmd-structure)
5. [YAML Frontmatter Reference](#yaml-frontmatter-reference)
6. [Skill Content Best Practices](#skill-content-best-practices)
7. [Storage Locations](#storage-locations)
8. [Tool Restrictions](#tool-restrictions)
9. [Discovery & Activation](#discovery--activation)
10. [Skill Design Patterns](#skill-design-patterns)
11. [Example Skills](#example-skills)
12. [Migration from Plugin Commands](#migration-from-plugin-commands)
13. [Testing & Validation](#testing--validation)
14. [Troubleshooting](#troubleshooting)

---

## Overview

**Agent Skills** extend Claude's capabilities through modular, discoverable packages that consist of a `SKILL.md` file with instructions plus optional supporting files like scripts and templates.

### Key Characteristics

- **Model-invoked**: Claude autonomously decides when to use them based on your request and the skill's description
- **Self-contained**: Each skill is a complete unit with all necessary resources
- **Discoverable**: Claude finds and activates skills based on description matching
- **Modular**: One skill addresses one capability or workflow

---

## Skills vs Slash Commands

| Aspect | Skills | Slash Commands |
|--------|--------|----------------|
| **Invocation** | Automatic (Claude decides) | Manual (`/command`) |
| **Use case** | Complex workflows with multiple files | Quick, frequently-used prompts |
| **Structure** | Directory with SKILL.md + resources | Single .md file |
| **Discovery** | Description-based matching | Explicit user typing |
| **Complexity** | Multi-step processes | Simple prompts |
| **Best for** | Workflows requiring context and tools | Reusable prompt templates |

**Choose skills when:**
- The workflow requires multiple steps or decision-making
- Claude should proactively offer the capability
- You need supporting files (schemas, templates, docs)
- The task is complex enough to benefit from structured guidance

**Choose slash commands when:**
- The task is a simple, reusable prompt
- User wants explicit control over activation
- Single file is sufficient
- Quick access is more important than automatic discovery

---

## Skill Anatomy

A skill consists of:

```
skill-name/                  # Skill directory
├── SKILL.md                 # Required: Main skill instructions
├── templates/               # Optional: Template files
├── schemas/                 # Optional: JSON schemas
├── docs/                    # Optional: Documentation
└── scripts/                 # Optional: Helper scripts
```

### Directory Structure Examples

**Simple skill (single file):**
```
pdf-converter/
└── SKILL.md
```

**Complex skill (with resources):**
```
uxscii-designer/
├── SKILL.md
├── templates/
│   ├── button.uxm
│   ├── input.uxm
│   └── card.uxm
├── schemas/
│   └── uxm-component.schema.json
└── docs/
    ├── quick-start.md
    └── component-creation.md
```

---

## SKILL.md Structure

Every `SKILL.md` file must have:

1. **YAML frontmatter** with metadata
2. **Markdown content** with instructions for Claude

### Basic Template

```yaml
---
name: Skill Name
description: What it does and when Claude should use it
---

# Skill Instructions

Your detailed instructions for Claude go here...
```

### Full Template

```yaml
---
name: Component Designer
description: Create uxscii components with ASCII art and structured metadata when user wants to design UI components, buttons, inputs, cards, or screens
version: 1.0.0
author: Your Name
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Component Designer Skill

[Your skill content goes here - see Skill Content Best Practices section]
```

---

## YAML Frontmatter Reference

### Required Fields

#### `name` (string, required)
The human-readable name of the skill.

```yaml
name: Component Designer
```

**Best practices:**
- Use title case
- Keep it concise (2-4 words)
- Make it descriptive and specific

#### `description` (string, required)
**Critical for discovery.** This is how Claude decides whether to activate your skill.

```yaml
description: Create uxscii components with ASCII art and structured metadata when user wants to design UI components, buttons, inputs, cards, or screens
```

**Best practices:**
- Include **trigger terms** users would naturally say
- Describe both **what** it does and **when** to use it
- Use natural language, not technical jargon
- Length: 1-2 sentences (100-200 characters optimal)
- Include synonyms and variations (e.g., "create, build, generate")

**Good examples:**
```yaml
# Good - specific triggers and context
description: Create and validate uxscii components when user wants to design buttons, inputs, forms, cards, or UI layouts

# Good - action-oriented with clear use case
description: Generate Git commit messages following conventional commits format when user asks to commit changes

# Good - includes multiple trigger variations
description: Analyze, review, and provide feedback on code quality, bugs, and security when user wants a code review or audit
```

**Bad examples:**
```yaml
# Bad - too vague
description: Helps with design

# Bad - no trigger terms
description: A tool for working with components

# Bad - technical jargon users won't say
description: Instantiate AST-validated component schemas
```

### Optional Fields

#### `version` (string, optional)
Semantic version number for tracking changes.

```yaml
version: 1.2.3
```

#### `author` (string, optional)
Creator or maintainer information.

```yaml
author: Jane Doe <jane@example.com>
```

#### `allowed-tools` (string, optional)
Comma-separated list of tools Claude can use when this skill is active.

```yaml
allowed-tools: Read, Write, Edit, Glob, Grep
```

**Common tool sets:**
```yaml
# Read-only analysis
allowed-tools: Read, Grep, Glob

# File editing
allowed-tools: Read, Write, Edit

# Full development
allowed-tools: Read, Write, Edit, Bash, Glob, Grep

# Web research
allowed-tools: Read, WebFetch, WebSearch

# Complete access (use sparingly)
allowed-tools: "*"
```

**Available tools:**
- `Read` - Read files
- `Write` - Create new files
- `Edit` - Modify existing files
- `Bash` - Execute shell commands
- `Glob` - Pattern-based file search
- `Grep` - Content search
- `WebFetch` - Fetch web content
- `WebSearch` - Search the web
- `Task` - Spawn sub-agents
- `TodoWrite` - Task management
- `SlashCommand` - Execute slash commands
- `Skill` - Invoke other skills

---

## Skill Content Best Practices

### Structure Your Content

Use clear hierarchical sections to organize instructions:

```markdown
# Skill Name

Brief overview of what this skill does.

## Your Role

Define Claude's persona and responsibilities when using this skill.

## Data Location Rules (if applicable)

Define where to read from and write to.

## Your Task

Clear, concise statement of the primary objective.

## Workflow

Step-by-step instructions for the process.

### Step 1: [Action Name]

Detailed instructions for this step...

### Step 2: [Action Name]

Detailed instructions for this step...

## Example Interactions

Show realistic examples of how the skill works.

## Success Criteria

Define what successful completion looks like.

## Error Handling

Guide Claude on how to handle common errors.
```

### Writing Effective Instructions

#### 1. Be Specific and Actionable

**Good:**
```markdown
### Step 1: Parse Request & Gather Requirements

Extract the component name from the user's request and convert to kebab-case:
- "Submit Button" → "submit-button"
- "Email Input Field" → "email-input-field"

Determine the component type (button, input, card, etc.) based on the name or ask the user if unclear.
```

**Bad:**
```markdown
### Step 1: Setup

Get the information you need.
```

#### 2. Use Code Examples When Helpful

Show exactly what Claude should do:

```markdown
### Step 2: Validate Against Schema

Read the schema and validate the component:

\```typescript
// Read schema
const schema = read('{PLUGIN_ROOT}/data/schema/uxm-component.schema.json');

// Validate component
const isValid = validateAgainstSchema(componentData, schema);

if (!isValid) {
  reportErrors(validationErrors);
}
\```
```

#### 3. Provide Decision-Making Guidance

Help Claude make autonomous decisions:

```markdown
### Step 3: Choose Creation Strategy

**If similar template exists:**
- Offer to base the component on the template (faster)
- Explain what will be customized

**If no similar template:**
- Create from scratch
- Use component type defaults

**If user is unsure:**
- Recommend the template approach for common patterns
- Suggest custom for unique requirements
```

#### 4. Include Example Interactions

Show realistic conversations:

```markdown
## Example Interactions

### Example 1: Basic Component

\```
User: Create a submit button

You: I'll create a submit button component! I found a similar template (primary-button).
Should I base this on that template or create a custom design?

[User responds: use the template]

You: Perfect! Creating submit-button based on primary-button template...

[Creates component]

✓ Component created successfully!
\```

### Example 2: Multi-Component Request

\```
User: Create submit-button, cancel-button, and email-input

You: I'll create all 3 components in parallel for faster creation...

[Creates components]

✓ All 3 components created successfully!
\```
```

#### 5. Define Clear Success Criteria

Be explicit about what "done" looks like:

```markdown
## Success Criteria

- ✓ Component .uxm file created with valid JSON
- ✓ Component .md file created with ASCII template
- ✓ Both files saved to ./fluxwing/components/
- ✓ Component validates against schema
- ✓ Component follows uxscii naming conventions
- ✓ User receives preview and next steps
```

### Use Formatting Effectively

#### Headers for Navigation
Use hierarchical headers to organize:
- `#` for skill title
- `##` for major sections
- `###` for subsections/steps
- `####` for detailed breakdowns

#### Lists for Clarity
```markdown
**Required:**
- Component name (kebab-case)
- Component type (button, input, etc.)
- Key properties (text, value, etc.)

**Optional:**
- Visual style preferences
- Color scheme
- Size variants
```

#### Code Blocks for Examples
Use fenced code blocks with language tags:

```markdown
\```typescript
// TypeScript example
const component = createComponent({ name: 'button' });
\```

\```json
// JSON example
{
  "id": "submit-button",
  "type": "button"
}
\```
```

#### Callouts for Important Info
```markdown
**IMPORTANT:** Always validate against the schema before saving.

**NOTE:** Components are created with default state only. Use expansion workflow for additional states.

**TIP:** Start with a template for faster creation.
```

### Keep Token Count Reasonable

**Target:** 1,000-3,000 tokens per skill

**Why:**
- Balances detail with efficiency
- Keeps context window manageable
- Loads faster when activated

**If skill exceeds 3,000 tokens:**
- Split into multiple related skills
- Move detailed docs to separate files
- Reference external documentation
- Use modular documentation pattern (see Advanced Patterns)

---

## Storage Locations

Skills can be stored in three locations:

### Personal Skills: `~/.claude/skills/`
**Use for:**
- Individual workflows
- Personal preferences
- Experimental capabilities
- Private tools

**Characteristics:**
- Available across all projects
- Not shared with team
- Survives project changes

**Example:**
```
~/.claude/skills/
├── git-commit-helper/
│   └── SKILL.md
└── personal-notes/
    └── SKILL.md
```

### Project Skills: `.claude/skills/`
**Use for:**
- Team-shared expertise
- Project-specific workflows
- Standardized processes
- Onboarding automation

**Characteristics:**
- Checked into git
- Shared with team automatically
- Project-specific context

**Example:**
```
myproject/.claude/skills/
├── uxscii-designer/
│   ├── SKILL.md
│   └── templates/
└── test-runner/
    └── SKILL.md
```

### Plugin Skills
**Use for:**
- Bundled with Claude Code plugins
- Distributed through marketplaces
- Reusable across installations

**Characteristics:**
- Installed via plugin system
- Versioned and updatable
- Marketplace distribution

---

## Tool Restrictions

### Purpose of `allowed-tools`

Restrict Claude's capabilities for:
- **Read-only skills** - Analysis without modifications
- **Security** - Prevent dangerous operations
- **Focus** - Keep skills single-purpose
- **Safety** - Avoid unintended side effects

### Common Patterns

#### Read-Only Analysis
```yaml
allowed-tools: Read, Grep, Glob
```
**Use for:** Code analysis, documentation review, pattern discovery

#### Safe Editing
```yaml
allowed-tools: Read, Write, Edit
```
**Use for:** File creation and modification without shell access

#### Development Workflow
```yaml
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite
```
**Use for:** Full development tasks with command execution

#### Research & Documentation
```yaml
allowed-tools: Read, WebFetch, WebSearch, Write
```
**Use for:** Gathering information and creating documentation

#### No Restrictions
```yaml
allowed-tools: "*"
```
**Use for:** Complex workflows requiring all tools (use cautiously)

### Security Considerations

**Restrict tools when:**
- Skill operates on sensitive data
- User wants approval for certain actions
- Skill is experimental or untrusted
- Limited scope increases safety

**Example - Read-only skill:**
```yaml
---
name: Code Analyzer
description: Analyze code patterns and suggest improvements without making changes
allowed-tools: Read, Grep, Glob
---

This skill can only read and search files, ensuring no accidental modifications.
```

---

## Discovery & Activation

### How Claude Discovers Skills

1. **User makes a request**
2. **Claude analyzes the request** for intent and keywords
3. **Claude searches skill descriptions** for matches
4. **Claude activates the best matching skill** (if confident)
5. **Skill instructions expand** into Claude's context
6. **Claude executes the workflow** defined in SKILL.md

### Writing Discoverable Descriptions

**Include trigger terms users would naturally say:**

```yaml
# Good - multiple natural triggers
description: Create and validate uxscii components when user wants to design buttons, inputs, forms, cards, or UI layouts

# Matches:
# - "Create a button"
# - "I need to design an input field"
# - "Help me build a card component"
# - "Design a form layout"
```

**Include the domain/context:**

```yaml
# Good - clear domain
description: Generate Git commit messages following conventional commits format when user asks to commit changes or create commits

# Matches:
# - "Create a commit"
# - "Write a commit message"
# - "Commit these changes"
```

**Include action verbs:**

```yaml
# Good - action-oriented
description: Analyze, review, and provide feedback on code quality, bugs, security vulnerabilities, and best practices when user requests code review or audit

# Matches:
# - "Review this code"
# - "Analyze this file for bugs"
# - "Audit the security"
```

### Testing Skill Discovery

**Ask yourself:**
1. What would a user naturally say to trigger this skill?
2. Are those phrases in the description?
3. Is the description specific enough to avoid false matches?
4. Is the description general enough to catch variations?

**Test with real queries:**
- "Create a button" → Should match component designer
- "Design a card" → Should match component designer
- "Build a form" → Should match component designer
- "Write a commit" → Should NOT match component designer

---

## Skill Design Patterns

### Pattern 1: Simple Task Automation

**Use case:** Automate a single, well-defined task

```yaml
---
name: Git Commit Helper
description: Generate conventional commit messages when user wants to commit changes
allowed-tools: Read, Bash
---

# Git Commit Helper

## Your Task
Generate a conventional commit message based on staged changes.

## Workflow

### Step 1: Check Git Status
Run `git status` and `git diff --staged` to see changes.

### Step 2: Analyze Changes
Determine commit type (feat, fix, docs, refactor, etc.).

### Step 3: Generate Message
Create message following format:
\```
<type>(<scope>): <description>

[optional body]
\```

### Step 4: Present to User
Show the generated message and ask for confirmation before committing.
```

### Pattern 2: Multi-Step Workflow

**Use case:** Complex process with multiple phases

```yaml
---
name: Component Designer
description: Create uxscii components with templates and validation
allowed-tools: Read, Write, Edit, Glob, Grep, Task, TodoWrite
---

# Component Designer

## Workflow

### Phase 1: Requirements Gathering
- Parse user request
- Extract component details
- Identify similar templates

### Phase 2: Component Creation
- Generate .uxm metadata file
- Create .md ASCII template
- Validate against schema

### Phase 3: Validation & Reporting
- Run schema validation
- Check accessibility attributes
- Present results to user

[Detailed instructions for each phase...]
```

### Pattern 3: Delegating Agent

**Use case:** Orchestrate other agents/skills

```yaml
---
name: Screen Builder
description: Build complete UI screens by composing multiple components
allowed-tools: Read, Write, Task, TodoWrite
---

# Screen Builder

## Your Role
You are an orchestrator that delegates to specialist agents.

## Workflow

### Step 1: Analyze Screen Requirements
Parse the user's screen description and identify needed components.

### Step 2: Spawn Component Designers (Parallel)
For each missing component, spawn a designer agent:

\```typescript
Task({
  subagent_type: "component-designer",
  description: "Create button component",
  prompt: "Create a submit button with..."
})
\```

### Step 3: Compose Screen
Once all components exist, compose them into a screen layout.

[More details...]
```

### Pattern 4: Modular Documentation

**Use case:** Large skill with extensive documentation

```yaml
---
name: API Developer
description: Design and implement REST APIs with documentation
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# API Developer

## Quick Reference

See detailed documentation:
- {SKILL_ROOT}/docs/01-endpoint-design.md
- {SKILL_ROOT}/docs/02-validation.md
- {SKILL_ROOT}/docs/03-testing.md

## Workflow

### Step 1: Endpoint Design
Consult `01-endpoint-design.md` for REST patterns...

### Step 2: Implementation
Follow `02-validation.md` for validation rules...

### Step 3: Testing
Reference `03-testing.md` for test patterns...

[High-level workflow with references to detailed docs]
```

### Pattern 5: Template-Based Generation

**Use case:** Create files from templates

```yaml
---
name: React Component Generator
description: Generate React components from templates when user wants to create components
allowed-tools: Read, Write, Edit
---

# React Component Generator

## Templates Available

Located in `{SKILL_ROOT}/templates/`:
- `functional-component.tsx` - Modern functional component
- `class-component.tsx` - Class-based component
- `component-with-hooks.tsx` - Component with common hooks

## Workflow

### Step 1: Choose Template
Based on user requirements, select appropriate template.

### Step 2: Customize Template
Replace placeholders:
- `{{ComponentName}}` - Component name in PascalCase
- `{{componentName}}` - Component name in camelCase
- `{{props}}` - Component props interface

### Step 3: Generate File
Write customized template to project location.

[More details...]
```

---

## Example Skills

### Example 1: Simple Skill (No Resources)

**File:** `~/.claude/skills/commit-helper/SKILL.md`

```yaml
---
name: Commit Message Helper
description: Generate conventional commit messages when user wants to commit changes
allowed-tools: Read, Bash
---

# Commit Message Helper

You help users create well-formatted conventional commit messages.

## Workflow

### Step 1: Check Current Changes
Run these commands to understand what changed:
\```bash
git status
git diff --staged
\```

### Step 2: Determine Commit Type
Based on changes, choose the appropriate type:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting changes
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

### Step 3: Generate Message
Format: `<type>(<scope>): <description>`

Example:
\```
feat(auth): add password reset functionality
\```

### Step 4: Present & Confirm
Show the generated message and ask user if they want to commit with it.

## Success Criteria
- ✓ Message follows conventional commits format
- ✓ Type accurately reflects changes
- ✓ Description is clear and concise
- ✓ User approves before committing
```

### Example 2: Complex Skill (With Resources)

**File:** `.claude/skills/uxscii-designer/SKILL.md`

```yaml
---
name: UXscii Component Designer
description: Create uxscii components with ASCII art and structured metadata when user wants to design UI components, buttons, inputs, cards, or screens
version: 1.0.0
author: Design Team
allowed-tools: Read, Write, Edit, Glob, Grep, TodoWrite
---

# UXscii Component Designer

You are a UX designer that creates components using the **uxscii standard**.

## Data Location Rules

**READ from (templates - reference only):**
- `{SKILL_ROOT}/templates/` - Component templates
- `{SKILL_ROOT}/schemas/` - Validation schemas

**WRITE to (project workspace):**
- `./uxscii/components/` - Your created components

**NEVER write to skill directory - it's read-only!**

## Your Task

Create uxscii components consisting of two files:
1. `.uxm` file (JSON metadata)
2. `.md` file (ASCII template)

## Workflow

### Step 1: Parse Request & Gather Requirements

Extract from user request:
- Component name (convert to kebab-case)
- Component type (button, input, card, etc.)
- Key properties (text, colors, sizes)
- Visual style preferences

**If details missing:** Ask clarifying questions.

### Step 2: Check for Similar Templates

Browse available templates:
\```typescript
const templates = glob('{SKILL_ROOT}/templates/*.uxm');
\```

If similar template found:
- Offer to base component on it
- Explain what will be customized

### Step 3: Create Component Files

#### Create .uxm file (JSON metadata)

\```json
{
  "id": "component-name",
  "type": "button",
  "version": "1.0.0",
  "metadata": {
    "name": "Component Name",
    "description": "What this component does",
    "created": "2025-10-16T12:00:00Z"
  },
  "props": {
    "text": "Button Text",
    "variant": "primary"
  },
  "behavior": {
    "interactive": true,
    "focusable": true
  },
  "accessibility": {
    "role": "button",
    "ariaLabel": "{{text}}"
  },
  "ascii": {
    "templateFile": "component-name.md",
    "width": 20,
    "height": 3
  }
}
\```

#### Create .md file (ASCII template)

\```markdown
# Component Name

## Default State

\```
╭──────────────────╮
│   {{text}}       │
╰──────────────────╯
\```
\```

### Step 4: Validate Against Schema

Read schema and validate:
\```typescript
const schema = read('{SKILL_ROOT}/schemas/uxm-component.schema.json');
const isValid = validateAgainstSchema(componentData, schema);
\```

### Step 5: Report Success

Present preview and next steps:
\```markdown
# Component Created ✓

**Files:**
- ./uxscii/components/component-name.uxm
- ./uxscii/components/component-name.md

**Preview:**
╭──────────────────╮
│   Button Text    │
╰──────────────────╯

**Next steps:**
- Customize the component
- Add to a screen
- View all components
\```

## Example Interaction

\```
User: Create a submit button

You: I'll create a submit button component! I found a similar template (primary-button).
Should I base this on that template or create a custom design?

[User: use the template]

You: Perfect! Creating submit-button based on primary-button template...

[Creates component]

✓ Component created successfully!

Files:
- ./uxscii/components/submit-button.uxm
- ./uxscii/components/submit-button.md

Preview:
╭──────────────────╮
│   Submit Form    │
╰──────────────────╯
\```

## Success Criteria

- ✓ Both .uxm and .md files created
- ✓ Component validates against schema
- ✓ Files saved to ./uxscii/components/
- ✓ Component follows uxscii naming conventions
- ✓ User receives preview and next steps
```

**Supporting Files:**

**File:** `.claude/skills/uxscii-designer/templates/button.uxm`
```json
{
  "id": "button-template",
  "type": "button",
  "version": "1.0.0",
  "metadata": {
    "name": "Button Template",
    "description": "Basic button template"
  },
  "props": {
    "text": "Click Me"
  },
  "ascii": {
    "templateFile": "button-template.md",
    "width": 16,
    "height": 3
  }
}
```

**File:** `.claude/skills/uxscii-designer/templates/button.md`
```markdown
# Button Template

## Default State

```
╭──────────────╮
│   {{text}}   │
╰──────────────╯
```
```

---

## Migration from Plugin Commands

### Why Migrate to Skills?

**Benefits of skills over plugin commands:**
- **Automatic discovery** - Claude finds and uses them without `/` prefix
- **Better organization** - Separate directory per capability
- **Supporting files** - Templates, schemas, docs in same location
- **Team sharing** - Easy to commit to project repository
- **No plugin system dependency** - Works in any Claude Code installation

### Migration Strategy

#### Step 1: Analyze Existing Command

**Current plugin command:** `fluxwing/commands/fluxwing-create.md`

Key elements:
- Frontmatter (description, metadata)
- Workflow instructions
- Example interactions
- Success criteria

#### Step 2: Create Skill Directory

```bash
mkdir -p .claude/skills/uxscii-designer
```

#### Step 3: Convert Command to SKILL.md

**From plugin command structure:**
```yaml
---
description: Create uxscii component(s) - single or multiple in parallel
---

# Fluxwing Component Creator

You are Fluxwing, an AI-native UX design assistant...

## Your Task
[Task description]

## Workflow
[Steps]
```

**To skill structure:**
```yaml
---
name: UXscii Component Designer
description: Create uxscii components with ASCII art and metadata when user wants to design UI components, buttons, inputs, cards, or screens
version: 1.0.0
allowed-tools: Read, Write, Edit, Glob, Grep, TodoWrite
---

# UXscii Component Designer

You are a UX designer that creates components using the uxscii standard...

## Your Task
[Same task description]

## Workflow
[Same steps, adapted for skill context]
```

#### Step 4: Update File References

**Plugin commands use:** `{PLUGIN_ROOT}/data/`

**Skills should use:** `{SKILL_ROOT}/` for skill-local files

**Example transformation:**
```markdown
<!-- Plugin command -->
Read templates from: {PLUGIN_ROOT}/data/examples/

<!-- Skill -->
Read templates from: {SKILL_ROOT}/templates/
```

#### Step 5: Move Supporting Files

**Plugin structure:**
```
fluxwing/
├── commands/
│   └── fluxwing-create.md
└── data/
    ├── examples/
    ├── schemas/
    └── docs/
```

**Skill structure:**
```
.claude/skills/uxscii-designer/
├── SKILL.md
├── templates/
│   └── [examples moved here]
├── schemas/
│   └── [schemas moved here]
└── docs/
    └── [docs moved here]
```

#### Step 6: Test the Skill

**Test discovery:**
1. Remove or disable the plugin
2. Say the trigger phrase: "Create a button"
3. Verify Claude activates the skill

**Test execution:**
1. Run through the workflow
2. Verify file creation works
3. Check validation and error handling

### Complete Migration Example

**Before (Plugin Command):**

`fluxwing/commands/fluxwing-create.md`:
```yaml
---
description: Create uxscii component(s) - single or multiple in parallel
---

# Fluxwing Component Creator

## Data Location Rules

**READ from:**
- `{PLUGIN_ROOT}/data/examples/` - Templates

**WRITE to:**
- `./fluxwing/components/` - Created components

## Your Task
Create uxscii components...
```

**After (Skill):**

`.claude/skills/uxscii-designer/SKILL.md`:
```yaml
---
name: UXscii Component Designer
description: Create uxscii components with ASCII art when user wants to design buttons, inputs, cards, or UI components
version: 1.0.0
allowed-tools: Read, Write, Edit, Glob, Grep
---

# UXscii Component Designer

## Data Location Rules

**READ from:**
- `{SKILL_ROOT}/templates/` - Component templates
- `{SKILL_ROOT}/schemas/` - Validation schemas

**WRITE to:**
- `./uxscii/components/` - Created components

## Your Task
Create uxscii components...
```

`.claude/skills/uxscii-designer/templates/button.uxm` (moved from plugin)

`.claude/skills/uxscii-designer/schemas/uxm-component.schema.json` (moved from plugin)

### Handling Agent Delegation

**Plugin pattern:**
```typescript
Task({
  subagent_type: "fluxwing:fluxwing-designer",
  description: "Create component",
  prompt: "..."
})
```

**Skill pattern:**
```typescript
// Option 1: Invoke another skill
Skill({
  command: "component-generator"
})

// Option 2: Embed the logic directly
// (Since skills are self-contained, consider embedding vs delegating)
```

**Recommendation:** For skills, prefer self-contained logic over heavy delegation. Skills should be complete units of work.

---

## Testing & Validation

### Testing Checklist

**Discovery Testing:**
- [ ] Say the trigger phrase naturally
- [ ] Verify Claude activates the skill
- [ ] Try variations of the trigger phrase
- [ ] Confirm no false activations

**Functionality Testing:**
- [ ] Run through complete workflow
- [ ] Test all steps work correctly
- [ ] Verify file creation/modification
- [ ] Check error handling

**Tool Restriction Testing:**
- [ ] Confirm only allowed tools are used
- [ ] Test that restricted tools are blocked
- [ ] Verify permission prompts if needed

**Team Testing:**
- [ ] Share with teammates
- [ ] Confirm it works in their environment
- [ ] Gather feedback on usability
- [ ] Iterate based on feedback

### Validation Tools

#### Manual Testing
```bash
# Test skill discovery
echo "Create a button" | claude

# Test skill in project
cd my-project
echo "Design a card component" | claude
```

#### YAML Validation
```bash
# Validate frontmatter syntax
head -n 10 SKILL.md | python -c "import yaml; yaml.safe_load(open('/dev/stdin'))"
```

#### File Structure Check
```bash
# Verify skill structure
tree .claude/skills/skill-name/

# Expected:
# skill-name/
# ├── SKILL.md
# └── [supporting files]
```

---

## Troubleshooting

### Skill Not Activating

**Problem:** Claude doesn't use your skill when expected.

**Solutions:**

1. **Improve description specificity**
   ```yaml
   # Too vague
   description: Helps with components

   # Better
   description: Create uxscii components when user wants to design buttons, inputs, cards, or UI layouts
   ```

2. **Add more trigger terms**
   ```yaml
   description: Create, build, generate, or design uxscii components including buttons, inputs, forms, cards, navigation, and UI layouts
   ```

3. **Check file location**
   ```bash
   # Personal skills
   ls ~/.claude/skills/skill-name/SKILL.md

   # Project skills
   ls .claude/skills/skill-name/SKILL.md
   ```

4. **Verify YAML syntax**
   ```bash
   head -n 10 .claude/skills/skill-name/SKILL.md
   ```

### Tool Restrictions Not Working

**Problem:** Skill uses tools not in `allowed-tools`.

**Solutions:**

1. **Check frontmatter format**
   ```yaml
   # Wrong
   allowed-tools:
     - Read
     - Write

   # Correct
   allowed-tools: Read, Write
   ```

2. **Verify tool names**
   ```yaml
   # Wrong (case matters)
   allowed-tools: read, write

   # Correct
   allowed-tools: Read, Write
   ```

### File Paths Not Resolving

**Problem:** `{SKILL_ROOT}` or other placeholders don't work.

**Solutions:**

1. **Use correct placeholder**
   ```markdown
   # For skill-local files
   Read: {SKILL_ROOT}/templates/button.uxm

   # For project files
   Write: ./uxscii/components/button.uxm

   # For user home
   Read: ~/.claude/config.json
   ```

2. **Check file existence**
   ```bash
   # Verify files exist
   ls .claude/skills/skill-name/templates/
   ```

### Skill Conflicts

**Problem:** Multiple skills activate for same request.

**Solutions:**

1. **Make descriptions more specific**
   ```yaml
   # Generic (may conflict)
   description: Create components

   # Specific (less likely to conflict)
   description: Create uxscii components with ASCII art for UI design
   ```

2. **Use different trigger terms**
   ```yaml
   # Skill A
   description: Create React components with TypeScript

   # Skill B
   description: Design uxscii components with ASCII templates
   ```

### Performance Issues

**Problem:** Skill is slow or uses too much context.

**Solutions:**

1. **Reduce skill size**
   - Target 1,000-3,000 tokens
   - Move detailed docs to separate files
   - Reference docs instead of embedding

2. **Use modular documentation**
   ```markdown
   ## Quick Reference

   See detailed docs:
   - {SKILL_ROOT}/docs/workflow.md
   - {SKILL_ROOT}/docs/examples.md

   ## Workflow
   [High-level steps only, reference detailed docs when needed]
   ```

3. **Optimize tool usage**
   ```yaml
   # Only include tools actually needed
   allowed-tools: Read, Write, Edit
   ```

---

## Summary: Building the Ideal Skill

### The Ideal Skill Has:

1. **Clear, discoverable description** with natural trigger terms
2. **Well-structured content** with hierarchical organization
3. **Specific, actionable instructions** with examples
4. **Appropriate tool restrictions** for safety and focus
5. **Self-contained resources** (templates, schemas, docs)
6. **Realistic examples** showing actual usage
7. **Clear success criteria** defining completion
8. **Error handling guidance** for common issues
9. **Reasonable token count** (1,000-3,000 tokens)
10. **Team-tested validation** confirming it works

### Quick Start Template

```yaml
---
name: Your Skill Name
description: What it does and when Claude should use it, including trigger words users would say
version: 1.0.0
author: Your Name
allowed-tools: Read, Write, Edit
---

# Your Skill Name

Brief overview of what this skill does.

## Your Role

Define Claude's persona when using this skill.

## Your Task

Clear statement of the primary objective.

## Workflow

### Step 1: [First Action]
Detailed instructions...

### Step 2: [Second Action]
Detailed instructions...

### Step 3: [Final Action]
Detailed instructions...

## Example Interaction

\```
User: [Trigger phrase]

You: [Response and actions]

[Result]
\```

## Success Criteria

- ✓ [First criterion]
- ✓ [Second criterion]
- ✓ [Final criterion]
```

---

## Additional Resources

### Official Documentation
- [Claude Code Skills](https://docs.claude.com/en/docs/claude-code/skills)
- [Slash Commands](https://docs.claude.com/en/docs/claude-code/slash-commands)
- [Common Workflows](https://docs.claude.com/en/docs/claude-code/common-workflows)

### Related Topics
- Plugin development
- Custom slash commands
- MCP integration
- Hooks and automation

---

**Last updated:** 2025-10-16
**Version:** 1.0.0
