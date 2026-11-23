"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Call, Lead, Message, Settings, Slot } from "./types.ts";
import { initialSettings, opener } from "./mock/settings.ts";
import { initialCalls, initialLeads, initialSlots } from "./mock/week.ts";
import { scenarios, type Step } from "./mock/scenarios.ts";
import { DEMO_NOW, isPast, slotLabel } from "./dates.ts";
import { fillTemplate, openSlots } from "./selectors.ts";

interface Playing {
  leadId: string;
  scenario: number;
  steps: Step[];
  step: number;
  offer: string[]; // slot ids offered to the caller
}

interface State extends Settings {
  leads: Lead[];
  calls: Call[];
  slots: Slot[];
  scenarioIndex: number;
  clock: number; // demo minutes, advances one minute per simulated call
  playing: Playing | null;
  typingLeadId: string | null;
  notice: string | null;

  markRead: (id: string) => void;
  takeOver: (id: string) => void;
  handBack: (id: string) => void;
  sendOwnerMessage: (id: string, text: string) => void;
  markWon: (id: string, value: number) => void;
  toggleSlot: (id: string) => void;
  simulateCall: () => string | null;
  saveSettings: (s: Settings) => void;
  resetDemo: () => void;
  clearNotice: () => void;
}

const fresh = () => ({
  ...structuredClone(initialSettings),
  leads: structuredClone(initialLeads),
  calls: structuredClone(initialCalls),
  slots: structuredClone(initialSlots),
  scenarioIndex: 0,
  clock: DEMO_NOW,
  playing: null as Playing | null,
  typingLeadId: null as string | null,
  notice: null as string | null,
});

