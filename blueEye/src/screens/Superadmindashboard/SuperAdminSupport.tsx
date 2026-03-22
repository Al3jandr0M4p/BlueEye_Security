import React from "react";

type TicketStatus = "open" | "pending" | "closed" | "escalated";
type TicketPriority = "low" | "medium" | "high" | "urgent";

interface TicketRow {
  id: string;
  asunto: string;
  empresa: string;
  status: TicketStatus;
  prioridad: TicketPriority;
  actualizado: string;
  asignadoA: string;
}

const PANEL_STYLE: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid rgba(2,6,23,0.08)",
  borderRadius: 16,
  boxShadow: "0 12px 30px rgba(2,6,23,0.06)",
};

const tickets: TicketRow[] = [
  { id: "SUP-2311", asunto: "Cámaras no sincronizan", empresa: "CCTV Pro Services", status: "open", prioridad: "urgent", actualizado: "hace 12m", asignadoA: "Alejandro" },
  { id: "SUP-2312", asunto: "Error al facturar", empresa: "BlueGuard Latam", status: "pending", prioridad: "high", actualizado: "hace 2h", asignadoA: "Sebastián" },
  { id: "SUP-2313", asunto: "Solicitud de upgrade", empresa: "VigiTech RD", status: "open", prioridad: "medium", actualizado: "hace 5h", asignadoA: "—" },
  { id: "SUP-2314", asunto: "Restablecer acceso admin", empresa: "SecureVision SRL", status: "escalated", prioridad: "high", actualizado: "hace 1d", asignadoA: "Ryan" },
  { id: "SUP-2315", asunto: "Latencia en dashboard", empresa: "VisionPoint Group", status: "open", prioridad: "low", actualizado: "hace 2d", asignadoA: "—" },
  { id: "SUP-2316", asunto: "Reembolso solicitado", empresa: "SafeEye Solutions", status: "closed", prioridad: "medium", actualizado: "hace 6d", asignadoA: "María" },
];

const statusBadge = (s: TicketStatus): React.ReactElement => {
  const map: Record<TicketStatus, { label: string; bg: string; color: string }> = {
    open: { label: "Abierto", bg: "rgba(34,211,238,0.12)", color: "#22d3ee" },
    pending: { label: "Pendiente", bg: "rgba(251,191,36,0.12)", color: "#fbbf24" },
    escalated: { label: "Escalado", bg: "rgba(239,68,68,0.12)", color: "#ef4444" },
    closed: { label: "Cerrado", bg: "rgba(100,116,139,0.20)", color: "#94a3b8" },
  };
  const v = map[s];
  return (
    <span style={{ background: v.bg, color: v.color, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 900, letterSpacing: "0.04em", textTransform: "uppercase" }}>
      {v.label}
    </span>
  );
};

const priorityBadge = (p: TicketPriority): React.ReactElement => {
  const map: Record<TicketPriority, { label: string; color: string; bg: string }> = {
    low: { label: "Baja", color: "#94a3b8", bg: "rgba(100,116,139,0.20)" },
    medium: { label: "Media", color: "#0ea5e9", bg: "rgba(14,165,233,0.12)" },
    high: { label: "Alta", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
    urgent: { label: "Urgente", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  };
  const v = map[p];
  return (
    <span style={{ background: v.bg, color: v.color, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 900, letterSpacing: "0.04em", textTransform: "uppercase" }}>
      {v.label}
    </span>
  );
};

export default function SuperAdminSupport(): React.ReactElement {
  const open = tickets.filter((t) => t.status === "open").length;
  const urgent = tickets.filter((t) => t.prioridad === "urgent").length;
  const slaRisk = 3;
  const avgResponse = "18m";

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>Abiertos</div>
          <div style={{ color: "#22d3ee", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{open}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Tickets activos (mock)</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>Urgentes</div>
          <div style={{ color: "#ef4444", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{urgent}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Prioridad crítica</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>SLA en riesgo</div>
          <div style={{ color: "#fbbf24", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{slaRisk}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Revisar asignación</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>Respuesta</div>
          <div style={{ color: "#a855f7", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{avgResponse}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Promedio (mock)</div>
        </div>
      </div>

      <div style={{ ...PANEL_STYLE, padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Bandeja de soporte</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Filtros y búsqueda (UI estática)</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "9px 12px", minWidth: 260, color: "#64748b", fontSize: 12 }}>
            🔎 Buscar ticket / empresa…
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
            + Nuevo ticket
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, alignItems: "start" }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "110px 2fr 1.2fr 110px 110px 110px", gap: 12, padding: "8px 10px", marginBottom: 6 }}>
            {["ID", "Asunto", "Empresa", "Estado", "Prioridad", "Asignado"].map((h) => (
              <div key={h} style={{ fontSize: 10, color: "#64748b", fontWeight: 900, letterSpacing: "0.10em", textTransform: "uppercase" }}>
                {h}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {tickets.map((t) => (
              <div
                key={t.id}
                className="row-hover"
                style={{
                  display: "grid",
                  gridTemplateColumns: "110px 2fr 1.2fr 110px 110px 110px",
                  gap: 12,
                  padding: "12px 10px",
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#94a3b8" }}>{t.id}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.asunto}</div>
                  <div style={{ color: "#64748b", fontSize: 10, marginTop: 2 }}>Actualizado: {t.actualizado}</div>
                </div>
                <div style={{ color: "#94a3b8", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.empresa}</div>
                <div>{statusBadge(t.status)}</div>
                <div>{priorityBadge(t.prioridad)}</div>
                <div style={{ color: "#64748b", fontSize: 11, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.asignadoA}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...PANEL_STYLE, padding: 18 }}>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Canales</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Volumen (mock)</div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { k: "Email", pct: 58, c: "#22d3ee" },
                { k: "Chat", pct: 27, c: "#0ea5e9" },
                { k: "Teléfono", pct: 15, c: "#fbbf24" },
              ].map((x) => (
                <div key={x.k}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{x.k}</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#94a3b8" }}>{x.pct}%</span>
                  </div>
                  <div style={{ background: "rgba(2,6,23,0.08)", borderRadius: 99, height: 6, overflow: "hidden" }}>
                    <div style={{ width: `${x.pct}%`, height: "100%", background: x.c, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...PANEL_STYLE, padding: 18 }}>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Sugerencias</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Playbooks (estático)</div>
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {[
                { icon: "🧠", title: "Crear macro", desc: "Respuestas rápidas" },
                { icon: "📚", title: "Actualizar KB", desc: "Artículos y guías" },
                { icon: "⏱️", title: "SLA", desc: "Monitorear vencimientos" },
                { icon: "🔁", title: "Automatizar", desc: "Asignación por prioridad" },
              ].map((a) => (
                <div key={a.title} className="nav-item" style={{ background: "rgba(14,165,233,0.04)", border: "1px solid rgba(2,6,23,0.08)", borderRadius: 12, padding: "12px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{a.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{a.title}</div>
                    <div style={{ color: "#64748b", fontSize: 10, marginTop: 2 }}>{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
