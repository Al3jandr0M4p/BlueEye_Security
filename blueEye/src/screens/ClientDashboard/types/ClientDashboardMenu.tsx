import type React from "react";
import { Outlet } from "react-router-dom";
import { ClientSidebar } from "../components/Clientsidebar";

/**
 * ClientDashboardMenu
 * Full-screen layout — sidebar left, scrollable content right.
 * Palette: bg-base #060d1a
 */
const ClientDashboardMenu: React.FC = () => {
  return (
    <div
      style={{
        display:    "flex",
        height:     "100vh",
        overflow:   "hidden",
        background: "#060d1a",   // bg-base
        margin:     0,
        padding:    0,
      }}
    >
      <ClientSidebar companyName="Empresa ABC" alertCount={3} />

      <main
        style={{
          flex:       1,
          overflowY:  "auto",
          overflowX:  "hidden",
          minWidth:   0,
          background: "#060d1a", // bg-base
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default ClientDashboardMenu;