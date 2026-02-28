import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppNavbar } from "./Navbar";

describe("AppNavbar", () => {
  it("renders left, center and right areas", () => {
    render(
      <AppNavbar
        left={<span>Left</span>}
        center={<span>Center</span>}
        right={<span>Right</span>}
      />,
    );

    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Center")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
  });

  it("applies hidden transform when show is false", () => {
    const { container } = render(<AppNavbar show={false} />);
    expect(container.firstChild).toHaveClass("-translate-y-24");
  });
});
