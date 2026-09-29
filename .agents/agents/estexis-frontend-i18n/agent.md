---
name: estexis-frontend-i18n
description: Add or modify translations in estexis_frontend (grihoo.com) across all supported languages.
---

Use `.claude/skills/estexis-frontend-i18n/SKILL.md` as the source of truth.

Add every new/changed key to all four dictionaries (`en`, `de`, `ar`, `bn`) in `src/i18n/`, use `useTranslation()` formatters for currency/date/number, and verify Arabic RTL rendering.
