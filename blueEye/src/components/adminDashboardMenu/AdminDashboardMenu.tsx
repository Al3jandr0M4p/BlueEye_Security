import React from "react";
import {
  ChevronDown,
  LogOut,
  UserCircle2,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/use-store-hook";
import { logout } from "../../reduxjs/store/slices/auth.slice";
import { persistor } from "../../reduxjs/store/store";
import { adminNavItems, utilityItems } from "../adminNavItems/adminNavItems";


const AdminDashboardMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(logout());
    await persistor.purge();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f5f6f7]">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-70 flex-col border-r border-[#e6e7eb] bg-[#f3f4f6] p-3">
        <div className="rounded-md border border-[#e8e8ec] bg-[#f8f8fa] px-3 py-2 text-sm font-semibold text-[#272a33]">
          {profile?.username}'s' Dashboard
        </div>

        <nav className="mt-3 flex flex-col gap-1">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#f0e8ef] text-[#7d2d58]"
                    : "text-[#5f6672] hover:bg-[#eceef1]"
                }`
              }
            >
              <span className="flex items-center gap-2.5">
                {item.icon}
                {item.label}
              </span>
              {item.hasArrow && <ChevronDown size={15} />}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 space-y-1">
          {utilityItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-[#5f6672] transition hover:bg-[#eceef1]"
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-[#5f6672] transition hover:bg-[#eceef1]"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        <div className="mt-auto border-t border-[#e1e2e8] pt-3">
          <div className="mb-4 flex justify-center text-sm font-semibold text-[#4a4f5a]">
            beehiiv
          </div>

          <div className="flex items-center gap-2.5 rounded-md bg-[#eceef1] p-2">
            <UserCircle2 className="text-[#717783]" size={32} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#2a2f39]">John Doe</p>
              <p className="truncate text-xs text-[#707784]">jonsmith.mobbin@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-0 min-h-screen p-4 md:ml-70 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardMenu;
