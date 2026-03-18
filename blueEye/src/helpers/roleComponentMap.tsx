import type React from "react";
import type { Role } from "../types/types";
import AdminProfile from "../screens/adminProfile/AdminProfile";

const RoleComponentMap: Record<Role, React.FC> = {
  superAdmin: AdminProfile,
  admin: () => {},
  tecnico: () => {},
  usuario: () => {},
};

export default RoleComponentMap;
