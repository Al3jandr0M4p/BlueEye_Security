import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./reduxjs/store/store.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sileo";
import { PersistGate } from "redux-persist/integration/react";
import "./styles/main.css";

const clientIDProvider = import.meta.env.VITE_CLIENT_OAUTH_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientIDProvider}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Toaster
            position="top-right"
            options={{
              fill: "#171717",
              styles: { description: "text-white" },
            }}
          />
          <App />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
