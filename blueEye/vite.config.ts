import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default {
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/main.tsx"],
    },
  },
  server: {
    hmr: {
      protocol: "ws", // usa 'ws', no 'wss'
      host: "localhost", // host donde corre Vite
      port: 5173, // puerto de Vite
    },
  },
} as const;
