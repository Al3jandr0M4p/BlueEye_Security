export type CameraStatus = "online" | "offline" | "maintenance";

export interface Camera {
  id: string;
  name: string;
  site: string;
  status: CameraStatus;
  lastSeen: string;
}

export interface SystemStatusData {
  summary: {
    totalCameras: number;
    onlineCameras: number;
    offlineCameras: number;
    activeAlerts: number;
    nvrStatus: "online" | "degraded" | "offline";
  };
  cameras: Camera[];
}

export type DocumentType = "invoice" | "receipt" | "warranty" | "handover" | "manual";

export interface ClientDocument {
  id: string;
  site: string;
  type: DocumentType;
  name: string;
  uploadedAt: string;
}

export interface Invoice {
  id: string;
  code: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  issueDate: string;
  dueDate: string;
}

export interface Ticket {
  id: string;
  site: string;
  equipment: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  createdAt: string;
}

export interface NewTicketInput {
  site: string;
  equipment: string;
  description: string;
}

export interface ClientNotification {
  id: string;
  type: "invoice" | "ticket" | "system_alert";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ← Tipo que faltaba
export interface MaintenanceRecord {
  id: string;
  date: string;
  technician: string;
  equipment: string;
  observations: string;
}