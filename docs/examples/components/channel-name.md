# Channel Name

Channel name text with optional verification badge

## Default State

```
{{name}}
```

## Default State (Verified)

```
{{name}} ✓
```

## Hover State

```
{{name}}
```

## Hover State (Verified)

```
{{name}} ✓
```

## Dimensions

- Width: Variable based on name length (typically 10-40 characters)
- Height: 1 line
- Text alignment: left

## Variables

- `name` (string, required): The channel or creator name (max 50 characters)
- `verified` (boolean): Whether to show verification checkmark (default: false)

## Accessibility

- **Role**: link
- **Focusable**: Yes
- **Keyboard Support**:
  - Enter: Navigate to channel page
- **ARIA**:
  - `aria-label`: Channel name with verification status if applicable

## Usage Examples

### Standard Channel
```
MrBeast
```

### Verified Channel
```
MrBeast ✓
```

### Long Channel Name
```
The Slow Mo Guys
```

### Brand Channel (Verified)
```
YouTube ✓
```

## Component Behavior

### Click Handling

The channel name emits a click event when:
- Mouse click occurs
- Enter key pressed while focused
- Navigates to channel page

### State Transitions

1. **Default → Hover**: Text color changes, underline appears
2. **Hover → Default**: Returns to default styling

### Verification Badge

- Checkmark (✓) displayed after name for verified channels
- Badge is not interactive separately
- Included in accessible label

## Design Tokens

### Typography
- Font size: Small-medium (0.9-1em)
- Font weight: Regular (400)
- Text color: Secondary/muted in default, primary on hover
- Verification badge: Same size as text

### Spacing
- Gap before verification badge: 1 space
- Bottom margin: 0.5 character

## Related Components

- Video Title: Displayed above channel name
- View Count Badge: Displayed alongside or below
- Video Card: Parent component containing metadata

## Implementation Notes

This ASCII representation demonstrates channel name text. When implementing in actual UI frameworks:

1. Use semantic link elements (<a>)
2. Implement proper hover states with transitions
3. Use SVG or icon font for verification badge
4. Ensure sufficient clickable area (min 44×44px)
5. Support keyboard navigation and focus styles
6. Add appropriate color contrast for accessibility
7. Include verification status in screen reader text
