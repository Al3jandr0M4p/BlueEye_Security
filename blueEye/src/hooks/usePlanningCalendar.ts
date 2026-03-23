import { useEffect, useState } from "react";
import { format as formatDate, isValid, parseISO, startOfDay } from "date-fns";
import type { SlotInfo } from "react-big-calendar";
import type { AdminTicket } from "../types/types";
import {
  fetchPedingTicketsService,
  fetchPlanningTicketsService,
} from "../service/services";

const getTodayDate = () => new Date().toISOString().split("T")[0];
const getDateFromInput = (value: string) => parseISO(`${value}T00:00:00`);

export function usePlanningCalendar() {
//   const technicians = data?.technicians ?? [];

  // 🔥 DATA REAL
  const [pendingTickets, setPendingTickets] = useState<AdminTicket[]>([]);
  const [planningQueue, setPlanningQueue] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 UI STATE
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(
    null,
  );
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [scheduledDate, setScheduledDate] = useState(getTodayDate());

  // 🔥 FETCH REAL
  const loadTickets = async () => {
    try {
      setLoading(true);

      const [pending, planning] = await Promise.all([
        fetchPedingTicketsService(),
        fetchPlanningTicketsService(),
      ]);

      console.log("PLANNING:", planning);

      setPendingTickets(pending);
      setPlanningQueue(planning);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // 🔥 FILTRO TECNICOS
//   const availableTechnicians = useMemo(
//     () => technicians.filter((t) => t.status === "Disponible"),
//     [technicians],
//   );

  // 🔥 MODAL
  const openPlanningModal = (ticket: AdminTicket) => {
    setSelectedTicket(ticket);
    // setSelectedTechnicianId(availableTechnicians[0]?.id ?? "");
    setScheduledDate(ticket.scheduledDate ?? getTodayDate());
  };

  const closePlanningModal = () => {
    setSelectedTicket(null);
    setSelectedTechnicianId("");
    setScheduledDate(getTodayDate());
  };

  // 🔥 REJECT → BACKEND
  const handleReject = async (ticketId: string) => {
    try {
      await fetch(`/api/admin/v1/tickets/${ticketId}/reject`, {
        method: "POST",
      });

      await loadTickets();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 EVENTS (igual pero con data real)
  const events = planningQueue
    .filter((t) => t.scheduledDate)
    .map((t) => {
      const d = getDateFromInput(t.scheduledDate!);
      return {
        title: `${t.id} · ${t.assignedTo}`,
        start: d,
        end: d,
        resource: t,
      };
    });

  // 🔥 SAVE PLAN → BACKEND
  const handleSavePlan = async () => {
    if (!selectedTicket || !selectedTechnicianId) return;

    try {
      await fetch(`/api/admin/v1/tickets/${selectedTicket.id}/plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          technicianId: selectedTechnicianId,
          scheduledDate,
        }),
      });

      await loadTickets();
      closePlanningModal();
    } catch (err) {
      console.error(err);
    }
  };

  const selectedCalendarDate = isValid(getDateFromInput(scheduledDate))
    ? getDateFromInput(scheduledDate)
    : getDateFromInput(getTodayDate());

  const handleSelectCalendarSlot = (slotInfo: SlotInfo) => {
    const nextDate = startOfDay(slotInfo.start);
    if (nextDate < startOfDay(new Date())) return;
    setScheduledDate(formatDate(nextDate, "yyyy-MM-dd"));
  };

  return {
    // error,
    loading,
    // technicians,
    pendingTickets,
    planningQueue,
    // availableTechnicians,

    selectedTicket,
    selectedTechnicianId,
    scheduledDate,
    selectedCalendarDate,
    events,

    setSelectedTechnicianId,
    setScheduledDate,

    openPlanningModal,
    closePlanningModal,
    handleReject,
    handleSavePlan,
    handleSelectCalendarSlot,
  };
}
