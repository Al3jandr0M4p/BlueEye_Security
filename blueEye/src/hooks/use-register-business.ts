import { useMemo, useState } from "react";

export function useRegisterBusinessHook() {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rnc, setRnc] = useState<string>("");

  const isValidRnc = (rnc: string) => /^\d{9}$|^\d{11}$/.test(rnc);
  const rncError = useMemo(() => {
    if (!rnc) return "";
    if (!isValidRnc(rnc)) return "RNC inválido (9 o 11 dígitos)";
    return "";
  }, [rnc]);

  const isDisabled = !email || !password || !userName || !!rnc;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rncError) return;

    setIsLoading(true);

    try {
      setTimeout(() => {
        console.log("Registration successful");
      }, 1000);
    } catch (err) {
      console.log("Error sign up", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    password,
    email,
    userName,
    isLoading,
    rnc,
    rncError,
    isDisabled,
    handleSubmit,
    setPassword,
    setEmail,
    setUserName,
    setRnc,
  };
}
