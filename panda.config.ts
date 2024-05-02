import { defineConfig } from "@pandacss/dev";

export default defineConfig({
   exclude: [],
   jsxFramework: "react",
   include: ["./src/**/*.{ts,tsx,js,jsx}"],
   outdir: "styled-system",
   preflight: true,
});