let seq = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${(seq++).toString(36)}`;

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let timer: ReturnType<typeof setTimeout> | undefined;
let resumeSchedule: ((p: Playing) => void) | undefined;

export const useStore = create<State>()(
  persist(
    (set, get) => {
      const patchLead = (id: string, fn: (l: Lead) => Partial<Lead>) =>
        set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, ...fn(l) } : l)) }));

      const pushMessage = (id: string, msg: Omit<Message, "id" | "at">) =>
        patchLead(id, (l) => ({ messages: [...l.messages, { ...msg, id: uid("m"), at: get().clock }] }));

      function fill(text: string, lead: Lead, p: Playing) {
        const s = get();
        const [a, b] = p.offer.map((id) => s.slots.find((x) => x.id === id)!);
        const pick = p.offer[Math.min(scenarios[p.scenario].pick, p.offer.length - 1)];
        const picked = s.slots.find((x) => x.id === pick);
        const offer = b
          ? `${slotLabel(a.day, a.idx)} or ${slotLabel(b.day, b.idx)}. Which works?`
          : a
            ? `${slotLabel(a.day, a.idx)}. Does that work?`
            : "";
        const fee = s.permissions.statFee
          ? `The call-out fee is $${s.shop.calloutFee}, and the ${tech()} prices the work once they've seen it.`
          : `The ${tech()} will talk through pricing with you.`;
        const confirm = picked
          ? fillTemplate(s.autoReplies.bookingConfirmed.text, { ...lead, slotId: picked.id }, s.slots, s.shop.name)
          : "";
        return text
          .replace("{opener}", opener(s.shop.name))
          .replace("{feeLine}", fee)
          .replace("{offer}", offer)
          .replace("{confirm}", confirm)
          .replaceAll("{tech}", tech());
      }
      const tech = () => (get().shop.trade === "HVAC" ? "technician" : "plumber");

      function book(p: Playing) {
        const pick = p.offer[Math.min(scenarios[p.scenario].pick, p.offer.length - 1)];
        set((s) => ({
          slots: s.slots.map((x) => (x.id === pick ? { ...x, state: "assistant", leadId: p.leadId } : x)),
        }));
        patchLead(p.leadId, () => ({ slotId: pick, status: "booked" }));
      }

      /** Play the next step of the running simulation, then schedule the one after. */
      function tick() {
        const p = get().playing;
        if (!p) return;
        const lead = get().leads.find((l) => l.id === p.leadId);
        const step = p.steps[p.step];
        // Stop if the lead is gone, the owner took over, or the script ended.
        if (!lead || lead.takenOver || !step) {
          set({ playing: null, typingLeadId: null });
          return;
        }
        set((s) => ({ typingLeadId: null, clock: s.clock + 1 }));
        if (step.reveal) patchLead(lead.id, () => step.reveal!);
        if (step.book) book(p);
        const text = fill(step.text, lead, p);
        const skipConfirm = step.book && !get().autoReplies.bookingConfirmed.on;
        if (text && !skipConfirm) pushMessage(lead.id, { from: step.from, text });
        if (step.from === "caller" && p.step <= 1) {
          set((s) => ({ calls: s.calls.map((c) => (c.leadId === lead.id ? { ...c, replied: true } : c)) }));
        }
        const next = { ...p, step: p.step + 1 };
        set({ playing: next });
        schedule(next);
      }

      function schedule(p: Playing) {
        clearTimeout(timer);
        const step = p.steps[p.step];
        if (!step) {
          set({ playing: null, typingLeadId: null });
          return;
        }
        if (reducedMotion()) {
          timer = setTimeout(tick, 0);
          return;
        }
        if (step.from === "assistant") {
          timer = setTimeout(() => {
            set({ typingLeadId: p.leadId });
            timer = setTimeout(tick, 1100);
          }, 500);
        } else {
          timer = setTimeout(tick, step.from === "system" ? 700 : 1600);
        }
      }

      resumeSchedule = schedule;

      return {
        ...fresh(),

        markRead: (id) => patchLead(id, () => ({ read: true })),
        takeOver: (id) => {
          if (get().playing?.leadId === id) set({ playing: null, typingLeadId: null });
          patchLead(id, () => ({ takenOver: true, read: true }));
        },
        handBack: (id) => patchLead(id, () => ({ takenOver: false })),
        sendOwnerMessage: (id, text) => {
          const t = text.trim();
          if (!t) return;
          set((s) => ({ clock: s.clock + 1 }));
          pushMessage(id, { from: "owner", text: t });
        },
        markWon: (id, value) => {
          if (!Number.isFinite(value) || value <= 0) return;
          patchLead(id, () => ({ wonValue: Math.round(value) }));
        },
        toggleSlot: (id) =>
          set((s) => ({
            slots: s.slots.map((x) =>
              x.id === id && toggleable(x) ? { ...x, state: x.state === "open" ? "closed" : "open" } : x,
            ),
          })),
        simulateCall: () => {
          const s = get();
          const i = s.scenarioIndex % scenarios.length;
          const sc = scenarios[i];
          const clock = s.clock + 1;
          if (!s.permissions.textBack) {
            set({
              clock,
              scenarioIndex: s.scenarioIndex + 1,
              calls: [...s.calls, { id: uid("c"), at: clock, phone: sc.phone, textedBack: false, replied: false }],
              notice: "Missed call logged. Text-back is off in Settings, so no text was sent.",
            });
            return null;
          }
          // A running simulation finishes instantly so only one plays at a time.
          while (get().playing) tick();
          const offer = s.permissions.book ? openSlots(get().slots).slice(0, 2).map((x) => x.id) : [];
          const canBook = sc.kind === "book" && offer.length > 0;
          const steps = sc.steps.filter(
            (st) =>
              !st.when ||
              (st.when === "canBook" && canBook) ||
              (st.when === "cannotBook" && !canBook) ||
              (st.when === "ringOwner" && get().permissions.ringOwner),
          );
          const leadId = uid("lead");
          const lead: Lead = {
            id: leadId,
            name: null,
            phone: sc.phone,
            problem: sc.lead.problem,
            address: "Not given",
            urgency: sc.lead.urgency,
            status: sc.kind === "emergency" ? "emergency" : "new",
            source: "Missed call (simulated)",
            calledAt: clock,
            takenOver: false,
            read: true,
            messages: [],
          };
          const playing: Playing = { leadId, scenario: i, steps, step: 0, offer };
          set((st) => ({
            clock,
            scenarioIndex: st.scenarioIndex + 1,
            leads: [lead, ...st.leads],
            calls: [...st.calls, { id: uid("c"), at: clock, phone: sc.phone, textedBack: true, replied: false, leadId }],
            playing,
          }));
          schedule(playing);
          return leadId;
        },
        saveSettings: (next) => set(structuredClone(next)),
        resetDemo: () => {
          clearTimeout(timer);
          set(fresh());
        },
        clearNotice: () => set({ notice: null }),
      };
    },
    {
      name: "ringback-demo",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => {
        const rest: Partial<State> = { ...s };
        delete rest.typingLeadId;
        delete rest.notice;
        return rest;
      },
      onRehydrateStorage: () => (state) => {
        // A simulation interrupted by a reload carries on from where it stopped.
        const p = state?.playing;
        if (p) setTimeout(() => resumeSchedule?.(p), 0);
      },
    },
  ),
);

const toggleable = (x: Slot) => (x.state === "open" || x.state === "closed") && !isPast(x.day, x.idx);
