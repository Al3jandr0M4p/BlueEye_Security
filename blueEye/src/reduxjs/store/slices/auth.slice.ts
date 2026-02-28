import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AuthState,
  DecodedJWT,
  SessionData,
  UserProfile,
} from "../../../types/types";
import { loginGoogleThunk, loginThunk } from "../thunks/thunks";

const storedAuth = localStorage.getItem("auth");

const initialState: AuthState = storedAuth
  ? (() => {
      try {
        const parsed = JSON.parse(storedAuth);
        return {
          user: parsed.user,
          session: parsed.session,
          profile: parsed.profile,
          isAuthenticated: parsed.isAuthenticated,
          loading: false,
          error: null,
        };
      } catch {
        localStorage.removeItem("auth");
        return {
          user: null,
          session: null,
          profile: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        };
      }
    })()
  : {
      user: null,
      session: null,
      profile: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.profile = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("auth");
      localStorage.removeItem("accessToken");
    },
    setSession: (
      state,
      action: PayloadAction<{
        user: DecodedJWT;
        session: SessionData;
        profile: UserProfile;
      }>,
    ) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.profile = action.payload.profile;
      state.isAuthenticated = true;
      localStorage.setItem("accessToken", action.payload.session.access_token);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user ?? null;
        state.session = action.payload?.session ?? null;
        state.profile = action.payload?.profile ?? null;
        state.isAuthenticated = true;
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: state.user,
            session: state.session,
            profile: state.profile,
            isAuthenticated: state.isAuthenticated,
          }),
        );
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginGoogleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginGoogleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user ?? null;
        state.session = action.payload?.session ?? null;
        state.profile = action.payload?.profile ?? null;
        state.isAuthenticated = true;
        localStorage.setItem(
          "accessToken",
          action.payload?.session.access_token,
        );
      })
      .addCase(loginGoogleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSession, logout } = authSlice.actions;
export default authSlice.reducer;
