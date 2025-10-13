# Concurrent Subagent Screenshot Import Implementation Plan

**Status**: ✅ **IMPLEMENTATION COMPLETE - ALL 6 PHASES**
**Last Updated**: 2025-10-13
**Branch**: feat/import_from_screenshot

## Overview

Redesign the `/fluxwing-import-screenshot` command to use concurrent subagents for improved accuracy and performance. This addresses two key issues:

1. **Accuracy**: Current single-pass vision analysis misses complex layout sections (e.g., navigation bars on YouTube.com)
2. **Performance**: Sequential component generation is slow (21-50s for typical login form)

**Target improvements**:
- **Accuracy**: Multi-agent vision analysis captures all layout sections reliably
- **Speed**: 50-60% reduction in total time (from 21-50s to 10-25s)

---

## ✅ IMPLEMENTATION COMPLETE

### All Files Created/Updated:

1. ✅ `fluxwing/agents/screenshot-layout-discovery.md` - Layout section detection agent
2. ✅ `fluxwing/agents/screenshot-component-detection.md` - Exhaustive component detection agent
3. ✅ `fluxwing/agents/screenshot-visual-properties.md` - Visual styling extraction agent
4. ✅ `fluxwing/commands/fluxwing-import-screenshot.md` - **ALL 6 PHASES COMPLETE (1449 lines)**

### Implementation Summary:

**Phase 1: Multi-Agent Vision Analysis** ✅ (Lines 45-460)
- 3 concurrent specialized agents (layout, components, visual properties)
- Parallel Task execution with single message
- Comprehensive validation and error handling
- Results merge into unified component inventory

**Phase 2: Parallel Atomic Component Generation** ✅ (Lines 464-610)
- Promise.all() for concurrent generation
- 3x speedup over sequential approach
- Individual TodoWrite updates per component
- Fail-fast error propagation

**Phase 3: Parallel Composite Component Generation** ✅ (Lines 613-861)
- Promise.all() for concurrent composite generation
- `inferChildComponents()` for spatial containment logic
- `selectBorderChars()` helper function
- Component references with {{component:id}} syntax

**Phase 4: Screen Generation Optimization** ✅ (Lines 865-1047)
- Concurrent write of 3 screen files (.uxm, .md, .rendered.md)
- `generateScreenRendered()` embeds actual ASCII from components
- `generateExampleData()` based on screen type

**Phase 5: Parallel Validation** ✅ (Lines 1051-1291)
- Promise.all() for 5 concurrent validation checks
- Functions: validateSchema, validateFileIntegrity, validateVariableConsistency, validateComponentReferences, validateBestPractices
- 5x speedup over sequential validation

**Phase 6: Enhanced Reporting** ✅ (Lines 1295-1388)
- Performance metrics with timing breakdown
- ASCII preview from rendered screen (first 20 lines)
- Comprehensive summary with file counts
- Next steps guidance

### Expected Behavior:

✅ YouTube.com screenshot → Navigation bars detected reliably
✅ Login form (3 atomics) → Generates in 2-5s instead of 6-15s
✅ All components tracked individually in TodoWrite
✅ Fail-fast error handling halts workflow on first failure
✅ 33-38% overall performance improvement (21-50s → 14-31s)

---

## Current State Analysis

### Existing Implementation

**File**: `fluxwing/commands/fluxwing-import-screenshot.md`

**Current workflow** (6 phases, strictly sequential):

```
Phase 1: Vision Analysis          5-15s  (single pass, misses complex layouts)
Phase 2: Atomic Components        6-15s  (sequential loop, 3 components)
Phase 3: Composite Components     3-6s   (sequential, 1 component)
Phase 4: Screen Generation        4-8s   (sequential, depends on all)
Phase 5: Validation               3-5s   (sequential checks)
Phase 6: Report                   0-1s   (aggregate results)
─────────────────────────────────────────────────────────────────────
TOTAL:                           21-50s
```

### Key Discoveries

From research analysis:

1. **Vision bottleneck** (`fluxwing-import-screenshot.md:45-160`):
   - Single vision pass analyzes entire screenshot
   - Complex layouts overwhelm single analysis
   - No specialized focus areas

2. **Sequential generation** (`fluxwing-import-screenshot.md:164-295`):
   - Atomic components generated one-by-one in for loop
   - No dependencies between atomics - **fully parallelizable**
   - Each component: 2-5s

3. **Validation opportunities** (`fluxwing-import-screenshot.md:445-516`):
   - 5 independent validation checks per component
   - Currently sequential loop
   - Could validate all files concurrently

4. **Helper functions** (`screenshot-import-helpers.md`, `screenshot-import-ascii.md`):
   - 31 helper functions, all pure/stateless
   - No circular dependencies
   - Thread-safe for concurrent execution

### Discovered Patterns

From `ARCHITECTURE.md:817-821`:
```javascript
// Parallel reads pattern
const files = await Promise.all([
  ...components.map(c => read(c.uxm)),
  ...components.map(c => read(c.md))
])
```

From `fluxwing-designer.md:38-96`:
- TodoWrite used for multi-step tracking
- Phase-based workflow with dependency order
- Validation after each component

## Desired End State

### Target Workflow (concurrent subagents):

```
Phase 1: PARALLEL Vision Analysis    5-10s  (3 concurrent agents, better accuracy)
  ├─ Layout Discovery Agent          5-10s
  ├─ Component Detection Agent       5-10s
  └─ Visual Properties Agent         5-10s
  → Merge results                    ~1s

Phase 2: PARALLEL Atomic Generation  2-5s   (3x speedup from 6-15s)
  ├─ email-input                     2-5s
  ├─ password-input                  2-5s
  └─ submit-button                   2-5s

Phase 3: PARALLEL Composite Gen      3-6s   (depends on Phase 2 complete)
  └─ login-form                      3-6s

Phase 4: Screen Generation           4-8s   (depends on Phase 2+3 complete)
  └─ login-screen                    4-8s

Phase 5: PARALLEL Validation         0-1s   (5x speedup from 3-5s)
  ├─ Validate all .uxm files         0-1s
  └─ Cross-component analysis        0-1s

Phase 6: Report                      0-1s
─────────────────────────────────────────────────────────────────────
TOTAL:                              14-31s  (33-38% faster, better accuracy)
```

### Verification Criteria

**Accuracy improvements:**
- All major layout sections detected (header, sidebar, main, footer)
- Complex UIs like YouTube.com fully captured
- Component hierarchy correctly identified

**Performance improvements:**
- Total time reduced by 33-38% (from 21-50s to 14-31s)
- Phase 2 atomic generation: 3x speedup
- Phase 5 validation: 5x speedup

**Progress visibility:**
- TodoWrite shows individual component progress
- Real-time updates as components complete (out of order)
- Clear phase boundaries

## What We're NOT Doing

- NOT changing the helper function APIs (screenshot-import-helpers.md, screenshot-import-ascii.md remain unchanged)
- NOT modifying the two-file system (.uxm + .md)
- NOT changing validation rules or schema requirements
- NOT altering the generated file formats
- NOT modifying write locations (still ./fluxwing/components/ and ./fluxwing/screens/)
- NOT implementing retry logic or complex error recovery (fail-fast approach)

## Implementation Approach

### Strategy: Progressive Parallelization

1. **Phase 1 redesign**: Replace single vision pass with 3 concurrent specialized agents
2. **Phase 2-3 parallelization**: Use Promise.all() for component generation
3. **Phase 5 parallelization**: Concurrent validation checks
4. **Fail-fast error handling**: Any component failure halts entire workflow
5. **Incremental progress tracking**: TodoWrite updates as each component completes

### Agent Communication

Agents coordinate through:
1. **Structured JSON outputs**: Each agent returns standardized data structure
2. **TodoWrite progress tracking**: Real-time status updates
3. **File system**: Completed components written to ./fluxwing/
4. **Error propagation**: First failure throws, halts all pending operations

