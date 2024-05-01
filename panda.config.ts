import { defineConfig } from "@pandacss/dev";

const referenceFontFamily = {
   display: "Inter, sans-serif",
   text: "Inter, sans-serif",
};

const referenceFontWeights = {
   regular: 400,
   medium: 500,
   semibold: 600,
   bold: 700,
};

const referenceFontLineHeights = {
   display: {
      xs: "2rem",
      sm: "2.375rem",
      md: "2.75rem",
      lg: "3.75rem",
      xl: "4.5rem",
      "2xl": "5.625rem",
   },
   text: {
      xs: "1.125rem",
      sm: "1.25rem",
      md: "1.5rem",
      lg: "1.75rem",
      xl: "1.875rem",
   },
};

const referenceFontSizes = {
   display: {
      xs: "1.5rem",
      sm: "1.875rem",
      md: "2.25rem",
      lg: "3rem",
      xl: "3.75rem",
      "2xl": "4.5rem",
   },
   text: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
   },
};

const referenceFontLetterSpacings = {
   display: {
      md: "-0.02rem",
      lg: "-0.02rem",
      xl: "-0.02rem",
      "2xl": "-0.02rem",
   },
};

export default defineConfig({
   conditions: {
      light: "[data-color-mode=light] &",
      dark: "[data-color-mode=dark] &",
   },
   eject: true,
   exclude: [],
   globalVars: {},
   include: ["./src/**/*.{js,jsx,ts,tsx}"],
   outdir: "styled-system",
   // Default patterns live here: https://github.com/chakra-ui/panda/blob/main/packages/preset-base/src/patterns.ts
   patterns: {
      extend: {
         box: {
            transform: (props) => {
               return props;
            },
         },
         flex: {
            properties: {
               align: { type: "property", value: "alignItems" },
               justify: { type: "property", value: "justifyContent" },
               direction: { type: "property", value: "flexDirection" },
               wrap: { type: "property", value: "flexWrap" },
               basis: { type: "property", value: "flexBasis" },
               grow: { type: "property", value: "flexGrow" },
               shrink: { type: "property", value: "flexShrink" },
            },
            transform(props) {
               const {
                  direction,
                  align,
                  justify,
                  wrap,
                  basis,
                  grow,
                  shrink,
                  ...rest
               } = props;
               return {
                  display: "flex",
                  flexDirection: direction,
                  alignItems: align,
                  justifyContent: justify,
                  flexWrap: wrap,
                  flexBasis: basis,
                  flexGrow: grow,
                  flexShrink: shrink,
                  ...rest,
               };
            },
         },
      },
   },
   preflight: true,
   presets: [],
   strictPropertyValues: true,
   strictTokens: true,
   theme: {
      semanticTokens: {
         colors: {
            text: {
               value: {},
            },
         },
      },
      textStyles: {
         "display.2xl.bold": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display["2xl"],
               fontWeight: referenceFontWeights.bold,
               lineHeight: referenceFontLineHeights.display["2xl"],
               letterSpacing: referenceFontLetterSpacings.display["2xl"],
            },
         },
         "display.lg.bold": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display.lg,
               fontWeight: referenceFontWeights.bold,
               lineHeight: referenceFontLineHeights.display.lg,
               letterSpacing: referenceFontLetterSpacings.display.lg,
            },
         },
         "display.md.bold": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display.md,
               fontWeight: referenceFontWeights.bold,
               lineHeight: referenceFontLineHeights.display.md,
               letterSpacing: referenceFontLetterSpacings.display.md,
            },
         },
         "display.sm.bold": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display.sm,
               fontWeight: referenceFontWeights.bold,
               lineHeight: referenceFontLineHeights.display.sm,
            },
         },
         "display.xs.bold": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display.xs,
               fontWeight: referenceFontWeights.bold,
               lineHeight: referenceFontLineHeights.display.xs,
            },
         },
         "text.xl.bold": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.xl,
               fontWeight: referenceFontWeights.bold,
               lineHeight: referenceFontLineHeights.text.xl,
            },
         },
         "text.lg.bold": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.lg,
               fontWeight: referenceFontWeights.bold,
               lineHeight: referenceFontLineHeights.text.lg,
            },
         },
         "text.md.bold": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.md,
               fontWeight: referenceFontWeights.bold,
               lineHeight: referenceFontLineHeights.text.md,
            },
         },
         "text.sm.bold": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.sm,
               fontWeight: referenceFontWeights.bold,
               lineHeight: referenceFontLineHeights.text.sm,
            },
         },
         "text.xs.bold": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.xs,
               fontWeight: referenceFontWeights.bold,
               lineHeight: referenceFontLineHeights.text.xs,
            },
         },
         "display.2xl.semibold": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display["2xl"],
               fontWeight: referenceFontWeights.semibold,
               lineHeight: referenceFontLineHeights.display["2xl"],
            },
         },
         "display.lg.semibold": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display.lg,
               fontWeight: referenceFontWeights.semibold,
               lineHeight: referenceFontLineHeights.display.lg,
            },
         },
         "display.md.semibold": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display.md,
               fontWeight: referenceFontWeights.semibold,
               lineHeight: referenceFontLineHeights.display.md,
            },
         },
         "display.sm.semibold": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display.sm,
               fontWeight: referenceFontWeights.semibold,
               lineHeight: referenceFontLineHeights.display.sm,
            },
         },
         "display.xs.semibold": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display.xs,
               fontWeight: referenceFontWeights.semibold,
               lineHeight: referenceFontLineHeights.display.xs,
            },
         },
         "text.xl.semibold": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.xl,
               fontWeight: referenceFontWeights.semibold,
               lineHeight: referenceFontLineHeights.text.xl,
            },
         },
         "text.lg.semibold": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.lg,
               fontWeight: referenceFontWeights.semibold,
               lineHeight: referenceFontLineHeights.text.lg,
            },
         },
         "text.md.semibold": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.md,
               fontWeight: referenceFontWeights.semibold,
               lineHeight: referenceFontLineHeights.text.md,
            },
         },
         "text.sm.semibold": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.sm,
               fontWeight: referenceFontWeights.semibold,
               lineHeight: referenceFontLineHeights.text.sm,
            },
         },
         "text.xs.semibold": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.xs,
               fontWeight: referenceFontWeights.semibold,
               lineHeight: referenceFontLineHeights.text.xs,
            },
         },
         "display.2xl.medium": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display["2xl"],
               fontWeight: referenceFontWeights.medium,
               lineHeight: referenceFontLineHeights.display["2xl"],
            },
         },
         "display.lg.medium": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display.lg,
               fontWeight: referenceFontWeights.medium,
               lineHeight: referenceFontLineHeights.display.lg,
            },
         },
         "display.md.medium": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display.md,
               fontWeight: referenceFontWeights.medium,
               lineHeight: referenceFontLineHeights.display.md,
            },
         },
         "display.sm.medium": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display.sm,
               fontWeight: referenceFontWeights.medium,
               lineHeight: referenceFontLineHeights.display.sm,
            },
         },
         "display.xs.medium": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display.xs,
               fontWeight: referenceFontWeights.medium,
               lineHeight: referenceFontLineHeights.display.xs,
            },
         },
         "text.xl.medium": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.xl,
               fontWeight: referenceFontWeights.medium,
               lineHeight: referenceFontLineHeights.text.xl,
            },
         },
         "text.lg.medium": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.lg,
               fontWeight: referenceFontWeights.medium,
               lineHeight: referenceFontLineHeights.text.lg,
            },
         },
         "text.md.medium": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.md,
               fontWeight: referenceFontWeights.medium,
               lineHeight: referenceFontLineHeights.text.md,
            },
         },
         "text.sm.medium": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.sm,
               fontWeight: referenceFontWeights.medium,
               lineHeight: referenceFontLineHeights.text.sm,
            },
         },
         "text.xs.medium": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.xs,
               fontWeight: referenceFontWeights.medium,
               lineHeight: referenceFontLineHeights.text.xs,
            },
         },
         "display.2xl.regular": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display["2xl"],
               fontWeight: referenceFontWeights.regular,
               lineHeight: referenceFontLineHeights.display["2xl"],
            },
         },
         "display.lg.regular": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display.lg,
               fontWeight: referenceFontWeights.regular,
               lineHeight: referenceFontLineHeights.display.lg,
            },
         },
         "display.md.regular": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display.md,
               fontWeight: referenceFontWeights.regular,
               lineHeight: referenceFontLineHeights.display.md,
            },
         },
         "display.sm.regular": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display.sm,
               fontWeight: referenceFontWeights.regular,
               lineHeight: referenceFontLineHeights.display.sm,
            },
         },
         "display.xs.regular": {
            value: {
               fontFamily: referenceFontFamily.display,
               fontSize: referenceFontSizes.display.xs,
               fontWeight: referenceFontWeights.regular,
               lineHeight: referenceFontLineHeights.display.xs,
            },
         },
         "text.xl.regular": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.xl,
               fontWeight: referenceFontWeights.regular,
               lineHeight: referenceFontLineHeights.text.xl,
            },
         },
         "text.lg.regular": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.lg,
               fontWeight: referenceFontWeights.regular,
               lineHeight: referenceFontLineHeights.text.lg,
            },
         },
         "text.md.regular": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.md,
               fontWeight: referenceFontWeights.regular,
               lineHeight: referenceFontLineHeights.text.md,
            },
         },
         "text.sm.regular": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.sm,
               fontWeight: referenceFontWeights.regular,
               lineHeight: referenceFontLineHeights.text.sm,
            },
         },
         "text.xs.regular": {
            value: {
               fontFamily: referenceFontFamily.text,
               fontSize: referenceFontSizes.text.xs,
               fontWeight: referenceFontWeights.regular,
               lineHeight: referenceFontLineHeights.text.xs,
            },
         },
      },
      tokens: {
         colors: {
            black: {
               value: "#000000",
            },
            blue: {
               25: {
                  value: "#f5faff",
               },
               50: {
                  value: "#eff8ff",
               },
               100: {
                  value: "#d1e9ff",
               },
               200: {
                  value: "#b2ddff",
               },
               300: {
                  value: "#84caff",
               },
               400: {
                  value: "#53b1fd",
               },
               500: {
                  value: "#2e90fa",
               },
               600: {
                  value: "#1570ef",
               },
               700: {
                  value: "#175cd3",
               },
               800: {
                  value: "#1849a9",
               },
               900: {
                  value: "#194185",
               },
               950: {
                  value: "#102a56",
               },
            },
            gray: {
               dark: {
                  25: {
                     value: "#fafafa",
                  },
                  50: {
                     value: "#f5f5f6",
                  },
                  100: {
                     value: "#f0f1f1",
                  },
                  200: {
                     value: "#ececed",
                  },
                  300: {
                     value: "#cecfd2",
                  },
                  400: {
                     value: "#94969c",
                  },
                  500: {
                     value: "#85888e",
                  },
                  600: {
                     value: "#61646c",
                  },
                  700: {
                     value: "#333741",
                  },
                  800: {
                     value: "#1f242f",
                  },
                  900: {
                     value: "#161b26",
                  },
                  950: {
                     value: "#0c111d",
                  },
               },
               light: {
                  25: {
                     value: "#fcfcfd",
                  },
                  50: {
                     value: "#f9fafb",
                  },
                  100: {
                     value: "#f2f4f7",
                  },
                  200: {
                     value: "#eaecf0",
                  },
                  300: {
                     value: "#d0d5dd",
                  },
                  400: {
                     value: "#98a2b3",
                  },
                  500: {
                     value: "#667085",
                  },
                  600: {
                     value: "#475467",
                  },
                  700: {
                     value: "#344054",
                  },
                  800: {
                     value: "#182230",
                  },
                  900: {
                     value: "#101828",
                  },
                  950: {
                     value: "#0C111D",
                  },
               },
            },
            white: {
               value: "#ffffff",
            },
         },
         fonts: {
            display: {
               value: referenceFontFamily.display,
            },
            text: {
               value: referenceFontFamily.text,
            },
         },
         fontSizes: {
            display: {
               xs: {
                  value: referenceFontSizes.display.xs,
               },
               sm: {
                  value: referenceFontSizes.display.sm,
               },
               md: {
                  value: referenceFontSizes.display.md,
               },
               lg: {
                  value: referenceFontSizes.display.lg,
               },
               xl: {
                  value: referenceFontSizes.display.xl,
               },
               "2xl": {
                  value: referenceFontSizes.display["2xl"],
               },
            },
            text: {
               xs: {
                  value: referenceFontSizes.text.xs,
               },
               sm: {
                  value: referenceFontSizes.text.sm,
               },
               md: {
                  value: referenceFontSizes.text.md,
               },
               lg: {
                  value: referenceFontSizes.text.lg,
               },
               xl: {
                  value: referenceFontSizes.text.xl,
               },
            },
         },
         fontWeights: {
            regular: {
               value: referenceFontWeights.regular,
            },
            medium: {
               value: referenceFontWeights.medium,
            },
            semibold: {
               value: referenceFontWeights.semibold,
            },
            bold: {
               value: referenceFontWeights.bold,
            },
         },
         letterSpacings: {
            display: {
               md: {
                  value: referenceFontLetterSpacings.display.md,
               },
               lg: {
                  value: referenceFontLetterSpacings.display.lg,
               },
               xl: {
                  value: referenceFontLetterSpacings.display.xl,
               },
               "2xl": {
                  value: referenceFontLetterSpacings.display["2xl"],
               },
            },
         },
         lineHeights: {
            display: {
               xs: {
                  value: referenceFontLineHeights.display.xs,
               },
               sm: {
                  value: referenceFontLineHeights.display.sm,
               },
               md: {
                  value: referenceFontLineHeights.display.md,
               },
               lg: {
                  value: referenceFontLineHeights.display.lg,
               },
               xl: {
                  value: referenceFontLineHeights.display.xl,
               },
               "2xl": {
                  value: referenceFontLineHeights.display["2xl"],
               },
            },
            text: {
               xs: {
                  value: referenceFontLineHeights.text.xs,
               },
               sm: {
                  value: referenceFontLineHeights.text.sm,
               },
               md: {
                  value: referenceFontLineHeights.text.md,
               },
               lg: {
                  value: referenceFontLineHeights.text.lg,
               },
               xl: {
                  value: referenceFontLineHeights.text.xl,
               },
            },
         },
         radii: {
            "radius-none": { value: "0rem" },
            "radius-xxs": { value: "0.125rem" },
            "radius-xs": { value: "0.25rem" },
            "radius-sm": { value: "0.375rem" },
            "radius-md": { value: "0.5rem" },
            "radius-lg": { value: "0.625rem" },
            "radius-xl": { value: "0.75rem" },
            "radius-2xl": { value: "1rem" },
            "radius-3xl": { value: "1.25rem" },
            "radius-4xl": { value: "1.5rem" },
            "radius-full": { value: "9999px " },
         },
         spacing: {
            "0": { value: "0rem" },
            "spacing-none": { value: "0rem" },
            "0.5": { value: "0.125rem" },
            "spacing-xxs": { value: "0.125rem" },
            "1": { value: "0.25rem" },
            "spacing-xs": { value: "0.25rem" },
            "1.5": { value: "0.375rem" },
            "spacing-sm": { value: "0.375rem" },
            "2": { value: "0.5rem" },
            "spacing-md": { value: "0.5rem" },
            "3": { value: "0.75rem" },
            "spacing-lg": { value: "0.75rem" },
            "4": { value: "1rem" },
            "container-padding-mobile": { value: "1rem" },
            "spacing-xl": { value: "1rem" },
            "5": { value: "1.25rem" },
            "spacing-2xl": { value: "1.25rem" },
            "6": { value: "1.5rem" },
            "spacing-3xl": { value: "1.5rem" },
            "8": { value: "2rem" },
            "container-padding-desktop": { value: "2rem" },
            "spacing-4xl": { value: "2rem" },
            "10": { value: "2.5rem" },
            "spacing-5xl": { value: "2.5rem" },
            "12": { value: "3rem" },
            "spacing-6xl": { value: "3rem" },
            "16": { value: "4rem" },
            "spacing-7xl": { value: "4rem" },
            "20": { value: "5rem" },
            "spacing-8xl": { value: "5rem" },
            "24": { value: "6rem" },
            "spacing-9xl": { value: "6rem" },
            "32": { value: "8rem" },
            "spacing-10xl": { value: "8rem" },
            "40": { value: "10rem" },
            "spacing-11xl": { value: "10rem" },
            "48": { value: "12rem" },
            "spacing-12xl": { value: "12rem" },
            "56": { value: "14rem" },
            "spacing-13xl": { value: "14rem" },
            "64": { value: "16rem" },
            "spacing-14xl": { value: "16rem" },
            "80": { value: "20rem" },
            "spacing-15xl": { value: "20rem" },
            "width-xxs": { value: "20rem" },
            "96": { value: "24rem" },
            "spacing-16xl": { value: "24rem" },
            "width-xs": { value: "24rem" },
            "120": { value: "30rem" },
            "spacing-17xl": { value: "30rem" },
            "width-sm": { value: "30rem" },
            "140": { value: "35rem" },
            "spacing-18xl": { value: "35rem" },
            "width-md": { value: "35rem" },
            "160": { value: "40rem" },
            "spacing-19xl": { value: "40rem" },
            "width-lg": { value: "40rem" },
            "180": { value: "45rem" },
            "paragraph-max-width": { value: "45rem" },
            "spacing-20xl": { value: "45rem" },
            "192": { value: "48rem" },
            "spacing-21xl": { value: "48rem" },
            "width-xl": { value: "48rem" },
            "256": { value: "64rem" },
            "spacing-22xl": { value: "64rem" },
            "width-2xl": { value: "64rem" },
            "320": { value: "80rem" },
            "container-max-width-desktop": { value: "80rem" },
            "spacing-23xl": { value: "80rem" },
            "width-3xl": { value: "80rem" },
            "360": { value: "90rem" },
            "spacing-24xl": { value: "90rem" },
            "width-4xl": { value: "90rem" },
            "400": { value: "100rem" },
            "spacing-25xl": { value: "100rem" },
            "width-5xl": { value: "100rem" },
            "480": { value: "120 rem" },
            "spacing-26xl": { value: "120rem" },
            "width-6xl": { value: "120rem" },
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
