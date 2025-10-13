---
description: Browse uxscii component library (bundled examples + project files)
---

# Fluxwing Component Library Browser

Browse all available uxscii components: bundled templates, user-created components, and complete screens.

## Data Location Rules

**READ from (bundled templates - reference only):**
- `{PLUGIN_ROOT}/data/examples/` - 11 component templates
- `{PLUGIN_ROOT}/data/screens/` - 2 screen examples
- `{PLUGIN_ROOT}/data/docs/` - Documentation
- `{PLUGIN_ROOT}/data/schema/` - JSON Schema

**WRITE to (project workspace):**
- `./fluxwing/components/` - Your created components
- `./fluxwing/screens/` - Your created screens
- `./fluxwing/library/` - Customized template copies

**NEVER write to plugin data directory - it's read-only!**

## Your Task

Show the user what uxscii components are available across **three sources**:
1. **Bundled Templates** - 11 curated examples from `{PLUGIN_ROOT}/data/examples/` (read-only reference)
2. **Project Components** - User/agent-created reusable components in `./fluxwing/components/` (editable)
3. **Project Library** - Customized template copies in `./fluxwing/library/` (editable)
4. **Project Screens** - Complete screen compositions in `./fluxwing/screens/` (editable)

**Key Distinction**: Bundled templates are READ-ONLY reference materials. To customize them, copy to your project workspace first.

## Display Format

Present in a clear, hierarchical structure:

```
🎁 BUNDLED TEMPLATES
📁 {PLUGIN_ROOT}/data/examples/
─────────────────────────────────────────────────────
These are starter templates you can copy and customize.

Buttons (2 variants)
  ├─ primary-button.uxm
  │  └─ Standard clickable button with hover, focus, and disabled states
  │     ▓▓▓▓▓▓▓▓▓▓▓▓
  │     ▓ Click Me ▓
  │     ▓▓▓▓▓▓▓▓▓▓▓▓
  │
  └─ icon-button.uxm
     └─ Button with icon support for visual emphasis
        [🔍 Search]

Inputs (2 variants)
  ├─ text-input.uxm
  │  └─ Basic text input with validation states
  │     [________________]
  │
  └─ email-input.uxm
     └─ Email-specific input with format validation
        [user@example.com  ]

Cards (1 variant)
  └─ card.uxm
     └─ Container for grouping related content
        ╭─────────────╮
        │ Card Title  │
        ├─────────────┤
        │ Content...  │
        ╰─────────────╯

Modals (1 variant)
  └─ modal.uxm
     └─ Overlay dialog for focused interactions
        ╔═══════════════╗
        ║ Modal Title   ║
        ╠═══════════════╣
        ║ Content...    ║
        ╚═══════════════╝

Navigation (1 variant)
  └─ navigation.uxm
     └─ Primary navigation menu
        • Home  • About  • Contact

Feedback (2 variants)
  ├─ alert.uxm
  │  └─ User notification with severity levels
  │     ⚠️ Warning: Action required
  │
  └─ badge.uxm
     └─ Small status indicator or label
        ● New

Lists (1 variant)
  └─ list.uxm
     └─ Vertical list for displaying data
        • Item 1
        • Item 2
        • Item 3

─────────────────────────────────────────────────────

🎨 YOUR COMPONENTS
📁 ./fluxwing/components/
─────────────────────────────────────────────────────
Components you've created for your project.

✓ submit-button.uxm
  └─ Custom submit button for forms
     Modified: 2024-10-11 14:23:00
     [    Submit Form    ]

✓ password-input.uxm
  └─ Password input with show/hide toggle
     Modified: 2024-10-11 14:25:00
     [••••••••] 👁️

✓ user-card.uxm
  └─ Card displaying user profile information
     Modified: 2024-10-11 15:10:00
     ╭──────────────────╮
     │ John Doe         │
     │ @johndoe         │
     ╰──────────────────╯

─────────────────────────────────────────────────────

🖥️ YOUR SCREENS
📁 ./fluxwing/screens/
─────────────────────────────────────────────────────
Complete screen compositions.

✓ login-screen.uxm
  └─ User authentication screen
     Components used: email-input, password-input, submit-button, error-alert
     Modified: 2024-10-11 15:45:00

✓ dashboard.uxm
  └─ Main application dashboard
     Components used: navigation, metric-card, data-table, sidebar
     Modified: 2024-10-11 16:20:00

─────────────────────────────────────────────────────
Total: 10 templates, 3 components, 2 screens
```

