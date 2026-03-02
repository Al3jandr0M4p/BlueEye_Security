import type {
  Camera,
  ClientDocument,
  ClientNotification,
  DocumentType,
  Invoice,
  MaintenanceRecord,
  NewTicketInput,
  SystemStatusData,
  Ticket,
} from "../types/client.types";

const sites = ["HQ Santo Domingo", "Sucursal Norte", "Planta Este"];

const cameraSeeds: Camera[] = [
  { id: "cam-01", name: "Lobby", site: sites[0], status: "online", lastSeen: "2026-03-02T08:20:00Z" },
  { id: "cam-02", name: "Parking A", site: sites[0], status: "online", lastSeen: "2026-03-02T08:20:00Z" },
  { id: "cam-03", name: "Warehouse 1", site: sites[1], status: "offline", lastSeen: "2026-03-02T08:10:00Z" },
  { id: "cam-04", name: "Gate 2", site: sites[1], status: "maintenance", lastSeen: "2026-03-02T08:05:00Z" },
  { id: "cam-05", name: "Production Line", site: sites[2], status: "online", lastSeen: "2026-03-02T08:20:00Z" },
  { id: "cam-06", name: "Shipping Dock", site: sites[2], status: "online", lastSeen: "2026-03-02T08:20:00Z" },
];

let mockCameras = [...cameraSeeds];

let mockTickets: Ticket[] = [
  {
    id: "TCK-1001",
    site: sites[0],
    equipment: "NVR Principal",
    description: "Latencia alta en grabación nocturna",
    status: "in_progress",
    createdAt: "2026-02-27T10:32:00Z",
  },
  {
    id: "TCK-1002",
    site: sites[1],
    equipment: "Cam-03 Warehouse 1",
    description: "Cámara fuera de línea desde madrugada",
    status: "open",
    createdAt: "2026-03-01T06:55:00Z",
  },
];

const mockInvoices: Invoice[] = [
  {
    id: "inv-01",
    code: "INV-2026-001",
    amount: 1490,
    status: "paid",
    issueDate: "2026-01-05",
    dueDate: "2026-01-20",
  },
  {
    id: "inv-02",
    code: "INV-2026-002",
    amount: 1490,
    status: "pending",
    issueDate: "2026-02-05",
    dueDate: "2026-02-20",
  },
  {
    id: "inv-03",
    code: "INV-2026-003",
    amount: 1610,
    status: "overdue",
    issueDate: "2026-02-28",
    dueDate: "2026-03-01",
  },
];

const mockDocuments: ClientDocument[] = [
  { id: "doc-01", site: sites[0], type: "invoice", name: "Factura Enero 2026", uploadedAt: "2026-01-05" },
  { id: "doc-02", site: sites[0], type: "receipt", name: "Recibo Enero 2026", uploadedAt: "2026-01-21" },
  { id: "doc-03", site: sites[1], type: "warranty", name: "Garantia NVR Norte", uploadedAt: "2025-11-14" },
  { id: "doc-04", site: sites[1], type: "handover", name: "Acta Entrega Fase 2", uploadedAt: "2025-12-03" },
  { id: "doc-05", site: sites[2], type: "manual", name: "Manual Operacion Camaras", uploadedAt: "2025-10-10" },
];

let mockNotifications: ClientNotification[] = [
  {
    id: "not-01",
    type: "invoice",
    title: "Factura pendiente",
    message: "La factura INV-2026-002 vence en 2 dias.",
    read: false,
    createdAt: "2026-03-01T14:00:00Z",
  },
  {
    id: "not-02",
    type: "ticket",
    title: "Ticket actualizado",
    message: "El ticket TCK-1001 paso a en progreso.",
    read: false,
    createdAt: "2026-03-01T16:10:00Z",
  },
  {
    id: "not-03",
    type: "system_alert",
    title: "Alerta de sistema",
    message: "Cam-03 se encuentra fuera de linea.",
    read: true,
    createdAt: "2026-03-02T05:20:00Z",
  },
];

