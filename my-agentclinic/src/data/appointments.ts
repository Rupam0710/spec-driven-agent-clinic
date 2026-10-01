import type { Appointment } from "../domain/types";
import { db } from "./db";
import { getSlot } from "./slots";

// Appointment store, backed by SQLite (src/data/db.ts). Booked appointments now
// survive a restart — the whole point of Phase 4. The route owns validation
// (agent/therapy/slot ids are checked before insert), so the store stays thin.
//
// Slots remain a fixed, static set (src/data/slots.ts), so appointments store
// only the slot id and we resolve the label / start time from there — including
// for ordering, below.

const insertAppointment = db.prepare(
  "INSERT INTO appointments (agent_id, therapy_id, slot_id) VALUES (?, ?, ?)",
);
const selectAppointments = db.prepare(
  "SELECT id, agent_id, therapy_id, slot_id FROM appointments",
);

type AppointmentRow = {
  id: number;
  agent_id: string;
  therapy_id: string;
  slot_id: string;
};

const toAppointment = (row: AppointmentRow): Appointment => ({
  id: String(row.id),
  agentId: row.agent_id,
  therapyId: row.therapy_id,
  slotId: row.slot_id,
});

// All appointments, ordered soonest-first by their slot's start time. Ordering
// happens here (not in SQL) because start times live with the static slots.
// Appointments whose slot no longer exists sort last (defensive; shouldn't
// happen since slots are static and ids are validated before insert).
export const listAppointments = (): Appointment[] =>
  (selectAppointments.all() as AppointmentRow[])
    .map(toAppointment)
    .sort((a, b) => {
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
  const info = insertAppointment.run(
    input.agentId,
    input.therapyId,
    input.slotId,
  );
  return { id: String(info.lastInsertRowid), ...input };
};
