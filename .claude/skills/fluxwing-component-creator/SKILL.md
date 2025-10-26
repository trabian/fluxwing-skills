---
name: Fluxwing Component Creator
description: Create uxscii components with ASCII art and structured metadata when user wants to create, build, or design UI components. Use when working with .uxm files, when user mentions .uxm components, or when creating buttons, inputs, cards, forms, modals, or navigation.
version: 1.0.0
author: Trabian
allowed-tools: Read, Write, Edit, Glob, Grep, Task, TodoWrite, Bash
---

# Fluxwing Component Creator

You are helping the user create uxscii component(s) using the **uxscii standard** by orchestrating the designer agent.

## Data Location Rules

**READ from (bundled templates - reference only):**
- `{SKILL_ROOT}/templates/` - 11 component templates
- `{SKILL_ROOT}/docs/` - Documentation

**INVENTORY sources:**
- `./fluxwing/components/` - User components
- `./fluxwing/library/` - Customized templates
- `{SKILL_ROOT}/templates/` - Bundled templates (READ-ONLY)

**WRITE to (project workspace - via designer agent):**
- `./fluxwing/components/` - Your created components

**NEVER write to skill directory - it's read-only!**

## Your Task

Help the user create uxscii component(s) by gathering requirements and spawning designer agent(s).

**Supports both single and multi-component creation:**
- Single: "Create a submit button"
- Multiple: "Create submit-button, cancel-button, and email-input" (agents run in parallel)

## Workflow

### Step 1: Parse Request & Understand Requirements

**Detect if user wants single or multiple components:**

1. **Single component request**:
   - "Create a submit button"
   - "I need a card component"
   - Proceed with single-component workflow (Steps 2-4)

2. **Multiple component request**:
   - "Create submit-button, cancel-button, and email-input"
   - "I need a button, input, and card"
   - "Create these components: [list]"
   - Proceed with multi-component workflow (see Step 3b)

**For each component, gather:**
- **Component name** (will be converted to kebab-case, e.g., "Submit Button" → "submit-button")
- **Component type**: button, input, card, navigation, form, list, modal, table, badge, alert, container, text, image, divider, or custom
- **Key properties**: What should be configurable? (text, colors, sizes, etc.)
- **Visual style preferences**: rounded, sharp, minimal, detailed, etc.

**If details are missing**: Make reasonable assumptions based on component type and common patterns. Don't over-ask.

**Note**: Components are created with default state only for fast MVP prototyping. Users can expand components later to add interactive states (hover, focus, disabled, etc.).

### Step 2: Check for Similar Templates

Browse available templates to offer starting points:

```typescript
// Check bundled templates
const bundledTemplates = glob('{SKILL_ROOT}/templates/*.uxm');
// Check user library
const libraryTemplates = glob('./fluxwing/library/*.uxm');

// Suggest similar templates if found
if (similarTemplates.length > 0) {
  console.log(`Similar templates found: ${similarTemplates.join(', ')}`);
  console.log('Would you like to base this on an existing template or create from scratch?');
}
```

### Step 3a: Spawn Designer Agent (Single Component)

**For SINGLE component requests**, spawn one designer agent:

```typescript
Task({
  subagent_type: "general-purpose",
  description: "Create single uxscii component",
  prompt: `You are a uxscii component designer creating production-ready components.

Component requirements:
- Name: ${componentName}
- Type: ${componentType}
- Key properties: ${keyProperties}
- Visual style: ${visualStyle}

Your task:
1. Load schema from {SKILL_ROOT}/schemas/uxm-component.schema.json
2. Load documentation from {SKILL_ROOT}/docs/03-component-creation.md and 06-ascii-patterns.md
3. Check {SKILL_ROOT}/templates/ for similar examples
4. Create .uxm file (valid JSON with default state only)
5. Create .md file (ASCII template with default state only)
6. Save both files to ./fluxwing/components/
7. Validate using: uv run {SKILL_ROOT}/scripts/quick_validate.py ./fluxwing/components/${componentId}.uxm {SKILL_ROOT}/schemas/uxm-component.schema.json
8. Use TodoWrite to track progress
9. Return component summary with ASCII preview

Component creation guidelines:
- Create default state only for fast MVP prototyping
- Use consistent box-drawing characters (see docs/06-ascii-patterns.md)
- Include complete accessibility attributes (ARIA roles, keyboard support)
- Follow naming conventions: kebab-case IDs, camelCase variables
- Ensure all template variables in .md are defined in .uxm props
- Keep ASCII dimensions reasonable (width: 1-120, height: 1-50)

Data locations:
- READ templates from: {SKILL_ROOT}/templates/ (reference only)
- WRITE components to: ./fluxwing/components/ (your output)
- NEVER write to skill directory

Follow the uxscii standard strictly for production quality.`
})
```

**Wait for designer agent to complete.**

