# Screenshot to UXM Import Feature - Implementation Plan

## Overview

Add the ability to import screenshots of UI designs and automatically convert them into uxscii components (.uxm + .md files). The feature will use Claude's vision capabilities to analyze screenshots, extract component structure, generate ASCII art representations, and create production-ready uxscii files following the Screen-First approach (atomic components → composite components → screen composition).

## Current State Analysis

### What Exists

**uxscii Format System:**
- Complete two-file specification (.uxm JSON + .md ASCII template)
- JSON Schema validation at `fluxwing/data/schema/uxm-component.schema.json`
- 11 bundled component templates in `fluxwing/data/examples/`
- 2 screen examples with rendered versions in `fluxwing/data/screens/`
- Comprehensive documentation in `fluxwing/data/docs/`

**Creation Workflows:**
- `/fluxwing-create` - Single component creation command
- `/fluxwing-scaffold` - Screen composition command
- `fluxwing-designer` - Autonomous multi-component agent
- `/fluxwing-validate` - Component validation command
- `/fluxwing-library` - Component browsing command

**Technical Infrastructure:**
- Claude Agent SDK integration (`@anthropic-ai/claude-agent-sdk`)
- Project workspace separation (`./fluxwing/` vs `{PLUGIN_ROOT}/data/`)
- TodoWrite task tracking system
- Existing file Read/Write tool patterns

### What's Missing

**Critical Gaps:**
- ❌ No image/screenshot processing capabilities
- ❌ No Claude vision API integration
- ❌ No screenshot analysis workflow
- ❌ No command for screenshot import
- ❌ No vision-to-ASCII conversion logic
- ❌ No component extraction from visual analysis

**Key Discoveries:**

1. **File Location Philosophy** (`fluxwing/CLAUDE.md:127-158`):
   - READ-ONLY: `{PLUGIN_ROOT}/data/` - Bundled templates
   - READ-WRITE: `./fluxwing/` - User workspace (ALL outputs go here)
   - Never write to plugin directory

2. **Screen-First Approach** (`fluxwing/agents/fluxwing-designer.md:63-96`):
   - Atomic components first (button, input, badge)
   - Composite components second (form, card)
   - Screens last (login, dashboard)
   - Each phase validates before proceeding

3. **Three-File Screen System** (`fluxwing/commands/fluxwing-scaffold.md:67-93`):
   - `.uxm` - Screen metadata with component references
   - `.md` - Screen template with `{{variables}}`
   - `.rendered.md` - Example with REAL data (not variables)

4. **ASCII Pattern Library** (`fluxwing/data/docs/06-ascii-patterns.md`):
   - Standardized box-drawing characters for consistency
   - State representations (default, hover, focus, disabled)
   - Component-specific patterns (buttons, inputs, cards)

## Desired End State

### Feature Complete When:

1. **User can invoke**: `/fluxwing-import-screenshot path/to/screenshot.png`
2. **System analyzes** screenshot using Claude vision API
3. **System extracts** all identifiable UI components
4. **System generates** atomic components first, then composites, then screen
5. **All files saved** to `./fluxwing/components/` and `./fluxwing/screens/`
6. **Validation runs** automatically using existing schema validation
7. **User receives** comprehensive summary with file locations and preview

### Success Verification:

**Automated Verification:**
- [ ] Command registered in plugin manifest
- [ ] Command markdown file exists at `fluxwing/commands/fluxwing-import-screenshot.md`
- [ ] Generated .uxm files validate against schema: `/fluxwing-validate`
- [ ] All referenced component IDs exist in generated files
- [ ] Template files (.md) match references in .uxm files
- [ ] All variables in templates are defined in .uxm files
- [ ] Directory structure created: `./fluxwing/components/` and `./fluxwing/screens/`

**Manual Verification:**
- [ ] Screenshot of a button generates valid button.uxm + button.md
- [ ] Screenshot of a login form generates multiple components + screen
- [ ] Generated ASCII art visually resembles screenshot layout
- [ ] Component states are reasonable (hover, focus, disabled)
- [ ] Accessibility attributes are present (ARIA roles, keyboard support)
- [ ] Variable interpolation works correctly in templates
- [ ] Rendered screen preview shows actual intent

## What We're NOT Doing

**Explicitly out of scope for first iteration:**

- ❌ **Multi-screen batch import** - Only single screenshot per invocation
- ❌ **Interactive component selection** - Claude auto-decides, no user confirmation
- ❌ **Screenshot quality validation** - Assume screenshots are clear and usable
- ❌ **Component matching against existing templates** - Create fresh components always
- ❌ **Style/theme customization** - Use default ASCII patterns
- ❌ **Responsive breakpoints** - Desktop layout only
- ❌ **Animation/transition definitions** - Static states only
- ❌ **Color analysis** - ASCII patterns represent colors symbolically
- ❌ **Pixel-perfect measurements** - Approximate dimensions based on visual analysis
- ❌ **Integration with existing design tools** (Figma, Sketch imports)

## Implementation Approach

### High-Level Strategy

1. **Create new slash command** following existing command patterns
2. **Integrate Claude vision** using Read tool with image file support
3. **Implement extraction logic** following Screen-First workflow
4. **Reuse existing patterns** for file generation and validation
5. **Keep it simple** - fail gracefully on ambiguous cases

### Architecture Decisions

**Vision API Integration:**
- Use Read tool to load screenshot (Claude Code supports image reading)
- Construct vision prompt with specific extraction instructions
- Parse vision response into structured component data

**Component Generation:**
- Follow `fluxwing-designer` agent workflow patterns
- Use TodoWrite to track component creation progress
- Generate files in dependency order (atomic → composite → screen)

**Validation Strategy:**
- Use existing `/fluxwing-validate` logic
- Schema validation via JSON Schema at `fluxwing/data/schema/uxm-component.schema.json`
- Template integrity checks (file exists, variables match)

**Error Handling:**
- If screenshot unclear: Fail with helpful message
- If component type unknown: Default to "custom" type
- If ASCII conversion difficult: Use simple box patterns
- If validation fails: Report errors but don't delete files

### Documentation Architecture (Refactored 2025-10-13)

**Problem:** Command file grew to 2000+ lines, mixing workflow with detailed implementations.

**Solution:** Extracted implementation details to separate documentation files:

1. **`fluxwing/data/docs/screenshot-import-helpers.md`** (~450 lines)
   - All helper functions for .uxm generation
   - Metadata, behavior, layout, props, and variables helpers
   - Inference functions (type→category, button variant, input type, etc.)

2. **`fluxwing/data/docs/screenshot-import-ascii.md`** (~350 lines)
   - ASCII generation functions
   - Border selection, fill patterns, box construction
   - Special generators (checkbox, radio, progress, spinner)
   - Utility functions (glow, validation indicators, masking)

3. **`fluxwing/data/docs/screenshot-import-examples.md`** (~500 lines)
   - Complete end-to-end examples
   - Button, input, multi-component login form
   - Checkbox, badge variations
   - Full file outputs and usage patterns

