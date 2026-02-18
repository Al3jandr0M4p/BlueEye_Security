import { Drawer } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface NotificationsPanelProps {
  openNotificationsPanel: boolean;
  setOpenNotificationsPanel: (v: boolean) => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  openNotificationsPanel,
  setOpenNotificationsPanel,
}) => {
  const [tab, setTab] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (openNotificationsPanel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openNotificationsPanel]);

  return (
    <Drawer
      open={openNotificationsPanel}
      onClose={() => setOpenNotificationsPanel(false)}
      position="right"
      className="w-105 shadow-2xl h-170 rounded-l-2xl flex flex-col py-2"
    >
      <div className="flex px-3 justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => setTab("all")}
            className={`px-3 py-1 text-sm rounded-md font-medium transition ${tab === "all" ? "bg-gray-200 text-black" : "text-gray-500 hover:bg-gray-100"}`}
            style={{ fontFamily: "Google Sans" }}
          >
            Todas
          </button>
          <button
            onClick={() => setTab("unread")}
            className={`px-3 py-1 text-sm rounded-md font-medium transition ${
              tab === "unread"
                ? "bg-gray-200 text-black"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            style={{ fontFamily: "Google Sans" }}
          >
            Sin leer
          </button>
        </div>
        <button
          onClick={() => setOpenNotificationsPanel(false)}
          className="cursor-pointer"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="h-500">
          {tab === "all" ? <p>Scroll Test all</p> : <p>Scroll test unread</p>}
        </div>
      </div>
    </Drawer>
  );
};
