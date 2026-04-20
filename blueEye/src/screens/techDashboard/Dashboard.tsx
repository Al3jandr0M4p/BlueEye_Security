import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import TechNotificationsPanel from "../../components/techNotifications/TechNotificationsPanel";
import { useTechNotifications } from "../../hooks/use-tech-notifications";
import { useTechOverview } from "../../hooks/use-tech-overview";

function formatDate(value?: string | null) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("es-DO", { dateStyle: "medium", timeStyle: "short" });
}

const TechDashboard: React.FC = () => {
  const { data, error, isLoading, load, ticketsByStatus } = useTechOverview();
  const notifications = useTechNotifications();

  const upcomingTickets = useMemo(() => {
    return [...data.tickets]
      .filter((ticket) => Boolean(ticket.scheduled_date))
      .sort((a, b) => (a.scheduled_date ?? "").localeCompare(b.scheduled_date ?? ""))
      .slice(0, 5);
  }, [data.tickets]);

  const recentSurveys = useMemo(() => {
    return [...data.surveys]
      .sort((a, b) => (b.updated_at ?? b.created_at ?? "").localeCompare(a.updated_at ?? a.created_at ?? ""))
      .slice(0, 4);
  }, [data.surveys]);

  const siteNameById = useMemo(() => {
    const map = new Map<string, string>();
    data.sites.forEach((site) => {
      map.set(site.id, site.name ?? site.id);
    });
    return map;
  }, [data.sites]);

  const surveyDrafts = data.surveys.filter((survey) => (survey.status ?? "draft") === "draft").length;
  const surveySubmitted = data.surveys.filter((survey) => survey.status === "submitted").length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Operacion tecnica
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Panel del tecnico
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Aqui ves tus tickets asignados por el admin, el estado de tus levantamientos y las notificaciones nuevas.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/techDashboard/tickets"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Ver tickets
          </Link>
          <Link
            to="/techDashboard/levantamientos"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Levantamientos
          </Link>
          <Link
            to="/techDashboard/sitios"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Sitios
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
          <button
            type="button"
            onClick={() => void load()}
            className="ml-3 rounded-lg bg-rose-700/10 px-2 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-700/15"
          >
            Reintentar
          </button>
        </div>
      )}

      {notifications.error && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {notifications.error}
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tickets</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{data.tickets.length}</p>
          <p className="mt-2 text-sm text-slate-600">
            {ticketsByStatus["en progreso"]} en progreso y {ticketsByStatus.iniciado} iniciados
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Finalizados</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{ticketsByStatus.finalizado}</p>
          <p className="mt-2 text-sm text-slate-600">{ticketsByStatus.cancelado} cancelados</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sitios</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{data.sites.length}</p>
          <p className="mt-2 text-sm text-slate-600">Activos en tu empresa</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Notificaciones</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{notifications.unreadCount}</p>
          <p className="mt-2 text-sm text-slate-600">Asignaciones nuevas del admin</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="grid gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Proximos tickets</h2>
              {isLoading && <p className="text-xs text-slate-500">Cargando...</p>}
            </div>

            {upcomingTickets.length === 0 && !isLoading ? (
              <p className="mt-3 text-sm text-slate-600">No hay tickets con fecha programada.</p>
            ) : (
              <div className="mt-4 grid gap-3">
                {upcomingTickets.map((ticket) => (
                  <article key={ticket.id} className="rounded-2xl border border-slate-200 px-4 py-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {ticket.site ?? "Sitio"}
                          {ticket.equipment ? ` - ${ticket.equipment}` : ""}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                          {ticket.content_description ?? "Sin descripcion"}
                        </p>
                        <div className="mt-3 grid gap-1 text-xs text-slate-500">
                          <span>Admin: {ticket.admin_name ?? "Admin"}</span>
                          <span>Cliente: {ticket.requester_name ?? "Cliente"}</span>
                        </div>
                      </div>
                      <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                        {formatDate(ticket.scheduled_date)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Ultimos levantamientos</h2>
              {isLoading && <p className="text-xs text-slate-500">Cargando...</p>}
            </div>

            {recentSurveys.length === 0 && !isLoading ? (
              <p className="mt-3 text-sm text-slate-600">Aun no hay levantamientos.</p>
            ) : (
              <div className="mt-4 grid gap-3">
                {recentSurveys.map((survey) => (
                  <div key={survey.id} className="rounded-2xl border border-slate-200 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {survey.status ?? "draft"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {survey.title ?? "Levantamiento tecnico"}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {survey.site_id ? `Sitio: ${siteNameById.get(String(survey.site_id)) ?? survey.site_id}` : "Sitio: -"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {surveyDrafts} borradores y {surveySubmitted} enviados en total
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
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

export default TechDashboard;
