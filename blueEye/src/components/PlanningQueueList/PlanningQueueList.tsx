import type { AdminTicket } from "../../types/types";

type Props = {
  tickets: AdminTicket[];
  onEdit: (ticket: AdminTicket) => void;
};

export const PlanningQueueList = ({ tickets, onEdit }: Props) => {
  return (
    <section className="rounded-[30px] border border-sky-200 bg-sky-50 p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">
        Planificacion activa
      </h2>

      <div className="space-y-4">
        {tickets.length > 0 ? (
          tickets.map((t) => (
            <article
              key={t.id}
              className="rounded-[26px] border bg-white p-4"
            >
              <h3 className="font-semibold">{t.id}</h3>
              <p className="text-sm">{t.summary}</p>

              <p className="text-xs mt-2">
                Fecha: {t.scheduledDate || "Pendiente"}
              </p>

              <button
                onClick={() => onEdit(t)}
                className="mt-3 border px-3 py-1 rounded"
              >
                Editar plan
              </button>
            </article>
          ))
        ) : (
          <p>No hay tickets planificados</p>
        )}
      </div>
    </section>
  );
};