import React from "react";

export type Role = "usuario" | "tecnico" | "admin" | "superAdmin";

export type UserProfile = {
  rolename: Role;
  username: string;
};

export interface DecodedJWT {
  sub: string;
  email?: string;
  username: string;
  rolename: Role;
  exp: number;
  iat: number;
}

export interface SignInResponse {
  data: {
    user: DecodedJWT;
    session: SessionData;
    profile: UserProfile | null;
  };
  error: string | null;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className: string;
}

export interface LandingCardProps {
  children: React.ReactNode;
  className: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  businessName: string;
  country: string;
  currency: string;
  username: string;
  taxId: string;
  phone: string;
  logo: File;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onValueChange: (value: string) => void;
  text: string;
  type: string;
  translationKey: string;
  error?: string;
  variant: "default" | "unstyled";
}

export interface SessionData {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export interface AuthState {
  user: DecodedJWT | null;
  session: SessionData | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string | null;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  newPassword: string;
  access_token: string;
  refresh_token: string;
}

export interface RestCountry {
  name: {
    common: string;
  };
  cca2: string;
  idd: {
    root?: string;
    suffixes?: string[];
  };
  currencies?: Record<
    string,
    {
      name: string;
      symbol?: string;
    }
  >;
}

export interface CountryOption {
  name: string;
  code: string;
  dialCodes: string[];
  currencies: string[];
}

export interface FormComponentProps {
  handleSubmit: (e: React.FormEvent<Element>) => Promise<void>;
  handleLogoChange: (file: File | null) => void;
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  logoPreview: string | null;
  isLoading: boolean;
  isDisabledSubmit: boolean;
}

export interface FormComponentFirstProps {
  email: string;
  password: string;
  username: string;
  businessName: string;
  isOnline: boolean;
  currencyOptions: {
    value: string;
    label: string;
  }[];
  dialCodeOptions: {
    value: string;
    label: string;
  }[];
  countryOptions: {
    value: string;
    label: string;
  }[];
  phone: string;
  taxId: string;
  isDisabledFirst: boolean;
  currency: string;
  country: string;
  dialCode: string;
  taxIdError: string;
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setBusinessName: React.Dispatch<React.SetStateAction<string>>;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setTaxId: React.Dispatch<React.SetStateAction<string>>;
  setDialCode: React.Dispatch<React.SetStateAction<string>>;
  handlePhoneChange: (value: string) => void;
}

export interface RegisterResponse {
  message: string;
  data: {
    userId: string | null;
    businessId: string | null;
  };
}

export interface ComingSoonModalProps {
  setOpenModal: (v: boolean) => void;
}

export interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  hasArrow?: boolean;
}

export interface ActivityItem {
  id: number;
  title: string;
  highlight: string;
  date: string;
}

export interface AdminAddUsersModalProps {
  selectedType: UserRoleTab;
  setIsAddUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onBackToTypeSelection: () => void;
  onCreated?: () => Promise<void> | void;
}

