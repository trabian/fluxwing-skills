# Implementation Tasks - GitHub Pages ASCII-First Redesign

This document provides a comprehensive, dependency-ordered task list for implementing the Fluxwing Skills GitHub Pages redesign with ASCII-first aesthetics.

## Overview

- **Total Tasks**: 170
- **Target**: Static site (HTML/CSS/JS only, no build step)
- **Quality Gates**: Lighthouse 90+, WCAG 2.1 AA, mobile-first responsive
- **Deliverable**: 5 pages with ASCII design system and interactive features

## Task Legend

- `[ ]` - Not started
- `[P]` - Parallelizable (no dependencies within phase)
- `[US#]` - User Story mapping (US1-US7)
- File paths are absolute from `docs/` directory

---

## Phase 1: Setup & Infrastructure (T001-T005)

**Goal**: Initialize project structure and development environment

- [X] T001 Create docs/ directory structure (css/, js/, assets/, reference/)
- [X] T002 Create assets/decorations/ subdirectory for ASCII art files
- [X] T003 Set up local development server configuration
- [X] T004 Create .gitignore entries for generated files
- [X] T005 Document directory structure in project README

**Exit Criteria**: All directories exist, local server runs successfully

---

## Phase 2: Foundational Design System (T006-T020)

**Goal**: Establish CSS architecture and reusable design tokens

### CSS Design Tokens & Core Styles

- [X] T006 [P] Define CSS custom properties for terminal color palette in docs/css/ascii-core.css
- [X] T007 [P] Define spacing scale (4px base) in docs/css/ascii-core.css
- [X] T008 [P] Define typography tokens (IBM Plex Mono, size scale) in docs/css/ascii-core.css
- [X] T009 [P] Create CSS reset and base styles in docs/css/ascii-core.css
- [X] T010 [P] Define breakpoint custom properties in docs/css/responsive.css

### Component Architecture

- [X] T011 [P] Create button component styles in docs/css/components.css
- [X] T012 [P] Create link component styles in docs/css/components.css
- [X] T013 [P] Create card component styles in docs/css/components.css
- [X] T014 [P] Create navigation component base styles in docs/css/components.css
- [X] T015 [P] Create footer component styles in docs/css/components.css

### Layout Foundations

- [X] T016 Create container/wrapper utilities in docs/css/ascii-core.css
- [X] T017 Create grid system utilities in docs/css/ascii-core.css
- [X] T018 Create flexbox utilities in docs/css/ascii-core.css
- [X] T019 Create spacing utilities (margin/padding) in docs/css/ascii-core.css
- [X] T020 Create visibility utilities (sr-only, hidden) in docs/css/ascii-core.css

**Exit Criteria**: Design system documented, all CSS files loadable, no syntax errors

---

## Phase 3: US1 - ASCII-First Visual Design (P0) (T021-T040)

**Goal**: Implement box-drawing characters, ASCII logos, and terminal aesthetics

### ASCII Art Assets

- [X] T021 [P] [US1] Generate Fluxwing hero logo with FIGlet in docs/assets/fluxwing-hero.txt
- [X] T022 [P] [US1] Create decorative border patterns in docs/assets/decorations/borders.txt
- [X] T023 [P] [US1] Create section dividers in docs/assets/decorations/dividers.txt
- [X] T024 [P] [US1] Create ASCII icons (arrow, checkbox, bullet) in docs/assets/decorations/icons.txt
- [X] T025 [P] [US1] Optimize Trabian logo SVG in docs/assets/trabian.svg

### ASCII Border System

- [X] T026 [US1] Create .ascii-box utility class with box-drawing characters in docs/css/ascii-core.css
- [X] T027 [US1] Create .ascii-box-thin variant in docs/css/ascii-core.css
- [X] T028 [US1] Create .ascii-box-double variant in docs/css/ascii-core.css
- [X] T029 [US1] Create .ascii-divider utility in docs/css/ascii-core.css
- [X] T030 [US1] Add ::before/::after pseudo-elements for corner characters in docs/css/ascii-core.css

### Terminal Color Palette

- [X] T031 [P] [US1] Implement terminal green theme variables in docs/css/ascii-core.css
- [X] T032 [P] [US1] Implement terminal amber theme variables in docs/css/ascii-core.css
- [X] T033 [P] [US1] Implement terminal blue theme variables in docs/css/ascii-core.css
- [X] T034 [US1] Create .theme-green/.theme-amber/.theme-blue modifier classes in docs/css/ascii-core.css

