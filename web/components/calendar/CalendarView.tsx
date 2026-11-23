"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { isOpen, leadTitle } from "@/lib/selectors";
import { DAYS, isPast, slotLabel, weekDates } from "@/lib/dates";
import type { Lead, Slot } from "@/lib/types";
import { PageHeader } from "@/components/ui";

const TODAY = 2;

export function CalendarView() {
  const slots = useStore((s) => s.slots);
  const leads = useStore((s) => s.leads);
  const toggle = useStore((s) => s.toggleSlot);
  const dates = useMemo(() => weekDates(), []);
  const open = slots.filter(isOpen).length;
  const byId = useMemo(() => new Map(leads.map((l) => [l.id, l])), [leads]);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const cell = (s: Slot) => <SlotCell key={s.id} slot={s} lead={s.leadId ? byId.get(s.leadId) : undefined} onToggle={toggle} />;

  return (
    <div>
      <PageHeader title="Calendar">
        <p className="ml-auto text-sm text-fg-2" aria-live="polite">
          <span className="font-display text-xl font-semibold text-accent tabular-nums">{open}</span> open{" "}
          {open === 1 ? "slot" : "slots"} the assistant can offer
        </p>
      </PageHeader>

      <div className="grid gap-4 p-4 md:p-6">
        <p className="text-sm text-muted">
          Week of {fmt(dates[0])} to {fmt(dates[4])}. Click an open slot to close it, or a closed slot to open it. The
          assistant only offers open slots.
        </p>

        {/* Week grid, 768px and up */}
        <div className="hidden grid-cols-[72px_repeat(5,minmax(0,1fr))] gap-2 md:grid" role="table" aria-label="This week's slots">
          <div role="row" className="contents">
            <span role="columnheader" />
            {DAYS.map((d, i) => (
              <span role="columnheader" key={d} className="px-2 pb-1 text-xs text-muted">
                <b className={`block text-sm font-semibold ${i === TODAY ? "text-accent" : "text-fg"}`}>{d.slice(0, 3)}</b>
                {fmt(dates[i])}
                {i === TODAY && ", today"}
              </span>
            ))}
          </div>
          {[0, 1, 2, 3].map((idx) => (
            <div role="row" key={idx} className="contents">
              <span role="rowheader" className="pt-3 text-xs text-muted">
                {slotLabel(0, idx, false)}
              </span>
              {slots.filter((s) => s.idx === idx).sort((a, b) => a.day - b.day).map((s) => (
                <div role="cell" key={s.id}>
                  {cell(s)}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Day list under 768px */}
        <div className="grid gap-5 md:hidden">
          {DAYS.map((d, day) => (
            <section key={d} aria-labelledby={`day-${day}`}>
              <h2 id={`day-${day}`} className={`mb-2 text-base font-semibold ${day === TODAY ? "text-accent" : ""}`}>
                {d}, {fmt(dates[day])}
                {day === TODAY && " (today)"}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {slots.filter((s) => s.day === day).sort((a, b) => a.idx - b.idx).map((s) => (
                  <div key={s.id} className="grid gap-1">
                    <span className="text-xs text-muted">{slotLabel(day, s.idx, false)}</span>
                    {cell(s)}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-fg-2" aria-label="Legend">
          <Legend cls="border-bk-edge bg-bk-bg">Booked by the assistant (opens the conversation)</Legend>
          <Legend cls="border-edge bg-raised">Your own booking</Legend>
          <Legend cls="border-dashed border-accent">Open</Legend>
          <Legend cls="border-line bg-[repeating-linear-gradient(135deg,var(--color-surface)_0_5px,var(--color-raised)_5px_10px)]">
            Closed
          </Legend>
          <Legend cls="border-sidebar bg-sidebar">Past</Legend>
        </ul>
      </div>
    </div>
  );
}

function Legend({ cls, children }: { cls: string; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`size-4 rounded border ${cls}`} aria-hidden="true" />
      {children}
    </li>
  );
}

const base = "flex min-h-[76px] w-full flex-col items-start justify-start gap-0.5 rounded-xl border p-2.5 text-left text-xs transition-colors duration-150";

function SlotCell({ slot, lead, onToggle }: { slot: Slot; lead?: Lead; onToggle: (id: string) => void }) {
  const label = slotLabel(slot.day, slot.idx);
  const past = isPast(slot.day, slot.idx);

  if (slot.state === "assistant" && lead) {
    return (
      <Link
        href={`/app/leads?lead=${lead.id}`}
        className={`${base} border-bk-edge bg-bk-bg hover:border-bk ${past ? "opacity-60" : ""}`}
        aria-label={`${label}: ${leadTitle(lead)}, booked by the assistant. Open conversation`}
      >
        <b className="text-sm font-semibold text-bk">{leadTitle(lead)}</b>
        <span className="text-fg-2">{lead.problem}</span>
      </Link>
    );
  }
  if (slot.state === "owner") {
    return (
      <div className={`${base} border-edge bg-raised ${past ? "opacity-60" : ""}`}>
        <b className="text-sm font-semibold">Your booking</b>
        <span className="text-fg-2">{slot.note}</span>
      </div>
    );
  }
  if (past) {
    return (
      <div className={`${base} border-sidebar bg-sidebar text-past`} aria-label={`${label}: past`}>
        Past
      </div>
    );
  }
  const open = slot.state === "open";
  return (
    <button
      type="button"
      onClick={() => onToggle(slot.id)}
      aria-label={`${label}: ${open ? "open. Close this slot" : "closed. Open this slot"}`}
      className={`${base} ${open ? "border-dashed border-accent bg-accent/5 text-nw hover:bg-accent/10" : "border-line bg-[repeating-linear-gradient(135deg,var(--color-surface)_0_6px,var(--color-raised)_6px_12px)] text-muted hover:border-edge"}`}
    >
      <b className="text-sm font-semibold">{open ? "Open" : "Closed"}</b>
      <span className={open ? "text-fg-2" : ""}>{open ? "Click to close" : "Click to open"}</span>
    </button>
  );
}
