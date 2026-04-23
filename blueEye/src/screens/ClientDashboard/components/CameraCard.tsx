import React, { useState } from "react";
import { CameraFeed } from "./Camerafeed";

// ─── BlueEye Landing tokens ───────────────────────────────────────────────────
const T = {
  white: "#FFFFFF",
  green: "#4CAF82",
  greenDark: "#2E8B5E",
  greenSft: "#EAF7F1",
  greenMid: "#A8DBBE",
  warning: "#D48A20",
  warningSft: "rgba(212,138,32,0.08)",
  warningBd: "rgba(212,138,32,0.28)",
  danger: "#E05252",
  dangerSft: "rgba(224,82,82,0.08)",
  dangerBd: "rgba(224,82,82,0.28)",
  t1: "#1A2332",
  t2: "#4A5568",
  t3: "#9AA3B2",
  border: "#E2E8E4",
  sans: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Fira Mono', monospace",
} as const;

export type CameraStatus = "online" | "offline" | "maintenance";

export interface Camera {
  id: string;
  name: string;
  location: string;
  ip: string;
  uptime: string;
  lastSeen: string;
  status: CameraStatus;
  imageUrl?: string;
}

const STATUS_CONFIG: Record<
  CameraStatus,
  {
    borderHov: string;
    nameColor: string;
    uptimeColor: string;
    glow: string;
    badgeBg: string;
    badgeColor: string;
    badgeBd: string;
    badgeLabel: string;
  }
> = {
  online: {
    borderHov: T.greenMid,
    nameColor: T.t1,
    uptimeColor: T.green,
    glow: "0 4px 20px rgba(76,175,130,0.12)",
    badgeBg: T.greenSft,
    badgeColor: T.greenDark,
    badgeBd: T.greenMid,
    badgeLabel: "En línea",
  },
  offline: {
    borderHov: T.dangerBd,
    nameColor: T.danger,
    uptimeColor: T.danger,
    glow: "0 4px 20px rgba(224,82,82,0.10)",
    badgeBg: T.dangerSft,
    badgeColor: T.danger,
    badgeBd: T.dangerBd,
    badgeLabel: "Sin señal",
  },
  maintenance: {
    borderHov: T.warningBd,
    nameColor: T.warning,
    uptimeColor: T.warning,
    glow: "0 4px 20px rgba(212,138,32,0.10)",
    badgeBg: T.warningSft,
    badgeColor: T.warning,
    badgeBd: T.warningBd,
    badgeLabel: "Mantenimiento",
  },
};

interface CameraCardProps {
  camera: Camera;
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
        background: T.white,
        border: `1px solid ${hovered ? cfg.borderHov : T.border}`,
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.18s ease",
        boxShadow: hovered ? cfg.glow : "0 1px 4px rgba(26,35,50,0.04)",
        fontFamily: T.sans,
      }}
    >
      {/* Preview area */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%",
          overflow: "hidden",
        }}
      >
        <CameraFeed
          status={camera.status}
          imageUrl={camera.imageUrl}
          name={camera.name}
        />

        {/* Status badge */}
        <span
          style={{
            position: "absolute",
            bottom: 8,
            left: 10,
            zIndex: 3,
            fontSize: 9,
            fontFamily: T.mono,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            padding: "3px 8px",
            borderRadius: 100,
            fontWeight: 700,
            background: cfg.badgeBg,
            color: cfg.badgeColor,
            border: `1px solid ${cfg.badgeBd}`,
            pointerEvents: "none",
          }}
        >
          {cfg.badgeLabel}
        </span>

        {/* REC dot — only online */}
        {camera.status === "online" && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 10,
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 8,
              fontFamily: T.mono,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.1em",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#dc2626",
                boxShadow: "0 0 6px #dc2626",
              }}
            />
            REC
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "10px 13px 12px" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: cfg.nameColor,
            letterSpacing: "-0.01em",
            marginBottom: 2,
          }}
        >
          {camera.name}
        </div>
        <div style={{ fontSize: 11, color: T.t3, marginBottom: 10 }}>
          {camera.location}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 6,
          }}
        >
          {[
            { label: "IP", value: camera.ip, colored: false },
            { label: "Uptime", value: camera.uptime, colored: true },
            {
              label: camera.status === "maintenance" ? "Estado" : "Visto",
              value: camera.lastSeen,
              colored: false,
            },
          ].map((item) => (
            <div key={item.label}>
              <div
                style={{
                  fontSize: 9,
                  fontFamily: T.mono,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: T.t3,
                  marginBottom: 2,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: T.mono,
                  color: item.colored
                    ? cfg.uptimeColor
                    : camera.status === "offline" && item.label !== "IP"
                      ? T.danger
                      : T.t2,
                }}
              >
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