4. **`fluxwing/commands/fluxwing-import-screenshot.md`** (~630 lines)
   - Lean workflow-focused command file
   - References implementation guides for details
   - Clear 6-phase workflow with tool usage
   - Error handling and quality standards

**Benefits:**
- **70% reduction** in command file size (2000+ → 630 lines)
- **Separation of concerns**: What to do vs. how to do it
- **Easier maintenance**: Edit implementations without touching workflow
- **Better context usage**: Load only needed documentation
- **Clearer structure**: Command file is now readable and actionable

---

## Phase 1: Command Infrastructure

### Overview

Set up the slash command infrastructure and plugin manifest registration.

### Changes Required

#### 1. Plugin Manifest Update

**File**: `fluxwing/.claude-plugin/plugin.json`

**Changes**: Add new command to manifest (if needed - check if commands are auto-discovered)

Current structure shows minimal manifest. Commands may be auto-discovered from `fluxwing/commands/` directory. Verify auto-discovery or add explicit registration.

#### 2. Command Definition File

**File**: `fluxwing/commands/fluxwing-import-screenshot.md` (NEW)

**Changes**: Create new command file following existing patterns

```markdown
---
description: Import UI screenshot and generate uxscii components
---

# Fluxwing Screenshot Importer

You are Fluxwing, importing UI screenshots and converting them to the **uxscii standard**.

## Data Location Rules

**READ from (bundled templates - reference only):**
- `{PLUGIN_ROOT}/data/examples/` - 11 component templates
- `{PLUGIN_ROOT}/data/docs/` - Documentation
- `{PLUGIN_ROOT}/data/schema/` - JSON Schema

**WRITE to (project workspace):**
- `./fluxwing/components/` - Extracted components
- `./fluxwing/screens/` - Screen composition

**NEVER write to plugin data directory - it's read-only!**

## Your Task

Import a screenshot of a UI design and generate uxscii components and screens automatically.

## Workflow

### 1. Load and Analyze Screenshot

**Read the image file** provided by the user:
- Use the Read tool to load the screenshot
- Claude Code supports reading images directly

**Analyze with vision capabilities:**
- Identify all UI components visible in the screenshot
- Determine component types (button, input, card, navigation, etc.)
- Understand layout structure and relationships
- Note visual states shown (default, hover, etc.)
- Identify text content, labels, placeholders

### 2. Extract Component Hierarchy

**Follow the Screen-First approach:**

1. **Atomic components** (no dependencies):
   - Buttons, inputs, badges, icons, labels
   - Each gets its own .uxm + .md file pair

2. **Composite components** (reference atomics):
   - Forms (inputs + buttons)
   - Cards (container + content)
   - Navigation (menu + items)

3. **Screen composition** (top-level):
   - References all components
   - Creates .uxm + .md + .rendered.md files

**Use TodoWrite** to track component creation tasks.

### 3. Generate ASCII Art

**Convert visual elements to ASCII:**
- Use patterns from `{PLUGIN_ROOT}/data/docs/06-ascii-patterns.md`
- Match component types to standard patterns:
  - Buttons: Filled blocks `▓▓▓▓` for primary actions
  - Inputs: Brackets `[__________]` for text fields
  - Cards: Rounded corners `╭─╮` for containers
  - Modals: Double borders `╔═╗` for emphasis

**State representations:**
- Default: Standard border style
- Hover: Heavy borders `┏━┓` or glow `░`
- Focus: Heavy borders with indicator `✨`
- Disabled: Dashed borders `┌ ─ ─ ┐`

### 4. Create Component Files

**For each atomic component:**

1. Generate `.uxm` file with:
   - Unique kebab-case ID (e.g., "submit-button")
   - Appropriate component type from schema
   - Metadata (name, description, timestamps)
   - Props with default values
   - Behavior states (default, hover, focus, disabled)
   - Accessibility attributes (role, focusable, keyboard support)
   - ASCII template reference

2. Generate `.md` file with:
   - Component description
   - ASCII art for each state
   - Variable documentation
   - Accessibility notes
   - Usage examples

3. **Save to**: `./fluxwing/components/[component-id].{uxm,md}`

**For composite components:**
- Reference atomic component IDs in props/composition
- Follow same .uxm + .md pattern

**For the screen:**
- Create three files: .uxm, .md, .rendered.md
- Screen .uxm references all component IDs
- Screen .rendered.md uses REAL example data (not `{{variables}}`)
- **Save to**: `./fluxwing/screens/[screen-name].{uxm,md,rendered.md}`

### 5. Validate Generated Files

**Run validation checks:**
- Schema compliance: Each .uxm matches `{PLUGIN_ROOT}/data/schema/uxm-component.schema.json`
- File integrity: All referenced template files exist
- Variable consistency: All template variables defined in .uxm
- Component references: All referenced component IDs exist

**If validation fails:**
- Report specific errors with file:line references
- Suggest fixes
- Do NOT delete generated files (allow manual correction)

### 6. Report Results

**Create comprehensive summary:**

```markdown
# Screenshot Import Complete

## Screenshot Analyzed
- File: path/to/screenshot.png
- Detected components: 5 atomic, 1 composite
- Screen type: Login form

## Files Created

### Components (./fluxwing/components/)
- email-input.uxm + email-input.md
- password-input.uxm + password-input.md
- show-password-toggle.uxm + show-password-toggle.md
- submit-button.uxm + submit-button.md
- error-alert.uxm + error-alert.md
- login-form.uxm + login-form.md (composite)

### Screen (./fluxwing/screens/)
- login-screen.uxm + login-screen.md + login-screen.rendered.md

**Total: 15 files created**

## Validation Results

✓ Schema compliance: 7/7 components passed
✓ File integrity: All template files exist
✓ Variable consistency: All variables defined
✓ Component references: All IDs resolved

## Preview

[Show ASCII preview of main screen from .rendered.md]

## Next Steps

1. Review generated files in ./fluxwing/components/ and ./fluxwing/screens/
2. Customize components to match your brand
3. Run `/fluxwing-validate` for detailed quality check
4. Use `/fluxwing-library` to browse all components
```

## Edge Case Handling

**For simplicity in first iteration:**

1. **Unclear screenshot**: Fail with message "Screenshot quality insufficient - please provide clearer image"
2. **Unknown component**: Use type "custom" and basic box pattern
3. **Too many components (>20)**: Fail with message "Screenshot too complex - please break into smaller sections"
4. **No clear components**: Fail with message "No UI components detected - please verify screenshot"
5. **Validation errors**: Report but don't delete files - allow manual fix

## Resources Available

- **Schema**: `{PLUGIN_ROOT}/data/schema/uxm-component.schema.json`
- **ASCII Patterns**: `{PLUGIN_ROOT}/data/docs/06-ascii-patterns.md`
- **Component Creation**: `{PLUGIN_ROOT}/data/docs/03-component-creation.md`
- **Screen Composition**: `{PLUGIN_ROOT}/data/docs/04-screen-composition.md`
- **Examples**: `{PLUGIN_ROOT}/data/examples/` - 11 templates

## Quality Standards

Every generated component must include:
- ✓ Valid JSON schema compliance
- ✓ Multiple interaction states (min: default, hover, disabled)
- ✓ Accessibility attributes (role, focusable, keyboard support)
- ✓ Clear variable documentation
- ✓ Consistent ASCII patterns from library
- ✓ Proper component type from allowed list

You are converting visual designs into AI-consumable uxscii format!
```

