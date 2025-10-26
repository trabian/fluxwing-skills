# Quickstart Guide: GitHub Pages ASCII-First Redesign

**Feature**: 001-github-pages-ascii-redesign
**Audience**: Developers contributing to the site redesign
**Time**: ~5 minutes to setup, ongoing development

---

## Prerequisites

**Required**:
- Git installed
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Code editor (VS Code, Sublime, Vim, etc.)

**Optional** (for local server):
- Python 3.x (for `python -m http.server`)
- Node.js (for `npx serve`)

**Not Required**:
- No build tools (no npm install, no webpack, no bundler)
- No framework (pure vanilla HTML/CSS/JS)

---

## Quick Setup (30 seconds)

### 1. Clone Repository

```bash
git clone https://github.com/trabian/fluxwing-skills.git
cd fluxwing-skills
```

### 2. Checkout Feature Branch

```bash
git checkout 001-github-pages-ascii-redesign
```

### 3. Navigate to Site Source

```bash
cd docs
```

### 4. Start Local Server

**Option A: Python** (if installed):
```bash
python3 -m http.server 8000
```

**Option B: Node.js** (if installed):
```bash
npx serve .
```

**Option C: VS Code** (if using):
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

### 5. Open Browser

```
http://localhost:8000
```

or

```
http://localhost:3000  (if using npx serve)
```

You should see the ASCII-first homepage!

---

## Development Workflow

### File Structure

```
docs/                       ← You'll work here
├── index.html              ← Home page (edit sections)
├── why.html                ← Why Fluxwing page
├── use-cases.html          ← Use cases page
├── 404.html                ← Error page
├── reference/              ← Documentation pages
│   ├── architecture.html
│   ├── commands.html
│   ├── getting-started.html
│   └── how-skills-work.html
├── css/                    ← Stylesheets
│   ├── ascii-core.css      ← Design system (colors, typography, spacing)
│   ├── crt-effects.css     ← Optional CRT screen effects
│   ├── components.css      ← Reusable components (buttons, cards, nav)
│   ├── responsive.css      ← Breakpoints and mobile styles
│   └── animations.css      ← Keyframes and transitions
├── js/                     ← JavaScript modules
│   ├── main.js             ← Core interactions (nav, mobile menu)
│   ├── ascii-art.js        ← Typewriter effect, blinking cursor
│   ├── terminal-demo.js    ← Animated terminal sequences
│   └── gallery.js          ← Component gallery (filters, modal)
└── assets/                 ← Images, ASCII art, logos
    ├── fluxwing-logo.txt   ← ASCII art logo
    ├── decorations/        ← ASCII dividers, icons
    ├── trabian.svg         ← Trabian logo
    └── favicon.svg         ← Favicon
```

### Making Changes

1. **Edit HTML/CSS/JS files** in `docs/` directory
2. **Save file**
3. **Refresh browser** (Ctrl+R or Cmd+R)
4. **See changes immediately** (no build step!)

### Testing Responsive Design

**In Browser DevTools**:
1. Open DevTools (F12 or Cmd+Option+I)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M or Cmd+Shift+M)
3. Select device presets:
   - iPhone SE (375×667) → Mobile (xs)
   - iPad (768×1024) → Tablet (md)
   - Desktop (1920×1080) → Desktop (lg)
4. Test ASCII alignment at each breakpoint

**Breakpoints** (from `responsive.css`):
- **xs**: <32rem (512px) — Mobile portrait
- **sm**: 32-48rem (512-768px) — Mobile landscape, small tablets
- **md**: 48-64rem (768-1024px) — Tablets, small desktops
- **lg**: ≥64rem (1024px+) — Desktops, large screens

---

## Testing Checklist

### Before Committing Changes

#### 1. Visual Testing

- [ ] Test all breakpoints (xs, sm, md, lg)
- [ ] Check ASCII alignment (no broken borders)
- [ ] Verify monospace font loads (IBM Plex Mono)
- [ ] Test in multiple browsers:
  - [ ] Chrome/Edge (Chromium)
  - [ ] Firefox
  - [ ] Safari (if on macOS)

