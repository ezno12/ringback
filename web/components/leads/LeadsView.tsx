"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PhoneIncoming, Trophy } from "lucide-react";
import { useStore } from "@/lib/store";
import { leadTitle, weekNumbers } from "@/lib/selectors";
import { fmtWhen, money } from "@/lib/dates";
import type { Lead, LeadStatus } from "@/lib/types";
import { PageHeader, StatusPill } from "@/components/ui";
import { Thread } from "./Thread";
import { LeadDetails } from "./LeadDetails";

type Filter = "all" | Exclude<LeadStatus, "voicemail">;
const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "booked", label: "Booked" },
  { value: "emergency", label: "Emergency" },
];

export function LeadsView() {
  const params = useSearchParams();
  const router = useRouter();
  const leads = useStore((s) => s.leads);
  const calls = useStore((s) => s.calls);
  const playing = useStore((s) => s.playing);
  const typingLeadId = useStore((s) => s.typingLeadId);
  const simulateCall = useStore((s) => s.simulateCall);
  const markRead = useStore((s) => s.markRead);
  const [filter, setFilter] = useState<Filter>("all");

  const numbers = useMemo(() => weekNumbers({ leads, calls }), [leads, calls]);
  const sorted = useMemo(() => [...leads].sort((a, b) => b.calledAt - a.calledAt), [leads]);
  const shown = filter === "all" ? sorted : sorted.filter((l) => l.status === filter);

  const param = params.get("lead");
  const view = params.get("view");
  const active = leads.find((l) => l.id === param) ?? sorted[0] ?? null;
  const hasParam = Boolean(param && active?.id === param);

  useEffect(() => {
    if (hasParam && active && !active.read) markRead(active.id);
  }, [hasParam, active, markRead]);

  function simulate() {
    const id = simulateCall();
    if (id) {
      setFilter("all");
      router.push(`/app/leads?lead=${id}`);
    }
  }

  const count = (f: Filter) => (f === "all" ? leads.length : leads.filter((l) => l.status === f).length);

  return (
    <div className="flex h-[calc(100dvh-64px-env(safe-area-inset-bottom))] flex-col md:h-dvh">
      <div className={hasParam ? "hidden md:block" : ""}>
        <PageHeader title="Leads">
          <dl className="order-3 grid w-full grid-cols-4 gap-3 xl:order-none xl:ml-auto xl:w-auto xl:gap-6">
            <Stat label="Missed calls" short="Missed" value={numbers.missed} />
            <Stat label="Leads captured" short="Leads" value={numbers.leads} />
            <Stat label="Jobs booked" short="Booked" value={numbers.booked} />
            <Stat label="Revenue recovered" short="Recovered" value={money(numbers.revenue)} />
          </dl>
          <button
            type="button"
            className="btn btn-primary ml-auto xl:ml-0"
            onClick={simulate}
            disabled={Boolean(playing)}
          >
            <PhoneIncoming size={16} aria-hidden="true" />
            {playing ? "Call in progress…" : "Simulate a missed call"}
          </button>
        </PageHeader>
      </div>

      <div className="relative flex min-h-0 flex-1">
        {/* List */}
        <section
          aria-label="Lead list"
          className={`${hasParam ? "hidden md:flex" : "flex"} w-full min-w-0 flex-col border-r border-line bg-surface md:w-72 lg:w-80 xl:w-96`}
        >
          <div
            className="flex gap-1 overflow-x-auto border-b border-line p-2 [scrollbar-width:none]"
            role="group"
            aria-label="Filter leads"
          >
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
                className={`min-h-10 shrink-0 rounded-lg px-3 text-sm transition-colors duration-150 ${filter === f.value ? "bg-raised text-fg" : "text-muted hover:text-fg"}`}
              >
                {f.label} <span className="text-xs text-muted tabular-nums">{count(f.value)}</span>
              </button>
            ))}
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto">
            {shown.map((l) => (
              <LeadRow key={l.id} lead={l} on={l.id === active?.id} typing={typingLeadId === l.id} />
            ))}
            {shown.length === 0 && (
              <li className="p-6 text-sm text-muted">No leads with this status yet. Press &ldquo;Simulate a missed call&rdquo; to add one.</li>
            )}
          </ul>
        </section>

        {/* Conversation */}
        {active ? (
          <>
            <Thread key={active.id} lead={active} className={`${!hasParam || view === "details" ? "hidden md:flex" : "flex"} min-w-0 flex-1`} />
            <LeadDetails lead={active} open={view === "details"} />
          </>
        ) : (
          <div className="hidden flex-1 items-center justify-center p-6 text-sm text-muted md:flex">No leads yet.</div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, short, value }: { label: string; short: string; value: string | number }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted">
        <span className="sm:hidden">{short}</span>
        <span className="max-sm:hidden">{label}</span>
      </dt>
      <dd className="font-display text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function LeadRow({ lead, on, typing }: { lead: Lead; on: boolean; typing: boolean }) {
  const last = lead.messages.at(-1);
  const preview = typing
    ? "Assistant is typing…"
    : lead.voicemail
      ? `“${lead.voicemail.slice(0, 60)}…”`
      : (last?.text ?? lead.problem);
  return (
    <li>
      <Link
        href={`/app/leads?lead=${lead.id}`}
        aria-current={on ? "true" : undefined}
        className={`grid grid-cols-[minmax(0,1fr)] gap-1 border-b border-line px-4 py-3 transition-colors duration-150 ${on ? "bg-raised md:shadow-[inset_2px_0_0_var(--color-accent)]" : "hover:bg-raised/50"}`}
      >
        <span className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2 font-semibold">
            {!lead.read && <span className="size-2 shrink-0 rounded-full bg-accent" aria-label="Unread" />}
            <span className="truncate">{leadTitle(lead)}</span>
          </span>
          <StatusPill status={lead.status} />
        </span>
        <span className="flex items-center justify-between gap-2 text-xs text-muted">
          <span className="truncate">{lead.problem}</span>
          <span className="shrink-0 tabular-nums">{fmtWhen(lead.calledAt)}</span>
        </span>
        <span className={`truncate text-sm ${typing ? "text-accent" : "text-fg-2"}`}>{preview}</span>
        {lead.wonValue != null && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-nw">
            <Trophy size={12} aria-hidden="true" /> Won {money(lead.wonValue)}
          </span>
        )}
      </Link>
    </li>
  );
}
