import { useState } from "react";
import type { Camera } from "../../../types/client.types";

// ─── BlueEye Landing tokens ───────────────────────────────────────────────────
const T = {
  white:      "#FFFFFF",
  green:      "#4CAF82",
  greenDark:  "#2E8B5E",
  greenSft:   "#EAF7F1",
  greenMid:   "#A8DBBE",
  warning:    "#D48A20",
  warningSft: "rgba(212,138,32,0.08)",
  warningBd:  "rgba(212,138,32,0.28)",
  danger:     "#E05252",
  dangerSft:  "rgba(224,82,82,0.08)",
  dangerBd:   "rgba(224,82,82,0.28)",
  t1:         "#1A2332",
  t2:         "#4A5568",
  t3:         "#9AA3B2",
  border:     "#E2E8E4",
  sans:       "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  mono:       "'JetBrains Mono', 'Fira Mono', monospace",
} as const;

const STATUS_CFG = {
  online:      { label: "En línea",      color: T.green,   bg: T.greenSft,   bd: T.greenMid,  nameCl: T.t1,       glow: "0 4px 20px rgba(76,175,130,0.12)"  },
  offline:     { label: "Sin señal",     color: T.danger,  bg: T.dangerSft,  bd: T.dangerBd,  nameCl: T.danger,   glow: "0 4px 20px rgba(224,82,82,0.10)"   },
  maintenance: { label: "Mantenimiento", color: T.warning, bg: T.warningSft, bd: T.warningBd, nameCl: T.warning,  glow: "0 4px 20px rgba(212,138,32,0.10)"  },
} satisfies Record<Camera["status"], object>;

interface CameraStatusCardProps {
  camera: Camera;
}

export default function CameraStatusCard({ camera }: CameraStatusCardProps) {
  const [hov, setHov] = useState(false);
  const cfg = STATUS_CFG[camera.status];

  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:   T.white,
        border:       `1px solid ${hov ? cfg.bd : T.border}`,
        borderRadius: 12,
        overflow:     "hidden",
        cursor:       "pointer",
        transform:    hov ? "translateY(-2px)" : "none",
        transition:   "all 0.18s ease",
        boxShadow:    hov ? cfg.glow : "0 1px 4px rgba(26,35,50,0.04)",
        fontFamily:   T.sans,
      }}
    >
      {/* Preview area */}
      <div style={{
        aspectRatio:    "16/9",
        background:     T.greenSft,
        position:       "relative",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        overflow:       "hidden",
      }}>
        {/* Subtle grid */}
        <div style={{
          position:        "absolute",
          inset:           0,
          backgroundImage: `
            repeating-linear-gradient(0deg,  ${cfg.color}10 0, transparent 1px, transparent 20px),
            repeating-linear-gradient(90deg, ${cfg.color}10 0, transparent 1px, transparent 20px)
          `,
        }} />

        {/* Center radial */}
        <div style={{
          position:   "absolute",
          inset:      0,
          background: `radial-gradient(ellipse at 50% 40%, ${cfg.color}15 0%, transparent 65%)`,
        }} />

        <span style={{ fontSize: 24, opacity: 0.08, position: "relative" }}>📷</span>

        {/* Status badge */}
        <span style={{
          position:      "absolute",
          bottom:        6, left: 8,
          fontSize:      9,
          fontFamily:    T.mono,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          padding:       "3px 8px",
          borderRadius:  100,
          fontWeight:    700,
          background:    cfg.bg,
          color:         cfg.color,
          border:        `1px solid ${cfg.bd}`,
        }}>
          {cfg.label}
        </span>

        {/* REC dot */}
        {camera.status === "online" && (
          <span style={{
            position:      "absolute", top: 7, right: 8,
            fontSize:      8,
            fontFamily:    T.mono,
            color:         T.t3,
            letterSpacing: "0.1em",
            display:       "flex",
            alignItems:    "center",
            gap:           4,
          }}>
            <span style={{
              width:        5,
              height:       5,
              borderRadius: "50%",
              background:   "#dc2626",
              display:      "inline-block",
              boxShadow:    "0 0 6px #dc2626",
            }} />
            REC
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "10px 13px 12px" }}>
        <div style={{
          fontSize:      12,
          fontWeight:    700,
          color:         cfg.nameCl,
          marginBottom:  2,
          letterSpacing: "-0.01em",
        }}>
          {camera.name}
        </div>
        <div style={{ fontSize: 10, color: T.t3, marginBottom: 10 }}>
          {camera.site}
        </div>
        <div>
          <div style={{
            fontSize:      9,
            fontFamily:    T.mono,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color:         T.t3,
            marginBottom:  2,
          }}>
            Última actividad
          </div>
          <div style={{ fontSize: 10, fontFamily: T.mono, color: T.t2 }}>
            {new Date(camera.lastSeen).toLocaleString()}
          </div>
        </div>
      </div>
    </article>
  );
}
