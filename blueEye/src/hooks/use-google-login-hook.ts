import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./use-store-hook";
import { loginGoogleThunk } from "../reduxjs/store/thunks/thunks";
import type { GoogleCredentialResponse } from "@react-oauth/google";

function resolveRole(
  userRole?: string | null,
  profileRole?: string | null,
) {
  if (userRole === "superAdmin" || profileRole === "superAdmin") {
    return "superAdmin";
  }

  return profileRole ?? userRole ?? null;
}

export function useGoogleLoginHook() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (response: GoogleCredentialResponse) => {
    const credential = response?.credential;
    if (!credential) return;

    const resultAction = await dispatch(loginGoogleThunk(credential));
    if (loginGoogleThunk.fulfilled.match(resultAction)) {
      const rolename = resolveRole(
        resultAction.payload?.user?.rolename,
        resultAction.payload?.profile?.rolename,
      );
      if (rolename === "usuario") navigate("/clientDashbord");
      else if (rolename === "tecnico") navigate("/techDashboard");
      else if (rolename === "admin") navigate("/adminDashboard");
      else if (rolename === "superAdmin") navigate("/super/admin/dashboard", { replace: true });
    } else {
      console.log("Google login failed", resultAction.payload);
    }
  };

  return { handleSubmit };
}
