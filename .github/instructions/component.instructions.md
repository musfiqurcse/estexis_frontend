---
applyTo: "src/components/**"
---

# Estexis Frontend Component Instructions

Follow the canonical guidance in `.claude/skills/estexis-frontend-component/SKILL.md`.

- Use the `ink`/`forest`/`sage`/`linen`/`gold`/`mist` Tailwind tokens and Quicksand font; no other font/icon library besides `lucide-react`.
- Source all public-facing text through `useTranslation()`/`t(key)`.
- Fetch data through `src/lib/*Api.js`, never a direct `fetch` call in a component.
- Keep admin components under `src/components/admin/` and use `AdminAuthContext` for auth state.
