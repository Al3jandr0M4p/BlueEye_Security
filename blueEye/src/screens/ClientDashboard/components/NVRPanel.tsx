import React from "react";

// ─── BlueEye Landing tokens ───────────────────────────────────────────────────
const T = {
  white:      "#FFFFFF",
  green:      "#4CAF82",
  greenDark:  "#2E8B5E",
  greenSft:   "#EAF7F1",
  greenMid:   "#A8DBBE",
  warning:    "#D48A20",
  warningSft: "rgba(212,138,32,0.08)",
  warningBd:  "rgba(212,138,32,0.30)",
  danger:     "#E05252",
  dangerSft:  "rgba(224,82,82,0.08)",
  dangerBd:   "rgba(224,82,82,0.30)",
  navy:       "#1A2332",
  t1:         "#1A2332",
  t2:         "#4A5568",
  t3:         "#9AA3B2",
  border:     "#E2E8E4",
  cellBg:     "#F8FAF8",
  sans:       "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  mono:       "'JetBrains Mono', 'Fira Mono', monospace",
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
  storageUsed:    number;   // 0–100 %
  storageTotal:   string;
  status:         "online" | "offline";
}

interface NVRPanelProps { data: NVRData; }

// ─── Status pill ─────────────────────────────────────────────────────────────
const StatusPill: React.FC<{ active: boolean }> = ({ active }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
    <div style={{
      width:      7,
      height:     7,
      borderRadius: "50%",
      background:  active ? T.green  : T.danger,
      boxShadow:   active
        ? `0 0 0 3px ${T.greenSft}`
        : `0 0 0 3px ${T.dangerSft}`,
    }} />
    <span style={{
      fontSize:      10,
      fontWeight:    700,
      fontFamily:    T.mono,
      letterSpacing: "0.1em",
      color:         active ? T.greenDark : T.danger,
    }}>
      {active ? "ONLINE" : "OFFLINE"}
    </span>
  </div>
);

// ─── Info cell ───────────────────────────────────────────────────────────────
const Cell: React.FC<{ label: string; value: string | number; valueColor?: string }> = ({
  label, value, valueColor = T.t1,
}) => (
  <div style={{
    background:   T.cellBg,
    border:       `1px solid ${T.border}`,
    borderRadius: 9,
    padding:      "8px 12px",
  }}>
    <div style={{
      fontSize:      9,
      fontFamily:    T.mono,
      letterSpacing: "0.14em",
      textTransform: "uppercase" as const,
      color:         T.t3,
      marginBottom:  4,
    }}>
      {label}
    </div>
    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: T.mono, color: valueColor }}>
      {value}
    </div>
  </div>
);

// ─── NVRPanel ────────────────────────────────────────────────────────────────
export const NVRPanel: React.FC<NVRPanelProps> = ({ data }) => {
  const storageColor =
    data.storageUsed >= 90 ? T.danger :
    data.storageUsed >= 75 ? T.warning :
    T.green;

  const tempColor =
    data.temperature >= 60 ? T.danger :
    data.temperature >= 45 ? T.warning :
    T.t2;

  const channelColor =
    data.activeChannels < data.totalChannels ? T.warning : T.green;

  return (
    <div style={{
      background:   T.white,
      border:       `1px solid ${T.border}`,
      borderRadius: 14,
      overflow:     "hidden",
      fontFamily:   T.sans,
      boxShadow:    "0 1px 4px rgba(26,35,50,0.04)",
    }}>
      {/* Header */}
      <div style={{
        padding:        "13px 18px",
        borderBottom:   `1px solid ${T.border}`,
        background:     T.greenSft,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.t1, letterSpacing: "-0.01em" }}>
            {data.name}
          </div>
          <div style={{
            fontSize: 10, fontFamily: T.mono, letterSpacing: "0.12em",
            textTransform: "uppercase" as const, color: T.t3, marginTop: 2,
          }}>
            {data.model}
          </div>
        </div>
        <StatusPill active={data.status === "online"} />
      </div>

      {/* Body */}
      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Storage bar */}
        <div>
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: 11, fontFamily: T.mono, marginBottom: 7,
          }}>
            <span style={{ color: T.t3 }}>Almacenamiento</span>
            <span style={{ color: storageColor, fontWeight: 700 }}>
              {data.storageUsed}% — {data.storageTotal}
            </span>
          </div>
          <div style={{
            height: 5, background: T.border, borderRadius: 3, overflow: "hidden",
          }}>
            <div style={{
              height:     "100%",
              width:      `${data.storageUsed}%`,
              background: storageColor,
              borderRadius: 3,
              transition: "width 0.8s ease",
            }} />
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Cell label="Dirección IP"    value={data.ip} />
          <Cell label="Temperatura"     value={`${data.temperature}°C`} valueColor={tempColor} />
          <Cell label="Firmware"        value={data.firmware} />
          <Cell label="Canales activos" value={`${data.activeChannels} / ${data.totalChannels}`} valueColor={channelColor} />
        </div>

      </div>
    </div>
  );
};

export default NVRPanel;