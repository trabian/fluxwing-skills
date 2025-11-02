# Fast Screen Scaffolding Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce screen scaffolding time from 10 minutes to 3-4 minutes while maintaining high-quality .rendered.md output through two-phase scaffolding with progressive fidelity.

**Architecture:** Two-phase system: (1) Fast scaffold creates sketch-fidelity components (.uxm only) in parallel + smart composer generates component .md files and screen files (60-90s), (2) Auto-enhancement upgrades components to detailed fidelity with states and polish (120-150s). Total: 3-4 minutes.

**Tech Stack:** Claude Code skills system, JSON Schema (Draft-07), uxscii standard, markdown templates with ASCII art, YAML frontmatter.

---

## Phase 1: Foundation (Target: 50% speedup to 5 minutes)

### Task 1: Create Minimal Component Templates

**Goal:** Build 11 lightweight .uxm templates for fast component generation via variable substitution.

**Files:**
- Create: `skills/fluxwing-component-creator/templates/minimal/button.uxm.template`
- Create: `skills/fluxwing-component-creator/templates/minimal/input.uxm.template`
- Create: `skills/fluxwing-component-creator/templates/minimal/checkbox.uxm.template`
- Create: `skills/fluxwing-component-creator/templates/minimal/card.uxm.template`
- Create: `skills/fluxwing-component-creator/templates/minimal/modal.uxm.template`
- Create: `skills/fluxwing-component-creator/templates/minimal/navigation.uxm.template`
- Create: `skills/fluxwing-component-creator/templates/minimal/badge.uxm.template`
- Create: `skills/fluxwing-component-creator/templates/minimal/icon.uxm.template`
- Create: `skills/fluxwing-component-creator/templates/minimal/container.uxm.template`
- Create: `skills/fluxwing-component-creator/templates/minimal/list.uxm.template`
- Create: `skills/fluxwing-component-creator/templates/minimal/form.uxm.template`

**Step 1: Create minimal/ directory**

```bash
mkdir -p skills/fluxwing-component-creator/templates/minimal
```

Run: `ls -la skills/fluxwing-component-creator/templates/`
Expected: Directory `minimal/` exists

**Step 2: Create button.uxm.template**

Create: `skills/fluxwing-component-creator/templates/minimal/button.uxm.template`

```json
{
  "id": "{{id}}",
  "type": "button",
  "version": "1.0.0",
  "metadata": {
    "name": "{{name}}",
    "description": "{{description}}",
    "created": "{{timestamp}}",
    "modified": "{{timestamp}}",
    "tags": ["button", "{{screenContext}}"],
    "category": "form",
    "fidelity": "sketch"
  },
  "props": {
    "label": "{{label}}"
  },
  "behavior": {
    "states": [
      {"name": "default", "properties": {}}
    ],
    "accessibility": {
      "role": "button",
      "focusable": true
    }
  },
  "ascii": {
    "width": 20,
    "height": 3
  }
}
```

**Step 3: Create input.uxm.template**

Create: `skills/fluxwing-component-creator/templates/minimal/input.uxm.template`

```json
{
  "id": "{{id}}",
  "type": "input",
  "version": "1.0.0",
  "metadata": {
    "name": "{{name}}",
    "description": "{{description}}",
    "created": "{{timestamp}}",
    "modified": "{{timestamp}}",
    "tags": ["input", "{{screenContext}}"],
    "category": "form",
    "fidelity": "sketch"
  },
  "props": {
    "placeholder": "{{placeholder}}",
    "label": "{{label}}"
  },
  "behavior": {
    "states": [
      {"name": "default", "properties": {}}
    ],
    "accessibility": {
      "role": "textbox",
      "focusable": true
    }
  },
  "ascii": {
    "width": 40,
    "height": 3
  }
}
```

**Step 4: Create checkbox.uxm.template**

Create: `skills/fluxwing-component-creator/templates/minimal/checkbox.uxm.template`

```json
{
  "id": "{{id}}",
  "type": "checkbox",
  "version": "1.0.0",
  "metadata": {
    "name": "{{name}}",
    "description": "{{description}}",
    "created": "{{timestamp}}",
    "modified": "{{timestamp}}",
    "tags": ["checkbox", "{{screenContext}}"],
    "category": "form",
    "fidelity": "sketch"
  },
  "props": {
    "label": "{{label}}",
    "checked": false
  },
  "behavior": {
    "states": [
      {"name": "default", "properties": {}}
    ],
    "accessibility": {
      "role": "checkbox",
      "focusable": true
    }
  },
  "ascii": {
    "width": 30,
    "height": 1
  }
}
```

**Step 5: Create card.uxm.template**

Create: `skills/fluxwing-component-creator/templates/minimal/card.uxm.template`

```json
{
  "id": "{{id}}",
  "type": "card",
  "version": "1.0.0",
  "metadata": {
    "name": "{{name}}",
    "description": "{{description}}",
    "created": "{{timestamp}}",
    "modified": "{{timestamp}}",
    "tags": ["card", "{{screenContext}}"],
    "category": "display",
    "fidelity": "sketch"
  },
  "props": {
    "title": "{{title}}",
    "content": "{{content}}"
  },
  "behavior": {
    "states": [
      {"name": "default", "properties": {}}
    ],
    "accessibility": {
      "role": "article",
      "focusable": false
    }
  },
  "ascii": {
    "width": 50,
    "height": 10
  }
}
```

**Step 6: Create modal.uxm.template**

Create: `skills/fluxwing-component-creator/templates/minimal/modal.uxm.template`

```json
{
  "id": "{{id}}",
  "type": "modal",
  "version": "1.0.0",
  "metadata": {
    "name": "{{name}}",
    "description": "{{description}}",
    "created": "{{timestamp}}",
    "modified": "{{timestamp}}",
    "tags": ["modal", "{{screenContext}}"],
    "category": "overlay",
    "fidelity": "sketch"
  },
  "props": {
    "title": "{{title}}",
    "content": "{{content}}"
  },
  "behavior": {
    "states": [
      {"name": "default", "properties": {}}
    ],
    "accessibility": {
      "role": "dialog",
      "focusable": true
    }
  },
  "ascii": {
    "width": 60,
    "height": 20
  }
}
```

**Step 7: Create navigation.uxm.template**

Create: `skills/fluxwing-component-creator/templates/minimal/navigation.uxm.template`

```json
{
  "id": "{{id}}",
  "type": "navigation",
  "version": "1.0.0",
  "metadata": {
    "name": "{{name}}",
    "description": "{{description}}",
    "created": "{{timestamp}}",
    "modified": "{{timestamp}}",
    "tags": ["navigation", "{{screenContext}}"],
    "category": "navigation",
    "fidelity": "sketch"
  },
  "props": {
    "items": []
  },
  "behavior": {
    "states": [
      {"name": "default", "properties": {}}
    ],
    "accessibility": {
      "role": "navigation",
      "focusable": true
    }
  },
  "ascii": {
    "width": 80,
    "height": 5
  }
}
```

**Step 8: Create badge.uxm.template**

Create: `skills/fluxwing-component-creator/templates/minimal/badge.uxm.template`

```json
{
  "id": "{{id}}",
  "type": "badge",
  "version": "1.0.0",
  "metadata": {
    "name": "{{name}}",
    "description": "{{description}}",
    "created": "{{timestamp}}",
    "modified": "{{timestamp}}",
    "tags": ["badge", "{{screenContext}}"],
    "category": "display",
    "fidelity": "sketch"
  },
  "props": {
    "text": "{{text}}"
  },
  "behavior": {
    "states": [
      {"name": "default", "properties": {}}
    ],
    "accessibility": {
      "role": "status",
      "focusable": false
    }
  },
  "ascii": {
    "width": 15,
    "height": 1
  }
}
```

**Step 9: Create icon.uxm.template**

Create: `skills/fluxwing-component-creator/templates/minimal/icon.uxm.template`

```json
{
  "id": "{{id}}",
  "type": "icon",
  "version": "1.0.0",
  "metadata": {
    "name": "{{name}}",
    "description": "{{description}}",
    "created": "{{timestamp}}",
    "modified": "{{timestamp}}",
    "tags": ["icon", "{{screenContext}}"],
    "category": "display",
    "fidelity": "sketch"
  },
  "props": {
    "symbol": "{{symbol}}"
  },
  "behavior": {
    "states": [
      {"name": "default", "properties": {}}
    ],
    "accessibility": {
      "role": "img",
      "focusable": false
    }
  },
  "ascii": {
    "width": 3,
    "height": 1
  }
}
```

**Step 10: Create container.uxm.template**

Create: `skills/fluxwing-component-creator/templates/minimal/container.uxm.template`

