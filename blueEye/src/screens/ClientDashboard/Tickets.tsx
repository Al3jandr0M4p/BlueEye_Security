import React, { useMemo } from "react";
import TicketForm from "./components/TicketForm";
import { useClientTickets } from "./hooks/useClientTickets";
import type { Ticket } from "../../types/client.types";

const STATUS_STYLES: Record<
  Ticket["status"],
  { badge: string; border: string; label: string; tone: string }
> = {
  open: {
    badge: "bg-amber-50 text-amber-700",
    border: "border-amber-200",
    label: "Abierto",
    tone: "bg-amber-500",
  },
  in_progress: {
    badge: "bg-sky-50 text-sky-700",
    border: "border-sky-200",
    label: "En progreso",
    tone: "bg-sky-500",
  },
  resolved: {
    badge: "bg-emerald-50 text-emerald-700",
    border: "border-emerald-200",
    label: "Resuelto",
    tone: "bg-emerald-500",
  },
  cancelled: {
    badge: "bg-rose-50 text-rose-700",
    border: "border-rose-200",
    label: "Cancelado",
    tone: "bg-rose-500",
  },
};

const PLANNING_LABELS: Record<string, string> = {
  pending: "Pendiente de planificar",
  planned: "Planificado",
  rejected: "Rechazado",
  unassigned: "Sin asignar",
};

function formatDate(value?: string) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const Tickets = () => {
  const { createTicket, feedback, integrationNote, isLoading, tickets } =
    useClientTickets();

  const summary = useMemo(() => {
    return tickets.reduce(
      (accumulator, ticket) => {
        accumulator.total += 1;
        if (ticket.status === "in_progress") accumulator.inProgress += 1;
        if (ticket.planningStatus === "planned") accumulator.planned += 1;
        if (ticket.status === "resolved") accumulator.resolved += 1;
        return accumulator;
      },
      { inProgress: 0, planned: 0, resolved: 0, total: 0 },
    );
  }, [tickets]);

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[380px_1fr]">
        <aside className="space-y-4">
          {feedback && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {feedback}
            </div>
          )}

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Soporte
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Tickets del cliente
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {integrationNote}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  En progreso
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {summary.inProgress}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Planificados
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {summary.planned}
                </p>
              </div>
            </div>
          </div>

          <TicketForm onSubmit={createTicket} />
        </aside>

        <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Historial
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                Seguimiento de tickets
              </h2>
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
              {summary.total} tickets
            </div>
          </div>

          {isLoading && (
            <div className="px-5 py-12 text-center text-sm text-slate-500">
              Cargando tickets...
            </div>
          )}

          {!isLoading && tickets.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-slate-500">
              Aun no tienes tickets registrados.
            </div>
          )}

          <div className="grid gap-4 p-5">
            {tickets.map((ticket) => {
              const statusStyle = STATUS_STYLES[ticket.status];
              const planningLabel =
                PLANNING_LABELS[ticket.planningStatus ?? "pending"] ??
                "Pendiente";

              return (
                <article
                  key={ticket.id}
                  className={`rounded-3xl border bg-white p-5 shadow-sm ${statusStyle.border}`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1 h-12 w-1 rounded-full ${statusStyle.tone}`}
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {ticket.site || "Sitio sin nombre"}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle.badge}`}
                          >
                            {statusStyle.label}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-medium text-slate-700">
                          Equipo: {ticket.equipment || "Sin equipo"}
                        </p>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                          {ticket.description || "Sin descripcion."}
                        </p>
                      </div>
                    </div>

                    {ticket.photoUrl && (
                      <a
                        href={ticket.photoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="overflow-hidden rounded-2xl border border-slate-200"
                      >
                        <img
                          src={ticket.photoUrl}
                          alt={`Evidencia del ticket ${ticket.id}`}
                          className="h-28 w-40 object-cover"
                        />
                      </a>
                    )}
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Admin
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {ticket.assignedAdminName || "Pendiente"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Tecnico
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {ticket.assignedTechnicianName || "Sin asignar"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Planificacion
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {planningLabel}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Fecha
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {ticket.scheduledDate
                          ? formatDate(ticket.scheduledDate)
                          : formatDate(ticket.createdAt)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
};

export default Tickets;
