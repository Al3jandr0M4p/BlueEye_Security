import React from "react";

type UserRole = "superAdmin" | "admin" | "tecnico" | "usuario";
type UserStatus = "active" | "invited" | "blocked";

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  empresa: string;
  mfa: boolean;
}

const PANEL_STYLE: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid rgba(2,6,23,0.08)",
  borderRadius: 16,
  boxShadow: "0 12px 30px rgba(2,6,23,0.06)",
};

const users: UserRow[] = [
  { id: 1, name: "Super Admin", email: "admin@blueeye.io", role: "superAdmin", status: "active", lastLogin: "hace 6h", empresa: "—", mfa: true },
  { id: 2, name: "Carlos Méndez", email: "carlos@vigitech.do", role: "admin", status: "active", lastLogin: "hace 2h", empresa: "VigiTech RD", mfa: true },
  { id: 3, name: "María López", email: "maria@safeeye.com", role: "admin", status: "invited", lastLogin: "—", empresa: "SafeEye Solutions", mfa: false },
  { id: 4, name: "Pedro Ruiz", email: "pruiz@cctvpro.com", role: "admin", status: "active", lastLogin: "hace 1d", empresa: "CCTV Pro Services", mfa: true },
  { id: 5, name: "Ana Torres", email: "ana@securevision.srl", role: "admin", status: "blocked", lastLogin: "hace 18d", empresa: "SecureVision SRL", mfa: false },
  { id: 6, name: "Juan Peña", email: "juan@blueguard.lat", role: "tecnico", status: "active", lastLogin: "hace 4d", empresa: "BlueGuard Latam", mfa: true },
  { id: 7, name: "Sofía Reyes", email: "sreyes@visionpoint.io", role: "usuario", status: "active", lastLogin: "hace 2d", empresa: "VisionPoint Group", mfa: false },
];

const roleBadge = (role: UserRole): React.ReactElement => {
  const map: Record<UserRole, { label: string; color: string }> = {
    superAdmin: { label: "Super Admin", color: "#a855f7" },
    admin: { label: "Admin", color: "#22d3ee" },
    tecnico: { label: "Técnico", color: "#0ea5e9" },
    usuario: { label: "Usuario", color: "#94a3b8" },
  };
  const r = map[role];
  return <span style={{ color: r.color, fontWeight: 900, fontSize: 12 }}>{r.label}</span>;
};

const statusBadge = (status: UserStatus): React.ReactElement => {
  const map: Record<UserStatus, { label: string; bg: string; color: string }> = {
    active: { label: "Activo", bg: "rgba(34,211,238,0.12)", color: "#22d3ee" },
    invited: { label: "Invitado", bg: "rgba(251,191,36,0.12)", color: "#fbbf24" },
    blocked: { label: "Bloqueado", bg: "rgba(239,68,68,0.12)", color: "#ef4444" },
  };
  const s = map[status];
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 900, letterSpacing: "0.04em", textTransform: "uppercase" }}>
      {s.label}
    </span>
  );
};

export default function SuperAdminUsers(): React.ReactElement {
  const total = users.length;
  const admins = users.filter((u) => u.role === "admin").length;
  const invited = users.filter((u) => u.status === "invited").length;
  const mfa = users.filter((u) => u.mfa).length;

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>Usuarios</div>
          <div style={{ color: "#0f172a", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{total}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Cuentas (mock)</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>Admins</div>
          <div style={{ color: "#22d3ee", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{admins}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Admins de empresas</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>Invitaciones</div>
          <div style={{ color: "#fbbf24", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{invited}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Pendientes</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>MFA</div>
          <div style={{ color: "#a855f7", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{Math.round((mfa / total) * 100)}%</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Adopción (mock)</div>
        </div>
      </div>

      <div style={{ ...PANEL_STYLE, padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Directorio de usuarios</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Búsqueda y gestión (estático)</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "9px 12px", minWidth: 260, color: "#64748b", fontSize: 12 }}>
            🔎 Buscar por nombre / email…
          </div>
          <button
            type="button"
            style={{
              background: "#0ea5e9",
              border: "1px solid #0ea5e9",
              color: "#ffffff",
              borderRadius: 12,
              padding: "9px 12px",
              fontSize: 12,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            + Invitar
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, alignItems: "start" }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.6fr 110px 110px 90px 120px", gap: 12, padding: "8px 10px", marginBottom: 6 }}>
            {["Nombre", "Email", "Rol", "Estado", "MFA", "Empresa"].map((h) => (
              <div key={h} style={{ fontSize: 10, color: "#64748b", fontWeight: 900, letterSpacing: "0.10em", textTransform: "uppercase" }}>
                {h}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {users.map((u) => (
              <div
                key={u.id}
                className="row-hover"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1.6fr 110px 110px 90px 120px",
                  gap: 12,
                  padding: "12px 10px",
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
                  <div style={{ color: "#64748b", fontSize: 10, marginTop: 2 }}>Último acceso: {u.lastLogin}</div>
                </div>
                <div style={{ color: "#94a3b8", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</div>
                <div>{roleBadge(u.role)}</div>
                <div>{statusBadge(u.status)}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: u.mfa ? "#22d3ee" : "#475569", fontWeight: 900 }}>{u.mfa ? "ON" : "OFF"}</div>
                <div style={{ color: "#64748b", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.empresa}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...PANEL_STYLE, padding: 18 }}>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Roles</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Distribución (mock)</div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Super Admin", v: users.filter((u) => u.role === "superAdmin").length, color: "#a855f7" },
                { label: "Admin", v: admins, color: "#22d3ee" },
                { label: "Técnico", v: users.filter((u) => u.role === "tecnico").length, color: "#0ea5e9" },
                { label: "Usuario", v: users.filter((u) => u.role === "usuario").length, color: "#94a3b8" },
              ].map((r) => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{r.label}</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: r.color, fontWeight: 900 }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...PANEL_STYLE, padding: 18 }}>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Acciones</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Atajos (estático)</div>
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {[
                { icon: "🔒", title: "Forzar reset", desc: "Cambiar contraseña" },
                { icon: "🧩", title: "Asignar rol", desc: "Actualizar permisos" },
                { icon: "🛡️", title: "Revisar MFA", desc: "Políticas de seguridad" },
                { icon: "📨", title: "Reenviar invitación", desc: "Usuarios pendientes" },
              ].map((a) => (
                <div key={a.title} className="nav-item" style={{ background: "rgba(14,165,233,0.04)", border: "1px solid rgba(2,6,23,0.08)", borderRadius: 12, padding: "12px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{a.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{a.title}</div>
                    <div style={{ color: "#64748b", fontSize: 10, marginTop: 2 }}>{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
