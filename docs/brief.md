# Ringback web demo — brief

Build a front-end-only demo of a product called "Ringback" in Next.js. There is no
backend: all data is mock data held in the browser, and nothing calls an external API.
The demo will be shown to plumbing and HVAC shop owners and to potential partners, so it
must look finished and every visible control must respond.

## What the product is
Ringback is a missed-call text-back service for small plumbing and HVAC shops (1 to 5
trucks). When the owner misses a call, the caller gets a text within seconds, an AI
assistant collects the job details by text, and the owner gets a booked job or a
ready-to-call lead. The owner uses a web app to read conversations, take over a thread,
manage which calendar slots the assistant may offer, read a weekly report, and change
settings.

## Stack
- Next.js (App Router) with TypeScript and Tailwind CSS.
- No database, no auth, no API routes, no AI calls.
- Mock data in `lib/mock/` as typed TypeScript modules.
- One client-side store (Zustand or React context) holding all demo state, so an action
  on one page shows up on the others. Persist it to localStorage with a "Reset demo"
  button in Settings.
- Fonts via `next/font`: Space Grotesk for headings and numbers, Inter for body.
- Inline SVG icons or lucide-react. No emoji as icons.
- Animation with CSS or Framer Motion, and respect `prefers-reduced-motion`.

## Visual design
Dark, modern, high contrast. Use these tokens as Tailwind theme colours:
- ground #0B0D10, sidebar #0F1216, surface #13161B, raised #1A1E25, line #272C35
- text #F2F4F7, muted text #9AA3B2, secondary text #C3CAD6
- accent (lime) #C8F53C with #0B0D10 text on it
- emergency (orange) #FFA070 on #3A1D10
- booked (blue) #8CCBFF on #12283A
- new: #C8F53C on #2A3312; voicemail: #C3CAD6 on #22262E
Rounded corners of 10 to 16px, 1px borders, a faint dot-grid on the ground colour, no
gradient washes. Touch targets at least 44px. Text contrast at least 4.5:1. Use real
buttons, links, labels and inputs so everything works by keyboard.

## Routes
1. `/` — marketing landing page.
2. `/app/leads` — leads inbox (default app page).
3. `/app/calendar`
4. `/app/report`
5. `/app/settings`
The `/app/*` pages share a layout with a left sidebar (logo, four nav links with the
active one highlighted, a badge on Leads showing how many leads need attention, and a
"Forwarding is on" status card at the bottom). On narrow screens the sidebar becomes a
bottom tab bar and the three-pane inbox becomes list -> conversation -> details.

