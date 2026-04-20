import { useCallback, useEffect, useState } from "react";
import {
  fetchTechTicketsService,
  updateTechTicketNotesService,
  updateTechTicketStatusService,
} from "../service/service";
import type { TechTicket, TechTicketStatus } from "../types/tech.types";

export function useTechTickets() {
  const [tickets, setTickets] = useState<TechTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTechTicketsService();
      setTickets((data as TechTicket[]).map((ticket) => ({ ...ticket, id: String(ticket.id) })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los tickets.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = useCallback(async (ticketId: string, status: TechTicketStatus) => {
    await updateTechTicketStatusService(ticketId, { status });
    await load();
  }, [load]);

  const updateNotes = useCallback(async (ticketId: string, notes: string) => {
    await updateTechTicketNotesService(ticketId, { notes });
    await load();
  }, [load]);

  return { error, isLoading, load, tickets, updateNotes, updateStatus };
}

