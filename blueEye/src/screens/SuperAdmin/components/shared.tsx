import type React from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../../hooks/use-store-hook";
import type {
  AuditLogType,
  EstadoEmpresa,
  InvoiceStatus,
  SuperAdminNavItem,
  SupportTicketStatus,
  TicketPriority,
  TipoLog,
  TipoPlan,
  UserRole,
  UserStatus,
} from "../../../types/superAdmin.types";

export const PANEL_STYLE: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid rgba(2,6,23,0.08)",
  borderRadius: 16,
  boxShadow: "0 12px 30px rgba(2,6,23,0.06)",
};

export function SuperAdminSidebar({
  navItems,
}: {
  navItems: SuperAdminNavItem[];
}) {
  const { profile, user } = useAppSelector((state) => state.auth);
  const accountName =
    profile?.username?.trim() ||
    user?.username?.trim() ||
    user?.email?.split("@")[0] ||
    "Admin";
  const accountEmail = user?.email || "Sin correo";
  const initials = accountName.slice(0, 2).toUpperCase();

  return (
    <aside
      style={{
        width: 220,
        background: "linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)",
        borderRight: "1px solid rgba(2,6,23,0.08)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <div
        style={{
          padding: "28px 20px 24px",
          borderBottom: "1px solid rgba(2,6,23,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg,#0ea5e9,#22d3ee)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            👁
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                color: "#0f172a",
                fontSize: 15,
                letterSpacing: "0.02em",
              }}
            >
              BlueEye
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#0ea5e9",
                letterSpacing: "0.1em",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Super Admin
            </div>
          </div>
        </div>
      </div>

      <nav
        style={{
          flex: 1,
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              background: isActive ? "rgba(14,165,233,0.10)" : "transparent",
              borderLeft: isActive
                ? "2px solid #0ea5e9"
                : "2px solid transparent",
              color: isActive ? "#0f172a" : "#475569",
              fontSize: 13,
              fontWeight: isActive ? 800 : 600,
              textDecoration: "none",
            })}
          >
            <span style={{ fontSize: 15 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div
        style={{
          padding: "16px 16px 20px",
          borderTop: "1px solid rgba(2,6,23,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: 10,
            borderRadius: 12,
            background: "rgba(14,165,233,0.04)",
            border: "1px solid rgba(14,165,233,0.12)",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#0ea5e9,#7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: "#0f172a",
                fontSize: 12,
                fontWeight: 800,
                lineHeight: 1.1,
              }}
            >
              {accountName}
            </div>
            <div style={{ color: "#64748b", fontSize: 10, marginTop: 2 }}>
              {accountEmail}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function SuperAdminTopbar({
  subtitle,
  time,
  title,
}: {
  subtitle: string;
  time: Date;
  title: string;
}) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 32px",
        borderBottom: "1px solid rgba(2,6,23,0.08)",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        boxShadow: "0 8px 26px rgba(2,6,23,0.06)",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 900,
            fontSize: 22,
            color: "#0f172a",
          }}
        >
          {title}
        </div>
        <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>
          {subtitle}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(14,165,233,0.08)",
            border: "1px solid rgba(14,165,233,0.18)",
            borderRadius: 20,
            padding: "6px 14px",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#0ea5e9",
            }}
          />
          <span
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 11,
              color: "#0ea5e9",
            }}
          >
            {time.toLocaleTimeString("es-DO", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
        <div style={{ position: "relative", cursor: "pointer" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(2,6,23,0.04)",
              border: "1px solid rgba(2,6,23,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            🔔
          </div>
          <div
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ef4444",
              border: "2px solid #ffffff",
            }}
          />
        </div>
      </div>
    </header>
  );
}

export function StatCard({
  accent = "#22d3ee",
  icon,
  label,
  sub,
  trend,
  value,
}: {
  accent?: string;
  icon?: string;
  label: string;
  sub?: string;
  trend?: number;
  value: string | number;
}) {
  return (
    <div style={{ ...PANEL_STYLE, padding: 18 }}>
      {icon && <div style={{ fontSize: 18, marginBottom: 8 }}>{icon}</div>}
      <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 900 }}>
        {label}
      </div>
      <div
        style={{
          color: accent,
          fontSize: 30,
          fontWeight: 900,
          fontFamily: "'Syne',sans-serif",
          marginTop: 6,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>
          {sub}
        </div>
      )}
      {trend !== undefined && (
        <div
          style={{
            color: trend >= 0 ? "#22d3ee" : "#ef4444",
            fontSize: 11,
            fontWeight: 800,
            marginTop: 8,
          }}
        >
          {trend >= 0 ? "+" : ""}
          {trend}%
        </div>
      )}
    </div>
  );
}

