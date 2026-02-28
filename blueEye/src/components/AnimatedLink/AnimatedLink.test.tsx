import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { AnimatedLink } from "./AnimatedLink";

vi.useFakeTimers();

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

describe("AnimatedLink", () => {
  const navigate = vi.fn();
  const closeSideBar = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseNavigate.mockReturnValue(navigate);
  });

  it("closes sidebar and navigates with delay", () => {
    render(
      <MemoryRouter>
        <AnimatedLink
          to="/techDashboard/dashboard"
          className="test-link"
          closeSideBar={closeSideBar}
        >
          Go Dashboard
        </AnimatedLink>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Go Dashboard" }));
    expect(closeSideBar).toHaveBeenCalledTimes(1);
    expect(navigate).not.toHaveBeenCalled();

    vi.advanceTimersByTime(400);
    expect(navigate).toHaveBeenCalledWith("/techDashboard/dashboard");
  });
});

afterAll(() => {
  vi.useRealTimers();
});
