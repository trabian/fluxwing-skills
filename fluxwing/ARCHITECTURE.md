# Fluxwing Plugin Architecture

Complete technical reference for the Fluxwing plugin design and implementation.

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Plugin Structure](#plugin-structure)
- [The uxscii Standard](#the-uxscii-standard)
- [Two-File System](#two-file-system)
- [Component Hierarchy](#component-hierarchy)
- [Schema Design](#schema-design)
- [Why Rendered Examples](#why-rendered-examples)
- [Agent Architecture](#agent-architecture)
- [Extension Points](#extension-points)
- [Performance Considerations](#performance-considerations)

---

## Design Philosophy

### Core Principles

#### 1. AI-Native Design
**Principle**: Design format optimized for AI agents to create, read, and modify.

**Why**: Traditional design tools (Figma, Sketch) produce binary/proprietary formats that AI cannot natively work with. uxscii uses text + JSON that AI excels at generating.

**How**:
- Plain text ASCII art (visual but parseable)
- Structured JSON metadata (machine-readable)
- Templating with `{{variables}}` (AI understands substitution)
- Human-readable component IDs (semantic, not UUIDs)

#### 2. Fluxwing vs uxscii Distinction
**Principle**: Clear separation between bot and standard.

**Naming**:
- **Fluxwing** = The AI bot/agent that helps you design
- **uxscii** = The standard format it uses

**Analogy**:
- uxscii is like HTML/CSS (the language)
- Fluxwing is like Figma (the tool that speaks the language)

**Why it matters**:
- Prevents confusion in commands (`/fluxwing-create` not `/uxscii-create`)
- Allows standard to be tool-agnostic
- Fluxwing is one implementation; others could exist

#### 3. Self-Contained Portability
**Principle**: No external dependencies on CLI tools or services.

**Why**: Users shouldn't need to:
- Install external CLI tools
- Configure environment variables
- Download separate assets
- Manage version compatibility

**How**:
- Bundle all schemas in plugin
- Bundle all example components
- Bundle all documentation
- Plugin is single installation unit

#### 4. Rendered Examples as Truth
**Principle**: Every screen shows actual rendered output with real data, not just `{{templates}}`.

**Why**:
- Templates with `{{userEmail}}` don't show visual intent
- Agents need to see "Sarah Johnson, sarah@example.com, logged in 2 hours ago"
- Designers think in real data, not abstract variables

**How**:
- Three-file system for screens: `.uxm`, `.md`, `.rendered.md`
- `.rendered.md` shows actual intended appearance
- Real names, real numbers, real timestamps

#### 5. Modular Documentation
**Principle**: Load only the docs you need, save context tokens.

**Why**:
- Full documentation is ~30KB (thousands of tokens)
- Agents rarely need all docs simultaneously
- Context window is precious

**How**:
- Split into 7 modular docs (500-800 tokens each)
- `00-INDEX.md` guides loading strategy
- Task-specific loading recommendations
- Full docs available but not required upfront

---

## Plugin Structure

### Directory Layout

```
plugin/
├── .claude-plugin/
│   └── plugin.json              # Manifest (name, version, entry points)
│
├── commands/                     # Slash Commands (4 total)
│   ├── fluxwing-create.md       # Create single component
│   ├── fluxwing-scaffold.md     # Build complete screen
│   ├── fluxwing-library.md      # Browse library
│   └── fluxwing-get.md          # View component details
│
├── agents/                       # Autonomous Agents (2 total)
│   ├── fluxwing-designer.md     # Multi-component design
│   └── fluxwing-composer.md     # Screen composition
│
├── data/                         # All uxscii assets (portable bundle)
│   ├── schema/
│   │   └── uxm-component.schema.json   # JSON Schema validation
│   │
│   ├── examples/                 # 11 curated component templates
│   │   ├── primary-button.{uxm,md}
│   │   ├── secondary-button.{uxm,md}
│   │   ├── email-input.{uxm,md}
│   │   ├── card.{uxm,md}
│   │   ├── modal.{uxm,md}
│   │   ├── navigation.{uxm,md}
│   │   ├── alert.{uxm,md}
│   │   ├── badge.{uxm,md}
│   │   ├── list.{uxm,md}
│   │   ├── form.{uxm,md}
│   │   └── custom-widget.{uxm,md}
│   │
│   ├── screens/                  # 2 complete screen examples
│   │   ├── login-screen.{uxm,md,rendered.md}
│   │   └── dashboard.{uxm,md,rendered.md}
│   │
│   ├── docs/                     # Modular documentation
│   │   ├── 00-INDEX.md          # Navigation + loading strategies
│   │   ├── 01-quick-start.md    # 30-second component creation
│   │   ├── 02-core-concepts.md  # Understanding uxscii
│   │   ├── 03-component-creation.md  # Step-by-step workflow
│   │   ├── 04-screen-composition.md  # Building screens
│   │   ├── 05-validation-guide.md    # Quality standards
│   │   ├── 06-ascii-patterns.md      # Visual toolkit
│   │   ├── 07-schema-reference.md    # Schema documentation
│   │   ├── UXSCII_AGENT_GUIDE.md     # Full comprehensive guide
│   │   ├── UXSCII_SCHEMA_GUIDE.md    # Schema deep-dive
│   │   └── UXSCII_README.md          # Standard overview
│   │
│   └── helpers/                  # (Reserved for future extensions)
│
├── hooks/                        # Event hooks (empty, available for extension)
├── mcp/                          # MCP servers (empty, available for extension)
│
├── README.md                     # High-level overview
├── COMMANDS.md                   # Detailed command reference
├── AGENTS.md                     # Detailed agent reference
├── ARCHITECTURE.md               # This file
├── CONTRIBUTING.md               # Developer guidelines
├── TROUBLESHOOTING.md            # Common issues
├── PLUGIN_STRUCTURE.md           # Complete structure documentation
└── .gitignore                    # Git ignore rules
```

### User Output Structure

When users create designs, files go to their project:

```
./fluxwing/                       # User's project directory
├── components/                   # Reusable UI components
│   ├── {component-name}.uxm
│   ├── {component-name}.md
│   └── ...
│
├── screens/                      # Complete screen compositions
│   ├── {screen-name}.uxm
│   ├── {screen-name}.md
│   ├── {screen-name}.rendered.md
│   └── ...
│
└── library/                      # Copied/customized templates
    └── ...
```

### File Count Summary

- **Commands**: 4 slash commands
- **Agents**: 2 autonomous agents
- **Component Examples**: 11 (22 files: .uxm + .md pairs)
- **Screen Examples**: 2 (6 files: .uxm + .md + .rendered.md)
- **Documentation**: 10 modular docs + 3 full reference docs
- **Schema**: 1 definitive JSON Schema
- **Total**: ~43 plugin files (excluding node_modules, .git)

---

## The uxscii Standard

### What is uxscii?

**uxscii** (pronounced "you-ex-ski") = **UX** design in **ASCII** art + metadata

**Components**:
1. **ASCII art** - Visual representation using box-drawing characters
2. **JSON metadata** - Structured data about the component
3. **Variable substitution** - `{{variableName}}` templating system

**Not**: A UI framework, rendering engine, or design tool
**Is**: A design markup language for AI-native workflows

### Design Goals

1. **Human-Readable**: Designers can understand ASCII layouts
2. **Machine-Parseable**: AI agents can generate and modify
3. **Version-Control Friendly**: Text-based, meaningful diffs
4. **Tool-Independent**: Open standard, not proprietary
5. **Accessibility-First**: ARIA roles and keyboard support built-in

---

## Two-File System

### Core Concept

Every component consists of **two files**:

#### 1. `.uxm` file (JSON metadata)

**Purpose**: Define component structure, behavior, and metadata

**Contains**:
- `id` - Unique identifier (kebab-case)
- `type` - Component type (button, input, card, etc.)
- `version` - Semantic version (major.minor.patch)
- `metadata` - Name, description, author, tags, timestamps
- `props` - Component properties and default values
- `behavior` - States, interactions, accessibility
- `layout` - Positioning, spacing, display
- `ascii` - ASCII template reference and dimensions

**Example**:
```json
{
  "id": "submit-button",
  "type": "button",
  "version": "1.0.0",
  "metadata": {
    "name": "Submit Button",
    "description": "Primary action button for form submission",
    "author": "Fluxwing Team",
    "created": "2024-10-11T12:00:00Z",
    "modified": "2024-10-11T12:00:00Z",
    "tags": ["button", "submit", "form", "action"],
    "category": "input"
  },
  "props": {
    "text": "Submit",
    "disabled": false
  },
  "behavior": {
    "states": [
      {
        "name": "default",
        "properties": {"background": "primary"}
      },
      {
        "name": "hover",
        "properties": {"background": "primary-dark"},
        "triggers": ["mouseenter"]
      },
      {
        "name": "disabled",
        "properties": {"background": "gray", "cursor": "not-allowed"}
      }
    ],
    "accessibility": {
      "role": "button",
      "focusable": true,
      "ariaLabel": "Submit form"
    }
  },
  "ascii": {
    "templateFile": "submit-button.md",
    "width": 20,
    "height": 3
  }
}
```

#### 2. `.md` file (ASCII template)

**Purpose**: Visual representation with variable placeholders

**Contains**:
- ASCII art layouts
- `{{variable}}` placeholders
- Multiple state representations
- Usage examples (optional)
- Variable documentation (optional)

**Example**:
````markdown
# Submit Button

Interactive button for form submission.

## Default State

```
╭──────────────────╮
│   {{text}}       │
╰──────────────────╯
```

## Hover State

```
╔══════════════════╗
║   {{text}}       ║
╚══════════════════╝
```

## Disabled State

```
╭ ─ ─ ─ ─ ─ ─ ─ ─ ╮
│   {{text}}       │
╰ ─ ─ ─ ─ ─ ─ ─ ─ ╯
```

## Variables

- `text` (string): Button label text

## Usage

Use for primary form actions like submit, save, continue.
````

### Why Two Files?

**Separation of Concerns**:
- `.uxm` = Data/structure (machine-focused)
- `.md` = Presentation (human-focused)

**Benefits**:
- Clear diff visibility in version control
- Easy to update ASCII without touching metadata
- AI can generate each independently
- Supports different rendering engines

**Drawbacks Considered**:
- Two files to manage (but tooling can hide this)
- Need to keep in sync (validation catches mismatches)

**Alternative Rejected**: Single file with embedded ASCII
- Would mix JSON and ASCII in awkward ways
- Harder to read and edit
- Poor markdown rendering

---

## Component Hierarchy

### Component Types

uxscii defines standard component types:

**Interactive**:
- `button` - Clickable action triggers
- `input` - Text entry fields (text, email, password, etc.)
- `checkbox` - Binary selection
- `radio` - Single selection from group
- `select` - Dropdown selection
- `slider` - Range selection
- `toggle` - Binary switch

**Display**:
- `text` - Static text content
- `heading` - Section headers
- `label` - Field labels
- `badge` - Status indicators
- `icon` - Visual symbols
- `image` - Graphic content
- `divider` - Visual separators

**Layout**:
- `container` - Groups other components
- `card` - Bordered content containers
- `modal` - Overlay dialogs
- `panel` - Collapsible sections
- `tabs` - Tabbed content switcher

**Navigation**:
- `navigation` - Menu/nav bars
- `breadcrumb` - Location indicators
- `pagination` - Page navigation
- `link` - Hyperlinks

**Feedback**:
- `alert` - Notification messages
- `toast` - Temporary notifications
- `progress` - Progress indicators
- `spinner` - Loading indicators

**Data**:
- `list` - Ordered/unordered lists
- `table` - Tabular data
- `tree` - Hierarchical data
- `chart` - Data visualizations

**Forms**:
- `form` - Complete form containers
- `fieldset` - Grouped form fields
- `legend` - Fieldset labels

**Custom**:
- `custom` - Any component not fitting standard types

### Atomic vs Composite

**Atomic Components**:
- Self-contained, no component dependencies
- Examples: button, input, badge, icon
- Building blocks for composition

**Composite Components**:
- Contain or reference other components
- Examples: form (inputs + buttons), card (container + content)
- Higher-level abstractions

**Screens**:
- Top-level compositions
- Always use `type: "container"`
- Reference multiple components
- Represent complete user-facing views

### Dependency Order

When creating multiple components, follow dependency order:

```
Atomic (no dependencies)
  ↓
Composite (reference atomic)
  ↓
Screens (reference composite + atomic)
```

**Example**:
```
1. button (atomic)
2. input (atomic)
3. form (composite: contains button + input)
4. login-screen (screen: contains form)
```

---

## Schema Design

### JSON Schema Validation

**Location**: `data/schema/uxm-component.schema.json`

**Purpose**: Definitive validation rules for all `.uxm` files

**Schema Version**: Draft-07 JSON Schema

### Key Schema Decisions

#### Required Fields

**Always required**:
- `id` - Unique identifier
- `type` - Component type
- `version` - Semantic version
- `metadata` - At minimum: name, created, modified
- `props` - Even if empty object
- `ascii` - Template reference

**Optional but recommended**:
- `behavior` - States, interactions, accessibility
- `layout` - Positioning, spacing
- `extends` - Component inheritance
- `slots` - Content slots for composition

#### Field Constraints

**ID Format**:
```
Pattern: ^[a-z0-9]+(?:-[a-z0-9]+)*$
Length: 2-64 characters
Example: submit-button, email-input, user-profile-card
```

**Version Format**:
```
Pattern: ^\d+\.\d+\.\d+$
Example: 1.0.0, 2.1.3
```

**Timestamp Format**:
```
Format: ISO 8601 (date-time)
Example: 2024-10-11T12:00:00Z
```

**ASCII Dimensions**:
```
width: 1-120 (reasonable terminal width)
height: 1-50 (single viewport without scrolling)
```

#### Extensibility

**Custom fields allowed**:
```json
{
  "id": "my-component",
  "type": "button",
  "version": "1.0.0",
  "customField": "Custom data here"
}
```

**Validation**: Schema uses `additionalProperties: true` for extensibility

**Why**: Allows project-specific metadata without breaking validation

### Validation Levels

**Level 1: Schema Validation**
- JSON structure correct
- Required fields present
- Field types match
- Patterns satisfied

**Level 2: Semantic Validation**
- Template file exists
- Variables match between .uxm and .md
- Component references exist (for composites)
- ARIA roles appropriate for type

**Level 3: Quality Validation**
- Multiple states defined
- Accessibility complete
- Metadata rich and descriptive
- Usage examples present

---

## Why Rendered Examples

### The Problem with Templates

**Templates alone don't show intent**:

````markdown
## Login Form

Email: {{userEmail}}
Password: {{userPassword}}

[{{submitButtonText}}]
````

**Questions unanswered**:
- What does userEmail look like? (john@example.com? user@domain?)
- Is submitButtonText one word or phrase? ("Submit"? "Sign In"?)
- What's the visual spacing? (how much padding?)

### The Solution: Rendered Examples

**Rendered example shows reality**:

````markdown
## Login Form - Rendered Example

╭────────────────────────────────────╮
│     Welcome Back!                  │
│                                    │
│  Email                             │
│  ┌──────────────────────────────┐ │
│  │ sarah.johnson@example.com    │ │
│  └──────────────────────────────┘ │
│                                    │
│  Password                          │
│  ┌──────────────────────────────┐ │
│  │ ••••••••                     │👁│
│  └──────────────────────────────┘ │
│                                    │
│  ╭──────────────────────────╮     │
│  │      Sign In             │     │
│  ╰──────────────────────────╯     │
│                                    │
│  Forgot password? | Sign up        │
╰────────────────────────────────────╯

Data shown:
- Email: sarah.johnson@example.com
- Password: 8 characters (masked)
- Button: "Sign In" (not "Submit")
- Links: Forgot password, Sign up
````

**Now we know**:
- Email format (first.last@domain.com)
- Password length (8 chars visible as ••••••••)
- Button text ("Sign In", not generic "Submit")
- Layout spacing and alignment
- Additional UI elements (forgot password link)

### Three-File System for Screens

**For every screen**:

1. **`{screen}.uxm`** - Metadata with component references
2. **`{screen}.md`** - Template with `{{variables}}`
3. **`{screen}.rendered.md`** - Example with REAL data

**Why only screens, not components?**
- Components are atomic, variables are obvious
- Screens are complex, composition needs demonstration
- Screens show user flows and data context

### Real Data Guidelines

**Good real data**:
- Names: Sarah Johnson, John Doe, Mike Smith (realistic, diverse)
- Emails: sarah.johnson@example.com (proper format)
- Dates: October 11, 2024 or 2024-10-11T15:30:00Z
- Times: 2 minutes ago, 5 hours ago
- Numbers: $24,567 (formatted), 1,234 (comma-separated)
- Percentages: +12.5% (with direction indicator)

**Bad real data**:
- Names: User 1, Test User, {{userName}}
- Emails: test@test.com, user@example
- Dates: 01/01/2020, 2020-01-01 (ambiguous format)
- Times: {{timestamp}}, recent
- Numbers: 12345 (unformatted), ${revenue}
- Percentages: 12.5 (no direction or context)

---

## Agent Architecture

### Why Agents vs Just Commands?

**Commands are for quick tasks**:
- Create one component
- Browse library
- Build one screen

**Agents are for complex workflows**:
- Create entire design systems (10+ components)
- Multi-screen composition
- Autonomous decision-making

### Agent Design Pattern

All agents follow this structure:

**Frontmatter**:
```yaml
---
description: One-line agent purpose
version: 1.0.0
tools: [Read, Write, Edit, Glob, Grep, Bash, TodoWrite]
---
```

**Sections**:
1. **Mission** - What this agent does
2. **Core Responsibilities** - Specific duties
3. **Workflow** - Step-by-step process (usually 4-6 phases)
4. **Resources** - Documentation and examples available
5. **Quality Standards** - What "done" looks like
6. **Success Criteria** - How to know agent succeeded

### Agent Autonomy Guidelines

**Agents should**:
- Make reasonable decisions without asking (button → primary-button, secondary-button)
- Reference documentation when unsure (load data/docs/)
- Use TodoWrite to track multi-step workflows
- Validate their own work before reporting
- Provide comprehensive summaries

**Agents should NOT**:
- Ask user for every minor decision ("Should this be blue or green?")
- Proceed without validating assumptions about requirements
- Create partial work and stop
- Skip documentation steps

### Agent Communication

**Agents report in structured format**:

```
# AGENT NAME Session Summary

## Request
[What user asked for]

## What Was Created
[Detailed list with checkmarks]

## Validation Results
[Pass/fail by category]

## Issues/Warnings
[What needs attention]

## Next Steps
[What user should do]
```

**Why this format**:
- Scannable with clear sections
- Shows work completed
- Highlights problems
- Guides next actions

---

## Extension Points

### Hooks (Future)

**Location**: `hooks/`

**Purpose**: Execute custom code on events

**Potential Events**:
- `on-component-create` - After component creation
- `on-component-validate` - During validation
- `on-screen-render` - When generating rendered examples
- `on-plugin-load` - When plugin initializes

**Example Hook**:
```json
{
  "event": "on-component-create",
  "command": "node scripts/notify-team.js {{filePath}}"
}
```

### MCP Servers (Future)

**Location**: `mcp/`

**Purpose**: Integrate external services

**Potential Integrations**:
- Design system API sync
- Component library CDN upload
- Analytics tracking
- Team collaboration features

### Helpers (Future)

**Location**: `data/helpers/`

**Purpose**: Reusable utility scripts

**Potential Helpers**:
- `ascii-preview.js` - Render ASCII to image
- `component-diff.js` - Compare component versions
- `bulk-validate.js` - Validate entire directories
- `export-html.js` - Export to HTML/CSS

---

## Performance Considerations

### Context Token Optimization

**Problem**: Loading all docs consumes 10k+ tokens upfront

**Solution**: Modular documentation with lazy loading

**Strategy**:
```
Task: Create component
Load: 01-quick-start.md (400 tokens)
Skip: Screen composition docs (3000 tokens saved)

Task: Create screen
Load: 04-screen-composition.md (600 tokens)
Skip: Validation docs (2000 tokens saved)

Task: Validate
Load: 05-validation-guide.md (800 tokens)
Skip: Creation docs (2500 tokens saved)
```

**Index file** (`00-INDEX.md`):
- Lists all docs with token counts
- Recommends loading strategies
- Prevents over-loading

### File System Operations

**Batch operations**:
```javascript
// Bad: N file reads
for (component of components) {
  read(component.uxm)
  read(component.md)
}

// Good: Parallel reads
const files = await Promise.all([
  ...components.map(c => read(c.uxm)),
  ...components.map(c => read(c.md))
])
```

**Cache bundled assets**:
- Examples don't change during session
- Schema doesn't change during session
- Load once, reference many times

### Validation Performance

**Incremental validation**:
```
User creates 1 component
→ Validate only that component

User creates 10 components
→ Validate all, check consistency

User modifies 1 component
→ Re-validate only that one
```

**Schema validation caching**:
- Compile JSON Schema once per session
- Reuse compiled validator for all components

---

## Design Decisions Record

### Decision 1: Two Files vs One File

**Options Considered**:
1. Single file with embedded ASCII in JSON string
2. Single file with markdown sections
3. Two files (.uxm + .md)

**Chosen**: Option 3 (two files)

**Reasoning**:
- Clean separation of concerns
- Better git diffs (ASCII changes vs metadata changes)
- Markdown files render beautifully on GitHub
- AI can generate each independently
- Easier to edit ASCII in proper markdown editors

**Trade-offs Accepted**:
- Two files to manage
- Must keep in sync (but validation catches drift)

### Decision 2: Command Naming

**Options Considered**:
1. `/uxscii-create`, `/uxscii-library` (standard-focused)
2. `/create-component`, `/browse-library` (generic)
3. `/fluxwing-create`, `/fluxwing-library` (bot-focused)

**Chosen**: Option 3 (fluxwing prefix)

**Reasoning**:
- Distinguishes bot (Fluxwing) from standard (uxscii)
- Makes it clear you're invoking the Fluxwing bot
- Allows uxscii standard to be tool-agnostic
- Prevents naming conflicts with other plugins

**Trade-offs Accepted**:
- Longer command names
- Must teach distinction between Fluxwing and uxscii

### Decision 3: Bundled Examples Count

**Options Considered**:
1. 5 basic examples (minimal)
2. ~10 curated examples (selected)
3. All 30+ original examples (comprehensive)

**Chosen**: Option 2 (11 curated examples)

**Reasoning**:
- Covers major component categories (button, input, card, modal, etc.)
- Demonstrates key patterns without overwhelming
- Reasonable plugin size (~100KB)
- Users can create additional as needed

**Trade-offs Accepted**:
- Some edge cases not covered (but docs show how to create them)

### Decision 4: Rendered Examples for All vs Screens Only

**Options Considered**:
1. Rendered examples for components and screens
2. Rendered examples for screens only
3. No rendered examples (templates only)

**Chosen**: Option 2 (screens only)

**Reasoning**:
- Component variables are usually obvious (button with "text" prop = button text)
- Screen composition is complex and benefits from seeing real layout
- Reduces file count (22 component files not 33)
- Screens show data context better

**Trade-offs Accepted**:
- Very complex components might benefit from rendered examples
- Users can create their own rendered examples if needed

### Decision 5: Modular vs Monolithic Documentation

**Options Considered**:
1. Single comprehensive guide (one 30KB file)
2. Modular guides with index (multiple small files)
3. Inline documentation in schema/examples only

**Chosen**: Option 2 (modular with index)

**Reasoning**:
- Saves context tokens (load only what's needed)
- Faster to navigate for humans
- Agent can load task-specific docs
- Still have full guides available for deep-dives

**Trade-offs Accepted**:
- More files to maintain
- Need index to navigate
- Potential for duplication between modules

---

## Future Enhancements

### Planned Features

1. **Component Variants**:
   - Size variants (small, medium, large)
   - Theme variants (light, dark)
   - Brand variants (primary, secondary, accent)

2. **Responsive Design**:
   - Breakpoint definitions
   - Mobile/desktop layouts
   - Adaptive component sizing

3. **Animation Support**:
   - Transition definitions
   - State change animations
   - Loading animations

4. **Component Library Sync**:
   - Import from design systems
   - Export to component libraries
   - Version management

5. **Collaboration Features**:
   - Component comments
   - Review workflows
   - Team libraries

### Extension Opportunities

**Plugin Ecosystem**:
- Theme plugins (material, bootstrap, tailwind)
- Industry plugins (healthcare, finance, e-commerce)
- Framework plugins (react, vue, svelte)
- Export plugins (HTML, React components, Figma)

**AI Enhancements**:
- Screenshot-to-uxscii conversion
- Figma-to-uxscii import
- Accessibility auto-audit
- Design suggestion engine

---

## See Also

- **README.md** - High-level plugin overview
- **COMMANDS.md** - Slash command reference
- **AGENTS.md** - Autonomous agent reference
- **CONTRIBUTING.md** - How to extend and contribute
- **TROUBLESHOOTING.md** - Common issues and solutions
- **data/docs/02-core-concepts.md** - uxscii fundamentals
- **data/schema/uxm-component.schema.json** - Complete schema definition
