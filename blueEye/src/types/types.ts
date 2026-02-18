export type UserProfile = {
  rolename: "usuario" | "tecnico" | "admin";
  username: string;
};

export type SignInResponse = {
  data: {
    user: unknown;
    session: unknown;
    profile: UserProfile | null;
  };
  error: string | null;
};
