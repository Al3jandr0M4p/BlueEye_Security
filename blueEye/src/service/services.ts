import api from "../api/api";
import type {
  LoginPayload,
  RegisterPayload,
  SignInResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  RegisterResponse,
  CreateAdminPayload,
  ConfigureUserAccountPayload,
  AdminDashboardStats,
} from "../types/types";

export const registerUserService = async (payload: RegisterPayload) => {
  const formData = new FormData();

  formData.append("email", payload.email);
  formData.append("username", payload.username);
  formData.append("password", payload.password);
  formData.append("businessName", payload.businessName);
  formData.append("country", payload.country);
  formData.append("currency", payload.currency);
  formData.append("taxId", payload.taxId);
  formData.append("phone", payload.phone);

  if (payload.logo) {
    formData.append("logo", payload.logo);
  }

  const { data } = await api.post<RegisterResponse>(
    "/api/authentication/v1/business/sign-up",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};

export const loginUser = async (payload: LoginPayload) => {
  const { data } = await api.post<SignInResponse>(
    "/api/authentication/v1/users/sign-in",
    payload,
  );

  return data;
};

export const signOut = async () => {
  await api.post("/api/authentication/v1/accounts/sign-out");
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const { data } = await api.post(
    "/api/authentication/v1/password/reset/request",
    payload,
  );
  return data;
};

export const resetPasswordService = async (payload: ResetPasswordPayload) => {
  const { data } = await api.post(
    "/api/authentication/v1/password/reset/confirm",
    payload,
  );

  return data;
};

export const loginWithGoogleService = async (credential: string) => {
  const { data } = await api.post(
    "/api/authentication/v1/oauth/google/session/sign-in",
    { credential },
  );

  return data;
};

export const createUserAdminService = async (payload: CreateAdminPayload) => {
  const { data } = await api.post("/api/users/v1/invite/users", payload);

  return data;
};

export const configureUserAccountService = async (
  payload: ConfigureUserAccountPayload,
) => {
  const { data } = await api.post("/api/client/v1/config/users/account", payload);

  return data;
};

export async function fetchAdminDashboardStats() {
  const { data } = await api.get<AdminDashboardStats>(
    "/api/admin/v1/dashboard/stats",
  );

  return data.data;
}
