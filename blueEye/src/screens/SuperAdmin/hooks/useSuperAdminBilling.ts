import { useEffect, useState } from "react";
import {
  fetchSuperAdminCompanies,
  fetchSuperAdminDashboard,
} from "../../../service/service";

const PLAN_PRICES = {
  Enterprise: 249,
  Free: 0,
  Pro: 99,
  Starter: 49,
} as const;

type BillingCompanyRow = {
  estimatedMrr: number;
  id: string;
  lastActivity: string;
  name: string;
  plan: string;
  status: "activa" | "cancelada" | "suspendida" | "trial";
};

export function useSuperAdminBilling() {
  const [revenue, setRevenue] = useState<Array<{ mes: string; mrr: number }>>([]);
  const [portfolio, setPortfolio] = useState<BillingCompanyRow[]>([]);
  const [mrr, setMrr] = useState(0);
  const [pending, setPending] = useState(0);
  const [overdue, setOverdue] = useState(0);
  const [refunds, setRefunds] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadBilling = async () => {
      try {
        setIsLoading(true);

        const [dashboard, companies] = await Promise.all([
          fetchSuperAdminDashboard(),
          fetchSuperAdminCompanies(),
        ]);

        if (!mounted) return;

        setRevenue(
          dashboard.growthData.map((point) => ({
            mes: point.mes,
            mrr: point.ingresos,
          })),
        );

        setPortfolio(
          companies.companies.map((company) => ({
            estimatedMrr: PLAN_PRICES[company.plan] ?? 0,
            id: String(company.id),
            lastActivity: company.ultimaActividad,
            name: company.name,
            plan: company.plan,
            status: company.estado,
          })),
        );

        setMrr(dashboard.stats.mrr);
        setPending(dashboard.stats.pendingPayment);
        setOverdue(dashboard.stats.pendingInvoices);
        setRefunds(0);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError("No se pudo cargar la vista de facturacion.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void loadBilling();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    error,
    invoices: portfolio,
    isLoading,
    mrr,
    overdue,
    pending,
    refunds,
    revenue,
  };
}
