# grihoo.com — Email Templates

Plain HTML email templates for the **grihoo.com** real-estate platform, designed to match the website's visual identity. Drop them straight into a backend mailer (Resend, Postmark, SES, etc.) and substitute the placeholder variables.

This README is the source of truth for both humans and AI agents that need to author new templates or wire existing ones to backend functions.

---

## 1. Backend function ↔ template map

| Backend function | Template file | Purpose | Required parameters | Suggested subject line |
| --- | --- | --- | --- | --- |
| `send_email_verification` | `email_verification.html` | Sends registration email verification OTP | `to_email: str`, `code: str` | `Your grihoo.com verification code` |
| `send_password_reset` | `password_reset.html` | Sends password reset OTP | `to_email: str`, `code: str` | `Reset your grihoo.com password` |
| `send_email_change_verification` | `email_change_verification.html` | Sends OTP to verify a new email address during change-email flow | `to_email: str`, `code: str` | `Confirm your new grihoo.com email` |
| `send_company_agent_invitation` | `company_agent_invitation.html` | Sends company-agent invitation link | `to_email: str`, `token: str`, `company_name: str` | `You're invited to join {company_name} on grihoo.com` |

> `to_email` is always the recipient — pass it both to the mailer's `to` field **and** as the `{{to_email}}` template variable so it appears in the body.

---

## 2. Placeholder syntax

All templates use **double-curly-brace** placeholders: `{{variable}}`.

This is intentionally engine-agnostic — it works with:

- Plain Python `str.replace` (smallest dependency)
- `str.format` if you first convert `{{x}}` → `{x}`
- Jinja2 / Mustache / Handlebars / Liquid (native syntax)
- Resend's React Email layer (just wrap in JSX and inject as `{props.x}`)

### Variable reference

| Placeholder | Type | Used in | Notes |
| --- | --- | --- | --- |
| `{{to_email}}` | string | all templates | Recipient email; rendered in the body for transparency |
| `{{code}}` | string | `email_verification`, `password_reset`, `email_change_verification` | OTP code (6 digits recommended; layout works for 4–8) |
| `{{token}}` | string | `company_agent_invitation` | **Full URL** to the accept-invitation page (e.g. `https://grihoo.com/invite/accept?token=xyz`) — used as the button `href` and shown as a copy-paste link |
| `{{company_name}}` | string | `company_agent_invitation` | Display name of the inviting company |

---

## 3. Minimal Python example (Resend)

```python
import resend
from pathlib import Path

resend.api_key = "re_..."
TEMPLATES = Path(__file__).parent / "email_templates"

def render(template_name: str, **vars) -> str:
    html = (TEMPLATES / template_name).read_text(encoding="utf-8")
    for key, value in vars.items():
        html = html.replace("{{" + key + "}}", str(value))
    return html

def send_email_verification(to_email: str, code: str):
    return resend.Emails.send({
        "from": "grihoo.com <noreply@grihoo.com>",
        "to": to_email,
        "subject": "Your grihoo.com verification code",
        "html": render("email_verification.html", to_email=to_email, code=code),
    })

def send_password_reset(to_email: str, code: str):
    return resend.Emails.send({
        "from": "grihoo.com <noreply@grihoo.com>",
        "to": to_email,
        "subject": "Reset your grihoo.com password",
        "html": render("password_reset.html", to_email=to_email, code=code),
    })

def send_email_change_verification(to_email: str, code: str):
    return resend.Emails.send({
        "from": "grihoo.com <noreply@grihoo.com>",
        "to": to_email,
        "subject": "Confirm your new grihoo.com email",
        "html": render("email_change_verification.html", to_email=to_email, code=code),
    })

def send_company_agent_invitation(to_email: str, token: str, company_name: str):
    return resend.Emails.send({
        "from": "grihoo.com <noreply@grihoo.com>",
        "to": to_email,
        "subject": f"You're invited to join {company_name} on grihoo.com",
        "html": render(
            "company_agent_invitation.html",
            to_email=to_email,
            token=token,
            company_name=company_name,
        ),
    })
```

---

## 4. Design system

Pulled from `tailwind.config.js` so emails feel like the website.

### Colors

| Token | Hex | Usage in templates |
| --- | --- | --- |
| `ink` | `#18221f` | Primary headings, strong text |
| `forest` | `#164b3f` | Brand accent, primary CTA, links, eyebrows |
| `sage` | `#dfe8dd` | OTP code background panel |
| `linen` | `#f7f3ed` | Email body background |
| `gold` | `#b88a44` | Single-character brand accent (the dot in "grihoo`.`com") |
| `mist` | `#eef1ee` | Subtle secondary panel (e.g. token copy-paste box) |

