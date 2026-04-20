import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchAdminUsersService } from "../service/service";
import type { AdminManagedUser, UserRoleTab } from "../types/types";

export function useAdminUsers(activeTab: UserRoleTab) {
  const [users, setUsers] = useState<AdminManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await fetchAdminUsersService();
      setUsers(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar la lista de usuarios.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(
    () => users.filter((user) => user.rolename === activeTab),
    [activeTab, users],
  );

  return {
    error,
    isLoading,
    loadUsers,
    users: filteredUsers,
  };
}
