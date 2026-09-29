---
name: estexis-frontend-code-review
description: Review estexis_frontend (grihoo.com) changes for bugs, regressions, i18n coverage, Tailwind/design-token consistency, and admin-route protection.
---

# Estexis Frontend Code Review

Use this skill for code review of recent or requested changes. Review only the changed files or explicit scope.

## Priority Order

Lead with findings, ordered by severity:

1. Correctness bugs and behavioral regressions.
2. Broken or missing admin-route protection (`ProtectedAdminRoute`, `AdminAuthContext`).
3. i18n gaps — new user-facing strings missing from any of `en`/`de`/`ar`/`bn`, or hardcoded strings.
4. Data-layer issues — direct `fetch` calls bypassing `src/lib/*Api.js`, unhandled request errors.
5. Design-token drift — arbitrary colors/fonts instead of the `ink`/`forest`/`sage`/`linen`/`gold`/`mist` tokens and Quicksand.
6. Accessibility issues — missing alt text, non-semantic interactive elements, poor keyboard/focus handling.
7. Routing/deployment risk — new nested route without SPA fallback (`public/_redirects`) support.
8. Style and maintainability issues.

## Estexis Frontend Checks

- Public-facing text goes through `useTranslation()`/`t(key)`, not literal strings.
- New pages register in `src/App.jsx` with the correct layout (`PublicLayout` vs `AdminRouteLayout`).
- Admin pages/components stay under `src/pages/admin/` and `src/components/admin/` and are protected.
- Currency, date, and number formatting use the i18n hook's formatters.
- No secrets or API keys committed (check `Secrets/` is not accidentally duplicated into tracked files).
- Build scripts used are `npm run build:stage` / `npm run build:production` — flag any reintroduction of a plain `npm run build` expectation, since that script is intentionally a guard that exits with an error.

## Output

Findings ordered by severity, each with file/line and a one-line fix suggestion.
