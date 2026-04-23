import { useEffect, useState } from "react";
import { fetchSuperAdminProfile } from "../../../service/service";
import { useAppSelector } from "../../../hooks/use-store-hook";
import type { ProfileActivity } from "../../../types/superAdmin.types";

export function useSuperAdminProfile() {
  const { profile, session, user } = useAppSelector((state) => state.auth);
  const [activity, setActivity] = useState<ProfileActivity[]>([]);
  const [email, setEmail] = useState("No disponible");
  const [role, setRole] = useState("superAdmin");
  const [username, setUsername] = useState("Super Admin");
  const [phone, setPhone] = useState("No disponible");
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadActivity = async () => {
      try {
        const profileData = await fetchSuperAdminProfile();
        if (!mounted) return;

        setActivity(profileData.activity);
        setEmail(profileData.email || "No disponible");
        setRole(profileData.role || "superAdmin");
        setUsername(profileData.username || "Super Admin");
        setPhone(profileData.phone || "No disponible");
        setCreatedAt(profileData.createdAt);
      } catch {
        if (!mounted) return;
        setActivity([]);
        setEmail(user?.email ?? "No disponible");
        setRole(user?.rolename ?? profile?.rolename ?? "superAdmin");
        setUsername(profile?.username ?? user?.username ?? "Super Admin");
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
    {
      device: "Perfil backend",
      ip: phone,
      ok: true,
      when: createdAt ? new Date(createdAt).toLocaleDateString("es-DO") : "Sin fecha",
    },
  ];

  return {
    activity,
    email,
    role,
    sessions,
    username,
  };
}
