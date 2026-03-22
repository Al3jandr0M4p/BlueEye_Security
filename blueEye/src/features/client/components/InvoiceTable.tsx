import { useState } from "react";
import type { Invoice } from "../types/client.types";

const C = {
  bgCard:    "#0f172a",
  bgCardEnd: "#1e293b",
  primary:      "#22d3ee",
  primaryBg:    "rgba(34,211,238,0.07)",
  primaryBd:    "rgba(34,211,238,0.16)",
  warning:   "#fbbf24",
  warningBg: "rgba(251,191,36,0.08)",
  warningBd: "rgba(251,191,36,0.22)",
  danger:    "#ef4444",
  dangerBg:  "rgba(239,68,68,0.08)",
  dangerBd:  "rgba(239,68,68,0.22)",
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

const STATUS_CFG = {
  paid:    { label: "Pagada",   color: C.primary, bg: C.primaryBg, bd: C.primaryBd },
  pending: { label: "Pendiente", color: C.warning, bg: C.warningBg, bd: C.warningBd },
  overdue: { label: "Vencida",  color: C.danger,  bg: C.dangerBg,  bd: C.dangerBd  },
} satisfies Record<Invoice["status"], object>;

interface InvoiceTableProps {
  invoices: Invoice[];
  onDownload: (invoiceId: string) => void;
}

function Tag({ bg, color, bd, children }: { bg: string; color: string; bd: string; children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 9, fontFamily: C.m, letterSpacing: "0.1em", fontWeight: 600,
      padding: "3px 9px", borderRadius: 5,
      background: bg, color, border: `1px solid ${bd}`,
      whiteSpace: "nowrap", lineHeight: 1,
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
        padding: "4px 12px", borderRadius: 6,
        background: hov ? "rgba(34,211,238,0.12)" : "rgba(34,211,238,0.06)",
        border: `1px solid ${hov ? "rgba(34,211,238,0.35)" : "rgba(34,211,238,0.18)"}`,
        color: C.primary, fontSize: 10, fontFamily: C.m,
        fontWeight: 600, letterSpacing: "0.06em",
        cursor: "pointer", transition: "all 0.15s",
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
      background:   `linear-gradient(135deg, ${C.bgCard} 0%, ${C.bgCardEnd} 100%)`,
      border:       `1px solid ${C.borderCard}`,
      borderRadius: 12,
      overflow:     "hidden",
      fontFamily:   C.f,
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 18px",
        borderBottom: `1px solid ${C.border}`,
        background: "rgba(6,13,26,0.4)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, letterSpacing: "-0.01em" }}>Facturas</div>
          <div style={{ fontSize: 9, fontFamily: C.m, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textSubtle, marginTop: 2 }}>
            Historial de facturación
          </div>
        </div>
        <Tag bg={C.primaryBg} color={C.primary} bd={C.primaryBd}>{invoices.length} registros</Tag>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 580, borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Código", "Monto", "Fecha", "Estado", "Acción"].map(h => (
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
            {invoices.map(invoice => {
              const cfg = STATUS_CFG[invoice.status];
              const isHov = hovRow === invoice.id;
              return (
                <tr
                  key={invoice.id}
                  onMouseEnter={() => setHovRow(invoice.id)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{
                    borderBottom: `1px solid ${C.border}`,
                    background: isHov ? "rgba(255,255,255,0.02)" : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  <td style={{ padding: "12px 18px", fontFamily: C.m, fontWeight: 600, color: C.textPrimary, fontSize: 12 }}>
                    {invoice.code}
                  </td>
                  <td style={{ padding: "12px 18px", fontFamily: C.m, color: C.primary, fontWeight: 500 }}>
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: "12px 18px", color: C.textBody, fontFamily: C.m, fontSize: 11 }}>
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
        <div style={{ padding: "40px 0", textAlign: "center", color: C.textSubtle, fontSize: 12 }}>
          Sin facturas registradas
        </div>
      )}
    </section>
  );
}