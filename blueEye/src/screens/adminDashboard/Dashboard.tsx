import React, { useEffect, useState } from "react";
import { fetchAdminDashboardStats } from "../../service/services";
import { supabase } from "../../lib/supabase";

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
    <>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Clientes */}
          <div className="bg-white shadow rounded-xl p-6 border">
            <h2 className="text-gray-500 text-sm">Clientes</h2>

            <p className="text-3xl font-bold mt-2">{stats.totalClients}</p>

            <span className="text-xs text-gray-400">
              Total de clientes registrados
            </span>
          </div>

          {/* Técnicos */}
          <div className="bg-white shadow rounded-xl p-6 border">
            <h2 className="text-gray-500 text-sm">Técnicos</h2>

            <p className="text-3xl font-bold mt-2">{stats.totalTechnicians}</p>

            <span className="text-xs text-gray-400">
              Total de técnicos registrados
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardAdminScreen;

