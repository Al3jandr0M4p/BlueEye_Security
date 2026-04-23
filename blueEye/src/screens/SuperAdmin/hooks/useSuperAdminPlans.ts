import { useEffect, useState } from "react";
import {
  fetchSuperAdminPlans,
  updateSuperAdminPlan,
} from "../../../service/service";
import type { SuperAdminPlanRow } from "../../../types/superAdmin.types";

export function useSuperAdminPlans() {
  const [plans, setPlans] = useState<SuperAdminPlanRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadPlans = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSuperAdminPlans();
        if (!mounted) return;

        setPlans(data);
        setError(null);
      } catch {
        if (!mounted) return;
        setError("No se pudo cargar el catalogo de planes.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void loadPlans();

    return () => {
      mounted = false;
    };
  }, []);

  const handlePlanFieldChange = (
    planId: SuperAdminPlanRow["id"],
    field: keyof SuperAdminPlanRow,
    value: string | number,
  ) => {
    setPlans((current) =>
      current.map((plan) =>
        plan.id === planId ? { ...plan, [field]: value } : plan,
      ),
    );
  };

  const handleSavePlan = async (plan: SuperAdminPlanRow) => {
    try {
      setSavingPlanId(plan.id);
      await updateSuperAdminPlan(plan.id, {
        accent: plan.accent,
        description: plan.description,
        maxBusinesses: plan.maxBusinesses,
        maxSites: plan.maxSites,
        maxTickets: plan.maxTickets,
        maxUsers: plan.maxUsers,
        name: plan.name,
        price: plan.price,
      });
      setError(null);
    } catch {
      setError(`No se pudo guardar el plan ${plan.name}.`);
    } finally {
      setSavingPlanId(null);
    }
  };

  return {
    error,
    handlePlanFieldChange,
    handleSavePlan,
    isLoading,
    plans,
    savingPlanId,
  };
}
