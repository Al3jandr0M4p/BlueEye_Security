export type CameraStatus = "online" | "offline" | "maintenance";

export interface Camera {
  id: string;
  name: string;
  site: string;
  status: CameraStatus;
  lastSeen: string;
}

export type NvrStatus = "online" | "degraded" | "offline";

export interface SystemSummary {
  totalCameras: number;
  onlineCameras: number;
  offlineCameras: number;
  activeAlerts: number;
  nvrStatus: NvrStatus;
}

export interface SystemStatusData {
  summary: SystemSummary;
  cameras: Camera[];
}

export type TicketStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "cancelled";

export type TicketPlanningStatus =
  | "pending"
  | "planned"
  | "rejected"
  | "unassigned";

export interface Ticket {
  id: string;
  site: string;
  equipment: string;
  description: string;
  photoUrl?: string;
  status: TicketStatus;
  rawStatus?: string;
  planningStatus?: TicketPlanningStatus;
  createdAt: string;
  scheduledDate?: string;
  assignedAdminName?: string;
  assignedTechnicianName?: string;
}

export interface NewTicketInput {
  site: string;
  equipment: string;
  description: string;
}

export type InvoiceStatus = "paid" | "pending" | "overdue";

export interface Invoice {
  id: string;
  code: string;
  amount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
}

export type DocumentType = "invoice" | "receipt" | "warranty" | "handover" | "manual";

export interface ClientDocument {
  id: string;
  site: string;
  type: DocumentType;
  name: string;
  uploadedAt: string;
}

export type NotificationType = "invoice" | "ticket" | "system_alert";

export interface ClientNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  technician: string;
  equipment: string;
  observations: string;
}
