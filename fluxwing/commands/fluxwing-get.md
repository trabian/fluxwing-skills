---
description: View details of a single uxscii component
argument-hint: [component-name]
---

## Data Location Rules

**READ from (bundled templates - reference only):**
- `{PLUGIN_ROOT}/data/examples/` - 11 component templates
- `{PLUGIN_ROOT}/data/screens/` - 2 screen examples

**READ from (project workspace):**
- `./fluxwing/components/` - Your created components
- `./fluxwing/library/` - Customized template copies
- `./fluxwing/screens/` - Your created screens

**NEVER write to plugin data directory - it's read-only!**

# Fluxwing Component Viewer

View detailed information about a specific uxscii component from any source.

## Your Task

Display comprehensive details about a single uxscii component, including metadata, ASCII template preview, and context-appropriate actions.

## Component Lookup Process

### 1. Parse Component Name
- Extract component name from command argument
- If no argument provided: Display usage message (see Error Handling section)
- Normalize name to lowercase with hyphens

### 2. Search Priority Order (Stop at First Match)
Search these locations in order and stop at the first match:

1. **Project Components**: `./fluxwing/components/[name].uxm`
   - User/agent-created custom components
   - Fully editable
   - Tag as: "Your Component"

2. **Project Library**: `./fluxwing/library/[name].uxm`
   - Customized copies of bundled templates
   - Fully editable
   - Tag as: "Your Library"

3. **Bundled Templates**: `{PLUGIN_ROOT}/data/examples/[name].uxm`
   - Read-only reference templates
   - Must be copied to edit
   - Tag as: "Bundled Template"

**Important**: Stop searching after first match. If found in bundled templates, check if it also exists in user's project and add a note: "💡 You also have a customized version in ./fluxwing/library/"

### 3. Read Component Files
For the matched component, read both files:
- `[name].uxm` - JSON metadata
- `[name].md` - ASCII template

## Display Format

### Concise View (Default)

Present component information in a clean, scannable format:

```
📄 PRIMARY-BUTTON
─────────────────────────────────────────────────────
📦 Source: Bundled Template
📍 Location: {PLUGIN_ROOT}/data/examples/primary-button.uxm
⏱️  Modified: 2024-10-11 10:30:00
🔖 Version: 1.0.0

Description:
Standard clickable button with hover, focus, and disabled states

Component Details:
• Type: button
• Props: text (string), variant (string), disabled (boolean)
• States: default, hover, focus, disabled
• Accessibility: ✓ Role (button), ✓ Focusable, ✓ Keyboard (Space, Enter)

ASCII Template Preview (first 20 lines):

Default State:
▓▓▓▓▓▓▓▓▓▓▓▓
▓ {{text}} ▓
▓▓▓▓▓▓▓▓▓▓▓▓

Hover State:
░▓▓▓▓▓▓▓▓▓▓▓░
░▓ {{text}} ▓░
░▓▓▓▓▓▓▓▓▓▓▓░

Disabled State:
┌ ─ ─ ─ ─ ─┐
│ {{text}} │
└ ─ ─ ─ ─ ─┘

[... 1 more state]

Template has 4 states total. View full template?
─────────────────────────────────────────────────────
```

### Format Guidelines

**Header Section:**
- Component name in CAPS
- Emoji indicators:
  - 📦 = Bundled Template
  - ✏️ = Your Library
  - 🎨 = Your Component
- Full file path for clarity
- Last modified timestamp (if available)
- Version from metadata

**Description:**
- Use the `metadata.description` field from .uxm file
- Keep it concise (1-2 lines)

**Component Details:**
- **Type**: Direct from .uxm `type` field
- **Props**: List prop names with types in parentheses
  - Format: `propName (type)`
  - Example: `text (string), disabled (boolean)`
- **States**: Comma-separated list of state names
- **Accessibility**: Show checkmarks for present features
  - Role, Focusable, Keyboard shortcuts, ARIA labels