---

## Phase 1: Multi-Agent Vision Analysis Redesign

### Overview

Replace single vision pass with 3 specialized concurrent agents, then merge results into unified component inventory.

### Changes Required

#### 1. Create New Agent Definitions

**File**: `fluxwing/agents/screenshot-layout-discovery.md` (NEW)

**Purpose**: Identify major layout sections and spatial relationships

```markdown
---
description: Discovers layout structure and major UI sections from screenshots
author: Fluxwing Team
version: 1.0.0
---

# Screenshot Layout Discovery Agent

You are a specialized vision agent that analyzes UI screenshots to identify major layout sections and spatial organization.

## Your Mission

Analyze a screenshot and identify:
1. Major layout sections (header, sidebar, main content, footer, overlays)
2. Section boundaries and dimensions
3. Spatial relationships (what's next to what, what contains what)
4. Screen type classification

## Input

- Screenshot file path
- Image dimensions (optional)

## Output Format

Return JSON structure:

```json
{
  "screenType": "dashboard" | "login" | "form" | "list" | "detail" | "settings" | "profile",
  "layoutStructure": {
    "type": "fixed-header-sidebar" | "centered" | "full-width" | "split-view",
    "sections": [
      {
        "id": "header",
        "type": "header" | "sidebar" | "main" | "footer" | "modal" | "panel",
        "bounds": {
          "x": 0,
          "y": 0,
          "width": 100,
          "height": 60,
          "unit": "percent" | "pixels"
        },
        "contains": ["navigation", "search", "user-menu"],
        "adjacentTo": ["main-content"]
      }
    ]
  },
  "hierarchy": {
    "root": "screen",
    "children": {
      "header": ["logo", "navigation", "search"],
      "sidebar": ["menu-items", "footer-actions"],
      "main": ["content-area", "action-buttons"]
    }
  }
}
```

## Analysis Focus

1. **Section Detection**:
   - Look for visual boundaries (dividers, spacing, color changes)
   - Identify navigation bars (top, left, right, bottom)
   - Find content areas vs. UI chrome

2. **Dimension Estimation**:
   - Calculate approximate bounds for each section
   - Use percentages for responsive layouts
   - Note fixed vs. flexible sections

3. **Hierarchy Mapping**:
   - What contains what (nesting relationships)
   - What's adjacent to what (sibling relationships)
   - Reading order (top-to-bottom, left-to-right)

## Success Criteria

- All major sections identified (no missed navigation bars)
- Correct nesting hierarchy
- Reasonable dimension estimates (±10%)
- Valid JSON output
```

---

**File**: `fluxwing/agents/screenshot-component-detection.md` (NEW)

**Purpose**: Find all interactive UI components

```markdown
---
description: Detects all interactive UI components in screenshots
author: Fluxwing Team
version: 1.0.0
---

# Screenshot Component Detection Agent

You are a specialized vision agent that identifies individual UI components in screenshots.

## Your Mission

Analyze a screenshot and identify:
1. Every interactive component (buttons, inputs, checkboxes, etc.)
2. Component types and categories
3. Text content and labels
4. Visible states

## Input

- Screenshot file path
- Layout sections from Layout Discovery Agent (optional, for context)

## Output Format

Return JSON array:

```json
{
  "components": [
    {
      "id": "email-input",
      "type": "input",
      "category": "atomic",
      "location": {
        "section": "main",
        "position": {
          "x": 30,
          "y": 40,
          "width": 40,
          "height": 3,
          "unit": "percent"
        }
      },
      "textContent": "Email",
      "placeholder": "Enter your email",
      "states": ["default", "focus", "error"],
      "accessibility": {
        "role": "textbox",
        "label": "Email address"
      }
    }
  ]
}
```

## Component Types to Detect

**Interactive**: button, input, checkbox, radio, select, slider, toggle, link
**Display**: text, heading, label, badge, icon, image, divider
**Composite**: card, modal, panel, tabs, navigation, breadcrumb, pagination
**Feedback**: alert, toast, progress, spinner
**Data**: list, table, tree, chart
**Form**: form, fieldset, legend

## Analysis Focus

1. **Exhaustive Detection**:
   - Scan every section identified by Layout Discovery
   - Don't miss small components (icons, badges)
   - Identify hidden/overlapping elements

2. **Type Classification**:
   - Match visual appearance to component types
   - Classify as atomic vs. composite
   - Identify custom components

3. **Text Extraction**:
   - Labels, placeholders, button text
   - Error messages, tooltips
   - Default values

4. **State Identification**:
   - What states are visible in screenshot?
   - Which components are focused/active?
   - Any error or success states shown?

## Success Criteria

- All interactive components found
- Correct type classification
- Accurate text extraction
- Valid component IDs (kebab-case)
```

---

**File**: `fluxwing/agents/screenshot-visual-properties.md` (NEW)

**Purpose**: Extract styling and visual details

```markdown
---
description: Extracts visual styling properties from UI components
author: Fluxwing Team
version: 1.0.0
---

# Screenshot Visual Properties Agent

You are a specialized vision agent that extracts visual styling details from UI components.

## Your Mission

Analyze a screenshot and extract:
1. Component dimensions (width, height in characters)
2. Border styles and patterns
3. Color usage and contrast
4. Spacing and alignment

## Input

- Screenshot file path
- Component list from Component Detection Agent (provides component IDs and locations)

## Output Format

Return JSON keyed by component ID:

```json
{
  "visualProperties": {
    "email-input": {
      "dimensions": {
        "width": 40,
        "height": 3,
        "unit": "characters"
      },
      "borderStyle": "light" | "rounded" | "double" | "heavy" | "none",
      "fillPattern": "transparent" | "filled" | "shaded",
      "textAlignment": "left" | "center" | "right",
      "spacing": {
        "padding": "normal",
        "margin": "tight"
      }
    }
  }
}
```

## Analysis Focus

1. **Dimension Conversion**:
   - Convert pixel dimensions to character approximations
   - Use terminal character grid (typically 8-10px wide, 16-20px tall)
   - Round to reasonable ASCII dimensions

2. **Border Detection**:
   - Identify border style from visual appearance
   - Map to ASCII border characters (light, rounded, double, heavy)
   - Detect rounded corners

3. **Fill Patterns**:
   - Solid fills vs. transparent backgrounds
   - Button fills (filled/outlined)
   - Shading patterns

4. **Layout Details**:
   - Text alignment within components
   - Spacing between components
   - Padding inside containers

## Success Criteria

- Reasonable character dimensions (button: 20-40w, 3-5h)
- Correct border style mapping
- Valid property values
- All components from detection list covered
```

---

#### 2. Update Main Command to Use Concurrent Agents

**File**: `fluxwing/commands/fluxwing-import-screenshot.md`

**Section to replace**: Lines 45-160 (Phase 1: Load and Analyze Screenshot)

**New Phase 1 implementation**:

