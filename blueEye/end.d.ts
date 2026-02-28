/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_GATEWAY_URL: string;
  readonly VITE_CLIENT_OAUTH_ID: string;
  readonly VITE_CLIENT_OAUTH_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
