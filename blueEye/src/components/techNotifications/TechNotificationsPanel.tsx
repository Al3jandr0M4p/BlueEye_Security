import type React from "react";
import type { TechNotification } from "../../types/tech.types";

type TechNotificationsPanelProps = {
  notifications: TechNotification[];
  unreadCount: number;
  isLoading?: boolean;
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

function NotificationRow({
  notification,
  onMarkAsRead,
}: {
  notification: TechNotification;
  onMarkAsRead: (notificationId: string) => void;
}) {
  const isUnread = !notification.read;
  const assignedBy = notification.metadata?.assignedBy ?? "Admin";
  const requesterName = notification.metadata?.requesterName ?? "Cliente";

  return (
    <li
      className={`rounded-2xl border px-4 py-3 transition ${
        isUnread
          ? "border-sky-200 bg-sky-50/70"
          : "border-slate-200 bg-white opacity-80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {notification.title || "Notificacion"}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {notification.message || "Sin detalles."}
          </p>
        </div>
        {isUnread && (
          <span className="rounded-full bg-sky-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
            Nueva
          </span>
        )}
      </div>

      <div className="mt-3 grid gap-2 text-xs text-slate-500 md:grid-cols-2">
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
          className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Marcar leida
        </button>
      )}
    </li>
  );
}

const TechNotificationsPanel: React.FC<TechNotificationsPanelProps> = ({
  notifications,
  unreadCount,
  isLoading = false,
  onMarkAsRead,
}) => {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Notificaciones
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Asignaciones del admin
          </h2>
        </div>

        <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
          {unreadCount} sin leer
        </div>
      </div>

      {isLoading && (
        <p className="mt-4 text-sm text-slate-500">Cargando notificaciones...</p>
      )}

      {!isLoading && notifications.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">
          Cuando el admin te asigne tickets, apareceran aqui.
        </p>
      )}

      <ul className="mt-4 grid gap-3">
        {notifications.slice(0, 6).map((notification) => (
          <NotificationRow
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </ul>
    </section>
  );
};

export default TechNotificationsPanel;