## Interactive Options

After displaying the library, offer these actions:

```
What would you like to do?

1️⃣ View component details (/fluxwing-get [name])
2️⃣ Copy a template to your project (bundled → ./fluxwing/library/)
3️⃣ Create a new component (/fluxwing-create)
4️⃣ Validate existing components (/fluxwing-validate)
5️⃣ Scaffold a new screen (/fluxwing-scaffold)
6️⃣ Search for a specific pattern (e.g., "button", "input", "card")
```

## Detailed View

If user wants to see details of a specific component:

```
User: Show me primary-button

You: 📄 PRIMARY-BUTTON.UXM
─────────────────────────────────────────────────────
ID: primary-button
Type: button
Version: 1.0.0
Description: Standard clickable button with hover, focus, and disabled states

Props:
  - text: "Click me"
  - variant: "primary"
  - disabled: false

States:
  - default (solid border, white background)
  - hover (highlighted background)
  - focus (outline indicator)
  - disabled (grayed out)

Accessibility:
  - Role: button
  - Focusable: true
  - Keyboard: Space, Enter

Template: primary-button.md

ASCII Preview:

Default State:
▓▓▓▓▓▓▓▓▓▓▓▓
▓ Click Me ▓
▓▓▓▓▓▓▓▓▓▓▓▓

Hover State:
░▓▓▓▓▓▓▓▓▓▓▓░
░▓ Click Me ▓░
░▓▓▓▓▓▓▓▓▓▓▓░

Disabled State:
┌ ─ ─ ─ ─ ─┐
│ Click Me │
└ ─ ─ ─ ─ ─┘

Would you like to:
- Copy this to your project as a customizable template?
- Use it as a reference for creating a similar component?
- View the full template file?
```

## Copy Template to Project

If user wants to copy a bundled template:

```
User: Copy primary-button to my project

You: Copying primary-button to your project...

✓ Copied: {PLUGIN_ROOT}/data/examples/primary-button.uxm
     → ./fluxwing/library/primary-button.uxm

✓ Copied: {PLUGIN_ROOT}/data/examples/primary-button.md
     → ./fluxwing/library/primary-button.md

The component is now in your project library! You can:
- Edit it directly to customize for your needs
- Use it as-is in your screens
- Reference it when creating similar components

Note: Files in ./fluxwing/library/ are yours to modify. They won't be
overwritten when the plugin updates.
```

## Search Functionality

If user searches for a pattern:

```
User: Search for "input"

You: 🔍 SEARCH RESULTS FOR "input"
─────────────────────────────────────────────────────

BUNDLED TEMPLATES (2 matches):
  ✓ text-input.uxm - Basic text input with validation
  ✓ email-input.uxm - Email-specific input field

YOUR COMPONENTS (1 match):
  ✓ password-input.uxm - Password input with show/hide

YOUR SCREENS (1 match):
  ✓ login-screen.uxm (uses: email-input, password-input)

Select a number to view details, or start a new action.
```

## Empty Library Handling

If user has no components yet:

```
🎁 BUNDLED TEMPLATES: 10 available
🎨 YOUR COMPONENTS: None yet
🖥️ YOUR SCREENS: None yet

Get started:
- Run `/fluxwing-create` to create your first component
- Run `/fluxwing-scaffold` to create a complete screen
- Copy any bundled template to customize it for your project
```

## Resources

- **Bundled Examples**: `{PLUGIN_ROOT}/data/examples/` (READ-ONLY - 11 component templates)
- **Example Screens**: `{PLUGIN_ROOT}/data/screens/` (READ-ONLY - 2 screen examples)
- **Documentation**: `{PLUGIN_ROOT}/data/docs/00-INDEX.md`

## Important Notes

- **Bundled templates** (`{PLUGIN_ROOT}/data/examples/`) are READ-ONLY reference materials - copy to `./fluxwing/library/` to customize
- **Your components** in `./fluxwing/components/` are fully editable
- **Your library** in `./fluxwing/library/` contains customized template copies (editable)
- **Your screens** in `./fluxwing/screens/` are fully editable
- Screens reference components by ID - ensure components exist first
- Use `/fluxwing-validate` after copying/creating to ensure quality
- Use `/fluxwing-get [name]` to view details of any component from any source

You are helping users discover and leverage the complete uxscii component ecosystem!