## Landing page (`/`)
Sections in order: header with nav and a "Start free trial" button; hero; the problem
(three short cards); how it works (three steps, plus "what it does" and "what it never
does" lists); an estimate calculator; pricing; FAQ accordion; closing call to action with
an email field; footer.
- Hero headline: "Every missed call gets a text back in seconds." Audience line: "For
  plumbing and HVAC shops with 1 to 5 trucks."
- Hero animation: a phone mockup that plays a text conversation message by message with
  a typing indicator, then shows a "New job booked" card. Include a replay button.
- Calculator: three sliders (missed calls per week 1-40, average job value $100-$2,000,
  share of missed callers won back 5-50%). Show jobs won back per month
  (calls x 4.33 x share), revenue recovered, and the figure after a $99 fee. State under
  it that this is arithmetic on the visitor's inputs, not a promise.
- Pricing: Starter $99/month (available now), Pro $199/month and Growth $349/month (both
  "Waitlist"). A banner: "$79 a month for the first ten shops, locked for 12 months."
- Do not invent testimonials, customer logos or statistics. Use bracketed placeholders
  such as [YOUR DEMO NUMBER] and [YOUR COMPANY NAME] where a real fact is missing.
- The "Start free trial" buttons link to `/app/leads` so a viewer can enter the demo.

## Leads (`/app/leads`)
Three panes: lead list, conversation, lead details.
- Header shows this week's numbers: missed calls, leads captured, jobs booked, revenue
  recovered. These are computed from the store, not hard-coded.
- Filter tabs: All, New, Booked, Emergency.
- Selecting a lead shows its text thread (caller on the left, assistant and owner on the
  right, labelled) and its details: problem, address, urgency, appointment, source.
- "Take over" pauses the assistant on that thread, enables the reply box and shows quick
  reply buttons above it. A quick reply fills the box with [name] and [slot] replaced
  from the lead; the owner can edit, then send. Sent messages appear in the thread as
  the owner's. "Hand back to assistant" disables the box again.
- "Mark job won" opens a small field for the job value and saves it. Won jobs feed the
  weekly report totals.
- "Call back" opens a `tel:` link.
- A "Simulate a missed call" button in the header adds a new lead and plays its
  conversation into the thread message by message, so a viewer can watch the product
  work. Rotate through three or four scripted scenarios, one of them an emergency.

## Calendar (`/app/calendar`)
Monday to Friday, four two-hour slots a day (8-10, 10-12, 1-3, 3-5). Each slot is one
of: booked by the assistant, the owner's own booking, open, closed, or past. Clicking an
open or closed slot toggles it. Show a live count of open slots. Clicking a job the
assistant booked goes to that lead's conversation. When a simulated call books a job, it
takes an open slot and appears here.

## Weekly report (`/app/report`)
- Large "recovered from calls you missed" figure, plus missed calls, leads captured and
  jobs booked.
- A funnel as horizontal bars: missed calls, texted back, caller replied, lead captured,
  job booked, marked won.
- A bar chart by day with a toggle between calls and leads.
- A list of jobs marked won with their values and a total.
- A switch between this week (live from the store) and last week (static mock data).

## Settings (`/app/settings`)
- Shop: name, trade (Plumbing or HVAC), call-out fee, ZIP codes served, opening hours.
- Call forwarding status with a "Place a test call" button that shows a confirmation.
- Switches for what the assistant may do: text back missed calls, book into the
  calendar, state the call-out fee when asked, ring the owner's mobile for emergencies,
  nudge silent callers once.
- "What callers will read": a live preview of the first message and the fee answer,
  following the shop name, trade, fee and switches.
- Quick replies: edit the saved messages and add or delete them.
- Automatic replies: after hours, outside the service area, booking confirmed. Each has
  an on/off switch and editable wording.
- A Save button that shows unsaved changes, the plan (Starter, $99 a month), and "Reset
  demo".

## Mock data
Shop: "Mike's Plumbing". Create five leads with full conversations:
1. Priya Nair — burst pipe in the basement, 15 Canal Rd — Emergency, owner was called.
2. Dana Whitfield — water heater leaking, 412 Alder St — Booked, tomorrow 8 to 10 AM.
3. Luis Ortega — no hot water, 88 Birch Ave — New, wants a call back.
4. Tom Becker — clogged kitchen drain, 7 Quarry Ln — Booked, Thursday 1 to 3 PM.
5. A landline caller — voicemail transcript about a banging noise when the heat comes
   on — Voicemail.
Use phone numbers in the (555) 010-01xx range. Every assistant conversation opens with:
"Hi, this is the automated assistant for Mike's Plumbing. Sorry we missed your call.
What can we help with?" The assistant never quotes a price beyond the call-out fee,
never promises an arrival time, and for a gas smell tells the caller to leave and call
911 or the gas company. Put a small "Demo data" label in the app header.

## How to work
1. Read this whole brief, then show a short plan: folder structure, the store's shape,
   and the component list. Wait for the go-ahead.
2. Build the store and mock data first, then the app layout, then one page at a time,
   then the landing page.
3. After each page, run the type check, lint and build, and fix what they report.
4. Finish by running the app and walking through this checklist:
   - every nav link works and shows the active state
   - taking over a thread, using a quick reply and sending a message works
   - a simulated call creates a lead, books a slot, and changes the header numbers
   - marking a job won changes the report total
   - editing a quick reply in Settings changes the button in Leads
   - the layout works at 390px, 768px and 1440px wide
