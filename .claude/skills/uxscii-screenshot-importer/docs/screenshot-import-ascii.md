# Screenshot Import ASCII Generation

This document contains all ASCII art generation functions for screenshot-to-uxscii conversion. These functions transform visual component properties into uxscii-compliant ASCII representations.

## Core ASCII Functions

### selectBorderChars()

Selects box-drawing characters based on state and border style:

```typescript
function selectBorderChars(state: string, baseStyle: string): string {
  // Border character map: state → style → character sequence
  // Format: "topLeft|top|topRight|side|bottomLeft|bottom|bottomRight"
  const styleMap: Record<string, Record<string, string>> = {
    'default': {
      'light': '┌|─|┐|│|└|┘',
      'rounded': '╭|─|╮|│|╰|╯',
      'double': '╔|═|╗|║|╚|╝',
      'heavy': '┏|━|┓|┃|┗|┛',
      'none': ' | | | | | '
    },
    'hover': {
      'light': '┏|━|┓|┃|┗|┛',      // Upgrade to heavy
      'rounded': '┏|━|┓|┃|┗|┛',    // Upgrade to heavy
      'double': '╔|═|╗|║|╚|╝',     // Keep double
      'heavy': '┏|━|┓|┃|┗|┛',      // Keep heavy
      'none': ' | | | | | '
    },
    'focus': {
      'light': '┏|━|┓|┃|┗|┛',      // Upgrade to heavy
      'rounded': '┏|━|┓|┃|┗|┛',    // Upgrade to heavy
      'double': '╔|═|╗|║|╚|╝',     // Keep double
      'heavy': '┏|━|┓|┃|┗|┛',      // Keep heavy
      'none': ' | | | | | '
    },
    'active': {
      'light': '┏|━|┓|┃|┗|┛',
      'rounded': '┏|━|┓|┃|┗|┛',
      'double': '╔|═|╗|║|╚|╝',
      'heavy': '┏|━|┓|┃|┗|┛',
      'none': ' | | | | | '
    },
    'disabled': {
      'light': '┌| ─ |┐|│|└| ─ |┘',    // Dashed pattern
      'rounded': '╭| ─ |╮|│|╰| ─ |╯',  // Dashed pattern
      'double': '╔| ═ |╗|║|╚| ═ |╝',   // Dashed pattern
      'heavy': '┏| ━ |┓|┃|┗| ━ |┛',    // Dashed pattern
      'none': ' | | | | | '
    },
    'error': {
      'light': '┏|━|┓|┃|┗|┛',
      'rounded': '┏|━|┓|┃|┗|┛',
      'double': '╔|═|╗|║|╚|╝',
      'heavy': '┏|━|┓|┃|┗|┛',
      'none': ' | | | | | '
    },
    'success': {
      'light': '┏|━|┓|┃|┗|┛',
      'rounded': '┏|━|┓|┃|┗|┛',
      'double': '╔|═|╗|║|╚|╝',
      'heavy': '┏|━|┓|┃|┗|┛',
      'none': ' | | | | | '
    }
  };

  const stateStyles = styleMap[state] || styleMap['default'];
  return stateStyles[baseStyle] || styleMap['default']['light'];
}
```

**State Transformations:**
- **hover/focus/active**: Upgrade light/rounded to heavy
- **disabled**: Add spaces for dashed appearance
- **error/success**: Use heavy borders for attention

### selectFillPattern()

Determines interior fill character based on component type and state:

```typescript
function selectFillPattern(state: string, componentType: string): string {
  const typePatterns: Record<string, string> = {
    'button': '▓',        // Solid button fill
    'input': ' ',         // Empty space for text
    'checkbox': ' ',      // Filled by special generator
    'radio': ' ',         // Filled by special generator
    'select': ' ',        // Text area
    'card': ' ',          // Content area
    'modal': ' ',         // Content area
    'panel': ' ',         // Content area
    'alert': ' ',         // Message area
    'badge': '▓',         // Solid badge fill
    'progress': ' ',      // Filled by special generator
    'spinner': ' ',       // Filled by special generator
    'toast': ' ',         // Message area
    'table': ' ',         // Data cells
    'list': ' '           // List items
  };

  const baseFill = typePatterns[componentType] || ' ';

  // State-specific modifications
  if (state === 'hover' && componentType === 'button') {
    return '█';  // Darker fill on hover
  }
  if (state === 'disabled') {
    return ' ';  // Empty on disabled
  }
  if (state === 'active' && componentType === 'button') {
    return '█';  // Full solid on active
  }
  if (state === 'focus' && componentType === 'input') {
    return '│';  // Cursor indicator
  }

  return baseFill;
}
```

