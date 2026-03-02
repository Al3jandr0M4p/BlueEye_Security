import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RegisterScreen from "./Registerscreen";
import { useRegisterHook } from "../../hooks/use-register-hook";

vi.mock("../../hooks/use-register-hook", () => ({
  useRegisterHook: vi.fn(),
}));

vi.mock("../../components/FormComponent/FormComponentFirst", () => ({
  FormComponentFirst: () => <div>Form Step One Mock</div>,
}));

vi.mock("../../components/FormComponent/FormComponent", () => ({
  FormComponent: () => <div>Form Step Two Mock</div>,
}));

const mockedUseRegisterHook = vi.mocked(useRegisterHook);

const baseHookResult = {
  email: "",
  password: "",
  businessName: "",
  currency: "",
  username: "",
  country: "",
  taxId: "",
  phone: "",
  isLoading: false,
  isDisabledFirst: true,
  isDisabledSubmit: true,
  dialCode: "",
  taxIdError: "",
  currencyOptions: [],
  countryOptions: [],
  dialCodeOptions: [],
  logoPreview: null,
  setStep: vi.fn(),
  handleLogoChange: vi.fn(),
  setEmail: vi.fn(),
  setPassword: vi.fn(),
  setBusinessName: vi.fn(),
  setCountry: vi.fn(),
  setCurrency: vi.fn(),
  setUsername: vi.fn(),
  setTaxId: vi.fn(),
  setDialCode: vi.fn(),
  handleSubmit: vi.fn(),
  handlePhoneChange: vi.fn(),
};

describe("RegisterScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders first step by default", () => {
    mockedUseRegisterHook.mockReturnValue({
      ...baseHookResult,
      step: 1,
    });

    render(
      <MemoryRouter>
        <RegisterScreen />
      </MemoryRouter>,
    );

    expect(screen.getByText("Registra tu Empresa")).toBeInTheDocument();
    expect(screen.getByText("Form Step One Mock")).toBeInTheDocument();
  });

  it("renders second step when step is 2", () => {
    mockedUseRegisterHook.mockReturnValue({
      ...baseHookResult,
      step: 2,
    });

    render(
      <MemoryRouter>
        <RegisterScreen />
      </MemoryRouter>,
    );

    expect(screen.getByText("Form Step Two Mock")).toBeInTheDocument();
  });
});
