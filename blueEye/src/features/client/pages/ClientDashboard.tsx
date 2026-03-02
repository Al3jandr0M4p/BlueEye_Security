import { useCallback, useEffect, useState } from "react";
import CameraStatusCard from "../components/CameraStatusCard";
import NotificationPanel from "../components/NotificationPanel";
import StatCard from "../components/StatCard";
import { clientService } from "../services/client.service";
import type { ClientNotification, SystemStatusData } from "../types/client.types";

const nvrStyles: Record<NonNullable<SystemStatusData["summary"]["nvrStatus"]>, string> = {
  online: "bg-green-100 text-green-700",
  degraded: "bg-amber-100 text-amber-700",
  offline: "bg-red-100 text-red-700",
};

const ClientDashboard = () => {
  const [statusData, setStatusData] = useState<SystemStatusData | null>(null);
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadStatus = useCallback(async () => {
    const data = await clientService.getSystemStatus();
    setStatusData(data);
  }, []);

  const loadNotifications = useCallback(async () => {
    const data = await clientService.getNotifications();
    setNotifications(data);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await Promise.all([loadStatus(), loadNotifications()]);
      setIsLoading(false);
    };
    void load();
  }, [loadNotifications, loadStatus]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadStatus();
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [loadStatus]);

  const markAsRead = async (notificationId: string) => {
    await clientService.markNotificationAsRead(notificationId);
    await loadNotifications();
  };

  if (isLoading || !statusData) {
    return <section className="p-4 text-sm text-gray-600">Cargando portal cliente...</section>;
  }

  return (
    <section className="space-y-6 p-4">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Estado del sistema</h1>
        <p className="text-sm text-gray-600">Vista exclusiva de monitoreo para cliente.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total camaras" value={statusData.summary.totalCameras} accent="blue" />
        <StatCard title="Camaras online" value={statusData.summary.onlineCameras} accent="green" />
        <StatCard title="Camaras offline" value={statusData.summary.offlineCameras} accent="red" />
        <StatCard title="Alertas activas" value={statusData.summary.activeAlerts} accent="amber" />
      </div>

      <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Estado NVR</h2>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${nvrStyles[statusData.summary.nvrStatus]}`}>
            {statusData.summary.nvrStatus}
          </span>
        </div>
      </article>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">Camaras por sitio</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {statusData.cameras.map((camera) => (
            <CameraStatusCard key={camera.id} camera={camera} />
          ))}
        </div>
      </section>

      <NotificationPanel notifications={notifications} onMarkAsRead={markAsRead} />
    </section>
  );
};

export default ClientDashboard;
