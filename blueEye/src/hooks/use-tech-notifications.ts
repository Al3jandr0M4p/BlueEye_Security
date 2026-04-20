import { useCallback, useEffect, useState } from "react";
import {
  fetchTechNotificationsService,
  markTechNotificationAsReadService,
} from "../service/service";
import type { TechNotification } from "../types/tech.types";

const REFRESH_MS = 15000;

export function useTechNotifications() {
  const [notifications, setNotifications] = useState<TechNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchTechNotificationsService();
      setNotifications(
        [...data].sort((left, right) =>
          (right.created_at ?? "").localeCompare(left.created_at ?? ""),
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las notificaciones.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();

    const intervalId = window.setInterval(() => {
      void load();
    }, REFRESH_MS);

    return () => window.clearInterval(intervalId);
  }, [load]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      await markTechNotificationAsReadService(notificationId);
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification,
        ),
      );
    },
    [],
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return {
    error,
    isLoading,
    load,
    markAsRead,
    notifications,
    unreadCount,
  };
}
