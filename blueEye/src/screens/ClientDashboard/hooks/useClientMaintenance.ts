import { useCallback, useEffect, useState } from "react";
import { clientService } from "../../../service/service";
import type { MaintenanceRecord } from "../../../types/client.types";

export function useClientMaintenance() {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [integrationNote, setIntegrationNote] = useState("");
  const [toDate, setToDate] = useState("");

  const loadHistory = useCallback(async (from?: string, to?: string) => {
    const data = await clientService.getMaintenanceHistory(from, to);
    setRecords(data);
  }, []);

  useEffect(() => {
    const initialize = async () => {
      await loadHistory();
      setIntegrationNote(clientService.getMissingMaintenanceMessage());
    };
    initialize();
  }, [loadHistory]);

  const applyFilter = useCallback(async () => {
    await loadHistory(fromDate || undefined, toDate || undefined);
  }, [fromDate, loadHistory, toDate]);

  return {
    applyFilter,
    fromDate,
    integrationNote,
    records,
    setFromDate,
    setToDate,
    toDate,
  };
}
