"use client";

import { useId, useState, type ReactNode } from "react";
import { CircleCheck, PhoneCall, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { opener } from "@/lib/mock/settings";
import type { AutoReplies, Permissions, Settings, Shop } from "@/lib/types";
import { fmtClock, DEMO_NOW } from "@/lib/dates";
import { PageHeader, Switch } from "@/components/ui";

const pick = (s: Settings): Settings =>
  structuredClone({ shop: s.shop, permissions: s.permissions, quickReplies: s.quickReplies, autoReplies: s.autoReplies });

/** Number of leaf values that differ between two plain objects. */
function countChanges(a: unknown, b: unknown): number {
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return a === b ? 0 : 1;
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let n = 0;
  for (const k of keys) n += countChanges((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]);
  return n;
}

const PERMS: { key: keyof Permissions; label: string; hint: string }[] = [
  { key: "textBack", label: "Text back missed calls", hint: "Sends the first message within seconds of a missed call." },
  { key: "book", label: "Book into the calendar", hint: "Offers your open slots. Off: the assistant takes details for a call back." },
  { key: "statFee", label: "State the call-out fee when asked", hint: "Never quotes any other price." },
  { key: "ringOwner", label: "Ring my mobile for emergencies", hint: "Burst pipes, flooding, sewage, no heat in freezing weather." },
  { key: "nudge", label: "Nudge silent callers once", hint: "One follow-up text after 10 minutes with no reply." },
];

const AUTOS: { key: keyof AutoReplies; label: string; hint: string }[] = [
  { key: "afterHours", label: "After hours", hint: "Sent instead of booking when a call comes in outside your opening hours." },
  { key: "outsideArea", label: "Outside the service area", hint: "Sent when the caller's ZIP code isn't one you serve." },
  { key: "bookingConfirmed", label: "Booking confirmed", hint: "Sent when the assistant books a slot." },
];

export function SettingsView() {
  const stored = useStore((s) => s);
  const saveSettings = useStore((s) => s.saveSettings);
  const resetDemo = useStore((s) => s.resetDemo);
  const [draft, setDraft] = useState<Settings>(() => pick(stored));
  const [confirmReset, setConfirmReset] = useState(false);
  const [testCall, setTestCall] = useState<"idle" | "calling" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const changes = countChanges(pick(stored), draft);
  const { shop, permissions: perms, quickReplies, autoReplies } = draft;
  const tech = shop.trade === "HVAC" ? "technician" : "plumber";

  const setShop = (p: Partial<Shop>) => setDraft((d) => ({ ...d, shop: { ...d.shop, ...p } }));
  const setPerm = (k: keyof Permissions, v: boolean) => setDraft((d) => ({ ...d, permissions: { ...d.permissions, [k]: v } }));

  function save() {
    const e: Record<string, string> = {};
    if (!shop.name.trim()) e.name = "Enter your shop name. Callers see it in the first text.";
    if (!Number.isFinite(shop.calloutFee) || shop.calloutFee < 0) e.fee = "Enter a call-out fee of $0 or more.";
    quickReplies.forEach((q) => {
      if (!q.label.trim() || !q.text.trim()) e[q.id] = "Give this quick reply a button label and a message.";
    });
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`field-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    saveSettings({ ...draft, shop: { ...shop, name: shop.name.trim() } });
    useStore.setState({ notice: "Settings saved." });
  }

  function placeTestCall() {
    setTestCall("calling");
    setTimeout(() => setTestCall("done"), 1400);
  }

  return (
    <div className="pb-40 md:pb-28">
      <PageHeader title="Settings" />
      <div className="mx-auto grid max-w-3xl gap-4 p-4 md:p-6">
        <Card title="Shop">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Shop name" id="field-name" error={errors.name}>
              <input
                id="field-name"
                className="field"
                value={shop.name}
                autoComplete="organization"
                onChange={(e) => setShop({ name: e.target.value })}
              />
            </Field>
            <fieldset className="grid gap-1.5">
              <legend className="label mb-1.5">Trade</legend>
              <div className="grid grid-cols-2 gap-2">
                {(["Plumbing", "HVAC"] as const).map((t) => (
                  <label
                    key={t}
                    className={`flex min-h-11 items-center gap-2 rounded-[10px] border px-3 text-sm ${shop.trade === t ? "border-accent bg-accent/5" : "border-edge bg-raised"}`}
                  >
                    <input
                      type="radio"
                      name="trade"
                      value={t}
                      checked={shop.trade === t}
                      onChange={() => setShop({ trade: t })}
                      className="accent-accent"
                    />
                    {t}
                  </label>
                ))}
              </div>
            </fieldset>
            <Field label="Call-out fee" id="field-fee" error={errors.fee}>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted">$</span>
                <input
                  id="field-fee"
                  className="field pl-7 tabular-nums"
                  inputMode="numeric"
                  value={Number.isNaN(shop.calloutFee) ? "" : shop.calloutFee}
                  onChange={(e) => setShop({ calloutFee: e.target.value === "" ? NaN : Number(e.target.value.replace(/\D/g, "")) })}
                />
              </div>
            </Field>
            <Field label="ZIP codes served" id="field-zips" hint="Separate with commas.">
              <input id="field-zips" className="field" value={shop.zips} onChange={(e) => setShop({ zips: e.target.value })} />
            </Field>
          </div>
          <fieldset className="mt-4 grid gap-2">
            <legend className="label mb-1.5">Opening hours</legend>
            <div className="flex flex-wrap items-end gap-3">
              <Field label="Weekdays open" id="field-open">
                <input id="field-open" type="time" className="field w-36" value={shop.weekdayOpen} onChange={(e) => setShop({ weekdayOpen: e.target.value })} />
              </Field>
              <Field label="Weekdays close" id="field-close">
                <input id="field-close" type="time" className="field w-36" value={shop.weekdayClose} onChange={(e) => setShop({ weekdayClose: e.target.value })} />
              </Field>
            </div>
            <Switch label="Open on Saturdays" checked={shop.saturday} onChange={(v) => setShop({ saturday: v })} />
          </fieldset>
        </Card>

        <Card title="Call forwarding">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 font-medium">
                <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
                Forwarding is on
              </p>
              <p className="text-sm text-muted">
                Unanswered calls to {shop.phone} forward to Ringback after 4 rings.
              </p>
            </div>
            <button type="button" className="btn" onClick={placeTestCall} disabled={testCall === "calling"}>
              <PhoneCall size={16} aria-hidden="true" />
              {testCall === "calling" ? "Calling…" : "Place a test call"}
            </button>
          </div>
          <p role="status" className="mt-3 text-sm">
            {testCall === "done" && (
              <span className="flex items-start gap-2 rounded-xl bg-nw-bg px-3 py-2 text-nw">
                <CircleCheck size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                Test call received at {fmtClock(DEMO_NOW)}. Forwarding works and the text-back went out. (Demo: no real call was made.)
              </span>
            )}
          </p>
        </Card>

        <Card title="What the assistant may do">
          <div className="divide-y divide-line">
            {PERMS.map((p) => (
              <Switch key={p.key} label={p.label} hint={p.hint} checked={perms[p.key]} onChange={(v) => setPerm(p.key, v)} />
            ))}
          </div>
        </Card>

        <Card title="What callers will read">
          {perms.textBack ? (
            <div className="grid gap-3" aria-live="polite">
              <Preview label="First message">{opener(shop.name || "your shop")}</Preview>
              <Preview label="When a caller asks about price">
                {perms.statFee
                  ? `Our call-out fee is $${Number.isFinite(shop.calloutFee) ? shop.calloutFee : 0}. The ${tech} gives you a price for the work once they've seen the problem.`
                  : `The ${tech} will talk through pricing when they call you.`}
              </Preview>
              {perms.book ? (
                <Preview label="Then">I can book [first open slot] or [second open slot]. Which works?</Preview>
              ) : (
                <Preview label="Then">Thanks. Someone from {shop.name || "the shop"} will call you back to set a time.</Preview>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted">Text-back is off, so callers won&rsquo;t get a text. Missed calls are still logged.</p>
          )}
        </Card>

        <Card title="Quick replies" hint="Buttons you can tap when you take over a conversation. [name] and [slot] are filled in from the lead.">
          <ul className="grid gap-4">
            {quickReplies.map((q, i) => (
              <li key={q.id} className="grid gap-2 rounded-xl border border-line p-3">
                <div className="flex items-end gap-2">
                  <Field label="Button label" id={`field-${q.id}`} error={errors[q.id]}>
                    <input
                      id={`field-${q.id}`}
                      className="field"
                      value={q.label}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, quickReplies: d.quickReplies.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) }))
                      }
                    />
                  </Field>
                  <button
                    type="button"
                    className="btn btn-ghost px-3 text-em"
                    aria-label={`Delete quick reply "${q.label || "untitled"}"`}
                    onClick={() => setDraft((d) => ({ ...d, quickReplies: d.quickReplies.filter((x) => x.id !== q.id) }))}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
                <Field label="Message" id={`field-${q.id}-text`}>
                  <textarea
                    id={`field-${q.id}-text`}
                    rows={2}
                    className="field resize-y"
                    value={q.text}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, quickReplies: d.quickReplies.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) }))
                    }
                  />
                </Field>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn mt-3"
            onClick={() =>
              setDraft((d) => ({
                ...d,
                quickReplies: [...d.quickReplies, { id: `qr-${Date.now().toString(36)}`, label: "New reply", text: "Hi [name], " }],
              }))
            }
          >
            <Plus size={16} aria-hidden="true" /> Add a quick reply
          </button>
        </Card>

        <Card title="Automatic replies" hint="[shop], [slot] and [address] are filled in when the text is sent.">
          <div className="grid gap-4">
            {AUTOS.map((a) => (
              <div key={a.key} className="grid gap-1 rounded-xl border border-line p-3">
                <Switch
                  label={a.label}
                  hint={a.hint}
                  checked={autoReplies[a.key].on}
                  onChange={(v) => setDraft((d) => ({ ...d, autoReplies: { ...d.autoReplies, [a.key]: { ...d.autoReplies[a.key], on: v } } }))}
                />
                <label htmlFor={`auto-${a.key}`} className="sr-only">
                  {a.label} message
                </label>
                <textarea
                  id={`auto-${a.key}`}
                  rows={2}
                  className="field resize-y"
                  disabled={!autoReplies[a.key].on}
                  value={autoReplies[a.key].text}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, autoReplies: { ...d.autoReplies, [a.key]: { ...d.autoReplies[a.key], text: e.target.value } } }))
                  }
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-30 border-t border-line bg-sidebar/95 backdrop-blur md:bottom-0 md:left-24 lg:left-60">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 px-4 py-3 md:px-6">
          {confirmReset ? (
            <>
              <p className="text-sm" role="alert">
                Reset everything? Simulated calls, won jobs and settings go back to the start.
              </p>
              <span className="flex-1" />
              <button type="button" className="btn" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn border-em-bg bg-em-bg text-em"
                onClick={() => {
                  resetDemo();
                  setDraft(pick(useStore.getState()));
                  setErrors({});
                  setConfirmReset(false);
                  setTestCall("idle");
                  useStore.setState({ notice: "Demo reset." });
                }}
              >
                <RotateCcw size={16} aria-hidden="true" /> Reset demo
              </button>
            </>
          ) : (
            <>
              <p className="flex items-center gap-2 text-sm" aria-live="polite">
                <span className={`size-2 rounded-full ${changes ? "bg-em" : "bg-accent"}`} aria-hidden="true" />
                {changes ? `${changes} unsaved ${changes === 1 ? "change" : "changes"}` : "All changes saved"}
              </p>
              <span className="hidden text-sm text-muted sm:inline">Plan: Starter, $99 a month</span>
              <span className="flex-1" />
              <button type="button" className="btn btn-ghost" onClick={() => setConfirmReset(true)}>
                <RotateCcw size={16} aria-hidden="true" /> Reset demo
              </button>
              <button type="button" className="btn btn-primary" onClick={save} disabled={!changes}>
                Save changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  const id = useId();
  return (
    <section className="card p-5" aria-labelledby={id}>
      <h2 id={id} className="text-lg font-semibold">
        {title}
      </h2>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ label, id, hint, error, children }: { label: string; id: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div className="grid flex-1 gap-1.5">
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
      {error && (
        <p className="text-sm text-em" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function Preview({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1">
      <span className="text-xs text-muted">{label}</span>
      <p className="max-w-md rounded-2xl rounded-bl-md border border-line bg-raised px-3.5 py-2.5 text-[15px] leading-snug">{children}</p>
    </div>
  );
}
