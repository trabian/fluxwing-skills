# Login Screen

User authentication screen with email and password inputs.

## Layout

```
╭──────────────────────────────────────────╮
│                                          │
│          {{title}}                       │
│      {{subtitle}}                        │
│                                          │
│  Email                                   │
│  {{emailInput}}                          │
│                                          │
│  Password                                │
│  {{passwordInput}}                       │
│                                          │
│  {{errorMessage}}                        │
│                                          │
│         {{submitButton}}                 │
│                                          │
│  {{forgotPassword}}  │  {{signupLink}}   │
│                                          │
╰──────────────────────────────────────────╯
```

## Components Used

- **email-input**: Email address field with validation
- **password-input**: Password field with show/hide toggle (Note: using email-input as placeholder)
- **submit-button**: Form submission button (using primary-button)
- **error-alert**: Error message display (optional)

## States

### Idle State
User has not yet interacted with the form.

### Loading State
While authenticating user credentials.

### Error State
When authentication fails - shows error message above submit button.

## Variables

- `title` (string): Screen heading text
- `subtitle` (string): Subheading text
- `emailInput` (component): Email input component
- `passwordInput` (component): Password input component
- `submitButton` (component): Submit button component
- `errorMessage` (component): Error alert component
- `forgotPassword` (link): Forgot password link
- `signupLink` (link): Sign up link

## User Flows

1. User enters email address
2. User enters password
3. User clicks "Sign In" button
4. System validates credentials
5. If valid: Navigate to dashboard
6. If invalid: Show error message, allow retry

## Accessibility

- **Role**: main
- **ARIA Label**: "Login form"
- **Keyboard**: Tab navigation between fields, Enter to submit
- **Screen Reader**: All fields properly labeled
