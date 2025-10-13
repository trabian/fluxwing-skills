# Phase 3: Component Generation Pipeline - Detailed Implementation Plan

**Status:** Ready to Start
**Estimated Time:** 6 hours
**Dependencies:** Phase 2 (Complete ✅)
**Goal:** Implement complete component file generation following Screen-First workflow

---

## Overview

Phase 3 implements the core file generation logic that transforms parsed vision data (JSON) into production-ready uxscii component files (.uxm + .md). The implementation follows the Screen-First approach: atomic components → composite components → screens.

---

## Task Breakdown

### Task 3.1: Document Helper Functions for .uxm Generation (90 min)

**Objective:** Add comprehensive documentation for all helper functions needed to generate .uxm files

**File to Modify:** `fluxwing/commands/fluxwing-import-screenshot.md`

**Location:** After "Step D: Validate Parsed Data" section (after line 235)

**New Section to Add:**

```markdown
## Helper Functions for Component Generation

Before generating component files, these helper functions transform vision data into uxscii-compliant structures:

### 1. mapTypeToCategory()

Maps component type to UXM category:

```typescript
function mapTypeToCategory(componentType: string): string {
  const categoryMap = {
    // Input category
    'input': 'input', 'checkbox': 'input', 'radio': 'input',
    'select': 'input', 'slider': 'input', 'toggle': 'input',

    // Layout category
    'container': 'layout', 'card': 'layout', 'panel': 'layout',
    'tabs': 'layout', 'fieldset': 'layout',

    // Display category
    'text': 'display', 'heading': 'display', 'label': 'display',
    'badge': 'display', 'icon': 'display', 'image': 'display',
    'divider': 'display',

    // Navigation category
    'navigation': 'navigation', 'breadcrumb': 'navigation',
    'pagination': 'navigation', 'link': 'navigation',

    // Feedback category
    'alert': 'feedback', 'toast': 'feedback', 'progress': 'feedback',
    'spinner': 'feedback',

    // Utility category
    'button': 'utility', 'form': 'utility',

    // Overlay category
    'modal': 'overlay',

    // Data category
    'list': 'data', 'table': 'data', 'tree': 'data', 'chart': 'data'
  };

  return categoryMap[componentType] || 'custom';
}
```

### 2. inferBackground()

Determines background pattern based on component type:

```typescript
function inferBackground(componentType: string): string {
  const backgroundMap = {
    'button': 'filled',      // Buttons have solid background
    'input': 'transparent',  // Inputs are hollow
    'card': 'filled',        // Cards have background
    'modal': 'filled',       // Modals have background
    'alert': 'filled',       // Alerts have background
    'badge': 'filled',       // Badges have background
    'panel': 'filled',       // Panels have background
    'toast': 'filled'        // Toasts have background
  };

  return backgroundMap[componentType] || 'transparent';
}
```

### 3. generateStatesFromList()

Creates state objects for each state in the states array:

```typescript
function generateStatesFromList(
  states: string[],
  baseProperties: any,
  componentType: string
): any[] {
  const stateObjects = [];

  for (const stateName of states) {
    if (stateName === 'default') continue; // Skip default, handled separately

    const stateProperties: any = {};

    // State-specific border styles
    if (stateName === 'hover' || stateName === 'focus') {
      stateProperties.border = 'heavy';
    } else if (stateName === 'disabled') {
      stateProperties.border = 'dashed';
      stateProperties.opacity = 0.5;
      stateProperties.cursor = 'not-allowed';
    } else if (stateName === 'error') {
      stateProperties.border = 'heavy';
      stateProperties.borderColor = 'red';
    } else if (stateName === 'success') {
      stateProperties.border = 'heavy';
      stateProperties.borderColor = 'green';
    } else if (stateName === 'loading') {
      stateProperties.opacity = 0.7;
      stateProperties.cursor = 'wait';
    }

    // Copy base properties
    stateObjects.push({
      name: stateName,
      properties: { ...baseProperties, ...stateProperties }
    });
  }

  return stateObjects;
}
```

### 4. generateInteractions()

Generates interaction array based on component type:

```typescript
function generateInteractions(componentType: string): string[] {
  const interactionMap = {
    'button': ['click', 'keyboard'],
    'input': ['click', 'keyboard', 'type'],
    'checkbox': ['click', 'keyboard'],
    'radio': ['click', 'keyboard'],
    'select': ['click', 'keyboard'],
    'slider': ['click', 'drag', 'keyboard'],
    'toggle': ['click', 'keyboard'],
    'link': ['click', 'keyboard'],
    'tabs': ['click', 'keyboard'],
    'navigation': ['click', 'keyboard'],
    'modal': ['click', 'keyboard'], // Close on ESC
    'toast': [], // No interaction (auto-dismiss)
    'progress': [], // No interaction (passive display)
    'spinner': [] // No interaction (passive display)
  };

  return interactionMap[componentType] || [];
}
```

### 5. isFocusable()

Determines if component should be focusable:

```typescript
function isFocusable(componentType: string): boolean {
  const focusableTypes = [
    'button', 'input', 'checkbox', 'radio', 'select',
    'slider', 'toggle', 'link', 'tabs', 'navigation'
  ];

  return focusableTypes.includes(componentType);
}
```

### 6. generateKeyboardSupport()

Generates keyboard shortcuts based on component type:

```typescript
function generateKeyboardSupport(componentType: string): string[] {
  const keyboardMap = {
    'button': ['Enter', 'Space'],
    'input': ['Tab', 'Escape'],
    'checkbox': ['Space'],
    'radio': ['Arrow keys'],
    'select': ['Arrow keys', 'Enter', 'Escape'],
    'slider': ['Arrow keys', 'Home', 'End'],
    'toggle': ['Space'],
    'link': ['Enter'],
    'tabs': ['Arrow keys', 'Home', 'End'],
    'navigation': ['Arrow keys', 'Enter'],
    'modal': ['Escape']
  };

  return keyboardMap[componentType] || [];
}
```

### 7. generateSpacing()

Calculates padding based on component dimensions:

```typescript
function generateSpacing(width: number, height: number): any {
  // Calculate padding as ~10% of dimensions
  const paddingX = Math.max(1, Math.floor(width * 0.1));
  const paddingY = Math.max(1, Math.floor(height * 0.1));

  return {
    padding: {
      x: paddingX,
      y: paddingY
    },
    margin: {
      x: 0,
      y: 0
    }
  };
}
```

### 8. inferDisplay()

Determines display property based on component type:

```typescript
function inferDisplay(componentType: string): string {
  const displayMap = {
    'button': 'inline-block',
    'input': 'inline-block',
    'checkbox': 'inline-block',
    'radio': 'inline-block',
    'badge': 'inline',
    'link': 'inline',
    'text': 'inline',
    'heading': 'block',
    'divider': 'block',
    'card': 'block',
    'panel': 'block',
    'modal': 'block',
    'container': 'block',
    'form': 'block',
    'list': 'block',
    'table': 'block'
  };

  return displayMap[componentType] || 'block';
}
```

### 9. extractVariables()

Extracts variable definitions from visual properties:

```typescript
function extractVariables(
  visualProperties: any,
  componentType: string
): any[] {
  const variables: any[] = [];

  // Text content variable (common to most components)
  if (visualProperties.textContent) {
    variables.push({
      name: 'text',
      type: 'string',
      required: true,
      default: visualProperties.textContent,
      description: `${componentType} label text`
    });
  }

  // Placeholder variable (for inputs)
  if (visualProperties.placeholder) {
    variables.push({
      name: 'placeholder',
      type: 'string',
      required: false,
      default: visualProperties.placeholder,
      description: 'Placeholder text when empty'
    });
  }

  // Value variable (for inputs/displays)
  if (componentType === 'input' || componentType === 'select' || componentType === 'text') {
    variables.push({
      name: 'value',
      type: 'string',
      required: false,
      default: '',
      description: 'Current value'
    });
  }

  // Variant variable (for buttons)
  if (componentType === 'button') {
    variables.push({
      name: 'variant',
      type: 'string',
      required: false,
      default: 'primary',
      description: 'Button style variant (primary, secondary, danger)'
    });
  }

  // Size variable (for scalable components)
  if (['button', 'input', 'badge'].includes(componentType)) {
    variables.push({
      name: 'size',
      type: 'string',
      required: false,
      default: 'medium',
      description: 'Component size (small, medium, large)'
    });
  }

  return variables;
}
```

### 10. generateComponentName()

Creates human-readable component name from ID:

```typescript
function generateComponentName(componentId: string): string {
  // Convert kebab-case to Title Case
  return componentId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```

### 11. generateComponentDescription()

Creates description based on type and properties:

```typescript
function generateComponentDescription(
  componentType: string,
  visualProperties: any,
  accessibility: any
): string {
  const typeDescriptions = {
    'button': 'An interactive button component for user actions',
    'input': 'A text input field for user data entry',
    'checkbox': 'A checkbox input for boolean selection',
    'radio': 'A radio button for single selection from a group',
    'select': 'A dropdown select component for choosing from options',
    'card': 'A container component for grouping related content',
    'modal': 'An overlay component for focused interactions',
    'alert': 'A feedback component for displaying messages',
    'navigation': 'A navigation component for site/app navigation',
    'form': 'A form container for collecting user input',
    'badge': 'A small badge component for labels or counts',
    'icon': 'An icon component for visual symbols',
    'text': 'A text display component',
    'heading': 'A heading component for section titles',
    'divider': 'A visual divider for separating content'
  };

  let description = typeDescriptions[componentType] || `A ${componentType} component`;

  // Add context from accessibility label if available
  if (accessibility?.label && accessibility.label !== visualProperties.textContent) {
    description += `. ${accessibility.label}`;
  }

  return description;
}
```
```

**Verification:**
- [ ] All 11 helper functions documented
- [ ] TypeScript-style pseudo-code included
- [ ] Logic is clear and implementable
- [ ] Examples provided where helpful
- [ ] Comments explain non-obvious decisions

---

### Task 3.2: Document ASCII Art Generation Functions (75 min)

**Objective:** Add detailed ASCII generation function documentation

**File to Modify:** `fluxwing/commands/fluxwing-import-screenshot.md`

**Location:** After helper functions section

**New Section to Add:**

```markdown
## ASCII Art Generation

Functions for converting visual properties into ASCII art representations:

### selectBorderChars()

Selects box-drawing characters based on state and style:

```typescript
function selectBorderChars(
  state: string,
  baseStyle: string
): string {
  // Format: "topLeft|top|topRight|side|bottomLeft|bottom|bottomRight"
  // Example: "┌|─|┐|│|└|─|┘" for light border

  const styleMap = {
    'default': {
      'light': '┌|─|┐|│|└|─|┘',
      'rounded': '╭|─|╮|│|╰|─|╯',
      'double': '╔|═|╗|║|╚|═|╝',
      'heavy': '┏|━|┓|┃|┗|━|┛',
      'none': ' | | | | | | '
    },
    'hover': {
      'light': '┏|━|┓|┃|┗|━|┛',
      'rounded': '┏|━|┓|┃|┗|━|┛',
      'double': '╔|═|╗|║|╚|═|╝',
      'heavy': '┏|━|┓|┃|┗|━|┛',
      'none': ' | | | | | | '
    },
    'focus': {
      'light': '┏|━|┓|┃|┗|━|┛',
      'rounded': '┏|━|┓|┃|┗|━|┛',
      'double': '╔|═|╗|║|╚|═|╝',
      'heavy': '┏|━|┓|┃|┗|━|┛',
      'none': ' | | | | | | '
    },
    'disabled': {
      'light': '┌| |┐|│|└| |┘',     // Spaced out = dashed
      'rounded': '╭| |╮|│|╰| |╯',
      'double': '╔| |╗|║|╚| |╝',
      'heavy': '┏| |┓|┃|┗| |┛',
      'none': ' | | | | | | '
    },
    'error': {
      'light': '┏|━|┓|┃|┗|━|┛',    // Heavy for emphasis
      'rounded': '┏|━|┓|┃|┗|━|┛',
      'double': '╔|═|╗|║|╚|═|╝',
      'heavy': '┏|━|┓|┃|┗|━|┛',
      'none': ' | | | | | | '
    }
  };

  const chars = styleMap[state]?.[baseStyle] || styleMap['default']['light'];
  return chars;
}
```

### selectFillPattern()

Determines interior fill pattern:

```typescript
function selectFillPattern(
  state: string,
  componentType: string
): string {
  // Buttons: filled blocks
  if (componentType === 'button') {
    if (state === 'default') return '▓';
    if (state === 'hover') return '█';
    if (state === 'disabled') return ' ';
    return '▓';
  }

  // Inputs: underscores or vertical bars
  if (componentType === 'input') {
    if (state === 'focus') return '│';
    return '_';
  }

  // Progress bars: special pattern
  if (componentType === 'progress') {
    return '█'; // Filled portion
  }

  // Spinners: rotation pattern
  if (componentType === 'spinner') {
    return '◐'; // Rotating indicator
  }

  // Default: spaces (hollow)
  return ' ';
}
```

### buildASCIIBox()

Constructs ASCII art box with text:

```typescript
function buildASCIIBox(
  width: number,
  height: number,
  text: string,
  borderChars: string,
  fillPattern: string
): string {
  // Parse border characters
  const [tl, t, tr, s, bl, b, br] = borderChars.split('|');

  const lines: string[] = [];

  // Top border
  lines.push(tl + t.repeat(width - 2) + tr);

  // Middle lines
  for (let i = 1; i < height - 1; i++) {
    const isTextLine = (i === Math.floor(height / 2)) && text;

    if (isTextLine) {
      // Center text on this line
      const textLen = text.length;
      const availableSpace = width - 2;

      if (textLen <= availableSpace) {
        // Text fits - center it
        const leftPad = Math.floor((availableSpace - textLen) / 2);
        const rightPad = availableSpace - textLen - leftPad;
        lines.push(s + ' '.repeat(leftPad) + text + ' '.repeat(rightPad) + s);
      } else {
        // Text too long - truncate with ellipsis
        const truncated = text.substring(0, availableSpace - 3) + '...';
        lines.push(s + truncated + s);
      }
    } else {
      // Fill line
      lines.push(s + fillPattern.repeat(width - 2) + s);
    }
  }

  // Bottom border
  lines.push(bl + b.repeat(width - 2) + br);

  return lines.join('\n');
}
```

### generateASCII()

Main ASCII generation function:

```typescript
function generateASCII(
  componentId: string,
  state: string,
  visualProperties: any,
  componentType: string
): string {
  const width = visualProperties.width;
  const height = visualProperties.height;
  const borderStyle = visualProperties.borderStyle;
  const textContent = visualProperties.textContent || '';

  // Get border characters for this state
  const borderChars = selectBorderChars(state, borderStyle);

  // Get fill pattern for this state and type
  const fillPattern = selectFillPattern(state, componentType);

  // Build ASCII box
  return buildASCIIBox(width, height, textContent, borderChars, fillPattern);
}
```

### Special Component ASCII

Some components need custom ASCII generation:

#### Checkbox

```typescript
function generateCheckboxASCII(
  width: number,
  checked: boolean,
  state: string
): string {
  const box = checked ? '[✓]' : '[ ]';
  const border = state === 'focus' ? '┏━━┓\n┃' + box + '┃\n┗━━┛' : box;
  return border;
}
```

#### Radio Button

```typescript
function generateRadioASCII(
  width: number,
  selected: boolean,
  state: string
): string {
  const circle = selected ? '(●)' : '( )';
  const border = state === 'focus' ? '┏━━┓\n┃' + circle + '┃\n┗━━┛' : circle;
  return border;
}
```

#### Progress Bar

```typescript
function generateProgressASCII(
  width: number,
  percentage: number,
  state: string
): string {
  const filledWidth = Math.floor((width - 2) * (percentage / 100));
  const emptyWidth = (width - 2) - filledWidth;

  const filled = '█'.repeat(filledWidth);
  const empty = '░'.repeat(emptyWidth);

  return `[${filled}${empty}] ${percentage}%`;
}
```

#### Spinner

```typescript
function generateSpinnerASCII(
  width: number,
  state: string
): string {
  // Rotating animation frames (would cycle through)
  const frames = ['◐', '◓', '◑', '◒'];
  const frame = frames[0]; // Use first frame for template

  return `${frame} Loading...`;
}
```
```

**Verification:**
- [ ] All ASCII generation functions documented
- [ ] Border selection logic clear
- [ ] Fill patterns appropriate for types
- [ ] Text centering algorithm correct
- [ ] Special components handled
- [ ] Examples provided

---

### Task 3.3: Add Atomic Component File Generation Logic (90 min)

**Objective:** Document step-by-step atomic component (.uxm + .md) generation

**File to Modify:** Same as above

**Location:** After ASCII generation section

**Changes:** Replace existing "4. Create Component Files" section with detailed implementation

**See implementation plan document for full section...**

---

### Task 3.4: Add Composite Component Generation Logic (60 min)

**Objective:** Document composite component generation (with component references)

**Same pattern as Task 3.3 but for composites**

---

### Task 3.5: Add Screen Generation Logic (90 min)

**Objective:** Document three-file screen generation (.uxm + .md + .rendered.md)

**Key differences:**
- Generates three files instead of two
- .rendered.md uses REAL data (no variables)
- Includes all component references
- Shows complete layout

---

### Task 3.6: Add TodoWrite Integration Documentation (15 min)

**Objective:** Document TodoWrite usage for tracking progress

**New Section:**

```markdown
## TodoWrite Progress Tracking

Use TodoWrite to track component generation progress:

### Creating Tasks

After vision analysis, create todo items for all components:

```typescript
const todos = [];

// Add atomic component tasks
for (const componentId of composition.atomicComponents) {
  todos.push({
    content: `Generate ${componentId} component`,
    activeForm: `Generating ${componentId} component`,
    status: 'pending'
  });
}

// Add composite component tasks
for (const componentId of composition.compositeComponents) {
  todos.push({
    content: `Generate ${componentId} composite`,
    activeForm: `Generating ${componentId} composite`,
    status: 'pending'
  });
}

// Add screen task
todos.push({
  content: `Generate ${screen.name} screen`,
  activeForm: `Generating ${screen.name} screen`,
  status: 'pending'
});

await todoWrite(todos);
```

### Updating Progress

Mark tasks in_progress when starting:

```typescript
// Find the task for this component
const taskIndex = todos.findIndex(t => t.content.includes(componentId));
todos[taskIndex].status = 'in_progress';
await todoWrite(todos);

// Generate files...

// Mark complete
todos[taskIndex].status = 'completed';
await todoWrite(todos);
```

### Error Handling

If generation fails, keep task in_progress with error note:

```typescript
todos[taskIndex].content = `Generate ${componentId} component (ERROR: ${error.message})`;
todos[taskIndex].status = 'in_progress'; // Not completed
await todoWrite(todos);
```
```

---

## Success Criteria

### Automated Verification
- [ ] All 11 helper functions documented
- [ ] ASCII generation functions complete
- [ ] Atomic component generation logic specified
- [ ] Composite component generation logic specified
- [ ] Screen generation logic specified (3 files)
- [ ] TodoWrite integration documented
- [ ] File save operations documented
- [ ] Directory creation logic included

### Implementation Readiness
- [ ] Sufficient detail for implementation
- [ ] All edge cases considered
- [ ] Examples provided for complex logic
- [ ] Clear step-by-step workflow
- [ ] Reusable function designs

---

## Estimated Time Breakdown

| Task | Description | Time |
|------|-------------|------|
| 3.1  | Helper functions documentation | 90 min |
| 3.2  | ASCII generation documentation | 75 min |
| 3.3  | Atomic component generation | 90 min |
| 3.4  | Composite component generation | 60 min |
| 3.5  | Screen generation | 90 min |
| 3.6  | TodoWrite integration | 15 min |
| **Total** | | **6 hours 30 min** |

---

## Next Steps After Phase 3

Once documentation is complete:
1. Review for completeness
2. Verify all functions are implementable
3. Check examples are accurate
4. Begin Phase 4 (Validation & QA)

