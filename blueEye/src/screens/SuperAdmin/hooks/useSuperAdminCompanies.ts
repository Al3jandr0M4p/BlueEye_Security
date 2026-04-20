import { useDeferredValue, useEffect, useState } from "react";
import {
  fetchSuperAdminCompanies,
  suspendSuperAdminCompany,
} from "../../../service/service";
import type { Company } from "../../../types/superAdmin.types";

export function useSuperAdminCompanies() {
  const [companies, setCompanies] = useState<
    Array<Company & { mrr: number; ultimaActividad: string }>
  >([]);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuspendingId, setIsSuspendingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadCompanies = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSuperAdminCompanies(deferredSearch.trim());
        if (!mounted) return;

        setCompanies(data.companies);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError("No se pudieron cargar las empresas.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void loadCompanies();

    return () => {
      mounted = false;
    };
  }, [deferredSearch]);

  const handleSuspendCompany = async (companyId: string) => {
    try {
      setIsSuspendingId(companyId);
      await suspendSuperAdminCompany(companyId);
      setCompanies((current) =>
        current.map((company) =>
          String(company.id) === companyId
            ? { ...company, estado: "suspendida" }
            : company,
        ),
      );
    } finally {
      setIsSuspendingId(null);
    }
  };

  return {
    activas: companies.filter((company) => company.estado === "activa").length,
    companies,
    error,
    handleSuspendCompany,
    isLoading,
    isSuspendingId,
    search,
    setSearch,
    suspendidas: companies.filter((company) => company.estado === "suspendida").length,
    total: companies.length,
    trial: companies.filter((company) => company.estado === "trial").length,
  };
}
