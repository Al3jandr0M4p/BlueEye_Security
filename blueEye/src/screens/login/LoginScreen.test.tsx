import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginScreen from "./LoginScreen";
import { useLoginHook } from "../../hooks/use-login-hook";

vi.mock("../../hooks/use-login-hook", () => ({
  useLoginHook: vi.fn(),
}));

vi.mock("../../components/ButtonOAuth/ButtonOAuth", () => ({
  GoogleBtn: () => <div>Google Button Mock</div>,
}));

const mockedUseLoginHook = vi.mocked(useLoginHook);

describe("LoginScreen", () => {
  const setIdentifier = vi.fn();
  const setPassword = vi.fn();
  const handleSubmit = vi.fn((e: Event) => e.preventDefault());

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseLoginHook.mockReturnValue({
      identifier: "",
      password: "",
      loading: false,
      error: null,
      isDisabled: true,
      setIdentifier,
      setPassword,
      handleSubmit,
    });
  });

  it("renders login form fields and oauth button", () => {
    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>,
    );

    expect(screen.getByText("Inicia Sesion en tu cuenta")).toBeInTheDocument();
    expect(screen.getByText("Google Button Mock")).toBeInTheDocument();
  });

  it("submits form using hook handler", () => {
    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>,
    );

    fireEvent.submit(screen.getByRole("button", { name: /Iniciar/i }));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
