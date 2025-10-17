# Fluxwing Plugin to Skills Migration Plan

## Overview

Convert the Fluxwing Claude Code plugin from a plugin-based architecture to a skills-based architecture. This migration will make Fluxwing's capabilities discoverable and automatically activated by Claude based on natural language requests, eliminating the need for slash commands and plugin-specific syntax.

## Current State Analysis

### Existing Plugin Structure

```
fluxwing/
├── .claude-plugin/          # Plugin manifest
├── commands/                # 6 slash commands
│   ├── fluxwing-create.md
│   ├── fluxwing-expand-component.md
│   ├── fluxwing-get.md
│   ├── fluxwing-import-screenshot.md
│   ├── fluxwing-library.md
│   └── fluxwing-scaffold.md
├── agents/                  # 7 specialized agents
│   ├── fluxwing-composer.md
│   ├── fluxwing-designer.md
│   ├── screenshot-component-detection.md
│   ├── screenshot-component-generator.md
│   ├── screenshot-layout-discovery.md
│   ├── screenshot-vision-coordinator.md
│   └── screenshot-visual-properties.md
└── data/                    # All uxscii assets (portable)
    ├── schema/              # JSON Schema
    ├── examples/            # 11 component templates
    ├── screens/             # 2 screen examples
    └── docs/                # Modular documentation
```

### Key Characteristics

**Plugin Commands:**
- User invokes with `/fluxwing-*` prefix
- Explicit, manual activation
- Single-file markdown structure
- Plugin-system dependent

**Plugin Agents:**
- Spawned by commands via `Task` tool
- Specialized, focused workflows
- Referenced as `fluxwing:agent-name`
- Complex multi-step processes

**Data Location:**
- Bundled templates: `{PLUGIN_ROOT}/data/` (READ-ONLY)
- User workspace: `./fluxwing/` (READ-WRITE)
- Clear separation between reference and output

## Desired End State

### Target Skill Architecture

```
.claude/skills/
├── uxscii-component-creator/
│   ├── SKILL.md
│   ├── templates/           # Moved from plugin data
│   ├── schemas/             # Moved from plugin data
│   └── docs/                # Subset of docs needed
├── uxscii-component-expander/
│   ├── SKILL.md
│   └── docs/                # State pattern docs
├── uxscii-screen-scaffolder/
│   ├── SKILL.md
│   ├── templates/           # Screen examples
│   └── docs/                # Screen composition docs
├── uxscii-library-browser/
│   ├── SKILL.md
│   └── docs/                # Library guide
├── uxscii-component-viewer/
│   ├── SKILL.md
│   └── docs/                # Component details guide
└── uxscii-screenshot-importer/
    ├── SKILL.md
    └── docs/                # Screenshot workflow docs
```

### How to Verify Success

**Automated Verification:**
- [x] All SKILL.md files have valid YAML frontmatter: `head -n 10 SKILL.md | python -c "import yaml; yaml.safe_load(open('/dev/stdin'))"`
- [x] Skill directories exist: `ls .claude/skills/uxscii-*/SKILL.md`
- [x] Supporting files copied: `find .claude/skills/uxscii-* -name "*.uxm" -o -name "*.schema.json"`
- [x] No references to `{PLUGIN_ROOT}` in SKILL.md files (docs may reference it for context)
- [x] All skills use `{SKILL_ROOT}`: `grep -r "SKILL_ROOT" .claude/skills/`

**Manual Verification:**
- [ ] Say "Create a button" → Skill activates automatically (no `/` prefix)
- [ ] Say "Show me all components" → Library browser activates
- [ ] Say "Add hover state to my button" → Component expander activates
- [ ] Say "Build a login screen" → Screen scaffolder activates
- [ ] Skills load and execute without errors
- [ ] Supporting files (templates, schemas) are accessible
- [ ] File creation works in user's project workspace

## What We're NOT Doing

- **Not converting agents to skills** - Agents remain as specialized workers invoked by skills
- **Not changing the uxscii standard** - The format remains the same
- **Not modifying the data structure** - .uxm and .md files stay identical
- **Not breaking existing workflows** - Users can still do everything they could before
- **Not requiring users to migrate old components** - Existing components work as-is
- **Not removing slash commands** - They can coexist with skills during transition

