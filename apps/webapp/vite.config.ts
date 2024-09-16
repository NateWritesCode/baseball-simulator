import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@webapp": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		port: 3000,
	},
});
