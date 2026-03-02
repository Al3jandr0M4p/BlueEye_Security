import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotificationsPanel } from "./NotificationsPanel";

vi.mock("flowbite-react", () => ({
  Drawer: ({
    open,
    children,
  }: {
    open: boolean;
    children: React.ReactNode;
  }) => (open ? <div data-testid="drawer">{children}</div> : null),
}));

describe("NotificationsPanel", () => {
  beforeEach(() => {
    document.body.style.overflow = "auto";
  });

  it("switches between tabs and renders unread content", () => {
    render(
      <NotificationsPanel
        openNotificationsPanel={true}
        setOpenNotificationsPanel={vi.fn()}
      />,
    );

    expect(screen.getByText("Scroll Test all")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Sin leer" }));
    expect(screen.getByText("Scroll test unread")).toBeInTheDocument();
  });

  it("locks body scroll when open and unlocks when closed", () => {
    const { rerender } = render(
      <NotificationsPanel
        openNotificationsPanel={true}
        setOpenNotificationsPanel={vi.fn()}
      />,
    );
    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <NotificationsPanel
        openNotificationsPanel={false}
        setOpenNotificationsPanel={vi.fn()}
      />,
    );
    expect(document.body.style.overflow).toBe("auto");
  });
});
