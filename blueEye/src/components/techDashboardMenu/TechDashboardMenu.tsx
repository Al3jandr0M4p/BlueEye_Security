import React from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "../DashboardMenu/Menu";

const TechDashboardMenu: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_32%),linear-gradient(180deg,_#f8fbff_0%,_#f8fafc_38%,_#eef4ff_100%)]">
      <div className="ml-0 flex min-h-screen flex-1 flex-col lg:ml-64">
        <Menu />

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto pt-22 pb-10 lg:pt-32">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TechDashboardMenu;
