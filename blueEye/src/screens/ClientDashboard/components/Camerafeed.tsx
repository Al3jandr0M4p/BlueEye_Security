import type React from "react";
import { useEffect, useRef } from "react";
import type { CameraStatus } from "./CameraCard";

// ─── BlueEye Landing tokens ───────────────────────────────────────────────────
const T = {
  green:      "#4CAF82",
  greenSft:   "#EAF7F1",
  greenMid:   "#A8DBBE",
  warning:    "#D48A20",
  warningSft: "rgba(212,138,32,0.10)",
  warningBd:  "rgba(212,138,32,0.30)",
  danger:     "#E05252",
  dangerBd:   "rgba(224,82,82,0.35)",
  mono:       "'JetBrains Mono', 'Fira Mono', monospace",
} as const;

interface CameraFeedProps {
  status:    CameraStatus;
  imageUrl?: string;
  name?:     string;
}

// ─── Fill wrapper ─────────────────────────────────────────────────────────────
const Fill: React.FC<{
  bg?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ bg, children, style }) => (
  <div style={{
    position:       "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    background:     bg,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    overflow:       "hidden",
    ...style,
  }}>
    {children}
  </div>
);

// ─── NoiseCanvas (offline) ────────────────────────────────────────────────────
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
        const v = r > 0.55 ? 220 : r > 0.28 ? Math.floor(Math.random() * 160) : 0;
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
        position:        "absolute",
        top: 0, left: 0,
        width:           "100%",
        height:          "100%",
        imageRendering:  "pixelated",
        opacity:         0.35,
      }}
    />
  );
};

// ─── OfflineScreen ────────────────────────────────────────────────────────────
const OfflineScreen: React.FC = () => (
  <Fill bg="#F0F0EE">
    <NoiseCanvas />
    <div style={{
      position:   "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(240,240,238,0.55)",
    }} />
    <div style={{
      position:       "relative",
      zIndex:         2,
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      gap:            8,
      padding:        "10px 20px",
      background:     "rgba(255,255,255,0.85)",
      border:         `1px solid ${T.dangerBd}`,
      borderRadius:   10,
      backdropFilter: "blur(4px)",
    }}>
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
        stroke={T.danger} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1={2}  y1={2}  x2={22} y2={22} />
        <path d="M8.5 8.5A5 5 0 0 0 7 12" />
        <path d="M15.5 8.5c.9.9 1.5 2.1 1.5 3.5" />
        <path d="M5 5a10 10 0 0 0-2 7" />
        <path d="M19 5a10 10 0 0 1 2 7" />
        <line x1={12} y1={20} x2={12.01} y2={20} strokeWidth={3} />
      </svg>
      <span style={{
        fontFamily:    T.mono,
        fontSize:      9,
        fontWeight:    700,
        letterSpacing: "0.16em",
        textTransform: "uppercase" as const,
        color:         T.danger,
        whiteSpace:    "nowrap" as const,
      }}>
        Sin señal
      </span>
    </div>
  </Fill>
);

// ─── MaintenanceScreen ────────────────────────────────────────────────────────
const MaintenanceScreen: React.FC = () => (
  <Fill
    bg="#FEFAF3"
    style={{
      backgroundImage: `repeating-linear-gradient(
        45deg,
        rgba(212,138,32,0.06) 0px, rgba(212,138,32,0.06) 1px,
        transparent 1px, transparent 14px
      )`,
    }}
  >
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      gap:            8,
      padding:        "10px 20px",
      background:     "rgba(255,255,255,0.85)",
      border:         `1px solid ${T.warningBd}`,
      borderRadius:   10,
      backdropFilter: "blur(4px)",
    }}>
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
        stroke={T.warning} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
      <span style={{
        fontFamily:    T.mono,
        fontSize:      9,
        fontWeight:    700,
        letterSpacing: "0.16em",
        textTransform: "uppercase" as const,
        color:         T.warning,
        whiteSpace:    "nowrap" as const,
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
        bg={T.greenSft}
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg,  rgba(76,175,130,0.07) 0, transparent 1px, transparent 20px),
            repeating-linear-gradient(90deg, rgba(76,175,130,0.07) 0, transparent 1px, transparent 20px)
          `,
        }}
      >
        <div style={{
          position:   "absolute",
          inset:      0,
          background: `radial-gradient(ellipse at 50% 40%, rgba(76,175,130,0.15) 0%, transparent 65%)`,
        }} />
        <span style={{ fontSize: 28, opacity: 0.12, position: "relative" }}>📷</span>
      </Fill>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name ?? "Cámara"}
      draggable={false}
      style={{
        position:   "absolute",
        top: 0, left: 0,
        width:      "100%",
        height:     "100%",
        objectFit:  "cover",
        display:    "block",
      }}
    />
  );
};

// ─── CameraFeed ───────────────────────────────────────────────────────────────
export const CameraFeed: React.FC<CameraFeedProps> = ({ status, imageUrl, name }) => (
  <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
    {status === "online"      && <OnlineScreen imageUrl={imageUrl} name={name} />}
    {status === "offline"     && <OfflineScreen />}
    {status === "maintenance" && <MaintenanceScreen />}
  </div>
);

export default CameraFeed;
