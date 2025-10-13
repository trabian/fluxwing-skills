# Fluxwing GitHub Pages Website - TODO Tracker

**Plan Document**: `2025-10-13-fluxwing-github-pages-site.md`
**Started**: 2025-10-13
**Status**: Planning Complete, Implementation Pending

---

## Phase 1: Project Setup & Foundation

### Directory Structure
- [ ] Create `docs/` directory
- [ ] Create `docs/css/` directory
- [ ] Create `docs/js/` directory
- [ ] Create `docs/assets/` directory
- [ ] Create `docs/assets/examples/` directory

### GitHub Pages Configuration
- [ ] Create `docs/CNAME` file with "fluxwing.com"
- [ ] Create `docs/.nojekyll` file (empty)
- [ ] Enable GitHub Pages in repository settings
- [ ] Set GitHub Pages source to `docs/` directory
- [ ] Configure custom domain in GitHub settings

### DNS Configuration
- [ ] Add A records for fluxwing.com (4 records)
- [ ] Add CNAME record for www.fluxwing.com
- [ ] Add TXT record for GitHub domain verification
- [ ] Wait for DNS propagation (up to 24 hours)
- [ ] Verify DNS with `dig fluxwing.com`

### Package Setup (Optional)
- [ ] Create `docs/package.json` if using Vite
- [ ] Install dependencies (`npm install`)
- [ ] Test dev server (`npm run dev`)

### Phase 1 Verification
- [ ] All directories exist
- [ ] CNAME and .nojekyll files created
- [ ] GitHub Pages enabled in settings
- [ ] DNS records configured
- [ ] Custom domain shows "DNS check successful"

---

## Phase 2: xterm.js-First Architecture & Minimal Styling

