import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchTechNotificationsService,
  markTechNotificationAsReadService,
} from "../service/service";
import type { TechNotification } from "../types/tech.types";

const REFRESH_MS = 60000;
const MIN_REFRESH_GAP_MS = 15000;

type TechNotificationsState = {
  error: string | null;
  isLoading: boolean;
  notifications: TechNotification[];
};

const store: TechNotificationsState = {
  error: null,
  isLoading: true,
  notifications: [],
};

const listeners = new Set<(state: TechNotificationsState) => void>();
let intervalId: number | null = null;
let inFlightRequest: Promise<void> | null = null;
let hasLoadedOnce = false;
let lastLoadAt = 0;
let visibilityListenerAttached = false;

function getErrorMessage(err: unknown) {
  const fallback = "No se pudieron cargar las notificaciones.";

  if (!(err instanceof Error)) {
    return fallback;
  }

  if (err.message.includes("429")) {
    return "Hay demasiadas solicitudes seguidas. Reintentaremos en unos segundos.";
  }

  return err.message;
}

function emit() {
  const snapshot = {
    error: store.error,
    isLoading: store.isLoading,
    notifications: store.notifications,
  };

  listeners.forEach((listener) => listener(snapshot));
}

async function loadShared(force = false) {
  if (inFlightRequest && !force) {
    return inFlightRequest;
  }

  if (typeof document !== "undefined" && document.hidden && hasLoadedOnce && !force) {
    return;
  }

  const now = Date.now();
  if (!force && hasLoadedOnce && now - lastLoadAt < MIN_REFRESH_GAP_MS) {
    return;
  }

  store.isLoading = !hasLoadedOnce;
  if (!hasLoadedOnce) {
    store.error = null;
  }
  emit();

  inFlightRequest = (async () => {
    try {
      const data = await fetchTechNotificationsService();
      store.notifications = [...data].sort((left, right) =>
        (right.created_at ?? "").localeCompare(left.created_at ?? ""),
      );
      store.error = null;
      hasLoadedOnce = true;
      lastLoadAt = Date.now();
    } catch (err) {
      store.error = getErrorMessage(err);
    } finally {
      store.isLoading = false;
      emit();
      inFlightRequest = null;
    }
  })();

  return inFlightRequest;
}

function ensurePolling() {
  if (intervalId !== null || typeof window === "undefined") return;

  intervalId = window.setInterval(() => {
    void loadShared();
  }, REFRESH_MS);
}

function ensureVisibilityListener() {
  if (visibilityListenerAttached || typeof document === "undefined") return;

  document.addEventListener("visibilitychange", handleSharedVisibilityChange);
  visibilityListenerAttached = true;
}

function removeVisibilityListenerIfUnused() {
  if (!visibilityListenerAttached || listeners.size > 0 || typeof document === "undefined") {
    return;
  }

  document.removeEventListener("visibilitychange", handleSharedVisibilityChange);
  visibilityListenerAttached = false;
}

function stopPollingIfUnused() {
  if (listeners.size > 0 || intervalId === null || typeof window === "undefined") return;
  window.clearInterval(intervalId);
  intervalId = null;
}

function handleSharedVisibilityChange() {
  if (!document.hidden) {
    void loadShared();
  }
}

export function useTechNotifications() {
  const [state, setState] = useState<TechNotificationsState>(store);

  useEffect(() => {
    listeners.add(setState);
    emit();

    void loadShared();
    ensurePolling();
    ensureVisibilityListener();

    return () => {
      listeners.delete(setState);
      stopPollingIfUnused();
      removeVisibilityListenerIfUnused();
    };
  }, []);

  const load = useCallback(async () => {
    await loadShared(true);
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    await markTechNotificationAsReadService(notificationId);
    store.notifications = store.notifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification,
    );
    emit();
  }, []);

  const unreadCount = useMemo(
    () => state.notifications.filter((notification) => !notification.read).length,
    [state.notifications],
  );

  return {
    error: state.error,
    isLoading: state.isLoading,
    load,
    markAsRead,
    notifications: state.notifications,
    unreadCount,
  };
}
