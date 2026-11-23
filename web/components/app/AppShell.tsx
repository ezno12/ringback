"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { use, type ReactNode } from "react";
import { browser } from "react-dom";
import { CalendarDays, ChartColumn, Inbox, Settings } from "lucide-react";
import { useStore } from "@/lib/store";
import { attentionCount } from "@/lib/selectors";
import { Logo, Toast } from "@/components/ui";

const NAV = [
  { href: "/app/leads", label: "Leads", Icon: Inbox },
  { href: "/app/calendar", label: "Calendar", Icon: CalendarDays },
  { href: "/app/report", label: "Report", Icon: ChartColumn },
  { href: "/app/settings", label: "Settings", Icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  // Demo state lives in localStorage, so the app renders in the browser only.
  use(browser("Ringback demo data is stored in this browser."));
  const path = usePathname();
  const badge = useStore((s) => attentionCount(s.leads));
  const forwarding = useStore((s) => s.permissions.textBack);
  const shopPhone = useStore((s) => s.shop.phone);
  const notice = useStore((s) => s.notice);
  const clearNotice = useStore((s) => s.clearNotice);

  const badgeLabel = badge ? `, ${badge} need${badge === 1 ? "s" : ""} attention` : "";

  return (
    <div className="flex min-h-dvh">
      <a href="#main" className="sr-only z-50 rounded bg-accent px-3 py-2 text-on-accent focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Skip to content
      </a>

      {/* Sidebar: icons with labels below at md, full at lg */}
      <nav
        aria-label="App"
        className="sticky top-0 hidden h-dvh w-24 shrink-0 flex-col gap-1 border-r border-line bg-sidebar px-2 py-4 md:flex lg:w-60 lg:px-3"
      >
        <Link href="/" className="mb-4 flex items-center justify-center gap-2.5 rounded-lg px-2 py-1 lg:justify-start">
          <Logo />
          <span className="hidden font-display text-lg font-bold lg:inline">Ringback</span>
          <span className="sr-only lg:hidden">Ringback home</span>
        </Link>
        {NAV.map(({ href, label, Icon }) => {
          const on = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={on ? "page" : undefined}
              aria-label={label === "Leads" ? `${label}${badgeLabel}` : undefined}
              className={`relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] transition-colors duration-150 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-sm ${on ? "bg-raised text-fg shadow-[inset_2px_0_0_var(--color-accent)]" : "text-fg-2 hover:bg-raised/60 hover:text-fg"}`}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
              {label === "Leads" && badge > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1 right-3 rounded-full bg-accent px-1.5 text-[11px] font-bold text-on-accent lg:static lg:ml-auto"
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
        <div className="mt-auto hidden rounded-xl border border-line bg-surface p-3 lg:block">
          <p className="flex items-center gap-2 text-sm font-medium">
            <span className={`size-2 rounded-full ${forwarding ? "bg-accent" : "bg-em"}`} aria-hidden="true" />
            {forwarding ? "Forwarding is on" : "Text-back is off"}
          </p>
          <p className="mt-1 text-xs text-muted">
            {forwarding
              ? `Missed calls to ${shopPhone} get a text back.`
              : "Missed calls are logged but callers get no text. Turn it on in Settings."}
          </p>
        </div>
        <span
          className={`mx-auto mt-auto size-2.5 rounded-full lg:hidden ${forwarding ? "bg-accent" : "bg-em"}`}
          title={forwarding ? "Forwarding is on" : "Text-back is off"}
        >
          <span className="sr-only">{forwarding ? "Forwarding is on" : "Text-back is off"}</span>
        </span>
      </nav>

      <main id="main" className="min-w-0 flex-1 pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </main>

      {/* Bottom tab bar under 768px */}
      <nav
        aria-label="App"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-sidebar pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {NAV.map(({ href, label, Icon }) => {
          const on = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={on ? "page" : undefined}
              aria-label={label === "Leads" ? `${label}${badgeLabel}` : undefined}
              className={`relative flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] ${on ? "text-accent" : "text-muted"}`}
            >
              <Icon size={20} aria-hidden="true" />
              {label}
              {label === "Leads" && badge > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-2 left-[calc(50%+6px)] rounded-full bg-accent px-1.5 text-[10px] font-bold text-on-accent"
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <Toast message={notice} onClose={clearNotice} />
    </div>
  );
}

export function AppSkeleton() {
  return (
    <div className="flex min-h-dvh" aria-busy="true">
      <div className="hidden w-24 border-r border-line bg-sidebar md:block lg:w-60" />
      <div className="flex-1 p-6">
        <p className="text-sm text-muted">Loading the demo…</p>
      </div>
    </div>
  );
}
