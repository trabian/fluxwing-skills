# Data Model: GitHub Pages ASCII-First Redesign

**Feature**: 001-github-pages-ascii-redesign
**Date**: 2025-01-26
**Status**: Design Phase

## Overview

This document defines the data entities, relationships, and validation rules for the Fluxwing GitHub Pages static site. While this is a static site with no database, this model captures the content structure, component organization, and state management for the client-side application.

---

## Entities

### 1. Page

**Purpose**: Represents a distinct HTML page in the site navigation.

**Fields**:
- `id` (string): Unique identifier, matches filename (e.g., "index", "why", "use-cases")
- `title` (string): Page title for `<title>` tag and navigation
- `url` (string): Relative path from site root (e.g., "/", "/why.html", "/reference/commands.html")
- `description` (string): Meta description for SEO (150-160 chars)
- `metaTags` (object): Open Graph and Twitter Card metadata
  - `ogTitle` (string)
  - `ogDescription` (string)
  - `ogImage` (string): URL to social share image
  - `twitterCard` (string): "summary_large_image"
- `sections` (array<Section>): Ordered list of page sections (see Section entity)
- `breadcrumbs` (array<{label, url}>): Navigation breadcrumbs (reference pages only)

**Types**:
- `home`: Main landing page (`index.html`)
- `why`: Why Fluxwing page (`why.html`)
- `use-cases`: Use cases page (`use-cases.html`)
- `reference`: Documentation pages (`reference/*.html`)
- `error`: 404 error page (`404.html`)

**Relationships**:
- `has-many` Sections (composition)

**Validation Rules**:
- `id` MUST be lowercase, alphanumeric, hyphens only
- `url` MUST be unique across all pages
- `title` MUST be 10-60 characters
- `description` MUST be 120-160 characters
- `sections` array MUST NOT be empty (minimum 2 sections: nav + footer)

**Example**:
```json
{
  "id": "index",
  "title": "Fluxwing — Design Systems for Humans + AI",
  "url": "/",
  "description": "ASCII-based design language that humans and AI agents understand natively. Build component libraries through derivation, not duplication.",
  "metaTags": {
    "ogTitle": "Fluxwing — Design Systems for Humans + AI",
    "ogDescription": "ASCII-based design language that humans and AI agents understand natively.",
    "ogImage": "https://fluxwing.com/assets/og-image.png",
    "twitterCard": "summary_large_image"
  },
  "sections": ["hero", "navigation", "value-props", "..."],
  "breadcrumbs": null
}
```

---

### 2. Section

**Purpose**: Represents a discrete content section within a page (hero, navigation, content grid, footer).

**Fields**:
- `id` (string): Unique identifier within page (e.g., "hero", "nav", "value-props")
- `type` (enum): Section layout pattern
- `title` (string): Section heading (optional, e.g., "Why Teams Choose Fluxwing")
- `content` (object): Section-specific content (varies by type)
- `asciiFrame` (object): ASCII border styling configuration
  - `borderStyle` (enum): "heavy", "light", "double", "rounded", "none"
  - `characters` (object): Top/bottom/left/right character set
  - `padding` (string): Inner spacing (e.g., "1ch", "2ch")
- `interactivity` (object): Interactive features (optional)
  - `animations` (array<string>): e.g., ["typewriter", "scroll-reveal", "fade-in"]
  - `interactions` (array<string>): e.g., ["toggle", "filter", "modal", "copy"]

**Types**:
- `hero`: Large header with logo, tagline, CTA buttons
- `navigation`: Sticky nav bar (desktop menu, mobile hamburger)
- `content-grid`: Multi-column responsive grid (value props, docs links)
- `workflow-steps`: Sequential step flow (How It Works)
- `gallery`: Filterable component showcase
- `terminal-demo`: Animated terminal window (validator, install)
- `footer`: Site footer with branding and links

**Relationships**:
- `belongs-to` Page

