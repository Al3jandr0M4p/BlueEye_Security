import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

interface NavItem {
  to: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { to: "dashboard", icon: "⬡", label: "Dashboard" },
  { to: "companies", icon: "🏢", label: "Empresas" },
  { to: "plans", icon: "📦", label: "Planes" },
  { to: "billing", icon: "💳", label: "Facturación" },
  { to: "users", icon: "👥", label: "Usuarios" },
  { to: "audit", icon: "🔍", label: "Auditoría" },
  { to: "support", icon: "🎧", label: "Soporte" },
  { to: "settings", icon: "⚙️", label: "Config." },
  { to: "profile", icon: "👤", label: "Perfil" },
];

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard Global", subtitle: "Visión general de toda la plataforma" },
  companies: { title: "Empresas", subtitle: "Gestión de cuentas, estado y consumo" },
  plans: { title: "Planes", subtitle: "Paquetes, límites y precios (estático)" },
  billing: { title: "Facturación", subtitle: "Pagos, facturas y revenue (estático)" },
  users: { title: "Usuarios", subtitle: "Cuentas, roles y accesos (estático)" },
  audit: { title: "Auditoría", subtitle: "Bitácora de eventos y trazabilidad" },
  support: { title: "Soporte", subtitle: "Tickets y SLA (estático)" },
  settings: { title: "Configuración", subtitle: "Preferencias globales y seguridad (estático)" },
  profile: { title: "Perfil Super Admin", subtitle: "Información y preferencias de la cuenta" },
};

export default function SuperAdminLayout(): React.ReactElement {
  const location = useLocation();
  const [time, setTime] = useState<Date>(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const page = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    const last = parts.length > 0 ? parts[parts.length - 1] : "dashboard";
    const key = last === "admin" ? "dashboard" : last;
    return pageMeta[key] ?? pageMeta.dashboard;
  }, [location.pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #ffffff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: rgba(14,165,233,0.35); border-radius: 99px; }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .nav-item { cursor: pointer; transition: all 0.18s; text-decoration: none; }
        .nav-item:hover { background: rgba(14,165,233,0.08) !important; }
        .row-hover:hover { background: rgba(14,165,233,0.06) !important; cursor: pointer; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#ffffff" }}>
        <aside
          style={{
            width: 220,
            background: "linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)",
            borderRight: "1px solid rgba(2,6,23,0.08)",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            position: "sticky",
            top: 0,
            height: "100vh",
          }}
        >
          <div style={{ padding: "28px 20px 24px", borderBottom: "1px solid rgba(2,6,23,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#0ea5e9,#22d3ee)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👁</div>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#0f172a", fontSize: 15, letterSpacing: "0.02em" }}>BlueEye</div>
                <div style={{ fontSize: 10, color: "#0ea5e9", letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase" }}>Super Admin</div>
              </div>
            </div>
          </div>

          <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="nav-item"
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: isActive ? "rgba(14,165,233,0.10)" : "transparent",
                  borderLeft: isActive ? "2px solid #0ea5e9" : "2px solid transparent",
                  color: isActive ? "#0f172a" : "#475569",
                  fontSize: 13,
                  fontWeight: isActive ? 800 : 600,
                })}
              >
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div style={{ padding: "16px 16px 20px", borderTop: "1px solid rgba(2,6,23,0.08)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 10,
                borderRadius: 12,
                background: "rgba(14,165,233,0.04)",
                border: "1px solid rgba(14,165,233,0.12)",
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#0ea5e9,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff", fontWeight: 700 }}>SA</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 800, lineHeight: 1.1 }}>Super Admin</div>
                <div style={{ color: "#64748b", fontSize: 10, marginTop: 2 }}>admin@blueeye.io</div>
              </div>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", animation: "fadeIn 0.4s ease" }}>
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 32px",
              borderBottom: "1px solid rgba(2,6,23,0.08)",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(12px)",
              position: "sticky",
              top: 0,
              zIndex: 10,
              boxShadow: "0 8px 26px rgba(2,6,23,0.06)",
            }}
          >
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 22, color: "#0f172a" }}>{page.title}</div>
              <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{page.subtitle}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.18)", borderRadius: 20, padding: "6px 14px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0ea5e9", animation: "pulse-dot 1.4s infinite" }} />
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#0ea5e9" }}>
                  {time.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
              </div>
              <div style={{ position: "relative", cursor: "pointer" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(2,6,23,0.04)", border: "1px solid rgba(2,6,23,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔔</div>
                <div style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: "2px solid #ffffff" }} />
              </div>
            </div>
          </header>

          <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 28 }}>
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
