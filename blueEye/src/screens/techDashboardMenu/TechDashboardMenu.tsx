import type React from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "../../components/DashboardMenu/Menu";

const TechDashboardMenu: React.FC = () => {
  return (
    <div className="relative h-screen">
      <div className="ml-0 lg:ml-64 flex-col flex-1 h-screen">
        <Menu />

        {/* MAIN CONTENT */}
        <main className="pt-20 lg:pt-32 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TechDashboardMenu;