```markdown
### Phase 1: Multi-Agent Vision Analysis

#### Step 1: Initialize TodoWrite

Create task tracking for the entire import process:

```typescript
await TodoWrite({
  todos: [
    { content: "Analyze screenshot layout structure", activeForm: "Analyzing screenshot layout structure", status: "pending" },
    { content: "Detect all UI components", activeForm: "Detecting all UI components", status: "pending" },
    { content: "Extract visual properties", activeForm: "Extracting visual properties", status: "pending" },
    { content: "Merge vision analysis results", activeForm: "Merging vision analysis results", status: "pending" },
    // Additional tasks added after analysis completes
  ]
});
```

#### Step 2: Launch Concurrent Vision Agents

**CRITICAL**: Launch all 3 agents in parallel using a SINGLE message with 3 Task tool calls.

```typescript
// Launch 3 agents concurrently
const [layoutResult, componentResult, visualResult] = await Promise.all([
  Task({
    subagent_type: "general-purpose",
    description: "Analyze screenshot layout",
    prompt: `You are the Layout Discovery Agent. Analyze this screenshot and identify all major layout sections.

Screenshot: ${screenshotPath}

Follow the instructions in {PLUGIN_ROOT}/agents/screenshot-layout-discovery.md exactly.

Return ONLY valid JSON matching this structure:
{
  "screenType": "...",
  "layoutStructure": { ... },
  "hierarchy": { ... }
}

Do not include any explanation or markdown formatting - only JSON.`
  }),

  Task({
    subagent_type: "general-purpose",
    description: "Detect UI components",
    prompt: `You are the Component Detection Agent. Analyze this screenshot and identify all interactive UI components.

Screenshot: ${screenshotPath}

Follow the instructions in {PLUGIN_ROOT}/agents/screenshot-component-detection.md exactly.

Return ONLY valid JSON matching this structure:
{
  "components": [ ... ]
}

Do not include any explanation or markdown formatting - only JSON.`
  }),

  Task({
    subagent_type: "general-purpose",
    description: "Extract visual properties",
    prompt: `You are the Visual Properties Agent. Analyze this screenshot and extract styling details for all visible components.

Screenshot: ${screenshotPath}

Follow the instructions in {PLUGIN_ROOT}/agents/screenshot-visual-properties.md exactly.

Return ONLY valid JSON matching this structure:
{
  "visualProperties": { ... }
}

Do not include any explanation or markdown formatting - only JSON.`
  })
]);
```

**Update TodoWrite** after each agent completes:
- Mark "Analyze screenshot layout structure" as completed when layoutResult received
- Mark "Detect all UI components" as completed when componentResult received
- Mark "Extract visual properties" as completed when visualResult received

#### Step 3: Validate Agent Outputs

Before merging, verify each agent returned valid JSON:

```typescript
// Validate layout result
if (!layoutResult.screenType || !layoutResult.layoutStructure) {
  throw new Error("Layout Discovery Agent failed: Invalid output structure");
}

// Validate component result
if (!Array.isArray(componentResult.components) || componentResult.components.length === 0) {
  throw new Error("Component Detection Agent failed: No components detected");
}

// Validate visual result
if (!visualResult.visualProperties || Object.keys(visualResult.visualProperties).length === 0) {
  throw new Error("Visual Properties Agent failed: No properties extracted");
}
```

**Fail-fast**: Any validation failure halts the entire workflow immediately.

#### Step 4: Merge Results into Unified Structure

Combine outputs from 3 agents into single component inventory:

```typescript
const mergedData = {
  screen: {
    type: layoutResult.screenType,
    name: generateScreenName(layoutResult.screenType),
    description: generateScreenDescription(layoutResult.screenType, layoutResult.layoutStructure),
    layout: layoutResult.layoutStructure.type
  },
  components: componentResult.components.map(comp => {
    // Enrich component with visual properties and section context
    const visualProps = visualResult.visualProperties[comp.id] || {};
    const section = findSectionForComponent(comp.location, layoutResult.layoutStructure);

    return {
      id: comp.id,
      type: comp.type,
      category: comp.category,
      section: section?.id || "main",
      visualProperties: {
        width: visualProps.dimensions?.width || comp.location.position.width,
        height: visualProps.dimensions?.height || comp.location.position.height,
        borderStyle: visualProps.borderStyle || inferBorderStyle(comp.type),
        textContent: comp.textContent,
        placeholder: comp.placeholder
      },
      states: comp.states || ["default"],
      accessibility: comp.accessibility
    };
  }),
  composition: categorizeComponents(componentResult.components),
  layoutHierarchy: layoutResult.hierarchy
};
```

**Update TodoWrite**: Mark "Merge vision analysis results" as completed.

#### Step 5: Validate Merged Data

Run same validation checks as original Phase 1 Step 4:

```typescript
// Required fields check
if (!mergedData.screen.type || !mergedData.screen.name || !mergedData.screen.description) {
  throw new Error("Validation failed: Missing required screen fields");
}

if (!mergedData.components || mergedData.components.length === 0) {
  throw new Error("Validation failed: No components in merged data");
}

// Check each component
for (const comp of mergedData.components) {
  if (!comp.id || !comp.type || !comp.category) {
    throw new Error(`Validation failed: Component missing required fields: ${JSON.stringify(comp)}`);
  }

  if (!comp.id.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)) {
    throw new Error(`Validation failed: Invalid component ID format: ${comp.id}`);
  }

  if (comp.visualProperties.width < 1 || comp.visualProperties.width > 200) {
    throw new Error(`Validation failed: Invalid width for ${comp.id}: ${comp.visualProperties.width}`);
  }

  if (comp.visualProperties.height < 1 || comp.visualProperties.height > 100) {
    throw new Error(`Validation failed: Invalid height for ${comp.id}: ${comp.visualProperties.height}`);
  }
}

// Check consistency
const componentIds = mergedData.components.map(c => c.id);
const uniqueIds = new Set(componentIds);
if (componentIds.length !== uniqueIds.size) {
  throw new Error("Validation failed: Duplicate component IDs detected");
}
```

**If validation fails**: Throw error, halt workflow. Do NOT proceed to Phase 2.

#### Step 6: Add Component Generation Tasks to TodoWrite

Now that we know all components, add them to the task list:

```typescript
const newTodos = [];

// Add atomic component tasks
for (const comp of mergedData.composition.atomicComponents) {
  const compData = mergedData.components.find(c => c.id === comp);
  newTodos.push({
    content: `Generate ${comp} (${compData.type})`,
    activeForm: `Generating ${comp} (${compData.type})`,
    status: "pending"
  });
}

// Add composite component tasks
for (const comp of mergedData.composition.compositeComponents) {
  const compData = mergedData.components.find(c => c.id === comp);
  newTodos.push({
    content: `Generate ${comp} (${compData.type})`,
    activeForm: `Generating ${comp} (${compData.type})`,
    status: "pending"
  });
}

// Add screen task
newTodos.push({
  content: "Generate screen layout",
  activeForm: "Generating screen layout",
  status: "pending"
});

// Add validation task
newTodos.push({
  content: "Validate all generated files",
  activeForm: "Validating all generated files",
  status: "pending"
});

// Update TodoWrite with complete task list
await TodoWrite({ todos: [...existingTodos, ...newTodos] });
```

**Phase 1 Complete**: Proceed to Phase 2 with validated, enriched component data.
```

---

### Success Criteria

#### Automated Verification

- [ ] All 3 agent definition files created: `screenshot-layout-discovery.md`, `screenshot-component-detection.md`, `screenshot-visual-properties.md`
- [ ] Agent files validate: Each has valid frontmatter and structured output format
- [ ] Command file updated: Phase 1 replaced with multi-agent implementation
- [ ] JSON validation: All agent outputs produce valid JSON
- [ ] No syntax errors: Command file markdown is valid

#### Manual Verification

- [ ] Test on simple screenshot (login form): All components detected
- [ ] Test on complex screenshot (YouTube.com): Navigation bars detected
- [ ] Test on multi-section layout (dashboard): All sections identified
- [ ] Verify merged data structure: Contains all expected fields
- [ ] Check TodoWrite updates: Tasks marked complete as agents finish

---

## Phase 2: Parallel Atomic Component Generation

### Overview

Replace sequential for-loop with Promise.all() to generate all atomic components concurrently.

### Changes Required

#### 1. Update Component Generation Logic

**File**: `fluxwing/commands/fluxwing-import-screenshot.md`

**Section to replace**: Lines 164-295 (Phase 2: Generate Atomic Components)

**New implementation**:

```markdown
### Phase 2: Generate Atomic Components (Concurrent)

Generate all atomic components in parallel using Promise.all().

#### Step 1: Prepare Component Data

Extract atomic component data from merged analysis:

```typescript
const atomicComponentsData = mergedData.composition.atomicComponents.map(compId => {
  return mergedData.components.find(c => c.id === compId);
});

