import { act, renderHook } from "@testing-library/react";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { useResetPassword } from "./use-reset-password";
import { resetPasswordService } from "../service/auth.service";
import { sileo } from "sileo";
import { useNavigate } from "react-router-dom";

vi.useFakeTimers();

vi.mock("../service/auth.service", () => ({
  resetPasswordService: vi.fn(),
}));

vi.mock("sileo", () => ({
  sileo: {
    success: vi.fn(),
  },
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

const mockedResetPasswordService = vi.mocked(resetPasswordService);
const mockedSileoSuccess = vi.mocked(sileo.success);
const mockedUseNavigate = vi.mocked(useNavigate);

describe("useResetPassword", () => {
  const navigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseNavigate.mockReturnValue(navigate);
    window.history.pushState(
      {},
      "",
      "/reset#access_token=acc-token&refresh_token=ref-token",
    );
  });

  it("enables submit after reading tokens from hash", () => {
    const { result } = renderHook(() => useResetPassword());

    act(() => {
      result.current.setNewPassword("new-secret");
    });

    expect(result.current.isDisabled).toBe(false);
  });

  it("submits reset password and navigates to login", async () => {
    mockedResetPasswordService.mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useResetPassword());

    act(() => {
      result.current.setNewPassword("new-secret");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as never);
    });

    expect(mockedResetPasswordService).toHaveBeenCalledWith({
      newPassword: "new-secret",
      access_token: "acc-token",
      refresh_token: "ref-token",
    });
    expect(mockedSileoSuccess).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(300);
    expect(navigate).toHaveBeenCalledWith("/login");
  });
});

afterAll(() => {
  vi.useRealTimers();
});
