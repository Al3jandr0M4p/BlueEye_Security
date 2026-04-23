import type React from "react";
import { PANEL_STYLE, StatCard, stateBadge } from "./components/shared";
import { useSuperAdminSupport } from "./hooks/useSuperAdminSupport";

export default function SuperAdminSupport(): React.ReactElement {
  const { avgResponse, error, integrationNote, isLoading, open, search, setSearch, slaRisk, tickets, urgent } =
    useSuperAdminSupport();

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label="Abiertos" value={open} sub="Tickets activos desde backend" />
        <StatCard label="Criticos" value={urgent} sub="Prioridad alta o urgente" accent="#ef4444" />
        <StatCard label="SLA en riesgo" value={slaRisk} sub="Sin asignar o pendientes" accent="#fbbf24" />
        <StatCard label="Respuesta" value={avgResponse} sub="Promedio desde la API" accent="#a855f7" />
      </div>

      <div style={{ ...PANEL_STYLE, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Cola global de soporte</div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar ticket..."
            style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "9px 12px", minWidth: 220, color: "#0f172a", fontSize: 12 }}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "110px 2fr 1.2fr 110px 120px", gap: 12, padding: "8px 10px", marginBottom: 6 }}>
          {["ID", "Asunto", "Empresa", "Estado", "Actualizado"].map((h) => (
            <div key={h} style={{ fontSize: 10, color: "#64748b", fontWeight: 900, letterSpacing: "0.10em", textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {tickets.map((ticket) => (
            <div key={ticket.id} className="row-hover" style={{ display: "grid", gridTemplateColumns: "110px 2fr 1.2fr 110px 120px", gap: 12, padding: "12px 10px", borderRadius: 12, alignItems: "center" }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#94a3b8" }}>{ticket.id}</div>
              <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{ticket.asunto}</div>
              <div style={{ color: "#94a3b8", fontSize: 12 }}>{ticket.empresa}</div>
              <div>{stateBadge(ticket.status)}</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>{ticket.actualizado}</div>
            </div>
          ))}
          {!tickets.length && !isLoading && (
            <div style={{ color: "#64748b", fontSize: 12 }}>
              No hay tickets globales para mostrar.
            </div>
          )}
        </div>
      </div>

      <div style={{ ...PANEL_STYLE, padding: 18, color: error ? "#b91c1c" : "#64748b", fontSize: 12, lineHeight: 1.6 }}>
        {error ?? integrationNote}
      </div>
    </>
  );
}
