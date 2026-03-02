import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDashboardTech } from "./use-dashboard-tech";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "./use-store-hook";
import { persistor } from "../reduxjs/store/store";

vi.mock("./use-store-hook", () => ({
  useAppDispatch: vi.fn(),
}));

vi.mock("../reduxjs/store/slices/auth.slice", () => ({
  logout: vi.fn(() => ({ type: "auth/logout" })),
}));

vi.mock("../reduxjs/store/store", () => ({
  persistor: {
    purge: vi.fn(),
  },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

const mockedUseAppDispatch = vi.mocked(useAppDispatch);
const mockedUseNavigate = vi.mocked(useNavigate);
const mockedUseLocation = vi.mocked(useLocation);
const mockedPurge = vi.mocked(persistor.purge);

describe("useDashboardTech", () => {
  const dispatch = vi.fn();
  const navigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAppDispatch.mockReturnValue(dispatch);
    mockedUseNavigate.mockReturnValue(navigate);
    mockedUseLocation.mockReturnValue({
      pathname: "/techDashboard/pricing",
    } as never);
    mockedPurge.mockResolvedValue(undefined as never);
  });

  it("detects pricing route", () => {
    const { result } = renderHook(() => useDashboardTech());
    expect(result.current.isPricing).toBe(true);
  });

  it("logs out, purges persisted store and redirects", async () => {
    const { result } = renderHook(() => useDashboardTech());

    await act(async () => {
      await result.current.handleLogOut();
    });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(mockedPurge).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("/login", { replace: true });
  });
});
