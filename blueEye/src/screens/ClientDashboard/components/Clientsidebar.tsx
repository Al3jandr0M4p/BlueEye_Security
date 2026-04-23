import type React from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  faGauge,
  faWrench,
  faTicket,
  faFileInvoiceDollar,
  faRightFromBracket,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// ─── BlueEye Landing tokens ───────────────────────────────────────────────────
const T = {
  white:     "#FFFFFF",
  green:     "#4CAF82",
  greenDark: "#2E8B5E",
  greenSft:  "#EAF7F1",
  greenMid:  "#A8DBBE",
  navy:      "#1A2332",
  t1:        "#1A2332",
  t2:        "#4A5568",
  t3:        "#9AA3B2",
  border:    "#E2E8E4",
  danger:    "#E05252",
  dangerSft: "rgba(224,82,82,0.06)",
  dangerBd:  "#fca5a5",
  sans:      "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  mono:      "'JetBrains Mono', 'Fira Mono', monospace",
} as const;

// ─── Paths exactos de App.tsx ─────────────────────────────────────────────────
// /clientDashboard/overview, /clientDashboard/mantenimiento, etc.
const NAV_ITEMS = [
  { to: "overview",       icon: faGauge,             label: "Dashboard"      },
  { to: "mantenimiento",  icon: faWrench,             label: "Mantenimiento"  },
  { to: "tickets",        icon: faTicket,             label: "Tickets"        },
  { to: "facturas",       icon: faFileInvoiceDollar,  label: "Facturas"       },
  { to: "notificaciones", icon: faBell,               label: "Notificaciones" },
] as const;

interface ClientSidebarProps {
  companyName: string;
  alertCount?: number;
}

export const ClientSidebar: React.FC<ClientSidebarProps> = ({
  companyName,
  alertCount = 0,
}) => {
  const navigate = useNavigate();
  const [logoutHov, setLogoutHov] = useState(false);

  return (
    <aside
      style={{
        width:         240,
        flexShrink:    0,
        height:        "100vh",
        display:       "flex",
        flexDirection: "column",
        background:    T.white,
        borderRight:   `1px solid ${T.border}`,
        fontFamily:    T.sans,
        overflowY:     "auto",
        overflowX:     "hidden",
      }}
    >
      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding:      "20px 20px 16px",
          borderBottom: `1px solid ${T.border}`,
          display:      "flex",
          alignItems:   "center",
          gap:          10,
        }}
      >
        <div
          style={{
            width:          34,
            height:         34,
            borderRadius:   9,
            background:     T.navy,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            flexShrink:     0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <ellipse cx="9" cy="9" rx="8" ry="5.5" stroke={T.green} strokeWidth="1.5" />
            <circle cx="9" cy="9" r="2.5" fill={T.green} />
            <circle cx="9" cy="9" r="1" fill={T.white} />
          </svg>
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize:      15,
              fontWeight:    800,
              color:         T.t1,
              letterSpacing: "-0.02em",
              lineHeight:    1.1,
              whiteSpace:    "nowrap",
              overflow:      "hidden",
              textOverflow:  "ellipsis",
            }}
          >
            BlueEye <span style={{ color: T.green }}>Security</span>
          </div>
          <div
            style={{
              fontSize:     10,
              fontWeight:   600,
              color:        T.t3,
              marginTop:    2,
              whiteSpace:   "nowrap",
              overflow:     "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {companyName}
          </div>
        </div>
      </div>

      {/* ── Alert badge ───────────────────────────────────────────────────── */}
      {alertCount > 0 && (
        <div
          style={{
            margin:       "12px 14px 0",
            padding:      "8px 12px",
            background:   T.greenSft,
            border:       `1px solid ${T.greenMid}`,
            borderRadius: 10,
            display:      "flex",
            alignItems:   "center",
            gap:          8,
          }}
        >
          <FontAwesomeIcon icon={faBell} style={{ color: T.green, fontSize: 11, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: T.greenDark }}>
            {alertCount} alerta{alertCount !== 1 ? "s" : ""} activa{alertCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* ── Section label ─────────────────────────────────────────────────── */}
      <div
        style={{
          padding:       "16px 20px 8px",
          fontSize:      10,
          fontFamily:    T.mono,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color:         T.t3,
          fontWeight:    700,
        }}
      >
        Menú principal
      </div>

      {/* ── Nav links ─────────────────────────────────────────────────────── */}
      <nav
        style={{
          flex:          1,
          padding:       "0 10px",
          display:       "flex",
          flexDirection: "column",
          gap:           2,
        }}
      >
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display:        "flex",
              alignItems:     "center",
              gap:            10,
              padding:        "9px 10px",
              borderRadius:   10,
              textDecoration: "none",
              fontSize:       13,
              fontWeight:     isActive ? 700 : 500,
              color:          isActive ? T.greenDark : T.t2,
              background:     isActive ? T.greenSft  : "transparent",
              border:         isActive ? `1px solid ${T.greenMid}` : "1px solid transparent",
              transition:     "all 0.15s",
            })}
          >
            {({ isActive }) => (
              <>
                <span
                  style={{
                    width:          28,
                    height:         28,
                    borderRadius:   7,
                    background:     isActive ? T.green : "#F1F5F2",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    flexShrink:     0,
                    transition:     "background 0.15s",
                  }}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    style={{ fontSize: 12, color: isActive ? T.white : T.t3 }}
                  />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ────────────────────────────────────────────────────────── */}
      <div style={{ padding: "12px 10px 20px", borderTop: `1px solid ${T.border}` }}>
        <button
          onMouseEnter={() => setLogoutHov(true)}
          onMouseLeave={() => setLogoutHov(false)}
          onClick={() => navigate("/login")}
          style={{
            width:        "100%",
            display:      "flex",
            alignItems:   "center",
            gap:          10,
            padding:      "9px 10px",
            borderRadius: 10,
            border:       `1px solid ${logoutHov ? T.dangerBd : T.border}`,
            background:   logoutHov ? T.dangerSft : "transparent",
            cursor:       "pointer",
            fontSize:     13,
            fontWeight:   600,
            color:        logoutHov ? T.danger : T.t3,
            fontFamily:   T.sans,
            transition:   "all 0.18s",
            textAlign:    "left",
          }}
        >
          <span
            style={{
              width:          28,
              height:         28,
              borderRadius:   7,
              background:     logoutHov ? "rgba(224,82,82,0.10)" : "#F1F5F2",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              flexShrink:     0,
              transition:     "background 0.15s",
            }}
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              style={{ fontSize: 12, color: logoutHov ? T.danger : T.t3 }}
            />
          </span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};