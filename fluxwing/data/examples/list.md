# List Component

Ordered and unordered list component with various display patterns, selection support, and keyboard navigation.

## Unordered List (Default)

```
┌────────────────────────────────────────┐
│ {{marker}} {{items[0].text}}          │
│ {{marker}} {{items[1].text}}          │
│ {{marker}} {{items[2].text}}          │
└────────────────────────────────────────┘
```

## Ordered List

```
┌────────────────────────────────────────┐
│ 1. {{items[0].text}}                   │
│ 2. {{items[1].text}}                   │
│ 3. {{items[2].text}}                   │
└────────────────────────────────────────┘
```

## Selectable List with Selection

```
┌────────────────────────────────────────┐
│   {{items[0].text}}                    │
│ ▓▓{{items[1].text}}▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     │
│   {{items[2].text}}                    │
└────────────────────────────────────────┘
```

## Checklist Variant

```
┌────────────────────────────────────────┐
│ ☐ {{items[0].text}}                    │
│ ☑ {{items[1].text}}                    │
│ ☐ {{items[2].text}}                    │
└────────────────────────────────────────┘
```

## Multi-Select List

```
┌────────────────────────────────────────┐
│ ☑ {{items[0].text}}                    │
│ ☑ {{items[1].text}}                    │
│ ☐ {{items[2].text}}                    │
└────────────────────────────────────────┘
```

## Compact List (No Borders)

```
{{marker}} {{items[0].text}}
{{marker}} {{items[1].text}}
{{marker}} {{items[2].text}}
```

## Striped List

```
┌────────────────────────────────────────┐
│ {{marker}} {{items[0].text}}          │
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
│ {{marker}} {{items[1].text}}          │
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
│ {{marker}} {{items[2].text}}          │
└────────────────────────────────────────┘
```

## Definition List

```
┌────────────────────────────────────────┐
│ {{items[0].text}}                      │
│   {{items[0].description}}             │
│                                        │
│ {{items[1].text}}                      │
│   {{items[1].description}}             │
│                                        │
│ {{items[2].text}}                      │
│   {{items[2].description}}             │
└────────────────────────────────────────┘
```

## Menu-Style List

```
┌────────────────────────────────────────┐
│ > {{items[0].text}}                    │
│   {{items[1].text}}                    │
│   {{items[2].text}}                    │
│   {{items[3].text}}                    │
└────────────────────────────────────────┘
```

## Numbered List Variants

### Decimal (Default)
```
┌────────────────────────────────────────┐
│ 1. {{items[0].text}}                   │
│ 2. {{items[1].text}}                   │
│ 3. {{items[2].text}}                   │
└────────────────────────────────────────┘
```

### Alphabetic
```
┌────────────────────────────────────────┐
│ a. {{items[0].text}}                   │
│ b. {{items[1].text}}                   │
│ c. {{items[2].text}}                   │
└────────────────────────────────────────┘
```

### Roman Numerals
```
┌────────────────────────────────────────┐
│ i.  {{items[0].text}}                  │
│ ii. {{items[1].text}}                  │
│ iii.{{items[2].text}}                  │
└────────────────────────────────────────┘
```

## Disabled Items

```
┌────────────────────────────────────────┐
│ {{marker}} {{items[0].text}}          │
│ ░ {{items[1].text}} (disabled)        │
│ {{marker}} {{items[2].text}}          │
└────────────────────────────────────────┘
```

## Interactive States

### Hover State
```
┌────────────────────────────────────────┐
│ {{marker}} {{items[0].text}}          │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓{{marker}} {{items[1].text}}         ▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ {{marker}} {{items[2].text}}          │
└────────────────────────────────────────┘
```

## Dimensions

- **Standard Width**: 30-60 characters
- **Compact Width**: 20-40 characters
- **Item Height**: 1 character (compact), 2-3 characters (normal)
- **Container Height**: Variable based on item count
- **Marker Width**: 2-4 characters depending on type

## Variables

- `items` (array, required): List items with text and metadata
  - Each item: `{id, text, selected?, disabled?, description?}`
  - Min: 1 item, Max: 50 items
