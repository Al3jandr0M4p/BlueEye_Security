import React from "react";

interface AppNavbarProps {
  show?: boolean;
  className?: string;
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  show = true,
  className = "",
  left,
  center,
  right,
  children,
}) => {
  return (
    <nav
      className={`
        fixed z-50
        flex items-center
        px-6 h-14
        bg-blue-50 shadow-xl
        transition-transform duration-300
        ${show ? "translate-y-0" : "-translate-y-24"}
        ${className}
      `}
    >
      {/* LEFT */}
      {left && <div className="flex items-center gap-4 shrink-0">{left}</div>}

      {/* CENTER */}
      <div className="flex-1 flex items-center justify-center">{center}</div>

      {/* RIGHT */}
      {right && (
        <div className="flex items-center gap-4 shrink-0 ml-auto">{right}</div>
      )}

      {/* OVERLAYS / PORTALS (NotificationsPanel, etc.) */}
      {children}
    </nav>
  );
};
