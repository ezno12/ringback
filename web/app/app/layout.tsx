import { Suspense, type ReactNode } from "react";
import { AppShell, AppSkeleton } from "@/components/app/AppShell";

// The app renders in the browser only (demo state is in localStorage), so there is no
// server-rendered UI for instant-navigation validation to check.
export const instant = false;

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AppSkeleton />}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
