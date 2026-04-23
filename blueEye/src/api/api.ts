import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import type {
  DecodedJWT,
  SessionData,
  UserProfile,
} from "../types/types";

const BaseUrl = import.meta.env.VITE_API_GATEWAY_URL! as string;

type RefreshResponse = {
  message: string;
  data: {
    user: DecodedJWT;
    session: SessionData;
    profile: UserProfile | null;
  };
};

type SessionUpdateHandler = (payload: {
  user: DecodedJWT;
  session: SessionData;
  profile: UserProfile;
}) => void;

type LogoutHandler = () => Promise<void> | void;

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let accessTokenGetter: (() => string | undefined) | undefined;
let refreshTokenGetter: (() => string | undefined) | undefined;
let sessionUpdateHandler: SessionUpdateHandler | undefined;
let logoutHandler: LogoutHandler | undefined;
let refreshPromise: Promise<RefreshResponse["data"]> | null = null;

export function setAccessTokenGetter(getter: () => string | undefined) {
  accessTokenGetter = getter;
}

export function setRefreshTokenGetter(getter: () => string | undefined) {
  refreshTokenGetter = getter;
}

export function setSessionUpdateHandler(handler: SessionUpdateHandler) {
  sessionUpdateHandler = handler;
}

export function setLogoutHandler(handler: LogoutHandler) {
  logoutHandler = handler;
}

const api = axios.create({
  baseURL: BaseUrl,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = accessTokenGetter?.();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

async function refreshSessionRequest() {
  const refreshToken = refreshTokenGetter?.();

  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  const { data } = await axios.post<RefreshResponse>(
    `${BaseUrl}/api/authentication/v1/refresh-token`,
    {
      refresh_token: refreshToken,
    },
  );

  const profile = data.data.profile;

  if (!profile) {
    throw new Error("Profile missing in refresh response");
  }

  sessionUpdateHandler?.({
    user: data.data.user,
    session: data.data.session,
    profile,
  });

  return data.data;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const isRefreshRequest = originalRequest?.url?.includes(
      "/authentication/v1/refresh-token",
    );

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isRefreshRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= refreshSessionRequest().finally(() => {
        refreshPromise = null;
      });

      const refreshed = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${refreshed.session.access_token}`;

      return api(originalRequest);
    } catch (refreshError) {
      await logoutHandler?.();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
