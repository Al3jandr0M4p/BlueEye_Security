import {
  BarChart3,
  CircleHelp,
  Coins,
  LayoutDashboard,
  Lightbulb,
  Monitor,
  Pencil,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import type { NavItem } from "../../types/types";

export const adminNavItems: NavItem[] = [
  {
    label: "Dashboard",
    to: "dashboard",
    icon: <LayoutDashboard size={16} />,
  },
  {
    label: "Empresas",
    to: "business",
    icon: <Monitor size={16} />,
  },
  {
    label: "Proyectos",
    to: "proyects",
    icon: <Pencil size={16} />,
    hasArrow: true,
  },
  {
    label: "Planificacion",
    to: "tech-pre-proyect",
    icon: <TrendingUp size={16} />,
    hasArrow: true,
  },
  {
    label: "Tickets",
    to: "suport",
    icon: <Coins size={16} />,
    hasArrow: true,
  },
  {
    label: "Usuarios",
    to: "employees",
    icon: <Users size={16} />,
    hasArrow: true,
  },
  {
    label: "Reportes",
    to: "reports",
    icon: <BarChart3 size={16} />,
    hasArrow: true,
  },
  {
    label: "Stock",
    to: "devices",
    icon: <Lightbulb size={16} />,
    hasArrow: true,
  },
  {
    label: "Planes",
    to: "pricing",
    icon: <Wallet size={16} />,
  },
];

export const utilityItems = [
  { label: "Soporte", icon: <CircleHelp size={16} />, to: "suport" },
];
