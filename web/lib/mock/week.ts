import type { Call, Lead, Slot } from "../types.ts";
import { at } from "../dates.ts";
import { opener } from "./settings.ts";

const OPEN = opener("Mike's Plumbing");
let n = 0;
const m = (from: Lead["messages"][number]["from"], when: number, text: string) => ({
  id: `seed-${++n}`,
  from,
  at: when,
  text,
});

export const initialLeads: Lead[] = [
  {
    id: "priya",
    name: "Priya Nair",
    phone: "(555) 010-0101",
    problem: "Burst pipe in the basement",
    address: "15 Canal Rd",
    urgency: "Emergency",
    status: "emergency",
    source: "Missed call",
    calledAt: at(1, 7, 12),
    takenOver: false,
    wonValue: 480,
    read: true,
    ownerCalled: true,
    messages: [
      m("assistant", at(1, 7, 12), OPEN),
      m("caller", at(1, 7, 13), "Pipe burst in the basement, water everywhere!! 15 Canal Rd"),
      m(
        "assistant",
        at(1, 7, 13),
        "That sounds like an emergency. If you can, shut off the main water valve now. It's usually where the water line comes into the house. I'm ringing Mike's mobile so he can call you right back.",
      ),
      m("system", at(1, 7, 14), "Ringback rang Mike's mobile. Call connected."),
      m("caller", at(1, 7, 16), "Found the valve, it's off. Thank you"),
      m("assistant", at(1, 7, 16), "Good. Mike has your address and will call you shortly."),
      m("owner", at(1, 7, 21), "Priya, it's Mike. On my way now."),
    ],
  },
  {
    id: "dana",
    name: "Dana Whitfield",
    phone: "(555) 010-0102",
    problem: "Water heater leaking from the bottom",
    address: "412 Alder St",
    urgency: "Soon, leak contained",
    status: "booked",
    source: "Missed call",
    calledAt: at(2, 8, 5),
    slotId: "3-0",
    takenOver: false,
    read: true,
    messages: [
      m("assistant", at(2, 8, 5), OPEN),
      m("caller", at(2, 8, 6), "Water heater in the garage is leaking from the bottom. Puddle is getting bigger."),
      m(
        "assistant",
        at(2, 8, 6),
        "Sorry to hear that. If it's safe to reach, turn the cold water valve on top of the heater to off. What's the address?",
      ),
      m("caller", at(2, 8, 8), "Ok done. 412 Alder St"),
      m(
        "assistant",
        at(2, 8, 8),
        "Thanks. The call-out fee is $89, and the plumber prices the repair once they've seen it. I can book tomorrow 8–10 AM or tomorrow 3–5 PM. Which works?",
      ),
      m("caller", at(2, 8, 9), "8-10 please"),
      m("assistant", at(2, 8, 9), "You're booked for Thursday 8–10 AM at 412 Alder St. We'll text you if anything changes."),
    ],
  },
  {
    id: "luis",
    name: "Luis Ortega",
    phone: "(555) 010-0103",
    problem: "No hot water, gas heater, pilot may be out",
    address: "88 Birch Ave",
    urgency: "Today, not an emergency",
    status: "new",
    source: "Missed call",
    calledAt: at(1, 16, 20),
    takenOver: false,
    read: false,
    messages: [
      m("assistant", at(1, 16, 20), OPEN),
      m("caller", at(1, 16, 21), "No hot water since this morning. Gas heater, I think the pilot is out."),
      m("assistant", at(1, 16, 21), "Thanks. Do you smell gas near the heater?"),
      m(
        "caller",
        at(1, 16, 23),
        "No smell. Just no hot water. 88 Birch Ave. Can someone call me? I'd rather talk to a person. It's Luis",
      ),
      m(
        "assistant",
        at(1, 16, 23),
        "Of course, Luis. I've passed this to Mike, who will call you back. The call-out fee is $89.",
      ),
    ],
  },
  {
    id: "tom",
    name: "Tom Becker",
    phone: "(555) 010-0104",
    problem: "Clogged kitchen drain",
    address: "7 Quarry Ln",
    urgency: "Routine",
    status: "booked",
    source: "Missed call",
    calledAt: at(0, 10, 30),
    slotId: "3-2",
    takenOver: false,
    read: true,
    messages: [
      m("assistant", at(0, 10, 30), OPEN),
      m("caller", at(0, 10, 32), "Kitchen sink is clogged, water won't drain at all"),
      m("assistant", at(0, 10, 32), "Thanks. Is it just the kitchen sink, or are other drains slow too?"),
      m("caller", at(0, 10, 35), "Just the kitchen. Tom Becker, 7 Quarry Ln"),
      m(
        "assistant",
        at(0, 10, 35),
        "Got it, Tom. The call-out fee is $89. I can book Thursday 1–3 PM or Friday 8–10 AM. Which works?",
      ),
      m("caller", at(0, 10, 40), "Thursday works"),
      m("assistant", at(0, 10, 40), "You're booked for Thursday 1–3 PM at 7 Quarry Ln. We'll text you if anything changes."),
    ],
  },
  {
    id: "voicemail",
    name: null,
    phone: "(555) 010-0105",
    problem: "Banging noise when the heat comes on",
    address: "Not given",
    urgency: "Unknown",
    status: "voicemail",
    source: "Voicemail from a landline",
    calledAt: at(0, 17, 55),
    takenOver: false,
    read: false,
    voicemail:
      "Hi, I'm calling about our heating. Every time the heat comes on there's a loud banging in the pipes, like someone hitting them with a hammer. It's been going on for a couple of days. Can someone call me back at this number? Thanks.",
    messages: [],
  },
];

// 9 missed calls this week. Four never became leads; the landline can't receive texts.
export const initialCalls: Call[] = [
  { id: "c1", at: at(0, 8, 12), phone: "(555) 010-0110", textedBack: true, replied: false },
  { id: "c2", at: at(0, 10, 30), phone: "(555) 010-0104", textedBack: true, replied: true, leadId: "tom" },
  { id: "c3", at: at(0, 14, 5), phone: "(555) 010-0111", textedBack: true, replied: true },
  { id: "c4", at: at(0, 17, 55), phone: "(555) 010-0105", textedBack: false, replied: false, leadId: "voicemail" },
  { id: "c5", at: at(1, 7, 12), phone: "(555) 010-0101", textedBack: true, replied: true, leadId: "priya" },
  { id: "c6", at: at(1, 12, 48), phone: "(555) 010-0112", textedBack: true, replied: false },
  { id: "c7", at: at(1, 16, 20), phone: "(555) 010-0103", textedBack: true, replied: true, leadId: "luis" },
  { id: "c8", at: at(2, 8, 5), phone: "(555) 010-0102", textedBack: true, replied: true, leadId: "dana" },
  { id: "c9", at: at(2, 9, 30), phone: "(555) 010-0113", textedBack: true, replied: true },
];

const overrides: Record<string, Partial<Slot>> = {
  "3-0": { state: "assistant", leadId: "dana" },
  "3-2": { state: "assistant", leadId: "tom" },
  "4-1": { state: "owner", note: "Water softener install, Hendricks" },
  "4-3": { state: "closed" },
};

export const initialSlots: Slot[] = Array.from({ length: 20 }, (_, i) => {
  const day = Math.floor(i / 4);
  const idx = i % 4;
  const id = `${day}-${idx}`;
  return { id, day, idx, state: "open", ...overrides[id] } as Slot;
});
