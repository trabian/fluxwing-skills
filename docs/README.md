# Fluxwing GitHub Pages Prototype

This directory contains the in-progress marketing site for Fluxwing. The current build focuses on scaffolding the structure, aesthetic foundation, and progressive enhancement hooks required for the retro terminal experience.

## Working Locally

```bash
npm run ghpages:serve
```

The command serves the static site at `http://localhost:4173`. It uses Python's built-in HTTP server, so no additional dependencies are required.

## Immediate Next Steps

- Replace hero and validator fallbacks with live xterm.js sessions sourced from recorded Fluxwing transcripts.
- Populate the component gallery with real assets from `fluxwing/data/examples/` and add ASCII/metadata toggles.
- Extract marketing copy blocks from the root `README.md` to keep tone and messaging consistent.
- Continue refining copy so the narrative emphasizes Fluxwing’s role in design guidance rather than direct implementation.
- Implement reduced-motion handling for terminal animations and add manual playback controls.
- Add responsive refinements for small screens (nav collapse, tighter spacing, gallery carousel affordances).

## Verification Checklist (v1 Launch)

- [ ] Lighthouse scores ≥ 90 (Performance, Accessibility, Best Practices, SEO).
- [ ] axe-core or manual screen reader review passes (focus order, landmarks, skip link).
- [ ] All documentation and installation links resolve correctly.
- [ ] Open Graph/Twitter cards render expected preview.
- [ ] `CNAME`, DNS, and HTTPS enforcement confirmed in GitHub Pages settings.
- [ ] Manual tests on Chrome, Firefox, Safari, Edge, and mobile breakpoints.

Track additional refinements in `thoughts/shared/plans/2025-10-13-fluxwing-github-pages-site.md`.
