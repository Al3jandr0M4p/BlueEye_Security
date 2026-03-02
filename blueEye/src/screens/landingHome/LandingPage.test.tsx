import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LandingHome from "./LandingPage";
import { useNavigate } from "react-router-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockedUseNavigate = vi.mocked(useNavigate);

describe("LandingPage", () => {
  const navigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseNavigate.mockReturnValue(navigate);
  });

  it("renders main brand title", () => {
    render(<LandingHome />);
    expect(screen.getAllByText("BlueEye Security").length).toBeGreaterThan(0);
  });

  it("navigates to login from top button", () => {
    render(<LandingHome />);

    fireEvent.click(screen.getByRole("button", { name: "login" }));
    expect(navigate).toHaveBeenCalledWith("/login");
  });
});
