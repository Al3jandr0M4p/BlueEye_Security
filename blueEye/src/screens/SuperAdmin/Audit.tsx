import type React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PANEL_STYLE, StatCard, logBullet } from "./components/shared";
import { useSuperAdminAudit } from "./hooks/useSuperAdminAudit";

export default function SuperAdminAudit(): React.ReactElement {
  const { changes, critical, entries, error, events, isLoading, logins, total } =
    useSuperAdminAudit();

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label="Eventos (24h)" value={total} sub="Auditoria" accent="#0f172a" />
        <StatCard label="Criticos" value={critical} sub="Requieren atencion" accent="#ef4444" />
        <StatCard label="Logins" value={logins} sub="Accesos" accent="#0ea5e9" />
        <StatCard label="Cambios" value={changes} sub="Config y planes" accent="#22d3ee" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          {error && <div style={{ color: "#b91c1c", fontSize: 12, marginBottom: 12 }}>{error}</div>}
          {entries.map((entry, index) => (
            <div key={`${entry.accion}-${index}`} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: index < entries.length - 1 ? "1px solid rgba(2,6,23,0.06)" : "none", alignItems: "flex-start" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: logBullet(entry.tipo), marginTop: 4, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{entry.accion}</div>
                <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#94a3b8" }}>{entry.ip}</span>
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>{entry.tiempo}</span>
                  <span style={{ fontSize: 10, color: "#64748b" }}>Actor: {entry.actor}</span>
                </div>
                {entry.empresa !== "-" && <div style={{ color: "#64748b", fontSize: 11, marginTop: 6 }}>{entry.empresa}</div>}
              </div>
            </div>
          ))}
          {!entries.length && !isLoading && (
            <div style={{ color: "#64748b", fontSize: 12 }}>
              No hay eventos de auditoria disponibles.
            </div>
          )}
        </div>

        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginBottom: 14 }}>Eventos agrupados</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={events}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(2,6,23,0.08)" />
              <XAxis dataKey="h" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="eventos" fill="#22d3ee" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
