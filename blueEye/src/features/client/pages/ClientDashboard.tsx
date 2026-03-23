import { useCallback, useEffect, useState } from "react";
import CameraStatusCard from "../components/CameraStatusCard";

import { clientService } from "../services/client.service";
import type { ClientNotification, SystemStatusData } from "../types/client.types";

// ─── BlueEye Landing tokens ───────────────────────────────────────────────────
const T = {
  bg:         "#F8FAF8",
  white:      "#FFFFFF",
  green:      "#4CAF82",
  greenDark:  "#2E8B5E",
  greenSft:   "#EAF7F1",
  greenMid:   "#A8DBBE",
  greenLight: "#C8EDD9",
  warning:    "#D48A20",
  warningSft: "rgba(212,138,32,0.08)",
  warningBd:  "rgba(212,138,32,0.22)",
  danger:     "#E05252",
  dangerSft:  "rgba(224,82,82,0.08)",
  dangerBd:   "rgba(224,82,82,0.22)",
  navy:       "#1A2332",
  t1:         "#1A2332",
  t2:         "#4A5568",
  t3:         "#9AA3B2",
  border:     "#E2E8E4",
  sans:       "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  mono:       "'JetBrains Mono', 'Fira Mono', monospace",
} as const;

const NVR_CFG = {
  online:   { color: T.green,   bg: T.greenSft,  bd: T.greenMid,   label: "Online"    },
  degraded: { color: T.warning, bg: T.warningSft, bd: T.warningBd, label: "Degradado" },
  offline:  { color: T.danger,  bg: T.dangerSft,  bd: T.dangerBd,  label: "Offline"   },
} as const;

// ─── Stat Card light ──────────────────────────────────────────────────────────
const accentMap: Record<string, { color: string; bg: string; bd: string }> = {
  blue:  { color: "#5A9EC8", bg: "rgba(90,158,200,0.08)",  bd: "rgba(90,158,200,0.22)"  },
  green: { color: T.green,   bg: T.greenSft,               bd: T.greenMid               },
  red:   { color: T.danger,  bg: T.dangerSft,              bd: T.dangerBd               },
  amber: { color: T.warning, bg: T.warningSft,             bd: T.warningBd              },
};

function LightStatCard({ title, value, accent, detail, barWidth }: {
  title: string; value: number; accent: string; detail: string; barWidth?: string;
}) {
  const a = accentMap[accent] ?? accentMap.green;
  return (
    <div style={{
      background: T.white,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      fontFamily: T.sans,
      boxShadow: "0 1px 4px rgba(26,35,50,0.04)",
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: T.t3, letterSpacing: "0.04em" }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: T.t1, letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: T.t3 }}>{detail}</div>
      {barWidth && (
        <div style={{ height: 3, borderRadius: 2, background: T.border, marginTop: 4, overflow: "hidden" }}>
          <div style={{ width: barWidth, height: "100%", background: a.color, borderRadius: 2, transition: "width 0.5s ease" }} />
        </div>
      )}
    </div>
  );
}

