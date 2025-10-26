# Technical Research: ASCII-First Website with Retro Terminal Aesthetics

**Project**: GitHub Pages Static Site for Fluxwing Skills
**Date**: 2025-10-25
**Stack**: Vanilla HTML/CSS/JS (No frameworks)
**Requirements**: Mobile-first, WCAG 2.1 AA, Lighthouse 90+

---

## 1. ASCII Art Tooling Research

### Decision
Use **FIGlet** with custom scripts for logo generation and manual alignment corrections.

### Rationale
- **Industry Standard**: FIGlet has been the de facto ASCII art generator since 1991, widely used for terminal banners and documentation
- **Built-in Alignment**: Native support for `-c` (center), `-l` (left), `-r` (right) alignment options
- **Width Control**: `-w` flag enables precise character width constraints (critical for responsive variants)
- **Font Variety**: Extensive font collection allows stylistic consistency across logo variants
- **Scriptable**: Command-line interface enables batch generation and CI/CD integration

### Recommended Workflow

#### Logo Generation Strategy
1. **Hero Logo (64ch)**: `figlet -f standard -w 64 -c "FLUXWING"`
2. **Footer Logo (24ch)**: `figlet -f small -w 24 -c "FLUXWING"`
3. **Mobile Logo (20ch)**: `figlet -f mini -w 20 -c "FLUXWING"`

#### Alignment Corrections
- **Post-processing script**: Strip trailing whitespace, ensure consistent padding
- **Version control**: Store generated `.txt` files in `docs/assets/` for manual refinement
- **Consistency check**: Use monospace character counting to validate width across variants

### Alternatives Considered
- **Manual ASCII Editors** (ASCIIFlow, TextArt.io): Flexible but time-consuming, hard to maintain consistency across variants
- **Custom JavaScript Generators**: Reinventing the wheel, adds complexity without significant benefit
- **Image-to-ASCII Tools**: Not suitable for text-based logos, produces inconsistent results

### Code Example

```bash
#!/bin/bash
# generate-logos.sh - Generate responsive ASCII logo variants

LOGO_TEXT="FLUXWING"

# Hero variant (64 characters wide)
figlet -f standard -w 64 -c "$LOGO_TEXT" > docs/assets/fluxwing-hero.txt

# Footer variant (24 characters wide)
figlet -f small -w 24 -c "$LOGO_TEXT" > docs/assets/fluxwing-footer.txt

# Mobile variant (20 characters wide)
figlet -f mini -w 20 -c "$LOGO_TEXT" > docs/assets/fluxwing-mobile.txt

# Post-process: remove trailing whitespace
sed -i '' 's/[[:space:]]*$//' docs/assets/fluxwing-*.txt

echo "Logo variants generated in docs/assets/"
```

