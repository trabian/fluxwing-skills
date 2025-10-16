# Component Creation Optimization - Single Default State + Expand Command

## Overview

Currently, all component creation paths generate full multi-state components (4-5 states each), which makes component creation slow. This plan introduces a two-phase approach: create components with only a single default state initially, then add a new `/fluxwing-expand-component` command to expand components with additional states on demand.

## Current State Analysis

### Component Creation Happens in 8 Locations:

**Commands:**
1. `/fluxwing-create` - Creates single components (fluxwing/commands/fluxwing-create.md)
2. `/fluxwing-scaffold` - Creates screens + missing components (fluxwing/commands/fluxwing-scaffold.md)
3. `/fluxwing-import-screenshot` - Imports screenshots and generates components (fluxwing/commands/fluxwing-import-screenshot.md)

**Agents:**
4. `screenshot-component-generator` - Generates individual component files (fluxwing/agents/screenshot-component-generator.md)
5. `fluxwing-designer` - Autonomous UX designer (fluxwing/agents/fluxwing-designer.md)
6. `fluxwing-composer` - Composes screens from components (fluxwing/agents/fluxwing-composer.md)

**Helper Functions:**
7. `generateStatesFromList()` - Creates state objects for all states (fluxwing/data/docs/screenshot-import-helpers.md:196-243)
8. `generateASCII()` - Generates ASCII for each state (fluxwing/data/docs/screenshot-import-ascii.md)

### The Multi-State Problem:

Every location currently generates ALL states immediately:
- **Primary buttons**: 4 states (default, hover, active, disabled) - fluxwing/data/examples/primary-button.uxm:20-60
- **Email inputs**: 5 states (default, focus, valid, error, disabled) - fluxwing/data/examples/email-input.uxm:28-70
- **ASCII generation loops**: `for (const state of componentData.states)` - screenshot-component-generator.md:191
- **Helper function**: `generateStatesFromList()` creates full state definitions for all states - screenshot-import-helpers.md:196-243

## Desired End State

After implementation:
1. **All component creation paths generate only default state** - MVP minimal components for fast prototyping
2. **New `/fluxwing-expand-component` command** - Adds states to existing components
3. **No backward compatibility** - Clean break, single approach
4. **Smart defaults + customization** - Predefined templates per type, user can override

### Success Criteria:

#### Automated Verification:
- [ ] Create test component: `/fluxwing-create test-button`
- [ ] Verify only default state: `grep -c '"name": "default"' ./fluxwing/components/test-button.uxm` should return 1
- [ ] Expand component: `/fluxwing-expand-component test-button`
- [ ] Verify multiple states: `grep -c '"name":' ./fluxwing/components/test-button.uxm` should return 4+
- [ ] Validate schema: Component passes JSON schema validation
- [ ] Test all creation paths: create, scaffold, screenshot-import, agents

#### Manual Verification:
- [ ] Component creation feels noticeably faster
- [ ] Default state components are usable for MVP discussions
- [ ] Expand command adds appropriate states for component type
- [ ] ASCII representations look correct for each state
- [ ] Documentation clearly explains the two-phase workflow

## What We're NOT Doing

- **No backward compatibility** - Not supporting old multi-state behavior
- **No partial state selection during creation** - Always create default only, expand later
- **No automatic expansion** - User must explicitly run expand command
- **No state removal** - Expand only adds states, doesn't remove them
- **No multi-component expansion** - Expand one component at a time (for now)

## Implementation Approach

### Phase 1: Create New Expand Command
Create the new `/fluxwing-expand-component` command that can add states to existing components.

### Phase 2: Refactor Helper Functions
Modify helper functions to support single-state and multi-state generation modes.

### Phase 3: Update All Creation Commands
Modify all 3 slash commands to create default-only components.

### Phase 4: Update All Agent Files
Modify all 3 agent files to create default-only components.

### Phase 5: Update Documentation
Update all documentation to reflect new workflow.

### Phase 6: Update Examples
Update example components to show simpler structure (optional - keep examples as reference).

---

## Phase 1: Create New Expand Command

### Overview
Create `/fluxwing-expand-component` command that reads an existing component and adds states to it.

### Changes Required:

#### 1. Create New Command File

**File**: `fluxwing/commands/fluxwing-expand-component.md`
**Changes**: Create new file