### Success Criteria

#### Automated Verification:

- [ ] Command file exists: `fluxwing/commands/fluxwing-import-screenshot.md`
- [ ] File follows markdown frontmatter pattern (description in YAML header)
- [ ] Command references correct data locations (`{PLUGIN_ROOT}/data/`)
- [ ] Output paths use project workspace (`./fluxwing/`)
- [ ] Workflow follows Screen-First approach
- [ ] TodoWrite integration mentioned
- [ ] Validation step included

#### Manual Verification:

- [ ] Command appears in `/help` output (if commands are listed)
- [ ] User can invoke `/fluxwing-import-screenshot test.png`
- [ ] Error message if screenshot path invalid
- [ ] Command instructions are clear and actionable

---

## Phase 2: Vision API Integration

### Overview

Implement screenshot analysis using Claude's vision capabilities through the Read tool.

### Changes Required

#### 1. Vision Prompt Engineering

**File**: `fluxwing/commands/fluxwing-import-screenshot.md` (MODIFY)

**Section to enhance**: "1. Load and Analyze Screenshot"

Add detailed vision prompt structure:

```markdown
### Vision Analysis Prompt

When analyzing the screenshot with Claude vision, use this structured prompt:

**Prompt Template:**

```
You are analyzing a UI screenshot to extract component structure for conversion to uxscii format.

SCREENSHOT ANALYSIS TASKS:

1. IDENTIFY ALL COMPONENTS
   - List every distinct UI element (buttons, inputs, cards, etc.)
   - Classify each by type: button, input, checkbox, radio, select, card, navigation, modal, table, badge, alert, container, text, image, divider, custom
   - Note component hierarchy (which components contain others)

2. EXTRACT VISUAL PROPERTIES
   - Dimensions: approximate width and height in characters
   - Border style: light, rounded, double, heavy, or none
   - Fill pattern: solid, gradient, transparent
   - Text content: exact labels, placeholders, titles
   - Visual states visible: default, hover, focus, disabled, error, success

3. ANALYZE LAYOUT
   - Component positioning: top-to-bottom, left-to-right, grid
   - Spacing between elements
   - Alignment patterns
   - Container relationships

4. DETERMINE SCREEN TYPE
   - Overall purpose: login, dashboard, form, profile, settings, list, detail
   - Primary user actions available
   - Data displayed

RESPONSE FORMAT (JSON):

{
  "screen": {
    "type": "login-form",
    "name": "Login Screen",
    "description": "User authentication screen with email/password inputs",
    "layout": "vertical-center"
  },
  "components": [
    {
      "id": "email-input",
      "type": "input",
      "category": "atomic",
      "visualProperties": {
        "width": 40,
        "height": 3,
        "borderStyle": "light",
        "textContent": "Email",
        "placeholder": "Enter your email"
      },
      "states": ["default", "focus", "error"],
      "accessibility": {
        "role": "textbox",
        "label": "Email address"
      }
    },
    // ... more components
  ],
  "composition": {
    "atomicComponents": ["email-input", "password-input", "submit-button"],
    "compositeComponents": ["login-form"],
    "screenComponents": ["login-screen"]
  }
}

Be thorough and precise. This data will be used to generate production-ready uxscii files.
```
```

**Implementation in command:**

```markdown
### 1. Load and Analyze Screenshot (ENHANCED)

**Step A: Read screenshot file**
```typescript
// Using Read tool (Claude Code supports image reading)
const screenshotContent = await read(screenshotPath);
```

**Step B: Analyze with vision prompt**

Construct the vision analysis prompt (see Vision Analysis Prompt section above).

**Step C: Parse vision response**

Extract structured JSON from Claude's vision analysis.

Validate response contains:
- screen object with type, name, description
- components array with all required fields
- composition object with component hierarchy

If parsing fails, use fallback heuristics or ask user for clarification.
```

#### 2. Response Parsing Logic

**File**: `fluxwing/commands/fluxwing-import-screenshot.md` (MODIFY)

**New section**: "Response Parsing & Validation"

```markdown
## Response Parsing & Validation

### Parse Vision Response

**Expected JSON structure:**

```json
{
  "screen": {
    "type": "string",
    "name": "string",
    "description": "string",
    "layout": "string"
  },
  "components": [
    {
      "id": "kebab-case-string",
      "type": "button|input|card|...",
      "category": "atomic|composite",
      "visualProperties": {
        "width": "number",
        "height": "number",
        "borderStyle": "light|rounded|double|heavy|none",
        "textContent": "string",
        "placeholder": "string (optional)"
      },
      "states": ["default", "hover", "focus", "disabled", ...],
      "accessibility": {
        "role": "string",
        "label": "string"
      }
    }
  ],
  "composition": {
    "atomicComponents": ["array of ids"],
    "compositeComponents": ["array of ids"],
    "screenComponents": ["array of ids"]
  }
}
```

### Validation Checks

Before proceeding to file generation:

1. **Required fields present**:
   - screen.type, screen.name
   - components array not empty
   - Each component has id, type, category, visualProperties

2. **Data type validation**:
   - width/height are positive numbers
   - states array contains valid state names
   - component types from allowed list

3. **Consistency checks**:
   - Component IDs are unique
   - Component IDs are kebab-case
   - Composition references match component IDs
   - Atomic components don't reference others
   - Composite components reference valid atomics

If validation fails, report errors and halt import.
```

### Success Criteria

#### Automated Verification:

- [ ] Vision prompt template included in command file
- [ ] Response JSON schema documented
- [ ] Parsing validation logic specified
- [ ] Error handling for malformed responses defined
- [ ] Fallback behaviors documented

#### Manual Verification:

- [ ] Read tool successfully loads screenshot image
- [ ] Vision prompt returns structured JSON response
- [ ] Parser correctly extracts component data
- [ ] Validation catches missing/invalid fields
- [ ] Error messages are actionable

---

## Phase 3: Component Generation Pipeline

### Overview

Implement the component file generation logic following Screen-First workflow.

### Changes Required

#### 1. Atomic Component Generator

**File**: `fluxwing/commands/fluxwing-import-screenshot.md` (MODIFY)

**New section**: "Atomic Component Generation"

