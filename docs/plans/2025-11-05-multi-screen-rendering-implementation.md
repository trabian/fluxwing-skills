# Multi-Screen Rendering Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix screen scaffolder to create `.rendered.md` for ALL screens in multi-screen batch requests, not just the first one.

**Architecture:** Modify `fluxwing-screen-scaffolder/SKILL.md` to add explicit multi-screen orchestration rules, detection logic, parallel composer spawning, and rationalization blockers. The fix prevents "worker mode" where the orchestrator creates files directly instead of spawning agents.

**Tech Stack:** Markdown (YAML frontmatter skill), Claude Code Task tool orchestration, uxscii component system

---

## Context for Engineer

**Problem:** When users request multiple screens (e.g., "create pages for these 6 screenshots"), the screen scaffolder:
- Ignores orchestration rules and creates files directly using Write/Bash
- Only creates `.rendered.md` for the first screen (e.g., dashboard)
- Requires manual prompting to create remaining `.rendered.md` files

**Root cause:** No explicit guidance for multi-screen batch scenarios. Orchestrator rationalizes that batch processing is a special case and works in "worker mode" instead of spawning agents.

**Solution:** Add explicit multi-screen detection, parallel composer spawning (one per screen), and rationalization blockers.

**Related design doc:** `docs/plans/2025-11-05-multi-screen-rendering-fix.md`

---

## Task 1: Add Multi-Screen Orchestration Rules

**Files:**
- Modify: `skills/fluxwing-screen-scaffolder/SKILL.md:44` (after existing orchestration rules)

**Step 1: Read the current file to locate insertion point**

```bash
head -n 50 skills/fluxwing-screen-scaffolder/SKILL.md | tail -n 10
```

Expected: See lines 40-50 showing orchestration rules ending around line 44

**Step 2: Add multi-screen orchestration section**

Insert after line 44 (after "CRITICAL: Use the Task tool to spawn agents..."):

```markdown
**MULTI-SCREEN SCENARIOS:**

If user requests N screens (N > 1):
- Spawn N composer agents in parallel (one per screen)
- Each composer agent independently creates its 3 files (.uxm, .md, .rendered.md)
- DO NOT create TodoWrite list with N screen tasks
- DO NOT use Write/Bash/Python to create screen files yourself
- DO NOT "help" the composer agents by pre-creating files

Example: 6 screens = ONE message with 6 Task tool calls (parallel)
```

Use Edit tool to insert this block after line 44.

**Step 3: Verify the insertion**

```bash
head -n 60 skills/fluxwing-screen-scaffolder/SKILL.md | tail -n 20
```

Expected: See new multi-screen section between line 44 and existing Quality Presets section

**Step 4: Commit**

```bash
git add skills/fluxwing-screen-scaffolder/SKILL.md
git commit -m "feat: add multi-screen orchestration rules to screen scaffolder

Explicit instructions for handling N > 1 screen requests.
Prevents worker mode rationalization in batch scenarios."
```

---

## Task 2: Add Multi-Screen Detection to Step 1

**Files:**
- Modify: `skills/fluxwing-screen-scaffolder/SKILL.md:113` (end of Step 1 quality preset section)

**Step 1: Locate the insertion point**

```bash
sed -n '100,120p' skills/fluxwing-screen-scaffolder/SKILL.md
```

Expected: See Step 1 ending with quality preset explanation around line 113

**Step 2: Add multi-screen detection section**

Insert after line 113 (after "If user doesn't specify, use **detailed** preset."):

```markdown

**Multi-Screen Detection:**

If the user's request indicates multiple screens, detect by:
- Plural language: "screens", "pages", "all of them"
- Multiple file references: glob pattern results, lists of screenshots
- Explicit numbers: "5 screens", "create these 6 pages"

When detected, confirm with the user:

```
I see you want to create [N] screens:
- [screen-name-1]
- [screen-name-2]
- [screen-name-3]
...

I'll create these in parallel using one composer agent per screen.
Each screen will get all 3 files (.uxm, .md, .rendered.md).

Quality preset: [preset] (default: detailed)
Estimated time: ~[N × 90]s ([N × 1.5] minutes)

Proceed?
```

This sets clear expectations that .rendered.md will be created for ALL screens.
```

Use Edit tool to insert this block after line 113.

**Step 3: Verify the insertion**

