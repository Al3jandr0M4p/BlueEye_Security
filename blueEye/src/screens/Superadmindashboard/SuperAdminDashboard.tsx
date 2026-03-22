import React, { useState, useEffect, type MouseEvent } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GrowthDataPoint {
  mes: string;
  empresas: number;
  ingresos: number;
}

interface PlanDataPoint {
  name: string;
  value: number;
  color: string;
}

type EstadoEmpresa = "activa" | "trial" | "suspendida" | "cancelada";
type TipoPlan = "Free" | "Starter" | "Pro" | "Enterprise";
type TipoLog = "warn" | "info" | "success";

interface Company {
  id: number;
  name: string;
  admin: string;
  plan: TipoPlan;
  estado: EstadoEmpresa;
  uso: number;
  fecha: string;
}

interface AuditEntry {
  accion: string;
  empresa: string;
  ip: string;
  tiempo: string;
  tipo: TipoLog;
}

interface NavItem {
  id: string;
  icon: string;
  label: string;
}

interface QuickAction {
  icon: string;
  label: string;
  desc: string;
}

interface BadgeStyle {
  bg: string;
  color: string;
  label: string;
}

// ─── FIX 2: Interfaz propia para el tooltip ───────────────────────────────────
// No usamos TooltipProps de recharts porque en versiones con i18next
// los campos payload/label entran en conflicto de tipos.
// Definimos exactamente lo que recharts inyecta en runtime.
interface CustomTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: Array<{
    name?: string;
    value?: number | string;
    color?: string;
  }>;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const growthData: GrowthDataPoint[] = [
  { mes: "Ago", empresas: 12, ingresos: 3200 },
  { mes: "Sep", empresas: 18, ingresos: 4800 },
  { mes: "Oct", empresas: 24, ingresos: 6400 },
  { mes: "Nov", empresas: 31, ingresos: 8200 },
  { mes: "Dic", empresas: 38, ingresos: 10100 },
  { mes: "Ene", empresas: 47, ingresos: 12600 },
  { mes: "Feb", empresas: 54, ingresos: 14400 },
];

const planData: PlanDataPoint[] = [
  { name: "Free", value: 18, color: "#334155" },
  { name: "Starter", value: 21, color: "#0ea5e9" },
  { name: "Pro", value: 11, color: "#06b6d4" },
  { name: "Enterprise", value: 4, color: "#22d3ee" },
];

const recentCompanies: Company[] = [
  {
    id: 1,
    name: "VigiTech RD",
    admin: "Carlos Méndez",
    plan: "Pro",
    estado: "activa",
    uso: 68,
    fecha: "hace 2h",
  },
  {
    id: 2,
    name: "SafeEye Solutions",
    admin: "María López",
    plan: "Starter",
    estado: "trial",
    uso: 23,
    fecha: "hace 5h",
  },
  {
    id: 3,
    name: "CCTV Pro Services",
    admin: "Pedro Ruiz",
    plan: "Enterprise",
    estado: "activa",
    uso: 91,
    fecha: "hace 1d",
  },
  {
    id: 4,
    name: "SecureVision SRL",
    admin: "Ana Torres",
    plan: "Free",
    estado: "suspendida",
    uso: 100,
    fecha: "hace 2d",
  },
  {
    id: 5,
    name: "Instalaciones 360",
    admin: "Luis Herrera",
    plan: "Starter",
    estado: "activa",
    uso: 45,
    fecha: "hace 3d",
  },
];

const auditLog: AuditEntry[] = [
  {
    accion: "Empresa suspendida",
    empresa: "SecureVision SRL",
    ip: "190.12.45.88",
    tiempo: "hace 2h",
    tipo: "warn",
  },
  {
    accion: "Plan actualizado → Pro",
    empresa: "VigiTech RD",
    ip: "45.230.12.3",
    tiempo: "hace 5h",
    tipo: "info",
  },
  {
    accion: "Acceso Super Admin",
    empresa: "—",
    ip: "200.45.123.9",
    tiempo: "hace 6h",
    tipo: "info",
  },
  {
    accion: "Empresa reactivada",
    empresa: "CCTV Pro Services",
    ip: "190.12.45.88",
    tiempo: "hace 1d",
    tipo: "success",
  },
  {
    accion: "Trial expirado",
    empresa: "Instalaciones 360",
    ip: "—",
    tiempo: "hace 2d",
    tipo: "warn",
  },
];

