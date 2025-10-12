# Fluxwing Plugin Consistency Improvement Plan

**Date:** 2025-10-12
**Goal:** Standardize data source and output locations across all plugin commands and agents

---

## Executive Summary

The Fluxwing plugin currently has 11 excellent bundled examples and a solid architecture, but agents and commands reference data locations inconsistently. This plan establishes clear rules and implements them across all plugin components.

---

## Current State Analysis

### What's Working ✅

1. **11 bundled examples** in `fluxwing/data/examples/`:
   - alert, badge, card, custom-widget, email-input, form, list, modal, navigation, primary-button, secondary-button

2. **Complete documentation** in `fluxwing/data/docs/`:
   - Modular, well-organized, token-efficient

3. **4 commands** + **3 agents**:
   - Commands: create, library, scaffold, validate
   - Agents: composer, designer, validator

4. **Project output directory** concept exists: `./fluxwing/`

### Issues Identified 🔴

1. **Inconsistent bundled example references**:
   - Some files reference `{PLUGIN_ROOT}/data/examples/` ✅
   - Need to ensure ALL files use this consistently

2. **Multiple output directories causing confusion**:
   - `./fluxwing/components/` - For user-created components
   - `./fluxwing/library/` - For customized template copies
   - `./fluxwing/screens/` - For complete screens
   - Not all agents understand this hierarchy

3. **Missing "get single component" command**:
   - Library command shows all components
   - No way to quickly view a single component's full details

4. **Inventory concept not uniformly explained**:
   - Library command understands mixing bundled + project
   - Some agents don't explicitly follow this pattern

5. **Plugin vs Project directory confusion**:
   - Need crystal clear distinction between:
     - `{PLUGIN_ROOT}/data/` (READ-ONLY bundled assets)
     - `./fluxwing/` (READ-WRITE project workspace)

---

## The Golden Rules (Based on Claude Code Plugin Guide)

### Rule 1: Data Sources (READ-ONLY)
```
{PLUGIN_ROOT}/data/examples/     ← 11 bundled component templates
{PLUGIN_ROOT}/data/screens/      ← 2 bundled screen examples
{PLUGIN_ROOT}/data/docs/         ← Documentation
{PLUGIN_ROOT}/data/schema/       ← JSON Schema validation
```

**These are READ-ONLY reference materials. Never write here.**

### Rule 2: Project Workspace (READ-WRITE)
```
./fluxwing/                      ← All project outputs go here
├── components/                  ← User/agent-created components
├── screens/                     ← User/agent-created screens
└── library/                     ← Customized copies of bundled templates
```

**This is the project workspace. All outputs go here.**

### Rule 3: Inventory Concept
When showing available components, ALWAYS mix:
- ✅ Bundled templates from `{PLUGIN_ROOT}/data/examples/`
- ✅ User library from `./fluxwing/library/`
- ✅ User components from `./fluxwing/components/`
- ✅ User screens from `./fluxwing/screens/`

### Rule 4: Component Lifecycle
```
1. BROWSE    → /fluxwing-library (see all: bundled + project)
2. GET       → /fluxwing-get [name] (view single component details)
3. COPY      → Copy bundled template to ./fluxwing/library/
4. CREATE    → /fluxwing-create (new component to ./fluxwing/components/)
5. COMPOSE   → fluxwing-composer agent (screens to ./fluxwing/screens/)
6. VALIDATE  → /fluxwing-validate (check quality)
```

---

## Improvement Tasks

### Phase 1: Create Missing Command

**Task 1.1: Create `/fluxwing-get` command**
- **Location:** `fluxwing/commands/fluxwing-get.md`
- **Purpose:** View full details of a single component (from any source)
- **Search order:**
  1. `./fluxwing/components/[name].uxm`
  2. `./fluxwing/library/[name].uxm`
  3. `{PLUGIN_ROOT}/data/examples/[name].uxm`
- **Output:** Display .uxm metadata + .md template preview
- **Interactive options:** Copy to project, edit, validate

---

### Phase 2: Update Agent System Prompts

All agents need a clear "Data Location Rules" section at the top.

**Task 2.1: Update `fluxwing-composer.md`**
- Add explicit data location rules section
- Clarify inventory check order (components → library → bundled)
- Emphasize writing to `./fluxwing/screens/` only

**Task 2.2: Update `fluxwing-designer.md`**
- Add explicit data location rules section
- Clarify where to save components (`./fluxwing/components/`)
- Clarify where to save screens (`./fluxwing/screens/`)

**Task 2.3: Update `fluxwing-validator.md`**
- Add explicit data location rules section
- Validate files from all three project locations
- Don't validate bundled templates (read-only)

---

### Phase 3: Update Command Files

**Task 3.1: Update `fluxwing-create.md`**
- Add explicit data location rules section
- Always save to `./fluxwing/components/`
- Mention option to base on bundled templates

**Task 3.2: Update `fluxwing-library.md`**
- Strengthen the "three sources" explanation
- Add clear visual distinction between bundled (read-only) and project (editable)
- Update interactive options to include new `/fluxwing-get` command

**Task 3.3: Update `fluxwing-scaffold.md`**
- Add explicit data location rules section
- Always save screens to `./fluxwing/screens/`
- Reference inventory from all three sources

**Task 3.4: Update `fluxwing-validate.md`**
- Add explicit data location rules section
- Accept paths from any project location
- Skip bundled templates (already validated)

---

### Phase 4: Add Data Location Header Template

Create a standard header that goes in every command/agent file:

```markdown
## Data Location Rules

**READ from (bundled templates - reference only):**
- `{PLUGIN_ROOT}/data/examples/` - 11 component templates
- `{PLUGIN_ROOT}/data/screens/` - 2 screen examples
- `{PLUGIN_ROOT}/data/docs/` - Documentation
- `{PLUGIN_ROOT}/data/schema/` - JSON Schema

**WRITE to (project workspace):**
- `./fluxwing/components/` - Your created components
- `./fluxwing/screens/` - Your created screens
- `./fluxwing/library/` - Customized template copies

**NEVER write to plugin data directory - it's read-only!**
```

**Task 4.1:** Add this header to all 4 commands
**Task 4.2:** Add this header to all 3 agents
**Task 4.3:** Adapt header text to each file's specific context

---

### Phase 5: Documentation Updates

**Task 5.1: Update `fluxwing/CLAUDE.md`**
- Add section on data location rules
- Clarify plugin vs project directories
- Update "File Locations Users Create" section

**Task 5.2: Update `fluxwing/COMMANDS.md`**
- Add `/fluxwing-get` to command list
- Update descriptions to mention data locations
- Add "Data Location Philosophy" section

**Task 5.3: Update `fluxwing/AGENTS.md`**
- Add "Data Location Rules" section
- Clarify where each agent reads from and writes to
- Update workflow descriptions

**Task 5.4: Update `fluxwing/README.md`**
- Add clear explanation of plugin vs project files
- Add directory structure diagram showing both locations
- Update quick start to mention data locations

---

### Phase 6: Testing & Validation

**Task 6.1: Test `/fluxwing-get` command**
- Test with bundled template name
- Test with project component name
- Test with nonexistent component
- Test with component in library

**Task 6.2: Test inventory consistency**
- Run `/fluxwing-library` and verify all sources shown
- Create test component in each location
- Verify agents can find components from all sources

**Task 6.3: Test output locations**
- Use `/fluxwing-create` → verify saves to `./fluxwing/components/`
- Use `/fluxwing-scaffold` → verify saves to `./fluxwing/screens/`
- Copy template → verify saves to `./fluxwing/library/`

**Task 6.4: Verify read-only enforcement**
- Ensure no command/agent writes to `{PLUGIN_ROOT}/data/`
- Grep all files for data directory write operations

---

## Implementation Priority

### 🔴 High Priority (Do First)
1. Create `/fluxwing-get` command (new functionality)
2. Add "Data Location Rules" header to all commands and agents
3. Update `fluxwing-library.md` to strengthen inventory concept

### 🟡 Medium Priority (Do Second)
4. Update all agent system prompts with clear rules
5. Update CLAUDE.md and README.md with clear explanations
6. Update command files with consistent location references

### 🟢 Low Priority (Do Last)
7. Update COMMANDS.md and AGENTS.md documentation
8. Testing and validation
9. Final consistency check across all files

---

## Success Criteria

✅ **Consistency Achieved When:**

1. All 7 plugin files (4 commands + 3 agents) have "Data Location Rules" section
2. Every file consistently references:
   - `{PLUGIN_ROOT}/data/examples/` for bundled templates
   - `./fluxwing/components/` for created components
   - `./fluxwing/library/` for customized templates
   - `./fluxwing/screens/` for screens
3. New `/fluxwing-get` command exists and works
4. Inventory concept is uniformly explained across all files
5. No file writes to `{PLUGIN_ROOT}/data/` directory
6. All documentation clearly explains plugin vs project files
7. Testing confirms components can be found from all sources

---

## File Modification Checklist

### Commands (4 files)
- [ ] `fluxwing/commands/fluxwing-create.md` - Add rules, update refs
- [ ] `fluxwing/commands/fluxwing-library.md` - Strengthen inventory, add get option
- [ ] `fluxwing/commands/fluxwing-scaffold.md` - Add rules, update refs
- [ ] `fluxwing/commands/fluxwing-validate.md` - Add rules, update refs
- [ ] `fluxwing/commands/fluxwing-get.md` - **CREATE NEW**

### Agents (3 files)
- [ ] `fluxwing/agents/fluxwing-composer.md` - Add rules, clarify inventory
- [ ] `fluxwing/agents/fluxwing-designer.md` - Add rules, clarify outputs
- [ ] `fluxwing/agents/fluxwing-validator.md` - Add rules, update refs

### Documentation (4 files)
- [ ] `fluxwing/CLAUDE.md` - Add data location section
- [ ] `fluxwing/README.md` - Add directory structure diagram
- [ ] `fluxwing/COMMANDS.md` - Add get command, data philosophy
- [ ] `fluxwing/AGENTS.md` - Add data location section

### Plugin Metadata (1 file)
- [ ] `fluxwing/.claude-plugin/plugin.json` - Verify paths (no changes needed)

**Total: 12 files (11 updates + 1 new file)**

---

## Maintenance Guidelines

Going forward, when adding new commands or agents:

1. ✅ Always include "Data Location Rules" header
2. ✅ Reference bundled examples from `{PLUGIN_ROOT}/data/examples/`
3. ✅ Write outputs to `./fluxwing/[components|screens|library]/`
4. ✅ Show inventory from all three sources (bundled + library + components)
5. ✅ Never write to plugin data directory
6. ✅ Test with components in different locations
7. ✅ Update documentation when adding new capabilities

---

## Notes

- This plan follows Claude Code Plugin Guide best practices (lines 1037-1237)
- The plugin's two-file system (.uxm + .md) remains unchanged
- All 11 bundled examples stay in place
- Changes are additive (one new command) and editorial (consistency updates)
- No breaking changes to existing functionality
- Estimated time: 2-3 hours for all changes + testing

---

**Next Steps:**
1. Review and approve this plan
2. Create granular TODO.md for tracking implementation
3. Begin Phase 1 (create `/fluxwing-get` command)
4. Systematically work through each phase
5. Test thoroughly
6. Update version to 1.1.0 in plugin.json
