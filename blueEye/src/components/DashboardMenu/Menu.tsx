import React from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faBell } from "@fortawesome/free-solid-svg-icons";

import { useDashboardTech } from "../../hooks/use-dashboard-tech";
import { NotificationsPanel } from "../NotificationsPanels/NotificationsPanel";
import { AnimatedLink } from "../AnimatedLink/AnimatedLink";
import { AppNavbar } from "../Navbar/Navbar";

export const Menu: React.FC = () => {
  const {
    openSideBar,
    showNav,
    isPricing,
    showNotificationsPanel,
    setShowNotificationsPanel,
    setOpenSideBar,
  } = useDashboardTech();

  return (
    <>
      <AppNavbar
        show={showNav}
        className="lg:top-4 lg:left-1/2 lg:-translate-x-1/2 sm:w-[80%] lg:w-[50%] rounded-none lg:rounded-2xl"
        left={
          <>
            <FontAwesomeIcon
              icon={faBars}
              className="text-xl cursor-pointer"
              onClick={() => {
                setShowNotificationsPanel(false);
                setOpenSideBar(true);
              }}
            />

            <div>
              <h2 className="text-xs text-gray-600">Dashboard</h2>
              <h1 className="text-[16px] text-black font-semibold">
                BlueEye Security
              </h1>
            </div>
          </>
        }
        right={
          <>
            {!isPricing && (
              <Link
                to="/techDashboard/pricing"
                className="px-6 py-2 rounded-full bg-gray-950 text-white font-medium hover:bg-black transition"
              >
                Get Pro
              </Link>
            )}

            {/* NOTIFICATIONS ICON */}
            <div className="relative cursor-pointer">
              <FontAwesomeIcon
                icon={faBell}
                className="text-2xl"
                onClick={() => {
                  setOpenSideBar(false);
                  setShowNotificationsPanel(true);
                }}
              />

              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"></span>
            </div>

            {/* USER DROPDOWN */}
            <Dropdown
              inline
              arrowIcon
              label={
                <img
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="Avatar"
                  className="size-10 rounded-full object-cover cursor-pointer"
                />
              }
              className="border-0 p-2 shadow-xl"
            >
              <DropdownItem href="/perfil">Perfil</DropdownItem>
              <DropdownItem>Mensajes</DropdownItem>
              <DropdownDivider />
              <DropdownItem className="text-red-600">
                Cerrar sesión
              </DropdownItem>
            </Dropdown>
          </>
        }
      >
        {showNotificationsPanel && (
          <NotificationsPanel
            openNotificationsPanel={showNotificationsPanel}
            setOpenNotificationsPanel={setShowNotificationsPanel}
          />
        )}
      </AppNavbar>

      {/* OVERLAY */}
      {openSideBar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-500 opacity-100"
          onClick={() => setOpenSideBar(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-full sm:w-80 lg:w-72 bg-white shadow-xl z-50 transform transition-transform duration-500 ${
          openSideBar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 relative flex items-center justify-center lg:justify-between">
          <h2 className="font-semibold text-xl">BlueEye Security</h2>

          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setOpenSideBar(false)}
            className="cursor-pointer text-red-400 absolute right-4 top-4 lg:static"
          />
        </div>

        <nav className="flex flex-col p-4 space-y-2.5">
          <AnimatedLink
            to="/techDashboard/dashboard"
            className="block w-full hover:bg-gray-200 p-2 rounded"
            closeSideBar={() => setOpenSideBar(false)}
          >
            Dashboard
          </AnimatedLink>

          <AnimatedLink
            to="/techDashboard/tickets"
            className="block w-full hover:bg-gray-200 p-2 rounded"
            closeSideBar={() => setOpenSideBar(false)}
          >
            Tickets
          </AnimatedLink>
        </nav>
      </aside>
    </>
  );
};
