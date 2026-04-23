import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTechSurveys } from "../../hooks/use-tech-surveys";
import type { TechSurveyStatus, TechTicket } from "../../types/tech.types";

const SurveysTechScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    addRequirement,
    addPoint,
    addUpdate,
    assignedTickets,
    catalogProducts,
    createSurvey,
    error,
    isLoading,
    points,
    requirements,
    saveSurvey,
    selectedSite,
    selectedSiteId,
    selectedSurveyId,
    setSelectedSiteId,
    setSelectedSurveyId,
    sites,
    startSurveyFromTicket,
    survey,
    surveys,
    uploadPhoto,
    updates,
  } = useTechSurveys();

  const [draft, setDraft] = useState({
    title: "",
    status: "draft" as TechSurveyStatus,
    objectives: "",
    risks: "",
    powerStatus: "",
    networkStatus: "",
    notes: "",
  });

  const [pointDraft, setPointDraft] = useState({
    zone: "",
    height: "",
    angle: "",
    cameraSuggestion: "",
    notes: "",
  });

  const [updateDraft, setUpdateDraft] = useState({
    status: "en campo",
    title: "",
    details: "",
  });

  const [requirementDraft, setRequirementDraft] = useState({
    productId: "",
    category: "camera",
    itemName: "",
    quantity: "1",
    unitPrice: "",
    installArea: "",
    notes: "",
  });

  React.useEffect(() => {
    if (!survey) return;
    setDraft({
      title: survey.title ?? "",
      status: (survey.status ?? "draft") as TechSurveyStatus,
      objectives: survey.objectives ?? "",
      risks: survey.risks ?? "",
      powerStatus: survey.power_status ?? "",
      networkStatus: survey.network_status ?? "",
      notes: survey.notes ?? "",
    });
  }, [survey]);

  const selectedSurvey = useMemo(
    () => surveys.find((item) => item.id === selectedSurveyId) ?? null,
    [selectedSurveyId, surveys],
  );
  const isSubmittedSurvey =
    (survey?.status ?? selectedSurvey?.status ?? draft.status) === "submitted";

  React.useEffect(() => {
    const pendingTicket = (location.state as { ticket?: TechTicket } | null)?.ticket;
    if (!pendingTicket?.id) return;

    void (async () => {
      await startSurveyFromTicket(pendingTicket);
      navigate(location.pathname, { replace: true, state: null });
    })();
  }, [location.pathname, location.state, navigate, startSurveyFromTicket]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Levantamientos</h1>
          <p className="mt-1 text-sm text-slate-600">
            Registra el levantamiento técnico por sitio y planifica puntos de cámara.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Tickets para empezar el levantamiento
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Los tickets planificados aparecen aqui para que abras o crees su levantamiento.
            </p>
          </div>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
            {assignedTickets.length} tickets
          </span>
        </div>

        {assignedTickets.length === 0 && !isLoading ? (
          <p className="mt-4 text-sm text-slate-600">
            No tienes tickets planificados listos para iniciar.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {assignedTickets.map((ticket) => (
              <article
                key={ticket.id}
                className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Ticket #{ticket.id}
                </p>
                <p className="mt-2 text-base font-semibold text-slate-950">
                  {ticket.site ?? "Sitio pendiente"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {ticket.equipment ?? "Sin equipo"}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {ticket.content_description ?? "Sin descripcion"}
                </p>
                <div className="mt-3 grid gap-1 text-xs text-slate-500">
                  <span>Cliente: {ticket.requester_name ?? "Cliente"}</span>
                  <span>Admin: {ticket.admin_name ?? "Admin"}</span>
                  <span>Fecha: {ticket.scheduled_date ?? "Sin fecha"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => void startSurveyFromTicket(ticket)}
                  className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  disabled={isLoading}
                >
                  Empezar levantamiento
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedSurvey && (
        <section className="mt-6 grid gap-4 xl:grid-cols-4">
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Sitio</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {selectedSite?.name ?? selectedSurvey.title ?? "Sin sitio"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {selectedSite?.client_name ?? "Cliente no identificado"}
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Avances</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{updates.length}</p>
            <p className="mt-1 text-sm text-slate-600">Eventos registrados por el tecnico.</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Puntos</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{points.length}</p>
            <p className="mt-1 text-sm text-slate-600">Cobertura evaluada para el sitio.</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Equipos</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{requirements.length}</p>
            <p className="mt-1 text-sm text-slate-600">
              Recomendaciones que entraran a la cotizacion.
            </p>
          </article>
        </section>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          {/* <div>
            <label className="text-sm font-semibold text-slate-900">Sitio</label>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              disabled={isLoading}
            >
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name ?? site.id}
                </option>
              ))}
            </select>
            {selectedSite?.address && (
              <p className="mt-2 text-xs text-slate-500">{selectedSite.address}</p>
            )}
          </div> */}

          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Levantamientos</h2>
            <button
              type="button"
              onClick={() => void createSurvey()}
              disabled={isLoading}
              className={`rounded-xl px-3 py-2 text-xs font-semibold text-white ${
                isLoading ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              + Nuevo
            </button>
          </div>

          <div className="grid gap-2">
            {surveys.length === 0 && !isLoading ? (
              <p className="text-sm text-slate-600">No hay levantamientos para este sitio.</p>
            ) : (
              surveys.map((item) => {
                const isSelected = item.id === selectedSurveyId;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedSurveyId(item.id)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <p className={`text-xs uppercase tracking-[0.2em] ${isSelected ? "text-white/70" : "text-slate-400"}`}>
                      {(item.status ?? "draft") as string}
                    </p>
                    <p className={`mt-1 text-sm font-semibold ${isSelected ? "text-white" : "text-slate-900"}`}>
                      {item.title ?? "Levantamiento técnico"}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Detalle</h2>
            {!selectedSurvey ? (
              <p className="mt-2 text-sm text-slate-600">Selecciona o crea un levantamiento.</p>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-900">Título</label>
                    <input
                      value={draft.title}
                      onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-900">Estado</label>
                    <select
                      value={draft.status}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, status: e.target.value as TechSurveyStatus }))
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                      <option value="draft">draft</option>
                      <option value="submitted">submitted</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-900">Objetivos</label>
                    <textarea
                      value={draft.objectives}
                      onChange={(e) => setDraft((prev) => ({ ...prev, objectives: e.target.value }))}
                      className="mt-2 min-h-27 w-full resize-y rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-900">Riesgos</label>
                    <textarea
                      value={draft.risks}
                      onChange={(e) => setDraft((prev) => ({ ...prev, risks: e.target.value }))}
                      className="mt-2 min-h-27 w-full resize-y rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-900">Estado eléctrico</label>
                    <textarea
                      value={draft.powerStatus}
                      onChange={(e) => setDraft((prev) => ({ ...prev, powerStatus: e.target.value }))}
                      className="mt-2 min-h-22.5 w-full resize-y rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-900">Estado de red</label>
                    <textarea
                      value={draft.networkStatus}
                      onChange={(e) => setDraft((prev) => ({ ...prev, networkStatus: e.target.value }))}
                      className="mt-2 min-h-22.5 w-full resize-y rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-900">Notas</label>
                  <textarea
                    value={draft.notes}
                    onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))}
                    className="mt-2 min-h-30 w-full resize-y rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  {isSubmittedSurvey ? (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                      Levantamiento terminado
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        void saveSurvey({
                          clientId: selectedSite?.client_id ?? undefined,
                          siteId: selectedSiteId || undefined,
                          ticketId: survey?.ticket_id ?? undefined,
                          title: draft.title.trim() || undefined,
                          status: "submitted",
                          objectives: draft.objectives.trim() || undefined,
                          risks: draft.risks.trim() || undefined,
                          powerStatus: draft.powerStatus.trim() || undefined,
                          networkStatus: draft.networkStatus.trim() || undefined,
                          notes: draft.notes.trim() || undefined,
                        })
                      }
                      className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                        isLoading
                          ? "bg-emerald-300"
                          : "bg-emerald-600 hover:bg-emerald-500"
                      }`}
                      disabled={isLoading}
                    >
                      Finalizar trabajo
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!survey) return;
                      setDraft({
                        title: survey.title ?? "",
                        status: (survey.status ?? "draft") as TechSurveyStatus,
                        objectives: survey.objectives ?? "",
                        risks: survey.risks ?? "",
                        powerStatus: survey.power_status ?? "",
                        networkStatus: survey.network_status ?? "",
                        notes: survey.notes ?? "",
                      });
                    }}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    disabled={isLoading}
                  >
                    Descartar
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void saveSurvey({
                        clientId: selectedSite?.client_id ?? undefined,
                        siteId: selectedSiteId || undefined,
                        ticketId: survey?.ticket_id ?? undefined,
                        title: draft.title.trim() || undefined,
                        status: draft.status,
                        objectives: draft.objectives.trim() || undefined,
                        risks: draft.risks.trim() || undefined,
                        powerStatus: draft.powerStatus.trim() || undefined,
                        networkStatus: draft.networkStatus.trim() || undefined,
                        notes: draft.notes.trim() || undefined,
                      })
                    }
                    className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                      isLoading ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800"
                    }`}
                    disabled={isLoading}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Bitacora del levantamiento</h2>
              {isLoading && <p className="text-xs text-slate-500">Cargando...</p>}
            </div>

            {!selectedSurveyId ? (
              <p className="mt-2 text-sm text-slate-600">Selecciona un levantamiento.</p>
            ) : (
              <div className="mt-4 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void addUpdate({
                      status: updateDraft.status.trim() || undefined,
                      title: updateDraft.title.trim(),
                      details: updateDraft.details.trim() || undefined,
                    }).then(() => {
                      setUpdateDraft({
                        status: "en campo",
                        title: "",
                        details: "",
                      });
                    });
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-sm font-semibold text-slate-900">Estado del avance</label>
                    <input
                      value={updateDraft.status}
                      onChange={(e) => setUpdateDraft((prev) => ({ ...prev, status: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      placeholder="Ej: en campo, validando red, montaje listo"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-900">Titulo</label>
                    <input
                      value={updateDraft.title}
                      onChange={(e) => setUpdateDraft((prev) => ({ ...prev, title: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      placeholder="Ej: Se reviso entrada principal"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-900">Detalle</label>
                    <textarea
                      value={updateDraft.details}
                      onChange={(e) => setUpdateDraft((prev) => ({ ...prev, details: e.target.value }))}
                      className="mt-2 min-h-28 w-full resize-y rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                      placeholder="Describe lo que esta pasando, problemas detectados y decisiones tomadas."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !updateDraft.title.trim()}
                    className={`w-full rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                      isLoading || !updateDraft.title.trim()
                        ? "bg-slate-400"
                        : "bg-slate-900 hover:bg-slate-800"
                    }`}
                  >
                    Registrar avance
                  </button>
                </form>

                <div className="space-y-3">
                  {updates.length === 0 && !isLoading ? (
                    <p className="text-sm text-slate-600">Todavia no hay avances registrados.</p>
                  ) : (
                    updates.map((entry) => (
                      <article
                        key={entry.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-950">
                            {entry.title ?? "Avance"}
                          </p>
                          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-sky-700">
                            {entry.status ?? "avance"}
                          </span>
                        </div>
                        {entry.details && (
                          <p className="mt-2 text-sm leading-6 text-slate-700">{entry.details}</p>
                        )}
                        <p className="mt-2 text-xs text-slate-500">
                          {entry.created_at
                            ? new Date(entry.created_at).toLocaleString("es-DO")
                            : "Sin fecha"}
                        </p>
                      </article>
                    ))
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Puntos de cámara</h2>
              {isLoading && <p className="text-xs text-slate-500">Cargando…</p>}
            </div>

            {!selectedSurveyId ? (
              <p className="mt-2 text-sm text-slate-600">Selecciona un levantamiento.</p>
            ) : (
              <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_1fr]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void addPoint({
                      zone: pointDraft.zone.trim(),
                      height: pointDraft.height.trim() || undefined,
                      angle: pointDraft.angle.trim() || undefined,
                      cameraSuggestion: pointDraft.cameraSuggestion.trim() || undefined,
                      notes: pointDraft.notes.trim() || undefined,
                    }).then(() => {
                      setPointDraft({
                        zone: "",
                        height: "",
                        angle: "",
                        cameraSuggestion: "",
                        notes: "",
                      });
                    });
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-sm font-semibold text-slate-900">Zona</label>
                    <input
                      value={pointDraft.zone}
                      onChange={(e) => setPointDraft((prev) => ({ ...prev, zone: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      placeholder="Ej: Entrada, Pasillo, Parqueo"
                      required
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-semibold text-slate-900">Altura</label>
                      <input
                        value={pointDraft.height}
                        onChange={(e) => setPointDraft((prev) => ({ ...prev, height: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        placeholder="Ej: 3m"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-900">Ángulo</label>
                      <input
                        value={pointDraft.angle}
                        onChange={(e) => setPointDraft((prev) => ({ ...prev, angle: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        placeholder="Ej: 45°"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-900">Cámara sugerida</label>
                    <input
                      value={pointDraft.cameraSuggestion}
                      onChange={(e) =>
                        setPointDraft((prev) => ({ ...prev, cameraSuggestion: e.target.value }))
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      placeholder="Ej: IP 4MP domo"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-900">Notas</label>
                    <textarea
                      value={pointDraft.notes}
                      onChange={(e) => setPointDraft((prev) => ({ ...prev, notes: e.target.value }))}
                      className="mt-2 min-h-22.5 w-full resize-y rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !pointDraft.zone.trim()}
                    className={`w-full rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                      isLoading || !pointDraft.zone.trim()
                        ? "bg-slate-400"
                        : "bg-slate-900 hover:bg-slate-800"
                    }`}
                  >
                    Agregar punto
                  </button>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <label className="text-sm font-semibold text-slate-900">Fotos</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          void uploadPhoto(file);
                          e.currentTarget.value = "";
                        }
                      }}
                      className="mt-2 block w-full text-sm"
                      disabled={isLoading}
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Requiere bucket Supabase Storage `survey-photos`.
                    </p>
                  </div>
                </form>

                <div className="space-y-3">
                  {points.length === 0 && !isLoading ? (
                    <p className="text-sm text-slate-600">Aún no hay puntos registrados.</p>
                  ) : (
                    points.map((point) => (
                      <div
                        key={point.id}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {point.zone ?? "Zona"}
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                          {[point.height, point.angle, point.camera_suggestion]
                            .filter(Boolean)
                            .join(" · ") || "Sin detalles"}
                        </p>
                        {point.notes && (
                          <p className="mt-2 text-xs text-slate-700">{point.notes}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Equipos y camaras recomendadas</h2>
              {isLoading && <p className="text-xs text-slate-500">Cargando...</p>}
            </div>

            {!selectedSurveyId ? (
              <p className="mt-2 text-sm text-slate-600">Selecciona un levantamiento.</p>
            ) : (
              <div className="mt-4 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void addRequirement({
                      category: requirementDraft.category.trim() || undefined,
                      itemName: requirementDraft.itemName.trim(),
                      quantity: Number(requirementDraft.quantity || 1),
                      unitPrice: Number(requirementDraft.unitPrice || 0) || undefined,
                      installArea: requirementDraft.installArea.trim() || undefined,
                      notes: requirementDraft.notes.trim() || undefined,
                    }).then(() => {
                      setRequirementDraft({
                        productId: "",
                        category: "camera",
                        itemName: "",
                        quantity: "1",
                        unitPrice: "",
                        installArea: "",
                        notes: "",
                      });
                    });
                  }}
                  className="space-y-3"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-semibold text-slate-900">Categoria</label>
                      <input
                        value={requirementDraft.category}
                        onChange={(e) =>
                          setRequirementDraft((prev) => ({ ...prev, category: e.target.value }))
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        placeholder="camera, nvr, disco, switch..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-900">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        value={requirementDraft.quantity}
                        onChange={(e) =>
                          setRequirementDraft((prev) => ({ ...prev, quantity: e.target.value }))
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-900">Equipo recomendado</label>
                    <select
                      value={requirementDraft.productId}
                      onChange={(e) => {
                        const productId = e.target.value;
                        const selectedProduct =
                          catalogProducts.find((product) => product.id === productId) ?? null;

                        setRequirementDraft((prev) => ({
                          ...prev,
                          productId,
                          category: selectedProduct ? "inventory" : prev.category,
                          itemName: selectedProduct?.name ?? "",
                          unitPrice: selectedProduct
                            ? String(selectedProduct.price.toFixed(2))
                            : "",
                        }));
                      }}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Selecciona un producto del inventario</option>
                      {catalogProducts.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} · USD {product.price.toFixed(2)} · stock {product.stock}
                        </option>
                      ))}
                    </select>
                    {requirementDraft.itemName && (
                      <p className="mt-2 text-xs text-slate-500">
                        Producto elegido: {requirementDraft.itemName}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-semibold text-slate-900">Precio unitario</label>
                      <input
                        value={requirementDraft.unitPrice}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        placeholder="Precio del inventario"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-900">Area de instalacion</label>
                      <input
                        value={requirementDraft.installArea}
                        onChange={(e) =>
                          setRequirementDraft((prev) => ({ ...prev, installArea: e.target.value }))
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        placeholder="Ej: Entrada lateral"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-900">Notas tecnicas</label>
                    <textarea
                      value={requirementDraft.notes}
                      onChange={(e) =>
                        setRequirementDraft((prev) => ({ ...prev, notes: e.target.value }))
                      }
                      className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                      placeholder="Motivo, cobertura, observaciones, accesorios necesarios..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !requirementDraft.productId}
                    className={`w-full rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                      isLoading || !requirementDraft.productId
                        ? "bg-slate-400"
                        : "bg-slate-900 hover:bg-slate-800"
                    }`}
                  >
                    Agregar a cotizacion
                  </button>
                </form>

                <div className="space-y-3">
                  {requirements.length === 0 && !isLoading ? (
                    <p className="text-sm text-slate-600">
                      Aun no hay equipos recomendados para cotizar.
                    </p>
                  ) : (
                    requirements.map((entry) => {
                      const quantity = Number(entry.quantity ?? 1);
                      const unitPrice = Number(entry.unit_price ?? 0);
                      return (
                        <article
                          key={entry.id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-950">
                              {entry.item_name ?? "Equipo"}
                            </p>
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-emerald-700">
                              {entry.category ?? "equipo"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-700">
                            Cantidad: {quantity} · Precio unitario: USD {unitPrice.toFixed(2)}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-950">
                            Subtotal estimado: USD {(quantity * unitPrice).toFixed(2)}
                          </p>
                          {(entry.install_area || entry.notes) && (
                            <p className="mt-2 text-xs leading-5 text-slate-600">
                              {[entry.install_area, entry.notes].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </article>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default SurveysTechScreen;
