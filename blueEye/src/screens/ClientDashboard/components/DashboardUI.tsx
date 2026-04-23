import React, { useEffect, useState } from "react";
import { CameraCard } from "./CameraCard";
import type { Camera } from "./CameraCard";
import { NVRPanel } from "./NVRPanel";
import type { NVRData } from "./NVRPanel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardAlert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  time: string;
  source: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_CAMERAS: Camera[] = [
  { id: "cam-001", name: "CAM-001", location: "Entrada Principal",  ip: "192.168.1.101", uptime: "99.8%", lastSeen: "Ahora",    status: "online" },
  { id: "cam-002", name: "CAM-002", location: "Estacionamiento A",  ip: "192.168.1.102", uptime: "98.2%", lastSeen: "Ahora",    status: "online" },
  { id: "cam-003", name: "CAM-003", location: "Pasillo Norte",      ip: "192.168.1.103", uptime: "0%",    lastSeen: "Hace 18h", status: "offline" },
  { id: "cam-004", name: "CAM-004", location: "Sala de Servidores", ip: "192.168.1.104", uptime: "100%",  lastSeen: "Ahora",    status: "online" },
  { id: "cam-005", name: "CAM-005", location: "Perímetro Oeste",    ip: "192.168.1.105", uptime: "—",     lastSeen: "Mant.",    status: "maintenance" },
  { id: "cam-006", name: "CAM-006", location: "Acceso Bodega",      ip: "192.168.1.106", uptime: "97.4%", lastSeen: "Ahora",    status: "online" },
];

const MOCK_NVR: NVRData = {
  name: "Director NVR", model: "Dahua XVR5108HS", ip: "192.168.1.10",
  temperature: 42, firmware: "v3.4.2",
  activeChannels: 6, totalChannels: 8,
  storageUsed: 87, storageTotal: "4 TB", status: "online",
};

const MOCK_ALERTS: DashboardAlert[] = [
  { id: "a1", type: "critical", title: "Cámara sin señal",         description: "CAM-003 (Pasillo Norte) offline desde hace 18h. Ticket generado automáticamente.", time: "Hace 18h", source: "CAM-003" },
  { id: "a2", type: "warning",  title: "Almacenamiento crítico",   description: "NVR Principal al 87%. Revisar política de retención de grabaciones.",              time: "Hace 3d",  source: "NVR" },
  { id: "a3", type: "info",     title: "Mantenimiento programado", description: "Visita técnica preventiva 25 feb entre 9:00–12:00 am.",                            time: "Hace 2d",  source: "Sistema" },
];

const UPTIME_DATA = [92,96,100,84,100,100,96,88,100,100,94,100,100,98,100,86,100,100,96,100,100,88,94,100,100,100,96,98,100,100];

// ─── Design tokens — BlueEye brand (portal oscuro) ────────────────────────────

const T = {
  // Fondos
  bg:      "#060E1A",           // navy muy oscuro — fondo raíz
  panel:   "#0F1E30",           // cards
  surface: "#162640",           // hover surface

  // Bordes
  border:  "rgba(76,175,130,0.10)",
  border2: "rgba(76,175,130,0.20)",

  // Texto
  t1:      "#F0F4F8",
  t2:      "#9AAEC4",
  t3:      "#3E5670",

  // Brand green — mismo que la landing
  mint:    "#4CAF82",
  mintDim: "rgba(76,175,130,0.18)",
  mintBg:  "rgba(76,175,130,0.08)",

  // Estados
  red:     "#E05252",
  redDim:  "rgba(224,82,82,0.09)",
  redBd:   "rgba(224,82,82,0.25)",

  amber:   "#D48A20",
  amberDim:"rgba(212,138,32,0.09)",
  amberBd: "rgba(212,138,32,0.25)",

  blue:    "#4CAF82",           // reemplazado por el verde de la marca para el uptime
  blueDim: "rgba(76,175,130,0.08)",
  blueBd:  "rgba(76,175,130,0.20)",

  // Tipografía — misma que la landing
  font:    "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  mono:    "'JetBrains Mono', 'Fira Mono', monospace",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string; value: string | number; detail: string;
  accentBorder: string; valueColor: string;
  dotColor?: string; barFill?: string; barWidth?: string; animDelay?: number;
}> = ({ label, value, detail, accentBorder, valueColor, dotColor, barFill, barWidth, animDelay = 0 }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), animDelay);
    return () => clearTimeout(t);
  }, [animDelay]);

  return (
    <div style={{
      background: T.panel,
      border: `1px solid ${T.border}`,
      borderLeft: `2px solid ${accentBorder}`,
      borderRadius: 12,
      padding: "14px 16px",
      display: "flex", flexDirection: "column", gap: 5,
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0)" : "translateY(8px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
      fontFamily: T.font,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontSize: 9, fontFamily: T.mono, letterSpacing: "0.14em",
          textTransform: "uppercase" as const, color: T.t3,
        }}>
          {label}
        </span>
        {dotColor && (
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: dotColor,
            boxShadow: `0 0 0 3px ${dotColor}22`,
          }} />
        )}
      </div>
      <div style={{
        fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em",
        lineHeight: 1, color: valueColor, fontFamily: T.font,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: T.t3, fontFamily: T.font }}>{detail}</div>
      {barWidth && barFill && (
        <div style={{ height: 3, background: T.border, borderRadius: 2, overflow: "hidden", marginTop: 2 }}>
          <div style={{
            height: "100%", width: barWidth, background: barFill, borderRadius: 2,
          }} />
        </div>
      )}
    </div>
  );
};

