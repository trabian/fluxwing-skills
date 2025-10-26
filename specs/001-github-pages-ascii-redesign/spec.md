# Feature Specification: GitHub Pages ASCII-First Redesign

**Feature ID**: 001-github-pages-ascii-redesign
**Status**: Planning
**Created**: 2025-01-26
**Target Release**: v1.0.0

## Overview

Transform the Fluxwing GitHub Pages site into an immersive ASCII/BBS experience that demonstrates what Fluxwing creates. The site will use ASCII art, box-drawing characters, and retro terminal aesthetics throughout while maintaining modern web standards, full responsiveness, and accessibility.

**Core Principle**: Every visitor should immediately understand that Fluxwing creates ASCII-based UX designs by experiencing an ASCII-first website.

## Problem Statement

The current GitHub Pages site does not visually demonstrate the ASCII-first design language that Fluxwing enables. Visitors cannot immediately grasp what makes uxscii unique without seeing it in action. The site needs to become a living example of the uxscii standard itself.

## User Stories

### Primary Users: Developers & Designers

**As a developer evaluating Fluxwing**, I want to:
- Immediately see what ASCII-first design looks like
- Understand the value proposition within 30 seconds
- See real component examples with ASCII rendering
- Access quick installation instructions
- Browse component library and documentation

**As a designer exploring AI-native design**, I want to:
- Understand why ASCII works for AI collaboration
- See the derivation model visualized
- Compare traditional tools vs Fluxwing
- Explore use cases relevant to my work
- See before/after examples

**As a mobile visitor**, I want to:
- Experience the ASCII aesthetic without horizontal scrolling
- Navigate easily with touch-friendly targets
- See simplified but consistent design on small screens

### Secondary Users: Accessibility-Focused

**As a screen reader user**, I want to:
- Navigate with semantic HTML landmarks
- Skip decorative ASCII art
- Access all interactive elements via keyboard
- Understand component purpose through ARIA labels

**As a user with motion sensitivity**, I want to:
- Toggle CRT effects off
- Experience the site without distracting animations
- Respect my `prefers-reduced-motion` setting

## Functional Requirements

### FR1: ASCII-First Visual Design

**Priority**: P0 (Must Have)

The site MUST embody ASCII/BBS aesthetic throughout:

1.1. Use box-drawing characters for all major sections (╔═══╗, ┌───┐, ┏━━━┓)
1.2. Frame navigation bars, cards, and content blocks with ASCII borders
1.3. Display ASCII art "FLUXWING" logo (hero, footer, mobile variants)
1.4. Use monospace font (IBM Plex Mono) for ALL text
1.5. Apply classic terminal color palette (green/cyan on black)
1.6. Include section dividers using terminal-style separators

**Acceptance Criteria**:
- [ ] All major sections use consistent ASCII border styles
- [ ] Logo displays correctly across desktop/tablet/mobile
- [ ] Terminal color palette passes WCAG AA contrast requirements
- [ ] Monospace typography maintains readability at all viewport sizes

### FR2: Responsive Mobile-First Layout

**Priority**: P0 (Must Have)

The site MUST work seamlessly across all devices:

2.1. Implement mobile-first responsive breakpoints (xs <32rem, sm 32-48rem, md 48-64rem, lg ≥64rem)
2.2. Simplify ASCII borders on mobile (light borders vs heavy desktop borders)
2.3. Stack multi-column grids into single column on small screens
2.4. Implement hamburger menu for mobile navigation
2.5. Ensure all touch targets meet 44×44px minimum size
2.6. Prevent horizontal scrolling at all breakpoints

**Acceptance Criteria**:
- [ ] Site tested on iPhone, Android, iPad, desktop browsers
- [ ] No horizontal scroll on any viewport width
- [ ] All interactive elements have 44×44px touch targets
- [ ] ASCII art gracefully degrades on narrow screens

### FR3: Content Migration & Page Structure

**Priority**: P0 (Must Have)

The site MUST include these pages with migrated content:

