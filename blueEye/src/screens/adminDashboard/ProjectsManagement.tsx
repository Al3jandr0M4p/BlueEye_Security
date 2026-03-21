import React from "react";
import {
  ClipboardCheck,
  FileText,
  FolderKanban,
  MapPinned,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { useAdminProjectOverview } from "../../hooks/use-admin-dashboard";
import AdminPageShell from "../../components/AdminPageShell";

const phaseColors = ["bg-slate-900", "bg-sky-600", "bg-emerald-600", "bg-amber-500"];

const AdminProjectsScreen: React.FC = () => {
  const { data, error } = useAdminProjectOverview();
  const phases = data?.phaseStats ?? [];
  const activeProjects = data?.activeProjects ?? [];
  const surveyReports = data?.surveyReports ?? [];

  return (
    <AdminPageShell
      tag="Proyectos"
      title="Gestion de proyectos"
      subtitle="Da seguimiento a fases activas y revisa los levantamientos tecnicos completados antes de ejecutar."
    >
      <div className="space-y-8">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Pipeline del proyecto
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                Levantamientos tecnicos y ejecucion en una sola vista
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Ahora esta pantalla muestra no solo el estado del proyecto, sino también
                los tickets donde el técnico ya hizo el levantamiento y toda la información
                recolectada en sitio.
              </p>
              {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <article className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Proyectos</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{data?.projectCount ?? 0}</p>
              </article>
              <article className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Levantamientos</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{surveyReports.length}</p>
              </article>
              <article className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Activos</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{activeProjects.length}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {phases.map((phase, index) => (
            <article
              key={phase.phase}
              className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-600">{phase.phase}</p>
                <span className="text-xs font-semibold text-slate-400">
                  {phase.count} proyectos
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{phase.completion}%</p>
              <div className="mt-4 h-2 rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${phaseColors[index % phaseColors.length]}`}
                  style={{ width: `${Math.min(phase.completion, 100)}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-500">Avance estimado por fase operativa.</p>
            </article>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-5 w-5 text-slate-700" />
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Levantamientos completados por el tecnico
              </h2>
              <p className="text-sm text-slate-600">
                Tickets ya visitados con el detalle completo de lo recolectado en el lugar.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {surveyReports.map((report) => (
              <article
                key={report.ticketId}
                className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm"
              >
                <div className="border-b border-slate-100 bg-slate-50 px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                        {report.ticketId}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                        {report.projectName}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">{report.client}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {report.status}
                      </span>
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                        {report.surveyDate}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-600">
                    {report.summary}
                  </p>
                </div>

                <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-[11px] uppercase tracking-wide text-slate-400">Sitio</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{report.site}</p>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-[11px] uppercase tracking-wide text-slate-400">Tipo de lugar</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{report.placeType}</p>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-[11px] uppercase tracking-wide text-slate-400">Tecnico</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{report.technician}</p>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:col-span-3">
                        <p className="text-[11px] uppercase tracking-wide text-slate-400">Siguiente paso</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{report.nextStep}</p>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <section className="rounded-3xl border border-slate-200 bg-white p-5">
                        <div className="flex items-center gap-3">
                          <MapPinned className="h-4 w-4 text-slate-700" />
                          <h4 className="text-sm font-semibold text-slate-900">Cobertura levantada</h4>
                        </div>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                          {report.zoneCoverage.map((item) => (
                            <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </section>

                      <section className="rounded-3xl border border-slate-200 bg-white p-5">
                        <div className="flex items-center gap-3">
                          <Wrench className="h-4 w-4 text-slate-700" />
                          <h4 className="text-sm font-semibold text-slate-900">Infraestructura observada</h4>
                        </div>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                          {report.infrastructure.map((item) => (
                            <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </section>
                    </div>

                    <section className="rounded-3xl border border-slate-200 bg-white p-5">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-slate-700" />
                        <h4 className="text-sm font-semibold text-slate-900">Cotizacion generada por IA</h4>
                      </div>
                      <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="space-y-4">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                              <p className="text-[11px] uppercase tracking-wide text-slate-400">Generada para</p>
                              <p className="mt-2 text-sm font-semibold text-slate-900">{report.aiQuote.generatedFor}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                              <p className="text-[11px] uppercase tracking-wide text-slate-400">Complejidad</p>
                              <p className="mt-2 text-sm font-semibold text-slate-900">{report.aiQuote.complexity}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                              <p className="text-[11px] uppercase tracking-wide text-slate-400">Tiempo estimado</p>
                              <p className="mt-2 text-sm font-semibold text-slate-900">{report.aiQuote.estimatedTime}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-900 p-4 text-white">
                              <p className="text-[11px] uppercase tracking-wide text-slate-300">Total IA</p>
                              <p className="mt-2 text-lg font-semibold">{report.aiQuote.total}</p>
                            </div>
                          </div>
                          <div className="rounded-2xl bg-sky-50 p-4">
                            <p className="text-[11px] uppercase tracking-wide text-slate-400">Alcance</p>
                            <p className="mt-2 text-sm text-slate-700">{report.aiQuote.scope}</p>
                          </div>
                          <div className="rounded-2xl bg-emerald-50 p-4">
                            <p className="text-[11px] uppercase tracking-wide text-slate-400">Razonamiento de la IA</p>
                            <p className="mt-2 text-sm text-slate-700">{report.aiQuote.rationale}</p>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                              <p className="text-[11px] uppercase tracking-wide text-slate-400">Subtotal</p>
                              <p className="mt-2 text-sm font-semibold text-slate-900">{report.aiQuote.subtotal}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                              <p className="text-[11px] uppercase tracking-wide text-slate-400">Instalacion</p>
                              <p className="mt-2 text-sm font-semibold text-slate-900">{report.aiQuote.installation}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                              <p className="text-[11px] uppercase tracking-wide text-slate-400">Ajuste IA</p>
                              <p className="mt-2 text-sm font-semibold text-slate-900">{report.aiQuote.aiAdjustment}</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-[11px] uppercase tracking-wide text-slate-400">Partidas sugeridas</p>
                          <div className="mt-4 space-y-3">
                            {report.aiQuote.lineItems.map((item) => (
                              <div
                                key={`${report.ticketId}-${item.concept}`}
                                className="grid gap-3 rounded-2xl bg-white p-4 sm:grid-cols-[1fr_auto_auto]"
                              >
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">{item.concept}</p>
                                  <p className="text-xs text-slate-500">Cantidad: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-semibold text-slate-700">{item.unitPrice}</p>
                                <p className="text-sm font-semibold text-slate-900">{item.subtotal}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-5">
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="h-4 w-4 text-rose-600" />
                        <h4 className="text-sm font-semibold text-slate-900">Riesgos y recomendaciones</h4>
                      </div>
                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-slate-400">Riesgos detectados</p>
                          <ul className="mt-3 space-y-2 text-sm text-slate-600">
                            {report.risks.map((risk) => (
                              <li key={risk} className="rounded-2xl bg-rose-50 px-4 py-3 text-rose-800">
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-slate-400">Recomendaciones</p>
                          <ul className="mt-3 space-y-2 text-sm text-slate-600">
                            {report.recommendations.map((item) => (
                              <li key={item} className="rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-800">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-5">
                    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        Evidencia tecnica
                      </p>
                      <div className="mt-4 grid gap-3">
                        {report.evidence.map((item) => (
                          <div
                            key={`${report.ticketId}-${item.label}`}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                          >
                            <p className="text-[11px] uppercase tracking-wide text-slate-400">{item.label}</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        Checklist del levantamiento
                      </p>
                      <div className="mt-4 space-y-2">
                        {report.checklist.map((item) => (
                          <div
                            key={`${report.ticketId}-${item.label}`}
                            className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
                          >
                            <span className="text-sm text-slate-700">{item.label}</span>
                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                                item.status === "Completo"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        Equipos propuestos
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {report.proposedDevices.map((device) => (
                          <span
                            key={`${report.ticketId}-${device}`}
                            className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                          >
                            {device}
                          </span>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <FolderKanban className="h-5 w-5 text-slate-700" />
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Proyectos activos</h2>
              <p className="text-sm text-slate-600">
                Revisa el siguiente hito, notas tecnicas y fechas de entrega.
              </p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {activeProjects.map((project) => (
              <article
                key={project.name}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Cliente
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{project.name}</h3>
                    <p className="text-sm text-slate-600">{project.client}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {project.status}
                  </span>
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-900">Proximo hito:</span> {project.nextMilestone}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Notas:</span> {project.notes}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Entrega:</span> {project.dueDate}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AdminPageShell>
  );
};

export default AdminProjectsScreen;
