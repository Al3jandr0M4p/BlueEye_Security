import React, { useEffect, useRef } from "react";
import type { CameraStatus } from "./CameraCard";

const C = {
  warning:   "#fbbf24",
  warningBg: "rgba(251,191,36,0.10)",
  warningBd: "rgba(251,191,36,0.30)",
  m: "'Geist Mono','JetBrains Mono',ui-monospace,monospace",
} as const;

interface CameraFeedProps {
  status:    CameraStatus;
  imageUrl?: string;
  name?:     string;
}

// ─── Shared wrapper — ocupa TODO el espacio del padre ────────────────────────
const Fill: React.FC<{
  bg?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ bg, children, style }) => (
  <div style={{
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    ...style,
  }}>
    {children}
  </div>
);

// ─── NoiseCanvas ──────────────────────────────────────────────────────────────
const NoiseCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    c.width  = 160;
    c.height = 90;

    const draw = () => {
      const img = ctx.createImageData(c.width, c.height);
      const d   = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = Math.random();
        const v = r > 0.55 ? 255 : r > 0.28 ? Math.floor(Math.random() * 200) : 0;
        d[i] = d[i+1] = d[i+2] = v;
        d[i+3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100%",
        height: "100%",
        imageRendering: "pixelated",
      }}
    />
  );
};

// ─── OfflineScreen ────────────────────────────────────────────────────────────
const OfflineScreen: React.FC = () => (
  <Fill>
    {/* ruido */}
    <NoiseCanvas />
    {/* overlay oscuro */}
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.45)",
    }} />
    {/* badge centrado */}
    <div style={{
      position: "relative", zIndex: 2,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      padding: "10px 20px",
      background: "rgba(0,0,0,0.75)",
      border: "1px solid rgba(239,68,68,0.40)",
      borderRadius: 8,
    }}>
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
        stroke="#f87171" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1={2}  y1={2}  x2={22} y2={22} />
        <path d="M8.5 8.5A5 5 0 0 0 7 12" />
        <path d="M15.5 8.5c.9.9 1.5 2.1 1.5 3.5" />
        <path d="M5 5a10 10 0 0 0-2 7" />
        <path d="M19 5a10 10 0 0 1 2 7" />
        <line x1={12} y1={20} x2={12.01} y2={20} strokeWidth={3} />
      </svg>
      <span style={{
        fontFamily: C.m, fontSize: 9, fontWeight: 700,
        letterSpacing: "0.18em", textTransform: "uppercase" as const,
        color: "#f87171", whiteSpace: "nowrap" as const,
      }}>
        Sin señal
      </span>
    </div>
  </Fill>
);

// ─── MaintenanceScreen ────────────────────────────────────────────────────────
const MaintenanceScreen: React.FC = () => (
  <Fill
    bg="#0d0b03"
    style={{
      backgroundImage: `repeating-linear-gradient(
        45deg,
        rgba(251,191,36,0.04) 0px, rgba(251,191,36,0.04) 1px,
        transparent 1px, transparent 12px
      )`,
    }}
  >
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      padding: "10px 20px",
      background: C.warningBg,
      border: `1px solid ${C.warningBd}`,
      borderRadius: 8,
    }}>
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
        stroke={C.warning} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
      <span style={{
        fontFamily: C.m, fontSize: 9, fontWeight: 700,
        letterSpacing: "0.18em", textTransform: "uppercase" as const,
        color: C.warning, whiteSpace: "nowrap" as const,
      }}>
        En mantenimiento
      </span>
    </div>
  </Fill>
);

// ─── OnlineScreen ─────────────────────────────────────────────────────────────
const OnlineScreen: React.FC<{ imageUrl?: string; name?: string }> = ({ imageUrl, name }) => {
  if (!imageUrl) {
    return (
      <Fill
        bg="#020810"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg,  rgba(255,255,255,0.015) 0, transparent 1px, transparent 20px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0, transparent 1px, transparent 20px)
          `,
        }}
      >
        <span style={{ fontSize: 24, opacity: 0.07 }}>📷</span>
      </Fill>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name ?? "Cámara"}
      draggable={false}
      style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100%", height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />
  );
};

// ─── CameraFeed ───────────────────────────────────────────────────────────────
export const CameraFeed: React.FC<CameraFeedProps> = ({ status, imageUrl, name }) => (
  // position:absolute + inset:0 llena el contenedor padre que tiene paddingTop:56.25%
  <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
    {status === "online"      && <OnlineScreen imageUrl={imageUrl} name={name} />}
    {status === "offline"     && <OfflineScreen />}
    {status === "maintenance" && <MaintenanceScreen />}
  </div>
);

export default CameraFeed;