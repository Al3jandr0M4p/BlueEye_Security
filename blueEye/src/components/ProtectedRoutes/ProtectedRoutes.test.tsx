import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RootState } from "../../reduxjs/store/store";
import { useAppSelector } from "../../hooks/use-store-hook";
import ProtectedRoute from "./ProtectedRoutes";

vi.mock("../../hooks/use-store-hook", () => ({
  useAppSelector: vi.fn(),
}));

const mockedUseAppSelector = vi.mocked(useAppSelector);

const createState = (overrides?: Partial<RootState>): RootState =>
  ({
    auth: {
      user: null,
      session: null,
      profile: { rolename: "usuario", username: "john" },
      isAuthenticated: false,
      loading: false,
      error: null,
    },
    _persist: {
      version: -1,
      rehydrated: true,
    },
    ...overrides,
  }) as RootState;

const renderRoute = (state: RootState) => {
  mockedUseAppSelector.mockImplementation((selector) => selector(state));

  return render(
    <MemoryRouter initialEntries={["/secure"]}>
      <Routes>
        <Route
          path="/secure"
          element={
            <ProtectedRoute allowedRoles={["tecnico"]}>
              <div>Private content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/unauthorized" element={<div>Unauthorized page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("ProtectedRoute", () => {
  beforeEach(() => {
    mockedUseAppSelector.mockReset();
  });

  it("does not render while store hydration is pending", () => {
    const state = createState({
      _persist: {
        version: -1,
        rehydrated: false,
      },
    });

    const { container } = renderRoute(state);
    expect(container).toBeEmptyDOMElement();
  });

  it("redirects to login when user is not authenticated", () => {
    const state = createState({
      auth: {
        user: null,
        session: null,
        profile: { rolename: "usuario", username: "john" },
        isAuthenticated: false,
        loading: false,
        error: null,
      },
    });

    renderRoute(state);
    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("redirects to unauthorized when role is not allowed", () => {
    const state = createState({
      auth: {
        user: null,
        session: null,
        profile: { rolename: "usuario", username: "john" },
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    });

    renderRoute(state);
    expect(screen.getByText("Unauthorized page")).toBeInTheDocument();
  });

  it("renders protected content when role is allowed", () => {
    const state = createState({
      auth: {
        user: null,
        session: null,
        profile: { rolename: "tecnico", username: "john" },
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    });

    renderRoute(state);
    expect(screen.getByText("Private content")).toBeInTheDocument();
  });
});
