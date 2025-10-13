# Video Card

Complete video card with thumbnail, title, channel, and metadata for video feed display

## Default State

```
╔════════════════════════════════════════╗
║                                        ║
║                                        ║
║                                        ║
║           {{title}}                    ║
║                                        ║
║                                        ║
║                                        ║
║                                        ║
║                                        ║
║                                        ║
║                            ┌─────────┐ ║
║                            │{{duration}}│ ║
╚════════════════════════════└─────────┘═╝

{{title}}

{{channelName}}{{verified ? ' ✓' : ''}}
{{viewCount}} views · {{timeAgo}}
```

## Hover State

```
╔════════════════════════════════════════╗
║░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║
║░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║
║░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║
║░░░░░░░░░░{{title}}░░░░░░░░░░░░░░░░░░░░║
║░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║
║░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║
║░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║
║░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║
║░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║
║░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║
║░░░░░░░░░░░░░░░░░░░░░░░░░░┌─────────┐░║
║░░░░░░░░░░░░░░░░░░░░░░░░░░│{{duration}}│░║
╚════════════════════════════└─────────┘═╝

{{title}}

{{channelName}}{{verified ? ' ✓' : ''}}
{{viewCount}} views · {{timeAgo}}
```

## Dimensions

- Width: 40 characters (configurable, min 30, max 60)
- Height: ~28 characters (thumbnail + metadata)
- Thumbnail aspect ratio: 16:9

## Variables

- `title` (string, required): The video title
- `channelName` (string, required): The channel or creator name
- `viewCount` (string, required): Number of views formatted (e.g., "1.2M")
- `timeAgo` (string, required): Time since publication (e.g., "2 days ago")
- `duration` (string, required): Video duration (format: M:SS or H:MM:SS)
- `verified` (boolean): Whether the channel is verified (default: false)

## Accessibility

- **Role**: article
- **Focusable**: Yes (entire card is clickable)
- **Keyboard Support**:
  - Enter: Navigate to video
  - Tab: Navigate between cards
- **ARIA**:
  - `aria-label`: Comprehensive description including title, channel, and view count
  - Child components have appropriate roles

## Usage Examples

### Standard Video Card
```
╔════════════════════════════════════════╗
║                                        ║
║                                        ║
║        DON'T TRY THIS                  ║
║                                        ║
║                            ┌─────────┐ ║
║                            │  12:34  │ ║
╚════════════════════════════└─────────┘═╝

DON'T TRY THIS

MrBeast ✓
24M views · 2 days ago
```

### Short Video Card
```
╔════════════════════════════════════════╗
║                                        ║
║           GENIUS                       ║
║                            ┌─────────┐ ║
║                            │  0:59   │ ║
╚════════════════════════════└─────────┘═╝

GENIUS

Shorts Channel
1.2M views · 3 hours ago
```

### Long Title Card
```
╔════════════════════════════════════════╗
║                                        ║
║  Eating HALF Watermelon Candy VS REAL  ║
║                            ┌─────────┐ ║
║                            │  8:45   │ ║
╚════════════════════════════└─────────┘═╝

Eating HALF Watermelon Candy VS REAL

Crafty Panda ✓
543K views · 1 day ago
```

## Component Composition

This composite component contains:

1. **{{component:video-thumbnail}}** - Video thumbnail with duration badge
2. **{{component:video-title}}** - Video title text (max 2 lines)
3. **{{component:channel-name}}** - Channel name with verification badge
4. **{{component:view-count-badge}}** - View count and time metadata

## Component Behavior

### Click Handling

The entire card is clickable and navigates to the video:
- Mouse click on any part of the card
- Enter key when card has focus
- Opens video player page

### Hover Effects

- Thumbnail shows hover overlay
- Card background may subtly change
- Cursor changes to pointer
- Title may change color

### Focus Management

- Card receives focus as single unit
- Focus outline visible for keyboard navigation
- Tab moves between video cards
- Child components not separately focusable

## Design Tokens

### Layout
- Vertical stack: thumbnail → title → channel → metadata
- Spacing between sections: 1 line
- Card padding: Minimal (0-1 character)

### Colors
- Thumbnail border: Light gray
- Title: Primary text color
- Channel: Secondary/muted
- Metadata: Muted/gray

## Related Components

- Video Grid: Contains multiple video cards
- YouTube Feed Screen: Top-level layout with navigation
- Video Thumbnail: Child component
- Video Title: Child component
- Channel Name: Child component
- View Count Badge: Child component

## Implementation Notes

This ASCII representation demonstrates a complete video card. When implementing in actual UI frameworks:

1. Use semantic article or section elements
2. Make entire card clickable with proper hover states
3. Implement lazy loading for thumbnails
4. Add skeleton loading states
5. Support different card sizes (grid vs. list view)
6. Ensure proper keyboard navigation
7. Add context menu for additional actions
8. Track analytics on card impressions and clicks
9. Support right-click context menu (save, share, etc.)
10. Implement progressive image loading
