import React from "react";

export type Role = "usuario" | "tecnico" | "admin" | "superAdmin";

export type UserProfile = {
  rolename: Role;
  username: string;
};

export interface DecodedJWT {
  sub: string;
  email?: string;
  username: string;
  rolename: Role;
  exp: number;
  iat: number;
}

export interface SignInResponse {
  data: {
    user: DecodedJWT;
    session: SessionData;
    profile: UserProfile | null;
  };
  error: string | null;
}

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
  password: string;
  businessName: string;
  country: string;
  currency: string;
  username: string;
  taxId: string;
  phone: string;
  logo: File;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onValueChange: (value: string) => void;
  text: string;
  type: string;
  translationKey: string;
  error?: string;
  variant: "default" | "unstyled";
}

export interface SessionData {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export interface AuthState {
  user: DecodedJWT | null;
  session: SessionData | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string | null;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  newPassword: string;
  access_token: string;
  refresh_token: string;
}

export interface RestCountry {
  name: {
    common: string;
  };
  cca2: string;
  idd: {
    root?: string;
    suffixes?: string[];
  };
  currencies?: Record<
    string,
    {
      name: string;
      symbol?: string;
    }
  >;
}

export interface CountryOption {
  name: string;
  code: string;
  dialCodes: string[];
  currencies: string[];
}

export interface FormComponentProps {
  handleSubmit: (e: React.FormEvent<Element>) => Promise<void>;
  handleLogoChange: (file: File | null) => void;
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  logoPreview: string | null;
  isLoading: boolean;
  isDisabledSubmit: boolean;
}

export interface FormComponentFirstProps {
  email: string;
  password: string;
  username: string;
  businessName: string;
  currencyOptions: {
    value: string;
    label: string;
  }[];
  dialCodeOptions: {
    value: string;
    label: string;
  }[];
  countryOptions: {
    value: string;
    label: string;
  }[];
  phone: string;
  taxId: string;
  isDisabledFirst: boolean;
  currency: string;
  country: string;
  dialCode: string;
  taxIdError: string;
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setBusinessName: React.Dispatch<React.SetStateAction<string>>;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setTaxId: React.Dispatch<React.SetStateAction<string>>;
  setDialCode: React.Dispatch<React.SetStateAction<string>>;
  handlePhoneChange: (value: string) => void;
}

export interface RegisterResponse {
  message: string;
  data: {
    userId: string | null;
    businessId: string | null;
  }
}

export interface ComingSoonModalProps {
  setOpenModal: (v: boolean) => void;
}

export interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  hasArrow?: boolean;
};