### Minimal CSS Development
- [ ] Create `docs/css/base.css`
  - [ ] Add basic reset (margin, padding, box-sizing)
  - [ ] Set html/body to 100% width/height
  - [ ] Set black background (#000000)
  - [ ] Create `#app` flex container
  - [ ] Create `.terminal-container` for positioning
  - [ ] Style `#hero-terminal` (full viewport height)
  - [ ] Style `.section-terminal` (minimum heights)
  - [ ] Add mobile breakpoints (@media queries)
  - [ ] Add `.sr-only` class for accessibility
  - [ ] Add `.skip-link` for keyboard navigation
  - [ ] Add print styles (disable terminals, show fallback)

### JavaScript Configuration
- [ ] Create `docs/js/terminal-config.js`
  - [ ] Export `TERMINAL_THEME` object (ANSI colors)
  - [ ] Export `TERMINAL_OPTIONS` object (xterm.js config)
  - [ ] Create `getResponsiveTerminalOptions()` function
  - [ ] Export `ANSI` object with escape codes
  - [ ] Add ANSI color constants (BLACK, RED, GREEN, etc.)
  - [ ] Add ANSI style constants (BOLD, DIM, UNDERLINE, etc.)
  - [ ] Add compound helper functions (success, error, info, comment, prompt, header)

### Terminal Layout Helpers
- [ ] Create `docs/js/terminal-layout.js`
  - [ ] Create `createBox()` - ASCII box drawing
  - [ ] Create `createSectionHeader()` - ASCII header with title
  - [ ] Create `createLink()` - ANSI styled links
  - [ ] Create `createButton()` - ASCII button with REVERSE styling
  - [ ] Create `createColumns()` - multi-column layout
  - [ ] Create `centerText()` - horizontal centering
  - [ ] Create `createProgressBar()` - ASCII progress indicator
  - [ ] Create `createList()` - bulleted list
  - [ ] Create `createTable()` - ASCII table with borders

### Phase 2 Verification
- [ ] Minimal CSS validates (W3C CSS Validator)
- [ ] No visual styling in CSS (only positioning)
- [ ] Terminal config exports proper objects
- [ ] ANSI escape codes are correctly formatted
- [ ] Layout helpers are pure functions
- [ ] Page is entirely black before terminals load
- [ ] All content will render through xterm.js
- [ ] Responsive terminal sizing works
- [ ] No custom fonts needed (uses Courier New)

---

## Phase 3: Content Structure & HTML Pages

### Main HTML Page
- [ ] Create `docs/index.html`
  - [ ] Add HTML5 doctype and structure
  - [ ] Add meta tags (charset, viewport, description)
  - [ ] Add Open Graph tags for social sharing
  - [ ] Add Twitter Card tags
  - [ ] Link CSS files (terminal.css, layout.css)
  - [ ] Link xterm.js CSS from CDN
  - [ ] Create hero section with terminal placeholder
  - [ ] Create "What is Fluxwing" section
  - [ ] Create "AI-Human Feedback Loop" section
  - [ ] Create installation section with code block
  - [ ] Create features section with grid
  - [ ] Create live example section
  - [ ] Create documentation links section
  - [ ] Create footer with ASCII art
  - [ ] Link JavaScript files (main.js as module)

### ASCII Art Assets
- [ ] Create `docs/assets/examples/login-screen.txt`
- [ ] Create `docs/assets/examples/button-component.txt`
- [ ] Create `docs/assets/examples/dashboard.txt`
- [ ] Create additional examples as needed

### Phase 3 Verification
- [ ] HTML validates (W3C HTML Validator)
- [ ] All meta tags present
- [ ] All sections render correctly
- [ ] ASCII art displays without encoding issues
- [ ] Internal links work
- [ ] External links are correct
- [ ] Color contrast meets WCAG AA

---

## Phase 4: Terminal Animations with xterm.js

### JavaScript Development
- [ ] Create `docs/js/terminal-animations.js`
  - [ ] Import xterm.js
  - [ ] Create `createTerminal()` function
  - [ ] Create `typeText()` function
  - [ ] Create `typeLine()` function
  - [ ] Create `displayASCII()` function
  - [ ] Create `clearTerminal()` function
  - [ ] Create `prompt()` function
  - [ ] Create `success()` function
  - [ ] Create `info()` function
  - [ ] Create `comment()` function
  - [ ] Create `sleep()` utility function
  - [ ] Create `heroAnimation()` sequence
  - [ ] Create `feedbackLoopAnimation()` sequence
  - [ ] Create `exampleAnimation()` sequence
  - [ ] Export all functions

- [ ] Create `docs/js/main.js`
  - [ ] Import terminal animation functions
  - [ ] Add DOMContentLoaded listener
  - [ ] Initialize hero terminal
  - [ ] Initialize feedback loop terminal
  - [ ] Initialize example terminal
  - [ ] Set up animation loops with setInterval
  - [ ] Add smooth scrolling for anchor links

### Build Configuration
- [ ] Create `docs/vite.config.js` (if using Vite)
- [ ] Configure base path for GitHub Pages
- [ ] Configure build output directory
- [ ] Test build process

### Phase 4 Verification
- [ ] JavaScript files are valid ES6 modules
- [ ] xterm.js loads correctly
- [ ] No console errors on page load
- [ ] Hero animation plays on load
- [ ] Typing effect looks realistic
- [ ] ASCII art renders in terminals
- [ ] Colored output displays correctly
- [ ] Animations loop smoothly
- [ ] Terminals work on mobile
- [ ] Page performance is good

---

## Phase 5: Deployment & Custom Domain Configuration

### GitHub Actions Workflow
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Configure build job
- [ ] Configure deploy job
- [ ] Test workflow on push

### Repository Configuration
- [ ] Go to Settings → Pages
- [ ] Set source to "docs" directory
- [ ] Add custom domain: fluxwing.com
- [ ] Wait for DNS check to succeed
- [ ] Enable "Enforce HTTPS" checkbox

### Domain Verification
- [ ] Go to Organization Settings → Pages
- [ ] Add fluxwing.com to verified domains
- [ ] Add TXT record to DNS
- [ ] Wait for verification

### SSL & HTTPS
- [ ] Wait for HTTPS certificate issuance (after DNS propagation)
- [ ] Test HTTPS access: https://fluxwing.com
- [ ] Verify HTTP → HTTPS redirect
- [ ] Check for mixed content warnings

### Documentation
- [ ] Create `docs/DEPLOYMENT.md`
- [ ] Document automatic deployment process
- [ ] Document manual deployment steps
- [ ] Document DNS configuration
- [ ] Add troubleshooting section

### Phase 5 Verification
- [ ] GitHub Actions workflow runs successfully
- [ ] Build completes without errors
- [ ] Deployment succeeds
- [ ] DNS resolves correctly (`dig fluxwing.com`)
- [ ] SSL certificate issued
- [ ] HTTPS works without warnings
- [ ] Site accessible at https://fluxwing.com
- [ ] All assets load correctly
- [ ] Animations work on production

---

## Phase 6: Testing, Optimization & Launch

### Performance Optimization
- [ ] Add lazy loading for terminals (IntersectionObserver)
- [ ] Add `will-change` CSS properties for animations
- [ ] Inline critical CSS (optional)
- [ ] Minify JavaScript and CSS
- [ ] Test page load speed

### SEO Enhancements
- [ ] Add comprehensive meta keywords
- [ ] Add structured data (JSON-LD)
- [ ] Add canonical URL
- [ ] Add preconnect for external resources
- [ ] Create `docs/robots.txt`
- [ ] Create `docs/sitemap.xml`

### Analytics (Optional)
- [ ] Choose analytics provider (Plausible or Google Analytics)
- [ ] Add analytics script to HTML
- [ ] Test analytics tracking

### Testing Checklist
- [ ] Create `docs/TESTING.md`
- [ ] Test on Chrome (desktop)
- [ ] Test on Firefox (desktop)
- [ ] Test on Safari (desktop)
- [ ] Test on Edge (desktop)
- [ ] Test on Chrome Mobile (Android)
- [ ] Test on Safari Mobile (iOS)
- [ ] Test all terminal animations
- [ ] Test responsive design (multiple screen sizes)
- [ ] Test keyboard navigation
- [ ] Test with screen reader (NVDA, JAWS, or VoiceOver)
- [ ] Run Lighthouse audit (Performance ≥ 90)
- [ ] Run Lighthouse audit (Accessibility ≥ 90)
- [ ] Run Lighthouse audit (Best Practices ≥ 90)
- [ ] Run Lighthouse audit (SEO ≥ 90)
- [ ] Check color contrast (WCAG AA)
- [ ] Verify all links work
- [ ] Test installation instructions

### Launch Preparation
- [ ] Create `docs/LAUNCH.md`
- [ ] Draft social media posts (Twitter/X)
- [ ] Draft GitHub Discussions announcement
- [ ] Draft blog post (Dev.to/Hashnode)
- [ ] Update main README.md with website link
- [ ] Update fluxwing/README.md with website link

### Final Verification
- [ ] All Lighthouse scores ≥ 90
- [ ] No console errors
- [ ] No broken links
- [ ] HTML validates
- [ ] CSS validates
- [ ] JavaScript error-free
- [ ] Cross-browser testing complete
- [ ] Mobile experience excellent
- [ ] Content accurate
- [ ] Team approval received

### Launch
- [ ] Submit to Google Search Console
- [ ] Post social media announcements
- [ ] Post GitHub Discussions announcement
- [ ] Publish blog post
- [ ] Announce in relevant communities
- [ ] Monitor analytics
- [ ] Monitor for issues/feedback

---

## Post-Launch

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Monitor analytics weekly
- [ ] Monitor GitHub issues for feedback
- [ ] Monitor performance metrics

### Iteration
- [ ] Gather user feedback
- [ ] Make refinements based on feedback
- [ ] Consider adding interactive terminal features
- [ ] Consider creating video tutorials
- [ ] Plan community building efforts

---

## Notes & Blockers

### Current Blockers
- DNS configuration requires access to domain registrar
- Domain verification requires organization admin access

### Important Reminders
- DNS propagation can take up to 24 hours
- HTTPS certificate takes ~1 hour after DNS propagation
- Test animations on actual mobile devices, not just browser emulation
- Verify ASCII art displays correctly in different terminals/browsers

### Context for Future Sessions
- This is a marketing site for Fluxwing Claude Code plugin
- Repository: fluxwing-marketplace on GitHub
- Target aesthetic: 90s Unix terminal with ANSI colors
- Custom domain: fluxwing.com
- Primary goal: Showcase AI-native UX design capabilities
- Secondary goal: Drive plugin installations

---

## Session Log

### Session 1 - 2025-10-13
- Created implementation plan
- Created this TODO tracker
- Revised Phase 2 to be xterm.js-first (entire site rendered in terminals)
- Removed CRT effects and custom CSS styling
- Added terminal-config.js and terminal-layout.js modules
- Status: Ready to begin Phase 1 implementation

### Key Architectural Decisions
- **xterm.js-First**: Entire site is composed of xterm.js terminal instances
- **Minimal CSS**: Only positioning/layout structure, no visual styling
- **ANSI Escape Codes**: All colors, styles, and formatting via ANSI
- **ASCII Art UI**: Buttons, links, boxes, tables all rendered as ASCII
- **Responsive Terminals**: Font size and columns adapt to viewport width