### References
- [FIGlet Official Documentation](https://github.com/cmatsuoka/figlet)
- [ASCII Text Generator (Online FIGlet)](https://ascii.mastervb.net/)
- [LabEx: How to Create Stunning ASCII Art with Figlet](https://labex.io/tutorials/linux-how-to-create-stunning-ascii-art-with-figlet-419332)

---

## 2. CSS Design System Patterns

### Decision
Use **CSS Custom Properties** organized by category with **kebab-case naming** and a structured token hierarchy.

### Rationale
- **No Build Step**: Native browser support (98%+ global coverage in 2024), no preprocessor required
- **Runtime Theming**: Enable dynamic theme switching (light/dark, CRT effects) via class toggling
- **Cascade-Aware**: Properties respect CSS specificity, enabling easy overrides in media queries
- **Readable Syntax**: `var(--color-accent-primary)` is self-documenting compared to Sass variables
- **2024 Best Practice**: Industry consensus per Smashing Magazine, CSS-Tricks, and major design systems

### Token Naming Convention

**Structure**: `--{category}-{property}-{variant}-{state}`

**Example Hierarchy**:
```
--color-text-primary          (default body text)
--color-text-secondary        (muted text)
--color-accent-primary        (brand accent)
--color-accent-primary-hover  (interactive state)
--spacing-unit                (base 8px)
--spacing-sm                  (0.5rem = 8px)
--spacing-md                  (1rem = 16px)
--typography-body             (font-size)
--typography-heading-lg       (large heading)
```

### Organizational Strategy

**File Structure**:
```
docs/css/
├── ascii-core.css       (design tokens only)
├── components.css       (component styles)
└── responsive.css       (media query overrides)
```

**Token Categories**:
1. **Colors**: `--color-{role}-{modifier}-{state}`
2. **Spacing**: `--spacing-{size}` (xs, sm, md, lg, xl)
3. **Typography**: `--typography-{element}-{variant}`
4. **Layout**: `--layout-{property}` (max-width, gutter)
5. **Effects**: `--effect-{name}` (scanline, glow, shadow)

### Code Example

```css
/* docs/css/ascii-core.css - Design Tokens */
:root {
  /* Colors - Terminal Palette */
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #1a1a1a;
  --color-text-primary: #00ff00;      /* phosphor green */
  --color-text-secondary: #00cc00;
  --color-accent-primary: #00ffff;     /* cyan */
  --color-accent-primary-hover: #00cccc;
  --color-border: #00ff00;

  /* Spacing - 8px base unit */
  --spacing-unit: 0.5rem;
  --spacing-xs: calc(var(--spacing-unit) * 0.5);  /* 4px */
  --spacing-sm: var(--spacing-unit);              /* 8px */
  --spacing-md: calc(var(--spacing-unit) * 2);    /* 16px */
  --spacing-lg: calc(var(--spacing-unit) * 4);    /* 32px */
  --spacing-xl: calc(var(--spacing-unit) * 8);    /* 64px */

  /* Typography - Fluid Scaling */
  --typography-body: clamp(0.875rem, 0.8rem + 0.3vw, 1rem);
  --typography-heading-sm: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
  --typography-heading-md: clamp(1.25rem, 1rem + 1vw, 1.75rem);
  --typography-heading-lg: clamp(1.75rem, 1.25rem + 2vw, 2.5rem);

  /* Layout */
  --layout-max-width: 80rem;
  --layout-gutter: var(--spacing-md);

  /* Effects */
  --effect-glow: 0 0 8px currentColor;
  --effect-scanline-opacity: 0.1;
  --effect-border-width: 2px;
}

/* Light theme override (optional) */
[data-theme="light"] {
  --color-bg-primary: #f5f5f5;
  --color-text-primary: #1a1a1a;
  --color-accent-primary: #0066cc;
}
```

### Maintenance Best Practices
1. **Single Source of Truth**: All tokens in `ascii-core.css`, imported first
2. **Semantic Naming**: Avoid visual names (`--green`) in favor of role-based (`--color-success`)
3. **Calc() for Relationships**: Derive spacing scales from base unit
4. **Documentation**: Inline comments explaining token purpose
5. **Validation**: Use CSS linter (Stylelint) to enforce token usage over hardcoded values

### Alternatives Considered
- **Sass/Less Variables**: Requires build step, no runtime theming
- **Tailwind CSS**: Framework dependency conflicts with "vanilla" requirement
- **Inline Styles**: No reusability, maintenance nightmare
- **BEM Naming Only**: Doesn't solve token management, orthogonal concern

### References
- [Smashing Magazine: Best Practices For Naming Design Tokens](https://www.smashingmagazine.com/2024/05/naming-best-practices/)
- [Nord Design System: Naming Convention](https://nordhealth.design/naming/)
- [Medium: Design Tokens Naming Structure](https://medium.com/@brcsndr/you-dont-know-css-design-tokens-naming-structure-52add5d02682)
- [CSS-Tricks: CSS Custom Properties Guide](https://css-tricks.com/a-complete-guide-to-custom-properties/)

---

## 3. Accessibility Patterns for ASCII Art

### Decision
Use **`aria-hidden="true"`** for decorative ASCII, **`role="img"` + `aria-label`** for meaningful ASCII, and provide **skip links** for large ASCII blocks.

### Rationale
- **WCAG Compliance**: W3C Technique H86 specifically addresses ASCII art accessibility
- **Screen Reader Experience**: ASCII art is "very confusing to people who are blind using screen readers" (W3C)
- **Semantic HTML First**: Follows ARIA First Rule: "Don't use ARIA" unless HTML semantics are insufficient
- **User Control**: Skip links allow users to bypass decorative content without missing context

### Implementation Patterns

#### Pattern 1: Decorative ASCII (Logo, Borders)
```html
<!-- Hero logo - purely decorative -->
<pre aria-hidden="true" class="ascii-logo">
  _____ _    _   ___  ____      _____ _   _  ____
 |  ___| |  | | | \/ \/ / \    / /_ _| \ | |/ ___|
 | |_  | |  | | | |\/| |\ \  / / | ||  \| | |  _
 |  _| | |__| | | |  | | \ \/ /  | || |\  | |_| |
 |_|   |_____|_|_|  |_|  \__/  |___|_| \_|\____|
</pre>
```

**Rationale**: Screen readers skip entirely, sighted users see branding. Logo meaning conveyed via adjacent `<h1>` text.

#### Pattern 2: Meaningful ASCII (Diagrams, Charts)
```html
<!-- System architecture diagram -->
<figure role="img" aria-label="Fluxwing architecture: Users interact with Claude Code, which loads Skills, which execute Agents to create Components">
  <pre>
┌──────────┐      ┌──────────┐      ┌──────────┐
│  User    │─────>│  Claude  │─────>│  Skills  │
│  Input   │      │  Code    │      │  System  │
└──────────┘      └──────────┘      └──────────┘
                                          │
                                          v
                                    ┌──────────┐
                                    │  Agents  │
                                    └──────────┘
  </pre>
  <figcaption>
    System flow: User input processed by Claude Code, delegated to skills, executed by agents
  </figcaption>
</figure>
```

**Rationale**:
- `role="img"` signals semantic image to assistive tech
- `aria-label` provides concise description (read by screen readers)
- `<figcaption>` offers detailed explanation (available to all users)

#### Pattern 3: Large ASCII Blocks with Skip Links
```html
<div class="ascii-section">
  <a href="#content" class="skip-link">Skip ASCII art</a>
  <pre aria-hidden="true" class="ascii-decorative">
    [64 lines of ASCII art banner]
  </pre>
  <h2 id="content">Features</h2>
</div>
```

**CSS for Skip Links**:
```css
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  background: var(--color-bg-secondary);
  color: var(--color-accent-primary);
  padding: var(--spacing-sm);
  text-decoration: underline;
  z-index: 100;
}

.skip-link:focus {
  left: var(--spacing-sm);
  top: var(--spacing-sm);
}
```

**Rationale**: W3C recommends skip links for long ASCII blocks. Visible only on keyboard focus.

### WCAG 2.1 Success Criteria Mapping

| Criterion | Level | How Addressed |
|-----------|-------|---------------|
| **1.1.1 Non-text Content** | A | All ASCII art has text alternatives (aria-label or adjacent text) |
| **1.3.1 Info and Relationships** | A | Semantic HTML (`<figure>`, `role="img"`) conveys structure |
| **2.1.1 Keyboard** | A | Skip links focusable via Tab key |
| **2.4.1 Bypass Blocks** | A | Skip links allow bypassing repetitive ASCII |
| **4.1.2 Name, Role, Value** | A | ARIA attributes expose role/label to assistive tech |

### Code Example: Component Gallery Card

```html
<!-- Gallery card with ASCII preview -->
<article class="component-card">
  <h3 id="button-primary">Primary Button</h3>

  <!-- ASCII preview (decorative) -->
  <pre aria-hidden="true" class="ascii-preview">
┌───────────────┐
│  Click Me!    │
└───────────────┘
  </pre>

  <!-- Accessible description -->
  <p>A rectangular button with rounded corners and primary accent color.</p>

  <button aria-describedby="button-primary">View Details</button>
</article>
```

### Testing Checklist
- [ ] Run NVDA/JAWS screen reader: ASCII skipped or described appropriately
- [ ] Keyboard navigation: Skip links reachable via Tab
- [ ] axe DevTools: No ARIA violations
- [ ] WAVE browser extension: Verify alt text presence
- [ ] Manual review: ASCII meaning conveyed via surrounding text

### Alternatives Considered
- **Always use `role="img"`**: Over-describes decorative content, verbose for screen reader users
- **Pure text alternatives**: Loses visual appeal for sighted users
- **Hide all ASCII from screen readers without context**: Fails WCAG 1.1.1 for meaningful diagrams
- **Emojis instead of ASCII**: Not aligned with retro terminal aesthetic

### References
- [W3C Technique H86: ASCII Art Text Alternatives](https://www.w3.org/TR/WCAG20-TECHS/H86.html)
- [ARIA Labels Implementation Guide](https://www.allaccessible.org/blog/implementing-aria-labels-for-web-accessibility)
- [Emojis and Web Accessibility Best Practices](https://www.boia.org/blog/emojis-and-web-accessibility-best-practices)
- [MDN: ARIA role="img"](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/img_role)

---

## 4. Responsive ASCII Simplification Strategy

### Decision
Use **4-tier breakpoint system** with progressively simplified box-drawing characters at smaller viewports.

### Breakpoint Thresholds
- **xs** (0-32rem / 0-512px): Single-line borders `─ │ ┌ ┐ └ ┘`
- **sm** (32rem-48rem / 512px-768px): Light box-drawing `─ │ ┌ ┐ └ ┘`
- **md** (48rem-64rem / 768px-1024px): Mixed box-drawing `═ ║ ╔ ╗ ╚ ╝`
- **lg** (≥64rem / ≥1024px): Full double-line `═ ║ ╔ ╗ ╚ ╝ ╬`

### Rationale
- **Legibility**: Double-line characters (`═ ║`) become cramped below 48rem, single-line (`─ │`) clearer
- **Touch Targets**: Simplified boxes reduce visual density on mobile, improving scanability
- **Monospace Rendering**: System fonts render single-line characters more consistently at small sizes
- **Content Priority**: On mobile, ASCII is decorative; simplification shifts focus to text content
- **Industry Alignment**: Breakpoints match Tailwind CSS (`sm: 40rem`, `lg: 64rem`) and Bootstrap (`md: 48rem`)

### Visual Simplification Examples

#### Large Desktop (≥64rem)
```
╔═══════════════════════════════════════╗
║  Component: Primary Button            ║
║  ────────────────────────────────────  ║
║  ┌─────────────┐                      ║
║  │  Click Me!  │  [View Details]      ║
║  └─────────────┘                      ║
╚═══════════════════════════════════════╝
```

#### Tablet (48rem-64rem)
```
┌───────────────────────────────────────┐
│  Component: Primary Button            │
│  ──────────────────────────────────    │
│  ┌─────────────┐                      │
│  │  Click Me!  │  [View Details]      │
│  └─────────────┘                      │
└───────────────────────────────────────┘
```

#### Mobile (32rem-48rem)
```
┌─────────────────────┐
│ Primary Button      │
│ ─────────────       │
│ ┌───────────┐       │
│ │ Click Me! │       │
│ └───────────┘       │
│ [View Details]      │
└─────────────────────┘
```

#### Small Mobile (<32rem)
```
┌──────────────┐
│ Primary      │
│ Button       │
│ ──────────   │
│ Click Me!    │
│ [Details]    │
└──────────────┘
```

### Implementation Strategy

#### CSS Custom Properties per Breakpoint
```css
:root {
  /* Default (xs): Single-line */
  --border-char-h: '─';
  --border-char-v: '│';
  --border-char-tl: '┌';
  --border-char-tr: '┐';
  --border-char-bl: '└';
  --border-char-br: '┘';
}

@media (min-width: 48rem) {
  /* md: Light box */
  :root {
    --border-char-h: '─';
    --border-char-v: '│';
  }
}

@media (min-width: 64rem) {
  /* lg: Double-line */
  :root {
    --border-char-h: '═';
    --border-char-v: '║';
    --border-char-tl: '╔';
    --border-char-tr: '╗';
    --border-char-bl: '╚';
    --border-char-br: '╝';
  }
}
```

#### JavaScript Content Swapping
```javascript
// Swap ASCII art based on viewport width
function updateAsciiArt() {
  const width = window.innerWidth;
  const asciiElements = document.querySelectorAll('[data-ascii-variants]');

  asciiElements.forEach(el => {
    const variants = JSON.parse(el.dataset.asciiVariants);
    let content;

    if (width < 512) {
      content = variants.xs;
    } else if (width < 768) {
      content = variants.sm;
    } else if (width < 1024) {
      content = variants.md;
    } else {
      content = variants.lg;
    }

    el.textContent = content;
  });
}

// Debounce for performance
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(updateAsciiArt, 150);
});

// Initial load
updateAsciiArt();
```

#### HTML Data Attribute Approach
```html
<pre
  class="ascii-box"
  data-ascii-variants='{
    "xs": "┌──────┐\n│ Box  │\n└──────┘",
    "sm": "┌────────┐\n│  Box   │\n└────────┘",
    "md": "┌──────────┐\n│   Box    │\n└──────────┘",
    "lg": "╔════════════╗\n║    Box     ║\n╚════════════╝"
  }'
  aria-hidden="true">
</pre>
```

### Font Sizing Strategy
```css
/* Prevent ASCII from becoming unreadable on mobile */
.ascii-art {
  font-size: clamp(0.75rem, 2vw, 1rem);
  line-height: 1.2;
  overflow-x: auto; /* Horizontal scroll as fallback */
  -webkit-overflow-scrolling: touch; /* iOS smooth scrolling */
}

/* Desktop: Fixed size */
@media (min-width: 64rem) {
  .ascii-art {
    font-size: 1rem;
  }
}
```

### Performance Considerations
- **Minimize JS Swaps**: Pre-render variants server-side where possible
- **CSS-Only Preferred**: Use `content` property with `::before` for simple cases
- **Lazy Loading**: Defer complex ASCII art below fold on mobile
- **ResizeObserver**: Use over `resize` event for better performance (2024 standard)

```javascript
// Modern ResizeObserver approach (better than resize event)
const ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    const width = entry.contentRect.width;
    // Update ASCII based on width
  }
});

ro.observe(document.body);
```

### Testing Checklist
- [ ] Visual regression tests at each breakpoint
- [ ] Verify monospace font consistency across devices
- [ ] Test horizontal scroll behavior on <32rem devices
- [ ] Confirm Unicode character support in target browsers
- [ ] Validate with real devices (iOS Safari, Chrome Android)

### Alternatives Considered
- **Single ASCII variant**: Horizontal scroll on mobile, poor UX
- **Hide ASCII on mobile**: Loses brand identity, not "ASCII-first"
- **SVG replacement**: No longer ASCII, defeats purpose
- **Viewport units only**: Doesn't address character complexity
- **Server-side detection**: Requires backend, conflicts with static site requirement

### References
- [Stack Overflow: Responsive ASCII Art](https://stackoverflow.com/questions/75695347/how-can-i-make-ascii-art-pre-tag-responsive-without-media-queries)
- [Tailwind CSS: Responsive Breakpoints](https://tailwindcss.com/docs/responsive-design)
- [BrowserStack: Responsive Design Breakpoints Guide](https://www.browserstack.com/guide/responsive-design-breakpoints)
- [Unicode Box Drawing Characters](https://en.wikipedia.org/wiki/Box-drawing_character)

---

## 5. Performance Budget for ASCII-Heavy Sites

### Decision
Implement **system font stack**, **critical CSS inlining**, **font-display: swap**, and **lazy loading** for below-fold ASCII art to achieve Lighthouse 90+ scores.

### Rationale
- **Monospace Font Impact**: Custom monospace fonts (Fira Code, JetBrains Mono) add 50-200KB, delay First Contentful Paint (FCP)
- **System Fonts Are Free**: Zero network cost, instant rendering, no layout shift
- **Pre-formatted Text**: `<pre>` blocks prevent layout optimization, require careful handling
- **Core Web Vitals**: Font loading directly impacts Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS)
- **2024 Best Practice**: System font stacks + selective web fonts per Google's Web Vitals guidelines

### Performance Budget Targets

| Metric | Target | Constraint |
|--------|--------|------------|
| **Total Page Weight** | <500KB | Including HTML, CSS, JS, fonts |
| **LCP (Largest Contentful Paint)** | <2.5s | Hero ASCII must render quickly |
| **CLS (Cumulative Layout Shift)** | <0.1 | Prevent font swap layout shifts |
| **FCP (First Contentful Paint)** | <1.8s | Above-fold content visible fast |
| **TTI (Time to Interactive)** | <3.8s | JavaScript executes quickly |
| **Lighthouse Score** | ≥90 | Performance category |

### Optimization Techniques

#### 1. System Monospace Font Stack
```css
/* Zero-cost, instant rendering */
:root {
  --font-mono: ui-monospace, 'SF Mono', 'Cascadia Mono', 'Segoe UI Mono',
               Menlo, Monaco, Consolas, 'Liberation Mono',
               'Courier New', monospace;
}

body, pre, code {
  font-family: var(--font-mono);
}
```

**Benefits**:
- **0KB download**: Already installed on user's OS
- **Instant FCP**: No FOIT (Flash of Invisible Text) or FOUT (Flash of Unstyled Text)
- **Zero CLS**: Font metrics identical to fallback (no swap shift)
- **Cross-platform**: Covers Windows (Cascadia/Consolas), macOS (SF Mono/Menlo), Linux (Liberation Mono)

**Rationale**: For ASCII art, character consistency matters more than specific typeface aesthetics. System fonts render box-drawing characters reliably.

#### 2. Critical CSS Inlining
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fluxwing Skills</title>

  <!-- Inline critical CSS (above-fold styles) -->
  <style>
    :root{--font-mono:ui-monospace,'SF Mono','Cascadia Mono',Menlo,Consolas,monospace;--color-bg:#0a0a0a;--color-text:#00ff00}
    body{font-family:var(--font-mono);background:var(--color-bg);color:var(--color-text);margin:0;padding:1rem}
    .hero{text-align:center;padding:2rem 0}
    .ascii-logo{font-size:clamp(.75rem,2vw,1rem);line-height:1.2}
  </style>

  <!-- Load non-critical CSS asynchronously -->
  <link rel="preload" href="css/components.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="css/components.css"></noscript>
</head>
```

**Benefits**:
- **Faster FCP**: Eliminates render-blocking CSS request for above-fold content
- **Reduced HTTP requests**: Critical styles delivered in HTML payload
- **Progressive enhancement**: Non-critical styles load async without blocking render

**Tools**:
- [Critical CSS Generator](https://www.sitelocity.com/critical-path-css-generator)
- Manual extraction (first ~10KB of styles)

#### 3. Font-Display: Swap (If Using Web Fonts)
```css
/* Only if custom monospace font is absolutely required */
@font-face {
  font-family: 'FiraCode';
  src: url('fonts/FiraCode-Regular.woff2') format('woff2');
  font-display: swap; /* Show fallback immediately, swap when loaded */
  font-weight: 400;
  font-style: normal;
  unicode-range: U+0020-007F, U+2500-257F; /* ASCII + Box Drawing only */
}
```

**Caveats**:
- **CLS Risk**: Layout shift when font swaps (mitigate with size-adjust)
- **Subsetting Required**: Only include ASCII (U+0020-007F) and box-drawing (U+2500-257F) ranges
- **Preload Critical**: `<link rel="preload" href="fonts/FiraCode-Regular.woff2" as="font" type="font/woff2" crossorigin>`

**Size-Adjust Calculation** (Prevent CLS):
```css
@font-face {
  font-family: 'FiraCode';
  src: url('fonts/FiraCode-Regular.woff2') format('woff2');
  font-display: swap;
  size-adjust: 106%; /* Match Consolas metrics */
  ascent-override: 95%;
  descent-override: 25%;
}
```

**Recommendation**: **Avoid web fonts** for this project. System fonts meet requirements.

#### 4. Lazy Loading Below-Fold ASCII
```html
<!-- Gallery component cards below fold -->
<pre class="ascii-preview lazy-ascii" data-src="components/button.txt" aria-hidden="true">
  <!-- Placeholder: Simple fallback -->
  Loading...
</pre>

<script>
  // Intersection Observer for lazy loading
  const lazyAscii = document.querySelectorAll('.lazy-ascii');

  const asciiObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pre = entry.target;
        const src = pre.dataset.src;

        fetch(src)
          .then(response => response.text())
          .then(ascii => {
            pre.textContent = ascii;
            pre.classList.remove('lazy-ascii');
          })
          .catch(() => {
            pre.textContent = '[ASCII art unavailable]';
          });

        observer.unobserve(pre);
      }
    });
  }, {
    rootMargin: '200px' // Load 200px before entering viewport
  });

  lazyAscii.forEach(el => asciiObserver.observe(el));
</script>
```

**Benefits**:
- **Reduced initial payload**: Hero ASCII inline, gallery ASCII deferred
- **Faster TTI**: Less DOM parsing upfront
- **Bandwidth savings**: Only load visible ASCII

#### 5. Compression and Minification
```bash
# HTML minification (remove whitespace, preserve <pre> content)
npm install html-minifier-terser
html-minifier-terser --collapse-whitespace --preserve-line-breaks \
  --case-sensitive --keep-closing-slash index.html -o index.min.html

# CSS minification
npm install csso-cli
csso ascii-core.css -o ascii-core.min.css

# JavaScript minification
npm install terser
terser main.js -c -m -o main.min.js

# Gzip compression (GitHub Pages auto-serves .gz if present)
gzip -k -9 *.html *.css *.js
```

**Expected Savings**:
- HTML: 30-50% reduction (with `<pre>` preservation)
- CSS: 20-40% reduction
- JS: 40-60% reduction
- Gzip: Additional 60-80% for text files

#### 6. Preconnect to External Resources
```html
<!-- If using Google Fonts (NOT recommended for this project) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- If using CDN for images -->
<link rel="dns-prefetch" href="https://cdn.example.com">
```

**For Static GitHub Pages**: Not applicable (self-hosted assets).

### Performance Testing Checklist

#### Lighthouse Audit (Chrome DevTools)
```bash
# Run programmatically
npm install -g lighthouse
lighthouse https://yourusername.github.io/repo --view
```

**Target Scores**:
- Performance: ≥90
- Accessibility: ≥90 (WCAG 2.1 AA)
- Best Practices: ≥90
- SEO: ≥90

#### WebPageTest
- Test on **Mobile (3G)** and **Desktop (Cable)**
- Verify **LCP** is hero ASCII or first heading
- Check **CLS** during font loading (should be ~0)

#### Chrome DevTools Coverage Tool
1. Open DevTools → Coverage tab
2. Reload page
3. Identify unused CSS/JS
4. Remove or defer unused code

**Goal**: <10% unused CSS/JS on initial load

### Monitoring Budget with GitHub Actions
```yaml
# .github/workflows/performance-budget.yml
name: Performance Budget
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://deploy-preview.github.io/fluxwing-skills/
          budgetPath: ./budget.json
          uploadArtifacts: true

# budget.json
{
  "performance": 90,
  "accessibility": 90,
  "best-practices": 90,
  "seo": 90
}
```

### Alternatives Considered
- **Web Fonts for Ligatures**: Fira Code ligatures nice but unnecessary for ASCII art (box-drawing doesn't use ligatures)
- **Image-based ASCII**: Eliminates font loading but loses copy-paste, screen readers, and text search
- **Service Worker Caching**: Good for repeat visits but doesn't improve first load (focus on FCP/LCP first)
- **HTTP/2 Server Push**: GitHub Pages doesn't support (limited control)

### References
- [NitroPack: 8 Web Font Optimization Strategies](https://nitropack.io/blog/post/font-loading-optimization)
- [web.dev: Font Best Practices](https://web.dev/articles/font-best-practices)
- [DebugBear: Ultimate Guide to Font Performance](https://www.debugbear.com/blog/website-font-performance)
- [Vincent Bernat: Fixing Layout Shifts Caused by Web Fonts](https://vincent.bernat.ch/en/blog/2024-cls-webfonts)
- [Vercel: Optimizing Core Web Vitals in 2024](https://vercel.com/guides/optimizing-core-web-vitals-in-2024)

---

## 6. CRT Effect Implementation

### Decision
Use **CSS-only effects** (scanlines, phosphor glow, flicker) with **`prefers-reduced-motion` media query** and **data-attribute toggle** for user control.

### Rationale
- **Zero JavaScript**: CSS animations more performant than canvas/WebGL for this use case
- **Accessibility First**: Respect user's motion preferences per WCAG 2.1 (2.3.3 Animation from Interactions)
- **Progressive Enhancement**: Works without JS, toggleable with JS
- **Retro Authenticity**: Scanlines + glow evoke 1980s CRT monitors
- **Browser Support**: CSS animations supported in all target browsers (iOS Safari 12+, Chrome Android 90+)

### CRT Effects Breakdown

#### 1. Scanlines (Horizontal Lines)
```css
/* Repeating linear gradient creates scanline effect */
.crt-scanlines {
  position: relative;
  overflow: hidden;
}

.crt-scanlines::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 50%,
    rgba(0, 0, 0, 0.1) 50%
  );
  background-size: 100% 4px; /* 4px scanline spacing */
  pointer-events: none; /* Allow clicks through */
  z-index: 10;
}

/* Slow moving scanlines (optional) */
@keyframes scanline-move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 4px;
  }
}

.crt-scanlines.animated::before {
  animation: scanline-move 8s linear infinite;
}
```

#### 2. Phosphor Glow (Text Shadow)
```css
/* Green phosphor glow */
.crt-glow {
  color: #00ff00;
  text-shadow:
    0 0 2px #00ff00,      /* Inner glow */
    0 0 5px #00ff00,      /* Mid glow */
    0 0 10px #00cc00,     /* Outer glow */
    0 0 20px #00aa00;     /* Far glow */
}

/* Cyan accent glow */
.crt-glow-accent {
  color: #00ffff;
  text-shadow:
    0 0 2px #00ffff,
    0 0 5px #00ffff,
    0 0 10px #00cccc;
}
```

#### 3. Screen Flicker (Subtle Animation)
```css
@keyframes crt-flicker {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.98;
  }
  100% {
    opacity: 1;
  }
}

.crt-flicker {
  animation: crt-flicker 0.15s ease-in-out infinite alternate;
}
```

#### 4. Screen Curvature (Subtle Perspective)
```css
/* Very subtle barrel distortion */
.crt-screen {
  position: relative;
  border-radius: 8px; /* Slight rounded corners */
  overflow: hidden;
}

.crt-screen::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  pointer-events: none;
}
```

### Accessibility: Respecting Motion Preferences

#### Disable Animations for Users with Motion Sensitivity
```css
/* Disable ALL animations when user prefers reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Remove flicker */
  .crt-flicker {
    animation: none;
  }

  /* Remove scanline movement */
  .crt-scanlines.animated::before {
    animation: none;
  }

  /* Keep static effects (glow, scanlines) but remove motion */
  .crt-glow {
    /* Glow remains (no motion) */
  }
}
```

**Rationale**:
- Flicker and moving scanlines can trigger vestibular disorders
- Static glow and scanlines are safe (no motion)
- Fade-in/dissolve effects acceptable (non-vestibular)

#### Safe Animation Alternatives (When Motion Reduced)
```css
/* Replace scale/rotate with fade */
@media (prefers-reduced-motion: reduce) {
  .card-reveal {
    /* Instead of: transform: scale(1.05); */
    opacity: 0.95; /* Subtle fade */
  }

  .button:hover {
    /* Instead of: transform: translateY(-2px); */
    background-color: var(--color-accent-primary-hover); /* Color change only */
  }
}
```

### User-Controlled Toggle Mechanism

#### HTML Structure
```html
<body data-crt="enabled">
  <header>
    <button id="crt-toggle" aria-pressed="true">
      CRT Effects: <span id="crt-status">ON</span>
    </button>
  </header>

  <main class="crt-container">
    <!-- Content -->
  </main>
</body>
```

#### CSS: Data Attribute Switching
```css
/* CRT effects only when data-crt="enabled" */
[data-crt="enabled"] .crt-container {
  /* Apply scanlines */
}

[data-crt="enabled"] .crt-container::before {
  /* Scanline overlay */
}

[data-crt="enabled"] .crt-glow {
  text-shadow: 0 0 5px currentColor;
}

/* Disabled state: remove all effects */
[data-crt="disabled"] .crt-glow {
  text-shadow: none;
}

[data-crt="disabled"] .crt-scanlines::before {
  display: none;
}
```

#### JavaScript: Toggle Logic
```javascript
// CRT effect toggle
const crtToggle = document.getElementById('crt-toggle');
const crtStatus = document.getElementById('crt-status');

// Check user's motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Initialize based on preference (respect accessibility by default)
if (prefersReducedMotion) {
  document.body.dataset.crt = 'disabled';
  crtToggle.setAttribute('aria-pressed', 'false');
  crtStatus.textContent = 'OFF';
}

// Toggle on button click
crtToggle.addEventListener('click', () => {
  const isEnabled = document.body.dataset.crt === 'enabled';

  document.body.dataset.crt = isEnabled ? 'disabled' : 'enabled';
  crtToggle.setAttribute('aria-pressed', !isEnabled);
  crtStatus.textContent = isEnabled ? 'OFF' : 'ON';

  // Save preference to localStorage
  localStorage.setItem('crtEffects', !isEnabled ? 'enabled' : 'disabled');
});

// Restore saved preference on page load
const savedPreference = localStorage.getItem('crtEffects');
if (savedPreference && !prefersReducedMotion) {
  document.body.dataset.crt = savedPreference;
  crtToggle.setAttribute('aria-pressed', savedPreference === 'enabled');
  crtStatus.textContent = savedPreference === 'enabled' ? 'ON' : 'OFF';
}
```

### Complete CRT Effect Stylesheet

```css
/* docs/css/crt-effects.css */

/* === SCANLINES === */
.crt-scanlines::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 50%,
    rgba(0, 0, 0, 0.1) 50%
  );
  background-size: 100% 3px;
  pointer-events: none;
  z-index: 1000;
}

