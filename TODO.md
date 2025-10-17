# Fluxwing Plugin to Skills Migration - Task Tracker

## Overview

Converting the Fluxwing Claude Code plugin from a plugin-based architecture to a skills-based architecture. This migration makes Fluxwing's capabilities discoverable and automatically activated by Claude based on natural language requests.

**Status**: Implementation Complete - Ready for Manual Testing

**Last Updated**: 2025-10-17

---

## Phase 1: Component Creator Skill ✅

**Status**: Complete

### Implementation Tasks
- [x] Create skill directory structure (.claude/skills/uxscii-component-creator/)
- [x] Create SKILL.md with proper YAML frontmatter
- [x] Copy 11 component templates (.uxm + .md files)
- [x] Copy schema (uxm-component.schema.json)
- [x] Copy documentation (03-component-creation.md, 06-ascii-patterns.md, 07-schema-reference.md)
- [x] Update all {PLUGIN_ROOT} references to {SKILL_ROOT}
- [x] Preserve agent invocation pattern (fluxwing:fluxwing-designer)

### Automated Verification ✅
- [x] YAML validates correctly
- [x] All 11 templates exist in templates/
- [x] Schema file exists
- [x] No PLUGIN_ROOT references in SKILL.md
- [x] Uses SKILL_ROOT correctly

### Manual Verification (Pending)
- [ ] Trigger: "Create a button" → Skill activates
- [ ] Trigger: "I need an input component" → Skill activates
- [ ] Trigger: "Design a card" → Skill activates
- [ ] Files created in ./fluxwing/components/ (not in skill directory)
- [ ] Templates readable from {SKILL_ROOT}/templates/
- [ ] Schema validation works

---

## Phase 2: Library Browser Skill ✅

**Status**: Complete

### Implementation Tasks
- [x] Create skill directory structure (.claude/skills/uxscii-library-browser/)
- [x] Create SKILL.md with read-only tools (Read, Glob, Grep)
- [x] Copy documentation (07-examples-guide.md)
- [x] Set up cross-skill template references ({SKILL_ROOT}/../uxscii-component-creator/templates/)
- [x] Update all {PLUGIN_ROOT} references to relative paths

### Automated Verification ✅
- [x] YAML validates correctly
- [x] Skill file exists
- [x] Read-only tools confirmed (no Write/Edit)

### Manual Verification (Pending)
- [ ] Trigger: "Show me all components" → Skill activates
- [ ] Trigger: "What components are available?" → Skill activates
- [ ] Trigger: "Browse the library" → Skill activates
- [ ] Displays bundled templates correctly
- [ ] Displays user components if they exist
- [ ] Search functionality works

---

## Phase 3: Component Expander Skill ✅

**Status**: Complete

### Implementation Tasks
- [x] Create skill directory structure (.claude/skills/uxscii-component-expander/)
- [x] Create SKILL.md with write permissions (Read, Write, Edit, Glob, Grep)
- [x] Copy documentation (03-component-creation.md, 06-ascii-patterns.md)
- [x] Adapt workflow for direct file manipulation (no agent spawning)
- [x] Update all {PLUGIN_ROOT} references to {SKILL_ROOT}

### Automated Verification ✅
- [x] YAML validates correctly
- [x] Skill file exists
- [x] Can modify files (Write, Edit permissions)

### Manual Verification (Pending)
- [ ] Trigger: "Add hover state to my button" → Skill activates
- [ ] Trigger: "Expand email-input with focus and error" → Skill activates
- [ ] Trigger: "Make this component interactive" → Skill activates
- [ ] Correctly reads existing component
- [ ] Adds new states without losing existing data
- [ ] Updates modification timestamp
- [ ] ASCII patterns match state properties

---

## Phase 4: Screen Scaffolder Skill ✅

**Status**: Complete

### Implementation Tasks
- [x] Create skill directory structure (.claude/skills/uxscii-screen-scaffolder/)
- [x] Create SKILL.md with agent spawning capability
- [x] Copy 2 screen templates (.uxm + .md + .rendered.md files)
- [x] Copy documentation (04-screen-composition.md)
- [x] Set up cross-skill template references
- [x] Update agent invocation (fluxwing:fluxwing-designer, fluxwing:fluxwing-composer)

### Automated Verification ✅
- [x] YAML validates correctly
- [x] Skill file exists
- [x] 2 screen templates exist
- [x] Can spawn agents (Task tool in allowed-tools)

### Manual Verification (Pending)
- [ ] Trigger: "Create a login screen" → Skill activates
- [ ] Trigger: "Build a dashboard" → Skill activates
- [ ] Trigger: "Scaffold a profile page" → Skill activates
- [ ] Correctly inventories existing components
- [ ] Spawns designer agent for missing components
- [ ] Spawns composer agent for screen assembly
- [ ] Creates .uxm, .md, and .rendered.md files
- [ ] Screens saved to ./fluxwing/screens/

---

## Phase 5: Component Viewer Skill ✅

**Status**: Complete

### Implementation Tasks
- [x] Create skill directory structure (.claude/skills/uxscii-component-viewer/)
- [x] Create SKILL.md with read-only tools (Read, Glob, Grep)
- [x] Copy documentation (02-core-concepts.md)
- [x] Set up multi-location component search (project → library → bundled)
- [x] Update all {PLUGIN_ROOT} references to relative paths

### Automated Verification ✅
- [x] YAML validates correctly
- [x] Skill file exists
- [x] Read-only tools confirmed

### Manual Verification (Pending)
- [ ] Trigger: "Show me the submit-button" → Skill activates
- [ ] Trigger: "What's in the primary-button component?" → Skill activates
- [ ] Trigger: "View component details for card" → Skill activates
- [ ] Displays all metadata correctly
- [ ] Shows ASCII preview for all states
- [ ] Fuzzy search works for component names

