import React from "react";
import {
  ArrowLeft,
  Building2,
  MapPinned,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../Input/Input";
import { useAdminUserDetails } from "../../hooks/use-admin-user-details";
import type { UserRoleTab } from "../../types/types";
import {
  createAdminClientSite,
  fetchAdminClientSites,
  updateAdminSite,
} from "../../service/service";

type ClientSite = {
  id?: string;
  name?: string | null;
  address?: string | null;
  type?: string | null;
  is_active?: boolean | null;
};

const InfoCrud: React.FC = () => {
  const navigate = useNavigate();
  const { userType, id } = useParams();
  const normalizedType: UserRoleTab =
    userType === "tecnico" ? "tecnico" : "usuario";
  const { deactivateUser, error, form, isLoading, saveChanges, updateField, user } =
    useAdminUserDetails(id);
  const [sites, setSites] = React.useState<ClientSite[]>([]);
  const [sitesLoading, setSitesLoading] = React.useState(false);
  const [sitesError, setSitesError] = React.useState("");
  const [siteForm, setSiteForm] = React.useState({
    name: "",
    address: "",
    type: "empresa",
  });

  const loadSites = React.useCallback(async () => {
    if (!id || normalizedType !== "usuario") return;

    try {
      setSitesLoading(true);
      setSitesError("");
      const data = await fetchAdminClientSites(id);
      setSites((data as ClientSite[]).map((site) => ({ ...site, id: String(site.id ?? "") })));
    } catch (err) {
      setSitesError(
        err instanceof Error ? err.message : "No se pudieron cargar los sitios.",
      );
    } finally {
      setSitesLoading(false);
    }
  }, [id, normalizedType]);

  React.useEffect(() => {
    void loadSites();
  }, [loadSites]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center text-sm text-[#64748b]">
          Cargando usuario...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center">
          <h1
            className="text-2xl font-semibold text-[#101827]"
            style={{ fontFamily: "Google Sans" }}
          >
            Usuario no encontrado
          </h1>
          {error && <p className="mt-3 text-sm text-[#b91c1c]">{error}</p>}
          <button
            onClick={() => navigate("/adminDashboard/employees")}
            className="mt-6 rounded-xl bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
          >
            Volver a usuarios
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/adminDashboard/employees")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#334155] transition hover:text-[#0f172a]"
          style={{ fontFamily: "Google Sans" }}
        >
          <ArrowLeft size={16} />
          Volver a usuarios
        </button>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-2xl border border-[#e2e8f0] bg-white p-5 md:p-7">
            <div className="flex flex-col gap-4 border-b border-[#e7edf4] pb-5 sm:flex-row sm:items-center">
              <img
                src={user.image}
                alt={user.name}
                className="h-20 w-20 rounded-2xl object-cover"
              />
              <div>
                <h1
                  className="text-3xl font-semibold text-[#0f172a]"
                  style={{ fontFamily: "Google Sans" }}
                >
                  {user.name}
                </h1>
                <p
                  className="mt-1 text-sm text-[#5b6576]"
                  style={{ fontFamily: "Google Sans" }}
                >
                  Perfil:{" "}
                  <span className="font-semibold text-[#111827]">
                    {normalizedType === "usuario" ? "Usuario" : "Tecnico"}
                  </span>
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-[#fecaca] bg-[#fff1f2] p-4 text-sm text-[#b91c1c]">
                {error}
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-[#e7edf4] bg-[#fbfcfe] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                  Correo actual
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#1e293b]">
                  <Mail size={14} />
                  {user.email}
                </p>
              </article>

              <article className="rounded-xl border border-[#e7edf4] bg-[#fbfcfe] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                  Telefono actual
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#1e293b]">
                  <Phone size={14} />
                  {user.phone}
                </p>
              </article>

              <article className="rounded-xl border border-[#e7edf4] bg-[#fbfcfe] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                  Empresa
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#1e293b]">
                  <Building2 size={14} />
                  {user.company}
                </p>
              </article>

              <article className="rounded-xl border border-[#e7edf4] bg-[#fbfcfe] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                  Ubicacion
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#1e293b]">
                  <MapPin size={14} />
                  {user.city}
                </p>
              </article>
            </div>

            <section className="mt-6 rounded-xl border border-[#e7edf4] p-4">
              <h2
                className="text-lg font-semibold text-[#0f172a]"
                style={{ fontFamily: "Google Sans" }}
              >
                Editar datos
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  text="admin-user-email"
                  translationKey="Nuevo email"
                  type="email"
                  variant="default"
                  value={form.email}
                  onValueChange={updateField("email")}
                />
                <Input
                  text="admin-user-phone"
                  translationKey="Nuevo telefono"
                  type="text"
                  variant="default"
                  value={form.phone}
                  onValueChange={updateField("phone")}
                />
                <div className="md:col-span-2">
                  <Input
                    text="admin-user-password"
                    translationKey="Nueva contrasena"
                    type="password"
                    variant="default"
                    value={form.password}
                    onValueChange={updateField("password")}
                  />
                </div>
              </div>
            </section>

            {normalizedType === "usuario" && (
              <section className="mt-6 rounded-xl border border-[#e7edf4] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2
                      className="text-lg font-semibold text-[#0f172a]"
                      style={{ fontFamily: "Google Sans" }}
                    >
                      Sitios del cliente
                    </h2>
                    <p className="mt-1 text-sm text-[#5b6576]">
                      Agrega aqui los sitios que pertenecen a este usuario para que luego aparezcan en el flujo tecnico.
                    </p>
                  </div>
                  {sitesLoading && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                      Cargando sitios...
                    </span>
                  )}
                </div>

                {sitesError && (
                  <div className="mt-4 rounded-xl border border-[#fecaca] bg-[#fff1f2] p-4 text-sm text-[#b91c1c]">
                    {sitesError}
                  </div>
                )}

                <form
                  className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1.2fr_1.4fr_180px_auto]"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!id || !siteForm.name.trim()) return;

                    void (async () => {
                      try {
                        setSitesLoading(true);
                        setSitesError("");
                        await createAdminClientSite(id, {
                          name: siteForm.name.trim(),
                          address: siteForm.address.trim() || undefined,
                          type: siteForm.type,
                        });
                        setSiteForm({ name: "", address: "", type: "empresa" });
                        await loadSites();
                      } catch (err) {
                        setSitesError(
                          err instanceof Error
                            ? err.message
                            : "No se pudo crear el sitio.",
                        );
                        setSitesLoading(false);
                      }
                    })();
                  }}
                >
                  <input
                    value={siteForm.name}
                    onChange={(e) =>
                      setSiteForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="rounded-xl border border-[#d7dee8] px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#111827]"
                    placeholder="Nombre del sitio"
                  />
                  <input
                    value={siteForm.address}
                    onChange={(e) =>
                      setSiteForm((prev) => ({ ...prev, address: e.target.value }))
                    }
                    className="rounded-xl border border-[#d7dee8] px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#111827]"
                    placeholder="Direccion"
                  />
                  <select
                    value={siteForm.type}
                    onChange={(e) =>
                      setSiteForm((prev) => ({ ...prev, type: e.target.value }))
                    }
                    className="rounded-xl border border-[#d7dee8] px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#111827]"
                  >
                    <option value="hogar">Hogar</option>
                    <option value="comercio">Comercio</option>
                    <option value="empresa">Empresa</option>
                  </select>
                  <button
                    type="submit"
                    disabled={sitesLoading || !siteForm.name.trim()}
                    className="rounded-xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:bg-[#94a3b8]"
                  >
                    Agregar sitio
                  </button>
                </form>

                <div className="mt-5 grid gap-3">
                  {sites.length === 0 && !sitesLoading ? (
                    <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-4 text-sm text-[#64748b]">
                      Este usuario aun no tiene sitios registrados.
                    </div>
                  ) : (
                    sites.map((site) => (
                      <article
                        key={site.id ?? site.name}
                        className="rounded-2xl border border-[#e7edf4] bg-[#fbfcfe] p-4"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="space-y-2">
                            <p className="text-base font-semibold text-[#111827]">
                              {site.name ?? "Sitio"}
                            </p>
                            <p className="inline-flex items-center gap-2 text-sm text-[#475569]">
                              <MapPinned size={14} />
                              {site.address ?? "Sin direccion"}
                            </p>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                              Tipo: {site.type ?? "empresa"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (!site.id) return;
                              const siteId = site.id;
                              void (async () => {
                                try {
                                  setSitesLoading(true);
                                  setSitesError("");
                                  await updateAdminSite(siteId, {
                                    is_active: site.is_active === false ? true : false,
                                  });
                                  await loadSites();
                                } catch (err) {
                                  setSitesError(
                                    err instanceof Error
                                      ? err.message
                                      : "No se pudo actualizar el sitio.",
                                  );
                                  setSitesLoading(false);
                                }
                              })();
                            }}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                              site.is_active === false
                                ? "border border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8] hover:bg-[#dbeafe]"
                                : "border border-[#fecaca] bg-[#fff1f2] text-[#b91c1c] hover:bg-[#ffe4e6]"
                            }`}
                          >
                            {site.is_active === false ? "Reactivar" : "Desactivar"}
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            )}
          </section>

          <aside className="h-fit rounded-2xl border border-[#e2e8f0] bg-white p-5 md:p-6">
            <h3
              className="text-xl font-semibold text-[#0f172a]"
              style={{ fontFamily: "Google Sans" }}
            >
              Acciones
            </h3>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 rounded-xl border border-[#e7edf4] bg-[#f8fafc] p-3 text-sm text-[#334155]">
                <UserCircle2 size={16} />
                ID de usuario: {user.id}
              </div>
              <div className={`flex items-center gap-2 rounded-xl p-3 text-sm ${user.isActive ? "border border-[#dcfce7] bg-[#f0fdf4] text-[#166534]" : "border border-[#fecaca] bg-[#fff1f2] text-[#b91c1c]"}`}>
                <ShieldCheck size={16} />
                Estado: {user.isActive ? "Activo" : "Inactivo"}
              </div>
            </div>

            <button
              onClick={() => void saveChanges()}
              className="mt-5 w-full rounded-xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
              style={{ fontFamily: "Google Sans" }}
            >
              Actualizar
            </button>

            <button
              onClick={async () => {
                const ok = await deactivateUser();
                if (ok) {
                  navigate("/adminDashboard/employees");
                }
              }}
              className="mt-3 w-full rounded-xl border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-sm font-semibold text-[#b91c1c] transition hover:bg-[#ffe4e6]"
              style={{ fontFamily: "Google Sans" }}
            >
              Deshabilitar
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default InfoCrud;
