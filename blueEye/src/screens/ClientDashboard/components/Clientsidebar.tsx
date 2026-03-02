import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ─── BlueEye Security — Design Tokens ────────────────────────────────────────
const C = {
  // Backgrounds
  bgBase:       "#060d1a",
  bgSidebar:    "#0a1628",
  bgSidebarEnd: "#070f1f",
  bgCard:       "#0f172a",
  bgCardEnd:    "#1e293b",

  // Primary cyan
  primary:      "#22d3ee",
  primaryMid:   "#06b6d4",
  primaryLight: "#0ea5e9",
  primaryBg:    "rgba(34,211,238,0.07)",
  primaryBg2:   "rgba(34,211,238,0.13)",
  primaryBd:    "rgba(34,211,238,0.18)",
  primaryGlow:  "rgba(34,211,238,0.15)",

  // States
  danger:    "#ef4444",
  dangerBg:  "rgba(239,68,68,0.1)",
  dangerBd:  "rgba(239,68,68,0.25)",

  // Text
  textPrimary:   "#f1f5f9",
  textSecondary: "#e2e8f0",
  textBody:      "#cbd5e1",
  textMuted:     "#94a3b8",
  textSubtle:    "#64748b",

  // Borders
  border:       "rgba(255,255,255,0.06)",
  borderStrong: "rgba(34,211,238,0.18)",

  f: "'Geist','Inter',-apple-system,sans-serif",
  m: "'Geist Mono','JetBrains Mono',ui-monospace,monospace",
} as const;

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV = [
  { label: "Salpicadero",   path: "overview",  Icon: SalpicaderoIcon },
  { label: "Cámaras",       path: "cameras",   Icon: CamarasIcon     },
  { label: "NVR",           path: "nvr",       Icon: NVRIcon         },
  { label: "Alertas",       path: "alerts",    Icon: AlertasIcon     },
  { label: "Informes",      path: "reports",   Icon: InformesIcon    },
  { label: "Configuración.", path: "settings", Icon: ConfigIcon      },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
function SalpicaderoIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="6.5" stroke={color} strokeWidth="1.2" />
      <circle cx="7.5" cy="7.5" r="2.5" fill={color} />
      <line x1="7.5" y1="1"    x2="7.5" y2="3.5"  stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="7.5" y1="11.5" x2="7.5" y2="14"   stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="1"   y1="7.5"  x2="3.5" y2="7.5"  stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="11.5" y1="7.5" x2="14"  y2="7.5"  stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function CamarasIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="4" width="10" height="7" rx="1.5" stroke={color} strokeWidth="1.2" />
      <path d="M11 6.5L14 5V10L11 8.5V6.5Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
function NVRIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="2.5" width="13" height="4" rx="1" stroke={color} strokeWidth="1.2" />
      <rect x="1" y="8.5" width="13" height="4" rx="1" stroke={color} strokeWidth="1.2" />
      <circle cx="11.5" cy="4.5"  r="0.9" fill={color} />
      <circle cx="11.5" cy="10.5" r="0.9" fill={color} />
    </svg>
  );
}
function AlertasIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 1.5C7.5 1.5 2 6 2 9.5C2 11 3.3 12 5 12H10C11.7 12 13 11 13 9.5C13 6 7.5 1.5 7.5 1.5Z"
        stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6 12C6 12.8 6.7 13.5 7.5 13.5C8.3 13.5 9 12.8 9 12"
        stroke={color} strokeWidth="1.2" />
    </svg>
  );
}
function InformesIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="2.5" y="1.5" width="10" height="12" rx="1.5" stroke={color} strokeWidth="1.2" />
      <line x1="5" y1="5"   x2="10" y2="5"   stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      <line x1="5" y1="7.5" x2="10" y2="7.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      <line x1="5" y1="10"  x2="8"  y2="10"  stroke={color} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
function ConfigIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="2" stroke={color} strokeWidth="1.2" />
      <path d="M7.5 1.5V3M7.5 12V13.5M1.5 7.5H3M12 7.5H13.5M3.2 3.2L4.3 4.3M10.7 10.7L11.8 11.8M3.2 11.8L4.3 10.7M10.7 4.3L11.8 3.2"
        stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Sidebar Clock ────────────────────────────────────────────────────────────