```markdown
## Atomic Component Generation

For each component in `composition.atomicComponents`:

### Step 1: Create .uxm File

**Template:**

```json
{
  "id": "{{componentId}}",
  "type": "{{componentType}}",
  "version": "1.0.0",
  "metadata": {
    "name": "{{componentName}}",
    "description": "{{componentDescription}}",
    "author": "Fluxwing Screenshot Import",
    "created": "{{timestamp}}",
    "modified": "{{timestamp}}",
    "tags": ["{{componentType}}", "imported", "{{screenType}}"],
    "category": "{{mapTypeToCategory(componentType)}}"
  },
  "props": {
    "{{extractProps(visualProperties)}}"
  },
  "behavior": {
    "states": [
      {
        "name": "default",
        "properties": {
          "border": "{{visualProperties.borderStyle}}",
          "background": "{{inferBackground(componentType)}}",
          "textColor": "default"
        }
      },
      {{generateStatesFromList(states)}}
    ],
    "interactions": {{generateInteractions(componentType)}},
    "accessibility": {
      "role": "{{accessibility.role}}",
      "focusable": {{isFocusable(componentType)}},
      "keyboardSupport": {{generateKeyboardSupport(componentType)}},
      "ariaLabel": "{{accessibility.label}}"
    }
  },
  "layout": {
    "display": "{{inferDisplay(componentType)}}",
    "positioning": "static",
    "spacing": {{generateSpacing(visualProperties.width, visualProperties.height)}},
    "sizing": {
      "minWidth": {{visualProperties.width}},
      "height": {{visualProperties.height}}
    }
  },
  "ascii": {
    "templateFile": "{{componentId}}.md",
    "width": {{visualProperties.width}},
    "height": {{visualProperties.height}},
    "variables": {{extractVariables(visualProperties)}}
  }
}
```

**Helper Functions:**

- `mapTypeToCategory()`: Map component type to category (input, layout, display, navigation, feedback, utility, overlay, custom)
- `inferBackground()`: Infer background pattern based on component type
- `generateStatesFromList()`: Create state objects for each state in list
- `generateInteractions()`: Generate appropriate interactions for type
- `isFocusable()`: Determine if component should be focusable
- `generateKeyboardSupport()`: Generate keyboard shortcuts for type
- `generateSpacing()`: Calculate padding based on dimensions
- `extractVariables()`: Extract variable definitions from visual properties

### Step 2: Create .md File

**Template:**

```markdown
# {{componentName}}

{{componentDescription}}

## Default State

\```
{{generateASCII(componentId, 'default', visualProperties)}}
\```

{{#each states}}
## {{capitalize(this)}} State

\```
{{generateASCII(componentId, this, visualProperties)}}
\```

{{/each}}

## Variables

{{#each variables}}
- `{{name}}` ({{type}}, {{#if required}}required{{else}}optional{{/if}}): {{description}}
{{/each}}

## Accessibility

- **Role**: {{accessibility.role}}
- **Focusable**: {{#if focusable}}Yes{{else}}No{{/if}}
- **Keyboard Support**: {{#each keyboardSupport}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
- **ARIA Label**: {{accessibility.label}}

## Usage Examples

\```
{{generateExampleASCII(componentId, visualProperties, exampleData)}}
\```

---
*Generated by Fluxwing Screenshot Import*
```

**ASCII Generation Function:**

```typescript
function generateASCII(
  componentId: string,
  state: string,
  visualProperties: VisualProperties
): string {
  // Select border style based on state
  const borderChars = selectBorderChars(state, visualProperties.borderStyle);

  // Select fill pattern based on state and type
  const fillPattern = selectFillPattern(state, componentType);

  // Build ASCII art
  const width = visualProperties.width;
  const height = visualProperties.height;
  const textContent = visualProperties.textContent || '';

  // Generate using patterns from 06-ascii-patterns.md
  return buildASCIIBox(width, height, textContent, borderChars, fillPattern);
}

function selectBorderChars(state: string, baseStyle: string): BorderChars {
  const styleMap = {
    'default': { 'light': '┌─┐│└┘', 'rounded': '╭─╮│╰╯', 'double': '╔═╗║╚╝', 'heavy': '┏━┓┃┗┛' },
    'hover': { 'light': '┏━┓┃┗┛', 'rounded': '┏━┓┃┗┛', 'double': '╔═╗║╚╝', 'heavy': '┏━┓┃┗┛' },
    'focus': { 'light': '┏━┓┃┗┛', 'rounded': '┏━┓┃┗┛', 'double': '╔═╗║╚╝', 'heavy': '┏━┓┃┗┛' },
    'disabled': { 'light': '┌ ─ ┐│└ ─ ┘', 'rounded': '╭ ─ ╮│╰ ─ ╯', 'double': '╔ ═ ╗║╚ ═ ╝', 'heavy': '┏ ━ ┓┃┗ ━ ┛' }
  };
  return styleMap[state][baseStyle] || styleMap['default']['light'];
}

function selectFillPattern(state: string, type: string): string {
  // Buttons: filled blocks
  if (type === 'button') {
    return state === 'default' ? '▓' : state === 'hover' ? '█' : state === 'disabled' ? ' ' : '▓';
  }
  // Inputs: empty space with underscores
  if (type === 'input') {
    return state === 'focus' ? '│' : '_';
  }
  // Default: spaces
  return ' ';
}

function buildASCIIBox(
  width: number,
  height: number,
  text: string,
  borderChars: string,
  fillPattern: string
): string {
  // Parse border chars: "┌─┐│└┘" -> topLeft, top, topRight, side, bottomLeft, bottom, bottomRight
  const [tl, t, tr, s, bl, b, br] = borderChars.split('');

  const lines: string[] = [];

  // Top border
  lines.push(tl + t.repeat(width - 2) + tr);

  // Middle lines
  for (let i = 1; i < height - 1; i++) {
    if (i === Math.floor(height / 2) && text) {
      // Center line with text
      const padding = Math.floor((width - 2 - text.length) / 2);
      lines.push(s + ' '.repeat(padding) + text + ' '.repeat(width - 2 - padding - text.length) + s);
    } else {
      lines.push(s + fillPattern.repeat(width - 2) + s);
    }
  }

  // Bottom border
  lines.push(bl + b.repeat(width - 2) + br);

  return lines.join('\n');
}
```

### Step 3: Save Files

```typescript
// Create components directory if needed
await bash('mkdir -p ./fluxwing/components');

// Write .uxm file
const uxmPath = `./fluxwing/components/${componentId}.uxm`;
await write(uxmPath, JSON.stringify(uxmData, null, 2));

// Write .md file
const mdPath = `./fluxwing/components/${componentId}.md`;
await write(mdPath, mdContent);

// Log creation
console.log(`✓ Created: ${uxmPath}`);
console.log(`✓ Created: ${mdPath}`);
```

### Step 4: Update TodoWrite

After each component creation:

```typescript
// Mark component task complete
await updateTodo(componentId, 'completed');
```
```

#### 2. Composite Component Generator

**File**: `fluxwing/commands/fluxwing-import-screenshot.md` (MODIFY)

**New section**: "Composite Component Generation"

```markdown
## Composite Component Generation

For each component in `composition.compositeComponents`:

### Differences from Atomic Components

**In .uxm file:**
- `props` includes `components` array with referenced component IDs
- May include `slots` for component placement

**Example .uxm snippet:**

```json
{
  "id": "login-form",
  "type": "form",
  "props": {
    "components": [
      {"id": "email-input", "slot": "field-1"},
      {"id": "password-input", "slot": "field-2"},
      {"id": "submit-button", "slot": "action"}
    ],
    "title": "Sign In",
    "submitAction": "authenticate"
  }
}
```

**In .md file:**
- Show component composition in ASCII
- Reference component IDs in layout

**Example .md snippet:**

