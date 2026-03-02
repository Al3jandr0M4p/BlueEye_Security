import {
  BarChart3,
  Bell,
  CircleHelp,
  Coins,
  LayoutDashboard,
  Lightbulb,
  Monitor,
  Pencil,
  Settings,
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
    label: "Notifications",
    to: "clients",
    icon: <Bell size={16} />,
  },
  {
    label: "Website Builder",
    to: "business",
    icon: <Monitor size={16} />,
  },
  {
    label: "Write",
    to: "proyects",
    icon: <Pencil size={16} />,
    hasArrow: true,
  },
  {
    label: "Grow",
    to: "tech-pre-proyect",
    icon: <TrendingUp size={16} />,
    hasArrow: true,
  },
  {
    label: "Monetization",
    to: "orders-payments",
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
    label: "Analyze",
    to: "reports",
    icon: <BarChart3 size={16} />,
    hasArrow: true,
  },
  {
    label: "Learn",
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
  { label: "Settings", icon: <Settings size={16} />, to: "/perfil" },
  { label: "Help", icon: <CircleHelp size={16} />, to: "suport" },
];
