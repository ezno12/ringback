# Ringback design system (web)

Source: the product brief. Checked against the ui-ux-pro-max rules (accessibility,
touch, motion, charts). The skill's generic suggestion (light glassmorphism, blue and
orange) was rejected because the brief fixes a dark palette.

## Colour tokens

Defined once in `web/app/globals.css` under Tailwind v4 `@theme`. Components use token
names only, never raw hex.

| Token            | Hex       | Use                               |
|------------------|-----------|-----------------------------------|
| `ground`         | `#0B0D10` | Page background, with a faint dot grid |
| `sidebar`        | `#0F1216` | App sidebar and bottom tab bar    |
| `surface`        | `#13161B` | Panels, cards                     |
| `raised`         | `#1A1E25` | Hover, inputs, chat bubbles       |
| `line`           | `#272C35` | 1px borders and dividers          |
| `text`           | `#F2F4F7` | Primary text                      |
| `text-2`         | `#C3CAD6` | Secondary text                    |
| `muted`          | `#9AA3B2` | Labels, timestamps, help text     |
| `accent`         | `#C8F53C` | Primary action, active nav, focus ring; text on it is `#0B0D10` |
| `emergency`      | `#FFA070` on `#3A1D10` | Emergency status |
| `booked`         | `#8CCBFF` on `#12283A` | Booked status    |
| `new`            | `#C8F53C` on `#2A3312` | New status       |
| `voicemail`      | `#C3CAD6` on `#22262E` | Voicemail status |

### Measured contrast (WCAG)

| Pair                         | Ratio  | Pass |
|------------------------------|--------|------|
| text on ground               | 17.7:1 | AAA  |
| text-2 on surface            | 11.0:1 | AAA  |
| muted on surface             | 7.1:1  | AAA  |
| muted on raised              | 6.6:1  | AA   |
| ground text on accent        | 15.4:1 | AAA  |
| emergency pill               | 7.7:1  | AAA  |
| booked pill                  | 8.7:1  | AAA  |
| new pill                     | 10.5:1 | AAA  |
| voicemail pill               | 9.2:1  | AAA  |
| line on surface              | 1.3:1  | Decorative only |

`line` is too faint to mark a control's edge (WCAG 1.4.11 needs 3:1). Inputs, switches
and the reply box use `#4A5261` for their border (3.1:1 on surface), and keyboard focus
always uses a 2px `accent` ring.

Status is never shown by colour alone: each pill carries its word (New, Booked,
Emergency, Voicemail), and the emergency pill adds an icon.

## Type

- Space Grotesk (via `next/font`): headings, big numbers, prices. `font-variant-numeric: tabular-nums` on every figure that changes.
- Inter (via `next/font`): body, labels, controls.
- Scale (px): 12 / 14 / 16 / 18 / 24 / 32 / 48 / 64. Body 16 on mobile, 14 allowed in dense app panes.
- Body line height 1.5. Headings use `text-wrap: balance`.

## Shape and space

- Radius: 10px for controls and pills, 12px for bubbles, 16px for panels and the phone mockup.
- 1px borders. No drop-shadow stacks and no gradient washes.
- Spacing on a 4px grid: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- Touch targets at least 44 × 44px, with at least 8px between them.

## Layout

- App at 1024px and up: sidebar (240px) + content. Leads uses three panes: list 320px, thread flexible, details 300px.
- App from 768 to 1023px: sidebar collapses to icons with labels underneath; Leads shows list + thread, and details open as a panel from a button.
- App below 768px: bottom tab bar (4 items, icon + label, safe-area padding). Leads becomes list → conversation → details, each with a back button.
- Landing: max width 1200px, 16px minimum side gutter, no horizontal scroll at 390px.

## Motion

- 150–200ms for state changes (hover, switch, tab), 250ms for panels. Exits run at about 70% of the enter time.
- Animate only `transform` and `opacity`.
- One orchestrated moment per view: the hero phone conversation on the landing page, the live simulated call in Leads.
- `prefers-reduced-motion`: the phone shows the finished conversation with no typing dots, and simulated messages appear at once.

## Charts (report page)

- Funnel: horizontal bars, single hue (accent), each stage labelled with name, count and conversion from the previous stage. A visually hidden list repeats the values for screen readers.
- By-day bars: single series, so no legend; the toggle (Calls / Leads) names the series. Value label on top of each bar, recessive baseline, no gridlines.
- Days still to come this week are shown as empty slots labelled "Upcoming", not as zero bars.

## Icons

lucide-react, 1.75px stroke, 16 / 20 / 24px sizes. Decorative icons beside text get
`aria-hidden`; icon-only buttons get an `aria-label`.
