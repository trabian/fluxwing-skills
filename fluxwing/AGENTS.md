# Fluxwing Agents Reference

Complete reference for all Fluxwing autonomous agents.

## Overview

Fluxwing provides 2 autonomous agents for complex UX design work:

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| **fluxwing-designer** | Create multi-component designs autonomously | Complete design systems from scratch |
| **fluxwing-composer** | Assemble screens from existing components | Compose layouts from available components |

## Data Location Rules for Agents

**All agents follow strict data location rules**:

### READ-ONLY Sources (Reference Materials)
- `{PLUGIN_ROOT}/data/examples/` - 11 bundled component templates
- `{PLUGIN_ROOT}/data/screens/` - 2 screen examples
- `{PLUGIN_ROOT}/data/docs/` - Documentation modules
- `{PLUGIN_ROOT}/data/schema/` - JSON Schema validation

**Agents NEVER write to these locations** - they are bundled reference materials.

### READ-WRITE Targets (Project Workspace)
- `./fluxwing/components/` - Agent-created components
- `./fluxwing/screens/` - Agent-created screens
- `./fluxwing/library/` - Customized template copies

**All agent outputs go here** - these are your project files.

### Inventory Check Order
When agents check for available components, they search in this order:
1. `./fluxwing/components/` - User-created components (FIRST PRIORITY)
2. `./fluxwing/library/` - Customized template copies
3. `{PLUGIN_ROOT}/data/examples/` - Bundled templates (READ-ONLY reference)

This ensures agents prefer your project components over bundled templates.

---

## Agent vs Command: When to Use Each

### Use Slash Commands When:
- Creating single component
- Browsing library
- Building one screen at a time

### Use Agents When:
- Designing complete systems (5+ components)
- Composing complex multi-screen flows
- Want autonomous, hands-off execution

---

## `fluxwing-designer` - Autonomous Multi-Component Designer

**Purpose**: Take high-level design requests and autonomously create all necessary components and screens.

### Dispatching the Agent

**Via natural language**:
```
"I need a complete authentication system with login, signup, and password reset screens"
```

Claude Code will recognize the complexity and suggest dispatching the designer agent.

**Explicit dispatch**:
```
Dispatch fluxwing-designer agent with this request:
"Create a dashboard with revenue metrics, user stats, and activity feed"
```

### What the Agent Does

The designer agent works through 5 phases autonomously:

#### Phase 1: Requirements Analysis
- Parses your request
- Identifies screens needed
- Lists required components
- Plans dependency order (atomic → composite → screens)
- Creates TodoWrite task list

#### Phase 2: Component Inventory
- Checks existing user components (`./fluxwing/components/`)
- Checks user library (`./fluxwing/library/`)
- Checks bundled templates
- Determines what to reuse vs create

#### Phase 3: Systematic Creation

**Atomic Components First**:
- button, input, badge, icon, label
- Creates both `.uxm` and `.md` files
- Validates each against schema
- Marks TodoWrite tasks complete

**Composite Components Second**:
- form (inputs + buttons)
- card (container + content)
- navigation (menu + items)
- References atomic components by ID

**Screens Last**:
- Creates THREE files: `.uxm`, `.md`, `.rendered.md`
- References all required components
- Rendered examples use REAL data
- Saved to `./fluxwing/screens/`

#### Phase 4: Documentation & Reporting
Provides comprehensive summary with:
- What was created (atomic, composite, screens)
- File locations
- Warnings/issues
- Next steps
- ASCII preview

### Example Session

**Request**:
```
Create a complete e-commerce product page with:
- Product images gallery
- Product details card
- Price and add-to-cart section
- Customer reviews
- Related products carousel
```

**Agent Output**:
```
# Fluxwing Design Session Summary

## Components Created

### Atomic (7):
✓ image-thumbnail.uxm - Gallery thumbnail with hover
✓ primary-button.uxm - Add to cart button
✓ secondary-button.uxm - Save for later
✓ star-rating.uxm - 5-star display component
✓ price-tag.uxm - Price display with currency
✓ badge.uxm - Sale/New badges
✓ review-card.uxm - Single review display

### Composite (3):
✓ image-gallery.uxm - Multiple thumbnails + main image
✓ product-details-card.uxm - Title, description, specs
✓ reviews-section.uxm - Multiple review cards with rating

### Screens (1):
✓ product-page.uxm - Complete product page layout
✓ product-page.md - Template with variables
✓ product-page.rendered.md - Example with "Wireless Headphones" data

## Files Created
./fluxwing/components/ - 22 files (11 .uxm + 11 .md)
./fluxwing/screens/ - 3 files (.uxm, .md, .rendered.md)

Total: 25 files
```

