# Fluxwing Website Integration Plan

## Overview

This plan details how to integrate the comprehensive marketing copy from `marketing/WEBSITE_COPY.md` into the existing GitHub Pages site in the `docs/` folder at fluxwing.com.

**Current State**: Basic prototype with retro terminal aesthetic
**Goal State**: Full-featured marketing site with new messaging focus

---

## Current Site Structure

```
docs/
├── CNAME                          # fluxwing.com domain
├── index.html                     # Main landing page (prototype)
├── README.md                      # Development docs
├── css/
│   ├── base.css                   # Main styles (retro terminal theme)
│   └── docs.css                   # Documentation styles
├── js/
│   ├── main.js                    # Site functionality
│   └── gallery-data.js            # Component gallery data
├── assets/
│   └── trabian.svg                # Trabian logo
├── reference/                     # Documentation pages
│   ├── getting-started.html
│   ├── commands.html
│   ├── agents.html
│   └── architecture.html
└── examples/                      # Component examples
    ├── components/                # .uxm + .md files
    └── screens/                   # Screen examples
```

---

## Integration Strategy

### Phase 1: Content Mapping & Structure
Map marketing copy sections to HTML pages

### Phase 2: Update index.html
Enhance homepage with new messaging

### Phase 3: Create New Pages
Add missing content pages

### Phase 4: Update Documentation
Refresh reference pages with new messaging

### Phase 5: Polish & Launch
Final refinements and testing

---

## Detailed Content Mapping

### Homepage (index.html) Updates

#### Current Hero Section
```html
<h1>Fluxwing / ASCII UX Agent</h1>
<p>The agent speaks uxscii so you can sketch interface mocks in minutes...</p>
```

**Replace with:**
```html
<h1>Design Systems That Humans AND AI Agents Understand Natively</h1>
<p>ASCII-based design language that enables instant visual feedback from humans
and perfect comprehension by AI agents. Build component libraries that evolve
through derivation, not duplication.</p>
```

#### Current Value Grid (4 cards)
**Expand to 5 cards** with new focus:
1. **Universal Interface** (new)
   - Humans parse ASCII instantly
   - AI agents understand perfectly
   - One format for both audiences

2. **Derivation Model** (new)
   - Extend components like classes
   - Inherit properties
   - No copy-paste duplication

3. **Component Evolution** (new)
   - Build through references
   - Compose screens from parts
   - Libraries grow organically

4. **Living Documentation** (updated from "Validate in JSON")
   - Design specs humans review
   - AI can execute
   - Always in sync

5. **AI-Native Design** (merged from existing)
   - Fast feedback loops
   - Rapid iteration
   - Version control friendly

#### Add New Section: "The Derivation Model"
Insert after value grid, before "How It Works":

```html
<section class="derivation-model ascii-stop">
  <h2>Derivation, Not Duplication</h2>
  <p>Traditional design tools duplicate. Fluxwing derives. Like OOP for design.</p>
  <div class="derivation-diagram">
    <pre aria-label="Component derivation tree">
button.uxm (base)
  ├→ primary-button.uxm (extends button)
  │   └→ submit-button.uxm (uses primary)
  ├→ secondary-button.uxm (extends button)
  └→ disabled-button.uxm (extends button)

email-input.uxm + password-input.uxm
                    ↓
            login-form.uxm (composes inputs + submit-button)
                    ↓
            login-screen.uxm (composes form + branding)
    </pre>
  </div>
  <p><strong>Change the base → All derivations inherit the change</strong></p>
</section>
```

#### Update "How It Works" Section
Current: 4-step loop (Design, Review, Validate, Implement)

**Enhance to 5 steps** with derivation workflow:

1. **Create Base Component**
   ```bash
   /fluxwing-create button
   ```
   Creates button.uxm with ASCII template

2. **Derive Variations**
   ```bash
   /fluxwing-create primary-button --extends button
   /fluxwing-create disabled-button --extends button
   ```
   Inherit properties, override specifics

3. **Compose Components**
   ```bash
   /fluxwing-create login-form --components email-input,password-input,submit-button
   ```
   Build forms from parts

4. **Build Screens**
   ```bash
   /fluxwing-scaffold login-screen
   ```
   AI reads library, generates complete screens