// ─── Alert Row ────────────────────────────────────────────────────────────────

const ALERT_S = {
  critical: { bar: T.red,   title: "#f87171", tagBg: T.redDim,   tagColor: "#f87171", tagBd: T.redBd   },
  warning:  { bar: T.amber, title: "#fbbf24", tagBg: T.amberDim, tagColor: "#fbbf24", tagBd: T.amberBd },
  info:     { bar: T.mint,  title: "#4CAF82", tagBg: T.mintBg,   tagColor: "#4CAF82", tagBd: T.mintDim },
};

const AlertRow: React.FC<{ alert: DashboardAlert; isLast?: boolean }> = ({ alert, isLast }) => {
  const [hov, setHov] = useState(false);
  const s = ALERT_S[alert.type];
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid", gridTemplateColumns: "2px 1fr auto",
        gap: 12, alignItems: "start",
        padding: "11px 16px",
        borderBottom: isLast ? "none" : `1px solid ${T.border}`,
        background: hov ? T.surface : "transparent",
        cursor: "pointer",
        transition: "background 0.12s",
        fontFamily: T.font,
      }}
    >
      <div style={{ width: 2, borderRadius: 1, minHeight: 36, marginTop: 3, background: s.bar }} />
      <div>
        <div style={{
          fontSize: 12, fontWeight: 600, color: s.title, marginBottom: 3,
        }}>
          {alert.title}
        </div>
        <div style={{ fontSize: 11, color: T.t2, lineHeight: 1.5 }}>
          {alert.description}
        </div>
      </div>
      <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
        <span style={{
          display: "block", fontSize: 9, fontFamily: T.mono,
          color: T.t3, letterSpacing: "0.06em", marginBottom: 5,
        }}>
          {alert.time}
        </span>
        <span style={{
          fontSize: 9, fontFamily: T.mono,
          padding: "2px 7px", borderRadius: 4,
          background: s.tagBg, color: s.tagColor,
          border: `1px solid ${s.tagBd}`,
          whiteSpace: "nowrap" as const,
        }}>
          {alert.source}
        </span>
      </div>
    </div>
  );
};

// ─── Panel ────────────────────────────────────────────────────────────────────

