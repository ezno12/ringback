import type { Call, Lead, Slot, WeekNumbers } from "./types.ts";
import { DAY, isPast, slotLabel } from "./dates.ts";

interface WeekState {
  leads: Lead[];
  calls: Call[];
}

const byDay = (times: number[]) => {
  const out = [0, 0, 0, 0, 0];
  for (const t of times) {
    const d = Math.floor(t / DAY);
    if (d >= 0 && d < 5) out[d]++;
  }
  return out;
};

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export const leadTitle = (l: Pick<Lead, "name" | "phone">) => l.name ?? l.phone;

export function weekNumbers({ leads, calls }: WeekState): WeekNumbers {
  const won = leads.filter((l) => l.wonValue != null);
  return {
    missed: calls.length,
    textedBack: calls.filter((c) => c.textedBack).length,
    replied: calls.filter((c) => c.replied).length,
    leads: leads.length,
    booked: leads.filter((l) => l.slotId).length,
    won: won.length,
    revenue: won.reduce((sum, l) => sum + (l.wonValue ?? 0), 0),
    callsByDay: byDay(calls.map((c) => c.at)),
    leadsByDay: byDay(leads.map((l) => l.calledAt)),
    wonJobs: won.map((l) => ({ id: l.id, label: `${leadTitle(l)}, ${lowerFirst(l.problem)}`, value: l.wonValue ?? 0 })),
  };
}

/** Unopened leads the owner should look at: New, Voicemail, Emergency. */
export const attentionCount = (leads: Lead[]) =>
  leads.filter((l) => !l.read && l.status !== "booked").length;

export const isOpen = (s: Slot) => s.state === "open" && !isPast(s.day, s.idx);
export const openSlots = (slots: Slot[]) => slots.filter(isOpen);

export function slotFor(id: string | undefined, slots: Slot[]) {
  return id ? slots.find((s) => s.id === id) : undefined;
}

/** Replace [name] [slot] [address] [shop] in a saved message. */
export function fillTemplate(text: string, lead: Lead | null, slots: Slot[], shop: string) {
  const booked = slotFor(lead?.slotId, slots);
  const next = openSlots(slots)[0];
  const slot = booked ?? next;
  return text
    .replaceAll("[name]", lead?.name?.split(" ")[0] ?? "there")
    .replaceAll("[slot]", slot ? slotLabel(slot.day, slot.idx) : "at the next opening")
    .replaceAll("[address]", lead && lead.address !== "Not given" ? lead.address : "your address")
    .replaceAll("[shop]", shop);
}
