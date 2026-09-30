import { Layout } from "../components/Layout";
import { listAppointments } from "../data/appointments";
import { getAgent, getTherapy } from "../data/seed";
import { getSlot } from "../data/slots";

// Upcoming-appointments list, soonest slot first. Each row links to the booked
// agent and therapy. Missing lookups are skipped defensively (ids are validated
// at booking time, so this shouldn't happen).
export function Appointments() {
  const appointments = listAppointments();
  return (
    <Layout title="Appointments">
      <h1>Upcoming appointments</h1>
      <p>
        <a href="/appointments/new" role="button">
          Book an appointment
        </a>
      </p>

      {appointments.length === 0 ? (
        <p>No appointments booked yet — be the first to book your way to relief.</p>
      ) : (
        <ul>
          {appointments.map((appt) => {
            const agent = getAgent(appt.agentId);
            const therapy = getTherapy(appt.therapyId);
            const slot = getSlot(appt.slotId);
            if (!agent || !therapy || !slot) return null;
            return (
              <li>
                <strong>{slot.label}</strong> —{" "}
                <a href={`/agents/${agent.id}`}>{agent.name}</a> for{" "}
                <a href={`/therapies/${therapy.id}`}>{therapy.name}</a>
              </li>
            );
          })}
        </ul>
      )}
    </Layout>
  );
}