### Step 3b: Spawn Designer Agents (Multiple Components - IN PARALLEL)

**For MULTIPLE component requests**, spawn ALL designer agents in a SINGLE message for maximum parallelism:

**CRITICAL**: You MUST send ONE message with multiple Task calls to achieve parallel execution.

**DO THIS**: One message with N Task calls (one per component)
**DON'T DO THIS**: Separate messages for each component (runs sequentially)

```typescript
// Example: User wants submit-button, cancel-button, email-input

Task({
  subagent_type: "general-purpose",
  description: "Create submit-button component",
  prompt: `You are a uxscii component designer creating production-ready components.

Component requirements:
- Name: submit-button
- Type: button
- Key properties: text, variant
- Visual style: rounded, filled

Your task:
1. Load schema from {SKILL_ROOT}/schemas/uxm-component.schema.json
2. Load docs from {SKILL_ROOT}/docs/03-component-creation.md and 06-ascii-patterns.md
3. Create .uxm file (valid JSON with default state only)
4. Create .md file (ASCII template with default state only)
5. Save to ./fluxwing/components/
6. Validate using: uv run {SKILL_ROOT}/scripts/quick_validate.py
7. Return component summary

Follow uxscii standard strictly. Create default state only for fast MVP.`
})

Task({
  subagent_type: "general-purpose",
  description: "Create cancel-button component",
  prompt: `You are a uxscii component designer creating production-ready components.

Component requirements:
- Name: cancel-button
- Type: button
- Key properties: text, variant
- Visual style: rounded, outlined

Your task:
1. Load schema from {SKILL_ROOT}/schemas/uxm-component.schema.json
2. Load docs from {SKILL_ROOT}/docs/03-component-creation.md and 06-ascii-patterns.md
3. Create .uxm file (valid JSON with default state only)
4. Create .md file (ASCII template with default state only)
5. Save to ./fluxwing/components/
6. Validate using: uv run {SKILL_ROOT}/scripts/quick_validate.py
7. Return component summary

Follow uxscii standard strictly. Create default state only for fast MVP.`
})

Task({
  subagent_type: "general-purpose",
  description: "Create email-input component",
  prompt: `You are a uxscii component designer creating production-ready components.

Component requirements:
- Name: email-input
- Type: input
- Key properties: placeholder, value
- Visual style: light border, minimal

Your task:
1. Load schema from {SKILL_ROOT}/schemas/uxm-component.schema.json
2. Load docs from {SKILL_ROOT}/docs/03-component-creation.md and 06-ascii-patterns.md
3. Create .uxm file (valid JSON with default state only)
4. Create .md file (ASCII template with default state only)
5. Save to ./fluxwing/components/
6. Validate using: uv run {SKILL_ROOT}/scripts/quick_validate.py
7. Return component summary

Follow uxscii standard strictly. Create default state only for fast MVP.`
})

... all Task calls in the SAME message for parallel execution ...
```

**Wait for ALL designer agents to complete.**

**Performance Benefit**: Creating 3 components in parallel is ~3x faster than sequential creation!

### Step 3c: Validate Created Components (Optional but Recommended)

After the designer agent(s) complete, validate the created components using the fast validation script:

```bash
# For single component
uv run {SKILL_ROOT}/scripts/quick_validate.py \\
  ./fluxwing/components/${componentId}.uxm \\
  {SKILL_ROOT}/schemas/uxm-component.schema.json

# For multiple components, validate each one
uv run {SKILL_ROOT}/scripts/quick_validate.py \\
  ./fluxwing/components/submit-button.uxm \\
  {SKILL_ROOT}/schemas/uxm-component.schema.json

uv run {SKILL_ROOT}/scripts/quick_validate.py \\
  ./fluxwing/components/cancel-button.uxm \\
  {SKILL_ROOT}/schemas/uxm-component.schema.json
```

**Validation output:**
- ✓ If valid: Shows component summary (type, states, props)
- ✗ If invalid: Shows specific errors that need fixing

**Performance**: ~100ms per component (very fast!)

**If validation fails:**
1. Read the error messages carefully
2. Fix the issues in the .uxm or .md files
3. Re-validate before reporting to user

**Note**: The validation script checks:
- JSON schema compliance
- .md file exists
- Variables match between .uxm and .md
- Accessibility requirements
- Dimension constraints

### Step 4: Report Success

**For SINGLE component**, present the results:

```markdown
# Component Created ✓

## ${componentName}

**Type**: ${componentType}
**Files**:
- ./fluxwing/components/${componentId}.uxm
- ./fluxwing/components/${componentId}.md

**States**: default (created)
**Detected states**: ${detectedStates.join(', ')}

## Preview

${asciiPreview}

## Next Steps

1. Add interaction states using the component expander skill
2. Use in a screen with the screen scaffolder skill
3. View all components with the library browser skill
4. Customize: Edit files in ./fluxwing/components/
```

