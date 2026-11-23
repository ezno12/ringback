import type { Settings } from "../types.ts";

export const initialSettings: Settings = {
  shop: {
    name: "Mike's Plumbing",
    trade: "Plumbing",
    calloutFee: 89,
    zips: "97201, 97202, 97205, 97214",
    phone: "(555) 010-0100",
    ownerMobile: "(555) 010-0199",
    weekdayOpen: "07:30",
    weekdayClose: "17:00",
    saturday: false,
  },
  permissions: { textBack: true, book: true, statFee: true, ringOwner: true, nudge: false },
  quickReplies: [
    {
      id: "qr-call",
      label: "Calling you shortly",
      text: "Hi [name], this is Mike from Mike's Plumbing. I'll call you in the next few minutes.",
    },
    { id: "qr-slot", label: "Offer a slot", text: "Hi [name], this is Mike. I can come [slot]. Does that work?" },
    {
      id: "qr-photo",
      label: "Ask for a photo",
      text: "Hi [name], could you text me a photo of the problem? It helps me bring the right parts.",
    },
  ],
  autoReplies: {
    afterHours: {
      on: true,
      text: "Thanks for texting [shop]. We're closed right now. Tell us what's going on and we'll get back to you first thing. If water is pouring in, shut off your main valve.",
    },
    outsideArea: {
      on: true,
      text: "Thanks for reaching [shop]. Sorry, that address is outside the area we serve, so we can't send someone out.",
    },
    bookingConfirmed: {
      on: true,
      text: "You're booked for [slot] at [address]. We'll text you if anything changes.",
    },
  },
};

export const opener = (shop: string) =>
  `Hi, this is the automated assistant for ${shop}. Sorry we missed your call. What can we help with?`;
