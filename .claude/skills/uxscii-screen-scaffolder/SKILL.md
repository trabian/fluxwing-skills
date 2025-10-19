---
name: UXscii Screen Scaffolder
description: Build complete UI screens by composing multiple components when user wants to create, scaffold, or build screens like login, dashboard, profile, settings, checkout pages
version: 1.0.0
author: Trabian
allowed-tools: Read, Write, Glob, Grep, Task, TodoWrite
---

# UXscii Screen Scaffolder

Create complete screen designs using the **uxscii standard** by orchestrating specialized agents.

## Data Location Rules

**READ from (bundled templates - reference only):**
- `{SKILL_ROOT}/../uxscii-component-creator/templates/` - 11 component templates
- `{SKILL_ROOT}/templates/` - 2 screen examples
- `{SKILL_ROOT}/docs/` - Documentation

**INVENTORY sources (check all for available components):**
- `./fluxwing/components/` - User-created components (FIRST PRIORITY)
- `./fluxwing/library/` - Customized template copies
- `{SKILL_ROOT}/../uxscii-component-creator/templates/` - Bundled templates (READ-ONLY)

**WRITE to (project workspace):**
- `./fluxwing/screens/` - Your created screens (via composer agent)

**NEVER write to skill directories - they are read-only!**

## Your Task

**⚠️ YOU ARE AN ORCHESTRATOR - DO NOT DO THE WORK YOURSELF! ⚠️**

Your role is to **spawn agents** using the Task tool. You coordinate agents, you don't create components directly.

Help the user scaffold a complete screen by orchestrating agents in two phases:
1. **Phase 1 (Parallel)**: Spawn multiple designer agents - one per missing component using multiple Task tool calls in ONE message
2. **Phase 2 (Sequential)**: After all components exist, spawn composer agent

**Concurrency Model**:
- If 6 components are missing → spawn 6 agents in parallel using 6 Task tool calls in ONE message (~6x faster)
- Then wait for all to complete before composing screen

**CRITICAL**: Use the Task tool to spawn agents. Do NOT use TodoWrite and work through tasks yourself. Do NOT create files yourself.

## Workflow

### Step 1: Understand the Screen

Ask about the screen they want to create:
- **Screen name and purpose**: login, dashboard, profile, settings, checkout, etc.
- **Required components**: forms, navigation, cards, modals, lists, etc.
- **Layout structure**: vertical, horizontal, grid, sidebar+main, etc.

### Step 2: Component Inventory

Check what components are available **in this order**:

1. **User-created**: `./fluxwing/components/` (FIRST PRIORITY)
2. **Library**: `./fluxwing/library/` (customized templates)
3. **Bundled examples**: `{SKILL_ROOT}/../uxscii-component-creator/templates/` (READ-ONLY)

List what exists vs what needs to be created.

```typescript
// Example inventory check
const userComponents = glob('./fluxwing/components/*.uxm');
const libraryComponents = glob('./fluxwing/library/*.uxm');
const bundledComponents = glob('{SKILL_ROOT}/../uxscii-component-creator/templates/*.uxm');

const available = [...userComponents, ...libraryComponents, ...bundledComponents];
const missing = requiredComponents.filter(c => !available.includes(c));
```

### Step 3: Create Missing Components (If Needed)

**If missing components exist**, spawn designer agents **IN PARALLEL** - one agent per component:

**CRITICAL ORCHESTRATION RULES**:
1. ⚠️ **DO NOT** create a TodoWrite list and work through it yourself
2. ⚠️ **DO NOT** create components yourself using Write/Edit tools
3. ✅ **DO** use the Task tool to spawn one agent per missing component
4. ✅ **DO** send ONE message containing ALL Task tool calls (for parallel execution)

**Example of CORRECT approach** - If 6 components are missing, your next response should contain exactly 6 Task() calls:

```
// Example: 6 missing components for banking-chat screen

Task({
  subagent_type: "general-purpose",
  description: "Create message-bubble component",
  prompt: "You are a uxscii component designer creating production-ready components.

Component: message-bubble
Type: container
Screen context: banking-chat (3-column layout with chat interface)

Your task:
1. Load schema from {SKILL_ROOT}/../uxscii-component-creator/schemas/uxm-component.schema.json
2. Load docs from {SKILL_ROOT}/../uxscii-component-creator/docs/
3. Create component with default state only (fast MVP)
4. Save both .uxm and .md to ./fluxwing/components/
5. Use TodoWrite to track progress
6. Return component summary

Follow uxscii standard strictly."
})

Task({
  subagent_type: "general-purpose",
  description: "Create message-input component",
  prompt: "You are a uxscii component designer creating production-ready components.

Component: message-input
Type: input
Screen context: banking-chat (3-column layout with chat interface)

Your task:
1. Load schema from {SKILL_ROOT}/../uxscii-component-creator/schemas/uxm-component.schema.json
2. Load docs from {SKILL_ROOT}/../uxscii-component-creator/docs/
3. Create component with default state only (fast MVP)
4. Save both .uxm and .md to ./fluxwing/components/
5. Use TodoWrite to track progress
6. Return component summary

Follow uxscii standard strictly."
})

Task({
  subagent_type: "general-purpose",
  description: "Create send-button component",
  prompt: "You are a uxscii component designer creating production-ready components.

Component: send-button
Type: button
Screen context: banking-chat (3-column layout with chat interface)

Your task:
1. Load schema from {SKILL_ROOT}/../uxscii-component-creator/schemas/uxm-component.schema.json
2. Load docs from {SKILL_ROOT}/../uxscii-component-creator/docs/
3. Create component with default state only (fast MVP)
4. Save both .uxm and .md to ./fluxwing/components/
5. Use TodoWrite to track progress
6. Return component summary

Follow uxscii standard strictly."
})

... spawn ONE Task call per missing component in the SAME message ...
```