5. **Let AI Generate**
   Your .uxm files become specs AI executes

#### Update Footer Tagline
Current: "ASCII-first design, powered by AI"

**Replace with:**
"Design systems that humans AND AI agents understand natively. Built on the uxscii standard."

---

## New Pages to Create

### 1. Use Cases Page (`/use-cases.html`)

**URL**: `https://fluxwing.com/use-cases.html`

**Content** (from WEBSITE_COPY.md):
- **Hero**: "Built for Modern AI-Assisted Development"
- **4 Use Cases**:
  1. AI Agent UIs
  2. Rapid Prototyping
  3. Design Systems at Scale
  4. Living Documentation
- **CTA**: Link to installation

**Template Structure**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Use Cases - Fluxwing</title>
  <meta name="description" content="How teams use Fluxwing for AI agent UIs, rapid prototyping, design systems, and living documentation">
</head>
<body class="crt-bg">
  <header class="page-header">
    <nav><!-- Site nav --></nav>
  </header>
  <main>
    <section class="page-hero">
      <h1>Built for Modern AI-Assisted Development</h1>
    </section>
    <section class="use-case-grid">
      <!-- 4 use case cards -->
    </section>
    <section class="cta">
      <a href="#install" class="btn btn--primary">Get Started</a>
    </section>
  </main>
  <footer><!-- Site footer --></footer>
</body>
</html>
```

---

### 2. Why Fluxwing Page (`/why.html`)

**URL**: `https://fluxwing.com/why.html`

**Content**:
- **The Problem**: Traditional design tools weren't built for AI age (3 columns)
- **The Solution**: ASCII as universal interface (2 columns: humans + AI)
- **Why Teams Choose**: 4 testimonial-style benefits
- **Comparison Table**: Fluxwing vs Figma vs Sketch

**Key Sections**:
```html
<section class="problem-solution">
  <h2>Traditional Design Tools Weren't Built for the AI Age</h2>
  <div class="three-col-grid">
    <div>For Humans Only</div>
    <div>Duplication Nightmare</div>
    <div>Not Version Control Friendly</div>
  </div>
</section>

<section class="solution">
  <h2>ASCII: The Universal Interface</h2>
  <div class="two-col-split">
    <div class="for-humans">
      <h3>For Humans</h3>
      <pre>╭──────────────────╮
│   Submit Form    │
╰──────────────────╯</pre>
      <ul>
        <li>Instant visual parsing</li>
        <li>Natural feedback loops</li>
      </ul>
    </div>
    <div class="for-ai">
      <h3>For AI Agents</h3>
      <pre>{"id": "submit-button"...}</pre>
      <ul>
        <li>Perfect comprehension</li>
        <li>Generate implementations directly</li>
      </ul>
    </div>
  </div>
</section>

<section class="comparison">
  <table class="comparison-table">
    <!-- Fluxwing vs Figma vs Sketch -->
  </table>
</section>
```

---

### 3. Features Page (`/features.html`)

**URL**: `https://fluxwing.com/features.html`

**Content** (3x3 grid from WEBSITE_COPY.md):
1. Derivation Model
2. Component Composition
3. Human-Readable ASCII
4. AI-Readable Specs
5. Progressive Fidelity
6. JSON Schema Validation
7. Version Control Native
8. Living Documentation
9. Component Library

**Structure**:
```html
<section class="features-hero">
  <h1>Everything You Need to Build Design Systems</h1>
</section>

<section class="features-grid">
  <article class="feature-card">
    <h3>1. Derivation Model</h3>
    <p>Extend components like classes...</p>
  </article>
  <!-- 8 more feature cards -->
</section>
```

---

### 4. FAQ Page (`/faq.html`)

**URL**: `https://fluxwing.com/faq.html`

**Content** (8 questions from WEBSITE_COPY.md):
- Why ASCII instead of visual tools?
- Can I use this for production designs?
- What's the derivation model?
- How do AI agents use this?
- Is this version control friendly?
- What's included in the plugin?
- Can I extend existing components?
- What's uxscii?

**Structure**:
```html
<section class="faq">
  <h1>Frequently Asked Questions</h1>
  <dl class="faq-list">
    <dt>Why ASCII instead of visual tools?</dt>
    <dd>ASCII is the universal interface...</dd>
    <!-- 7 more Q&A pairs -->
  </dl>
</section>
```