const Panel: React.FC<{
  title: string; sub: string;
  right?: React.ReactNode; children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, sub, right, children, style }) => (
  <div style={{
    background: T.panel,
    border: `1px solid ${T.border}`,
    borderRadius: 12, overflow: "hidden",
    fontFamily: T.font,
    ...style,
  }}>
    <div style={{
      padding: "12px 16px",
      borderBottom: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div>
        <div style={{
          fontSize: 14, fontWeight: 700, color: T.t1, letterSpacing: "-0.01em",
        }}>
          {title}
        </div>
        <div style={{
          fontSize: 9, fontFamily: T.mono, letterSpacing: "0.12em",
          textTransform: "uppercase" as const, color: T.t3, marginTop: 2,
        }}>
          {sub}
        </div>
      </div>
      {right}
    </div>
    {children}
  </div>
);

// ─── Tag ──────────────────────────────────────────────────────────────────────

const Tag: React.FC<{ bg: string; color: string; border: string; children: React.ReactNode }> = ({ bg, color, border, children }) => (
  <span style={{
    fontSize: 9, fontFamily: T.mono, letterSpacing: "0.1em",
    padding: "3px 9px", borderRadius: 5,
    background: bg, color, border: `1px solid ${border}`,
    flexShrink: 0, fontWeight: 700,
  }}>
    {children}
  </span>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

export interface DashboardUIProps {
  cameras?: Camera[];
  nvr?: NVRData;
  alerts?: DashboardAlert[];
}

export const DashboardUI: React.FC<DashboardUIProps> = ({
  cameras = MOCK_CAMERAS,
  nvr     = MOCK_NVR,
  alerts  = MOCK_ALERTS,
}) => {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const online      = cameras.filter(c => c.status === "online").length;
  const offline     = cameras.filter(c => c.status === "offline").length;
  const maintenance = cameras.filter(c => c.status === "maintenance").length;

  return (
    <div style={{
      padding: "22px 24px 40px",
      display: "flex", flexDirection: "column", gap: 16,
      background: T.bg,
      minHeight: "100%",
      fontFamily: T.font, color: T.t1,
      fontSize: 13, lineHeight: "1.5",
      boxSizing: "border-box",
    }}>

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{
            fontSize: 10, fontFamily: T.mono, letterSpacing: "0.16em",
            textTransform: "uppercase" as const, color: T.mint, marginBottom: 5,
          }}>
            Portal del cliente · Infraestructura
          </div>
          <h1 style={{
            fontSize: 22, fontWeight: 800, color: T.t1,
            letterSpacing: "-0.02em", margin: 0, lineHeight: 1.2,
          }}>
            Estado del Sistema
          </h1>
          <p style={{ fontSize: 11, color: T.t3, marginTop: 4 }}>
            Monitoreo en tiempo real · {cameras.length} cámaras instaladas
          </p>
        </div>
        <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
          <div style={{
            fontSize: 20, fontWeight: 600, fontFamily: T.mono,
            color: T.mint, letterSpacing: "0.04em",
          }}>
            {clock}
          </div>
          <div style={{ fontSize: 10, color: T.t3, marginTop: 2, fontFamily: T.mono }}>
            Viernes, 28 Feb 2026
          </div>
        </div>
      </div>

      {/* ── Alert banner ────────────────────────────────────────────────────── */}
      {alerts.length > 0 && (
        <div style={{
          background: T.redDim,
          border: `1px solid ${T.redBd}`,
          borderRadius: 10,
          padding: "9px 16px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ color: T.red, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>▲</span>
          <span style={{ fontSize: 11, color: "#f87171", flex: 1 }}>
            {alerts.length} incidentes activos — {alerts.map(a => a.source).join(" · ")}
          </span>
          <Tag bg="rgba(224,82,82,0.06)" color={T.red} border={T.redBd}>
            {alerts.length} ALERTAS
          </Tag>
        </div>
      )}

      {/* ── Stat cards ──────────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        <StatCard
          label="Cámaras Online"  value={online}
          detail={`de ${cameras.length} instaladas`}
          accentBorder={T.mint} valueColor={T.mint} dotColor={T.mint}
          barFill={T.mint} barWidth={`${(online / cameras.length) * 100}%`}
          animDelay={40}
        />
        <StatCard
          label="Cámaras Offline" value={offline}
          detail="requieren atención"
          accentBorder={T.red} valueColor="#f87171" dotColor="#f87171"
          animDelay={80}
        />
        <StatCard
          label="Mantenimiento"   value={maintenance}
          detail="en revisión técnica"
          accentBorder={T.amber} valueColor="#fbbf24" dotColor="#fbbf24"
          animDelay={120}
        />
        <StatCard
          label="Uptime · 30d"   value="98.2%"
          detail="últimos 30 días"
          accentBorder={T.mint} valueColor={T.mint}
          barFill={T.mint} barWidth="98.2%"
          animDelay={160}
        />
      </div>

      {/* ── Content grid ────────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

        {/* Alertas */}
        <Panel
          title="Alertas Activas"
          sub="Notificaciones del sistema"
          right={<Tag bg={T.redDim} color="#f87171" border={T.redBd}>{alerts.length} activas</Tag>}
        >
          {alerts.map((a, i) => (
            <AlertRow key={a.id} alert={a} isLast={i === alerts.length - 1} />
          ))}
        </Panel>

        {/* NVR */}
        <NVRPanel data={nvr} />

        {/* Cameras — full width */}
        <Panel
          title="Cámaras del Sistema"
          sub="Monitoreo en tiempo real"
          right={<Tag bg={T.mintBg} color={T.mint} border={T.mintDim}>{online} / {cameras.length} activas</Tag>}
          style={{ gridColumn: "1 / -1" }}
        >
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10, padding: "14px 16px",
          }}>
            {cameras.map(cam => <CameraCard key={cam.id} camera={cam} />)}
          </div>
        </Panel>

        {/* Uptime sparkline — full width */}
        <Panel
          title="Disponibilidad del Sistema"
          sub="Últimos 30 días"
          right={
            <span style={{
              fontSize: 18, fontWeight: 700, fontFamily: T.mono,
              color: T.mint, letterSpacing: "0.04em",
            }}>
              98.2%
            </span>
          }
          style={{ gridColumn: "1 / -1" }}
        >
          <div style={{ padding: "10px 16px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 44 }}>
              {UPTIME_DATA.map((v, i) => {
                const isLast = i === UPTIME_DATA.length - 1;
                const bg = isLast
                  ? T.mint
                  : v < 88 ? T.red
                  : v < 96 ? T.amber
                  : "rgba(76,175,130,0.35)";
                return (
                  <div
                    key={i}
                    title={`Día ${i + 1}: ${v}%`}
                    style={{
                      flex: 1, height: v * 0.42,
                      borderRadius: "2px 2px 0 0",
                      background: bg,
                      opacity: isLast ? 1 : 0.55,
                      cursor: "pointer",
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = "1"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = isLast ? "1" : "0.55"; }}
                  />
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { color: "rgba(76,175,130,0.55)", label: "Operativo" },
                { color: T.amber,                 label: "Degradado" },
                { color: T.red,                   label: "Fallo"     },
                { color: T.mint,                  label: "Actual"    },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: l.color }} />
                  <span style={{ fontSize: 9, color: T.t3, fontFamily: T.mono }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default DashboardUI;