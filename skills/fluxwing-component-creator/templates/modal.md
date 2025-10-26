# Modal Dialog Component

Modal dialog overlay with focus management, backdrop, and configurable content areas for confirmations, forms, and content display.

## Standard Modal (Medium Size)

```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░┌────────────────────────────────┐░░░░░░░░
░░░░░░░░░░│ {{title}}                   │✕│░░░░░░░░
░░░░░░░░░░├────────────────────────────────┤░░░░░░░░
░░░░░░░░░░│                                │░░░░░░░░
░░░░░░░░░░│ {{content}}                    │░░░░░░░░
░░░░░░░░░░│                                │░░░░░░░░
░░░░░░░░░░│                                │░░░░░░░░
░░░░░░░░░░│                                │░░░░░░░░
░░░░░░░░░░├────────────────────────────────┤░░░░░░░░
░░░░░░░░░░│  ┌─────────┐  ┌─────────────┐  │░░░░░░░░
░░░░░░░░░░│  │ Cancel  │  │  {{buttons[1].text}}  │  │░░░░░░░░
░░░░░░░░░░│  └─────────┘  └─────────────┘  │░░░░░░░░
░░░░░░░░░░└────────────────────────────────┘░░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

## Small Modal (Confirmation)

```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░┌──────────────────────────┐░░░░░
░░░░░░░░│ {{title}}             │✕│░░░░░
░░░░░░░░├──────────────────────────┤░░░░░
░░░░░░░░│                          │░░░░░
░░░░░░░░│ {{content}}              │░░░░░
░░░░░░░░│                          │░░░░░
░░░░░░░░├──────────────────────────┤░░░░░
░░░░░░░░│ ┌──────┐  ┌────────────┐ │░░░░░
░░░░░░░░│ │  No  │  │    Yes     │ │░░░░░
░░░░░░░░│ └──────┘  └────────────┘ │░░░░░
░░░░░░░░└──────────────────────────┘░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

## Large Modal (Form/Content)

```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░┌────────────────────────────────────────────────────────┐░░░░░░░░
░░░░░░░░│ {{title}}                                            │✕│░░░░░░░░
░░░░░░░░├────────────────────────────────────────────────────────┤░░░░░░░░
░░░░░░░░│                                                        │░░░░░░░░
░░░░░░░░│ {{content}}                                            │░░░░░░░░
░░░░░░░░│                                                        │░░░░░░░░
░░░░░░░░│ Name: ┌─────────────────────────────────────────────┐  │░░░░░░░░
░░░░░░░░│       │ Enter your name                             │  │░░░░░░░░
░░░░░░░░│       └─────────────────────────────────────────────┘  │░░░░░░░░
░░░░░░░░│                                                        │░░░░░░░░
░░░░░░░░│ Email: ┌────────────────────────────────────────────┐  │░░░░░░░░
░░░░░░░░│        │ your@email.com                             │  │░░░░░░░░
░░░░░░░░│        └────────────────────────────────────────────┘  │░░░░░░░░
░░░░░░░░│                                                        │░░░░░░░░
░░░░░░░░├────────────────────────────────────────────────────────┤░░░░░░░░
░░░░░░░░│    ┌──────────┐  ┌──────────────┐  ┌──────────────┐    │░░░░░░░░
░░░░░░░░│    │  Cancel  │  │    Save      │  │   Submit     │    │░░░░░░░░
░░░░░░░░│    └──────────┘  └──────────────┘  └──────────────┘    │░░░░░░░░
░░░░░░░░└────────────────────────────────────────────────────────┘░░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

## Fullscreen Modal

```
╔══════════════════════════════════════════════════════════════════════════╗
║ {{title}}                                                             ✕ ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║ {{content}}                                                              ║
║                                                                          ║
║                                                                          ║
║                                                                          ║
║                                                                          ║
║                                                                          ║
║                                                                          ║
║                                                                          ║
║                                                                          ║
║                                                                          ║
║                                                                          ║
║                                                                          ║
║                                                                          ║
╠══════════════════════════════════════════════════════════════════════════╣
║                           ┌──────────┐  ┌──────────┐                    ║
║                           │  Cancel  │  │    OK    │                    ║
║                           └──────────┘  └──────────┘                    ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## Modal Variants

### Warning Modal
```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░┌────────────────────────────────┐░░░░░░░░
░░░░░░░░│ ⚠ Warning                   │✕│░░░░░░░░
░░░░░░░░├────────────────────────────────┤░░░░░░░░
░░░░░░░░│                                │░░░░░░░░
░░░░░░░░│ This action cannot be undone.  │░░░░░░░░
░░░░░░░░│ Are you sure you want to       │░░░░░░░░
░░░░░░░░│ continue?                      │░░░░░░░░
░░░░░░░░├────────────────────────────────┤░░░░░░░░
░░░░░░░░│  ┌─────────┐  ┌─────────────┐  │░░░░░░░░
░░░░░░░░│  │ Cancel  │  │   Delete    │  │░░░░░░░░
░░░░░░░░│  └─────────┘  └─────────────┘  │░░░░░░░░
░░░░░░░░└────────────────────────────────┘░░░░░░░░
```