### Typography & Monospace Styling

- [X] T035 [US1] Import IBM Plex Mono font (woff2) in docs/css/ascii-core.css
- [X] T036 [US1] Define monospace font stack with fallbacks in docs/css/ascii-core.css
- [X] T037 [US1] Style inline code blocks with terminal colors in docs/css/ascii-core.css
- [X] T038 [US1] Style pre/code blocks with ASCII borders in docs/css/ascii-core.css
- [X] T039 [US1] Create .terminal-text utility class in docs/css/ascii-core.css
- [X] T040 [US1] Create ASCII bullet list styles in docs/css/ascii-core.css

**Exit Criteria**: ASCII borders render correctly, terminal colors applied, monospace typography consistent

**Independent Test**: Visit index.html (after Phase 5), verify ASCII borders render at all breakpoints with correct box-drawing characters

---

## Phase 4: US2 - Responsive Mobile-First Layout (P0) (T041-T060)

**Goal**: Implement 4-tier responsive system with mobile-first approach

### Breakpoint System

- [X] T041 [P] [US2] Define xs breakpoint (320-639px) media queries in docs/css/responsive.css
- [X] T042 [P] [US2] Define sm breakpoint (640-1023px) media queries in docs/css/responsive.css
- [X] T043 [P] [US2] Define md breakpoint (1024-1439px) media queries in docs/css/responsive.css
- [X] T044 [P] [US2] Define lg breakpoint (1440px+) media queries in docs/css/responsive.css

### Mobile Navigation

- [X] T045 [US2] Create hamburger menu button HTML structure (template for all pages)
- [X] T046 [US2] Style hamburger icon (3 horizontal lines) in docs/css/components.css
- [X] T047 [US2] Implement mobile menu slide-in animation in docs/css/responsive.css
- [X] T048 [US2] Create mobile menu overlay backdrop in docs/css/components.css
- [X] T049 [US2] Implement menu toggle functionality in docs/js/main.js
- [X] T050 [US2] Add focus trap for open menu in docs/js/main.js
- [X] T051 [US2] Add escape key to close menu in docs/js/main.js

### Responsive Layouts

- [X] T052 [P] [US2] Create single-column layout for xs/sm breakpoints in docs/css/responsive.css
- [X] T053 [P] [US2] Create 2-column grid for md breakpoint in docs/css/responsive.css
- [X] T054 [P] [US2] Create 3-column grid for lg breakpoint in docs/css/responsive.css
- [X] T055 [US2] Implement responsive typography scale in docs/css/responsive.css
- [X] T056 [US2] Create responsive spacing adjustments in docs/css/responsive.css

### Mobile-First Optimizations

- [X] T057 [US2] Ensure no horizontal scroll at 320px viewport in docs/css/responsive.css
- [X] T058 [US2] Set touch target minimum 44x44px in docs/css/components.css
- [X] T059 [US2] Add viewport meta tag to HTML template
- [X] T060 [US2] Test responsive images with srcset (if applicable)

**Exit Criteria**: Site usable at all breakpoints, hamburger menu functional, no horizontal scroll

**Independent Test**: Resize viewport from 320px to 1920px, verify layout adapts correctly, hamburger menu works on mobile

---

## Phase 5: US3 - Content Migration & Page Structure (P0) (T061-T090)

**Goal**: Migrate all content from docs_old/ to new design, create all 5 pages

### HTML Template Structure

- [X] T061 [US3] Create base HTML5 template with semantic structure
- [X] T062 [US3] Create header component with logo and navigation
- [X] T063 [US3] Create footer component with links and copyright
- [X] T064 [US3] Add meta tags (charset, viewport, description, OG tags)
- [X] T065 [US3] Link all CSS files in correct order (core → components → responsive)

### Index Page (Homepage)

- [X] T066 [US3] Create docs/index.html with base template
- [X] T067 [US3] Add hero section with ASCII logo in docs/index.html
- [X] T068 [US3] Add features section (3-column cards) in docs/index.html
- [X] T069 [US3] Add quick start section with code example in docs/index.html
- [X] T070 [US3] Add component gallery preview section in docs/index.html
- [X] T071 [US3] Add CTA section (Get Started button) in docs/index.html

### Why Page

