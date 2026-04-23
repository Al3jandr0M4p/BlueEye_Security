import { AxiosError } from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { configureUserAccountService } from "../service/service";

export function useInviteUserConfigurationHook() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const invitationToken =
    searchParams.get("token") ??
    searchParams.get("invitationToken") ??
    undefined;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isDisabled =
    !firstName.trim() ||
    !lastName.trim();
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      const fullName = `${firstName} ${lastName}`
      await configureUserAccountService({
        username: fullName,
        invitationToken,
      });

      navigate("/clientDashboard");
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message ?? err.message
          : "No se pudo configurar la cuenta. Intenta nuevamente.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    firstName,
    lastName,
    isLoading,
    error,
    isDisabled,
    invitationToken,
    setFirstName,
    setLastName,
    handleSubmit,
  };
}
