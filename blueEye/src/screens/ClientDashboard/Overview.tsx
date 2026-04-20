import type React from "react";
import CameraStatusCard from "./components/CameraStatusCard";
import { useClientDashboard } from "./hooks/useClientDashboard";
import type { SystemStatusData } from "../../types/client.types";

const T = {
  bg: "#F8FAF8",
  border: "#E2E8E4",
  danger: "#E05252",
  dangerBd: "rgba(224,82,82,0.22)",
  dangerSft: "rgba(224,82,82,0.08)",
  green: "#4CAF82",
  greenDark: "#2E8B5E",
  greenMid: "#A8DBBE",
  greenSft: "#EAF7F1",
  mono: "'JetBrains Mono', 'Fira Mono', monospace",
  sans: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  t1: "#1A2332",
  t2: "#4A5568",
  t3: "#9AA3B2",
  warning: "#D48A20",
  warningBd: "rgba(212,138,32,0.22)",
  warningSft: "rgba(212,138,32,0.08)",
  white: "#FFFFFF",
} as const;

const NVR_CFG = {
  degraded: { bd: T.warningBd, bg: T.warningSft, color: T.warning, label: "Degradado" },
  offline: { bd: T.dangerBd, bg: T.dangerSft, color: T.danger, label: "Offline" },
  online: { bd: T.greenMid, bg: T.greenSft, color: T.green, label: "Online" },
} as const;

const accentMap: Record<string, { bd: string; bg: string; color: string }> = {
  amber: { bd: T.warningBd, bg: T.warningSft, color: T.warning },
  blue: { bd: "rgba(90,158,200,0.22)", bg: "rgba(90,158,200,0.08)", color: "#5A9EC8" },
  green: { bd: T.greenMid, bg: T.greenSft, color: T.green },
  red: { bd: T.dangerBd, bg: T.dangerSft, color: T.danger },
};