- [X] T072 [US3] Create docs/why.html with base template
- [X] T073 [US3] Migrate "AI-Native Design" section from docs_old/why.html
- [X] T074 [US3] Migrate "Terminal Aesthetics" section from docs_old/why.html
- [X] T075 [US3] Migrate "Developer-Friendly" section from docs_old/why.html
- [X] T076 [US3] Add comparison table (Fluxwing vs Traditional Tools) in docs/why.html

### Use Cases Page

- [X] T077 [US3] Create docs/use-cases.html with base template
- [X] T078 [US3] Migrate "Rapid Prototyping" use case from docs_old/use-cases.html
- [X] T079 [US3] Migrate "Design Systems" use case from docs_old/use-cases.html
- [X] T080 [US3] Migrate "Documentation" use case from docs_old/use-cases.html
- [X] T081 [US3] Add use case examples with ASCII screenshots in docs/use-cases.html

### Reference Pages

- [X] T082 [P] [US3] Create docs/reference/getting-started.html with installation steps
- [X] T083 [P] [US3] Create docs/reference/architecture.html with system diagram
- [X] T084 [P] [US3] Create docs/reference/commands.html with command reference table
- [X] T085 [P] [US3] Create docs/reference/how-skills-work.html with workflow explanation

### Navigation & 404

- [X] T086 [US3] Update navigation menu links in header component (all pages)
- [X] T087 [US3] Create breadcrumb navigation for reference pages
- [X] T088 [US3] Create docs/404.html with ASCII art error message
- [X] T089 [US3] Add "Back to Home" link in docs/404.html
- [X] T090 [US3] Verify all internal links work across all 5 pages

**Exit Criteria**: All 5 pages accessible, content migrated, links functional, no broken navigation

**Independent Test**: Navigate all 5 pages, verify content displays correctly, all links work

---

## Phase 6: US4 - Accessibility Compliance (P0) (T091-T110)

**Goal**: Achieve WCAG 2.1 AA compliance with keyboard navigation and ARIA support

### Semantic HTML

- [X] T091 [P] [US4] Audit all pages for semantic HTML5 elements (header, nav, main, footer)
- [X] T092 [P] [US4] Add role="img" to meaningful ASCII art with aria-label
- [X] T093 [P] [US4] Add aria-hidden="true" to decorative ASCII borders
- [X] T094 [P] [US4] Ensure heading hierarchy (h1 → h2 → h3) on all pages

### Keyboard Navigation

- [X] T095 [US4] Ensure all interactive elements are keyboard accessible
- [X] T096 [US4] Add visible focus indicators in docs/css/ascii-core.css
- [X] T097 [US4] Implement skip-to-content link in docs/css/components.css
- [X] T098 [US4] Test tab order matches visual layout on all pages
- [X] T099 [US4] Add keyboard shortcuts documentation (if applicable)

### ARIA Labels & Roles

- [X] T100 [P] [US4] Add aria-label to hamburger menu button
- [X] T101 [P] [US4] Add aria-expanded to menu toggle button
- [X] T102 [P] [US4] Add aria-live region for dynamic content updates
- [X] T103 [P] [US4] Add aria-current="page" to active navigation link
- [X] T104 [US4] Add aria-labelledby to sections without visible headings

### Color Contrast & Readability

- [X] T105 [P] [US4] Verify color contrast ratios meet WCAG AA (4.5:1 text, 3:1 UI)
- [X] T106 [P] [US4] Test terminal color themes for contrast compliance
- [X] T107 [US4] Ensure links are distinguishable without color alone
- [X] T108 [US4] Add focus-visible styles for keyboard navigation in docs/css/ascii-core.css

### Accessibility Testing

- [X] T109 [US4] Run axe DevTools on all 5 pages, fix violations
- [X] T110 [US4] Test with screen reader (VoiceOver/NVDA) on critical paths

**Exit Criteria**: axe DevTools reports zero violations, keyboard navigation works, color contrast passes

**Independent Test**: Tab through all interactive elements, run axe DevTools, verify zero critical/serious issues

---

## Phase 7: US5 - Interactive Features (P1) (T111-T130)

**Goal**: Implement typewriter effect, gallery filters, modal dialogs, and smooth scrolling

### Typewriter Animation

- [X] T111 [US5] Create typewriter effect function in docs/js/main.js
- [X] T112 [US5] Apply typewriter to hero headline on index.html
- [X] T113 [US5] Add cursor blink animation in docs/css/animations.css
- [X] T114 [US5] Respect prefers-reduced-motion for typewriter in docs/js/main.js

