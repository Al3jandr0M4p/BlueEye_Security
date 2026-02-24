import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./reduxjs/store/store.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientIDProvider = import.meta.env.VITE_CLIENT_OAUTH_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientIDProvider}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
