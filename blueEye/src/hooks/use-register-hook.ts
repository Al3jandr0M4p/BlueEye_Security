import type React from "react";
import { useState } from "react";
import { useTranslation } from "../../node_modules/react-i18next";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export function useRegisterHook() {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isDisabled =
    email === "" || password === "" || userName === "" ? true : false;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const newUser = {
      email: email,
      username: userName,
      password: password,
    };

    console.log("new user:", newUser);

    try {
      const result = await api.post("/api/auth/register", newUser);

      console.log(`Result ${result.data}`);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(`Error ${err.message} ${err.cause}`);
      }
    }
  };

  return {
    userName,
    email,
    password,
    t,
    isLoading,
    isDisabled,
    setIsLoading,
    handleSubmit,
    setEmail,
    setPassword,
    setUserName,
  };
}
