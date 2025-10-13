# YouTube Feed Screen

YouTube-style video feed with grid layout of video cards

## Layout

```
╔══════════════════════════════════════════╗  ╔══════════════════════════════════════════╗
║                                          ║  ║                                          ║
║                                          ║  ║                                          ║
║         {{component:video-card}}         ║  ║         {{component:video-card}}         ║
║                                          ║  ║                                          ║
║                                          ║  ║                                          ║
╚══════════════════════════════════════════╝  ╚══════════════════════════════════════════╝

╔══════════════════════════════════════════╗  ╔══════════════════════════════════════════╗
║                                          ║  ║                                          ║
║                                          ║  ║                                          ║
║         {{component:video-card}}         ║  ║         {{component:video-card}}         ║
║                                          ║  ║                                          ║
║                                          ║  ║                                          ║
╚══════════════════════════════════════════╝  ╚══════════════════════════════════════════╝

╔══════════════════════════════════════════╗  ╔══════════════════════════════════════════╗
║                                          ║  ║                                          ║
║                                          ║  ║                                          ║
║         {{component:video-card}}         ║  ║         {{component:video-card}}         ║
║                                          ║  ║                                          ║
║                                          ║  ║                                          ║
╚══════════════════════════════════════════╝  ╚══════════════════════════════════════════╝
```

## Components Used

- `video-card` - Video Card (card) - Complete video card with thumbnail and metadata
- `video-thumbnail` - Video Thumbnail (image) - Video thumbnail with duration badge
- `video-title` - Video Title (text) - Video title text
- `channel-name` - Channel Name (text) - Channel name with verification
- `view-count-badge` - View Count Badge (badge) - View count and time metadata

## Screen Structure

### Grid Layout
- **Columns**: 2-4 depending on viewport width
- **Gap**: 2 characters between cards
- **Responsive**: Adjusts columns based on screen size
- **Infinite scroll**: Loads more content as user scrolls

### Card Distribution
- Cards arranged left-to-right, top-to-bottom
- Equal width cards within each row
- Vertical spacing between rows
- Masonry layout option for varying heights

## Accessibility

- **Navigation**: Keyboard navigation between video cards
- **Focus management**: Clear focus indicators on cards
- **Screen readers**: Proper landmarks and headings
- **Shortcuts**: Keyboard shortcuts for common actions

## Responsive Behavior

- **Desktop (>1200px)**: 4 columns
- **Tablet (768-1199px)**: 3 columns
- **Mobile (480-767px)**: 2 columns
- **Small mobile (<480px)**: 1 column