#### 2. Accessibility Testing

**Keyboard Navigation**:
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible
- [ ] No keyboard traps
- [ ] ESC closes modals

**Screen Reader** (optional but recommended):
- [ ] Install NVDA (Windows) or VoiceOver (macOS)
- [ ] Tab through page with screen reader active
- [ ] Verify ASCII art is hidden or labeled correctly
- [ ] Check heading hierarchy (H1 → H2 → H3)

**Automated Tools**:
- [ ] Run **Lighthouse** audit (DevTools → Lighthouse tab)
  - Target: 90+ in all categories
- [ ] Run **axe DevTools** (browser extension)
  - Target: 0 violations

#### 3. Performance Testing

**Lighthouse Metrics** (DevTools → Lighthouse):
- [ ] Performance: 90+
- [ ] Accessibility: 90+
- [ ] Best Practices: 90+
- [ ] SEO: 90+

**Check**:
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Total page size < 500KB (Network tab)

#### 4. Functional Testing

- [ ] Navigation links work
- [ ] Mobile hamburger menu opens/closes
- [ ] Gallery filters work (if implemented)
- [ ] Component modal opens/closes (if implemented)
- [ ] Copy-to-clipboard works for code blocks (if implemented)
- [ ] Scroll animations trigger (if implemented)

---

## Common Tasks

### Adding a New Section to index.html

1. Find insertion point in `docs/index.html`
2. Copy existing section structure
3. Update ASCII border characters
4. Update content
5. Add corresponding CSS in `docs/css/components.css` if needed
6. Test responsive behavior

**Template**:
```html
<section class="ascii-section" aria-labelledby="section-title">
  <pre aria-hidden="true" class="ascii-border">
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
  </pre>

  <h2 id="section-title">Section Title</h2>

  <div class="section-content">
    <!-- Your content here -->
  </div>

  <pre aria-hidden="true" class="ascii-border">
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
  </pre>
</section>
```

### Modifying CSS Design Tokens

1. Open `docs/css/ascii-core.css`
2. Find `:root` selector (line ~10)
3. Modify CSS custom properties:
   - Colors: `--ascii-*`
   - Spacing: `--space-*`
   - Typography: `--font-*`
4. Changes apply globally (all components reference these tokens)

**Example**:
```css
:root {
  --ascii-text: #33ff33;          /* Change green to another color */
  --ascii-cyan: #00ffff;          /* Change accent color */
  --space-2ch: 2ch;               /* Adjust spacing */
}
```

### Adding a New Component to Gallery

1. Component files MUST exist in `.claude/skills/*/templates/`
2. Open `docs/js/gallery.js`
3. Add component to manifest:

```javascript
const components = [
  {
    id: "your-component",
    name: "Your Component",
    category: "button", // or "input", "card", "form", "screen"
    uxmPath: ".claude/skills/uxscii-component-creator/templates/your-component.uxm",
    mdPath: ".claude/skills/uxscii-component-creator/templates/your-component.md",
    description: "Brief description for card"
  }
];
```

4. Test gallery filter and modal

### Creating ASCII Art

**For Logos** (use FIGlet):
```bash
# Install FIGlet (macOS)
brew install figlet

# Generate logo variants
figlet -f standard -c -w 64 "FLUXWING" > docs/assets/fluxwing-logo-64.txt
figlet -f small -c -w 32 "FLUXWING" > docs/assets/fluxwing-logo-32.txt
figlet -f mini -c -w 20 "FLUXWING" > docs/assets/fluxwing-logo-20.txt
```

**For Borders** (manual):
- Use Unicode box-drawing characters (U+2500–U+257F)
- Ensure all lines have equal length (pad with spaces)
- Test in monospace font

**Recommended Editors**:
- VS Code with "ASCII Decorator" extension
- Online: https://www.asciiart.eu/
- Manual: Any text editor with monospace font

---

## Troubleshooting

### ASCII Borders Don't Align

**Cause**: Non-monospace font or missing characters

**Fix**:
1. Check font-family in CSS (MUST be IBM Plex Mono or monospace fallback)
2. Verify all lines have equal length
3. Use only ASCII + Unicode box-drawing characters
4. Test in DevTools with monospace font inspector

