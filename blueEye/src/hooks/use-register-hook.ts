import React, { useState } from "react";
import { useTranslation } from "../../node_modules/react-i18next";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../service/auth.service";

export function useRegisterHook() {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const isDisabled = !email || !password || !userName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const result = await registerUser({
        email,
        username: userName,
        password,
      });

      console.log(`Result ${result.data}`);

      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userName,
    email,
    password,
    t,
    isLoading,
    isDisabled,
    handleSubmit,
    setEmail,
    setPassword,
    setUserName,
  };
}
