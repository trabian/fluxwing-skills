# Form Container Component

A comprehensive form container with field grouping, validation state management, and submission handling.

## Standard Vertical Form Layout

```
┌──────────────────────────────────────────────────────┐
│                 {{title}}                            │
├──────────────────────────────────────────────────────┤
│                                                      │
│  {{fields[0].label}} {{fields[0].required ? '*' : ''}}      │
│  ┌────────────────────────────────────────────────┐  │
│  │ {{fields[0].placeholder}}                      │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  {{fields[1].label}} {{fields[1].required ? '*' : ''}}      │
│  ┌────────────────────────────────────────────────┐  │
│  │ {{fields[1].placeholder}}                      │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  {{fields[2].label}} {{fields[2].required ? '*' : ''}}      │
│  ┌────────────────────────────────────────────────┐  │
│  │ {{fields[2].placeholder}}                      │  │
│  │                                                │  │
│  │                                                │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─────────────┐  {{showReset ? '┌─────────────┐' : ''}} │
│  │  {{submitText}}   │  {{showReset ? '│    Reset    │' : ''}} │
│  └─────────────┘  {{showReset ? '└─────────────┘' : ''}} │
└──────────────────────────────────────────────────────┘
```

## Horizontal Form Layout

```
┌────────────────────────────────────────────────────────────────┐
│                          {{title}}                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  {{fields[0].label}}*     {{fields[1].label}}*                │
│  ┌─────────────────┐     ┌─────────────────────────────────┐   │
│  │ {{fields[0].placeholder}}      │     │ {{fields[1].placeholder}}               │   │
│  └─────────────────┘     └─────────────────────────────────┘   │
│                                                                │
│  {{fields[2].label}}                                          │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ {{fields[2].placeholder}}                                │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌─────────────┐  ┌─────────────┐                             │
│  │  {{submitText}}   │  │    Reset    │                             │
│  └─────────────┘  └─────────────┘                             │
└────────────────────────────────────────────────────────────────┘
```

## Validation States

### Valid Form
```
┌──────────────────────────────────────────────────────┐
│                 Contact Form                         │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Full Name *                                  ✓      │
│  ┌────────────────────────────────────────────────┐  │
│  │ John Doe                                       │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  Email Address *                              ✓      │  
│  ┌────────────────────────────────────────────────┐  │
│  │ john@example.com                               │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓  ░░░░░░░░░░░░░                        │
│  ▓   Submit   ▓  ░   Reset   ░                        │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓  ░░░░░░░░░░░░░                        │
└──────────────────────────────────────────────────────┘
```

### Form with Validation Errors
```
┌──────────────────────────────────────────────────────┐
│                 Contact Form                         │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Full Name *                                  ✗      │
│  ┌────────────────────────────────────────────────┐  │
│  │                                                │  │
│  └────────────────────────────────────────────────┘  │
│  ⚠ This field is required                           │
│                                                      │
│  Email Address *                              ✗      │
│  ┌────────────────────────────────────────────────┐  │
│  │ invalid-email                                  │  │
│  └────────────────────────────────────────────────┘  │
│  ⚠ Please enter a valid email address               │
│                                                      │
│  ░░░░░░░░░░░░░  ░░░░░░░░░░░░░                        │
│  ░   Submit   ░  ░   Reset   ░                        │
│  ░░░░░░░░░░░░░  ░░░░░░░░░░░░░                        │
└──────────────────────────────────────────────────────┘
```

## Grid Layout (2x2)

```
┌──────────────────────────────────────────────────────────────┐
│                        {{title}}                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  First Name *            Last Name *                         │
│  ┌─────────────────┐    ┌─────────────────────────────────┐  │
│  │ First name      │    │ Last name                       │  │
│  └─────────────────┘    └─────────────────────────────────┘  │
│                                                              │
│  Email *                 Phone                               │
│  ┌─────────────────┐    ┌─────────────────────────────────┐  │
│  │ Email address   │    │ Phone number                    │  │
│  └─────────────────┘    └─────────────────────────────────┘  │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐                           │
│  │  {{submitText}}   │  │    Reset    │                           │
│  └─────────────┘  └─────────────┘                           │
└──────────────────────────────────────────────────────────────┘
```

## Compact Form

```
┌─────────────────────────────────────┐
│           Login                     │
├─────────────────────────────────────┤
│ Username: ┌───────────────────────┐ │
│           │ Enter username        │ │
│           └───────────────────────┘ │
│ Password: ┌───────────────────────┐ │
│           │ ••••••••••••••••••••  │ │
│           └───────────────────────┘ │
│ ┌─────────┐ ┌─────────┐            │
│ │  Login  │ │ Cancel  │            │
│ └─────────┘ └─────────┘            │
└─────────────────────────────────────┘
```

## Dimensions

