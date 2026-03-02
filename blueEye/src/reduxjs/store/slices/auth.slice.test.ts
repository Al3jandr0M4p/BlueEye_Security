import { describe, expect, it } from "vitest";
import type { AuthState } from "../../../types/types";
import authReducer, { logout, setSession } from "./auth.slice";

describe("auth slice", () => {
  it("sets session and marks user as authenticated", () => {
    const currentState: AuthState = {
      user: null,
      session: null,
      profile: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };

    const nextState = authReducer(
      currentState,
      setSession({
        user: {
          sub: "123",
          username: "john",
          rolename: "usuario",
          exp: 123456,
          iat: 123455,
          email: "john@test.com",
        },
        session: {
          access_token: "token-value",
          refresh_token: "refresh-value",
        },
        profile: {
          rolename: "usuario",
          username: "john",
        },
      }),
    );

    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.profile?.rolename).toBe("usuario");
    expect(localStorage.getItem("accessToken")).toBe("token-value");
  });

  it("clears authentication state on logout", () => {
    const currentState: AuthState = {
      user: {
        sub: "123",
        username: "john",
        rolename: "tecnico",
        exp: 123456,
        iat: 123455,
      },
      session: {
        access_token: "token-value",
      },
      profile: {
        rolename: "tecnico",
        username: "john",
      },
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    const nextState = authReducer(currentState, logout());

    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.user).toBeNull();
    expect(nextState.session).toBeNull();
    expect(nextState.profile).toBeNull();
  });
});
