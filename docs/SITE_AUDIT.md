# GitHub Pages Site Audit - Fluxwing Skills

**Date**: October 19, 2025
**Status**: Critical broken links found
**Priority**: Fix before public launch

## Executive Summary

The GitHub Pages site has **4 broken documentation links** on the main index.html page, all pointing to non-existent reference documentation. We have excellent source material (README.md, INSTALL.md, CLAUDE.md, and 6 SKILL.md files) that can be converted into these missing pages.

**Estimated time to fix**: 12-17 hours across 3 phases

---

## Broken Links Found

### From index.html (Section: Documentation hub)
All links in the "#docs" section point to non-existent files:
- ❌ `reference/agents.html` - MISSING
- ❌ `reference/architecture.html` - MISSING
- ❌ `reference/commands.html` - MISSING
- ❌ `reference/getting-started.html` - MISSING

---

## Navigation Inconsistencies

### Header Navigation
- **index.html**: No header (only has hero section)
- **why.html**: Has header with links to Why Fluxwing, Install, Docs, GitHub
- **use-cases.html**: Has header with links to Why, Use Cases, Install, Docs

**Issue**: Missing "Use Cases" link in why.html header, and index.html has no header at all.

---

## Content Gaps

### 1. Missing Documentation Pages (Priority: HIGH)

#### A. Getting Started Guide (`reference/getting-started.html`)
Should include:
- Quick installation steps (reference to INSTALL.md)
- First component creation walkthrough
- Basic skill usage examples
- Link to full command reference

**Source Material**:
- INSTALL.md (405 lines)
- README.md Quick Start section
- .claude/skills/uxscii-component-creator/SKILL.md

**Estimated Time**: 2-3 hours

---

#### B. Command Reference (`reference/commands.html`)
Should document all 6 skills:
- uxscii-component-creator - Create components
- uxscii-library-browser - Browse templates
- uxscii-component-expander - Add states
- uxscii-screen-scaffolder - Build screens
- uxscii-component-viewer - View details
- uxscii-screenshot-importer - Import from screenshots

**Source Material**:
- Each skill's SKILL.md file
- README.md skills section

**Estimated Time**: 3-4 hours

---

#### C. Architecture Overview (`reference/architecture.html`)
Should explain:
- Skills system architecture
- Two-file component system (.uxm + .md)
- Data location philosophy (bundled vs workspace)
- Schema and validation
- The derivation model

**Source Material**:
- CLAUDE.md (383 lines) - comprehensive architecture guide
- README.md architecture section

**Estimated Time**: 2-3 hours

---

#### D. Agents Reference (`reference/agents.html`)
**Decision Required**: This may no longer be relevant since the architecture moved from custom agents to general-purpose agents with embedded instructions.

**Options**:
1. Remove this link entirely (simplest)
2. Repurpose as "How Skills Work" explaining the agent invocation model
3. Create troubleshooting/FAQ page instead

**Recommendation**: Remove the link or replace with "FAQ" page

---

### 2. Missing Navigation Elements

- ❌ Consistent header across all pages
- ❌ Breadcrumb navigation on reference pages
- ❌ "Back to top" links on long pages
- ❌ Footer links are inconsistent

---

### 3. Missing Utility Pages

- ❌ 404 error page (`404.html`)
- ❌ Sitemap
- ❌ Search functionality (nice-to-have)

---

### 4. Content Quality Issues

#### index.html
- ✅ Good: Hero, features, workflow, gallery placeholder
- ⚠️ Gallery section references `data-gallery` but gallery-data.js may not populate it correctly
- ❌ Missing: Actual component examples in gallery

#### why.html
- ✅ Good: Clear value proposition, comparison table
- ✅ Good: Problem/solution framing

#### use-cases.html
- ⚠️ Needs more concrete examples
- ❌ No code samples or screenshots

---

## Recommended Fixes (Prioritized)

### Phase 1: Critical (Fix Broken Links)
**Goal**: Make all links on index.html work
**Time**: 8-10 hours

1. ✅ Create `docs/reference/` directory
2. Create `reference/getting-started.html` - Convert INSTALL.md + quick start
3. Create `reference/commands.html` - Document all 6 skills
4. Create `reference/architecture.html` - Convert CLAUDE.md architecture sections
5. **Decision**: Remove `reference/agents.html` link OR repurpose as FAQ

---

### Phase 2: Navigation Consistency
**Goal**: Consistent user experience across all pages
**Time**: 1-2 hours

6. Add consistent header navigation to index.html
7. Standardize header across all pages (same links, same order)
8. Add breadcrumbs to reference pages
9. Create 404.html page

---

### Phase 3: Content Enhancement (Optional)
**Goal**: Rich, engaging documentation
**Time**: 4-5 hours

10. Populate gallery with actual component examples from templates
11. Add code examples to use-cases.html
12. Add interactive component viewer (optional)
13. Add search functionality (optional)

---

## Available Source Material

### Rich Documentation Sources
- ✅ README.md (344 lines) - Overview, quick start, skills list
- ✅ INSTALL.md (405 lines) - Comprehensive installation guide
- ✅ CLAUDE.md (383 lines) - Architecture, workflows, file references
- ✅ 6× SKILL.md files - Detailed skill documentation
- ✅ Schema files and templates - Examples for documentation

### Templates Available
- ✅ 11 component templates in uxscii-component-creator/templates/
- ✅ 2 screen templates in uxscii-screen-scaffolder/templates/
- ✅ docs/css/docs.css - Styling for documentation pages

---

## Implementation Plan

### Quick Fix (Immediate)
If you need a working site NOW:
1. Comment out or remove the broken links from index.html #docs section
2. Add a note: "Documentation coming soon"
3. Push to fix/github-pages-v2 branch

### Proper Fix (Recommended)
1. Start with Phase 1 (create missing documentation pages)
2. Use existing markdown files as source material
3. Follow the structure of docs/css/docs.css for styling
4. Test locally with `npm run docs:dev` before pushing
5. Complete Phase 2 for polish
6. Consider Phase 3 for launch readiness

---

## Estimated Total Work

- **Phase 1 (Critical)**: 8-10 hours
- **Phase 2 (Navigation)**: 1-2 hours
- **Phase 3 (Enhancement)**: 4-5 hours

**Total**: 12-17 hours of work

---

## Next Steps

1. **Immediate**: Decide whether to do quick fix or proper fix
2. **If proper fix**: Start with getting-started.html (highest user value)
3. **Then**: Commands reference (most requested)
4. **Finally**: Architecture overview (for advanced users)

---

## Notes

- All HTML files use inline styles currently - could be refactored to use docs.css
- Gallery data exists in `docs/js/gallery-data.js` but may need verification
- Consider adding analytics to track which documentation is most accessed
