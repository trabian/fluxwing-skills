# Screenshot Importer Orchestration Fix

**Date:** 2025-11-08
**Author:** Trabian
**Status:** Implemented
**Skills:** fluxwing-screenshot-importer, fluxwing-screen-scaffolder

## Problem Statement

When users request multiple screenshots to be imported (e.g., "create pages for all screenshots in the root folder"), the screenshot-importer:

1. **Creates screen files directly** using Write tool instead of delegating to screen-scaffolder
2. **Bypasses orchestration entirely** - never invokes the screen-scaffolder skill
3. **Results in worker mode** - orchestrator does work instead of spawning agents

**Root Cause:**
- Screenshot-importer Phase 5 said "generate screen files directly (screen generation is fast, no need for agent)"
- This violated orchestration principles - orchestrator should delegate, not execute
- Screen-scaffolder multi-screen fixes were never utilized because importer bypassed it

**Example failure (11 screenshots):**
```
> use fluxwing to scaffold pages for all screenshots

⏺ Screenshot-importer analyzing screenshots... ✓
⏺ Creating components... ✓
⏺ Write(fluxwing/screens/dashboard.uxm)           ← WRONG! Doing work itself
⏺ Write(fluxwing/screens/dashboard.md)
⏺ Write(fluxwing/screens/dashboard.rendered.md)
... (repeated 11 times)
```

**What should happen:**
```
⏺ Screenshot-importer analyzing screenshots... ✓
⏺ Creating components... ✓
⏺ Delegating to screen-scaffolder...
> The "Fluxwing Screen Scaffolder" skill is loading
⏺ Task(Compose dashboard screen)                  ← Scaffolder spawns agents
⏺ Task(Compose users screen)
⏺ Task(Compose api-keys screen)
... (11 parallel composer agents)
```

## Design Solution

### 1. Fix Screenshot-Importer Phase 5

**Location:** `skills/fluxwing-screenshot-importer/SKILL.md` (Phase 5, line 227)

**Problem:** Phase 5 said "generate the screen files directly"

**Fix:** Replace with delegation to screen-scaffolder skill

**Single Screen Import:**
```typescript
// After all components created:
Skill({ command: "fluxwing-skills:fluxwing-screen-scaffolder" })

// Tell scaffolder:
// "I've imported 1 screenshot and created X components.
//  Please compose this screen: [name and component list]"
```

**Multiple Screenshots Import (N > 1):**
```typescript
// After analyzing ALL screenshots and creating ALL components:
Skill({ command: "fluxwing-skills:fluxwing-screen-scaffolder" })

// Tell scaffolder:
// "I've imported N screenshots and created X components.
//  Please compose these N screens: [list screen names and component lists]"

// Scaffolder will:
// 1. Detect multi-screen scenario (N > 1)
// 2. Confirm with user
// 3. Skip component creation (all exist)
// 4. Spawn N composer agents in parallel
// 5. Each creates .uxm + .md + .rendered.md
```

### 2. Add Orchestration Rules to Screenshot-Importer

**Location:** `skills/fluxwing-screenshot-importer/SKILL.md` (Your Task section)

Add clear orchestration boundaries:

```markdown
**⚠️ ORCHESTRATION RULES:**

**YOU CAN (as orchestrator):**
- ✅ Spawn vision analysis agents
- ✅ Spawn component generator agents
- ✅ Invoke fluxwing-screen-scaffolder skill
- ✅ Read screenshots
- ✅ Validate vision data

**YOU CANNOT (worker mode - forbidden):**
- ⚠️ Create screen files yourself using Write/Edit tools
- ⚠️ Generate .uxm, .md, or .rendered.md files for screens
- ⚠️ "Help" the scaffolder by pre-creating screen files
- ⚠️ Use TodoWrite to work through screen creation tasks yourself

**For screen composition:** ALWAYS delegate to fluxwing-screen-scaffolder skill.
```

### 3. Ensure Screen-Scaffolder is Ready for Multi-Screen

**Already implemented in:** `2025-11-05-multi-screen-rendering-fix.md`

