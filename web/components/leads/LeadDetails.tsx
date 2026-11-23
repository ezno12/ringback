"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Phone, Trophy, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { leadTitle, slotFor } from "@/lib/selectors";
import { fmtWhen, money, slotLabel } from "@/lib/dates";
import type { Lead } from "@/lib/types";

export function LeadDetails({ lead, open }: { lead: Lead; open: boolean }) {
  const slots = useStore((s) => s.slots);
  const slot = slotFor(lead.slotId, slots);

  return (
    <aside
      aria-label="Lead details"
      className={`${open ? "flex max-md:flex-1 md:absolute md:inset-y-0 md:right-0 md:z-20 md:w-80 md:shadow-2xl md:shadow-black/60" : "hidden"} flex-col overflow-y-auto border-l border-line bg-surface lg:static lg:z-auto lg:flex lg:w-[300px] lg:shrink-0 lg:shadow-none`}
    >
      <div className="flex items-center gap-2 border-b border-line px-2 py-2 lg:hidden">
        <Link href={`/app/leads?lead=${lead.id}`} className="btn btn-ghost px-2" aria-label="Back to conversation">
          <ArrowLeft size={20} aria-hidden="true" className="md:hidden" />
          <X size={20} aria-hidden="true" className="max-md:hidden" />
        </Link>
        <h2 className="text-base font-semibold">Details</h2>
      </div>
      <dl className="grid gap-4 p-4 text-sm">
        <Item label="Caller">{leadTitle(lead)}</Item>
        <Item label="Phone">
          <span className="tabular-nums">{lead.phone}</span>
        </Item>
        <Item label="Problem">{lead.problem}</Item>
        <Item label="Address">{lead.address}</Item>
        <Item label="Urgency">{lead.urgency}</Item>
        <Item label="Appointment">
          {slot ? (
            <Link href="/app/calendar" className="text-bk underline-offset-2 hover:underline">
              {slotLabel(slot.day, slot.idx)}
            </Link>
          ) : (
            "None yet"
          )}
        </Item>
        <Item label="Source">
          {lead.source}, {fmtWhen(lead.calledAt)}
        </Item>
      </dl>
      <div className="mt-auto grid gap-2 border-t border-line p-4">
        <a href={`tel:${lead.phone.replace(/\D/g, "")}`} className="btn btn-primary w-full">
          <Phone size={16} aria-hidden="true" /> Call back
        </a>
        <WonForm key={lead.id} lead={lead} />
      </div>
    </aside>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="text-fg">{children}</dd>
    </div>
  );
}

function WonForm({ lead }: { lead: Lead }) {
  const markWon = useStore((s) => s.markWon);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(lead.wonValue ? String(lead.wonValue) : "");
  const [error, setError] = useState("");
  const id = `won-${lead.id}`;

  if (!editing) {
    return lead.wonValue != null ? (
      <div className="flex items-center justify-between gap-2 rounded-xl border border-nw-bg bg-nw-bg/50 px-3 py-2">
        <span className="flex items-center gap-2 text-sm font-medium text-nw">
          <Trophy size={16} aria-hidden="true" /> Won {money(lead.wonValue)}
        </span>
        <button type="button" className="btn btn-ghost min-h-10 px-2 text-sm" onClick={() => setEditing(true)}>
          Edit
        </button>
      </div>
    ) : (
      <button type="button" className="btn w-full" onClick={() => setEditing(true)}>
        <Trophy size={16} aria-hidden="true" /> Mark job won
      </button>
    );
  }

  return (
    <form
      className="grid gap-2"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const n = Number(value.replace(/[$,\s]/g, ""));
        if (!Number.isFinite(n) || n <= 0) {
          setError("Enter the job value in dollars, for example 350.");
          return;
        }
        markWon(lead.id, n);
        setEditing(false);
        setError("");
      }}
    >
      <label htmlFor={id} className="label">
        Job value
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted">$</span>
        <input
          id={id}
          autoFocus
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
          className="field pl-7 tabular-nums"
        />
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className="text-sm text-em">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary flex-1">
          Save
        </button>
        <button type="button" className="btn" onClick={() => setEditing(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