## Implementation Approach

### High-Level Strategy

1. **Map plugin commands to skills** - Each command becomes a discoverable skill
2. **Preserve agent architecture** - Skills invoke agents, agents do specialized work
3. **Relocate data files** - Move templates/schemas from plugin to skill directories
4. **Update file references** - Change `{PLUGIN_ROOT}` to `{SKILL_ROOT}`
5. **Write discoverable descriptions** - Enable natural language activation
6. **Test discovery and execution** - Verify skills activate on natural requests

### Migration Sequence

The migration will proceed in **6 phases**, creating one skill at a time with full testing before moving to the next:

1. **Phase 1**: Component Creator (most commonly used)
2. **Phase 2**: Library Browser (simple, read-only)
3. **Phase 3**: Component Expander (moderate complexity)
4. **Phase 4**: Screen Scaffolder (complex, multi-agent)
5. **Phase 5**: Component Viewer (simple lookup)
6. **Phase 6**: Screenshot Importer (complex vision workflow)

---

## Phase 1: Component Creator Skill

### Overview

Convert `/fluxwing-create` command to a discoverable skill that creates uxscii components.

### Changes Required

#### 1. Create Skill Directory

**Directory**: `.claude/skills/uxscii-component-creator/`

**Structure**:
```
uxscii-component-creator/
├── SKILL.md                 # Main skill instructions
├── templates/               # Component templates (from plugin)
│   ├── button.uxm
│   ├── button.md
│   ├── input.uxm
│   ├── input.md
│   ├── card.uxm
│   ├── card.md
│   └── [all 11 templates from plugin/data/examples/]
├── schemas/                 # Validation schemas
│   └── uxm-component.schema.json
└── docs/                    # Relevant documentation
    ├── 03-component-creation.md
    ├── 06-ascii-patterns.md
    └── 07-schema-reference.md
```

#### 2. Create SKILL.md

**File**: `.claude/skills/uxscii-component-creator/SKILL.md`

**Frontmatter**:
```yaml
---
name: UXscii Component Creator
description: Create uxscii components with ASCII art and structured metadata when user wants to create, build, or design UI components like buttons, inputs, cards, forms, modals, or navigation
version: 1.0.0
author: Trabian
allowed-tools: Read, Write, Edit, Glob, Grep, Task, TodoWrite
---
```

**Content Structure**:
- Your Role
- Data Location Rules (READ from {SKILL_ROOT}/templates/, WRITE to ./fluxwing/components/)
- Your Task
- Workflow (adapted from command markdown)
  - Step 1: Parse Request & Gather Requirements
  - Step 2: Check for Similar Templates
  - Step 3a: Spawn Designer Agent (Single Component)
  - Step 3b: Spawn Designer Agents (Multiple Components - IN PARALLEL)
  - Step 4: Report Success
- Example Interactions
- Benefits of Using Designer Agent
- Performance Benefits
- Error Handling
- Success Criteria

**Key Transformations**:
```markdown
<!-- Plugin command -->
READ from: {PLUGIN_ROOT}/data/examples/

<!-- Skill -->
READ from: {SKILL_ROOT}/templates/
```

#### 3. Copy Supporting Files

**Templates**:
```bash
cp fluxwing/data/examples/*.uxm .claude/skills/uxscii-component-creator/templates/
cp fluxwing/data/examples/*.md .claude/skills/uxscii-component-creator/templates/
```

**Schemas**:
```bash
cp fluxwing/data/schema/uxm-component.schema.json .claude/skills/uxscii-component-creator/schemas/
```

**Documentation**:
```bash
cp fluxwing/data/docs/03-component-creation.md .claude/skills/uxscii-component-creator/docs/
cp fluxwing/data/docs/06-ascii-patterns.md .claude/skills/uxscii-component-creator/docs/
cp fluxwing/data/docs/07-schema-reference.md .claude/skills/uxscii-component-creator/docs/
```

#### 4. Update Agent References

**In SKILL.md**, when spawning designer agent:

