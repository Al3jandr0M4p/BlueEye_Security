import { useEffect, useState } from "react";
import { fetchSuperAdminAudit } from "../../../service/service";
import { useAppSelector } from "../../../hooks/use-store-hook";

type AccessRow = {
  actor: string;
  company: string;
  id: string;
  lastSeen: string;
  risk: "alto" | "normal";
};

export function useSuperAdminUsers() {
  const { profile, user } = useAppSelector((state) => state.auth);
  const [entries, setEntries] = useState<AccessRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUsersOverview = async () => {
      try {
        setIsLoading(true);
        const audit = await fetchSuperAdminAudit();
        if (!mounted) return;

        const seen = new Map<string, AccessRow>();

        audit.entries.forEach((entry, index) => {
          if (!seen.has(entry.actor)) {
            seen.set(entry.actor, {
              actor: entry.actor,
              company: entry.empresa,
              id: `${entry.actor}-${index}`,
              lastSeen: entry.tiempo,
              risk: entry.tipo === "critical" ? "alto" : "normal",
            });
          }
        });

        setEntries(Array.from(seen.values()).slice(0, 8));
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError("No se pudo cargar la vista de accesos.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void loadUsersOverview();

    return () => {
      mounted = false;
    };
  }, []);

  const currentUser = {
    email: user?.email ?? "No disponible",
    name: profile?.username ?? user?.username ?? "Super Admin",
    role: user?.rolename ?? profile?.rolename ?? "superAdmin",
  };

  return {
    admins: entries.filter((entry) => entry.company !== "-").length,
    currentUser,
    entries,
    error,
    integrationNote: "El backend aun no expone GET /api/super/admin/users para listado global de cuentas.",
    invited: 0,
    isLoading,
    mfaPercent: 0,
    total: entries.length,
  };
}
