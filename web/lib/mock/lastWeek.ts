import type { WeekNumbers } from "../types.ts";

// Static figures for the report's "Last week" view.
export const lastWeek: WeekNumbers = {
  missed: 12,
  textedBack: 11,
  replied: 8,
  leads: 7,
  booked: 4,
  won: 3,
  revenue: 1340,
  callsByDay: [3, 2, 3, 1, 3],
  leadsByDay: [2, 1, 2, 1, 1],
  wonJobs: [
    { id: "lw1", label: "Rachel Moore, sump pump replacement", value: 690 },
    { id: "lw2", label: "Dev Patel, shower valve repair", value: 410 },
    { id: "lw3", label: "Gloria Chen, outdoor tap leak", value: 240 },
  ],
};
