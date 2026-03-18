import { useState } from "react";
import type { MaintenanceRecord } from "../types/client.types";

const C = {
  bgCard:    "#0f172a",
  bgCardEnd: "#1e293b",
  primary:      "#22d3ee",
  primaryBg:    "rgba(34,211,238,0.07)",
  primaryBd:    "rgba(34,211,238,0.16)",
  textPrimary:   "#f1f5f9",
  textSecondary: "#e2e8f0",
  textBody:      "#cbd5e1",
  textMuted:     "#94a3b8",
  textSubtle:    "#64748b",
  border:      "rgba(255,255,255,0.06)",
  borderCard:  "rgba(34,211,238,0.1)",
  f: "'Geist','Inter',-apple-system,sans-serif",
  m: "'Geist Mono','JetBrains Mono',ui-monospace,monospace",
} as const;

interface MaintenanceHistoryProps {
  records: MaintenanceRecord[];
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 9, fontFamily: C.m, letterSpacing: "0.1em", fontWeight: 600,
      padding: "3px 9px", borderRadius: 5,
      background: C.primaryBg, color: C.primary, border: `1px solid ${C.primaryBd}`,
      whiteSpace: "nowrap", lineHeight: 1,
    }}>
      {children}
    </span>
  );
}

export default function MaintenanceHistory({ records }: MaintenanceHistoryProps) {
  const [hovRow, setHovRow] = useState<string | null>(null);

  const cols = ["Fecha", "Técnico", "Equipo", "Observaciones"];

  return (
    <section style={{
      background:   `linear-gradient(135deg, ${C.bgCard} 0%, ${C.bgCardEnd} 100%)`,
      border:       `1px solid ${C.borderCard}`,
      borderRadius: 12,
      overflow:     "hidden",
      fontFamily:   C.f,
    }}>
      {/* Panel header */}
      <div style={{
        padding: "12px 18px",
        borderBottom: `1px solid ${C.border}`,
        background: "rgba(6,13,26,0.4)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, letterSpacing: "-0.01em" }}>
            Historial de mantenimiento
          </div>
          <div style={{ fontSize: 9, fontFamily: C.m, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textSubtle, marginTop: 2 }}>
            Registros técnicos
          </div>
        </div>
        <Tag>{records.length} registros</Tag>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {cols.map(h => (
                <th key={h} style={{
                  padding: "10px 18px", textAlign: "left", fontWeight: 500,
                  fontSize: 9, fontFamily: C.m, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: C.textSubtle,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map(record => {
              const isHov = hovRow === record.id;
              return (
                <tr
                  key={record.id}
                  onMouseEnter={() => setHovRow(record.id)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{
                    borderBottom: `1px solid ${C.border}`,
                    background: isHov ? "rgba(255,255,255,0.02)" : "transparent",
                    transition: "background 0.15s",
                    verticalAlign: "top",
                  }}
                >
                  <td style={{ padding: "12px 18px", fontFamily: C.m, color: C.primary, fontSize: 11, whiteSpace: "nowrap" }}>
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px 18px", color: C.textSecondary, fontWeight: 500 }}>
                    {record.technician}
                  </td>
                  <td style={{ padding: "12px 18px", color: C.textBody, fontFamily: C.m, fontSize: 11 }}>
                    {record.equipment}
                  </td>
                  <td style={{ padding: "12px 18px", color: C.textMuted, lineHeight: 1.55, maxWidth: 300 }}>
                    {record.observations}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {records.length === 0 && (
        <div style={{ padding: "40px 0", textAlign: "center", color: C.textSubtle, fontSize: 12 }}>
          No hay registros para ese rango de fecha.
        </div>
      )}
    </section>
  );
}