**Pattern Types:**
- Solid `▓`: Buttons, badges
- Full `█`: Hover/active states
- Cursor `│`: Input focus
- Empty ` `: Inputs, containers

### buildASCIIBox()

Constructs ASCII box with text centering:

```typescript
function buildASCIIBox(
  width: number,
  height: number,
  text: string,
  borderChars: string,
  fillPattern: string
): string {
  const [tl, t, tr, s, bl, b, br] = borderChars.split('|');
  const lines: string[] = [];
  const innerWidth = width - 2;
  const innerHeight = height - 2;

  // Top border
  lines.push(tl + t.repeat(innerWidth) + tr);

  // Calculate text position (vertical center)
  const textLine = Math.floor(innerHeight / 2);

  // Middle lines
  for (let i = 0; i < innerHeight; i++) {
    if (i === textLine && text) {
      // Center text horizontally
      const textLength = text.length;
      const paddingLeft = Math.floor((innerWidth - textLength) / 2);
      const paddingRight = innerWidth - textLength - paddingLeft;

      const line = s +
                   ' '.repeat(paddingLeft) +
                   text +
                   ' '.repeat(paddingRight) +
                   s;
      lines.push(line);
    } else {
      lines.push(s + fillPattern.repeat(innerWidth) + s);
    }
  }

  // Bottom border
  lines.push(bl + b.repeat(innerWidth) + br);

  return lines.join('\n');
}
```

### generateASCII()

Main ASCII generation function with optional minimal mode:

```typescript
function generateASCII(
  componentId: string,
  state: string,
  visualProperties: any,
  componentType: string,
  minimalMode: boolean = false  // NEW: Enable single-state generation
): string {
  // Special component handlers
  if (componentType === 'checkbox') {
    return generateCheckbox(state, visualProperties.textContent);
  }
  if (componentType === 'radio') {
    return generateRadio(state, visualProperties.textContent);
  }
  if (componentType === 'progress') {
    return generateProgressBar(50, visualProperties.width);
  }
  if (componentType === 'spinner') {
    return generateSpinner(0);
  }

  // Standard box components
  const borderChars = selectBorderChars(state, visualProperties.borderStyle);
  const fillPattern = selectFillPattern(state, componentType);

  let text = visualProperties.textContent || '';

  // Add state indicators
  if (state === 'focus' && componentType === 'button') {
    text += ' ✨';
  }
  if (state === 'error' && componentType === 'input') {
    text = '⚠️ ' + text;
  }
  if (state === 'success' && componentType === 'input') {
    text = '✅ ' + text;
  }

  return buildASCIIBox(
    visualProperties.width,
    visualProperties.height,
    text,
    borderChars,
    fillPattern
  );
}
```

**Minimal Mode Usage**:

When `minimalMode` is `true`, this function is typically only called for the 'default' state during initial component creation. This enables fast MVP component generation.

```typescript
// Minimal mode - only generate default state
const defaultOnlyASCII = generateASCII(
  'submit-button',
  'default',
  visualProperties,
  'button',
  true  // minimalMode = true
);

// Full mode - generate any state
const hoverASCII = generateASCII(
  'submit-button',
  'hover',
  visualProperties,
  'button',
  false  // minimalMode = false (default)
);
```

The `minimalMode` parameter doesn't change the function behavior directly, but signals intent for documentation. When creating components in minimal mode, only call this function once for 'default' state instead of looping through all states.

## Special Component Generators

### generateCheckbox()

```typescript
function generateCheckbox(state: string, label: string): string {
  let box = '[ ]';  // Unchecked

  if (state === 'checked') {
    box = '[✓]';
  } else if (state === 'indeterminate') {
    box = '[▬]';
  } else if (state === 'disabled') {
    box = '[─]';
  }

  return `${box} ${label}`;
}
```

**States:**
- Unchecked: `[ ]`
- Checked: `[✓]`
- Indeterminate: `[▬]`
- Disabled: `[─]`

### generateRadio()

