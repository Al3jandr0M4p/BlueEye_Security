import type React from "react";
import { Outlet } from "react-router-dom";
import { ClientSidebar } from "./components/Clientsidebar";

const ClientDashboardMenu: React.FC = () => {
  return (
    <div
      style={{
        background: "#060d1a",
        display: "flex",
        height: "100vh",
        margin: 0,
        overflow: "hidden",
        padding: 0,
      }}
    >
      <ClientSidebar companyName="Empresa ABC" alertCount={3} />

      <main
        style={{
          background: "#060d1a",
          flex: 1,
          minWidth: 0,
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default ClientDashboardMenu;
