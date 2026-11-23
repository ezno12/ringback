# Web demo plan

Status: **built** (2026-11-23). All eight decisions below shipped with their recommended
defaults. [design-review.html](design-review.html) holds the approved mockups;
[../web/README.md](../web/README.md) describes how the built app works.

Differences from the original plan:
- Next.js 16 with Cache Components. `/app/*` renders in the browser only via
  `use(browser())`, and instant-navigation validation is limited to segments that opt in.
- Small UI pieces share one file, `components/ui.tsx`, instead of a `ui/` folder.
  Mock data lives in `lib/mock/settings.ts`, `week.ts`, `scenarios.ts` and `lastWeek.ts`.
- There is no `savedSettings` in the store. Settings keeps a local draft and counts
  its unsaved changes against the store.
- Added `clock` (the demo clock moves one minute per simulated message), `playing`
  (resumable simulation) and `notice` (toast) to the store.
- Added `lib/estimate.ts` (calculator maths) and `lib/selectors.check.ts` (`npm run check`).

## Stack

- Next.js (latest, App Router) + TypeScript + Tailwind CSS v4 (tokens in `@theme`, no `tailwind.config`).
- Zustand with `persist` middleware for all demo state (localStorage key `ringback-demo`).
- lucide-react icons. Fonts via `next/font`. CSS animation only, no Framer Motion.
- No database, auth, API routes or AI calls.

## Folder structure

```
web/
  app/
    layout.tsx              fonts, dot-grid ground, metadata
    page.tsx                landing
    app/layout.tsx          sidebar (desktop) / bottom tab bar (mobile)
    app/page.tsx            redirect → /app/leads
    app/leads/page.tsx
    app/calendar/page.tsx
    app/report/page.tsx
    app/settings/page.tsx
  components/
    ui/        Button, Badge, Switch, Tabs, Slider, Field, Card, Toast, Accordion
    app/       Sidebar, TabBar, ForwardingCard, DemoLabel, StatStrip
    leads/     LeadList, LeadRow, Thread, MessageBubble, TypingDots, ReplyBox,
               QuickReplies, LeadDetails, MarkWonForm, SimulateButton, VoicemailCard
    calendar/  WeekGrid, SlotCell, SlotLegend
    report/    BigFigure, Funnel, DayBars, WonJobsList, WeekSwitch
    settings/  ShopForm, ForwardingStatus, PermissionSwitches, CallerPreview,
               QuickReplyEditor, AutoReplyEditor, SaveBar
    landing/   Header, Hero, PhoneDemo, Problem, HowItWorks, Calculator,
               Pricing, Faq, ClosingCta, Footer
  lib/
    mock/      shop.ts, leads.ts, calls.ts, slots.ts, scenarios.ts, lastWeek.ts
    store.ts
    selectors.ts
    dates.ts
    types.ts
```

## Store shape

```ts
{
  shop: { name, trade: 'Plumbing' | 'HVAC', calloutFee, zips: string[], hours },
  permissions: { textBack, book, statFee, ringOwner, nudge },
  quickReplies: { id, label, text }[],          // text may contain [name] and [slot]
  autoReplies: { afterHours, outsideArea, bookingConfirmed: { on: boolean, text: string } },
  leads: Lead[],   // id, name, phone, problem, address, urgency, status, source,
                   // slotId?, takenOver, wonValue?, read, messages: Message[]
  calls: Call[],   // every missed call this week, including ones with no reply
  slots: Slot[],   // 5 days × 4 slots: state ('assistant' | 'owner' | 'open' | 'closed' | 'past'), leadId?
  scenarioIndex: number,
  savedSettings,   // snapshot used for the "unsaved changes" indicator
  // actions
  takeOver, handBack, sendOwnerMessage, markWon, toggleSlot, markRead,
  simulateCall, updateSettings, saveSettings, resetDemo
}
```

Header numbers, the Leads badge, the funnel and report totals are derived in
`selectors.ts`. None of them are stored, so they cannot drift.

A simulated call keeps playing from the store, so it finishes even if the viewer moves
to another page.

## Build order

1. Types, mock data, store, selectors (with a small self-check of the selectors).
2. App layout: sidebar, tab bar, forwarding card, demo label.
3. Leads → Calendar → Report → Settings. After each: `tsc --noEmit`, `lint`, `build`.
4. Landing page.
5. Browser walkthrough of the brief's checklist at 390, 768 and 1440px.

## Decisions (recommended defaults, pending sign-off)

1. **Demo clock.** "Today" is always Wednesday 11:00 AM of the current week. The calendar then has past and future slots on any day the demo is opened. Dana's "tomorrow 8–10" falls on Thursday, alongside Tom's Thursday 1–3.
2. **Revenue recovered** counts only jobs marked won. Priya's emergency starts as won (example value $480) so the report is not empty. The alternative is to start at $0.
3. **Funnel data.** 9 missed calls this week: 8 texted back (the landline cannot receive texts), 6 replied, 5 leads captured (4 by text plus the voicemail), 2 booked, 1 won.
4. **Voicemail lead.** Shows a transcript card, not a text thread. "Take over" is turned off; "Call back" is the main action.
5. **Leads badge.** Counts leads that are New, Voicemail or Emergency and not yet opened.
6. **Opening hours.** Weekday open and close times plus a Saturday on/off switch.
7. **Stack.** As listed above.
8. **Repository.** `web/` stands alone; `api/` and `mobile/` sit beside it later.
