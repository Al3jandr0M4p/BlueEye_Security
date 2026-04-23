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

export interface SuperAdminPlanRow {
  accent: string;
  activeCompanies: number;
  adoption: number;
  description: string;
  id: PlanId;
  maxBusinesses: number;
  maxSites: number;
  maxTickets: number;
  maxUsers: number;
  monthlyRevenue: number;
  name: string;
  price: number;
}

export interface SuperAdminUserRow {
  company: string;
  createdAt?: string | null;
  email: string;
  id: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  username: string;
}

export interface SuperAdminSupportRow {
  company: string;
  createdAt?: string | null;
  id: string;
  planningStatus: string;
  priority: string;
  status: string;
  subject: string;
  updatedAt?: string | null;
  waitingAssignment: boolean;
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

export interface SuperAdminBillingCompanyRow {
  collected: number;
  currency: string;
  estimatedMrr: number;
  id: string;
  lastActivity: string;
  name: string;
  pendingInvoices: number;
  pendingPayments: number;
  plan: TipoPlan;
  status: EstadoEmpresa;
  totalInvoices: number;
}

export interface SuperAdminBillingSummary {
  mrr: number;
  paidInvoices: number;
  pendingInvoices: number;
  pendingPayments: number;
  refunds: number;
  totalCollected: number;
}

export interface SuperAdminBillingPoint {
  collected: number;
  mes: string;
  mrr: number;
  pending: number;
}

export interface SuperAdminProfileOverview {
  activity: ProfileActivity[];
  createdAt: string | null;
  email: string;
  phone: string;
  role: string;
  username: string;
}

export interface SuperAdminSettingsFeature {
  details?: string;
  key: string;
  label: string;
  status: "available" | "missing";
}

export interface SuperAdminSettingsRoute {
  enabled: boolean;
  route: string;
}
