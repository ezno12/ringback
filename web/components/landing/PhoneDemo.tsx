"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarCheck, RotateCcw } from "lucide-react";

type Line = { from: "assistant" | "caller"; text: string };

const SCRIPT: Line[] = [
  { from: "assistant", text: "Hi, this is the automated assistant for Mike's Plumbing. Sorry we missed your call. What can we help with?" },
  { from: "caller", text: "Water heater in the garage is leaking from the bottom." },
  { from: "assistant", text: "Sorry to hear that. What's the address? Our call-out fee is $89." },
  { from: "caller", text: "412 Alder St" },
  { from: "assistant", text: "I can book Thursday 8–10 AM or 3–5 PM. Which works?" },
  { from: "caller", text: "8–10 please" },
];

/** Hero phone: plays the conversation message by message, then the booked card. */
export function PhoneDemo() {
  const [shown, setShown] = useState(1);
  const [typing, setTyping] = useState(false);
  const [booked, setBooked] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const play = useCallback((from: number) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(SCRIPT.length);
      setTyping(false);
      setBooked(true);
      return;
    }
    setShown(from);
    setBooked(false);
    setTyping(false);
    let t = 700;
    for (let i = from; i < SCRIPT.length; i++) {
      if (SCRIPT[i].from === "assistant") {
        timers.current.push(setTimeout(() => setTyping(true), t));
        t += 1100;
      }
      timers.current.push(
        setTimeout(() => {
          setTyping(false);
          setShown(i + 1);
        }, t),
      );
      t += SCRIPT[i].from === "caller" ? 1300 : 900;
    }
    timers.current.push(setTimeout(() => setBooked(true), t));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => play(1), 0);
    const all = timers.current;
    return () => {
      clearTimeout(t);
      all.forEach(clearTimeout);
    };
  }, [play]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [shown, typing, booked]);

  return (
    <figure className="mx-auto w-full max-w-[320px]" aria-label="Example: a missed caller gets a text back and books a job">
      <div className="rounded-[36px] border border-edge bg-surface p-3 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)]">
        <div className="mx-auto mb-2 h-1.5 w-16 rounded-full bg-raised" aria-hidden="true" />
        <div className="pb-2 text-center text-xs text-muted">
          <b className="block text-sm font-semibold text-fg">Mike&rsquo;s Plumbing</b>
          Text message, just now
        </div>
        <div
          ref={listRef}
          className="flex h-[380px] flex-col gap-2 overflow-hidden rounded-3xl bg-ground px-3 py-3 text-[13px] leading-snug"
          aria-live="polite"
        >
          <div className="flex-1" />
          {SCRIPT.slice(0, shown).map((l, i) => (
            <p
              key={i}
              className={`max-w-[85%] animate-pop rounded-2xl border px-3 py-2 ${l.from === "caller" ? "self-end rounded-br-md border-bk-edge bg-bk-bg text-fg" : "self-start rounded-bl-md border-line bg-raised"}`}
            >
              <span className="sr-only">{l.from === "caller" ? "Caller: " : "Assistant: "}</span>
              {l.text}
            </p>
          ))}
          {typing && (
            <span className="flex gap-1 self-start rounded-2xl rounded-bl-md border border-line bg-raised px-3 py-3" aria-label="Assistant is typing">
              {[0, 150, 300].map((d) => (
                <i key={d} className="size-1.5 animate-blink rounded-full bg-fg-2" style={{ animationDelay: `${d}ms` }} />
              ))}
            </span>
          )}
          {booked && (
            <div className="animate-pop rounded-2xl border border-accent/40 bg-nw-bg px-3 py-2.5">
              <p className="flex items-center gap-2 text-sm font-semibold text-nw">
                <CalendarCheck size={16} aria-hidden="true" /> New job booked
              </p>
              <p className="mt-0.5 text-xs text-fg-2">Dana Whitfield, water heater leak. Thursday 8–10 AM, 412 Alder St.</p>
            </div>
          )}
        </div>
      </div>
      <figcaption className="mt-4 flex items-center justify-center gap-3 text-sm text-muted">
        Example conversation
        <button type="button" className="btn min-h-11 px-3" onClick={() => play(1)}>
          <RotateCcw size={16} aria-hidden="true" /> Replay
        </button>
      </figcaption>
    </figure>
  );
}
