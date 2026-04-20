import { Calendar, dateFnsLocalizer, type SlotInfo } from "react-big-calendar";
import type { AdminManagedUser, AdminTicket } from "../../types/types";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

type PlanningEvent = {
  title: string;
  start: Date;
  end: Date;
  resource: AdminTicket;
};

type Props = {
  isOpen: boolean;
  ticket: AdminTicket | null;
  date: Date;
  technicians: AdminManagedUser[];
  events: PlanningEvent[];
  selectedTechnicianId: string;
  scheduledDate: string;
  onClose: () => void;
  onSave: () => void;
  onSelectSlot: (slotInfo: SlotInfo) => void;
  setScheduledDate: (value: string) => void;
  setSelectedTechnicianId: (value: string) => void;
};

const calendarMessages = {
  next: "Sig.",
  previous: "Ant.",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  noEventsInRange: "No hay eventos",
};

export const calendarLocalizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { locale: es }),
  getDay,
  locales: { es },
});

export const PlanningModal = ({
  isOpen,
  ticket,
  date,
  technicians,
  selectedTechnicianId,
  scheduledDate,
  events,
  onClose,
  onSave,
  onSelectSlot,
  setScheduledDate,
  setSelectedTechnicianId,
}: Props) => {
  if (!isOpen || !ticket) return null;

  const selectedTechnician =
    technicians.find((technician) => technician.id === selectedTechnicianId) ??
    null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 p-3 sm:p-4">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-7xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
          <div className="max-h-[calc(100vh-2rem)] overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {ticket.site}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                    Planificar ticket {ticket.id}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm text-slate-600">
                    {ticket.summary}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cerrar
                </button>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.6fr_0.7fr]">
                <div className="space-y-6">
                  <div className="planning-calendar h-150 rounded-3xl border border-slate-200 p-4">
                    <Calendar<PlanningEvent>
                      localizer={calendarLocalizer}
                      culture="es"
                      date={date}
                      events={events}
                      selectable
                      popup
                      views={["month"]}
                      defaultView="month"
                      onSelectSlot={onSelectSlot}
                      onSelectEvent={(event) => {
                        setScheduledDate(format(event.start, "yyyy-MM-dd"));
                      }}
                      messages={calendarMessages}
                      dayPropGetter={(day) => {
                        const isPast = day < new Date();
                        return {
                          className: isPast ? "rbc-day-past-disabled" : "",
                        };
                      }}
                      eventPropGetter={(event) => ({
                        className:
                          event.resource.id === ticket.id
                            ? "rbc-event-current"
                            : "rbc-event-planned",
                      })}
                      style={{ height: "100%" }}
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-slate-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                    Asignacion
                  </p>

                  <div>
                    <label
                      htmlFor="planning-date"
                      className="text-sm font-semibold text-slate-900"
                    >
                      Fecha
                    </label>
                    <input
                      id="planning-date"
                      type="date"
                      value={scheduledDate}
                      onChange={(event) => setScheduledDate(event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="planning-technician"
                      className="text-sm font-semibold text-slate-900"
                    >
                      Tecnico
                    </label>
                    <select
                      id="planning-technician"
                      value={selectedTechnicianId}
                      onChange={(event) => setSelectedTechnicianId(event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                    >
                      {technicians.length === 0 && (
                        <option value="">No hay tecnicos disponibles</option>
                      )}
                      {technicians.map((technician) => (
                        <option key={technician.id} value={technician.id}>
                          {technician.name} - {technician.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    {selectedTechnician ? (
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900">
                          {selectedTechnician.name}
                        </p>
                        <p>{selectedTechnician.email}</p>
                        <p>{selectedTechnician.phone}</p>
                      </div>
                    ) : (
                      <p>Selecciona un tecnico para completar la asignacion.</p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">Solicitado por</p>
                    <p className="mt-1">{ticket.requestedBy}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  onClick={onClose}
                  className="rounded-2xl border border-slate-200 px-4 py-2"
                >
                  Cancelar
                </button>

                <button
                  onClick={onSave}
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
                >
                  Guardar planificacion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
