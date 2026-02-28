import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../api/api";
import {
  forgotPassword,
  loginUser,
  loginWithGoogleService,
  registerUserService,
  resetPasswordService,
} from "./auth.service";

vi.mock("../api/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockedApiPost = vi.mocked(api.post);

describe("auth.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends multipart data on register user", async () => {
    mockedApiPost.mockResolvedValue({
      data: {
        message: "created",
        data: {
          userId: "u1",
          businessId: "b1",
        },
      },
    });

    const logo = new File(["fake"], "logo.png", { type: "image/png" });

    await registerUserService({
      email: "owner@example.com",
      username: "owner",
      password: "secret",
      businessName: "Blue Eye",
      country: "DO",
      currency: "DOP",
      taxId: "123456789",
      phone: "18095551234",
      logo,
    });

    expect(mockedApiPost).toHaveBeenCalledTimes(1);

    const [url, body, config] = mockedApiPost.mock.calls[0];
    expect(url).toBe("/api/authentication/v1/business/sign-up");
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).get("email")).toBe("owner@example.com");
    expect((body as FormData).get("logo")).toBe(logo);
    expect(config).toEqual({
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  });

  it("calls sign-in endpoint with login payload", async () => {
    mockedApiPost.mockResolvedValue({
      data: {
        data: {
          user: null,
          session: null,
          profile: null,
        },
      },
    });

    await loginUser({
      identifier: "owner@example.com",
      password: "secret",
    });

    expect(mockedApiPost).toHaveBeenCalledWith(
      "/api/authentication/v1/users/sign-in",
      {
        identifier: "owner@example.com",
        password: "secret",
      },
    );
  });

  it("calls forgot-password endpoint", async () => {
    mockedApiPost.mockResolvedValue({ data: { ok: true } });

    await forgotPassword({
      email: "owner@example.com",
    });

    expect(mockedApiPost).toHaveBeenCalledWith(
      "/api/authentication/v1/password/reset/request",
      { email: "owner@example.com" },
    );
  });

  it("calls reset-password endpoint", async () => {
    mockedApiPost.mockResolvedValue({ data: { ok: true } });

    await resetPasswordService({
      newPassword: "new-secret",
      access_token: "access-token",
      refresh_token: "refresh-token",
    });

    expect(mockedApiPost).toHaveBeenCalledWith(
      "/api/authentication/v1/password/reset/confirm",
      {
        newPassword: "new-secret",
        access_token: "access-token",
        refresh_token: "refresh-token",
      },
    );
  });

  it("calls google sign-in endpoint", async () => {
    mockedApiPost.mockResolvedValue({ data: { data: {} } });

    await loginWithGoogleService("google-credential");

    expect(mockedApiPost).toHaveBeenCalledWith(
      "/api/authentication/v1/oauth/google/session/sign-in",
      {
        credential: "google-credential",
      },
    );
  });
});
