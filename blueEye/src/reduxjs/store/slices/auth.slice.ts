import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AuthState,
  DecodedJWT,
  SessionData,
  UserProfile,
} from "../../../types/types";
import { loginGoogleThunk, loginThunk } from "../thunks/thunks";

function resolveEffectiveRole(
  userRole?: DecodedJWT["rolename"] | null,
  profileRole?: UserProfile["rolename"] | null,
) {
  if (userRole === "superAdmin" || profileRole === "superAdmin") {
    return "superAdmin" as const;
  }

  return profileRole ?? userRole ?? null;
}

const initialState: AuthState = {
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
    },
    setSession: (
      state,
      action: PayloadAction<{
        user: DecodedJWT;
        session: SessionData;
        profile: UserProfile;
      }>,
    ) => {
      const effectiveRole = resolveEffectiveRole(
        action.payload.user?.rolename,
        action.payload.profile?.rolename,
      );

      state.user = action.payload.user;
      state.session = action.payload.session;
      state.profile = {
        ...action.payload.profile,
        rolename: effectiveRole ?? action.payload.profile.rolename,
      };
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        const effectiveRole = resolveEffectiveRole(
          action.payload?.user?.rolename ?? null,
          action.payload?.profile?.rolename ?? null,
        );

        state.loading = false;
        state.user = action.payload?.user ?? null;
        state.session = action.payload?.session ?? null;
        state.profile = action.payload?.profile
          ? {
              ...action.payload.profile,
              rolename: effectiveRole ?? action.payload.profile.rolename,
            }
          : null;
        state.isAuthenticated = true;
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
        const effectiveRole = resolveEffectiveRole(
          action.payload?.user?.rolename ?? null,
          action.payload?.profile?.rolename ?? null,
        );

        state.loading = false;
        state.user = action.payload?.user ?? null;
        state.session = action.payload?.session ?? null;
        state.profile = action.payload?.profile
          ? {
              ...action.payload.profile,
              rolename: effectiveRole ?? action.payload.profile.rolename,
            }
          : null;
        state.isAuthenticated = true;
      })
      .addCase(loginGoogleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSession, logout } = authSlice.actions;
export default authSlice.reducer;
