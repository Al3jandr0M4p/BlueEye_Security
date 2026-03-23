import { Calendar, dateFnsLocalizer, type SlotInfo } from "react-big-calendar";
import type { AdminTicket } from "../../types/types";
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
//   technicians: AdminTechnician[];
  events: PlanningEvent[];

  selectedTechnicianId: string;
  scheduledDate: string;

  onClose: () => void;
  onSave: () => void;
  onSelectSlot: (slotInfo: SlotInfo) => void;

  setScheduledDate: (v: string) => void;
//   setSelectedTechnicianId: (v: string) => void;
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

// eslint-disable-next-line react-refresh/only-export-components
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
//   technicians,
//   selectedTechnicianId,
  scheduledDate,
  events,
  onClose,
  onSave,
  onSelectSlot,
  setScheduledDate,
//   setSelectedTechnicianId,
}: Props) => {
  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 p-3 sm:p-4">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-7xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
          <div className="max-h-[calc(100vh-2rem)] overflow-y-auto p-6">
            <div className="space-y-6">
              {/* HEADER */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase text-slate-400">
                    {ticket.site}
                  </p>
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {ticket.id}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
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

              {/* GRID */}
              <div className="grid gap-6 xl:grid-cols-[1.6fr_0.6fr]">
                {/* CALENDAR */}
                <div className="space-y-6">
                  <div className="planning-calendar h-150 rounded-3xl border p-4">
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
                      dayPropGetter={(d) => {
                        const isPast = d < new Date();
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

                {/* SIDEBAR */}
                <div className="rounded-3xl border p-5 space-y-4">
                  <p className="text-xs font-semibold uppercase text-slate-600">
                    Planificar levantamiento
                  </p>

                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full rounded-2xl border px-4 py-3"
                  />

                  {/* <select
                    value={selectedTechnicianId}
                    onChange={(e) => setSelectedTechnicianId(e.target.value)}
                    className="w-full rounded-2xl border px-4 py-3"
                  >
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} · {t.role} · {t.location}
                      </option>
                    ))}
                  </select> */}

                  {/* INFO TECNICO */}
                  {/* <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                    {selectedTechnicianId ? (
                      (() => {
                        const tech = technicians.find(
                          (t) => t.id === selectedTechnicianId,
                        );

                        if (!tech) return <p>No encontrado</p>;

                        return (
                          <div className="space-y-1">
                            <p className="font-semibold">{tech.name}</p>
                            <p>{tech.role}</p>
                            <p>{tech.location}</p>
                            <p>Disponible: {tech.nextAvailable}</p>
                          </div>
                        );
                      })()
                    ) : (
                      <p>No hay técnicos disponibles</p>
                    )}
                  </div> */}
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  onClick={onClose}
                  className="rounded-2xl border px-4 py-2"
                >
                  Cancelar
                </button>

                <button
                  onClick={onSave}
                  className="rounded-2xl bg-indigo-800 text-white px-4 py-2"
                >
                  Guardar planificación
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
