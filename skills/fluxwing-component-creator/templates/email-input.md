# Email Input Field Component

A specialized input field for email addresses with built-in validation.

## Default State

```
{{label}} *
┌─────────────────────────────────┐
│ {{value || placeholder}}       │ @
└─────────────────────────────────┘
{{helpText}}
```

## Focus State

```
{{label}} *
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ {{value || placeholder}}       ┃ @
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
{{helpText}}
```

## Valid State

```
{{label}} *
┌─────────────────────────────────┐
│ {{value}}                       │ ✓
└─────────────────────────────────┘
{{helpText}}
```

## Error State

```
{{label}} *
┌─────────────────────────────────┐
│ {{value || placeholder}}       │ ⚠️
└─────────────────────────────────┘
❌ {{errorMessage}}
```

## Disabled State

```
{{label}} *
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│ {{value || placeholder}}       │ @
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
{{helpText}}
```

## Variables

- `label` (string): The label displayed above the input field
- `placeholder` (string): Placeholder text for email format guidance
- `value` (string): Current email address value
- `width` (number): Input field width in characters (20-60, default 35)
- `errorMessage` (string): Validation error message
- `helpText` (string): Privacy or usage information
- `isValid` (boolean): Whether the current email is valid

## Accessibility

- **Role**: textbox
- **Focusable**: Yes
- **Input Mode**: email (shows @ symbol on mobile keyboards)
- **Keyboard Support**: 
  - Tab: Move focus to/from field
  - All text input keys: Enter email
  - @ key: Email-specific character
- **ARIA**: 
  - `aria-label`: Email address input field
  - `aria-required`: true (email usually required)
  - `aria-invalid`: Set when email format is invalid
  - `aria-describedby`: Links to help text or error message

## Usage Examples

### Basic Email Input
```
Email Address *
┌─────────────────────────────────┐
│ name@example.com                │ @
└─────────────────────────────────┘
We'll never share your email address
```

### With Valid Email
```
Work Email *
┌─────────────────────────────────┐
│ john.doe@company.com            │ ✓
└─────────────────────────────────┘
Used for account notifications
```

### With Validation Error
```
Email Address *
┌─────────────────────────────────┐
│ invalid-email                   │ ⚠️
└─────────────────────────────────┘
❌ Please enter a valid email address
```

### Registration Form
```
Email Address *
┌─────────────────────────────────┐
│ user@domain.co                  │ ✓
└─────────────────────────────────┘
This will be your login username
```

## Component Behavior

### Email Validation

Real-time validation checks:
1. **Format**: Contains @ symbol and domain
2. **Structure**: Basic email pattern matching
3. **Domain**: Has valid domain extension
4. **Length**: Within reasonable email limits

### State Transitions

1. **Default → Focus**: User clicks or tabs into field
2. **Focus → Typing**: User starts entering email
3. **Typing → Valid**: Email format becomes valid
4. **Typing → Error**: Email format is invalid
5. **Valid/Error → Default**: User leaves field

### Validation Timing

- **Real-time**: Basic format checking as user types
- **On Blur**: Complete validation when leaving field
- **On Submit**: Final validation before form submission

## Design Tokens

### Visual Indicators
- `@` = Email input indicator
- `✓` = Valid email confirmation
- `⚠️` = Format error warning
- `*` = Required field indicator

### Border Styles
- `┌─┐` = Default border
- `┏━┓` = Focus border (primary color)
- `┌ ─ ┐` = Disabled border (dashed)

### Colors
- Default: Standard input styling
- Valid: Light green background with green border
- Error: Light red background with red border
- Focus: Primary color border

## Email-Specific Features

### Autocomplete Support
- Suggests common email domains
- Remembers previously entered emails
- Integration with browser autofill

### Mobile Optimization
- Shows email-optimized keyboard
- Includes @ and . keys prominently
- Prevents autocorrect/autocapitalize

### Privacy Considerations
- Clear privacy policy reference
- Secure handling of email data
- Optional email verification flow

## Related Components

- Text Input: Base input component
- Password Input: For password entry
- Confirmation Email Input: For email verification
- Newsletter Signup: Specialized email collection

## Implementation Notes

When implementing in actual UI frameworks:

1. Use `type="email"` for HTML5 validation
2. Set `autocomplete="email"` for autofill
3. Set `inputmode="email"` for mobile keyboards
4. Implement proper email validation regex
5. Consider email verification workflow
6. Provide clear privacy information
7. Handle international domain names
8. Support paste operations for long emails