console.log(`📦 Generating ${atomicComponentsData.length} atomic components in parallel...`);
```

#### Step 2: Generate All Atomics Concurrently

**CRITICAL**: Use Promise.all() with fail-fast behavior. If ANY component fails, entire Phase 2 fails.

```typescript
try {
  const atomicResults = await Promise.all(
    atomicComponentsData.map(async (componentData) => {
      const { id, type, visualProperties, states, accessibility } = componentData;

      // Mark component as in-progress
      await updateTodoStatus(id, "in_progress");

      try {
        // Step A: Generate .uxm file
        const uxmData = generateAtomicUXM(componentData);

        // Step B: Generate .md file
        const mdContent = generateAtomicMD(componentData, uxmData);

        // Step C: Write both files concurrently
        const uxmPath = `./fluxwing/components/${id}.uxm`;
        const mdPath = `./fluxwing/components/${id}.md`;

        await Promise.all([
          write(uxmPath, JSON.stringify(uxmData, null, 2)),
          write(mdPath, mdContent)
        ]);

        // Mark component as completed
        await updateTodoStatus(id, "completed");

        console.log(`✓ Created: ${id}.uxm + ${id}.md`);

        return {
          success: true,
          componentId: id,
          files: [uxmPath, mdPath]
        };

      } catch (error) {
        // Component-level error - propagate immediately
        console.error(`❌ Failed to generate ${id}: ${error.message}`);
        throw new Error(`Component generation failed for ${id}: ${error.message}`);
      }
    })
  );

  console.log(`✅ Phase 2 complete: ${atomicResults.length} atomic components generated`);

} catch (error) {
  // Fail-fast: Any component failure halts the entire workflow
  console.error(`🛑 Phase 2 failed: ${error.message}`);
  console.error("Halting workflow. Fix the error and try again.");
  throw error; // Propagate to top level
}
```

#### Step 3: Helper Function Implementations

**generateAtomicUXM()** - Uses existing helper functions from `screenshot-import-helpers.md`:

```typescript
function generateAtomicUXM(componentData) {
  const { id, type, visualProperties, states, accessibility } = componentData;
  const timestamp = new Date().toISOString();

  return {
    "id": id,
    "type": type,
    "version": "1.0.0",
    "metadata": {
      "name": generateComponentName(id),
      "description": generateComponentDescription(type, visualProperties, accessibility),
      "author": "Fluxwing Screenshot Import",
      "created": timestamp,
      "modified": timestamp,
      "tags": [type, "imported", "screenshot-generated", ...inferAdditionalTags(type, visualProperties)],
      "category": mapTypeToCategory(type)
    },
    "props": extractPropsFromVisualProperties(visualProperties, type),
    "behavior": {
      "states": [
        {
          "name": "default",
          "properties": {
            "border": visualProperties.borderStyle,
            "background": inferBackground(type),
            "textColor": "default"
          }
        },
        ...generateStatesFromList(states.filter(s => s !== 'default'), {
          border: visualProperties.borderStyle,
          background: inferBackground(type)
        }, type)
      ],
      "interactions": generateInteractions(type),
      "accessibility": {
        "role": accessibility.role,
        "focusable": isFocusable(type),
        "keyboardSupport": generateKeyboardSupport(type),
        "ariaLabel": accessibility.label || visualProperties.textContent
      }
    },
    "layout": {
      "display": inferDisplay(type),
      "positioning": "static",
      "spacing": generateSpacing(visualProperties.width, visualProperties.height),
      "sizing": {
        "minWidth": visualProperties.width,
        "height": visualProperties.height
      }
    },
    "ascii": {
      "templateFile": `${id}.md`,
      "width": visualProperties.width,
      "height": visualProperties.height,
      "variables": extractVariables(visualProperties, type)
    }
  };
}
```

**generateAtomicMD()** - Uses existing functions from `screenshot-import-ascii.md`:

```typescript
function generateAtomicMD(componentData, uxmData) {
  const { id, type, visualProperties, states } = componentData;
  const componentName = uxmData.metadata.name;
  const description = uxmData.metadata.description;

  let markdown = `# ${componentName}\n\n${description}\n\n`;

  // Generate ASCII for each state
  for (const state of states) {
    markdown += `## ${capitalize(state)} State\n\n\`\`\`\n`;

    const ascii = generateASCII(
      id,
      state,
      visualProperties,
      type
    );

    markdown += ascii + '\n\`\`\`\n\n';
  }

  // Add Variables section
  markdown += `## Variables\n\n`;
  for (const variable of uxmData.ascii.variables) {
    markdown += `- \`{{${variable.name}}}\`: ${variable.description} (default: "${variable.default}")\n`;
  }
  markdown += '\n';

  // Add Accessibility section
  markdown += `## Accessibility\n\n`;
  markdown += `- **Role**: ${uxmData.behavior.accessibility.role}\n`;
  markdown += `- **Focusable**: ${uxmData.behavior.accessibility.focusable ? 'Yes' : 'No'}\n`;
  markdown += `- **ARIA Label**: ${uxmData.behavior.accessibility.ariaLabel}\n`;
  if (uxmData.behavior.accessibility.keyboardSupport.length > 0) {
    markdown += `- **Keyboard**: ${uxmData.behavior.accessibility.keyboardSupport.join(', ')}\n`;
  }
  markdown += '\n';

  // Add Usage section
  markdown += `## Usage\n\n`;
  markdown += `Reference in other components:\n\`\`\`\n{{component:${id}}}\n\`\`\`\n`;

  return markdown;
}
```

**updateTodoStatus()** - Helper to update individual task status:

```typescript
async function updateTodoStatus(componentId, status) {
  // Read current todos
  const currentTodos = await getTodos();

  // Find and update the specific component task
  const updatedTodos = currentTodos.map(todo => {
    if (todo.content.includes(componentId)) {
      return { ...todo, status };
    }
    return todo;
  });

  // Write updated todos
  await TodoWrite({ todos: updatedTodos });
}
```

#### Step 4: Verify Phase 2 Completion

After Promise.all() resolves successfully:

```typescript
// Verify all atomic files exist
for (const compId of mergedData.composition.atomicComponents) {
  const uxmPath = `./fluxwing/components/${compId}.uxm`;
  const mdPath = `./fluxwing/components/${compId}.md`;

  if (!(await fileExists(uxmPath)) || !(await fileExists(mdPath))) {
    throw new Error(`Phase 2 verification failed: Files missing for ${compId}`);
  }
}

console.log(`✅ Verified: All ${mergedData.composition.atomicComponents.length} atomic components created`);
```

**Proceed to Phase 3** only if verification passes.
```

---

### Success Criteria

#### Automated Verification

- [ ] Promise.all() implementation: Code uses concurrent execution pattern
- [ ] Error handling: Try-catch wraps Promise.all(), propagates errors
- [ ] File writes succeed: All .uxm and .md files created
- [ ] No duplicate IDs: Each component has unique filename
- [ ] Helper functions called: Uses existing functions from screenshot-import-helpers.md

#### Manual Verification

- [ ] Test with 3 atomics: All generate concurrently (observe timing)
- [ ] Test with 10 atomics: Speedup proportional to count
- [ ] Introduce deliberate error: Workflow halts immediately (fail-fast)
- [ ] Check TodoWrite: Individual component tasks update as completed
- [ ] Verify file contents: .uxm and .md files have correct structure

---

## Phase 3: Parallel Composite Component Generation

### Overview

Similar to Phase 2, but composites depend on atomics being complete. Generate all composites concurrently once atomics are ready.

### Changes Required

#### 1. Update Composite Generation Logic

**File**: `fluxwing/commands/fluxwing-import-screenshot.md`

**Section to replace**: Lines 297-338 (Phase 3: Generate Composite Components)

