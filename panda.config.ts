import { defineConfig } from "@pandacss/dev";

export default defineConfig({
   preflight: true,
   presets: ["animated-pandacss", "@pandacss/dev/presets"],
   include: ["./src/**/*.{js,jsx,ts,tsx}"],
   exclude: [],
   outdir: "./src/styled-system",
   importMap: "@baseball-simulator/styled-system",
   jsxFramework: "react",
   conditions: {
      light: "[data-color-mode=light] &",
      dark: "[data-color-mode=dark] &",
      pinkTheme: "[data-theme=pink] &",
      blueTheme: "[data-theme=blue] &",
   },
   theme: {
      semanticTokens: {
         colors: {
            text: {
               value: {
                  _pinkTheme: {
                     base: "{colors.pink.500}",
                     _dark: "{colors.pink.300}",
                  },
                  _blueTheme: {
                     base: "{colors.blue.500}",
                     _dark: "{colors.blue.300}",
                  },
               },
            },
         },
      },
   },
});