- **Standard Width**: 50-80 characters
- **Compact Width**: 30-50 characters  
- **Height**: Variable based on field count
- **Field Height**: 3 characters (single line), 5+ characters (textarea)
- **Button Height**: 3 characters

## Variables

- `title` (string): Form heading text (max 50 characters)
- `fields` (array, required): Form field definitions
  - Each field: `{id, type, label, placeholder, required, validation}`
  - Min: 1 field, Max: 15 fields
  - Types: "text", "email", "password", "textarea", "select", "checkbox"
- `layout` (string): "vertical", "horizontal", or "grid" (default: "vertical")
- `submitText` (string): Submit button label (default: "Submit")
- `showReset` (boolean): Whether to display reset button (default: true)

## Accessibility

- **Role**: form
- **Focusable**: Yes, tab navigation through fields
- **Keyboard Support**:
  - Tab/Shift+Tab: Navigate between fields
  - Enter: Submit form (if valid)
  - Ctrl+Enter: Force submit
  - Escape: Cancel/reset (if applicable)
- **ARIA**:
  - `aria-label`: Form title or purpose
  - `aria-required`: "true" for required fields
  - `aria-invalid`: "true" for fields with errors
  - `aria-describedby`: Link to error messages

## Usage Examples

### Contact Form
```
┌──────────────────────────────────────────────────────┐
│                 Contact Us                           │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Your Name *                                         │
│  ┌────────────────────────────────────────────────┐  │
│  │ Enter your full name                           │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  Email Address *                                     │
│  ┌────────────────────────────────────────────────┐  │
│  │ your@email.com                                 │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  Subject                                             │
│  ┌────────────────────────────────────────────────┐  │
│  │ Brief description                              │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  Message                                             │
│  ┌────────────────────────────────────────────────┐  │
│  │ Your message here...                           │  │
│  │                                                │  │
│  │                                                │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓  ░░░░░░░░░░░░░                        │
│  ▓ Send Message │  ░   Clear   ░                        │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓  ░░░░░░░░░░░░░                        │
└──────────────────────────────────────────────────────┘
```

### Registration Form
```
┌──────────────────────────────────────────────────────────────┐
│                      Create Account                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  First Name *            Last Name *                         │
│  ┌─────────────────┐    ┌─────────────────────────────────┐  │
│  │ First name      │    │ Last name                       │  │
│  └─────────────────┘    └─────────────────────────────────┘  │
│                                                              │
│  Email Address *                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Enter a valid email address                             ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  Password *              Confirm Password *                  │
│  ┌─────────────────┐    ┌─────────────────────────────────┐  │
│  │ ••••••••••••••• │    │ ••••••••••••••••••••••••••••••  │  │
│  └─────────────────┘    └─────────────────────────────────┘  │
│                                                              │
│  ☐ I agree to the Terms of Service                          │
│                                                              │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ░░░░░░░░░░░░░                           │
│  ▓ Create Account ▓  ░   Cancel   ░                           │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ░░░░░░░░░░░░░                           │
└──────────────────────────────────────────────────────────────┘
```

## Component Behavior

### Form Validation

1. **Real-time Validation**: Fields validate as user types or on blur
2. **Form-level Validation**: Overall form state based on all fields
3. **Error Display**: Clear error messages below invalid fields
4. **Submit Prevention**: Disabled submit button for invalid forms

### State Management

- **Pristine**: Form has not been modified
- **Dirty**: Form has been modified
- **Valid**: All validation rules pass
- **Invalid**: One or more validation errors
- **Submitting**: Form submission in progress
- **Submitted**: Form successfully submitted

### Field Types

- **Text**: Single-line text input
- **Email**: Email validation with format checking
- **Password**: Hidden input with strength indicators
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection
- **Checkbox**: Boolean toggle options
- **Radio**: Single selection from multiple options

## Design Tokens

### Visual Elements
- `┌─┐└┘─│` = Form and field borders
- `▓` = Primary submit button
- `░` = Secondary/reset button  
- `✓` = Valid field indicator
- `✗` = Invalid field indicator
- `⚠` = Error/warning symbol
- `*` = Required field marker

### Status Colors (represented by patterns)
- Solid borders = Default/active state
- Dashed borders = Disabled state
- Double borders = Focus state
- `▓` pattern = Primary/submit actions
- `░` pattern = Secondary/cancel actions

## Related Components

- **Input Field**: Individual form field components
- **Button**: Submit and reset button components
- **Validation Message**: Error and success message components
- **Field Group**: Related field grouping components

## Implementation Notes

This ASCII representation demonstrates form structure and validation states. When implementing:

1. **Progressive Enhancement**: Start with basic HTML form functionality
2. **Validation Strategy**: Combine client-side and server-side validation
3. **Error Handling**: Graceful error recovery and clear messaging
4. **Accessibility**: Full keyboard navigation and screen reader support
5. **Mobile Responsiveness**: Adapt layout for small screens
6. **Security**: Proper data sanitization and CSRF protection