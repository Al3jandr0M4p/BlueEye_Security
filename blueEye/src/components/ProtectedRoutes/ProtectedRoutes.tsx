import React from "react";
import type { ProtectedRouteProps } from "../../types/types";
import { useAppSelector } from "../../hooks/use-store-hook";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, profile } = useAppSelector((state) => state.auth);
  const isHydrated = useAppSelector((state) => state._persist?.rehydrated);

  if (!isHydrated) return null;

  if (!isAuthenticated || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(profile.rolename)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