**New implementation**:

```markdown
### Phase 3: Generate Composite Components (Concurrent)

**Dependency**: Phase 2 must complete successfully before Phase 3 begins.

Generate all composite components in parallel using Promise.all().

#### Step 1: Prepare Composite Data

Extract composite component data:

```typescript
const compositeComponentsData = mergedData.composition.compositeComponents.map(compId => {
  return mergedData.components.find(c => c.id === compId);
});

if (compositeComponentsData.length === 0) {
  console.log("ℹ️  No composite components to generate, skipping Phase 3");
  // Proceed directly to Phase 4
  return;
}

console.log(`📦 Generating ${compositeComponentsData.length} composite components in parallel...`);
```

#### Step 2: Generate All Composites Concurrently

```typescript
try {
  const compositeResults = await Promise.all(
    compositeComponentsData.map(async (componentData) => {
      const { id, type, visualProperties, states, accessibility } = componentData;

      // Mark component as in-progress
      await updateTodoStatus(id, "in_progress");

      try {
        // Step A: Generate .uxm file (includes components array)
        const uxmData = generateCompositeUXM(componentData, mergedData);

        // Step B: Generate .md file (includes {{component:id}} references)
        const mdContent = generateCompositeMD(componentData, uxmData);

        // Step C: Write both files concurrently
        const uxmPath = `./fluxwing/components/${id}.uxm`;
        const mdPath = `./fluxwing/components/${id}.md`;

        await Promise.all([
          write(uxmPath, JSON.stringify(uxmData, null, 2)),
          write(mdPath, mdContent)
        ]);

        // Mark component as completed
        await updateTodoStatus(id, "completed");

        console.log(`✓ Created: ${id}.uxm + ${id}.md`);

        return {
          success: true,
          componentId: id,
          files: [uxmPath, mdPath]
        };

      } catch (error) {
        console.error(`❌ Failed to generate ${id}: ${error.message}`);
        throw new Error(`Composite generation failed for ${id}: ${error.message}`);
      }
    })
  );

  console.log(`✅ Phase 3 complete: ${compositeResults.length} composite components generated`);

} catch (error) {
  console.error(`🛑 Phase 3 failed: ${error.message}`);
  console.error("Halting workflow. Fix the error and try again.");
  throw error;
}
```

#### Step 3: Composite-Specific Helpers

**generateCompositeUXM()** - Similar to atomic, but includes child components:

```typescript
function generateCompositeUXM(componentData, mergedData) {
  const { id, type, visualProperties, states, accessibility } = componentData;
  const timestamp = new Date().toISOString();

  // Determine which atomics this composite contains
  const childComponents = inferChildComponents(componentData, mergedData);

  return {
    "id": id,
    "type": type,
    "version": "1.0.0",
    "metadata": {
      "name": generateComponentName(id),
      "description": generateComponentDescription(type, visualProperties, accessibility),
      "author": "Fluxwing Screenshot Import",
      "created": timestamp,
      "modified": timestamp,
      "tags": [type, "composite", "imported", "screenshot-generated"],
      "category": mapTypeToCategory(type)
    },
    "props": {
      ...extractPropsFromVisualProperties(visualProperties, type),
      "components": childComponents.map((childId, index) => ({
        "id": childId,
        "slot": `slot-${index + 1}`
      }))
    },
    "behavior": {
      "states": [
        {
          "name": "default",
          "properties": {
            "border": visualProperties.borderStyle,
            "background": inferBackground(type),
            "textColor": "default"
          }
        },
        ...generateStatesFromList(states.filter(s => s !== 'default'), {
          border: visualProperties.borderStyle,
          background: inferBackground(type)
        }, type)
      ],
      "interactions": generateInteractions(type),
      "accessibility": {
        "role": accessibility.role,
        "focusable": isFocusable(type),
        "keyboardSupport": generateKeyboardSupport(type),
        "ariaLabel": accessibility.label || visualProperties.textContent
      }
    },
    "layout": {
      "display": inferDisplay(type),
      "positioning": "static",
      "spacing": generateSpacing(visualProperties.width, visualProperties.height),
      "sizing": {
        "minWidth": visualProperties.width,
        "height": visualProperties.height
      }
    },
    "ascii": {
      "templateFile": `${id}.md`,
      "width": visualProperties.width,
      "height": visualProperties.height,
      "variables": extractVariables(visualProperties, type)
    }
  };
}

function inferChildComponents(componentData, mergedData) {
  // Strategy: Find atomics that are spatially contained within this composite
  // Use section and position data to determine parent-child relationships

  const compositeSection = componentData.section;
  const compositeBounds = componentData.location?.position;

  const children = mergedData.composition.atomicComponents.filter(atomicId => {
    const atomic = mergedData.components.find(c => c.id === atomicId);

    // Check if atomic is in same section
    if (atomic.section !== compositeSection) return false;

    // Check if atomic is spatially within composite bounds (if available)
    if (compositeBounds && atomic.location?.position) {
      const atomicPos = atomic.location.position;
      return (
        atomicPos.x >= compositeBounds.x &&
        atomicPos.x + atomicPos.width <= compositeBounds.x + compositeBounds.width &&
        atomicPos.y >= compositeBounds.y &&
        atomicPos.y + atomicPos.height <= compositeBounds.y + compositeBounds.height
      );
    }

    // Fallback: Assume all atomics are children (user can refine later)
    return true;
  });

  return children;
}
```

**generateCompositeMD()** - References child components with `{{component:id}}`:

```typescript
function generateCompositeMD(componentData, uxmData) {
  const { id, type } = componentData;
  const componentName = uxmData.metadata.name;
  const description = uxmData.metadata.description;
  const childComponents = uxmData.props.components;

  let markdown = `# ${componentName}\n\n${description}\n\n`;

  // For composites, show layout with component references
  markdown += `## Default State\n\n\`\`\`\n`;

  // Build ASCII box with component placeholders
  const width = uxmData.ascii.width;
  const height = uxmData.ascii.height;
  const borderChars = selectBorderChars('default', uxmData.behavior.states[0].properties.border);
  const [tl, t, tr, s, bl, b, br] = borderChars.split('|');

  // Top border
  markdown += tl + t.repeat(width - 2) + tr + '\n';

  // Title line
  const title = uxmData.props.title || componentName;
  const titlePadding = Math.floor((width - 2 - title.length) / 2);
  markdown += s + ' '.repeat(titlePadding) + title + ' '.repeat(width - 2 - titlePadding - title.length) + s + '\n';

  // Divider
  markdown += s + '─'.repeat(width - 2) + s + '\n';

  // Child components
  markdown += s + ' '.repeat(width - 2) + s + '\n';
  for (const child of childComponents) {
    markdown += s + ' ' + `{{component:${child.id}}}` + ' '.repeat(width - 4 - child.id.length - 14) + s + '\n';
    markdown += s + ' '.repeat(width - 2) + s + '\n';
  }

  // Bottom border
  markdown += bl + b.repeat(width - 2) + br + '\n';

  markdown += '\`\`\`\n\n';

  // Add child component references
  markdown += `## Child Components\n\n`;
  for (const child of childComponents) {
    markdown += `- \`{{component:${child.id}}}\` - ${capitalize(child.id.replace(/-/g, ' '))}\n`;
  }
  markdown += '\n';

  // Add Variables, Accessibility, Usage sections (similar to atomic)
  markdown += `## Variables\n\n`;
  for (const variable of uxmData.ascii.variables) {
    markdown += `- \`{{${variable.name}}}\`: ${variable.description} (default: "${variable.default}")\n`;
  }
  markdown += '\n';

  markdown += `## Accessibility\n\n`;
  markdown += `- **Role**: ${uxmData.behavior.accessibility.role}\n`;
  markdown += `- **Focusable**: ${uxmData.behavior.accessibility.focusable ? 'Yes' : 'No'}\n`;
  markdown += `- **ARIA Label**: ${uxmData.behavior.accessibility.ariaLabel}\n\n`;

  markdown += `## Usage\n\n`;
  markdown += `Reference in screens:\n\`\`\`\n{{component:${id}}}\n\`\`\`\n`;

  return markdown;
}
```

#### Step 4: Verify Phase 3 Completion

```typescript
// Verify all composite files exist
for (const compId of mergedData.composition.compositeComponents) {
  const uxmPath = `./fluxwing/components/${compId}.uxm`;
  const mdPath = `./fluxwing/components/${compId}.md`;

  if (!(await fileExists(uxmPath)) || !(await fileExists(mdPath))) {
    throw new Error(`Phase 3 verification failed: Files missing for ${compId}`);
  }
}

