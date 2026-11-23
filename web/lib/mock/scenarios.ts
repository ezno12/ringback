import type { Lead } from "../types.ts";

/**
 * Scripted simulated calls. Tokens filled at play time:
 * {opener} {feeLine} {offer} {confirm} {tech}.
 * `when` keeps a step only if the condition holds when the call starts.
 * `reveal` updates the lead as the caller gives details.
 */
export interface Step {
  from: "caller" | "assistant" | "system";
  text: string;
  when?: "canBook" | "cannotBook" | "ringOwner";
  reveal?: Partial<Lead>;
  book?: boolean;
}

export interface Scenario {
  phone: string;
  kind: "book" | "emergency";
  pick: 0 | 1;
  lead: Pick<Lead, "problem" | "urgency">;
  steps: Step[];
}

export const scenarios: Scenario[] = [
  {
    phone: "(555) 010-0106",
    kind: "book",
    pick: 0,
    lead: { problem: "Toilet keeps running", urgency: "Routine" },
    steps: [
      { from: "assistant", text: "{opener}" },
      { from: "caller", text: "Hi, our upstairs toilet keeps running nonstop. Jiggling the handle doesn't help." },
      { from: "assistant", text: "Thanks for the details. What's your name and the address?" },
      { from: "caller", text: "Kara Lindqvist, 23 Elm Ct", reveal: { name: "Kara Lindqvist", address: "23 Elm Ct" } },
      { from: "assistant", text: "Thanks, Kara. {feeLine} I can book {offer}", when: "canBook" },
      { from: "caller", text: "The first one please", when: "canBook" },
      { from: "assistant", text: "{confirm}", when: "canBook", book: true },
      { from: "assistant", text: "Thanks, Kara. {feeLine} Mike will call you back to set a time.", when: "cannotBook" },
    ],
  },
  {
    phone: "(555) 010-0107",
    kind: "emergency",
    pick: 0,
    lead: { problem: "Sewage backing up from the basement floor drain", urgency: "Emergency" },
    steps: [
      { from: "assistant", text: "{opener}" },
      { from: "caller", text: "Sewage is coming up out of the floor drain in our basement and it's getting worse" },
      {
        from: "assistant",
        text: "That's an emergency. Please stop using water in the house for now: no flushing, no taps, no washing machine. What's your name and the address?",
      },
      {
        from: "caller",
        text: "Marcus Hale, 301 Ridge Rd",
        reveal: { name: "Marcus Hale", address: "301 Ridge Rd" },
      },
      { from: "system", text: "Ringback rang Mike's mobile. Call connected.", when: "ringOwner", reveal: { ownerCalled: true } },
      { from: "assistant", text: "Thanks, Marcus. I've alerted Mike and he'll call you back as soon as he can." },
    ],
  },
  {
    phone: "(555) 010-0108",
    kind: "emergency",
    pick: 0,
    lead: { problem: "Smell of gas near the water heater", urgency: "Emergency: gas smell" },
    steps: [
      { from: "assistant", text: "{opener}" },
      { from: "caller", text: "Water heater isn't heating and I think I smell gas near it" },
      {
        from: "assistant",
        text: "If you smell gas, leave the house now and don't switch anything on or off. Once you're outside, call 911 or your gas company. Don't go back in until they say it's safe.",
      },
      { from: "caller", text: "Ok we're outside. The gas company is on the way" },
      {
        from: "assistant",
        text: "Good. Once they've cleared it, the {tech} can look at the water heater. What's your name and the address?",
      },
      { from: "caller", text: "Ana Ruiz, 56 Mill St", reveal: { name: "Ana Ruiz", address: "56 Mill St" } },
      { from: "system", text: "Ringback rang Mike's mobile. Call connected.", when: "ringOwner", reveal: { ownerCalled: true } },
      { from: "assistant", text: "Thanks, Ana. Mike has your details and will call you." },
    ],
  },
  {
    phone: "(555) 010-0109",
    kind: "book",
    pick: 1,
    lead: { problem: "Install a new garbage disposal", urgency: "Routine" },
    steps: [
      { from: "assistant", text: "{opener}" },
      { from: "caller", text: "How much do you charge to install a garbage disposal?" },
      {
        from: "assistant",
        text: "{feeLine} The exact price depends on your sink and the unit, so the {tech} confirms it on site. Would you like to book a visit?",
      },
      { from: "caller", text: "Sure. Ben Okafor, 9 Harbor View", reveal: { name: "Ben Okafor", address: "9 Harbor View" } },
      { from: "assistant", text: "Thanks, Ben. I can book {offer}", when: "canBook" },
      { from: "caller", text: "The second one works", when: "canBook" },
      { from: "assistant", text: "{confirm}", when: "canBook", book: true },
      { from: "assistant", text: "Thanks, Ben. Mike will call you back to set a time.", when: "cannotBook" },
    ],
  },
];
