import { useCallback, useEffect, useState } from "react";
import CameraStatusCard from "../components/CameraStatusCard";
import StatCard from "../components/StatCard";
import { clientService } from "../services/client.service";
import type { ClientNotification, SystemStatusData } from "../types/client.types";

// ─── BlueEye Tokens ───────────────────────────────────────────────────────────
const C = {
  bgCard:    "#0f172a",
  bgCardEnd: "#1e293b",
  primary:      "#22d3ee",
  primaryBg:    "rgba(34,211,238,0.07)",
  primaryBd:    "rgba(34,211,238,0.16)",
  warning:   "#fbbf24",
  warningBg: "rgba(251,191,36,0.08)",
  warningBd: "rgba(251,191,36,0.22)",
  danger:    "#ef4444",
  dangerBg:  "rgba(239,68,68,0.08)",
  dangerBd:  "rgba(239,68,68,0.22)",
  info:    "#0ea5e9",
  infoBg:  "rgba(14,165,233,0.08)",
  infoBd:  "rgba(14,165,233,0.22)",
  textPrimary:   "#f1f5f9",
  textSecondary: "#e2e8f0",
  textMuted:     "#94a3b8",
  textSubtle:    "#64748b",
  border:      "rgba(255,255,255,0.06)",
  borderCard:  "rgba(34,211,238,0.1)",
  f: "'Geist','Inter',-apple-system,sans-serif",
  m: "'Geist Mono','JetBrains Mono',ui-monospace,monospace",
} as const;

const NVR_CFG = {
  online:   { color: C.primary, bg: C.primaryBg, bd: C.primaryBd, label: "Online"   },
  degraded: { color: C.warning, bg: C.warningBg, bd: C.warningBd, label: "Degradado" },
  offline:  { color: C.danger,  bg: C.dangerBg,  bd: C.dangerBd,  label: "Offline"  },
} as const;

const ClientDashboard = () => {
  const [statusData,     setStatusData]     = useState<SystemStatusData | null>(null);
  const [notifications,  setNotifications]  = useState<ClientNotification[]>([]);
  const [isLoading,      setIsLoading]      = useState(true);

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
      <div style={{ padding: 24, fontFamily: C.f, fontSize: 12, color: C.textSubtle }}>
        Cargando portal cliente...
      </div>
    );
  }

  const nvr = NVR_CFG[statusData.summary.nvrStatus];
  const unread = notifications.filter(n => !n.read).length;

  return (
    <section style={{ padding: "24px 28px 56px", display: "flex", flexDirection: "column", gap: 20, fontFamily: C.f }}>

      {/* ── Page header ── */}
      <header>
        <div style={{ fontSize: 10, fontFamily: C.m, letterSpacing: "0.18em", textTransform: "uppercase", color: C.primary, marginBottom: 6, opacity: 0.8 }}>
          Portal del cliente · Monitoreo
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: C.textPrimary, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.15 }}>
          Estado del sistema
        </h1>
        <p style={{ fontSize: 12, color: C.textSubtle, margin: "5px 0 0" }}>
          Vista exclusiva de monitoreo para cliente.
        </p>
      </header>

      {/* ── Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <StatCard
          title="Cámaras totales"
          value={statusData.summary.totalCameras}
          accent="blue"
          detail="instaladas"
        />
        <StatCard
          title="Cámaras online"
          value={statusData.summary.onlineCameras}
          accent="green"
          detail="en línea ahora"
          barWidth={`${(statusData.summary.onlineCameras / statusData.summary.totalCameras) * 100}%`}
        />
        <StatCard
          title="Cámaras offline"
          value={statusData.summary.offlineCameras}
          accent="red"
          detail="requieren atención"
        />
        <StatCard
          title="Alertas activas"
          value={statusData.summary.activeAlerts}
          accent="amber"
          detail="sin resolver"
        />
      </div>

      {/* ── NVR Status ── */}
      <div style={{
        background: `linear-gradient(135deg, ${C.bgCard} 0%, ${C.bgCardEnd} 100%)`,
        border: `1px solid ${C.borderCard}`,
        borderRadius: 12,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: C.f,
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, letterSpacing: "-0.01em" }}>
            Estado NVR
          </div>
          <div style={{ fontSize: 10, fontFamily: C.m, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textSubtle, marginTop: 3 }}>
            Grabador de Video en Red
          </div>
        </div>
        <span style={{
          fontSize: 9, fontFamily: C.m, letterSpacing: "0.1em", fontWeight: 600,
          padding: "4px 12px", borderRadius: 6,
          background: nvr.bg, color: nvr.color, border: `1px solid ${nvr.bd}`,
          textTransform: "uppercase",
        }}>
          {nvr.label}
        </span>
      </div>

      {/* ── Camera grid ── */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: C.textSecondary, margin: 0 }}>
            Cámaras por sitio
          </h2>
          <span style={{
            fontSize: 9, fontFamily: C.m, letterSpacing: "0.1em", fontWeight: 600,
            padding: "3px 9px", borderRadius: 5,
            background: C.primaryBg, color: C.primary, border: `1px solid ${C.primaryBd}`,
          }}>
            {statusData.summary.onlineCameras} / {statusData.summary.totalCameras} activas
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {statusData.cameras.map(camera => (
            <CameraStatusCard key={camera.id} camera={camera} />
          ))}
        </div>
      </section>

      {/* ── Notifications inline ── */}
      {notifications.length > 0 && (
        <section style={{
          background: `linear-gradient(135deg, ${C.bgCard} 0%, ${C.bgCardEnd} 100%)`,
          border: `1px solid ${C.borderCard}`,
          borderRadius: 12,
          overflow: "hidden",
        }}>
          <div style={{
            padding: "12px 18px",
            borderBottom: `1px solid ${C.border}`,
            background: "rgba(6,13,26,0.4)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>Notificaciones recientes</div>
              <div style={{ fontSize: 9, fontFamily: C.m, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textSubtle, marginTop: 2 }}>
                Actividad del sistema
              </div>
            </div>
            <span style={{
              fontSize: 9, fontFamily: C.m, letterSpacing: "0.1em", fontWeight: 600,
              padding: "3px 9px", borderRadius: 5,
              background: C.primaryBg, color: C.primary, border: `1px solid ${C.primaryBd}`,
            }}>
              {unread} sin leer
            </span>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {notifications.slice(0, 4).map((n, i) => (
              <li
                key={n.id}
                style={{
                  display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
                  padding: "12px 18px",
                  borderBottom: i < Math.min(notifications.length, 4) - 1 ? `1px solid ${C.border}` : "none",
                  opacity: n.read ? 0.55 : 1,
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: C.textPrimary, marginBottom: 2 }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{n.message}</div>
                </div>
                {!n.read && (
                  <button
                    type="button"
                    onClick={() => markAsRead(n.id)}
                    style={{
                      padding: "3px 10px", borderRadius: 6,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: C.textMuted, fontSize: 9, fontFamily: C.m,
                      fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                    }}
                  >
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