### Component Gallery

- [X] T115 [US5] Create gallery data structure in docs/js/gallery.js
- [X] T116 [US5] Implement gallery filter buttons (All, Buttons, Inputs, Cards)
- [X] T117 [US5] Create filter logic in docs/js/gallery.js
- [X] T118 [US5] Add fade-in animation for filtered items in docs/css/animations.css
- [X] T119 [US5] Display component count after filtering in docs/js/gallery.js

### Modal Dialog

- [X] T120 [US5] Create modal HTML structure using &lt;dialog&gt; element
- [X] T121 [US5] Style modal with ASCII border in docs/css/components.css
- [X] T122 [US5] Add modal backdrop overlay in docs/css/components.css
- [X] T123 [US5] Implement modal open/close logic in docs/js/main.js
- [X] T124 [US5] Add escape key to close modal in docs/js/main.js
- [X] T125 [US5] Trap focus inside open modal in docs/js/main.js

### Smooth Scrolling & Animations

- [X] T126 [US5] Implement smooth scroll for anchor links in docs/js/main.js
- [X] T127 [US5] Create fade-in-up animation in docs/css/animations.css
- [X] T128 [US5] Use Intersection Observer for scroll animations in docs/js/main.js
- [X] T129 [US5] Add stagger delay for multiple animated elements in docs/css/animations.css
- [X] T130 [US5] Respect prefers-reduced-motion for all animations in docs/css/animations.css

**Exit Criteria**: Typewriter works on hero, gallery filters correctly, modal opens/closes, smooth scroll functional

**Independent Test**: Test typewriter animation, filter gallery, open/close modal, verify smooth scroll on anchor links

---

## Phase 8: US6 - Performance Optimization (P1) (T131-T145)

**Goal**: Achieve Lighthouse 90+ score, <2.5s LCP, <500KB total size

### Asset Optimization

- [X] T131 [P] [US6] Optimize IBM Plex Mono font subset (Latin only, woff2)
- [X] T132 [P] [US6] Optimize SVG assets (trabian.svg, favicon.svg)
- [X] T133 [P] [US6] Compress ASCII art text files (gzip on server)
- [X] T134 [US6] Audit unused CSS, remove dead code

### Critical Rendering Path

- [X] T135 [US6] Inline critical CSS for above-the-fold content
- [X] T136 [US6] Defer non-critical CSS with media="print" technique
- [X] T137 [US6] Add preload hints for fonts in HTML &lt;head&gt;
- [X] T138 [US6] Add dns-prefetch for external resources (if any)

### JavaScript Optimization

- [X] T139 [US6] Defer non-critical JavaScript with defer attribute
- [X] T140 [US6] Lazy load gallery images with Intersection Observer
- [X] T141 [US6] Minify JavaScript files (manual or via CDN)
- [X] T142 [US6] Remove console.log statements from production code

### Performance Testing

- [X] T143 [US6] Run Lighthouse audit on all 5 pages
- [X] T144 [US6] Measure LCP, ensure <2.5s on 3G connection
- [X] T145 [US6] Verify total page size <500KB (uncompressed)

**Exit Criteria**: Lighthouse score 90+ (Performance, Accessibility, Best Practices, SEO), LCP <2.5s

**Independent Test**: Run Lighthouse on all pages, verify 90+ score and <2.5s LCP

---

## Phase 9: US7 - CRT Effects (Optional, P2) (T146-T155)

**Goal**: Implement optional scanlines, glow, and flicker effects with user toggle

### CRT Visual Effects

- [X] T146 [P] [US7] Create scanlines overlay in docs/css/crt-effects.css
- [X] T147 [P] [US7] Create text glow effect in docs/css/crt-effects.css
- [X] T148 [P] [US7] Create subtle flicker animation in docs/css/crt-effects.css
- [X] T149 [P] [US7] Create screen curvature effect (border-radius) in docs/css/crt-effects.css

### User Toggle

- [X] T150 [US7] Create CRT toggle button in header (all pages)
- [X] T151 [US7] Style toggle button with ASCII checkbox in docs/css/components.css
- [X] T152 [US7] Implement toggle logic in docs/js/main.js
- [X] T153 [US7] Save preference to localStorage in docs/js/main.js
- [X] T154 [US7] Apply .crt-mode class to body on toggle

### Accessibility Compliance

