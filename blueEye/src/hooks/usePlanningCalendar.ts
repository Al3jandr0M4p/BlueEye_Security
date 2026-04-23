import { useEffect, useMemo, useState } from "react";
import { format as formatDate, parseISO } from "date-fns";
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
const isSameDay = (left?: string, right?: string) =>
  Boolean(left) && Boolean(right) && left === right;

export type PlanningCalendarEvent = {
  id: string;
  title: string;
  start: string;
  allDay: true;
  classNames: string[];
  extendedProps: {
    technicianId: string | null;
    technicianName: string;
    ticket: AdminTicket;
  };
};

export type PlanningDayAssignment = {
  ticket: AdminTicket;
  technicianId: string | null;
  technicianName: string;
};

export type TechnicianPlanningCard = AdminManagedUser & {
  assignmentCount: number;
  assignmentsOnSelectedDate: number;
  isBusyOnSelectedDate: boolean;
  isCurrentTicketTechnician: boolean;
  isSelectable: boolean;
  nextAssignmentDate: string | null;
};

function findTechnicianForTicket(
  ticket: AdminTicket,
  technicians: AdminManagedUser[],
) {
  const assignedTo = ticket.assignedTo?.trim().toLowerCase();

  if (!assignedTo) return null;

  return (
    technicians.find((technician) => {
      const candidates = [
        String(technician.id),
        technician.name,
        technician.username,
        technician.email,
      ]
        .filter(Boolean)
        .map((value) => String(value).trim().toLowerCase());

      return candidates.includes(assignedTo);
    }) ?? null
  );
}

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

  const getSuggestedTechnicianId = (
    date: string,
    ticket: AdminTicket | null,
    technicianPool = technicians,
    plannedTickets = planningQueue,
  ) => {
    if (technicianPool.length === 0) return "";

    const currentTechnicianId = ticket
      ? String(findTechnicianForTicket(ticket, technicianPool)?.id ?? "") || null
      : null;

    const busyTechnicianIds = new Set(
      plannedTickets
        .filter(
          (plannedTicket) =>
            isSameDay(plannedTicket.scheduledDate, date) &&
            plannedTicket.id !== ticket?.id,
        )
        .map((plannedTicket) => {
          const technicianId = findTechnicianForTicket(plannedTicket, technicianPool)?.id;
          return technicianId ? String(technicianId) : null;
        })
        .filter((value): value is string => Boolean(value)),
    );

    if (currentTechnicianId) {
      return currentTechnicianId;
    }

    const firstAvailable = technicianPool.find(
      (technician) => !busyTechnicianIds.has(String(technician.id)),
    );

    return String(firstAvailable?.id ?? technicianPool[0]?.id ?? "");
  };

  const loadTickets = async () => {
    try {
      setLoading(true);
      const [pendingResult, planningResult, usersResult] = await Promise.allSettled([
        fetchPedingTicketsService(),
        fetchPlanningTicketsService(),
        fetchAdminUsersService(),
      ]);

      setPendingTickets(
        pendingResult.status === "fulfilled" ? pendingResult.value : [],
      );
      setPlanningQueue(
        planningResult.status === "fulfilled" ? planningResult.value : [],
      );
      setTechnicians(
        usersResult.status === "fulfilled"
          ? usersResult.value.filter((user) => user.rolename === "tecnico")
          : [],
      );

      if (pendingResult.status === "rejected") {
        console.error("Pending tickets load failed", pendingResult.reason);
      }

      if (planningResult.status === "rejected") {
        console.error("Planning tickets load failed", planningResult.reason);
      }

      if (usersResult.status === "rejected") {
        console.error("Admin users load failed", usersResult.reason);
      }
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
    const nextScheduledDate = ticket.scheduledDate ?? getTodayDate();
    setScheduledDate(nextScheduledDate);
    setSelectedTechnicianId(getSuggestedTechnicianId(nextScheduledDate, ticket));
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

  useEffect(() => {
    if (!selectedTicket) return;

    const technicianCard = technicians.find(
      (technician) => technician.id === selectedTechnicianId,
    );
    const isCurrentTicketTechnician =
      selectedTicket &&
      technicianCard &&
      findTechnicianForTicket(selectedTicket, technicians)?.id === technicianCard.id;

    const hasConflict = planningQueue.some((ticket) => {
      if (!isSameDay(ticket.scheduledDate, scheduledDate)) return false;
      if (ticket.id === selectedTicket.id) return false;
      return (
        String(findTechnicianForTicket(ticket, technicians)?.id ?? "") ===
        selectedTechnicianId
      );
    });

    if (!selectedTechnicianId || (hasConflict && !isCurrentTicketTechnician)) {
      const nextTechnicianId = getSuggestedTechnicianId(scheduledDate, selectedTicket);
      if (nextTechnicianId !== selectedTechnicianId) {
        setSelectedTechnicianId(nextTechnicianId);
      }
    }
  }, [
    planningQueue,
    scheduledDate,
    selectedTechnicianId,
    selectedTicket,
    technicians,
  ]);

  const events = useMemo<PlanningCalendarEvent[]>(
    () =>
      planningQueue
        .filter((ticket) => ticket.scheduledDate)
        .map((ticket) => {
          const matchedTechnician = findTechnicianForTicket(ticket, technicians);

          return {
            id: ticket.id,
            title: `${ticket.site} · ${matchedTechnician?.name ?? ticket.assignedTo}`,
            start: ticket.scheduledDate!,
            allDay: true,
            classNames: [
              ticket.id === selectedTicket?.id
                ? "planning-event-current"
                : "planning-event-planned",
            ],
            extendedProps: {
              technicianId: matchedTechnician ? String(matchedTechnician.id) : null,
              technicianName: matchedTechnician?.name ?? ticket.assignedTo,
              ticket,
            },
          };
        }),
    [planningQueue, selectedTicket, technicians],
  );

  const selectedDateAssignments = useMemo<PlanningDayAssignment[]>(
    () =>
      planningQueue
        .filter((ticket) => isSameDay(ticket.scheduledDate, scheduledDate))
        .map((ticket) => {
          const matchedTechnician = findTechnicianForTicket(ticket, technicians);
          return {
            ticket,
            technicianId: matchedTechnician ? String(matchedTechnician.id) : null,
            technicianName: matchedTechnician?.name ?? ticket.assignedTo,
          };
        }),
    [planningQueue, scheduledDate, technicians],
  );

  const technicianCards = useMemo<TechnicianPlanningCard[]>(() => {
    const selectedTicketTechnicianId =
      selectedTicket
        ? String(findTechnicianForTicket(selectedTicket, technicians)?.id ?? "")
        : "";

    return [...technicians]
      .map((technician) => {
        const assignments = planningQueue.filter(
          (ticket) =>
            String(findTechnicianForTicket(ticket, technicians)?.id ?? "") ===
            String(technician.id),
        );
        const assignmentsOnSelectedDate = assignments.filter((ticket) =>
          isSameDay(ticket.scheduledDate, scheduledDate),
        );
        const isCurrentTicketTechnician =
          String(technician.id) === selectedTicketTechnicianId;
        const isBusyOnSelectedDate =
          assignmentsOnSelectedDate.some((ticket) => ticket.id !== selectedTicket?.id);

        return {
          ...technician,
          assignmentCount: assignments.length,
          assignmentsOnSelectedDate: assignmentsOnSelectedDate.length,
          isBusyOnSelectedDate,
          isCurrentTicketTechnician,
          isSelectable: !isBusyOnSelectedDate || isCurrentTicketTechnician,
          nextAssignmentDate:
            assignments
              .filter((ticket) => ticket.scheduledDate && ticket.scheduledDate >= getTodayDate())
              .sort((left, right) =>
                String(left.scheduledDate).localeCompare(String(right.scheduledDate)),
              )[0]?.scheduledDate ?? null,
        };
      })
      .sort((left, right) => {
        if (left.isSelectable !== right.isSelectable) {
          return left.isSelectable ? -1 : 1;
        }
        if (left.assignmentsOnSelectedDate !== right.assignmentsOnSelectedDate) {
          return left.assignmentsOnSelectedDate - right.assignmentsOnSelectedDate;
        }
        return left.name.localeCompare(right.name);
      });
  }, [planningQueue, scheduledDate, selectedTicket, technicians]);

  const handleSavePlan = async () => {
    if (!selectedTicket || !selectedTechnicianId) return;

    try {
      const plannedTicket = await planAdminTicketService(selectedTicket.id, {
        technicianId: selectedTechnicianId,
        scheduledDate,
      });

      if (plannedTicket) {
        setPendingTickets((current) =>
          current.filter((ticket) => ticket.id !== plannedTicket.id),
        );
        setPlanningQueue((current) => {
          const next = [
            ...current.filter((ticket) => ticket.id !== plannedTicket.id),
            plannedTicket,
          ];

          return next.sort((left, right) =>
            String(left.scheduledDate ?? "").localeCompare(
              String(right.scheduledDate ?? ""),
            ),
          );
        });
      }

      await loadTickets();
      closePlanningModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDateSelect = (dateValue: string) => {
    if (!dateValue || dateValue < getTodayDate()) return;
    setScheduledDate(dateValue);
  };

  const handleCalendarEventSelect = (
    dateValue: string,
    technicianId?: string | null,
  ) => {
    handleDateSelect(dateValue);

    if (technicianId) {
      setSelectedTechnicianId(technicianId);
    }
  };

  return {
    loading,
    technicians: technicianCards,
    pendingTickets,
    planningQueue,
    selectedTicket,
    selectedTechnicianId,
    scheduledDate,
    events,
    selectedDateAssignments,
    setSelectedTechnicianId,
    setScheduledDate: handleDateSelect,
    openPlanningModal,
    closePlanningModal,
    handleReject,
    handleSavePlan,
    handleDateSelect,
    handleCalendarEventSelect,
    formatScheduledDateLabel: (value: string) =>
      formatDate(getDateFromInput(value), "dd MMM yyyy"),
  };
}
