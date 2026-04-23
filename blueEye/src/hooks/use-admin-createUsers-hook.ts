import { useMemo, useState } from "react";
import { sileo } from "sileo";
import { createUserAdminService } from "../service/service";
import type { CreateAdminPayload, UserRoleTab } from "../types/types";

interface UseAdminCreateUsersHookParams {
  onSuccess?: () => Promise<void> | void;
  selectedType: UserRoleTab;
}

const initialFormState = {
  city: "",
  email: "",
  fullName: "",
  phone: "",
  username: "",
};

export function useAdminCreateUsersHook({
  onSuccess,
  selectedType,
}: UseAdminCreateUsersHookParams) {
  const [formData, setFormData] = useState(initialFormState);

  const isSubmitDisabled = useMemo(
    () =>
      !formData.email.trim() ||
      !formData.fullName.trim() ||
      !formData.username.trim(),
    [formData.email, formData.fullName, formData.username],
  );

  const updateField =
    (field: keyof typeof initialFormState) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleCreateUser = async () => {
    if (isSubmitDisabled) return;

    try {
      const payload: CreateAdminPayload = {
        email: formData.email.trim(),
        rolename: selectedType,
        username: formData.username.trim(),
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim() || undefined,
        city: formData.city.trim() || undefined,
      };

      const promise = createUserAdminService(payload);

      await sileo.promise(promise, {
        loading: { title: "Creando usuario..." },
        success: { title: "Usuario creado y enviado al backend" },
        error: { title: "No se pudo crear el usuario" },
      });

      setFormData(initialFormState);
      await onSuccess?.();
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
      }
    }
  };

  return {
    formData,
    handleCreateUser,
    isSubmitDisabled,
    updateField,
  };
}