```markdown
---
description: Add states to an existing uxscii component
---

# Fluxwing Component Expander

You are Fluxwing, an AI-native UX design assistant that expands uxscii components with additional interaction states.

## Data Location Rules

**READ from:**
- `./fluxwing/components/` - User-created components to expand
- `./fluxwing/library/` - User library components to expand
- `{PLUGIN_ROOT}/data/docs/` - Documentation for state definitions
- `{PLUGIN_ROOT}/data/schema/` - JSON Schema validation

**WRITE to:**
- `./fluxwing/components/` - Updated components (overwrite existing)
- `./fluxwing/library/` - Updated library components (overwrite existing)

## Your Task

Expand an existing uxscii component by adding interaction states.

## Workflow

### 1. Locate Component

Ask for the component name if not provided:
- "Which component do you want to expand?"
- Search in `./fluxwing/components/` and `./fluxwing/library/`
- Display current states if component found

### 2. Determine States to Add

**Default behavior (no instructions)**: Add ALL standard states for component type

**Smart defaults by type**:
- **button**: hover, active, disabled
- **input**: focus, error, disabled
- **checkbox/radio**: checked, disabled
- **select**: open, disabled
- **link**: hover, visited, active
- **card**: hover, selected
- **modal**: open, closing
- **alert**: success, warning, error, info
- **badge**: active, inactive
- **navigation**: active, hover

**User can override**: "Only add hover and focus" or "Add error state only"

### 3. Read Existing Component Files

Read both files:
- `{component-name}.uxm` - Current JSON metadata
- `{component-name}.md` - Current ASCII template

Extract:
- Current states (from behavior.states array)
- Component type (from type field)
- Visual properties (from ascii section)
- Variables (from ascii.variables array)

### 4. Generate New States

For each new state to add:

**A. Add state definition to .uxm file**

```json
{
  "name": "hover",
  "properties": {
    "border": "heavy",
    "background": "primary-dark",
    "textColor": "default"
  },
  "triggers": ["mouseenter"]
}
```

**State property patterns**:
- **hover**: Heavy border, darker background
- **focus**: Double border or focus ring, primary color
- **active**: Heavy border, filled background
- **disabled**: Dashed border, opacity 0.5, cursor not-allowed
- **error**: Heavy border, red/error color
- **success**: Heavy border, green/success color
- **loading**: Opacity 0.7, cursor wait
- **checked**: Filled checkmark, primary background
- **open**: Expanded layout, visible content
- **selected**: Highlighted background, border accent

**B. Generate ASCII for new state in .md file**

Use appropriate box-drawing characters for each state:
- **hover**: Heavy border `┏━┓┃┗━┛`
- **focus**: Double border `╔═╗║╚═╝`
- **disabled**: Dashed border `┌┄┄┐┆└┄┄┘`
- **error**: Heavy border with indicator `┏━┓┃┗━┛⚠`
- **success**: Heavy border with indicator `┏━┓┃┗━┛✓`

### 5. Update Files

**Write updated files**:
- Overwrite `{component-name}.uxm` with expanded states array
- Append new state sections to `{component-name}.md`

**Preserve**:
- All existing metadata
- All existing variables
- All existing states
- All existing props
- Component ID and version

**Update**:
- `metadata.modified` timestamp
- `behavior.states` array (add new states)
- `.md` file (append new state sections)

### 6. Confirm Expansion

Show summary:
```
✓ Expanded: ./fluxwing/components/{component-name}
✓ Added states: hover, active, disabled
✓ Total states: 4 (default, hover, active, disabled)

Preview of hover state:
┏━━━━━━━━━━━━━━━━━━━━┓
┃   {{text}}         ┃
┗━━━━━━━━━━━━━━━━━━━━┛
```

## Resources Available

- **Schema**: `{PLUGIN_ROOT}/data/schema/uxm-component.schema.json`
- **State patterns**: `{PLUGIN_ROOT}/data/docs/06-ascii-patterns.md`
- **Component creation**: `{PLUGIN_ROOT}/data/docs/03-component-creation.md`
- **Helper functions**: `{PLUGIN_ROOT}/data/docs/screenshot-import-helpers.md`

## Example Interaction

```
User: /fluxwing-expand-component submit-button

You: I found `submit-button` in ./fluxwing/components/

Current states: default

I'll add the standard button states (hover, active, disabled).
This will give you a fully interactive button.

[Reads submit-button.uxm and submit-button.md]
[Generates hover, active, disabled states]
[Updates both files]

