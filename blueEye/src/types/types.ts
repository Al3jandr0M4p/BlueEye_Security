export type UserProfile = {
  rolename: "usuario" | "tecnico" | "admin";
  username: string;
};

export interface SignInResponse {
  data: {
    user: unknown;
    session: unknown;
    profile: UserProfile | null;
  };
  error: string | null;
};

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className: string;
}

export interface LandingCardProps {
  children: React.ReactNode;
  className: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onValueChange: React.Dispatch<React.SetStateAction<string>>;
  text: string;
  type: string;
  translationKey: string;
  error?: string;
}