**Validation Rules**:
- `id` MUST be unique within parent page
- `asciiFrame.borderStyle` MUST match design system standards:
  - `heavy` for hero, major sections
  - `light` for cards, components
  - `double` for emphasis
  - `none` for plain sections
- `asciiFrame.characters` MUST use Unicode box-drawing range (U+2500–U+257F)
- Interactive sections (`gallery`, `terminal-demo`) MUST define `interactivity.interactions`

**Example (Hero Section)**:
```json
{
  "id": "hero",
  "type": "hero",
  "title": null,
  "content": {
    "logo": "assets/fluxwing-logo.txt",
    "taglines": [
      "Design Systems for Humans + AI_",
      "ASCII-based design language that AI understands natively_"
    ],
    "installCommand": "git clone https://github.com/trabian/fluxwing-skills.git",
    "ctaButtons": [
      {"label": "Get Started", "url": "/reference/getting-started.html"},
      {"label": "View Docs", "url": "/reference/"},
      {"label": "See Examples", "url": "#showcase"}
    ]
  },
  "asciiFrame": {
    "borderStyle": "heavy",
    "characters": {
      "top": "═",
      "bottom": "═",
      "left": "║",
      "right": "║",
      "topLeft": "╔",
      "topRight": "╗",
      "bottomLeft": "╚",
      "bottomRight": "╝"
    },
    "padding": "2ch"
  },
  "interactivity": {
    "animations": ["typewriter", "blink-cursor"],
    "interactions": ["copy-command"]
  }
}
```

**Example (Gallery Section)**:
```json
{
  "id": "showcase",
  "type": "gallery",
  "title": "Component Showcase",
  "content": {
    "filters": ["All", "Buttons", "Inputs", "Cards", "Forms", "Screens"],
    "defaultFilter": "All",
    "components": []  // Loaded from Component entity
  },
  "asciiFrame": {
    "borderStyle": "heavy",
    "padding": "2ch"
  },
  "interactivity": {
    "animations": ["scroll-reveal"],
    "interactions": ["filter", "modal"]
  }
}
```

---

### 3. Component

**Purpose**: Represents a uxscii component template displayed in the showcase gallery. Components are read-only references to files in `.claude/skills/*/templates/`.

**Fields**:
- `id` (string): Component ID from `.uxm` file
- `name` (string): Display name (e.g., "Primary Button", "Email Input")
- `type` (string): Component type from uxscii standard (button, input, card, form, modal, etc.)
- `category` (enum): Gallery filter category
- `uxmPath` (string): Absolute path to `.uxm` file
- `mdPath` (string): Absolute path to `.md` template file
- `description` (string): Short description for gallery card (50-100 chars)
- `previewText` (string): ASCII preview snippet (3-5 lines max)

**Categories** (for gallery filtering):
- `button`: All button variants
- `input`: Text inputs, email, password, search
- `card`: Content cards, feature cards
- `form`: Form components (fieldset, legend, complete forms)
- `screen`: Complete screen layouts

**Relationships**:
- `displayed-in` Gallery Section (many-to-one)

**Validation Rules**:
- `id` MUST match ID in referenced `.uxm` file
- `uxmPath` and `mdPath` files MUST exist and be readable
- `.uxm` file MUST validate against schema (`.claude/skills/uxscii-component-creator/schemas/uxm-component.schema.json`)
- `category` MUST be one of: button, input, card, form, screen
- `previewText` MUST be valid ASCII art (no control characters except \n)

**Source Paths** (bundled templates, read-only):
```
.claude/skills/uxscii-component-creator/templates/
├── primary-button.uxm + .md
├── secondary-button.uxm + .md
├── email-input.uxm + .md
├── password-input.uxm + .md
├── content-card.uxm + .md
├── feature-card.uxm + .md
├── modal-dialog.uxm + .md
├── simple-form.uxm + .md
├── navigation-bar.uxm + .md
├── breadcrumb.uxm + .md
└── ... (11 total bundled templates)

.claude/skills/uxscii-screen-scaffolder/templates/
├── login-screen.uxm + .md + .rendered.md
└── youtube-feed-screen.uxm + .md + .rendered.md
```

