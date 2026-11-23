import Link from "next/link";
import { Ban, Check, ChevronDown } from "lucide-react";
import { Logo } from "@/components/ui";
import { PhoneDemo } from "@/components/landing/PhoneDemo";
import { Calculator } from "@/components/landing/Calculator";
import { EmailSignup, WaitlistButton } from "@/components/landing/Interactive";

const wrap = "mx-auto w-full max-w-6xl px-4 sm:px-6";

const PROBLEMS = [
  {
    title: "You can't pick up from under a sink",
    body: "When your hands are full the phone rings out. The caller doesn't know you're busy. They only know nobody answered.",
  },
  {
    title: "Most callers won't leave a voicemail",
    body: "Someone with water on the floor isn't going to wait. They hang up and call the next shop on the list.",
  },
  {
    title: "Calling back after the job is often too late",
    body: "By the time you're back in the truck, the caller may have booked someone else, and you don't know what the job was.",
  },
];

const STEPS = [
  { title: "A call goes unanswered", body: "Your phone forwards calls you don't pick up to Ringback. You keep your number." },
  {
    title: "The caller gets a text within seconds",
    body: "The assistant says who it is, asks what's wrong, where the job is and how urgent it is.",
  },
  {
    title: "You get a booked job or a ready-to-call lead",
    body: "It books into slots you've opened, or hands you the details so you can call back knowing what the job is.",
  },
];

const DOES = [
  "Texts back every missed call within seconds",
  "Asks for the problem, the address and how urgent it is",
  "Books into the calendar slots you choose to open",
  "Rings your mobile for emergencies like burst pipes",
  "Tells the caller your call-out fee, if you allow it",
];
const NEVER = [
  "Quotes a price for the work beyond your call-out fee",
  "Promises an arrival time",
  "Diagnoses the problem over text",
  "Handles a gas smell: it tells the caller to leave and call 911 or the gas company",
  "Texts anyone who didn't call you",
];

const PLANS = [
  {
    name: "Starter",
    price: 99,
    status: "Available now",
    features: ["One business number", "Text-back and the booking assistant", "Calendar slots you control", "Emergency ring-through", "Weekly report"],
  },
  {
    name: "Pro",
    price: 199,
    status: "Waitlist",
    features: ["Everything in Starter", "Up to 3 phone numbers", "Shared inbox for your office", "Calendar sync"],
  },
  {
    name: "Growth",
    price: 349,
    status: "Waitlist",
    features: ["Everything in Pro", "Up to 5 trucks with their own schedules", "Job routing by area", "Priority support"],
  },
];

const FAQ = [
  {
    q: "Do I need a new phone number?",
    a: "No. You keep your number and turn on call forwarding for calls you don't answer. Setup takes about [SETUP TIME].",
  },
  {
    q: "What does the assistant actually say?",
    a: "It opens with: “Hi, this is the automated assistant for [your shop]. Sorry we missed your call. What can we help with?” It's clear that it's automated, and you can read every message in the app.",
  },
  {
    q: "Will it quote prices?",
    a: "Only your call-out fee, and only if you switch that on. It never prices the work itself.",
  },
  {
    q: "What happens with emergencies?",
    a: "For burst pipes, flooding or sewage it rings your mobile so you can call straight back. For a gas smell it tells the caller to leave the house and call 911 or the gas company.",
  },
  {
    q: "Can I step in and reply myself?",
    a: "Yes. Press “Take over” on any conversation and the assistant pauses on that thread. Hand it back when you're done.",
  },
  {
    q: "What about calls after hours?",
    a: "The assistant sends your after-hours message, takes the details and leaves them for you in the morning. You choose the wording.",
  },
  { q: "Can I cancel?", a: "[CANCELLATION TERMS]" },
];

