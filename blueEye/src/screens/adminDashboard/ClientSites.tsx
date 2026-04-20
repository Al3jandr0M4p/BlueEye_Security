import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminPageShell from "../../components/AdminPageShell";
import {
  createAdminClientSite,
  createAdminSiteContact,
  createAdminSiteZone,
  deactivateAdminSiteContact,
  deactivateAdminSiteZone,
  fetchAdminClientSites,
  fetchAdminSiteContacts,
  fetchAdminSiteZones,
} from "../../service/service";

type Site = {
  id?: string;
  name?: string;
  address?: string | null;
  type?: string | null;
  created_at?: string;
};

type SiteZone = {
  id?: string;
  name?: string;
  description?: string | null;
  created_at?: string;
};

type SiteContact = {
  id?: string;
  name?: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  is_primary?: boolean | null;
  created_at?: string;
};

const AdminClientSitesScreen: React.FC = () => {
  const { clientId } = useParams();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [zones, setZones] = useState<SiteZone[]>([]);
  const [contacts, setContacts] = useState<SiteContact[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const [zoneName, setZoneName] = useState("");
  const [zoneDescription, setZoneDescription] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [contactIsPrimary, setContactIsPrimary] = useState(false);

  const load = async () => {
    if (!clientId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminClientSites(clientId);
      setSites(data as Site[]);
    } catch {
      setError("No se pudieron cargar los sitios.");
    } finally {
      setLoading(false);
    }
  };

  const loadDetails = async (siteId: string) => {
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      const [zonesData, contactsData] = await Promise.all([
        fetchAdminSiteZones(siteId),
        fetchAdminSiteContacts(siteId),
      ]);
      setZones(zonesData as SiteZone[]);
      setContacts(contactsData as SiteContact[]);
    } catch {
      setDetailsError("No se pudieron cargar zonas/contactos.");
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  useEffect(() => {
    if (selectedSiteId) return;
    if (!sites.length) return;
    if (!sites[0]?.id) return;
    setSelectedSiteId(String(sites[0].id));
  }, [selectedSiteId, sites]);

  useEffect(() => {
    if (!selectedSiteId) return;
    void loadDetails(selectedSiteId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSiteId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !name.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await createAdminClientSite(clientId, {
        name: name.trim(),
        address: address.trim() || undefined,
        type: "empresa",
      });
      setName("");
      setAddress("");
      await load();
    } catch {
      setError("No se pudo crear el sitio.");
      setLoading(false);
    }
  };

  const selectedSite = useMemo(
    () => sites.find((site) => String(site.id) === selectedSiteId) ?? null,
    [selectedSiteId, sites],
  );

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiteId || !zoneName.trim()) return;
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      await createAdminSiteZone(selectedSiteId, {
        name: zoneName.trim(),
        description: zoneDescription.trim() || undefined,
      });
      setZoneName("");
      setZoneDescription("");
      await loadDetails(selectedSiteId);
    } catch {
      setDetailsError("No se pudo crear la zona.");
      setDetailsLoading(false);
    }
  };

  const handleDeactivateZone = async (zoneId?: string) => {
    if (!zoneId || !selectedSiteId) return;
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      await deactivateAdminSiteZone(zoneId);
      await loadDetails(selectedSiteId);
    } catch {
      setDetailsError("No se pudo desactivar la zona.");
      setDetailsLoading(false);
    }
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiteId || !contactName.trim()) return;
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      await createAdminSiteContact(selectedSiteId, {
        name: contactName.trim(),
        email: contactEmail.trim() || undefined,
        phone: contactPhone.trim() || undefined,
        role: contactRole.trim() || undefined,
        isPrimary: contactIsPrimary,
      });
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactRole("");
      setContactIsPrimary(false);
      await loadDetails(selectedSiteId);
    } catch {
      setDetailsError("No se pudo crear el contacto.");
      setDetailsLoading(false);
    }
  };

  const handleDeactivateContact = async (contactId?: string) => {
    if (!contactId || !selectedSiteId) return;
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      await deactivateAdminSiteContact(contactId);
      await loadDetails(selectedSiteId);
    } catch {
      setDetailsError("No se pudo desactivar el contacto.");
      setDetailsLoading(false);
    }
  };

  return (
    <AdminPageShell
      tag="Clientes"
      title="Sitios del cliente"
      subtitle="Crea y administra los sitios/instalaciones del cliente."
    >
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Link
              to="/adminDashboard/clients"
              className="text-sm text-slate-600 hover:underline"
            >
              ← Volver a clientes
            </Link>
          </div>

          <form
            onSubmit={handleCreate}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">Nuevo sitio</h3>
            <div className="mt-4 grid gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                placeholder="Nombre del sitio"
              />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                placeholder="Dirección (opcional)"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className={`mt-4 rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                loading || !name.trim()
                  ? "bg-slate-400"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              Crear sitio
            </button>
            {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
          </form>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Sitios</h3>
              {loading && <p className="text-xs text-slate-500">Cargando…</p>}
            </div>

            {!loading && sites.length === 0 && (
              <p className="text-sm text-slate-600">
                Este cliente aún no tiene sitios.
              </p>
            )}

            <div className="grid gap-3">
              {sites.map((site) => {
                const isSelected = String(site.id) === selectedSiteId;
                return (
                  <button
                    type="button"
                    key={site.id ?? site.name}
                    onClick={() => site.id && setSelectedSiteId(String(site.id))}
                    className={`w-full rounded-3xl border p-5 text-left shadow-sm transition ${
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <p
                      className={`text-xs uppercase tracking-[0.3em] ${
                        isSelected ? "text-white/70" : "text-slate-400"
                      }`}
                    >
                      {site.type ?? "sitio"}
                    </p>
                    <h4
                      className={`mt-1 text-xl font-semibold ${
                        isSelected ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {site.name ?? "Sin nombre"}
                    </h4>
                    <p
                      className={`mt-1 text-sm ${
                        isSelected ? "text-white/80" : "text-slate-600"
                      }`}
                    >
                      {site.address ?? "Sin dirección"}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Zonas y contactos
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {selectedSite
                ? `Gestiona la información del sitio “${selectedSite.name ?? "Sin nombre"}”.`
                : "Selecciona un sitio para continuar."}
            </p>
            {detailsError && (
              <p className="mt-3 text-sm text-rose-600">{detailsError}</p>
            )}
          </div>

          {selectedSiteId && (
            <div className="grid gap-6 xl:grid-cols-2">
              <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-900">
                    Zonas internas
                  </h4>
                  {detailsLoading && (
                    <p className="text-xs text-slate-500">Cargando…</p>
                  )}
                </div>

                <form onSubmit={handleCreateZone} className="grid gap-3">
                  <input
                    value={zoneName}
                    onChange={(e) => setZoneName(e.target.value)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                    placeholder="Nombre de la zona (ej: Entrada)"
                  />
                  <input
                    value={zoneDescription}
                    onChange={(e) => setZoneDescription(e.target.value)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                    placeholder="Descripción (opcional)"
                  />
                  <button
                    type="submit"
                    disabled={detailsLoading || !zoneName.trim()}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                      detailsLoading || !zoneName.trim()
                        ? "bg-slate-400"
                        : "bg-slate-900 hover:bg-slate-800"
                    }`}
                  >
                    Crear zona
                  </button>
                </form>

                <div className="space-y-2">
                  {zones.length === 0 && !detailsLoading && (
                    <p className="text-sm text-slate-600">
                      Sin zonas registradas.
                    </p>
                  )}
                  {zones.map((zone) => (
                    <div
                      key={zone.id ?? zone.name}
                      className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {zone.name ?? "Zona"}
                        </p>
                        {zone.description && (
                          <p className="text-xs text-slate-600">
                            {zone.description}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeactivateZone(zone.id)}
                        className="text-xs font-semibold text-rose-700 hover:underline"
                        disabled={detailsLoading}
                      >
                        Desactivar
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-900">
                    Contactos del sitio
                  </h4>
                  {detailsLoading && (
                    <p className="text-xs text-slate-500">Cargando…</p>
                  )}
                </div>

                <form onSubmit={handleCreateContact} className="grid gap-3">
                  <input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                    placeholder="Nombre del contacto"
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                      placeholder="Email (opcional)"
                    />
                    <input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                      placeholder="Teléfono (opcional)"
                    />
                  </div>
                  <input
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                    placeholder="Rol (ej: Gerente, TI, Dueño)"
                  />
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={contactIsPrimary}
                      onChange={(e) => setContactIsPrimary(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    Contacto principal
                  </label>
                  <button
                    type="submit"
                    disabled={detailsLoading || !contactName.trim()}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                      detailsLoading || !contactName.trim()
                        ? "bg-slate-400"
                        : "bg-slate-900 hover:bg-slate-800"
                    }`}
                  >
                    Crear contacto
                  </button>
                </form>

                <div className="space-y-2">
                  {contacts.length === 0 && !detailsLoading && (
                    <p className="text-sm text-slate-600">
                      Sin contactos registrados.
                    </p>
                  )}
                  {contacts.map((contact) => (
                    <div
                      key={contact.id ?? contact.name}
                      className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-slate-900">
                          {contact.name ?? "Contacto"}{" "}
                          {contact.is_primary ? (
                            <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                              Principal
                            </span>
                          ) : null}
                        </p>
                        <p className="text-xs text-slate-600">
                          {[contact.role, contact.email, contact.phone]
                            .filter(Boolean)
                            .join(" · ") || "Sin detalles"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeactivateContact(contact.id)}
                        className="text-xs font-semibold text-rose-700 hover:underline"
                        disabled={detailsLoading}
                      >
                        Desactivar
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </AdminPageShell>
  );
};

export default AdminClientSitesScreen;

