import { useEffect, useState } from "react";
import {
  fetchSuperAdminAudit,
  fetchSuperAdminDashboard,
} from "../../../service/service";

type SupportActivity = {
  asunto: string;
  empresa: string;
  id: string;
  status: "escalated" | "open" | "pending";
  actualizado: string;
};

function inferStatus(text: string): "escalated" | "open" | "pending" {
  const value = text.toLowerCase();

  if (value.includes("critical") || value.includes("error")) {
    return "escalated";
  }

  if (value.includes("ticket") || value.includes("support")) {
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

  useEffect(() => {
    let mounted = true;

    const loadSupport = async () => {
      try {
        setIsLoading(true);
        const [dashboard, audit] = await Promise.all([
          fetchSuperAdminDashboard(),
          fetchSuperAdminAudit(),
        ]);
        if (!mounted) return;

        const ticketEvents = audit.entries
          .filter((entry) => /ticket|support|sla|incident/i.test(entry.accion))
          .slice(0, 8)
          .map((entry, index) => ({
            asunto: entry.accion,
            empresa: entry.empresa,
            id: `SUP-${index + 1}`,
            status: inferStatus(entry.accion),
            actualizado: entry.tiempo,
          }));

        setTickets(ticketEvents);
        setOpen(dashboard.stats.openTickets);
        setUrgent(ticketEvents.filter((ticket) => ticket.status === "escalated").length);
        setSlaRisk(dashboard.stats.unAssignedTickets);
        setError(null);
      } catch (err) {
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
  }, []);

  return {
    avgResponse: "No disponible",
    error,
    integrationNote: "El backend aun no expone GET /api/super/admin/support o listado global de tickets detallados.",
    isLoading,
    open,
    slaRisk,
    tickets,
    urgent,
  };
}