### Error Modal
```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░┌────────────────────────────────┐░░░░░░░░
░░░░░░░░│ ✗ Error                     │✕│░░░░░░░░
░░░░░░░░├────────────────────────────────┤░░░░░░░░
░░░░░░░░│                                │░░░░░░░░
░░░░░░░░│ An error occurred while        │░░░░░░░░
░░░░░░░░│ processing your request.       │░░░░░░░░
░░░░░░░░│ Please try again later.        │░░░░░░░░
░░░░░░░░├────────────────────────────────┤░░░░░░░░
░░░░░░░░│           ┌─────────────┐      │░░░░░░░░
░░░░░░░░│           │     OK      │      │░░░░░░░░
░░░░░░░░│           └─────────────┘      │░░░░░░░░
░░░░░░░░└────────────────────────────────┘░░░░░░░░
```

### Success Modal
```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░┌────────────────────────────────┐░░░░░░░░
░░░░░░░░│ ✓ Success                   │✕│░░░░░░░░
░░░░░░░░├────────────────────────────────┤░░░░░░░░
░░░░░░░░│                                │░░░░░░░░
░░░░░░░░│ Your changes have been saved   │░░░░░░░░
░░░░░░░░│ successfully!                  │░░░░░░░░
░░░░░░░░│                                │░░░░░░░░
░░░░░░░░├────────────────────────────────┤░░░░░░░░
░░░░░░░░│           ┌─────────────┐      │░░░░░░░░
░░░░░░░░│           │   Continue  │      │░░░░░░░░
░░░░░░░░│           └─────────────┘      │░░░░░░░░
░░░░░░░░└────────────────────────────────┘░░░░░░░░
```

## Modal Without Backdrop

```
┌────────────────────────────────┐
│ {{title}}                   │✕│
├────────────────────────────────┤
│                                │
│ {{content}}                    │
│                                │
│                                │
├────────────────────────────────┤
│  ┌─────────┐  ┌─────────────┐  │
│  │ Cancel  │  │   Confirm   │  │
│  └─────────┘  └─────────────┘  │
└────────────────────────────────┘
```

## Modal with Custom Content

```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░┌────────────────────────────────┐░░░░░░░░
░░░░░░░░│ Image Gallery               │✕│░░░░░░░░
░░░░░░░░├────────────────────────────────┤░░░░░░░░
░░░░░░░░│                                │░░░░░░░░
░░░░░░░░│ ┌────────────────────────────┐ │░░░░░░░░
░░░░░░░░│ │        IMAGE_CONTENT       │ │░░░░░░░░
░░░░░░░░│ │         [PHOTO]            │ │░░░░░░░░
░░░░░░░░│ │                            │ │░░░░░░░░
░░░░░░░░│ └────────────────────────────┘ │░░░░░░░░
░░░░░░░░│                                │░░░░░░░░
░░░░░░░░│ Photo 1 of 5                   │░░░░░░░░
░░░░░░░░├────────────────────────────────┤░░░░░░░░
░░░░░░░░│ ┌─────┐ ┌─────┐ ┌─────────────┐│░░░░░░░░
░░░░░░░░│ │ Prev│ │Next │ │    Close    ││░░░░░░░░
░░░░░░░░│ └─────┘ └─────┘ └─────────────┘│░░░░░░░░
░░░░░░░░└────────────────────────────────┘░░░░░░░░
```

## Dimensions

- **Small**: 30×15 characters
- **Medium**: 50×20 characters (default)
- **Large**: 70×30 characters
- **Fullscreen**: Full viewport dimensions
- **Custom**: Configurable width/height

## Variables

- `title` (string): Modal header title (max 60 characters)
- `content` (string, required): Main modal content (max 500 characters)
- `size` (string): Modal size ("small", "medium", "large", "fullscreen")
- `buttons` (array): Action buttons with text, variant, and action
- `showCloseButton` (boolean): Show X button in header (default: true)
- `backdrop` (boolean): Show backdrop overlay (default: true)
- `variant` (string): Style variant ("default", "warning", "error", "success", "info")

## Accessibility

- **Role**: dialog
- **Focus Management**: 
  - Trap focus within modal
  - Return focus to trigger element on close
  - Initial focus on first button or specified element
- **Keyboard Support**:
  - Escape: Close modal (if closable)
  - Tab/Shift+Tab: Navigate within modal
  - Enter: Activate focused button
- **ARIA**:
  - `aria-labelledby`: References title element
  - `aria-describedby`: References content element
  - `aria-modal`: "true"
  - `aria-hidden`: "true" on background content when modal open

## Usage Examples

