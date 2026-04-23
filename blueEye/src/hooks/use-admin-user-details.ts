import { useCallback, useEffect, useState } from "react";
import { sileo } from "sileo";
import {
  deleteAdminUserService,
  fetchAdminUserByIdService,
  updateAdminUserService,
} from "../service/service";
import type { AdminManagedUser, AdminUserUpdatePayload } from "../types/types";

const initialForm = {
  email: "",
  password: "",
  phone: "",
};

export function useAdminUserDetails(userId?: string) {
  const [user, setUser] = useState<AdminManagedUser | null>(null);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUser = useCallback(async () => {
    if (!userId) {
      setError("Usuario no encontrado.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const data = await fetchAdminUserByIdService(userId);
      setUser(data);
      setForm({
        email: data.email === "Sin correo" ? "" : data.email,
        password: "",
        phone: data.phone === "Sin telefono" ? "" : data.phone,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo cargar el usuario.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const updateField =
    (field: keyof typeof initialForm) => (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const saveChanges = useCallback(async () => {
    if (!userId) return false;

    const payload: AdminUserUpdatePayload = {};

    if (form.email.trim()) payload.email = form.email.trim();
    if (form.phone.trim()) payload.phone = form.phone.trim();
    if (form.password.trim()) payload.password = form.password.trim();

    if (Object.keys(payload).length === 0) {
      return true;
    }

    try {
      await sileo.promise(updateAdminUserService(userId, payload), {
        loading: { title: "Actualizando usuario..." },
        success: { title: "Usuario actualizado" },
        error: { title: "No se pudo actualizar" },
      });

      await loadUser();
      return true;
    } catch {
      return false;
    }
  }, [form.email, form.password, form.phone, loadUser, userId]);

  const deactivateUser = useCallback(async () => {
    if (!userId) return false;

    try {
      await sileo.promise(deleteAdminUserService(userId), {
        loading: { title: "Deshabilitando usuario..." },
        success: { title: "Usuario deshabilitado" },
        error: { title: "No se pudo deshabilitar" },
      });

      await loadUser();
      return true;
    } catch {
      return false;
    }
  }, [loadUser, userId]);

  return {
    deactivateUser,
    error,
    form,
    isLoading,
    saveChanges,
    updateField,
    user,
  };
}
