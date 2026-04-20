import type React from "react";
import { PANEL_STYLE, StatCard } from "./components/shared";
import { useSuperAdminPlans } from "./hooks/useSuperAdminPlans";

export default function SuperAdminPlans(): React.ReactElement {
  const { error, isLoading, plans } = useSuperAdminPlans();

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
        <StatCard label="CRUD backend" value="Pendiente" sub="Ruta de planes no expuesta" accent="#f59e0b" />
        <StatCard label="Modo actual" value="Solo lectura" sub="Sin edicion desde API" accent="#22d3ee" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {plans.map((plan) => (
          <div key={plan.id} style={{ ...PANEL_STYLE, padding: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: -60, background: plan.accent, opacity: 0.05, filter: "blur(40px)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ color: "#0f172a", fontSize: 16, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>{plan.name}</div>
                <span style={{ fontSize: 10, fontWeight: 900, color: plan.backendRouteReady ? "#22d3ee" : "#f59e0b", background: plan.backendRouteReady ? "rgba(34,211,238,0.10)" : "rgba(245,158,11,0.10)", border: `1px solid ${plan.backendRouteReady ? "rgba(34,211,238,0.22)" : "rgba(245,158,11,0.22)"}`, padding: "3px 8px", borderRadius: 999, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {plan.backendRouteReady ? "Editable" : "Lectura"}
                </span>
              </div>
              <div style={{ color: plan.accent, fontSize: 26, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 8 }}>{plan.price}</div>
              <div style={{ marginTop: 14, color: "#334155", fontSize: 13, fontWeight: 700 }}>
                Empresas usando este plan: {plan.adoption}
              </div>
              <div style={{ marginTop: 12, color: "#64748b", fontSize: 12, lineHeight: 1.6 }}>
                El backend actual permite medir adopcion por plan desde empresas, pero no expone aun el catalogo editable de planes.
              </div>
            </div>
          </div>
        ))}
      </div>

      {(error || !isLoading) && (
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Observacion backend</div>
          <div style={{ color: error ? "#b91c1c" : "#64748b", fontSize: 12, marginTop: 10, lineHeight: 1.6 }}>
            {error ?? "Falta habilitar en backend las rutas comentadas de planes: GET /api/super/admin/plans y PATCH /api/super/admin/plans/:id."}
          </div>
        </div>
      )}
    </>
  );
}