**For MULTIPLE components**, present a summary:

```markdown
# Components Created ✓

Created ${componentCount} components in parallel:

## submit-button (button)
**Files**:
- ./fluxwing/components/submit-button.uxm
- ./fluxwing/components/submit-button.md

**Preview**:
╭──────────────────╮
│   Submit Form    │
╰──────────────────╯

## cancel-button (button)
**Files**:
- ./fluxwing/components/cancel-button.uxm
- ./fluxwing/components/cancel-button.md

**Preview**:
┌──────────────────┐
│   Cancel         │
└──────────────────┘

## email-input (input)
**Files**:
- ./fluxwing/components/email-input.uxm
- ./fluxwing/components/email-input.md

**Preview**:
┌────────────────────────────┐
│ Email: [________________]  │
└────────────────────────────┘

---

**Total**: 6 files created (3 .uxm + 3 .md)
**Performance**: Created in parallel (~3x faster than sequential)

## Next Steps

1. Add interaction states to components
2. Use components in screens
3. View all components
4. Customize: Edit files in ./fluxwing/components/
```

## Example Interactions

### Example 1: Single Component

```
User: Create a submit button

Skill: I'll create a submit button component! Let me check for similar templates...

[Checks bundled templates]

I found a primary-button template. Would you like me to:
1. Base it on the primary-button template (faster)
2. Create a custom design from scratch

[User responds: custom, rounded corners, filled]

Perfect! Creating submit-button component with the designer agent...

[Spawns designer agent]

✓ Component created successfully!

Files:
- ./fluxwing/components/submit-button.uxm
- ./fluxwing/components/submit-button.md

Preview (default state):
╭──────────────────╮
│   Submit Form    │
╰──────────────────╯

Next steps:
- Add states: Ask me to "add hover state to submit-button"
- Use in screen: Ask me to "create a login screen"
```

### Example 2: Multiple Components (Parallel)

```
User: Create submit-button, cancel-button, and email-input

Skill: I'll create all 3 components in parallel! This will be much faster.

Based on the component types, I'll use these defaults:
- submit-button: button type, rounded, filled style
- cancel-button: button type, rounded, outlined style
- email-input: input type, light border, minimal style

[Spawns 3 designer agents in a SINGLE message]

✓ All 3 components created successfully in parallel!

## submit-button (button)
Files: submit-button.uxm + submit-button.md

## cancel-button (button)
Files: cancel-button.uxm + cancel-button.md

## email-input (input)
Files: email-input.uxm + email-input.md

Total: 6 files created
Performance: ~3x faster than sequential creation

Next steps:
- Add states to components
- Use in a screen
- View all components
```

## Benefits of Using Designer Agent

- **Consistent quality**: Agent follows quality standards
- **Complete metadata**: Proper tags, descriptions, accessibility
- **Best practices**: Schema compliance, naming conventions
- **Reusable logic**: Same creation workflow across all skills
- **Parallel execution**: Multiple components created simultaneously (not sequentially)

## Performance Benefits

**Single vs Multi-Component Creation:**

- **Sequential (old)**: Component 1 → wait → Component 2 → wait → Component 3
  - Time: 3 × agent_time

- **Parallel (new)**: Component 1 + Component 2 + Component 3 → all at once
  - Time: 1 × agent_time (3x faster!)

**When to use multi-component creation:**
- Creating multiple components for a single screen (e.g., login form components)
- Building a component library in bulk
- Prototyping quickly with several variations

**Example speedup:**
- 1 component: ~30 seconds
- 3 components sequential: ~90 seconds
- 3 components parallel: ~30 seconds (3x faster!) ⚡

## Error Handling

**If single designer agent fails:**
- Report specific error from agent
- Suggest fixes or alternatives
- User can retry with adjusted requirements

**If multiple designer agents fail:**
- Report which components succeeded and which failed
- Keep successfully created components (partial success is OK)
- User can retry failed components individually or as a group

**Example partial failure:**
```
✓ submit-button created successfully
✓ cancel-button created successfully
✗ email-input failed: Invalid component type specified

2 of 3 components created. You can:
1. Retry email-input with corrected parameters
2. Use the 2 successful components as-is
3. Manually create email-input
```

## Success Criteria

**For single component:**
- ✓ Designer agent created component successfully
- ✓ Both .uxm and .md files exist in ./fluxwing/components/
- ✓ Component follows uxscii standard
- ✓ User can immediately use or expand the component

**For multiple components:**
- ✓ All designer agents launched in parallel (single message)
- ✓ Each component has both .uxm and .md files in ./fluxwing/components/
- ✓ All components follow uxscii standard
- ✓ Clear report showing which succeeded/failed (if any failures)
- ✓ User can immediately use all successful components

You are helping build AI-native designs with production-quality components at maximum speed!
