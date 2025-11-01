---
name: Fluxwing Screen Scaffolder
description: Build complete UI screens by composing multiple uxscii components. Use when working with .uxm files, when user wants to create, scaffold, or build .uxm screens like login, dashboard, profile, settings, or checkout pages.
version: 0.0.1
author: Trabian
allowed-tools: Read, Write, Glob, Grep, Task, TodoWrite
---

# Fluxwing Screen Scaffolder

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

### Step 3: Create Missing Components (Fast Mode)

**If missing components exist**, spawn designer agents in FAST MODE - one agent per component:

**CRITICAL ORCHESTRATION RULES**:
1. ⚠️ **DO NOT** create TodoWrite list and work through it yourself
2. ⚠️ **DO NOT** create components yourself using Write/Edit tools
3. ✅ **DO** use Task tool to spawn one agent per missing component
4. ✅ **DO** send ONE message with ALL Task calls (parallel execution)
5. ✅ **DO** use FAST MODE (creates .uxm only, <10s per component)

**Fast Mode Creates:**
- Component .uxm files (sketch fidelity)
- NO .md files (composer will create these)

**Example: 6 missing components for banking-chat**

```typescript
Task({
  subagent_type: "general-purpose",
  model: "haiku", // Fast model
  description: "Create message-bubble (fast)",
  prompt: "Create sketch-fidelity uxscii component from template.

Component: message-bubble
Type: container
Screen context: banking-chat

FAST MODE - Speed is critical! <10 seconds target.

Your task:
1. Load minimal template: {SKILL_ROOT}/../fluxwing-component-creator/templates/minimal/container.uxm.template
2. Replace variables:
   - {{id}} = 'message-bubble'
   - {{name}} = 'Message Bubble'
   - {{description}} = 'Chat message container for banking-chat'
   - {{timestamp}} = '${new Date().toISOString()}'
   - {{screenContext}} = 'banking-chat'
3. Verify JSON is well-formed
4. Save to ./fluxwing/components/message-bubble.uxm
5. DO NOT create .md file
6. DO NOT load documentation

Return: 'Created message-bubble.uxm (sketch fidelity)'

Target: <10 seconds"
})

Task({
  subagent_type: "general-purpose",
  model: "haiku",
  description: "Create message-input (fast)",
  prompt: "Create sketch-fidelity uxscii component from template.

Component: message-input
Type: input
Screen context: banking-chat

FAST MODE - Speed is critical! <10 seconds target.

Your task:
1. Load minimal template: {SKILL_ROOT}/../fluxwing-component-creator/templates/minimal/input.uxm.template
2. Replace variables:
   - {{id}} = 'message-input'
   - {{name}} = 'Message Input'
   - {{description}} = 'Chat input field for banking-chat'
   - {{timestamp}} = '${new Date().toISOString()}'
   - {{placeholder}} = 'Type a message...'
   - {{label}} = 'Message'
   - {{screenContext}} = 'banking-chat'
3. Verify JSON is well-formed
4. Save to ./fluxwing/components/message-input.uxm
5. DO NOT create .md file
6. DO NOT load documentation

Return: 'Created message-input.uxm (sketch fidelity)'

Target: <10 seconds"
})

// ... spawn ONE Task per missing component in SAME message ...
```

**Performance:** 6 components × 10s = ~60 seconds (was 120-180s)

**Wait for ALL component agents to complete before Step 4.**

### Step 4: Compose Screen with Component .md Generation

**Once all components exist**, spawn the composer agent:

**CRITICAL: Composer generates .md files for ALL components!**

This is the "smart composer" - it:
1. Generates missing component .md files
2. Loads documentation ONCE (not per component)
3. Creates screen .uxm + .md + .rendered.md
4. Focuses quality on .rendered.md (main deliverable)

```typescript
Task({
  subagent_type: "general-purpose",
  model: "sonnet", // Smart model for quality composition
  description: "Compose ${screenName} with components",
  prompt: `You are a uxscii screen composer creating production-ready screens.

Screen: ${screenName}
Components: ${componentList}
Layout: ${layoutStructure}

Your task has TWO parts:

═══════════════════════════════════════
PART 1: Generate Component .md Files
═══════════════════════════════════════

For each component in [${componentList}]:

1. Read component .uxm from ./fluxwing/components/
2. Check if .md exists:
   - If EXISTS: Skip to next component
   - If MISSING: Generate .md file (steps 3-5)

