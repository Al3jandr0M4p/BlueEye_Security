import React, { useEffect, useState } from "react";
import AdminPageShell from "../../components/AdminPageShell";
import {
  fetchAdminBusinessOverview,
  fetchAdminClientsOverview,
  fetchAdminDashboardStats,
  fetchAdminInventoryOverview,
} from "../../service/service";
import { supabase } from "../../lib/supabase";
import type {
  AdminBusinessOverview,
  AdminClientOverview,
  AdminDashboardStats,
  AdminInventoryOverview,
} from "../../types/types";

type DashboardSnapshot = {
  business: AdminBusinessOverview | null;
  clients: AdminClientOverview | null;
  inventory: AdminInventoryOverview | null;
  stats: AdminDashboardStats["data"];
};

const emptyStats: AdminDashboardStats["data"] = {
  openTickets: 0,
  pendingPlanning: 0,
  totalClients: 0,
  totalInventoryProducts: 0,
  totalSites: 0,
  totalTechnicians: 0,
};

const DashboardAdminScreen: React.FC = () => {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>({
    business: null,
    clients: null,
    inventory: null,
    stats: emptyStats,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const [stats, clients, business, inventory] = await Promise.all([
          fetchAdminDashboardStats(),
          fetchAdminClientsOverview(),
          fetchAdminBusinessOverview(),
          fetchAdminInventoryOverview(),
        ]);

        if (!mounted) return;

        setSnapshot({
          business,
          clients,
          inventory,
          stats,
        });
        setError(null);
      } catch {
        if (!mounted) return;
        setError("No se pudo cargar el resumen operativo del admin.");
      }
    };

    void loadDashboard();

    const channel = supabase
      .channel("admin-dashboard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "usuarios",
        },
        () => {
          void loadDashboard();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tickets",
        },
        () => {
          void loadDashboard();
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  const highlightedClient = snapshot.clients?.clients?.[0];
  const limits = snapshot.business?.limits ?? [];
  const alerts = snapshot.inventory?.alerts ?? [];

  return (
    <AdminPageShell
      tag="Resumen"
      title="Dashboard operacional"
      subtitle="Vista ejecutiva del negocio con clientes, tickets, sitios, inventario y consumo del plan."
      actions={
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/90">
          Live Update
        </span>
      }
    >
      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[
          ["Clientes", snapshot.stats.totalClients, "Usuarios finales activos"],
          ["Técnicos", snapshot.stats.totalTechnicians, "Equipo operativo disponible"],
          ["Sitios", snapshot.stats.totalSites, "Ubicaciones monitoreadas"],
          ["Tickets", snapshot.stats.openTickets, "Casos abiertos hoy"],
          ["Planning", snapshot.stats.pendingPlanning, "Pendientes de planificar"],
          ["Stock", snapshot.stats.totalInventoryProducts, "Productos activos"],
        ].map(([label, value, description]) => (
          <article
            key={String(label)}
            className="rounded-3xl border border-white/10 bg-white/90 p-5 shadow-xl shadow-indigo-900/15 transition hover:-translate-y-1"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{label}</p>
            <p className="mt-3 text-4xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{description}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Negocio
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                {snapshot.business?.currentPlan ?? "Plan no disponible"}
              </h2>
              <p className="text-sm text-slate-500">
                Renovación {snapshot.business?.renewalDate ?? "--"} · Moneda base{" "}
                {snapshot.business?.currency ?? "--"}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900 px-4 py-3 text-white">
              <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                Tenants
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {snapshot.business?.tenants?.length ?? 0}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {limits.map((limit) => {
              const percentage =
                limit.limit > 0 ? Math.round((limit.used / limit.limit) * 100) : 0;

              return (
                <div key={limit.label} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">{limit.label}</span>
                    <span>
                      {limit.used}/{limit.limit}
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-indigo-500 to-emerald-500"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{percentage}% utilizado</p>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Cliente destacado
          </p>
          {highlightedClient ? (
            <div className="mt-4 space-y-4">
              <img
                src={highlightedClient.image}
                alt={highlightedClient.name}
                className="h-52 w-full rounded-2xl object-cover"
              />
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {highlightedClient.name}
                </h2>
                <p className="text-sm text-slate-500">
                  {highlightedClient.primaryContact}
                </p>
              </div>
              <div className="grid gap-2 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Plan:</span>{" "}
                  {highlightedClient.plan}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Sitios:</span>{" "}
                  {highlightedClient.sites}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Próxima visita:</span>{" "}
                  {highlightedClient.nextVisit}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Auditoría:</span>{" "}
                  {highlightedClient.nextAudit}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              No hay clientes destacados para mostrar.
            </p>
          )}
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Estado de clientes
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Cartera activa
              </h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {snapshot.clients?.clients?.length ?? 0} registros
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {(snapshot.clients?.clients ?? []).slice(0, 4).map((client) => (
              <div
                key={client.id ?? client.name}
                className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-[1.5fr_1fr_1fr]"
              >
                <div>
                  <p className="text-lg font-semibold text-slate-900">{client.name}</p>
                  <p className="text-sm text-slate-500">{client.primaryContact}</p>
                </div>
                <div className="text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-900">Plan:</span>{" "}
                    {client.plan}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Sitios:</span>{" "}
                    {client.sites}
                  </p>
                </div>
                <div className="text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-900">Estado:</span>{" "}
                    {client.status}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Visita:</span>{" "}
                    {client.nextVisit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Inventario
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Alertas y movimientos
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Productos activos</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {snapshot.inventory?.summary.totalProducts ?? 0}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Bajo stock</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {snapshot.inventory?.summary.lowStock ?? 0}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {alerts.length ? (
              alerts.slice(0, 4).map((alert) => (
                <div
                  key={alert}
                  className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                >
                  {alert}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                No hay alertas críticas de inventario.
              </div>
            )}
          </div>
        </article>
      </div>
    </AdminPageShell>
  );
};

export default DashboardAdminScreen;
