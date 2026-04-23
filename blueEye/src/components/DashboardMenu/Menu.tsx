import React from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faBell } from "@fortawesome/free-solid-svg-icons";

import { useDashboardTech } from "../../hooks/use-dashboard-tech";
import { useTechNotifications } from "../../hooks/use-tech-notifications";
import { AnimatedLink } from "../AnimatedLink/AnimatedLink";
import { AppNavbar } from "../Navbar/Navbar";
import { TechNotificationsDrawer } from "../techNotifications/TechNotificationsDrawer";

export const Menu: React.FC = () => {
  const {
    openSideBar,
    showNav,
    showNotificationsPanel,
    setShowNotificationsPanel,
    setOpenSideBar,
    handleLogOut,
  } = useDashboardTech();
  const notifications = useTechNotifications();

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

              {notifications.unreadCount > 0 && (
                <>
                  <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-red-500 animate-ping"></span>
                  <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {notifications.unreadCount > 9 ? "9+" : notifications.unreadCount}
                  </span>
                </>
              )}
            </div>

            {/* USER DROPDOWN */}
            <Dropdown
              inline
              arrowIcon
              label={
                <img
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  alt="Avatar"
                  className="size-10 rounded-full object-cover cursor-pointer"
                />
              }
              className="border-0 p-2 shadow-xl"
            >
              <DropdownItem as={Link} to="/perfil">
                Perfil
              </DropdownItem>
              <DropdownItem>Mensajes</DropdownItem>
              <DropdownDivider />
              <DropdownItem onClick={handleLogOut} className="text-red-600">
                Cerrar sesión
              </DropdownItem>
            </Dropdown>
          </>
        }
      >
        {showNotificationsPanel && (
          <TechNotificationsDrawer
            isOpen={showNotificationsPanel}
            notifications={notifications.notifications}
            unreadCount={notifications.unreadCount}
            isLoading={notifications.isLoading}
            onClose={() => setShowNotificationsPanel(false)}
            onMarkAsRead={(notificationId) => {
              void notifications.markAsRead(notificationId);
            }}
          />
        )}
      </AppNavbar>

      {/* OVERLAY */}
      {openSideBar && (
        <button
          type="button"
          aria-label="Cerrar menú lateral"
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

          <AnimatedLink
            to="/techDashboard/levantamientos"
            className="block w-full hover:bg-gray-200 p-2 rounded"
            closeSideBar={() => setOpenSideBar(false)}
          >
            Levantamientos
          </AnimatedLink>

          <AnimatedLink
            to="/techDashboard/sitios"
            className="block w-full hover:bg-gray-200 p-2 rounded"
            closeSideBar={() => setOpenSideBar(false)}
          >
            Sitios
          </AnimatedLink>

          <button onClick={handleLogOut}>Cerrar sesion</button>
        </nav>
      </aside>
    </>
  );
};
