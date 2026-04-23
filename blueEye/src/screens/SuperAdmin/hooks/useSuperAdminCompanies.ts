import { useDeferredValue, useEffect, useState } from "react";
import {
  activateSuperAdminCompany,
  fetchSuperAdminCompanies,
  suspendSuperAdminCompany,
  updateSuperAdminCompanyPlan,
} from "../../../service/service";
import type { Company } from "../../../types/superAdmin.types";

export function useSuperAdminCompanies() {
  const [companies, setCompanies] = useState<
    Array<
      Company & {
        mrr: number;
        openTickets: number;
        pendingInvoices: number;
        pendingPayments: number;
        totalUsers: number;
        ultimaActividad: string;
      }
    >
  >([]);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuspendingId, setIsSuspendingId] = useState<string | null>(null);
  const [isSavingPlanId, setIsSavingPlanId] = useState<string | null>(null);

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

  const handleActivateCompany = async (companyId: string) => {
    try {
      setIsSuspendingId(companyId);
      await activateSuperAdminCompany(companyId);
      setCompanies((current) =>
        current.map((company) =>
          String(company.id) === companyId
            ? { ...company, estado: "activa" }
            : company,
        ),
      );
    } finally {
      setIsSuspendingId(null);
    }
  };

  const handlePlanChange = async (
    companyId: string,
    plan: "free" | "starter" | "pro" | "enterprise",
  ) => {
    const planLabelMap: Record<typeof plan, Company["plan"]> = {
      enterprise: "Enterprise",
      free: "Free",
      pro: "Pro",
      starter: "Starter",
    };

    try {
      setIsSavingPlanId(companyId);
      await updateSuperAdminCompanyPlan(companyId, plan);
      setCompanies((current) =>
        current.map((company) =>
          String(company.id) === companyId
            ? { ...company, plan: planLabelMap[plan] }
            : company,
        ),
      );
    } finally {
      setIsSavingPlanId(null);
    }
  };

  return {
    activas: companies.filter((company) => company.estado === "activa").length,
    companies,
    error,
    handleActivateCompany,
    handlePlanChange,
    handleSuspendCompany,
    isLoading,
    isSavingPlanId,
    isSuspendingId,
    search,
    setSearch,
    suspendidas: companies.filter((company) => company.estado === "suspendida").length,
    total: companies.length,
    trial: companies.filter((company) => company.estado === "trial").length,
  };
}
