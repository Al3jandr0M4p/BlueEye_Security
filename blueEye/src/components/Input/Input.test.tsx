import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Input from "./Input";

describe("Input component", () => {
  it("calls onValueChange with typed value", () => {
    const onValueChange = vi.fn();

    render(
      <Input
        type="text"
        text="identifier"
        value=""
        onValueChange={onValueChange}
        translationKey="Email"
        variant="default"
      />,
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "john@example.com" },
    });

    expect(onValueChange).toHaveBeenCalledWith("john@example.com");
  });

  it("strips non-digits when text is rnc", () => {
    const onValueChange = vi.fn();

    render(
      <Input
        type="text"
        text="rnc"
        value=""
        onValueChange={onValueChange}
        translationKey="RNC"
        variant="default"
      />,
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "12a-34b" },
    });

    expect(onValueChange).toHaveBeenCalledWith("1234");
  });
});
