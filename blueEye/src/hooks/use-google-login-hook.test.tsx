import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGoogleLoginHook } from "./use-google-login-hook";
import { useAppDispatch } from "./use-store-hook";
import { useNavigate } from "react-router-dom";
import { loginGoogleThunk } from "../reduxjs/store/thunks/thunks";

vi.mock("./use-store-hook", () => ({
  useAppDispatch: vi.fn(),
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
  const thunk = Object.assign(vi.fn((credential: string) => credential), {
    fulfilled: {
      match: vi.fn(),
    },
  });

  return {
    loginGoogleThunk: thunk,
  };
});

const mockedUseAppDispatch = vi.mocked(useAppDispatch);
const mockedUseNavigate = vi.mocked(useNavigate);
const mockedLoginGoogleThunk = vi.mocked(loginGoogleThunk);
const mockedFulfilledMatch = vi.mocked(loginGoogleThunk.fulfilled.match);

describe("useGoogleLoginHook", () => {
  const dispatch = vi.fn();
  const navigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAppDispatch.mockReturnValue(dispatch);
    mockedUseNavigate.mockReturnValue(navigate);
  });

  it("does nothing when credential is missing", async () => {
    const { result } = renderHook(() => useGoogleLoginHook());

    await act(async () => {
      await result.current.handleSubmit({} as never);
    });

    expect(dispatch).not.toHaveBeenCalled();
  });

  it("navigates to admin dashboard after successful login", async () => {
    const resultAction = {
      payload: {
        profile: {
          rolename: "admin",
        },
      },
    };

    dispatch.mockResolvedValue(resultAction);
    mockedFulfilledMatch.mockReturnValue(true);

    const { result } = renderHook(() => useGoogleLoginHook());

    await act(async () => {
      await result.current.handleSubmit({
        credential: "google-token",
      } as never);
    });

    expect(mockedLoginGoogleThunk).toHaveBeenCalledWith("google-token");
    expect(navigate).toHaveBeenCalledWith("/adminDashboard");
  });
});