```typescript
function generateRadio(state: string, label: string): string {
  let circle = '○';  // Unselected

  if (state === 'selected') {
    circle = '◉';
  } else if (state === 'disabled') {
    circle = '◌';
  }

  return `${circle} ${label}`;
}
```

**States:**
- Unselected: `○`
- Selected: `◉`
- Disabled: `◌`

### generateProgressBar()

```typescript
function generateProgressBar(percent: number, width: number): string {
  const filled = Math.floor((width * percent) / 100);
  const remaining = width - filled;

  const bar = '█'.repeat(filled) + '░'.repeat(remaining);
  return `${bar} ${percent}%`;
}
```

**Example:** `████░░░░░░ 40%`

### generateSpinner()

```typescript
function generateSpinner(frame: number): string {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  return frames[frame % frames.length];
}
```

**Animation:** 10 Braille pattern characters

## Utility Functions

### maskPassword()

```typescript
function maskPassword(value: string): string {
  return '•'.repeat(value.length);
}
```

### renderInputPlaceholder()

```typescript
function renderInputPlaceholder(
  placeholder: string,
  value: string,
  width: number
): string {
  if (value) {
    return value.padEnd(width - 2, ' ');
  } else {
    return placeholder.padEnd(width - 2, ' ');
  }
}
```

### addGlowEffect()

For hover states:

```typescript
function addGlowEffect(ascii: string): string {
  const lines = ascii.split('\n');
  const glowLines = lines.map(line => `░${line}░`);

  const glowTop = '░'.repeat(glowLines[0].length);
  const glowBottom = '░'.repeat(glowLines[0].length);

  return [glowTop, ...glowLines, glowBottom].join('\n');
}
```

**Example:**
```
Without glow:         With glow:
╭─────────╮          ░░░░░░░░░░░░░
│  Click  │          ░╭─────────╮░
╰─────────╯          ░│  Click  │░
                     ░╰─────────╯░
                     ░░░░░░░░░░░░░
```

### addValidationIndicator()

```typescript
function addValidationIndicator(
  ascii: string,
  state: string,
  message?: string
): string {
  let indicator = '';

  if (state === 'error') {
    indicator = '⚠️';
    if (message) {
      indicator += '\n❌ ' + message;
    }
  } else if (state === 'success') {
    indicator = '✅';
  }

  return ascii + indicator;
}
```

## Complete Generation Example

Putting it all together for a button:

```typescript
// Input from vision analysis
const componentData = {
  id: 'submit-button',
  type: 'button',
  visualProperties: {
    width: 20,
    height: 3,
    borderStyle: 'rounded',
    textContent: 'Submit'
  }
};

// Generate default state
const defaultASCII = generateASCII(
  'submit-button',
  'default',
  componentData.visualProperties,
  'button'
);
// Result:
// ╭──────────────────╮
// │▓▓▓▓▓▓Submit▓▓▓▓▓▓│
// ╰──────────────────╯

// Generate hover state
const hoverASCII = generateASCII(
  'submit-button',
  'hover',
  componentData.visualProperties,
  'button'
);
// Result:
// ┏━━━━━━━━━━━━━━━━━━┓
// ┃████████Submit████┃
// ┗━━━━━━━━━━━━━━━━━━┛

// Generate disabled state
const disabledASCII = generateASCII(
  'submit-button',
  'disabled',
  componentData.visualProperties,
  'button'
);
// Result:
// ╭ ─ ─ ─ ─ ─ ─ ─ ─ ╮
// │      Submit      │
// ╰ ─ ─ ─ ─ ─ ─ ─ ─ ╯
```

## ASCII Generation Guidelines

**Consistency Rules:**
1. Same dimensions across all states
2. Border progression: default→light, hover→heavy, disabled→dashed
3. Text always centered (horizontal and vertical)
4. State indicators used sparingly (✨, ⚠️, ✅)
5. Test in monospace font

**Performance Tips:**
- Pre-compile border character sets
- Cache generated ASCII for repeated components
- Reuse fill patterns

**Accessibility:**
- Keep text readable (adequate padding)
- Use Unicode carefully (terminal support varies)
- Provide text alternatives in metadata

## Reference

These functions implement ASCII patterns documented in:
- `fluxwing/data/docs/06-ascii-patterns.md` - Standard box-drawing patterns
- Examples in `fluxwing/data/examples/*.md` - Real component templates

Use these functions to generate consistent, high-quality ASCII representations for all uxscii components.
