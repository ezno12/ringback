"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Hand, PanelRight, Phone, Send, TriangleAlert, Undo2, Voicemail } from "lucide-react";
import { useStore } from "@/lib/store";
import { fillTemplate, leadTitle } from "@/lib/selectors";
import { fmtClock, fmtWhen } from "@/lib/dates";
import type { Lead, Message } from "@/lib/types";
import { StatusPill } from "@/components/ui";

export function Thread({ lead, className }: { lead: Lead; className: string }) {
  const typing = useStore((s) => s.typingLeadId === lead.id);
  const takeOver = useStore((s) => s.takeOver);
  const handBack = useStore((s) => s.handBack);
  const endRef = useRef<HTMLDivElement>(null);
  // Only messages that arrive while the thread is open animate in.
  const [initial] = useState(() => new Set(lead.messages.map((m) => m.id)));

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    endRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
  }, [lead.id, lead.messages.length, typing]);

  const isVoicemail = lead.status === "voicemail";

  return (
    <section aria-label={`Conversation with ${leadTitle(lead)}`} className={`${className} flex-col bg-ground`}>
      <div className="flex items-center gap-2 border-b border-line px-2 py-2 md:px-4">
        <Link href="/app/leads" className="btn btn-ghost px-2 md:hidden" aria-label="Back to leads">
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold">{leadTitle(lead)}</h2>
          <p className="flex items-center gap-2 text-xs text-muted tabular-nums">
            <StatusPill status={lead.status} />
            <span className="truncate">{lead.name ? lead.phone : lead.source}</span>
          </p>
        </div>
        {!isVoicemail &&
          (lead.takenOver ? (
            <button type="button" className="btn" onClick={() => handBack(lead.id)}>
              <Undo2 size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Hand back to assistant</span>
              <span className="sm:hidden">Hand back</span>
            </button>
          ) : (
            <button type="button" className="btn" onClick={() => takeOver(lead.id)}>
              <Hand size={16} aria-hidden="true" />
              Take over
            </button>
          ))}
        <Link href={`/app/leads?lead=${lead.id}&view=details`} className="btn px-3 lg:hidden" aria-label="Lead details">
          <PanelRight size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Details</span>
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-6">
        {lead.ownerCalled && (
          <p className="mb-4 flex items-start gap-2 rounded-xl bg-em-bg px-3 py-2 text-sm text-em">
            <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            Emergency. Ringback rang your mobile so you could call back right away.
          </p>
        )}
        {isVoicemail ? (
          <VoicemailCard lead={lead} />
        ) : (
          <div role="log" aria-live="polite" aria-label="Messages" className="mx-auto flex max-w-2xl flex-col gap-3">
            {lead.messages.map((m) => (
              <Bubble key={m.id} m={m} lead={lead} animate={!initial.has(m.id)} />
            ))}
            {typing && (
              <div className="flex flex-col items-end gap-1" aria-label="Assistant is typing">
                <span className="text-[11px] text-muted">Assistant</span>
                <span className="flex gap-1 rounded-2xl rounded-br-md border border-bot-edge bg-bot px-3 py-3">
                  {[0, 150, 300].map((d) => (
                    <i key={d} className="size-1.5 animate-blink rounded-full bg-fg-2" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </span>
              </div>
            )}
            {lead.takenOver && (
              <p className="self-center rounded-full border border-line px-3 py-1 text-xs text-fg-2">
                Assistant paused. You&rsquo;re replying.
              </p>
            )}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {!isVoicemail && <Composer key={lead.id} lead={lead} />}
    </section>
  );
}

function Bubble({ m, lead, animate }: { m: Message; lead: Lead; animate: boolean }) {
  const pop = animate ? "animate-pop" : "";
  if (m.from === "system") {
    return (
      <p className={`flex items-center gap-2 self-center rounded-full border border-line bg-surface px-3 py-1 text-xs text-fg-2 ${pop}`}>
        <Phone size={12} aria-hidden="true" /> {m.text}
        <span className="text-muted tabular-nums">{fmtClock(m.at)}</span>
      </p>
    );
  }
  const right = m.from !== "caller";
  const who = m.from === "caller" ? (lead.name?.split(" ")[0] ?? "Caller") : m.from === "owner" ? "You" : "Assistant";
  const tone =
    m.from === "caller"
      ? "rounded-bl-md border-line bg-raised"
      : m.from === "owner"
        ? "rounded-br-md border-accent bg-accent text-on-accent"
        : "rounded-br-md border-bot-edge bg-bot";
  return (
    <div className={`flex max-w-[85%] ${pop} flex-col gap-1 md:max-w-[75%] ${right ? "items-end self-end" : "items-start"}`}>
      <span className="text-[11px] text-muted">
        {who} <span className="tabular-nums">{fmtClock(m.at)}</span>
      </span>
      <p className={`rounded-2xl border px-3.5 py-2.5 text-[15px] leading-snug ${tone}`}>{m.text}</p>
    </div>
  );
}

function VoicemailCard({ lead }: { lead: Lead }) {
  return (
    <div className="card mx-auto max-w-2xl p-5">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Voicemail size={16} aria-hidden="true" /> Voicemail, {fmtWhen(lead.calledAt)}
      </p>
      <blockquote className="mt-3 border-l-2 border-edge pl-4 text-[15px] leading-relaxed text-fg-2">
        {lead.voicemail}
      </blockquote>
      <p className="mt-4 text-sm text-muted">
        This number is a landline, so Ringback couldn&rsquo;t text back. Call them to get the details.
      </p>
      <a href={`tel:${lead.phone.replace(/\D/g, "")}`} className="btn btn-primary mt-4">
        <Phone size={16} aria-hidden="true" /> Call back {lead.phone}
      </a>
    </div>
  );
}

function Composer({ lead }: { lead: Lead }) {
  const quickReplies = useStore((s) => s.quickReplies);
  const slots = useStore((s) => s.slots);
  const shop = useStore((s) => s.shop.name);
  const send = useStore((s) => s.sendOwnerMessage);
  const takeOver = useStore((s) => s.takeOver);
  const [draft, setDraft] = useState("");
  const boxRef = useRef<HTMLTextAreaElement>(null);
  const id = `reply-${lead.id}`;

  if (!lead.takenOver) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface px-4 py-3">
        <p className="text-sm text-muted">The assistant is handling this thread. Take over to reply yourself.</p>
        <button type="button" className="btn" onClick={() => takeOver(lead.id)}>
          <Hand size={16} aria-hidden="true" /> Take over
        </button>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    send(lead.id, draft);
    setDraft("");
    boxRef.current?.focus();
  }

  return (
    <form onSubmit={submit} className="grid gap-2 border-t border-line bg-surface px-3 py-3 md:px-4">
      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Quick replies">
        {quickReplies.map((q) => (
          <button
            key={q.id}
            type="button"
            className="min-h-10 shrink-0 rounded-full border border-edge px-3 text-sm text-fg-2 transition-colors duration-150 hover:border-accent hover:text-fg"
            onClick={() => {
              setDraft(fillTemplate(q.text, lead, slots, shop));
              boxRef.current?.focus();
            }}
          >
            {q.label}
          </button>
        ))}
      </div>
      <div className="flex items-end gap-2">
        <label htmlFor={id} className="sr-only">
          Reply to {leadTitle(lead)}
        </label>
        <textarea
          id={id}
          ref={boxRef}
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(e);
          }}
          placeholder="Write a reply, or pick a quick reply above"
          className="field min-h-12 flex-1 resize-none"
        />
        <button type="submit" className="btn btn-primary" disabled={!draft.trim()}>
          <Send size={16} aria-hidden="true" /> Send
        </button>
      </div>
    </form>
  );
}
