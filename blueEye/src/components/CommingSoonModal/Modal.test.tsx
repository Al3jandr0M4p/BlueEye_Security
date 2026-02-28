import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ComingSoonModal } from "./Modal";

describe("ComingSoonModal", () => {
  it("closes when close button is clicked", () => {
    const setOpenModal = vi.fn();
    render(<ComingSoonModal setOpenModal={setOpenModal} />);

    fireEvent.click(screen.getByRole("button"));
    expect(setOpenModal).toHaveBeenCalledWith(false);
  });

  it("closes on Escape key", () => {
    const setOpenModal = vi.fn();
    render(<ComingSoonModal setOpenModal={setOpenModal} />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(setOpenModal).toHaveBeenCalledWith(false);
  });
});
