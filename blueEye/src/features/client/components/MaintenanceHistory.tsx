import type { MaintenanceRecord } from "../types/client.types";

interface MaintenanceHistoryProps {
  records: MaintenanceRecord[];
}

const MaintenanceHistory = ({ records }: MaintenanceHistoryProps) => (
  <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <h2 className="mb-4 text-lg font-semibold text-gray-800">Historial de mantenimiento</h2>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-600">
            <th className="pb-2 font-medium">Fecha</th>
            <th className="pb-2 font-medium">Tecnico</th>
            <th className="pb-2 font-medium">Equipo</th>
            <th className="pb-2 font-medium">Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-b border-gray-100 align-top">
              <td className="py-3 text-gray-700">{new Date(record.date).toLocaleDateString()}</td>
              <td className="py-3 text-gray-700">{record.technician}</td>
              <td className="py-3 text-gray-700">{record.equipment}</td>
              <td className="py-3 text-gray-700">{record.observations}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {records.length === 0 && <p className="mt-4 text-sm text-gray-500">No hay registros para ese rango de fecha.</p>}
  </section>
);

export default MaintenanceHistory;