export function Toggle({ on }: { on: boolean }) {
  return (
    <div
      style={{
        width: 44,
        height: 24,
        borderRadius: 999,
        background: on ? "rgba(14,165,233,0.18)" : "rgba(2,6,23,0.06)",
        border: on
          ? "1px solid rgba(14,165,233,0.30)"
          : "1px solid rgba(2,6,23,0.10)",
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

export function stateBadge(
  value: EstadoEmpresa | UserStatus | SupportTicketStatus | InvoiceStatus,
) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    activa: { bg: "rgba(34,211,238,0.12)", color: "#22d3ee", label: "Activa" },
    trial: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", label: "Trial" },
    suspendida: {
      bg: "rgba(239,68,68,0.12)",
      color: "#ef4444",
      label: "Suspendida",
    },
    cancelada: {
      bg: "rgba(100,116,139,0.2)",
      color: "#94a3b8",
      label: "Cancelada",
    },
    active: { bg: "rgba(34,211,238,0.12)", color: "#22d3ee", label: "Activo" },
    invited: {
      bg: "rgba(251,191,36,0.12)",
      color: "#fbbf24",
      label: "Invitado",
    },
    blocked: {
      bg: "rgba(239,68,68,0.12)",
      color: "#ef4444",
      label: "Bloqueado",
    },
    open: { bg: "rgba(34,211,238,0.12)", color: "#22d3ee", label: "Abierto" },
    pending: {
      bg: "rgba(251,191,36,0.12)",
      color: "#fbbf24",
      label: "Pendiente",
    },
    escalated: {
      bg: "rgba(239,68,68,0.12)",
      color: "#ef4444",
      label: "Escalado",
    },
    closed: {
      bg: "rgba(100,116,139,0.20)",
      color: "#94a3b8",
      label: "Cerrado",
    },
    paid: { bg: "rgba(34,211,238,0.12)", color: "#22d3ee", label: "Pagada" },
    due: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", label: "Pendiente" },
    overdue: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", label: "Vencida" },
    refunded: {
      bg: "rgba(100,116,139,0.20)",
      color: "#94a3b8",
      label: "Reembolso",
    },
  };
  const current = map[value];
  return (
    <span
      style={{
        background: current.bg,
        color: current.color,
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {current.label}
    </span>
  );
}

export function planBadge(plan: TipoPlan | UserRole) {
  const map: Record<string, string> = {
    Free: "#94a3b8",
    Starter: "#0ea5e9",
    Pro: "#06b6d4",
    Enterprise: "#a855f7",
    superAdmin: "#a855f7",
    admin: "#22d3ee",
    tecnico: "#0ea5e9",
    usuario: "#94a3b8",
  };
  return (
    <span style={{ color: map[plan], fontWeight: 900, fontSize: 12 }}>
      {plan}
    </span>
  );
}

export function priorityBadge(priority: TicketPriority) {
  const map: Record<
    TicketPriority,
    { bg: string; color: string; label: string }
  > = {
    low: { bg: "rgba(100,116,139,0.20)", color: "#94a3b8", label: "Baja" },
    medium: { bg: "rgba(14,165,233,0.12)", color: "#0ea5e9", label: "Media" },
    high: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", label: "Alta" },
    urgent: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", label: "Urgente" },
  };
  const current = map[priority];
  return (
    <span
      style={{
        background: current.bg,
        color: current.color,
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {current.label}
    </span>
  );
}

export function logBullet(type: TipoLog | AuditLogType) {
  const map: Record<string, string> = {
    warn: "#fbbf24",
    info: "#0ea5e9",
    success: "#22d3ee",
    critical: "#ef4444",
  };
  return map[type];
}

export function UsageBar({ pct }: { pct: number }) {
  const color = pct >= 90 ? "#ef4444" : pct >= 70 ? "#fbbf24" : "#22d3ee";
  return (
    <div
      style={{
        background: "rgba(2,6,23,0.08)",
        borderRadius: 99,
        height: 6,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
        }}
      />
    </div>
  );
}
