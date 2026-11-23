"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { weekNumbers } from "@/lib/selectors";
import { DAYS, money } from "@/lib/dates";
import { lastWeek } from "@/lib/mock/lastWeek";
import { PageHeader, Segmented } from "@/components/ui";

type Week = "this" | "last";
type Series = "calls" | "leads";
const TODAY = 2;

export function ReportView() {
  const leads = useStore((s) => s.leads);
  const calls = useStore((s) => s.calls);
  const [week, setWeek] = useState<Week>("this");
  const [series, setSeries] = useState<Series>("calls");
  const live = useMemo(() => weekNumbers({ leads, calls }), [leads, calls]);
  const w = week === "this" ? live : lastWeek;

  const funnel = [
    { label: "Missed calls", value: w.missed },
    { label: "Texted back", value: w.textedBack },
    { label: "Caller replied", value: w.replied },
    { label: "Lead captured", value: w.leads },
    { label: "Job booked", value: w.booked },
    { label: "Marked won", value: w.won },
  ];
  const days = series === "calls" ? w.callsByDay : w.leadsByDay;
  const max = Math.max(1, ...days);
  const total = w.wonJobs.reduce((s, j) => s + j.value, 0);

  return (
    <div>
      <PageHeader title="Weekly report">
        <div className="ml-auto">
          <Segmented
            label="Week"
            value={week}
            onChange={setWeek}
            options={[
              { value: "this", label: "This week" },
              { value: "last", label: "Last week" },
            ]}
          />
        </div>
      </PageHeader>

      <div className="grid gap-4 p-4 md:p-6 xl:grid-cols-[1.15fr_1fr]">
        <section className="card grid content-start gap-5 p-5 md:p-6" aria-labelledby="recovered">
          <div>
            <p id="recovered" className="font-display text-5xl font-semibold tabular-nums md:text-6xl">
              {money(w.revenue)}
            </p>
            <p className="mt-2 text-fg-2">recovered from calls you missed</p>
            {week === "this" && (
              <p className="mt-1 text-xs text-muted">Counts jobs marked won. Mark a job won from its lead.</p>
            )}
          </div>
          <dl className="grid grid-cols-3 gap-4">
            {[
              ["Missed calls", w.missed],
              ["Leads captured", w.leads],
              ["Jobs booked", w.booked],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="font-display text-2xl font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-3">
            <h2 className="text-base font-semibold">From missed call to won job</h2>
            <ol className="grid gap-2.5">
              {funnel.map((f, i) => {
                const prev = funnel[i - 1]?.value;
                const rate = i > 0 && prev > 0 && f.value <= prev ? Math.round((f.value / prev) * 100) : null;
                return (
                  <li key={f.label} className="grid grid-cols-[112px_1fr_72px] items-center gap-3 text-sm">
                    <span className="text-fg-2">{f.label}</span>
                    <span className="h-5 overflow-hidden rounded bg-raised" aria-hidden="true">
                      <span
                        className="block h-full rounded-r bg-accent transition-[width] duration-300"
                        style={{ width: `${w.missed ? (f.value / w.missed) * 100 : 0}%` }}
                      />
                    </span>
                    <span className="text-right tabular-nums">
                      <b className="font-display font-semibold">{f.value}</b>
                      {rate != null && <span className="ml-1.5 text-xs text-muted">{rate}%</span>}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="text-xs text-muted">Percentages compare each step with the one before it.</p>
          </div>
        </section>

        <div className="grid content-start gap-4">
          <section className="card grid gap-4 p-5" aria-labelledby="by-day">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="by-day" className="text-base font-semibold">
                {series === "calls" ? "Missed calls" : "Leads captured"} by day
              </h2>
              <Segmented
                label="Chart shows"
                value={series}
                onChange={setSeries}
                options={[
                  { value: "calls", label: "Calls" },
                  { value: "leads", label: "Leads" },
                ]}
              />
            </div>
            <ul className="grid h-44 grid-cols-5 items-end gap-3 border-b border-edge px-1">
              {days.map((v, i) => {
                const upcoming = week === "this" && i > TODAY;
                return (
                  <li
                    key={DAYS[i]}
                    className="flex h-full flex-col items-center justify-end gap-1"
                    aria-label={`${DAYS[i]}: ${upcoming ? "upcoming" : v}`}
                  >
                    {upcoming ? (
                      <span className="mb-2 rounded-md border border-dashed border-edge px-1.5 py-0.5 text-[11px] text-muted">
                        Upcoming
                      </span>
                    ) : (
                      <>
                        <span className="font-display text-sm font-semibold tabular-nums">{v}</span>
                        <span
                          className="w-3/5 max-w-10 rounded-t bg-accent transition-[height] duration-300"
                          style={{ height: `${(v / max) * 120}px` }}
                        />
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="grid grid-cols-5 gap-3 px-1 text-center text-xs text-muted" aria-hidden="true">
              {DAYS.map((d) => (
                <span key={d}>{d.slice(0, 3)}</span>
              ))}
            </div>
          </section>

          <section className="card grid gap-3 p-5" aria-labelledby="won">
            <h2 id="won" className="text-base font-semibold">
              Jobs marked won
            </h2>
            {w.wonJobs.length ? (
              <ul className="grid gap-2 text-sm">
                {w.wonJobs.map((j) => (
                  <li key={j.id} className="flex justify-between gap-3">
                    <span className="text-fg-2">{j.label}</span>
                    <span className="font-display tabular-nums">{money(j.value)}</span>
                  </li>
                ))}
                <li className="flex justify-between gap-3 border-t border-line pt-2 font-semibold">
                  <span>Total</span>
                  <span className="font-display tabular-nums">{money(total)}</span>
                </li>
              </ul>
            ) : (
              <p className="text-sm text-muted">No jobs marked won yet. Open a lead and choose &ldquo;Mark job won&rdquo;.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
