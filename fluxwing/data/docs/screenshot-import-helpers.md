# Screenshot Import Helper Functions

This document contains all helper functions used during screenshot-to-uxscii conversion. These functions transform vision analysis data into valid uxscii component structures.

## Component Metadata Helpers

### mapTypeToCategory()

Maps component type to UXM category for proper organization:

```typescript
function mapTypeToCategory(componentType: string): string {
  const categoryMap = {
    // Input category - interactive data entry
    'input': 'input', 'checkbox': 'input', 'radio': 'input',
    'select': 'input', 'slider': 'input', 'toggle': 'input',

    // Layout category - structural containers
    'container': 'layout', 'card': 'layout', 'panel': 'layout',
    'tabs': 'layout', 'fieldset': 'layout',

    // Display category - content presentation
    'text': 'display', 'heading': 'display', 'label': 'display',
    'badge': 'display', 'icon': 'display', 'image': 'display',
    'divider': 'display',

    // Navigation category - movement and wayfinding
    'navigation': 'navigation', 'breadcrumb': 'navigation',
    'pagination': 'navigation', 'link': 'navigation',

    // Feedback category - system responses
    'alert': 'feedback', 'toast': 'feedback', 'progress': 'feedback',
    'spinner': 'feedback',

    // Utility category - action triggers
    'button': 'utility', 'form': 'utility',

    // Overlay category - modal displays
    'modal': 'overlay',

    // Data category - structured information
    'list': 'data', 'table': 'data', 'tree': 'data', 'chart': 'data'
  };

  return categoryMap[componentType] || 'custom';
}
```

### generateComponentName()

Creates human-readable component name from kebab-case ID:

```typescript
function generateComponentName(componentId: string): string {
  // Convert kebab-case to Title Case
  return componentId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Examples:
// "email-input" → "Email Input"
// "submit-button" → "Submit Button"
// "user-profile-card" → "User Profile Card"
```

### generateComponentDescription()

Creates description based on type, properties, and accessibility:

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

## Behavior Helpers

### inferBackground()

Determines background fill pattern based on component type:

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

### generateInteractions()

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

### isFocusable()

Determines if component should be focusable for keyboard navigation:

```typescript
function isFocusable(componentType: string): boolean {
  const focusableTypes = [
    'button', 'input', 'checkbox', 'radio', 'select',
    'slider', 'toggle', 'link', 'tabs', 'navigation'
  ];

  return focusableTypes.includes(componentType);
}
```

### generateKeyboardSupport()

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

### generateStatesFromList()

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
    } else if (stateName === 'active') {
      stateProperties.border = 'heavy';
      stateProperties.background = 'filled';
    }

    // Copy base properties and merge with state-specific ones
    stateObjects.push({
      name: stateName,
      properties: { ...baseProperties, ...stateProperties }
    });
  }

  return stateObjects;
}
```

### generateMinimalDefaultState()

Creates a single default state object for MVP component creation (fast mode):

```typescript
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
```

**Usage**: This function creates ONLY the default state, enabling fast MVP component creation. Use `generateStatesFromList()` later when expanding components with `/fluxwing-expand-component`.

**Example**:
```typescript
// Minimal mode - single state
const minimalStates = [generateMinimalDefaultState(visualProps, 'button')];

