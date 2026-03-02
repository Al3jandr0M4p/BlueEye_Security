import type React from "react";
import type { Role } from "../types/types";

const RoleComponentMap: Record<Role, React.FC> = {
  superAdmin: () => {},
  admin: () => {},
  tecnico: () => {},
  usuario: () => {},
};

export default RoleComponentMap;
