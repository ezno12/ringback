export type LeadStatus = "new" | "booked" | "emergency" | "voicemail";
export type Sender = "caller" | "assistant" | "owner" | "system";
export type SlotState = "assistant" | "owner" | "open" | "closed";
export type Trade = "Plumbing" | "HVAC";

/** Times are minutes since Monday 00:00 of the demo week (see lib/dates.ts). */
export interface Message {
  id: string;
  from: Sender;
  text: string;
  at: number;
}

export interface Lead {
  id: string;
  name: string | null;
  phone: string;
  problem: string;
  address: string;
  urgency: string;
  status: LeadStatus;
  source: string;
  calledAt: number;
  slotId?: string;
  takenOver: boolean;
  wonValue?: number;
  read: boolean;
  ownerCalled?: boolean;
  voicemail?: string;
  messages: Message[];
}

export interface Call {
  id: string;
  at: number;
  phone: string;
  textedBack: boolean;
  replied: boolean;
  leadId?: string;
}

export interface Slot {
  id: string;
  day: number; // 0 = Monday … 4 = Friday
  idx: number; // 0..3, see SLOT_HOURS
  state: SlotState;
  leadId?: string;
  note?: string;
}

export interface Shop {
  name: string;
  trade: Trade;
  calloutFee: number;
  zips: string;
  phone: string;
  ownerMobile: string;
  weekdayOpen: string;
  weekdayClose: string;
  saturday: boolean;
}

export interface Permissions {
  textBack: boolean;
  book: boolean;
  statFee: boolean;
  ringOwner: boolean;
  nudge: boolean;
}

export interface QuickReply {
  id: string;
  label: string;
  text: string;
}

export interface AutoReply {
  on: boolean;
  text: string;
}

export interface AutoReplies {
  afterHours: AutoReply;
  outsideArea: AutoReply;
  bookingConfirmed: AutoReply;
}

export interface Settings {
  shop: Shop;
  permissions: Permissions;
  quickReplies: QuickReply[];
  autoReplies: AutoReplies;
}

export interface WeekNumbers {
  missed: number;
  textedBack: number;
  replied: number;
  leads: number;
  booked: number;
  won: number;
  revenue: number;
  callsByDay: number[];
  leadsByDay: number[];
  wonJobs: { id: string; label: string; value: number }[];
}