---

## Documentation Updates

### Update `reference/getting-started.html`

**Add sections**:
1. **Quick Start** (30-second installation)
2. **Your First Component** (create button)
3. **Derive Variations** (extends button)
4. **Compose Screens** (login-form example)
5. **Next Steps** (links to commands, agents, architecture)

**New messaging**:
- Emphasize derivation workflow
- Show `--extends` flag examples
- Highlight AI agent comprehension

---

### Update `reference/commands.html`

**Add to each command**:
- **Examples with derivation**:
  ```bash
  /fluxwing-create button
  /fluxwing-create primary-button --extends button
  /fluxwing-create submit-button --extends primary-button
  ```

- **Use cases**:
  - Create: "Start new base components or derive from existing"
  - Scaffold: "Compose complete screens from component library"
  - Library: "Browse base components and derivations"
  - Validate: "Ensure consistency across component graph"

---

### Update `reference/agents.html`

**Add focus on**:
- How agents understand .uxm specs natively
- Derivation-aware agent behavior
- Component composition capabilities
- Living documentation generation

**Key points**:
- "Agents read component libraries and understand inheritance"
- "Generate implementations from ASCII + JSON specs"
- "Respect derivation relationships when composing"

---

### Update `reference/architecture.html`

**Add new sections**:
1. **The Derivation Model**
   - How `extends` works
   - Property inheritance
   - Override behavior
   - Component graph structure

2. **Component Composition**
   - References by ID
   - Hierarchical composition
   - Dependency resolution

3. **AI Agent Integration**
   - How agents parse .uxm files
   - Native comprehension without vision models
   - Implementation generation workflow

---

## Site Navigation Structure

### Add Global Navigation

**Current**: No persistent nav (relies on anchor links)

**Proposed**: Add sticky header with navigation

```html
<header class="site-header">
  <div class="site-header__container">
    <a href="/" class="site-logo">Fluxwing</a>
    <nav class="site-nav" aria-label="Main">
      <ul>
        <li><a href="/why.html">Why Fluxwing</a></li>
        <li><a href="/features.html">Features</a></li>
        <li><a href="/use-cases.html">Use Cases</a></li>
        <li><a href="#install">Install</a></li>
        <li><a href="/reference/getting-started.html">Docs</a></li>
        <li><a href="/faq.html">FAQ</a></li>
        <li><a href="https://github.com/trabian/fluxwing-plugin" class="external">GitHub</a></li>
      </ul>
    </nav>
    <button class="mobile-menu-toggle" aria-label="Toggle menu">☰</button>
  </div>
</header>
```

---

## Footer Updates

### Expand Footer Navigation

**Current**: Minimal footer with 4 links

**Proposed**: Multi-column footer

```html
<footer class="site-footer">
  <div class="site-footer__grid">
    <div class="footer-col">
      <h3>Product</h3>
      <ul>
        <li><a href="/why.html">Why Fluxwing</a></li>
        <li><a href="/features.html">Features</a></li>
        <li><a href="/use-cases.html">Use Cases</a></li>
        <li><a href="/faq.html">FAQ</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>Documentation</h3>
      <ul>
        <li><a href="/reference/getting-started.html">Getting Started</a></li>
        <li><a href="/reference/commands.html">Commands</a></li>
        <li><a href="/reference/agents.html">Agents</a></li>
        <li><a href="/reference/architecture.html">Architecture</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>Community</h3>
      <ul>
        <li><a href="https://github.com/trabian/fluxwing-plugin">GitHub</a></li>
        <li><a href="https://github.com/trabian/fluxwing-plugin/issues">Issues</a></li>
        <li><a href="https://github.com/trabian/fluxwing-plugin/discussions">Discussions</a></li>
        <li><a href="https://github.com/trabian/fluxwing-plugin/blob/main/CONTRIBUTING.md">Contributing</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>Company</h3>
      <ul>
        <li><a href="https://www.trabian.com">Trabian</a></li>
        <li><a href="https://twitter.com/trabian">Twitter</a></li>
        <li><a href="/faq.html#license">License (MIT)</a></li>
      </ul>
    </div>
  </div>
  <div class="site-footer__bottom">
    <p>Fluxwing: Design systems that humans AND AI agents understand natively.</p>
    <p class="site-footer__legal">© <span data-year></span> Fluxwing. Built on the uxscii standard. A product by <a href="https://www.trabian.com">Trabian</a>.</p>
  </div>
</footer>
```