```typescript
// OLD (plugin pattern)
Task({
  subagent_type: "fluxwing:fluxwing-designer",
  description: "Create single uxscii component",
  prompt: "..."
})

// NEW (skill pattern - agent still exists in plugin)
// Note: During transition, agents remain in plugin
Task({
  subagent_type: "fluxwing:fluxwing-designer",
  description: "Create single uxscii component",
  prompt: "..."
})
```

**Future consideration**: Agents could potentially become skills too, but that's out of scope for this migration.

### Success Criteria

#### Automated Verification:
- [x] YAML validates: `head -n 10 .claude/skills/uxscii-component-creator/SKILL.md | python -c "import yaml; yaml.safe_load(open('/dev/stdin'))"`
- [x] All templates exist: `ls .claude/skills/uxscii-component-creator/templates/*.uxm | wc -l` (should be 11)
- [x] Schema exists: `test -f .claude/skills/uxscii-component-creator/schemas/uxm-component.schema.json`
- [x] No PLUGIN_ROOT refs: `grep -L "PLUGIN_ROOT" .claude/skills/uxscii-component-creator/SKILL.md`
- [x] Uses SKILL_ROOT: `grep "SKILL_ROOT" .claude/skills/uxscii-component-creator/SKILL.md`

#### Manual Verification:
- [ ] Trigger: "Create a button" → Skill activates
- [ ] Trigger: "I need an input component" → Skill activates
- [ ] Trigger: "Design a card" → Skill activates
- [ ] Files created in ./fluxwing/components/ (not in skill directory)
- [ ] Templates readable from {SKILL_ROOT}/templates/
- [ ] Schema validation works

---

## Phase 2: Library Browser Skill

### Overview

Convert `/fluxwing-library` command to a discoverable skill that browses available components.

### Changes Required

#### 1. Create Skill Directory

**Directory**: `.claude/skills/uxscii-library-browser/`

**Structure**:
```
uxscii-library-browser/
├── SKILL.md
└── docs/
    └── 07-examples-guide.md
```

#### 2. Create SKILL.md

**File**: `.claude/skills/uxscii-library-browser/SKILL.md`

**Frontmatter**:
```yaml
---
name: UXscii Library Browser
description: Browse and view all available uxscii components including bundled templates, user components, and screens when user wants to see, list, browse, or search components
version: 1.0.0
author: Trabian
allowed-tools: Read, Glob, Grep
---
```

**Content Structure**:
- Your Role (Component librarian)
- Data Location Rules
  - READ from bundled templates: {SKILL_ROOT}/../../uxscii-component-creator/templates/
  - READ from user components: ./fluxwing/components/
  - READ from user library: ./fluxwing/library/
  - READ from user screens: ./fluxwing/screens/
- Your Task (Display available components)
- Display Format (hierarchical tree view)
- Interactive Options
- Detailed View
- Copy Template to Project
- Search Functionality
- Empty Library Handling
- Resources
- Important Notes

**Key Challenge**: This skill needs to reference templates from the creator skill. Solution:

```markdown
## Data Location Rules

**READ from (bundled templates - shared across skills):**
- `{SKILL_ROOT}/../uxscii-component-creator/templates/` - Component templates
- `./fluxwing/components/` - User components
- `./fluxwing/library/` - Customized templates
- `./fluxwing/screens/` - User screens
```

#### 3. Copy Supporting Files

**Documentation**:
```bash
cp fluxwing/data/docs/07-examples-guide.md .claude/skills/uxscii-library-browser/docs/
```

### Success Criteria

#### Automated Verification:
- [x] YAML validates
- [x] Skill exists: `test -f .claude/skills/uxscii-library-browser/SKILL.md`
- [x] Read-only tools: `grep "allowed-tools: Read, Glob, Grep" .claude/skills/uxscii-library-browser/SKILL.md`

#### Manual Verification:
- [ ] Trigger: "Show me all components" → Skill activates
- [ ] Trigger: "What components are available?" → Skill activates
- [ ] Trigger: "Browse the library" → Skill activates
- [ ] Displays bundled templates correctly
- [ ] Displays user components if they exist
- [ ] Search functionality works

---

## Phase 3: Component Expander Skill

### Overview

Convert `/fluxwing-expand-component` command to a discoverable skill that adds interaction states to components.

