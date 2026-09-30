import type { Appointment } from "../domain/types";
import { getSlot } from "./slots";

// In-memory, mutable appointment store. Appointments are created at runtime and
// held only in memory — they reset on restart. Per specs/roadmap.md, real
// persistence is a post-MVP ("Later") concern. The array is module-private;
// callers go through the helpers below.
const appointments: Appointment[] = [];

let nextId = 1;

// All appointments, ordered soonest-first by their slot's start time.
// Appointments whose slot no longer exists sort last (defensive; shouldn't
// happen since slots are static and ids are validated before insert).
export const listAppointments = (): Appointment[] =>
  [...appointments].sort((a, b) => {
    const aStart = getSlot(a.slotId)?.startsAt ?? "";
    const bStart = getSlot(b.slotId)?.startsAt ?? "";
    return aStart.localeCompare(bStart);
  });

// Create and store an appointment. Ids are assumed already validated by the
// caller (the route owns validation); the store stays thin.
export const addAppointment = (input: {
  agentId: string;
  therapyId: string;
  slotId: string;
}): Appointment => {
  const appointment: Appointment = { id: String(nextId++), ...input };
  appointments.push(appointment);
  return appointment;
};