### Output Structure

**Components**:
```
./fluxwing/components/
├── image-thumbnail.uxm
├── image-thumbnail.md
├── primary-button.uxm
├── primary-button.md
└── ...
```

**Screens**:
```
./fluxwing/screens/
├── product-page.uxm
├── product-page.md
└── product-page.rendered.md  ← Shows actual product data
```

### Quality Standards

The designer agent follows strict standards:

**Design Quality**:
- Multiple states (default, hover, focus, disabled)
- Complete accessibility attributes
- Rich metadata with tags and descriptions
- Consistent ASCII patterns

**Rendered Examples**:
- REAL data, not `{{variables}}`
- Demonstrates intended use cases
- Shows component composition

### Tips for Best Results

**Be specific in your request**:
- ❌ "Create a dashboard"
- ✅ "Create a dashboard with revenue metrics (monthly/yearly), active user count, recent activity feed (last 10 items), and user profile dropdown"

**Mention data types**:
- ❌ "Show user info"
- ✅ "Show user name (string), email (validated), avatar (image URL), and last login timestamp"

**Specify states needed**:
- ❌ "Add a button"
- ✅ "Add a submit button with default, hover, loading, and disabled states"

### Related
- For single components: Use `/fluxwing-create`
- For composing from existing: Use `fluxwing-composer` agent

---

## `fluxwing-composer` - Screen Composition Agent

**Purpose**: Assemble complete screens from existing components with well-designed layouts.

### Dispatching the Agent

**When to dispatch**:
- You have components and need screens
- Want professional layout design
- Need multiple screens with consistent patterns
- Want rendered examples with real data

**How to dispatch**:
```
Dispatch fluxwing-composer agent to create a dashboard screen using existing components
```

Or with specific requirements:
```
Dispatch fluxwing-composer with:
"Create a settings screen using existing form inputs, buttons, and navigation.
Layout should be tabbed with Profile, Account, Privacy, and Advanced sections."
```

### Key Differentiator

**Composer vs Designer**:
- **Composer**: Works with existing components, focuses on layout
- **Designer**: Creates components from scratch, then composes

If components exist → use Composer
If components missing → use Designer (or Designer + Composer)

### 6-Phase Workflow

#### Phase 1: Component Inventory

Catalogs all available components:

**User Components** (`./fluxwing/components/`):
- Lists all .uxm files
- Notes types and purposes
- Checks states and props

**User Library** (`./fluxwing/library/`):
- Customized template copies
- Project variants

**Bundled Templates**:
- 11 curated starter components
- Available as references

**Output Example**:
```
Available Components:
✓ submit-button (user, button)
✓ email-input (user, input)
✓ password-input (user, input)
✓ header-nav (user, navigation)
✓ card (bundled, container)
✓ modal (bundled, overlay)

Missing for requested screen:
✗ user-avatar (will need fluxwing-designer)
✗ settings-form (can compose from existing inputs)
```

#### Phase 2: Screen Design Planning

1. **Identify required components**
2. **Plan layout structure**:
   - Vertical flow (stacked)
   - Horizontal split (sidebar + main)
   - Grid layout (cards/tiles)
   - Mixed/complex
3. **Define component relationships**
4. **Consider responsive needs**

#### Phase 3: Create Screen Files

Creates **THREE files** for every screen:

**A. `{screen-name}.uxm`** - Metadata
```json
{
  "id": "dashboard",
  "type": "container",
  "props": {
    "components": ["header-nav", "metric-card", "activity-feed"]
  },
  "layout": {
    "display": "flex",
    "positioning": "relative"
  },
  "behavior": {
    "states": [
      {"name": "loading"},
      {"name": "loaded"},
      {"name": "error"}
    ]
  }
}
```

**B. `{screen-name}.md`** - Template with `{{variables}}`
````markdown
# Dashboard

## Layout
Shows component placement with variables.

