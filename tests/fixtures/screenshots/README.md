# Test Screenshot Fixtures

This directory contains screenshot fixtures for testing the `/fluxwing-import-screenshot` command.

## Required Test Fixtures

### 1. button-test.png
**Purpose**: Test simple single-component extraction
**Specifications**:
- Size: 200x50 pixels
- Content: A single button with text "Submit"
- Style: Rounded corners, blue/primary color background, white text
- Clear contrast, no background noise
- PNG format

**Expected Output**:
- 1 atomic component: submit-button.uxm + submit-button.md
- Type: button
- States: default, hover, disabled

### 2. login-test.png
**Purpose**: Test multi-component extraction and hierarchy
**Specifications**:
- Size: 400x300 pixels
- Content:
  - Title: "Sign In"
  - Email input field with label
  - Password input field with label
  - Submit button
  - Optional: "Remember me" checkbox
- Clean white/light background
- Clear component boundaries
- PNG format

**Expected Output**:
- 3-4 atomic components: email-input, password-input, submit-button, (remember-checkbox)
- 1 composite component: login-form
- 1 screen: login-screen (.uxm + .md + .rendered.md)

### 3. unclear-test.png
**Purpose**: Test error handling for low-quality screenshots
**Specifications**:
- Blurry/pixelated version of button or form
- Low resolution (< 100x100)
- Or: Screenshot of non-UI content (text document, photo)

**Expected Output**:
- Error message about screenshot quality
- Graceful failure with actionable suggestions

## Creating Test Fixtures

### Option 1: Use HTML/CSS Screenshot Tool

Create simple HTML components and screenshot them:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .button {
      background: #007bff;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      border: none;
      font-size: 16px;
      font-family: system-ui;
      cursor: pointer;
    }
  </style>
</head>
<body style="background: white; padding: 20px;">
  <button class="button">Submit</button>
</body>
</html>
```

### Option 2: Use Design Tools

Create components in Figma, Sketch, or similar tool and export as PNG.

### Option 3: Use CLI Screenshot Tools

```bash
# On macOS
screencapture -R x,y,width,height button-test.png

# On Linux
import -window root -crop WIDTHxHEIGHT+X+Y button-test.png
```

## Verification Checklist

Before committing test fixtures:

- [ ] All images are PNG format
- [ ] Images have clear, readable text
- [ ] Good contrast between elements
- [ ] No background noise or artifacts
- [ ] Files are reasonably sized (< 100KB each)
- [ ] button-test.png created
- [ ] login-test.png created
- [ ] unclear-test.png created

## Usage in Tests

```typescript
// In test files
const buttonScreenshot = 'tests/fixtures/screenshots/button-test.png';
const loginScreenshot = 'tests/fixtures/screenshots/login-test.png';
const unclearScreenshot = 'tests/fixtures/screenshots/unclear-test.png';

// Test invocation
await client.executeCommand(`/fluxwing-import-screenshot ${buttonScreenshot}`);
```