/* === PHOSPHOR GLOW === */
.crt-glow {
  text-shadow:
    0 0 2px currentColor,
    0 0 5px currentColor,
    0 0 8px currentColor;
}

/* === FLICKER === */
@keyframes crt-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.97; }
}

.crt-flicker {
  animation: crt-flicker 0.1s ease-in-out infinite alternate;
}

/* === SCREEN VIGNETTE === */
.crt-screen::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    transparent 60%,
    rgba(0, 0, 0, 0.4) 100%
  );
  pointer-events: none;
}

/* === ACCESSIBILITY: REDUCED MOTION === */
@media (prefers-reduced-motion: reduce) {
  .crt-flicker {
    animation: none;
  }

  .crt-scanlines.animated::before {
    animation: none;
  }
}

/* === USER TOGGLE: DISABLED STATE === */
[data-crt="disabled"] .crt-scanlines::before,
[data-crt="disabled"] .crt-screen::after {
  display: none;
}

[data-crt="disabled"] .crt-glow {
  text-shadow: none;
}

[data-crt="disabled"] .crt-flicker {
  animation: none;
}
```

### Performance Considerations
- **Avoid on Mobile**: Disable CRT effects on touchscreens (poor battery life)
  ```css
  @media (hover: none) and (pointer: coarse) {
    [data-crt="enabled"] .crt-flicker {
      animation: none;
    }
  }
  ```
- **GPU Acceleration**: Use `will-change: opacity` for flicker (sparingly)
- **Limit Scope**: Apply effects to hero section only, not entire page

### Testing Checklist
- [ ] Verify effects disable when OS motion settings = "Reduce motion"
- [ ] Test toggle button with keyboard (Tab, Enter/Space)
- [ ] Confirm localStorage persists preference across sessions
- [ ] Check performance (should not drop below 60fps on target devices)
- [ ] Validate ARIA attributes (`aria-pressed` updates correctly)

### Alternatives Considered
- **Canvas/WebGL**: Overkill, poor battery life on mobile, accessibility challenges
- **Animated GIF overlay**: Not scalable, high file size, no user control
- **SVG filters**: Complex, limited browser support for `feTurbulence` effects
- **Always-on effects**: Violates WCAG 2.3.3, excludes users with motion sensitivity

### References
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [Smashing Magazine: Respecting Users' Motion Preferences](https://www.smashingmagazine.com/2021/10/respecting-users-motion-preferences/)
- [web.dev: prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion)
- [CSS-Tricks: Reduced Motion](https://css-tricks.com/almanac/rules/m/media/prefers-reduced-motion/)
- [Medium: CSS Animations for CRT Monitor Effects](https://medium.com/@dovid11564/using-css-animations-to-mimic-the-look-of-a-crt-monitor-3919de3318e2)

---

## 7. Component Gallery Data Loading

### Decision
Use **Fetch API** with **async/await** for loading `.uxm` JSON and `.md` templates, **try/catch** for error handling, and **modal rendering** via native `<dialog>` element.

### Rationale
- **Native Fetch API**: Built into modern browsers (99%+ support in 2024), no library required
- **JSON + Markdown Separation**: Aligns with uxscii standard (metadata + template)
- **Dialog Element**: Native modal with accessibility (focus trapping, Esc key) and styling control
- **Error Handling**: Gracefully handle missing files, network errors, JSON parse errors
- **Progressive Enhancement**: Works without JS (static gallery), enhanced with JS (modal details)

### Data Loading Architecture

#### File Structure
```
docs/
├── components/
│   ├── primary-button.uxm        (JSON metadata)
│   ├── primary-button.md         (ASCII template)
│   ├── email-input.uxm
│   ├── email-input.md
│   └── ...
├── js/
│   └── gallery.js                (Fetch + render logic)
└── index.html                    (Gallery grid)
```

#### Gallery HTML Structure
```html
<!-- Component gallery grid -->
<section id="component-gallery">
  <h2>Component Library</h2>

  <div class="gallery-grid">
    <article class="component-card" data-component="primary-button">
      <h3>Primary Button</h3>
      <pre class="ascii-preview" aria-hidden="true">
