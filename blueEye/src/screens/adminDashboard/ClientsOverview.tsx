import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminClientsOverview } from "../../hooks/use-admin-dashboard";
import AdminPageShell from "../../components/AdminPageShell";
import { AdminAddUsersModal } from "../../modals/adminAddUsersModal/AdminAddUsersModal";

const AdminClientsScreen: React.FC = () => {
  const { data, error, reload } = useAdminClientsOverview();
  const stats = data?.stats ?? [];
  const clients = data?.clients ?? [];
  const highlightClient = clients[0];
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  return (
    <AdminPageShell
      tag="Clientes"
      title="Clientes, sitios y visitas"
      subtitle="Visualiza la salud de cada cliente, sus sitios, próximos hitos y etiquetas de prioridad."
      actions={
        <button
          type="button"
          onClick={() => setIsAddClientModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/15"
        >
          <Plus size={16} /> Crear cliente
        </button>
      }
    >
      <div className="space-y-8">
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
              Clientes activos
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {stats[0]?.value ?? 0}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
              Sitios monitoreados
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {stats[1]?.value ?? 0}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
              Tickets abiertos
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {stats[2]?.value ?? 0}
            </p>
          </div>
        </div>

        {highlightClient && (
          <article className="grid gap-4 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-lg md:grid-cols-[300px_1fr]">
            <img
              src={highlightClient.image}
              alt={highlightClient.name}
              className="h-56 w-full rounded-2xl object-cover"
            />
            <div className="flex flex-col justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                  Cliente VIP
                </p>
                <h2 className="text-3xl font-semibold">{highlightClient.name}</h2>
                <p className="text-sm text-slate-200">
                  {highlightClient.primaryContact}
                </p>
              </div>
              <div className="grid gap-2 text-sm text-slate-200 md:grid-cols-2">
                <p>
                  <span className="font-semibold text-white">Plan:</span>{" "}
                  {highlightClient.plan}
                </p>
                <p>
                  <span className="font-semibold text-white">
                    Próxima auditoría:
                  </span>{" "}
                  {highlightClient.nextAudit}
                </p>
              </div>
            </div>
          </article>
        )}

        <section className="space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-slate-900">
              Clientes clave
            </h2>
            <p className="text-sm text-slate-600">
              Levantamientos, visitas y etiquetas que necesitas para cada cliente.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {clients.map((client) => (
              <article
                key={client.id ?? client.name}
                className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[120px_1fr]"
              >
                <img
                  src={client.image}
                  alt={client.name}
                  className="h-28 w-28 rounded-2xl object-cover"
                />
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        {client.type}
                      </p>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {client.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {client.primaryContact}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        client.status === "Activo"
                          ? "bg-emerald-100 text-emerald-700"
                          : client.status === "Pendiente"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>
                  <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-slate-900">Sitios:</span>{" "}
                      {client.sites}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Plan:</span>{" "}
                      {client.plan}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">
                        Próxima visita:
                      </span>{" "}
                      {client.nextVisit}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">
                        Auditoría:
                      </span>{" "}
                      {client.nextAudit}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {client.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {client.id && (
                    <div className="pt-2">
                      <Link
                        to={`/adminDashboard/clients/${client.id}/sites`}
                        className="text-sm font-semibold text-slate-900 hover:underline"
                      >
                        Administrar sitios →
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {isAddClientModalOpen && (
        <AdminAddUsersModal
          selectedType="usuario"
          setIsAddUserModalOpen={setIsAddClientModalOpen}
          onCreated={async () => {
            await reload();
          }}
          onBackToTypeSelection={() => setIsAddClientModalOpen(false)}
        />
      )}
    </AdminPageShell>
  );
};

export default AdminClientsScreen;

