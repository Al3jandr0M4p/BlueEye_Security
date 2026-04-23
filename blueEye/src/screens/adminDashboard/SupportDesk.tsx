import AdminPageShell from "../../components/AdminPageShell";
import { PendingTicketsList } from "../../components/PendingTicketList/PendingTicketList";
import { PlanningModal } from "../../components/PlanningModal/PlanningModal";
import { PlanningQueueList } from "../../components/PlanningQueueList/PlanningQueueList";
import { usePlanningCalendar } from "../../hooks/usePlanningCalendar";

const AdminSupportScreen = () => {
  const planning = usePlanningCalendar();

  return (
    <AdminPageShell
      tag="Tickets"
      title="Gestion de tickets"
      subtitle="Flujo mas claro para revisar, planificar y asignar tickets."
    >
      <div className="space-y-8">
        
        {/* HEADER */}
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <div>
              <h1 className="text-3xl font-semibold">
                Mesa de aprobacion y planificacion
              </h1>
            </div>

            <div className="flex gap-4">
              <div>Pendientes: {planning.pendingTickets.length}</div>
              <div>Planificados: {planning.planningQueue.length}</div>
              <div>Tecnicos: {planning.technicians.length}</div>
            </div>
          </div>
        </section>

        {/* PENDIENTES + PLANNING */}
        <div className="grid gap-6 xl:grid-cols-2">
          
          <PendingTicketsList
            tickets={planning.pendingTickets}
            onReject={planning.handleReject}
            onPlan={planning.openPlanningModal}
          />

          <PlanningQueueList
            tickets={planning.planningQueue}
            onEdit={planning.openPlanningModal}
          />

        </div>

        {/* MODAL */}
        <PlanningModal
          isOpen={!!planning.selectedTicket}
          ticket={planning.selectedTicket}
          technicians={planning.technicians}
          events={planning.events}
          selectedDateAssignments={planning.selectedDateAssignments}
          selectedTechnicianId={planning.selectedTechnicianId}
          scheduledDate={planning.scheduledDate}
          onClose={planning.closePlanningModal}
          onSave={planning.handleSavePlan}
          onDateSelect={planning.handleDateSelect}
          onCalendarEventSelect={planning.handleCalendarEventSelect}
          formatScheduledDateLabel={planning.formatScheduledDateLabel}
          setSelectedTechnicianId={planning.setSelectedTechnicianId}
        />
      </div>
    </AdminPageShell>
  );
};

export default AdminSupportScreen;
