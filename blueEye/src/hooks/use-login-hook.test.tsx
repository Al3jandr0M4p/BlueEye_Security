import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLoginHook } from "./use-login-hook";
import { useAppDispatch, useAppSelector } from "./use-store-hook";
import { useNavigate } from "react-router-dom";
import { loginThunk } from "../reduxjs/store/thunks/thunks";

vi.mock("./use-store-hook", () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("../reduxjs/store/thunks/thunks", () => {
  const thunk = Object.assign(
    vi.fn((payload: { identifier: string; password: string }) => ({
      type: "auth/login",
      meta: { arg: payload },
    })),
    {
      fulfilled: {
        match: vi.fn(),
      },
    },
  );

  return {
    loginThunk: thunk,
  };
});

const mockedUseAppDispatch = vi.mocked(useAppDispatch);
const mockedUseAppSelector = vi.mocked(useAppSelector);
const mockedUseNavigate = vi.mocked(useNavigate);
const mockedLoginThunk = vi.mocked(loginThunk);
const mockedFulfilledMatch = vi.mocked(loginThunk.fulfilled.match);

describe("useLoginHook", () => {
  const dispatch = vi.fn();
  const navigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseAppSelector.mockImplementation((selector) =>
      selector({
        auth: {
          loading: false,
          error: null,
          profile: null,
        },
      } as never),
    );

    mockedUseAppDispatch.mockReturnValue(dispatch);
    mockedUseNavigate.mockReturnValue(navigate);
  });

  it("marks form as disabled until identifier and password are set", () => {
    const { result } = renderHook(() => useLoginHook());

    expect(result.current.isDisabled).toBe(true);

    act(() => {
      result.current.setIdentifier("user@example.com");
    });
    expect(result.current.isDisabled).toBe(true);

    act(() => {
      result.current.setPassword("secret");
    });
    expect(result.current.isDisabled).toBe(false);
  });

  it("navigates to technical dashboard on successful tecnico login", async () => {
    const resultAction = {
      payload: {
        profile: {
          rolename: "tecnico",
        },
      },
    };

    dispatch.mockResolvedValue(resultAction);
    mockedFulfilledMatch.mockReturnValue(true);

    const { result } = renderHook(() => useLoginHook());

    act(() => {
      result.current.setIdentifier("tech@example.com");
      result.current.setPassword("secret");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as never);
    });

    expect(mockedLoginThunk).toHaveBeenCalledWith({
      identifier: "tech@example.com",
      password: "secret",
    });
    expect(navigate).toHaveBeenCalledWith("/techDashboard");
  });

  it("navigates back to login when role is unknown", async () => {
    const resultAction = {
      payload: {
        profile: {
          rolename: "otro",
        },
      },
    };

    dispatch.mockResolvedValue(resultAction);
    mockedFulfilledMatch.mockReturnValue(true);

    const { result } = renderHook(() => useLoginHook());

    act(() => {
      result.current.setIdentifier("user@example.com");
      result.current.setPassword("secret");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as never);
    });

    expect(navigate).toHaveBeenCalledWith("/login");
  });
});