┌─────────────┐
│  Click Me!  │
└─────────────┘
      </pre>
      <button class="view-details" aria-label="View primary-button details">
        View Details
      </button>
    </article>

    <!-- More cards... -->
  </div>
</section>

<!-- Native dialog for component details -->
<dialog id="component-modal" aria-labelledby="modal-title">
  <div class="modal-content">
    <header>
      <h2 id="modal-title">Component Details</h2>
      <button class="modal-close" aria-label="Close modal">×</button>
    </header>

    <div id="modal-body">
      <!-- Dynamically populated -->
    </div>
  </div>
</dialog>
```

### Fetch API Implementation

#### Core Fetching Logic (with Error Handling)
```javascript
// docs/js/gallery.js

/**
 * Fetch component metadata (.uxm file)
 * @param {string} componentId - e.g., "primary-button"
 * @returns {Promise<Object>} Parsed JSON metadata
 */
async function fetchComponentMetadata(componentId) {
  const url = `components/${componentId}.uxm`;

  try {
    const response = await fetch(url);

    // Check HTTP status
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Validate Content-Type (optional but recommended)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn(`Expected JSON, got ${contentType}`);
    }

    // Parse JSON
    const metadata = await response.json();
    return metadata;

  } catch (error) {
    console.error(`Failed to fetch metadata for ${componentId}:`, error);
    throw error; // Re-throw for caller to handle
  }
}

