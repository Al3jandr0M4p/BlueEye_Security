import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./use-store-hook";
import { loginThunk } from "../reduxjs/store/thunks/thunks";

export function useLoginHook() {
  const dispatch = useAppDispatch();
  const { loading, error, profile } = useAppSelector((state) => state.auth);

  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();
  const isDisabled = !identifier || !password;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const resultAction = await dispatch(loginThunk({ identifier, password }));

    console.log(`Loading: ${loading} Error: ${error} Profile: ${profile}`);

    if (loginThunk.fulfilled.match(resultAction)) {
      const rolename = resultAction.payload?.profile?.rolename;

      if (rolename === "usuario") navigate("/clientDashbord");
      else if (rolename === "tecnico") navigate("/techDashboard");
      else if (rolename === "admin") navigate("/adminDashboard");
      else if (rolename === "superAdmin") navigate("/super/admin/dashboard");
      else navigate("/login");
    } else {
      console.log("Login failed:", resultAction.payload);
    }
  };

  return {
    identifier,
    password,
    isDisabled,
    loading,
    error,
    setPassword,
    setIdentifier,
    handleSubmit,
  };
}
