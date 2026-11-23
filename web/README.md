# Ringback web demo

Front-end-only demo of Ringback for plumbing and HVAC shop owners and partners. No
backend, no auth, no API calls: all data is mock data held in the browser.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script              | What it does                                        |
|---------------------|-----------------------------------------------------|
| `npm run dev`       | Dev server                                          |
| `npm run build`     | Production build                                    |
| `npm run lint`      | ESLint                                              |
| `npm run typecheck` | `tsc --noEmit`                                      |
| `npm run check`     | Self-check of the derived numbers and the calculator |

Stack: Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS v4, Zustand,
lucide-react. Fonts via `next/font` (Space Grotesk, Inter).

## Routes

| Route           | What it shows |
|-----------------|---------------|
| `/`             | Landing page: hero with a phone that plays a conversation, problem, how it works, calculator, pricing, FAQ, email sign-up |
| `/app/leads`    | Inbox: lead list, conversation, details. Take over, quick replies, mark job won, call back, simulate a missed call. `?lead=<id>` opens a lead; `&view=details` opens its details |
| `/app/calendar` | Mon–Fri, four slots a day. Click open/closed slots to toggle; click an assistant booking to open its lead |
| `/app/report`   | Recovered revenue, funnel, by-day chart (calls/leads), won jobs. This week is live; last week is static |
| `/app/settings` | Shop, forwarding test call, assistant permissions, caller preview, quick replies, automatic replies, save, reset demo |

## How the demo state works

- One Zustand store in `lib/store.ts` holds everything and is saved to localStorage
  (`ringback-demo`). "Reset demo" in Settings restores the mock data.
- All `/app/*` pages render in the browser only (`use(browser())` in `AppShell`), since
  the state lives in localStorage. For that reason, instant-navigation validation is
  limited to segments that opt in (`next.config.ts`), and `/app` opts out.
- **Demo clock:** "now" is always Wednesday 11:00 AM of the current real week
  (`lib/dates.ts`), so the calendar has past and future slots on any day. Store times
  are minutes since Monday 00:00.
- **Simulated calls** rotate through four scripts in `lib/mock/scenarios.ts`: a
  booking, a sewage emergency, a gas smell (the caller is told to leave and call 911 or
  the gas company), and a price question. Each script follows the current settings:
  shop name, trade, fee, the booking and fee switches, ringing your mobile, and the
  booking-confirmed message. Playback runs from the store, so it keeps going when you
  switch pages, and it carries on after a reload. Taking over a thread stops the
  script.
- Header numbers, the Leads badge, the funnel and report totals are derived in
  `lib/selectors.ts`, never stored.

## Layout

- 1024px and up: full sidebar; Leads shows three panes.
- 768–1023px: icon sidebar; the details pane opens over the conversation.
- Under 768px: bottom tab bar; Leads goes list → conversation → details, each with a back button.

## Placeholders to fill before a real launch

`[YOUR DEMO NUMBER]`, `[YOUR COMPANY NAME]`, `[YOUR EMAIL]`, `[SETUP TIME]`,
`[TRIAL LENGTH]`, `[CANCELLATION TERMS]`. Search for `[` in `app/page.tsx`.
The Pro and Growth plan features are suggestions to confirm.
