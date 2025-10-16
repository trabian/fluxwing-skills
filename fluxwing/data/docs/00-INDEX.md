# Fluxwing Documentation Index

**Welcome to Fluxwing** - Your AI-native UX design assistant using the uxscii standard.

## Context Optimization Guide for Agents

This index helps you load only the documentation you need, saving context tokens.

### Quick File Size Reference

| File | Tokens | Purpose |
|------|--------|---------|
| 01-quick-start.md | ~400 | 30-second component creation |
| 02-core-concepts.md | ~600 | UXM + template system basics |
| 03-component-creation.md | ~800 | Full creation workflow |
| 04-screen-composition.md | ~700 | Building complete screens |
| 06-ascii-patterns.md | ~500 | Pattern library reference |
| 07-examples-guide.md | ~400 | Guide to bundled examples |
| 07-schema-reference.md | ~300 | Schema documentation pointer |
| screenshot-data-merging.md | ~600 | Vision data merging helpers |
| screenshot-screen-generation.md | ~800 | Screen file generation helpers |
| screenshot-validation-functions.md | ~900 | Validation function implementations |
| **Total (Core)** | **~3400** | Core documentation |
| **Total (With Screenshot)** | **~5700** | Including screenshot helpers |

### Loading Strategies by Task

#### Creating a Single Component
**Load**: 01 → 03 → 06
**Total**: ~1700 tokens
**Why**: Quick start + creation workflow + ASCII patterns

#### Composing Screens
**Load**: 04 → 03 → 06
**Total**: ~2000 tokens
**Why**: Screen composition + component basics + patterns

#### Learning the System
**Load**: 01 → 02 → 03
**Total**: ~1800 tokens
**Why**: Progressive introduction to concepts

#### Screenshot Import (Vision Analysis)
**Load**: screenshot-data-merging.md
**Total**: ~600 tokens
**Why**: Helper functions for merging vision agent outputs

#### Screenshot Import (Screen Generation)
**Load**: screenshot-screen-generation.md
**Total**: ~800 tokens
**Why**: Helper functions for generating screen files

#### Screenshot Import (Validation)
**Load**: screenshot-validation-functions.md
**Total**: ~900 tokens
**Why**: Validation function implementations

#### Deep Dive / Reference
**Load**: All core files
**Total**: ~3400 tokens
**Use**: When you need comprehensive understanding

## Documentation Files

### 01-quick-start.md
Minimal viable component in 30 seconds. Perfect for experienced developers who just need to see the format.

### 02-core-concepts.md
The `.uxm` + `.md` two-file system explained. Understanding this is essential for everything else.

### 03-component-creation.md
Complete step-by-step workflow for creating components. Load this when actively creating.

### 04-screen-composition.md
How to compose complete screens from components. Layout patterns and best practices.

### 06-ascii-patterns.md
ASCII character patterns library. Box-drawing characters, states, form elements, etc.

### 07-examples-guide.md
Guide to using the bundled component examples. Explains the two-phase creation workflow (default state + expansion).

### 07-schema-reference.md
Points to the definitive schema file and explains how to use it.

### screenshot-data-merging.md
Helper functions for merging vision agent outputs during screenshot import. Includes: findSectionForComponent, categorizeComponents, generateScreenName, enrichComponentWithVisualProps.

### screenshot-screen-generation.md
Helper functions for generating screen files (.uxm, .md, .rendered.md) during screenshot import. Includes complete workflow for screen generation with example data.

### screenshot-validation-functions.md
Complete validation function implementations for screenshot import: validateSchema, validateFileIntegrity, validateVariableConsistency, validateComponentReferences, validateBestPractices.

## Additional Resources

### Schema (Definitive Source of Truth)
`../schema/uxm-component.schema.json` - The complete JSON schema for .uxm component files

### Example Components (Learning by Example)
`../examples/` - 11 curated, production-ready components:
- Buttons: primary-button, secondary-button
- Inputs: email-input
- Containers: card
- Overlays: modal
- Navigation: navigation
- Feedback: alert, badge
- Data Display: list
- Forms: form
- Custom: custom-widget

### Example Screens (Real-World Usage)
`../screens/` - Complete screen compositions with rendered examples

### Full UXSCII Documentation (Deep Reference)
The plugin also includes the complete UXSCII agent guide:
- `UXSCII_AGENT_GUIDE.md` - Comprehensive creation guide (~35KB)
- `UXSCII_SCHEMA_GUIDE.md` - Schema deep-dive (~10KB)

**When to use these**: When you need detailed examples, troubleshooting, or advanced techniques not covered in the streamlined docs.

## Common Workflows

### Workflow 1: Create Your First Component
```
1. Read: 01-quick-start.md (understand the format)
2. Read: 03-component-creation.md (full workflow)
3. Load: ../examples/primary-button.{uxm,md} (see example)
4. Create: Your component files
```

### Workflow 2: Build a Complete Screen
```
1. Read: 02-core-concepts.md (understand composition)
2. Read: 04-screen-composition.md (layout patterns)
3. Check: ../examples/ (available components)
4. Create: Missing components (if needed)
5. Compose: Screen files (.uxm, .md, .rendered.md)
```

### Workflow 3: Ensure Quality
```
1. Load: ../schema/uxm-component.schema.json (schema)
2. Check: All validation levels
3. Fix: Errors and warnings
4. Document: Any exceptions or deviations
```

## Context-Saving Tips

1. **Don't load all docs at once** - Load what you need for the current task
2. **Reference examples by path** - Don't read entire example files unless needed
3. **Load schema only when validating** - It's large and detailed
4. **Use quick-start for reminders** - If you've done this before, quick-start is enough
5. **Full UXSCII docs are backup** - Only load when streamlined docs don't answer your question

## File Relationships

```
00-INDEX.md (you are here)
├─ 01-quick-start.md ────────→ Fast reference
├─ 02-core-concepts.md ──────→ Foundation (read first for learning)
├─ 03-component-creation.md ─→ Implementation (references 02, 06)
├─ 04-screen-composition.md ─→ Assembly (references 03, 06)
├─ 06-ascii-patterns.md ─────→ Toolkit (referenced by 03, 04)
└─ 07-schema-reference.md ───→ Spec (referenced by 03)
```

## Getting Help

- **Confused?** Start with 01-quick-start.md for a concrete example
- **Stuck?** Check 03-component-creation.md troubleshooting section
- **Need inspiration?** Browse ../examples/ for patterns
- **Deep dive needed?** Load UXSCII_AGENT_GUIDE.md

## Version Information

- **Plugin Version**: 1.0.0
- **UXSCII Standard**: 1.0.0
- **Schema Version**: 1.1.0 (from uxm-component.schema.json)

Last Updated: 2024-10-11

---

**Ready to start?** Jump to 01-quick-start.md for a 30-second example!
