import React from "react";

type AdminPageShellProps = {
  tag?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

const AdminPageShell: React.FC<AdminPageShellProps> = ({
  tag,
  title,
  subtitle,
  actions,
  children,
  className,
}) => {
  return (
    <section
      className={`space-y-8 px-4 py-6 sm:px-6 lg:px-8 ${className ?? ""}`}
    >
      <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900 p-6 text-white shadow-2xl shadow-indigo-900/40">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 left-4 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="relative space-y-3">
          {tag && (
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">
              {tag}
            </p>
          )}
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="max-w-3xl text-sm text-white/80">{subtitle}</p>
          )}
          {actions && (
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-white">
              {actions}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
};

export default AdminPageShell;
