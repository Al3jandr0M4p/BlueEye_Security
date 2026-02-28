import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FormComponent } from "./FormComponent";

describe("FormComponent", () => {
  it("calls setStep when clicking back button", () => {
    const setStep = vi.fn();

    render(
      <FormComponent
        logoPreview={null}
        isLoading={false}
        isDisabledSubmit={true}
        handleSubmit={vi.fn()}
        handleLogoChange={vi.fn()}
        setStep={setStep}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Volver" }));
    expect(setStep).toHaveBeenCalledWith(1);
  });

  it("calls handleLogoChange when file is selected", () => {
    const handleLogoChange = vi.fn();
    const { container } = render(
      <FormComponent
        logoPreview={null}
        isLoading={false}
        isDisabledSubmit={true}
        handleSubmit={vi.fn()}
        handleLogoChange={handleLogoChange}
        setStep={vi.fn()}
      />,
    );

    const fileInput = container.querySelector("#logo") as HTMLInputElement;
    const file = new File(["logo"], "logo.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(handleLogoChange).toHaveBeenCalledWith(file);
  });
});