✓ Expanded: ./fluxwing/components/submit-button
✓ Added states: hover, active, disabled
✓ Total states: 4

Next steps:
- Use this button in a screen with `/fluxwing-scaffold`
- View all components with `/fluxwing-library`
```

## Quality Standards

Ensure expanded components include:
- ✓ Valid JSON schema compliance (no breaking changes)
- ✓ All new states have definitions in .uxm
- ✓ All new states have ASCII in .md
- ✓ State properties match component type
- ✓ Consistent box-drawing character usage
- ✓ Updated modification timestamp
- ✓ Preserved existing data

## Important Notes

- Always preserve existing states (never remove)
- Detect duplicate states (skip if already exists)
- Validate component after expansion
- Use appropriate border styles per state
- Match visual style of existing default state
- Test keyboard navigation for new interactive states
```

#### 2. Register Command in Plugin Manifest

**File**: `fluxwing/.claude-plugin/plugin.json`
**Changes**: Add new command to commands array

```json
{
  "id": "fluxwing",
  "version": "1.0.0",
  "commands": [
    {
      "id": "fluxwing-create",
      "file": "commands/fluxwing-create.md"
    },
    {
      "id": "fluxwing-library",
      "file": "commands/fluxwing-library.md"
    },
    {
      "id": "fluxwing-scaffold",
      "file": "commands/fluxwing-scaffold.md"
    },
    {
      "id": "fluxwing-import-screenshot",
      "file": "commands/fluxwing-import-screenshot.md"
    },
    {
      "id": "fluxwing-expand-component",
      "file": "commands/fluxwing-expand-component.md"
    }
  ],
  "agents": [
    "..."
  ]
}
```

### Success Criteria:

#### Automated Verification:
- [ ] Command file exists: `test -f fluxwing/commands/fluxwing-expand-component.md`
- [ ] Plugin manifest valid: JSON syntax check on `fluxwing/.claude-plugin/plugin.json`
- [ ] Command registered: `grep -q "fluxwing-expand-component" fluxwing/.claude-plugin/plugin.json`

#### Manual Verification:
- [ ] Command appears in `/fluxwing:` tab completion
- [ ] Command help text is clear and actionable
- [ ] Command can locate components in both directories
- [ ] Command generates valid state definitions

---

## Phase 2: Refactor Helper Functions

### Overview
Create new minimal-state versions of helper functions that generate only default state.

### Changes Required:

#### 1. Add Minimal State Generation Function

**File**: `fluxwing/data/docs/screenshot-import-helpers.md`
**Changes**: Add new function after `generateStatesFromList()` (after line 243)

```typescript
### generateMinimalDefaultState()

Creates a single default state object for MVP component creation:

\`\`\`typescript
function generateMinimalDefaultState(
  visualProperties: any,
  componentType: string
): any {
  return {
    name: 'default',
    properties: {
      border: visualProperties.borderStyle || 'light',
      background: inferBackground(componentType),
      textColor: 'default'
    }
  };
}
\`\`\`

This function creates ONLY the default state, enabling fast MVP component creation.
Use `generateStatesFromList()` later when expanding components.
```

#### 2. Add Mode Parameter to ASCII Generation

**File**: `fluxwing/data/docs/screenshot-import-ascii.md`
**Changes**: Update `generateASCII()` function signature (around line 176)

```typescript
### generateASCII()

Main ASCII generation function with optional minimal mode:

\`\`\`typescript
function generateASCII(
  componentId: string,
  state: string,
  visualProperties: any,
  componentType: string,
  minimalMode: boolean = false  // NEW PARAMETER
): string {
  // ... existing implementation
}
\`\`\`

When `minimalMode` is true:
- Only generate ASCII for 'default' state
- Skip all other states
- Reduce processing time significantly
```

### Success Criteria:

#### Automated Verification:
- [ ] New function documented: `grep -q "generateMinimalDefaultState" fluxwing/data/docs/screenshot-import-helpers.md`
- [ ] Mode parameter added: `grep -q "minimalMode" fluxwing/data/docs/screenshot-import-ascii.md`

#### Manual Verification:
- [ ] Function logic is clear and correct
- [ ] Examples show proper usage
- [ ] Documentation matches implementation intent

---

## Phase 3: Update All Creation Commands

### Overview
Modify all 3 slash commands to create components with only default state.

### Changes Required:

#### 1. Update fluxwing-create Command

**File**: `fluxwing/commands/fluxwing-create.md`