### Changes Required

#### 1. Create Skill Directory

**Directory**: `.claude/skills/uxscii-component-expander/`

**Structure**:
```
uxscii-component-expander/
├── SKILL.md
└── docs/
    ├── 03-component-creation.md
    └── 06-ascii-patterns.md
```

#### 2. Create SKILL.md

**File**: `.claude/skills/uxscii-component-expander/SKILL.md`

**Frontmatter**:
```yaml
---
name: UXscii Component Expander
description: Add interaction states like hover, focus, disabled, active, error to existing uxscii components when user wants to expand, enhance, or add states to components
version: 1.0.0
author: Trabian
allowed-tools: Read, Write, Edit, Glob, Grep
---
```

**Content Structure**:
- Your Role
- Data Location Rules
  - READ from: ./fluxwing/components/, ./fluxwing/library/
  - WRITE to: ./fluxwing/components/, ./fluxwing/library/ (overwrite)
- Your Task
- Workflow
  - 1. Locate Component
  - 2. Determine States to Add (smart defaults by type)
  - 3. Read Existing Component Files
  - 4. Generate New States
  - 5. Update Files
  - 6. Confirm Expansion
- Resources Available
- Example Interactions
- Quality Standards
- Important Notes
- Error Handling

#### 3. Copy Supporting Files

**Documentation**:
```bash
cp fluxwing/data/docs/03-component-creation.md .claude/skills/uxscii-component-expander/docs/
cp fluxwing/data/docs/06-ascii-patterns.md .claude/skills/uxscii-component-expander/docs/
```

### Success Criteria

#### Automated Verification:
- [x] YAML validates
- [x] Skill exists: `test -f .claude/skills/uxscii-component-expander/SKILL.md`
- [x] Can modify files: `grep "Write, Edit" .claude/skills/uxscii-component-expander/SKILL.md`

#### Manual Verification:
- [ ] Trigger: "Add hover state to my button" → Skill activates
- [ ] Trigger: "Expand email-input with focus and error" → Skill activates
- [ ] Trigger: "Make this component interactive" → Skill activates
- [ ] Correctly reads existing component
- [ ] Adds new states without losing existing data
- [ ] Updates modification timestamp
- [ ] ASCII patterns match state properties

---

## Phase 4: Screen Scaffolder Skill

### Overview

Convert `/fluxwing-scaffold` command to a discoverable skill that builds complete screens.

### Changes Required

#### 1. Create Skill Directory

**Directory**: `.claude/skills/uxscii-screen-scaffolder/`

**Structure**:
```
uxscii-screen-scaffolder/
├── SKILL.md
├── templates/               # Screen examples
│   ├── login-screen.uxm
│   ├── login-screen.md
│   ├── login-screen.rendered.md
│   ├── dashboard.uxm
│   ├── dashboard.md
│   └── dashboard.rendered.md
└── docs/
    └── 04-screen-composition.md
```

#### 2. Create SKILL.md

**File**: `.claude/skills/uxscii-screen-scaffolder/SKILL.md`

**Frontmatter**:
```yaml
---
name: UXscii Screen Scaffolder
description: Build complete UI screens by composing multiple components when user wants to create, scaffold, or build screens like login, dashboard, profile, settings, checkout pages
version: 1.0.0
author: Trabian
allowed-tools: Read, Write, Glob, Grep, Task, TodoWrite
---
```

**Content Structure**:
- Your Role
- Data Location Rules
  - READ from: {SKILL_ROOT}/../uxscii-component-creator/templates/, ./fluxwing/components/, ./fluxwing/library/
  - WRITE to: ./fluxwing/screens/
- Your Task (Orchestrate designer + composer agents)
- Workflow
  - Step 1: Understand the Screen
  - Step 2: Component Inventory
  - Step 3: Create Missing Components (spawn designer agent)
  - Step 4: Compose Screen (spawn composer agent)
  - Step 5: Report Results
- Parallel Execution Strategy
- Example Interaction
- Error Handling
- Success Criteria

**Key Point**: This skill orchestrates multiple agents:
1. Designer agent creates missing components
2. Composer agent assembles the screen

#### 3. Copy Supporting Files

