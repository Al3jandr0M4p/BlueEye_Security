import React, { useState } from "react";
import { forgotPassword } from "../service/service";
import { sileo } from "sileo";

export function useForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isDisabled = !email;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const data = await forgotPassword({ email });

      sileo.success({
        title: "Correo de verificacion",
        description: `Te enviamos un Correo de verificacion al gmail ${email}`,
      });

      console.log("Password recovery request successful:", data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("Error recovering user password:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    isDisabled,
    isLoading,
    setEmail,
    handleSubmit,
  };
}