const mockMaintenance: MaintenanceRecord[] = [
  {
    id: "mnt-01",
    date: "2026-01-12",
    technician: "Luis Perez",
    equipment: "NVR Principal",
    observations: "Actualizacion de firmware y limpieza de logs.",
  },
  {
    id: "mnt-02",
    date: "2026-02-03",
    technician: "Ana Gomez",
    equipment: "Cam-04 Gate 2",
    observations: "Reemplazo de conector PoE.",
  },
  {
    id: "mnt-03",
    date: "2026-02-26",
    technician: "Diego Martinez",
    equipment: "Switch Core Norte",
    observations: "Ajuste de VLAN y pruebas de estabilidad.",
  },
];

const randomStatus = (): Camera["status"] => {
  const roll = Math.random();
  if (roll < 0.72) return "online";
  if (roll < 0.9) return "offline";
  return "maintenance";
};

const evolveCameras = (): Camera[] =>
  mockCameras.map((camera) => {
    if (Math.random() < 0.2) {
      return {
        ...camera,
        status: randomStatus(),
        lastSeen: new Date().toISOString(),
      };
    }
    return camera;
  });

const buildSystemSummary = (cameras: Camera[]): SystemStatusData["summary"] => {
  const onlineCameras = cameras.filter((camera) => camera.status === "online").length;
  const offlineCameras = cameras.filter((camera) => camera.status === "offline").length;
  const maintenanceCount = cameras.filter((camera) => camera.status === "maintenance").length;

  const activeAlerts = offlineCameras + maintenanceCount;
  const nvrStatus = offlineCameras > 2 ? "offline" : activeAlerts > 0 ? "degraded" : "online";

  return {
    totalCameras: cameras.length,
    onlineCameras,
    offlineCameras,
    activeAlerts,
    nvrStatus,
  };
};

const mockLatency = async <T>(result: T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(result), 220);
  });

const documentTypeLabel: Record<DocumentType, string> = {
  invoice: "Factura",
  receipt: "Recibo",
  warranty: "Garantia",
  handover: "Acta",
  manual: "Manual",
};

export const clientService = {
  async getSystemStatus(): Promise<SystemStatusData> {
    mockCameras = evolveCameras();
    return mockLatency({
      summary: buildSystemSummary(mockCameras),
      cameras: mockCameras,
    });
  },

  async getTickets(): Promise<Ticket[]> {
    return mockLatency([...mockTickets].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },

  async createTicket(input: NewTicketInput): Promise<Ticket> {
    const ticket: Ticket = {
      id: `TCK-${1000 + mockTickets.length + 1}`,
      site: input.site,
      equipment: input.equipment,
      description: input.description,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    mockTickets = [ticket, ...mockTickets];

    mockNotifications = [
      {
        id: `not-${mockNotifications.length + 1}`,
        type: "ticket",
        title: "Nuevo ticket recibido",
        message: `Se registro ${ticket.id} para ${ticket.equipment}.`,
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...mockNotifications,
    ];

    return mockLatency(ticket);
  },

  async getInvoices(): Promise<Invoice[]> {
    return mockLatency(mockInvoices);
  },

  async downloadInvoice(invoiceId: string): Promise<string> {
    return mockLatency(`Descarga simulada para factura ${invoiceId}`);
  },

  async getDocuments(): Promise<ClientDocument[]> {
    return mockLatency(mockDocuments);
  },

  async downloadDocument(documentId: string): Promise<string> {
    return mockLatency(`Descarga simulada para documento ${documentId}`);
  },

  async getNotifications(): Promise<ClientNotification[]> {
    return mockLatency([...mockNotifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    mockNotifications = mockNotifications.map((notification) =>
      notification.id === notificationId ? { ...notification, read: true } : notification,
    );
    await mockLatency(undefined);
  },

  async getMaintenanceHistory(fromDate?: string, toDate?: string): Promise<MaintenanceRecord[]> {
    const filtered = mockMaintenance.filter((entry) => {
      const isAfterFrom = fromDate ? entry.date >= fromDate : true;
      const isBeforeTo = toDate ? entry.date <= toDate : true;
      return isAfterFrom && isBeforeTo;
    });
    return mockLatency(filtered);
  },

  getDocumentTypeLabel(type: DocumentType): string {
    return documentTypeLabel[type];
  },
};
