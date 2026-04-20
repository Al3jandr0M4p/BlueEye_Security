import type React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PANEL_STYLE, StatCard, planBadge, stateBadge } from "./components/shared";
import { useSuperAdminBilling } from "./hooks/useSuperAdminBilling";

export default function SuperAdminBilling(): React.ReactElement {
  const { error, invoices, isLoading, mrr, overdue, pending, refunds, revenue } =
    useSuperAdminBilling();

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label="MRR" value={`$${mrr.toLocaleString()}`} sub="Ingreso recurrente mensual" accent="#a855f7" />
        <StatCard label="Pagos pendientes" value={pending} sub="Cobros por procesar" accent="#fbbf24" />
        <StatCard label="Facturas pendientes" value={overdue} sub="Pendientes en backend" accent="#ef4444" />
        <StatCard label="Reembolsos" value={refunds} sub="Sin endpoint dedicado" accent="#94a3b8" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginBottom: 12 }}>MRR · Tendencia real</div>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(2,6,23,0.08)" />
              <XAxis dataKey="mes" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="mrr" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: "#a855f7", r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>

          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 4 }}>
            {invoices.map((invoice) => (
              <div key={invoice.id} className="row-hover" style={{ display: "grid", gridTemplateColumns: "1.7fr 90px 110px 120px", gap: 12, padding: "12px 10px", borderRadius: 12, alignItems: "center" }}>
                <div>
                  <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{invoice.name}</div>
                  <div style={{ color: "#64748b", fontSize: 10, marginTop: 2 }}>Ultima actividad: {invoice.lastActivity}</div>
                </div>
                <div>{planBadge(invoice.plan as "Free" | "Starter" | "Pro" | "Enterprise")}</div>
                <div>{stateBadge(invoice.status)}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#0f172a", fontWeight: 800 }}>${invoice.estimatedMrr}</div>
              </div>
            ))}
            {!invoices.length && !isLoading && (
              <div style={{ color: "#64748b", fontSize: 12 }}>
                No hay empresas para mostrar en cartera.
              </div>
            )}
          </div>
        </div>

        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Estado de facturacion</div>
          <div style={{ color: "#64748b", fontSize: 12, marginTop: 10, lineHeight: 1.6 }}>
            Esta vista ya usa el backend real para MRR, crecimiento, pagos pendientes y empresas activas.
          </div>
          <div style={{ color: "#64748b", fontSize: 12, marginTop: 10, lineHeight: 1.6 }}>
            Lo que todavia no existe en backend es un endpoint detallado de facturas y reembolsos por empresa.
          </div>
          {error && <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 12 }}>{error}</div>}
        </div>
      </div>
    </>
  );
}
