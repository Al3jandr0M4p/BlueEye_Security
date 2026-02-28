import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./use-store-hook";
import { loginGoogleThunk } from "../reduxjs/store/thunks/thunks";
import type { GoogleCredentialResponse } from "@react-oauth/google";

export function useGoogleLoginHook() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (response: GoogleCredentialResponse) => {
    const credential = response?.credential;
    if (!credential) return;

    const resultAction = await dispatch(loginGoogleThunk(credential));
    if (loginGoogleThunk.fulfilled.match(resultAction)) {
      const rolename = resultAction.payload.profile?.rolename;
      if (rolename === "usuario") navigate("/clientDashbord");
      else if (rolename === "tecnico") navigate("/techDashboard");
      else if (rolename === "admin") navigate("/adminDashboard");
      else if (rolename === "superAdmin") navigate("/super/admin/dashboard");
    } else {
      console.log("Google login failed", resultAction.payload);
    }
  };

  return { handleSubmit };
}