- [X] T155 [US7] Disable CRT effects if prefers-reduced-motion is set

**Exit Criteria**: CRT effects toggle works, preference persists, respects prefers-reduced-motion

**Independent Test**: Toggle CRT effects, verify scanlines/glow appear/disappear, refresh page and verify persistence

---

## Phase 10: Polish & Launch (T156-T170)

**Goal**: Final testing, SEO, documentation, and deployment

### Cross-Browser Testing

- [X] T156 Test site in Chrome/Edge (latest)
- [X] T157 Test site in Firefox (latest)
- [X] T158 Test site in Safari (latest, macOS/iOS)
- [X] T159 Test site on Android Chrome (mobile)
- [X] T160 Fix browser-specific CSS issues in docs/css/responsive.css

### SEO & Metadata

- [X] T161 [P] Add descriptive meta descriptions to all 5 pages
- [X] T162 [P] Add Open Graph tags for social sharing to all pages
- [X] T163 [P] Create docs/favicon.svg and link in all pages
- [X] T164 Create docs/robots.txt
- [X] T165 Create docs/sitemap.xml with all 5 pages

### Documentation

- [X] T166 Update main README.md with new site URL
- [X] T167 Document development setup in CONTRIBUTING.md (if exists)
- [X] T168 Add deployment instructions to project docs

### Deployment

- [X] T169 Verify GitHub Pages settings (branch, directory)
- [X] T170 Deploy to GitHub Pages and verify live site

**Exit Criteria**: Site live on GitHub Pages, cross-browser tested, SEO optimized

---

## Dependency Graph

### Linear Dependencies
```
Phase 1 (Setup)
  → Phase 2 (Foundational)
    → Phase 3-9 (User Stories - can run in parallel, prioritize P0 > P1 > P2)
      → Phase 10 (Polish & Launch)
```

### Within-Phase Dependencies
- **Phase 2**: CSS design tokens (T006-T010) before components (T011-T020)
- **Phase 3**: HTML template (T061-T065) before individual pages (T066-T090)
- **Phase 5**: HTML structure before JavaScript features
- **Phase 7**: HTML/CSS before JavaScript implementation
- **Phase 10**: Testing (T156-T160) before deployment (T169-T170)

### Parallelization Opportunities

**Phase 2 (Foundational)**:
- T006-T010 can run in parallel (different CSS files)
- T011-T015 can run in parallel (different components)

**Phase 3 (US1 - ASCII Design)**:
- T021-T025 can run in parallel (different asset files)
- T031-T033 can run in parallel (different theme variables)

**Phase 4 (US2 - Responsive)**:
- T041-T044 can run in parallel (different breakpoints)
- T052-T054 can run in parallel (different grid layouts)

**Phase 5 (US3 - Content)**:
- T082-T085 can run in parallel (different reference pages)

**Phase 6 (US4 - Accessibility)**:
- T091-T094 can run in parallel (different semantic audits)
- T100-T104 can run in parallel (different ARIA additions)
- T105-T106 can run in parallel (different contrast checks)

**Phase 8 (US6 - Performance)**:
- T131-T133 can run in parallel (different asset types)

**Phase 9 (US7 - CRT)**:
- T146-T149 can run in parallel (different visual effects)

**Phase 10 (Polish)**:
- T161-T163 can run in parallel (different pages/meta tags)

---

## Task Completion Tracking

**Phase 1**: 0/5 complete (0%)
**Phase 2**: 0/15 complete (0%)
**Phase 3**: 0/20 complete (0%)
**Phase 4**: 0/20 complete (0%)
**Phase 5**: 0/30 complete (0%)
**Phase 6**: 0/20 complete (0%)
**Phase 7**: 0/20 complete (0%)
**Phase 8**: 0/15 complete (0%)
**Phase 9**: 0/10 complete (0%)
**Phase 10**: 0/15 complete (0%)

**Total Progress**: 0/170 complete (0%)

---

## Notes

- All file paths are relative to `docs/` directory
- Tasks marked `[P]` can be executed in parallel within their phase
- User story labels `[US#]` map to functional requirements in spec.md
- No test tasks included per project requirements (no TDD workflow)
- Focus on static site delivery (no build step, no bundlers)
- Prioritize P0 user stories (US1-US4, US6) before P1 (US5, US7) before P2 (US7 CRT)

---

**Last Updated**: 2025-10-25
**Document Version**: 1.0.0