3.1. Home page (`index.html`) with sections:
  - Hero with ASCII logo, tagline, installation command
  - Navigation bar (sticky, responsive)
  - ASCII Palette Demo (template/sample toggle)
  - Value Propositions Grid (6 cards, responsive)
  - Derivation Model visualization
  - How It Works workflow (5 steps)
  - Component Showcase Gallery (filterable)
  - Terminal Validator Demo
  - Installation instructions
  - Documentation links (4 categories)
  - Footer with branding

3.2. Why Fluxwing page (`why.html`)
3.3. Use Cases page (`use-cases.html`)
3.4. Reference documentation pages (reference/*.html)
3.5. 404 error page with ASCII "404" art

**Acceptance Criteria**:
- [ ] All pages accessible via navigation
- [ ] Content migrated from `docs_old/` without loss
- [ ] Internal links functional
- [ ] Breadcrumb navigation on reference pages

### FR4: Interactive Features

**Priority**: P1 (Should Have)

The site SHOULD include interactive elements:

4.1. Typewriter effect for hero tagline with blinking cursor
4.2. Copy-to-clipboard for installation commands
4.3. Component gallery filtering (All, Buttons, Inputs, Cards, Forms, Screens)
4.4. Modal overlay for component detail views
4.5. Mobile hamburger menu toggle
4.6. Smooth scroll for anchor links
4.7. Scroll reveal animations (fade-in on scroll)
4.8. ASCII Palette toggle (template view ↔ sample data view)

**Acceptance Criteria**:
- [ ] Typewriter animation runs on page load
- [ ] Copy button shows success feedback
- [ ] Gallery filters work without page reload
- [ ] Modal opens/closes with ESC key support
- [ ] Animations respect `prefers-reduced-motion`

### FR5: Optional CRT Effects

**Priority**: P2 (Nice to Have)

The site MAY include toggle-able CRT effects:

5.1. Subtle scanline overlay animation
5.2. Phosphor glow on interactive elements
5.3. Very subtle flicker animation
5.4. Screen curvature effect (optional)
5.5. User toggle to enable/disable effects
5.6. LocalStorage preference persistence

**Acceptance Criteria**:
- [ ] CRT effects toggle exists in UI
- [ ] Effects disabled when `prefers-reduced-motion` is set
- [ ] Preference saved across sessions

### FR6: Accessibility Compliance

**Priority**: P0 (Must Have)

The site MUST meet WCAG 2.1 AA standards:

6.1. All text meets 4.5:1 contrast ratio (large text 3:1)
6.2. Full keyboard navigation support
6.3. Focus indicators clearly visible
6.4. Screen reader support with semantic HTML
6.5. ARIA labels for ASCII art (decorative: `aria-hidden="true"`, meaningful: `role="img" aria-label="..."`)
6.6. Proper heading hierarchy (h1 → h2 → h3)
6.7. Skip links to main content
6.8. Text resizable to 200% without content loss

**Acceptance Criteria**:
- [ ] Lighthouse accessibility score 90+
- [ ] axe DevTools reports no violations
- [ ] Full keyboard navigation tested
- [ ] Screen reader (NVDA/JAWS) tested

### FR7: Performance Optimization

**Priority**: P1 (Should Have)

The site SHOULD meet performance targets:

7.1. First Contentful Paint (FCP) < 1.5s
7.2. Largest Contentful Paint (LCP) < 2.5s
7.3. Time to Interactive (TTI) < 3.5s
7.4. Total page size < 500KB (excluding analytics)
7.5. Lighthouse performance score 90+

**Acceptance Criteria**:
- [ ] Lighthouse performance 90+
- [ ] WebPageTest shows <2s load on 3G
- [ ] No heavy dependencies (vanilla JS, CSS only)

## Non-Functional Requirements

### NFR1: Browser Support

**Target browsers**:
- Chrome, Firefox, Safari, Edge (last 2 versions)
- iOS Safari 12+, Chrome Android 90+
- Graceful degradation for IE11 (basic layout, no effects)

### NFR2: Technology Stack

**Core technologies**:
- Vanilla HTML5 (semantic, accessible markup)
- CSS3 (custom properties, Grid, Flexbox)
- Vanilla JavaScript ES6+ (no frameworks)

**No build step required** for MVP. Optional later: CSS/JS minification.

### NFR3: SEO & Metadata

**Requirements**:
- Unique `<title>` and meta description per page
- Open Graph and Twitter Card tags
- Structured data (JSON-LD) on home page
- Sitemap.xml and robots.txt
- Canonical URLs

### NFR4: Deployment

**Platform**: GitHub Pages
**Domain**: Via CNAME file
**HTTPS**: Required (GitHub Pages default)
**Caching**: Follow GitHub Pages defaults

## Design Specifications

### Color Palette (Terminal Theme)

```css
--ascii-black: #000000;           /* Pure black */
--ascii-bg: #0a0e14;              /* Deep terminal black */
--ascii-bg-alt: #141c28;          /* Alternate panels */
--ascii-bg-card: #1a2332;         /* Card backgrounds */
--ascii-text: #33ff33;            /* Classic green terminal */
--ascii-text-bright: #66ff66;     /* Bright green highlights */
--ascii-cyan: #00ffff;            /* Cyan accents (primary) */
--ascii-amber: #ffaa00;           /* Amber highlights */
--ascii-red: #ff0033;             /* Error/alert red */
```

### ASCII Border Character Sets

**Heavy borders** (major sections, hero):
```
╔═══════════════════════════════════╗
║                                   ║
╚═══════════════════════════════════╝
```

**Light borders** (cards, components):
```
┌─────────────────────────────────┐
│                                 │
└─────────────────────────────────┘
```

**Double borders** (important content):
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Typography

- **Font**: IBM Plex Mono (ALL text, not just code)
- **Base size**: 16px desktop, 14px mobile
- **Line height**: 1.6 for readability

### Spacing

Character-based spacing:
- `--space-1ch: 1ch`
- `--space-2ch: 2ch`
- `--space-4ch: 4ch`

## Out of Scope

The following are explicitly OUT of scope for v1.0.0:

- Interactive component playground (Phase 2 feature)
- Dark/Light theme toggle (single terminal theme only)
- ASCII art generator tool
- Community showcase
- Blog/changelog section
- Video tutorials
- Progressive Web App features
- Downloadable component packs

## Dependencies

**External**:
- IBM Plex Mono web font (Google Fonts)
- GitHub Pages for hosting

**Internal**:
- Content from `docs_old/` (backup of previous site)
- `GITHUB_PAGES_REDESIGN_PLAN.md` (detailed design plan)
- `GITHUB_PAGES_TODO.md` (implementation checklist)

## Success Metrics

### Quantitative

- Traffic: 1000+ unique visitors/month
- Engagement: 3+ pages/session average
- Performance: Lighthouse score 90+
- Bounce Rate: < 60%
- Load Time: < 2s on 3G

### Qualitative

- Users immediately understand Fluxwing creates ASCII designs
- Positive feedback on aesthetic/experience
- Increased GitHub stars/issues
- Community adoption of uxscii standard

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| ASCII art doesn't align on some devices | High | Extensive cross-browser testing, fallback simplified borders |
| Heavy ASCII slows mobile load | Medium | Simplify borders on mobile, lazy load below-fold |
| Accessibility issues with ASCII | High | Proper ARIA labels, semantic HTML, thorough testing |
| Browser font rendering differences | Medium | Test in all target browsers, provide fallback fonts |

## Open Questions

- [ ] Should we include example videos or stick to ASCII demos?
- [ ] Do we need a blog section for announcements?
- [ ] Should community components be showcased on main site or separate page?
- [ ] What tool should generate ASCII logo variants while maintaining alignment?

## References

- `GITHUB_PAGES_REDESIGN_PLAN.md` - Comprehensive design plan (1448 lines)
- `GITHUB_PAGES_TODO.md` - Phase-based implementation checklist (619 lines)
- `docs_old/` - Previous site backup for content migration
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