/**
 * Fetch component template (.md file)
 * @param {string} componentId - e.g., "primary-button"
 * @returns {Promise<string>} Raw markdown/ASCII template
 */
async function fetchComponentTemplate(componentId) {
  const url = `components/${componentId}.md`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const template = await response.text();
    return template;

  } catch (error) {
    console.error(`Failed to fetch template for ${componentId}:`, error);
    throw error;
  }
}

/**
 * Fetch both metadata and template in parallel
 * @param {string} componentId
 * @returns {Promise<{metadata: Object, template: string}>}
 */
async function fetchComponentData(componentId) {
  try {
    // Parallel fetch for better performance
    const [metadata, template] = await Promise.all([
      fetchComponentMetadata(componentId),
      fetchComponentTemplate(componentId)
    ]);

    return { metadata, template };

  } catch (error) {
    // Return partial data if one fetch fails
    console.error(`Error loading component ${componentId}:`, error);
    return {
      metadata: null,
      template: null,
      error: error.message
    };
  }
}
```

#### Error Handling Strategies

**1. Display Error in Modal**
```javascript
function renderError(componentId, errorMessage) {
  const modalBody = document.getElementById('modal-body');

  modalBody.innerHTML = `
    <div class="error-state" role="alert">
      <h3>Failed to Load Component</h3>
      <p>Component ID: <code>${componentId}</code></p>
      <p>Error: ${errorMessage}</p>
      <button onclick="location.reload()">Retry</button>
    </div>
  `;
}
```

**2. Graceful Degradation (Show Partial Data)**
```javascript
function renderComponentModal(data, componentId) {
  const { metadata, template, error } = data;
  const modalBody = document.getElementById('modal-body');

  if (error) {
    renderError(componentId, error);
    return;
  }

  // Render metadata (if available)
  if (metadata) {
    modalBody.innerHTML = `
      <section>
        <h3>${metadata.id}</h3>
        <dl>
          <dt>Type</dt><dd>${metadata.type}</dd>
          <dt>Version</dt><dd>${metadata.version}</dd>
          <dt>Description</dt><dd>${metadata.metadata.description}</dd>
        </dl>
      </section>
    `;
  }

  // Render template (if available)
  if (template) {
    const pre = document.createElement('pre');
    pre.textContent = template;
    pre.setAttribute('aria-hidden', 'true');
    modalBody.appendChild(pre);
  }

  // Show warning if partial data
  if (!metadata || !template) {
    const warning = document.createElement('p');
    warning.className = 'warning';
    warning.role = 'status';
    warning.textContent = 'Some component data could not be loaded.';
    modalBody.insertBefore(warning, modalBody.firstChild);
  }
}
```

### Modal Rendering with Native `<dialog>`

#### Opening Modal
```javascript
const modal = document.getElementById('component-modal');

