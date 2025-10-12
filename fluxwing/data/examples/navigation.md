# Navigation Component

A horizontal or vertical navigation component with active state management and keyboard support.

## Horizontal Navigation (Default)

```
┌─────────────────────────────────────────────────────────┐
│ [*] {{items[0].label}} {{separator}} {{items[1].label}} {{separator}} {{items[2].label}} │
└─────────────────────────────────────────────────────────┘
```

## Vertical Navigation

```
┌─────────────────┐
│ [*] {{items[0].label}}    │
│     {{items[1].label}}     │
│     {{items[2].label}}   │
└─────────────────┘
```

## Active State Indicator

Active items are marked with the `{{activeIndicator}}` symbol:

### Horizontal Active Example
```
┌─────────────────────────────────────────────────────────┐
│ [*] Home {{separator}} About {{separator}} Contact     │
└─────────────────────────────────────────────────────────┘
```

### Vertical Active Example  
```
┌─────────────────┐
│ [*] Home        │
│     About       │
│     Contact     │
└─────────────────┘
```

## Hover State

Items show visual emphasis when hovered:

### Horizontal Hover
```
┌─────────────────────────────────────────────────────────┐
│ [*] Home {{separator}} ▓About▓ {{separator}} Contact   │
└─────────────────────────────────────────────────────────┘
```

### Vertical Hover
```
┌─────────────────┐
│ [*] Home        │
│ ▓▓▓ About ▓▓▓   │
│     Contact     │
└─────────────────┘
```

## Compact Horizontal Layout

```
[*] Home | About | Contact
```

## Breadcrumb Style

```
Home > Category > {{items[2].label}}
```

## Tab Style Navigation

```
┌─────┐ ┌─────┐ ┌─────┐
│ Home│ │About│ │Help │
├─────┘ └─────┘ └─────┤
│                     │
```

## Dimensions

- **Horizontal**: Width adjusts to content, height 3 characters
- **Vertical**: Width adjusts to longest item, height scales with item count
- **Compact**: Single line, width adjusts to content

## Variables

- `items` (array, required): Navigation items with label, href, and active properties
  - Each item: `{label: string, href: string, active: boolean}`
  - Min: 1 item, Max: 10 items
- `orientation` (string): "horizontal" or "vertical" (default: "horizontal")
- `separator` (string): Character(s) between horizontal items (default: " | ")
- `activeIndicator` (string): Symbol marking active item (default: "[*]")

## Accessibility

- **Role**: navigation
- **Focusable**: Yes, each navigation item is focusable
- **Keyboard Support**:
  - Arrow Keys: Navigate between items
  - Enter/Space: Activate navigation item
  - Tab: Move to next focusable element
- **ARIA**:
  - `aria-label`: "Main navigation" or custom label
  - `aria-current`: "page" for active navigation item
  - `role="navigation"` on container

## Usage Examples

### Basic Three-Item Menu
```
┌─────────────────────────────────────────────────────────┐
│ [*] Dashboard | Products | Settings                     │
└─────────────────────────────────────────────────────────┘
```

### Sidebar Navigation
```
┌─────────────────┐
│ [*] Dashboard   │
│     Products    │
│     Orders      │
│     Customers   │
│     Settings    │
└─────────────────┘
```

### Header Navigation with Icons
```
┌─────────────────────────────────────────────────────────┐
│ [*] 🏠 Home | 📋 About | 📞 Contact | 🔧 Settings      │
└─────────────────────────────────────────────────────────┘
```

## Component Behavior

### Navigation Flow

1. **Item Selection**: Click or Enter/Space activates navigation
2. **Active State**: Only one item can be active at a time  
3. **Focus Management**: Arrow keys move focus between items
4. **URL Updates**: Navigation typically updates browser URL

### Keyboard Navigation

- **Horizontal**: Left/Right arrows move between items
- **Vertical**: Up/Down arrows move between items
- **Enter/Space**: Activate current focused item
- **Tab**: Exit navigation to next focusable element

### State Management

- **Active Item**: Visually distinct with indicator
- **Hover State**: Temporary emphasis on mouse over
- **Focus State**: Keyboard navigation indicator
- **Disabled Items**: Optional grayed-out non-interactive items

## Design Tokens

### Visual Elements
- `┌─┐└┘─│` = Border characters for containers
- `▓` = Hover/emphasis background
- `[*]` = Default active indicator (customizable)
- `|` = Default separator (customizable)

### Spacing
- Internal padding: 1 character around content
- Item spacing: Determined by separator in horizontal mode
- Vertical spacing: 1 line between items in vertical mode

## Related Components

- **Breadcrumb**: Linear navigation showing hierarchy
- **Tab Navigation**: Content switching interface
- **Menu**: Dropdown or popup navigation
- **Sidebar**: Persistent vertical navigation panel

## Implementation Notes

This ASCII representation demonstrates navigation patterns. When implementing:

1. **Active State Management**: Ensure only one item is active
2. **Keyboard Accessibility**: Full arrow key navigation support
3. **Focus Indicators**: Clear visual feedback for keyboard users
4. **Responsive Behavior**: Consider mobile/narrow screen adaptations
5. **URL Integration**: Sync with browser history and routing
6. **Loading States**: Handle navigation during page transitions

## Variants

- **Primary Navigation**: Main site navigation
- **Secondary Navigation**: Subsection or category navigation  
- **Breadcrumb Navigation**: Hierarchical path display
- **Tab Navigation**: Content area switching
- **Pagination**: Numeric page navigation