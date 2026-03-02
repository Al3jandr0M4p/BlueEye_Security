import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "./use-store-hook";
import { logout } from "../reduxjs/store/slices/auth.slice";
import { persistor } from "../reduxjs/store/store";

export function useDashboardTech() {
  const dispatch = useAppDispatch();
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const [showNav, setShowNav] = useState<boolean>(true);
  const [lastScroll, setLastScroll] = useState<number>(0);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const location = useLocation();
  const isPricing = location.pathname.includes("/pricing");
  const navigate = useNavigate();

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

  const handleLogOut = async () => {
    dispatch(logout());
    await persistor.purge();
    navigate("/login", { replace: true });
  }

  return {
    openSideBar,
    showNav,
    isPricing,
    showNotificationsPanel,
    setShowNotificationsPanel,
    setOpenSideBar,
    handleLogOut
  };
}
