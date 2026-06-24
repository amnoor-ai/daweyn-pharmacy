# Daaweyn — Agent Context
## Project
Daaweyn is a pharmacy admin dashboard. Multi-tenant (team-based). Clinical, minimal aesthetic.

---

## Stack
| Layer | Technology |
|-------|-----------|
| Backend | Laravel 13 (PHP 8.3+) |
| Frontend | React 19 + TypeScript |
| Bridge | Inertia.js v3 |
| Styling | Tailwind CSS v4 |
| Components | Shadcn UI (Radix primitives) |
| Auth | Laravel Fortify + Laravel Passkeys (2FA, passkey support) |
| Bundler | Vite |
| Routing pattern | `/{current_team}/{resource}` |

---

## Design System
Reference `plan/design-system.md` for full tokens. Key values:

| Token | Value |
|-------|-------|
| Primary navy | `#1B2559` |
| Canvas bg | `#F6F7FB` |
| Surface | `#FFFFFF` |
| Border | `#ECEEF5` |
| Text primary | `#161A30` |
| Text secondary | `#8A8FA6` |
| Accent indigo | `#4C5FD5` |
| Success teal | `#1FAE8E` |
| Font | Plus Jakarta Sans |
| Icons | Lucide React |

---

## What's Already Built
- Auth flow — login, register, 2FA, passkeys
- Multi-tenant teams — create, switch, invite, manage members
- Dashboard skeleton
- Settings pages — profile, appearance, team
- Sidebar navigation (`app-sidebar.tsx`)

---

## What's Missing (Build Order)
- [ ] Phase 1 — Categories (CRUD)
- [ ] Phase 2 — Products / Inventory
- [ ] Phase 3 — Customers
- [ ] Phase 4 — Transactions / Sales
- [ ] Phase 5 — Users & Role management
- [ ] Phase 6 — Reports
- [ ] Phase 7 — Help page

---

## Plan Files (Always Reference These)
- `plan/design-system.md` — colors, typography, tokens
- `plan/features.md` — full feature list by module
- `plan/pages.md` — route and page map
- `plan/components.md` — component breakdown
- `plan/tasks.md` — phased task checklist

---

## My Working Style
- I am learning fullstack dev. Frontend (React, Tailwind, TypeScript) is comfortable. Backend (Laravel, migrations, controllers, routes) is my growth area.
- **Always explain what you're about to do and why before writing any code.**
- **Do not implement silently.** If you're generating a migration, tell me what it does first.
- Walk me through work phase by phase — do not jump ahead.
- If I'm doing something wrong, point it out directly. Don't just silently fix it.
- Keep backend explanations clear and beginner-friendly without being condescending.