import type { Camera } from "../types/client.types";

interface CameraStatusCardProps {
  camera: Camera;
}

const statusStyles: Record<Camera["status"], string> = {
  online: "bg-green-100 text-green-700 border-green-200",
  offline: "bg-red-100 text-red-700 border-red-200",
  maintenance: "bg-amber-100 text-amber-700 border-amber-200",
};

const CameraStatusCard = ({ camera }: CameraStatusCardProps) => (
  <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <header className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-800">{camera.name}</h3>
      <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${statusStyles[camera.status]}`}>
        {camera.status}
      </span>
    </header>
    <p className="mt-2 text-xs text-gray-500">{camera.site}</p>
    <p className="mt-2 text-xs text-gray-500">Ultima actividad: {new Date(camera.lastSeen).toLocaleString()}</p>
  </article>
);

export default CameraStatusCard;
