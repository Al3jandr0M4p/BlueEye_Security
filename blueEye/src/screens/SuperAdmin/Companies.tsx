import type React from "react";
import {
  PANEL_STYLE,
  StatCard,
  planBadge,
  stateBadge,
} from "./components/shared";
import { useSuperAdminCompanies } from "./hooks/useSuperAdminCompanies";

export default function SuperAdminCompanies(): React.ReactElement {
  const {
    activas,
    companies,
    error,
    handleActivateCompany,
    handlePlanChange,
    handleSuspendCompany,
    isLoading,
    isSavingPlanId,
    isSuspendingId,
    search,
    setSearch,
    suspendidas,
    total,
    trial,
  } = useSuperAdminCompanies();

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label="Empresas" value={total} sub="Cuentas registradas" accent="#0f172a" />
        <StatCard label="Activas" value={activas} sub="Operando normalmente" />
        <StatCard label="Trials" value={trial} sub="Pendientes de conversion" accent="#fbbf24" />
        <StatCard label="Suspendidas" value={suspendidas} sub="Revision requerida" accent="#ef4444" />
      </div>

      <div style={{ ...PANEL_STYLE, padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Listado de Empresas</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Busqueda real contra el backend</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar empresa..."
            style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "9px 12px", minWidth: 240, color: "#0f172a", fontSize: 12 }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, alignItems: "start" }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 120px 95px 100px 130px", gap: 12, padding: "8px 10px", marginBottom: 6 }}>
            {["Empresa", "Admin", "Plan", "Estado", "Creada", "Accion"].map((h) => (
              <div key={h} style={{ fontSize: 10, color: "#64748b", fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {companies.map((company) => (
              <div key={company.id} className="row-hover" style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 120px 95px 100px 130px", gap: 12, padding: "12px 10px", borderRadius: 12, alignItems: "center" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{company.name}</div>
                  <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>
                    {company.totalUsers} usuarios · {company.openTickets} tickets abiertos · ultima actividad {company.ultimaActividad}
                  </div>
                </div>
                <div style={{ color: "#94a3b8", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{company.admin}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div>{planBadge(company.plan)}</div>
                  <select
                    value={company.plan.toLowerCase()}
                    disabled={isSavingPlanId === String(company.id)}
                    onChange={(event) =>
                      handlePlanChange(
                        String(company.id),
                        event.target.value as "free" | "starter" | "pro" | "enterprise",
                      )
                    }
                    style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 8, padding: "6px 8px", color: "#0f172a", fontSize: 11 }}
                  >
                    <option value="free">Free</option>
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div>{stateBadge(company.estado)}</div>
                <div style={{ color: "#64748b", fontSize: 11, fontWeight: 700 }}>{company.fecha}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button
                    type="button"
                    disabled={company.estado === "suspendida" || isSuspendingId === String(company.id)}
                    onClick={() => handleSuspendCompany(String(company.id))}
                    style={{ background: company.estado === "suspendida" ? "#e2e8f0" : "rgba(239,68,68,0.10)", border: company.estado === "suspendida" ? "1px solid #cbd5e1" : "1px solid rgba(239,68,68,0.20)", color: company.estado === "suspendida" ? "#64748b" : "#b91c1c", borderRadius: 10, padding: "8px 10px", fontSize: 11, fontWeight: 800, cursor: company.estado === "suspendida" ? "not-allowed" : "pointer" }}
                  >
                    {isSuspendingId === String(company.id) && company.estado !== "suspendida"
                      ? "Guardando..."
                      : "Suspender"}
                  </button>
                  <button
                    type="button"
                    disabled={company.estado !== "suspendida" || isSuspendingId === String(company.id)}
                    onClick={() => handleActivateCompany(String(company.id))}
                    style={{ background: company.estado !== "suspendida" ? "#e2e8f0" : "rgba(34,211,238,0.10)", border: company.estado !== "suspendida" ? "1px solid #cbd5e1" : "1px solid rgba(34,211,238,0.20)", color: company.estado !== "suspendida" ? "#64748b" : "#0f766e", borderRadius: 10, padding: "8px 10px", fontSize: 11, fontWeight: 800, cursor: company.estado !== "suspendida" ? "not-allowed" : "pointer" }}
                  >
                    {isSuspendingId === String(company.id) && company.estado === "suspendida"
                      ? "Guardando..."
                      : "Activar"}
                  </button>
                </div>
              </div>
            ))}
            {!companies.length && !isLoading && (
              <div style={{ color: "#64748b", fontSize: 12, padding: "12px 10px" }}>
                No se encontraron empresas.
              </div>
            )}
          </div>
        </div>

        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#0f172a", fontSize: 14, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Estado operacional</div>
          <div style={{ color: "#64748b", fontSize: 12, marginTop: 8, lineHeight: 1.6 }}>
            Esta pantalla ya consume empresas reales del backend, permite buscar por nombre, cambiar el plan y suspender o reactivar cuentas.
          </div>
          <div style={{ color: "#64748b", fontSize: 12, marginTop: 8, lineHeight: 1.6 }}>
            El uso se calcula con usuarios activos y tickets abiertos frente a la capacidad del plan.
          </div>
          {error && <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 12 }}>{error}</div>}
        </div>
      </div>
    </>
  );
}
