// The demo clock: "now" is always Wednesday 11:00 AM of the current real week, so the
// calendar has past and future slots whatever day the demo is opened (docs/web-plan.md).
// All times in the store are minutes since Monday 00:00 of that week.

export const DAY = 1440;
export const DEMO_NOW = 2 * DAY + 11 * 60;
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
export const SLOT_HOURS: [number, number][] = [
  [8, 10],
  [10, 12],
  [13, 15],
  [15, 17],
];

export const at = (day: number, h: number, m = 0) => day * DAY + h * 60 + m;

function hourLabel(h: number) {
  const suffix = h < 12 ? "AM" : "PM";
  return { n: h % 12 === 0 ? 12 : h % 12, suffix };
}

export function fmtClock(min: number) {
  const m = ((min % DAY) + DAY) % DAY;
  const { n, suffix } = hourLabel(Math.floor(m / 60));
  return `${n}:${String(m % 60).padStart(2, "0")} ${suffix}`;
}

export function fmtWhen(min: number) {
  const day = Math.floor(min / DAY);
  const name = day === 2 ? "Today" : day === 1 ? "Yesterday" : (DAYS[day] ?? "").slice(0, 3);
  return `${name} ${fmtClock(min)}`;
}

/** "Thursday 10 AM–12 PM" (long) or "10–12" style short label. */
export function slotLabel(day: number, idx: number, long = true) {
  const [s, e] = SLOT_HOURS[idx];
  const a = hourLabel(s);
  const b = hourLabel(e);
  const range = a.suffix === b.suffix ? `${a.n}–${b.n} ${b.suffix}` : `${a.n} ${a.suffix}–${b.n} ${b.suffix}`;
  return long ? `${DAYS[day]} ${range}` : range;
}

/** A slot that has started (or ended) before the demo clock can't be offered. */
export const isPast = (day: number, idx: number) => at(day, SLOT_HOURS[idx][0]) < DEMO_NOW;

export function weekDates(today = new Date()) {
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
