import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
   build: {
      chunkSizeWarningLimit: 5_000,
   },
   plugins: [react(), TanStackRouterVite(), tsconfigPaths()],
   server: {
      port: 3000,
   },
});
