import React from "react";
import { useAdminPreProjectOverview } from "../../hooks/use-admin-dashboard";
import { useAdminTicketPlanning } from "../../hooks/use-admin-ticket-planning";
import AdminPageShell from "../../components/AdminPageShell";

const AdminPreProjectScreen: React.FC = () => {
  const { data, error } = useAdminPreProjectOverview();
  const { state } = useAdminTicketPlanning();

  const surveys = data?.surveys ?? [];
  const recommendations = data?.storageRecommendations ?? [];
  const plannedTickets = state.planningQueue;

  return (
    <AdminPageShell
      tag="Planificacion"
      title="Planeacion tecnica"
      subtitle="Los tickets planificados llegan aqui para coordinar el levantamiento antes de la instalacion."
    >
      <div className="space-y-6">
        {error && <p className="text-sm text-rose-600">{error}</p>}

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tickets enviados desde soporte
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Levantamientos por ejecutar
              </h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {plannedTickets.length} en planificacion
            </span>
          </div>

          {plannedTickets.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {plannedTickets.map((ticket) => (
                <article
                  key={ticket.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {ticket.site}
                      </p>
                      <h3 className="text-xl font-semibold text-slate-900">{ticket.id}</h3>
                    </div>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-semibold text-indigo-700">
                      {ticket.status}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">{ticket.summary}</p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        Fecha de levantamiento
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {ticket.scheduledDate || "Pendiente"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        Tecnico asignado
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {ticket.assignedTo}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      Dispositivos del ticket
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700">
                      {ticket.devices.map((device) => (
                        <li
                          key={`${ticket.id}-${device.name}`}
                          className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
                        >
                          <span>
                            {device.quantity} x {device.name}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {device.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              Todavia no hay tickets planificados desde la vista de Tickets.
            </p>
          )}
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          {surveys.map((survey) => (
            <article
              key={survey.site}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Sitio objetivo
                  </p>
                  <h3 className="text-xl font-semibold text-slate-900">{survey.site}</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {survey.timeline}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">Zona: {survey.zone}</p>
              <p className="mt-2 text-sm text-slate-600">Objetivo: {survey.objective}</p>
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <p>Mediciones: {survey.measurements}</p>
                <p>Red y electrico: {survey.networkStatus}</p>
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Riesgos
                </p>
                <ul className="space-y-1 text-sm text-slate-600">
                  {survey.risks.map((risk) => (
                    <li key={risk} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-3 text-sm text-slate-700">Proximos pasos: {survey.nextSteps}</p>
            </article>
          ))}
        </div>

        <section className="space-y-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-slate-900">
              Requerimientos de grabacion
            </h2>
            <p className="text-sm text-slate-600">
              Recomendaciones automaticas de NVR, discos y retencion para cada levantamiento.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((item, index) => (
              <article
                key={`${item.nvr}-${index}`}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{item.resolution}</h3>
                  <span className="text-xs font-semibold text-slate-500">{item.codec}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {item.cameras} camaras · Retencion {item.retentionDays} dias
                </p>
                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  <p>Disco recomendado: {item.recommendedDisk}</p>
                  <p>NVR ideal: {item.nvr}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AdminPageShell>
  );
};

export default AdminPreProjectScreen;
