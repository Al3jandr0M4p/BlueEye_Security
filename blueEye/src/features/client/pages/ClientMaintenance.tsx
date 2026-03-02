import { useCallback, useEffect, useState, type FormEvent } from "react";
import MaintenanceHistory from "../components/MaintenanceHistory";
import { clientService } from "../services/client.service";
import type { MaintenanceRecord } from "../types/client.types";

const ClientMaintenance = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadHistory = useCallback(async (from?: string, to?: string) => {
    const data = await clientService.getMaintenanceHistory(from, to);
    setRecords(data);
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const applyFilter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await loadHistory(fromDate || undefined, toDate || undefined);
  };

  return (
    <section className="space-y-6 p-4">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Historial de mantenimiento</h1>
        <p className="text-sm text-gray-600">Seguimiento de intervenciones tecnicas realizadas.</p>
      </header>

      <form onSubmit={applyFilter} className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <div>
          <label htmlFor="from-date" className="mb-1 block text-sm font-medium text-gray-700">
            Desde
          </label>
          <input
            id="from-date"
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="to-date" className="mb-1 block text-sm font-medium text-gray-700">
            Hasta
          </label>
          <input
            id="to-date"
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          Filtrar
        </button>
      </form>

      <MaintenanceHistory records={records} />
    </section>
  );
};

export default ClientMaintenance;
