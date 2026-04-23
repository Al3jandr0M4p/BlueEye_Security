import type React from "react";
import { PANEL_STYLE } from "./components/shared";
import { useSuperAdminProfile } from "./hooks/useSuperAdminProfile";

export default function SuperAdminProfile(): React.ReactElement {
  const { activity, email, role, sessions, username } = useSuperAdminProfile();

  return (
    <>
      <div style={{ ...PANEL_STYLE, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: "linear-gradient(135deg,#0ea5e9,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontFamily: "'Syne',sans-serif", fontSize: 18 }}>
              {username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ color: "#0f172a", fontSize: 18, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>{username}</div>
              <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>{email} · Rol: {role}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Sesiones</div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column" }}>
            {sessions.map((session, index) => (
              <div key={`${session.device}-${index}`} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 0", borderBottom: index < sessions.length - 1 ? "1px solid rgba(2,6,23,0.06)" : "none" }}>
                <div>
                  <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{session.device}</div>
                  <div style={{ marginTop: 6, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#94a3b8" }}>{session.ip}</span>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>{session.when}</span>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 900, color: session.ok ? "#22d3ee" : "#ef4444" }}>{session.ok ? "Confiable" : "Revisar"}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Actividad reciente</div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column" }}>
            {activity.map((item, index) => (
              <div key={`${item.a}-${item.t}-${index}`} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 0", borderBottom: index < activity.length - 1 ? "1px solid rgba(2,6,23,0.06)" : "none" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: 999, background: item.c, marginTop: 4 }} />
                  <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{item.a}</div>
                </div>
                <div style={{ color: "#94a3b8", fontSize: 11, fontFamily: "'DM Mono',monospace" }}>{item.t}</div>
              </div>
            ))}
            {!activity.length && (
              <div style={{ color: "#64748b", fontSize: 12 }}>
                No hay actividad reciente disponible.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