```bash
sed -n '113,150p' skills/fluxwing-screen-scaffolder/SKILL.md
```

Expected: See new multi-screen detection section after quality preset explanation

**Step 4: Commit**

```bash
git add skills/fluxwing-screen-scaffolder/SKILL.md
git commit -m "feat: add multi-screen detection and confirmation to Step 1

Detects batch requests using plural language, file lists, and explicit numbers.
Confirms with user upfront that all screens get .rendered.md files."
```

---

## Task 3: Add Workflow Branching Logic After Step 2

**Files:**
- Modify: `skills/fluxwing-screen-scaffolder/SKILL.md:134` (after Step 2 Component Inventory section)

**Step 1: Locate Step 2 ending**

```bash
sed -n '115,140p' skills/fluxwing-screen-scaffolder/SKILL.md
```

Expected: See Step 2 ending with "List what exists vs what needs to be created." around line 134

**Step 2: Add workflow branching section**

Insert after the inventory check code example (around line 134):

```markdown

### Workflow Branching: Single vs Multi-Screen

After component inventory, choose the appropriate workflow:

**Path A: Single Screen** (existing workflow, N = 1)
- Proceed to Step 3 → Step 4 (one composer) → Step 5

**Path B: Multiple Screens** (NEW, N > 1)
- Step 3: Create missing components across ALL screens
  - Inventory components needed for ALL screens
  - Deduplicate shared components (if dashboard and users both need "table-component", create once)
  - Spawn one agent per unique missing component (parallel)

- Step 4: Spawn ONE composer agent PER screen (parallel)
  - Each composer handles exactly ONE screen
  - Each MUST create .uxm + .md + .rendered.md
  - All composers run simultaneously
  - Example: 6 screens = 6 Task tool calls in ONE message

- Step 5: Enhancement (based on quality preset)

**Critical difference:** Multi-screen spawns N parallel composer agents instead of one.

**Example execution:**
```
User: Create pages for dashboard, users, settings (3 screens)

Orchestrator detects N=3, uses Path B:
1. Create 12 missing components (parallel, ~60s)
2. Spawn 3 composer agents in ONE message (parallel, ~90s)
   - Composer 1 → dashboard (.uxm, .md, .rendered.md)
   - Composer 2 → users (.uxm, .md, .rendered.md)
   - Composer 3 → settings (.uxm, .md, .rendered.md)
3. Enhancement if needed (~90s)

Total: ~240s for 3 complete screens
```
```

Use Edit tool to insert this entire block after Step 2.

**Step 3: Verify the insertion**

```bash
sed -n '134,180p' skills/fluxwing-screen-scaffolder/SKILL.md
```

Expected: See new workflow branching section with Path A and Path B clearly differentiated

**Step 4: Commit**

```bash
git add skills/fluxwing-screen-scaffolder/SKILL.md
git commit -m "feat: add workflow branching for single vs multi-screen

Path A (N=1): Existing single-screen workflow
Path B (N>1): Multi-screen with parallel composer agents
Includes deduplication logic for shared components."
```

---

## Task 4: Restructure Composer Agent Prompt (Part 1 - Lead with Deliverables)

**Files:**
- Modify: `skills/fluxwing-screen-scaffolder/SKILL.md:259-358` (Step 4 composer agent prompt)

**Step 1: Read the current composer prompt**

```bash
sed -n '254,280p' skills/fluxwing-screen-scaffolder/SKILL.md
```

