import { useEffect, useState } from "react";
import { fetchSuperAdminBilling } from "../../../service/service";
import type {
  SuperAdminBillingCompanyRow,
  SuperAdminBillingPoint,
} from "../../../types/superAdmin.types";

export function useSuperAdminBilling() {
  const [revenue, setRevenue] = useState<SuperAdminBillingPoint[]>([]);
  const [portfolio, setPortfolio] = useState<SuperAdminBillingCompanyRow[]>([]);
  const [mrr, setMrr] = useState(0);
  const [pending, setPending] = useState(0);
  const [overdue, setOverdue] = useState(0);
  const [refunds, setRefunds] = useState(0);
  const [paidInvoices, setPaidInvoices] = useState(0);
  const [collected, setCollected] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadBilling = async () => {
      try {
        setIsLoading(true);
        const billing = await fetchSuperAdminBilling();

        if (!mounted) return;
        setRevenue(billing.revenue);
        setPortfolio(billing.portfolio);
        setMrr(billing.summary.mrr);
        setPending(billing.summary.pendingPayments);
        setOverdue(billing.summary.pendingInvoices);
        setRefunds(billing.summary.refunds);
        setPaidInvoices(billing.summary.paidInvoices);
        setCollected(billing.summary.totalCollected);
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
    paidInvoices,
    mrr,
    overdue,
    pending,
    refunds,
    revenue,
    collected,
  };
}
