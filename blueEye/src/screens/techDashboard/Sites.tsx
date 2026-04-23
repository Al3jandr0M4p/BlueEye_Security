import React, { useMemo, useState } from "react";
import { useTechSites } from "../../hooks/use-tech-sites";

const SitesTechScreen: React.FC = () => {
  const { error, isLoading, load, sites } = useTechSites();
  const [query, setQuery] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");

  const filteredSites = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return sites;
    return sites.filter((site) => {
      const haystack =
        `${site.name ?? ""} ${site.address ?? ""} ${site.type ?? ""} ${site.client_name ?? ""}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query, sites]);

  const selectedSite = useMemo(() => {
    const id = selectedSiteId || sites[0]?.id;
    return sites.find((site) => site.id === id) ?? null;
  }, [selectedSiteId, sites]);

  React.useEffect(() => {
    if (selectedSiteId) return;
    if (sites[0]?.id) setSelectedSiteId(sites[0].id);
  }, [selectedSiteId, sites]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Sitios</h1>
          <p className="mt-1 text-sm text-slate-600">
            Consulta los sitios activos y el cliente asociado a cada ubicacion.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          disabled={isLoading}
        >
          Recargar
        </button>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <label className="text-sm font-semibold text-slate-900">Buscar</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Nombre, direccion, tipo o cliente..."
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Lista</h2>
            {isLoading && <p className="text-xs text-slate-500">Cargando...</p>}
          </div>

          {filteredSites.length === 0 && !isLoading ? (
            <p className="text-sm text-slate-600">No hay sitios para mostrar.</p>
          ) : (
            <div className="grid gap-2">
              {filteredSites.map((site) => {
                const isSelected = site.id === selectedSite?.id;
                return (
                  <button
                    type="button"
                    key={site.id}
                    onClick={() => setSelectedSiteId(site.id)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <p className={`text-sm font-semibold ${isSelected ? "text-white" : "text-slate-900"}`}>
                      {site.name ?? site.id}
                    </p>
                    <p className={`mt-1 line-clamp-2 text-xs ${isSelected ? "text-white/75" : "text-slate-600"}`}>
                      {site.address ?? "Sin direccion"}
                    </p>
                    <p className={`mt-2 text-[11px] uppercase tracking-[0.16em] ${isSelected ? "text-white/65" : "text-slate-400"}`}>
                      {site.client_name ?? "Cliente sin nombre"}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Detalle</h2>

          {!selectedSite ? (
            <p className="mt-2 text-sm text-slate-600">Selecciona un sitio.</p>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Nombre</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedSite.name ?? "Sin nombre"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tipo</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedSite.type ?? "Sin tipo"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Cliente</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedSite.client_name ?? "Sin cliente"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Direccion</p>
                <p className="mt-2 text-sm text-slate-800">
                  {selectedSite.address ?? "Sin direccion"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">ID</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{selectedSite.id}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SitesTechScreen;