**ASCII Template Preview:**
- Show first 20 lines by default
- If template has multiple states, show state labels
- If template exceeds 20 lines, add: `[... N more states/lines]`
- Preserve exact spacing and box-drawing characters
- Show variables as `{{variableName}}`

### Truncation Logic

If `.md` template exceeds 20 lines:
1. Count total states/sections in template
2. Show first 2-3 states completely
3. Add summary line: `[... N more states]`
4. Offer: "View full template?" as interactive option

## Interactive Options

After displaying the component, offer context-appropriate actions:

### For Bundled Templates (read-only)

```
What would you like to do?

1️⃣ Copy to project library (makes it editable)
2️⃣ View full template file (all states)
3️⃣ View full metadata (complete .uxm)
4️⃣ Back to library browser (/fluxwing-library)
```

**Action Details:**
- **Copy**: Copy both .uxm and .md to `./fluxwing/library/`
- **View full template**: Display complete .md file (no truncation)
- **View full metadata**: Display complete .uxm JSON
- **Back**: Return to library browser

### For Project Files (./fluxwing/library/ or ./fluxwing/components/)

```
What would you like to do?

1️⃣ Edit component (modify .uxm and .md)
2️⃣ View full template file (all states)
3️⃣ View full metadata (complete .uxm)
4️⃣ Delete component (manual: remove files from filesystem)
5️⃣ Back to library browser (/fluxwing-library)
```

**Action Details:**
- **Edit**: Open both .uxm and .md for editing
- **Delete**: Don't automatically delete - instruct user:
  ```
  To delete this component, remove these files from your filesystem:
    • ./fluxwing/components/[name].uxm
    • ./fluxwing/components/[name].md
  ```

## Error Handling

### No Argument Provided

```
Usage: /fluxwing-get [component-name]

Example:
  /fluxwing-get primary-button
  /fluxwing-get user-card

View all available components: /fluxwing-library
```

### Component Not Found

When component doesn't exist in any location:

```
❌ Component "submit-btn" not found

Searched locations:
  • Your components (./fluxwing/components/)
  • Your library (./fluxwing/library/)
  • Bundled templates ({PLUGIN_ROOT}/data/examples/)

Did you mean?
  • submit-button (your components)
  • primary-button (bundled template)
  • secondary-button (bundled template)

View all available: /fluxwing-library
```

**Suggestion Algorithm:**
1. Use fuzzy string matching on component names
2. Check for:
   - Partial matches (e.g., "submit" matches "submit-button")
   - Common typos (e.g., "buttton" → "button")
   - Similar names (Levenshtein distance < 3)
3. Suggest up to 3 closest matches
4. Include source location in parentheses

### Missing Template File

If `.uxm` exists but `.md` is missing:

```
⚠️ Warning: Template file missing

Found: ./fluxwing/components/submit-button.uxm
Missing: ./fluxwing/components/submit-button.md

This component is incomplete. Every uxscii component requires both files:
  • .uxm file (JSON metadata)
  • .md file (ASCII template)

Would you like to:
1️⃣ Create missing template file
2️⃣ View metadata only (incomplete)
3️⃣ Delete incomplete component (manual)
```

### Missing Metadata File

If `.md` exists but `.uxm` is missing:

```
⚠️ Warning: Metadata file missing

Found: ./fluxwing/components/submit-button.md
Missing: ./fluxwing/components/submit-button.uxm

This component is incomplete. Every uxscii component requires both files:
  • .uxm file (JSON metadata)
  • .md file (ASCII template)

Would you like to:
1️⃣ Create missing metadata file
2️⃣ View template only (incomplete)
3️⃣ Delete incomplete component (manual)
```

## Special Cases

### Screens vs Components

If a screen is requested:

```
📺 LOGIN-SCREEN (Screen)
─────────────────────────────────────────────────────
🖥️ Source: Your Screen
📍 Location: ./fluxwing/screens/login-screen.uxm

This is a complete screen composition (not a reusable component).

Components used:
  • email-input (bundled template)
  • password-input (your component)
  • submit-button (your library)
  • alert (bundled template)

[... show screen preview from .rendered.md if available ...]
```

