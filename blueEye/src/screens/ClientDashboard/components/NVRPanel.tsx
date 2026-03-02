import React from "react";

// ─── BlueEye Security — Design Tokens ────────────────────────────────────────
const C = {
  bgCard:    "#0f172a",
  bgCardEnd: "#1e293b",

  primary:   "#22d3ee",
  primaryBg: "rgba(34,211,238,0.07)",
  primaryBd: "rgba(34,211,238,0.16)",
  primaryGlow: "0 0 18px rgba(34,211,238,0.09)",

  warning:   "#fbbf24",
  warningBg: "rgba(251,191,36,0.08)",
  warningBd: "rgba(251,191,36,0.22)",

  danger:    "#ef4444",
  dangerBg:  "rgba(239,68,68,0.08)",
  dangerBd:  "rgba(239,68,68,0.22)",

  textPrimary:   "#f1f5f9",
  textSecondary: "#e2e8f0",
  textMuted:     "#94a3b8",
  textSubtle:    "#64748b",

  border:     "rgba(255,255,255,0.06)",
  borderCard: "rgba(34,211,238,0.1)",

  f: "'Geist','Inter',-apple-system,sans-serif",
  m: "'Geist Mono','JetBrains Mono',ui-monospace,monospace",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface NVRData {
  name:           string;
  model:          string;
  ip:             string;
  temperature:    number;
  firmware:       string;
  activeChannels: number;
  totalChannels:  number;
  storageUsed:    number;   // 0-100 %
  storageTotal:   string;
  status:         "online" | "offline";
}

interface NVRPanelProps { data: NVRData; }

// ─── Sub-components ───────────────────────────────────────────────────────────

// Status indicator — primary (online) / danger (offline)
const StatusPill: React.FC<{ active: boolean }> = ({ active }) => (
  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
    <div style={{
      width:6, height:6, borderRadius:"50%",
      background:  active ? C.primary : C.danger,
      boxShadow:   active ? `0 0 8px ${C.primary}` : `0 0 8px ${C.danger}`,
    }}/>
    <span style={{
      fontSize:10, fontWeight:600, fontFamily:C.m, letterSpacing:"0.1em",
      color: active ? C.primary : "#f87171",
    }}>
      {active ? "ONLINE" : "OFFLINE"}
    </span>
  </div>
);

// Info cell
const Cell: React.FC<{ label:string; value:string|number; valueColor?:string }> = ({
  label, value, valueColor = C.textSecondary,
}) => (
  <div style={{
    background:   "rgba(255,255,255,0.03)",
    border:       `1px solid ${C.border}`,
    borderRadius: 8,
    padding:      "8px 11px",
  }}>
    <div style={{
      fontSize:8, fontFamily:C.m, letterSpacing:"0.14em",
      textTransform:"uppercase" as const, color:C.textSubtle, marginBottom:4,
    }}>
      {label}
    </div>
    <div style={{ fontSize:13, fontWeight:500, fontFamily:C.m, color:valueColor }}>
      {value}
    </div>
  </div>
);

// ─── NVRPanel ─────────────────────────────────────────────────────────────────
export const NVRPanel: React.FC<NVRPanelProps> = ({ data }) => {
  // Storage state: danger >90%, warning >75%, success (primary) otherwise
  const storageColor =
    data.storageUsed >= 90 ? C.danger :
    data.storageUsed >= 75 ? C.warning :
    C.primary;

  // Temperature state: danger >60°C, warning >45°C
  const tempColor =
    data.temperature >= 60 ? C.danger :
    data.temperature >= 45 ? C.warning :
    C.textSecondary;

  // Channel state: warning if not full, success if full
  const channelColor =
    data.activeChannels < data.totalChannels ? C.warning : C.primary;

  return (
    <div style={{
      background:   `linear-gradient(135deg, ${C.bgCard} 0%, ${C.bgCardEnd} 100%)`,
      border:       `1px solid ${C.borderCard}`,
      borderRadius: 12,
      overflow:     "hidden",
      fontFamily:   C.f,
    }}>

      {/* ── Header ──────────────────────────────── */}
      <div style={{
        padding:        "12px 18px",
        borderBottom:   `1px solid ${C.border}`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        background:     "rgba(6,13,26,0.4)",
      }}>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary, letterSpacing:"-0.01em" }}>
            {data.name}
          </div>
          <div style={{ fontSize:9, fontFamily:C.m, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:C.textSubtle, marginTop:2 }}>
            {data.model}
          </div>
        </div>
        <StatusPill active={data.status === "online"} />
      </div>

      {/* ── Body ────────────────────────────────── */}
      <div style={{ padding:"14px 18px", display:"flex", flexDirection:"column", gap:12 }}>

        {/* Storage bar — success/warning/danger */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, fontFamily:C.m, marginBottom:6 }}>
            <span style={{ color:C.textSubtle }}>Almacenamiento</span>
            <span style={{ color:storageColor, fontWeight:600 }}>
              {data.storageUsed}% — {data.storageTotal}
            </span>
          </div>
          <div style={{ height:4, background:"rgba(255,255,255,0.05)", borderRadius:2, overflow:"hidden" }}>
            <div style={{
              height:"100%", width:`${data.storageUsed}%`,
              background:   storageColor,
              borderRadius: 2,
              boxShadow:    `0 0 8px ${storageColor}44`,
              transition:   "width 0.8s ease",
            }}/>
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
          <Cell label="Dirección IP"   value={data.ip} />
          <Cell label="Temperatura"    value={`${data.temperature}°C`} valueColor={tempColor} />
          <Cell label="Firmware"       value={data.firmware} />
          <Cell label="Canales activos" value={`${data.activeChannels} / ${data.totalChannels}`} valueColor={channelColor} />
        </div>

      </div>
    </div>
  );
};

export default NVRPanel;