```markdown
## Default State

\```
╭─────────────────────────╮
│ Sign In                 │
├─────────────────────────┤
│                         │
│ {{component:email-input}}│
│                         │
│ {{component:password-input}}│
│                         │
│ {{component:submit-button}}│
│                         │
╰─────────────────────────╯
\```
```

Follow same generation, save, and validation steps as atomic components.
```

#### 3. Screen Generator

**File**: `fluxwing/commands/fluxwing-import-screenshot.md` (MODIFY)

**New section**: "Screen Generation"

```markdown
## Screen Generation

For the screen in `composition.screenComponents`:

### Three Files Required

#### A. Screen .uxm

```json
{
  "id": "{{screenId}}",
  "type": "container",
  "version": "1.0.0",
  "metadata": {
    "name": "{{screen.name}}",
    "description": "{{screen.description}}",
    "author": "Fluxwing Screenshot Import",
    "created": "{{timestamp}}",
    "modified": "{{timestamp}}",
    "tags": ["screen", "{{screen.type}}", "imported"],
    "category": "layout"
  },
  "props": {
    "title": "{{screen.name}}",
    "layout": "{{screen.layout}}",
    "components": {{listAllComponentIds(composition)}}
  },
  "ascii": {
    "templateFile": "{{screenId}}.md",
    "width": {{calculateScreenWidth(components)}},
    "height": {{calculateScreenHeight(components)}}
  }
}
```

#### B. Screen .md (Template)

```markdown
# {{screen.name}}

{{screen.description}}

## Layout

\```
{{generateScreenASCII(components, screen.layout)}}
\```

## Components Used

{{#each allComponents}}
- `{{this.id}}` - {{this.name}} ({{this.type}})
{{/each}}

## User Flows

{{inferUserFlows(screen.type, components)}}
```

#### C. Screen .rendered.md (Real Data)

**CRITICAL**: Use REAL example data, not `{{variables}}`

```markdown
# {{screen.name}}

## Rendered Example

\```
{{generateRenderedScreenASCII(components, exampleData)}}
\```

**Example Data:**
{{showExampleData(exampleData)}}

**Actions:**
{{listScreenActions(components)}}
```

**Example Data Generation:**

```typescript
function generateExampleData(screenType: string, components: Component[]): any {
  const examples = {
    'login': {
      email: 'john.doe@example.com',
      password: '••••••••',
      buttonText: 'Sign In'
    },
    'dashboard': {
      userName: 'John Doe',
      metrics: { revenue: '$24,567', users: '1,234', growth: '+12.5%' }
    },
    'profile': {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Product Manager'
    }
  };
  return examples[screenType] || generateGenericExamples(components);
}

function generateRenderedScreenASCII(
  components: Component[],
  exampleData: any
): string {
  // For each component in layout
  // Replace {{variables}} with exampleData values
  // Build complete ASCII representation
  // Show actual visual output
}
```

### Save Screen Files

```typescript
// Create screens directory if needed
await bash('mkdir -p ./fluxwing/screens');

// Write all three files
await write(`./fluxwing/screens/${screenId}.uxm`, uxmContent);
await write(`./fluxwing/screens/${screenId}.md`, mdContent);
await write(`./fluxwing/screens/${screenId}.rendered.md`, renderedContent);
```
```

### Success Criteria

#### Automated Verification:

- [ ] All atomic components generate valid .uxm + .md pairs
- [ ] ASCII art follows patterns from 06-ascii-patterns.md
- [ ] Composite components reference valid atomic IDs
- [ ] Screen files reference all generated component IDs
- [ ] Rendered screen uses real data (no `{{variables}}` in output)
- [ ] All files saved to correct directories (components/ and screens/)
- [ ] Generated JSON validates against schema

#### Manual Verification:

- [ ] Generated ASCII visually resembles screenshot layout
- [ ] Component states are visually distinct
- [ ] Text content matches screenshot labels
- [ ] Border styles appropriate for component types
- [ ] Screen composition shows correct component arrangement
- [ ] Rendered example is understandable without variables

---

## Phase 4: Validation & Quality Assurance

### Overview

Validate all generated files using existing validation system and report results.

### Changes Required

#### 1. Schema Validation Integration

**File**: `fluxwing/commands/fluxwing-import-screenshot.md` (MODIFY)

**New section**: "Validation Pipeline"

```markdown
## Validation Pipeline

After all files generated, run comprehensive validation.

### Step 1: Schema Validation

For each .uxm file created:

```typescript
// Use existing validation logic from /fluxwing-validate
const schemaPath = '{PLUGIN_ROOT}/data/schema/uxm-component.schema.json';
const schema = JSON.parse(await read(schemaPath));

for (const uxmFile of generatedUxmFiles) {
  const componentData = JSON.parse(await read(uxmFile));
  const validationResult = validateAgainstSchema(componentData, schema);

  if (!validationResult.valid) {
    errors.push({
      file: uxmFile,
      errors: validationResult.errors
    });
  }
}
```

**Validation checks:**
- ✓ All required fields present (id, type, version, metadata, props, ascii)
- ✓ Field types correct (string, number, boolean, array, object)
- ✓ ID format: kebab-case, 2-64 characters
- ✓ Version format: semantic versioning (major.minor.patch)
- ✓ Component type in allowed list
- ✓ Timestamps in ISO 8601 format

### Step 2: File Integrity Validation

For each component:

```typescript
// Check template file exists
const uxmData = JSON.parse(await read(uxmPath));
const templateFile = uxmData.ascii.templateFile;
const templatePath = mdPath; // Should match

const templateExists = await fileExists(templatePath);
if (!templateExists) {
  errors.push({
    file: uxmPath,
    error: `Template file not found: ${templateFile}`
  });
}

// Check filename matches reference
if (templateFile !== `${componentId}.md`) {
  errors.push({
    file: uxmPath,
    error: `Template filename mismatch: expected ${componentId}.md, got ${templateFile}`
  });
}
```

### Step 3: Variable Consistency Validation

For each component:

```typescript
// Extract variables from .uxm
const definedVariables = uxmData.ascii.variables.map(v => v.name);

// Extract variables from .md template
const templateContent = await read(mdPath);
const usedVariables = extractVariableReferences(templateContent); // Regex: {{(\w+)}}

// Check all used variables are defined
for (const usedVar of usedVariables) {
  if (!definedVariables.includes(usedVar)) {
    errors.push({
      file: mdPath,
      error: `Variable {{${usedVar}}} used but not defined in ${uxmPath}`
    });
  }
}

// Note: Variables defined but not used is OK (runtime binding)
```

### Step 4: Component Reference Validation

For composite components and screens:

```typescript
// Extract referenced component IDs
const referencedIds = extractComponentReferences(uxmData);

// Check all referenced components exist
for (const refId of referencedIds) {
  const refPath = `./fluxwing/components/${refId}.uxm`;
  const exists = await fileExists(refPath);

  if (!exists) {
    errors.push({
      file: uxmPath,
      error: `Referenced component not found: ${refId} (expected at ${refPath})`
    });
  }
}
```

### Step 5: Best Practices Validation (Warnings)

Non-blocking quality checks:

