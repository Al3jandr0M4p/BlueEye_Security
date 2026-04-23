import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import type { AdminTicket } from "../../types/types";
import type {
  PlanningCalendarEvent,
  PlanningDayAssignment,
  TechnicianPlanningCard,
} from "../../hooks/usePlanningCalendar";
import "../../styles/admin-planning-calendar.css";

const fallbackTicketImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?fit=crop&w=900&q=60";

type Props = {
  isOpen: boolean;
  ticket: AdminTicket | null;
  technicians: TechnicianPlanningCard[];
  events: PlanningCalendarEvent[];
  selectedDateAssignments: PlanningDayAssignment[];
  selectedTechnicianId: string;
  scheduledDate: string;
  onClose: () => void;
  onSave: () => void;
  onDateSelect: (value: string) => void;
  onCalendarEventSelect: (dateValue: string, technicianId?: string | null) => void;
  setSelectedTechnicianId: (value: string) => void;
  formatScheduledDateLabel: (value: string) => string;
};

const today = new Date().toISOString().split("T")[0];

export const PlanningModal = ({
  isOpen,
  ticket,
  technicians,
  events,
  selectedDateAssignments,
  selectedTechnicianId,
  scheduledDate,
  onClose,
  onSave,
  onDateSelect,
  onCalendarEventSelect,
  setSelectedTechnicianId,
  formatScheduledDateLabel,
}: Props) => {
  if (!isOpen || !ticket) return null;

  const selectedTechnician =
    technicians.find(
      (technician) => String(technician.id) === selectedTechnicianId,
    ) ?? null;
  const availableTechnicians = technicians.filter((technician) => technician.isSelectable);
  const busyTechnicians = technicians.filter((technician) => !technician.isSelectable);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 p-3 sm:p-4">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-[1500px] overflow-hidden rounded-[32px] bg-white shadow-2xl">
          <div className="max-h-[calc(100vh-2rem)] overflow-y-auto p-6 sm:p-8">
            <div className="space-y-6">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <span className="inline-flex w-fit rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">
                    Planificacion de ticket
                  </span>
                  <div className="grid gap-4 lg:grid-cols-[220px_1fr] lg:items-start">
                    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
                      <img
                        src={ticket.image || fallbackTicketImage}
                        alt={`Evidencia del ticket ${ticket.id}`}
                        className="h-52 w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {ticket.site}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
                        Ticket {ticket.id}
                      </h3>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                        {ticket.summary}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="grid min-w-[220px] gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Dia seleccionado
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-950">
                        {formatScheduledDateLabel(scheduledDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Disponibilidad
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-950">
                        {availableTechnicians.length} tecnicos libres
                      </p>
                      <p className="text-xs text-slate-500">
                        {busyTechnicians.length} ocupados ese dia
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
                <div className="space-y-6">
                  <section className="planning-calendar rounded-[30px] border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Calendario operativo
                        </p>
                        <h4 className="mt-1 text-lg font-semibold text-slate-950">
                          Elige el dia y revisa la carga existente
                        </h4>
                      </div>

                      <label className="text-sm font-medium text-slate-600">
                        Fecha manual
                        <input
                          type="date"
                          min={today}
                          value={scheduledDate}
                          onChange={(event) => onDateSelect(event.target.value)}
                          className="mt-2 block rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-400"
                        />
                      </label>
                    </div>

                    <FullCalendar
                      plugins={[dayGridPlugin, interactionPlugin]}
                      initialView="dayGridMonth"
                      locale={esLocale}
                      height="auto"
                      fixedWeekCount={false}
                      validRange={{ start: today }}
                      headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "",
                      }}
                      buttonText={{ today: "Hoy" }}
                      events={events}
                      dateClick={(info) => onDateSelect(info.dateStr)}
                      eventClick={(info) =>
                        onCalendarEventSelect(
                          info.event.startStr,
                          String(info.event.extendedProps.technicianId ?? ""),
                        )
                      }
                      dayCellClassNames={(arg) => {
                        const classNames: string[] = [];
                        if (arg.dateStr === scheduledDate) {
                          classNames.push("planning-day-selected");
                        }
                        if (arg.dateStr < today) {
                          classNames.push("planning-day-disabled");
                        }
                        return classNames;
                      }}
                      eventContent={(arg) => {
                        const technicianName = String(
                          arg.event.extendedProps.technicianName ?? "",
                        );

                        return (
                          <div className="planning-event-chip">
                            <strong>{arg.event.extendedProps.ticket.id}</strong>
                            <span>{technicianName}</span>
                          </div>
                        );
                      }}
                    />
                  </section>

                  <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Carga del dia
                        </p>
                        <h4 className="mt-1 text-lg font-semibold text-slate-950">
                          Tickets ya planificados para {formatScheduledDateLabel(scheduledDate)}
                        </h4>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {selectedDateAssignments.length} asignaciones
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3">
                      {selectedDateAssignments.length > 0 ? (
                        selectedDateAssignments.map((assignment) => (
                          <article
                            key={assignment.ticket.id}
                            className={`rounded-[22px] border p-4 transition ${
                              assignment.ticket.id === ticket.id
                                ? "border-sky-300 bg-sky-50"
                                : "border-slate-200 bg-slate-50"
                            }`}
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="text-sm font-semibold text-slate-950">
                                  {assignment.ticket.id} · {assignment.ticket.site}
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                  {assignment.ticket.summary}
                                </p>
                              </div>
                              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                                {assignment.technicianName}
                              </span>
                            </div>
                          </article>
                        ))
                      ) : (
                        <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                          Ese dia todavia no tiene tickets asignados. Es una buena oportunidad
                          para distribuir la carga.
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                <div className="space-y-5">
                  <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Tecnicos disponibles
                    </p>
                    <h4 className="mt-2 text-xl font-semibold text-slate-950">
                      Selecciona quien tomara el ticket
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Las tarjetas marcadas como disponibles pueden asignarse de inmediato para
                      el dia elegido. Si el ticket ya estaba asignado, su tecnico actual sigue
                      habilitado para reprogramar.
                    </p>

                    <div className="mt-5 space-y-3">
                      {technicians.length > 0 ? (
                        technicians.map((technician) => {
                          const technicianId = String(technician.id);
                          const isSelected = technicianId === selectedTechnicianId;

                          return (
                            <button
                              key={technician.id}
                              type="button"
                              onClick={() =>
                                technician.isSelectable &&
                                setSelectedTechnicianId(technicianId)
                              }
                              disabled={!technician.isSelectable}
                              className={`w-full rounded-[24px] border p-4 text-left transition ${
                                isSelected
                                  ? "border-sky-400 bg-sky-50 shadow-sm"
                                  : technician.isSelectable
                                    ? "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/40"
                                    : "border-slate-200 bg-slate-100 opacity-70"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-base font-semibold text-slate-950">
                                    {technician.name}
                                  </p>
                                  <p className="mt-1 text-sm text-slate-600">
                                    {technician.email}
                                  </p>
                                </div>

                                <span
                                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] ${
                                    technician.isSelectable
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-amber-100 text-amber-700"
                                  }`}
                                >
                                  {technician.isSelectable ? "Disponible" : "Ocupado"}
                                </span>
                              </div>

                              <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
                                <span className="rounded-full bg-slate-100 px-3 py-2">
                                  {technician.assignmentCount} tickets activos
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-2">
                                  {technician.assignmentsOnSelectedDate} ese dia
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-2">
                                  Proximo: {technician.nextAssignmentDate ?? "Libre"}
                                </span>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                          No hay tecnicos cargados para esta empresa todavia.
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="rounded-[30px] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/80">
                      Resumen final
                    </p>

                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                          Ticket
                        </p>
                        <p className="mt-1 text-lg font-semibold">{ticket.id}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                          Fecha asignada
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                          {formatScheduledDateLabel(scheduledDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                          Tecnico elegido
                        </p>
                        {selectedTechnician ? (
                          <div className="mt-1 space-y-1">
                            <p className="text-lg font-semibold">{selectedTechnician.name}</p>
                            <p className="text-sm text-slate-300">{selectedTechnician.email}</p>
                            <p className="text-sm text-slate-300">{selectedTechnician.phone}</p>
                          </div>
                        ) : (
                          <p className="mt-1 text-sm text-slate-300">
                            Selecciona un tecnico disponible para continuar.
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                          Solicitado por
                        </p>
                        <p className="mt-1 text-sm text-slate-300">{ticket.requestedBy}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <button
                        onClick={onClose}
                        className="rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/30"
                      >
                        Cancelar
                      </button>

                      <button
                        onClick={onSave}
                        disabled={!selectedTechnician}
                        className="rounded-2xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                      >
                        Guardar planificacion
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
