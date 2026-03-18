import { useState } from "react";
import type { ClientNotification } from "../types/client.types";

const C = {
  bgCard:    "#0f172a",
  bgCardEnd: "#1e293b",
  primary:      "#22d3ee",
  primaryBg:    "rgba(34,211,238,0.07)",
  primaryBg2:   "rgba(34,211,238,0.12)",
  primaryBd:    "rgba(34,211,238,0.16)",
  primaryBd2:   "rgba(34,211,238,0.28)",
  warning:   "#fbbf24",
  warningBg: "rgba(251,191,36,0.08)",
  warningBd: "rgba(251,191,36,0.22)",
  info:    "#0ea5e9",
  infoBg:  "rgba(14,165,233,0.08)",
  infoBd:  "rgba(14,165,233,0.22)",
  textPrimary:   "#f1f5f9",
  textSecondary: "#e2e8f0",
  textBody:      "#cbd5e1",
  textMuted:     "#94a3b8",
  textSubtle:    "#64748b",
  border:      "rgba(255,255,255,0.06)",
  borderCard:  "rgba(34,211,238,0.1)",
  f: "'Geist','Inter',-apple-system,sans-serif",
  m: "'Geist Mono','JetBrains Mono',ui-monospace,monospace",
} as const;

const TYPE_CFG = {
  invoice:      { label: "Factura",       bar: C.primary, tagBg: C.primaryBg, tagCl: C.primary, tagBd: C.primaryBd },
  ticket:       { label: "Ticket",        bar: C.warning, tagBg: C.warningBg, tagCl: "#fcd34d", tagBd: C.warningBd },
  system_alert: { label: "Alerta sistema", bar: C.info,   tagBg: C.infoBg,    tagCl: "#38bdf8", tagBd: C.infoBd    },
} satisfies Record<ClientNotification["type"], object>;

interface NotificationPanelProps {
  notifications: ClientNotification[];
  onMarkAsRead:  (notificationId: string) => void;
}

function Tag({ bg, color, bd, children }: { bg: string; color: string; bd: string; children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 9, fontFamily: C.m, letterSpacing: "0.1em", fontWeight: 600,
      padding: "3px 9px", borderRadius: 5,
      background: bg, color, border: `1px solid ${bd}`,
      whiteSpace: "nowrap", lineHeight: 1, flexShrink: 0,
    }}>
      {children}
    </span>
  );
}

function NotifRow({ n, onMarkAsRead, last }: { n: ClientNotification; onMarkAsRead: () => void; last: boolean }) {
  const [hov, setHov] = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  const cfg = TYPE_CFG[n.type];

  return (
    <li
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "3px 1fr auto",
        gap: 14,
        alignItems: "start",
        padding: "12px 18px",
        borderBottom: last ? "none" : `1px solid ${C.border}`,
        background: hov ? "rgba(255,255,255,0.02)" : "transparent",
        cursor: "pointer",
        transition: "background 0.15s",
        opacity: n.read ? 0.55 : 1,
      }}
    >
      {/* Color bar */}
      <div style={{
        width: 3, borderRadius: 2, minHeight: 36, marginTop: 3,
        background: cfg.bar,
        boxShadow: `0 0 8px ${cfg.bar}55`,
      }} />

      {/* Content */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: C.textPrimary, marginBottom: 3 }}>
          {n.title}
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.55 }}>
          {n.message}
        </div>
        <div style={{ marginTop: 6, fontSize: 9, fontFamily: C.m, color: C.textSubtle, letterSpacing: "0.06em" }}>
          {new Date(n.createdAt).toLocaleString()}
        </div>
      </div>

      {/* Right col */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
        <Tag bg={cfg.tagBg} color={cfg.tagCl} bd={cfg.tagBd}>{cfg.label}</Tag>
        {!n.read && (
          <button
            type="button"
            onClick={onMarkAsRead}
            onMouseEnter={() => setBtnHov(true)}
            onMouseLeave={() => setBtnHov(false)}
            style={{
              padding: "3px 10px", borderRadius: 6,
              background: btnHov ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${btnHov ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.08)"}`,
              color: C.textMuted, fontSize: 9, fontFamily: C.m,
              fontWeight: 600, letterSpacing: "0.06em",
              cursor: "pointer", transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            Marcar leída
          </button>
        )}
      </div>
    </li>
  );
}

export default function NotificationPanel({ notifications, onMarkAsRead }: NotificationPanelProps) {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <section style={{
      background:   `linear-gradient(135deg, ${C.bgCard} 0%, ${C.bgCardEnd} 100%)`,
      border:       `1px solid ${C.borderCard}`,
      borderRadius: 12,
      overflow:     "hidden",
      fontFamily:   C.f,
    }}>
      {/* Panel header */}
      <div style={{
        padding: "12px 18px",
        borderBottom: `1px solid ${C.border}`,
        background: "rgba(6,13,26,0.4)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, letterSpacing: "-0.01em" }}>
            Notificaciones
          </div>
          <div style={{ fontSize: 9, fontFamily: C.m, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textSubtle, marginTop: 2 }}>
            Actividad reciente
          </div>
        </div>
        <Tag bg={C.primaryBg} color={C.primary} bd={C.primaryBd}>
          {unread} sin leer
        </Tag>
      </div>

      {/* Notification list */}
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {notifications.map((n, i) => (
          <NotifRow
            key={n.id}
            n={n}
            onMarkAsRead={() => onMarkAsRead(n.id)}
            last={i === notifications.length - 1}
          />
        ))}
      </ul>

      {notifications.length === 0 && (
        <div style={{ padding: "40px 0", textAlign: "center", color: C.textSubtle, fontSize: 12 }}>
          ✓ Sin notificaciones pendientes
        </div>
      )}
    </section>
  );
}