**Templates**:
```bash
cp fluxwing/data/screens/*.uxm .claude/skills/uxscii-screen-scaffolder/templates/
cp fluxwing/data/screens/*.md .claude/skills/uxscii-screen-scaffolder/templates/
```

**Documentation**:
```bash
cp fluxwing/data/docs/04-screen-composition.md .claude/skills/uxscii-screen-scaffolder/docs/
```

### Success Criteria

#### Automated Verification:
- [x] YAML validates
- [x] Skill exists: `test -f .claude/skills/uxscii-screen-scaffolder/SKILL.md`
- [x] Screen templates exist: `ls .claude/skills/uxscii-screen-scaffolder/templates/*.uxm | wc -l` (should be 2)
- [x] Can spawn agents: `grep "Task" .claude/skills/uxscii-screen-scaffolder/SKILL.md`

#### Manual Verification:
- [ ] Trigger: "Create a login screen" → Skill activates
- [ ] Trigger: "Build a dashboard" → Skill activates
- [ ] Trigger: "Scaffold a profile page" → Skill activates
- [ ] Correctly inventories existing components
- [ ] Spawns designer agent for missing components
- [ ] Spawns composer agent for screen assembly
- [ ] Creates .uxm, .md, and .rendered.md files
- [ ] Screens saved to ./fluxwing/screens/

---

## Phase 5: Component Viewer Skill

### Overview

Convert `/fluxwing-get` command to a discoverable skill that shows component details.

### Changes Required

#### 1. Create Skill Directory

**Directory**: `.claude/skills/uxscii-component-viewer/`

**Structure**:
```
uxscii-component-viewer/
├── SKILL.md
└── docs/
    └── 02-core-concepts.md
```

#### 2. Create SKILL.md

**File**: `.claude/skills/uxscii-component-viewer/SKILL.md`

**Frontmatter**:
```yaml
---
name: UXscii Component Viewer
description: View detailed information about a specific uxscii component including metadata, states, props, and ASCII preview when user wants to see, view, inspect, or get details about a component
version: 1.0.0
author: Trabian
allowed-tools: Read, Glob, Grep
---
```

**Content Structure**:
- Your Role
- Data Location Rules
  - READ from all component sources (bundled, user, library)
- Your Task (Display component details)
- Display Format
  - Component metadata
  - Props and states
  - Accessibility info
  - ASCII preview for each state
- Search and Fuzzy Matching
- Interactive Options
- Example Interaction
- Error Handling

#### 3. Copy Supporting Files

**Documentation**:
```bash
cp fluxwing/data/docs/02-core-concepts.md .claude/skills/uxscii-component-viewer/docs/
```

### Success Criteria

#### Automated Verification:
- [x] YAML validates
- [x] Skill exists: `test -f .claude/skills/uxscii-component-viewer/SKILL.md`
- [x] Read-only: `grep "allowed-tools: Read, Glob, Grep" .claude/skills/uxscii-component-viewer/SKILL.md`

#### Manual Verification:
- [ ] Trigger: "Show me the submit-button" → Skill activates
- [ ] Trigger: "What's in the primary-button component?" → Skill activates
- [ ] Trigger: "View component details for card" → Skill activates
- [ ] Displays all metadata correctly
- [ ] Shows ASCII preview for all states
- [ ] Fuzzy search works for component names

---

## Phase 6: Screenshot Importer Skill

### Overview

Convert `/fluxwing-import-screenshot` command to a discoverable skill that generates components from UI screenshots.

### Changes Required

#### 1. Create Skill Directory

**Directory**: `.claude/skills/uxscii-screenshot-importer/`

**Structure**:
```
uxscii-screenshot-importer/
├── SKILL.md
└── docs/
    ├── screenshot-import-ascii.md
    ├── screenshot-import-examples.md
    ├── screenshot-import-helpers.md
    ├── screenshot-data-merging.md
    ├── screenshot-screen-generation.md
    └── screenshot-validation-functions.md
```

#### 2. Create SKILL.md

**File**: `.claude/skills/uxscii-screenshot-importer/SKILL.md`