**Change 1**: Update workflow description (line 36)

```markdown
Old:
- **Interactive states**: default, hover, focus, disabled, error, success, etc.

New:
- **Interactive states**: Components are created with default state only. Use `/fluxwing-expand-component` to add hover, focus, disabled, etc.
```

**Change 2**: Update creation instructions (around line 62)

```markdown
Old:
#### B. The `.md` file (ASCII template)
Contains:
- ASCII art representation of the component
- Variables using `{{variableName}}` syntax
- Multiple state representations (default, hover, focus, etc.)
- Documentation and usage examples

New:
#### B. The `.md` file (ASCII template)
Contains:
- ASCII art representation of the component in default state
- Variables using `{{variableName}}` syntax
- Documentation and usage examples

**Note**: To add interactive states (hover, focus, disabled), use `/fluxwing-expand-component` after creation.
```

**Change 3**: Update quality standards (line 128)

```markdown
Old:
- ✓ Multiple interaction states

New:
- ✓ Default state with MVP-ready functionality
- ✓ Ready to expand with `/fluxwing-expand-component`
```

**Change 4**: Update example interaction (around line 100)

```markdown
Old:
2. What states should it have? (I recommend: default, hover, focus, disabled)

New:
2. Any specific styling? (rounded corners, filled, outlined, etc.)

(Remove state selection - always create default only)
```

#### 2. Update fluxwing-scaffold Command

**File**: `fluxwing/commands/fluxwing-scaffold.md`

**Change 1**: Update component creation note (around line 58)

```markdown
Old:
If components don't exist, create them with full states first.

New:
If components don't exist, create them with default state only (fast prototyping).
Use `/fluxwing-expand-component` to add interaction states after MVP validation.
```

#### 3. Update fluxwing-import-screenshot Command

**File**: `fluxwing/commands/fluxwing-import-screenshot.md`

**Change 1**: Update Phase 2 instructions (around line 291)

```markdown
Old:
For each state in componentData.states, generate ASCII representation.

New:
Generate ASCII for default state only. Store detected states in component metadata for later expansion.
```

**Change 2**: Add expansion note to final output (around line 500)

```markdown
Add after component generation completion:

**Note**: Components created with default state only. To add detected interaction states (hover, focus, error), run:
- `/fluxwing-expand-component {component-id}`
```

### Success Criteria:

#### Automated Verification:
- [ ] Create command updated: `grep -q "expand-component" fluxwing/commands/fluxwing-create.md`
- [ ] Scaffold command updated: `grep -q "default state only" fluxwing/commands/fluxwing-scaffold.md`
- [ ] Import command updated: `grep -q "default state only" fluxwing/commands/fluxwing-import-screenshot.md`
- [ ] Test creation: `/fluxwing-create test-btn` creates single-state component
- [ ] Verify state count: `grep -c '"name":' ./fluxwing/components/test-btn.uxm` returns 1

#### Manual Verification:
- [ ] Command help text mentions expand-component workflow
- [ ] Created components have only default state
- [ ] Components are still valid and render correctly
- [ ] Workflow feels faster

---

## Phase 4: Update All Agent Files

### Overview
Modify all 3 agent files to create default-only components.

### Changes Required:

#### 1. Update screenshot-component-generator Agent

**File**: `fluxwing/agents/screenshot-component-generator.md`

**Change 1**: Update .uxm generation (around line 130)

```markdown
Old:
...generateStatesFromList(
  componentData.states.filter(s => s !== 'default'),
  {
    border: componentData.visualProperties.borderStyle,
    background: inferBackground(componentData.type)
  },
  componentData.type
)

New:
// Only generate default state - use minimal generation
// Store full state list in metadata for later expansion
```

**Change 2**: Update .md generation loop (line 191)

```markdown
Old:
// Generate ASCII for each state
for (const state of componentData.states) {
  markdown += `## ${state.charAt(0).toUpperCase() + state.slice(1)} State\n\n\`\`\`\n`;
  const ascii = generateASCII(...);
  markdown += ascii + '\n\`\`\`\n\n';
}

New:
// Generate ASCII for default state only
markdown += `## Default State\n\n\`\`\`\n`;
const ascii = generateASCII(
  componentData.id,
  'default',
  componentData.visualProperties,
  componentData.type,
  true  // minimalMode = true
);
markdown += ascii + '\n\`\`\`\n\n';

