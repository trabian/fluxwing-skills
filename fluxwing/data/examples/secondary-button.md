# Secondary Button Component

A secondary action button with subtle styling for less prominent actions.

## Default State

```
░░░░░░░░░░░░░░░░
░   {{text}}   ░
░░░░░░░░░░░░░░░░
```

## Hover State

```
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒   {{text}}   ▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
```

## Active/Pressed State

```
████████████████
█   {{text}}   █
████████████████
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
░░░░░░░░░░░░░░░░
░    Cancel    ░
░░░░░░░░░░░░░░░░
```

### Compact Button
```
░░░░░░░░
░   No   ░
░░░░░░░░
```

### Wide Button
```
░░░░░░░░░░░░░░░░░░░░░░░░
░     Learn More     ░
░░░░░░░░░░░░░░░░░░░░░░░░
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
- `░` = Light gray background color
- `▒` = Medium gray hover color  
- `█` = Dark gray pressed effect
- `─` = Disabled border style

### Spacing
- Internal padding: 1 character top/bottom, 2 characters left/right
- Minimum touch target: 8×3 characters
- Recommended spacing between buttons: 2 characters

## Related Components

- Primary Button: High emphasis style variant
- Outline Button: Border-only style variant
- Button Group: Multiple buttons grouped together

## Implementation Notes

This ASCII representation demonstrates a subtle visual hierarchy. When implementing in actual UI frameworks:

1. Map the `░` pattern to a light gray background
2. Ensure sufficient contrast ratios for accessibility
3. Implement smooth hover transitions
4. Add appropriate visual feedback for interactions
5. Support all specified keyboard interactions

## Usage Guidelines

Secondary buttons are ideal for:
- Cancel or dismiss actions
- Less important navigation
- Actions that complement a primary action
- Secondary paths in user workflows