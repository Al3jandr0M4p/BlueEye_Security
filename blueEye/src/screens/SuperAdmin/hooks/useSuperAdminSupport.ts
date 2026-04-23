import { useDeferredValue, useEffect, useState } from "react";
import { fetchSuperAdminSupport } from "../../../service/service";

type SupportActivity = {
  asunto: string;
  empresa: string;
  id: string;
  prioridad: string;
  status: "escalated" | "open" | "pending";
  actualizado: string;
};

function inferStatus(status: string, priority: string): "escalated" | "open" | "pending" {
  const normalizedStatus = status.toLowerCase();
  const normalizedPriority = priority.toLowerCase();

  if (["urgent", "high", "alta"].includes(normalizedPriority)) {
    return "escalated";
  }

  if (normalizedStatus === "en progreso") {
    return "open";
  }

  return "pending";
}

export function useSuperAdminSupport() {
  const [tickets, setTickets] = useState<SupportActivity[]>([]);
  const [open, setOpen] = useState(0);
  const [urgent, setUrgent] = useState(0);
  const [slaRisk, setSlaRisk] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avgResponse, setAvgResponse] = useState("No disponible");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let mounted = true;

    const loadSupport = async () => {
      try {
        setIsLoading(true);
        const support = await fetchSuperAdminSupport(deferredSearch.trim());
        if (!mounted) return;

        const rows = support.rows.map((entry) => ({
          asunto: entry.subject,
          empresa: entry.company,
          id: entry.id,
          prioridad: entry.priority,
          status: inferStatus(entry.status, entry.priority),
          actualizado: entry.updatedAt
            ? new Date(entry.updatedAt).toLocaleDateString("es-DO")
            : "No disponible",
        }));

        setTickets(rows);
        setOpen(support.summary.open);
        setUrgent(support.summary.urgent);
        setSlaRisk(support.summary.slaRisk);
        setAvgResponse(
          support.summary.avgResponseMinutes > 0
            ? `${support.summary.avgResponseMinutes} min`
            : "No disponible",
        );
        setError(null);
      } catch {
        if (!mounted) return;
        setError("No se pudo cargar la vista de soporte.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void loadSupport();

    return () => {
      mounted = false;
    };
  }, [deferredSearch]);

  return {
    avgResponse,
    error,
    integrationNote: "Listado global de tickets conectado a `GET /api/super/admin/support`.",
    isLoading,
    open,
    search,
    setSearch,
    slaRisk,
    tickets,
    urgent,
  };
}
