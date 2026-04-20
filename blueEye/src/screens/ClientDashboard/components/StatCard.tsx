import { useState, type ReactNode } from "react";

// ─── BlueEye Landing tokens ───────────────────────────────────────────────────
const T = {
  white:  "#FFFFFF",
  bg:     "#F8FAF8",
  border: "#E2E8E4",
  t1:     "#1A2332",
  t3:     "#9AA3B2",
  sans:   "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  mono:   "'JetBrains Mono', 'Fira Mono', monospace",
} as const;

const ACCENT_CFG = {
  blue:  { color: "#5A9EC8", bg: "rgba(90,158,200,0.08)",  bd: "rgba(90,158,200,0.25)",  glow: "0 2px 12px rgba(90,158,200,0.12)"  },
  green: { color: "#4CAF82", bg: "#EAF7F1",                bd: "#A8DBBE",                glow: "0 2px 12px rgba(76,175,130,0.12)"  },
  red:   { color: "#E05252", bg: "rgba(224,82,82,0.07)",   bd: "rgba(224,82,82,0.25)",   glow: "0 2px 12px rgba(224,82,82,0.10)"   },
  amber: { color: "#D48A20", bg: "rgba(212,138,32,0.07)",  bd: "rgba(212,138,32,0.25)",  glow: "0 2px 12px rgba(212,138,32,0.10)"  },
} as const;

interface StatCardProps {
  title:    string;
  value:    number | string;
  accent:   keyof typeof ACCENT_CFG;
  detail?:  string;
  barWidth?: string;
  icon?:    ReactNode;
}

export default function StatCard({ title, value, accent, detail, barWidth, icon }: StatCardProps) {
  const [hov, setHov] = useState(false);
  const cfg = ACCENT_CFG[accent];

  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:    T.white,
        border:        `1px solid ${hov ? cfg.bd : T.border}`,
        borderTop:     `2.5px solid ${cfg.color}`,
        borderRadius:  12,
        padding:       "16px 18px",
        display:       "flex",
        flexDirection: "column",
        gap:           5,
        cursor:        "default",
        transition:    "border-color 0.18s, box-shadow 0.18s",
        boxShadow:     hov ? cfg.glow : "0 1px 4px rgba(26,35,50,0.04)",
        fontFamily:    T.sans,
      }}
    >
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontSize:      10,
          fontFamily:    T.mono,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color:         T.t3,
          fontWeight:    700,
        }}>
          {title}
        </span>
        {icon ?? (
          <div style={{
            width:        7,
            height:       7,
            borderRadius: "50%",
            background:   cfg.color,
            flexShrink:   0,
            boxShadow:    `0 0 0 3px ${cfg.bg}`,
          }} />
        )}
      </div>

      {/* Value */}
      <div style={{
        fontSize:      32,
        fontWeight:    800,
        letterSpacing: "-0.04em",
        lineHeight:    1,
        color:         cfg.color,
        marginTop:     2,
      }}>
        {value}
      </div>

      {/* Detail */}
      {detail && (
        <div style={{ fontSize: 12, color: T.t3, fontWeight: 500 }}>{detail}</div>
      )}

      {/* Progress bar */}
      {barWidth && (
        <div style={{
          height:       4,
          background:   T.border,
          borderRadius: 2,
          overflow:     "hidden",
          marginTop:    6,
        }}>
          <div style={{
            height:       "100%",
            width:        barWidth,
            background:   cfg.color,
            borderRadius: 2,
            transition:   "width 0.5s ease",
          }} />
        </div>
      )}
    </article>
  );
}