export interface AdminSelectUserTypeModalProps {
  onSelectType: (type: UserRoleTab) => void;
  setIsAddUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CreateAdminPayload {
  email: string;
  rolename: UserRoleTab;
  username?: string;
  fullName?: string;
  phone?: string;
  city?: string;
  businessId?: string;
}

export interface ConfigureUserAccountPayload {
  username: string;
  invitationToken?: string;
}

export type UserRoleTab = "usuario" | "tecnico";

export type UserCard = {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  image: string;
};

export interface AdminManagedUser extends UserCard {
  rolename: UserRoleTab;
  username: string;
  isActive: boolean;
  pictureUrl?: string;
}

export type LocationState = {
  user?: AdminManagedUser;
  userType?: UserRoleTab;
};

export interface AdminUserUpdatePayload {
  email?: string;
  phone?: string;
  password?: string;
}

export interface AdminDashboardStats {
  message: string;
  data: {
    totalClients: number;
    totalTechnicians: number;
    openTickets: number;
    pendingPlanning: number;
    totalSites: number;
    totalInventoryProducts: number;
  };
}

export interface AdminSummaryStat {
  label: string;
  value: number;
  detail: string;
}

export interface AdminClientProfile {
  id?: string;
  name: string;
  type: "hogar" | "comercio" | "empresa";
  sites: number;
  status: string;
  nextVisit: string;
  tags: string[];
  image: string;
  primaryContact: string;
  plan: string;
  nextAudit: string;
}

export interface AdminClientOverview {
  stats: AdminSummaryStat[];
  clients: AdminClientProfile[];
}

export interface AdminBusinessLimit {
  label: string;
  used: number;
  limit: number;
}

export interface AdminTenant {
  name: string;
  timezone: string;
  currency: string;
  status: string;
}

export interface AdminSecurityCheck {
  title: string;
  detail: string;
  status: string;
}

export interface AdminBusinessOverview {
  currentPlan: string;
  renewalDate: string;
  currency: string;
  limits: AdminBusinessLimit[];
  tenants: AdminTenant[];
  security: AdminSecurityCheck[];
}

export interface AdminProjectPhase {
  phase: string;
  count: number;
  completion: number;
}

export interface AdminProjectItem {
  name: string;
  client: string;
  status: string;
  nextMilestone: string;
  notes: string;
  dueDate: string;
}

export interface AdminSurveyEvidence {
  label: string;
  value: string;
}

export interface AdminSurveyChecklistItem {
  label: string;
  status: string;
}

export interface AdminAiQuoteLineItem {
  concept: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
}

export interface AdminAiQuote {
  generatedFor: string;
  scope: string;
  complexity: string;
  estimatedTime: string;
  subtotal: string;
  installation: string;
  aiAdjustment: string;
  total: string;
  rationale: string;
  lineItems: AdminAiQuoteLineItem[];
}

export interface AdminSurveyReport {
  ticketId: string;
  projectName: string;
  client: string;
  site: string;
  placeType: string;
  technician: string;
  surveyDate: string;
  status: string;
  summary: string;
  zoneCoverage: string[];
  infrastructure: string[];
  risks: string[];
  recommendations: string[];
  evidence: AdminSurveyEvidence[];
  checklist: AdminSurveyChecklistItem[];
  proposedDevices: string[];
  nextStep: string;
  aiQuote: AdminAiQuote;
}

export interface AdminProjectOverview {
  projectCount: number;
  phaseStats: AdminProjectPhase[];
  activeProjects: AdminProjectItem[];
  surveyReports: AdminSurveyReport[];
}

export interface AdminSurvey {
  site: string;
  zone: string;
  objective: string;
  risks: string[];
  nextSteps: string;
  measurements: string;
  networkStatus: string;
  timeline: string;
}

export interface AdminStorageRecommendation {
  cameras: number;
  resolution: string;
  codec: string;
  retentionDays: number;
  recommendedDisk: string;
  nvr: string;
}

export interface AdminPreProjectOverview {
  surveys: AdminSurvey[];
  storageRecommendations: AdminStorageRecommendation[];
}

export interface AdminCategory {
  name: string;
  items: number;
  description: string;
  recommended: string;
}

export interface AdminCatalogOverview {
  categories: AdminCategory[];
  compatibilityAlerts: string[];
  cameraCatalog: AdminCameraCatalogItem[];
  motionSensorCatalog: AdminMotionSensorCatalogItem[];
}

export interface AdminCameraCatalogItem {
  name: string;
  type: string;
  resolution: string;
  sts?: string;
  lens: string;
  poe: boolean;
  onvif: boolean;
  nightVision: string;
  description: string;
  image: string;
  price: string;
  stock: number;
  features: string[];
}

export interface AdminMotionSensorCatalogItem {
  name: string;
  coverage: string;
  detection: string;
  connectivity: string;
  installation: string;
  description: string;
  image: string;
  price: string;
  stock: number;
  idealFor: string[];
  features: string[];
}

export interface AdminStockLevel {
  material: string;
  current: number;
  minimum: number;
  location: string;
  status: string;
}

export interface AdminInventoryProduct {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  stock: number;
  minimum: number;
  location: string;
  image: string;
  description: string;
  specLineA: string;
  specLineB: string;
  specLineC: string;
  chips: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminInventoryMovement {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  movementType: "in" | "out";
  reason: string;
  reference: string;
  createdAt: string;
}

export interface AdminInventorySummary {
  totalProducts: number;
  totalUnits: number;
  lowStock: number;
  totalValue: number;
}

export interface AdminInventoryOverview {
  summary: AdminInventorySummary;
  products: AdminInventoryProduct[];
  stockLevels: AdminStockLevel[];
  alerts: string[];
  recentMovements: AdminInventoryMovement[];
  lastUpdated: string | null;
}

export interface AdminPriorityTicket {
  priority: string;
  count: number;
}

export interface AdminSlaTarget {
  type: string;
  target: string;
  breached: number;
}

export interface AdminDeviceRequest {
  name: string;
  quantity: number;
  status: string;
}

export interface AdminTechnician {
  id: string;
  name: string;
  role: string;
  location: string;
  status: string;
  expertise: string[];
  nextAvailable: string;
}

export interface AdminTicket {
  id: string;
  site: string;
  status: string;
  assignedTo: string;
  summary: string;
  priority: string;
  createdAt: string;
  slaDue: string;
  requestedBy: string;
  devices: AdminDeviceRequest[];
  tags: string[];
  scheduledDate?: string;
  image?: string;
}


export interface AdminQuote {
  id: string;
  status: string;
  total: string;
  client: string;
  sentDate: string;
}

export interface AdminPaymentDue {
  client: string;
  amount: string;
  dueDate: string;
  method: string;
}

export interface AdminOrder {
  id: string;
  status: string;
  nextAction: string;
  scheduled: string;
}

export interface AdminReportCard {
  title: string;
  metric: string;
  trend: string;
  details: string;
}

export interface AdminReportExport {
  type: string;
  lastExported: string;
  format: string;
  rows: Record<string, string | number>[];
}

export interface AdminTrendPoint {
  month: string;
  tickets: number;
  planned: number;
  stockFlow: number;
}

export interface AdminMixPoint {
  name: string;
  value: number;
}

export interface AdminReportsOverview {
  reports: AdminReportCard[];
  monthlyTrend: AdminTrendPoint[];
  mix: AdminMixPoint[];
  exports: AdminReportExport[];
}

export interface CreateInventoryProductPayload {
  name: string;
  category: string;
  subcategory?: string;
  price?: number;
  stock?: number;
  minimum?: number;
  location?: string;
  image?: string;
  description?: string;
  specLineA?: string;
  specLineB?: string;
  specLineC?: string;
  chips?: string[];
}

export interface CreateInventoryMovementPayload {
  quantity: number;
  movementType: "in" | "out";
  reason?: string;
  reference?: string;
}

export interface UpdateInventoryProductPayload {
  name?: string;
  category?: string;
  subcategory?: string;
  price?: number;
  stock?: number;
  minimum?: number;
  location?: string;
  image?: string;
  description?: string;
  specLineA?: string;
  specLineB?: string;
  specLineC?: string;
  chips?: string[];
}

export type ApiResponse<T> = {
  success: boolean;
  data: T;
}

export interface TicketsBody {
  site: string;
  equipment: string;
  description: string;
  photo?: File | string;
}
