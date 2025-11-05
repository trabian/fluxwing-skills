# Multi-Screen Rendering Fix

**Date:** 2025-11-05
**Author:** Trabian
**Status:** Validated Design
**Skill:** fluxwing-screen-scaffolder

## Problem Statement

When users request multiple screens at once (e.g., "create pages for all these screenshots"), the screen scaffolder:

1. **Ignores orchestration instructions** and does work itself (uses Write/Bash/Python instead of spawning agents)
2. **Only creates `.rendered.md` for the first screen** (e.g., dashboard)
3. **Requires manual prompting** to create remaining `.rendered.md` files

**Root Cause:**
- Current orchestration instructions focus on single-screen workflow
- No explicit guidance for multi-screen batch scenarios
- Composer agent instructions don't emphasize `.rendered.md` as THE critical deliverable
- "DO NOT do work yourself" warnings can be rationalized around

## Design Solution

### 1. Multi-Screen Detection & User Confirmation

**Location:** Step 1 (after line 113 in SKILL.md)

**Add detection logic:**

When user's request indicates multiple screens, detect by:
- Plural language ("screens", "pages", "all of them")
- Multiple file references (glob results, screenshot lists)
- Explicit numbers ("5 screens", "all these")

**Add confirmation prompt:**

```
I see you want to create 6 screens:
- dashboard
- users
- settings
- profile
- reports
- analytics

I'll create these in parallel using one composer agent per screen.
Each screen will get all 3 files (.uxm, .md, .rendered.md).

Quality preset: detailed (default)
Estimated time: ~90-120 seconds

Proceed? [Yes/No]
```

**Purpose:**
- Sets clear expectation upfront
- Emphasizes .rendered.md is included
- Gives time estimate

### 2. Multi-Screen Orchestration Strategy

**Location:** New workflow branch after Step 2 (Component Inventory)

**Two workflow paths:**

**Path A: Single Screen** (existing)
- Step 3: Create missing components (parallel)
- Step 4: Spawn ONE composer agent
- Step 5: Enhancement

**Path B: Multiple Screens** (NEW)
- Step 3: Create missing components across ALL screens
  - Inventory components needed for all screens
  - Deduplicate (shared components created once)
  - Spawn one agent per unique missing component (parallel)

- Step 4: Spawn ONE composer agent PER screen (parallel)
  - Each composer handles exactly one screen
  - Each MUST create .uxm + .md + .rendered.md
  - All composers run simultaneously
  - Example: 6 screens = 6 parallel composer agents

- Step 5: Enhancement (same as Path A)

**Key principle:** In multi-screen mode, spawn N composer agents (one per screen) instead of one.

### 3. Strengthening Composer Agent Instructions

**Location:** Step 4 composer agent prompt (lines 259-358)

**Problem:** `.rendered.md` creation buried in middle of instructions, easy to skip.

**Fix:** Restructure prompt to lead with deliverables:

```typescript
Task({
  subagent_type: "general-purpose",
  model: "sonnet",
  description: "Compose ${screenName}",
  prompt: `You are a uxscii screen composer.

Screen: ${screenName}
Components: ${componentList}

YOUR PRIMARY DELIVERABLE: ${screenName}.rendered.md
This is what the user will see. Everything else supports this.

MANDATORY OUTPUTS (all 3 required):
1. ${screenName}.uxm (metadata)
2. ${screenName}.md (template with {{placeholders}})
3. ${screenName}.rendered.md (REAL data, ACTUAL ASCII) ⚠️ CRITICAL

If you complete without creating .rendered.md, you have FAILED.

[... detailed instructions for PART 1 and PART 2 ...]

VERIFICATION CHECKLIST (before returning):
- [ ] .uxm file created and saved
- [ ] .md template created and saved
- [ ] .rendered.md created with REAL data and ACTUAL component ASCII
- [ ] All 3 files are in ./fluxwing/screens/

Return: "Created ${screenName}: .uxm ✓, .md ✓, .rendered.md ✓"
`
})
```

**Key changes:**
1. Lead with ".rendered.md is THE deliverable"
2. Add verification checklist at end
3. Require specific confirmation format
4. Frame as "you failed if .rendered.md missing"

### 4. Preventing "Worker Mode" Rationalization

**Location A:** After line 44 (orchestration rules)

Add explicit multi-screen rule:

```markdown
**MULTI-SCREEN SCENARIOS:**

If user requests N screens (N > 1):
- Spawn N composer agents in parallel (one per screen)
- Each composer agent independently creates its 3 files
- DO NOT create TodoWrite list with N screen tasks
- DO NOT use Write/Bash/Python to create screen files yourself
- DO NOT "help" the composer agents by pre-creating files

Example: 6 screens = ONE message with 6 Task tool calls (parallel)
```

**Location B:** New section after workflow

Add rationalization detection:

```markdown
## Common Rationalizations That Mean You're Failing

If you catch yourself thinking:
- "I'll just create the files directly, it's faster" → WRONG. Spawn agents.
- "Orchestration is overkill for this batch" → WRONG. That's exactly when you orchestrate.
- "I'll create .uxm and .md myself, agents can do .rendered later" → WRONG. Agents do ALL files.
- "Let me help by creating some files first" → WRONG. Agents are self-sufficient.

STOP. Use the Task tool. You are an orchestrator, not a worker.
```

## Implementation Checklist

- [ ] Add multi-screen detection logic to Step 1
- [ ] Add user confirmation prompt for multi-screen batches
- [ ] Create Path B workflow for multi-screen scenarios
- [ ] Update Step 3 to deduplicate components across screens
- [ ] Modify Step 4 to spawn N parallel composer agents (multi-screen mode)
- [ ] Restructure composer agent prompt (deliverables first)
- [ ] Add verification checklist to composer prompt
- [ ] Add multi-screen orchestration rules after line 44
- [ ] Add rationalization blocker section
- [ ] Test with 6-screen batch scenario
- [ ] Verify each screen gets all 3 files (.uxm, .md, .rendered.md)

## Success Criteria

**Before fix:**
- User requests 6 screens
- Scaffolder creates files directly (worker mode)
- Only dashboard gets .rendered.md
- User must manually request remaining .rendered.md files

**After fix:**
- User requests 6 screens
- Scaffolder spawns 6 parallel composer agents (orchestrator mode)
- All 6 screens get .uxm + .md + .rendered.md
- Total files: 18 (6 × 3)
- No manual follow-up required

## Performance Impact

**Multi-screen parallel execution:**
- 6 screens with sequential composing: ~540s (6 × 90s)
- 6 screens with parallel composing: ~90s (all at once)
- **6x performance improvement**

## Testing Plan

1. **Single screen** (regression test):
   - "Create a login screen"
   - Verify existing workflow unchanged

2. **Multi-screen batch** (new feature):
   - "Create pages for these 6 screenshots"
   - Verify 6 parallel composer agents spawned
   - Verify 18 files created (6 × 3)
   - Verify all .rendered.md files present

3. **Edge cases:**
   - Request 1 screen (should use Path A, not Path B)
   - Request 10+ screens (verify parallel execution scales)
   - Shared components across screens (verify deduplication)

## Related Files

- `skills/fluxwing-screen-scaffolder/SKILL.md` - Main implementation
- `CLAUDE.md` - Update orchestration philosophy section
- `TODO.md` - Track implementation progress

## Notes

- This fix addresses orchestration behavior, not composer agent capability
- The composer agent was always capable of creating .rendered.md (proven when user asked)
- The issue was orchestrator cutting corners in worker mode
- Solution: Make orchestration rules explicit and unambiguous for multi-screen scenarios