// ─── FIX 1: Helpers — funciones normales, NO React.FC ─────────────────────────
// React.FC<T> exige que T sea un objeto de props {}.
// Como llamamos planBadge(valor) y estadoBadge(valor) (no como <Componente />),
// deben ser funciones tipadas ordinarias que devuelven React.ReactElement.

const estadoBadge = (estado: EstadoEmpresa): React.ReactElement => {
  const map: Record<EstadoEmpresa, BadgeStyle> = {
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
  };
  const s = map[estado] ?? map.cancelada;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {s.label}
    </span>
  );
};

const planBadge = (plan: TipoPlan): React.ReactElement => {
  const map: Record<TipoPlan, string> = {
    Free: "#475569",
    Starter: "#0ea5e9",
    Pro: "#06b6d4",
    Enterprise: "#a855f7",
  };
  return (
    <span
      style={{ color: map[plan] ?? "#94a3b8", fontWeight: 700, fontSize: 12 }}
    >
      {plan}
    </span>
  );
};

const tipoBullet: Record<TipoLog, string> = {
  warn: "#fbbf24",
  info: "#0ea5e9",
  success: "#22d3ee",
};

// ─── Sub-components ───────────────────────────────────────────────────────────
interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  trend?: number;
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent = "#22d3ee",
  trend,
}: StatCardProps): React.ReactElement {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a 60%, #1e293b)",
        border: "1px solid rgba(34,211,238,0.08)",
        borderRadius: 16,
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e: MouseEvent<HTMLDivElement>) =>
        (e.currentTarget.style.borderColor = "rgba(34,211,238,0.28)")
      }
      onMouseLeave={(e: MouseEvent<HTMLDivElement>) =>
        (e.currentTarget.style.borderColor = "rgba(34,211,238,0.08)")
      }
    >
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: accent,
          opacity: 0.04,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 22 }}>{icon}</span>
        {trend !== undefined && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: trend >= 0 ? "#22d3ee" : "#ef4444",
              background:
                trend >= 0 ? "rgba(34,211,238,0.1)" : "rgba(239,68,68,0.1)",
              padding: "2px 8px",
              borderRadius: 20,
            }}
          >
            {trend >= 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: "#f1f5f9",
          fontFamily: "'Syne', sans-serif",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#64748b",
          letterSpacing: "0.03em",
        }}
      >
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

interface UsageBarProps {
  pct: number;
  color?: string;
}

function UsageBar({
  pct,
  color = "#22d3ee",
}: UsageBarProps): React.ReactElement {
  const barColor = pct >= 90 ? "#ef4444" : pct >= 70 ? "#fbbf24" : color;
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: 99,
        height: 5,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: barColor,
          borderRadius: 99,
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}