Expected: See Task({ prompt: starting around line 259

**Step 2: Replace the composer prompt opening**

Find the old opening:
```typescript
Task({
  subagent_type: "general-purpose",
  model: "sonnet", // Smart model for quality composition
  description: "Compose ${screenName} with components",
  prompt: `You are a uxscii screen composer creating production-ready screens.

Screen: ${screenName}
Components: ${componentList}
Layout: ${layoutStructure}

Your task has TWO parts:
```

Replace with new opening that leads with deliverables:
```typescript
Task({
  subagent_type: "general-purpose",
  model: "sonnet", // Smart model for quality composition
  description: "Compose ${screenName}",
  prompt: `You are a uxscii screen composer creating production-ready screens.

Screen: ${screenName}
Components: ${componentList}
Layout: ${layoutStructure}

YOUR PRIMARY DELIVERABLE: ${screenName}.rendered.md
This is what the user will see. Everything else supports this.

MANDATORY OUTPUTS (all 3 required):
1. ${screenName}.uxm (metadata)
2. ${screenName}.md (template with {{placeholders}})
3. ${screenName}.rendered.md (REAL data, ACTUAL ASCII) ⚠️ CRITICAL

If you complete without creating .rendered.md, you have FAILED.

Your task has TWO parts:
```

Use Edit tool to replace lines 259-268 with the new version.

**Step 3: Verify the change**

```bash
sed -n '259,280p' skills/fluxwing-screen-scaffolder/SKILL.md
```

Expected: See new opening with "YOUR PRIMARY DELIVERABLE" leading the prompt

**Step 4: Commit**

```bash
git add skills/fluxwing-screen-scaffolder/SKILL.md
git commit -m "feat: restructure composer prompt to lead with deliverables

.rendered.md is now emphasized as THE primary deliverable upfront.
Frames missing .rendered.md as failure, not optional output."
```

---

## Task 5: Add Verification Checklist to Composer Prompt

**Files:**
- Modify: `skills/fluxwing-screen-scaffolder/SKILL.md:355-358` (end of composer prompt)

**Step 1: Locate the end of composer prompt**

```bash
sed -n '350,365p' skills/fluxwing-screen-scaffolder/SKILL.md
```

Expected: See the end of the composer Task block around line 358

**Step 2: Add verification checklist before closing**

Find the end of the prompt (before the closing backtick and parenthesis):
```
Return summary:
- List component .md files created
- Screen files created
- Preview of .rendered.md (first 20 lines)
`
})
```

Replace with:
```
VERIFICATION CHECKLIST (before returning):
- [ ] .uxm file created and saved to ./fluxwing/screens/
- [ ] .md template created and saved to ./fluxwing/screens/
- [ ] .rendered.md created with REAL data and ACTUAL component ASCII
- [ ] All 3 files exist in ./fluxwing/screens/

REQUIRED RETURN FORMAT:
"Created ${screenName}: .uxm ✓, .md ✓, .rendered.md ✓

Component .md files generated: [list]
Screen location: ./fluxwing/screens/${screenName}.*
Preview of .rendered.md (first 20 lines):
[preview]"
`
})
```

Use Edit tool to replace the return summary section.

**Step 3: Verify the change**

```bash
sed -n '350,375p' skills/fluxwing-screen-scaffolder/SKILL.md
```

Expected: See verification checklist and required return format before closing

**Step 4: Commit**

```bash
git add skills/fluxwing-screen-scaffolder/SKILL.md
git commit -m "feat: add verification checklist to composer prompt

Composer must verify all 3 files created before returning.
Required return format explicitly confirms .rendered.md creation."
```

---

## Task 6: Add Rationalization Blocker Section

**Files:**
- Modify: `skills/fluxwing-screen-scaffolder/SKILL.md:609` (after all workflow steps, before final sections)

**Step 1: Locate insertion point (end of workflow, before Error Handling)**

```bash
sed -n '600,615p' skills/fluxwing-screen-scaffolder/SKILL.md
```

Expected: See end of example interaction and start of Error Handling section

**Step 2: Add rationalization blocker section before Error Handling**

Insert new section after the Example Interaction and before Error Handling:

```markdown
## Common Rationalizations That Mean You're Failing

If you catch yourself thinking ANY of these thoughts, STOP. You are rationalizing. Use the Task tool.

**Worker mode rationalizations:**
- "I'll just create the files directly, it's faster" → WRONG. Spawn agents.
- "Orchestration is overkill for this batch" → WRONG. That's exactly when you orchestrate.
- "I'll create .uxm and .md myself, agents can do .rendered later" → WRONG. Agents do ALL files.
- "Let me help by creating some files first" → WRONG. Agents are self-sufficient.
- "Python/Bash will be quicker for batch creation" → WRONG. Use Task tool for parallel agents.

**Incomplete deliverable rationalizations:**
- "I'll create one .rendered.md as an example" → WRONG. Create for ALL screens.
- ".rendered.md is optional/bonus" → WRONG. It's THE primary deliverable.
- "User can ask for .rendered.md later if they want" → WRONG. Create now, all screens.
- "Template .md is good enough" → WRONG. User needs .rendered.md with real data.

**If you detect yourself working in "worker mode" (using Write/Bash/Python):**
1. STOP immediately
2. Delete any files you created directly
3. Use Task tool to spawn appropriate agents
4. Each agent creates its own files

You are an ORCHESTRATOR, not a WORKER. Spawn agents. Always.

```

Use Edit tool to insert this section.

**Step 3: Verify the insertion**

```bash
sed -n '600,650p' skills/fluxwing-screen-scaffolder/SKILL.md
```

Expected: See new rationalization blocker section before Error Handling

**Step 4: Commit**

```bash
git add skills/fluxwing-screen-scaffolder/SKILL.md
git commit -m "feat: add rationalization blocker section

Explicit list of common rationalizations that lead to failure.
Catches worker mode and incomplete deliverable patterns before they happen."
```

---

## Task 7: Test Single-Screen Workflow (Regression Test)

**Files:**
- Test: Manual testing with test prompt

**Step 1: Create test directory**

```bash
mkdir -p /tmp/fluxwing-test-single
cd /tmp/fluxwing-test-single
```

**Step 2: Trigger screen scaffolder with single-screen request**

Test prompt (send to Claude Code):
```
Create a login screen with email input, password input, and submit button.
```

**Step 3: Verify orchestrator behavior**

Expected behavior (check conversation history):
- ✓ Uses Task tool (not Write/Bash/Python)
- ✓ Spawns component agents in parallel (if needed)
- ✓ Spawns ONE composer agent
- ✓ Creates 3 files: login.uxm, login.md, login.rendered.md
- ✓ No "worker mode" behavior

**Step 4: Verify file outputs**

```bash
ls -la ./fluxwing/screens/
```

Expected output:
```
login.uxm
login.md
login.rendered.md
```

**Step 5: Verify .rendered.md has real data**

```bash
head -n 30 ./fluxwing/screens/login.rendered.md
```

Expected: See ASCII art with REAL example data (not {{placeholders}}), e.g., "Enter your email", actual email examples

**Step 6: Document test result**

```bash
echo "✓ Single-screen workflow: PASS" >> /tmp/test-results.txt
```

---

## Task 8: Test Multi-Screen Workflow (New Feature)

**Files:**
- Test: Manual testing with multi-screen prompt

**Step 1: Create test directory**

```bash
mkdir -p /tmp/fluxwing-test-multi
cd /tmp/fluxwing-test-multi
```

**Step 2: Create mock screenshots for batch request**

```bash
# Create 3 empty files to simulate screenshots
touch dashboard-screenshot.png users-screenshot.png settings-screenshot.png
```

**Step 3: Trigger screen scaffolder with multi-screen request**

Test prompt (send to Claude Code):
```
Create pages for these 3 screens: dashboard, users, and settings.

Dashboard: overview cards, recent activity, quick actions
Users: user table, search, filters
Settings: profile form, preferences, notifications toggle
```

**Step 4: Verify orchestrator behavior**

Expected behavior (check conversation history):
- ✓ Detects multi-screen request (N=3)
- ✓ Confirms with user listing all 3 screens
- ✓ States ".rendered.md will be created for ALL screens"
- ✓ Uses Task tool (not Write/Bash/Python)
- ✓ Spawns 3 composer agents in ONE message (parallel)
- ✓ Each composer creates 3 files
- ✓ No "worker mode" behavior

**Step 5: Verify file outputs**

```bash
ls -la ./fluxwing/screens/
```

Expected output (9 files total):
```
dashboard.uxm
dashboard.md
dashboard.rendered.md
users.uxm
users.md
users.rendered.md
settings.uxm
settings.md
settings.rendered.md
```

**Step 6: Verify ALL .rendered.md files exist and have real data**

```bash
for screen in dashboard users settings; do
  if [ -f "./fluxwing/screens/${screen}.rendered.md" ]; then
    echo "✓ ${screen}.rendered.md exists"
    head -n 5 "./fluxwing/screens/${screen}.rendered.md"
  else
    echo "✗ ${screen}.rendered.md MISSING"
  fi
done
```

Expected: All 3 screens show ✓ with real ASCII art previews

**Step 7: Document test result**

```bash
echo "✓ Multi-screen workflow: PASS (all 3 .rendered.md files created)" >> /tmp/test-results.txt
```

---

## Task 9: Test Edge Case - Large Batch (10+ Screens)

**Files:**
- Test: Manual testing with large batch

**Step 1: Trigger with 10-screen request**

Test prompt:
```
Create these 10 admin screens: dashboard, users, roles, permissions,
settings, analytics, reports, logs, notifications, audit-trail
```

**Step 2: Verify parallel execution**

Expected behavior:
- ✓ Confirms 10 screens upfront
- ✓ Spawns 10 composer agents in ONE message (parallel)
- ✓ Completes in ~90-120s (not 900s)

**Step 3: Verify all 30 files created (10 × 3)**

```bash
ls -la ./fluxwing/screens/ | wc -l
```

Expected: 31 lines (30 files + header line)

**Step 4: Spot check .rendered.md files**

```bash
ls ./fluxwing/screens/*.rendered.md | wc -l
```

Expected: 10 (all screens have .rendered.md)

**Step 5: Document test result**

```bash
echo "✓ Large batch (10 screens): PASS (all .rendered.md created, parallel execution)" >> /tmp/test-results.txt
```

---

## Task 10: Final Commit and Summary

**Files:**
- Modify: `docs/plans/2025-11-05-multi-screen-rendering-fix.md` (update status)

**Step 1: Update design doc status**

```bash
sed -i '' 's/Status: Validated Design/Status: Implemented/' docs/plans/2025-11-05-multi-screen-rendering-fix.md
```

**Step 2: View test results**

```bash
cat /tmp/test-results.txt
```

Expected:
```
✓ Single-screen workflow: PASS
✓ Multi-screen workflow: PASS (all 3 .rendered.md files created)
✓ Large batch (10 screens): PASS (all .rendered.md created, parallel execution)
```

**Step 3: Final commit**

```bash
git add docs/plans/2025-11-05-multi-screen-rendering-fix.md
git commit -m "docs: mark multi-screen rendering fix as implemented

All tests passing:
- Single-screen regression test
- Multi-screen batch (3 screens)
- Large batch edge case (10 screens)

All screens now receive .rendered.md files without manual prompting."
```

**Step 4: Create summary**

Document what was changed:

```markdown
# Implementation Complete

## Changes Made

1. **Multi-screen orchestration rules** (line 44)
   - Explicit instructions for N > 1 scenarios
   - Prevents worker mode rationalization

2. **Multi-screen detection** (Step 1, line 113)
   - Detects plural language, file lists, explicit numbers
   - Confirms upfront that all screens get .rendered.md

3. **Workflow branching** (after Step 2)
   - Path A: Single screen (existing)
   - Path B: Multi-screen with parallel composers

4. **Composer prompt restructure** (lines 259-358)
   - Leads with deliverables
   - Frames .rendered.md as THE primary output
   - Adds verification checklist

5. **Rationalization blockers** (before Error Handling)
   - Lists common rationalizations
   - Catches worker mode before it happens

## Test Results

- ✓ Single-screen: Works as before (regression safe)
- ✓ Multi-screen (3): All .rendered.md files created
- ✓ Large batch (10): Parallel execution, all files created

## Performance

- Before: ~540s for 6 screens (sequential)
- After: ~90s for 6 screens (parallel)
- Improvement: 6x faster

## Files Modified

- `skills/fluxwing-screen-scaffolder/SKILL.md` (6 sections added/modified)
- `docs/plans/2025-11-05-multi-screen-rendering-fix.md` (status updated)
```

---

## Success Criteria Checklist

After all tasks complete, verify:

- [x] Multi-screen detection confirms N screens upfront
- [x] Mentions ".rendered.md will be created for ALL screens"
- [x] Spawns N parallel composer agents (not sequential)
- [x] Each composer creates .uxm + .md + .rendered.md
- [x] No "worker mode" (Write/Bash/Python) in multi-screen scenarios
- [x] Single-screen workflow unchanged (regression safe)
- [x] All .rendered.md files have real data (not {{placeholders}})
- [x] Large batches (10+) execute in parallel (~90s, not 900s)

## Rollback Plan

If tests fail:

```bash
git log --oneline -10  # Find commits from this plan
git revert <commit-hash>  # Revert specific failing commit
# Or revert entire branch:
git reset --hard <commit-before-changes>
```

Preserve test results for debugging:
```bash
cp /tmp/test-results.txt ./docs/plans/test-results-$(date +%Y%m%d).txt
```

## Next Steps

After implementation:
1. Update `TODO.md` to mark this phase complete
2. Consider adding this fix to release notes
3. Monitor for any regressions in production usage
4. Optionally: Create regression test suite for automated testing