// Add note about expansion
markdown += `**Note**: Additional states detected: ${componentData.states.filter(s => s !== 'default').join(', ')}\n`;
markdown += `Run \`/fluxwing-expand-component ${componentData.id}\` to add them.\n\n`;
```

**Change 3**: Update critical requirements (line 365)

```markdown
Old:
5. **Include all states**: Generate ASCII for every state in the states array

New:
5. **Generate default state only**: Create MVP-ready component with default state. Store additional states in metadata.
```

**Change 4**: Update success criteria (line 374)

```markdown
Old:
- ✓ .md file contains ASCII for all states

New:
- ✓ .md file contains ASCII for default state
- ✓ Additional states stored in metadata for expansion
```

#### 2. Update fluxwing-designer Agent

**File**: `fluxwing/agents/fluxwing-designer.md`

**Change 1**: Update Phase 3 creation instructions (around line 68)

```markdown
Old:
Creates `.uxm` file (JSON metadata) with all states defined

New:
Creates `.uxm` file (JSON metadata) with default state only
```

**Change 2**: Update quality standards (line 173)

```markdown
Old:
- ✓ Multiple states defined (default, hover, focus, disabled)

New:
- ✓ Default state defined for MVP functionality
- ✓ Component ready for expansion with `/fluxwing-expand-component`
```

**Change 3**: Update state representation section (around line 196)

```markdown
Old:
Always show multiple states: default, hover, focus, disabled

New:
Create with default state. Mention expansion command for additional states.
```

#### 3. Update fluxwing-composer Agent

**File**: `fluxwing/agents/fluxwing-composer.md`

**Change 1**: Update component creation note (around line 50)

```markdown
Add note:
When creating missing components, generate default state only for fast composition.
Use `/fluxwing-expand-component` after screen validation to add interaction states.
```

**Change 2**: Update state documentation (line 174)

```markdown
Old:
Defines multiple states: Loading State, Loaded State, Error State

New:
Defines default state initially. Screen-level states can be added after MVP validation.
```

### Success Criteria:

#### Automated Verification:
- [ ] Generator agent updated: `grep -q "default state only" fluxwing/agents/screenshot-component-generator.md`
- [ ] Designer agent updated: `grep -q "expand-component" fluxwing/agents/fluxwing-designer.md`
- [ ] Composer agent updated: `grep -q "default state only" fluxwing/agents/fluxwing-composer.md`
- [ ] Test agent generation: Agents create single-state components

#### Manual Verification:
- [ ] Agent-generated components have only default state
- [ ] Agents mention expansion workflow
- [ ] Components are complete enough for MVP use

---

## Phase 5: Update Documentation

### Overview
Update all documentation files to reflect new default-only workflow.

### Changes Required:

#### 1. Update Component Creation Guide

**File**: `fluxwing/data/docs/03-component-creation.md`

**Change 1**: Update Step 4 title and content (line 90)

```markdown
Old:
### Step 4: Define States and Behaviors

New:
### Step 4: Define Default State and Behaviors

Define the default state (additional states can be added later with `/fluxwing-expand-component`):
```

**Change 2**: Update .md template section (line 171-202)

```markdown
Old:
Shows all states: Default State, Hover State, Focus State, Disabled State

New:
Shows default state only:

## Default State

\`\`\`
╭──────────────────╮
│   {{text}}       │
╰──────────────────╯
\`\`\`

**Adding more states**: Use `/fluxwing-expand-component {component-name}` to add hover, focus, disabled, etc.
```

**Change 3**: Update tips section (line 232)

```markdown
Old:
- Show ALL states visually

New:
- Show default state visually (expand later for additional states)
```

#### 2. Update Core Concepts

**File**: `fluxwing/data/docs/02-core-concepts.md`

**Change 1**: Update states description (line 32)

```markdown
Old:
States: Visual variants (default, hover, focus, disabled, etc.)

New:
States: Visual variants. Components start with default state, expand with `/fluxwing-expand-component` for hover, focus, disabled, etc.
```

**Change 2**: Update component structure section (line 134-156)

```markdown
Add note:
**Two-Phase Creation**:
1. Create component with default state (fast MVP creation)
2. Expand with `/fluxwing-expand-component` (add interaction states)

This approach optimizes for fast prototyping and discussion.
```

#### 3. Update Agent Guide

**File**: `fluxwing/data/docs/UXSCII_AGENT_GUIDE.md`

**Change 1**: Update state planning (line 112)