**Example**:
```json
{
  "id": "primary-button",
  "name": "Primary Button",
  "type": "button",
  "category": "button",
  "uxmPath": ".claude/skills/uxscii-component-creator/templates/primary-button.uxm",
  "mdPath": ".claude/skills/uxscii-component-creator/templates/primary-button.md",
  "description": "Filled button with heavy border for primary actions",
  "previewText": "▓▓▓▓▓▓▓▓▓▓▓▓\n▓   Click  ▓\n▓▓▓▓▓▓▓▓▓▓▓▓"
}
```

---

### 4. ASCII Art Asset

**Purpose**: Represents ASCII art files used throughout the site (logo variants, decorations, icons).

**Fields**:
- `id` (string): Unique identifier (e.g., "logo-hero", "logo-footer", "divider-section")
- `filename` (string): File path relative to `docs/assets/` (e.g., "fluxwing-logo.txt")
- `placement` (enum): Where asset is used
- `variant` (enum): Size/complexity variant
- `width` (number): Character width (for alignment calculations)
- `height` (number): Line count
- `content` (string): Raw ASCII art text (loaded at runtime)

**Placements**:
- `hero`: Large logo in hero section
- `footer`: Small logo in footer
- `nav-icon`: Mobile navigation icon/brand
- `divider`: Section divider
- `decoration`: Decorative element (corners, accents)

**Variants**:
- `large`: 64ch wide (hero)
- `medium`: 32ch wide (footer)
- `small`: 20ch wide (mobile nav)
- `compact`: Simplified for mobile

**Relationships**:
- `used-in` Section (many-to-many)

**Validation Rules**:
- `filename` file MUST exist at `docs/assets/{filename}`
- `width` MUST match actual character width of content
- `height` MUST match actual line count
- Content MUST use only ASCII characters (0x20-0x7E) and Unicode box-drawing (U+2500–U+257F)
- All lines MUST have equal length (padded with spaces if needed)

**Example**:
```json
{
  "id": "logo-hero",
  "filename": "fluxwing-logo.txt",
  "placement": "hero",
  "variant": "large",
  "width": 64,
  "height": 7,
  "content": "███████╗██╗     ██╗   ██╗██╗  ██╗██╗    ██╗██╗███╗   ██╗ ██████╗\n..."
}
```

---

## State Transitions

### Page Load Flow

```
1. Browser requests page (e.g., index.html)
   ↓
2. HTML renders (structure visible immediately)
   ↓
3. CSS loads (design system, components, responsive, animations)
   ↓
4. Fonts load (IBM Plex Mono via font-display: swap)
   ↓
5. JavaScript loads (main.js, ascii-art.js, terminal-demo.js, gallery.js)
   ↓
6. DOM ready → Initialize interactions
   ↓
7. Hero animation triggers (typewriter effect)
   ↓
8. Scroll reveals initialize (Intersection Observer setup)
   ↓
9. Page fully interactive
```

**Performance Target**: Step 1→9 in <2.5 seconds (Largest Contentful Paint)

### Gallery Filter Interaction

```
User clicks filter button (e.g., "Buttons")
   ↓
1. Mark button as active (aria-selected="true")
   ↓
2. Filter components array by category
   ↓
3. Re-render gallery cards (show matching, hide others)
   ↓
4. Announce change to screen readers (aria-live region)
   ↓
5. Focus management (return focus to first visible card)
```

### Component Modal Flow

```
User clicks "View" button on component card
   ↓
1. Fetch .uxm JSON file (fetch API)
   ↓
2. Fetch .md template file (fetch API)
   ↓
3. Parse JSON and markdown
   ↓
4. Render modal with:
   - Component metadata (name, type, version)
   - ASCII preview (from .md)
   - Props table (from .uxm)
   - States (if defined)
   ↓
5. Open modal dialog (showModal())
   ↓
6. Trap focus within modal (focus loop)
   ↓
7. User presses ESC → Close modal
   ↓
8. Restore focus to "View" button
```

