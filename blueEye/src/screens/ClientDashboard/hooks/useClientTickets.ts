import { useCallback, useEffect, useState } from "react";
import { clientService } from "../../../service/service";
import type { NewTicketInput, Ticket } from "../../../types/client.types";

export function useClientTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const integrationNote =
    "Tus tickets se envian al soporte de tu empresa y luego el admin puede planificarlos y asignarlos a un tecnico.";

  const loadTickets = useCallback(async () => {
    const data = await clientService.getTickets();
    setTickets(data);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await loadTickets();
      setIsLoading(false);
    };

    void load();
  }, [loadTickets]);

  const createTicket = useCallback(
    async (input: NewTicketInput, photo?: File) => {
      if (photo) {
        const formData = new FormData();
        formData.append("site", input.site);
        formData.append("equipment", input.equipment);
        formData.append("description", input.description);
        formData.append("photo", photo, photo.name);
        await clientService.createTicketWithPhoto(formData);
      } else {
        await clientService.createTicket(input);
      }

      await loadTickets();
      setFeedback("Ticket enviado correctamente al equipo de soporte.");
    },
    [loadTickets],
  );

  return {
    createTicket,
    feedback,
    integrationNote,
    isLoading,
    tickets,
  };
}
