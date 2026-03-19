import React from "react";
import RoleComponentMap from "../../helpers/roleComponentMap";
import { useAppSelector } from "../../hooks/use-store-hook";
import type { Role } from "../../types/types";
import { Navigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const { profile } = useAppSelector((state) => state.auth);

  if (!profile) return null;

  const Component = RoleComponentMap[profile.rolename as Role];

  if (!Component) <Navigate to="/unauthorized" />;

  return <Component />;
};

export default ProfilePage;
