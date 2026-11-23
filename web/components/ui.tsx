"use client";

import { TriangleAlert, X } from "lucide-react";
import { useEffect, useId, type ReactNode } from "react";
import type { LeadStatus } from "@/lib/types";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--color-accent)" />
      <path
        d="M11.5 8.5c-1 0-2.5 1.2-2.5 2.6 0 6 5.9 11.9 11.9 11.9 1.4 0 2.6-1.5 2.6-2.5 0-.6-.3-1-.8-1.3l-2.6-1.4c-.6-.3-1.3-.2-1.7.3l-.9 1c-1.9-.9-3.7-2.7-4.6-4.6l1-.9c.5-.4.6-1.1.3-1.7l-1.4-2.6c-.3-.5-.7-.8-1.3-.8z"
        fill="var(--color-on-accent)"
      />
      <path
        d="M19 8.5a4.5 4.5 0 0 1 4.5 4.5M19 11.5a1.5 1.5 0 0 1 1.5 1.5"
        stroke="var(--color-on-accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

const pill: Record<LeadStatus, [string, string]> = {
  new: ["New", "text-nw bg-nw-bg"],
  booked: ["Booked", "text-bk bg-bk-bg"],
  emergency: ["Emergency", "text-em bg-em-bg"],
  voicemail: ["Voicemail", "text-vm bg-vm-bg"],
};

export function StatusPill({ status }: { status: LeadStatus }) {
  const [label, cls] = pill[status];
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {status === "emergency" && <TriangleAlert size={12} aria-hidden="true" />}
      {label}
    </span>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="flex min-h-11 items-center justify-between gap-4 py-2">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm text-fg">
          {label}
        </label>
        {hint && <p className="text-xs text-muted">{hint}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative flex h-11 w-14 shrink-0 items-center justify-center"
      >
        <span
          className={`relative h-6 w-11 rounded-full border transition-colors duration-150 ${checked ? "border-accent bg-accent" : "border-edge bg-raised"}`}
        >
          <span
            className={`absolute top-1/2 left-0 size-4 -translate-y-1/2 rounded-full transition-transform duration-150 ${checked ? "translate-x-[22px] bg-on-accent" : "translate-x-[3px] bg-muted"}`}
          />
        </span>
      </button>
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-xl border border-edge p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`min-h-10 rounded-[9px] px-3 text-sm font-medium transition-colors duration-150 ${value === o.value ? "bg-raised text-fg" : "text-muted hover:text-fg"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Polite status toast; auto-dismisses after 4s. */
export function Toast({ message, onClose }: { message: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [message, onClose]);
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-6"
    >
      {message && (
        <div className="pointer-events-auto flex animate-pop items-center gap-3 rounded-xl border border-edge bg-raised py-2 pr-2 pl-4 text-sm shadow-lg shadow-black/40">
          {message}
          <button type="button" onClick={onClose} className="btn btn-ghost min-h-9 px-2" aria-label="Dismiss">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

export function DemoLabel() {
  return (
    <span className="rounded-md border border-dashed border-edge px-1.5 py-px text-[11px] text-muted">Demo data</span>
  );
}

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">{title}</h1>
        <DemoLabel />
      </div>
      {children}
    </header>
  );
}