**Performance**: Creating 6 components with 6 parallel agents is ~6x faster than sequential!

**Wait for ALL component agents to complete before proceeding to Step 4.**

### Step 4: Compose Screen

Once all components exist (either from inventory or just created), spawn the composer agent:

```
Task({
  subagent_type: "general-purpose",
  description: "Compose screen from components",
  prompt: "You are a uxscii screen composer creating production-ready screen designs.

Available components: ['email-input', 'password-input', 'submit-button']

Screen requirements:
- Name: login
- Purpose: User authentication
- Layout: vertical-center
- User flows: Enter credentials, submit form

Your task:
1. Load schema from {SKILL_ROOT}/../uxscii-component-creator/schemas/uxm-component.schema.json
2. Load screen docs from {SKILL_ROOT}/docs/04-screen-composition.md
3. Read component .uxm and .md files from ./fluxwing/components/
4. Create screen .uxm file (valid JSON, type: container)
5. Create screen .md file (template with {{component:id}} references)
6. Create screen .rendered.md file (with REAL example data like john@example.com)
7. Save all 3 files to ./fluxwing/screens/
8. Use TodoWrite to track progress
9. Return screen summary with preview

Screen composition guidelines:
- Screen type should be 'container'
- Include all components in props.components array
- Use {{component:id}} syntax in .md for component references
- Create realistic rendered example (NOT templates with {{variables}})
- Show actual spacing and layout in rendered version

Follow the uxscii standard strictly."
})
```

**Note on Execution Order**:
- **Phase 1**: Multiple component agents run in parallel (one per missing component)
- **Phase 2**: After all components complete, composer agent runs
- This is sequential between phases, but maximally parallel within Phase 1

### Step 5: Report Results

Create comprehensive summary:

```markdown
# Screen Scaffolding Complete ✓

## Screen: ${screenName}

### Components Created (by designer agent)
${missingComponents.length > 0 ? missingComponents.map(c => `✓ ${c}`).join('\n') : 'None - all components existed'}

### Components Used (by composer agent)
${availableComponents.map(c => `✓ ${c}`).join('\n')}

### Files Created

**Components** (./fluxwing/components/):
${missingComponents.length * 2} files (.uxm + .md)

**Screen** (./fluxwing/screens/):
- ${screenName}.uxm
- ${screenName}.md
- ${screenName}.rendered.md

**Total: ${missingComponents.length * 2 + 3} files**

## Performance
- Component creation: ${missingComponents.length > 0 ? 'Designer agent (background)' : 'Skipped'} ⚡
- Screen composition: Composer agent ⚡

## Next Steps

1. Review rendered screen: `cat ./fluxwing/screens/${screenName}.rendered.md`
2. Add interaction states to components
3. Customize components in ./fluxwing/components/
4. View all components
```

## Parallel Execution Strategy

**Two-phase concurrency model:**

**Phase 1 - Component Creation (Parallel)**:
- If N components are missing → spawn N agents in parallel (one per component)
- All component agents run simultaneously (~Nx faster than sequential)
- Each agent independently creates its component files and tracks progress

**Phase 2 - Screen Composition (Sequential)**:
- After ALL component agents complete → spawn composer agent
- Composer reads all created components and assembles screen
- Cannot run in parallel with Phase 1 (needs components to exist first)

**Performance Example**:
- 6 missing components + screen composition
- Old way (sequential): ~180 seconds (6 × 30s)
- New way (parallel Phase 1): ~30 seconds (6 agents at once) + ~30s composer = ~60 seconds total
- **3x faster!**

## Example Interaction

```
User: Create a login screen

Skill: I'll help you create a login screen! Let me check what components we have...

[Checks ./fluxwing/components/, ./fluxwing/library/, bundled templates]

I found:
✓ email-input (exists in ./fluxwing/components/)
✗ password-input (needs to be created)
✗ submit-button (needs to be created)

I'll use a two-phase approach:
- Phase 1: Spawn 2 agents in parallel (one per missing component)
- Phase 2: After components complete, spawn composer agent

[Spawns 2 component agents in parallel]

✓ password-input agent completed
✓ submit-button agent completed

[Now spawns composer agent]

✓ Composer agent created login screen

Total: 7 files created in ./fluxwing/
Performance: ~2x faster with parallel component creation!
```

## Error Handling

**If designer agent fails:**
- Report which components failed
- User can create manually or retry
- Composer agent cannot proceed without components

**If composer agent fails:**
- Components are still created and usable
- User can manually compose screen
- Provide specific error context

## Success Criteria

- ✓ All required components exist (created or found)
- ✓ Screen has 3 files (.uxm + .md + .rendered.md)
- ✓ Agents ran efficiently (parallel when possible)
- ✓ User can immediately use the screen design

You are building complete, production-ready screen designs with maximum agent concurrency!
