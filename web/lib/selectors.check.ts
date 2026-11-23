// Self-check for the derived numbers. Run: npm run check
import assert from "node:assert/strict";
import { weekNumbers, attentionCount, openSlots, fillTemplate } from "./selectors.ts";
import { initialCalls, initialLeads, initialSlots } from "./mock/week.ts";
import { fmtClock, fmtWhen, isPast, slotLabel, at } from "./dates.ts";
import { estimate } from "./estimate.ts";

const w = weekNumbers({ leads: initialLeads, calls: initialCalls });
assert.deepEqual(
  [w.missed, w.textedBack, w.replied, w.leads, w.booked, w.won, w.revenue],
  [9, 8, 6, 5, 2, 1, 480],
);
assert.deepEqual(w.callsByDay, [4, 3, 2, 0, 0]);
assert.deepEqual(w.leadsByDay, [2, 2, 1, 0, 0]);
assert.equal(attentionCount(initialLeads), 2);
assert.equal(openSlots(initialSlots).length, 6);

assert.equal(isPast(2, 1), true); // Wed 10–12 has started at 11:00
assert.equal(isPast(2, 2), false);
assert.equal(slotLabel(3, 0), "Thursday 8–10 AM");
assert.equal(slotLabel(3, 1), "Thursday 10 AM–12 PM");
assert.equal(slotLabel(4, 3, false), "3–5 PM");
assert.equal(fmtClock(at(0, 0, 5)), "12:05 AM");
assert.equal(fmtWhen(at(2, 13, 0)), "Today 1:00 PM");

const luis = initialLeads.find((l) => l.id === "luis")!;
assert.equal(
  fillTemplate("Hi [name], I can come [slot].", luis, initialSlots, "Mike's Plumbing"),
  "Hi Luis, I can come Wednesday 1–3 PM.",
);
const dana = initialLeads.find((l) => l.id === "dana")!;
assert.equal(fillTemplate("[slot] at [address]", dana, initialSlots, "x"), "Thursday 8–10 AM at 412 Alder St");

// Landing calculator: 10 calls × 4.33 × 20% = 8.66 jobs; × $500 = $4,330; minus $99.
const e = estimate(10, 500, 20);
assert.ok(Math.abs(e.jobs - 8.66) < 1e-9);
assert.ok(Math.abs(e.revenue - 4330) < 1e-6);
assert.ok(Math.abs(e.net - 4231) < 1e-6);

console.log("selectors: all checks passed");