**Frontmatter**:
```yaml
---
name: UXscii Screenshot Importer
description: Import UI screenshots and generate uxscii components automatically using vision analysis when user wants to import, convert, or generate components from screenshots or images
version: 1.0.0
author: Trabian
allowed-tools: Read, Write, Task, TodoWrite, Glob
---
```

**Content Structure**:
- Your Role
- Data Location Rules
  - READ from: screenshot paths provided by user
  - WRITE to: ./fluxwing/components/
- Your Task (Orchestrate vision agents)
- Workflow
  - Step 1: Validate Screenshot
  - Step 2: Spawn Vision Coordinator Agent
  - Step 3: Process Results
  - Step 4: Generate Components
  - Step 5: Report Success
- Vision Agents Used
  - screenshot-vision-coordinator (orchestrator)
  - screenshot-component-detection
  - screenshot-layout-discovery
  - screenshot-visual-properties
  - screenshot-component-generator
- Example Interaction
- Quality Standards
- Error Handling
- Success Criteria

**Key Point**: This is the most complex skill - it orchestrates 5 vision agents:
1. Vision coordinator (orchestrates the analysis)
2. Component detection (finds UI elements)
3. Layout discovery (understands structure)
4. Visual properties (extracts styling)
5. Component generator (creates .uxm/.md files)

#### 3. Copy Supporting Files

**Documentation**:
```bash
cp fluxwing/data/docs/screenshot-*.md .claude/skills/uxscii-screenshot-importer/docs/
```

### Success Criteria

#### Automated Verification:
- [x] YAML validates
- [x] Skill exists: `test -f .claude/skills/uxscii-screenshot-importer/SKILL.md`
- [x] Can spawn agents: `grep "Task" .claude/skills/uxscii-screenshot-importer/SKILL.md`
- [x] All screenshot docs exist: `ls .claude/skills/uxscii-screenshot-importer/docs/screenshot-*.md | wc -l` (should be 6)

#### Manual Verification:
- [ ] Trigger: "Import this screenshot" → Skill activates
- [ ] Trigger: "Generate components from this UI image" → Skill activates
- [ ] Trigger: "Convert screenshot to uxscii" → Skill activates
- [ ] Correctly reads screenshot file
- [ ] Spawns vision coordinator agent
- [ ] Generates components from detected UI elements
- [ ] Creates valid .uxm and .md files
- [ ] Components saved to ./fluxwing/components/

---

## Testing Strategy

### Discovery Testing

For each skill, test natural language activation:

**Component Creator:**
- "Create a button"
- "I need an input field"
- "Design a card component"
- "Build a modal"

**Library Browser:**
- "Show me all components"
- "What components are available?"
- "List the library"
- "Browse components"

**Component Expander:**
- "Add hover state to button"
- "Expand email-input with focus"
- "Make card interactive"
- "Add disabled state"

**Screen Scaffolder:**
- "Create a login screen"
- "Build a dashboard"
- "Scaffold a profile page"
- "Design a checkout flow"

**Component Viewer:**
- "Show me the button details"
- "View primary-button"
- "What's in the card component?"
- "Inspect email-input"

**Screenshot Importer:**
- "Import this screenshot"
- "Convert UI to components"
- "Generate from screenshot"
- "Analyze this image"

### Functionality Testing

For each skill:

1. **Unit test** - Skill activates and loads correctly
2. **Integration test** - Skill invokes agents correctly
3. **File operation test** - Creates files in correct locations
4. **Data reference test** - Reads from {SKILL_ROOT} correctly
5. **Error handling test** - Gracefully handles failures

### Regression Testing

Ensure existing functionality still works:

1. **Component creation** - Create button, input, card
2. **Screen composition** - Build login screen
3. **State expansion** - Add hover to button
4. **Library browsing** - List all components
5. **Screenshot import** - Process UI screenshot

### Performance Testing

Compare skill activation speed vs. slash commands:

- **Cold start** - First activation time
- **Warm start** - Subsequent activation time
- **Agent spawn time** - Time to invoke designer/composer agents
- **File creation time** - Time to write .uxm/.md files

---

## Migration Notes

### Coexistence Strategy

**During transition**, both systems can coexist:

```
User options:
1. Use slash commands: /fluxwing-create button
2. Use natural language: "Create a button" (activates skill)

Both invoke the same underlying agents!
```