```markdown
Old:
Think States: Design for default, hover, focus, disabled states

New:
Think States: Start with default state, expand later with `/fluxwing-expand-component`
```

**Change 2**: Update planning questions (line 124)

```markdown
Old:
What states will it have? (default, hover, focus, disabled)

New:
Start with default state. Expand later if needed.
```

**Change 3**: Update visual examples (line 361)

```markdown
Old:
Shows visual examples of default, hover, focus states

New:
Shows visual example of default state

Note: Add `To see hover/focus states, run /fluxwing-expand-component`
```

#### 4. Update Quick Start

**File**: `fluxwing/data/docs/01-quick-start.md`

**Change**: Add expansion step

```markdown
After 30-second creation:

**Expanding States** (optional):
\`\`\`bash
/fluxwing-expand-component my-button
\`\`\`
Adds hover, active, disabled states automatically.
```

#### 5. Update README

**File**: `fluxwing/README.md`

**Change**: Update command list and workflow description

```markdown
Add to commands section:
- `/fluxwing-expand-component` - Add interaction states to existing component

Update workflow notes:
Components are created with default state for fast prototyping.
Use `/fluxwing-expand-component` to add hover, focus, disabled states after MVP validation.
```

#### 6. Update COMMANDS.md

**File**: `fluxwing/COMMANDS.md`

**Change**: Add expand-component documentation section

```markdown
## /fluxwing-expand-component

**Purpose**: Add interaction states to an existing component

**When to use**:
- After creating a component with `/fluxwing-create`
- After MVP validation when you need interactive states
- When importing screenshots detected multiple states

**Syntax**:
\`\`\`
/fluxwing-expand-component component-name [states]
\`\`\`

**Examples**:
\`\`\`bash
# Add all standard states for component type
/fluxwing-expand-component submit-button

# Add specific states only
/fluxwing-expand-component email-input focus error

# Expand library component
/fluxwing-expand-component my-custom-card
\`\`\`

**What it does**:
1. Locates component in `./fluxwing/components/` or `./fluxwing/library/`
2. Reads current `.uxm` and `.md` files
3. Generates new states based on component type
4. Updates both files with new state definitions and ASCII
5. Preserves all existing data and metadata

**Smart defaults by type**:
- button → hover, active, disabled
- input → focus, error, disabled
- checkbox → checked, disabled
- card → hover, selected
- modal → open, closing

**Output**: Updated component files with expanded states
```

### Success Criteria:

#### Automated Verification:
- [ ] Creation guide updated: `grep -q "expand-component" fluxwing/data/docs/03-component-creation.md`
- [ ] Core concepts updated: `grep -q "Two-Phase Creation" fluxwing/data/docs/02-core-concepts.md`
- [ ] Agent guide updated: `grep -q "expand-component" fluxwing/data/docs/UXSCII_AGENT_GUIDE.md`
- [ ] README updated: `grep -q "expand-component" fluxwing/README.md`
- [ ] COMMANDS updated: `grep -q "fluxwing-expand-component" fluxwing/COMMANDS.md`

#### Manual Verification:
- [ ] Documentation is clear and consistent
- [ ] Examples show correct workflow
- [ ] No outdated references to multi-state creation

---

## Phase 6: Update Examples (Optional)

### Overview
Optionally simplify example components to show default-only structure. Keep existing examples as "expanded" reference.

### Changes Required:

#### Option A: Keep Examples As-Is
- Leave all examples showing full multi-state structure
- They serve as reference for what expanded components look like
- Update example README to note they are "fully expanded"

#### Option B: Create Minimal Examples
- Create new examples showing default-only structure
- Add `-minimal` suffix to filenames
- Show before/after expansion

**Recommendation**: Option A - Keep existing examples as expanded reference.

**File to update if pursuing Option A**: `fluxwing/data/docs/07-examples-guide.md`

```markdown
# Component Examples

This directory contains fully expanded component examples showing all interaction states.

**Note**: When you create new components with `/fluxwing-create`, they will have only default state for fast prototyping. These examples show what your components look like after running `/fluxwing-expand-component`.

To see minimal default-only examples, create a test component:
\`\`\`bash
/fluxwing-create test-component
\`\`\`
```

### Success Criteria:

#### Automated Verification:
- [ ] Examples README updated (if Option A chosen)

#### Manual Verification:
- [ ] Examples are still valid and useful
- [ ] Clear distinction between minimal creation and expanded examples
- [ ] Users understand examples show expanded state

