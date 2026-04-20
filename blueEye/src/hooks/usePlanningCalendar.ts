import { useEffect, useState } from "react";
import { format as formatDate, isValid, parseISO, startOfDay } from "date-fns";
import type { SlotInfo } from "react-big-calendar";
import type { AdminManagedUser, AdminTicket } from "../types/types";
import {
  fetchAdminUsersService,
  fetchPedingTicketsService,
  fetchPlanningTicketsService,
  planAdminTicketService,
  rejectAdminTicketService,
} from "../service/service";

const getTodayDate = () => new Date().toISOString().split("T")[0];
const getDateFromInput = (value: string) => parseISO(`${value}T00:00:00`);

export function usePlanningCalendar() {
  const [pendingTickets, setPendingTickets] = useState<AdminTicket[]>([]);
  const [planningQueue, setPlanningQueue] = useState<AdminTicket[]>([]);
  const [technicians, setTechnicians] = useState<AdminManagedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(
    null,
  );
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [scheduledDate, setScheduledDate] = useState(getTodayDate());

  const loadTickets = async () => {
    try {
      setLoading(true);

      const [pending, planning, users] = await Promise.all([
        fetchPedingTicketsService(),
        fetchPlanningTicketsService(),
        fetchAdminUsersService(),
      ]);

      setPendingTickets(pending);
      setPlanningQueue(planning);
      setTechnicians(users.filter((user) => user.rolename === "tecnico"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTickets();
  }, []);

  const openPlanningModal = (ticket: AdminTicket) => {
    setSelectedTicket(ticket);

    const matchedTechnician = technicians.find(
      (technician) => technician.name === ticket.assignedTo,
    );

    setSelectedTechnicianId(
      String(matchedTechnician?.id ?? technicians[0]?.id ?? ""),
    );
    setScheduledDate(ticket.scheduledDate ?? getTodayDate());
  };

  const closePlanningModal = () => {
    setSelectedTicket(null);
    setSelectedTechnicianId("");
    setScheduledDate(getTodayDate());
  };

  const handleReject = async (ticketId: string) => {
    try {
      await rejectAdminTicketService(ticketId);
      await loadTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const events = planningQueue
    .filter((ticket) => ticket.scheduledDate)
    .map((ticket) => {
      const scheduled = getDateFromInput(ticket.scheduledDate!);
      return {
        title: `${ticket.id} - ${ticket.assignedTo}`,
        start: scheduled,
        end: scheduled,
        resource: ticket,
      };
    });

  const handleSavePlan = async () => {
    if (!selectedTicket || !selectedTechnicianId) return;

    try {
      await planAdminTicketService(selectedTicket.id, {
        technicianId: selectedTechnicianId,
        scheduledDate,
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
    loading,
    technicians,
    pendingTickets,
    planningQueue,
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