3. Load ASCII patterns (ONCE for all components):
   {SKILL_ROOT}/../fluxwing-component-creator/docs/06-ascii-patterns.md

4. Generate simple ASCII art based on component type:
   - button: Rounded box with label
   - input: Rectangular box with placeholder
   - card: Box with title and content area
   - container: Large box for children
   - Use dimensions from .uxm (ascii.width, ascii.height)
   - Keep it simple (sketch quality, not detailed)

5. Create .md file with:
   - Component description
   - ASCII art in code block
   - Variables from .uxm props
   - Save to ./fluxwing/components/\${componentId}.md

Example .md for button:
\`\`\`markdown
# \${componentName}

\${description}

## ASCII

\`\`\`
╭──────────────────╮
│  {{label}}       │
╰──────────────────╯
\`\`\`

## Variables
- label (string): Button text
\`\`\`

═══════════════════════════════════════
PART 2: Compose Screen
═══════════════════════════════════════

1. Load schema: {SKILL_ROOT}/../fluxwing-component-creator/schemas/uxm-component.schema.json
2. Load screen docs: {SKILL_ROOT}/docs/04-screen-composition.md

3. Create screen .uxm:
   - type: "container"
   - props.components: [${componentList}]
   - layout: ${layoutStructure}
   - fidelity: "detailed" (screen is detailed even if components are sketch)

4. Create screen .md (template):
   - Use {{component:id}} syntax for component references
   - Show layout structure with placeholders

5. Create screen .rendered.md (MAIN DELIVERABLE):
   - Embed ACTUAL component ASCII (read from .md files you just created)
   - Use REAL example data (names: "Sarah Johnson", emails: "sarah@example.com", etc.)
   - Show all screen states (idle, loading, error if applicable)
   - High visual quality - this is what user will see!
   - Make it publication-ready

6. Save all 3 files to ./fluxwing/screens/

═══════════════════════════════════════
Performance Notes:
═══════════════════════════════════════

- Load ASCII patterns ONCE, reuse for all components
- Keep component .md simple (detailed version comes with enhancement)
- Focus quality effort on screen .rendered.md
- Target: 60-90 seconds total

Return summary:
- List component .md files created
- Screen files created
- Preview of .rendered.md (first 20 lines)
`
})
```

### Step 5: Report Results

Create comprehensive summary:

```markdown
# Screen Scaffolding Complete ✓

## Screen: ${screenName}

### Phase 1: Fast Component Creation ⚡
${missingComponents.length > 0 ? missingComponents.map(c => `✓ ${c}.uxm (sketch fidelity, ~10s)`).join('\n') : 'None - all components existed'}

Time: ~${missingComponents.length * 10}s

### Phase 2: Smart Composition 🎨
Component .md files generated:
${componentList.map(c => `✓ ${c}.md (by composer)`).join('\n')}

Screen files created:
✓ ${screenName}.uxm
✓ ${screenName}.md (template)
✓ ${screenName}.rendered.md (MAIN DELIVERABLE)

Time: ~60-90s

### Total Time: ~${missingComponents.length * 10 + 75}s (${Math.round((missingComponents.length * 10 + 75)/60)} minutes)

### Performance Improvement
- Old: ~${missingComponents.length * 120}s (${Math.round(missingComponents.length * 120/60)} minutes)
- New: ~${missingComponents.length * 10 + 75}s (${Math.round((missingComponents.length * 10 + 75)/60)} minutes)
- Speedup: ${Math.round((1 - (missingComponents.length * 10 + 75)/(missingComponents.length * 120)) * 100)}%

## Next Steps

1. **Review rendered screen:**
   \`cat ./fluxwing/screens/${screenName}.rendered.md\`

2. **Enhance components (optional):**
   Use fluxwing-enhancer to upgrade from sketch to detailed/production fidelity

3. **Customize components:**
   Edit files in ./fluxwing/components/ as needed

## Files Created

**Components** (./fluxwing/components/):
- ${missingComponents.length} .uxm files (sketch fidelity)
- ${componentList.length} .md files (generated by composer)

**Screen** (./fluxwing/screens/):
- ${screenName}.uxm
- ${screenName}.md
- ${screenName}.rendered.md

**Total: ${missingComponents.length + componentList.length + 3} files**
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