**Error Handling**:
- 404 on .uxm or .md → Show error message in modal
- JSON parse error → Show error with filename
- Network error → Retry once, then show offline message

### Mobile Navigation Toggle

```
User clicks hamburger menu (mobile viewport)
   ↓
1. Toggle menu state (open/close)
   ↓
2. Animate slide-out drawer (CSS transition)
   ↓
3. If opening:
   - Set aria-expanded="true" on button
   - Focus first menu item
   - Trap focus in drawer
   ↓
4. If closing:
   - Set aria-expanded="false" on button
   - Return focus to hamburger button
   - Release focus trap
```

---

## Validation Rules Summary

### Page-Level Validation

- [ ] All pages have unique URLs
- [ ] All pages have valid meta tags (title 10-60 chars, description 120-160 chars)
- [ ] All pages include navigation and footer sections
- [ ] All internal links resolve to existing pages
- [ ] All breadcrumb links are valid

### Section-Level Validation

- [ ] All sections have unique IDs within parent page
- [ ] All sections with `asciiFrame.borderStyle != "none"` have valid Unicode characters
- [ ] All interactive sections define `interactivity.interactions` array
- [ ] All sections with animations respect `prefers-reduced-motion` media query

### Component-Level Validation

- [ ] All components reference existing `.uxm` and `.md` files
- [ ] All `.uxm` files validate against schema
- [ ] All component IDs match `.uxm` file ID field
- [ ] All categories are valid enum values
- [ ] All preview text is valid ASCII art

### ASCII Art Asset Validation

- [ ] All asset files exist at specified paths
- [ ] All asset widths match actual character counts
- [ ] All asset heights match actual line counts
- [ ] All asset lines have equal length (padded if needed)
- [ ] All assets use only ASCII + Unicode box-drawing characters

---

## Data Flow Diagrams

### Static Content (Build Time)

```
docs_old/ (content source)
   ↓
Manual migration → docs/*.html (static pages)
   ↓
.claude/skills/*/templates/ (component source)
   ↓
Referenced by → gallery.js (dynamic loading)
   ↓
Displayed in → Component Showcase Gallery
```

### Dynamic Content (Runtime)

```
User visits page
   ↓
Browser loads HTML/CSS/JS
   ↓
JavaScript initializes
   ↓
Gallery loads component manifest
   ↓
User filters gallery → Re-render cards
   ↓
User clicks "View" → Fetch .uxm + .md → Display modal
```

---

## File System Mapping

### Content Files (Static)

```
docs/
├── index.html           → Page entity (id: "index", type: "home")
├── why.html             → Page entity (id: "why", type: "why")
├── use-cases.html       → Page entity (id: "use-cases", type: "use-cases")
├── 404.html             → Page entity (id: "404", type: "error")
└── reference/
    ├── architecture.html     → Page entity (type: "reference")
    ├── commands.html         → Page entity (type: "reference")
    ├── getting-started.html  → Page entity (type: "reference")
    └── how-skills-work.html  → Page entity (type: "reference")
```

### Component Files (Read-Only References)

```
.claude/skills/uxscii-component-creator/templates/
├── *.uxm    → Component entity (uxmPath)
└── *.md     → Component entity (mdPath)

.claude/skills/uxscii-screen-scaffolder/templates/
├── *.uxm    → Component entity (uxmPath)
└── *.md     → Component entity (mdPath)
```

### Asset Files (Static)

```
docs/assets/
├── fluxwing-logo.txt     → ASCII Art Asset (id: "logo-hero")
├── decorations/
│   ├── divider.txt       → ASCII Art Asset (id: "divider-section")
│   └── corner.txt        → ASCII Art Asset (id: "decoration-corner")
├── trabian.svg           → External asset (not modeled)
└── favicon.svg           → External asset (not modeled)
```

