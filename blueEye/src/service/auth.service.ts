import api from "../api/api"
import type { LoginPayload, RegisterPayload, SignInResponse } from "../types/types";

export const registerUser = async (payload: RegisterPayload) => {
    const { data } = await api.post("/api/auth/register", payload);
    return data;
}

export const loginUser = async (payload: LoginPayload) => {
  const { data } = await api.post<SignInResponse>("/api/auth/login", payload);
  return data;
};
