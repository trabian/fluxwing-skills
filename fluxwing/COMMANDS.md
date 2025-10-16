# Fluxwing Commands Reference

Complete reference for all Fluxwing slash commands.

## Overview

Fluxwing provides 5 slash commands for quick UX design tasks:

| Command | Purpose | Output |
|---------|---------|--------|
| `/fluxwing-create` | Create single component | component.{uxm,md} |
| `/fluxwing-scaffold` | Build complete screen | screen.{uxm,md,rendered.md} |
| `/fluxwing-library` | Browse library | Interactive menu |
| `/fluxwing-get` | View single component details | Component display |
| `/fluxwing-expand-component` | Add states to component | Updated component files |

## Data Location Philosophy

**Understanding where files live is crucial**:

### Plugin Data Directory (READ-ONLY)
- **Location**: `{PLUGIN_ROOT}/data/`
- **Contains**: 11 bundled component templates, 2 screen examples, docs, schema
- **Purpose**: Reference materials and patterns
- **Access**: READ-ONLY - never modified by commands or agents

### Project Workspace (READ-WRITE)
- **Location**: `./fluxwing/`
- **Contains**: Your components, screens, and customized templates
- **Purpose**: Your actual design files
- **Access**: READ-WRITE - all command outputs go here

### The Three-Source Inventory
When commands check for available components, they look in this order:
1. `./fluxwing/components/` - Your created components (FIRST PRIORITY)
2. `./fluxwing/library/` - Your customized template copies
3. `{PLUGIN_ROOT}/data/examples/` - Bundled templates (READ-ONLY reference)

### Component Lifecycle
```
1. BROWSE    → /fluxwing-library (see all: bundled + project)
2. GET       → /fluxwing-get [name] (view single component details)
3. COPY      → Copy bundled template to ./fluxwing/library/
4. CREATE    → /fluxwing-create (new component to ./fluxwing/components/)
5. COMPOSE   → /fluxwing-scaffold (screens to ./fluxwing/screens/)
```

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
- To view single component: use `/fluxwing-get`

---

## `/fluxwing-get` - View Component Details

**Purpose**: Quick access to view details of a single component from any source

**Usage**:
```bash
/fluxwing-get [component-name]
```

**Examples**:
```bash
/fluxwing-get primary-button
/fluxwing-get submit-button
/fluxwing-get login-screen
```

### Search Order

Searches for the component in this order (first match wins):
1. `./fluxwing/components/` - Your created components
2. `./fluxwing/library/` - Your customized templates
3. `{PLUGIN_ROOT}/data/examples/` - Bundled templates

### Display Format

Shows complete component details:

**Metadata**:
- Component ID, type, version
- Description and purpose
- Props and their defaults
- States and triggers
- Accessibility attributes

**ASCII Template**:
- Preview of all states
- Variables used
- Dimensions

**File Location**:
- Full path to `.uxm` and `.md` files
- Modification timestamp
- Source indicator (bundled/library/project)

### Interactive Options

After displaying, offers context-aware actions:

**For bundled templates**:
- Copy to project (`./fluxwing/library/`)
- Use as reference for new component
- View raw template file

**For project components**:
- Edit component files
- Delete component (with confirmation)

### Tips

- Faster than browsing full library when you know the name
- Shows file location so you can edit directly
- Great for quick reference during development
- Use fuzzy matching if you don't know exact name

### Related

- To browse all components: use `/fluxwing-library`
- To create new component: use `/fluxwing-create`

---

## `/fluxwing-expand-component` - Add States to Component

**Purpose**: Add interaction states to an existing component

**Usage**:
```bash
/fluxwing-expand-component [component-name] [states...]
```

**Examples**:
```bash
# Add all standard states for component type
/fluxwing-expand-component submit-button

# Add specific states only
/fluxwing-expand-component email-input focus error

# Expand library component
/fluxwing-expand-component my-custom-card
```

### When to Use

- After creating a component with `/fluxwing-create`
- After MVP validation when you need interactive states
- When importing screenshots detected multiple states
- To add polish to default-only components

### What It Does

1. **Locates component** in `./fluxwing/components/` or `./fluxwing/library/`
2. **Reads current files** (`.uxm` and `.md`)
3. **Generates new states** based on component type
4. **Updates both files** with new state definitions and ASCII art
5. **Preserves all data** - existing metadata, variables, props remain intact

### Smart Defaults by Type

When no states are specified, adds ALL standard states for the component type:

- **button** → hover, active, disabled
- **input** → focus, error, disabled
- **checkbox/radio** → checked, disabled
- **select** → open, disabled
- **link** → hover, visited, active
- **card** → hover, selected
- **modal** → open, closing
- **alert** → success, warning, error, info
- **badge** → active, inactive
- **navigation** → active, hover
- **toggle** → on, off, disabled
- **slider** → dragging, disabled

### State Visual Patterns

Each state uses specific ASCII box-drawing characters:

- **hover**: Heavy border `┏━┓┃┗━┛`
- **focus**: Double border `╔═╗║╚═╝`
- **disabled**: Dashed border `┌┄┄┐┆└┄┄┘`
- **error**: Heavy border with indicator `┏━┓┃┗━┛⚠`
- **success**: Heavy border with indicator `┏━┓┃┗━┛✓`
- **active**: Heavy border, filled background
- **selected**: Highlighted background, border accent

### Output

**Updates existing component files**:
```
./fluxwing/components/{component-name}.uxm  # Updated with new states
./fluxwing/components/{component-name}.md   # Updated with state ASCII
```

**Preserves**:
- Component ID and version
- All existing metadata
- All existing variables
- All existing props
- All existing states
- Modification timestamp updated

**Adds**:
- New state definitions in `behavior.states` array
- New ASCII representations in `.md` file
- State-specific properties (border, background, etc.)
- Trigger events for interactive states

### Example Session

```bash
/fluxwing-expand-component submit-button

Found: submit-button in ./fluxwing/components/
Current states: default

Adding standard button states (hover, active, disabled)...

✓ Expanded: ./fluxwing/components/submit-button
✓ Added states: hover, active, disabled
✓ Total states: 4 (default, hover, active, disabled)

Preview of hover state:
┏━━━━━━━━━━━━━━━━━━━━┓
┃   Submit Form      ┃
┗━━━━━━━━━━━━━━━━━━━━┛
```

### Tips

- Use after MVP validation to add polish
- Let smart defaults handle standard states
- Specify custom states for unique interactions
- Expansion is additive - never removes states
- Duplicate states are automatically skipped

### Related

- To create component: use `/fluxwing-create`
- To view component: use `/fluxwing-get`
- For screen composition: use `/fluxwing-scaffold`

---

## Command Comparison

### When to use each command

| Scenario | Command | Why |
|----------|---------|-----|
| "I need a button" | `/fluxwing-create` | Single component |
| "I need a login screen" | `/fluxwing-scaffold` | Complete screen with dependencies |
| "What components exist?" | `/fluxwing-library` | Browse available components |
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
```

### Integration with Agents

**Commands are for quick tasks**:
- Single component creation
- One screen at a time
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
