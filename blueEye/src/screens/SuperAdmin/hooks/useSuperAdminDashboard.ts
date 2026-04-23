import { useEffect, useState } from "react";
import { fetchSuperAdminDashboard } from "../../../service/service";
import type {
  AuditEntry,
  Company,
  GrowthDataPoint,
  PlanDataPoint,
  QuickAction,
} from "../../../types/superAdmin.types";

const quickActions: QuickAction[] = [
  { icon: "🏢", label: "Nueva Empresa", desc: "Registrar manualmente", to: "/super/admin/companies" },
  { icon: "📦", label: "Editar Planes", desc: "Modificar limites y precios", to: "/super/admin/plans" },
  { icon: "📧", label: "Email Masivo", desc: "Comunicar a todas las empresas", to: "/super/admin/support" },
  { icon: "🔍", label: "Ver Auditoria", desc: "Logs completos del sistema", to: "/super/admin/audit" },
];

export function useSuperAdminDashboard() {
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [growthData, setGrowthData] = useState<GrowthDataPoint[]>([]);
  const [planData, setPlanData] = useState<PlanDataPoint[]>([]);
  const [recentCompanies, setRecentCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState({
    activeBusiness: 0,
    businessInFree: 0,
    disabledBusiness: 0,
    mrr: 0,
    openTickets: 0,
    pendingInvoices: 0,
    pendingPayment: 0,
    unAssignedTickets: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSuperAdminDashboard();
        if (!mounted) return;

        setAuditLog(data.auditLog);
        setGrowthData(data.growthData);
        setPlanData(data.planData);
        setRecentCompanies(data.recentCompanies);
        setStats(data.stats);
        setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: unknown) {
        if (!mounted) return;
        setError("No se pudo cargar el dashboard del super admin.");
      } finally {
        // eslint-disable-next-line no-unsafe-finally
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    auditLog,
    error,
    growthData,
    isLoading,
    planData,
    quickActions,
    recentCompanies,
    stats,
  };
}
