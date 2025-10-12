# Fluxwing Commands Reference

Complete reference for all Fluxwing slash commands.

## Overview

Fluxwing provides 4 slash commands for quick UX design tasks:

| Command | Purpose | Output |
|---------|---------|--------|
| `/fluxwing-create` | Create single component | component.{uxm,md} |
| `/fluxwing-scaffold` | Build complete screen | screen.{uxm,md,rendered.md} |
| `/fluxwing-validate` | Validate components | Validation report |
| `/fluxwing-library` | Browse library | Interactive menu |

---

## `/fluxwing-create` - Create Component

**Purpose**: Quick component creation with guided workflow

**Usage**:
```bash
/fluxwing-create [component-name]
```

**Examples**:
```bash
/fluxwing-create button
/fluxwing-create email-input
/fluxwing-create pricing-card
```

### Interactive Workflow

1. **Component Planning**
   - Name (kebab-case)
   - Type (button, input, card, etc.)
   - Props and variables
   - Required states

2. **Template Selection**
   - Option to use bundled template
   - Or create from scratch

3. **File Creation**
   - Creates `.uxm` file with metadata
   - Creates `.md` file with ASCII template
   - Saves to `./fluxwing/components/`

4. **Post-Creation**
   - Validates against schema
   - Displays file paths
   - Offers to create another

### Output Structure

**Component files created**:
```
./fluxwing/components/
├── {component-name}.uxm       # JSON metadata
└── {component-name}.md        # ASCII template
```

### Common Component Types

- `button` - Interactive buttons
- `input` - Form inputs (text, email, password, etc.)
- `card` - Container components
- `modal` - Dialog/overlay components
- `navigation` - Menu/nav components
- `alert` - Notification components
- `badge` - Status indicators
- `list` - Data display lists
- `form` - Complete forms
- `custom` - Custom widgets

### Tips

- Use descriptive names: `submit-button` not just `button`
- Plan props before starting: What data does it need?
- Include all interactive states (hover, focus, disabled)
- Reference bundled examples for patterns

### Related

- For complete screens: use `/fluxwing-scaffold`
- For multiple components: dispatch `fluxwing-designer` agent
- To see examples: use `/fluxwing-library`

---

## `/fluxwing-scaffold` - Build Complete Screen

**Purpose**: Create complete screen with all required components

**Usage**:
```bash
/fluxwing-scaffold [screen-name]
```

**Examples**:
```bash
/fluxwing-scaffold login-screen
/fluxwing-scaffold dashboard
/fluxwing-scaffold settings-page
```

### Intelligent Workflow

1. **Component Inventory**
   - Scans `./fluxwing/components/`
   - Identifies what screen needs
   - Lists missing components

2. **Component Creation**
   - Creates missing components first
   - Uses atomic → composite pattern
   - Validates each component

3. **Screen Composition**
   - Designs layout structure
   - References created components
   - Creates THREE files

4. **Rendered Example**
   - Generates with REAL data
   - Shows actual appearance
   - Documents data context

### Output Structure

**Screen files created**:
```
./fluxwing/screens/
├── {screen-name}.uxm            # Screen metadata
├── {screen-name}.md             # Template with {{variables}}
└── {screen-name}.rendered.md    # Example with real data
```

**Plus any missing components**:
```
./fluxwing/components/
├── {component-1}.{uxm,md}
├── {component-2}.{uxm,md}
└── ...
```

### Common Screen Patterns

**Login/Signup Screen**:
- Email input
- Password input
- Submit button
- Optional: remember me, forgot password

**Dashboard Screen**:
- Navigation header
- Metric cards (3-4)
- Activity list
- Optional: charts, recent items

**Settings Screen**:
- Tabbed navigation
- Form sections
- Toggle switches
- Save/cancel buttons

**Profile Screen**:
- Avatar/image upload
- Text inputs for details
- Dropdown selects
- Update button

### The `.rendered.md` File