---

## Schema References

### Component Schema

All Component entities MUST validate against:
`.claude/skills/uxscii-component-creator/schemas/uxm-component.schema.json`

**Key constraints**:
- ID format: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- Version format: `^\d+\.\d+\.\d+$`
- ASCII width: 1-120 characters
- ASCII height: 1-50 lines

### Gallery Manifest Schema (Optional)

If using a pre-built component manifest:
`specs/001-github-pages-ascii-redesign/contracts/component-manifest.schema.json`

**Purpose**: Pre-generate list of components to avoid runtime filesystem scanning.

---

## Accessibility Considerations

### ARIA Roles by Section Type

| Section Type | ARIA Role | ARIA Labels |
|--------------|-----------|-------------|
| hero | `region` | `aria-label="Main hero"` |
| navigation | `navigation` | `aria-label="Primary navigation"` |
| content-grid | `region` | `aria-labelledby="{section-heading-id}"` |
| gallery | `region` | `aria-label="Component gallery"` + `aria-live="polite"` (filter announcements) |
| footer | `contentinfo` | No label needed |

### ASCII Art ARIA Strategy

**Decorative ASCII** (borders, dividers):
```html
<pre aria-hidden="true">
╔═══════════════════════╗
║                       ║
╚═══════════════════════╝
</pre>
```

**Meaningful ASCII** (logo, diagrams):
```html
<pre role="img" aria-label="Fluxwing logo in ASCII art">
███████╗██╗     ██╗   ██╗██╗  ██╗
...
</pre>
```

### Focus Management

**Interactive elements** (buttons, links, inputs):
- MUST be keyboard accessible (Tab order)
- MUST have visible focus indicators
- MUST meet 4.5:1 contrast ratio

**Modals**:
- MUST trap focus within dialog
- MUST restore focus on close
- MUST support ESC key to close

---

## Performance Considerations

### Lazy Loading Strategy

**Above the fold** (eager load):
- Hero section
- Navigation
- Hero logo ASCII art

**Below the fold** (lazy load):
- Value propositions grid
- Component gallery
- Terminal demo
- Documentation links
- Footer

**Technique**: Intersection Observer triggers load when section enters viewport.

### Component Gallery Optimization

**Problem**: 11+ components with .uxm + .md files = 22+ HTTP requests

**Solution**:
1. Load component manifest first (single JSON file)
2. Fetch .uxm and .md only when user clicks "View"
3. Cache fetched components in memory (Map)
4. Preload visible cards on scroll proximity

---

## Testing Checklist

### Data Integrity

- [ ] All pages render without errors
- [ ] All sections display with correct ASCII frames
- [ ] All components load from valid file paths
- [ ] All ASCII art assets load correctly
- [ ] All internal links resolve

### State Transitions

- [ ] Page load animation completes
- [ ] Gallery filters work correctly
- [ ] Component modal opens/closes
- [ ] Mobile menu toggles
- [ ] Focus management works in all flows

### Validation

- [ ] Run HTML validator (W3C)
- [ ] Run CSS validator (W3C)
- [ ] Run JSON schema validator on .uxm files
- [ ] Check ARIA labels with axe DevTools
- [ ] Verify keyboard navigation

---

## Appendix: Component Inventory

### Bundled Templates (uxscii-component-creator)

1. `primary-button` (button)
2. `secondary-button` (button)
3. `email-input` (input)
4. `password-input` (input)
5. `search-input` (input)
6. `checkbox` (checkbox)
7. `radio-button` (radio)
8. `content-card` (card)
9. `feature-card` (card)
10. `modal-dialog` (modal)
11. `navigation-bar` (navigation)

### Bundled Templates (uxscii-screen-scaffolder)

1. `login-screen` (screen)
2. `youtube-feed-screen` (screen)

**Total**: 13 components for showcase gallery

---

**Document Version**: 1.0
**Last Updated**: 2025-01-26
**Status**: Ready for Implementation
