import type { ClientNotification } from "../types/client.types";

interface NotificationPanelProps {
  notifications: ClientNotification[];
  onMarkAsRead: (notificationId: string) => void;
}

const typeLabel: Record<ClientNotification["type"], string> = {
  invoice: "Factura",
  ticket: "Ticket",
  system_alert: "Alerta sistema",
};

const NotificationPanel = ({ notifications, onMarkAsRead }: NotificationPanelProps) => (
  <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <header className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800">Notificaciones</h2>
      <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
        {notifications.filter((item) => !item.read).length} sin leer
      </span>
    </header>
    <ul className="space-y-2">
      {notifications.map((notification) => (
        <li key={notification.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-800">{notification.title}</p>
            <span className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700">
              {typeLabel[notification.type]}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</span>
            {!notification.read && (
              <button
                type="button"
                onClick={() => onMarkAsRead(notification.id)}
                className="rounded-md bg-gray-800 px-2 py-1 text-xs font-semibold text-white"
              >
                Marcar leida
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default NotificationPanel;