async function openComponentModal(componentId) {
  // Show loading state
  document.getElementById('modal-title').textContent = 'Loading...';
  document.getElementById('modal-body').innerHTML = '<p>Fetching component data...</p>';

  // Open modal
  modal.showModal(); // Native method: focus trap + backdrop

  // Fetch data
  const data = await fetchComponentData(componentId);

  // Render content
  document.getElementById('modal-title').textContent =
    data.metadata?.id || componentId;
  renderComponentModal(data, componentId);
}

// Event delegation for gallery cards
document.getElementById('component-gallery').addEventListener('click', (e) => {
  if (e.target.classList.contains('view-details')) {
    const card = e.target.closest('.component-card');
    const componentId = card.dataset.component;
    openComponentModal(componentId);
  }
});
```

#### Closing Modal
```javascript
// Close button
document.querySelector('.modal-close').addEventListener('click', () => {
  modal.close();
});

// ESC key (automatic with <dialog>)
// Backdrop click (optional)
modal.addEventListener('click', (e) => {
  if (e.target === modal) { // Click on backdrop
    modal.close();
  }
});

// Clean up on close
modal.addEventListener('close', () => {
  document.getElementById('modal-body').innerHTML = '';
});
```

### Complete Gallery Implementation

```javascript
// docs/js/gallery.js