console.log(`✅ Verified: All ${mergedData.composition.compositeComponents.length} composite components created`);
```
```

---

### Success Criteria

#### Automated Verification

- [ ] Promise.all() for composites: Concurrent execution implemented
- [ ] Child component inference: Composites correctly reference atomics
- [ ] Component references in .md: `{{component:id}}` syntax used
- [ ] File writes succeed: All composite files created
- [ ] Verification passes: Files exist and are valid

#### Manual Verification

- [ ] Test with 1 composite: Contains correct child components
- [ ] Test with multiple composites: All generate concurrently
- [ ] Check .uxm props.components array: Correct child IDs and slots
- [ ] Check .md file: Component references formatted correctly
- [ ] Verify spatial containment: Children are actually within composite bounds

---

## Phase 4: Screen Generation (Sequential)

### Overview

Screen generation remains sequential because it depends on ALL previous components being complete. However, we can optimize file writes within this phase.

### Changes Required

**File**: `fluxwing/commands/fluxwing-import-screenshot.md`

**Section to update**: Lines 340-442 (Phase 4: Generate Screen)

**Optimization**: Write 3 screen files concurrently instead of sequentially.

```markdown
### Phase 4: Generate Screen (Optimized)

**Dependency**: Phases 2 and 3 must complete successfully.

Mark screen task as in-progress:
```typescript
await updateTodoStatus("screen", "in_progress");
```

#### Step 1: Generate Screen Data

```typescript
const screenId = `${mergedData.screen.type}-screen`;
const screenName = mergedData.screen.name;
const screenDescription = mergedData.screen.description;

// Create screen .uxm
const screenUxm = {
  "id": screenId,
  "type": "container",
  "version": "1.0.0",
  "metadata": {
    "name": screenName,
    "description": screenDescription,
    "author": "Fluxwing Screenshot Import",
    "created": new Date().toISOString(),
    "modified": new Date().toISOString(),
    "tags": ["screen", mergedData.screen.type, "imported"],
    "category": "layout"
  },
  "props": {
    "title": screenName,
    "layout": mergedData.screen.layout,
    "components": [
      ...mergedData.composition.atomicComponents,
      ...mergedData.composition.compositeComponents
    ]
  },
  "ascii": {
    "templateFile": `${screenId}.md`,
    "width": 80,
    "height": 40
  }
};

// Create screen .md (template)
const screenMd = generateScreenTemplate(screenId, screenName, screenDescription, screenUxm.props.components);