// ─── Tag helper ───────────────────────────────────────────────────────────────
function Tag({ color, bg, bd, children }: { color: string; bg: string; bd: string; children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 10, fontFamily: T.mono, letterSpacing: "0.08em", fontWeight: 700,
      padding: "3px 10px", borderRadius: 100,
      background: bg, color, border: `1px solid ${bd}`,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

const ClientDashboard = () => {
  const [statusData,    setStatusData]    = useState<SystemStatusData | null>(null);
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [isLoading,     setIsLoading]     = useState(true);

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
    const id = window.setInterval(() => { void loadStatus(); }, 5000);
    return () => window.clearInterval(id);
  }, [loadStatus]);

  const markAsRead = async (notificationId: string) => {
    await clientService.markNotificationAsRead(notificationId);
    await loadNotifications();
  };

  if (isLoading || !statusData) {
    return (
      <div style={{ padding: 24, fontFamily: T.sans, fontSize: 12, color: T.t3 }}>
        Cargando portal cliente...
      </div>
    );
  }

  const nvr    = NVR_CFG[statusData.summary.nvrStatus];
  const unread = notifications.filter(n => !n.read).length;

  return (
    <section style={{ padding: "24px 28px 56px", display: "flex", flexDirection: "column", gap: 20, fontFamily: T.sans, background: T.bg, minHeight: "100vh" }}>

      {/* Header */}
      <header>
        <div style={{ fontSize: 10, fontFamily: T.mono, letterSpacing: "0.18em", textTransform: "uppercase", color: T.green, marginBottom: 6, fontWeight: 700 }}>
          Portal del cliente · Monitoreo
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: T.t1, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.15 }}>
          Estado del sistema
        </h1>
        <p style={{ fontSize: 13, color: T.t3, margin: "5px 0 0", fontWeight: 500 }}>
          Vista exclusiva de monitoreo para cliente.
        </p>
      </header>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <LightStatCard title="Cámaras totales"  value={statusData.summary.totalCameras}   accent="blue"  detail="instaladas" />
        <LightStatCard title="Cámaras online"   value={statusData.summary.onlineCameras}  accent="green" detail="en línea ahora" barWidth={`${(statusData.summary.onlineCameras / statusData.summary.totalCameras) * 100}%`} />
        <LightStatCard title="Cámaras offline"  value={statusData.summary.offlineCameras} accent="red"   detail="requieren atención" />
        <LightStatCard title="Alertas activas"  value={statusData.summary.activeAlerts}   accent="amber" detail="sin resolver" />
      </div>

      {/* NVR status */}
      <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px rgba(26,35,50,0.04)" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.t1, letterSpacing: "-0.01em" }}>Estado NVR</div>
          <div style={{ fontSize: 10, fontFamily: T.mono, letterSpacing: "0.1em", textTransform: "uppercase", color: T.t3, marginTop: 3 }}>Grabador de Video en Red</div>
        </div>
        <Tag color={nvr.color} bg={nvr.bg} bd={nvr.bd}>{nvr.label}</Tag>
      </div>

      {/* Cameras grid */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: T.t2, margin: 0 }}>Cámaras por sitio</h2>
          <Tag color={T.green} bg={T.greenSft} bd={T.greenMid}>
            {statusData.summary.onlineCameras} / {statusData.summary.totalCameras} activas
          </Tag>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {statusData.cameras.map(camera => <CameraStatusCard key={camera.id} camera={camera} />)}
        </div>
      </section>

      {/* Notifications */}
      {notifications.length > 0 && (
        <section style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(26,35,50,0.04)" }}>
          <div style={{ padding: "13px 18px", borderBottom: `1px solid ${T.border}`, background: T.greenSft, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.t1 }}>Notificaciones recientes</div>
              <div style={{ fontSize: 10, fontFamily: T.mono, letterSpacing: "0.12em", textTransform: "uppercase", color: T.t3, marginTop: 2 }}>Actividad del sistema</div>
            </div>
            <Tag color={T.green} bg={T.white} bd={T.greenMid}>{unread} sin leer</Tag>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {notifications.slice(0, 4).map((n, i) => (
              <li key={n.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "12px 18px", borderBottom: i < Math.min(notifications.length, 4) - 1 ? `1px solid ${T.border}` : "none", opacity: n.read ? 0.45 : 1 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.t1, marginBottom: 2 }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: T.t2 }}>{n.message}</div>
                </div>
                {!n.read && (
                  <button type="button" onClick={() => markAsRead(n.id)} style={{ padding: "4px 12px", borderRadius: 100, background: T.greenSft, border: `1px solid ${T.greenMid}`, color: T.greenDark, fontSize: 10, fontFamily: T.mono, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                    Marcar leída
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

export default ClientDashboard;