---

## Phase 6: Screenshot Importer Skill ✅

**Status**: Complete

### Implementation Tasks
- [x] Create skill directory structure (.claude/skills/uxscii-screenshot-importer/)
- [x] Create SKILL.md with agent orchestration capability
- [x] Copy all 6 screenshot documentation files
- [x] Update agent invocation (screenshot-vision-coordinator, screenshot-component-generator)
- [x] Adapt workflow for vision agent orchestration

### Automated Verification ✅
- [x] YAML validates correctly
- [x] Skill file exists
- [x] Can spawn agents (Task tool in allowed-tools)
- [x] All 6 screenshot docs exist

### Manual Verification (Pending)
- [ ] Trigger: "Import this screenshot" → Skill activates
- [ ] Trigger: "Generate components from this UI image" → Skill activates
- [ ] Trigger: "Convert screenshot to uxscii" → Skill activates
- [ ] Correctly reads screenshot file
- [ ] Spawns vision coordinator agent
- [ ] Generates components from detected UI elements
- [ ] Creates valid .uxm and .md files
- [ ] Components saved to ./fluxwing/components/

---

## Overall Migration Verification

### Automated Checks ✅
- [x] All SKILL.md files have valid YAML frontmatter
- [x] All 6 skill directories exist
- [x] Supporting files copied (14 templates + schema)
- [x] No {PLUGIN_ROOT} references in SKILL.md files
- [x] All skills use {SKILL_ROOT} correctly
- [x] Cross-skill references use relative paths

### Manual Integration Tests (Pending)
- [ ] Natural language activation works for all 6 skills
- [ ] Skills load and execute without errors
- [ ] Supporting files (templates, schemas) are accessible
- [ ] File creation works in user's project workspace
- [ ] Agents can be spawned from skills
- [ ] Plugin commands still work (coexistence)

---

## File Summary

### Created Skill Files (6 total)
1. `.claude/skills/uxscii-component-creator/SKILL.md`
2. `.claude/skills/uxscii-library-browser/SKILL.md`
3. `.claude/skills/uxscii-component-expander/SKILL.md`
4. `.claude/skills/uxscii-screen-scaffolder/SKILL.md`
5. `.claude/skills/uxscii-component-viewer/SKILL.md`
6. `.claude/skills/uxscii-screenshot-importer/SKILL.md`

### Supporting Files Copied
- **Templates**: 11 component templates (22 files: .uxm + .md)
- **Schemas**: 1 JSON Schema file
- **Screen Examples**: 2 screen templates (6 files: .uxm + .md + .rendered.md)
- **Documentation**: 13 documentation files across all skills

### Total Files Created
- 6 SKILL.md files
- 42 supporting files (templates + schemas + docs)
- **Total: 48 files**

---

## Post-Migration Tasks (Future)

### Documentation Updates (Not Started)
- [ ] Update main README.md to mention skills
- [ ] Add skills migration guide
- [ ] Update CONTRIBUTING.md with skills development guidelines
- [ ] Create skills usage examples

### Deprecation Plan (Not Started)
- [ ] Add deprecation notices to plugin commands
- [ ] Create migration guide for users
- [ ] Set timeline for slash command removal
- [ ] Plan major version bump

### Testing & Quality (Not Started)
- [ ] Create automated test suite for skills
- [ ] Performance benchmarking (skills vs commands)
- [ ] User acceptance testing
- [ ] Documentation accuracy review

### Future Enhancements (Not Started)
- [ ] Consider converting agents to skills
- [ ] Create shared skill resources directory
- [ ] Add skill-to-skill communication
- [ ] Implement skill versioning strategy

---

## Known Issues / Notes

1. **PLUGIN_ROOT in Docs**: Some copied documentation files contain `{PLUGIN_ROOT}` references. This is acceptable as they are reference materials, not skill instructions.

2. **Agent Location**: All 7 agents remain in the plugin directory (`fluxwing/agents/`) and are invoked by skills using the `fluxwing:agent-name` pattern.

3. **Cross-Skill Dependencies**: Library Browser and Screen Scaffolder reference Component Creator's templates using relative paths.

4. **Coexistence**: Both slash commands (`/fluxwing-*`) and skills can coexist during the transition period.

---

## Testing Commands

### Quick Verification
```bash
# Check all skills exist
ls .claude/skills/uxscii-*/SKILL.md

# Count supporting files
find .claude/skills/uxscii-* -name "*.uxm" -o -name "*.schema.json" | wc -l

# Verify no PLUGIN_ROOT in SKILL.md files
grep -r "PLUGIN_ROOT" .claude/skills/*/SKILL.md

# Verify SKILL_ROOT usage
grep -r "SKILL_ROOT" .claude/skills/*/SKILL.md | head -5
```

### Natural Language Test Prompts
1. "Create a button"
2. "Show me all components"
3. "Add hover state to my button"
4. "Build a login screen"
5. "Show me the primary-button"
6. "Import this screenshot"

---

## Success Criteria

### Implementation Complete ✅
- [x] All 6 skills created
- [x] All supporting files copied
- [x] All automated verification tests passing
- [x] No breaking changes to plugin
- [x] Agents preserved in plugin

### Manual Testing Required ⏳
- [ ] All natural language triggers work
- [ ] File operations work correctly
- [ ] Agent spawning works from skills
- [ ] Cross-skill references resolve
- [ ] No regressions in plugin commands

### Documentation & Communication 📝
- [ ] Migration guide written
- [ ] Users informed of new capabilities
- [ ] Deprecation timeline communicated (if applicable)

---

**Next Step**: Begin manual testing with natural language prompts to verify skill activation and functionality.
