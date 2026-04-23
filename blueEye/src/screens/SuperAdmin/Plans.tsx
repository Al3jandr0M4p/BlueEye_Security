import type React from "react";
import { PANEL_STYLE, StatCard } from "./components/shared";
import { useSuperAdminPlans } from "./hooks/useSuperAdminPlans";

export default function SuperAdminPlans(): React.ReactElement {
  const {
    error,
    handlePlanFieldChange,
    handleSavePlan,
    isLoading,
    plans,
    savingPlanId,
  } = useSuperAdminPlans();

  const mostUsed =
    plans.reduce((current, plan) => (plan.adoption > current.adoption ? plan : current), {
      adoption: 0,
      name: "-",
    } as { adoption: number; name: string }).name;

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label="Planes detectados" value={plans.length} sub="Basado en empresas reales" accent="#0f172a" />
        <StatCard label="Mas usado" value={mostUsed} sub="Adopcion del sistema" />
        <StatCard label="MRR catalogo" value={`$${plans.reduce((total, plan) => total + plan.monthlyRevenue, 0).toLocaleString()}`} sub="Ingreso por planes activos" accent="#a855f7" />
        <StatCard label="Modo actual" value="Editable" sub="Conectado a la API del backend" accent="#22d3ee" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {plans.map((plan) => (
          <div key={plan.id} style={{ ...PANEL_STYLE, padding: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: -60, background: plan.accent, opacity: 0.05, filter: "blur(40px)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <input
                  value={plan.name}
                  onChange={(event) => handlePlanFieldChange(plan.id, "name", event.target.value)}
                  style={{ color: "#0f172a", fontSize: 16, fontWeight: 900, fontFamily: "'Syne',sans-serif", background: "transparent", border: "none", width: "100%" }}
                />
                <span style={{ fontSize: 10, fontWeight: 900, color: "#22d3ee", background: "rgba(34,211,238,0.10)", border: "1px solid rgba(34,211,238,0.22)", padding: "3px 8px", borderRadius: 999, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Editable
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <span style={{ color: plan.accent, fontSize: 26, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>$</span>
                <input
                  type="number"
                  min={0}
                  value={plan.price}
                  onChange={(event) => handlePlanFieldChange(plan.id, "price", Number(event.target.value))}
                  style={{ color: plan.accent, fontSize: 26, fontWeight: 900, fontFamily: "'Syne',sans-serif", background: "transparent", border: "none", width: 100 }}
                />
                <span style={{ color: "#64748b", fontSize: 12 }}>/ mes</span>
              </div>
              <div style={{ marginTop: 14, color: "#334155", fontSize: 13, fontWeight: 700 }}>
                {plan.adoption} empresas · {plan.activeCompanies} activas · MRR ${plan.monthlyRevenue.toLocaleString()}
              </div>
              <textarea
                value={plan.description}
                onChange={(event) => handlePlanFieldChange(plan.id, "description", event.target.value)}
                style={{ marginTop: 12, width: "100%", minHeight: 68, resize: "vertical", borderRadius: 12, border: "1px solid rgba(2,6,23,0.10)", padding: "10px 12px", color: "#64748b", fontSize: 12, lineHeight: 1.6, background: "#f8fafc" }}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                {[
                  ["maxUsers", "Usuarios", plan.maxUsers],
                  ["maxSites", "Sitios", plan.maxSites],
                  ["maxTickets", "Tickets", plan.maxTickets],
                  ["maxBusinesses", "Tenants", plan.maxBusinesses],
                ].map(([field, label, value]) => (
                  <label key={field} style={{ display: "flex", flexDirection: "column", gap: 6, color: "#64748b", fontSize: 11, fontWeight: 700 }}>
                    {label}
                    <input
                      type="number"
                      min={0}
                      value={value}
                      onChange={(event) => handlePlanFieldChange(plan.id, field as keyof typeof plan, Number(event.target.value))}
                      style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 10, padding: "8px 10px", color: "#0f172a", fontSize: 12 }}
                    />
                  </label>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center" }}>
                <input
                  value={plan.accent}
                  onChange={(event) => handlePlanFieldChange(plan.id, "accent", event.target.value)}
                  style={{ flex: 1, background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 10, padding: "8px 10px", color: "#0f172a", fontSize: 12 }}
                />
                <button
                  type="button"
                  onClick={() => handleSavePlan(plan)}
                  disabled={savingPlanId === plan.id}
                  style={{ background: "rgba(14,165,233,0.10)", border: "1px solid rgba(14,165,233,0.20)", color: "#0369a1", borderRadius: 10, padding: "9px 12px", fontSize: 11, fontWeight: 900, cursor: "pointer" }}
                >
                  {savingPlanId === plan.id ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(error || !isLoading) && (
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Estado del catalogo</div>
          <div style={{ color: error ? "#b91c1c" : "#64748b", fontSize: 12, marginTop: 10, lineHeight: 1.6 }}>
            {error ?? "Los planes ya se leen y actualizan desde el backend. Si la tabla `plans` no existe todavia, ejecuta las migraciones del backend para persistir el catalogo."}
          </div>
        </div>
      )}
    </>
  );
}
