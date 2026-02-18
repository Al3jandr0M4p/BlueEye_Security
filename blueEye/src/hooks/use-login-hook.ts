import React, { useState } from "react";
import { useTranslation } from "../../node_modules/react-i18next";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import type { SignInResponse } from "../types/types";

export function useLoginHook() {
  const { t } = useTranslation();
  const [identifier, setIdentier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isDisabled = identifier === "" || password === "" ? true : false;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const isEmail = identifier.includes("@");

    const payload = isEmail
      ? { identifier: identifier, password } // identifier is Email
      : { identifier: identifier, password }; // identifier is username

    console.log("Submitting login with payload:", payload);

    const result = await api.post<SignInResponse>("/api/auth/login", payload);

    console.log(`Payload backend data: ${result.data}`);

    const roleName = result.data.data.profile?.rolename;

    console.log(`Login ${result.data.data.user}`);
    console.log(`Rolename: ${roleName}`);

    setTimeout(() => {
      if (roleName === "usuario") {
        navigate("/clientDashbord");
      } else if (roleName === "tecnico") {
        navigate("/techDashboard");
      } else {
        navigate("/");
      }
    }, 2000);
  };

  return {
    identifier,
    password,
    t,
    isLoading,
    isDisabled,
    setIsLoading,
    setPassword,
    setIdentier,
    handleSubmit,
  };
}