// Full mode - multiple states
const fullStates = [
  generateMinimalDefaultState(visualProps, 'button'),
  ...generateStatesFromList(['hover', 'active', 'disabled'], baseProps, 'button')
];
```

## Layout Helpers

### inferDisplay()

Determines CSS display property based on component type:

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

### generateSpacing()

Calculates padding based on component dimensions (~10% of size):

```typescript
function generateSpacing(width: number, height: number): any {
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

## Props & Variables Helpers

### extractVariables()

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
  if (['input', 'select', 'text'].includes(componentType)) {
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

### extractPropsFromVisualProperties()

Extract component props based on type and visual properties:

```typescript
function extractPropsFromVisualProperties(
  visualProperties: any,
  componentType: string
): any {
  const props: any = {};

  // Text content (most components)
  if (visualProperties.textContent) {
    props.text = visualProperties.textContent;
  }

  // Placeholder (inputs)
  if (visualProperties.placeholder) {
    props.placeholder = visualProperties.placeholder;
  }

  // Type-specific props
  if (componentType === 'button') {
    props.variant = inferButtonVariant(visualProperties);
    props.size = inferSize(visualProperties.width, visualProperties.height);
  }

  if (componentType === 'input') {
    props.type = inferInputType(visualProperties);
    props.size = inferSize(visualProperties.width, visualProperties.height);
    props.maxLength = Math.floor(visualProperties.width * 0.8);
  }

  if (componentType === 'checkbox' || componentType === 'radio') {
    props.label = visualProperties.textContent;
    props.checked = false;  // Default unchecked
  }

  if (componentType === 'badge') {
    props.variant = inferBadgeVariant(visualProperties);
  }

  if (componentType === 'icon') {
    props.name = visualProperties.textContent || 'icon';
    props.size = inferSize(visualProperties.width, visualProperties.height);
  }

  return props;
}
```

## Inference Helpers

### inferButtonVariant()

```typescript
function inferButtonVariant(vp: any): string {
  // Primary buttons typically have filled backgrounds
  // Secondary buttons have borders
  if (vp.borderStyle === 'heavy' || vp.borderStyle === 'double') {
    return 'primary';
  }
  return 'secondary';
}
```

### inferInputType()

```typescript
function inferInputType(vp: any): string {
  const text = vp.textContent?.toLowerCase() || '';
  const placeholder = vp.placeholder?.toLowerCase() || '';

  if (text.includes('password') || placeholder.includes('password')) {
    return 'password';
  }
  if (text.includes('email') || placeholder.includes('email')) {
    return 'email';
  }
  if (text.includes('number') || placeholder.includes('number')) {
    return 'number';
  }
  if (text.includes('search')) {
    return 'search';
  }
  return 'text';
}
```

### inferSize()

```typescript
function inferSize(width: number, height: number): string {
  // Small: < 20 width or < 3 height
  // Medium: 20-40 width, 3-5 height
  // Large: > 40 width or > 5 height
  if (width < 20 || height < 3) return 'small';
  if (width > 40 || height > 5) return 'large';
  return 'medium';
}
```

### inferBadgeVariant()

```typescript
function inferBadgeVariant(vp: any): string {
  // Could be inferred from color analysis in future
  // For now, default to neutral
  return 'neutral';
}
```

### inferAdditionalTags()

```typescript
function inferAdditionalTags(type: string, vp: any): string[] {
  const tags: string[] = [];

  // Add category tags
  const category = mapTypeToCategory(type);
  if (category !== 'custom') {
    tags.push(category);
  }

  // Add interaction tags
  if (isFocusable(type)) {
    tags.push('interactive');
  }

  return tags;
}
```

## Usage Pattern

These helper functions work together to transform vision analysis into complete .uxm files:

```typescript
// Example: Generate atomic component .uxm
function generateAtomicUXM(componentData: any, timestamp: string): any {
  const { id, type, visualProperties, states, accessibility } = componentData;

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
        ...generateStatesFromList(
          states.filter(s => s !== 'default'),
          { border: visualProperties.borderStyle, background: inferBackground(type), textColor: "default" },
          type
        )
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

## Reference

These functions implement the uxscii component specification documented in:
- `fluxwing/data/docs/01-uxscii-specification.md` - Format specification
- `fluxwing/data/docs/03-component-creation.md` - Component structure
- `fluxwing/data/schema/uxm-component.schema.json` - JSON Schema validation

Use these helpers to ensure consistent, valid component generation from screenshot analysis data.
