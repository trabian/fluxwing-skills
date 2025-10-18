# Card Component

A flexible container for grouping related content with optional header, body, and footer sections.

## Default State

```
┌──────────────────────────────────────┐
│ {{title}}                            │
│ {{subtitle}}                         │
├──────────────────────────────────────┤
│                                      │
│ {{content}}                          │
│                                      │
└──────────────────────────────────────┘
```

## With Footer

```
┌──────────────────────────────────────┐
│ {{title}}                            │
│ {{subtitle}}                         │
├──────────────────────────────────────┤
│                                      │
│ {{content}}                          │
│                                      │
├──────────────────────────────────────┤
│ {{footer}}                           │
└──────────────────────────────────────┘
```

## Hover State

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ {{title}}                            ┃
┃ {{subtitle}}                         ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                      ┃
┃ {{content}}                          ┃
┃                                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## Focus State (Interactive Card)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ {{title}}                        ✨  ┃
┃ {{subtitle}}                         ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                      ┃
┃ {{content}}                          ┃
┃                                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## Variables

- `title` (string): The main heading of the card
- `subtitle` (string): Optional subtitle or secondary heading  
- `content` (string): The main content or body text of the card
- `footer` (string): Optional footer content like actions or metadata
- `width` (number): Card width in characters (20-80, default 40)
- `hasHeader` (boolean): Whether to show the header section
- `hasFooter` (boolean): Whether to show the footer section

## Accessibility

- **Role**: article (for content cards) or region (for layout cards)
- **Focusable**: Only if interactive (clickable)
- **Keyboard Support**: 
  - Tab: Focus if interactive
  - Enter/Space: Activate if clickable
- **ARIA**: 
  - `aria-label`: Uses title for accessible name
  - `aria-describedby`: Links to content for description

## Usage Examples

### Basic Content Card
```
┌──────────────────────────────────────┐
│ Welcome to UXscii                    │
│ Getting started guide                │
├──────────────────────────────────────┤
│                                      │
│ UXscii helps you create beautiful    │
│ ASCII representations of UI          │
│ components for design documentation. │
│                                      │
└──────────────────────────────────────┘
```

### Product Card
```
┌──────────────────────────────────────┐
│ Professional Plan                    │
│ For growing teams                    │
├──────────────────────────────────────┤
│                                      │
│ • Up to 100 components              │
│ • Advanced customization             │
│ • Priority support                   │
│ • Team collaboration                 │
│                                      │
├──────────────────────────────────────┤
│ $29/month              [Subscribe] │
└──────────────────────────────────────┘
```

### Article Card
```
┌──────────────────────────────────────┐
│ Building Better Interfaces          │
│ Design Systems Blog                  │
├──────────────────────────────────────┤
│                                      │
│ Learn how to create consistent and   │
│ scalable design systems that help    │
│ your team build better products.     │
│                                      │
├──────────────────────────────────────┤
│ Published: Jan 15, 2024    5 min read │
└──────────────────────────────────────┘
```

### Notification Card
```
┌──────────────────────────────────────┐
│ System Update                        │
│ Important notice                     │
├──────────────────────────────────────┤
│                                      │
│ A new version of the system is       │
│ available. Please update at your     │
│ earliest convenience.                │
│                                      │
├──────────────────────────────────────┤
│ [Update Now]              [Later]  │
└──────────────────────────────────────┘
```

## Component Behavior

### Interactive States

Cards can be:
- **Static**: Display-only containers
- **Clickable**: Navigate or trigger actions
- **Expandable**: Show/hide additional content

### Content Organization

- **Header**: Title, subtitle, metadata
- **Body**: Main content, lists, descriptions
- **Footer**: Actions, timestamps, secondary info

### Responsive Behavior

- **Width**: Adapts to container width
- **Content**: Text wraps within boundaries
- **Actions**: Footer buttons stack on narrow widths

## Design Tokens

### Border Styles
- `┌─┐` = Default border (light gray)
- `┏━┓` = Hover/focus border (primary color)
- `├─┤` = Section dividers

### Layout Patterns
- Header: Title + optional subtitle
- Body: Main content with padding
- Footer: Actions or metadata

### Spacing
- Internal padding: 1-2 characters
- Section spacing: Divider lines
- External margin: 2 characters bottom

## Card Variants

### Content Types
- **Article Card**: News, blog posts, documentation
- **Product Card**: Features, pricing, services
- **Profile Card**: User info, contact details
- **Status Card**: Notifications, alerts, updates

### Visual Styles
- **Elevated**: With shadow effect
- **Outlined**: Border-only styling
- **Flat**: Minimal visual separation

## Related Components

- Container: Generic layout wrapper
- Modal: Overlay card variant
- Accordion: Expandable card variant
- List Item: Simplified card for lists

## Implementation Notes

When implementing in actual UI frameworks:

1. Use semantic HTML structure (article, section, header, footer)
2. Implement proper focus management for interactive cards
3. Support responsive design with CSS Grid/Flexbox
4. Provide clear visual hierarchy with typography
5. Add appropriate hover and focus states
6. Support keyboard navigation for interactive elements
7. Implement proper ARIA attributes for accessibility
8. Consider loading states for dynamic content
9. Support various content layouts (text, images, actions)
10. Provide consistent spacing and alignment systems