import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import type {
  SuperAdminNavItem,
  SuperAdminPageMeta,
} from "../../../types/superAdmin.types";

const navItems: SuperAdminNavItem[] = [
  { to: "dashboard", icon: "□", label: "Dashboard" },
  { to: "companies", icon: "🏢", label: "Empresas" },
  { to: "plans", icon: "📦", label: "Planes" },
  { to: "billing", icon: "💳", label: "Facturacion" },
  { to: "users", icon: "👥", label: "Usuarios" },
  { to: "audit", icon: "🔍", label: "Auditoria" },
  { to: "support", icon: "🎧", label: "Soporte" },
  { to: "settings", icon: "⚙️", label: "Config." },
  { to: "profile", icon: "👤", label: "Perfil" },
];

const pageMeta: Record<string, SuperAdminPageMeta> = {
  dashboard: { title: "Dashboard Global", subtitle: "Vision general de toda la plataforma" },
  companies: { title: "Empresas", subtitle: "Gestion de cuentas, estado y consumo" },
  plans: { title: "Planes", subtitle: "Paquetes, limites y precios" },
  billing: { title: "Facturacion", subtitle: "Pagos, facturas y revenue" },
  users: { title: "Usuarios", subtitle: "Cuentas, roles y accesos" },
  audit: { title: "Auditoria", subtitle: "Bitacora de eventos y trazabilidad" },
  support: { title: "Soporte", subtitle: "Tickets y SLA" },
  settings: { title: "Configuracion", subtitle: "Preferencias globales y seguridad" },
  profile: { title: "Perfil Super Admin", subtitle: "Informacion y preferencias de la cuenta" },
};

export function useSuperAdminLayout() {
  const location = useLocation();
  const [time, setTime] = useState<Date>(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const page = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    const last = parts.length > 0 ? parts[parts.length - 1] : "dashboard";
    const key = last === "admin" ? "dashboard" : last;
    return pageMeta[key] ?? pageMeta.dashboard;
  }, [location.pathname]);

  return {
    navItems,
    page,
    time,
  };
}
