import { defineConfig } from "@pandacss/dev";

export default defineConfig({
   preflight: true,
   presets: [],
   include: ["./src/**/*.{js,jsx,ts,tsx}"],
   exclude: [],
   jsxFramework: "react",
   conditions: {
      light: "[data-color-mode=light] &",
      dark: "[data-color-mode=dark] &",
   },
   outdir: "styled-system",
   theme: {
      tokens: {
         colors: {
            blue: {
               500: { value: "#2970FF" },
            },
         },
      },
   },

   // theme: {
   //    semanticTokens: {
   //       colors: {
   //          text: {
   //             value: {
   //                _pinkTheme: {
   //                   base: "{colors.pink.500}",
   //                   _dark: "{colors.pink.300}",
   //                },
   //                _blueTheme: {
   //                   base: "{colors.blue.500}",
   //                   _dark: "{colors.blue.300}",
   //                },
   //             },
   //          },
   //       },
   //    },
   // },
});
