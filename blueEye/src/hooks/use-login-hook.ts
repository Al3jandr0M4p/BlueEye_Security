import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../service/auth.service";

export function useLoginHook() {
  const [identifier, setIdentier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const isDisabled = !identifier || !password;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await loginUser({ identifier, password });

      const roleName = result.data.profile?.rolename;

      console.log(`Login ${result.data.user}`);
      console.log(`Rolename: ${roleName}`);

      setTimeout(() => {
        if (roleName === "usuario") navigate("/clientDashbord");
        else if (roleName === "tecnico") navigate("/techDashboard");
        else navigate("/login");
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    identifier,
    password,
    isLoading,
    isDisabled,
    setPassword,
    setIdentier,
    handleSubmit,
  };
}
