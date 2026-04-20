import type React from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  PANEL_STYLE,
  StatCard,
  UsageBar,
  logBullet,
  planBadge,
  stateBadge,
} from "./components/shared";
import { useSuperAdminDashboard } from "./hooks/useSuperAdminDashboard";

function CustomTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string | number;
  payload?: Array<{ color?: string; name?: string; value?: number | string }>;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div style={{ background: "#ffffff", border: "1px solid rgba(2,6,23,0.12)", borderRadius: 10, padding: "10px 16px", boxShadow: "0 16px 30px rgba(2,6,23,0.10)" }}>
      <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 4 }}>{String(label ?? "")}</p>
      {payload.map((item, index) => (
        <p key={`${item.name}-${index}`} style={{ color: item.color ?? "#0f172a", fontSize: 13, fontWeight: 800, margin: 0 }}>
          {item.name === "ingresos" ? "$" : ""}
          {Number(item.value ?? 0).toLocaleString()} {item.name}
        </p>
      ))}
    </div>
  );
}

export default function SuperAdminDashboard(): React.ReactElement {
  const navigate = useNavigate();
  const {
    auditLog,
    error,
    growthData,
    isLoading,
    planData,
    quickActions,
    recentCompanies,
    stats,
  } = useSuperAdminDashboard();

  const totalCompanies =
    stats.activeBusiness + stats.businessInFree + stats.disabledBusiness;

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard
          icon="🏢"
          label="Empresas activas"
          value={stats.activeBusiness}
          sub={`${stats.businessInFree} en free · ${stats.disabledBusiness} suspendidas`}
        />
        <StatCard
          icon="💰"
          label="MRR"
          value={`$${stats.mrr.toLocaleString()}`}
          sub="Ingresos recurrentes"
          accent="#a855f7"
        />
        <StatCard
          icon="⚠️"
          label="Pagos pendientes"
          value={stats.pendingPayment}
          sub={`${stats.pendingInvoices} facturas por revisar`}
          accent="#fbbf24"
        />
        <StatCard
          icon="🎫"
          label="Tickets abiertos"
          value={stats.openTickets}
          sub={`${stats.unAssignedTickets} sin asignar`}
          accent="#ef4444"
        />
      </div>

      {error && (
        <div style={{ ...PANEL_STYLE, padding: 18, color: "#b91c1c", fontSize: 13, fontWeight: 700 }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", gap: 16 }}>
        <div style={{ ...PANEL_STYLE, padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#0f172a", fontSize: 14 }}>Crecimiento de Empresas</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>Datos reales del backend</div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorE" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(2,6,23,0.08)" />
              <XAxis dataKey="mes" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="empresas" name="empresas" stroke="#22d3ee" strokeWidth={2} fill="url(#colorE)" dot={{ fill: "#22d3ee", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...PANEL_STYLE, padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#0f172a", fontSize: 14 }}>Ingresos por Suscripcion</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>USD · Datos agregados</div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(2,6,23,0.08)" />
              <XAxis dataKey="mes" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="ingresos" name="ingresos" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: "#a855f7", r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...PANEL_STYLE, padding: 24 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#0f172a", fontSize: 14, marginBottom: 4 }}>Distribucion por Plan</div>
          <div style={{ color: "#64748b", fontSize: 11, marginBottom: 16 }}>{totalCompanies} empresas registradas</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PieChart width={140} height={140}>
              <Pie data={planData} cx={65} cy={65} innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value">
                {planData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16 }}>
        <div style={{ ...PANEL_STYLE, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#0f172a", fontSize: 14 }}>Empresas Recientes</div>
              <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>Tomadas del backend</div>
            </div>
            <button type="button" onClick={() => navigate("/super/admin/companies")} style={{ fontSize: 11, color: "#0ea5e9", background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.18)", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontWeight: 600 }}>Ver todas →</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 80px 80px 120px 60px", gap: 12, padding: "6px 12px", marginBottom: 4 }}>
            {["Empresa", "Admin", "Plan", "Estado", "Uso", "Reg."].map((h) => (
              <div key={h} style={{ fontSize: 10, color: "#64748b", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {recentCompanies.map((company) => (
              <div key={company.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 80px 80px 120px 60px", gap: 12, padding: "10px 12px", borderRadius: 10, alignItems: "center" }}>
                <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900 }}>{company.name}</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>{company.admin}</div>
                <div>{planBadge(company.plan)}</div>
                <div>{stateBadge(company.estado)}</div>
                <div><UsageBar pct={company.uso} /></div>
                <div style={{ color: "#64748b", fontSize: 11 }}>{company.fecha}</div>
              </div>
            ))}
            {!recentCompanies.length && !isLoading && (
              <div style={{ color: "#64748b", fontSize: 12, padding: "10px 12px" }}>
                No hay empresas recientes para mostrar.
              </div>
            )}
          </div>
        </div>

        <div style={{ ...PANEL_STYLE, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#0f172a", fontSize: 14 }}>Bitacora de Eventos</div>
              <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>Ultimas acciones criticas</div>
            </div>
            <button type="button" onClick={() => navigate("/super/admin/audit")} style={{ fontSize: 11, color: "#0ea5e9", background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.18)", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontWeight: 600 }}>Full log →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {auditLog.map((log, index) => (
              <div key={`${log.accion}-${index}`} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: index < auditLog.length - 1 ? "1px solid rgba(2,6,23,0.06)" : "none", alignItems: "flex-start" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: logBullet(log.tipo), marginTop: 4, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{log.accion}</div>
                  {log.empresa !== "-" && <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{log.empresa}</div>}
                  <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#64748b" }}>{log.ip}</span>
                    <span style={{ fontSize: 10, color: "#64748b" }}>{log.tiempo}</span>
                  </div>
                </div>
              </div>
            ))}
            {!auditLog.length && !isLoading && (
              <div style={{ color: "#64748b", fontSize: 12 }}>
                No hay eventos recientes.
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {quickActions.map((action) => (
          <div key={action.label} onClick={() => navigate(action.to)} style={{ background: "rgba(14,165,233,0.04)", border: "1px solid rgba(2,6,23,0.08)", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
            <span style={{ fontSize: 22 }}>{action.icon}</span>
            <div>
              <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900 }}>{action.label}</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>{action.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
