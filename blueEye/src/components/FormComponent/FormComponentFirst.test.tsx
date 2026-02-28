import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { FormComponentFirst } from "./FormComponentFirst";

vi.mock("react-select", () => ({
  default: ({
    options,
    onChange,
    placeholder,
  }: {
    options: { value: string; label: string }[];
    onChange: (option: { value: string; label: string } | null) => void;
    placeholder?: string;
  }) => (
    <select
      aria-label={placeholder ?? "select"}
      onChange={(e) => {
        const selected = options.find((o) => o.value === e.target.value) ?? null;
        onChange(selected);
      }}
    >
      <option value="">select</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

const buildProps = () => ({
  email: "",
  password: "",
  username: "",
  businessName: "",
  currencyOptions: [{ value: "USD", label: "USD" }],
  dialCodeOptions: [{ value: "+1", label: "+1" }],
  countryOptions: [{ value: "DO", label: "Dominican Republic" }],
  phone: "",
  taxId: "",
  isDisabledFirst: false,
  currency: "",
  country: "",
  dialCode: "",
  taxIdError: "",
  setStep: vi.fn(),
  setEmail: vi.fn(),
  setPassword: vi.fn(),
  setBusinessName: vi.fn(),
  setCountry: vi.fn(),
  setCurrency: vi.fn(),
  setUsername: vi.fn(),
  setTaxId: vi.fn(),
  setDialCode: vi.fn(),
  handlePhoneChange: vi.fn(),
});

describe("FormComponentFirst", () => {
  it("calls setStep when clicking continue", () => {
    const props = buildProps();

    render(
      <MemoryRouter>
        <FormComponentFirst {...props} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(props.setStep).toHaveBeenCalledWith(2);
  });

  it("updates country and dial code selectors", () => {
    const props = buildProps();
    render(
      <MemoryRouter>
        <FormComponentFirst {...props} />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/Selecciona un pa/i), {
      target: { value: "DO" },
    });
    fireEvent.change(screen.getByLabelText("+--"), {
      target: { value: "+1" },
    });

    expect(props.setCountry).toHaveBeenCalledWith("DO");
    expect(props.setDialCode).toHaveBeenCalledWith("+1");
  });
});
