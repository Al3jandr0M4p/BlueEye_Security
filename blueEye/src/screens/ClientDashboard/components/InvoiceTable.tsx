import type React from "react";
import { useState } from "react";
import type { Invoice } from "../../../types/client.types";

// ─── BlueEye Landing tokens ───────────────────────────────────────────────────
const T = {
  white:      "#FFFFFF",
  green:      "#4CAF82",
  greenDark:  "#2E8B5E",
  greenSft:   "#EAF7F1",
  greenMid:   "#A8DBBE",
  warning:    "#D48A20",
  warningSft: "rgba(212,138,32,0.08)",
  warningBd:  "rgba(212,138,32,0.30)",
  danger:     "#E05252",
  dangerSft:  "rgba(224,82,82,0.08)",
  dangerBd:   "rgba(224,82,82,0.30)",
  t1:         "#1A2332",
  t2:         "#4A5568",
  t3:         "#9AA3B2",
  border:     "#E2E8E4",
  sans:       "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  mono:       "'JetBrains Mono', 'Fira Mono', monospace",
} as const;

const STATUS_CFG = {
  paid:    { label: "Pagada",    color: T.green,   bg: T.greenSft,   bd: T.greenMid   },
  pending: { label: "Pendiente", color: T.warning, bg: T.warningSft, bd: T.warningBd  },
  overdue: { label: "Vencida",   color: T.danger,  bg: T.dangerSft,  bd: T.dangerBd   },
} satisfies Record<Invoice["status"], object>;

interface InvoiceTableProps {
  invoices:   Invoice[];
  onDownload: (invoiceId: string) => void;
}

function Tag({ bg, color, bd, children }: {
  bg: string; color: string; bd: string; children: React.ReactNode;
}) {
  return (
    <span style={{
      fontSize: 10, fontFamily: T.mono, letterSpacing: "0.08em", fontWeight: 700,
      padding: "3px 10px", borderRadius: 100,
      background: bg, color, border: `1px solid ${bd}`,
      whiteSpace: "nowrap" as const, lineHeight: 1,
    }}>
      {children}
    </span>
  );
}

function DownloadBtn({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding:      "5px 14px",
        borderRadius: 100,
        background:   hov ? T.green    : T.greenSft,
        border:       `1px solid ${hov ? T.green : T.greenMid}`,
        color:        hov ? T.white    : T.greenDark,
        fontSize:     10,
        fontFamily:   T.mono,
        fontWeight:   700,
        letterSpacing:"0.06em",
        cursor:       "pointer",
        transition:   "all 0.15s",
      }}
    >
      Descargar
    </button>
  );
}

export default function InvoiceTable({ invoices, onDownload }: InvoiceTableProps) {
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
            Facturas
          </div>
          <div style={{
            fontSize: 10, fontFamily: T.mono, letterSpacing: "0.12em",
            textTransform: "uppercase" as const, color: T.t3, marginTop: 2,
          }}>
            Historial de facturación
          </div>
        </div>
        <Tag bg={T.greenSft} color={T.green} bd={T.greenMid}>
          {invoices.length} registros
        </Tag>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 580, borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}`, background: "#F8FAF8" }}>
              {["Código", "Monto", "Fecha", "Estado", "Acción"].map(h => (
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
            {invoices.map(invoice => {
              const cfg   = STATUS_CFG[invoice.status];
              const isHov = hovRow === invoice.id;
              return (
                <tr
                  key={invoice.id}
                  onMouseEnter={() => setHovRow(invoice.id)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{
                    borderBottom: `1px solid ${T.border}`,
                    background:   isHov ? T.greenSft : T.white,
                    transition:   "background 0.15s",
                  }}
                >
                  <td style={{ padding: "12px 18px", fontFamily: T.mono, fontWeight: 700, color: T.t1, fontSize: 12 }}>
                    {invoice.code}
                  </td>
                  <td style={{ padding: "12px 18px", fontFamily: T.mono, color: T.green, fontWeight: 700 }}>
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: "12px 18px", color: T.t2, fontFamily: T.mono, fontSize: 11 }}>
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <Tag bg={cfg.bg} color={cfg.color} bd={cfg.bd}>{cfg.label}</Tag>
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <DownloadBtn onClick={() => onDownload(invoice.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {invoices.length === 0 && (
        <div style={{ padding: "40px 0", textAlign: "center" as const, color: T.t3, fontSize: 12 }}>
          Sin facturas registradas
        </div>
      )}
    </section>
  );
}
