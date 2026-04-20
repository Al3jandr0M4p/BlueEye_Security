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
  const { available, missing } = useSuperAdminSettings();

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        <RouteList title="Rutas ya disponibles" items={available} color="#22c55e" />
        <RouteList title="Rutas faltantes" items={missing} color="#f59e0b" />
      </div>
    </>
  );
}
