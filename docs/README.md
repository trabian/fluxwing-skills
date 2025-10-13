# Development Documentation

This directory contains internal development documentation, planning materials, and historical records for the Fluxwing marketplace project.

## Contents

- **CLEANUP_SUMMARY.md** - Summary of plugin cleanup work
- **CONSISTENCY_IMPROVEMENT_PLAN.md** - Plan for improving consistency across the plugin
- **CONSISTENCY_TEST_PLAN.md** - Detailed test plan for consistency validation
- **CONSISTENCY_TODO.md** - TODO items for consistency improvements
- **FINAL_FIX.md** - Documentation of final fixes
- **FIXES_SUMMARY.md** - Summary of various fixes applied
- **PLUGIN_FIXES.md** - Specific plugin-related fixes
- **claude_code_plugin_guide.md** - Guide for Claude Code plugin development
- **plugin_review.md** - Review of plugin structure and implementation

## Project Structure

The marketplace repository is organized as follows:

```
fluxwing-marketplace/        # Repository root
├── README.md               # Main documentation (marketplace + plugin)
├── package.json            # NPM scripts for dev and testing
├── INSTALLATION_GUIDE.md   # Installation instructions
├── docs/                   # This directory - development docs
├── tests/                  # Automated consistency tests
└── fluxwing/              # The actual plugin
    ├── README.md          # (Kept for plugin-specific context)
    ├── commands/          # Slash commands
    ├── agents/            # AI agents
    ├── data/              # Schemas, examples, docs
    └── [other files]
```

## For Contributors

When contributing to the project:

1. User-facing documentation should reference the root `README.md`
2. Plugin-specific technical docs live in `fluxwing/`
3. Development/planning docs belong here in `docs/`
4. See `fluxwing/CONTRIBUTING.md` for contribution guidelines
