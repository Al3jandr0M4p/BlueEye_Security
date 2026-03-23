import React from "react";

type EstadoEmpresa = "activa" | "trial" | "suspendida" | "cancelada";
type TipoPlan = "Free" | "Starter" | "Pro" | "Enterprise";

interface CompanyRow {
  id: number;
  name: string;
  admin: string;
  plan: TipoPlan;
  estado: EstadoEmpresa;
  uso: number;
  mrr: number;
  ultimaActividad: string;
}

const PANEL_STYLE: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid rgba(2,6,23,0.08)",
  borderRadius: 16,
  boxShadow: "0 12px 30px rgba(2,6,23,0.06)",
};

const companies: CompanyRow[] = [
  { id: 1, name: "VigiTech RD", admin: "Carlos Méndez", plan: "Pro", estado: "activa", uso: 68, mrr: 299, ultimaActividad: "hace 2h" },
  { id: 2, name: "SafeEye Solutions", admin: "María López", plan: "Starter", estado: "trial", uso: 23, mrr: 0, ultimaActividad: "hace 5h" },
  { id: 3, name: "CCTV Pro Services", admin: "Pedro Ruiz", plan: "Enterprise", estado: "activa", uso: 91, mrr: 899, ultimaActividad: "hace 1d" },
  { id: 4, name: "SecureVision SRL", admin: "Ana Torres", plan: "Free", estado: "suspendida", uso: 100, mrr: 0, ultimaActividad: "hace 2d" },
  { id: 5, name: "Instalaciones 360", admin: "Luis Herrera", plan: "Starter", estado: "activa", uso: 45, mrr: 99, ultimaActividad: "hace 3d" },
  { id: 6, name: "BlueGuard Latam", admin: "Sofía Peña", plan: "Pro", estado: "activa", uso: 74, mrr: 299, ultimaActividad: "hace 4d" },
  { id: 7, name: "VisionPoint Group", admin: "Javier Ortiz", plan: "Enterprise", estado: "activa", uso: 39, mrr: 899, ultimaActividad: "hace 6d" },
  { id: 8, name: "OmniSecure", admin: "Paula Reyes", plan: "Free", estado: "cancelada", uso: 0, mrr: 0, ultimaActividad: "hace 12d" },
];

const estadoBadge = (estado: EstadoEmpresa): React.ReactElement => {
  const map: Record<EstadoEmpresa, { bg: string; color: string; label: string }> = {
    activa: { bg: "rgba(34,211,238,0.12)", color: "#22d3ee", label: "Activa" },
    trial: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", label: "Trial" },
    suspendida: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", label: "Suspendida" },
    cancelada: { bg: "rgba(100,116,139,0.2)", color: "#94a3b8", label: "Cancelada" },
  };
  const s = map[estado];
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
      {s.label}
    </span>
  );
};

const planBadge = (plan: TipoPlan): React.ReactElement => {
  const map: Record<TipoPlan, string> = {
    Free: "#94a3b8",
    Starter: "#0ea5e9",
    Pro: "#06b6d4",
    Enterprise: "#a855f7",
  };
  return <span style={{ color: map[plan], fontWeight: 800, fontSize: 12 }}>{plan}</span>;
};

function UsageBar({ pct }: { pct: number }): React.ReactElement {
  const barColor = pct >= 90 ? "#ef4444" : pct >= 70 ? "#fbbf24" : "#22d3ee";
  return (
    <div style={{ background: "rgba(2,6,23,0.08)", borderRadius: 99, height: 6, width: "100%", overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 99 }} />
    </div>
  );
}

export default function SuperAdminCompanies(): React.ReactElement {
  const total = companies.length;
  const activas = companies.filter((c) => c.estado === "activa").length;
  const trial = companies.filter((c) => c.estado === "trial").length;
  const suspendidas = companies.filter((c) => c.estado === "suspendida").length;

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700 }}>Empresas</div>
          <div style={{ color: "#0f172a", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{total}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Cuentas registradas (mock)</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700 }}>Activas</div>
          <div style={{ color: "#22d3ee", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{activas}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Operando normalmente</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700 }}>Trials</div>
          <div style={{ color: "#fbbf24", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{trial}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Pendientes de conversión</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700 }}>Suspendidas</div>
          <div style={{ color: "#ef4444", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{suspendidas}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Revisión requerida</div>
        </div>
      </div>

      <div style={{ ...PANEL_STYLE, padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>Listado de Empresas</div>
          <div style={{ color: "#475569", fontSize: 11, marginTop: 3 }}>Búsqueda y filtros (UI estática)</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "9px 12px", minWidth: 240, color: "#64748b", fontSize: 12 }}>
            🔎 Buscar empresa / admin…
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
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            + Nueva
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, alignItems: "start" }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.6fr 80px 95px 160px 70px", gap: 12, padding: "8px 10px", marginBottom: 6 }}>
            {["Empresa", "Admin", "Plan", "Estado", "Uso", "MRR"].map((h) => (
              <div key={h} style={{ fontSize: 10, color: "#64748b", fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase" }}>
                {h}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {companies.map((c) => (
              <div
                key={c.id}
                className="row-hover"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.6fr 80px 95px 160px 70px",
                  gap: 12,
                  padding: "12px 10px",
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                  <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>Última actividad: {c.ultimaActividad}</div>
                </div>
                <div style={{ color: "#94a3b8", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.admin}</div>
                <div>{planBadge(c.plan)}</div>
                <div>{estadoBadge(c.estado)}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b", fontSize: 10 }}>Consumo</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: c.uso >= 90 ? "#ef4444" : c.uso >= 70 ? "#fbbf24" : "#22d3ee" }}>{c.uso}%</span>
                  </div>
                  <UsageBar pct={c.uso} />
                </div>
                <div style={{ fontFamily: "'DM Mono',monospace", color: c.mrr > 0 ? "#0f172a" : "#64748b", fontSize: 12, fontWeight: 800 }}>
                  {c.mrr > 0 ? `$${c.mrr}` : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...PANEL_STYLE, padding: 18 }}>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Alertas</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Cuentas cerca del límite (mock)</div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {companies
                .filter((c) => c.uso >= 85)
                .slice(0, 4)
                .map((c) => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                      <div style={{ color: "#64748b", fontSize: 10, marginTop: 2 }}>Uso alto · {c.uso}%</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#fbbf24", background: "rgba(251,191,36,0.10)", border: "1px solid rgba(251,191,36,0.22)", padding: "4px 10px", borderRadius: 999 }}>
                      Revisar
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div style={{ ...PANEL_STYLE, padding: 18 }}>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Acciones rápidas</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Atajos (estáticos)</div>
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {[
                { icon: "✉️", title: "Enviar email", desc: "Notificar a admins" },
                { icon: "🔒", title: "Suspender", desc: "Bloquear temporalmente" },
                { icon: "🧾", title: "Ver facturas", desc: "Historial de pagos" },
                { icon: "🛠️", title: "Soporte", desc: "Crear ticket interno" },
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