### Page Doesn't Update After Changes

**Cause**: Browser cache

**Fix**:
1. Hard reload: Ctrl+Shift+R (Windows) or Cmd+Shift+R (macOS)
2. Or: Open DevTools → Network tab → Check "Disable cache"

### JavaScript Not Working

**Cause**: Syntax error or file not loaded

**Fix**:
1. Open DevTools → Console tab
2. Check for error messages
3. Verify script `<script src="js/main.js">` path is correct
4. Ensure JS file is saved

### Lighthouse Score Low

**Cause**: Missing optimizations

**Fix**:
- **Performance**: Add `font-display: swap` to fonts, lazy load below-fold images
- **Accessibility**: Add ARIA labels, check color contrast, test keyboard nav
- **Best Practices**: Use HTTPS (GitHub Pages auto-enables), check console for errors
- **SEO**: Add meta description, title, Open Graph tags

---

## Git Workflow

### Creating a Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### Making Changes

```bash
# Edit files in docs/
git add docs/
git commit -m "feat(homepage): add new value proposition section"
```

**Commit Message Format** (Conventional Commits):
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Scopes: homepage, why-page, docs, css, js, accessibility, performance
```

### Pushing Changes

```bash
git push origin feature/your-feature-name
```

### Opening Pull Request

1. Go to GitHub repository
2. Click "Pull Requests" → "New Pull Request"
3. Select your branch
4. Fill in PR template:
   - **Title**: Same as commit message
   - **Description**: What changed and why
   - **Screenshots**: Before/after if visual change
   - **Testing**: Checklist of what you tested
5. Request review
6. Address feedback
7. Merge when approved

---

## Reference Links

### Documentation

- **Design Plan**: `GITHUB_PAGES_REDESIGN_PLAN.md` (comprehensive design guide)
- **TODO**: `GITHUB_PAGES_TODO.md` (phase-based checklist)
- **Spec**: `specs/001-github-pages-ascii-redesign/spec.md` (feature requirements)
- **Plan**: `specs/001-github-pages-ascii-redesign/plan.md` (implementation plan)
- **Research**: `specs/001-github-pages-ascii-redesign/research.md` (technical decisions)
- **Data Model**: `specs/001-github-pages-ascii-redesign/data-model.md` (content structure)

### External Resources

- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse
- **axe DevTools**: https://www.deque.com/axe/devtools/
- **IBM Plex Mono**: https://fonts.google.com/specimen/IBM+Plex+Mono
- **Box-Drawing Characters**: https://en.wikipedia.org/wiki/Box-drawing_character
- **FIGlet**: http://www.figlet.org/

### Tools

- **Lighthouse**: Built into Chrome DevTools
- **axe DevTools**: Browser extension (Chrome, Firefox)
- **NVDA Screen Reader**: https://www.nvaccess.org/ (Windows)
- **VoiceOver**: Built into macOS (Cmd+F5)
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/

---

## Getting Help

### Stuck on Something?

1. **Check existing documentation** (GITHUB_PAGES_REDESIGN_PLAN.md, TODO.md)
2. **Search GitHub issues** for similar problems
3. **Ask in PR comments** if working on a specific feature
4. **Open new issue** if bug or unclear requirement

### Want to Contribute?

1. Read `CLAUDE.md` for project architecture
2. Review existing code in `docs/`
3. Pick a task from `GITHUB_PAGES_TODO.md`
4. Follow this quickstart guide
5. Open PR with your changes

---

## Next Steps

1. ✅ Setup complete? You should see the site in browser
2. 📖 Read `GITHUB_PAGES_REDESIGN_PLAN.md` for design details
3. ✅ Run through testing checklist above
4. 🛠️ Make changes to `docs/` files
5. 🧪 Test changes at all breakpoints
6. ✅ Run Lighthouse + axe DevTools
7. 🚀 Commit and push changes
8. 📝 Open pull request

---

**Document Version**: 1.0
**Last Updated**: 2025-01-26
**Questions?** Open an issue on GitHub
