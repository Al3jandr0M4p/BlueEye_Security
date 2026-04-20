import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchTechSitesService,
  fetchTechSurveysService,
  fetchTechTicketsService,
} from "../service/service";
import type { TechSite, TechSurvey, TechTicket, TechTicketStatus } from "../types/tech.types";

type TechOverview = {
  tickets: TechTicket[];
  sites: TechSite[];
  surveys: TechSurvey[];
};

const emptyOverview: TechOverview = { tickets: [], sites: [], surveys: [] };

export function useTechOverview() {
  const [data, setData] = useState<TechOverview>(emptyOverview);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tickets, sites, surveys] = await Promise.all([
        fetchTechTicketsService(),
        fetchTechSitesService(),
        fetchTechSurveysService(),
      ]);

      setData({
        tickets: (tickets as TechTicket[]).map((ticket) => ({ ...ticket, id: String(ticket.id) })),
        sites: (sites as TechSite[]).map((site) => ({ ...site, id: String(site.id) })),
        surveys: (surveys as TechSurvey[]).map((survey) => ({ ...survey, id: String(survey.id) })),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo cargar el resumen del técnico.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const ticketsByStatus = useMemo(() => {
    const buckets: Record<TechTicketStatus, number> = {
      iniciado: 0,
      "en progreso": 0,
      finalizado: 0,
      cancelado: 0,
    };

    data.tickets.forEach((ticket) => {
      const status = (ticket.tickets_status ?? "iniciado") as TechTicketStatus;
      buckets[status] = (buckets[status] ?? 0) + 1;
    });

    return buckets;
  }, [data.tickets]);

  return { data, error, isLoading, load, ticketsByStatus };
}

