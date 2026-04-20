import { useCallback, useEffect, useState } from "react";
import { clientService } from "../../../service/service";
import type {
  ClientNotification,
  SystemStatusData,
} from "../../../types/client.types";

export function useClientDashboard() {
  const [statusData, setStatusData] = useState<SystemStatusData | null>(null);
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [integrationNote, setIntegrationNote] = useState("");

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
      try {
        await Promise.all([loadStatus(), loadNotifications()]);
        setIntegrationNote(clientService.getMissingSystemStatusMessage());
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [loadNotifications, loadStatus]);

  useEffect(() => {
    if (!statusData) {
      return;
    }

    const id = window.setInterval(() => {
      void loadStatus();
    }, 5000);

    return () => window.clearInterval(id);
  }, [loadStatus, statusData]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      await clientService.markNotificationAsRead(notificationId);
      await loadNotifications();
    },
    [loadNotifications],
  );

  return {
    integrationNote,
    isLoading,
    markAsRead,
    notifications,
    statusData,
  };
}
