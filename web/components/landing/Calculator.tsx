"use client";

import { useState } from "react";
import { money } from "@/lib/dates";
import { estimate, FEE, WEEKS_PER_MONTH } from "@/lib/estimate";

export function Calculator() {
  const [calls, setCalls] = useState(8);
  const [value, setValue] = useState(350);
  const [share, setShare] = useState(20);
  const { jobs, revenue, net } = estimate(calls, value, share);

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-10">
      <div className="grid gap-6">
        <Slider id="calc-calls" label="Missed calls per week" value={calls} min={1} max={40} step={1} onChange={setCalls} display={String(calls)} />
        <Slider id="calc-value" label="Average job value" value={value} min={100} max={2000} step={50} onChange={setValue} display={money(value)} />
        <Slider
          id="calc-share"
          label="Share of missed callers you win back"
          value={share}
          min={5}
          max={50}
          step={1}
          onChange={setShare}
          display={`${share}%`}
        />
      </div>
      <div className="card grid content-start gap-5 p-6" aria-live="polite">
        <Result label="Jobs won back per month" value={jobs.toFixed(1)} />
        <Result label="Revenue recovered per month" value={money(revenue)} />
        <Result label={`After the $${FEE} monthly fee`} value={money(net)} strong />
        <p className="border-t border-line pt-4 text-sm text-muted">
          This is arithmetic on the numbers you entered: {calls} calls × {WEEKS_PER_MONTH} weeks × {share}% × {money(value)}. It
          is not a promise of results.
        </p>
      </div>
    </div>
  );
}

function Slider(props: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={props.id} className="text-fg-2">
          {props.label}
        </label>
        <output htmlFor={props.id} className="font-display text-xl font-semibold tabular-nums">
          {props.display}
        </output>
      </div>
      <input
        id={props.id}
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        aria-valuetext={props.display}
        onChange={(e) => props.onChange(Number(e.target.value))}
        className="h-11 w-full cursor-pointer accent-accent"
      />
      <div className="flex justify-between text-xs text-muted" aria-hidden="true">
        <span>{props.id === "calc-value" ? money(props.min) : props.id === "calc-share" ? `${props.min}%` : props.min}</span>
        <span>{props.id === "calc-value" ? money(props.max) : props.id === "calc-share" ? `${props.max}%` : props.max}</span>
      </div>
    </div>
  );
}

function Result({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <p className="text-sm text-muted">{label}</p>
      <p className={`font-display font-semibold tabular-nums ${strong ? "text-4xl text-accent" : "text-2xl"}`}>{value}</p>
    </div>
  );
}
