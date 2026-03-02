import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Menu } from "./Menu";
import { useDashboardTech } from "../../hooks/use-dashboard-tech";

vi.mock("../../hooks/use-dashboard-tech", () => ({
  useDashboardTech: vi.fn(),
}));

vi.mock("flowbite-react", () => ({
  Dropdown: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
  DropdownDivider: () => <hr />,
}));

vi.mock("../NotificationsPanels/NotificationsPanel", () => ({
  NotificationsPanel: () => <div>Notifications Panel Mock</div>,
}));

vi.mock("../AnimatedLink/AnimatedLink", () => ({
  AnimatedLink: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const mockedUseDashboardTech = vi.mocked(useDashboardTech);

describe("Menu", () => {
  const setShowNotificationsPanel = vi.fn();
  const setOpenSideBar = vi.fn();
  const handleLogOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseDashboardTech.mockReturnValue({
      openSideBar: true,
      showNav: true,
      isPricing: false,
      showNotificationsPanel: true,
      setShowNotificationsPanel,
      setOpenSideBar,
      handleLogOut,
    });
  });

  it("renders menu options and notifications panel", () => {
    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>,
    );

    expect(screen.getByText("Get Pro")).toBeInTheDocument();
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(screen.getByText("Notifications Panel Mock")).toBeInTheDocument();
  });

  it("calls logout handler from sidebar button", () => {
    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cerrar sesion" }));
    expect(handleLogOut).toHaveBeenCalledTimes(1);
  });
});
