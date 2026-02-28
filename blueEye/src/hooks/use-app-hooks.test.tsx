import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAppSessionAsyncHooks } from "./use-app-hooks";
import { useAppDispatch } from "./use-store-hook";

vi.mock("./use-store-hook", () => ({
  useAppDispatch: vi.fn(),
}));

vi.mock("../reduxjs/store/slices/auth.slice", () => ({
  setSession: vi.fn((payload) => ({ type: "auth/setSession", payload })),
}));

const mockedUseAppDispatch = vi.mocked(useAppDispatch);

describe("useAppSessionAsyncHooks", () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockedUseAppDispatch.mockReturnValue(dispatch);
  });

  it("dispatches setSession when auth data exists", () => {
    localStorage.setItem(
      "auth",
      JSON.stringify({
        user: { username: "john" },
        session: { access_token: "token" },
        profile: { rolename: "usuario", username: "john" },
      }),
    );

    renderHook(() => useAppSessionAsyncHooks());
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it("removes invalid auth data from localStorage", () => {
    localStorage.setItem("auth", "{bad-json");
    renderHook(() => useAppSessionAsyncHooks());

    expect(localStorage.getItem("auth")).toBeNull();
  });
});
