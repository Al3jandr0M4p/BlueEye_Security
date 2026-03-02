import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useForgotPassword } from "./use-forgot-password";
import { forgotPassword } from "../service/auth.service";
import { sileo } from "sileo";

vi.mock("../service/auth.service", () => ({
  forgotPassword: vi.fn(),
}));

vi.mock("sileo", () => ({
  sileo: {
    success: vi.fn(),
  },
}));

const mockedForgotPassword = vi.mocked(forgotPassword);
const mockedSileoSuccess = vi.mocked(sileo.success);

describe("useForgotPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("disables submit when email is empty", () => {
    const { result } = renderHook(() => useForgotPassword());
    expect(result.current.isDisabled).toBe(true);
  });

  it("calls service and shows success toast", async () => {
    mockedForgotPassword.mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useForgotPassword());

    act(() => {
      result.current.setEmail("john@example.com");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as never);
    });

    expect(mockedForgotPassword).toHaveBeenCalledWith({
      email: "john@example.com",
    });
    expect(mockedSileoSuccess).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(false);
  });
});