```json
{
  "id": "{{id}}",
  "type": "container",
  "version": "1.0.0",
  "metadata": {
    "name": "{{name}}",
    "description": "{{description}}",
    "created": "{{timestamp}}",
    "modified": "{{timestamp}}",
    "tags": ["container", "{{screenContext}}"],
    "category": "layout",
    "fidelity": "sketch"
  },
  "props": {
    "children": []
  },
  "behavior": {
    "states": [
      {"name": "default", "properties": {}}
    ],
    "accessibility": {
      "role": "region",
      "focusable": false
    }
  },
  "ascii": {
    "width": 80,
    "height": 30
  }
}
```

**Step 11: Create list.uxm.template**

Create: `skills/fluxwing-component-creator/templates/minimal/list.uxm.template`

```json
{
  "id": "{{id}}",
  "type": "list",
  "version": "1.0.0",
  "metadata": {
    "name": "{{name}}",
    "description": "{{description}}",
    "created": "{{timestamp}}",
    "modified": "{{timestamp}}",
    "tags": ["list", "{{screenContext}}"],
    "category": "display",
    "fidelity": "sketch"
  },
  "props": {
    "items": []
  },
  "behavior": {
    "states": [
      {"name": "default", "properties": {}}
    ],
    "accessibility": {
      "role": "list",
      "focusable": false
    }
  },
  "ascii": {
    "width": 60,
    "height": 20
  }
}
```

**Step 12: Create form.uxm.template**

Create: `skills/fluxwing-component-creator/templates/minimal/form.uxm.template`

```json
{
  "id": "{{id}}",
  "type": "form",
  "version": "1.0.0",
  "metadata": {
    "name": "{{name}}",
    "description": "{{description}}",
    "created": "{{timestamp}}",
    "modified": "{{timestamp}}",
    "tags": ["form", "{{screenContext}}"],
    "category": "form",
    "fidelity": "sketch"
  },
  "props": {
    "fields": []
  },
  "behavior": {
    "states": [
      {"name": "default", "properties": {}}
    ],
    "accessibility": {
      "role": "form",
      "focusable": true
    }
  },
  "ascii": {
    "width": 60,
    "height": 25
  }
}
```

**Step 13: Verify all templates are valid JSON**

Run:
```bash
for file in skills/fluxwing-component-creator/templates/minimal/*.template; do
  echo "Checking $file..."
  python3 -c "import json; json.load(open('$file'))" && echo "✓ Valid JSON" || echo "✗ Invalid JSON"
done
```

Expected: All 11 files show "✓ Valid JSON"

**Step 14: Commit minimal templates**

```bash
git add skills/fluxwing-component-creator/templates/minimal/
git commit -m "feat: add 11 minimal component templates for fast scaffolding

- Add sketch-fidelity templates with variable substitution
- Support {{id}}, {{name}}, {{description}}, {{timestamp}}, etc.
- Enable <10s component creation via template copying"
```

---

### Task 2: Add Fidelity Field to Schema

**Goal:** Extend uxscii schema to support fidelity levels (sketch, basic, detailed, production).

**Files:**
- Modify: `skills/fluxwing-component-creator/schemas/uxm-component.schema.json`

**Step 1: Read current schema**

Run: `cat skills/fluxwing-component-creator/schemas/uxm-component.schema.json | grep -A 10 '"metadata"'`
Expected: See metadata object with name, description, created, modified, tags, category

**Step 2: Add fidelity field to metadata properties**

Modify: `skills/fluxwing-component-creator/schemas/uxm-component.schema.json`

Find the metadata properties section (around line 50-80) and add the fidelity field:

```json
"metadata": {
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "description": "Human-readable component name"
    },
    "description": {
      "type": "string",
      "minLength": 1,
      "maxLength": 500,
      "description": "Brief description of component purpose"
    },
    "created": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp of creation"
    },
    "modified": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp of last modification"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Tags for categorization and search"
    },
    "category": {
      "type": "string",
      "enum": ["form", "display", "navigation", "overlay", "layout", "custom"],
      "description": "Component category"
    },
    "fidelity": {
      "type": "string",
      "enum": ["sketch", "basic", "detailed", "production"],
      "description": "Component design fidelity level",
      "default": "detailed"
    }
  },
  "required": ["name", "description", "created", "modified", "tags", "category"]
}
```

Note: `fidelity` is NOT in required array (backward compatible)

**Step 3: Validate schema is well-formed JSON**

Run: `python3 -c "import json; json.load(open('skills/fluxwing-component-creator/schemas/uxm-component.schema.json'))" && echo "✓ Valid JSON"`
Expected: "✓ Valid JSON"

**Step 4: Test schema against minimal template**

Create test file to validate button template with fidelity field:

```bash
cat > /tmp/test-button.uxm << 'EOF'
{
  "id": "test-button",
  "type": "button",
  "version": "1.0.0",
  "metadata": {
    "name": "Test Button",
    "description": "Test button component",
    "created": "2025-11-01T12:00:00Z",
    "modified": "2025-11-01T12:00:00Z",
    "tags": ["button", "test"],
    "category": "form",
    "fidelity": "sketch"
  },
  "props": {
    "label": "Click Me"
  },
  "behavior": {
    "states": [
      {"name": "default", "properties": {}}
    ],
    "accessibility": {
      "role": "button",
      "focusable": true
    }
  },
  "ascii": {
    "width": 20,
    "height": 3
  }
}
EOF
```

Run: `python3 -c "import json, jsonschema; schema = json.load(open('skills/fluxwing-component-creator/schemas/uxm-component.schema.json')); data = json.load(open('/tmp/test-button.uxm')); jsonschema.validate(data, schema); print('✓ Valid')"`
Expected: "✓ Valid"

**Step 5: Commit schema update**

```bash
git add skills/fluxwing-component-creator/schemas/uxm-component.schema.json
git commit -m "feat: add fidelity field to uxscii schema

- Add enum: sketch, basic, detailed, production
- Field is optional (backward compatible)
- Default: detailed for existing components"
```

---

### Task 3: Update Component Creator for Fast Mode

**Goal:** Add fast mode to component-creator skill that uses minimal templates and creates .uxm only.

**Files:**
- Modify: `skills/fluxwing-component-creator/SKILL.md`

**Step 1: Read current component creator workflow**

Run: `head -100 skills/fluxwing-component-creator/SKILL.md`
Expected: See workflow section with agent prompts

**Step 2: Add speed modes documentation**

Modify: `skills/fluxwing-component-creator/SKILL.md`

After line 30 (after "Your Task" section), add:

```markdown
## Speed Modes

Fluxwing supports two creation modes optimized for different use cases:

### Fast Mode (Scaffolding)
**When:** Scaffolder creates multiple components in parallel
**Speed:** ~10 seconds per component
**Output:** `.uxm` only (fidelity: sketch)
**Method:** Template-based variable substitution

Fast mode skips:
- Documentation loading
- ASCII art generation
- Detailed metadata

### Detailed Mode (Standalone)
**When:** User explicitly creates single component
**Speed:** ~60-90 seconds per component
**Output:** `.uxm` + `.md` (fidelity: detailed)
**Method:** Full docs, careful ASCII generation

Detailed mode includes:
- Complete documentation reference
- Hand-crafted ASCII art
- Rich metadata with examples

**Default:** Fast mode when called by scaffolder, detailed mode otherwise
```

**Step 3: Add fast mode agent prompt**

Modify: `skills/fluxwing-component-creator/SKILL.md`

Find the section with agent prompts (around line 80-150) and add before existing prompts:

```markdown
## Agent Prompts

### Fast Mode Agent (For Scaffolder)

Use this when creating multiple components quickly:

\```typescript
Task({
  subagent_type: "general-purpose",
  model: "haiku", // Fast model for simple tasks
  description: "Create ${componentName} (fast)",
  prompt: \`Create sketch-fidelity uxscii component from template.

Component: ${componentName}
Type: ${componentType}
Screen context: ${screenContext}

FAST MODE - Speed is critical! <10 seconds target.

Your task:
1. Load minimal template: {SKILL_ROOT}/templates/minimal/${componentType}.uxm.template
2. If template not found, use container.uxm.template as fallback
3. Replace template variables:
   - {{id}} = "${componentId}"
   - {{name}} = "${componentName}"
   - {{description}} = "${description || 'Component for ' + screenContext}"
   - {{timestamp}} = "${new Date().toISOString()}"
   - {{label}} or {{placeholder}} or {{title}} = "${label || componentName}"
   - {{screenContext}} = "${screenContext}"
4. Verify JSON is well-formed (quick syntax check)
5. Save to ./fluxwing/components/${componentId}.uxm
6. DO NOT create .md file
7. DO NOT load documentation
8. DO NOT generate ASCII art

Return message: "Created ${componentId}.uxm (sketch fidelity)"

Target: <10 seconds
\`
})
\```

### Detailed Mode Agent (For User)

Use this when creating single component with full quality:

\```typescript
Task({
  subagent_type: "general-purpose",
  model: "sonnet", // Smart model for quality
  description: "Create ${componentName} (detailed)",
  prompt: \`Create production-ready uxscii component with full documentation.

Component: ${componentName}
Type: ${componentType}

DETAILED MODE - Quality is priority.

Your task:
1. Load schema: {SKILL_ROOT}/schemas/uxm-component.schema.json
2. Load docs: {SKILL_ROOT}/docs/03-component-creation.md
3. Load ASCII patterns: {SKILL_ROOT}/docs/06-ascii-patterns.md
4. Create rich .uxm with:
   - Detailed metadata.description
   - Relevant tags
   - Complete props with examples
   - Default + hover states
   - Full accessibility metadata
   - Fidelity: "detailed"
5. Create polished .md with:
   - Clean ASCII art using box-drawing characters
   - All variables documented
   - State examples
6. Validate against schema
7. Save both files to ./fluxwing/components/

Return: Component summary with preview

Target: 60-90 seconds
\`
})
\```
```