---

## CSS Enhancements Needed

### New Component Styles

**Add to `css/base.css`**:

```css
/* Derivation Diagram */
.derivation-model {
  padding: 4rem 2rem;
  background: var(--bg-secondary);
}

.derivation-diagram pre {
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  padding: 2rem;
  background: var(--terminal-bg);
  border: 2px solid var(--accent-color);
  border-radius: 4px;
  overflow-x: auto;
}

/* Two-Column Split (For Humans / For AI) */
.two-col-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin: 3rem 0;
}

@media (max-width: 768px) {
  .two-col-split {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

/* Feature Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 3rem 0;
}

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  padding: 2rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

/* Comparison Table */
.comparison-table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
}

.comparison-table th,
.comparison-table td {
  padding: 1rem;
  text-align: left;
  border: 1px solid var(--border-color);
}

.comparison-table th {
  background: var(--accent-color);
  font-weight: bold;
}

/* FAQ Styling */
.faq-list dt {
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 2rem;
  color: var(--accent-color);
}

.faq-list dd {
  margin: 1rem 0 2rem 0;
  line-height: 1.6;
}

/* Site Header Navigation */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-primary);
  border-bottom: 2px solid var(--accent-color);
  padding: 1rem 0;
}

.site-header__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.site-nav ul {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.site-nav a {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.site-nav a:hover {
  color: var(--accent-color);
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-primary);
  cursor: pointer;
}

@media (max-width: 768px) {
  .site-nav {
    display: none;
  }

  .mobile-menu-toggle {
    display: block;
  }

  .site-nav.is-open {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-primary);
    border-top: 1px solid var(--border-color);
  }

  .site-nav ul {
    flex-direction: column;
    padding: 1rem;
  }
}
```

---

## SEO & Meta Enhancements

### Add to Every Page `<head>`

```html
<!-- Primary Meta Tags -->
<title>[Page Title] - Fluxwing</title>
<meta name="title" content="[Page Title] - Fluxwing">
<meta name="description" content="[Page-specific description]">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://fluxwing.com/[page]">
<meta property="og:title" content="[Page Title] - Fluxwing">
<meta property="og:description" content="[Page-specific description]">
<meta property="og:image" content="https://fluxwing.com/assets/social-preview.png">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://fluxwing.com/[page]">
<meta property="twitter:title" content="[Page Title] - Fluxwing">
<meta property="twitter:description" content="[Page-specific description]">
<meta property="twitter:image" content="https://fluxwing.com/assets/social-preview.png">

<!-- Canonical URL -->
<link rel="canonical" href="https://fluxwing.com/[page]">
```

### Page-Specific Meta Descriptions

From `marketing/WEBSITE_COPY.md`:

**Homepage**:
"Fluxwing: ASCII-based design system that humans and AI agents understand natively. Build component libraries through derivation. Living documentation for modern AI-assisted development."

**Installation** (`/reference/getting-started.html`):
"Install Fluxwing Claude Code plugin in 30 seconds. Get 11 component templates, 4 slash commands, 3 AI agents. Start building design systems AI agents can read."

**Documentation**:
"Complete Fluxwing documentation: derivation model, component composition, uxscii standard, AI agent integration. Learn to build design systems both humans and AI understand."

**Use Cases** (`/use-cases.html`):
"How teams use Fluxwing for AI agent UIs, rapid prototyping, design systems at scale, and living documentation. ASCII-based design for modern development."

**Why Fluxwing** (`/why.html`):
"Why ASCII is the universal interface. Learn how Fluxwing enables design systems that both humans and AI agents understand natively through derivation, not duplication."

**Features** (`/features.html`):
"Fluxwing features: derivation model, component composition, human-readable ASCII, AI-readable specs, progressive fidelity, JSON Schema validation, version control native."

---

## Asset Creation Needed

### Images to Create

1. **Social Preview Image** (`assets/social-preview.png`)
   - Size: 1200x630px
   - Content: Fluxwing logo + tagline + ASCII component example
   - Use for Open Graph and Twitter cards