**Critical feature**: Shows actual rendered output with real data

**Bad example** (template only):
```
Email: {{emailAddress}}
Password: {{password}}
```

**Good example** (rendered):
```
Email: sarah.johnson@example.com
Password: ••••••••
```

**Why important**: Agents need to see the intended visual result, not just variable placeholders.

### Tips

- Start with scaffold, not individual components
- Review rendered example to verify visual design
- Use realistic data in rendered examples (not "test@test.com")
- Consider all screen states (loaded, loading, error)

### Related

- For single component: use `/fluxwing-create`
- For complex multi-screen design: dispatch `fluxwing-designer` agent
- To compose from existing: dispatch `fluxwing-composer` agent

---

## `/fluxwing-validate` - Validate Components

**Purpose**: Quick validation check for schema compliance and quality

**Usage**:
```bash
/fluxwing-validate              # Validate all files
/fluxwing-validate [file-path]  # Validate specific file
```

**Examples**:
```bash
/fluxwing-validate
/fluxwing-validate ./fluxwing/components/submit-button.uxm
/fluxwing-validate ./fluxwing/screens/login-screen.uxm
```

### Validation Levels

**1. Schema Compliance** (MUST PASS)
- Valid JSON structure
- Required fields present
- Type correctness
- Pattern validation

**2. File Integrity** (MUST PASS)
- `.uxm` ↔ `.md` file pairs exist
- `templateFile` references valid file
- No orphaned files
- Consistent naming

**3. Best Practices** (SHOULD PASS)
- Proper naming conventions
- Complete metadata
- Multiple states defined
- Accessibility attributes

**4. Quality Check** (RECOMMENDED)
- Props have descriptions
- States have clear purposes
- ASCII dimensions accurate
- Component type appropriate

### Output Format

**Success**:
```
✅ Validation Results

Schema Compliance: ✅ PASS
File Integrity: ✅ PASS
Best Practices: ✅ PASS (12/12)
Quality: ⚠️  GOOD (8/10)

Issues:
- [RECOMMENDATION] Add aria-label to submit-button
- [RECOMMENDATION] Define error state for email-input

Summary: 2 components validated, 2 recommendations
```

**Failure**:
```
❌ Validation Results

Schema Compliance: ❌ FAIL
- submit-button.uxm: Missing required field 'metadata.created'
- email-input.uxm: Invalid version format '1.0' (must be semantic)

File Integrity: ❌ FAIL
- card.uxm references 'card-template.md' but file not found

Fix these issues before proceeding.
```

### When to Validate

- **After creating components** - Ensure schema compliance
- **Before committing** - Catch issues early
- **After major changes** - Verify integrity
- **Before production** - Final quality check

### Tips

- Run validation frequently during development
- Fix FAIL issues immediately
- Address SHOULD PASS for production code
- Use `fluxwing-validator` agent for deep analysis

### Related

- For comprehensive analysis: dispatch `fluxwing-validator` agent
- For fixing issues: see `data/docs/05-validation-guide.md`
- For schema reference: see `data/docs/07-schema-reference.md`

---

## `/fluxwing-library` - Browse Component Library

**Purpose**: Explore available components and templates

**Usage**:
```bash
/fluxwing-library
```

### Interactive Menu

**Display sections**:

1. **Bundled Templates** (11 components)
   - Production-ready starter components
   - Read-only reference examples
   - Can be copied to project

2. **Project Components** (user-created)
   - Components in `./fluxwing/components/`
   - Directly editable
   - Project-specific

3. **Project Screens** (user-created)
   - Screens in `./fluxwing/screens/`
   - Complete compositions
   - Includes rendered examples

### Available Actions

**For each component**:
- `view` - Show full details (.uxm + .md content)
- `copy` - Copy bundled template to `./fluxwing/library/`
- `validate` - Run quick validation
- `edit` - Open in editor (project components only)