**After full migration**, slash commands can be:
- Kept for backwards compatibility
- Deprecated with warning messages
- Removed in a major version bump

### Data Migration

**No data migration needed!** Existing components work as-is:

```
./fluxwing/components/
├── submit-button.uxm      # Works with both plugin and skills
├── submit-button.md       # No changes needed
```

### Agent Preservation

**Agents remain in plugin directory** during initial migration:

```
fluxwing/agents/
├── fluxwing-designer.md      # Still invoked by skills
├── fluxwing-composer.md      # Still invoked by skills
└── screenshot-*.md           # Still invoked by skills
```

**Future consideration**: Agents could become skills themselves, but that's phase 2.

### Template Sharing

**Challenge**: Multiple skills need access to component templates.

**Solution**: Reference from component creator skill:

```
# In library browser skill
READ from: {SKILL_ROOT}/../uxscii-component-creator/templates/

# In screen scaffolder skill
READ from: {SKILL_ROOT}/../uxscii-component-creator/templates/
```

**Alternative**: Create a shared `~/.claude/skills/uxscii-shared/` directory.

---

## Performance Considerations

### Skill Discovery

**Concern**: Does skill discovery add latency?

**Mitigation**:
- Skill descriptions are indexed once
- Activation is near-instantaneous
- No performance penalty vs. slash commands

### File Loading

**Concern**: Loading templates on every activation

**Mitigation**:
- Use lazy loading (load only when needed)
- Reference docs instead of embedding
- Keep SKILL.md under 3,000 tokens

### Agent Spawning

**Concern**: Spawning agents from skills

**Mitigation**:
- Same performance as plugin commands (no change)
- Agents still run in background
- Parallel execution where possible

---

## Rollback Plan

If migration causes issues:

1. **Keep plugin active** - Don't uninstall during transition
2. **Disable skills** - Remove .claude/skills/uxscii-* directories
3. **Revert to slash commands** - Use /fluxwing-* as before
4. **No data loss** - All user components remain intact

---

## References

### Documentation

- **Skill Reference**: docs/claude_skill_reference.md (this was our guide)
- **Plugin Structure**: fluxwing/PLUGIN_STRUCTURE.md
- **Commands Reference**: fluxwing/COMMANDS.md
- **Agents Reference**: fluxwing/AGENTS.md
- **Architecture**: fluxwing/ARCHITECTURE.md

### Related Plans

- None (first time converting this plugin)

### External Resources

- Claude Code Skills Docs: https://docs.claude.com/en/docs/claude-code/skills
- Slash Commands Docs: https://docs.claude.com/en/docs/claude-code/slash-commands

---

## Summary: The Migration Path

### What Gets Migrated

✅ **6 Commands → 6 Skills**
- fluxwing-create → uxscii-component-creator
- fluxwing-library → uxscii-library-browser
- fluxwing-expand-component → uxscii-component-expander
- fluxwing-scaffold → uxscii-screen-scaffolder
- fluxwing-get → uxscii-component-viewer
- fluxwing-import-screenshot → uxscii-screenshot-importer

✅ **Supporting Files**
- Templates: 11 component templates + 2 screen examples
- Schemas: uxm-component.schema.json
- Docs: Subset of documentation modules

### What Stays in Plugin

⏸ **Agents** (for now)
- fluxwing-designer
- fluxwing-composer
- screenshot-vision-coordinator
- screenshot-component-detection
- screenshot-layout-discovery
- screenshot-visual-properties
- screenshot-component-generator

⏸ **Full Documentation**
- Complete docs stay in fluxwing/data/docs/
- Skills copy only what they need

### The User Experience Shift

**Before (Plugin Commands):**
```
User: /fluxwing-create button
Claude: [Executes command]
```

**After (Skills):**
```
User: Create a button
Claude: [Discovers and activates uxscii-component-creator skill]
Claude: [Executes same workflow]
```

**Benefits:**
- ✅ Natural language activation
- ✅ No need to remember slash command syntax
- ✅ Discoverable based on intent
- ✅ Same underlying functionality
- ✅ No data migration needed

---

**Last updated**: 2025-10-16
**Version**: 1.0.0