```typescript
// Check for multiple states
if (uxmData.behavior?.states?.length < 3) {
  warnings.push({
    file: uxmPath,
    warning: `Consider adding more states (currently ${uxmData.behavior?.states?.length}, recommended: 4+)`
  });
}

// Check for accessibility
if (!uxmData.behavior?.accessibility) {
  warnings.push({
    file: uxmPath,
    warning: 'Missing accessibility attributes'
  });
}

// Check for description
if (!uxmData.metadata?.description) {
  warnings.push({
    file: uxmPath,
    warning: 'Missing component description'
  });
}

// Check for tags
if (!uxmData.metadata?.tags || uxmData.metadata.tags.length === 0) {
  warnings.push({
    file: uxmPath,
    warning: 'No tags defined for discoverability'
  });
}
```

### Report Validation Results

```markdown
## Validation Results

### Schema Compliance
✓ 7/7 components passed schema validation

### File Integrity
✓ All template files exist
✓ All filenames match references

### Variable Consistency
✓ All template variables are defined
✓ No undefined variable references

### Component References
✓ All referenced component IDs resolved

### Best Practices (Warnings)
⚠️ password-input: Consider adding 'disabled' state
⚠️ error-alert: Missing author field
⚠️ login-form: Only 2 states defined (recommended: 4+)

**Summary**: 0 errors, 3 warnings
All files are valid and ready to use!
```
```

#### 2. Error Reporting

**File**: `fluxwing/commands/fluxwing-import-screenshot.md` (MODIFY)

**New section**: "Error Handling & Reporting"

```markdown
## Error Handling & Reporting

### When Errors Occur

**DO:**
- ✓ Report all errors with file:line references
- ✓ Explain what's wrong and why
- ✓ Suggest specific fixes
- ✓ Keep generated files (allow manual correction)
- ✓ Show partial success (X/Y components valid)

