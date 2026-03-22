import { useState } from "react";
import type { MaintenanceRecord } from "../types/client.types";

// ─── BlueEye Landing tokens ───────────────────────────────────────────────────
const T = {
  white:     "#FFFFFF",
  green:     "#4CAF82",
  greenDark: "#2E8B5E",
  greenSft:  "#EAF7F1",
  greenMid:  "#A8DBBE",
  t1:        "#1A2332",
  t2:        "#4A5568",
  t3:        "#9AA3B2",
  border:    "#E2E8E4",
  sans:      "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  mono:      "'JetBrains Mono', 'Fira Mono', monospace",
} as const;

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 10, fontFamily: T.mono, letterSpacing: "0.08em", fontWeight: 700,
      padding: "3px 10px", borderRadius: 100,
      background: T.greenSft, color: T.green, border: `1px solid ${T.greenMid}`,
      whiteSpace: "nowrap" as const, lineHeight: 1,
    }}>
      {children}
    </span>
  );
}

interface MaintenanceHistoryProps {
  records: MaintenanceRecord[];
}

export default function MaintenanceHistory({ records }: MaintenanceHistoryProps) {
  const [hovRow, setHovRow] = useState<string | null>(null);

  return (
    <section style={{
      background:   T.white,
      border:       `1px solid ${T.border}`,
      borderRadius: 14,
      overflow:     "hidden",
      fontFamily:   T.sans,
      boxShadow:    "0 1px 4px rgba(26,35,50,0.04)",
    }}>
      {/* Header */}
      <div style={{
        padding:        "13px 18px",
        borderBottom:   `1px solid ${T.border}`,
        background:     T.greenSft,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.t1, letterSpacing: "-0.01em" }}>
            Mantenimientos
          </div>
          <div style={{
            fontSize: 10, fontFamily: T.mono, letterSpacing: "0.12em",
            textTransform: "uppercase" as const, color: T.t3, marginTop: 2,
          }}>
            Historial técnico
          </div>
        </div>
        <Tag>{records.length} registros</Tag>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 580, borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}`, background: "#F8FAF8" }}>
              {["Fecha", "Técnico", "Equipo", "Observaciones"].map(h => (
                <th key={h} style={{
                  padding:       "10px 18px",
                  textAlign:     "left" as const,
                  fontWeight:    700,
                  fontSize:      10,
                  fontFamily:    T.mono,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color:         T.t3,
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
                    borderBottom: `1px solid ${T.border}`,
                    background:   isHov ? T.greenSft : T.white,
                    transition:   "background 0.15s",
                  }}
                >
                  <td style={{ padding: "12px 18px", fontFamily: T.mono, color: T.t3, fontSize: 11 }}>
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px 18px", fontFamily: T.mono, fontWeight: 700, color: T.t1, fontSize: 12 }}>
                    {record.technician}
                  </td>
                  <td style={{ padding: "12px 18px", color: T.t2, fontSize: 12 }}>
                    {record.equipment}
                  </td>
                  <td style={{ padding: "12px 18px", color: T.t2, fontSize: 12 }}>
                    {record.observations}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {records.length === 0 && (
        <div style={{ padding: "40px 0", textAlign: "center" as const, color: T.t3, fontSize: 12 }}>
          Sin registros de mantenimiento
        </div>
      )}
    </section>
  );
}