export default function Landing() {
  return (
    <>
      <a href="#top" className="sr-only z-50 rounded bg-accent px-3 py-2 text-on-accent focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-line/70 bg-ground/90 backdrop-blur">
        <nav aria-label="Main" className={`${wrap} flex h-16 items-center gap-6`}>
          <Link href="/" className="mr-auto flex items-center gap-2.5 font-display text-lg font-bold">
            <Logo /> Ringback
          </Link>
          <div className="hidden items-center gap-6 text-sm text-fg-2 md:flex">
            <a href="#how" className="hover:text-fg">How it works</a>
            <a href="#calculator" className="hover:text-fg">Calculator</a>
            <a href="#pricing" className="hover:text-fg">Pricing</a>
            <a href="#faq" className="hover:text-fg">FAQ</a>
          </div>
          <Link href="/app/leads" className="btn btn-primary">
            Start free trial
          </Link>
        </nav>
      </header>

      <main id="top">
        {/* Hero */}
        <section className={`${wrap} grid items-center gap-12 pt-14 pb-20 md:grid-cols-[1.15fr_1fr] md:pt-20 md:pb-28`}>
          <div>
            <h1 className="text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.03em] sm:text-6xl lg:text-7xl">
              Every missed call gets a text back in seconds.
            </h1>
            <p className="mt-6 max-w-md text-lg text-fg-2">For plumbing and HVAC shops with 1 to 5 trucks.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/app/leads" className="btn btn-primary min-h-12 px-6 text-base">
                Start free trial
              </Link>
              <a href="#how" className="btn min-h-12 px-6 text-base">
                See how it works
              </a>
            </div>
            <p className="mt-5 text-sm text-muted">
              Try it yourself: call [YOUR DEMO NUMBER], let it ring out, and watch your phone.
            </p>
          </div>
          <PhoneDemo />
        </section>

        {/* Problem */}
        <section aria-labelledby="problem" className="border-t border-line bg-sidebar/60 py-20">
          <div className={wrap}>
            <h2 id="problem" className="max-w-2xl text-3xl font-semibold sm:text-4xl">
              A missed call is usually a job going to someone else.
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {PROBLEMS.map((p) => (
                <article key={p.title} className="card p-6">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-fg-2">{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" aria-labelledby="how-h" className="scroll-mt-20 py-20">
          <div className={wrap}>
            <h2 id="how-h" className="text-3xl font-semibold sm:text-4xl">
              How it works
            </h2>
            <ol className="mt-10 grid gap-8 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="grid content-start gap-3 border-t border-edge pt-5">
                  <span className="font-display text-sm font-semibold text-accent tabular-nums">Step {i + 1}</span>
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <p className="text-fg-2">{s.body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-14 grid gap-4 md:grid-cols-2">
              <div className="card p-6">
                <h3 className="text-lg font-semibold">What it does</h3>
                <ul className="mt-4 grid gap-3">
                  {DOES.map((d) => (
                    <li key={d} className="flex gap-3 text-fg-2">
                      <Check size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-6">
                <h3 className="text-lg font-semibold">What it never does</h3>
                <ul className="mt-4 grid gap-3">
                  {NEVER.map((d) => (
                    <li key={d} className="flex gap-3 text-fg-2">
                      <Ban size={18} className="mt-0.5 shrink-0 text-em" aria-hidden="true" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section id="calculator" aria-labelledby="calc-h" className="scroll-mt-20 border-y border-line bg-sidebar/60 py-20">
          <div className={wrap}>
            <h2 id="calc-h" className="text-3xl font-semibold sm:text-4xl">
              Estimate what your missed calls are worth
            </h2>
            <p className="mt-3 max-w-2xl text-fg-2">Move the sliders to match your shop.</p>
            <div className="mt-10">
              <Calculator />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" aria-labelledby="pricing-h" className="scroll-mt-20 py-20">
          <div className={wrap}>
            <h2 id="pricing-h" className="text-3xl font-semibold sm:text-4xl">
              Pricing
            </h2>
            <p className="mt-6 rounded-2xl border border-accent/40 bg-nw-bg px-5 py-4 text-nw">
              <b className="font-semibold">$79 a month for the first ten shops, locked for 12 months.</b>
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {PLANS.map((p) => {
                const live = p.status === "Available now";
                return (
                  <article key={p.name} className={`card flex flex-col p-6 ${live ? "border-accent/60" : ""}`}>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold">{p.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${live ? "bg-nw-bg text-nw" : "bg-vm-bg text-vm"}`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p className="mt-4">
                      <span className="font-display text-4xl font-semibold tabular-nums">${p.price}</span>
                      <span className="text-muted"> a month</span>
                    </p>
                    <ul className="mt-5 mb-6 grid gap-2.5 text-sm text-fg-2">
                      {p.features.map((f) => (
                        <li key={f} className="flex gap-2">
                          <Check size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto">
                      {live ? (
                        <Link href="/app/leads" className="btn btn-primary w-full">
                          Start free trial
                        </Link>
                      ) : (
                        <WaitlistButton plan={p.name} />
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-muted">Free trial: [TRIAL LENGTH]. Prices in US dollars.</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-h" className="scroll-mt-20 border-t border-line py-20">
          <div className={`${wrap} max-w-3xl`}>
            <h2 id="faq-h" className="text-3xl font-semibold sm:text-4xl">
              Questions
            </h2>
            <div className="mt-8 divide-y divide-line border-y border-line">
              {FAQ.map((f) => (
                <details key={f.q} className="group">
                  <summary className="flex min-h-14 list-none items-center justify-between gap-4 py-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown size={20} className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="pb-5 text-fg-2">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section aria-labelledby="cta-h" className="border-t border-line bg-sidebar/60 py-20">
          <div className={`${wrap} grid justify-items-center gap-6 text-center`}>
            <h2 id="cta-h" className="max-w-2xl text-3xl font-semibold sm:text-5xl">
              Stop losing jobs to the phone you couldn&rsquo;t answer.
            </h2>
            <p className="text-fg-2">Leave your email and we&rsquo;ll set up your trial.</p>
            <EmailSignup />
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-10">
        <div className={`${wrap} flex flex-wrap items-center justify-between gap-4 text-sm text-muted`}>
          <span className="flex items-center gap-2 font-display font-bold text-fg">
            <Logo size={22} /> Ringback
          </span>
          <span>© 2026 [YOUR COMPANY NAME]. Contact: [YOUR EMAIL]</span>
          <span className="flex gap-4">
            <a href="#pricing" className="hover:text-fg">Pricing</a>
            <a href="#faq" className="hover:text-fg">FAQ</a>
            <Link href="/app/leads" className="hover:text-fg">Open the demo</Link>
          </span>
        </div>
      </footer>
    </>
  );
}
