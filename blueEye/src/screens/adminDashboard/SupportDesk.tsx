import React, { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import type { SlotInfo } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format as formatDate, getDay, isSameDay, isValid, parse, parseISO, startOfDay, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, ClipboardList, Users } from "lucide-react";
import { useAdminSupportOverview } from "../../hooks/use-admin-dashboard";
import { useAdminTicketPlanning } from "../../hooks/use-admin-ticket-planning";
import type { AdminTechnician, AdminTicket } from "../../types/types";
import AdminPageShell from "../../components/AdminPageShell";
import "../../styles/admin-planning-calendar.css";

const priorityBadgeClasses: Record<string, string> = {
  Urgente: "bg-red-100 text-red-700",
  Alta: "bg-amber-100 text-amber-700",
  Normal: "bg-slate-100 text-slate-700",
};

const EMPTY_TICKETS: AdminTicket[] = [];
const EMPTY_TECHNICIANS: AdminTechnician[] = [];

const calendarLocalizer = dateFnsLocalizer({
  format: formatDate,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { locale: es }),
  getDay,
  locales: { es },
});

const calendarMessages = {
  next: "Sig.",
  previous: "Ant.",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "No hay eventos en este rango.",
  showMore: (total: number) => `+${total} mas`,
};

const getTodayDate = () => new Date().toISOString().split("T")[0];
const getDateFromInput = (value: string) => parseISO(`${value}T00:00:00`);

type PlanningCalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: AdminTicket;
};

