import type { AdminTicket } from "../../types/types";

const fallbackTicketImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?fit=crop&w=900&q=60";

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
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50"
            >
              <div className="grid gap-0 md:grid-cols-[180px_1fr]">
                <div className="h-full min-h-25 bg-slate-200">
                  <img
                    src={t.image || fallbackTicketImage}
                    alt={`Evidencia del ticket ${t.id}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">{t.id}</h3>
                  <p className="mt-2 text-sm text-slate-600">{t.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                      {t.site}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                      {t.requestedBy}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => onReject(t.id)}
                      className="border px-2 py-1 rounded"
                    >
                      Rechazar
                    </button>

                    <button
                      onClick={() => onPlan(t)}
                      className="bg-sky-600 text-white px-2 py-1 rounded"
                    >
                      Planificar
                    </button>
                  </div>
                </div>
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
