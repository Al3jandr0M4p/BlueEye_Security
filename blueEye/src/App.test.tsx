import { render, screen } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./hooks/use-app-hooks", () => ({
  useAppSessionAsyncHooks: vi.fn(),
}));

vi.mock("./components/ProtectedRoutes/ProtectedRoutes", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("./screens/login/LoginScreen", () => ({
  default: () => <div>Login Screen Mock</div>,
}));
vi.mock("./screens/register/Registerscreen", () => ({
  default: () => <div>Register Screen Mock</div>,
}));
vi.mock("./screens/landingHome/LandingPage", () => ({
  default: () => <div>Landing Screen Mock</div>,
}));
vi.mock("./screens/forgotPassword/ForgotPassword", () => ({
  default: () => <div>Forgot Screen Mock</div>,
}));
vi.mock("./screens/resetPassword/ResetPassword", () => ({
  default: () => <div>Reset Screen Mock</div>,
}));
vi.mock("./screens/techDashboardMenu/TechDashboardMenu", () => ({
  default: () => <div>Tech Menu Mock</div>,
}));
vi.mock("./screens/techDashboard/Dashboard", () => ({
  default: () => <div>Tech Dashboard Mock</div>,
}));
vi.mock("./screens/pricingTech/PrincingTech", () => ({
  default: () => <div>Pricing Screen Mock</div>,
}));
vi.mock("./components/ProfileContainer/ProfileContainer", () => ({
  default: () => <div>Profile Page Mock</div>,
}));

describe("App routes", () => {
  it("renders landing page on root route", () => {
    window.history.pushState({}, "", "/");
    render(<App />);
    expect(screen.getByText("Landing Screen Mock")).toBeInTheDocument();
  });

  it("renders login screen on /login", () => {
    window.history.pushState({}, "", "/login");
    render(<App />);
    expect(screen.getByText("Login Screen Mock")).toBeInTheDocument();
  });

  it("renders register screen on /register", () => {
    window.history.pushState({}, "", "/register");
    render(<App />);
    expect(screen.getByText("Register Screen Mock")).toBeInTheDocument();
  });
});
