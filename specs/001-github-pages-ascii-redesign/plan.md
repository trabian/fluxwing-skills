# Implementation Plan: GitHub Pages ASCII-First Redesign

**Branch**: `001-github-pages-ascii-redesign` | **Date**: 2025-01-26 | **Spec**: [spec.md](./spec.md)

## Summary

Transform the Fluxwing GitHub Pages site into an immersive ASCII/BBS experience that demonstrates the uxscii standard in action. The site will use ASCII art, box-drawing characters, and retro terminal aesthetics while maintaining modern web standards, full responsiveness (mobile-first), and WCAG 2.1 AA accessibility compliance.

**Primary Requirement**: Create a production-ready static site that visually embodies what Fluxwing creates, using only vanilla HTML5, CSS3, and ES6+ JavaScript (no frameworks or build tools).

**Technical Approach**: Build a mobile-first responsive site with progressive enhancement, using CSS custom properties for theming, CSS Grid/Flexbox for layout, and vanilla JavaScript for interactivity. Optimize for performance (Lighthouse 90+) while ensuring full keyboard navigation and screen reader support.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ES6+ (browser native)
**Primary Dependencies**: IBM Plex Mono (web font), GitHub Pages (hosting)
**Storage**: N/A (static site, no backend)
**Testing**: Manual testing (Lighthouse, axe DevTools, WebPageTest, BrowserStack), no automated test framework
**Target Platform**: Web (modern browsers: Chrome/Firefox/Safari/Edge last 2 versions, iOS Safari 12+, Chrome Android 90+)
**Project Type**: Static web site (single project)
**Performance Goals**: FCP <1.5s, LCP <2.5s, TTI <3.5s, Lighthouse 90+, <500KB total page size
**Constraints**: No build step (vanilla JS/CSS only), WCAG 2.1 AA compliance, mobile-first responsive, no horizontal scroll on any viewport
**Scale/Scope**: 5 main pages (index, why, use-cases, 4 reference docs), ~10 sections per page, 6-8 component showcase cards

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: AI-Native Design Language

**Status**: ✅ COMPLIANT

- Site demonstrates ASCII-first design visually (hero logo, borders, terminal windows)
- Component showcase displays real `.uxm` + `.md` examples from bundled templates
- Site itself is a living example of uxscii standard applied to web design
- No violations

### Principle II: Skills-Based Architecture

**Status**: ✅ NOT APPLICABLE

- This feature is documentation/marketing site, not a skill implementation
- No skill activation triggers or agent invocations required
- No violations

### Principle III: Read-Only Templates, Read-Write Workspace

**Status**: ✅ COMPLIANT

- Site will READ from `.claude/skills/*/templates/` to showcase components
- Site will NOT modify skill files
- Component gallery displays bundled templates as read-only examples
- No violations

### Principle IV: Schema-Driven Validation

**Status**: ✅ COMPLIANT

- Component showcase will display validated `.uxm` files only
- References schema location in documentation sections
- No violations

### Principle V: Progressive Fidelity

**Status**: ✅ COMPLIANT

- Site demonstrates progressive fidelity concept:
  - Level 1: ASCII layouts (hero, borders, terminal windows)
  - Level 2: Structured metadata (component showcase `.uxm` examples)
  - Level 3: Enhanced details (accessibility, interactions, animations)
- No violations

**GATE RESULT**: ✅ PASS - No violations, all applicable principles followed

## Project Structure

### Documentation (this feature)

```text
specs/001-github-pages-ascii-redesign/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (design system patterns, ASCII art tooling, accessibility patterns)
├── data-model.md        # Phase 1 output (site structure, content model)
├── quickstart.md        # Phase 1 output (local development guide)
└── contracts/           # N/A (no API contracts for static site)
```

### Source Code (repository root)

