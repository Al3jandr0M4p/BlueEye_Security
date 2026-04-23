import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTechNotifications } from "../../hooks/use-tech-notifications";
import { useTechTickets } from "../../hooks/use-tech-tickets";
import type { TechTicketStatus } from "../../types/tech.types";

const statusOptions: Array<{ label: string; value: TechTicketStatus }> = [
  { label: "Iniciado", value: "iniciado" },
  { label: "En progreso", value: "en progreso" },
  { label: "Finalizado", value: "finalizado" },
  { label: "Cancelado", value: "cancelado" },
];

function formatDate(value?: string | null) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const TicketsTechScreen: React.FC = () => {
  const navigate = useNavigate();
  const { error, isLoading, tickets, updateNotes, updateStatus } = useTechTickets();
  const notifications = useTechNotifications();
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [notesDraft, setNotesDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const readyTickets = useMemo(
    () => tickets.filter((ticket) => (ticket.tickets_status ?? "iniciado") === "iniciado"),
    [tickets],
  );
  const visibleTickets = useMemo(() => tickets, [tickets]);

  const selectedTicket = useMemo(() => {
    const found = visibleTickets.find((ticket) => String(ticket.id) === selectedTicketId);
    return found ?? (visibleTickets[0] ?? null);
  }, [selectedTicketId, visibleTickets]);

  React.useEffect(() => {
    if (!selectedTicket) return;
    setSelectedTicketId(String(selectedTicket.id));
    setNotesDraft(selectedTicket.technician_notes ?? "");
  }, [selectedTicket]);

  const ticketsInProgress = tickets.filter(
    (ticket) => ticket.tickets_status === "en progreso",
  ).length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8">
      <section className="overflow-hidden rounded-[34px] border border-slate-200/80 bg-white/90 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur-sm">
        <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
              Tickets asignados
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
              Bandeja de arranque tecnico
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Aqui aparecen los tickets asignados listos para iniciar. Revisa la
              informacion del cliente, confirma el contexto y envialos al flujo de
              levantamiento con un solo clic.
            </p>
          </div>

          <div className="grid gap-3 rounded-[28px] border border-sky-100 bg-sky-50/70 p-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Listos
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{tickets.length}</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                En progreso
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {ticketsInProgress}
              </p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Alertas
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {notifications.unreadCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      {(error || localError || notifications.error) && (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {localError ?? error ?? notifications.error}
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <section className="space-y-3 rounded-[30px] border border-slate-200 bg-white/95 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-950">Tickets asignados</h2>
            {isLoading && <p className="text-xs text-slate-500">Cargando...</p>}
          </div>

          {visibleTickets.length === 0 && !isLoading ? (
            <p className="text-sm text-slate-600">
              No tienes tickets asignados.
            </p>
          ) : (
            <div className="grid gap-2">
              {visibleTickets.map((ticket) => {
                const isSelected = String(ticket.id) === String(selectedTicket?.id);
                return (
                  <button
                    type="button"
                    key={ticket.id}
                    onClick={() => {
                      setSelectedTicketId(String(ticket.id));
                      setNotesDraft(ticket.technician_notes ?? "");
                      setLocalError(null);
                    }}
                    className={`rounded-[22px] border px-4 py-4 text-left transition ${
                      isSelected
                        ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <p
                      className={`text-xs uppercase tracking-[0.14em] ${
                        isSelected ? "text-white/70" : "text-slate-400"
                      }`}
                    >
                      Ticket #{ticket.id}
                    </p>
                    <p
                      className={`mt-2 text-sm font-semibold ${
                        isSelected ? "text-white" : "text-slate-950"
                      }`}
                    >
                      {ticket.site ?? "Sitio"}
                    </p>
                    <p
                      className={`mt-1 text-xs ${
                        isSelected ? "text-white/80" : "text-slate-600"
                      }`}
                    >
                      {ticket.equipment ?? "Equipo no especificado"}
                    </p>
                    <p
                      className={`mt-2 line-clamp-2 text-xs leading-5 ${
                        isSelected ? "text-white/75" : "text-slate-600"
                      }`}
                    >
                      {ticket.content_description ?? "Sin descripcion"}
                    </p>
                    <div
                      className={`mt-3 grid gap-1 text-[11px] ${
                        isSelected ? "text-white/70" : "text-slate-500"
                      }`}
                    >
                      <span>Estado: {ticket.tickets_status ?? "iniciado"}</span>
                      <span>Cliente: {ticket.requester_name ?? "Cliente"}</span>
                      <span>Admin: {ticket.admin_name ?? "Admin"}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Detalle del ticket</h2>
              <p className="mt-1 text-sm text-slate-600">
                Confirma la informacion y luego mueve el caso a levantamientos.
              </p>
            </div>

            {selectedTicket && (selectedTicket.tickets_status ?? "iniciado") === "iniciado" && (
              <button
                type="button"
                onClick={() => {
                  setLocalError(null);
                  void (async () => {
                    setSaving(true);
                    try {
                      await updateStatus(String(selectedTicket.id), "en progreso");
                      navigate("/techDashboard/levantamientos", {
                        state: { ticket: selectedTicket },
                      });
                    } catch (err) {
                      setLocalError(
                        err instanceof Error
                          ? err.message
                          : "No se pudo mover el ticket a levantamientos.",
                      );
                    } finally {
                      setSaving(false);
                    }
                  })();
                }}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                  saving ? "bg-slate-400" : "bg-sky-600 hover:bg-sky-500"
                }`}
                disabled={saving}
              >
                Levantamiento
              </button>
            )}
          </div>

          {!selectedTicket ? (
            <p className="mt-4 text-sm text-slate-600">Selecciona un ticket.</p>
          ) : (
            <div className="mt-4 space-y-5">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                    Ticket
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    #{selectedTicket.id}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                    Admin que asigno
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {selectedTicket.admin_name ?? "Admin"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                    Cliente
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {selectedTicket.requester_name ?? "Cliente"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Sitio</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {selectedTicket.site ?? "Sin sitio"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Equipo</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {selectedTicket.equipment ?? "Sin equipo"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                    Fecha programada
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {formatDate(selectedTicket.scheduled_date)}
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-sky-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.14em] text-sky-700">
                  Contexto del cliente
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-slate-500">Cliente asignado</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {selectedTicket.requester_name ?? "Cliente"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Siguiente paso</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      Iniciar levantamiento en sitio
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                  Descripcion
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-800">
                  {selectedTicket.content_description ?? "Sin descripcion"}
                </p>
              </div>

              {selectedTicket.img && (
                <a
                  href={selectedTicket.img}
                  target="_blank"
                  rel="noreferrer"
                  className="block overflow-hidden rounded-[24px] border border-slate-200"
                >
                  <img
                    src={selectedTicket.img}
                    alt={`Evidencia del ticket ${selectedTicket.id}`}
                    className="max-h-72 w-full object-cover"
                  />
                </a>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-950">Estado</label>
                  <select
                    value={(selectedTicket.tickets_status ?? "iniciado") as TechTicketStatus}
                    onChange={(e) => {
                      const nextStatus = e.target.value as TechTicketStatus;
                      setLocalError(null);
                      void (async () => {
                        setSaving(true);
                        try {
                          await updateStatus(String(selectedTicket.id), nextStatus);
                        } catch (err) {
                          setLocalError(
                            err instanceof Error
                              ? err.message
                              : "No se pudo actualizar el estado.",
                          );
                        } finally {
                          setSaving(false);
                        }
                      })();
                    }}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    disabled={saving}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-950">
                    Proximo paso
                  </label>
                  <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    {(selectedTicket.tickets_status ?? "iniciado") === "iniciado"
                      ? 'Presiona "Levantamiento" para mover este ticket a la otra vista.'
                      : "Este ticket ya fue enviado al flujo de levantamiento."}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-950">Notas del tecnico</label>
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  className="mt-2 min-h-40 w-full resize-y rounded-[24px] border border-slate-200 px-4 py-3 text-sm"
                  placeholder="Escribe hallazgos, acciones realizadas, piezas cambiadas y resultado de la visita."
                />
                <div className="mt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setNotesDraft(selectedTicket.technician_notes ?? "")}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    disabled={saving}
                  >
                    Descartar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalError(null);
                      void (async () => {
                        setSaving(true);
                        try {
                          await updateNotes(String(selectedTicket.id), notesDraft);
                        } catch (err) {
                          setLocalError(
                            err instanceof Error
                              ? err.message
                              : "No se pudieron guardar las notas.",
                          );
                        } finally {
                          setSaving(false);
                        }
                      })();
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                      saving ? "bg-slate-400" : "bg-slate-950 hover:bg-slate-800"
                    }`}
                    disabled={saving}
                  >
                    Guardar notas
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TicketsTechScreen;