---

## Testing Strategy

### Unit Tests:
- Test `generateMinimalDefaultState()` creates correct single state
- Test expand command can read existing components
- Test expand command generates valid state definitions
- Test expand command preserves existing data
- Test all commands create valid schema-compliant components
- Test ASCII generation in minimal mode

### Integration Tests:
- Create component with `/fluxwing-create`, verify single state
- Expand component with `/fluxwing-expand-component`, verify multiple states
- Create screen with `/fluxwing-scaffold`, verify fast creation
- Import screenshot, verify default-only creation
- Run designer agent, verify single-state output
- Run composer agent, verify screen composition works

### Manual Testing Steps:
1. Create button component, confirm only default state exists
2. Expand button component, confirm hover/active/disabled added
3. Verify expanded component renders correctly in ASCII
4. Create screen with scaffold command, confirm fast creation
5. Test expand on input component, confirm focus/error states
6. Verify schema validation passes for all generated components
7. Test backward compatibility - old multi-state examples still work

### Performance Testing:
1. Measure component creation time before optimization
2. Measure component creation time after optimization
3. Verify noticeable speed improvement
4. Test with large screenshot imports (10+ components)

---

## Migration Notes

### Breaking Changes:
- **No backward compatibility**: Old behavior completely replaced
- **All creation commands** now create default-only components
- **No automatic multi-state generation** - must use expand command

### User Communication:
- Update plugin release notes with clear migration guide
- Add banner to README explaining new workflow
- Update all documentation with prominent notes
- Consider deprecation warning period (optional)

### Rollback Plan:
If optimization causes issues:
1. Revert Phase 3-4 changes (command and agent updates)
2. Keep Phase 1 (expand command) as optional feature
3. Default back to multi-state generation
4. Investigate performance issues separately

---

## Performance Considerations

### Expected Improvements:
- **Component creation**: 60-80% faster (4-5 states → 1 state)
- **Screenshot import**: 70% faster for atomic components
- **ASCII generation**: 75% fewer ASCII rendering calls
- **File writes**: Same number of files, but smaller content

### Trade-offs:
- **Two-step workflow**: Users must remember to expand when needed
- **Incomplete components**: Default-only may lack polish for demos
- **Mental overhead**: Users must understand two-phase creation

### Optimization Opportunities:
- Cache expanded state templates by component type
- Batch expand multiple components at once
- Auto-expand on screen composition (optional future feature)

---

## References

### Files Modified:
- `fluxwing/commands/fluxwing-create.md` - Update creation workflow
- `fluxwing/commands/fluxwing-scaffold.md` - Update component creation
- `fluxwing/commands/fluxwing-import-screenshot.md` - Default-only import
- `fluxwing/commands/fluxwing-expand-component.md` - NEW command
- `fluxwing/agents/screenshot-component-generator.md` - Minimal generation
- `fluxwing/agents/fluxwing-designer.md` - Default-only design
- `fluxwing/agents/fluxwing-composer.md` - Fast composition
- `fluxwing/data/docs/screenshot-import-helpers.md` - Add minimal helpers
- `fluxwing/data/docs/screenshot-import-ascii.md` - Add minimal mode
- `fluxwing/data/docs/03-component-creation.md` - Update workflow
- `fluxwing/data/docs/02-core-concepts.md` - Update concepts
- `fluxwing/data/docs/01-quick-start.md` - Add expansion step
- `fluxwing/data/docs/UXSCII_AGENT_GUIDE.md` - Update guidance
- `fluxwing/README.md` - Add expand command
- `fluxwing/COMMANDS.md` - Document expand command
- `fluxwing/.claude-plugin/plugin.json` - Register new command

### Schema Reference:
- `fluxwing/data/schema/uxm-component.schema.json` - Validation rules (unchanged)

### Example Components (Reference Only):
- `fluxwing/data/examples/primary-button.uxm` - Expanded example
- `fluxwing/data/examples/email-input.uxm` - Expanded example

---

## Open Questions - RESOLVED

1. ✅ **Default state definition**: MVP basics (visual + minimal behavior + accessibility)
2. ✅ **expand_component scope**: Add all states unless instructed otherwise
3. ✅ **Backward compatibility**: No backward compatibility
4. ✅ **Which paths to modify**: All of them (commands + agents)
5. ✅ **State templates**: Combination of smart defaults + customization

All questions resolved by user input.
