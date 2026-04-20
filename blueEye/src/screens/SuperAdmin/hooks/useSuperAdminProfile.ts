import { useEffect, useState } from "react";
import { fetchSuperAdminAudit } from "../../../service/service";
import { useAppSelector } from "../../../hooks/use-store-hook";

export function useSuperAdminProfile() {
  const { profile, session, user } = useAppSelector((state) => state.auth);
  const [activity, setActivity] = useState<
    Array<{ a: string; c: string; t: string }>
  >([]);

  useEffect(() => {
    let mounted = true;

    const loadActivity = async () => {
      try {
        const audit = await fetchSuperAdminAudit();
        if (!mounted) return;

        setActivity(
          audit.entries.slice(0, 6).map((entry) => ({
            a: entry.accion,
            c:
              entry.tipo === "critical"
                ? "#ef4444"
                : entry.tipo === "warn"
                  ? "#f59e0b"
                  : "#22d3ee",
            t: entry.tiempo,
          })),
        );
      } catch {
        if (!mounted) return;
        setActivity([]);
      }
    };

    void loadActivity();

    return () => {
      mounted = false;
    };
  }, []);

  const sessions = [
    {
      device: "Sesion actual",
      ip: "Protegida por token",
      ok: true,
      when: session?.expires_in ? `Expira en ${session.expires_in}s` : "Activa",
    },
    {
      device: "Usuario autenticado",
      ip: user?.sub ?? "No disponible",
      ok: true,
      when: user?.email ?? "Sin email",
    },
  ];

  return {
    activity,
    email: user?.email ?? "No disponible",
    role: user?.rolename ?? profile?.rolename ?? "superAdmin",
    sessions,
    username: profile?.username ?? user?.username ?? "Super Admin",
  };
}