```text
docs/                           # GitHub Pages source (all outputs here)
├── index.html                  # Home page (single-page sections)
├── why.html                    # Why Fluxwing page
├── use-cases.html              # Use cases page
├── 404.html                    # ASCII-styled error page
├── reference/
│   ├── architecture.html       # Architecture documentation
│   ├── commands.html           # Command reference
│   ├── getting-started.html    # Getting started guide
│   └── how-skills-work.html    # Skills system explanation
├── css/
│   ├── ascii-core.css          # Core design system (tokens, typography, utilities)
│   ├── crt-effects.css         # CRT screen effects (scanlines, glow, flicker)
│   ├── components.css          # Reusable component styles (buttons, cards, nav, terminal)
│   ├── responsive.css          # Mobile/tablet adaptations (breakpoints, grid)
│   └── animations.css          # Animation utilities (typewriter, scroll-reveal, loading)
├── js/
│   ├── main.js                 # Core interactions (nav, mobile menu, feature detection)
│   ├── ascii-art.js            # ASCII animations (typewriter, blinking cursor)
│   ├── terminal-demo.js        # Animated terminal sequences (validator, install)
│   └── gallery.js              # Component gallery (filters, modal, .uxm loading)
├── assets/
│   ├── fluxwing-logo.txt       # ASCII art logo (hero variant)
│   ├── decorations/            # ASCII art decorations (dividers, icons)
│   ├── trabian.svg             # Trabian logo (footer)
│   └── favicon.svg             # ASCII-styled favicon
└── CNAME                       # Domain configuration

docs_old/                       # Previous site backup (content source)
```

**Structure Decision**: Static web site structure with GitHub Pages conventions. All HTML/CSS/JS in `docs/` directory. No backend or API needed. Content migrated from `docs_old/`. Follows mobile-first responsive patterns with progressive enhancement (site works without JavaScript, better with it).

## Complexity Tracking

**No violations requiring justification** - all Constitution principles followed.

---

## Phase 0: Research & Discovery

**Objective**: Resolve NEEDS CLARIFICATION items, gather best practices, document design decisions.

### Research Tasks

1. **ASCII Art Tooling Research**
   - **Question**: What tool/process should generate ASCII logo variants while maintaining alignment consistency across hero, nav, and footer placements?
   - **Deliverable**: Recommended tooling (FIGlet, manual editor, custom script) with alignment strategy documented

2. **CSS Design System Patterns**
   - **Question**: Best practices for CSS custom property architecture in static sites (no preprocessor)?
   - **Deliverable**: Token organization strategy (colors, spacing, typography, responsive tokens)

3. **Accessibility Patterns for ASCII Art**
   - **Question**: How to properly label decorative vs meaningful ASCII with ARIA?
   - **Deliverable**: ARIA labeling guide with code examples

4. **Responsive ASCII Simplification Strategy**
   - **Question**: At what breakpoint should heavy borders (╔═══╗) simplify to light borders (┌───┐)?
   - **Deliverable**: Breakpoint decision matrix with visual examples

5. **Performance Budget for ASCII-Heavy Sites**
   - **Question**: How do monospace fonts and pre-formatted ASCII impact render performance?
   - **Deliverable**: Performance optimization checklist (font loading, critical CSS, lazy loading)

6. **CRT Effect Implementation**
   - **Question**: CSS-only techniques for scanlines, phosphor glow, flicker that respect `prefers-reduced-motion`?
   - **Deliverable**: CRT effects CSS patterns with toggle mechanism

7. **Component Gallery Data Loading**
   - **Question**: Best practice for fetching and parsing `.uxm` JSON and `.md` templates in vanilla JS?
   - **Deliverable**: Data loading strategy (fetch API, error handling, modal rendering)

8. **Animation Library Decision**
   - **Question**: Use Intersection Observer for scroll animations or simpler scroll event listeners?
   - **Deliverable**: Animation approach with browser support considerations

**Output**: `research.md` with decisions, rationales, and code patterns for each research task.

---

## Phase 1: Design & Contracts

**Prerequisites**: `research.md` complete

### 1.1 Data Model (`data-model.md`)

**Purpose**: Define site structure, content entities, and relationships.

**Entities**:

1. **Page**
   - Fields: `id`, `title`, `url`, `description`, `metaTags`, `sections[]`
   - Types: home, why, use-cases, reference
   - Relationships: has-many sections

2. **Section** (within a page)
   - Fields: `id`, `title`, `content`, `asciiFrame`, `interactivity`
   - Types: hero, navigation, content-grid, workflow-steps, gallery, terminal-demo, footer
   - Relationships: belongs-to page

3. **Component** (for showcase gallery)
   - Fields: `id`, `name`, `type`, `category`, `uxmPath`, `mdPath`
   - Types: button, input, card, form, modal, screen
   - Source: `.claude/skills/*/templates/`

4. **ASCII Art Asset**
   - Fields: `id`, `filename`, `placement`, `variant`
   - Variants: hero, footer, mobile, nav-icon
   - Storage: `docs/assets/*.txt`

