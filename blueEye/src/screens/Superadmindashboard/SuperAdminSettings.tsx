import React from "react";

const PANEL_STYLE: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid rgba(2,6,23,0.08)",
  borderRadius: 16,
  boxShadow: "0 12px 30px rgba(2,6,23,0.06)",
};

function Toggle({ on }: { on: boolean }): React.ReactElement {
  return (
    <div
      style={{
        width: 44,
        height: 24,
        borderRadius: 999,
        background: on ? "rgba(14,165,233,0.18)" : "rgba(2,6,23,0.06)",
        border: on ? "1px solid rgba(14,165,233,0.30)" : "1px solid rgba(2,6,23,0.10)",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          background: on ? "#22d3ee" : "#94a3b8",
          position: "absolute",
          top: 2,
          left: on ? 22 : 2,
          transition: "left 0.2s ease",
          boxShadow: on ? "0 0 12px rgba(34,211,238,0.35)" : "none",
        }}
      />
    </div>
  );
}

function SettingRow({
  title,
  desc,
  right,
}: {
  title: string;
  desc: string;
  right: React.ReactNode;
}): React.ReactElement {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "12px 0", borderBottom: "1px solid rgba(2,6,23,0.06)", alignItems: "center" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{title}</div>
        <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>{desc}</div>
      </div>
      {right}
    </div>
  );
}

export default function SuperAdminSettings(): React.ReactElement {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Seguridad</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Políticas globales (estático)</div>
          <div style={{ marginTop: 14 }}>
            <SettingRow title="MFA obligatorio" desc="Requerir autenticación de dos factores para roles sensibles." right={<Toggle on={true} />} />
            <SettingRow title="Bloqueo por intentos" desc="Rate-limit + lockout tras múltiples fallos." right={<Toggle on={true} />} />
            <SettingRow title="Permitir IPs desconocidas" desc="Si está apagado, se restringe por lista blanca." right={<Toggle on={false} />} />
            <SettingRow title="Sesiones concurrentes" desc="Limitar sesiones por usuario para reducir riesgo." right={<Toggle on={true} />} />
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
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
              Guardar
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
              Restablecer
            </button>
          </div>
        </div>

        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Notificaciones</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Canales y alertas (estático)</div>
          <div style={{ marginTop: 14 }}>
            <SettingRow title="Email de eventos críticos" desc="Enviar alertas por correo ante incidentes." right={<Toggle on={true} />} />
            <SettingRow title="Digest semanal" desc="Resumen de auditoría, tickets y facturación." right={<Toggle on={true} />} />
            <SettingRow title="Webhooks" desc="Emitir eventos a integraciones externas." right={<Toggle on={false} />} />
            <SettingRow title="Notificaciones in-app" desc="Indicadores y badges en el panel." right={<Toggle on={true} />} />
          </div>
        </div>

        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Facturación</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Cobros y cumplimiento (estático)</div>
          <div style={{ marginTop: 14 }}>
            <SettingRow title="Cobro automático" desc="Intentar cobro en fecha de vencimiento." right={<Toggle on={true} />} />
            <SettingRow title="Recordatorios" desc="Enviar emails antes y después del vencimiento." right={<Toggle on={true} />} />
            <SettingRow title="Impuestos" desc="Aplicar taxes según región (no configurado)." right={<Toggle on={false} />} />
            <SettingRow title="Reintentos" desc="Cantidad de reintentos de pago antes de suspender." right={<span style={{ fontFamily: "'DM Mono',monospace", color: "#0f172a", fontSize: 12, fontWeight: 900 }}>3</span>} />
          </div>
        </div>

        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Branding</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Identidad visual (estático)</div>
          <div style={{ marginTop: 14 }}>
            <SettingRow title="Tema oscuro" desc="Activar por defecto en dashboards." right={<Toggle on={true} />} />
            <SettingRow title="Logo en reportes" desc="Incluir marca BlueEye en PDFs." right={<Toggle on={true} />} />
            <SettingRow title="Nombre de producto" desc="Mostrar “BlueEye Security Platform”." right={<Toggle on={true} />} />
          </div>
        </div>
      </div>

      <div style={{ ...PANEL_STYLE, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>API Keys</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>Gestión de llaves (estático)</div>
          </div>
          <button
            type="button"
            style={{
              background: "rgba(239,68,68,0.10)",
              border: "1px solid rgba(239,68,68,0.22)",
              color: "#fecaca",
              borderRadius: 12,
              padding: "9px 12px",
              fontSize: 12,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Regenerar
          </button>
        </div>

        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { name: "Public key", value: "pk_live_••••••••••••••••••••••••" },
            { name: "Secret key", value: "sk_live_••••••••••••••••••••••••" },
          ].map((k) => (
            <div key={k.name} style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.08)", borderRadius: 12, padding: 14 }}>
              <div style={{ color: "#94a3b8", fontSize: 10, fontWeight: 900, letterSpacing: "0.10em", textTransform: "uppercase" }}>{k.name}</div>
              <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{k.value}</div>
                <button
                  type="button"
                  className="nav-item"
                  style={{
                    background: "rgba(34,211,238,0.08)",
                    border: "1px solid rgba(34,211,238,0.18)",
                    color: "#22d3ee",
                    borderRadius: 10,
                    padding: "6px 10px",
                    fontSize: 12,
                    fontWeight: 900,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  Copiar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
