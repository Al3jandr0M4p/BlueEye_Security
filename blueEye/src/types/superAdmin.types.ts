export interface SuperAdminNavItem {
  icon: string;
  label: string;
  to: string;
}

export interface SuperAdminPageMeta {
  subtitle: string;
  title: string;
}

export interface GrowthDataPoint {
  empresas: number;
  ingresos: number;
  mes: string;
}

export interface PlanDataPoint {
  color: string;
  name: string;
  value: number;
}

export type EstadoEmpresa = "activa" | "trial" | "suspendida" | "cancelada";
export type TipoPlan = "Free" | "Starter" | "Pro" | "Enterprise";
export type TipoLog = "warn" | "info" | "success" | "critical";

export interface Company {
  admin: string;
  estado: EstadoEmpresa;
  fecha: string;
  id: number | string;
  name: string;
  plan: TipoPlan;
  uso: number;
}

export interface AuditEntry {
  accion: string;
  empresa: string;
  ip: string;
  tiempo: string;
  tipo: TipoLog;
}

export interface QuickAction {
  desc: string;
  icon: string;
  label: string;
  to: string;
}

export type PlanId = "free" | "starter" | "pro" | "enterprise";

export interface PlanTier {
  accent: string;
  features: string[];
  id: PlanId;
  limits: Array<{ k: string; v: string }>;
  name: string;
  popular?: boolean;
  price: string;
}

export type InvoiceStatus = "paid" | "due" | "overdue" | "refunded";

export interface RevenuePoint {
  mes: string;
  mrr: number;
}

export interface InvoiceRow {
  empresa: string;
  fecha: string;
  id: string;
  metodo: string;
  monto: number;
  status: InvoiceStatus;
}

export type UserRole = "superAdmin" | "admin" | "tecnico" | "usuario";
export type UserStatus = "active" | "invited" | "blocked";

export interface UserRow {
  email: string;
  empresa: string;
  id: number;
  lastLogin: string;
  mfa: boolean;
  name: string;
  role: UserRole;
  status: UserStatus;
}

export type AuditLogType = "info" | "warn" | "success" | "critical";

export interface AuditLogEntry {
  accion: string;
  actor: string;
  empresa: string;
  ip: string;
  tiempo: string;
  tipo: AuditLogType;
}

export interface EventsPoint {
  eventos: number;
  h: string;
}

export type SupportTicketStatus = "open" | "pending" | "closed" | "escalated";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface SupportTicketRow {
  asignadoA: string;
  actualizado: string;
  asunto: string;
  empresa: string;
  id: string;
  prioridad: TicketPriority;
  status: SupportTicketStatus;
}

export interface SecuritySetting {
  desc: string;
  title: string;
  value: boolean | string;
}

export interface ProfileSession {
  device: string;
  ip: string;
  ok: boolean;
  when: string;
}

export interface ProfileActivity {
  a: string;
  c: string;
  t: string;
}