**Global actions**:
- `create` - Launch `/fluxwing-create`
- `scaffold` - Launch `/fluxwing-scaffold`
- `search` - Filter by name or tag

### Example Session

```bash
/fluxwing-library

📚 Fluxwing Component Library

Bundled Templates (11):
  1. primary-button - Standard action button
  2. secondary-button - Secondary action button
  3. email-input - Email input with validation
  [...]

Project Components (3):
  1. submit-button - Form submission button
  2. login-form - User login form
  3. hero-card - Marketing hero card

Project Screens (1):
  1. login-screen - User authentication screen

Actions: [v]iew [c]opy [s]earch [n]ew [q]uit
> v 1

[Shows primary-button details]
```

### Search Functionality

**Search by name**:
```
> s button
Results: primary-button, secondary-button, submit-button
```

**Search by tag**:
```
> s #input
Results: email-input, password-input, text-input
```

**Search by type**:
```
> s type:card
Results: card, pricing-card, hero-card
```

### Tips

- Browse library before creating new components
- Copy and customize bundled templates
- Use search to find similar patterns
- View rendered examples for screens

### Related

- To create new: use `/fluxwing-create`
- To compose screen: use `/fluxwing-scaffold`
- For bulk operations: dispatch `fluxwing-designer` agent

---

## Command Comparison

### When to use each command

| Scenario | Command | Why |
|----------|---------|-----|
| "I need a button" | `/fluxwing-create` | Single component |
| "I need a login screen" | `/fluxwing-scaffold` | Complete screen with dependencies |
| "What components exist?" | `/fluxwing-library` | Browse available components |
| "Is my design valid?" | `/fluxwing-validate` | Quick quality check |
| "Design a system from scratch" | `fluxwing-designer` agent | Complex multi-component work |

### Command Output Locations

```
./fluxwing/
├── components/          ← /fluxwing-create output
├── screens/             ← /fluxwing-scaffold output
└── library/             ← /fluxwing-library copy target
```

---

## Advanced Usage

### Chaining Commands

**Common workflow**:
```bash
# 1. Browse examples
/fluxwing-library

# 2. Create components
/fluxwing-create submit-button

# 3. Build screen
/fluxwing-scaffold login-screen

# 4. Validate everything
/fluxwing-validate
```

### Integration with Agents

**Commands are for quick tasks**:
- Single component creation
- One screen at a time
- Quick validation check
- Library browsing

**Agents are for complex work**:
- Multiple related components
- Complete design systems
- Deep quality analysis
- Screen composition from existing

**Hybrid approach**:
```bash
# Quick prototype with commands
/fluxwing-create button
/fluxwing-create input

# Then comprehensive design with agent
# Dispatch fluxwing-designer with:
"Build complete authentication system using existing button and input"
```

---

## Troubleshooting

### Command not found
```bash
Error: /fluxwing-create: command not found
```

**Solution**: Plugin not installed or not loaded
```bash
/plugin install fluxwing
/plugin reload
```

### Output directory doesn't exist
```bash
Error: Cannot write to ./fluxwing/components/
```

**Solution**: Create output directory
```bash
mkdir -p ./fluxwing/components
mkdir -p ./fluxwing/screens
```

### Validation always fails
```bash
❌ Schema validation failed on all files
```

**Solution**: Check schema file exists
```bash
ls ~/.claude/plugins/cache/fluxwing/data/schema/uxm-component.schema.json
```

If missing, reinstall plugin.

### Template file not found
```bash
Error: Cannot load bundled template 'primary-button'
```

**Solution**: Examples missing, reinstall plugin
```bash
/plugin uninstall fluxwing
/plugin install fluxwing
```

---

## See Also

- **AGENTS.md** - Autonomous agent reference
- **ARCHITECTURE.md** - Plugin design and structure
- **data/docs/03-component-creation.md** - Component creation workflow
- **data/docs/04-screen-composition.md** - Screen composition patterns
- **data/docs/05-validation-guide.md** - Validation rules and standards