## Components Used
- **header-nav**: Top navigation
- **metric-card**: Statistics display
````

**C. `{screen-name}.rendered.md`** - **REAL DATA EXAMPLE**
```markdown
# Dashboard - Rendered Example

╭─────────────────────────────────────╮
│ Dashboard              Sarah Johnson│
├─────────────────────────────────────┤
│                                     │
│  Welcome back, Sarah!               │
│                                     │
│  ╭──────╮  ╭──────╮  ╭──────╮     │
│  │$24.5k│  │1,234 │  │+12.5%│     │
│  │Rev   │  │Users │  │Growth│     │
│  ╰──────╯  ╰──────╯  ╰──────╯     │
╰─────────────────────────────────────╯

Real data shown:
- User: Sarah Johnson
- Revenue: $24,500
- Users: 1,234
- Growth: +12.5%
```

#### Phase 4: Layout Best Practices

The composer follows proven patterns:

**Login/Signup Screen**:
```
╭────────────────────────────────╮
│          [Logo]                │
│     Welcome Back!              │
│                                │
│  Email                         │
│  [_________________________]   │
│                                │
│  Password                      │
│  [_________________________]   │
│                                │
│  [    Sign In    ]             │
╰────────────────────────────────╯
```

**Dashboard (Sidebar + Main)**:
```
╭───────╮╭────────────────────────╮
│ Nav   ││ Main Content           │
│ Home  ││ ╭────╮ ╭────╮ ╭────╮ │
│ Users ││ │Card│ │Card│ │Card│ │
│ Data  ││ ╰────╯ ╰────╯ ╰────╯ │
╰───────╯╰────────────────────────╯
```

**Settings (Tabs)**:
```
╭──────────────────────────────────╮
│ Settings                  [Save] │
├──────────────────────────────────┤
│ Profile | Account | Privacy     │
├──────────────────────────────────┤
│ Name:    [__________________]    │
│ Email:   [__________________]    │
╰──────────────────────────────────╯
```

**List/Table View**:
```
╭──────────────────────────────────╮
│ Users            [Search] [+New] │
├──────────────────────────────────┤
│ Name           Email      Status │
│ Sarah J.       sarah@... Active │
│ John D.        john@...  Away   │
╰──────────────────────────────────╯
```

#### Phase 5: Reporting

Provides clear summary:
```
SCREEN COMPOSITION SUMMARY
==========================

Screen: dashboard
Location: ./fluxwing/screens/

Files Created:
  ✓ dashboard.uxm
  ✓ dashboard.md
  ✓ dashboard.rendered.md

Components Used (6):
  ✓ header-nav (user components)
  ✓ metric-card (user library)
  ✓ activity-feed (user components)
  ✓ container (bundled)

Layout: Vertical with header, metric grid, activity

Next Steps:
- View: cat ./fluxwing/screens/dashboard.rendered.md
- Customize: Edit components
```

### The Rendered Example

**This is the composer's key output** - shows actual usage:

**Bad** (template only):
```
Revenue: {{revenueAmount}}
Users: {{userCount}}
```

**Good** (rendered):
```
Revenue: $24,567
Users: 1,234 active
Growth: +12.5% month-over-month
```

The rendered example should:
- Use realistic names (Sarah Johnson, not {{userName}})
- Use realistic numbers ($24,567, not {{amount}})
- Use realistic timestamps (2 minutes ago, not {{time}})
- Demonstrate actual use cases

### When Composer Recommends Other Agents

**Missing components**:
```
⚠️ The following components are needed but don't exist:
- user-avatar
- notification-badge
- settings-panel

Recommendation: Dispatch fluxwing-designer agent to create these first,
then return to compose the screen.
```

### Tips for Best Results

**Have components ready**:
```
# Good: Components exist
Dispatch fluxwing-composer to create dashboard using metric-card, activity-feed, header-nav

# Bad: Components missing
Dispatch fluxwing-composer to create dashboard
[Composer will report missing components]
```

**Be specific about layout**:
```
# Vague
"Create a dashboard"

# Specific
"Create a dashboard with:
- Top navigation bar
- 3 metric cards in horizontal row
- Activity feed below metrics
- Use sidebar layout with nav on left"
```

