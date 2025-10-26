# Primary Button Component

A primary action button with emphasis styling for main user actions.

## Default State

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓   {{text}}   ▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

## Hover State

```
████████████████
█   {{text}}   █
████████████████
```

## Active/Pressed State

```
░▓▓▓▓▓▓▓▓▓▓▓▓▓▓░
░▓  {{text}}  ▓░
░▓▓▓▓▓▓▓▓▓▓▓▓▓▓░
```

## Disabled State

```
┌ ─ ─ ─ ─ ─ ─ ─┐
│   {{text}}   │
└ ─ ─ ─ ─ ─ ─ ─┘
```

## Dimensions

- Width: {{width}} characters (configurable, min 8, max 40)
- Height: 3 characters (fixed)
- Text alignment: center

## Variables

- `text` (string, required): Button label text (max 20 characters)
- `width` (number): Button width in characters (8-40, default 16)

## Accessibility

- **Role**: button
- **Focusable**: Yes
- **Keyboard Support**: 
  - Enter: Activates button
  - Space: Activates button
- **ARIA**: 
  - `aria-label`: Uses `text` value or custom `ariaLabel` prop
  - `aria-disabled`: Set to "true" when disabled

## Usage Examples

### Basic Usage
```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓     Save     ▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

### Compact Button
```
▓▓▓▓▓▓▓▓
▓   OK   ▓
▓▓▓▓▓▓▓▓
```

### Wide Button
```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓    Create Account    ▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

## Component Behavior

### State Transitions

1. **Default → Hover**: Mouse enters button area
2. **Hover → Active**: Mouse button pressed down
3. **Active → Default**: Mouse button released
4. **Any → Disabled**: Component disabled property set to true

### Click Handling

The button emits a click event when:
- Mouse click occurs
- Enter key pressed while focused
- Space key pressed while focused

### Focus Management

- Button receives focus via Tab navigation
- Focus visible indicator shown when keyboard navigated
- Focus moves to next focusable element on Tab

## Design Tokens

### Colors (represented by patterns)
- `▓` = Primary background color
- `█` = Primary hover color  
- `░` = Shadow/pressed effect
- `─` = Disabled border style

### Spacing
- Internal padding: 1 character top/bottom, 2 characters left/right
- Minimum touch target: 8×3 characters
- Recommended spacing between buttons: 2 characters

## Related Components

- Secondary Button: Outline style variant
- Icon Button: Button with icon instead of text
- Button Group: Multiple buttons grouped together

## Implementation Notes

This ASCII representation demonstrates the visual hierarchy and interaction states. When implementing in actual UI frameworks:

1. Map the `▓` pattern to the primary brand color
2. Ensure proper contrast ratios for accessibility
3. Implement smooth hover transitions
4. Add appropriate ripple/click effects
5. Support all specified keyboard interactions