import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRegisterHook } from "./use-register-hook";
import { registerUserService } from "../service/auth.service";
import { useNavigate } from "react-router-dom";

vi.mock("../service/auth.service", () => ({
  registerUserService: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockedRegisterUserService = vi.mocked(registerUserService);
const mockedUseNavigate = vi.mocked(useNavigate);

describe("useRegisterHook", () => {
  const navigate = vi.fn();
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseNavigate.mockReturnValue(navigate);
    mockedRegisterUserService.mockResolvedValue({
      message: "ok",
      data: { userId: "u1", businessId: "b1" },
    });

    fetchMock.mockResolvedValue({
      json: vi.fn().mockResolvedValue([
        {
          name: { common: "Dominican Republic" },
          cca2: "DO",
          idd: { root: "+1", suffixes: ["809"] },
          currencies: { DOP: { name: "Peso" } },
        },
      ]),
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:logo");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  });

  it("loads countries and builds country options", async () => {
    const { result } = renderHook(() => useRegisterHook());

    await waitFor(() => {
      expect(result.current.countryOptions.length).toBeGreaterThan(0);
    });

    expect(result.current.countryOptions[0]).toEqual({
      value: "DO",
      label: "Dominican Republic",
    });
  });

  it("submits register payload and navigates to login", async () => {
    const { result } = renderHook(() => useRegisterHook());

    await waitFor(() => {
      expect(result.current.countryOptions.length).toBe(1);
    });

    const logo = new File(["logo"], "logo.png", { type: "image/png" });

    act(() => {
      result.current.setEmail("owner@example.com");
      result.current.setPassword("secret");
      result.current.setUsername("owner");
      result.current.setBusinessName("BlueEye");
      result.current.setTaxId("123456789");
      result.current.setCountry("DO");
      result.current.setCurrency("DOP");
      result.current.handleLogoChange(logo);
    });

    await waitFor(() => {
      expect(result.current.dialCode).toBe("+1809");
    });

    act(() => {
      result.current.handlePhoneChange("5551234");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as never);
    });

    expect(mockedRegisterUserService).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "owner@example.com",
        password: "secret",
        username: "owner",
        businessName: "BlueEye",
        country: "DO",
        currency: "DOP",
        taxId: "123456789",
        phone: "+18095551234",
        logo,
      }),
    );
    expect(navigate).toHaveBeenCalledWith("/login");
  });
});
