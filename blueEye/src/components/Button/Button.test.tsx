import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button component", () => {
  it("renders children", () => {
    render(<Button className="extra">Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("applies outline variant styles", () => {
    render(
      <Button className="extra" variant="outline">
        Outline
      </Button>,
    );

    expect(screen.getByRole("button", { name: "Outline" })).toHaveClass(
      "border",
    );
  });
});
