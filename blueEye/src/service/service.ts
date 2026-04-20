import api from "../api/api";
import type {
  LoginPayload,
  RegisterPayload,
  SignInResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  RegisterResponse,
  CreateAdminPayload,
  ConfigureUserAccountPayload,
  AdminDashboardStats,
  AdminTicket,
  AdminManagedUser,
  AdminBusinessOverview,
  AdminCatalogOverview,
  AdminClientOverview,
  AdminInventoryOverview,
  AdminPreProjectOverview,
  AdminProjectOverview,
  AdminReportsOverview,
  AdminUserUpdatePayload,
  CreateInventoryMovementPayload,
  CreateInventoryProductPayload,
  ApiResponse,
  TicketsBody,
} from "../types/types";
import type {
  ClientDocument,
  ClientNotification,
  DocumentType,
  Invoice,
  MaintenanceRecord,
  NewTicketInput,
  SystemStatusData,
  Ticket,
} from "../types/client.types";
import type {
  AuditEntry,
  AuditLogEntry,
  Company,
  GrowthDataPoint,
  PlanDataPoint,
  TipoLog,
  TipoPlan,
} from "../types/superAdmin.types";
import type { TechNotification } from "../types/tech.types";

interface AdminTicketApiRecord {
  id?: string | number;
  site?: string;
  tickets_status?: string;
  assigned_to?: string | null;
  summary?: string | null;
  content_description?: string | null;
  priority?: string | null;
  created_at?: string;
  sla_due?: string | null;
  requested_by?: string | null;
  user_id?: string | null;
  devices?: Array<{ name?: string; quantity?: number; status?: string }> | null;
  tags?: string[] | null;
  scheduled_date?: string | null;
  technician?: {
    id?: string;
    username?: string | null;
  } | null;
}

interface AdminUserApiRecord {
  id?: string | number;
  username?: string | null;
  profile_username?: string | null;
  email?: string | null;
  phone?: string | null;
  rolename?: string | null;
  is_active?: boolean | null;
  picture_url?: string | null;
  business_id?: string | null;
}

function mapAdminTicket(record: AdminTicketApiRecord): AdminTicket {
  return {
    id: String(record.id ?? ""),
    site: record.site ?? "Sitio no especificado",
    status: record.tickets_status ?? "iniciado",
    assignedTo:
      record.technician?.username ??
      record.assigned_to ??
      "Sin asignar",
    summary:
      record.summary ??
      record.content_description ??
      "Sin descripcion",
    priority: record.priority ?? "media",
    createdAt: record.created_at ?? new Date().toISOString(),
    slaDue: record.sla_due ?? "",
    requestedBy: record.requested_by ?? record.user_id ?? "cliente",
    devices:
      record.devices?.map((device, index) => ({
        name: device.name ?? `Equipo ${index + 1}`,
        quantity: device.quantity ?? 1,
        status: device.status ?? "pendiente",
      })) ?? [],
    tags: record.tags ?? [],
    scheduledDate: record.scheduled_date ?? undefined,
  };
}

function buildDisplayName(record: AdminUserApiRecord) {
  const fullName = record.username?.trim();
  if (fullName) {
    return fullName;
  }

  const profileUsername = record.profile_username?.trim();
  if (profileUsername) {
    return profileUsername;
  }

  if (record.email) {
    return record.email.split("@")[0];
  }

  return "Usuario sin nombre";
}

