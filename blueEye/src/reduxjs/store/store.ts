import { configureStore, createSlice } from "@reduxjs/toolkit";

// ─── Placeholder slice ────────────────────────────────────────────────────────
// TODO: Reemplazar con los slices reales cuando se implementen
const appSlice = createSlice({
  name: "app",
  initialState: { initialized: true },
  reducers: {},
});

// ─── Store ────────────────────────────────────────────────────────────────────
export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