### Confirmation Dialog
```
░░░░░░░░┌──────────────────────────┐░░░░░
░░░░░░░░│ Delete Item           │✕│░░░░░
░░░░░░░░├──────────────────────────┤░░░░░
░░░░░░░░│                          │░░░░░
░░░░░░░░│ Are you sure you want to │░░░░░
░░░░░░░░│ delete this item? This   │░░░░░
░░░░░░░░│ action cannot be undone. │░░░░░
░░░░░░░░├──────────────────────────┤░░░░░
░░░░░░░░│ ┌──────┐  ┌────────────┐ │░░░░░
░░░░░░░░│ │Cancel│  │   Delete   │ │░░░░░
░░░░░░░░│ └──────┘  └────────────┘ │░░░░░
░░░░░░░░└──────────────────────────┘░░░░░
```

### Loading Modal
```
░░░░░░░░┌──────────────────────────┐░░░░░
░░░░░░░░│ Processing...         │░│░░░░░
░░░░░░░░├──────────────────────────┤░░░░░
░░░░░░░░│                          │░░░░░
░░░░░░░░│ Please wait while we     │░░░░░
░░░░░░░░│ process your request...  │░░░░░
░░░░░░░░│                          │░░░░░
░░░░░░░░│ ████████████████░░░░ 80% │░░░░░
░░░░░░░░└──────────────────────────┘░░░░░
```

### Settings Modal
```
░░░░░░░░┌──────────────────────────────────┐░░░░░░░░
░░░░░░░░│ Preferences                   │✕│░░░░░░░░
░░░░░░░░├──────────────────────────────────┤░░░░░░░░
░░░░░░░░│                                  │░░░░░░░░
░░░░░░░░│ ☑ Enable notifications          │░░░░░░░░
░░░░░░░░│ ☐ Auto-save changes             │░░░░░░░░
░░░░░░░░│ ☑ Dark mode                     │░░░░░░░░
░░░░░░░░│                                  │░░░░░░░░
░░░░░░░░│ Language: ┌───────────────────┐  │░░░░░░░░
░░░░░░░░│           │ English          ▼│  │░░░░░░░░
░░░░░░░░│           └───────────────────┘  │░░░░░░░░
░░░░░░░░├──────────────────────────────────┤░░░░░░░░
░░░░░░░░│  ┌─────────┐  ┌─────────────────┐│░░░░░░░░
░░░░░░░░│  │ Cancel  │  │      Save       ││░░░░░░░░
░░░░░░░░│  └─────────┘  └─────────────────┘│░░░░░░░░
░░░░░░░░└──────────────────────────────────┘░░░░░░░░
```

## Component Behavior

### Modal Lifecycle

1. **Trigger**: User action opens modal
2. **Opening**: Modal animates into view
3. **Open**: Modal fully visible and interactive
4. **Interaction**: User interacts with modal content
5. **Closing**: Modal closes via button, escape, or backdrop
6. **Closed**: Modal hidden, focus restored

### Focus Management

- **Focus Trap**: Tab navigation stays within modal
- **Initial Focus**: First focusable element (usually close button)
- **Focus Restoration**: Return to trigger element on close
- **Focus Indicators**: Clear visual feedback for keyboard users

### Backdrop Behavior

- **Backdrop Click**: Close modal if `backdropClosable` is true
- **Backdrop Scroll**: Prevent page scrolling when modal open
- **Multiple Modals**: Handle stacking and z-index management

## Design Tokens

### Visual Elements
- `░` = Backdrop overlay (semi-transparent)
- `┌─┐└┘─│` = Modal border and dividers
- `╔═╗╚╝═║` = Fullscreen modal borders
- `✕` = Close button icon
- `⚠✗✓` = Status icons for variants

### Spacing
- **Padding**: 2-3 characters internal spacing
- **Margins**: Centered positioning with backdrop
- **Button Spacing**: 2-3 characters between buttons
- **Content Spacing**: 1-2 lines between sections

## Related Components

- **Popup**: Smaller, contextual overlays
- **Tooltip**: Informational overlays
- **Dropdown**: Menu-style overlays
- **Sidebar**: Panel-style content areas

## Implementation Notes

This ASCII representation demonstrates modal overlay patterns. When implementing:

1. **Focus Management**: Robust focus trapping and restoration
2. **Backdrop Management**: Proper event handling and scroll prevention
3. **Animation**: Smooth open/close transitions
4. **Mobile Adaptation**: Responsive sizing and touch interactions
5. **Performance**: Efficient rendering and memory management
6. **Accessibility**: Full screen reader and keyboard support

## Variants

- **Alert Dialog**: Simple message with OK button
- **Confirmation Dialog**: Yes/No or Cancel/Confirm actions
- **Form Modal**: Data input and submission
- **Content Modal**: Rich content display (images, videos, etc.)
- **Loading Modal**: Progress indication during operations