**Step 4: Update workflow to detect mode**

Modify: `skills/fluxwing-component-creator/SKILL.md`

Find the "Workflow" section and update Step 1:

```markdown
### Step 1: Determine Creation Mode

Check context to decide fast vs detailed mode:

**Use Fast Mode if:**
- Called by scaffolder skill (check for "screen context" in request)
- User explicitly requests "fast" or "quick" component
- Creating multiple components (6+ components)

**Use Detailed Mode if:**
- User creating single component interactively
- User requests "detailed" or "production" quality
- No screen context provided

**Default:** Detailed mode (safer, better quality)
```

**Step 5: Verify skill changes**

Run: `grep -n "Fast Mode" skills/fluxwing-component-creator/SKILL.md`
Expected: See Fast Mode sections in output

**Step 6: Commit component creator updates**

```bash
git add skills/fluxwing-component-creator/SKILL.md
git commit -m "feat: add fast mode to component creator

- Fast mode: template-based, <10s, .uxm only, sketch fidelity
- Detailed mode: full docs, 60-90s, .uxm + .md, detailed fidelity
- Auto-detect mode based on context (scaffolder vs user)
- Use haiku model for fast, sonnet for detailed"
```

---

### Task 4: Update Scaffolder with Smart Composer

**Goal:** Modify scaffolder to use fast mode components and have composer generate .md files.

**Files:**
- Modify: `skills/fluxwing-screen-scaffolder/SKILL.md`

**Step 1: Read current scaffolder workflow**

Run: `grep -A 20 "Step 3:" skills/fluxwing-screen-scaffolder/SKILL.md`
Expected: See component creation section

**Step 2: Update Step 3 for fast mode component creation**

Modify: `skills/fluxwing-screen-scaffolder/SKILL.md`

Find Step 3 (around line 75-158) and replace with:

```markdown
### Step 3: Create Missing Components (Fast Mode)

**If missing components exist**, spawn designer agents in FAST MODE - one agent per component:

**CRITICAL ORCHESTRATION RULES**:
1. ⚠️ **DO NOT** create TodoWrite list and work through it yourself
2. ⚠️ **DO NOT** create components yourself using Write/Edit tools
3. ✅ **DO** use Task tool to spawn one agent per missing component
4. ✅ **DO** send ONE message with ALL Task calls (parallel execution)
5. ✅ **DO** use FAST MODE (creates .uxm only, <10s per component)

**Fast Mode Creates:**
- Component .uxm files (sketch fidelity)
- NO .md files (composer will create these)

**Example: 6 missing components for banking-chat**

\```typescript
Task({
  subagent_type: "general-purpose",
  model: "haiku", // Fast model
  description: "Create message-bubble (fast)",
  prompt: "Create sketch-fidelity uxscii component from template.

Component: message-bubble
Type: container
Screen context: banking-chat

FAST MODE - Speed is critical! <10 seconds target.

Your task:
1. Load minimal template: {SKILL_ROOT}/../fluxwing-component-creator/templates/minimal/container.uxm.template
2. Replace variables:
   - {{id}} = 'message-bubble'
   - {{name}} = 'Message Bubble'
   - {{description}} = 'Chat message container for banking-chat'
   - {{timestamp}} = '${new Date().toISOString()}'
   - {{screenContext}} = 'banking-chat'
3. Verify JSON is well-formed
4. Save to ./fluxwing/components/message-bubble.uxm
5. DO NOT create .md file
6. DO NOT load documentation

Return: 'Created message-bubble.uxm (sketch fidelity)'

Target: <10 seconds"
})

Task({
  subagent_type: "general-purpose",
  model: "haiku",
  description: "Create message-input (fast)",
  prompt: "Create sketch-fidelity uxscii component from template.

Component: message-input
Type: input
Screen context: banking-chat

FAST MODE - Speed is critical! <10 seconds target.

Your task:
1. Load minimal template: {SKILL_ROOT}/../fluxwing-component-creator/templates/minimal/input.uxm.template
2. Replace variables:
   - {{id}} = 'message-input'
   - {{name}} = 'Message Input'
   - {{description}} = 'Chat input field for banking-chat'
   - {{timestamp}} = '${new Date().toISOString()}'
   - {{placeholder}} = 'Type a message...'
   - {{label}} = 'Message'
   - {{screenContext}} = 'banking-chat'
3. Verify JSON is well-formed
4. Save to ./fluxwing/components/message-input.uxm
5. DO NOT create .md file
6. DO NOT load documentation

Return: 'Created message-input.uxm (sketch fidelity)'

Target: <10 seconds"
})

// ... spawn ONE Task per missing component in SAME message ...
\```

**Performance:** 6 components × 10s = ~60 seconds (was 120-180s)

**Wait for ALL component agents to complete before Step 4.**
```

**Step 3: Update Step 4 for smart composer**

Modify: `skills/fluxwing-screen-scaffolder/SKILL.md`

Find Step 4 (around line 159-195) and replace with:

```markdown
### Step 4: Compose Screen with Component .md Generation

**Once all components exist**, spawn the composer agent:

**CRITICAL: Composer generates .md files for ALL components!**

This is the "smart composer" - it:
1. Generates missing component .md files
2. Loads documentation ONCE (not per component)
3. Creates screen .uxm + .md + .rendered.md
4. Focuses quality on .rendered.md (main deliverable)

\```typescript
Task({
  subagent_type: "general-purpose",
  model: "sonnet", // Smart model for quality composition
  description: "Compose ${screenName} with components",
  prompt: \`You are a uxscii screen composer creating production-ready screens.

Screen: ${screenName}
Components: ${componentList}
Layout: ${layoutStructure}

Your task has TWO parts:

═══════════════════════════════════════
PART 1: Generate Component .md Files
═══════════════════════════════════════

For each component in [${componentList}]:

1. Read component .uxm from ./fluxwing/components/
2. Check if .md exists:
   - If EXISTS: Skip to next component
   - If MISSING: Generate .md file (steps 3-5)

3. Load ASCII patterns (ONCE for all components):
   {SKILL_ROOT}/../fluxwing-component-creator/docs/06-ascii-patterns.md

4. Generate simple ASCII art based on component type:
   - button: Rounded box with label
   - input: Rectangular box with placeholder
   - card: Box with title and content area
   - container: Large box for children
   - Use dimensions from .uxm (ascii.width, ascii.height)
   - Keep it simple (sketch quality, not detailed)

5. Create .md file with:
   - Component description
   - ASCII art in code block
   - Variables from .uxm props
   - Save to ./fluxwing/components/\${componentId}.md

Example .md for button:
\\\`\\\`\\\`markdown
# \${componentName}

\${description}

## ASCII

\\\`\\\`\\\`
╭──────────────────╮
│  \{{label}}       │
╰──────────────────╯
\\\`\\\`\\\`

## Variables
- label (string): Button text
\\\`\\\`\\\`

═══════════════════════════════════════
PART 2: Compose Screen
═══════════════════════════════════════

1. Load schema: {SKILL_ROOT}/../fluxwing-component-creator/schemas/uxm-component.schema.json
2. Load screen docs: {SKILL_ROOT}/docs/04-screen-composition.md

3. Create screen .uxm:
   - type: "container"
   - props.components: [${componentList}]
   - layout: ${layoutStructure}
   - fidelity: "detailed" (screen is detailed even if components are sketch)

4. Create screen .md (template):
   - Use {{component:id}} syntax for component references
   - Show layout structure with placeholders

5. Create screen .rendered.md (MAIN DELIVERABLE):
   - Embed ACTUAL component ASCII (read from .md files you just created)
   - Use REAL example data (names: "Sarah Johnson", emails: "sarah@example.com", etc.)
   - Show all screen states (idle, loading, error if applicable)
   - High visual quality - this is what user will see!
   - Make it publication-ready

6. Save all 3 files to ./fluxwing/screens/

═══════════════════════════════════════
Performance Notes:
═══════════════════════════════════════

- Load ASCII patterns ONCE, reuse for all components
- Keep component .md simple (detailed version comes with enhancement)
- Focus quality effort on screen .rendered.md
- Target: 60-90 seconds total

Return summary:
- List component .md files created
- Screen files created
- Preview of .rendered.md (first 20 lines)
\`
})
\```
```