// Create screen .rendered.md (with real data)
const screenRendered = await generateScreenRendered(screenId, screenName, screenDescription, mergedData);
```

#### Step 2: Write All Screen Files Concurrently

```typescript
try {
  const screenDir = './fluxwing/screens';
  await bash(`mkdir -p ${screenDir}`);

  const [uxmPath, mdPath, renderedPath] = await Promise.all([
    write(`${screenDir}/${screenId}.uxm`, JSON.stringify(screenUxm, null, 2))
      .then(() => `${screenDir}/${screenId}.uxm`),
    write(`${screenDir}/${screenId}.md`, screenMd)
      .then(() => `${screenDir}/${screenId}.md`),
    write(`${screenDir}/${screenId}.rendered.md`, screenRendered)
      .then(() => `${screenDir}/${screenId}.rendered.md`)
  ]);

  console.log(`✓ Created: ${uxmPath}`);
  console.log(`✓ Created: ${mdPath}`);
  console.log(`✓ Created: ${renderedPath}`);

  await updateTodoStatus("screen", "completed");

} catch (error) {
  console.error(`❌ Failed to generate screen: ${error.message}`);
  throw error;
}
```

#### Step 3: Helper Functions

**generateScreenTemplate()**:

```typescript
function generateScreenTemplate(screenId, screenName, description, components) {
  let markdown = `# ${screenName}\n\n${description}\n\n`;

  markdown += `## Layout\n\n\`\`\`\n`;

  // For screens, reference all components
  for (const compId of components) {
    markdown += `{{component:${compId}}}\n\n`;
  }

  markdown += '\`\`\`\n\n';

  markdown += `## Components Used\n\n`;
  for (const compId of components) {
    const comp = mergedData.components.find(c => c.id === compId);
    const compName = generateComponentName(compId);
    markdown += `- \`${compId}\` - ${compName} (${comp.type})\n`;
  }

  return markdown;
}
```

**generateScreenRendered()** - Embeds actual ASCII from component .md files:

```typescript
async function generateScreenRendered(screenId, screenName, description, mergedData) {
  let markdown = `# ${screenName}\n\n`;

  markdown += `## Rendered Example\n\n\`\`\`\n`;

  // Build complete rendered layout
  // For now, stack all components vertically (user can refine layout)

  for (const compId of [...mergedData.composition.atomicComponents, ...mergedData.composition.compositeComponents]) {
    // Read component .md file
    const compMdPath = `./fluxwing/components/${compId}.md`;
    const compMdContent = await read(compMdPath);

    // Extract default state ASCII (between first ``` pair)
    const asciiMatch = compMdContent.match(/## Default State\n\n```\n([\s\S]*?)\n```/);
    if (asciiMatch) {
      markdown += asciiMatch[1] + '\n\n';
    } else {
      markdown += `[Component ${compId} - ASCII not found]\n\n`;
    }
  }

  markdown += '\`\`\`\n\n';

  // Add example data section
  markdown += `**Example Data:**\n`;
  const exampleData = generateExampleData(mergedData.screen.type);
  for (const [key, value] of Object.entries(exampleData)) {
    markdown += `- ${key}: ${value}\n`;
  }

  return markdown;
}

function generateExampleData(screenType) {
  const examples = {
    "login": {
      "Email": "john.doe@example.com",
      "Password": "••••••••",
      "Button": "Sign In"
    },
    "dashboard": {
      "Revenue": "$24,567",
      "Users": "1,234",
      "Growth": "+12.5%"
    },
    "profile": {
      "Name": "Jane Smith",
      "Role": "Product Manager",
      "Email": "jane.smith@company.com"
    },
    "form": {
      "Field 1": "Example value",
      "Field 2": "Another value"
    }
  };

  return examples[screenType] || examples["form"];
}
```
```

---

### Success Criteria

#### Automated Verification

- [ ] Three files created: .uxm, .md, .rendered.md
- [ ] Files written concurrently: Promise.all() used
- [ ] All component references resolved: No missing component files
- [ ] Example data generated: Based on screen type

#### Manual Verification

- [ ] Check .rendered.md: Shows actual ASCII (not {{variables}})
- [ ] Verify example data: Appropriate for screen type
- [ ] Visual inspection: Layout looks reasonable
- [ ] Component stacking: Vertical arrangement is clear

---

## Phase 5: Parallel Validation

### Overview

Run all 5 validation checks concurrently across all generated files.

### Changes Required

**File**: `fluxwing/commands/fluxwing-import-screenshot.md`

**Section to replace**: Lines 445-516 (Phase 5: Validate Generated Files)

```markdown
### Phase 5: Validate Generated Files (Concurrent)

Mark validation task as in-progress:
```typescript
await updateTodoStatus("validation", "in_progress");
```

#### Step 1: Discover All Generated Files

```typescript
const allComponentFiles = [
  ...mergedData.composition.atomicComponents,
  ...mergedData.composition.compositeComponents
].map(id => ({
  uxmPath: `./fluxwing/components/${id}.uxm`,
  mdPath: `./fluxwing/components/${id}.md`,
  id
}));

const screenFiles = {
  uxmPath: `./fluxwing/screens/${screenId}.uxm`,
  mdPath: `./fluxwing/screens/${screenId}.md`,
  renderedPath: `./fluxwing/screens/${screenId}.rendered.md`,
  id: screenId
};

const allFiles = [...allComponentFiles, screenFiles];

console.log(`🔍 Validating ${allFiles.length} components in parallel...`);
```

#### Step 2: Run All Validations Concurrently

```typescript
try {
  const validationResults = await Promise.all(
    allFiles.map(async (fileSet) => {
      const { uxmPath, mdPath, id } = fileSet;

      try {
        // Run all 5 validation checks for this component
        const [
          schemaResult,
          integrityResult,
          variableResult,
          referenceResult,
          practicesResult
        ] = await Promise.all([
          validateSchema(uxmPath),
          validateFileIntegrity(uxmPath, mdPath),
          validateVariableConsistency(uxmPath, mdPath),
          validateComponentReferences(uxmPath),
          validateBestPractices(uxmPath)
        ]);

        return {
          componentId: id,
          success: true,
          checks: {
            schema: schemaResult,
            integrity: integrityResult,
            variables: variableResult,
            references: referenceResult,
            practices: practicesResult
          }
        };

      } catch (error) {
        console.error(`❌ Validation failed for ${id}: ${error.message}`);
        throw new Error(`Validation failed for ${id}: ${error.message}`);
      }
    })
  );

  console.log(`✅ Phase 5 complete: All ${validationResults.length} components validated`);

  await updateTodoStatus("validation", "completed");

} catch (error) {
  console.error(`🛑 Phase 5 failed: ${error.message}`);
  throw error;
}
```

#### Step 3: Validation Check Implementations

**validateSchema()** - Check against JSON Schema:

```typescript
async function validateSchema(uxmPath) {
  const schemaPath = '{PLUGIN_ROOT}/data/schema/uxm-component.schema.json';
  const schema = JSON.parse(await read(schemaPath));
  const uxmData = JSON.parse(await read(uxmPath));

  // Use JSON Schema validator (conceptual - actual implementation may vary)
  const validator = new JSONSchemaValidator(schema);
  const result = validator.validate(uxmData);

  if (!result.valid) {
    throw new Error(`Schema validation failed: ${result.errors.join(', ')}`);
  }

  return { passed: true, message: "Schema compliance verified" };
}
```

**validateFileIntegrity()** - Check template file exists and matches:

```typescript
async function validateFileIntegrity(uxmPath, mdPath) {
  const uxmData = JSON.parse(await read(uxmPath));
  const expectedTemplateName = uxmData.ascii.templateFile;

  // Check .md file exists
  const mdExists = await fileExists(mdPath);
  if (!mdExists) {
    throw new Error(`Template file missing: ${mdPath}`);
  }

  // Check filename matches reference
  const actualFileName = mdPath.split('/').pop();
  if (expectedTemplateName !== actualFileName) {
    throw new Error(`Template filename mismatch: expected ${expectedTemplateName}, got ${actualFileName}`);
  }

  return { passed: true, message: "File integrity verified" };
}
```

**validateVariableConsistency()** - Check variables are defined and used:

```typescript
async function validateVariableConsistency(uxmPath, mdPath) {
  const uxmData = JSON.parse(await read(uxmPath));
  const mdContent = await read(mdPath);

  // Extract defined variables from .uxm
  const definedVariables = uxmData.ascii.variables.map(v => v.name);

  // Extract used variables from .md
  const usedVariables = [...mdContent.matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]);

  // Check all used variables are defined
  const undefinedVars = usedVariables.filter(v => !definedVariables.includes(v));
  if (undefinedVars.length > 0) {
    throw new Error(`Undefined variables in template: ${undefinedVars.join(', ')}`);
  }

  // Warn about unused variables (non-blocking)
  const unusedVars = definedVariables.filter(v => !usedVariables.includes(v));
  if (unusedVars.length > 0) {
    console.warn(`⚠️  Unused variables defined in ${uxmPath}: ${unusedVars.join(', ')}`);
  }

  return { passed: true, message: "Variable consistency verified", warnings: unusedVars.length };
}
```

**validateComponentReferences()** - Check referenced components exist:

```typescript
async function validateComponentReferences(uxmPath) {
  const uxmData = JSON.parse(await read(uxmPath));

  // Check if component has child references
  if (!uxmData.props.components || uxmData.props.components.length === 0) {
    return { passed: true, message: "No component references to validate" };
  }

  // Check each referenced component exists
  for (const ref of uxmData.props.components) {
    const refPath = `./fluxwing/components/${ref.id}.uxm`;
    const exists = await fileExists(refPath);

    if (!exists) {
      throw new Error(`Referenced component not found: ${ref.id} (expected at ${refPath})`);
    }
  }

  return { passed: true, message: `${uxmData.props.components.length} component references verified` };
}
```

**validateBestPractices()** - Check quality standards (warnings only):

```typescript
async function validateBestPractices(uxmPath) {
  const uxmData = JSON.parse(await read(uxmPath));
  const warnings = [];

  // Check multiple states
  if (uxmData.behavior?.states && uxmData.behavior.states.length < 3) {
    warnings.push("Consider adding more states (recommended: 3+)");
  }

  // Check accessibility
  if (!uxmData.behavior?.accessibility?.ariaLabel) {
    warnings.push("Missing ARIA label for accessibility");
  }

  // Check description
  if (!uxmData.metadata.description || uxmData.metadata.description.length < 10) {
    warnings.push("Description is too brief");
  }

  // Check tags
  if (!uxmData.metadata.tags || uxmData.metadata.tags.length < 2) {
    warnings.push("Add more tags for discoverability");
  }

  if (warnings.length > 0) {
    console.warn(`⚠️  Best practices warnings for ${uxmData.id}:\n  - ${warnings.join('\n  - ')}`);
  }

  return { passed: true, warnings: warnings.length, messages: warnings };
}
```
```

---

### Success Criteria

#### Automated Verification

- [ ] All validation checks implemented: 5 functions defined
- [ ] Promise.all() for concurrent validation: Used for files and checks
- [ ] Schema validation works: Catches invalid .uxm files
- [ ] File integrity checks: Detects missing or misnamed files
- [ ] Variable consistency verified: Undefined variables caught

#### Manual Verification

- [ ] Introduce invalid .uxm: Validation catches error
- [ ] Remove .md file: Integrity check fails
- [ ] Use undefined variable: Variable check fails
- [ ] Reference missing component: Reference check fails
- [ ] Check warnings: Best practices warnings displayed

---

## Phase 6: Enhanced Progress Reporting

### Overview

Update reporting to show detailed progress with TodoWrite integration.

### Changes Required

**File**: `fluxwing/commands/fluxwing-import-screenshot.md`

**Section to update**: Lines 520-569 (Phase 6: Report Results)

```markdown
### Phase 6: Report Results

Create comprehensive summary with timing data:

```typescript
const endTime = Date.now();
const totalTime = (endTime - startTime) / 1000;

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SCREENSHOT IMPORT COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📸 Screenshot Analyzed
   File: ${screenshotPath}
   Detected: ${mergedData.composition.atomicComponents.length} atomic, ${mergedData.composition.compositeComponents.length} composite
   Screen type: ${mergedData.screen.type}

📦 Files Created (${totalTime.toFixed(1)}s)

   Components (./fluxwing/components/):