// === DATA FETCHING ===
async function fetchComponentMetadata(componentId) {
  const response = await fetch(`components/${componentId}.uxm`);
  if (!response.ok) throw new Error(`Failed to load ${componentId}.uxm`);
  return response.json();
}

async function fetchComponentTemplate(componentId) {
  const response = await fetch(`components/${componentId}.md`);
  if (!response.ok) throw new Error(`Failed to load ${componentId}.md`);
  return response.text();
}

async function fetchComponentData(componentId) {
  try {
    const [metadata, template] = await Promise.all([
      fetchComponentMetadata(componentId),
      fetchComponentTemplate(componentId)
    ]);
    return { metadata, template };
  } catch (error) {
    return { metadata: null, template: null, error: error.message };
  }
}

// === MODAL RENDERING ===
function renderComponentModal(data, componentId) {
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  if (data.error) {
    modalTitle.textContent = 'Error';
    modalBody.innerHTML = `
      <div class="error-state" role="alert">
        <p>${data.error}</p>
      </div>
    `;
    return;
  }

  const { metadata, template } = data;

  modalTitle.textContent = metadata.id;
  modalBody.innerHTML = `
    <section class="metadata">
      <h3>Metadata</h3>
      <dl>
        <dt>Type</dt><dd>${metadata.type}</dd>
        <dt>Version</dt><dd>${metadata.version}</dd>
        <dt>Description</dt><dd>${metadata.metadata.description}</dd>
        <dt>Author</dt><dd>${metadata.metadata.author}</dd>
      </dl>
    </section>

    <section class="template">
      <h3>ASCII Template</h3>
      <pre aria-hidden="true">${escapeHtml(template)}</pre>
    </section>

    <section class="props">
      <h3>Props</h3>
      <ul>
        ${metadata.props.map(prop => `
          <li>
            <strong>${prop.name}</strong> (${prop.type})
            ${prop.required ? '<em>required</em>' : ''}
          </li>
        `).join('')}
      </ul>
    </section>
  `;
}

// Prevent XSS (escape user-controlled content)
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// === EVENT LISTENERS ===
const modal = document.getElementById('component-modal');

// Open modal on card click
document.getElementById('component-gallery').addEventListener('click', async (e) => {
  if (e.target.classList.contains('view-details')) {
    const componentId = e.target.closest('.component-card').dataset.component;

    // Show loading state
    modal.showModal();
    document.getElementById('modal-title').textContent = 'Loading...';
    document.getElementById('modal-body').innerHTML = '<p>Fetching data...</p>';

    // Fetch and render
    const data = await fetchComponentData(componentId);
    renderComponentModal(data, componentId);
  }
});

// Close modal
document.querySelector('.modal-close').addEventListener('click', () => {
  modal.close();
});

// Close on backdrop click
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.close();
});
```

### CSS for Modal Styling

```css
/* Native dialog styling */
dialog {
  border: 2px solid var(--color-accent-primary);
  border-radius: 0; /* Terminal aesthetic */
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  max-width: 60rem;
  padding: 0;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
}

dialog::backdrop {
  background: rgba(0, 0, 0, 0.8);
}

.modal-content {
  padding: var(--spacing-lg);
}

.modal-close {
  float: right;
  background: none;
  border: none;
  color: var(--color-accent-primary);
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
}

.modal-close:hover {
  color: var(--color-accent-primary-hover);
}

.error-state {
  padding: var(--spacing-md);
  border: 1px solid red;
  background: rgba(255, 0, 0, 0.1);
}
```

### Testing Checklist
- [ ] Test with missing `.uxm` file (404 error)
- [ ] Test with missing `.md` file (404 error)
- [ ] Test with invalid JSON in `.uxm` (parse error)
- [ ] Test with network offline (fetch rejection)
- [ ] Verify ESC key closes modal
- [ ] Verify backdrop click closes modal
- [ ] Test keyboard navigation (Tab through modal elements)
- [ ] Validate ARIA attributes with screen reader

### Alternatives Considered
- **XMLHttpRequest**: Deprecated, verbose compared to Fetch API
- **jQuery.ajax()**: Library dependency conflicts with "vanilla JS" requirement
- **Inline JSON**: All data in HTML, no dynamic loading (poor performance, large payload)
- **Custom modal**: Reinventing wheel when `<dialog>` has native accessibility

### References
- [Go Make Things: Fetch API with Vanilla JS](https://gomakethings.com/how-to-use-the-fetch-api-with-vanilla-js/)
- [DigitalOcean: JavaScript Fetch API Guide](https://www.digitalocean.com/community/tutorials/how-to-use-the-javascript-fetch-api-to-get-data)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN: Dialog Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [Jason Watmore: Check if Response is JSON](https://jasonwatmore.com/post/2021/09/22/fetch-vanilla-js-check-if-http-response-is-json-in-javascript)

---

## 8. Animation Library Decision

### Decision
Use **Intersection Observer API** (not scroll event listeners) for scroll-based animations.

### Rationale
- **Performance**: Intersection Observer runs off main thread, scroll listeners block rendering
- **Efficiency**: Fires once per threshold crossing vs. continuous scroll event firing
- **Battery Life**: Significantly better on mobile devices (no constant polling)
- **Code Simplicity**: Built-in viewport detection, no manual `getBoundingClientRect()` calculations
- **Browser Support**: 98.7% global coverage (iOS Safari 12.2+, Chrome Android 90+, all modern browsers)
- **2024 Consensus**: Industry-wide recommendation (Google, Mozilla, web.dev, CSS-Tricks)

### Performance Comparison

| Aspect | Scroll Event Listener | Intersection Observer |
|--------|----------------------|----------------------|
| **Fires** | Every pixel scrolled | Once per threshold |
| **Main Thread** | Blocks (requires debounce) | Runs asynchronously |
| **CPU Usage** | High (constant calculation) | Low (browser-optimized) |
| **Battery Impact** | Significant on mobile | Minimal |
| **Code Complexity** | Manual viewport math | Declarative API |
| **Recommended (2024)** | ❌ Legacy approach | ✅ Modern standard |

### Implementation: Scroll Reveal Animation

#### Use Case
Fade-in components as they enter viewport (common for gallery cards, sections).

#### HTML Structure
```html
<article class="component-card reveal-on-scroll">
  <h3>Primary Button</h3>
  <pre class="ascii-preview">...</pre>
</article>

<article class="component-card reveal-on-scroll">
  <h3>Email Input</h3>
  <pre class="ascii-preview">...</pre>
</article>
```

#### CSS Animation
```css
/* Initial state: hidden */
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

/* Revealed state: visible */
.reveal-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .reveal-on-scroll {
    transform: none; /* Remove translateY */
    transition-duration: 0.01ms; /* Instant */
  }
}
```

#### JavaScript: Intersection Observer
```javascript
// docs/js/scroll-reveal.js

// Create observer instance
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Element entered viewport
        entry.target.classList.add('is-visible');

        // Optional: Unobserve after reveal (one-time animation)
        observer.unobserve(entry.target);
      }
    });
  },
  {
    root: null,        // Use viewport as root
    rootMargin: '0px 0px -100px 0px', // Trigger 100px before entering viewport
    threshold: 0.1     // 10% of element visible
  }
);

