export type CameraStatus = "online" | "offline" | "maintenance";

export interface Camera {
  id: string;
  name: string;
  location: string;
  status: CameraStatus;
  lastUpdate: string;
  ipAddress?: string;
}

export interface NVR {
  id: string;
  name: string;
  status: "online" | "offline";
  storageUsed: number;
  storageTotal: number;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  date: string;
}

export interface ClientSummary {
  totalCameras: number;
  onlineCameras: number;
  offlineCameras: number;
  maintenanceCameras: number;
}