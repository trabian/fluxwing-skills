# Badge/Tag Component

Status indicators, labels, and informational tags with various styles and interactive capabilities for content labeling and notifications.

## Default Badge Styles

### Filled Badges
```
▓▓▓▓▓▓▓▓    ░░░░░░░░░░░░    ▓▓▓▓▓▓▓▓▓▓    ████████████
▓ {{text}} ▓    ░ Secondary ░    ▓ Primary ▓    █ Success █
▓▓▓▓▓▓▓▓    ░░░░░░░░░░░░    ▓▓▓▓▓▓▓▓▓▓    ████████████
```

### Outlined Badges
```
┌──────┐    ┌────────────┐    ┌──────────┐    ┌────────────┐
│ {{text}} │    │ Secondary  │    │ Primary  │    │ Success    │
└──────┘    └────────────┘    └──────────┘    └────────────┘
```

## Badge Variants

### Success Badge
```
████████
█ Done! █
████████
```

### Warning Badge
```
▓▓▓▓▓▓▓▓▓▓
▓ Warning ▓
▓▓▓▓▓▓▓▓▓▓
```

### Error Badge
```
▓▓▓▓▓▓▓▓▓▓
▓ Failed ▓
▓▓▓▓▓▓▓▓▓▓
```

### Info Badge
```
▓▓▓▓▓▓▓▓
▓ Info ▓
▓▓▓▓▓▓▓▓
```

## Size Variations

### Small Badge
```
▓▓▓▓▓
▓ S ▓
▓▓▓▓▓
```

### Medium Badge (Default)
```
▓▓▓▓▓▓▓▓
▓ Med ▓
▓▓▓▓▓▓▓▓
```

### Large Badge
```
▓▓▓▓▓▓▓▓▓▓
▓ Large ▓
▓▓▓▓▓▓▓▓▓▓
```

## Interactive Badges

### Clickable Badge
```
▓▓▓▓▓▓▓▓▓▓▓▓
▓ Click Me ▓  ← Clickable
▓▓▓▓▓▓▓▓▓▓▓▓
```

### Removable Badge
```
▓▓▓▓▓▓▓▓▓▓▓▓
▓ Remove │✕▓  ← Removable
▓▓▓▓▓▓▓▓▓▓▓▓
```

### Hover State
```
████████████
█ Hovered █  ← Darkened on hover
████████████
```

## Pill-Shaped Badges

```
 ╭──────────╮
 │ {{text}} │
 ╰──────────╯
```

## Notification Count Badges

### Number Badge
```
▓▓▓▓
▓ 5 ▓
▓▓▓▓
```

### High Count Badge
```
▓▓▓▓▓▓
▓ 99+ ▓
▓▓▓▓▓▓
```

### Count with Icon
```
📧 ▓▓▓▓
   ▓ 3 ▓
   ▓▓▓▓
```

## Dot Indicators

### Simple Dot
```
●
```

### Colored Dots
```
● ● ● ●
```

### Positioned Dot (with content)
```
📧 ●  ← Notification dot
```

## Badge Groups/Tags

### Tag List
```
▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓
▓ React ▓  ▓ TypeScript ▓  ▓ JavaScript ▓  ▓ Frontend ▓
▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓
```

### Removable Tags
```
▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓
▓ Tag1 │✕  ▓ Tag2 │✕   ▓ Tag3 │✕
▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓
```

## Status Indicators

### Online/Offline Status
```
● Online    ○ Offline    ◐ Away    ◑ Busy
```

### Priority Badges
```
▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓
▓ High ▓    ▓ Medium ▓    ▓ Low ▓
▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓
```

### Progress Status
```
▓▓▓▓▓▓▓▓▓▓▓    ████████████    ░░░░░░░░░░░░
▓ In Progress ▓   █ Complete █    ░ Pending ░
▓▓▓▓▓▓▓▓▓▓▓    ████████████    ░░░░░░░░░░░░
```

## Badge with Icons

```
🔥 ▓▓▓▓▓▓▓▓    ⭐ ▓▓▓▓▓▓▓▓▓▓    ⚠ ▓▓▓▓▓▓▓▓▓▓▓
   ▓ Hot ▓        ▓ Featured ▓      ▓ Warning ▓
   ▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓▓
```

## Compact Badges (Single Line)

```
[{{text}}]    ({{text}})    <{{text}}>    |{{text}}|
```

## Dimensions

- **Small**: 3-8 characters wide, 1 character high
- **Medium**: 4-12 characters wide, 1 character high  
- **Large**: 5-16 characters wide, 1 character high
- **Dot**: 1 character (●)
- **Count**: 3-6 characters wide depending on number

## Variables

