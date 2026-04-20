import { useEffect, useState } from "react";
import { fetchSuperAdminCompanies } from "../../../service/service";

const PLAN_META = [
  { accent: "#94a3b8", id: "free", name: "Free", price: "$0" },
  { accent: "#0ea5e9", id: "starter", name: "Starter", price: "$49" },
  { accent: "#06b6d4", id: "pro", name: "Pro", price: "$99" },
  { accent: "#a855f7", id: "enterprise", name: "Enterprise", price: "$249" },
] as const;

export function useSuperAdminPlans() {
  const [plans, setPlans] = useState<
    Array<{
      accent: string;
      adoption: number;
      backendRouteReady: boolean;
      id: string;
      name: string;
      price: string;
    }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadPlans = async () => {
      try {
        setIsLoading(true);
        const companies = await fetchSuperAdminCompanies();
        if (!mounted) return;

        const planCounts = companies.companies.reduce<Record<string, number>>(
          (accumulator, company) => {
            accumulator[company.plan] = (accumulator[company.plan] ?? 0) + 1;
            return accumulator;
          },
          {},
        );

        setPlans(
          PLAN_META.map((plan) => ({
            accent: plan.accent,
            adoption: planCounts[plan.name] ?? 0,
            backendRouteReady: false,
            id: plan.id,
            name: plan.name,
            price: plan.price,
          })),
        );
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError("No se pudo cargar la adopcion de planes.");
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

  return { error, isLoading, plans };
}
