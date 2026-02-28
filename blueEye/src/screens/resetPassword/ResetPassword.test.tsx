import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ResetPassword from "./ResetPassword";
import { useResetPassword } from "../../hooks/use-reset-password";

vi.mock("../../hooks/use-reset-password", () => ({
  useResetPassword: vi.fn(),
}));

const mockedUseResetPassword = vi.mocked(useResetPassword);

describe("ResetPassword screen", () => {
  const setNewPassword = vi.fn();
  const handleSubmit = vi.fn((e: Event) => e.preventDefault());

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseResetPassword.mockReturnValue({
      newPassword: "",
      isDisabled: true,
      isLoading: false,
      setNewPassword,
      handleSubmit,
    });
  });

  it("renders reset form", () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Olvidaste tu Contrase/i)).toBeInTheDocument();
  });

  it("submits reset form", () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>,
    );

    fireEvent.submit(screen.getByRole("button", { name: /Recuperar/i }));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
