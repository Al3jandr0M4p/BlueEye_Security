import {
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
} from "flowbite-react";
import React from "react";
import { faBars, faTimes, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDashboardTech } from "../../hooks/use-dashboard-tech";
import { NotificationsPanel } from "../NotificationsPanels/NotificationsPanel";
import { AnimatedLink } from "../AnimatedLink/AnimatedLink";
import { Link } from "react-router-dom";

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
      {/* NAVBAR */}
      <Navbar
        className={`fixed top-0 left-0 lg:top-4 lg:left-1/2 lg:-translate-x-1/2 w-full sm:w-[80%] h-14 bg-blue-50 px-6 rounded-2xl shadow-xl transition-transform duration-300 ${showNav ? "translate-y-0" : "-translate-y-24"} ${isPricing ? "lg:w-[40%]" : "lg:w-[50%]"}`}
      >
        <div className="flex items-center gap-2.5">
          <FontAwesomeIcon
            icon={faBars}
            className="text-xl cursor-pointer"
            onClick={() => {
              setShowNotificationsPanel(false);
              setOpenSideBar(true);
            }}
          />

          <div>
            <h2
              className="text-xs text-gray-600"
              style={{ fontFamily: "Google Sans" }}
            >
              Dashboard
            </h2>
            <h1
              className="text-[16px] text-black"
              style={{ fontFamily: "Google Sans" }}
            >
              BlueEye Security
            </h1>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {!isPricing && (
            <Link
              to="/techDashboard/pricing"
              className="
                px-6 py-2 rounded-full bg-gray-950
              text-white font-medium
                hover:bg-black transition
            "
            >
              Get Pro
            </Link>
          )}

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

          {showNotificationsPanel && (
            <NotificationsPanel
              openNotificationsPanel={showNotificationsPanel}
              setOpenNotificationsPanel={setShowNotificationsPanel}
            />
          )}

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
            <DropdownHeader>
              <p className="text-sm" style={{ fontFamily: "Google Sans" }}>
                Neil Sims
              </p>
              <p
                className="text-xs text-gray-500"
                style={{ fontFamily: "Google Sans" }}
              >
                neil.sims@flowbite.com
              </p>
            </DropdownHeader>
            <DropdownItem
              href="/perfil"
              className="hover:bg-gray-100 rounded p-2"
              style={{ fontFamily: "Google Sans" }}
            >
              Perfil
            </DropdownItem>

            <DropdownItem
              href="#"
              className="hover:bg-gray-100 rounded p-2"
              style={{ fontFamily: "Google Sans" }}
            >
              Mensajes
            </DropdownItem>

            <DropdownDivider />

            <DropdownItem
              className="text-red-600 hover:bg-gray-100 rounded p-2"
              style={{ fontFamily: "Google Sans" }}
            >
              Cerrar sesion
            </DropdownItem>
          </Dropdown>
        </div>
      </Navbar>

      {/* LayOut */}
      {openSideBar && (
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-500 ${
            openSideBar
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setOpenSideBar(false)}
        />
      )}

      {/* OffCanva */}
      <aside
        className={`fixed top-0 left-0 h-full w-full sm:w-80 lg:w-72 bg-white shadow-xl z-50 transform transition-transform duration-500 ${openSideBar ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 relative flex items-center justify-center lg:justify-between">
          <h2
            className="font-semibold text-xl text-center lg:text-left"
            style={{ fontFamily: "Google Sans" }}
          >
            BlueEye Security
          </h2>

          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setOpenSideBar(false)}
            className="cursor-pointer text-red-400 absolute right-4 top-4 lg:static"
          />
        </div>

        <nav className="flex flex-col p-4 space-y-2.5 items-center text-center lg:items-start lg:text-left">
          <AnimatedLink
            to="/techDashboard/dashboard"
            className="block w-full hover:bg-gray-200 p-2 rounded"
            closeSideBar={() => setOpenSideBar(false)}
          >
            Dashboard
          </AnimatedLink>
          <AnimatedLink
            className="block w-full hover:bg-gray-200 p-2 rounded"
            to="/techDashboard/tickets"
            closeSideBar={() => setOpenSideBar(false)}
          >
            Tickets
          </AnimatedLink>
        </nav>
      </aside>
    </>
  );
};
