import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  accent: "blue" | "green" | "red" | "amber";
  icon?: ReactNode;
}

const accentClasses: Record<StatCardProps["accent"], string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-green-200 bg-green-50 text-green-700",
  red: "border-red-200 bg-red-50 text-red-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
};

const StatCard = ({ title, value, accent, icon }: StatCardProps) => (
  <article className={`rounded-xl border p-4 shadow-sm ${accentClasses[accent]}`}>
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium">{title}</p>
      {icon}
    </div>
    <p className="mt-3 text-3xl font-bold">{value}</p>
  </article>
);

export default StatCard;