const AdminSupportScreen: React.FC = () => {
  const { data, error } = useAdminSupportOverview();
  const { state, updateState } = useAdminTicketPlanning();
  const priorities = data?.ticketsByPriority ?? [];
  const technicians = data?.technicians ?? EMPTY_TECHNICIANS;
  const recentTickets = data?.recentTickets ?? EMPTY_TICKETS;
  const pendingTickets = state.pendingTickets;
  const planningQueue = state.planningQueue;
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [scheduledDate, setScheduledDate] = useState(getTodayDate());

  const availableTechnicians = useMemo(
    () => technicians.filter((tech) => tech.status === "Disponible"),
    [technicians],
  );

  const openPlanningModal = (ticket: AdminTicket) => {
    const defaultTechnician = availableTechnicians.find((tech) => tech.name === ticket.assignedTo) ?? availableTechnicians[0] ?? technicians[0];
    setSelectedTicket(ticket);
    setSelectedTechnicianId(defaultTechnician?.id ?? "");
    setScheduledDate(ticket.scheduledDate ?? getTodayDate());
  };

  const closePlanningModal = () => {
    setSelectedTicket(null);
    setSelectedTechnicianId("");
    setScheduledDate(getTodayDate());
  };

  const handleReject = (ticketId: string) => {
    updateState((currentState) => ({
      ...currentState,
      pendingTickets: currentState.pendingTickets.filter((ticket) => ticket.id !== ticketId),
      rejectedTicketIds: [...currentState.rejectedTicketIds, ticketId],
    }));
  };

  const handleSavePlan = () => {
    if (!selectedTicket || !selectedTechnicianId || !scheduledDate) return;
    const technician = technicians.find((tech) => tech.id === selectedTechnicianId) ?? availableTechnicians[0];

    updateState((currentState) => {
      const nextTicket: AdminTicket = {
        ...selectedTicket,
        assignedTo: technician?.name ?? "Pendiente",
        scheduledDate,
        status: "Planificado",
      };

      const existsInPending = currentState.pendingTickets.some((ticket) => ticket.id === selectedTicket.id);

      return {
        ...currentState,
        pendingTickets: currentState.pendingTickets.filter((ticket) => ticket.id !== selectedTicket.id),
        planningQueue: existsInPending
          ? [nextTicket, ...currentState.planningQueue]
          : currentState.planningQueue.map((ticket) => (ticket.id === selectedTicket.id ? nextTicket : ticket)),
      };
    });

    closePlanningModal();
  };

  const selectedCalendarDate = isValid(getDateFromInput(scheduledDate)) ? getDateFromInput(scheduledDate) : getDateFromInput(getTodayDate());
  const planningCalendarEvents: PlanningCalendarEvent[] = planningQueue
    .filter((ticket) => ticket.scheduledDate)
    .map((ticket) => {
      const eventDate = getDateFromInput(ticket.scheduledDate!);
      return { title: `${ticket.id} · ${ticket.assignedTo}`, start: eventDate, end: eventDate, allDay: true, resource: ticket };
    });

  const handleSelectCalendarSlot = (slotInfo: SlotInfo) => {
    const nextDate = startOfDay(slotInfo.start);
    if (nextDate < startOfDay(new Date())) return;
    setScheduledDate(formatDate(nextDate, "yyyy-MM-dd"));
  };

  return (
    <AdminPageShell tag="Tickets" title="Gestion de tickets" subtitle="Flujo mas claro para revisar, planificar y asignar tickets.">
      <div className="space-y-8">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">Tickets tecnicos</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Mesa de aprobacion y planificacion</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">Ordené la vista para que tickets pendientes, planificación y técnicos disponibles se lean mejor.</p>
              {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
            </div>
            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
              <article className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4"><p className="text-xs uppercase tracking-wide text-slate-400">Pendientes</p><p className="mt-2 text-3xl font-semibold text-slate-900">{pendingTickets.length}</p></article>
              <article className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4"><p className="text-xs uppercase tracking-wide text-slate-400">Planificados</p><p className="mt-2 text-3xl font-semibold text-slate-900">{planningQueue.length}</p></article>
              <article className="rounded-3xl border border-sky-200 bg-sky-50 px-5 py-4"><p className="text-xs uppercase tracking-wide text-slate-500">Tecnicos listos</p><p className="mt-2 text-3xl font-semibold text-slate-900">{availableTechnicians.length}</p></article>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          {priorities.map((item) => (
            <article key={item.priority} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{item.priority}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{item.count}</p>
              <p className="text-xs text-slate-500">Tickets registrados</p>
            </article>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-slate-700" />
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Tickets pendientes</h2>
                  <p className="text-xs text-slate-500">Cada ticket muestra contexto y acción inmediata.</p>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {pendingTickets.length > 0 ? pendingTickets.map((ticket) => (
                <article key={ticket.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{ticket.site}</p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-900">{ticket.id}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${priorityBadgeClasses[ticket.priority] ?? "bg-slate-100 text-slate-800"}`}>{ticket.priority}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{ticket.summary}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white px-4 py-3"><p className="text-[11px] uppercase tracking-wide text-slate-400">Creado</p><p className="mt-1 text-sm font-semibold text-slate-900">{ticket.createdAt}</p></div>
                    <div className="rounded-2xl bg-white px-4 py-3"><p className="text-[11px] uppercase tracking-wide text-slate-400">SLA</p><p className="mt-1 text-sm font-semibold text-slate-900">{ticket.slaDue}</p></div>
                    <div className="rounded-2xl bg-white px-4 py-3"><p className="text-[11px] uppercase tracking-wide text-slate-400">Solicitante</p><p className="mt-1 text-sm font-semibold text-slate-900">{ticket.requestedBy}</p></div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">{ticket.tags.map((tag) => <span key={`${ticket.id}-${tag}`} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">{tag}</span>)}</div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button onClick={() => handleReject(ticket.id)} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Rechazar</button>
                    <button onClick={() => openPlanningModal(ticket)} className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">Planificar</button>
                  </div>
                </article>
              )) : <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">No hay tickets nuevos. Todo está bajo control.</p>}
            </div>
          </section>

          <section className="rounded-[30px] border border-sky-200 bg-sky-50 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-sky-700" />
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Planificacion activa</h2>
                  <p className="text-sm text-slate-500">Tickets enviados a levantamiento.</p>
                </div>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                {planningQueue.length} tickets
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {planningQueue.length > 0 ? planningQueue.map((ticket) => (
                <article key={`${ticket.id}-planning`} className="rounded-[26px] border border-sky-100 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="text-xs uppercase tracking-wide text-slate-400">{ticket.site}</p><h3 className="mt-1 text-lg font-semibold text-slate-900">{ticket.id}</h3></div>
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">{ticket.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{ticket.summary}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-400">Fecha<p className="mt-1 text-sm font-semibold text-slate-900">{ticket.scheduledDate || "Pendiente"}</p></div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-400">Tecnico<p className="mt-1 text-sm font-semibold text-slate-900">{ticket.assignedTo}</p></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-slate-500">Prioridad: {ticket.priority}</div>
                    <button onClick={() => openPlanningModal(ticket)} className="rounded-2xl border border-slate-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:bg-slate-100">Editar plan</button>
                  </div>
                </article>
              )) : <p className="rounded-2xl border border-dashed border-sky-200 bg-white p-6 text-sm text-slate-500">Todavía no hay tickets planificados.</p>}
            </div>
          </section>
        </div>

        <section className="space-y-4 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-slate-700" />
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Tecnicos disponibles</h2>
              <p className="text-sm text-slate-500">{availableTechnicians.length} listos para asignar</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {technicians.map((tech) => (
              <article key={tech.id} className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div><h3 className="text-lg font-semibold text-slate-900">{tech.name}</h3><p className="text-xs uppercase tracking-wide text-slate-400">{tech.role}</p></div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${tech.status === "Disponible" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{tech.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{tech.location}</p>
                <div className="mt-3 flex flex-wrap gap-2">{tech.expertise.map((skill) => <span key={`${tech.id}-${skill}`} className="rounded-full bg-white px-2 py-1 text-[11px] text-slate-600">{skill}</span>)}</div>
                <p className="mt-3 text-[11px] text-slate-500">Disponible desde {tech.nextAvailable}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Historial reciente</h2>
            <p className="text-sm text-slate-500">Monitoreo continuo</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {recentTickets.map((ticket) => (
              <article key={`${ticket.id}-recent`} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-400">{ticket.site}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{ticket.id}</h3>
                <p className="mt-2 text-sm text-slate-600">{ticket.summary}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>{ticket.status}</span><span>Tecnico: {ticket.assignedTo}</span></div>
              </article>
            ))}
          </div>
        </section>

        {selectedTicket && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 p-3 sm:p-4">
            <div className="flex min-h-full items-center justify-center">
              <div className="w-full max-w-7xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
                <div className="max-h-[calc(100vh-1.5rem)] overflow-y-auto p-4 sm:max-h-[calc(100vh-2rem)] sm:p-6">
                  <div className="space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">{selectedTicket.site}</p>
                        <h3 className="text-2xl font-semibold text-slate-900">{selectedTicket.id}</h3>
                        <p className="mt-2 text-sm text-slate-600">{selectedTicket.summary}</p>
                      </div>
                      <button onClick={closePlanningModal} className="text-sm font-semibold text-slate-500 transition hover:text-slate-700">Cerrar</button>
                    </div>
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.6fr)]">
                      <div className="space-y-6 xl:min-w-0">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Informacion del ticket</p>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl bg-white p-4"><p className="text-[11px] uppercase tracking-wide text-slate-400">Creado</p><p className="mt-2 text-sm font-semibold text-slate-900">{selectedTicket.createdAt}</p></div>
                            <div className="rounded-2xl bg-white p-4"><p className="text-[11px] uppercase tracking-wide text-slate-400">SLA</p><p className="mt-2 text-sm font-semibold text-slate-900">{selectedTicket.slaDue}</p></div>
                            <div className="rounded-2xl bg-white p-4"><p className="text-[11px] uppercase tracking-wide text-slate-400">Solicitado por</p><p className="mt-2 text-sm font-semibold text-slate-900">{selectedTicket.requestedBy}</p></div>
                            <div className="rounded-2xl bg-white p-4"><p className="text-[11px] uppercase tracking-wide text-slate-400">Prioridad</p><p className="mt-2 text-sm font-semibold text-slate-900">{selectedTicket.priority}</p></div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">{selectedTicket.tags.map((tag) => <span key={`${selectedTicket.id}-${tag}`} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">{tag}</span>)}</div>
                        </div>
                        <div className="planning-calendar h-[460px] sm:h-[560px] lg:h-[680px] xl:h-[760px] rounded-3xl border border-slate-200 bg-white p-4">
                          <Calendar
                            localizer={calendarLocalizer}
                            culture="es"
                            events={planningCalendarEvents}
                            views={["month"]}
                            defaultView="month"
                            selectable
                            popup
                            date={selectedCalendarDate}
                            onNavigate={(date: Date) => setScheduledDate(formatDate(startOfDay(date), "yyyy-MM-dd"))}
                            onSelectSlot={handleSelectCalendarSlot}
                            onSelectEvent={(event: PlanningCalendarEvent) => setScheduledDate(formatDate(startOfDay(event.start), "yyyy-MM-dd"))}
                            messages={calendarMessages}
                            dayPropGetter={(date: Date) => {
                              const isSelected = isSameDay(date, selectedCalendarDate);
                              const isPast = startOfDay(date) < startOfDay(new Date());
                              return { className: isSelected ? "rbc-day-selected" : isPast ? "rbc-day-past-disabled" : "" };
                            }}
                            eventPropGetter={(event: PlanningCalendarEvent) => ({
                              className: event.resource.id === selectedTicket.id ? "rbc-event-current" : "rbc-event-planned",
                            })}
                            style={{ height: "100%" }}
                          />
                        </div>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-4 xl:self-start">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Planificar levantamiento</p>
                        <div className="mt-4 space-y-4">
                          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                            <span className="block text-[11px] uppercase tracking-wide text-slate-400">Fecha elegida</span>
                            <span className="mt-1 block font-semibold text-slate-900">{formatDate(selectedCalendarDate, "dd 'de' MMMM yyyy", { locale: es })}</span>
                          </div>
                          <label className="block space-y-2 text-sm text-slate-600">
                            <span>Fecha manual</span>
                            <input type="date" min={getTodayDate()} value={scheduledDate} onChange={(event) => setScheduledDate(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-900 focus:outline-none" />
                          </label>
                          <label className="block space-y-2 text-sm text-slate-600">
                            <span>Tecnicos disponibles</span>
                            <select value={selectedTechnicianId} onChange={(event) => setSelectedTechnicianId(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-900 focus:outline-none">
                              {availableTechnicians.length > 0 ? availableTechnicians.map((tech) => <option key={tech.id} value={tech.id}>{tech.name} · {tech.role} · {tech.location}</option>) : <option value="">No hay tecnicos disponibles</option>}
                            </select>
                          </label>
                          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                            {selectedTechnicianId ? (() => {
                              const selectedTechnician = technicians.find((tech) => tech.id === selectedTechnicianId);
                              return selectedTechnician ? <div className="space-y-2"><p className="font-semibold text-slate-900">{selectedTechnician.name}</p><p>{selectedTechnician.role}</p><p>{selectedTechnician.location}</p><p>Disponible: {selectedTechnician.nextAvailable}</p></div> : <p>Selecciona un tecnico para ver el detalle.</p>;
                            })() : <p>No hay tecnicos disponibles para asignar en este momento.</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                      <button onClick={closePlanningModal} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Cancelar</button>
                      <button onClick={handleSavePlan} disabled={!selectedTechnicianId || !scheduledDate} className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">Guardar planificacion</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPageShell>
  );
};

export default AdminSupportScreen;
