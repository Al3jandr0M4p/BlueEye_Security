import { useState, type ReactNode } from "react";

const C = {
  bgCard:    "#0f172a",
  bgCardEnd: "#1e293b",
  f: "'Geist','Inter',-apple-system,sans-serif",
  m: "'Geist Mono','JetBrains Mono',ui-monospace,monospace",
  textSubtle: "#64748b",
} as const;

const ACCENT_CFG = {
  blue:  { color: "#22d3ee", bg: "rgba(34,211,238,0.07)",  bd: "rgba(34,211,238,0.16)",  valueColor: "#22d3ee",  glow: "0 0 24px rgba(34,211,238,0.12)"  },
  green: { color: "#22c55e", bg: "rgba(34,197,94,0.07)",   bd: "rgba(34,197,94,0.16)",   valueColor: "#4ade80",  glow: "0 0 24px rgba(34,197,94,0.12)"   },
  red:   { color: "#ef4444", bg: "rgba(239,68,68,0.07)",   bd: "rgba(239,68,68,0.16)",   valueColor: "#f87171",  glow: "0 0 24px rgba(239,68,68,0.12)"   },
  amber: { color: "#fbbf24", bg: "rgba(251,191,36,0.07)",  bd: "rgba(251,191,36,0.16)",  valueColor: "#fcd34d",  glow: "0 0 24px rgba(251,191,36,0.12)"  },
} as const;

interface StatCardProps {
  title:  string;
  value:  number | string;
  accent: keyof typeof ACCENT_CFG;
  detail?: string;
  barWidth?: string;
  icon?:  ReactNode;
}

export default function StatCard({ title, value, accent, detail, barWidth, icon }: StatCardProps) {
  const [hov, setHov] = useState(false);
  const cfg = ACCENT_CFG[accent];

  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:   `linear-gradient(135deg, ${C.bgCard} 0%, ${C.bgCardEnd} 100%)`,
        border:       `1px solid ${hov ? cfg.color + "55" : cfg.bd}`,
        borderTop:    `2px solid ${cfg.color}`,
        borderRadius: 12,
        padding:      "16px 18px",
        display:      "flex",
        flexDirection: "column",
        gap:          5,
        cursor:       "default",
        transition:   "border-color 0.2s, box-shadow 0.2s",
        boxShadow:    hov ? cfg.glow : "none",
        fontFamily:   C.f,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontSize: 9, fontFamily: C.m, letterSpacing: "0.14em",
          textTransform: "uppercase", color: C.textSubtle,
        }}>
          {title}
        </span>
        {icon ?? (
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: cfg.color, flexShrink: 0,
            boxShadow: `0 0 8px ${cfg.color}`,
          }} />
        )}
      </div>

      <div style={{
        fontSize: 32, fontWeight: 300, letterSpacing: "-0.03em",
        lineHeight: 1, color: cfg.valueColor,
      }}>
        {value}
      </div>

      {detail && (
        <div style={{ fontSize: 11, color: C.textSubtle }}>{detail}</div>
      )}

      {barWidth && (
        <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden", marginTop: 4 }}>
          <div style={{
            height: "100%", width: barWidth,
            background: cfg.color, borderRadius: 2,
            boxShadow: `0 0 8px ${cfg.color}55`,
          }} />
        </div>
      )}
    </article>
  );
}