function mapAdminManagedUser(record: AdminUserApiRecord): AdminManagedUser {
  const displayName = buildDisplayName(record);
  const profileUsername = record.profile_username?.trim();
  const username = profileUsername || record.username?.trim() || displayName;

  return {
    id: String(record.id ?? ""),
    name: displayName,
    username,
    email: record.email ?? "Sin correo",
    phone: record.phone ?? "Sin telefono",
    company: record.business_id ?? "—",
    city: "—",
    image:
      record.picture_url ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=EAF7F1&color=2E8B5E`,
    isActive: record.is_active !== false,
    pictureUrl: record.picture_url ?? undefined,
    rolename: record.rolename === "tecnico" ? "tecnico" : "usuario",
  };
}

export const registerUserService = async (payload: RegisterPayload) => {
  const formData = new FormData();

  formData.append("email", payload.email);
  formData.append("username", payload.username);
  formData.append("password", payload.password);
  formData.append("businessName", payload.businessName);
  formData.append("country", payload.country);
  formData.append("currency", payload.currency);
  formData.append("taxId", payload.taxId);
  formData.append("phone", payload.phone);

  if (payload.logo) {
    formData.append("logo", payload.logo);
  }

  const { data } = await api.post<RegisterResponse>(
    "/api/authentication/v1/business/sign-up",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};

export const loginUser = async (payload: LoginPayload) => {
  const { data } = await api.post<SignInResponse>(
    "/api/authentication/v1/users/sign-in",
    payload,
  );

  return data;
};

export const signOut = async () => {
  await api.post("/api/authentication/v1/accounts/sign-out");
};

export const resendEmailOtpService = async (email: string) => {
  const { data } = await api.post("/api/authentication/v1/email/otp/resend", {
    email,
  });

  return data;
};

export const verifyEmailOtpService = async (payload: {
  email: string;
  code: string;
}) => {
  const { data } = await api.post("/api/authentication/v1/email/otp/verify", payload);

  return data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const { data } = await api.post(
    "/api/authentication/v1/password/reset/request",
    payload,
  );
  return data;
};

export const resetPasswordService = async (payload: ResetPasswordPayload) => {
  const { data } = await api.post(
    "/api/authentication/v1/password/reset/confirm",
    payload,
  );

  return data;
};

export const loginWithGoogleService = async (credential: string) => {
  const { data } = await api.post(
    "/api/authentication/v1/oauth/google/session/sign-in",
    { credential },
  );

  return data;
};

export const createUserAdminService = async (payload: CreateAdminPayload) => {
  const { data } = await api.post("/api/users/v1/invite/users", payload);

  return data;
};

export const configureUserAccountService = async (
  payload: ConfigureUserAccountPayload,
) => {
  const { data } = await api.post(
    "/api/users/v1/config/users/account",
    payload,
  );

  return data;
};

export async function fetchAdminUsersService() {
  const { data } = await api.get<{ message: string; data: AdminUserApiRecord[] }>(
    "/api/users/v1/read/users",
  );

  return (data.data ?? []).map(mapAdminManagedUser);
}

export async function fetchAdminUserByIdService(userId: string) {
  const { data } = await api.post<{ message: string; data: AdminUserApiRecord }>(
    `/api/users/v1/read/users/${userId}`,
  );

  return mapAdminManagedUser(data.data ?? {});
}

export async function updateAdminUserService(
  userId: string,
  payload: AdminUserUpdatePayload,
) {
  const { data } = await api.put(
    `/api/users/v1/update/users/${userId}`,
    payload,
  );

  return data;
}

export async function deleteAdminUserService(userId: string) {
  const { data } = await api.delete(`/api/users/v1/delete/users/${userId}`);

  return data;
}

export async function fetchAdminDashboardStats() {
  const { data } = await api.post<AdminDashboardStats>(
    "/api/admin/v1/dashboard/stats/admin",
  );

  return data.data;
}

export async function fetchPedingTicketsService() {
  const { data } = await api.get<ApiResponse<AdminTicketApiRecord[]>>(
    "/api/admin/v1/tickets/pending",
  );
  return (data.data ?? []).map(mapAdminTicket);
}

export async function fetchPlanningTicketsService() {
  const { data } = await api.get<ApiResponse<AdminTicketApiRecord[]>>(
    "/api/admin/v1/tickets/planning",
  );
  return (data.data ?? []).map(mapAdminTicket);
}

export async function ticketsClientsService(payload: TicketsBody) {
  const formData = new FormData();

  formData.append("site", payload.site);
  formData.append("equipment", payload.equipment);
  formData.append("contentDescription", payload.description);

  if (payload.photo) {
    formData.append("logo", payload.photo);
  }

  const { data } = await api.post<ApiResponse<BackendTicketRecord[]>>(
    "/api/client/v1/tickets",
    formData,
    {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    },
  );

  return data;
}

export async function rejectAdminTicketService(ticketId: string) {
  const { data } = await api.post(`/api/admin/v1/tickets/${ticketId}/reject`);

  return data;
}

export async function planAdminTicketService(
  ticketId: string,
  payload: { scheduledDate: string; technicianId: string },
) {
  const { data } = await api.post(`/api/admin/v1/tickets/${ticketId}/plan`, payload);

  return data;
}

type AdminOverviewResponse<T> = { success: boolean; data: T };

export async function fetchAdminClientsOverview() {
  const { data } = await api.get<AdminOverviewResponse<AdminClientOverview>>(
    "/api/admin/v1/clients/overview",
  );

  return data.data;
}

export async function fetchAdminClientSites(clientId: string) {
  const { data } = await api.get<{ success: boolean; data: unknown[] }>(
    `/api/admin/v1/clients/${clientId}/sites`,
  );

  return data.data ?? [];
}

export async function createAdminClientSite(
  clientId: string,
  payload: { name: string; address?: string; type?: string },
) {
  const { data } = await api.post<{ success: boolean; data: unknown }>(
    `/api/admin/v1/clients/${clientId}/sites`,
    payload,
  );

  return data.data;
}

export async function updateAdminSite(
  siteId: string,
  payload: { name?: string; address?: string; type?: string; is_active?: boolean },
) {
  const { data } = await api.put<{ success: boolean; data: unknown }>(
    `/api/admin/v1/sites/${siteId}`,
    payload,
  );

  return data.data;
}

export async function fetchAdminSiteZones(siteId: string) {
  const { data } = await api.get<{ success: boolean; data: unknown[] }>(
    `/api/admin/v1/sites/${siteId}/zones`,
  );

  return data.data ?? [];
}

export async function createAdminSiteZone(
  siteId: string,
  payload: { name: string; description?: string },
) {
  const { data } = await api.post<{ success: boolean; data: unknown }>(
    `/api/admin/v1/sites/${siteId}/zones`,
    payload,
  );

  return data.data;
}

export async function deactivateAdminSiteZone(zoneId: string) {
  const { data } = await api.delete<{ success: boolean }>(
    `/api/admin/v1/zones/${zoneId}`,
  );

  return data;
}

export async function fetchAdminSiteContacts(siteId: string) {
  const { data } = await api.get<{ success: boolean; data: unknown[] }>(
    `/api/admin/v1/sites/${siteId}/contacts`,
  );

  return data.data ?? [];
}

export async function createAdminSiteContact(
  siteId: string,
  payload: {
    name: string;
    email?: string;
    phone?: string;
    role?: string;
    isPrimary?: boolean;
  },
) {
  const { data } = await api.post<{ success: boolean; data: unknown }>(
    `/api/admin/v1/sites/${siteId}/contacts`,
    payload,
  );

  return data.data;
}

export async function updateAdminSiteContact(
  contactId: string,
  payload: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    isPrimary?: boolean;
    is_active?: boolean;
  },
) {
  const { data } = await api.put<{ success: boolean; data: unknown }>(
    `/api/admin/v1/contacts/${contactId}`,
    payload,
  );

  return data.data;
}

export async function deactivateAdminSiteContact(contactId: string) {
  const { data } = await api.delete<{ success: boolean }>(
    `/api/admin/v1/contacts/${contactId}`,
  );

  return data;
}

export async function fetchTechTicketsService(params?: {
  planningStatus?: string;
}) {
  const { data } = await api.get<{ success: boolean; data: unknown[] }>(
    "/api/tech/v1/tickets",
    { params },
  );

  return data.data ?? [];
}

export async function updateTechTicketStatusService(
  ticketId: string,
  payload: { status: "iniciado" | "en progreso" | "finalizado" | "cancelado" },
) {
  const { data } = await api.patch<{ success: boolean }>(
    `/api/tech/v1/tickets/${ticketId}/status`,
    payload,
  );

  return data;
}

export async function updateTechTicketNotesService(
  ticketId: string,
  payload: { notes: string },
) {
  const { data } = await api.patch<{ success: boolean }>(
    `/api/tech/v1/tickets/${ticketId}/notes`,
    payload,
  );

  return data;
}

export async function fetchTechSitesService() {
  const { data } = await api.get<{ success: boolean; data: unknown[] }>(
    "/api/tech/v1/sites",
  );

  return data.data ?? [];
}

export async function fetchTechNotificationsService() {
  const { data } = await api.get<{
    success: boolean;
    data: BackendTechNotificationRecord[];
  }>("/api/tech/v1/notifications");

  return (data.data ?? []).map(normalizeBackendTechNotification);
}

export async function markTechNotificationAsReadService(notificationId: string) {
  const { data } = await api.patch<{ success: boolean }>(
    `/api/tech/v1/notifications/${notificationId}/read`,
  );

  return data;
}

export async function fetchTechSurveysService(params?: { siteId?: string }) {
  const { data } = await api.get<{ success: boolean; data: unknown[] }>(
    "/api/tech/v1/surveys",
    { params },
  );

  return data.data ?? [];
}

export async function createTechSurveyService(payload: {
  siteId: string;
  title?: string;
}) {
  const { data } = await api.post<{ success: boolean; data: unknown }>(
    "/api/tech/v1/surveys",
    payload,
  );

  return data.data;
}

export async function fetchTechSurveyByIdService(surveyId: string) {
  const { data } = await api.get<{ success: boolean; data: unknown }>(
    `/api/tech/v1/surveys/${surveyId}`,
  );

  return data.data;
}

export async function updateTechSurveyService(
  surveyId: string,
  payload: {
    title?: string;
    status?: "draft" | "submitted";
    objectives?: string;
    risks?: string;
    measurements?: Record<string, unknown>;
    powerStatus?: string;
    networkStatus?: string;
    notes?: string;
  },
) {
  const { data } = await api.put<{ success: boolean; data: unknown }>(
    `/api/tech/v1/surveys/${surveyId}`,
    payload,
  );

  return data.data;
}

export async function fetchTechSurveyPointsService(surveyId: string) {
  const { data } = await api.get<{ success: boolean; data: unknown[] }>(
    `/api/tech/v1/surveys/${surveyId}/points`,
  );

  return data.data ?? [];
}

export async function createTechSurveyPointService(
  surveyId: string,
  payload: {
    zone: string;
    height?: string;
    angle?: string;
    cameraSuggestion?: string;
    notes?: string;
  },
) {
  const { data } = await api.post<{ success: boolean; data: unknown }>(
    `/api/tech/v1/surveys/${surveyId}/points`,
    payload,
  );

  return data.data;
}

export async function uploadTechSurveyPhotoService(surveyId: string, photo: File) {
  const formData = new FormData();
  formData.append("photo", photo);

  const { data } = await api.post<{ success: boolean; data: unknown }>(
    `/api/tech/v1/surveys/${surveyId}/photos`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return data.data;
}

export async function fetchAdminBusinessOverview() {
  const { data } = await api.get<AdminOverviewResponse<AdminBusinessOverview>>(
    "/api/admin/v1/business/overview",
  );

  return data.data;
}

export async function fetchAdminProjectOverview() {
  const { data } = await api.get<AdminOverviewResponse<AdminProjectOverview>>(
    "/api/admin/v1/projects/overview",
  );

  return data.data;
}

export async function fetchAdminPreProjectOverview() {
  const { data } = await api.get<AdminOverviewResponse<AdminPreProjectOverview>>(
    "/api/admin/v1/preproject/overview",
  );

  return data.data;
}

export async function fetchAdminCatalogOverview() {
  const { data } = await api.get<AdminOverviewResponse<AdminCatalogOverview>>(
    "/api/admin/v1/catalog/overview",
  );

  return data.data;
}

export async function fetchAdminInventoryOverview() {
  const { data } = await api.get<{ success: boolean; data: AdminInventoryOverview }>(
    "/api/admin/v1/inventory/overview",
  );

  return data.data;
}

export async function createAdminInventoryProduct(
  payload: CreateInventoryProductPayload,
) {
  const { data } = await api.post<{ success: boolean }>(
    "/api/admin/v1/inventory/products",
    payload,
  );

  return data;
}

export async function createAdminInventoryMovement(
  productId: string,
  payload: CreateInventoryMovementPayload,
) {
  const { data } = await api.post<{ success: boolean }>(
    `/api/admin/v1/inventory/products/${productId}/movements`,
    payload,
  );

  return data;
}

export async function fetchAdminReportsOverview() {
  const { data } = await api.get<{ success: boolean; data: AdminReportsOverview }>(
    "/api/admin/v1/reports/overview",
  );

  return data.data;
}

type DashboardResponse = {
  success: boolean;
  data: {
    businesses?: Array<{
      adminName?: string | null;
      businessName?: string;
      id: string;
      state?: string;
    }>;
    growth?: Array<{
      business?: number;
      income?: number;
      month?: string;
    }>;
    kpis?: {
      activeBusiness?: number;
      businessInFree?: number;
      disabledBusiness?: number;
      mrr?: number;
      openTickets?: number;
      pendingInvoices?: number;
      pendingPayment?: number;
      unAssignedTickets?: number;
    };
  };
};

type PaginatedResponse = {
  success: boolean;
  data: {
    data: Array<Record<string, unknown>>;
    page: number;
    total: number;
    totalPages: number;
  };
};

type DashboardPayload = {
  auditLog: AuditEntry[];
  growthData: GrowthDataPoint[];
  planData: PlanDataPoint[];
  recentCompanies: Company[];
  stats: {
    activeBusiness: number;
    businessInFree: number;
    disabledBusiness: number;
    mrr: number;
    openTickets: number;
    pendingInvoices: number;
    pendingPayment: number;
    unAssignedTickets: number;
  };
};

function formatRelativeDate(dateValue?: string): string {
  if (!dateValue) return "No disponible";

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "No disponible";

  const diffMs = parsed.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  const minutes = Math.round(diffMs / 60000);

  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");

  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");

  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return rtf.format(days, "day");

  return rtf.format(Math.round(days / 30), "month");
}

function mapPlan(value?: string | null): TipoPlan {
  switch ((value ?? "").toLowerCase()) {
    case "starter":
      return "Starter";
    case "pro":
      return "Pro";
    case "enterprise":
      return "Enterprise";
    default:
      return "Free";
  }
}

function mapStatus(value?: string | null): Company["estado"] {
  switch ((value ?? "").toLowerCase()) {
    case "active":
      return "activa";
    case "trial":
      return "trial";
    case "disabled":
      return "suspendida";
    case "cancelled":
    case "canceled":
      return "cancelada";
    default:
      return "activa";
  }
}

function inferLogType(row: Record<string, unknown>): TipoLog {
  const content = [
    row.action,
    row.accion,
    row.event,
    row.level,
    row.message,
    row.status,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    content.includes("critical") ||
    content.includes("error") ||
    content.includes("failed") ||
    content.includes("fall")
  ) {
    return "critical";
  }

  if (
    content.includes("warn") ||
    content.includes("suspend") ||
    content.includes("risk")
  ) {
    return "warn";
  }

  if (
    content.includes("success") ||
    content.includes("updated") ||
    content.includes("created") ||
    content.includes("approved")
  ) {
    return "success";
  }

  return "info";
}

function mapAuditRow(row: Record<string, unknown>): AuditLogEntry {
  return {
    accion: String(
      row.action ??
        row.accion ??
        row.event ??
        row.message ??
        "Evento del sistema",
    ),
    actor: String(
      row.actor ?? row.actor_id ?? row.user_id ?? row.email ?? "system",
    ),
    empresa: String(
      row.company ?? row.empresa ?? row.entity_name ?? row.business_name ?? "-",
    ),
    ip: String(row.ip ?? row.ip_address ?? row.origin_ip ?? "-"),
    tiempo: formatRelativeDate(String(row.created_at ?? row.timestamp ?? "")),
    tipo: inferLogType(row),
  };
}

function mapDashboardAudit(row: AuditLogEntry): AuditEntry {
  return {
    accion: row.accion,
    empresa: row.empresa,
    ip: row.ip,
    tiempo: row.tiempo,
    tipo: row.tipo,
  };
}

function mapCompanyRow(row: Record<string, unknown>): Company & {
  mrr: number;
  ultimaActividad: string;
} {
  return {
    admin: String(
      row.adminName ?? row.admin_name ?? row.owner_name ?? "No disponible",
    ),
    estado: mapStatus(String(row.status ?? row.state ?? "")),
    fecha: formatRelativeDate(String(row.created_at ?? row.updated_at ?? "")),
    id: String(row.id ?? ""),
    mrr:
      typeof row.mrr === "number"
        ? row.mrr
        : typeof row.monthly_revenue === "number"
          ? row.monthly_revenue
          : 0,
    name: String(row.name ?? row.businessName ?? "Empresa sin nombre"),
    plan: mapPlan(String(row.plan ?? "")),
    ultimaActividad: formatRelativeDate(
      String(row.updated_at ?? row.last_activity_at ?? row.created_at ?? ""),
    ),
    uso: 0,
  };
}

export async function fetchSuperAdminDashboard(): Promise<DashboardPayload> {
  const [{ data: dashboard }, { data: companies }, { data: audit }] =
    await Promise.all([
      api.get<DashboardResponse>("/api/super/admin/dashboard"),
      api.get<PaginatedResponse>("/api/super/admin/companies", {
        params: { page: 1, limit: 100 },
      }),
      api.get<PaginatedResponse>("/api/super/admin/audit", {
        params: { page: 1, limit: 5 },
      }),
    ]);

  const companyList = companies.data.data.map((row) => mapCompanyRow(row));
  const companyMap = new Map(
    companyList.map((company) => [String(company.id), company]),
  );

  const recentCompanies = (dashboard.data.businesses ?? []).map((item) => {
    const company = companyMap.get(String(item.id));

    return {
      admin: item.adminName ?? company?.admin ?? "No disponible",
      estado: mapStatus(item.state ?? company?.estado),
      fecha: company?.fecha ?? "No disponible",
      id: item.id,
      name: item.businessName ?? company?.name ?? "Empresa sin nombre",
      plan: company?.plan ?? "Free",
      uso: company?.uso ?? 0,
    } satisfies Company;
  });

  const planCounts = companyList.reduce<Record<TipoPlan, number>>(
    (accumulator, company) => {
      accumulator[company.plan] += 1;
      return accumulator;
    },
    { Enterprise: 0, Free: 0, Pro: 0, Starter: 0 },
  );

  const planData: PlanDataPoint[] = [
    { color: "#334155", name: "Free", value: planCounts.Free },
    { color: "#0ea5e9", name: "Starter", value: planCounts.Starter },
    { color: "#06b6d4", name: "Pro", value: planCounts.Pro },
    { color: "#22d3ee", name: "Enterprise", value: planCounts.Enterprise },
  ];

  return {
    auditLog: audit.data.data.map((row) => mapDashboardAudit(mapAuditRow(row))),
    growthData: (dashboard.data.growth ?? []).map((point) => ({
      empresas: point.business ?? 0,
      ingresos: point.income ?? 0,
      mes: point.month ?? "-",
    })),
    planData,
    recentCompanies,
    stats: {
      activeBusiness: dashboard.data.kpis?.activeBusiness ?? 0,
      businessInFree: dashboard.data.kpis?.businessInFree ?? 0,
      disabledBusiness: dashboard.data.kpis?.disabledBusiness ?? 0,
      mrr: dashboard.data.kpis?.mrr ?? 0,
      openTickets: dashboard.data.kpis?.openTickets ?? 0,
      pendingInvoices: dashboard.data.kpis?.pendingInvoices ?? 0,
      pendingPayment: dashboard.data.kpis?.pendingPayment ?? 0,
      unAssignedTickets: dashboard.data.kpis?.unAssignedTickets ?? 0,
    },
  };
}

export async function fetchSuperAdminCompanies(search = "") {
  const { data } = await api.get<PaginatedResponse>(
    "/api/super/admin/companies",
    {
      params: {
        page: 1,
        limit: 100,
        ...(search ? { search } : {}),
      },
    },
  );

  return {
    companies: data.data.data.map((row) => mapCompanyRow(row)),
    total: data.data.total,
  };
}

export async function suspendSuperAdminCompany(companyId: string) {
  await api.patch(`/api/super/admin/companies/${companyId}/suspend`);
}

export async function fetchSuperAdminAudit() {
  const { data } = await api.get<PaginatedResponse>("/api/super/admin/audit", {
    params: { page: 1, limit: 100 },
  });

  return {
    entries: data.data.data.map((row) => mapAuditRow(row)),
    total: data.data.total,
  };
}

type BackendTicketStatus =
  | "iniciado"
  | "en progreso"
  | "finalizado"
  | "cancelado"
  | string;

interface BackendTicketRecord {
  id?: string | number;
  site?: string;
  equipment?: string;
  content_description?: string;
  tickets_status?: BackendTicketStatus;
  planning_status?: string | null;
  created_at?: string;
  scheduled_date?: string | null;
  assigned_admin_name?: string | null;
  assigned_technician_name?: string | null;
  img?: string | null;
}

interface BackendInvoiceRecord {
  id?: string | number;
  code?: string;
  amount?: number;
  status?: string;
  issued_at?: string;
  due_at?: string;
}

interface BackendDocumentRecord {
  id?: string | number;
  site?: string;
  type?: DocumentType;
  name?: string;
  uploaded_at?: string;
}

interface BackendNotificationRecord {
  id?: string | number;
  type?: ClientNotification["type"];
  title?: string;
  message?: string;
  read?: boolean;
  created_at?: string;
}

interface BackendTechNotificationRecord {
  id?: string | number;
  title?: string | null;
  message?: string | null;
  type?: string | null;
  read?: boolean | null;
  ticket_id?: string | null;
  created_at?: string | null;
  metadata?: TechNotification["metadata"];
}

interface BackendMaintenanceRecord {
  id?: string | number;
  performed_at?: string;
  technician?: string;
  equipment?: string;
  observations?: string;
}

const documentTypeLabel: Record<DocumentType, string> = {
  invoice: "Factura",
  receipt: "Recibo",
  warranty: "Garantia",
  handover: "Acta",
  manual: "Manual",
};

function mapTicketStatus(status?: BackendTicketStatus): Ticket["status"] {
  if (status === "en progreso") {
    return "in_progress";
  }

  if (status === "cancelado") {
    return "cancelled";
  }

  if (status === "finalizado") {
    return "resolved";
  }

  return "open";
}

function normalizeBackendTicket(
  record: BackendTicketRecord,
  fallback?: NewTicketInput,
): Ticket {
  return {
    id: String(record.id ?? `TCK-${Date.now()}`),
    site: record.site ?? fallback?.site ?? "",
    equipment: record.equipment ?? fallback?.equipment ?? "",
    description: record.content_description ?? fallback?.description ?? "",
    photoUrl: record.img ?? undefined,
    status: mapTicketStatus(record.tickets_status),
    rawStatus: record.tickets_status ?? "iniciado",
    planningStatus:
      record.planning_status === "planned" || record.planning_status === "rejected"
        ? record.planning_status
        : "pending",
    createdAt: record.created_at ?? new Date().toISOString(),
    scheduledDate: record.scheduled_date ?? undefined,
    assignedAdminName: record.assigned_admin_name ?? undefined,
    assignedTechnicianName: record.assigned_technician_name ?? undefined,
  };
}

function normalizeBackendInvoice(record: BackendInvoiceRecord): Invoice {
  return {
    id: String(record.id ?? ""),
    code: String(record.code ?? record.id ?? ""),
    amount: Number(record.amount ?? 0),
    status:
      record.status === "paid"
        ? "paid"
        : record.status === "overdue"
          ? "overdue"
          : "pending",
    issueDate: record.issued_at ?? new Date().toISOString(),
    dueDate: record.due_at ?? record.issued_at ?? new Date().toISOString(),
  };
}

function normalizeBackendDocument(record: BackendDocumentRecord): ClientDocument {
  return {
    id: String(record.id ?? ""),
    site: record.site ?? "Principal",
    type: (record.type ?? "manual") as DocumentType,
    name: record.name ?? "Documento",
    uploadedAt: record.uploaded_at ?? new Date().toISOString(),
  };
}

function normalizeBackendNotification(
  record: BackendNotificationRecord,
): ClientNotification {
  return {
    id: String(record.id ?? ""),
    type: record.type ?? "system_alert",
    title: record.title ?? "Notificacion",
    message: record.message ?? "",
    read: Boolean(record.read),
    createdAt: record.created_at ?? new Date().toISOString(),
  };
}

function normalizeBackendTechNotification(
  record: BackendTechNotificationRecord,
): TechNotification {
  return {
    id: String(record.id ?? ""),
    title: record.title ?? "Notificacion",
    message: record.message ?? "",
    type: record.type ?? "ticket_assignment",
    read: record.read ?? false,
    ticket_id: record.ticket_id ?? null,
    created_at: record.created_at ?? new Date().toISOString(),
    metadata: record.metadata ?? null,
  };
}

function normalizeBackendMaintenance(
  record: BackendMaintenanceRecord,
): MaintenanceRecord {
  return {
    id: String(record.id ?? ""),
    date: record.performed_at ?? new Date().toISOString(),
    technician: record.technician ?? "Tecnico",
    equipment: record.equipment ?? "Equipo",
    observations: record.observations ?? "",
  };
}

export const clientService = {
  async getSystemStatus(): Promise<SystemStatusData | null> {
    const { data } = await api.get<ApiResponse<SystemStatusData | null>>(
      "/api/client/v1/system/status",
    );

    return data.data;
  },

  async getTickets(): Promise<Ticket[]> {
    const { data } = await api.get<ApiResponse<BackendTicketRecord[]>>(
      "/api/client/v1/tickets",
    );

    return (data.data ?? []).map((record) => normalizeBackendTicket(record));
  },

  async createTicket(input: NewTicketInput): Promise<Ticket> {
    const response = await ticketsClientsService({
      site: input.site,
      equipment: input.equipment,
      description: input.description,
    });

    const record = Array.isArray(response.data) ? response.data[0] : undefined;
    return normalizeBackendTicket(record ?? {}, input);
  },

  async createTicketWithPhoto(formData: FormData): Promise<Ticket> {
    const photo = formData.get("photo");
    const input: NewTicketInput = {
      description: String(formData.get("description") ?? ""),
      equipment: String(formData.get("equipment") ?? ""),
      site: String(formData.get("site") ?? ""),
    };

    const response = await ticketsClientsService({
      ...input,
      photo: photo instanceof File ? photo : undefined,
    });

    const record = Array.isArray(response.data) ? response.data[0] : undefined;
    return normalizeBackendTicket(record ?? {}, input);
  },

  async getInvoices(): Promise<Invoice[]> {
    const { data } = await api.get<{ message: string; data: BackendInvoiceRecord[] }>(
      "/api/users/v1/invoices",
    );

    return (data.data ?? []).map(normalizeBackendInvoice);
  },

  async downloadInvoice(invoiceId: string): Promise<string> {
    const response = await api.get<Blob>(
      `/api/users/v1/invoices/${invoiceId}/download`,
      {
        responseType: "blob",
      },
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const objectUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = `factura-${invoiceId}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(objectUrl);

    return "Descarga iniciada.";
  },

  async getDocuments(): Promise<ClientDocument[]> {
    const { data } = await api.get<ApiResponse<BackendDocumentRecord[]>>(
      "/api/client/v1/documents",
    );

    return (data.data ?? []).map(normalizeBackendDocument);
  },

  async downloadDocument(documentId: string): Promise<string> {
    const { data } = await api.get<ApiResponse<{ url: string }>>(
      `/api/client/v1/documents/${documentId}/download`,
    );

    if (data.data?.url) {
      window.open(data.data.url, "_blank", "noopener,noreferrer");
    }

    return "Descarga iniciada.";
  },

  async getNotifications(): Promise<ClientNotification[]> {
    const { data } = await api.get<ApiResponse<BackendNotificationRecord[]>>(
      "/api/client/v1/notifications",
    );

    return (data.data ?? [])
      .map(normalizeBackendNotification)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await api.patch(`/api/client/v1/notifications/${notificationId}/read`);
  },

  async getMaintenanceHistory(
    fromDate?: string,
    toDate?: string,
  ): Promise<MaintenanceRecord[]> {
    const { data } = await api.get<ApiResponse<BackendMaintenanceRecord[]>>(
      "/api/client/v1/maintenance",
      {
        params: {
          ...(fromDate ? { from: fromDate } : {}),
          ...(toDate ? { to: toDate } : {}),
        },
      },
    );

    return (data.data ?? []).map(normalizeBackendMaintenance);
  },

  getDocumentTypeLabel(type: DocumentType): string {
    return documentTypeLabel[type];
  },

  getMissingSystemStatusMessage() {
    return "";
  },

  getMissingInvoicesMessage() {
    return "";
  },

  getMissingMaintenanceMessage() {
    return "";
  },
};
