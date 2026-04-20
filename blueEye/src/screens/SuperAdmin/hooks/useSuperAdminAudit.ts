import { useEffect, useMemo, useState } from "react";
import { fetchSuperAdminAudit } from "../../../service/service";
import type { AuditLogEntry, EventsPoint } from "../../../types/superAdmin.types";

export function useSuperAdminAudit() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAudit = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSuperAdminAudit();
        if (!mounted) return;

        setEntries(data.entries);
        setTotal(data.total);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError("No se pudo cargar la auditoria.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void loadAudit();

    return () => {
      mounted = false;
    };
  }, []);

  const events = useMemo<EventsPoint[]>(() => {
    const counter = new Map<string, number>();

    entries.forEach((entry) => {
      const label = entry.tiempo.includes("hace") ? "reciente" : entry.tiempo.slice(0, 2);
      counter.set(label, (counter.get(label) ?? 0) + 1);
    });

    return Array.from(counter.entries()).map(([h, eventos]) => ({ h, eventos }));
  }, [entries]);

  return {
    changes: entries.filter((entry) =>
      /actualiz|cambio|plan|config|suspend/i.test(entry.accion),
    ).length,
    critical: entries.filter((entry) => entry.tipo === "critical").length,
    entries,
    error,
    events,
    isLoading,
    logins: entries.filter((entry) => /login|sign in|acceso/i.test(entry.accion)).length,
    total,
  };
}
