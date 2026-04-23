import type React from "react";
import { PANEL_STYLE } from "./components/shared";
import { useSuperAdminSettings } from "./hooks/useSuperAdminSettings";

function RouteList({
  color,
  items,
  title,
}: {
  color: string;
  items: string[];
  title: string;
}) {
  return (
    <div style={{ ...PANEL_STYLE, padding: 18 }}>
      <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>{title}</div>
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item) => (
          <div key={item} style={{ border: "1px solid rgba(2,6,23,0.08)", borderLeft: `4px solid ${color}`, borderRadius: 12, padding: "10px 12px", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#334155", background: "#f8fafc" }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SuperAdminSettings(): React.ReactElement {
  const { error, features, isLoading, routes } = useSuperAdminSettings();
  const available = routes.filter((route) => route.enabled).map((route) => route.route);
  const healthyFeatures = features.filter((feature) => feature.status === "available");
  const missingFeatures = features.filter((feature) => feature.status === "missing");

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        <RouteList title="Rutas ya disponibles" items={available} color="#22c55e" />
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>
            Estado real del modulo
          </div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {healthyFeatures.map((feature) => (
              <div key={feature.key} style={{ border: "1px solid rgba(2,6,23,0.08)", borderLeft: "4px solid #22c55e", borderRadius: 12, padding: "10px 12px", background: "#f8fafc" }}>
                <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 800 }}>{feature.label}</div>
                <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>
                  Disponible{feature.details ? ` · ${feature.details}` : ""}
                </div>
              </div>
            ))}
            {missingFeatures.map((feature) => (
              <div key={feature.key} style={{ border: "1px solid rgba(2,6,23,0.08)", borderLeft: "4px solid #f59e0b", borderRadius: 12, padding: "10px 12px", background: "#fff7ed" }}>
                <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 800 }}>{feature.label}</div>
                <div style={{ color: "#9a3412", fontSize: 11, marginTop: 4 }}>
                  Faltante{feature.details ? ` · ${feature.details}` : ""}
                </div>
              </div>
            ))}
            {!features.length && !isLoading && (
              <div style={{ color: "#64748b", fontSize: 12 }}>
                No se encontraron indicadores para este modulo.
              </div>
            )}
            {error && <div style={{ color: "#b91c1c", fontSize: 12 }}>{error}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