// FIX 2 aplicado: interfaz propia en vez de TooltipProps<ValueType, NameType>
const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps): React.ReactElement | null => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid rgba(34,211,238,0.2)",
        borderRadius: 10,
        padding: "10px 16px",
      }}
    >
      <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 4 }}>
        {String(label ?? "")}
      </p>
      {payload.map((p, i) => (
        <p
          key={i}
          style={{
            color: p.color ?? "#fff",
            fontSize: 13,
            fontWeight: 700,
            margin: 0,
          }}
        >
          {p.name === "ingresos" ? "$" : ""}
          {Number(p.value ?? 0).toLocaleString()} {p.name}
        </p>
      ))}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function SuperAdminDashboard(): React.ReactElement {
  const [activeNav, setActiveNav] = useState<string>("dashboard");
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const navItems: NavItem[] = [
    { id: "dashboard", icon: "⬡", label: "Dashboard" },
    { id: "companies", icon: "🏢", label: "Empresas" },
    { id: "plans", icon: "📦", label: "Planes" },
    { id: "billing", icon: "💳", label: "Facturación" },
    { id: "users", icon: "👥", label: "Usuarios" },
    { id: "audit", icon: "🔍", label: "Auditoría" },
    { id: "support", icon: "🎧", label: "Soporte" },
    { id: "settings", icon: "⚙️", label: "Config." },
  ];

  const quickActions: QuickAction[] = [
    { icon: "🏢", label: "Nueva Empresa", desc: "Registrar manualmente" },
    { icon: "📦", label: "Editar Planes", desc: "Modificar límites y precios" },
    {
      icon: "📧",
      label: "Email Masivo",
      desc: "Comunicar a todas las empresas",
    },
    { icon: "🔍", label: "Ver Auditoría", desc: "Logs completos del sistema" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060d1a; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #22d3ee33; border-radius: 99px; }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .nav-item { cursor: pointer; transition: all 0.18s; }
        .nav-item:hover { background: rgba(34,211,238,0.06) !important; }
        .row-hover:hover { background: rgba(34,211,238,0.04) !important; cursor: pointer; }
      `}</style>

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          fontFamily: "'DM Sans', sans-serif",
          background: "#060d1a",
        }}
      >
        {/* ── SIDEBAR ── */}
        <aside
          style={{
            width: 220,
            background: "linear-gradient(180deg,#0a1628 0%,#070f1f 100%)",
            borderRight: "1px solid rgba(34,211,238,0.07)",
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
              borderBottom: "1px solid rgba(34,211,238,0.07)",
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
                    color: "#f1f5f9",
                    fontSize: 15,
                    letterSpacing: "0.02em",
                  }}
                >
                  BlueEye
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#22d3ee",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
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
              <div
                key={item.id}
                className="nav-item"
                onClick={() => setActiveNav(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background:
                    activeNav === item.id
                      ? "rgba(34,211,238,0.1)"
                      : "transparent",
                  borderLeft:
                    activeNav === item.id
                      ? "2px solid #22d3ee"
                      : "2px solid transparent",
                  color: activeNav === item.id ? "#e2f8ff" : "#64748b",
                  fontSize: 13,
                  fontWeight: activeNav === item.id ? 600 : 400,
                }}
              >
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </nav>

          <div
            style={{
              padding: "16px 16px 20px",
              borderTop: "1px solid rgba(34,211,238,0.07)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                SA
              </div>
              <div>
                <div
                  style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 600 }}
                >
                  Super Admin
                </div>
                <div style={{ color: "#475569", fontSize: 10 }}>
                  admin@blueeye.io
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            animation: "fadeIn 0.4s ease",
          }}
        >
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 32px",
              borderBottom: "1px solid rgba(34,211,238,0.07)",
              background: "rgba(6,13,26,0.8)",
              backdropFilter: "blur(12px)",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  color: "#f1f5f9",
                }}
              >
                Dashboard Global
              </div>
              <div style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>
                Visión general de toda la plataforma
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(34,211,238,0.06)",
                  border: "1px solid rgba(34,211,238,0.15)",
                  borderRadius: 20,
                  padding: "6px 14px",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22d3ee",
                    animation: "pulse-dot 1.4s infinite",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 11,
                    color: "#22d3ee",
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
                    background: "rgba(255,255,255,0.04)",
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
                    border: "2px solid #060d1a",
                  }}
                />
              </div>
            </div>
          </header>

          <div
            style={{
              padding: "28px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            {/* KPI Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
              }}
            >
              <StatCard
                icon="🏢"
                label="Empresas activas"
                value="54"
                sub="4 en trial · 2 suspendidas"
                trend={14}
              />
              <StatCard
                icon="💰"
                label="MRR"
                value="$14,400"
                sub="Ingresos recurrentes"
                trend={8}
                accent="#a855f7"
              />
              <StatCard
                icon="⚠️"
                label="Pagos pendientes"
                value="$3,200"
                sub="8 facturas vencidas"
                trend={-3}
                accent="#fbbf24"
              />
              <StatCard
                icon="🎫"
                label="Tickets abiertos"
                value="17"
                sub="3 urgentes · 5 sin asignar"
                accent="#ef4444"
              />
            </div>

            {/* Charts Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 300px",
                gap: 16,
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg,#0f172a,#1e293b)",
                  border: "1px solid rgba(34,211,238,0.08)",
                  borderRadius: 16,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "'Syne',sans-serif",
                        fontWeight: 700,
                        color: "#f1f5f9",
                        fontSize: 14,
                      }}
                    >
                      Crecimiento de Empresas
                    </div>
                    <div
                      style={{ color: "#475569", fontSize: 11, marginTop: 2 }}
                    >
                      Últimos 7 meses
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#22d3ee",
                      background: "rgba(34,211,238,0.1)",
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontWeight: 600,
                    }}
                  >
                    +14% MoM
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="colorE" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#22d3ee"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="#22d3ee"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                    />
                    <XAxis
                      dataKey="mes"
                      stroke="#334155"
                      tick={{ fill: "#475569", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#334155"
                      tick={{ fill: "#475569", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="empresas"
                      name="empresas"
                      stroke="#22d3ee"
                      strokeWidth={2}
                      fill="url(#colorE)"
                      dot={{ fill: "#22d3ee", r: 3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div
                style={{
                  background: "linear-gradient(135deg,#0f172a,#1e293b)",
                  border: "1px solid rgba(34,211,238,0.08)",
                  borderRadius: 16,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "'Syne',sans-serif",
                        fontWeight: 700,
                        color: "#f1f5f9",
                        fontSize: 14,
                      }}
                    >
                      Ingresos por Suscripción
                    </div>
                    <div
                      style={{ color: "#475569", fontSize: 11, marginTop: 2 }}
                    >
                      USD · Últimos 7 meses
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 13,
                      color: "#a855f7",
                      fontWeight: 700,
                    }}
                  >
                    $14,400
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={growthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                    />
                    <XAxis
                      dataKey="mes"
                      stroke="#334155"
                      tick={{ fill: "#475569", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#334155"
                      tick={{ fill: "#475569", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="ingresos"
                      name="ingresos"
                      stroke="#a855f7"
                      strokeWidth={2.5}
                      dot={{ fill: "#a855f7", r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div
                style={{
                  background: "linear-gradient(135deg,#0f172a,#1e293b)",
                  border: "1px solid rgba(34,211,238,0.08)",
                  borderRadius: 16,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 700,
                    color: "#f1f5f9",
                    fontSize: 14,
                    marginBottom: 4,
                  }}
                >
                  Distribución por Plan
                </div>
                <div
                  style={{ color: "#475569", fontSize: 11, marginBottom: 16 }}
                >
                  54 empresas totales
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <PieChart width={140} height={140}>
                    <Pie
                      data={planData}
                      cx={65}
                      cy={65}
                      innerRadius={42}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {planData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid rgba(34,211,238,0.2)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginTop: 8,
                  }}
                >
                  {planData.map((p) => (
                    <div
                      key={p.name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 2,
                            background: p.color,
                          }}
                        />
                        <span style={{ color: "#94a3b8", fontSize: 12 }}>
                          {p.name}
                        </span>
                      </div>
                      <span
                        style={{
                          color: "#cbd5e1",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {p.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 380px",
                gap: 16,
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg,#0f172a,#1e293b)",
                  border: "1px solid rgba(34,211,238,0.08)",
                  borderRadius: 16,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "'Syne',sans-serif",
                        fontWeight: 700,
                        color: "#f1f5f9",
                        fontSize: 14,
                      }}
                    >
                      Empresas Recientes
                    </div>
                    <div
                      style={{ color: "#475569", fontSize: 11, marginTop: 2 }}
                    >
                      Últimas actividades
                    </div>
                  </div>
                  <button
                    style={{
                      fontSize: 11,
                      color: "#22d3ee",
                      background: "rgba(34,211,238,0.08)",
                      border: "1px solid rgba(34,211,238,0.2)",
                      borderRadius: 8,
                      padding: "5px 12px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Ver todas →
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1.5fr 80px 80px 120px 60px",
                    gap: 12,
                    padding: "6px 12px",
                    marginBottom: 4,
                  }}
                >
                  {["Empresa", "Admin", "Plan", "Estado", "Uso", "Reg."].map(
                    (h) => (
                      <div
                        key={h}
                        style={{
                          fontSize: 10,
                          color: "#334155",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {h}
                      </div>
                    ),
                  )}
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  {recentCompanies.map((c) => (
                    <div
                      key={c.id}
                      className="row-hover"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1.5fr 80px 80px 120px 60px",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 10,
                        alignItems: "center",
                        transition: "background 0.15s",
                      }}
                    >
                      <div
                        style={{
                          color: "#e2e8f0",
                          fontSize: 13,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {c.name}
                      </div>
                      <div
                        style={{
                          color: "#64748b",
                          fontSize: 12,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {c.admin}
                      </div>
                      <div>{planBadge(c.plan)}</div>
                      <div>{estadoBadge(c.estado)}</div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span style={{ fontSize: 10, color: "#475569" }}>
                            Límites
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              fontFamily: "'DM Mono',monospace",
                              color:
                                c.uso >= 90
                                  ? "#ef4444"
                                  : c.uso >= 70
                                    ? "#fbbf24"
                                    : "#22d3ee",
                            }}
                          >
                            {c.uso}%
                          </span>
                        </div>
                        <UsageBar pct={c.uso} />
                      </div>
                      <div style={{ color: "#334155", fontSize: 11 }}>
                        {c.fecha}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: "linear-gradient(135deg,#0f172a,#1e293b)",
                  border: "1px solid rgba(34,211,238,0.08)",
                  borderRadius: 16,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "'Syne',sans-serif",
                        fontWeight: 700,
                        color: "#f1f5f9",
                        fontSize: 14,
                      }}
                    >
                      Bitácora de Eventos
                    </div>
                    <div
                      style={{ color: "#475569", fontSize: 11, marginTop: 2 }}
                    >
                      Últimas acciones críticas
                    </div>
                  </div>
                  <button
                    style={{
                      fontSize: 11,
                      color: "#22d3ee",
                      background: "rgba(34,211,238,0.08)",
                      border: "1px solid rgba(34,211,238,0.2)",
                      borderRadius: 8,
                      padding: "5px 12px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Full log →
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  {auditLog.map((log, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 12,
                        padding: "12px 0",
                        borderBottom:
                          i < auditLog.length - 1
                            ? "1px solid rgba(255,255,255,0.04)"
                            : "none",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: tipoBullet[log.tipo],
                          marginTop: 4,
                          flexShrink: 0,
                          boxShadow: `0 0 6px ${tipoBullet[log.tipo]}55`,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            color: "#cbd5e1",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {log.accion}
                        </div>
                        {log.empresa !== "—" && (
                          <div
                            style={{
                              color: "#475569",
                              fontSize: 11,
                              marginTop: 2,
                            }}
                          >
                            {log.empresa}
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
                          <span
                            style={{
                              fontFamily: "'DM Mono',monospace",
                              fontSize: 10,
                              color: "#334155",
                            }}
                          >
                            {log.ip}
                          </span>
                          <span style={{ color: "#1e293b" }}>·</span>
                          <span style={{ fontSize: 10, color: "#334155" }}>
                            {log.tiempo}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
              }}
            >
              {quickActions.map((a) => (
                <div
                  key={a.label}
                  className="nav-item"
                  style={{
                    background: "rgba(14,165,233,0.04)",
                    border: "1px solid rgba(34,211,238,0.1)",
                    borderRadius: 12,
                    padding: "16px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <div>
                    <div
                      style={{
                        color: "#e2e8f0",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {a.label}
                    </div>
                    <div style={{ color: "#475569", fontSize: 11 }}>
                      {a.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
