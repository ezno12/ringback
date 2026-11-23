import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const grotesk = Space_Grotesk({ variable: "--font-grotesk", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Ringback: every missed call gets a text back", template: "%s · Ringback" },
  description: "Missed-call text-back for plumbing and HVAC shops with 1 to 5 trucks.",
};

export const viewport: Viewport = { themeColor: "#0B0D10", viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
