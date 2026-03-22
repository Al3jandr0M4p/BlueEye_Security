// import { useEffect, useState } from "react";

// const ADMIN_TICKET_PLANNING_EVENT = "admin-ticket-planning-updated";

export const useAdminTicketPlanning = () => {
//   const [state, setState] = useState<AdminTicketPlanningState>(() =>
//     getAdminTicketPlanningState(),
//   );

//   useEffect(() => {
//     const syncState = () => {
//       setState(getAdminTicketPlanningState());
//     };

//     window.addEventListener("storage", syncState);
//     window.addEventListener(ADMIN_TICKET_PLANNING_EVENT, syncState);

//     return () => {
//       window.removeEventListener("storage", syncState);
//       window.removeEventListener(ADMIN_TICKET_PLANNING_EVENT, syncState);
//     };
//   }, []);

//   const updateState = (
//     updater: (currentState: AdminTicketPlanningState) => AdminTicketPlanningState,
//   ) => {
//     setState((currentState) => {
//       const nextState = updater(currentState);
//       return saveAdminTicketPlanningState(nextState);
//     });
//   };

//   return { state, updateState };
};
