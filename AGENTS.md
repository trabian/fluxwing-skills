# Repository Guidelines

## Project Structure & Module Organization
Fluxwing skills live under `.claude/skills/<skill-name>/` with consistent `docs/`, `templates/`, `schemas/`, and `scripts/` folders; treat bundled assets as the canonical source and adjust them deliberately. Workspace output belongs in `./fluxwing/` and should stay untracked, while site collateral is under `docs/` and helper automation sits in `scripts/`.

## Build, Test, and Development Commands
`./scripts/install.sh` provisions all seven skills globally to `~/.claude/skills`, and `./scripts/uninstall.sh` removes them. Serve the documentation site with `npm run docs:dev`, which launches an `http-server` on port 8080 for quick visual checks. When auditing skill files, lean on the helper commands in `TODO.md` (for example `ls ~/.claude/skills/fluxwing-*/SKILL.md`) instead of ad-hoc globbing.

## Coding Style & Naming Conventions
Markdown files use sentence-case headings, one blank line between sections, and fenced code blocks with language hints. JSON and `.uxm` metadata are formatted with two-space indentation and ordered keys where practical; keep identifiers lowercase with hyphen separators (`uxscii-component-viewer`). YAML front matter in `SKILL.md` files mirrors that structure—stick to lowercase keys and quote strings only when needed. Shell scripts should remain POSIX/bash compatible, start with `#!/bin/bash`, and prefer explicit `set -euo pipefail` guards.

## Testing Guidelines
There is no automated test harness yet, so rely on the manual flows captured in `TODO.md`: exercise each skill via Claude prompts ("Create a button", "Build a login screen") and verify the resulting files populate `./fluxwing/`. After edits, rerun `./scripts/install.sh` to update the global skills, and spot-check schema changes against the existing templates in each skill's `schemas/` folder. Document any gaps or regressions directly in `TODO.md` to keep the manual test matrix current.

## Commit & Pull Request Guidelines
Recent history favors compact, descriptive commit subjects (`Add local development server for GitHub Pages`, `site fixes`); follow that pattern and include detail in the body only when necessary. Each PR should call out the affected skill(s) or docs section, summarize manual test coverage, and link any related issues. Attach screenshots or terminal captures when tweaking docs or install flows, and avoid merging without another maintainer reviewing schema or template changes.
