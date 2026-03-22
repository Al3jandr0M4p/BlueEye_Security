import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type InvoiceStatus = "paid" | "due" | "overdue" | "refunded";

interface RevenuePoint {
  mes: string;
  mrr: number;
}

interface InvoiceRow {
  id: string;
  empresa: string;
  monto: number;
  status: InvoiceStatus;
  metodo: string;
  fecha: string;
}

const PANEL_STYLE: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid rgba(2,6,23,0.08)",
  borderRadius: 16,
  boxShadow: "0 12px 30px rgba(2,6,23,0.06)",
};

const revenue: RevenuePoint[] = [
  { mes: "Ago", mrr: 9800 },
  { mes: "Sep", mrr: 11200 },
  { mes: "Oct", mrr: 12600 },
  { mes: "Nov", mrr: 13450 },
  { mes: "Dic", mrr: 14100 },
  { mes: "Ene", mrr: 12600 },
  { mes: "Feb", mrr: 14400 },
];

const invoices: InvoiceRow[] = [
  { id: "INV-1092", empresa: "CCTV Pro Services", monto: 899, status: "paid", metodo: "Visa •••• 1244", fecha: "2026-02-28" },
  { id: "INV-1093", empresa: "VigiTech RD", monto: 299, status: "paid", metodo: "Stripe", fecha: "2026-02-27" },
  { id: "INV-1094", empresa: "BlueGuard Latam", monto: 299, status: "due", metodo: "ACH", fecha: "2026-03-05" },
  { id: "INV-1095", empresa: "Instalaciones 360", monto: 99, status: "paid", metodo: "Mastercard •••• 4410", fecha: "2026-02-25" },
  { id: "INV-1096", empresa: "SecureVision SRL", monto: 199, status: "overdue", metodo: "—", fecha: "2026-02-15" },
  { id: "INV-1097", empresa: "VisionPoint Group", monto: 899, status: "paid", metodo: "Wire", fecha: "2026-02-20" },
  { id: "INV-1098", empresa: "SafeEye Solutions", monto: 99, status: "refunded", metodo: "Visa •••• 9931", fecha: "2026-02-12" },
];

const statusBadge = (s: InvoiceStatus): React.ReactElement => {
  const map: Record<InvoiceStatus, { label: string; bg: string; color: string }> = {
    paid: { label: "Pagada", bg: "rgba(34,211,238,0.12)", color: "#22d3ee" },
    due: { label: "Pendiente", bg: "rgba(251,191,36,0.12)", color: "#fbbf24" },
    overdue: { label: "Vencida", bg: "rgba(239,68,68,0.12)", color: "#ef4444" },
    refunded: { label: "Reembolso", bg: "rgba(100,116,139,0.20)", color: "#94a3b8" },
  };
  const v = map[s];
  return (
    <span style={{ background: v.bg, color: v.color, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 900, letterSpacing: "0.04em", textTransform: "uppercase" }}>
      {v.label}
    </span>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: Array<{ value?: number | string }>;
}

const CustomTooltip = ({ active, label, payload }: CustomTooltipProps): React.ReactElement | null => {
  if (!active || !payload || payload.length === 0) return null;
  const v = Number(payload[0]?.value ?? 0);
  return (
    <div style={{ background: "#ffffff", border: "1px solid rgba(2,6,23,0.12)", borderRadius: 10, padding: "10px 14px", boxShadow: "0 16px 30px rgba(2,6,23,0.10)" }}>
      <div style={{ color: "#94a3b8", fontSize: 11 }}>{String(label ?? "")}</div>
      <div style={{ color: "#0f172a", fontSize: 14, fontWeight: 900, marginTop: 4 }}>${v.toLocaleString()}</div>
    </div>
  );
};

export default function SuperAdminBilling(): React.ReactElement {
  const mrr = 14400;
  const pending = 3200;
  const overdue = 8;
  const refunds = 1;

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>MRR</div>
          <div style={{ color: "#a855f7", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>${mrr.toLocaleString()}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Ingreso recurrente mensual</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>Pendiente</div>
          <div style={{ color: "#fbbf24", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>${pending.toLocaleString()}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Por cobrar (mock)</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>Vencidas</div>
          <div style={{ color: "#ef4444", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{overdue}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Facturas fuera de SLA</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>Reembolsos</div>
          <div style={{ color: "#94a3b8", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{refunds}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Últimos 30 días (mock)</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...PANEL_STYLE, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>MRR · Tendencia</div>
                <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Últimos 7 meses (mock)</div>
              </div>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#a855f7", fontWeight: 900 }}>${mrr.toLocaleString()}</span>
            </div>
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(2,6,23,0.08)" />
                <XAxis dataKey="mes" stroke="rgba(2,6,23,0.20)" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(2,6,23,0.20)" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="mrr" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: "#a855f7", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ ...PANEL_STYLE, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Facturas recientes</div>
                <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Pagos y vencimientos (mock)</div>
              </div>
              <button
                type="button"
                style={{
                  background: "#0ea5e9",
                  border: "1px solid #0ea5e9",
                  color: "#ffffff",
                  borderRadius: 12,
                  padding: "8px 10px",
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Exportar
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "120px 1.8fr 90px 110px 120px", gap: 12, padding: "8px 10px", marginBottom: 6 }}>
              {["ID", "Empresa", "Monto", "Estado", "Método"].map((h) => (
                <div key={h} style={{ fontSize: 10, color: "#64748b", fontWeight: 900, letterSpacing: "0.10em", textTransform: "uppercase" }}>
                  {h}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {invoices.map((inv) => (
                <div key={inv.id} className="row-hover" style={{ display: "grid", gridTemplateColumns: "120px 1.8fr 90px 110px 120px", gap: 12, padding: "12px 10px", borderRadius: 12, alignItems: "center" }}>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#94a3b8" }}>{inv.id}</div>
                  <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{inv.empresa}</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#0f172a", fontWeight: 800 }}>${inv.monto}</div>
                  <div>{statusBadge(inv.status)}</div>
                  <div style={{ color: "#64748b", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{inv.metodo}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...PANEL_STYLE, padding: 18 }}>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Métodos de pago</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Distribución (mock)</div>

            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Tarjeta", pct: 62, color: "#22d3ee" },
                { label: "ACH / Transferencia", pct: 24, color: "#a855f7" },
                { label: "Wire", pct: 14, color: "#fbbf24" },
              ].map((m) => (
                <div key={m.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{m.label}</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#94a3b8" }}>{m.pct}%</span>
                  </div>
                  <div style={{ background: "rgba(2,6,23,0.08)", borderRadius: 99, height: 6, overflow: "hidden" }}>
                    <div style={{ width: `${m.pct}%`, height: "100%", background: m.color, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...PANEL_STYLE, padding: 18 }}>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Notas</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Controles (estático)</div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { k: "Cobro automático", v: "Activo" },
                { k: "Moneda base", v: "USD" },
                { k: "Impuestos", v: "No configurado" },
                { k: "Recordatorios", v: "3 intentos" },
              ].map((x) => (
                <div key={x.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#94a3b8", fontSize: 11 }}>{x.k}</span>
                  <span style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{x.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
