import type React from "react";
import type { Role } from "../types/types";
import UserProfilePage from "../components/ProfileContainer/UserProfilePage";

const RoleComponentMap: Record<Role, React.FC> = {
  superAdmin: UserProfilePage,
  admin: UserProfilePage,
  tecnico: UserProfilePage,
  usuario: UserProfilePage,
};

export default RoleComponentMap;