- `text` (string, required): Badge text content (max 20 characters)
- `variant` (string): Style variant ("default", "success", "warning", "error", "info", "secondary")
- `size` (string): Size variant ("small", "medium", "large")
- `removable` (boolean): Show remove button (default: false)
- `clickable` (boolean): Enable click interactions (default: false) 
- `outlined` (boolean): Use outline style instead of filled (default: false)
- `pill` (boolean): Use rounded pill shape (default: false)
- `count` (number): Numeric count for notifications (0-999)
- `dot` (boolean): Show as dot indicator without text (default: false)

## Accessibility

- **Role**: status (informational) or button (if clickable)
- **Focusable**: Yes, if clickable or removable
- **Keyboard Support**:
  - Enter: Activate badge (if clickable)
  - Delete/Backspace: Remove badge (if removable)
  - Tab: Navigate to next focusable element
- **ARIA**:
  - `aria-label`: Descriptive label for badge purpose
  - `aria-hidden`: "true" for purely decorative badges
  - `aria-live`: "polite" for dynamic count badges

## Usage Examples

### Product Tags
```
▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓
▓ New ▓   ▓ Sale ▓    ▓ Featured ▓
▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓
```

### User Roles
```
▓▓▓▓▓▓▓▓▓  ░░░░░░░░░░  ▓▓▓▓▓▓▓▓▓▓▓▓
▓ Admin ▓  ░ User ░   ▓ Moderator ▓
▓▓▓▓▓▓▓▓▓  ░░░░░░░░░░  ▓▓▓▓▓▓▓▓▓▓▓▓
```

### Notification Counts
```
📧 ▓▓▓▓    🔔 ▓▓▓▓▓    💬 ▓▓▓▓▓▓
   ▓ 5 ▓       ▓ 12 ▓       ▓ 99+ ▓
   ▓▓▓▓       ▓▓▓▓▓       ▓▓▓▓▓▓
```

### Status Indicators
```
● Online    ▓▓▓▓▓▓▓▓▓▓    ○ Offline
           ▓ Active ▓
           ▓▓▓▓▓▓▓▓▓▓
```

### Skill Tags (Removable)
```
▓▓▓▓▓▓▓▓▓▓▓│✕  ▓▓▓▓▓▓▓▓▓▓▓▓▓│✕  ▓▓▓▓▓▓▓▓▓▓▓▓│✕
▓ JavaScript     ▓ TypeScript    ▓ React
▓▓▓▓▓▓▓▓▓▓▓      ▓▓▓▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓▓▓
```

### Priority Levels
```
▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓▓▓    ░░░░░░░░░░
▓ Critical ▓   ▓ Important ▓   ░ Normal ░
▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓▓▓    ░░░░░░░░░░
```

## Component Behavior

### Click Interactions

1. **Clickable Badges**: Emit click events for filtering or navigation
2. **Remove Functionality**: X button removes badge from collection
3. **Toggle States**: Some badges can toggle between states
4. **Hover Effects**: Visual feedback on interactive badges

### Dynamic Updates

- **Count Changes**: Automatically update notification counts
- **Status Changes**: Update colors and text based on state
- **Add/Remove**: Dynamic badge collections
- **Animations**: Smooth transitions for state changes

### Grouping Behavior

- **Tag Lists**: Multiple badges displayed together
- **Max Display**: Show limited number with "... +N more"
- **Filtering**: Click badges to filter content
- **Auto-complete**: Add new badges via text input

## Design Tokens

### Visual Elements
- `▓` = Primary filled background
- `█` = Success/positive state
- `░` = Secondary/muted state  
- `┌─┐└┘` = Outlined badge borders
- `╭─╮╰─╯` = Pill-shaped borders
- `●○◐◑` = Dot indicators
- `✕` = Remove button

### Color Mapping
- **Primary**: Blue/Brand color (▓)
- **Success**: Green (█)
- **Warning**: Yellow/Orange (▓)
- **Error**: Red (▓)
- **Info**: Blue (▓)
- **Secondary**: Gray (░)

## Related Components

- **Chip**: Similar but often larger with more content
- **Button**: Interactive elements with different styling
- **Label**: Form field labels and descriptions
- **Tooltip**: Additional information on hover

## Implementation Notes

This ASCII representation demonstrates badge patterns and states. When implementing:

1. **Color System**: Map ASCII patterns to actual color schemes
2. **Animations**: Smooth transitions for hover and state changes
3. **Accessibility**: Proper focus management and screen reader support
4. **Performance**: Efficient rendering for large badge collections
5. **Responsive**: Adapt sizing and spacing for different screen sizes
6. **Customization**: Support for custom colors and shapes

## Variants

- **Label Badge**: Simple text labels
- **Count Badge**: Numeric indicators
- **Status Badge**: State indicators with colors
- **Action Badge**: Clickable elements
- **Notification Badge**: Alert indicators
- **Tag Badge**: Removable filter tags