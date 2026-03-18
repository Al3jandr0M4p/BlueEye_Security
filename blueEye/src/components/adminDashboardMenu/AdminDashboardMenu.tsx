import React from "react";
import { ChevronDown, LogOut, UserCircle2 } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { adminNavItems, utilityItems } from "../adminNavItems/adminNavItems";
import { activityItems } from "../../constants/constants";
import { useAdminHook } from "../../hooks/use-admin-hook";

const AdminDashboardMenu: React.FC = () => {
  const { profile, handleLogout } = useAdminHook();

  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-[#e6e7eb] p-3">
        <div className="rounded-md border border-[#e8e8ec] bg-[#f8f8fa] px-3 py-2 text-sm font-semibold text-[#272a33]">
          {profile?.username}'s Dashboard
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
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-[#5f6672] transition hover:bg-[#eceef1] cursor-pointer"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        <div className="mt-auto border-t border-[#e1e2e8] pt-3">
          <div className="mb-4 flex justify-center text-sm font-semibold text-[#4a4f5a]">
            BlueEye Security
          </div>

          <Link
            to="/perfil"
            className="flex items-center gap-2.5 rounded-md bg-[#eceef1] p-2 cursor-pointer"
          >
            <UserCircle2 className="text-[#717783]" size={32} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#2a2f39]">
                {profile?.username}
              </p>
              <p className="truncate text-xs text-[#707784]">
                jonsmith.mobbin@gmail.com
              </p>
            </div>
          </Link>
        </div>
      </aside>

      <main className="ml-0 min-h-screen p-4 md:ml-72 md:p-6">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="bg-white p-4 md:p-6">
            <Outlet />
          </section>

          <aside className="h-fit bg-white p-4 md:p-5 xl:sticky xl:top-4">
            <h3 className="text-3xl font-semibold text-[#121722]">Actividad</h3>

            <div className="mt-5 space-y-5">
              {activityItems.map((item, index) => (
                <article key={item.id} className="relative pl-5">
                  <span className="absolute left-1 top-1.5 h-2 w-2 rounded-full border border-[#67b85f] bg-white" />
                  {index !== activityItems.length - 1 && (
                    <span className="absolute left-2 top-4 h-[calc(100%+14px)] w-px bg-[#e4e7eb]" />
                  )}

                  <p className="text-sm leading-5 text-[#1c222d]">
                    {item.title}{" "}
                    <span className="font-semibold">{item.highlight}</span>
                  </p>
                  <p className="mt-1 text-xs text-[#8b93a3]">{item.date}</p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardMenu;