// Observe all elements with .reveal-on-scroll
const revealElements = document.querySelectorAll('.reveal-on-scroll');
revealElements.forEach(el => revealObserver.observe(el));
```

### Configuration Options Explained

#### `root`
- **`null`**: Use viewport (most common)
- **Element**: Custom scrolling container (e.g., `document.querySelector('.scroll-container')`)

#### `rootMargin`
- **`'0px'`**: Trigger exactly at viewport edge
- **`'-100px'`**: Trigger 100px after entering viewport
- **`'0px 0px -100px 0px'`**: Trigger 100px before element reaches bottom of viewport (early reveal)

#### `threshold`
- **`0`**: Fire when any part enters viewport
- **`0.5`**: Fire when 50% of element is visible
- **`1.0`**: Fire when 100% of element is visible
- **`[0, 0.5, 1]`**: Fire at multiple thresholds (for progress tracking)

### Advanced Example: Staggered Animation

Reveal cards with 100ms delay between each:

```javascript
const staggeredObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add delay based on DOM order
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 100); // 100ms stagger

        staggeredObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.component-card').forEach(card => {
  staggeredObserver.observe(card);
});
```

### Handling Multiple Observers

For complex pages, use separate observers for different animation types:

```javascript
// Lazy load images
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // Load image
      imageObserver.unobserve(img);
    }
  });
}, { rootMargin: '200px' }); // Preload 200px before viewport

// Scroll reveal animations
const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      animationObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Observe different element sets
document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
document.querySelectorAll('.reveal-on-scroll').forEach(el => animationObserver.observe(el));
```

### Polyfill for Legacy Browsers

For browsers older than iOS Safari 12.2 (0.13% global traffic in 2024):

```html
<script>
  // Load polyfill only if needed
  if (!('IntersectionObserver' in window)) {
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(script);
  }
</script>
```

**Recommendation**: **Skip polyfill** for this project. 98.7% coverage sufficient; graceful degradation (elements remain visible without animation) acceptable.

### Performance Best Practices

1. **Unobserve After Reveal**: Prevent memory leaks with one-time animations
   ```javascript
   if (entry.isIntersecting) {
     entry.target.classList.add('is-visible');
     observer.unobserve(entry.target); // Stop observing
   }
   ```

2. **Batch Observations**: Observe multiple elements with single observer (not one observer per element)
   ```javascript
   // ✅ Good: One observer, many elements
   const observer = new IntersectionObserver(callback);
   elements.forEach(el => observer.observe(el));

   // ❌ Bad: One observer per element
   elements.forEach(el => {
     new IntersectionObserver(callback).observe(el);
   });
   ```

3. **Respect Reduced Motion**: Disable animations for accessibility
   ```javascript
   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

   if (prefersReducedMotion) {
     // Skip observer, add .is-visible immediately
     document.querySelectorAll('.reveal-on-scroll').forEach(el => {
       el.classList.add('is-visible');
     });
   } else {
     // Use Intersection Observer
     revealElements.forEach(el => revealObserver.observe(el));
   }
   ```

### Browser Support Verification

| Browser | Minimum Version | Support |
|---------|----------------|---------|
| Chrome Android | 90+ | ✅ 100% |
| iOS Safari | 12.2+ | ✅ 99.8% |
| Samsung Internet | 11+ | ✅ 100% |
| Firefox Android | 90+ | ✅ 100% |
| Edge | 90+ | ✅ 100% |

**Source**: [caniuse.com/intersectionobserver](https://caniuse.com/intersectionobserver) (January 2025)

### Testing Checklist
- [ ] Test on iOS Safari 12+ (oldest supported version)
- [ ] Test on Chrome Android 90+
- [ ] Verify animations fire at correct scroll positions
- [ ] Confirm animations disabled when `prefers-reduced-motion: reduce`
- [ ] Check DevTools Performance tab: no janky frames during scroll
- [ ] Validate observer cleanup (no memory leaks after unobserve)

### Why NOT Scroll Event Listeners

**Problems with scroll events**:
```javascript
// ❌ Old approach: scroll event listener
window.addEventListener('scroll', () => {
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('is-visible');
    }
  });
});
```

**Issues**:
1. **Fires constantly**: Hundreds of times per second during scroll
2. **Blocks main thread**: `getBoundingClientRect()` forces layout recalculation
3. **Requires debouncing**: Adds code complexity
4. **Poor battery life**: Mobile devices suffer
5. **Not optimized**: Browser can't optimize like Intersection Observer

**2024 Consensus**: Scroll events considered **legacy/anti-pattern** for viewport detection.

### Alternatives Considered
- **Scroll Event Listeners**: Legacy approach, poor performance (see above)
- **Scroll-Triggered CSS Animations**: Requires `animation-timeline: scroll()` (experimental, 12% browser support as of 2024)
- **Third-Party Libraries** (AOS, ScrollReveal): Unnecessary dependency for simple use case
- **Pure CSS** (`:target` pseudo-class): Not suited for scroll-based triggers

### References
- [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [web.dev: Intersection Observer](https://web.dev/articles/intersectionobserver)
- [DEV: Performance Testing IO vs Scroll Events](https://dev.to/jenc/a-stab-at-performance-testing-with-intersection-observer-and-scroll-events-173k)
- [Medium: IO vs Scroll Listener Comparison](https://medium.com/@cristinallamas/intersection-observer-vs-eventlistener-scroll-90aed9dc0e62)
- [JavaScript in Plain English: Should I Stop Using Scroll Listeners?](https://javascript.plainenglish.io/should-i-stop-using-scroll-listeners-aa7b0a5af97c)

---

## Summary of Decisions

| Topic | Decision | Key Rationale |
|-------|----------|---------------|
| **1. ASCII Tooling** | FIGlet + custom scripts | Industry standard, width control, scriptable |
| **2. CSS Design System** | CSS Custom Properties (kebab-case) | No build step, runtime theming, 2024 best practice |
| **3. ASCII Accessibility** | `aria-hidden` for decorative, `role="img"` for meaningful | WCAG H86 compliance, screen reader clarity |
| **4. Responsive Strategy** | 4-tier breakpoints (xs/sm/md/lg), simplified box-drawing | Legibility at small sizes, content-first on mobile |
| **5. Performance** | System font stack, critical CSS, lazy loading | Zero font download, <500KB budget, Lighthouse 90+ |
| **6. CRT Effects** | CSS-only with `prefers-reduced-motion` | Accessibility-first, performant, user-controlled |
| **7. Data Loading** | Fetch API + native `<dialog>` | No library, robust error handling, accessible modals |
| **8. Animations** | Intersection Observer (not scroll events) | 10-100x better performance, 98.7% browser support |

---

## Next Steps

1. **Prototype ASCII logo variants** using FIGlet script
2. **Set up design token system** in `docs/css/ascii-core.css`
3. **Implement accessibility layer** for existing ASCII art
4. **Create responsive breakpoint tests** for box-drawing characters
5. **Run Lighthouse audit** on current site to establish baseline
6. **Build CRT effect toggle** with motion preference detection
7. **Develop gallery fetch logic** with error handling
8. **Add Intersection Observer** for scroll reveals

---

**Document Version**: 1.0
**Last Updated**: 2025-10-25
**Research Conducted By**: Claude (Sonnet 4.5)
**Sources**: 40+ web searches across MDN, web.dev, Smashing Magazine, CSS-Tricks, DEV Community
