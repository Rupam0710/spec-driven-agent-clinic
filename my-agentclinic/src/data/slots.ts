import type { Slot } from "../domain/types";

// Fixed, static set of bookable time slots. Deliberately NOT relative to "now"
// so the booking form, the demo, and the tests are deterministic. `startsAt`
// (ISO) is used only to order appointments soonest-first.
const slots: Slot[] = [
  { id: "mon-am", label: "Monday, 09:00", startsAt: "2026-10-05T09:00:00Z" },
  { id: "mon-pm", label: "Monday, 14:00", startsAt: "2026-10-05T14:00:00Z" },
  { id: "wed-am", label: "Wednesday, 10:30", startsAt: "2026-10-07T10:30:00Z" },
  { id: "thu-pm", label: "Thursday, 16:00", startsAt: "2026-10-08T16:00:00Z" },
  { id: "fri-am", label: "Friday, 11:00", startsAt: "2026-10-09T11:00:00Z" },
];

export const getSlots = (): Slot[] => slots;

export const getSlot = (id: string): Slot | undefined =>
  slots.find((s) => s.id === id);
