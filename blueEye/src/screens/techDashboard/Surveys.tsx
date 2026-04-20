import React, { useMemo, useState } from "react";
import { useTechSurveys } from "../../hooks/use-tech-surveys";
import type { TechSurveyStatus } from "../../types/tech.types";

const SurveysTechScreen: React.FC = () => {
  const {
    addPoint,
    createSurvey,
    error,
    isLoading,
    points,
    saveSurvey,
    selectedSite,
    selectedSiteId,
    selectedSurveyId,
    setSelectedSiteId,
    setSelectedSurveyId,
    sites,
    survey,
    surveys,
    uploadPhoto,
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
  }, [survey?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedSurvey = useMemo(
    () => surveys.find((item) => item.id === selectedSurveyId) ?? null,
    [selectedSurveyId, surveys],
  );

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

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
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
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Levantamientos</h2>
            <button
              type="button"
              onClick={() => void createSurvey()}
              disabled={isLoading || !selectedSiteId}
              className={`rounded-xl px-3 py-2 text-xs font-semibold text-white ${
                isLoading || !selectedSiteId ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800"
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
        </main>
      </div>
    </div>
  );
};

export default SurveysTechScreen;

