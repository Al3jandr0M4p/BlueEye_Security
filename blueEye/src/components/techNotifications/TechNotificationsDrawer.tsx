import { Drawer } from "flowbite-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import type { TechNotification } from "../../types/tech.types";

type TechNotificationsDrawerProps = {
  isOpen: boolean;
  notifications: TechNotification[];
  unreadCount: number;
  isLoading?: boolean;
  onClose: () => void;
  onMarkAsRead: (notificationId: string) => void;
};

function formatDate(value?: string | null) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export const TechNotificationsDrawer: React.FC<TechNotificationsDrawerProps> = ({
  isOpen,
  notifications,
  unreadCount,
  isLoading = false,
  onClose,
  onMarkAsRead,
}) => {
  const [tab, setTab] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const visibleNotifications = useMemo(
    () =>
      tab === "unread"
        ? notifications.filter((notification) => !notification.read)
        : notifications,
    [notifications, tab],
  );

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      position="right"
      className="flex h-[92vh] w-full max-w-[560px] flex-col rounded-l-3xl py-3 shadow-2xl my-4"
    >
      <div className="flex items-center justify-between px-5 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Notificaciones
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Asignaciones del admin
          </h2>
        </div>

        <button type="button" onClick={onClose} className="cursor-pointer text-slate-500">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-1">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("all")}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              tab === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setTab("unread")}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              tab === "unread" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            Sin leer
          </button>
        </div>

        <div className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
          {unreadCount} nuevas
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        {isLoading && (
          <p className="mt-3 text-base text-slate-500">Cargando notificaciones...</p>
        )}

        {!isLoading && visibleNotifications.length === 0 && (
          <div className="mt-3 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-6 text-base text-slate-500">
            Cuando el admin te asigne tickets, apareceran aqui.
          </div>
        )}

        <ul className="mt-3 grid gap-3">
          {visibleNotifications.map((notification) => {
            const isUnread = !notification.read;
            const assignedBy = notification.metadata?.assignedBy ?? "Admin";
            const requesterName = notification.metadata?.requesterName ?? "Cliente";

            return (
              <li
                key={notification.id}
                className={`rounded-[24px] border px-4 py-4 transition ${
                  isUnread
                    ? "border-sky-200 bg-sky-50/85 shadow-sm"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {notification.title || "Notificacion"}
                    </p>
                    <p className="mt-1 text-base leading-7 text-slate-600">
                      {notification.message || "Sin detalles."}
                    </p>
                  </div>
                  {isUnread && (
                    <span className="rounded-full bg-sky-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                      Nueva
                    </span>
                  )}
                </div>

                <div className="mt-4 grid gap-2 text-sm text-slate-500">
                  <span>Admin: {assignedBy}</span>
                  <span>Cliente: {requesterName}</span>
                  <span>Fecha: {formatDate(notification.created_at)}</span>
                  <span>
                    Ticket: {notification.ticket_id ? `#${notification.ticket_id}` : "Sin id"}
                  </span>
                </div>

                {isUnread && (
                  <button
                    type="button"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Marcar leida
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Drawer>
  );
};
