# Estexis Frontend Agent Instructions

This repository is the frontend for **grihoo.com** (folder name `estexis_frontend`), a multilingual real estate marketplace built with React + Vite. Shared agent behavior lives in `CLAUDE.md`, `.codex/memory.md`, `.github/copilot-instructions.md`, and `CLOUDFLARE_DEPLOYMENT.md`.

## Canonical Skills

The canonical project skills live in `.claude/skills/`. Use these as source of truth across Claude, Codex/OpenAI Skills, GitHub Copilot, and Google Antigravity:

- `estexis-frontend-repo-orientation`: orient on the codebase before non-trivial changes.
- `estexis-frontend-component`: build or modify React components.
- `estexis-frontend-page`: add or modify a route/page.
- `estexis-frontend-i18n`: add or modify translations across all supported languages.
- `estexis-frontend-code-review`: review changes for bugs, i18n coverage, and conventions.
- `estexis-frontend-deployment`: handle build and Cloudflare Pages deployment changes.

## Adapter Files

- Claude: `.claude/skills/<skill-name>/SKILL.md`
- Codex/OpenAI Skills: package the matching `.claude/skills/<skill-name>/` directory.
- Copilot: `.github/copilot-instructions.md` and `.github/instructions/*.instructions.md`
- Antigravity: `.agents/agents/<agent-name>/agent.md`

When adapter guidance conflicts with a canonical skill, follow the canonical skill unless the user explicitly says otherwise.
