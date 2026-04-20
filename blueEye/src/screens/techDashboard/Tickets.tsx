import React, { useMemo, useState } from "react";
import TechNotificationsPanel from "../../components/techNotifications/TechNotificationsPanel";
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
  const { error, isLoading, tickets, updateNotes, updateStatus } = useTechTickets();
  const notifications = useTechNotifications();
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [notesDraft, setNotesDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const selectedTicket = useMemo(() => {
    const found = tickets.find((ticket) => String(ticket.id) === selectedTicketId);
    return found ?? (tickets[0] ?? null);
  }, [selectedTicketId, tickets]);

  React.useEffect(() => {
    if (!selectedTicket) return;
    setSelectedTicketId(String(selectedTicket.id));
    setNotesDraft(selectedTicket.technician_notes ?? "");
  }, [selectedTicket]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Tickets asignados
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Flujo operativo del tecnico
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Recibe asignaciones del admin, actualiza el estado del trabajo y guarda notas del servicio.
          </p>
        </div>
      </div>

      {(error || localError || notifications.error) && (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {localError ?? error ?? notifications.error}
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[320px_1fr_360px]">
        <section className="space-y-3 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Mis tickets</h2>
            {isLoading && <p className="text-xs text-slate-500">Cargando...</p>}
          </div>

          {tickets.length === 0 && !isLoading ? (
            <p className="text-sm text-slate-600">No tienes tickets asignados.</p>
          ) : (
            <div className="grid gap-2">
              {tickets.map((ticket) => {
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
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <p className={`text-xs uppercase tracking-[0.2em] ${isSelected ? "text-white/70" : "text-slate-400"}`}>
                      {ticket.site ?? "Sitio"}
                    </p>
                    <p className={`mt-1 text-sm font-semibold ${isSelected ? "text-white" : "text-slate-900"}`}>
                      {ticket.equipment ?? "Equipo"}
                    </p>
                    <p className={`mt-1 line-clamp-2 text-xs ${isSelected ? "text-white/75" : "text-slate-600"}`}>
                      {ticket.content_description ?? "Sin descripcion"}
                    </p>
                    <p className={`mt-2 text-[11px] ${isSelected ? "text-white/70" : "text-slate-500"}`}>
                      Admin: {ticket.admin_name ?? "Admin"}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Detalle del ticket</h2>

          {!selectedTicket ? (
            <p className="mt-2 text-sm text-slate-600">Selecciona un ticket.</p>
          ) : (
            <div className="mt-4 space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Admin que asigno</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedTicket.admin_name ?? "Admin"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Cliente</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedTicket.requester_name ?? "Cliente"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sitio</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedTicket.site ?? "Sin sitio"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Equipo</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedTicket.equipment ?? "Sin equipo"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Descripcion</p>
                <p className="mt-2 text-sm leading-6 text-slate-800">
                  {selectedTicket.content_description ?? "Sin descripcion"}
                </p>
              </div>

              {selectedTicket.img && (
                <a
                  href={selectedTicket.img}
                  target="_blank"
                  rel="noreferrer"
                  className="block overflow-hidden rounded-2xl border border-slate-200"
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
                  <label className="text-sm font-semibold text-slate-900">Estado</label>
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
                          setLocalError(err instanceof Error ? err.message : "No se pudo actualizar el estado.");
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
                  <label className="text-sm font-semibold text-slate-900">Fecha programada</label>
                  <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    {formatDate(selectedTicket.scheduled_date)}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900">Notas del tecnico</label>
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  className="mt-2 min-h-40 w-full resize-y rounded-2xl border border-slate-200 px-4 py-3 text-sm"
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
                          setLocalError(err instanceof Error ? err.message : "No se pudieron guardar las notas.");
                        } finally {
                          setSaving(false);
                        }
                      })();
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                      saving ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800"
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

        <TechNotificationsPanel
          notifications={notifications.notifications}
          unreadCount={notifications.unreadCount}
          isLoading={notifications.isLoading}
          onMarkAsRead={(notificationId) => {
            void notifications.markAsRead(notificationId);
          }}
        />
      </div>
    </div>
  );
};

export default TicketsTechScreen;
