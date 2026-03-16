import { useState } from "react";
import type { Camera } from "../types/client.types";

// ─── BlueEye Design Tokens ────────────────────────────────────────────────────
const C = {
  bgCard:    "#0f172a",
  bgCardEnd: "#1e293b",
  primary:      "#22d3ee",
  primaryBg:    "rgba(34,211,238,0.07)",
  primaryBd:    "rgba(34,211,238,0.16)",
  primaryBd2:   "rgba(34,211,238,0.28)",
  primaryGlow:  "0 0 18px rgba(34,211,238,0.09)",
  warning:   "#fbbf24",
  warningBg: "rgba(251,191,36,0.08)",
  warningBd: "rgba(251,191,36,0.22)",
  danger:    "#ef4444",
  dangerBg:  "rgba(239,68,68,0.08)",
  dangerBd:  "rgba(239,68,68,0.22)",
  textPrimary:   "#f1f5f9",
  textMuted:     "#94a3b8",
  textSubtle:    "#64748b",
  borderCard:  "rgba(34,211,238,0.1)",
  f: "'Geist','Inter',-apple-system,sans-serif",
  m: "'Geist Mono','JetBrains Mono',ui-monospace,monospace",
} as const;

const STATUS_CFG = {
  online:      { label: "En línea",      color: C.primary,  bg: C.primaryBg,  bd: C.primaryBd,  nameCl: C.textPrimary, glow: C.primaryGlow },
  offline:     { label: "Sin señal",     color: C.danger,   bg: C.dangerBg,   bd: C.dangerBd,   nameCl: "#f87171",     glow: "0 0 18px rgba(239,68,68,0.09)"  },
  maintenance: { label: "Mantenimiento", color: C.warning,  bg: C.warningBg,  bd: C.warningBd,  nameCl: "#fcd34d",     glow: "0 0 18px rgba(251,191,36,0.09)" },
} satisfies Record<Camera["status"], object>;

interface CameraStatusCardProps {
  camera: Camera;
}

const gridLines = `repeating-linear-gradient(0deg,rgba(255,255,255,0.015) 0,transparent 1px,transparent 20px),repeating-linear-gradient(90deg,rgba(255,255,255,0.015) 0,transparent 1px,transparent 20px)`;

export default function CameraStatusCard({ camera }: CameraStatusCardProps) {
  const [hov, setHov] = useState(false);
  const cfg = STATUS_CFG[camera.status];

  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:   `linear-gradient(160deg, ${C.bgCard} 0%, ${C.bgCardEnd} 100%)`,
        border:       `1px solid ${hov ? cfg.color + "44" : C.borderCard}`,
        borderRadius: 10,
        overflow:     "hidden",
        cursor:       "pointer",
        transform:    hov ? "translateY(-2px)" : "none",
        transition:   "all 0.18s ease",
        boxShadow:    hov ? cfg.glow : "none",
        fontFamily:   C.f,
      }}
    >
      {/* Preview area */}
      <div style={{
        aspectRatio: "16/9",
        background:  camera.status === "offline" ? "#0d0406" : camera.status === "maintenance" ? "#0d0b03" : "#020810",
        position:    "relative",
        display:     "flex",
        alignItems:  "center",
        justifyContent: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: gridLines }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, ${cfg.color}0A 0%, transparent 65%)` }} />
        <span style={{ fontSize: 22, opacity: 0.05, position: "relative" }}>📷</span>

        {/* Status badge */}
        <span style={{
          position: "absolute", bottom: 6, left: 8,
          fontSize: 8, fontFamily: C.m, letterSpacing: "0.1em", textTransform: "uppercase",
          padding: "2px 7px", borderRadius: 4, fontWeight: 600,
          background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.bd}`,
        }}>
          {cfg.label}
        </span>

        {/* REC dot */}
        {camera.status === "online" && (
          <span style={{
            position: "absolute", top: 7, right: 8,
            fontSize: 8, fontFamily: C.m, color: "#7f1d1d",
            letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#dc2626", display: "inline-block" }} />
            REC
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "9px 12px 11px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: cfg.nameCl, marginBottom: 2, letterSpacing: "-0.01em" }}>
          {camera.name}
        </div>
        <div style={{ fontSize: 9, color: C.textSubtle, marginBottom: 8 }}>{camera.site}</div>
        <div>
          <div style={{ fontSize: 8, fontFamily: C.m, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textSubtle, marginBottom: 2 }}>
            Última actividad
          </div>
          <div style={{ fontSize: 10, fontFamily: C.m, color: C.textMuted }}>
            {new Date(camera.lastSeen).toLocaleString()}
          </div>
        </div>
      </div>
    </article>
  );
}