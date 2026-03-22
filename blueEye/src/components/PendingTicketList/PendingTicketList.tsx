import type { AdminTicket } from "../../types/types";

type Props = {
  tickets: AdminTicket[];
  onReject: (id: string) => void;
  onPlan: (ticket: AdminTicket) => void;
};

export const PendingTicketsList = ({ tickets, onReject, onPlan }: Props) => {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Tickets pendientes</h2>

      <div className="space-y-4">
        {tickets.length > 0 ? (
          tickets.map((t) => (
            <article
              key={t.id}
              className="rounded-[28px] border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-xl font-semibold">{t.id}</h3>
              <p className="text-sm text-slate-600">{t.summary}</p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => onReject(t.id)}
                  className="border px-4 py-2 rounded"
                >
                  Rechazar
                </button>

                <button
                  onClick={() => onPlan(t)}
                  className="bg-sky-600 text-white px-4 py-2 rounded"
                >
                  Planificar
                </button>
              </div>
            </article>
          ))
        ) : (
          <p>No hay tickets</p>
        )}
      </div>
    </section>
  );
};