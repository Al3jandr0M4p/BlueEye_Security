// ─── Camera ───────────────────────────────────────────────────────────────────
export type CameraStatus = "online" | "offline" | "maintenance";
export type CameraResolution = "4K" | "2K" | "1080p" | "720p";

export interface Camera {
  id: number;
  name: string;
  location: string;
  status: CameraStatus;
  ip: string;
  uptime: string;
  resolution: CameraResolution;
  lastSeen: string;
}

// ─── NVR / DVR ────────────────────────────────────────────────────────────────
export type NVRStatus = "online" | "offline" | "degraded";

export interface NVRDevice {
  id: number;
  name: string;
  model: string;
  ip: string;
  status: NVRStatus;
  storageUsedPercent: number;
  storageTotalTB: number;
  temperatureCelsius: number;
  firmware: string;
  channels: number;
  activeChannels: number;
}

// ─── Alerts ───────────────────────────────────────────────────────────────────
export type AlertSeverity = "critical" | "warning" | "info";
export type AlertCategory =
  | "storage"
  | "connectivity"
  | "hardware"
  | "maintenance";

export interface SystemAlert {
  id: number;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  description: string;
  timestamp: string;
  deviceName: string;
  resolved: boolean;
}

// ─── Dashboard Summary ────────────────────────────────────────────────────────
export interface DashboardSummary {
  totalCameras: number;
  onlineCameras: number;
  offlineCameras: number;
  maintenanceCameras: number;
  systemUptime: string;
  activeAlerts: number;
  openTickets: number;
}
