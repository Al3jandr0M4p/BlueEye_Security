import React from "react";

const PANEL_STYLE: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid rgba(2,6,23,0.08)",
  borderRadius: 16,
  boxShadow: "0 12px 30px rgba(2,6,23,0.06)",
};

export default function SuperAdminProfile(): React.ReactElement {
  return (
    <>
      <div style={{ ...PANEL_STYLE, padding: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: -120, background: "#22d3ee", opacity: 0.05, filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: "linear-gradient(135deg,#0ea5e9,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontFamily: "'Syne',sans-serif", fontSize: 18 }}>
              SA
            </div>
            <div>
              <div style={{ color: "#0f172a", fontSize: 18, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Super Admin</div>
              <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>admin@blueeye.io · Rol: Super Admin</div>
              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { k: "Último acceso", v: "hace 6h", c: "#22d3ee" },
                  { k: "MFA", v: "ON", c: "#a855f7" },
                  { k: "Zona horaria", v: "America/Santo_Domingo", c: "#0ea5e9" },
                ].map((x) => (
                  <div key={x.k} style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.08)", borderRadius: 12, padding: "8px 10px" }}>
                    <div style={{ color: "#94a3b8", fontSize: 10, fontWeight: 900, letterSpacing: "0.10em", textTransform: "uppercase" }}>{x.k}</div>
                    <div style={{ color: x.c, fontSize: 12, fontWeight: 900, marginTop: 4, fontFamily: x.k === "Zona horaria" ? "'DM Mono',monospace" : "'Syne',sans-serif" }}>{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
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
              Editar perfil
            </button>
            <button
              type="button"
              style={{
                background: "#f8fafc",
                border: "1px solid rgba(2,6,23,0.10)",
                color: "#0f172a",
                borderRadius: 12,
                padding: "9px 12px",
                fontSize: 12,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Cambiar contraseña
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Preferencias</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Ajustes de cuenta (estático)</div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { k: "Idioma", v: "Español (RD)" },
              { k: "Tema", v: "Dark" },
              { k: "Notificaciones", v: "Activadas" },
              { k: "Formato fecha", v: "DD/MM/YYYY" },
            ].map((x) => (
              <div key={x.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(2,6,23,0.06)" }}>
                <span style={{ color: "#94a3b8", fontSize: 11 }}>{x.k}</span>
                <span style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{x.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Sesiones</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Dispositivos conectados (mock)</div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column" }}>
            {[
              { device: "Chrome · Windows", ip: "200.45.123.9", when: "Activo ahora", ok: true },
              { device: "Safari · iOS", ip: "190.12.45.88", when: "hace 2d", ok: true },
              { device: "Firefox · Linux", ip: "186.12.11.90", when: "hace 12d", ok: false },
            ].map((s, i, arr) => (
              <div key={s.device} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(2,6,23,0.06)" : "none" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.device}</div>
                  <div style={{ marginTop: 6, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#94a3b8" }}>{s.ip}</span>
                    <span style={{ color: "#334155" }}>·</span>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>{s.when}</span>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 900, color: s.ok ? "#22d3ee" : "#ef4444", background: s.ok ? "rgba(34,211,238,0.10)" : "rgba(239,68,68,0.10)", border: s.ok ? "1px solid rgba(34,211,238,0.22)" : "1px solid rgba(239,68,68,0.22)", padding: "6px 10px", borderRadius: 999, height: 28, alignSelf: "center" }}>
                  {s.ok ? "Confiable" : "Revisar"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...PANEL_STYLE, padding: 18 }}>
        <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Actividad reciente</div>
        <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Últimos eventos (mock)</div>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column" }}>
          {[
            { a: "Login exitoso", t: "hace 6h", c: "#22d3ee" },
            { a: "Exportación de auditoría", t: "hace 4d", c: "#0ea5e9" },
            { a: "Regeneración de API key", t: "hace 1d", c: "#ef4444" },
          ].map((x, i, arr) => (
            <div key={`${x.a}-${x.t}`} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(2,6,23,0.06)" : "none" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 8, height: 8, borderRadius: 999, background: x.c, marginTop: 4, boxShadow: `0 0 8px ${x.c}55` }} />
                <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{x.a}</div>
              </div>
              <div style={{ color: "#94a3b8", fontSize: 11, fontFamily: "'DM Mono',monospace" }}>{x.t}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