2. **Derivation Tree Diagram** (`assets/derivation-tree.svg`)
   - Visual version of ASCII derivation tree
   - Use on Why page and Features page

3. **Human + AI Split Diagram** (`assets/universal-interface.svg`)
   - Visual showing ASCII working for both audiences
   - Use on homepage and Why page

4. **Workflow Diagram** (`assets/workflow.svg`)
   - 5-step workflow visualization
   - Use on homepage How It Works section

5. **Component Screenshots** (`assets/screenshots/`)
   - Terminal showing `/fluxwing-create button`
   - Component library browser
   - Validation output
   - Rendered screens

### Favicon Updates

**Add multiple sizes**:
```html
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
```

---

## Implementation Phases

### Phase 1: Homepage Updates (Priority 1)
**Timeline**: 1-2 days

**Tasks**:
1. Update hero section with new headline and subheadline
2. Expand value grid to 5 cards with new messaging
3. Add "Derivation Model" section with ASCII tree
4. Update "How It Works" to 5-step workflow
5. Update footer tagline
6. Test responsive behavior

**Files to modify**:
- `docs/index.html`
- `docs/css/base.css` (add new component styles)

---

### Phase 2: New Pages (Priority 1)
**Timeline**: 2-3 days

**Tasks**:
1. Create `/why.html` (Problem, Solution, Comparison)
2. Create `/features.html` (9-feature grid)
3. Create `/use-cases.html` (4 use cases)
4. Create `/faq.html` (8 Q&A pairs)
5. Add global navigation header
6. Expand footer navigation
7. Test all internal links

**Files to create**:
- `docs/why.html`
- `docs/features.html`
- `docs/use-cases.html`
- `docs/faq.html`

**Files to modify**:
- `docs/index.html` (add header nav)
- `docs/css/base.css` (nav styles, page templates)

---

### Phase 3: Documentation Updates (Priority 2)
**Timeline**: 2 days

**Tasks**:
1. Update `getting-started.html` with derivation workflow
2. Update `commands.html` with `--extends` examples
3. Update `agents.html` with AI comprehension focus
4. Update `architecture.html` with derivation model section
5. Ensure consistent messaging across all docs

**Files to modify**:
- `docs/reference/getting-started.html`
- `docs/reference/commands.html`
- `docs/reference/agents.html`
- `docs/reference/architecture.html`

---

### Phase 4: Assets & SEO (Priority 2)
**Timeline**: 1-2 days

**Tasks**:
1. Create social preview image (1200x630px)
2. Create visual diagrams (SVG format)
3. Take screenshots of key workflows
4. Add meta tags to all pages
5. Create favicons in multiple sizes
6. Set up structured data (JSON-LD)

**Files to create**:
- `docs/assets/social-preview.png`
- `docs/assets/derivation-tree.svg`
- `docs/assets/universal-interface.svg`
- `docs/assets/workflow.svg`
- `docs/assets/screenshots/*.png`
- `docs/assets/favicon-*.png`

**Files to modify**:
- All HTML files (add meta tags)

---

### Phase 5: Testing & Polish (Priority 3)
**Timeline**: 1 day

**Tasks**:
1. Run Lighthouse audits (aim for 90+ on all metrics)
2. Test with screen readers (VoiceOver, NVDA)
3. Test on multiple browsers (Chrome, Firefox, Safari, Edge)
4. Test responsive breakpoints (mobile, tablet, desktop)
5. Validate all links (internal and external)
6. Check HTTPS enforcement
7. Verify CNAME and DNS settings
8. Test analytics (PostHog) integration

**Verification checklist** (from docs/README.md):
- [ ] Lighthouse scores ≥ 90
- [ ] Screen reader accessibility passes
- [ ] All documentation links resolve
- [ ] Open Graph/Twitter cards render correctly
- [ ] CNAME, DNS, HTTPS confirmed
- [ ] Manual tests on all browsers

---

## File Structure After Integration

