import type React from "react";
import type { Role } from "../types/types";
import AdminProfilePage from "../screens/adminProfile/AdminProfile";
import UserProfilePage from "../components/ProfileContainer/UserProfilePage";

const RoleComponentMap: Record<Role, React.FC> = {
  superAdmin: UserProfilePage,
  admin: AdminProfilePage,
  tecnico: UserProfilePage,
  usuario: UserProfilePage,
};

export default RoleComponentMap;
