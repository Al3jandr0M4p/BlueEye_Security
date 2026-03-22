import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginPayload } from "../../../types/types";
import { loginUser, loginWithGoogleService } from "../../../service/services";
import { supabase } from "../../../lib/supabase";
import api from "../../../api/api";
import { jwtDecode } from "jwt-decode";

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

export const getSessionThunk = createAsyncThunk(
  "auth/getSession",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        throw new Error("No session");
      }

      const session = data.session;

      const decoded = jwtDecode(session.access_token);

      const res = await api.get("/api/client/v1/read/users/me", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      return {
        user: decoded,
        session,
        profile: res.data.data,
      };
    } catch {
      return rejectWithValue("Session error");
    }
  },
);
