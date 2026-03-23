import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type LogType = "info" | "warn" | "success" | "critical";

interface AuditEntry {
  accion: string;
  actor: string;
  empresa: string;
  ip: string;
  tiempo: string;
  tipo: LogType;
}

interface EventsPoint {
  h: string;
  eventos: number;
}

const PANEL_STYLE: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid rgba(2,6,23,0.08)",
  borderRadius: 16,
  boxShadow: "0 12px 30px rgba(2,6,23,0.06)",
};

const entries: AuditEntry[] = [
  { accion: "Login Super Admin", actor: "admin@blueeye.io", empresa: "—", ip: "200.45.123.9", tiempo: "hace 6h", tipo: "info" },
  { accion: "Empresa suspendida", actor: "admin@blueeye.io", empresa: "SecureVision SRL", ip: "190.12.45.88", tiempo: "hace 2h", tipo: "warn" },
  { accion: "Plan actualizado → Pro", actor: "admin@blueeye.io", empresa: "VigiTech RD", ip: "45.230.12.3", tiempo: "hace 5h", tipo: "info" },
  { accion: "API Key regenerada", actor: "admin@blueeye.io", empresa: "—", ip: "200.45.123.9", tiempo: "hace 1d", tipo: "critical" },
  { accion: "Empresa reactivada", actor: "admin@blueeye.io", empresa: "CCTV Pro Services", ip: "190.12.45.88", tiempo: "hace 1d", tipo: "success" },
  { accion: "Cambio de rol", actor: "admin@blueeye.io", empresa: "BlueGuard Latam", ip: "181.32.44.10", tiempo: "hace 2d", tipo: "info" },
  { accion: "Intentos fallidos (rate-limit)", actor: "system", empresa: "—", ip: "186.12.11.90", tiempo: "hace 2d", tipo: "warn" },
  { accion: "Exportación de logs", actor: "admin@blueeye.io", empresa: "—", ip: "200.45.123.9", tiempo: "hace 4d", tipo: "info" },
];

const byTypeColor: Record<LogType, string> = {
  info: "#0ea5e9",
  warn: "#fbbf24",
  success: "#22d3ee",
  critical: "#ef4444",
};

const events: EventsPoint[] = [
  { h: "00", eventos: 12 },
  { h: "04", eventos: 8 },
  { h: "08", eventos: 19 },
  { h: "12", eventos: 27 },
  { h: "16", eventos: 22 },
  { h: "20", eventos: 14 },
];

interface CustomTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: Array<{ value?: number | string }>;
}

const CustomTooltip = ({ active, label, payload }: CustomTooltipProps): React.ReactElement | null => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={{ background: "#ffffff", border: "1px solid rgba(2,6,23,0.12)", borderRadius: 10, padding: "10px 14px", boxShadow: "0 16px 30px rgba(2,6,23,0.10)" }}>
      <div style={{ color: "#94a3b8", fontSize: 11 }}>Hora {String(label ?? "")}</div>
      <div style={{ color: "#0f172a", fontSize: 14, fontWeight: 900, marginTop: 4 }}>{Number(payload[0]?.value ?? 0)} eventos</div>
    </div>
  );
};

export default function SuperAdminAudit(): React.ReactElement {
  const total = 184;
  const critical = 4;
  const logins = 28;
  const changes = 12;

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>Eventos (24h)</div>
          <div style={{ color: "#0f172a", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{total}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Auditoría (mock)</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>Críticos</div>
          <div style={{ color: "#ef4444", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{critical}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Requieren atención</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>Logins</div>
          <div style={{ color: "#0ea5e9", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{logins}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Accesos (mock)</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>Cambios</div>
          <div style={{ color: "#22d3ee", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{changes}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Config y planes</div>
        </div>
      </div>

      <div style={{ ...PANEL_STYLE, padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Bitácora</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Filtros y búsqueda (UI estática)</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "9px 12px", minWidth: 250, color: "#64748b", fontSize: 12 }}>
            🔎 Buscar evento / IP / empresa…
          </div>
          <div style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "9px 12px", color: "#64748b", fontSize: 12 }}>
            Tipo: Todos
          </div>
          <button
            type="button"
            style={{
              background: "#0ea5e9",
              border: "1px solid #0ea5e9",
              color: "#ffffff",
              borderRadius: 12,
              padding: "9px 12px",
              fontSize: 12,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Exportar
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, alignItems: "start" }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {entries.map((e, i) => (
              <div
                key={`${e.accion}-${i}`}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "14px 0",
                  borderBottom: i < entries.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: byTypeColor[e.tipo], marginTop: 4, flexShrink: 0, boxShadow: `0 0 8px ${byTypeColor[e.tipo]}55` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{e.accion}</div>
                  <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#94a3b8" }}>{e.ip}</span>
                    <span style={{ color: "#334155" }}>·</span>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>{e.tiempo}</span>
                    <span style={{ color: "#334155" }}>·</span>
                    <span style={{ fontSize: 10, color: "#64748b" }}>Actor: {e.actor}</span>
                  </div>
                  {e.empresa !== "—" && <div style={{ color: "#64748b", fontSize: 11, marginTop: 6 }}>{e.empresa}</div>}
                </div>
                <span style={{ fontSize: 10, fontWeight: 900, color: byTypeColor[e.tipo], background: `${byTypeColor[e.tipo]}1A`, border: `1px solid ${byTypeColor[e.tipo]}33`, padding: "4px 10px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {e.tipo}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...PANEL_STYLE, padding: 18 }}>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Eventos por hora</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Distribución (mock)</div>
            <div style={{ marginTop: 14 }}>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={events}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(2,6,23,0.08)" />
                  <XAxis dataKey="h" stroke="rgba(2,6,23,0.20)" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(2,6,23,0.20)" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="eventos" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ ...PANEL_STYLE, padding: 18 }}>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Top acciones</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Frecuencia (mock)</div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { k: "Login", v: 28, c: "#0ea5e9" },
                { k: "Actualización plan", v: 11, c: "#22d3ee" },
                { k: "Cambios de rol", v: 6, c: "#a855f7" },
                { k: "Rate-limit", v: 4, c: "#fbbf24" },
              ].map((x) => (
                <div key={x.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{x.k}</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: x.c, fontWeight: 900 }}>{x.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