```
docs/
├── CNAME
├── index.html                     # ✅ Updated homepage
├── why.html                       # ✨ NEW: Problem/Solution/Comparison
├── features.html                  # ✨ NEW: 9-feature grid
├── use-cases.html                 # ✨ NEW: 4 use cases
├── faq.html                       # ✨ NEW: 8 Q&A pairs
├── README.md
├── WEBSITE_INTEGRATION_PLAN.md    # 📋 This document
├── css/
│   ├── base.css                   # ✅ Updated with new components
│   └── docs.css
├── js/
│   ├── main.js                    # ✅ Updated with nav toggle
│   └── gallery-data.js
├── assets/
│   ├── trabian.svg
│   ├── social-preview.png         # ✨ NEW
│   ├── derivation-tree.svg        # ✨ NEW
│   ├── universal-interface.svg    # ✨ NEW
│   ├── workflow.svg               # ✨ NEW
│   ├── favicon-32x32.png          # ✨ NEW
│   ├── favicon-16x16.png          # ✨ NEW
│   ├── apple-touch-icon.png       # ✨ NEW
│   └── screenshots/               # ✨ NEW
│       ├── create-button.png
│       ├── library.png
│       └── validation.png
├── reference/
│   ├── getting-started.html       # ✅ Updated with derivation
│   ├── commands.html              # ✅ Updated with --extends
│   ├── agents.html                # ✅ Updated with AI focus
│   └── architecture.html          # ✅ Updated with derivation model
└── examples/
    ├── components/
    └── screens/
```

---

## Key Messaging Reminders

**Ensure every page emphasizes**:

1. **ASCII as Universal Interface**
   - "Humans see it instantly. AI reads it perfectly."
   - One format for both audiences

2. **Derivation, Not Duplication**
   - "Like OOP but for design"
   - Change base once, all variations inherit

3. **Component Evolution**
   - Build through references
   - Libraries grow organically
   - Compose screens from parts

4. **Living Documentation**
   - Specs humans review
   - AI can execute
   - Always in sync

5. **AI-Native Design**
   - Perfect comprehension by agents
   - No vision models needed
   - Generate implementations directly

---

## Content Reuse Strategy

### Create Shared Components

**Create**: `docs/_includes/` directory with reusable HTML snippets

**Snippets to create**:

1. **`_includes/header.html`** - Global navigation
2. **`_includes/footer.html`** - Site footer
3. **`_includes/cta-install.html`** - Installation CTA block
4. **`_includes/derivation-tree.html`** - ASCII derivation tree
5. **`_includes/meta-tags.html`** - SEO meta tags template

**Usage**: Include via JavaScript or server-side includes

**Alternative**: Use a static site generator (Jekyll, 11ty, Astro) for easier component reuse

---

## Testing Checklist

### Before Launch

**Content**:
- [ ] All copy reflects new messaging (ASCII, derivation, AI agents)
- [ ] No mentions of old positioning ("rapid prototyping only")
- [ ] Consistent tone and voice across all pages
- [ ] All code examples use `--extends` where appropriate
- [ ] No broken internal links
- [ ] No broken external links (GitHub, Trabian, etc.)

**Visual**:
- [ ] All diagrams render correctly
- [ ] Screenshots are high quality and up-to-date
- [ ] Social preview image displays correctly
- [ ] Favicon displays in all browsers
- [ ] Retro terminal aesthetic maintained

**Functional**:
- [ ] Navigation works on mobile
- [ ] Copy buttons work for code snippets
- [ ] Anchor links scroll smoothly
- [ ] Gallery toggles work (ASCII/metadata)
- [ ] PostHog analytics tracking verified

**Accessibility**:
- [ ] Screen reader navigation works
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present and correct
- [ ] Color contrast ratios meet WCAG AA
- [ ] Reduced motion preference respected

**Performance**:
- [ ] Lighthouse Performance ≥ 90
- [ ] Images optimized (WebP with PNG fallback)
- [ ] CSS minified
- [ ] JavaScript deferred or async
- [ ] No layout shifts (CLS < 0.1)

**SEO**:
- [ ] Meta descriptions on all pages
- [ ] Open Graph tags on all pages
- [ ] Twitter cards on all pages
- [ ] Canonical URLs set
- [ ] Sitemap.xml exists
- [ ] robots.txt configured

---

## Rollout Strategy

### Soft Launch
1. Deploy to GitHub Pages
2. Share with Trabian team for feedback
3. Test with small group of Claude Code users
4. Gather feedback, iterate

