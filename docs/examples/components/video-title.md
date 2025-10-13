# Video Title

Video title text with truncation support for video metadata display

## Default State

```
{{text}}
```

## Hover State

```
{{text}}
```

## Truncated State (long text)

```
This is a very long video title that n...
```

## Dimensions

- Width: {{maxWidth}} characters (configurable, min 20, max 80)
- Height: 1-2 lines depending on truncation
- Text alignment: left

## Variables

- `text` (string, required): The video title text (max 100 characters)
- `maxWidth` (number): Maximum width before truncation (20-80, default 40)

## Accessibility

- **Role**: heading (level 3)
- **Focusable**: No (parent video card handles focus)
- **Keyboard Support**: None
- **ARIA**:
  - `aria-label`: Full title text even when truncated
  - `aria-level`: 3 (subsection heading)

## Usage Examples

### Short Title
```
DON'T TRY THIS
```

### Medium Title
```
Eating HALF Watermelon Candy VS REAL
```

### Long Title (Truncated)
```
This is a very long video title that...
will be truncated at the maximum width
```

## Component Behavior

### Truncation

- Text exceeding maxWidth is truncated with ellipsis (...)
- Full text available via tooltip or aria-label
- Supports 1-2 lines of text (maxLines prop)

### State Transitions

1. **Default → Hover**: Text color lightens slightly
2. **Hover → Default**: Returns to default color

## Design Tokens

### Typography
- Font size: Medium (relative to parent)
- Font weight: Semi-bold (600)
- Line height: 1.2-1.4
- Text color: Primary (light mode) or white (dark mode)

### Spacing
- Bottom margin: 1 character (spacing before metadata)
- No horizontal padding

## Related Components

- Video Card: Parent component containing title
- Channel Name: Displayed below title
- View Count Badge: Metadata shown alongside title

## Implementation Notes

This ASCII representation demonstrates video title text. When implementing in actual UI frameworks:

1. Use semantic heading tags (h3 or h4)
2. Implement CSS text-overflow: ellipsis
3. Add title attribute for full text on hover
4. Support multi-line clamping with line-clamp
5. Ensure sufficient color contrast (WCAG AA)
6. Make title clickable to video page
