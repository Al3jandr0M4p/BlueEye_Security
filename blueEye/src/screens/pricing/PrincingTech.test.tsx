import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PricingScreen from "./Princing";

describe("PricingScreen", () => {
  it("renders pricing cards", () => {
    render(<PricingScreen />);

    expect(screen.getByText("Inicial")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByText("Enterprice")).toBeInTheDocument();
  });

  it("opens coming soon modal when user clicks start", () => {
    render(<PricingScreen />);

    fireEvent.click(screen.getAllByRole("button", { name: "Empezar" })[0]);
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
  });
});