const SidebarClock: React.FC = () => {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const p      = (n: number) => String(n).padStart(2, "0");
  const days   = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return (
    <div style={{ fontFamily: C.m, color: C.textSubtle, fontSize: 9, letterSpacing: "0.06em", lineHeight: 1.9 }}>
      <div style={{ fontSize: 15, fontWeight: 300, color: C.textMuted, letterSpacing: "0.05em", marginBottom: 1 }}>
        {p(t.getHours())}:{p(t.getMinutes())}
      </div>
      <div>{days[t.getDay()]} {t.getDate()} {months[t.getMonth()]} {t.getFullYear()}</div>
      <div>Actualizado: ahora</div>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export interface ClientSidebarProps {
  companyName?: string;
  alertCount?:  number;
}

export const ClientSidebar: React.FC<ClientSidebarProps> = ({
  companyName = "Empresa ABC",
  alertCount  = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hov, setHov] = useState<string | null>(null);

  const currentPath = location.pathname.split("/").pop() ?? "";
  const activeLabel = NAV.find(n => n.path === currentPath)?.label ?? "Salpicadero";

  const initials = companyName
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <aside style={{
      width:         220,
      flexShrink:    0,
      height:        "100vh",
      position:      "sticky",
      top:           0,
      // bg-sidebar → bg-sidebar-end gradient
      background:    `linear-gradient(180deg, ${C.bgSidebar} 0%, ${C.bgSidebarEnd} 100%)`,
      borderRight:   `1px solid ${C.border}`,
      display:       "flex",
      flexDirection: "column",
      overflow:      "hidden",
      fontFamily:    C.f,
      zIndex:        100,
    }}>

      {/* ── Logo ───────────────────────────────────── */}
      <div style={{
        padding:      "20px 18px 18px",
        borderBottom: `1px solid ${C.border}`,
        flexShrink:   0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Eye — cyan glow */}
          <div style={{
            width:          40,
            height:         40,
            background:     `linear-gradient(135deg, ${C.primaryBg2} 0%, ${C.primaryBg} 100%)`,
            border:         `1.5px solid ${C.primaryBd}`,
            borderRadius:   10,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            flexShrink:     0,
            boxShadow:      `0 0 16px ${C.primaryGlow}`,
          }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <ellipse cx="10" cy="10" rx="8" ry="5.5" stroke={C.primary} strokeWidth="1.4" />
              <circle  cx="10" cy="10" r="3.2" fill={C.primary} />
              <circle  cx="10" cy="10" r="1.4" fill={C.bgBase} />
            </svg>
          </div>
          <div>
            <div style={{
              fontSize:      15,
              fontWeight:    700,
              color:         C.textPrimary,
              letterSpacing: "-0.02em",
              lineHeight:    1.2,
            }}>
              BlueEye
            </div>
            <div style={{
              fontSize:      9,
              fontFamily:    C.m,
              color:         C.primary,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              marginTop:     2,
              opacity:       0.8,
            }}>
              Portal Cliente
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav ────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {NAV.map(({ label, path, Icon }) => {
          const isActive  = activeLabel === label;
          const isHovered = hov === label;
          const iconColor = isActive ? C.primary : isHovered ? C.textBody : C.textSubtle;

          return (
            <div
              key={label}
              onClick={() => navigate(path)}
              onMouseEnter={() => setHov(label)}
              onMouseLeave={() => setHov(null)}
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          11,
                padding:      "9px 12px",
                borderRadius: 9,
                cursor:       "pointer",
                margin:       "1px 0",
                fontSize:     13,
                fontWeight:   isActive ? 600 : 400,
                color:        isActive ? C.textPrimary : isHovered ? C.textSecondary : C.textMuted,
                // Active: cyan tinted bg + cyan left border
                background:   isActive
                  ? C.primaryBg2
                  : isHovered
                  ? "rgba(255,255,255,0.03)"
                  : "transparent",
                border:       isActive
                  ? `1px solid ${C.primaryBd}`
                  : "1px solid transparent",
                borderLeft:   isActive
                  ? `2px solid ${C.primary}`
                  : "2px solid transparent",
                boxShadow:    isActive
                  ? `inset 0 0 14px rgba(34,211,238,0.04)`
                  : "none",
                transition:   "all 0.13s ease",
                userSelect:   "none" as const,
              }}
            >
              <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                <Icon color={iconColor} />
              </span>
              <span style={{ flex: 1 }}>{label}</span>

              {/* Danger badge on Alertas */}
              {label === "Alertas" && alertCount > 0 && (
                <span style={{
                  fontSize:     9,
                  fontFamily:   C.m,
                  fontWeight:   600,
                  background:   C.dangerBg,
                  color:        "#f87171",
                  border:       `1px solid ${C.dangerBd}`,
                  padding:      "1px 6px",
                  borderRadius: 4,
                  lineHeight:   1.6,
                }}>
                  {alertCount}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Company + Clock ────────────────────────── */}
      <div style={{
        padding:       "14px 16px",
        borderTop:     `1px solid ${C.border}`,
        flexShrink:    0,
        display:       "flex",
        flexDirection: "column",
        gap:           12,
      }}>
        {/* Company card */}
        <div style={{
          display:      "flex",
          alignItems:   "center",
          gap:          9,
          padding:      "9px 11px",
          background:   C.bgCard,
          border:       `1px solid ${C.border}`,
          borderRadius: 9,
        }}>
          <div style={{
            width:          30,
            height:         30,
            background:     C.primaryBg,
            border:         `1px solid ${C.primaryBd}`,
            borderRadius:   7,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            fontSize:       10,
            fontWeight:     700,
            color:          C.primary,
            letterSpacing:  "0.04em",
            flexShrink:     0,
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize:     12, fontWeight: 500, color: C.textPrimary,
              lineHeight:   1.3, overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
            }}>
              {companyName}
            </div>
            <div style={{ fontSize: 9, color: C.textSubtle, fontFamily: C.m, letterSpacing: "0.06em" }}>
              Premium
            </div>
          </div>
        </div>

        <SidebarClock />
      </div>
    </aside>
  );
};

export default ClientSidebar;