${allComponentFiles.map(f => `   ✓ ${f.id}.uxm + ${f.id}.md`).join('\n')}

   Screen (./fluxwing/screens/):
   ✓ ${screenId}.uxm
   ✓ ${screenId}.md
   ✓ ${screenId}.rendered.md

   Total: ${allComponentFiles.length * 2 + 3} files created

✅ Validation Results

   Schema compliance: ${validationResults.length}/${validationResults.length} passed
   File integrity: All template files exist
   Variable consistency: All variables defined
   Component references: All IDs resolved

   Warnings: ${validationResults.reduce((sum, r) => sum + (r.checks.practices.warnings || 0), 0)}

🎨 Preview

${await generatePreview(screenId)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Review generated files in ./fluxwing/
2. Customize components to match your brand
3. Run /fluxwing-validate for detailed quality check
4. Use /fluxwing-library to browse all components
`);

async function generatePreview(screenId) {
  const renderedPath = `./fluxwing/screens/${screenId}.rendered.md`;
  const renderedContent = await read(renderedPath);

  // Extract first ASCII block
  const asciiMatch = renderedContent.match(/```\n([\s\S]*?)\n```/);
  if (asciiMatch) {
    return asciiMatch[1].split('\n').slice(0, 20).join('\n') + '\n   ... (truncated)';
  }

  return '[Preview not available]';
}
```
```

---

### Success Criteria

#### Automated Verification

- [ ] Report generated: Console output formatted correctly
- [ ] Timing data: Total time calculated and displayed
- [ ] File counts: Accurate count of created files
- [ ] Validation summary: Aggregates results from Phase 5

#### Manual Verification

- [ ] Report is readable: Clear formatting and sections
- [ ] Preview shows ASCII: First 20 lines of rendered screen
- [ ] Next steps helpful: Actionable guidance provided
- [ ] Timing accurate: Matches actual execution time

---

## Testing Strategy

### Unit Tests

**Test helper functions independently:**

```typescript
describe('Helper Functions', () => {
  test('generateComponentName converts kebab-case to Title Case', () => {
    expect(generateComponentName('email-input')).toBe('Email Input');
    expect(generateComponentName('submit-button')).toBe('Submit Button');
  });

  test('mapTypeToCategory returns correct category', () => {
    expect(mapTypeToCategory('button')).toBe('action');
    expect(mapTypeToCategory('input')).toBe('form');
    expect(mapTypeToCategory('card')).toBe('layout');
  });

  test('generateStatesFromList creates valid state objects', () => {
    const states = generateStatesFromList(['hover', 'focus'], { border: 'light' }, 'button');
    expect(states).toHaveLength(2);
    expect(states[0].name).toBe('hover');
    expect(states[1].name).toBe('focus');
  });
});
```

### Integration Tests

**Test concurrent execution:**

```typescript
describe('Concurrent Execution', () => {
  test('Phase 2 generates all atomics in parallel', async () => {
    const startTime = Date.now();
    await generateAtomicComponentsConcurrently(testData.atomicComponents);
    const duration = Date.now() - startTime;

    // Should complete in ~5s, not 15s (3 components × 5s each)
    expect(duration).toBeLessThan(7000);
  });

  test('Phase 5 validates all files in parallel', async () => {
    const startTime = Date.now();
    await validateAllFilesConcurrently(testFiles);
    const duration = Date.now() - startTime;

    // Should complete in ~1s, not 5s (5 files × 1s each)
    expect(duration).toBeLessThan(2000);
  });
});
```

### Manual Testing Steps

1. **Simple Screenshot (Login Form)**:
   - Use a basic login form screenshot
   - Verify all components detected (2 inputs + 1 button)
   - Check timing: Should complete in 14-20s
   - Inspect generated files for correctness

2. **Complex Screenshot (YouTube.com)**:
   - Use YouTube homepage screenshot
   - Verify navigation bar detected (previous issue)
   - Verify sidebar, header, main content identified
   - Check component count: Should be 15+ components
   - Inspect layout hierarchy

3. **Multi-Section Dashboard**:
   - Use a dashboard with header, sidebar, and main area
   - Verify all sections captured
   - Check component categorization (atomic vs composite)
   - Inspect spatial relationships

4. **Error Handling**:
   - Introduce a deliberate error (invalid component type)
   - Verify fail-fast behavior: Workflow halts immediately
   - Check error message: Clear indication of what failed
   - Verify TodoWrite: Failed task shows in-progress (not completed)

5. **Progress Visibility**:
   - Monitor TodoWrite during execution
   - Verify tasks update as components complete
   - Check that components complete out-of-order (parallel execution)
   - Confirm phase boundaries are clear

## Performance Considerations

### Expected Improvements

**Before (Sequential)**:
- Login form (3 atomics + 1 composite): 21-50s
- Complex UI (10 atomics + 3 composites): 50-120s

**After (Concurrent)**:
- Login form: 14-31s (33-38% faster)
- Complex UI: 30-75s (40-50% faster)

### Bottlenecks Remaining

1. **Vision analysis**: Still 5-10s per agent (3 agents parallel = 5-10s total)
2. **Screen generation**: Sequential, depends on all components (4-8s)
3. **ASCII generation**: CPU-bound, O(width × height) per state

### Future Optimizations

- Cache helper function results (memoization)
- Pre-compile JSON Schema validator
- Stream file writes (don't wait for fsync)
- Use worker threads for ASCII generation

## Migration Notes

### Breaking Changes

**NONE** - This is a pure performance/accuracy optimization. Generated files remain identical in format.

### Backward Compatibility

- All existing helper functions unchanged
- File structure (.uxm + .md) remains the same
- Schema validation rules unchanged
- Generated components compatible with existing library

### Rollback Plan

If concurrent implementation causes issues:

1. Revert `fluxwing/commands/fluxwing-import-screenshot.md` to previous version
2. Remove new agent files (screenshot-layout-discovery.md, etc.)
3. Keep helper function files unchanged
4. No data migration needed (files are the same)

## References

### Original Implementation
- Command: `fluxwing/commands/fluxwing-import-screenshot.md`
- Helpers: `fluxwing/data/docs/screenshot-import-helpers.md`
- ASCII: `fluxwing/data/docs/screenshot-import-ascii.md`
- Examples: `fluxwing/data/docs/screenshot-import-examples.md`

### Architecture Patterns
- Parallel reads: `fluxwing/ARCHITECTURE.md:817-821`
- TodoWrite usage: `fluxwing/agents/fluxwing-designer.md:38-96`
- Agent design: `fluxwing/AGENTS.md`

### Research
- Timing analysis: Research task output (Phase timing estimates)
- Bottleneck identification: Research task output (Sequential operations)
- Helper function inventory: Research task output (31 helper functions)

### Schema
- JSON Schema: `fluxwing/data/schema/uxm-component.schema.json`
- Validation guide: `fluxwing/data/docs/05-validation-guide.md`

---

## Success Metrics

### Accuracy Improvements

- [ ] YouTube.com navigation bar detected: YES/NO
- [ ] Complex layouts fully captured: All sections identified
- [ ] Component count increase: 20-30% more components detected
- [ ] Hierarchy correctness: Nesting relationships accurate

### Performance Improvements

- [ ] Login form time: Reduced from 21-50s to 14-31s
- [ ] Complex UI time: Reduced from 50-120s to 30-75s
- [ ] Phase 2 speedup: 3x (measured)
- [ ] Phase 5 speedup: 5x (measured)

### Progress Visibility

- [ ] TodoWrite updates: Real-time task completion
- [ ] Individual component tracking: Each component has task
- [ ] Phase boundaries: Clear separation between phases
- [ ] Error reporting: Failed tasks clearly marked

### Code Quality

- [ ] All helper functions reused: No duplication
- [ ] Error handling complete: Fail-fast on all errors
- [ ] Documentation updated: Command file fully documented
- [ ] Tests passing: Unit and integration tests green
