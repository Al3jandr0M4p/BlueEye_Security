import type {
  Camera,
  NVRDevice,
  SystemAlert,
  DashboardSummary,
} from "../types/clientDashboard.types";

// ─── Mock Cameras ─────────────────────────────────────────────────────────────
// TODO: Replace with GET ${import.meta.env.VITE_API_URL}/client/cameras
export const mockCameras: Camera[] = [
  {
    id: 1,
    name: "CAM-001",
    location: "Entrada Principal",
    status: "online",
    ip: "192.168.1.101",
    uptime: "99.8%",
    resolution: "4K",
    lastSeen: "Ahora",
  },
  {
    id: 2,
    name: "CAM-002",
    location: "Estacionamiento A",
    status: "online",
    ip: "192.168.1.102",
    uptime: "98.2%",
    resolution: "1080p",
    lastSeen: "Ahora",
  },
  {
    id: 3,
    name: "CAM-003",
    location: "Pasillo Norte",
    status: "offline",
    ip: "192.168.1.103",
    uptime: "0%",
    resolution: "1080p",
    lastSeen: "Hace 18h",
  },
  {
    id: 4,
    name: "CAM-004",
    location: "Sala de Servidores",
    status: "online",
    ip: "192.168.1.104",
    uptime: "100%",
    resolution: "4K",
    lastSeen: "Ahora",
  },
  {
    id: 5,
    name: "CAM-005",
    location: "Perímetro Oeste",
    status: "maintenance",
    ip: "192.168.1.105",
    uptime: "N/A",
    resolution: "2K",
    lastSeen: "Hace 2d",
  },
  {
    id: 6,
    name: "CAM-006",
    location: "Acceso Bodega",
    status: "online",
    ip: "192.168.1.106",
    uptime: "97.5%",
    resolution: "1080p",
    lastSeen: "Ahora",
  },
];

// ─── Mock NVR ─────────────────────────────────────────────────────────────────
// TODO: Replace with GET ${import.meta.env.VITE_API_URL}/client/nvr
export const mockNVR: NVRDevice = {
  id: 1,
  name: "NVR Principal",
  model: "Dahua XVR5108HS",
  ip: "192.168.1.10",
  status: "online",
  storageUsedPercent: 87,
  storageTotalTB: 4,
  temperatureCelsius: 42,
  firmware: "v3.4.2",
  channels: 8,
  activeChannels: 6,
};

// ─── Mock Alerts ──────────────────────────────────────────────────────────────
// TODO: Replace with GET ${import.meta.env.VITE_API_URL}/client/alerts
export const mockAlerts: SystemAlert[] = [
  {
    id: 1,
    severity: "critical",
    category: "connectivity",
    title: "Cámara sin señal",
    description:
      "CAM-003 (Pasillo Norte) está offline desde hace 18 horas. Se generó ticket automático.",
    timestamp: "Hace 18h",
    deviceName: "CAM-003",
    resolved: false,
  },
  {
    id: 2,
    severity: "warning",
    category: "storage",
    title: "Almacenamiento crítico",
    description:
      "NVR Principal al 87% de capacidad. Se recomienda revisar la retención de grabaciones.",
    timestamp: "Hace 3d",
    deviceName: "NVR Principal",
    resolved: false,
  },
  {
    id: 3,
    severity: "info",
    category: "maintenance",
    title: "Mantenimiento programado",
    description:
      "Visita técnica preventiva el 25 Feb 2025 entre 9:00–12:00 am.",
    timestamp: "Hace 2d",
    deviceName: "Sistema completo",
    resolved: false,
  },
];

// ─── Mock Summary ─────────────────────────────────────────────────────────────
// TODO: Replace with GET ${import.meta.env.VITE_API_URL}/client/summary
export const mockSummary: DashboardSummary = {
  totalCameras: 6,
  onlineCameras: 4,
  offlineCameras: 1,
  maintenanceCameras: 1,
  systemUptime: "98.2%",
  activeAlerts: 2,
  openTickets: 2,
};