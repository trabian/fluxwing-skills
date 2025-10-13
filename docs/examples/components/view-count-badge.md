# View Count Badge

Badge displaying video view count and age metadata

## Default State

```
{{viewCount}} views · {{timeAgo}}
```

## Dimensions

- Width: Variable based on content (typically 20-40 characters)
- Height: 1 line
- Text alignment: left

## Variables

- `viewCount` (string, required): Number of views formatted (e.g., "1.2M", "543K", "12")
- `timeAgo` (string, required): Time since publication (e.g., "2 days ago", "1 month ago")

## Accessibility

- **Role**: text
- **Focusable**: No
- **Keyboard Support**: None
- **ARIA**:
  - `aria-label`: Full descriptive text (e.g., "1.2 million views, 2 days ago")

## Usage Examples

### High View Count
```
1.2M views · 2 days ago
```

### Recent Video
```
543K views · 3 hours ago
```

### Older Video
```
12M views · 1 year ago
```

### Low View Count
```
234 views · 12 minutes ago
```

## Component Behavior

### View Count Formatting

- Less than 1,000: Show exact number (e.g., "234")
- 1,000 - 999,999: Show with K suffix (e.g., "12K")
- 1,000,000+: Show with M suffix (e.g., "1.2M")
- Billions: Show with B suffix (e.g., "2.1B")

### Time Ago Formatting

- Less than 1 hour: Show minutes (e.g., "12 minutes ago")
- Less than 24 hours: Show hours (e.g., "3 hours ago")
- Less than 7 days: Show days (e.g., "2 days ago")
- Less than 4 weeks: Show weeks (e.g., "3 weeks ago")
- Less than 12 months: Show months (e.g., "2 months ago")
- 12+ months: Show years (e.g., "1 year ago")

## Design Tokens

### Typography
- Font size: Small (0.85-0.9em)
- Font weight: Regular (400)
- Text color: Secondary/muted (gray)
- Separator: Middle dot (·)

### Spacing
- Gap between view count and time: 1 space + separator + 1 space

## Related Components

- Video Title: Displayed above this badge
- Channel Name: Typically displayed alongside
- Video Card: Parent component containing metadata

## Implementation Notes

This ASCII representation demonstrates view count metadata. When implementing in actual UI frameworks:

1. Use semantic span elements for metadata
2. Format numbers with appropriate suffixes
3. Implement relative time calculations
4. Update time ago periodically (e.g., every minute)
5. Use muted/secondary text color for hierarchy
6. Ensure proper spacing with middle dot separator
