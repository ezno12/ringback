"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleCheck } from "lucide-react";

export function WaitlistButton({ plan }: { plan: string }) {
  const [joined, setJoined] = useState(false);
  return joined ? (
    <p className="flex min-h-11 items-center justify-center gap-2 text-sm text-nw" role="status">
      <CircleCheck size={16} aria-hidden="true" /> You&rsquo;re on the {plan} waitlist
    </p>
  ) : (
    <button type="button" className="btn w-full" onClick={() => setJoined(true)}>
      Join the waitlist
    </button>
  );
}

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");

  if (sent) {
    return (
      <div role="status" className="grid justify-items-center gap-3 text-center">
        <p className="flex items-center gap-2 text-lg text-nw">
          <CircleCheck size={20} aria-hidden="true" /> Thanks. We&rsquo;ll email {sent} with your setup steps.
        </p>
        <Link href="/app/leads" className="btn btn-primary">
          Open the demo while you wait
        </Link>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="mx-auto grid w-full max-w-lg gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          setError("Enter an email address like mike@example.com.");
          return;
        }
        setError("");
        setSent(email.trim());
      }}
    >
      <label htmlFor="cta-email" className="text-left text-sm text-fg-2">
        Work email
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="cta-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "cta-email-err" : undefined}
          placeholder="you@yourshop.com"
          className="field flex-1"
        />
        <button type="submit" className="btn btn-primary">
          Start free trial
        </button>
      </div>
      {error && (
        <p id="cta-email-err" role="alert" className="text-left text-sm text-em">
          {error}
        </p>
      )}
    </form>
  );
}