function LightStatCard({
  accent,
  barWidth,
  detail,
  title,
  value,
}: {
  accent: string;
  barWidth?: string;
  detail: string;
  title: string;
  value: number;
}) {
  const a = accentMap[accent] ?? accentMap.green;

  return (
    <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, boxShadow: "0 1px 4px rgba(26,35,50,0.04)", display: "flex", flexDirection: "column", fontFamily: T.sans, gap: 8, padding: "18px 20px" }}>
      <div style={{ color: T.t3, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>{title}</div>
      <div style={{ color: T.t1, fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</div>
      <div style={{ color: T.t3, fontSize: 11 }}>{detail}</div>
      {barWidth && (
        <div style={{ background: T.border, borderRadius: 2, height: 3, marginTop: 4, overflow: "hidden" }}>
          <div style={{ background: a.color, borderRadius: 2, height: "100%", transition: "width 0.5s ease", width: barWidth }} />
        </div>
      )}
    </div>
  );
}

function Tag({
  bd,
  bg,
  children,
  color,
}: {
  bd: string;
  bg: string;
  children: React.ReactNode;
  color: string;
}) {
  return (
    <span style={{ background: bg, border: `1px solid ${bd}`, borderRadius: 100, color, fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "3px 10px", whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function getOnlineBarWidth(summary: SystemStatusData["summary"]) {
  if (summary.totalCameras === 0) {
    return "0%";
  }

  return `${(summary.onlineCameras / summary.totalCameras) * 100}%`;
}

const Overview = () => {
  const { integrationNote, isLoading, markAsRead, notifications, statusData } =
    useClientDashboard();

  if (isLoading) {
    return <div style={{ color: T.t3, fontFamily: T.sans, fontSize: 12, padding: 24 }}>Cargando portal cliente...</div>;
  }

  if (!statusData) {
    return (
      <section style={{ background: T.bg, display: "flex", flexDirection: "column", fontFamily: T.sans, gap: 20, minHeight: "100vh", padding: "24px 28px 56px" }}>
        <header>
          <div style={{ color: T.green, fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", marginBottom: 6, textTransform: "uppercase" }}>Portal del cliente · Monitoreo</div>
          <h1 style={{ color: T.t1, fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, margin: 0 }}>Estado del sistema</h1>
          <p style={{ color: T.t3, fontSize: 13, fontWeight: 500, margin: "5px 0 0" }}>La parte de monitoreo aun depende de endpoints que no existen en backend.</p>
        </header>

        <article style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, boxShadow: "0 1px 4px rgba(26,35,50,0.04)", maxWidth: 720, padding: "20px 22px" }}>
          <div style={{ color: T.t1, fontSize: 14, fontWeight: 700 }}>Integracion pendiente</div>
          <p style={{ color: T.t2, fontSize: 13, lineHeight: 1.6, margin: "8px 0 0" }}>{integrationNote}</p>
          {notifications.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <div style={{ color: T.t3, fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>
                Notificaciones locales
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {notifications.slice(0, 4).map((notification, index) => (
                  <li key={notification.id} style={{ alignItems: "flex-start", borderBottom: index < Math.min(notifications.length, 4) - 1 ? `1px solid ${T.border}` : "none", display: "flex", gap: 12, justifyContent: "space-between", opacity: notification.read ? 0.45 : 1, padding: "12px 0" }}>
                    <div>
                      <div style={{ color: T.t1, fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{notification.title}</div>
                      <div style={{ color: T.t2, fontSize: 11 }}>{notification.message}</div>
                    </div>
                    {!notification.read && (
                      <button type="button" onClick={() => { void markAsRead(notification.id); }} style={{ background: T.greenSft, border: `1px solid ${T.greenMid}`, borderRadius: 100, color: T.greenDark, cursor: "pointer", flexShrink: 0, fontFamily: T.mono, fontSize: 10, fontWeight: 700, padding: "4px 12px", whiteSpace: "nowrap" }}>
                        Marcar leida
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </section>
    );
  }

  const nvr = NVR_CFG[statusData.summary.nvrStatus];
  const unread = notifications.filter((notification) => !notification.read).length;

  return (
    <section style={{ background: T.bg, display: "flex", flexDirection: "column", fontFamily: T.sans, gap: 20, minHeight: "100vh", padding: "24px 28px 56px" }}>
      <header>
        <div style={{ color: T.green, fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", marginBottom: 6, textTransform: "uppercase" }}>Portal del cliente · Monitoreo</div>
        <h1 style={{ color: T.t1, fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, margin: 0 }}>Estado del sistema</h1>
        <p style={{ color: T.t3, fontSize: 13, fontWeight: 500, margin: "5px 0 0" }}>Vista exclusiva de monitoreo para cliente.</p>
      </header>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(4, 1fr)" }}>
        <LightStatCard accent="blue" detail="instaladas" title="Camaras totales" value={statusData.summary.totalCameras} />
        <LightStatCard accent="green" barWidth={getOnlineBarWidth(statusData.summary)} detail="en linea ahora" title="Camaras online" value={statusData.summary.onlineCameras} />
        <LightStatCard accent="red" detail="requieren atencion" title="Camaras offline" value={statusData.summary.offlineCameras} />
        <LightStatCard accent="amber" detail="sin resolver" title="Alertas activas" value={statusData.summary.activeAlerts} />
      </div>

      <div style={{ alignItems: "center", background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: "0 1px 4px rgba(26,35,50,0.04)", display: "flex", justifyContent: "space-between", padding: "14px 20px" }}>
        <div>
          <div style={{ color: T.t1, fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em" }}>Estado NVR</div>
          <div style={{ color: T.t3, fontFamily: T.mono, fontSize: 10, letterSpacing: "0.1em", marginTop: 3, textTransform: "uppercase" }}>Grabador de Video en Red</div>
        </div>
        <Tag bd={nvr.bd} bg={nvr.bg} color={nvr.color}>{nvr.label}</Tag>
      </div>

      <section>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ color: T.t2, fontSize: 14, fontWeight: 700, margin: 0 }}>Camaras por sitio</h2>
          <Tag bd={T.greenMid} bg={T.greenSft} color={T.green}>{statusData.summary.onlineCameras} / {statusData.summary.totalCameras} activas</Tag>
        </div>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(3, 1fr)" }}>
          {statusData.cameras.map((camera) => <CameraStatusCard key={camera.id} camera={camera} />)}
        </div>
      </section>

      {notifications.length > 0 && (
        <section style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: "0 1px 4px rgba(26,35,50,0.04)", overflow: "hidden" }}>
          <div style={{ alignItems: "center", background: T.greenSft, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", padding: "13px 18px" }}>
            <div>
              <div style={{ color: T.t1, fontSize: 13, fontWeight: 700 }}>Notificaciones recientes</div>
              <div style={{ color: T.t3, fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", marginTop: 2, textTransform: "uppercase" }}>Actividad del sistema</div>
            </div>
            <Tag bd={T.greenMid} bg={T.white} color={T.green}>{unread} sin leer</Tag>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {notifications.slice(0, 4).map((notification, index) => (
              <li key={notification.id} style={{ alignItems: "flex-start", borderBottom: index < Math.min(notifications.length, 4) - 1 ? `1px solid ${T.border}` : "none", display: "flex", gap: 12, justifyContent: "space-between", opacity: notification.read ? 0.45 : 1, padding: "12px 18px" }}>
                <div>
                  <div style={{ color: T.t1, fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{notification.title}</div>
                  <div style={{ color: T.t2, fontSize: 11 }}>{notification.message}</div>
                </div>
                {!notification.read && (
                  <button type="button" onClick={() => { void markAsRead(notification.id); }} style={{ background: T.greenSft, border: `1px solid ${T.greenMid}`, borderRadius: 100, color: T.greenDark, cursor: "pointer", flexShrink: 0, fontFamily: T.mono, fontSize: 10, fontWeight: 700, padding: "4px 12px", whiteSpace: "nowrap" }}>
                    Marcar leida
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
};

export default Overview;
