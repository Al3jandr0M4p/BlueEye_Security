import { useCallback, useEffect, useState } from "react";
import TicketForm from "../components/TicketForm";
import { clientService } from "../services/client.service";
import type { NewTicketInput, Ticket } from "../types/client.types";

const statusStyles: Record<Ticket["status"], string> = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  resolved: "bg-green-100 text-green-700",
};

const ClientTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const createTicket = async (input: NewTicketInput) => {
    await clientService.createTicket(input);
    await loadTickets();
  };

  return (
    <section className="grid gap-6 p-4 xl:grid-cols-[minmax(320px,420px)_1fr]">
      <TicketForm onSubmit={createTicket} />

      <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Historial de tickets</h2>
        {isLoading && <p className="text-sm text-gray-600">Cargando tickets...</p>}
        {!isLoading && tickets.length === 0 && <p className="text-sm text-gray-600">No hay tickets registrados.</p>}
        <ul className="space-y-3">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-800">{ticket.id}</p>
                  <p className="text-sm text-gray-600">{ticket.site}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[ticket.status]}`}>
                  {ticket.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-medium">Equipo:</span> {ticket.equipment}
              </p>
              <p className="text-sm text-gray-700">{ticket.description}</p>
              <p className="mt-2 text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
};

export default ClientTickets;
