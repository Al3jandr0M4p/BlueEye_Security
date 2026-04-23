import React from "react";
import type { ProtectedRouteProps } from "../../types/types";
import { useAppSelector } from "../../hooks/use-store-hook";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, profile } = useAppSelector((state) => state.auth);
  const user = useAppSelector((state) => state.auth.user);
  const isHydrated = useAppSelector((state) => state._persist?.rehydrated);

  if (!isHydrated) return null;

  if (!isAuthenticated || !profile) {
    return <Navigate to="/login" replace />;
  }

  const effectiveRole =
    profile?.rolename === "superAdmin" || user?.rolename === "superAdmin"
      ? "superAdmin"
      : profile?.rolename ?? user?.rolename;

  if (!effectiveRole || !allowedRoles.includes(effectiveRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
