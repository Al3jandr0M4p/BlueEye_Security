import { useState } from "react";
import { createUserAdminService } from "../service/services";
import { sileo } from "sileo";

export function useAdminCreateUsersHook() {
  const [selectedType, setSelectedType] = useState<
    "usuario" | "tecnico" | null
  >(null);
  const [email, setEmail] = useState<string>("");

  const handleCreateUser = async () => {
    if (!email || !selectedType) return;

    try {
      const promise = createUserAdminService({
        email,
        rolename: selectedType,
      });

      sileo.promise(promise, {
        loading: { title: "Enviando invitacion..." },
        success: { title: "Link enviado al gmail exitosamente" },
        error: { title: "No se pudo enviar la invitacion" },
      });
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
      }
    }
  };

  return {
    selectedType,
    email,
    setSelectedType,
    setEmail,
    handleCreateUser,
  };
}
