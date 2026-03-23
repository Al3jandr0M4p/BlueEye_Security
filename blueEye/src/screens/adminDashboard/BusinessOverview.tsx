import React from "react";
import { useAdminBusinessOverview } from "../../hooks/use-admin-dashboard";
import AdminPageShell from "../../components/AdminPageShell";

const AdminBusinessScreen: React.FC = () => {
  const { data, error } = useAdminBusinessOverview();
  const limits = data?.limits ?? [];
  const tenants = data?.tenants ?? [];
  const security = data?.security ?? [];

  return (
    <AdminPageShell
      tag="Administración"
      title="Configuración del negocio"
      subtitle="Visión general de planes, límites y seguridad con alertas que acompañan cada proceso del admin."
    >
      <div className="space-y-6">
        <article className="space-y-5 rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl shadow-indigo-900/30">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-200">
            Administracion · Multiempresa
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Configuración del negocio</h1>
              <p className="max-w-2xl text-sm text-slate-200/70">
                Visión general de planes, límites y seguridad con alertas que acompañan cada
                proceso del admin.
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <div className="rounded-2xl bg-white/10 px-4 py-2">
                <p className="uppercase tracking-[0.3em] text-[0.6rem] text-slate-200">Plan actual</p>
                <p className="text-lg font-semibold text-white">{data?.currentPlan ?? "--"}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-2">
                <p className="uppercase tracking-[0.3em] text-[0.6rem] text-slate-200">Renovación</p>
                <p className="text-lg font-semibold text-white">{data?.renewalDate ?? "--"}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <span className="rounded-2xl bg-white/10 p-3 text-center text-sm font-semibold text-slate-100">
              Moneda base · {data?.currency ?? "--"}
            </span>
            <span className="rounded-2xl bg-white/10 p-3 text-center text-sm font-semibold text-slate-100">
              Límites monitoreados · {limits.length}
            </span>
            <span className="rounded-2xl bg-white/10 p-3 text-center text-sm font-semibold text-slate-100">
              Tenants activos · {tenants.filter((tenant) => tenant.status === "Activo").length}
            </span>
          </div>
          {error && <p className="text-sm text-rose-200">No se pudo cargar la información.</p>}
        </article>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Consumo de límites</h2>
            <p className="text-sm text-slate-600">Actualizaciones automáticas cada 5 min</p>
          </div>
          <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
            {limits.map((limit) => {
              const percentage = Math.round((limit.used / limit.limit) * 100);

              return (
                <article key={limit.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">{limit.label}</span>
                    <span>
                      {limit.used}/{limit.limit}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-indigo-500 to-emerald-500"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">{percentage}% usado</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-slate-900">Multi-sedes</h2>
            <p className="text-sm text-slate-600">
              Cada sede con su moneda, zona horaria y estado de operación.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {tenants.map((tenant) => (
              <article
                key={tenant.name}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{tenant.name}</h3>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{tenant.timezone}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{tenant.currency}</span>
                </div>
                <p className="text-sm text-slate-600">
                  Estado: <span className="font-semibold text-slate-900">{tenant.status}</span>
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full border border-slate-200 px-3 py-1">Agenda global</span>
                  <span className="order border-slate-200 px-3 py-1">Alertas de uso</span>
                  <span className="rounded-full border border-slate-200 px-3 py-1">Soporte prioritario</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-slate-900">Seguridad y auditoría</h2>
            <p className="text-sm text-slate-600">
              Procesos de verificación, roles y bitácoras listos para monitoreo.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {security.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {item.title}
                  </p>
                  <span className="text-xs font-semibold text-slate-500">{item.status}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AdminPageShell>
  );
};

export default AdminBusinessScreen;