Screen-scaffolder now supports:
- Multi-screen detection and confirmation
- Path B workflow (N parallel composer agents)
- Deliverables-first composer prompt
- Verification checklist
- Rationalization blockers

## Implementation Checklist

- [x] Fix screenshot-importer Phase 5 to delegate to scaffolder
- [x] Add orchestration rules to screenshot-importer "Your Task" section
- [x] Verify screen-scaffolder multi-screen support is complete
- [x] Add rationalization blocker section to screen-scaffolder
- [x] Update screenshot-importer to provide screen context to scaffolder
- [x] Test configuration cleanup (remove broken plugin references)
- [ ] User reinstalls plugin and tests with 11-screenshot batch
- [ ] Verify each screen gets all 3 files (.uxm, .md, .rendered.md)

## Success Criteria

**Before fix:**
- User imports 11 screenshots
- Screenshot-importer creates screen files directly (worker mode)
- Only some screens get .rendered.md (inconsistent)
- Orchestration principles violated

**After fix:**
- User imports 11 screenshots
- Screenshot-importer analyzes + creates components
- Screenshot-importer delegates to screen-scaffolder
- Screen-scaffolder spawns 11 parallel composer agents
- All 11 screens get .uxm + .md + .rendered.md
- Total files: 11 × 3 = 33 screen files (+ component files)
- Clean orchestration: importer → scaffolder → composer agents

## Performance Impact

**Multi-screenshot parallel composition:**
- 11 screens sequential (old way if it worked): ~990s (11 × 90s)
- 11 screens parallel (new way): ~90s (all at once)
- **11x performance improvement**

## Testing Plan

1. **Single screenshot** (regression test):
   - "Import this screenshot at /path/to/login.png"
   - Verify workflow: importer → scaffolder → 1 composer agent
   - Verify 3 files created

2. **Multi-screenshot batch** (new feature):
   - "Create pages for all screenshots in root folder" (11 screenshots)
   - Verify workflow: importer → scaffolder → 11 parallel composer agents
   - Verify 33 screen files created (11 × 3)
   - Verify all .rendered.md files present and complete

3. **Edge cases:**
   - Request 1 screenshot (should still delegate, not bypass)
   - Request 20+ screenshots (verify parallel execution scales)
   - Shared components across screens (verify handled by scaffolder)

## Architecture Principles Reinforced

### Orchestration Hierarchy

```
┌─────────────────────────────────────────────────┐
│ Screenshot-Importer Skill (Top Orchestrator)    │
│ - Analyzes screenshots                          │
│ - Creates components (delegates to agents)      │
│ - Delegates screen composition to scaffolder ←──┤
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│ Screen-Scaffolder Skill (Mid Orchestrator)      │
│ - Detects single vs multi-screen                │
│ - Confirms with user                            │
│ - Spawns N composer agents in parallel      ←───┤
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│ Composer Agents (Workers)                       │
│ - Each creates 1 screen's 3 files               │
│ - .uxm + .md + .rendered.md                     │
│ - Run in parallel                               │
└─────────────────────────────────────────────────┘
```

### Clear Boundaries

**Orchestrators:**
- Coordinate work
- Spawn agents
- Invoke skills
- Never use Write/Edit for deliverables

**Workers (Agents):**
- Create actual files
- Generate content
- Execute tasks
- Return results to orchestrators

## Related Files

- `skills/fluxwing-screenshot-importer/SKILL.md` - Importer orchestration logic
- `skills/fluxwing-screen-scaffolder/SKILL.md` - Scaffolder multi-screen support
- `docs/plans/2025-11-05-multi-screen-rendering-fix.md` - Scaffolder enhancements
- `CLAUDE.md` - Repository orchestration philosophy

## Notes

- This fix completes the orchestration architecture for fluxwing skills
- Screenshot-importer now properly delegates instead of doing work itself
- Screen-scaffolder handles both single and multi-screen scenarios
- All agents run in parallel for maximum performance
- Clear separation: orchestrator coordinates, agents execute
- Applies same pattern to both direct scaffolding and screenshot import flows