**Validation Rules**:
- All pages MUST have unique URLs
- All sections MUST have ASCII frame style defined
- All components in gallery MUST have valid `.uxm` and `.md` files
- All ASCII art MUST have character width documented for alignment

**State Transitions**:
- Page load → Hero animation (typewriter) → Scroll reveal (value props)
- Gallery filter click → Re-render cards → Focus management
- Modal open → Trap focus → Load .uxm content → Display
- Mobile menu toggle → Slide-out drawer → Focus first item

**Output**: `data-model.md`

### 1.2 API Contracts (`/contracts/`)

**Status**: N/A - No backend API for static site.

**Alternative**: Document data file formats for gallery:

Create `/contracts/component-manifest.schema.json`:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "components": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "category": { "type": "string", "enum": ["button", "input", "card", "form", "screen"] },
          "uxmPath": { "type": "string" },
          "mdPath": { "type": "string" }
        },
        "required": ["id", "name", "category", "uxmPath", "mdPath"]
      }
    }
  }
}
```

**Output**: `/contracts/component-manifest.schema.json` (optional, for gallery data validation)

### 1.3 Quickstart Guide (`quickstart.md`)

**Purpose**: Local development setup for contributors.

**Content**:
1. Clone repository
2. Navigate to `docs/` directory
3. Run local server: `python3 -m http.server 8000` or `npx serve docs`
4. Open `http://localhost:8000`
5. Edit HTML/CSS/JS files
6. Refresh browser to see changes
7. Test responsive: open DevTools, toggle device toolbar

**Testing Checklist**:
- [ ] Test all breakpoints (xs, sm, md, lg)
- [ ] Run Lighthouse (Performance, Accessibility, Best Practices, SEO)
- [ ] Run axe DevTools (Accessibility)
- [ ] Test keyboard navigation (Tab through all interactive elements)
- [ ] Test screen reader (NVDA or JAWS)
- [ ] Test on real devices (iPhone, Android)

**Output**: `quickstart.md`

### 1.4 Agent Context Update

Run `.specify/scripts/bash/update-agent-context.sh claude` to add:
- HTML5 semantic markup patterns
- CSS Grid/Flexbox layout
- Vanilla JavaScript ES6+
- Accessibility (WCAG 2.1 AA)
- ASCII art alignment techniques
- Performance optimization (Lighthouse)

**Output**: Updated `.specify/memory/agent-context-*.md`

---

## Phase 2: Implementation Planning (Delivered by `/speckit.tasks`)

**This command stops here.** The next step is to run `/speckit.tasks` which will:
1. Read this `plan.md`
2. Generate dependency-ordered `tasks.md`
3. Break down implementation into executable steps

**Expected tasks.md structure** (preview):
- Phase 1: Foundation (CSS design system, base HTML, responsive grid)
- Phase 2: Visual Design (ASCII art logo, CRT effects, component library)
- Phase 3: Content Migration (port from docs_old, build all pages)
- Phase 4: Interactions (JavaScript for typewriter, gallery, mobile menu)
- Phase 5: Polish & Optimization (minify, accessibility audit, performance testing)
- Phase 6: Launch (deploy to GitHub Pages, SEO submission)
- Phase 7: Iteration (feedback collection, enhancements)

---

## Deliverables Summary

**Phase 0 Output**:
- ✅ `specs/001-github-pages-ascii-redesign/research.md`

**Phase 1 Output**:
- ✅ `specs/001-github-pages-ascii-redesign/data-model.md`
- ✅ `specs/001-github-pages-ascii-redesign/quickstart.md`
- ✅ `specs/001-github-pages-ascii-redesign/contracts/component-manifest.schema.json` (optional)
- ✅ Updated agent context file

**Next Command**: `/speckit.tasks` to generate implementation tasks.

---

## Notes

- All file paths are absolute (rooted at `/Users/tranqy/projects/fluxwing-skills/`)
- No build step required (vanilla stack)
- Content source: `docs_old/` directory (backup of previous site)
- Reference: `GITHUB_PAGES_REDESIGN_PLAN.md` (1448 lines, comprehensive design guide)
- Reference: `GITHUB_PAGES_TODO.md` (619 lines, phase-based checklist)
- Mobile-first responsive approach (simplify ASCII on small screens)
- Accessibility is non-negotiable (WCAG 2.1 AA compliance required)
