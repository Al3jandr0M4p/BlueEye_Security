import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useDashboardTech() {
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const [showNav, setShowNav] = useState<boolean>(true);
  const [lastScroll, setLastScroll] = useState<number>(0);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const location = useLocation();
  const isPricing = location.pathname.includes("/pricing");

  useEffect(() => {
    const onScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 50) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScroll]);

  return {
    openSideBar,
    showNav,
    isPricing,
    showNotificationsPanel,
    setShowNotificationsPanel,
    setOpenSideBar,
  };
}