**Step 4: Update Step 5 reporting**

Modify: `skills/fluxwing-screen-scaffolder/SKILL.md`

Find Step 5 (around line 200-240) and update the report template:

```markdown
### Step 5: Report Results

Create comprehensive summary:

\```markdown
# Screen Scaffolding Complete ✓

## Screen: ${screenName}

### Phase 1: Fast Component Creation ⚡
${missingComponents.length > 0 ? missingComponents.map(c => `✓ ${c}.uxm (sketch fidelity, ~10s)`).join('\n') : 'None - all components existed'}

Time: ~${missingComponents.length * 10}s

### Phase 2: Smart Composition 🎨
Component .md files generated:
${componentList.map(c => `✓ ${c}.md (by composer)`).join('\n')}

Screen files created:
✓ ${screenName}.uxm
✓ ${screenName}.md (template)
✓ ${screenName}.rendered.md (MAIN DELIVERABLE)

Time: ~60-90s

### Total Time: ~${missingComponents.length * 10 + 75}s (${Math.round((missingComponents.length * 10 + 75)/60)} minutes)

### Performance Improvement
- Old: ~${missingComponents.length * 120}s (${Math.round(missingComponents.length * 120/60)} minutes)
- New: ~${missingComponents.length * 10 + 75}s (${Math.round((missingComponents.length * 10 + 75)/60)} minutes)
- Speedup: ${Math.round((1 - (missingComponents.length * 10 + 75)/(missingComponents.length * 120)) * 100)}%

## Next Steps

1. **Review rendered screen:**
   \`cat ./fluxwing/screens/${screenName}.rendered.md\`

2. **Enhance components (optional):**
   Use fluxwing-enhancer to upgrade from sketch to detailed/production fidelity

3. **Customize components:**
   Edit files in ./fluxwing/components/ as needed

## Files Created

**Components** (./fluxwing/components/):
- ${missingComponents.length} .uxm files (sketch fidelity)
- ${componentList.length} .md files (generated by composer)

**Screen** (./fluxwing/screens/):
- ${screenName}.uxm
- ${screenName}.md
- ${screenName}.rendered.md

**Total: ${missingComponents.length + componentList.length + 3} files**
\```
```

**Step 5: Verify scaffolder changes**

Run: `grep -n "PART 1: Generate Component .md Files" skills/fluxwing-screen-scaffolder/SKILL.md`
Expected: Find the new composer section

**Step 6: Commit scaffolder updates**

```bash
git add skills/fluxwing-screen-scaffolder/SKILL.md
git commit -m "feat: update scaffolder for fast mode + smart composer

- Use fast mode component creation (<10s per component)
- Smart composer generates component .md files in context
- Composer loads docs ONCE, not per component
- Focus quality on screen .rendered.md
- Target: 50% speedup (10min → 5min for 6 components)"
```

---

### Task 5: Test Fast Scaffolding

**Goal:** Verify Phase 1 achieves 50% speedup with banking-chat example.

**Files:**
- Test: End-to-end scaffolding workflow

**Step 1: Install updated skills**

Run: `./scripts/install.sh`
Expected: Skills installed to ~/.claude/skills/ with success message

**Step 2: Create test workspace**

```bash
mkdir -p test-workspace/fluxwing/components
mkdir -p test-workspace/fluxwing/screens
cd test-workspace
```

**Step 3: Time baseline (if old version still available)**

If you have the old version installed, time it:

```bash
time <invoke fluxwing-screen-scaffolder with banking-chat>
# Expected: 8-12 minutes for 6 components
```

**Step 4: Time new fast scaffolding**

```bash
time <invoke fluxwing-screen-scaffolder with banking-chat>
# Expected: 4-6 minutes for 6 components
```

**Step 5: Verify component files**

Run:
```bash
ls -lh fluxwing/components/*.uxm
wc -l fluxwing/components/*.uxm
```

Expected:
- 6 .uxm files exist
- Each is ~20-30 lines (sketch fidelity)

**Step 6: Verify component .md files**

Run:
```bash
ls -lh fluxwing/components/*.md
grep -c "ASCII" fluxwing/components/*.md
```

Expected:
- 6 .md files exist (created by composer)
- Each contains ASCII section

**Step 7: Verify screen files**

Run:
```bash
ls -lh fluxwing/screens/banking-chat.*
wc -l fluxwing/screens/banking-chat.rendered.md
```

Expected:
- banking-chat.uxm exists
- banking-chat.md exists
- banking-chat.rendered.md exists (100+ lines with embedded component ASCII)

**Step 8: Check .rendered.md quality**

Run: `head -50 fluxwing/screens/banking-chat.rendered.md`

Expected:
- See clean ASCII layout
- Real example data (names, emails)
- Embedded component ASCII art
- Multiple states if applicable

**Step 9: Validate all .uxm files against schema**

```bash
for file in fluxwing/components/*.uxm fluxwing/screens/*.uxm; do
  echo "Validating $file..."
  python3 -c "
import json, jsonschema
schema = json.load(open('../skills/fluxwing-component-creator/schemas/uxm-component.schema.json'))
data = json.load(open('$file'))
jsonschema.validate(data, schema)
print('✓ Valid')
" || echo "✗ Invalid"
done
```

Expected: All files show "✓ Valid"

**Step 10: Check fidelity levels**

Run:
```bash
for file in fluxwing/components/*.uxm; do
  echo -n "$file: "
  python3 -c "import json; print(json.load(open('$file'))['metadata'].get('fidelity', 'NOT SET'))"
done
```

Expected: All components show "sketch" fidelity

**Step 11: Document performance results**

Create: `test-workspace/PERFORMANCE.md`

```markdown
# Phase 1 Performance Results

## Test: Banking Chat Screen (6 components)

### Timing
- Old system: X minutes Y seconds
- New system: X minutes Y seconds
- Improvement: Z%

### Components Created
- message-bubble.uxm (sketch)
- message-input.uxm (sketch)
- send-button.uxm (sketch)
- chat-header.uxm (sketch)
- user-avatar.uxm (sketch)
- timestamp-badge.uxm (sketch)

### Component .md Files (Generated by Composer)
- All 6 .md files created
- Simple ASCII art
- Sketch quality

### Screen Files
- banking-chat.uxm ✓
- banking-chat.md ✓
- banking-chat.rendered.md ✓ (HIGH QUALITY)

### Quality Check
- Schema validation: PASS
- .rendered.md quality: [GOOD/ACCEPTABLE/NEEDS WORK]
- ASCII alignment: [GOOD/ACCEPTABLE/NEEDS WORK]

### Issues Found
[List any issues]

### Next Steps
- [Any adjustments needed]
```

**Step 12: Commit test results**

```bash
git add test-workspace/PERFORMANCE.md
git commit -m "test: verify Phase 1 fast scaffolding performance

- Tested banking-chat screen with 6 components
- Measured timing: [X]min (was [Y]min, [Z]% improvement)
- Verified all files created and valid
- Checked .rendered.md quality"
```

---

## Phase 2: Progressive Fidelity (Target: 3-4 minutes)

### Task 6: Create Enhancement Templates

**Goal:** Build reusable templates for adding interaction states to components.

**Files:**
- Create: `skills/fluxwing-component-creator/templates/state-additions/hover.json`
- Create: `skills/fluxwing-component-creator/templates/state-additions/focus.json`
- Create: `skills/fluxwing-component-creator/templates/state-additions/disabled.json`
- Create: `skills/fluxwing-component-creator/templates/state-additions/error.json`

**Step 1: Create state-additions directory**

```bash
mkdir -p skills/fluxwing-component-creator/templates/state-additions
```

**Step 2: Create hover.json template**

Create: `skills/fluxwing-component-creator/templates/state-additions/hover.json`

```json
{
  "name": "hover",
  "properties": {
    "backgroundColor": "#e0e0e0",
    "cursor": "pointer",
    "asciiModifier": "bold"
  },
  "description": "Visual feedback when user hovers over component"
}
```

**Step 3: Create focus.json template**

Create: `skills/fluxwing-component-creator/templates/state-additions/focus.json`