Muted text uses `rgba(24, 34, 31, 0.7)` for body copy and `rgba(24, 34, 31, 0.45–0.55)` for footer fine print.

### Typography

- **Font family:** `Quicksand` (Google Fonts), with system fallbacks `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`.
- **Weights loaded:** 400, 500, 600, 700.
- **Sizes:** 26 px headings, 15 px body, 14 px secondary, 12 px footer.
- **OTP code:** 38 px, weight 700, letter-spacing 12 px, color `forest` on `sage` panel — drops to 32 px / 8 px on screens ≤ 600 px via the `.otp` media query.

### Layout

- 560 px fixed-width content table inside a full-width background table — the standard email pattern that survives Outlook, Gmail, Apple Mail, and dark-mode renderers.
- White card with `border-radius: 16px`, soft shadow `0 18px 50px rgba(24, 34, 31, 0.06)`, mirroring the site's `shadow-soft` token.
- Outer body padding scales down on mobile via the `.container` and `.card` media queries.
- Hidden preheader `<span>` at the top of `<body>` controls inbox preview text.

---

## 5. Anatomy of a template

Every file follows the same structure — keep this consistent when adding new templates so changes to the design system can be propagated mechanically.

```
<!doctype html>
<html>
  <head>
    <meta> tags + Quicksand font import + responsive <style> block
  </head>
  <body style="background: #f7f3ed; font-family: Quicksand, ...">

    1. Hidden preheader <span>          ← inbox preview text
    2. Outer full-width <table>         ← background color
       └─ Centered 560px <table>        ← content container
          ├─ Brand wordmark row         ← "grihoo.com" with gold dot
          ├─ White card <td>            ← main content
          │   ├─ Eyebrow label          ← uppercase, forest, 13px
          │   ├─ <h1> heading           ← 26px, ink
          │   ├─ Intro <p>              ← 15px, muted
          │   ├─ Action block           ← OTP panel OR CTA button
          │   ├─ Secondary <p>(s)       ← validity, recipient line
          │   └─ Optional info panel    ← e.g. paste-link box (mist)
          └─ Footer rows                ← tagline + automated-message note

  </body>
</html>
```

### Component patterns

- **OTP panel** (`#dfe8dd` background, rounded 12 px) — used for any short numeric/alphanumeric code.
- **Primary CTA button** — inline-block `<a>` with `background:#164b3f`, `color:#fff`, `padding:16px 28px`, `border-radius:10px`. The `.cta` class makes it full-width on mobile.
- **Token / link preview panel** (`#eef1ee` background) — used to expose a long URL when the CTA button might be stripped.
- **Eyebrow + heading** — the eyebrow (`forest`, uppercase, letter-spacing) names the email category; the `<h1>` states the action.

---

## 6. Authoring a new template (checklist for AI agents)

1. **Copy the closest existing template** — don't write the boilerplate from scratch. OTP-style emails → start from `email_verification.html`. Action-link emails → start from `company_agent_invitation.html`.
2. **Update `<title>`, preheader `<span>`, eyebrow, and `<h1>`** to match the new email's purpose.
3. **Swap the action block** — OTP panel for codes, CTA button + paste-link panel for action URLs.
4. **Use only the design tokens listed in §4** — no new colors, no new fonts, no extra fontWeights beyond 400/500/600/700.
5. **Use `{{snake_case}}` placeholders** that exactly match the backend function's parameter names. If you add a new variable, document it in §2.
6. **Render `to_email` somewhere visible** — the recipient should always be able to verify the message reached the right address.
7. **Include the standard footer** (tagline + "automated message" line). Do not add unsubscribe links to transactional emails.
8. **Add a row to the table in §1** with the new function name, file, params, and subject line.
9. **Test:**
   - Open the rendered HTML in a browser at desktop and at ≤ 600 px width.
   - Send a real test through Resend to a Gmail and an Outlook inbox.
   - Use [Litmus](https://litmus.com/) or [Email on Acid](https://www.emailonacid.com/) for broader client coverage if available.

---

## 7. Things to avoid

- **No external CSS** — every style must be inline or inside the single `<style>` block in `<head>`. Many clients strip linked stylesheets.
- **No flexbox or grid** for layout — use nested `<table>`s. Outlook ignores modern CSS layout.
- **No background images** in critical areas — Outlook needs VML fallbacks; keep backgrounds as solid colors.
- **No JavaScript** — stripped by every major client.
- **No `<button>` elements for CTAs** — use styled `<a>` tags so they're clickable everywhere.
- **No tracking pixels or marketing copy in transactional emails** — keep them strictly about the user's action.
- **Do not change placeholder names** without updating both the backend function and §2 of this README.