**DON'T:**
- ✗ Delete generated files on validation failure
- ✗ Give vague error messages
- ✗ Halt on warnings (they're non-blocking)

### Error Message Format

```markdown
❌ Validation Error

**File**: `./fluxwing/components/submit-button.uxm`
**Line**: 42
**Error**: Missing required field 'metadata.created'
**Fix**: Add timestamp in ISO 8601 format: "2025-10-13T12:00:00Z"

**Context:**
```json
{
  "metadata": {
    "name": "Submit Button",
    // Missing "created" field here
    "modified": "2025-10-13T12:00:00Z"
  }
}
```

**Suggested Fix:**
Add the following to metadata:
```json
"created": "2025-10-13T12:00:00Z"
```
```

### Warning Message Format

```markdown
⚠️ Best Practice Warning

**File**: `./fluxwing/components/email-input.uxm`
**Issue**: Only 2 states defined (default, focus)
**Recommendation**: Add 'error' and 'disabled' states for better UX

**Why**: Input fields commonly need to show validation errors and disabled states.

**Example:**
```json
{
  "name": "error",
  "properties": {
    "border": "error",
    "borderColor": "red"
  }
},
{
  "name": "disabled",
  "properties": {
    "opacity": 0.5,
    "cursor": "not-allowed"
  }
}
```
```

### Exit Behavior

**On Errors:**
- Exit code: 1
- Summary: "Import completed with X errors - manual fixes required"
- Files kept for manual correction

**On Warnings Only:**
- Exit code: 0
- Summary: "Import successful with X warnings - review recommended"
- Files ready to use

**On Success:**
- Exit code: 0
- Summary: "Import successful - all files validated!"
```

### Success Criteria

#### Automated Verification:

- [ ] Schema validation runs for all .uxm files
- [ ] File integrity checks confirm templates exist
- [ ] Variable consistency checks pass
- [ ] Component reference checks resolve all IDs
- [ ] Best practice warnings generated
- [ ] Validation report shows pass/fail summary
- [ ] Exit code correct (0 = success, 1 = errors)

#### Manual Verification:

- [ ] Error messages clearly explain problems
- [ ] Suggested fixes are actionable
- [ ] Warnings don't block import completion
- [ ] Files preserved even when validation fails
- [ ] Report is comprehensive and readable

---

## Phase 5: End-to-End Integration & Testing

### Overview

Create comprehensive test cases and ensure all phases work together seamlessly.

### Changes Required

#### 1. Integration Test Suite

**File**: `tests/src/tests/07-screenshot-import.test.ts` (NEW)

**Changes**: Create comprehensive test suite

```typescript
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { ClaudeTestClient } from '../utils/claude-client';
import { FileTestUtils } from '../utils/file-utils';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('Screenshot Import Feature', () => {
  let client: ClaudeTestClient;
  let fileUtils: FileTestUtils;
  const testOutputDir = './test-output/screenshot-import';

  beforeAll(async () => {
    client = new ClaudeTestClient();
    fileUtils = new FileTestUtils(testOutputDir);
    await fileUtils.ensureDirectory();
  });

  afterAll(async () => {
    await fileUtils.cleanup();
  });

  describe('Command Infrastructure', () => {
    it('should have command file at correct location', async () => {
      const commandPath = 'fluxwing/commands/fluxwing-import-screenshot.md';
      const exists = await fileUtils.fileExists(commandPath);
      expect(exists).toBe(true);
    });

    it('should have valid frontmatter with description', async () => {
      const commandPath = 'fluxwing/commands/fluxwing-import-screenshot.md';
      const content = await fs.readFile(commandPath, 'utf-8');
      expect(content).toMatch(/^---\ndescription:/);
    });

    it('should reference correct data locations', async () => {
      const commandPath = 'fluxwing/commands/fluxwing-import-screenshot.md';
      const content = await fs.readFile(commandPath, 'utf-8');
      expect(content).toContain('{PLUGIN_ROOT}/data/examples/');
      expect(content).toContain('./fluxwing/components/');
      expect(content).toContain('./fluxwing/screens/');
    });
  });

  describe('Simple Button Import', () => {
    const screenshotPath = './tests/fixtures/screenshots/button-simple.png';

    it('should successfully import a simple button screenshot', async () => {
      const result = await client.executeCommand(
        `/fluxwing-import-screenshot ${screenshotPath}`
      );

      expect(result).toContain('Import Complete');
      expect(result).toContain('✓ Created:');
    });

    it('should create button.uxm file', async () => {
      const uxmPath = `${testOutputDir}/fluxwing/components/submit-button.uxm`;
      const exists = await fileUtils.fileExists(uxmPath);
      expect(exists).toBe(true);
    });

    it('should create button.md file', async () => {
      const mdPath = `${testOutputDir}/fluxwing/components/submit-button.md`;
      const exists = await fileUtils.fileExists(mdPath);
      expect(exists).toBe(true);
    });

    it('should generate valid schema-compliant .uxm', async () => {
      const uxmPath = `${testOutputDir}/fluxwing/components/submit-button.uxm`;
      const content = await fs.readFile(uxmPath, 'utf-8');
      const data = JSON.parse(content);

      expect(data.id).toMatch(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/);
      expect(data.type).toBe('button');
      expect(data.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(data.metadata.name).toBeDefined();
      expect(data.metadata.created).toBeDefined();
      expect(data.metadata.modified).toBeDefined();
      expect(data.props).toBeDefined();
      expect(data.ascii.templateFile).toBe('submit-button.md');
    });

    it('should generate multiple states in .uxm', async () => {
      const uxmPath = `${testOutputDir}/fluxwing/components/submit-button.uxm`;
      const content = await fs.readFile(uxmPath, 'utf-8');
      const data = JSON.parse(content);

      expect(data.behavior.states.length).toBeGreaterThanOrEqual(3);
      const stateNames = data.behavior.states.map(s => s.name);
      expect(stateNames).toContain('default');
      expect(stateNames).toContain('hover');
      expect(stateNames).toContain('disabled');
    });

    it('should generate ASCII art in .md file', async () => {
      const mdPath = `${testOutputDir}/fluxwing/components/submit-button.md`;
      const content = await fs.readFile(mdPath, 'utf-8');

      expect(content).toContain('## Default State');
      expect(content).toMatch(/[▓┌╭╔]/); // Contains box-drawing characters
      expect(content).toContain('## Variables');
      expect(content).toContain('## Accessibility');
    });

    it('should validate without errors', async () => {
      const result = await client.executeCommand(
        `/fluxwing-validate ${testOutputDir}/fluxwing/components/submit-button.uxm`
      );

      expect(result).toContain('✓');
      expect(result).not.toContain('❌');
    });
  });

  describe('Login Form Import (Multi-Component)', () => {
    const screenshotPath = './tests/fixtures/screenshots/login-form.png';

    it('should successfully import login form screenshot', async () => {
      const result = await client.executeCommand(
        `/fluxwing-import-screenshot ${screenshotPath}`
      );

      expect(result).toContain('Import Complete');
    });

    it('should create multiple atomic components', async () => {
      const expectedComponents = [
        'email-input.uxm',
        'password-input.uxm',
        'submit-button.uxm'
      ];

      for (const component of expectedComponents) {
        const componentPath = `${testOutputDir}/fluxwing/components/${component}`;
        const exists = await fileUtils.fileExists(componentPath);
        expect(exists).toBe(true);
      }
    });

    it('should create composite form component', async () => {
      const formPath = `${testOutputDir}/fluxwing/components/login-form.uxm`;
      const exists = await fileUtils.fileExists(formPath);
      expect(exists).toBe(true);
    });

    it('should create screen with three files', async () => {
      const screenFiles = [
        'login-screen.uxm',
        'login-screen.md',
        'login-screen.rendered.md'
      ];

      for (const file of screenFiles) {
        const screenPath = `${testOutputDir}/fluxwing/screens/${file}`;
        const exists = await fileUtils.fileExists(screenPath);
        expect(exists).toBe(true);
      }
    });

    it('should have valid component references in screen', async () => {
      const screenPath = `${testOutputDir}/fluxwing/screens/login-screen.uxm`;
      const content = await fs.readFile(screenPath, 'utf-8');
      const data = JSON.parse(content);

      expect(data.props.components).toBeDefined();
      expect(Array.isArray(data.props.components)).toBe(true);
      expect(data.props.components.length).toBeGreaterThan(0);
    });

    it('should have real data in rendered.md', async () => {
      const renderedPath = `${testOutputDir}/fluxwing/screens/login-screen.rendered.md`;
      const content = await fs.readFile(renderedPath, 'utf-8');

      // Should contain real data, not variables
      expect(content).not.toContain('{{');
      expect(content).toMatch(/@.+\..+/); // Email pattern
      expect(content).toMatch(/[•]+/); // Password dots
    });

    it('should pass validation for all components', async () => {
      const componentFiles = [
        'email-input.uxm',
        'password-input.uxm',
        'submit-button.uxm',
        'login-form.uxm'
      ];

      for (const file of componentFiles) {
        const componentPath = `${testOutputDir}/fluxwing/components/${file}`;
        const result = await client.executeCommand(
          `/fluxwing-validate ${componentPath}`
        );
        expect(result).toContain('✓');
      }
    });
  });

  describe('Error Handling', () => {
    it('should fail gracefully with invalid screenshot path', async () => {
      const result = await client.executeCommand(
        '/fluxwing-import-screenshot ./nonexistent.png'
      );

      expect(result).toContain('error');
      expect(result).toContain('not found');
    });

    it('should handle unclear screenshot appropriately', async () => {
      const unclearPath = './tests/fixtures/screenshots/unclear.png';
      const result = await client.executeCommand(
        `/fluxwing-import-screenshot ${unclearPath}`
      );

      expect(result).toMatch(/unclear|insufficient|quality/i);
    });

    it('should preserve files even if validation fails', async () => {
      // This test would require intentionally creating invalid output
      // For now, document expected behavior
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Validation Pipeline', () => {
    it('should validate schema compliance', async () => {
      // Test schema validation logic
      const schemaPath = 'fluxwing/data/schema/uxm-component.schema.json';
      const schema = JSON.parse(await fs.readFile(schemaPath, 'utf-8'));
      expect(schema.$schema).toBeDefined();
    });

    it('should check file integrity', async () => {
      // Test that template files exist for all .uxm references
      const uxmPath = `${testOutputDir}/fluxwing/components/submit-button.uxm`;
      const uxmData = JSON.parse(await fs.readFile(uxmPath, 'utf-8'));
      const templateFile = uxmData.ascii.templateFile;
      const templatePath = path.join(
        path.dirname(uxmPath),
        templateFile
      );
      const exists = await fileUtils.fileExists(templatePath);
      expect(exists).toBe(true);
    });

    it('should validate variable consistency', async () => {
      // Test that all template variables are defined in .uxm
      const uxmPath = `${testOutputDir}/fluxwing/components/submit-button.uxm`;
      const mdPath = `${testOutputDir}/fluxwing/components/submit-button.md`;

      const uxmData = JSON.parse(await fs.readFile(uxmPath, 'utf-8'));
      const mdContent = await fs.readFile(mdPath, 'utf-8');

      const definedVars = uxmData.ascii.variables.map(v => v.name);
      const usedVars = [...mdContent.matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]);

      for (const usedVar of usedVars) {
        expect(definedVars).toContain(usedVar);
      }
    });
  });

  describe('TodoWrite Integration', () => {
    it('should track component creation with TodoWrite', async () => {
      const screenshotPath = './tests/fixtures/screenshots/login-form.png';
      const result = await client.executeCommand(
        `/fluxwing-import-screenshot ${screenshotPath}`
      );

      // Check that TodoWrite was used
      expect(result).toMatch(/task|todo|progress/i);
    });
  });

  describe('Output Directory Structure', () => {
    it('should create components directory', async () => {
      const componentsDir = `${testOutputDir}/fluxwing/components`;
      const exists = await fileUtils.directoryExists(componentsDir);
      expect(exists).toBe(true);
    });

    it('should create screens directory', async () => {
      const screensDir = `${testOutputDir}/fluxwing/screens`;
      const exists = await fileUtils.directoryExists(screensDir);
      expect(exists).toBe(true);
    });

    it('should not write to plugin data directory', async () => {
      const pluginDataDir = 'fluxwing/data/examples';
      const filesBefore = await fs.readdir(pluginDataDir);

      await client.executeCommand(
        '/fluxwing-import-screenshot ./tests/fixtures/screenshots/button-simple.png'
      );

      const filesAfter = await fs.readdir(pluginDataDir);
      expect(filesAfter.length).toBe(filesBefore.length);
    });
  });
});
```

#### 2. Test Fixtures

**Directory**: `tests/fixtures/screenshots/` (NEW)

**Changes**: Create test screenshot fixtures

Need to add test images:
- `button-simple.png` - Single button
- `login-form.png` - Multi-component login form
- `unclear.png` - Blurry/unclear screenshot for error testing

These would be actual PNG files showing UI components.

#### 3. Test Documentation

**File**: `tests/README.md` (MODIFY)

**Changes**: Add screenshot import test documentation

```markdown
## Screenshot Import Tests

Located in `src/tests/07-screenshot-import.test.ts`

### Test Categories

1. **Command Infrastructure** (4 tests)
   - Command file exists
   - Valid frontmatter
   - Correct data location references
   - Plugin manifest registration (if applicable)

2. **Simple Button Import** (7 tests)
   - Successful import execution
   - Files created (.uxm + .md)
   - Schema compliance
   - Multiple states generated
   - ASCII art quality
   - Validation passes

3. **Login Form Import** (8 tests)
   - Multi-component extraction
   - Atomic components created
   - Composite component created
   - Screen files created (3 files)
   - Component references valid
   - Rendered example has real data
   - All components validate

4. **Error Handling** (3 tests)
   - Invalid screenshot path
   - Unclear screenshot
   - Files preserved on validation failure

5. **Validation Pipeline** (3 tests)
   - Schema validation
   - File integrity checks
   - Variable consistency

6. **TodoWrite Integration** (1 test)
   - Task tracking during import

7. **Output Directory Structure** (3 tests)
   - Directories created correctly
   - No writes to plugin data directory

### Running Screenshot Import Tests

```bash
cd tests
pnpm test -- 07-screenshot-import
```

### Test Fixtures

Screenshot fixtures required:
- `tests/fixtures/screenshots/button-simple.png`
- `tests/fixtures/screenshots/login-form.png`
- `tests/fixtures/screenshots/unclear.png`

Create these by taking screenshots of actual UI components.
```

### Success Criteria

#### Automated Verification:

- [ ] Test suite runs: `cd tests && pnpm test -- 07-screenshot-import`
- [ ] All command infrastructure tests pass (4/4)
- [ ] All simple button import tests pass (7/7)
- [ ] All login form import tests pass (8/8)
- [ ] All error handling tests pass (3/3)
- [ ] All validation pipeline tests pass (3/3)
- [ ] TodoWrite integration test passes (1/1)
- [ ] All output directory tests pass (3/3)
- [ ] Test coverage > 80% for new code

#### Manual Verification:

- [ ] Can invoke `/fluxwing-import-screenshot` with real screenshot
- [ ] Generated components visually match screenshot
- [ ] All files validate successfully
- [ ] Error messages are helpful for debugging
- [ ] Documentation clearly explains test structure

---

## Testing Strategy

### Unit Tests

**Component Generation Logic:**
- Test ASCII generation for each component type
- Test state generation (default, hover, focus, disabled)
- Test variable extraction from visual properties
- Test metadata generation

**Vision Response Parsing:**
- Test JSON parsing from vision responses
- Test validation of parsed data
- Test error handling for malformed responses

**File Operations:**
- Test directory creation
- Test file writing
- Test path resolution

### Integration Tests

**End-to-End Workflow:**
- Test complete import flow: screenshot → components → screen
- Test multi-component extraction
- Test validation pipeline
- Test error recovery

**Existing Command Compatibility:**
- Test that generated files work with `/fluxwing-validate`
- Test that generated components work with `/fluxwing-scaffold`
- Test that generated components appear in `/fluxwing-library`

### Manual Testing Steps

**Basic Import:**
1. Create simple button screenshot
2. Run `/fluxwing-import-screenshot button.png`
3. Verify files created in `./fluxwing/components/`
4. Open .uxm and .md files - check quality
5. Run `/fluxwing-validate` - confirm passes

**Multi-Component Import:**
1. Create login form screenshot
2. Run `/fluxwing-import-screenshot login.png`
3. Verify multiple components created
4. Verify screen created in `./fluxwing/screens/`
5. Open .rendered.md - check visual quality
6. Run `/fluxwing-library` - confirm components appear

**Error Cases:**
1. Try invalid screenshot path - verify graceful error
2. Try unclear screenshot - verify helpful message
3. Try very complex screenshot - verify appropriate handling

## Performance Considerations

**Vision API Calls:**
- Single vision API call per screenshot
- Parse response efficiently
- Cache visual analysis during generation

**File Operations:**
- Batch file writes where possible
- Create directories once at start
- Use async file operations

**ASCII Generation:**
- Pre-compile ASCII patterns from library
- Reuse border character sets
- Optimize string concatenation

## Migration Notes

Not applicable - this is a new feature with no existing data to migrate.

## References

### Original Research

- Research agent findings: see function call results above
- Current Fluxwing patterns: `fluxwing/commands/`, `fluxwing/agents/`
- uxscii specification: `fluxwing/data/docs/`

### Key Files

- Command pattern: `fluxwing/commands/fluxwing-create.md`
- Screen workflow: `fluxwing/commands/fluxwing-scaffold.md`
- Designer agent: `fluxwing/agents/fluxwing-designer.md`
- ASCII patterns: `fluxwing/data/docs/06-ascii-patterns.md`
- JSON schema: `fluxwing/data/schema/uxm-component.schema.json`

### Related Documentation

- Component creation: `fluxwing/data/docs/03-component-creation.md`
- Screen composition: `fluxwing/data/docs/04-screen-composition.md`
- Validation guide: `fluxwing/data/docs/05-validation-guide.md`

---

## Implementation Sequence

**Recommended order:**

1. ✅ **Phase 1: Command Infrastructure** - Set up command file and structure
2. ✅ **Phase 2: Vision API Integration** - Get screenshot analysis working
3. ✅ **Phase 3: Component Generation** - Implement file generation logic
4. ✅ **Phase 4: Validation & QA** - Add validation and error handling
5. ✅ **Phase 5: Testing & Integration** - Comprehensive testing

**Each phase should be:**
- Implemented completely before moving to next
- Validated with manual testing
- Documented with examples
- Committed to version control

## Success Metrics

**Feature is complete when:**
- [ ] All 5 phases implemented
- [ ] All automated tests passing (29 tests total)
- [ ] Manual testing scenarios succeed
- [ ] Documentation complete and accurate
- [ ] No regressions in existing commands
- [ ] Performance acceptable (< 30s for typical import)

**Quality metrics:**
- Schema validation: 100% of generated files must validate
- ASCII quality: Visual similarity to screenshot (manual assessment)
- Component extraction: 90%+ accuracy on clear screenshots
- Error handling: Graceful failures with actionable messages
- Test coverage: 80%+ for new code
