import { useDeferredValue, useEffect, useState } from "react";
import {
  createUserAdminService,
  deleteAdminUserService,
  fetchSuperAdminCompanies,
  fetchSuperAdminUsers,
  updateAdminUserService,
} from "../../../service/service";
import { useAppSelector } from "../../../hooks/use-store-hook";
import type { SuperAdminUserRow } from "../../../types/superAdmin.types";

type AccessRow = {
  actor: string;
  company: string;
  createdAt: string;
  email: string;
  id: string;
  phone: string;
  role: string;
  status: string;
};

export function useSuperAdminUsers() {
  const { profile, user } = useAppSelector((state) => state.auth);
  const [entries, setEntries] = useState<AccessRow[]>([]);
  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [total, setTotal] = useState(0);

  const loadUsersOverview = async (searchValue = deferredSearch.trim()) => {
    setIsLoading(true);
    try {
      const [usersData, companiesData] = await Promise.all([
        fetchSuperAdminUsers(searchValue),
        fetchSuperAdminCompanies(),
      ]);

      setEntries(
        usersData.rows.map((entry: SuperAdminUserRow) => ({
          actor: entry.username,
          company: entry.company,
          createdAt: entry.createdAt
            ? new Date(entry.createdAt).toLocaleDateString("es-DO")
            : "No disponible",
          email: entry.email,
          id: entry.id,
          phone: entry.phone,
          role: entry.role,
          status: entry.status,
        })),
      );
      setCompanies(
        companiesData.companies.map((company) => ({
          id: String(company.id),
          name: company.name,
        })),
      );
      setTotal(usersData.total);
      setError(null);
    } catch {
      setError("No se pudo cargar la vista de usuarios.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadUsersOverview();
  }, [deferredSearch]);

  const createUser = async (payload: {
    businessId: string;
    email: string;
    fullName?: string;
    phone?: string;
    rolename: "usuario" | "tecnico";
    username?: string;
  }) => {
    await createUserAdminService(payload);
    await loadUsersOverview();
  };

  const updateUser = async (
    userId: string,
    payload: {
      email?: string;
      phone?: string;
      password?: string;
    },
  ) => {
    await updateAdminUserService(userId, payload);
    await loadUsersOverview();
  };

  const deleteUser = async (userId: string) => {
    await deleteAdminUserService(userId);
    await loadUsersOverview();
  };

  const currentUser = {
    email: user?.email ?? "No disponible",
    name: profile?.username ?? user?.username ?? "Super Admin",
    role: user?.rolename ?? profile?.rolename ?? "superAdmin",
  };

  return {
    admins: entries.filter((entry) => ["admin", "superAdmin"].includes(entry.role)).length,
    companies,
    createUser,
    currentUser,
    deleteUser,
    entries,
    error,
    integrationNote: "Listado y acciones conectados a `/api/super/admin/users` y `/api/users/v1/*`.",
    isLoading,
    search,
    setSearch,
    total,
    updateUser,
  };
}
