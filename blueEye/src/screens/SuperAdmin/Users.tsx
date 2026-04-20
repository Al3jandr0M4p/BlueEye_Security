import type React from "react";
import { PANEL_STYLE, StatCard } from "./components/shared";
import { useSuperAdminUsers } from "./hooks/useSuperAdminUsers";

export default function SuperAdminUsers(): React.ReactElement {
  const {
    admins,
    currentUser,
    entries,
    error,
    integrationNote,
    isLoading,
    total,
  } = useSuperAdminUsers();

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label="Actores detectados" value={total} sub="Desde auditoria real" accent="#0f172a" />
        <StatCard label="Admins inferidos" value={admins} sub="Actores ligados a empresas" />
        <StatCard label="Cuenta actual" value={currentUser.role} sub={currentUser.name} accent="#a855f7" />
        <StatCard label="Listado global" value="Pendiente" sub="Falta endpoint backend" accent="#f59e0b" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.3fr 120px 110px", gap: 12, padding: "8px 10px", marginBottom: 6 }}>
            {["Actor", "Empresa", "Ultima vista", "Riesgo"].map((h) => (
              <div key={h} style={{ fontSize: 10, color: "#64748b", fontWeight: 900, letterSpacing: "0.10em", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {entries.map((entry) => (
              <div key={entry.id} className="row-hover" style={{ display: "grid", gridTemplateColumns: "1.2fr 1.3fr 120px 110px", gap: 12, padding: "12px 10px", borderRadius: 12, alignItems: "center" }}>
                <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{entry.actor}</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>{entry.company}</div>
                <div style={{ color: "#64748b", fontSize: 11 }}>{entry.lastSeen}</div>
                <div style={{ color: entry.risk === "alto" ? "#b91c1c" : "#0f766e", fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>{entry.risk}</div>
              </div>
            ))}
            {!entries.length && !isLoading && (
              <div style={{ color: "#64748b", fontSize: 12 }}>
                No hay actores suficientes para mostrar.
              </div>
            )}
          </div>
        </div>

        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Cuenta autenticada</div>
          <div style={{ marginTop: 12, color: "#0f172a", fontSize: 14, fontWeight: 800 }}>{currentUser.name}</div>
          <div style={{ marginTop: 6, color: "#64748b", fontSize: 12 }}>{currentUser.email}</div>
          <div style={{ marginTop: 6, color: "#64748b", fontSize: 12, textTransform: "capitalize" }}>Rol: {currentUser.role}</div>
          <div style={{ color: error ? "#b91c1c" : "#64748b", fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>
            {error ?? integrationNote}
          </div>
        </div>
      </div>
    </>
  );
}
