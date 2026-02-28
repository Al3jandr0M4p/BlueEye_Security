import React from "react";
import RoleComponentMap from "../../helpers/roleComponentMap";
import { useAppSelector } from "../../hooks/use-store-hook";
import type { Role } from "../../types/types";

const ProfilePage: React.FC = () => {
  const { profile } = useAppSelector((state) => state.auth);

  if (!profile) return null;

  const role = profile.rolename as Role;

  const Component = RoleComponentMap[role];

  return Component ? <Component /> : <h1>Unauthorized</h1>;
};

export default ProfilePage;
