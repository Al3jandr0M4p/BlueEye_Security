import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginPayload } from "../../../types/types";
import { loginUser, loginWithGoogleService } from "../../../service/services";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const result = await loginUser(payload);
      return result.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message || "Login failed");
      }
    }
  },
);

export const loginGoogleThunk = createAsyncThunk(
  "auth/loginGoogle",
  async (credential: string, { rejectWithValue }) => {
    try {
      const result = await loginWithGoogleService(credential);
      return result.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message || "Google login failed");
      }
    }
  },
);
