import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, mergeConfig } from "vite";
import type { UserConfig } from "vite";

const baseConfig: UserConfig = {
  css: {
    transformer: "lightningcss",
  },

  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
    ignoreOutdatedRequests: true,
  },

  server: {
    host: "::",
    port: 8080,
  },
};

export default defineConfig(({ command, mode }) => {
  const envDefine: Record<string, string> = {};
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  const config: UserConfig = mergeConfig(baseConfig, {
    define: envDefine,
    plugins: [
      tailwindcss(),
      tanstackStart({
        importProtection: {
          behavior: "error",
          client: {
            files: ["**/server/**"],
            specifiers: ["server-only"],
          },
        },
        server: { entry: "server" },
      }),
      command === "build" &&
        nitro({
          defaultPreset: "cloudflare-module",
        }),
      react(),
    ],
  });

  const isDevBuild = command === "build" && mode === "development";
  if (isDevBuild) {
    return mergeConfig(config, {
      environments: {
        client: {
          define: {
            "process.env.NODE_ENV": JSON.stringify("development"),
          },
        },
      },
      esbuild: { keepNames: true },
    });
  }

  return config;
});