**Note**: For screens, prioritize showing `.rendered.md` over `.md` because rendered examples show actual visual intent with real data.

### Duplicate Names Across Locations

If component exists in multiple locations (e.g., user customized a bundled template):

```
📄 PRIMARY-BUTTON
─────────────────────────────────────────────────────
✏️ Source: Your Library (Customized)
📍 Location: ./fluxwing/library/primary-button.uxm
⏱️  Modified: 2024-10-12 15:30:00

💡 Note: This is your customized version. The original bundled template
   also exists at {PLUGIN_ROOT}/data/examples/primary-button.uxm

[... rest of display ...]
```

## Example Interactions

### Example 1: View Bundled Template

```
User: /fluxwing-get primary-button

You: [Display bundled template with all metadata and preview]

What would you like to do?
1️⃣ Copy to project library
2️⃣ View full template
3️⃣ View full metadata
4️⃣ Back to library browser

User: 1

You: Copying primary-button to your project library...

✓ Copied: {PLUGIN_ROOT}/data/examples/primary-button.uxm
     → ./fluxwing/library/primary-button.uxm

✓ Copied: {PLUGIN_ROOT}/data/examples/primary-button.md
     → ./fluxwing/library/primary-button.md

The component is now in your project library! You can edit it directly.
Files in ./fluxwing/library/ won't be overwritten when the plugin updates.

View your copy: /fluxwing-get primary-button
```

### Example 2: View Project Component

```
User: /fluxwing-get user-card

You: [Display user's component with metadata and preview]

What would you like to do?
1️⃣ Edit component
2️⃣ View full template
3️⃣ View full metadata
4️⃣ Delete component
5️⃣ Back to library browser

User: 4

You: To delete this component, remove these files from your filesystem:
  • ./fluxwing/components/user-card.uxm
  • ./fluxwing/components/user-card.md

You can use:
  rm ./fluxwing/components/user-card.uxm
  rm ./fluxwing/components/user-card.md

Or delete them using your file manager.
```

### Example 3: Component Not Found

```
User: /fluxwing-get submit-btn

You: ❌ Component "submit-btn" not found

Searched locations:
  • Your components (./fluxwing/components/)
  • Your library (./fluxwing/library/)
  • Bundled templates ({PLUGIN_ROOT}/data/examples/)

Did you mean?
  • submit-button (your components)
  • primary-button (bundled template)

View all available: /fluxwing-library
```

### Example 4: View Full Template

```
User: /fluxwing-get modal
[Display shows truncated preview]

User: View full template

You: 📄 MODAL - Complete Template
─────────────────────────────────────────────────────

[Display entire .md file with all states, no truncation]

[... full template content ...]

─────────────────────────────────────────────────────
Total: 45 lines, 4 states
```

## Resources

- **Bundled Examples**: `{PLUGIN_ROOT}/data/examples/`
- **Example Screens**: `{PLUGIN_ROOT}/data/screens/`
- **Schema Validation**: `{PLUGIN_ROOT}/data/schema/uxm-component.schema.json`
- **Documentation**: `{PLUGIN_ROOT}/data/docs/00-INDEX.md`

## Important Notes

1. **Priority Order**: Project components override library, library overrides bundled templates
2. **Two-File System**: Every component needs both `.uxm` (metadata) and `.md` (template)
3. **Read-Only Templates**: Bundled templates can't be edited directly - must copy first
4. **Screens Have Three Files**: `.uxm`, `.md`, and `.rendered.md` (example with real data)
5. **Source Clarity**: Always show which location the component came from
6. **No Auto-Delete**: Instruct users to delete files manually - don't remove files programmatically
7. **Fuzzy Matching**: Help users find similar components when exact match fails

You are helping users quickly view and understand individual components from their complete uxscii inventory!
