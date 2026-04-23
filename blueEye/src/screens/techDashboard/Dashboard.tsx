import React, { useMemo } from "react";
import { Link } from "react-router-dom";
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
      .sort((a, b) =>
        (b.updated_at ?? b.created_at ?? "").localeCompare(a.updated_at ?? a.created_at ?? ""),
      )
      .slice(0, 4);
  }, [data.surveys]);

  const siteNameById = useMemo(() => {
    const map = new Map<string, string>();
    data.sites.forEach((site) => {
      map.set(site.id, site.name ?? site.id);
    });
    return map;
  }, [data.sites]);

  const surveyDrafts = data.surveys.filter(
    (survey) => (survey.status ?? "draft") === "draft",
  ).length;
  const surveySubmitted = data.surveys.filter(
    (survey) => survey.status === "submitted",
  ).length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8">
      <section className="overflow-hidden rounded-[34px] border border-slate-200/80 bg-white/90 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur-sm">
        <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.25fr_0.75fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
              Operacion tecnica
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
              Centro de trabajo del tecnico
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Revisa tus asignaciones, organiza visitas y lleva el seguimiento de
              levantamientos y sitios desde un panel mas claro y centrado.
            </p>
          </div>

          <div className="grid gap-3 self-start rounded-[28px] border border-sky-100 bg-sky-50/70 p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Hoy
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {data.tickets.length}
                </p>
                <p className="mt-1 text-sm text-slate-500">tickets activos</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Alertas
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {notifications.unreadCount}
                </p>
                <p className="mt-1 text-sm text-slate-500">sin leer</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/techDashboard/tickets"
                className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
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
        </div>
      </section>

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
        <div className="rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Tickets</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{data.tickets.length}</p>
          <p className="mt-2 text-sm text-slate-600">
            {ticketsByStatus["en progreso"]} en progreso y {ticketsByStatus.iniciado} iniciados
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Finalizados</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {ticketsByStatus.finalizado}
          </p>
          <p className="mt-2 text-sm text-slate-600">{ticketsByStatus.cancelado} cancelados</p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Sitios</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{data.sites.length}</p>
          <p className="mt-2 text-sm text-slate-600">Activos en tu empresa</p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Levantamientos</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{data.surveys.length}</p>
          <p className="mt-2 text-sm text-slate-600">
            {surveyDrafts} borradores y {surveySubmitted} enviados
          </p>
        </div>
      </div>

      <div className="mt-6">
        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[30px] border border-slate-200 bg-white/95 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-950">Proximos tickets</h2>
              {isLoading && <p className="text-xs text-slate-500">Cargando...</p>}
            </div>

            {upcomingTickets.length === 0 && !isLoading ? (
              <p className="mt-3 text-sm text-slate-600">No hay tickets con fecha programada.</p>
            ) : (
              <div className="mt-4 grid gap-3">
                {upcomingTickets.map((ticket) => (
                  <article
                    key={ticket.id}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
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
                      <div className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700">
                        {formatDate(ticket.scheduled_date)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white/95 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-950">Ultimos levantamientos</h2>
              {isLoading && <p className="text-xs text-slate-500">Cargando...</p>}
            </div>

            {recentSurveys.length === 0 && !isLoading ? (
              <p className="mt-3 text-sm text-slate-600">Aun no hay levantamientos.</p>
            ) : (
              <div className="mt-4 grid gap-3">
                {recentSurveys.map((survey) => (
                  <div
                    key={survey.id}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      {survey.status ?? "draft"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-950">
                      {survey.title ?? "Levantamiento tecnico"}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {survey.site_id
                        ? `Sitio: ${siteNameById.get(String(survey.site_id)) ?? survey.site_id}`
                        : "Sitio: -"}
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
      </div>
    </div>
  );
};

export default TechDashboard;
