import React from "react";

type PlanId = "free" | "starter" | "pro" | "enterprise";

interface PlanTier {
  id: PlanId;
  name: string;
  price: string;
  accent: string;
  popular?: boolean;
  limits: Array<{ k: string; v: string }>;
  features: string[];
}

const PANEL_STYLE: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid rgba(2,6,23,0.08)",
  borderRadius: 16,
  boxShadow: "0 12px 30px rgba(2,6,23,0.06)",
};

const plans: PlanTier[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    accent: "#94a3b8",
    limits: [
      { k: "Cámaras", v: "2" },
      { k: "Usuarios", v: "3" },
      { k: "Retención", v: "7 días" },
    ],
    features: ["Dashboard básico", "Notificaciones", "1 ubicación", "Soporte comunitario"],
  },
  {
    id: "starter",
    name: "Starter",
    price: "$99",
    accent: "#0ea5e9",
    limits: [
      { k: "Cámaras", v: "10" },
      { k: "Usuarios", v: "15" },
      { k: "Retención", v: "30 días" },
    ],
    features: ["Alertas avanzadas", "Exportación de eventos", "2 ubicaciones", "Soporte estándar"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$299",
    accent: "#06b6d4",
    popular: true,
    limits: [
      { k: "Cámaras", v: "35" },
      { k: "Usuarios", v: "50" },
      { k: "Retención", v: "90 días" },
    ],
    features: ["Automatizaciones", "Roles y permisos", "Integraciones", "Soporte prioritario"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$899",
    accent: "#a855f7",
    limits: [
      { k: "Cámaras", v: "Ilimitado" },
      { k: "Usuarios", v: "Ilimitado" },
      { k: "Retención", v: "365 días" },
    ],
    features: ["SAML/SSO", "SLA dedicado", "Ambientes", "Soporte 24/7"],
  },
];

export default function SuperAdminPlans(): React.ReactElement {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 800 }}>Planes</div>
          <div style={{ color: "#0f172a", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>{plans.length}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Tiers configurados (mock)</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 800 }}>Más usado</div>
          <div style={{ color: "#06b6d4", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>Pro</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Preferencia de mercado</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 800 }}>ARPA</div>
          <div style={{ color: "#a855f7", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>$267</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Ingreso promedio por cuenta</div>
        </div>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 800 }}>Upsell</div>
          <div style={{ color: "#22d3ee", fontSize: 30, fontWeight: 900, fontFamily: "'Syne',sans-serif", marginTop: 6 }}>+8%</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Conversión mensual (mock)</div>
        </div>
      </div>

      <div style={{ ...PANEL_STYLE, padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Catálogo de Planes</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Pantalla estática · cambios no persistentes</div>
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
          Guardar cambios
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {plans.map((p) => (
          <div key={p.id} style={{ ...PANEL_STYLE, padding: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: -60, background: p.accent, opacity: 0.05, filter: "blur(40px)", pointerEvents: "none" }} />

            <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ color: "#0f172a", fontSize: 16, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>{p.name}</div>
                  {p.popular && (
                    <span style={{ fontSize: 10, fontWeight: 900, color: "#22d3ee", background: "rgba(34,211,238,0.10)", border: "1px solid rgba(34,211,238,0.22)", padding: "3px 8px", borderRadius: 999, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Popular
                    </span>
                  )}
                </div>
                <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ color: p.accent, fontSize: 26, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>{p.price}</span>
                  <span style={{ color: "#64748b", fontSize: 11 }}>/ mes</span>
                </div>
              </div>
              <button
                type="button"
                className="nav-item"
                style={{
                  position: "relative",
                  background: "#f8fafc",
                  border: "1px solid rgba(2,6,23,0.10)",
                  color: "#0f172a",
                  borderRadius: 12,
                  padding: "8px 10px",
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Editar
              </button>
            </div>

            <div style={{ position: "relative", marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {p.limits.map((l) => (
                <div key={l.k} style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.08)", padding: "6px 10px", borderRadius: 12 }}>
                  <div style={{ color: "#94a3b8", fontSize: 10, fontWeight: 900, letterSpacing: "0.10em", textTransform: "uppercase" }}>{l.k}</div>
                  <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900, marginTop: 2 }}>{l.v}</div>
                </div>
              ))}
            </div>

            <div style={{ position: "relative", marginTop: 16 }}>
              <div style={{ color: "#94a3b8", fontSize: 10, fontWeight: 900, letterSpacing: "0.10em", textTransform: "uppercase" }}>Incluye</div>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {p.features.map((f) => (
                  <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: p.accent, fontSize: 14, lineHeight: "14px" }}>●</span>
                    <span style={{ color: "#334155", fontSize: 12 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...PANEL_STYLE, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Matriz de Features</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Vista rápida (mock)</div>
          </div>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#475569" }}>v0</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr repeat(4, 1fr)", gap: 10, padding: "10px 12px", borderRadius: 12, background: "#f8fafc", border: "1px solid rgba(2,6,23,0.08)" }}>
          {["Feature", "Free", "Starter", "Pro", "Enterprise"].map((h) => (
            <div key={h} style={{ fontSize: 10, color: "#64748b", fontWeight: 900, letterSpacing: "0.10em", textTransform: "uppercase" }}>
              {h}
            </div>
          ))}

          {[
            { f: "Exportación de eventos", v: ["—", "✔", "✔", "✔"] },
            { f: "Roles y permisos", v: ["—", "—", "✔", "✔"] },
            { f: "Integraciones", v: ["—", "—", "✔", "✔"] },
            { f: "SAML/SSO", v: ["—", "—", "—", "✔"] },
            { f: "SLA dedicado", v: ["—", "—", "—", "✔"] },
          ].map((row) => (
            <React.Fragment key={row.f}>
              <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 800, padding: "10px 0" }}>{row.f}</div>
              {row.v.map((x, i) => (
                <div key={`${row.f}-${i}`} style={{ color: x === "✔" ? "#22d3ee" : "#475569", fontSize: 12, fontWeight: 900, padding: "10px 0" }}>
                  {x}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