```json
{
  "name": "focus",
  "properties": {
    "outline": "2px solid #0066cc",
    "backgroundColor": "#f0f8ff",
    "asciiModifier": "focus-ring"
  },
  "description": "Visual indicator when component has keyboard focus"
}
```

**Step 4: Create disabled.json template**

Create: `skills/fluxwing-component-creator/templates/state-additions/disabled.json`

```json
{
  "name": "disabled",
  "properties": {
    "opacity": 0.5,
    "cursor": "not-allowed",
    "interactive": false,
    "asciiModifier": "grayed-out"
  },
  "description": "Component is not interactive or available"
}
```

**Step 5: Create error.json template**

Create: `skills/fluxwing-component-creator/templates/state-additions/error.json`

```json
{
  "name": "error",
  "properties": {
    "borderColor": "#cc0000",
    "backgroundColor": "#fff0f0",
    "showErrorMessage": true,
    "asciiModifier": "error-border"
  },
  "description": "Component has invalid input or error condition"
}
```

**Step 6: Verify all state templates are valid JSON**

Run:
```bash
for file in skills/fluxwing-component-creator/templates/state-additions/*.json; do
  echo "Checking $file..."
  python3 -c "import json; json.load(open('$file'))" && echo "✓ Valid JSON" || echo "✗ Invalid JSON"
done
```

Expected: All 4 files show "✓ Valid JSON"

**Step 7: Commit state templates**

```bash
git add skills/fluxwing-component-creator/templates/state-additions/
git commit -m "feat: add state addition templates for enhancement

- Add hover, focus, disabled, error state templates
- Enable quick state addition during enhancement
- Support progressive fidelity upgrades"
```

---

### Task 7: Create Fluxwing Enhancer Skill

**Goal:** Build new skill for upgrading components from sketch to production fidelity.

**Files:**
- Create: `skills/fluxwing-enhancer/SKILL.md`
- Create: `skills/fluxwing-enhancer/docs/enhancement-patterns.md`

**Step 1: Create skill directory**

```bash
mkdir -p skills/fluxwing-enhancer/docs
```

**Step 2: Create SKILL.md**

Create: `skills/fluxwing-enhancer/SKILL.md`

