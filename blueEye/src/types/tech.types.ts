export type TechTicketStatus =
  | "iniciado"
  | "en progreso"
  | "finalizado"
  | "cancelado";

export type TechTicket = {
  id: string;
  user_id?: string | null;
  site_id?: string | null;
  site?: string | null;
  equipment?: string | null;
  content_description?: string | null;
  tickets_status?: TechTicketStatus | null;
  planning_status?: string | null;
  scheduled_date?: string | null;
  technician_notes?: string | null;
  requester_name?: string | null;
  admin_name?: string | null;
  img?: string | null;
  created_at?: string | null;
};

export type TechNotificationType = "ticket_assignment" | "ticket_update" | string;

export type TechNotification = {
  id: string;
  title?: string | null;
  message?: string | null;
  type?: TechNotificationType | null;
  read?: boolean | null;
  ticket_id?: string | null;
  created_at?: string | null;
  metadata?: {
    assignedBy?: string;
    requesterName?: string;
    scheduledDate?: string;
    site?: string | null;
    equipment?: string | null;
  } | null;
};

export type TechSite = {
  id: string;
  client_id?: string | null;
  client_name?: string | null;
  name?: string | null;
  address?: string | null;
  type?: string | null;
  created_at?: string | null;
};

export type TechSurveyStatus = "draft" | "submitted";

export type TechSurvey = {
  id: string;
  business_id?: string | null;
  site_id?: string | null;
  ticket_id?: string | null;
  created_by?: string | null;
  title?: string | null;
  status?: TechSurveyStatus | null;
  objectives?: string | null;
  risks?: string | null;
  measurements?: Record<string, unknown> | null;
  power_status?: string | null;
  network_status?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type TechSurveyPoint = {
  id: string;
  survey_id?: string | null;
  zone?: string | null;
  height?: string | null;
  angle?: string | null;
  camera_suggestion?: string | null;
  notes?: string | null;
  created_at?: string | null;
};

export type TechSurveyUpdate = {
  id: string;
  survey_id?: string | null;
  status?: string | null;
  title?: string | null;
  details?: string | null;
  created_at?: string | null;
};

export type TechSurveyRequirement = {
  id: string;
  survey_id?: string | null;
  category?: string | null;
  item_name?: string | null;
  quantity?: number | null;
  unit_price?: number | null;
  install_area?: string | null;
  notes?: string | null;
  created_at?: string | null;
};

export type TechCatalogProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string | null;
};

export type TechSurveyPhoto = {
  id: string;
  survey_id?: string | null;
  url?: string | null;
  created_at?: string | null;
};
