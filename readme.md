# Ringback

Missed-call text-back for small plumbing and HVAC shops (1 to 5 trucks). When the owner
misses a call, the caller gets a text within seconds, an assistant collects the job
details by text, and the owner gets a booked job or a ready-to-call lead.

## Repository layout

| Folder    | What it holds                                   | Status        |
|-----------|-------------------------------------------------|---------------|
| `web/`    | Next.js front-end demo (landing page + web app) | Built, see [web/README.md](web/README.md) |
| `api/`    | Backend                                         | Later         |
| `mobile/` | Mobile app                                      | Later         |
| `docs/`   | Brief, plan, design system, design review page  | Current       |

Each app folder stands alone with its own `package.json` (or Cargo manifest). No
workspace tooling until two apps actually share code.

## The web demo (`web/`)

A front-end-only demo shown to shop owners and partners. No backend, no auth, no API
calls: all data is mock data held in the browser and saved to localStorage, with a
"Reset demo" button in Settings.

Routes: `/` landing, `/app/leads`, `/app/calendar`, `/app/report`, `/app/settings`.

Run it:

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
npm run typecheck
npm run check      # self-check of the derived numbers
```

## Docs

- [docs/brief.md](docs/brief.md) — the product brief for the web demo (source of truth)
- [docs/web-plan.md](docs/web-plan.md) — folder structure, store shape, components, build order, open decisions
- [docs/design-system.md](docs/design-system.md) — colour tokens with measured contrast, type, spacing, motion, accessibility rules
- [docs/design-review.html](docs/design-review.html) — visual design review page with screen mockups and the decisions to approve
