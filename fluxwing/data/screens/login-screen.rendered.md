# Login Screen - Rendered Example

This shows the actual login screen with realistic example data.

## Default State (Idle)

```
╭──────────────────────────────────────────╮
│                                          │
│          Welcome Back                    │
│      Sign in to continue                 │
│                                          │
│  Email                                   │
│  ┌────────────────────────────────────┐ │
│  │ sarah.johnson@example.com          │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Password                                │
│  ┌────────────────────────────────────┐ │
│  │ ••••••••                           │👁│
│  └────────────────────────────────────┘ │
│                                          │
│                                          │
│  ╭──────────────────────────────────╮   │
│  │         Sign In                  │   │
│  ╰──────────────────────────────────╯   │
│                                          │
│  Forgot password?  │  Create account     │
│                                          │
╰──────────────────────────────────────────╯
```

## Loading State

```
╭──────────────────────────────────────────╮
│                                          │
│          Welcome Back                    │
│      Sign in to continue                 │
│                                          │
│  Email                                   │
│  ┌────────────────────────────────────┐ │
│  │ sarah.johnson@example.com          │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Password                                │
│  ┌────────────────────────────────────┐ │
│  │ ••••••••                           │👁│
│  └────────────────────────────────────┘ │
│                                          │
│                                          │
│  ╭──────────────────────────────────╮   │
│  │  ⠋ Signing in...                 │   │
│  ╰──────────────────────────────────╯   │
│                                          │
│  Forgot password?  │  Create account     │
│                                          │
╰──────────────────────────────────────────╯
```

## Error State

```
╭──────────────────────────────────────────╮
│                                          │
│          Welcome Back                    │
│      Sign in to continue                 │
│                                          │
│  Email                                   │
│  ┌────────────────────────────────────┐ │
│  │ sarah.johnson@example.com          │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Password                                │
│  ┌────────────────────────────────────┐ │
│  │ ••••••••                           │👁│
│  └────────────────────────────────────┘ │
│                                          │
│  ╭────────────────────────────────────╮ │
│  │ ❌ Invalid email or password       │ │
│  ╰────────────────────────────────────╯ │
│                                          │
│  ╭──────────────────────────────────╮   │
│  │         Sign In                  │   │
│  ╰──────────────────────────────────╯   │
│                                          │
│  Forgot password?  │  Create account     │
│                                          │
╰──────────────────────────────────────────╯
```

## Data Context

This example demonstrates:

### User Input
- **Email**: sarah.johnson@example.com (valid format)
- **Password**: ******** (8 characters, masked for security)

### Screen Elements
- **Title**: "Welcome Back"
- **Subtitle**: "Sign in to continue"
- **Submit Button**: "Sign In" (primary action)
- **Password Toggle**: 👁 icon to show/hide password
- **Footer Links**: "Forgot password?" and "Create account"

### States Shown
1. **Idle**: Clean form ready for input
2. **Loading**: Spinner animation while authenticating
3. **Error**: Red error message showing failed authentication

## User Flow Demonstration

### Step 1: Initial State
User sees empty form with placeholder text

### Step 2: Input Data
User enters:
- Email: sarah.johnson@example.com
- Password: ••••••••

### Step 3: Submit
User clicks "Sign In" button
→ Form enters loading state
→ Shows spinner: "⠋ Signing in..."

### Step 4a: Success Path
✓ Credentials valid
→ Navigate to dashboard

### Step 4b: Error Path
✗ Credentials invalid
→ Show error: "❌ Invalid email or password"
→ Keep form populated for retry
→ Focus returns to password field

## Components Breakdown

This screen composition includes:

1. **Container** (outer box)
   - Rounded corners for friendly feel
   - Centered layout with padding

2. **Email Input** (component: email-input)
   - Text field with email validation
   - Shows user input: sarah.johnson@example.com

3. **Password Input** (adapted from email-input)
   - Masked text field
   - Show/hide toggle (👁 icon)
   - Input: ••••••••

4. **Submit Button** (component: primary-button)
   - Primary action styling
   - Text: "Sign In"
   - Loading state with spinner

5. **Error Alert** (conditional)
   - Only visible in error state
   - Red styling with ❌ icon
   - Message: "Invalid email or password"

6. **Footer Links** (text elements)
   - "Forgot password?" (clickable)
   - "Create account" (clickable)

## Design Notes

- Clean, minimal design reduces cognitive load
- Clear visual hierarchy (title → inputs → action)
- Helpful error messaging guides user to fix issues
- Password masking with optional reveal improves security
- Footer links provide escape hatches for common scenarios

## Accessibility Features

- Proper heading hierarchy (h1 for title)
- Form labels associated with inputs
- Error messages announced to screen readers
- Keyboard navigation: Tab between fields, Enter to submit
- Focus indicators visible on all interactive elements
- High contrast text for readability

This rendered example shows exactly how the login screen appears and behaves in practice!
