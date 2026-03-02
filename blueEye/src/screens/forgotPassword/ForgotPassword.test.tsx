import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ForgotYourPassword from "./ForgotPassword";
import { useForgotPassword } from "../../hooks/use-forgot-password";

vi.mock("../../hooks/use-forgot-password", () => ({
  useForgotPassword: vi.fn(),
}));

const mockedUseForgotPassword = vi.mocked(useForgotPassword);

describe("ForgotPassword screen", () => {
  const setEmail = vi.fn();
  const handleSubmit = vi.fn((e: Event) => e.preventDefault());

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseForgotPassword.mockReturnValue({
      email: "",
      isDisabled: true,
      isLoading: false,
      setEmail,
      handleSubmit,
    });
  });

  it("renders screen title", () => {
    render(
      <MemoryRouter>
        <ForgotYourPassword />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Olvidaste tu Contrase/i)).toBeInTheDocument();
  });

  it("submits form with hook handler", () => {
    render(
      <MemoryRouter>
        <ForgotYourPassword />
      </MemoryRouter>,
    );

    fireEvent.submit(screen.getByRole("button", { name: /Recuperar/i }));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
