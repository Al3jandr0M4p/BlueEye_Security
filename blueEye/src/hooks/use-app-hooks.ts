import { useEffect } from "react";
import { useAppDispatch } from "./use-store-hook";
import { setSession } from "../reduxjs/store/slices/auth.slice";

export function useAppSessionAsyncHooks() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (!storedAuth) return;

    try {
      const parsed = JSON.parse(storedAuth);
      dispatch(
        setSession({
          user: parsed.user,
          session: parsed.session,
          profile: parsed.profile,
        }),
      );
    } catch {
      localStorage.removeItem("auth");
    }
  }, [dispatch]);
}