- `type` (string): "unordered", "ordered", "definition", or "checklist"
- `marker` (string): Bullet character for unordered lists (default: "•")
- `numbering` (string): Style for ordered lists ("decimal", "alpha", "roman", "roman-upper")
- `selectable` (boolean): Whether items can be selected (default: true)
- `multiSelect` (boolean): Allow multiple selections (default: false)
- `bordered` (boolean): Show container border (default: true)
- `compact` (boolean): Use minimal spacing (default: false)

## Accessibility

- **Role**: list (or listbox if selectable)
- **Item Role**: listitem (or option if selectable)
- **Focusable**: Yes, if selectable
- **Keyboard Support**:
  - Arrow Up/Down: Navigate between items
  - Enter/Space: Select item
  - Ctrl+A: Select all (if multiSelect)
  - Home/End: Jump to first/last item
- **ARIA**:
  - `aria-multiselectable`: "true" if multiSelect enabled
  - `aria-selected`: "true" for selected items
  - `aria-disabled`: "true" for disabled items

## Usage Examples

### Navigation Menu
```
┌────────────────────────────────────────┐
│ > Dashboard                            │
│   Products                             │
│   Orders                               │
│   Customers                            │
│   Settings                             │
└────────────────────────────────────────┘
```

### Task List
```
┌────────────────────────────────────────┐
│ ☑ Complete project proposal           │
│ ☑ Review team feedback                │
│ ☐ Update documentation               │
│ ☐ Schedule client meeting             │
│ ☐ Prepare presentation                │
└────────────────────────────────────────┘
```

### File Browser
```
┌────────────────────────────────────────┐
│ 📁 Documents                           │
│ 📁 Downloads                           │
│ 📁 Pictures                            │
│ 📄 README.md                           │
│ 📄 package.json                       │
└────────────────────────────────────────┘
```

### Settings Menu
```
┌────────────────────────────────────────┐
│ • General Settings                     │
│ • Privacy & Security                   │
│ • Notifications                        │
│ • Account Management                   │
│ • Help & Support                       │
└────────────────────────────────────────┘
```

### Multi-Select Options
```
┌────────────────────────────────────────┐
│ ☑ Email Notifications                 │
│ ☐ SMS Alerts                          │
│ ☑ Push Notifications                  │
│ ☐ Weekly Digest                       │
│ ☑ Marketing Updates                   │
└────────────────────────────────────────┘
```

## Component Behavior

### Selection Management

1. **Single Select**: Only one item selected at a time
2. **Multi Select**: Multiple items can be selected simultaneously
3. **Toggle Selection**: Click to select/deselect items
4. **Keyboard Navigation**: Arrow keys move focus, Enter/Space selects

### State Management

- **Default**: No items selected
- **Selected**: One or more items selected
- **Focused**: Current keyboard focus position
- **Disabled**: Items that cannot be interacted with

### Visual Feedback

- **Selection**: Highlighted background for selected items
- **Hover**: Temporary highlight on mouse over
- **Focus**: Keyboard focus indicator
- **Disabled**: Grayed out appearance

## Design Tokens

### Visual Elements
- `┌─┐└┘─│` = List container borders
- `{{marker}}` = Configurable bullet points (•, -, *, ►)
- `▓` = Selection/hover background
- `░` = Disabled state indicator
- `☐☑` = Checkbox states (unchecked/checked)
- `>` = Active/current item indicator

### List Markers
- **Bullets**: •, -, *, ►, ○, ■, ♦
- **Numbers**: 1., a., i., I., (1), [1]
- **Custom**: Any single character or short string

## Related Components

- **Menu**: Dropdown or context menu with list items
- **Navigation**: Hierarchical navigation lists
- **Table**: Tabular data display with rows
- **Tree**: Hierarchical list with expand/collapse

## Implementation Notes

This ASCII representation demonstrates list patterns and interactions. When implementing:

1. **Virtual Scrolling**: Handle large lists efficiently
2. **Keyboard Navigation**: Full accessibility support
3. **Selection Persistence**: Maintain selection state across updates
4. **Performance**: Optimize rendering for large item counts
5. **Customization**: Support custom markers and styling
6. **Search/Filter**: Add search capabilities for long lists

## Variants

- **Simple List**: Basic display without interaction
- **Selectable List**: Single or multi-selection support
- **Menu List**: Navigation and action items
- **Checklist**: Task management with completion states
- **Definition List**: Term and description pairs
- **Nested List**: Hierarchical list structures