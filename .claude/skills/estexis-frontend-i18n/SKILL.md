---
name: estexis-frontend-i18n
description: Add or modify translations in estexis_frontend (grihoo.com) across all supported languages using the custom i18n system.
---

# Estexis Frontend i18n

Use this skill whenever a change introduces or edits user-facing copy on the public site.

## System

- Custom, context-based i18n — no external i18n library.
- Provider wraps the app in `src/main.jsx`.
- Dictionaries live at `src/i18n/en.js`, `src/i18n/de.js`, `src/i18n/ar.js`, `src/i18n/bn.js`.
- Access via `useTranslation()`: `t(key)`, `formatCurrency()`, `formatDate()`, `formatNumber()`.
- Selected language persists to `localStorage`.
- Arabic (`ar`) is RTL; the provider sets `document.documentElement.dir` — never override this manually in a component.

## Rules

- Every new or changed key must be added to **all four** dictionaries in the same change, even if a translation is a placeholder — do not ship a key that only exists in `en.js`.
- Keep key naming consistent with the existing dictionary structure (check how nearby keys are nested before adding a new one).
- Use `formatCurrency()`/`formatDate()`/`formatNumber()` instead of hand-rolled `Intl` calls or string concatenation for numbers, dates, and prices.
- Do not hardcode a language code in component logic; branch on the provider's current-language value if a component must special-case a language.

## Verification

- Switch the language switcher through all four languages and confirm the changed screen renders without a missing-key fallback.
- Confirm RTL layout is not visually broken in Arabic.
