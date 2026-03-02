import React, { useState } from "react";
import { CameraFeed } from "./Camerafeed";

const C = {
  bgCard:    "#0f172a",
  bgCardEnd: "#1e293b",
  primary:   "#22d3ee",
  primaryBg: "rgba(34,211,238,0.07)",
  primaryBd: "rgba(34,211,238,0.18)",
  warning:   "#fbbf24",
  warningBg: "rgba(251,191,36,0.08)",
  warningBd: "rgba(251,191,36,0.22)",
  danger:    "#ef4444",
  dangerBg:  "rgba(239,68,68,0.08)",
  dangerBd:  "rgba(239,68,68,0.22)",
  textPrimary:   "#f1f5f9",
  textSecondary: "#e2e8f0",
  textSubtle:    "#64748b",
  borderCard:    "rgba(34,211,238,0.1)",
  f: "'Geist','Inter',-apple-system,sans-serif",
  m: "'Geist Mono','JetBrains Mono',ui-monospace,monospace",
} as const;

export type CameraStatus = "online" | "offline" | "maintenance";

export interface Camera {
  id:        string;
  name:      string;
  location:  string;
  ip:        string;
  uptime:    string;
  lastSeen:  string;
  status:    CameraStatus;
  imageUrl?: string;
}

const STATUS_CONFIG: Record<CameraStatus, {
  borderActive: string;
  borderIdle:   string;
  nameColor:    string;
  uptimeColor:  string;
  cardGlow:     string;
  badgeBg:      string;
  badgeColor:   string;
  badgeBd:      string;
  badgeLabel:   string;
}> = {
  online: {
    borderActive: "rgba(34,211,238,0.35)",
    borderIdle:   C.borderCard,
    nameColor:    C.textPrimary,
    uptimeColor:  C.primary,
    cardGlow:     "0 0 20px rgba(34,211,238,0.08)",
    badgeBg:      C.primaryBg,
    badgeColor:   C.primary,
    badgeBd:      C.primaryBd,
    badgeLabel:   "En línea",
  },
  offline: {
    borderActive: "rgba(239,68,68,0.35)",
    borderIdle:   C.dangerBd,
    nameColor:    "#f87171",
    uptimeColor:  "#f87171",
    cardGlow:     "0 0 20px rgba(239,68,68,0.08)",
    badgeBg:      C.dangerBg,
    badgeColor:   "#f87171",
    badgeBd:      C.dangerBd,
    badgeLabel:   "Sin señal",
  },
  maintenance: {
    borderActive: "rgba(251,191,36,0.35)",
    borderIdle:   C.warningBd,
    nameColor:    "#fcd34d",
    uptimeColor:  "#fcd34d",
    cardGlow:     "0 0 20px rgba(251,191,36,0.08)",
    badgeBg:      C.warningBg,
    badgeColor:   "#fcd34d",
    badgeBd:      C.warningBd,
    badgeLabel:   "Mantenimiento",
  },
};

interface CameraCardProps {
  camera:   Camera;
  onClick?: (camera: Camera) => void;
}

export const CameraCard: React.FC<CameraCardProps> = ({ camera, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const cfg = STATUS_CONFIG[camera.status];

  return (
    <div
      onClick={() => onClick?.(camera)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   `linear-gradient(160deg, ${C.bgCard} 0%, ${C.bgCardEnd} 100%)`,
        border:       `1px solid ${hovered ? cfg.borderActive : cfg.borderIdle}`,
        borderRadius: 10,
        overflow:     "hidden",
        cursor:       "pointer",
        transform:    hovered ? "translateY(-2px)" : "translateY(0)",
        transition:   "all 0.18s ease",
        boxShadow:    hovered ? cfg.cardGlow : "none",
      }}
    >
      {/* ── Preview area ────────────────────────────────────────────────── */}
      {/*
        paddingTop 56.25% crea altura real equivalente a ratio 16:9.
        Los hijos con position:absolute top/left/right/bottom:0 lo llenan perfectamente.
      */}
      <div style={{
        position:   "relative",
        width:      "100%",
        paddingTop: "56.25%",   // 9/16 × 100 = 56.25%
        overflow:   "hidden",
      }}>
        {/* CameraFeed ocupa todo con position absolute */}
        <CameraFeed
          status={camera.status}
          imageUrl={camera.imageUrl}
          name={camera.name}
        />

        {/* Status badge — abajo izquierda */}
        <span style={{
          position:      "absolute",
          bottom:        8,
          left:          10,
          zIndex:        3,
          fontSize:      8,
          fontFamily:    C.m,
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          padding:       "3px 8px",
          borderRadius:  4,
          fontWeight:    700,
          background:    cfg.badgeBg,
          color:         cfg.badgeColor,
          border:        `1px solid ${cfg.badgeBd}`,
          pointerEvents: "none",
        }}>
          {cfg.badgeLabel}
        </span>

        {/* REC — solo online */}
        {camera.status === "online" && (
          <div style={{
            position:  "absolute",
            top:       8,
            right:     10,
            zIndex:    3,
            display:   "flex",
            alignItems: "center",
            gap:       4,
            fontSize:  8,
            fontFamily: C.m,
            color:     "#7f1d1d",
            letterSpacing: "0.1em",
            pointerEvents: "none",
          }}>
            <div style={{
              width: 6, height: 6,
              borderRadius: "50%",
              background: "#dc2626",
              boxShadow: "0 0 6px #dc2626",
            }} />
            REC
          </div>
        )}
      </div>

      {/* ── Info ────────────────────────────────────────────────────────── */}
      <div style={{ padding: "9px 12px 11px", fontFamily: C.f }}>
        <div style={{
          fontSize: 12, fontWeight: 600, color: cfg.nameColor,
          letterSpacing: "-0.01em", marginBottom: 2,
        }}>
          {camera.name}
        </div>
        <div style={{ fontSize: 10, color: C.textSubtle, marginBottom: 8 }}>
          {camera.location}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4 }}>
          {[
            { label: "IP",     value: camera.ip,       colored: false },
            { label: "Uptime", value: camera.uptime,   colored: true  },
            {
              label:   camera.status === "maintenance" ? "Estado" : "Visto",
              value:   camera.lastSeen,
              colored: false,
            },
          ].map(item => (
            <div key={item.label}>
              <div style={{
                fontSize: 8, fontFamily: C.m, letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: C.textSubtle, marginBottom: 2,
              }}>
                {item.label}
              </div>
              <div style={{
                fontSize: 10, fontFamily: C.m,
                color: item.colored
                  ? cfg.uptimeColor
                  : camera.status === "offline" && item.label !== "IP"
                  ? "#f87171"
                  : C.textSecondary,
              }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CameraCard;