```markdown
---
name: Fluxwing Enhancer
description: Enhance uxscii components from sketch to production fidelity. Use when working with .uxm files marked as "fidelity: sketch" or when user wants to add detail and polish to components.
version: 0.0.1
author: Trabian
allowed-tools: Read, Write, Edit, Glob, Grep, Task, TodoWrite
---

# Fluxwing Enhancer

Progressively enhance uxscii components from sketch to production quality.

## Data Location Rules

**READ from:**
- `./fluxwing/components/` - User components to enhance
- `{SKILL_ROOT}/../fluxwing-component-creator/templates/state-additions/` - State templates
- `{SKILL_ROOT}/docs/` - Enhancement documentation

**WRITE to:**
- `./fluxwing/components/` - Updated component files (in place)
- `./fluxwing/screens/` - Updated screen .rendered.md (if applicable)

## Fidelity Levels

### sketch (Fast Scaffold Output)
- Basic .uxm with minimal metadata
- May lack .md file or have simple .md
- Single "default" state
- Creation time: ~10 seconds

**Characteristics:**
- Minimal description
- Generic tags
- No examples
- Basic props only

### basic (First Enhancement)
- Enriched metadata (better description, tags)
- Simple .md with clean ASCII
- Default state only
- Enhancement time: ~30 seconds

**Improvements over sketch:**
- Detailed description
- Specific tags
- Clean ASCII art
- Documented variables

### detailed (Second Enhancement)
- Rich metadata with usage examples
- Polished .md with careful ASCII art
- 2-3 interaction states (hover, focus)
- Enhancement time: ~90 seconds

**Improvements over basic:**
- Usage examples in metadata
- Hover + focus states
- Polished ASCII
- Props.examples array

### production (Final Polish)
- Complete metadata with accessibility details
- Publication-quality ASCII
- All relevant states (hover, focus, disabled, active, error)
- Full documentation
- Enhancement time: ~180 seconds

**Improvements over detailed:**
- All applicable states
- Complete accessibility metadata
- Keyboard shortcuts
- Publication-quality ASCII
- Edge case documentation

## Your Task

Help users enhance components from current fidelity to target fidelity.

### Workflow

#### Step 1: Inventory Components

Check what components exist and their current fidelity:

```bash
ls ./fluxwing/components/*.uxm
```

For each component, read fidelity level:
```bash
python3 -c "import json; print(json.load(open('./fluxwing/components/button.uxm'))['metadata'].get('fidelity', 'detailed'))"
```

List components by fidelity:
- sketch: [component-ids]
- basic: [component-ids]
- detailed: [component-ids]
- production: [component-ids]

#### Step 2: Determine Target Fidelity

Ask user or use defaults:

**User specifies:**
- "Enhance to basic"
- "Upgrade to detailed"
- "Make production-ready"

**Auto-select (if not specified):**
- sketch → detailed (most common, best balance)
- basic → detailed
- detailed → production

#### Step 3: Spawn Enhancement Agents

**If enhancing multiple components (3+):**
- Spawn agents in parallel (one per component)
- Each agent enhances independently
- Wait for all to complete

**If enhancing single component:**
- Spawn single agent
- Focus on quality

**Enhancement Agent Prompt:**

```typescript
Task({
  subagent_type: "general-purpose",
  model: "sonnet", // Quality matters for enhancement
  description: "Enhance ${componentId} to ${targetFidelity}",
  prompt: `Enhance uxscii component from ${currentFidelity} to ${targetFidelity}.

Component: ${componentId}
Current fidelity: ${currentFidelity}
Target fidelity: ${targetFidelity}

Your task:
1. Read ./fluxwing/components/${componentId}.uxm
2. Read ./fluxwing/components/${componentId}.md (if exists)
3. Load enhancement patterns: {SKILL_ROOT}/docs/enhancement-patterns.md
4. Load state templates: {SKILL_ROOT}/../fluxwing-component-creator/templates/state-additions/

5. Enhance based on target fidelity:

   ${targetFidelity === 'basic' ? `
   For "basic" fidelity:
   - Improve metadata.description (1-2 sentences, specific)
   - Add specific tags (not just generic type)
   - Create/improve .md with clean ASCII art
   - Keep single default state
   - Update fidelity field to "basic"
   ` : ''}

   ${targetFidelity === 'detailed' ? `
   For "detailed" fidelity:
   - All "basic" enhancements (if not already done)
   - Add hover state (use {SKILL_ROOT}/../fluxwing-component-creator/templates/state-additions/hover.json)
   - Add focus state (use {SKILL_ROOT}/../fluxwing-component-creator/templates/state-additions/focus.json)
   - Polish ASCII art (smooth alignment, consistent spacing)
   - Add props.examples array (2-3 usage examples)
   - Update fidelity field to "detailed"
   ` : ''}

   ${targetFidelity === 'production' ? `
   For "production" fidelity:
   - All "detailed" enhancements (if not already done)
   - Add disabled state (if applicable for component type)
   - Add error state (if applicable for component type)
   - Complete accessibility metadata:
     - aria-label templates
     - keyboard shortcuts
     - screen reader descriptions
   - Add behavior.keyboardShortcuts (if interactive)
   - Publication-quality ASCII (pixel-perfect alignment)
   - Document edge cases in description
   - Update fidelity field to "production"
   ` : ''}

6. Save updated files (overwrite existing)
7. Verify JSON is valid
8. Return enhancement summary

Target time: ${targetTime[targetFidelity]} seconds

Return format:
"Enhanced ${componentId}: ${currentFidelity} → ${targetFidelity}
- Added X states
- Improved metadata
- Polished ASCII"
`
})
```

#### Step 4: Regenerate Screen (If Applicable)

If components belong to a screen, regenerate .rendered.md:

```bash
# Find which screen uses this component
grep -l "${componentId}" ./fluxwing/screens/*.uxm
```

If found, respawn composer to regenerate .rendered.md with enhanced components.

#### Step 5: Report Results

```markdown
# Enhancement Complete ✓

## Components Enhanced

${enhancedComponents.map(c => `
### ${c.id}
- Before: ${c.oldFidelity}
- After: ${c.newFidelity}
- Time: ${c.time}s
- Changes:
  - ${c.changes.join('\n  - ')}
`).join('\n')}

## Total Time: ${totalTime}s

## Screens Updated
${updatedScreens.length > 0 ? updatedScreens.map(s => `- ${s}.rendered.md regenerated`).join('\n') : 'None'}

## Next Steps
1. Review enhanced components: \`ls ./fluxwing/components/\`
2. View updated screen: \`cat ./fluxwing/screens/${screenName}.rendered.md\`
3. Customize as needed
```

## Example Usage

**User:** "Enhance all components in banking-chat to detailed"

**Enhancer:**
1. Finds 6 sketch components
2. Spawns 6 enhancement agents (parallel)
3. Each agent: sketch → detailed (~90s)
4. Regenerates banking-chat.rendered.md
5. Total time: ~120 seconds

**User:** "Make submit-button production-ready"

**Enhancer:**
1. Finds submit-button (detailed fidelity)
2. Spawns 1 enhancement agent
3. Agent: detailed → production (~180s)
4. Updates screen if applicable
5. Total time: ~180 seconds

## Success Criteria

- ✓ Components upgraded to target fidelity
- ✓ All states added as specified
- ✓ ASCII art improved
- ✓ Metadata enriched
- ✓ Screen .rendered.md regenerated (if applicable)
- ✓ All files validate against schema

You are building a progressive enhancement system for maximum flexibility!
```

**Step 3: Create enhancement-patterns.md**

Create: `skills/fluxwing-enhancer/docs/enhancement-patterns.md`

```markdown
# Enhancement Patterns

How to enhance components from sketch to production fidelity.

## Fidelity Progression Matrix

| Aspect | sketch | basic | detailed | production |
|--------|--------|-------|----------|------------|
| **Description** | Generic | Specific (1-2 sent) | Detailed (3-4 sent) | Complete with edge cases |
| **Tags** | Type only | Type + context | Type + context + features | All applicable tags |
| **ASCII Art** | Missing or minimal | Clean and aligned | Polished with spacing | Pixel-perfect, publication-quality |
| **States** | default only | default only | default + hover + focus | All applicable states |
| **Props** | Minimal | Standard | + examples array | + validation rules |
| **Accessibility** | Basic role | + focusable | + aria-label | + keyboard shortcuts + full a11y |
| **Time** | 10s | 30s | 90s | 180s |

## Enhancement Checklist by Fidelity

### sketch → basic (30s)

**Metadata:**
- [ ] Improve description from generic to specific
- [ ] Add relevant tags beyond just type
- [ ] Keep created/modified timestamps

**ASCII:**
- [ ] Create .md if missing
- [ ] Add clean ASCII art using box-drawing characters
- [ ] Match dimensions from .uxm (ascii.width, ascii.height)
- [ ] Basic alignment (don't need perfect)

**Props:**
- [ ] Document all variables in .md
- [ ] No need to add examples yet

**States:**
- [ ] Keep default state only

**Example:**

Before (sketch):
```json
{
  "metadata": {
    "description": "Button component",
    "tags": ["button"]
  }
}
```

After (basic):
```json
{
  "metadata": {
    "description": "Submit button for form submission with primary action styling",
    "tags": ["button", "submit", "form", "primary-action"],
    "fidelity": "basic"
  }
}
```

### basic → detailed (90s)

**Metadata:**
- [ ] Expand description with usage context
- [ ] Add props.examples array (2-3 examples)

**ASCII:**
- [ ] Polish alignment (consistent spacing)
- [ ] Smooth corners and borders
- [ ] Add visual details

**States:**
- [ ] Add hover state (use hover.json template)
- [ ] Add focus state (use focus.json template)
- [ ] Document state behavior in .md

**Props:**
- [ ] Add examples showing different prop combinations

**Example:**

Before (basic):
```json
{
  "props": {
    "label": "Submit"
  },
  "behavior": {
    "states": [
      {"name": "default", "properties": {}}
    ]
  }
}
```

After (detailed):
```json
{
  "props": {
    "label": "Submit",
    "examples": [
      {"label": "Submit", "context": "Form submission"},
      {"label": "Sign In", "context": "Login form"},
      {"label": "Continue", "context": "Multi-step process"}
    ]
  },
  "behavior": {
    "states": [
      {"name": "default", "properties": {}},
      {"name": "hover", "properties": {
        "backgroundColor": "#e0e0e0",
        "cursor": "pointer"
      }},
      {"name": "focus", "properties": {
        "outline": "2px solid #0066cc",
        "backgroundColor": "#f0f8ff"
      }}
    ]
  },
  "metadata": {
    "fidelity": "detailed"
  }
}
```

### detailed → production (180s)

**Metadata:**
- [ ] Add edge case documentation
- [ ] Complete all optional fields
- [ ] Add keywords for searchability

**ASCII:**
- [ ] Pixel-perfect alignment
- [ ] Publication-quality rendering
- [ ] Consider printing/export appearance

**States:**
- [ ] Add disabled state (if applicable)
- [ ] Add error state (if applicable for forms)
- [ ] Add active/pressed state (for buttons)
- [ ] Add loading state (if async action)

**Accessibility:**
- [ ] Add keyboard shortcuts
- [ ] Add screen reader descriptions
- [ ] Add ARIA label templates
- [ ] Document keyboard navigation

**Props:**
- [ ] Add validation rules
- [ ] Document prop constraints
- [ ] Add deprecation notices if needed

**Example:**

Before (detailed):
```json
{
  "behavior": {
    "states": [
      {"name": "default", "properties": {}},
      {"name": "hover", "properties": {...}},
      {"name": "focus", "properties": {...}}
    ],
    "accessibility": {
      "role": "button",
      "focusable": true
    }
  }
}
```

After (production):
```json
{
  "behavior": {
    "states": [
      {"name": "default", "properties": {}},
      {"name": "hover", "properties": {...}},
      {"name": "focus", "properties": {...}},
      {"name": "disabled", "properties": {
        "opacity": 0.5,
        "cursor": "not-allowed",
        "interactive": false
      }},
      {"name": "active", "properties": {
        "backgroundColor": "#c0c0c0",
        "transform": "translateY(1px)"
      }}
    ],
    "accessibility": {
      "role": "button",
      "focusable": true,
      "ariaLabel": "{{label}} - {{context}}",
      "keyboardShortcuts": [
        {"key": "Enter", "action": "activate"},
        {"key": "Space", "action": "activate"}
      ]
    }
  },
  "metadata": {
    "fidelity": "production",
    "description": "Submit button for form submission with primary action styling. Supports keyboard navigation (Enter/Space), shows visual feedback on hover and focus, and provides disabled state for form validation. Use for primary actions like 'Submit', 'Sign In', 'Continue'."
  }
}
```

## State Addition Guide

### When to Add Each State

**hover:**
- All interactive components (button, input, link)
- Cards if clickable
- Navigation items

**focus:**
- All focusable components
- Required for keyboard navigation
- WCAG AA compliance

**disabled:**
- Form controls (button, input, checkbox, select)
- Actions that may be unavailable
- Not needed for display-only components

**error:**
- Form inputs (text, email, password)
- Validation feedback required
- Not needed for buttons or display components

**active/pressed:**
- Buttons
- Links
- Interactive cards
- Shows immediate feedback

**loading:**
- Buttons triggering async actions
- Forms submitting data
- Components fetching data

## ASCII Art Enhancement

### sketch → basic

Focus: Functionality over beauty
- Use basic box-drawing characters (─│┌┐└┘)
- Align text roughly
- Match dimensions

Example:
```
┌──────────────────┐
│ Submit           │
└──────────────────┘
```

### basic → detailed

Focus: Polish and consistency
- Use rounded corners (╭╮╰╯) for friendly feel
- Careful spacing (center-align text)
- Smooth visual flow

Example:
```
╭──────────────────╮
│     Submit       │
╰──────────────────╯
```

### detailed → production

Focus: Pixel-perfect publication quality
- Perfect alignment (character-level precision)
- Consider all states (how hover/focus changes appearance)
- Professional appearance for screenshots

Example:
```
╭──────────────────╮
│      Submit      │
╰──────────────────╯

Hover:
╔══════════════════╗
║      Submit      ║
╚══════════════════╝
```

## Common Patterns

### Button Enhancement

sketch → basic:
- Add clean box ASCII
- Specific description

basic → detailed:
- Add hover + focus states
- Polish ASCII with rounded corners
- Add usage examples

detailed → production:
- Add disabled + active states
- Add keyboard shortcuts
- Pixel-perfect ASCII

### Input Enhancement

sketch → basic:
- Add input box ASCII with placeholder
- Specific description

basic → detailed:
- Add focus state
- Add label positioning
- Add usage examples

detailed → production:
- Add error state
- Add disabled state
- Add validation rules
- Full accessibility

### Card Enhancement

sketch → basic:
- Add card box with title/content areas
- Specific description

basic → detailed:
- Polish layout and spacing
- Add examples (different content)

detailed → production:
- Add hover state (if interactive)
- Perfect alignment
- Complete metadata

## Performance Targets

| Enhancement | Components | Time Target |
|-------------|-----------|-------------|
| 1 component to basic | 1 | 30s |
| 1 component to detailed | 1 | 90s |
| 1 component to production | 1 | 180s |
| 6 components to basic (parallel) | 6 | 30s |
| 6 components to detailed (parallel) | 6 | 90s |
| 6 components to production (parallel) | 6 | 180s |

Parallel execution: Multiple agents working simultaneously, so total time ≈ single component time!
```

**Step 4: Commit enhancer skill**

```bash
git add skills/fluxwing-enhancer/
git commit -m "feat: create fluxwing-enhancer skill for progressive fidelity

- Support sketch → basic → detailed → production progression
- Parallel enhancement for multiple components
- State addition templates integration
- Enhancement patterns documentation
- Target: 30s basic, 90s detailed, 180s production per component"
```

---

### Task 8: Update Scaffolder for Auto-Enhancement

**Goal:** Add optional auto-enhancement to scaffolder with quality presets.

**Files:**
- Modify: `skills/fluxwing-screen-scaffolder/SKILL.md`

**Step 1: Add quality presets documentation**

Modify: `skills/fluxwing-screen-scaffolder/SKILL.md`

After the "Your Task" section (around line 30), add:

```markdown
## Quality Presets

Scaffolder supports different quality levels for speed vs fidelity tradeoffs:

### fast (60-90s)
- Create components (sketch fidelity)
- Compose screen
- Skip enhancement
- Use when: Rapid prototyping, early iteration

**Output:**
- Components: sketch fidelity (.uxm only initially, .md by composer)
- Screen: .rendered.md with basic quality
- Time: ~60-90s for 6 components

### balanced (90-150s)
- Create components (sketch fidelity)
- Compose screen
- Enhance to basic fidelity
- Use when: Quick iteration with decent quality

**Output:**
- Components: basic fidelity (.uxm + improved .md)
- Screen: .rendered.md with good quality
- Time: ~90-150s for 6 components

### detailed (180-240s) **[DEFAULT]**
- Create components (sketch fidelity)
- Compose screen
- Enhance to detailed fidelity (hover + focus states)
- Use when: Production-ready screens, demos

**Output:**
- Components: detailed fidelity (.uxm + polished .md + states)
- Screen: .rendered.md with high quality
- Time: ~180-240s for 6 components

### production (300-400s)
- Create components (sketch fidelity)
- Compose screen
- Enhance to production fidelity (all states + full a11y)
- Use when: Final polish, publication

**Output:**
- Components: production fidelity (complete)
- Screen: .rendered.md with publication quality
- Time: ~300-400s for 6 components

**Default: detailed** (best balance of quality and speed)
```

**Step 2: Add new step for auto-enhancement**

Modify: `skills/fluxwing-screen-scaffolder/SKILL.md`

After Step 4 (Compose Screen), add Step 5:

```markdown
### Step 5: Auto-Enhancement (Based on Quality Preset)

After screen composition, optionally enhance components based on quality preset.

**Determine enhancement level:**
- fast → Skip (no enhancement)
- balanced → Enhance to "basic"
- detailed → Enhance to "detailed" [DEFAULT]
- production → Enhance to "production"

**If enhancement needed:**

```typescript
Task({
  subagent_type: "general-purpose",
  model: "sonnet", // Quality model for enhancement
  description: "Enhance screen components to ${targetFidelity}",
  prompt: `Enhance all components in ${screenName} to ${targetFidelity} fidelity.

Screen: ${screenName}
Components: ${componentList}
Current fidelity: sketch
Target fidelity: ${targetFidelity}

Use fluxwing-enhancer patterns:

Your task:
1. Load enhancement patterns: {SKILL_ROOT}/../fluxwing-enhancer/docs/enhancement-patterns.md
2. Load state templates: {SKILL_ROOT}/../fluxwing-component-creator/templates/state-additions/

3. For EACH component (process in parallel if possible):

   Read: ./fluxwing/components/\${componentId}.uxm
   Read: ./fluxwing/components/\${componentId}.md

   Enhance based on target:

   ${targetFidelity === 'basic' ? `
   basic fidelity:
   - Improve metadata.description (specific, 1-2 sentences)
   - Add relevant tags
   - Polish .md ASCII (clean, aligned)
   - Keep default state only
   - Update fidelity field
   ` : ''}

   ${targetFidelity === 'detailed' ? `
   detailed fidelity:
   - All "basic" enhancements
   - Add hover state (use templates/state-additions/hover.json)
   - Add focus state (use templates/state-additions/focus.json)
   - Polish ASCII art (rounded corners, smooth)
   - Add props.examples array (2-3 examples)
   - Update fidelity field
   ` : ''}

   ${targetFidelity === 'production' ? `
   production fidelity:
   - All "detailed" enhancements
   - Add disabled state (if applicable)
   - Add error state (if form component)
   - Complete accessibility metadata
   - Add keyboard shortcuts
   - Pixel-perfect ASCII
   - Update fidelity field
   ` : ''}

   Save: Updated .uxm and .md to ./fluxwing/components/

4. After ALL components enhanced:

   Regenerate screen .rendered.md:
   - Read enhanced component .md files
   - Embed improved ASCII in .rendered.md
   - Maintain real example data
   - Save to ./fluxwing/screens/

5. Return summary:
   - Components enhanced: [list with changes]
   - Total time: Xs
   - Screen .rendered.md regenerated

Target time:
- basic: 30s (parallel for all components)
- detailed: 90s (parallel for all components)
- production: 180s (parallel for all components)

Note: Process components in parallel when possible for maximum speed!
`
})
```

**Enhancement is parallel:** All 6 components enhanced simultaneously, so time ≈ single component time!
```

**Step 3: Update Step 6 (Report Results)**

Modify: `skills/fluxwing-screen-scaffolder/SKILL.md`

Update the reporting section to include enhancement info:

```markdown
### Step 6: Report Results

Create comprehensive summary including enhancement details:

```markdown
# Screen Scaffolding Complete ✓

## Screen: ${screenName}
## Quality Preset: ${qualityPreset}

### Phase 1: Fast Component Creation ⚡
${missingComponents.map(c => `✓ ${c}.uxm (sketch fidelity, ~10s)`).join('\n')}

Time: ~${missingComponents.length * 10}s

### Phase 2: Smart Composition 🎨
Component .md files generated:
${componentList.map(c => `✓ ${c}.md (by composer)`).join('\n')}

Screen files created:
✓ ${screenName}.uxm
✓ ${screenName}.md (template)
✓ ${screenName}.rendered.md

Time: ~60-90s

${qualityPreset !== 'fast' ? `
### Phase 3: Auto-Enhancement ✨
Components enhanced to ${targetFidelity} fidelity:
${componentList.map(c => `✓ ${c}: sketch → ${targetFidelity}`).join('\n')}

Enhancements applied:
${targetFidelity === 'basic' ? '- Improved descriptions\n- Added specific tags\n- Polished ASCII' : ''}
${targetFidelity === 'detailed' ? '- Improved descriptions\n- Added hover + focus states\n- Polished ASCII\n- Added usage examples' : ''}
${targetFidelity === 'production' ? '- All detailed enhancements\n- Added disabled + error states\n- Complete accessibility\n- Pixel-perfect ASCII' : ''}

Screen .rendered.md regenerated with enhanced components

Time: ~${enhancementTime[targetFidelity]}s
` : ''}

### Total Time: ~${totalTime}s (${Math.round(totalTime/60)} minutes)

### Performance
- Target: ${targetTime[qualityPreset]}
- Actual: ${totalTime}s
- Status: ${totalTime <= targetTime[qualityPreset] ? '✓ ON TARGET' : '⚠ OVER TARGET'}

## Files Created

**Components** (./fluxwing/components/):
- ${componentList.length} .uxm files (${finalFidelity} fidelity)
- ${componentList.length} .md files

**Screen** (./fluxwing/screens/):
- ${screenName}.uxm
- ${screenName}.md
- ${screenName}.rendered.md

**Total: ${componentList.length * 2 + 3} files**

## Quality Assessment

- Component fidelity: ${finalFidelity}
- Screen .rendered.md: ${qualityPreset === 'production' ? 'Publication-ready' : qualityPreset === 'detailed' ? 'High quality' : qualityPreset === 'balanced' ? 'Good quality' : 'Basic quality'}
- States included: ${statesCount} states per component
- Accessibility: ${qualityPreset === 'production' ? 'Complete' : qualityPreset === 'detailed' ? 'Good' : 'Basic'}

## Next Steps

1. **Review rendered screen:**
   \`cat ./fluxwing/screens/${screenName}.rendered.md\`

2. **Further enhancement (optional):**
   ${qualityPreset !== 'production' ? `Use /fluxwing-enhance to upgrade to ${nextFidelity} fidelity` : 'Already at maximum fidelity'}

3. **Customize components:**
   Edit ./fluxwing/components/ files as needed

4. **View components:**
   Use /fluxwing-view to inspect individual components
```
```

**Step 4: Add preset detection in workflow**

Modify: `skills/fluxwing-screen-scaffolder/SKILL.md`

Update Step 1 (Understand the Screen) to include quality preset:

```markdown
### Step 1: Understand the Screen

Ask about the screen they want to create:

**Screen details:**
- **Screen name and purpose**: login, dashboard, profile, settings, checkout, etc.
- **Required components**: forms, navigation, cards, modals, lists, etc.
- **Layout structure**: vertical, horizontal, grid, sidebar+main, etc.

**Quality preset** (optional):
- **fast** - Quick prototype (60-90s)
- **balanced** - Good quality (90-150s)
- **detailed** - High quality (180-240s) [DEFAULT]
- **production** - Publication ready (300-400s)

If user doesn't specify, use **detailed** preset.
```

**Step 5: Commit scaffolder auto-enhancement**

```bash
git add skills/fluxwing-screen-scaffolder/SKILL.md
git commit -m "feat: add auto-enhancement with quality presets to scaffolder

- Add 4 quality presets: fast, balanced, detailed, production
- Default to 'detailed' (best balance)
- Auto-enhance after composition based on preset
- Parallel enhancement for all components
- Target: 3-4 minutes for detailed quality (6 components)"
```

---

### Task 9: Test Complete Workflow (Phase 2)

**Goal:** Verify end-to-end fast scaffolding with auto-enhancement achieves 3-4 minute target.

**Files:**
- Test: Complete workflow with all 4 quality presets

**Step 1: Install updated skills**

```bash
./scripts/install.sh
```

Expected: All skills installed including fluxwing-enhancer

**Step 2: Create fresh test workspace**

```bash
rm -rf test-workspace
mkdir -p test-workspace/fluxwing/components test-workspace/fluxwing/screens
cd test-workspace
```

**Step 3: Test "fast" preset (baseline)**

```bash
time <invoke scaffolder: banking-chat with quality=fast>
```

Expected:
- Time: 60-90s
- Components: sketch fidelity
- Screen: basic .rendered.md

**Step 4: Test "balanced" preset**

```bash
rm -rf fluxwing/*
time <invoke scaffolder: banking-chat with quality=balanced>
```

Expected:
- Time: 90-150s
- Components: basic fidelity
- Screen: good .rendered.md

**Step 5: Test "detailed" preset (default)**

```bash
rm -rf fluxwing/*
time <invoke scaffolder: banking-chat with quality=detailed>
```

Expected:
- Time: 180-240s (3-4 minutes) **TARGET**
- Components: detailed fidelity with hover + focus states
- Screen: high-quality .rendered.md

**Step 6: Test "production" preset**

```bash
rm -rf fluxwing/*
time <invoke scaffolder: banking-chat with quality=production>
```

Expected:
- Time: 300-400s (5-6 minutes)
- Components: production fidelity with all states
- Screen: publication-quality .rendered.md

**Step 7: Verify component fidelity levels**

```bash
for file in fluxwing/components/*.uxm; do
  echo -n "$(basename $file): "
  python3 -c "import json; d = json.load(open('$file')); print(f\"{d['metadata'].get('fidelity', 'NOT SET')} - {len(d['behavior']['states'])} states\")"
done
```

Expected for "detailed" preset:
- All components: "detailed - 3 states" (default, hover, focus)

**Step 8: Verify screen .rendered.md quality**

```bash
cat fluxwing/screens/banking-chat.rendered.md | head -100
```

Expected:
- Clean ASCII layout
- Embedded component ASCII (from enhanced .md files)
- Real example data
- Multiple states shown (if applicable)

**Step 9: Validate all files against schema**

```bash
for file in fluxwing/components/*.uxm fluxwing/screens/*.uxm; do
  python3 -c "
import json, jsonschema
schema = json.load(open('../skills/fluxwing-component-creator/schemas/uxm-component.schema.json'))
data = json.load(open('$file'))
try:
  jsonschema.validate(data, schema)
  print(f'✓ {open(\"$file\").name}')
except Exception as e:
  print(f'✗ {open(\"$file\").name}: {e}')
"
done
```

Expected: All files validate successfully

**Step 10: Document Phase 2 performance**

Create: `test-workspace/PHASE2-RESULTS.md`

```markdown
# Phase 2 Performance Results

## Test: Banking Chat Screen (6 components)

### fast Preset
- Time: Xs
- Component fidelity: sketch
- States per component: 1 (default)
- .rendered.md quality: Basic

### balanced Preset
- Time: Xs
- Component fidelity: basic
- States per component: 1 (default)
- .rendered.md quality: Good

### detailed Preset [DEFAULT]
- Time: Xs (TARGET: 180-240s)
- Component fidelity: detailed
- States per component: 3 (default + hover + focus)
- .rendered.md quality: High

### production Preset
- Time: Xs
- Component fidelity: production
- States per component: 5+ (all applicable states)
- .rendered.md quality: Publication

## Comparison to Phase 1

| Metric | Phase 1 | Phase 2 (detailed) | Improvement |
|--------|---------|-------------------|-------------|
| Time | ~5 min | ~3-4 min | 20-40% faster |
| Component quality | sketch | detailed | +2 fidelity levels |
| States | 1 | 3 | +200% |
| .rendered.md | good | high | Better |

## Comparison to Original

| Metric | Original | Phase 2 (detailed) | Improvement |
|--------|---------|-------------------|-------------|
| Time | ~10 min | ~3-4 min | 60-70% faster |
| Quality | detailed | detailed | Same |
| Workflow | All upfront | Progressive | More flexible |

## Quality Assessment

### Component Files
- [X] All .uxm files valid against schema
- [X] All .md files have matching variables
- [X] Fidelity levels correct for preset
- [X] States appropriate for fidelity level

### Screen Files
- [X] Screen .uxm valid
- [X] Screen .md template correct
- [X] Screen .rendered.md high quality
- [X] ASCII alignment clean

### Issues Found
[List any issues]

### Success Criteria
- [X] "detailed" preset completes in 3-4 minutes
- [X] Components have appropriate fidelity
- [X] .rendered.md is high quality
- [X] All files validate
```

**Step 11: Commit Phase 2 test results**

```bash
git add test-workspace/PHASE2-RESULTS.md
git commit -m "test: verify Phase 2 progressive fidelity system

- Tested all 4 quality presets (fast/balanced/detailed/production)
- Verified 'detailed' preset achieves 3-4 minute target
- Confirmed component fidelity levels correct
- Validated .rendered.md quality improvement
- All files pass schema validation"
```

---

## Success Criteria & Verification

### Performance Targets

After Phase 2 implementation, verify these targets:

| Screen Complexity | Components | Target Time (detailed preset) | Original Time | Improvement |
|------------------|-----------|------------------------------|---------------|-------------|
| Simple (login) | 3 | 90-120s | 5 min | 60% |
| Medium (banking-chat) | 6 | 180-240s | 10 min | 60-70% |
| Complex (dashboard) | 12 | 360-480s | 20 min | 60-70% |

### Quality Targets

- [ ] All .uxm files validate against schema
- [ ] All .md files have matching variables in .uxm
- [ ] Screen .rendered.md is publication-ready (detailed+ presets)
- [ ] Components have appropriate states for fidelity level
- [ ] ASCII art is clean and aligned
- [ ] Real example data is realistic

### Flexibility Targets

- [ ] Users can choose quality preset (fast/balanced/detailed/production)
- [ ] Default preset (detailed) gives best balance
- [ ] Fast preset available for rapid prototyping
- [ ] Production preset available for final polish

## Next Steps After Implementation

1. **User Testing**
   - Get feedback on quality presets
   - Adjust timing targets if needed
   - Gather real-world usage data

2. **Documentation**
   - Update README with new workflows
   - Create video demos
   - Write migration guide

3. **Phase 3 Optimizations** (Future)
   - Parallel .md generation in composer
   - Doc caching for repeat operations
   - Smart defaults based on user history

4. **Monitoring**
   - Track actual vs target times
   - Identify bottlenecks
   - Optimize slowest operations

---

## Execution Options

This plan is ready for execution using either approach:

**Option 1: Subagent-Driven Development (this session)**
- Stay in current session
- Spawn fresh subagent per task
- Code review between tasks
- Fast iteration with quality gates
- Use: @superpowers:subagent-driven-development

**Option 2: Parallel Session (separate)**
- Open new Claude Code session
- Navigate to worktree
- Load this plan
- Execute in batches with checkpoints
- Use: @superpowers:executing-plans

Which approach would you like to use?