### Public Launch
1. Announce on all platforms (Product Hunt, HN, LinkedIn, Twitter)
2. Link to new website in all posts
3. Update GitHub README to link to fluxwing.com
4. Monitor analytics and user feedback
5. Iterate based on real usage

---

## Maintenance Plan

### Weekly
- Check for broken links
- Monitor analytics
- Review feedback/issues
- Update component examples if needed

### Monthly
- Update screenshots if CLI changes
- Refresh copy based on user feedback
- Add new use case examples
- Review and respond to common questions

### Quarterly
- Major content refresh if positioning evolves
- Add new features/pages as plugin grows
- Performance audit and optimization
- Accessibility audit

---

## Success Metrics

### Content Goals
- Average time on site > 2 minutes
- Bounce rate < 60%
- Pages per session > 2.5
- Documentation page views > 30% of traffic

### Conversion Goals
- Plugin installations from website clicks > 20%
- GitHub stars from website traffic > 10%
- Newsletter signups > 5%
- Community engagement (Discussions) > 15 posts/month

### SEO Goals
- Organic search traffic > 40% of total
- Ranking for "ASCII design system" (top 5)
- Ranking for "AI native UX" (top 10)
- Ranking for "uxscii standard" (#1)

---

## Next Steps

### Immediate Actions
1. Review this plan with team
2. Prioritize phases based on launch timeline
3. Assign tasks to team members
4. Create asset creation tickets (images, diagrams)
5. Set up staging environment for preview

### Phase 1 Kickoff (Homepage Updates)
1. Create feature branch `feature/website-content-update`
2. Update `index.html` with new hero and sections
3. Add CSS for new components
4. Test locally with `npm run ghpages:serve`
5. Create PR for review

### Tools Needed
- Image editor (Figma, Sketch, or Photoshop) for social images
- SVG editor for diagrams
- Screenshot tool (Cleanshot, Monosnap)
- Code editor with live preview
- Browser dev tools for testing

---

## Questions & Decisions Needed

### Content Questions
- [ ] Should we add a blog section for tutorials and updates?
- [ ] Do we need a separate "Pricing" page (even though it's free)?
- [ ] Should we add video tutorials embedded on the site?
- [ ] Do we want user testimonials (once we have them)?

### Technical Questions
- [ ] Should we use a static site generator instead of plain HTML?
- [ ] Do we want to add search functionality (Algolia, Lunr.js)?
- [ ] Should we implement dark/light theme toggle?
- [ ] Do we need a newsletter signup form?

### Design Questions
- [ ] Keep retro terminal aesthetic or modernize slightly?
- [ ] Add more illustrations/diagrams or keep ASCII-focused?
- [ ] Include component demos (interactive) or just screenshots?
- [ ] Add video demos or stick with text/images?

---

## Resources

### Reference Materials
- `marketing/WEBSITE_COPY.md` - Source content
- `marketing/REBRANDING_SUMMARY.md` - Messaging strategy
- `marketing/QUICK_REFERENCE.md` - Quick responses and templates
- Current `docs/index.html` - Existing site structure

### External Resources
- [GitHub Pages docs](https://docs.github.com/en/pages)
- [Open Graph protocol](https://ogp.me/)
- [Twitter Card validator](https://cards-dev.twitter.com/validator)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [WebAIM contrast checker](https://webaim.org/resources/contrastchecker/)

---

## Summary

This plan transforms the existing GitHub Pages prototype into a full-featured marketing site with:

✅ **New messaging** focused on ASCII as universal interface, derivation model, and AI agent comprehension
✅ **4 new pages** (Why, Features, Use Cases, FAQ) with comprehensive content
✅ **Updated homepage** with new hero, derivation section, and 5-step workflow
✅ **Refreshed documentation** emphasizing derivation and AI integration
✅ **Global navigation** and expanded footer for better discoverability
✅ **SEO optimization** with meta tags, structured data, and social cards
✅ **Accessibility focus** maintaining WCAG AA standards
✅ **Asset creation** plan for images, diagrams, and screenshots

**Total effort estimate**: 7-10 days for full implementation

**Launch readiness**: Site will be production-ready with all content from WEBSITE_COPY.md properly integrated

Ready to start Phase 1? 🚀
