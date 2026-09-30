import { Layout } from "../components/Layout";
import { getAgents, getTherapies } from "../data/seed";
import { getSlots } from "../data/slots";

type BookAppointmentProps = {
  // Message shown when a submission failed validation.
  error?: string;
  // Previously submitted values, so the form can be re-rendered pre-filled.
  selected?: { agentId?: string; therapyId?: string; slotId?: string };
};

// The booking form: agent + therapy + time slot, posted to POST /appointments.
// Semantic <form>/<select> so Pico styles it for free.
export function BookAppointment({ error, selected }: BookAppointmentProps) {
  const agents = getAgents();
  const therapies = getTherapies();
  const slots = getSlots();
  return (
    <Layout title="Book an appointment">
      <p>
        <a href="/appointments">← Upcoming appointments</a>
      </p>
      <h1>Book an appointment</h1>
      <p>Pick an agent, a therapy, and a time — and book your way to relief.</p>

      {error ? (
        <p role="alert">
          <strong>{error}</strong>
        </p>
      ) : null}

      <form method="post" action="/appointments">
        <label>
          Agent
          <select name="agentId" required>
            <option value="">Choose an agent…</option>
            {agents.map((agent) => (
              <option value={agent.id} selected={selected?.agentId === agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Therapy
          <select name="therapyId" required>
            <option value="">Choose a therapy…</option>
            {therapies.map((therapy) => (
              <option
                value={therapy.id}
                selected={selected?.therapyId === therapy.id}
              >
                {therapy.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Time slot
          <select name="slotId" required>
            <option value="">Choose a time…</option>
            {slots.map((slot) => (
              <option value={slot.id} selected={selected?.slotId === slot.id}>
                {slot.label}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Book appointment</button>
      </form>
    </Layout>
  );
}
