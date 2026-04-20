import { useNavigate } from "react-router-dom";
import { logout } from "../reduxjs/store/slices/auth.slice";
import { signOut } from "../service/service";
import { useAppDispatch, useAppSelector } from "./use-store-hook";
import { persistor } from "../reduxjs/store/store";

export const useAdminHook = () => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(`Logout Error: ${err}`);
    } finally {
      dispatch(logout());
      await persistor.purge();
      navigate("/login", { replace: true });
    }
  };

  return {
    profile,
    handleLogout,
  };
};