**Request realistic data**:
```
"For the rendered example, show a user named Sarah Johnson,
revenue of $24,567 for October 2024, and 5 recent activities
with realistic timestamps"
```

### Related
- For creating missing components: Use `fluxwing-designer` agent
- For quick single screens: Use `/fluxwing-scaffold`
- For composition patterns: See `data/docs/04-screen-composition.md`

---

## Agent Comparison Matrix

| Feature | Designer | Composer |
|---------|----------|----------|
| **Creates components** | ✅ Yes, from scratch | ❌ No |
| **Creates screens** | ✅ Yes | ✅ Yes |
| **Works autonomously** | ✅ Yes | ✅ Yes |
| **Needs existing components** | ❌ No | ✅ Yes |
| **Best for beginners** | ✅ Yes | ⚠️ Intermediate |
| **Output volume** | High (many files) | Medium (3 files) |

---

## Common Agent Workflows

### Workflow 1: Complete Design from Scratch

```
1. Dispatch fluxwing-designer with:
   "Create complete e-commerce checkout flow with cart, shipping, payment screens"

2. Wait for designer to complete

3. Ready for development!
```

### Workflow 2: Compose from Existing

```
1. Create atomic components:
   /fluxwing-create submit-button
   /fluxwing-create email-input
   /fluxwing-create password-input

2. Dispatch fluxwing-composer with:
   "Create login screen using the submit-button, email-input, and password-input"

3. Review rendered example
```

### Workflow 3: Iterative Refinement

```
1. Dispatch fluxwing-designer for initial design

2. Review suggestions

3. Make manual refinements to components

4. Dispatch fluxwing-composer to create additional screens
```

---

## Agent Best Practices

### For All Agents

**Be specific in dispatch requests**:
- ❌ "Create a dashboard"
- ✅ "Create a dashboard with revenue metrics (current + trend), active user count, activity feed showing last 10 events with timestamps, and user profile dropdown in top-right"

**Provide context**:
```
Dispatch fluxwing-designer with:
"Create a B2B SaaS onboarding flow (not consumer e-commerce).
Include: welcome screen, company setup form, team invitation, integration selection.
Target: technical users, enterprise context."
```

**Review outputs**:
- Always check rendered examples
- Customize to match your brand

**Chain agents appropriately**:
- Designer → Composer
- Not: Composer → Designer (wrong order)

### Common Mistakes to Avoid

**Dispatching wrong agent**:
```
# Wrong
Dispatch fluxwing-composer to "create a complete design system"
# Composer needs existing components

# Right
Dispatch fluxwing-designer to "create a complete design system"
```

**Not providing enough detail**:
```
# Vague
"Create a form"

# Specific
"Create a contact form with:
- Name input (required, text, 2-50 chars)
- Email input (required, validated format)
- Subject dropdown (Support, Sales, General)
- Message textarea (required, 10-500 chars)
- Submit button (with loading state)
- Success/error states"
```

---

## Troubleshooting Agent Issues

### Agent doesn't complete

**Symptoms**: Agent seems stuck or unresponsive

**Solutions**:
1. Check if waiting for user input
2. Review TodoWrite tasks - see what's in progress
3. Check if missing required files/data
4. Re-dispatch with more specific instructions

### Agent creates wrong output

**Symptoms**: Components/screens don't match expectations

**Solutions**:
1. Provide more detailed dispatch prompt
2. Reference specific examples to follow
3. Specify data types and states explicitly
4. Show example of desired output

### Validation fails after agent completes

**Symptoms**: Validator finds errors in agent-created files

**Solutions**:
1. This is normal for first pass
2. Review validator recommendations
3. Fix flagged issues
4. Re-validate
5. Report patterns to improve future agent work

### Agent reports missing resources

**Symptoms**: Can't find schema, examples, or docs

**Solutions**:
1. Verify plugin installation: `/plugin list`
2. Check plugin cache: `~/.claude/plugins/cache/fluxwing/`
3. Reinstall if needed: `/plugin uninstall fluxwing && /plugin install fluxwing`

---

## See Also

- **COMMANDS.md** - Quick task slash commands
- **ARCHITECTURE.md** - Plugin design and agent architecture
- **data/docs/** - Complete uxscii documentation
- **data/examples/** - Reference component implementations
- **data/screens/** - Complete screen examples with rendered versions
