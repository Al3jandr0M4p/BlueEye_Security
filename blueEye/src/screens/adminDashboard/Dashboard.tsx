import React, { useEffect, useState } from "react";
import { fetchAdminDashboardStats } from "../../service/service";
import { supabase } from "../../lib/supabase";
import AdminPageShell from "../../components/AdminPageShell";

const DashboardAdminScreen: React.FC = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalTechnicians: 0,
  });

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      const data = await fetchAdminDashboardStats();
      if (mounted) {
        setStats(data);
      }
    };

    fetchStats();

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
          fetchStats();
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AdminPageShell
      tag="Resumen"
      title="Dashboard operacional"
      subtitle="Actualizaciones en vivo para clientes y técnicos conectados al ecosistema."
      actions={
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/90">
          Live Update
        </span>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-white/90 p-6 shadow-xl shadow-indigo-900/20 transition hover:-translate-y-1">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Clientes</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{stats.totalClients}</p>
          <p className="text-sm text-slate-500">Total de clientes registrados</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/90 p-6 shadow-xl shadow-indigo-900/20 transition hover:-translate-y-1">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Técnicos</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{stats.totalTechnicians}</p>
          <p className="text-sm text-slate-500">Técnicos activos en la plataforma</p>
        </article>
      </div>
    </AdminPageShell>
  );
};

export default DashboardAdminScreen;
