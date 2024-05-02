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
      breakpoints: {
         desktop: "1280px",
         mobile: "375px",
         tablet: "768px",
      },
      semanticTokens: {
         colors: {
            "alpha-white-10": {
               dark: {
                  value: "rgba(12, 17, 29, 0.1)",
               },
               light: {
                  value: "rgba(255, 255, 255, 0.1)",
               },
            },
            "alpha-white-20": {
               dark: {
                  value: "rgba(12, 17, 29, 0.2)",
               },
               light: {
                  value: "rgba(255, 255, 255, 0.2)",
               },
            },
            "alpha-white-30": {
               dark: {
                  value: "rgba(12, 17, 29, 0.3)",
               },
               light: {
                  value: "rgba(255, 255, 255, 0.3)",
               },
            },
            "alpha-white-40": {
               dark: {
                  value: "rgba(12, 17, 29, 0.4)",
               },
               light: {
                  value: "rgba(255, 255, 255, 0.4)",
               },
            },
            "alpha-white-50": {
               dark: {
                  value: "rgba(12, 17, 29, 0.5)",
               },
               light: {
                  value: "rgba(255, 255, 255, 0.5)",
               },
            },
            "alpha-white-60": {
               dark: {
                  value: "rgba(12, 17, 29, 0.6)",
               },
               light: {
                  value: "rgba(255, 255, 255, 0.6)",
               },
            },
            "alpha-white-70": {
               dark: {
                  value: "rgba(12, 17, 29, 0.7)",
               },
               light: {
                  value: "rgba(255, 255, 255, 0.7)",
               },
            },
            "alpha-white-80": {
               dark: {
                  value: "rgba(12, 17, 29, 0.8)",
               },
               light: {
                  value: "rgba(255, 255, 255, 0.8)",
               },
            },
            "alpha-white-90": {
               dark: {
                  value: "rgba(12, 17, 29, 0.9)",
               },
               light: {
                  value: "rgba(255, 255, 255, 0.9)",
               },
            },
            "alpha-white-100": {
               dark: {
                  value: "{colors.gray.dark.950}",
               },
               light: {
                  value: "{colors.white}",
               },
            },
            "alpha-black-10": {
               dark: {
                  value: "rgba(255, 255, 255, 0.1)",
               },
               light: {
                  value: "rgba(0, 0, 0, 0.1)",
               },
            },
            "alpha-black-20": {
               dark: {
                  value: "rgba(255, 255, 255, 0.2)",
               },
               light: {
                  value: "rgba(0, 0, 0, 0.2)",
               },
            },
            "alpha-black-30": {
               dark: {
                  value: "rgba(255, 255, 255, 0.3)",
               },
               light: {
                  value: "rgba(0, 0, 0, 0.3)",
               },
            },
            "alpha-black-40": {
               dark: {
                  value: "rgba(255, 255, 255, 0.4)",
               },
               light: {
                  value: "rgba(0, 0, 0, 0.4)",
               },
            },
            "alpha-black-50": {
               dark: {
                  value: "rgba(255, 255, 255, 0.5)",
               },
               light: {
                  value: "rgba(0, 0, 0, 0.5)",
               },
            },
            "alpha-black-60": {
               dark: {
                  value: "rgba(255, 255, 255, 0.6)",
               },
               light: {
                  value: "rgba(0, 0, 0, 0.6)",
               },
            },
            "alpha-black-70": {
               dark: {
                  value: "rgba(255, 255, 255, 0.7)",
               },
               light: {
                  value: "rgba(0, 0, 0, 0.7)",
               },
            },
            "alpha-black-80": {
               dark: {
                  value: "rgba(255, 255, 255, 0.8)",
               },
               light: {
                  value: "rgba(0, 0, 0, 0.8)",
               },
            },
            "alpha-black-90": {
               dark: {
                  value: "rgba(255, 255, 255, 0.9)",
               },
               light: {
                  value: "rgba(0, 0, 0, 0.9)",
               },
            },
            "alpha-black-100": {
               dark: {
                  value: "{colors.white}",
               },
               light: {
                  value: "{colors.black}",
               },
            },
            "bg-active": {
               dark: {
                  value: "{colors.gray.dark.800}",
               },
               light: {
                  value: "{colors.gray.light.50}",
               },
            },
            "bg-brand-primary": {
               dark: {
                  value: "{colors.brand.500}",
               },
               light: {
                  value: "{colors.brand.50}",
               },
            },
            "bg-brand-primary_alt": {
               dark: {
                  value: "{colors.gray.dark.800}",
               },
               light: {
                  value: "{colors.brand.50}",
               },
            },
            "bg-brand-secondary": {
               dark: {
                  value: "{colors.brand.600}",
               },
               light: {
                  value: "{colors.brand.100}",
               },
            },
            "bg-brand-solid": {
               dark: {
                  value: "{colors.brand.600}",
               },
               light: {
                  value: "{colors.brand.600}",
               },
            },
            "bg-brand-solid_hover": {
               dark: {
                  value: "{colors.brand.500}",
               },
               light: {
                  value: "{colors.brand.700}",
               },
            },
            "bg-brand-section": {
               dark: {
                  value: "{colors.gray.dark.800}",
               },
               light: {
                  value: "{colors.brand.800}",
               },
            },
            "bg-brand-section_subtle": {
               dark: {
                  value: "{colors.gray.dark.950}",
               },
               light: {
                  value: "{colors.brand.700}",
               },
            },
            "bg-disabled": {
               dark: {
                  value: "{colors.gray.dark.800}",
               },
               light: {
                  value: "{colors.gray.light.100}",
               },
            },
            "bg-disabled_subtle": {
               dark: {
                  value: "{colors.gray.dark.900}",
               },
               light: {
                  value: "{colors.gray.light.50}",
               },
            },
            "bg-error-primary": {
               dark: {
                  value: "{colors.error.500}",
               },
               light: {
                  value: "{colors.error.50}",
               },
            },
            "bg-error-secondary": {
               dark: {
                  value: "{colors.error.600}",
               },
               light: {
                  value: "{colors.error.100}",
               },
            },
            "bg-error-solid": {
               dark: {
                  value: "{colors.error.600}",
               },
               light: {
                  value: "{colors.error.600}",
               },
            },
            "bg-overlay": {
               dark: {
                  value: "{colors.gray.dark.800}",
               },
               light: {
                  value: "{colors.gray.light.950}",
               },
            },
            "bg-primary": {
               dark: {
                  value: "{colors.gray.dark.950}",
               },
               light: {
                  value: "{colors.white}",
               },
            },
            "bg-primary_alt": {
               dark: {
                  value: "{colors.gray.dark.900}",
               },
               light: {
                  value: "{colors.white}",
               },
            },
            "bg-primary_hover": {
               dark: {
                  value: "{colors.gray.dark.800}",
               },
               light: {
                  value: "{colors.gray.light.50}",
               },
            },
            "bg-primary-solid": {
               dark: {
                  value: "{colors.gray.dark.900}",
               },
               light: {
                  value: "{colors.gray.light.950}",
               },
            },
            "bg-secondary": {
               dark: {
                  value: "{colors.gray.dark.900}",
               },
               light: {
                  value: "{colors.gray.light.50}",
               },
            },
            "bg-secondary_alt": {
               dark: {
                  value: "{colors.gray.dark.950}",
               },
               light: {
                  value: "{colors.gray.light.50}",
               },
            },
            "bg-secondary_hover": {
               dark: {
                  value: "{colors.gray.dark.800}",
               },
               light: {
                  value: "{colors.gray.light.100}",
               },
            },
            "bg-secondary_subtle": {
               dark: {
                  value: "{colors.gray.dark.900}",
               },
               light: {
                  value: "{colors.gray.light.25}",
               },
            },
            "bg-secondary-solid": {
               dark: {
                  value: "{colors.gray.dark.600}",
               },
               light: {
                  value: "{colors.gray.light.600}",
               },
            },
            "bg-success-primary": {
               dark: {
                  value: "{colors.success.500}",
               },
               light: {
                  value: "{colors.success.50}",
               },
            },
            "bg-success-secondary": {
               dark: {
                  value: "{colors.success.600}",
               },
               light: {
                  value: "{colors.success.100}",
               },
            },
            "bg-success-solid": {
               dark: {
                  value: "{colors.success.600}",
               },
               light: {
                  value: "{colors.success.600}",
               },
            },
            "bg-tertiary": {
               dark: {
                  value: "{colors.gray.dark.800}",
               },
               light: {
                  value: "{colors.gray.light.100}",
               },
            },
            "bg-quarternary": {
               dark: {
                  value: "{colors.gray.dark.700}",
               },
               light: {
                  value: "{colors.gray.light.200}",
               },
            },
            "bg-warning-primary": {
               dark: {
                  value: "{colors.warning.500}",
               },
               light: {
                  value: "{colors.warning.50}",
               },
            },
            "bg-warning-secondary": {
               dark: {
                  value: "{colors.warning.600}",
               },
               light: {
                  value: "{colors.warning.100}",
               },
            },
            "bg-warning-solid": {
               dark: {
                  value: "{colors.warning.600}",
               },
               light: {
                  value: "{colors.warning.600}",
               },
            },
            "border-brand": {
               dark: {
                  value: "{colors.brand.400}",
               },
               light: {
                  value: "{colors.brand.300}",
               },
            },
            "border-brand-solid": {
               dark: {
                  value: "{colors.brand.600}",
               },
               light: {
                  value: "{colors.brand.500}",
               },
            },
            "border-brand-solid_alt": {
               dark: {
                  value: "{colors.gray.dark.700}",
               },
               light: {
                  value: "{colors.brand.600}",
               },
            },
            "border-disabled": {
               dark: {
                  value: "{colors.gray.dark.700}",
               },
               light: {
                  value: "{colors.gray.light.300}",
               },
            },
            "border-disabled_subtle": {
               dark: {
                  value: "{colors.gray.dark.800}",
               },
               light: {
                  value: "{colors.gray.light.200}",
               },
            },
            "border-error": {
               dark: {
                  value: "{colors.error.400}",
               },
               light: {
                  value: "{colors.error.300}",
               },
            },
            "border-error-solid": {
               dark: {
                  value: "{colors.error.500}",
               },
               light: {
                  value: "{colors.error.600}",
               },
            },
            "border-primary": {
               dark: {
                  value: "{colors.gray.dark.700}",
               },
               light: {
                  value: "{colors.gray.light.300}",
               },
            },
            "border-secondary": {
               dark: {
                  value: "{colors.gray.dark.800}",
               },
               light: {
                  value: "{colors.gray.light.200}",
               },
            },
            "border-tertiary": {
               dark: {
                  value: "{colors.gray.dark.800}",
               },
               light: {
                  value: "{colors.gray.light.100}",
               },
            },
            "fg-brand-primary": {
               dark: {
                  value: "{colors.brand.500}",
               },
               light: {
                  value: "{colors.brand.600}",
               },
            },
            "fg-brand-primary_alt": {
               dark: {
                  value: "{colors.gray.dark.300}",
               },
               light: {
                  value: "{colors.brand.600}",
               },
            },
            "fg-brand-secondary": {
               dark: {
                  value: "{colors.brand.500}",
               },
               light: {
                  value: "{colors.brand.500}",
               },
            },
            "fg-disabled": {
               dark: {
                  value: "{colors.gray.dark.500}",
               },
               light: {
                  value: "{colors.gray.light.400}",
               },
            },
            "fg-disabled_subtle": {
               dark: {
                  value: "{colors.gray.dark.600}",
               },
               light: {
                  value: "{colors.gray.light.300}",
               },
            },
            "fg-error-primary": {
               dark: {
                  value: "{colors.error.500}",
               },
               light: {
                  value: "{colors.error.600}",
               },
            },
            "fg-error-secondary": {
               dark: {
                  value: "{colors.error.400}",
               },
               light: {
                  value: "{colors.error.500}",
               },
            },
            "fg-primary": {
               dark: {
                  value: "{colors.white}",
               },
               light: {
                  value: "{colors.gray.light.900}",
               },
            },
            "fg-secondary": {
               dark: {
                  value: "{colors.gray.dark.300}",
               },
               light: {
                  value: "{colors.gray.light.700}",
               },
            },
            "fg-secondary_hover": {
               dark: {
                  value: "{colors.gray.dark.200}",
               },
               light: {
                  value: "{colors.gray.light.800}",
               },
            },
            "fg-tertiary": {
               dark: {
                  value: "{colors.gray.dark.400}",
               },
               light: {
                  value: "{colors.gray.light.600}",
               },
            },
            "fg-tertiary_hover": {
               dark: {
                  value: "{colors.gray.dark.300}",
               },
               light: {
                  value: "{colors.gray.light.700}",
               },
            },
            "fg-quaternary": {
               dark: {
                  value: "{colors.gray.dark.400}",
               },
               light: {
                  value: "{colors.gray.light.500}",
               },
            },
            "fg-quaternary_hover": {
               dark: {
                  value: "{colors.gray.dark.300}",
               },
               light: {
                  value: "{colors.gray.light.600}",
               },
            },
            "fg-quinary": {
               dark: {
                  value: "{colors.gray.dark.500}",
               },
               light: {
                  value: "{colors.gray.light.400}",
               },
            },
            "fg-quinary_hover": {
               dark: {
                  value: "{colors.gray.dark.400}",
               },
               light: {
                  value: "{colors.gray.light.500}",
               },
            },
            "fg-senary": {
               dark: {
                  value: "{colors.gray.dark.600}",
               },
               light: {
                  value: "{colors.gray.light.300}",
               },
            },
            "fg-warning-primary": {
               dark: {
                  value: "{colors.warning.500}",
               },
               light: {
                  value: "{colors.warning.600}",
               },
            },
            "fg-warning-secondary": {
               dark: {
                  value: "{colors.warning.400}",
               },
               light: {
                  value: "{colors.warning.500}",
               },
            },
            "fg-success-primary": {
               dark: {
                  value: "{colors.success.500}",
               },
               light: {
                  value: "{colors.success.600}",
               },
            },
            "fg-success-secondary": {
               dark: {
                  value: "{colors.success.400}",
               },
               light: {
                  value: "{colors.success.500}",
               },
            },
            "fg-white": {
               dark: {
                  value: "{colors.white}",
               },
               light: {
                  value: "{colors.white}",
               },
            },
            "text-brand-primary": {
               dark: {
                  value: "{colors.gray.dark.50}",
               },
               light: {
                  value: "{colors.brand.900}",
               },
            },
            "text-brand-secondary": {
               dark: {
                  value: "{colors.gray.dark.300}",
               },
               light: {
                  value: "{colors.brand.700}",
               },
            },
            "text-brand-tertiary": {
               dark: {
                  value: "{colors.gray.dark.400}",
               },
               light: {
                  value: "{colors.brand.600}",
               },
            },
            "text-brand-tertiary_alt": {
               dark: {
                  value: "{colors.gray.dark.50}",
               },
               light: {
                  value: "{colors.brand.600}",
               },
            },
            "text-disabled": {
               dark: {
                  value: "{colors.gray.dark.500}",
               },
               light: {
                  value: "{colors.gray.light.500}",
               },
            },
            "text-error-primary": {
               dark: {
                  value: "{colors.error.400}",
               },
               light: {
                  value: "{colors.error.600}",
               },
            },
            "text-placeholder": {
               dark: {
                  value: "{colors.gray.dark.400}",
               },
               light: {
                  value: "{colors.gray.light.500}",
               },
            },
            "text-placeholder_subtle": {
               dark: {
                  value: "{colors.gray.dark.700}",
               },
               light: {
                  value: "{colors.gray.light.300}",
               },
            },
            "text-primary": {
               dark: {
                  value: "{colors.gray.dark.50}",
               },
               light: {
                  value: "{colors.gray.light.900}",
               },
            },
            "text-primary_on-brand": {
               dark: {
                  value: "{colors.gray.dark.50}",
               },
               light: {
                  value: "{colors.white}",
               },
            },
            "text-secondary": {
               dark: {
                  value: "{colors.gray.dark.300}",
               },
               light: {
                  value: "{colors.gray.light.700}",
               },
            },
            "text-secondary_hover": {
               dark: {
                  value: "{colors.gray.dark.200}",
               },
               light: {
                  value: "{colors.gray.light.800}",
               },
            },
            "text-secondary_on-brand": {
               dark: {
                  value: "{colors.gray.dark.300}",
               },
               light: {
                  value: "{colors.brand.200}",
               },
            },
            "text-success-primary": {
               dark: {
                  value: "{colors.success.400}",
               },
               light: {
                  value: "{colors.success.600}",
               },
            },
            "text-tertiary": {
               dark: {
                  value: "{colors.gray.dark.400}",
               },
               light: {
                  value: "{colors.gray.light.600}",
               },
            },
            "text-tertiary_hover": {
               dark: {
                  value: "{colors.gray.dark.300}",
               },
               light: {
                  value: "{colors.gray.light.700}",
               },
            },
            "text-tertiary_on-brand": {
               dark: {
                  value: "{colors.gray.dark.400}",
               },
               light: {
                  value: "{colors.brand.200}",
               },
            },
            "text-quaternary": {
               dark: {
                  value: "{colors.gray.dark.400}",
               },
               light: {
                  value: "{colors.gray.light.500}",
               },
            },
            "text-quaternary_on-brand": {
               dark: {
                  value: "{colors.gray.dark.400}",
               },
               light: {
                  value: "{colors.brand.300}",
               },
            },
            "text-warning-primary": {
               dark: {
                  value: "{colors.warning.400}",
               },
               light: {
                  value: "{colors.warning.600}",
               },
            },
            "text-white": {
               value: "{colors.white}",
            },
            "utility-brand-50": {
               dark: {
                  value: "{colors.brand.950}",
               },
               light: {
                  value: "{colors.brand.50}",
               },
            },
            "utility-brand-50_alt": {
               dark: {
                  value: "{colors.gray.dark.900}",
               },
               light: {
                  value: "{colors.brand.50}",
               },
            },
            "utility-brand-100": {
               dark: {
                  value: "{colors.brand.900}",
               },
               light: {
                  value: "{colors.brand.100}",
               },
            },
            "utility-brand-100_alt": {
               dark: {
                  value: "{colors.gray.dark.800}",
               },
               light: {
                  value: "{colors.brand.100}",
               },
            },
            "utility-brand-200": {
               dark: {
                  value: "{colors.brand.800}",
               },
               light: {
                  value: "{colors.brand.200}",
               },
            },
            "utility-brand-200_alt": {
               dark: {
                  value: "{colors.gray.dark.700}",
               },
               light: {
                  value: "{colors.brand.200}",
               },
            },
            "utility-brand-300": {
               dark: {
                  value: "{colors.brand.700}",
               },
               light: {
                  value: "{colors.brand.300}",
               },
            },
            "utility-brand-300_alt": {
               dark: {
                  value: "{colors.gray.dark.700}",
               },
               light: {
                  value: "{colors.brand.300}",
               },
            },
            "utility-brand-400": {
               dark: {
                  value: "{colors.brand.600}",
               },
               light: {
                  value: "{colors.brand.400}",
               },
            },
            "utility-brand-400_alt": {
               dark: {
                  value: "{colors.gray.dark.600}",
               },
               light: {
                  value: "{colors.brand.400}",
               },
            },
            "utility-brand-500": {
               dark: {
                  value: "{colors.brand.500}",
               },
               light: {
                  value: "{colors.brand.500}",
               },
            },
            "utility-brand-500_alt": {
               dark: {
                  value: "{colors.gray.dark.500}",
               },
               light: {
                  value: "{colors.brand.500}",
               },
            },
            "utility-brand-600": {
               dark: {
                  value: "{colors.brand.400}",
               },
               light: {
                  value: "{colors.brand.600}",
               },
            },
            "utility-brand-600_alt": {
               dark: {
                  value: "{colors.gray.dark.400}",
               },
               light: {
                  value: "{colors.brand.600}",
               },
            },
            "utility-brand-700": {
               dark: {
                  value: "{colors.brand.300}",
               },
               light: {
                  value: "{colors.brand.700}",
               },
            },
            "utility-brand-700_alt": {
               dark: {
                  value: "{colors.gray.dark.300}",
               },
               light: {
                  value: "{colors.brand.700}",
               },
            },
            "utility-brand-800": {
               dark: {
                  value: "{colors.brand.200}",
               },
               light: {
                  value: "{colors.brand.800}",
               },
            },
            "utility-brand-800_alt": {
               dark: {
                  value: "{colors.gray.dark.200}",
               },
               light: {
                  value: "{colors.brand.800}",
               },
            },
            "utility-brand-900": {
               dark: {
                  value: "{colors.brand.100}",
               },
               light: {
                  value: "{colors.brand.900}",
               },
            },
            "utility-brand-900_alt": {
               dark: {
                  value: "{colors.gray.dark.100}",
               },
               light: {
                  value: "{colors.brand.900}",
               },
            },
            "utility-gray-50": {
               dark: {
                  value: "{colors.gray.dark.900}",
               },
               light: {
                  value: "{colors.gray.light.50}",
               },
            },
            "utility-gray-100": {
               dark: {
                  value: "{colors.gray.dark.800}",
               },
               light: {
                  value: "{colors.gray.light.100}",
               },
            },
            "utility-gray-200": {
               dark: {
                  value: "{colors.gray.dark.700}",
               },
               light: {
                  value: "{colors.gray.light.200}",
               },
            },
            "utility-gray-300": {
               dark: {
                  value: "{colors.gray.dark.700}",
               },
               light: {
                  value: "{colors.gray.light.300}",
               },
            },
            "utility-gray-400": {
               dark: {
                  value: "{colors.gray.dark.600}",
               },
               light: {
                  value: "{colors.gray.light.400}",
               },
            },
            "utility-gray-500": {
               dark: {
                  value: "{colors.gray.dark.500}",
               },
               light: {
                  value: "{colors.gray.light.500}",
               },
            },
            "utility-gray-600": {
               dark: {
                  value: "{colors.gray.dark.400}",
               },
               light: {
                  value: "{colors.gray.light.600}",
               },
            },
            "utility-gray-700": {
               dark: {
                  value: "{colors.gray.dark.300}",
               },
               light: {
                  value: "{colors.gray.light.700}",
               },
            },
            "utility-gray-800": {
               dark: {
                  value: "{colors.gray.dark.200}",
               },
               light: {
                  value: "{colors.gray.light.800}",
               },
            },
            "utility-gray-900": {
               dark: {
                  value: "{colors.gray.dark.100}",
               },
               light: {
                  value: "{colors.gray.light.900}",
               },
            },
            "utility-error-50": {
               dark: {
                  value: "{colors.error.950}",
               },
               light: {
                  value: "{colors.error.50}",
               },
            },
            "utility-error-100": {
               dark: {
                  value: "{colors.error.900}",
               },
               light: {
                  value: "{colors.error.100}",
               },
            },
            "utility-error-200": {
               dark: {
                  value: "{colors.error.800}",
               },
               light: {
                  value: "{colors.error.200}",
               },
            },
            "utility-error-300": {
               dark: {
                  value: "{colors.error.700}",
               },
               light: {
                  value: "{colors.error.300}",
               },
            },
            "utility-error-400": {
               dark: {
                  value: "{colors.error.600}",
               },
               light: {
                  value: "{colors.error.400}",
               },
            },
            "utility-error-500": {
               dark: {
                  value: "{colors.error.500}",
               },
               light: {
                  value: "{colors.error.500}",
               },
            },
            "utility-error-600": {
               dark: {
                  value: "{colors.error.400}",
               },
               light: {
                  value: "{colors.error.600}",
               },
            },
            "utility-error-700": {
               dark: {
                  value: "{colors.error.300}",
               },
               light: {
                  value: "{colors.error.700}",
               },
            },
            "utility-warning-50": {
               dark: {
                  value: "{colors.warning.950}",
               },
               light: {
                  value: "{colors.warning.50}",
               },
            },
            "utility-warning-100": {
               dark: {
                  value: "{colors.warning.900}",
               },
               light: {
                  value: "{colors.warning.100}",
               },
            },
            "utility-warning-200": {
               dark: {
                  value: "{colors.warning.800}",
               },
               light: {
                  value: "{colors.warning.200}",
               },
            },
            "utility-warning-300": {
               dark: {
                  value: "{colors.warning.700}",
               },
               light: {
                  value: "{colors.warning.300}",
               },
            },
            "utility-warning-400": {
               dark: {
                  value: "{colors.warning.600}",
               },
               light: {
                  value: "{colors.warning.400}",
               },
            },
            "utility-warning-500": {
               dark: {
                  value: "{colors.warning.500}",
               },
               light: {
                  value: "{colors.warning.500}",
               },
            },
            "utility-warning-600": {
               dark: {
                  value: "{colors.warning.400}",
               },
               light: {
                  value: "{colors.warning.600}",
               },
            },
            "utility-warning-700": {
               dark: {
                  value: "{colors.warning.300}",
               },
               light: {
                  value: "{colors.warning.700}",
               },
            },
            "utility-success-50": {
               dark: {
                  value: "{colors.success.950}",
               },
               light: {
                  value: "{colors.success.50}",
               },
            },
            "utility-success-100": {
               dark: {
                  value: "{colors.success.900}",
               },
               light: {
                  value: "{colors.success.100}",
               },
            },
            "utility-success-200": {
               dark: {
                  value: "{colors.success.800}",
               },
               light: {
                  value: "{colors.success.200}",
               },
            },
            "utility-success-300": {
               dark: {
                  value: "{colors.success.700}",
               },
               light: {
                  value: "{colors.success.300}",
               },
            },
            "utility-success-400": {
               dark: {
                  value: "{colors.success.600}",
               },
               light: {
                  value: "{colors.success.400}",
               },
            },
            "utility-success-500": {
               dark: {
                  value: "{colors.success.500}",
               },
               light: {
                  value: "{colors.success.500}",
               },
            },
            "utility-success-600": {
               dark: {
                  value: "{colors.success.400}",
               },
               light: {
                  value: "{colors.success.600}",
               },
            },
            "utility-success-700": {
               dark: {
                  value: "{colors.success.300}",
               },
               light: {
                  value: "{colors.success.700}",
               },
            },
            "utility-blue-light-50": {
               dark: {
                  value: "{colors.blue-light.950}",
               },
               light: {
                  value: "{colors.blue-light.50}",
               },
            },
            "utility-blue-light-100": {
               dark: {
                  value: "{colors.blue-light.900}",
               },
               light: {
                  value: "{colors.blue-light.100}",
               },
            },
            "utility-blue-light-200": {
               dark: {
                  value: "{colors.blue-light.800}",
               },
               light: {
                  value: "{colors.blue-light.200}",
               },
            },
            "utility-blue-light-300": {
               dark: {
                  value: "{colors.blue-light.700}",
               },
               light: {
                  value: "{colors.blue-light.300}",
               },
            },
            "utility-blue-light-400": {
               dark: {
                  value: "{colors.blue-light.600}",
               },
               light: {
                  value: "{colors.blue-light.400}",
               },
            },
            "utility-blue-light-500": {
               dark: {
                  value: "{colors.blue-light.500}",
               },
               light: {
                  value: "{colors.blue-light.500}",
               },
            },
            "utility-blue-light-600": {
               dark: {
                  value: "{colors.blue-light.400}",
               },
               light: {
                  value: "{colors.blue-light.600}",
               },
            },
            "utility-blue-light-700": {
               dark: {
                  value: "{colors.blue-light.300}",
               },
               light: {
                  value: "{colors.blue-light.700}",
               },
            },
            "utility-blue-50": {
               dark: {
                  value: "{colors.blue.950}",
               },
               light: {
                  value: "{colors.blue.50}",
               },
            },
            "utility-blue-100": {
               dark: {
                  value: "{colors.blue.900}",
               },
               light: {
                  value: "{colors.blue.100}",
               },
            },
            "utility-blue-200": {
               dark: {
                  value: "{colors.blue.800}",
               },
               light: {
                  value: "{colors.blue.200}",
               },
            },
            "utility-blue-300": {
               dark: {
                  value: "{colors.blue.700}",
               },
               light: {
                  value: "{colors.blue.300}",
               },
            },
            "utility-blue-400": {
               dark: {
                  value: "{colors.blue.600}",
               },
               light: {
                  value: "{colors.blue.400}",
               },
            },
            "utility-blue-500": {
               dark: {
                  value: "{colors.blue.500}",
               },
               light: {
                  value: "{colors.blue.500}",
               },
            },
            "utility-blue-600": {
               dark: {
                  value: "{colors.blue.400}",
               },
               light: {
                  value: "{colors.blue.600}",
               },
            },
            "utility-blue-700": {
               dark: {
                  value: "{colors.blue.300}",
               },
               light: {
                  value: "{colors.blue.700}",
               },
            },
            "utility-blue-dark-50": {
               dark: {
                  value: "{colors.blue-dark.950}",
               },
               light: {
                  value: "{colors.blue-dark.50}",
               },
            },
            "utility-blue-dark-100": {
               dark: {
                  value: "{colors.blue-dark.900}",
               },
               light: {
                  value: "{colors.blue-dark.100}",
               },
            },
            "utility-blue-dark-200": {
               dark: {
                  value: "{colors.blue-dark.800}",
               },
               light: {
                  value: "{colors.blue-dark.200}",
               },
            },
            "utility-blue-dark-300": {
               dark: {
                  value: "{colors.blue-dark.700}",
               },
               light: {
                  value: "{colors.blue-dark.300}",
               },
            },
            "utility-blue-dark-400": {
               dark: {
                  value: "{colors.blue-dark.600}",
               },
               light: {
                  value: "{colors.blue-dark.400}",
               },
            },
            "utility-blue-dark-500": {
               dark: {
                  value: "{colors.blue-dark.500}",
               },
               light: {
                  value: "{colors.blue-dark.500}",
               },
            },
            "utility-blue-dark-600": {
               dark: {
                  value: "{colors.blue-dark.400}",
               },
               light: {
                  value: "{colors.blue-dark.600}",
               },
            },
            "utility-blue-dark-700": {
               dark: {
                  value: "{colors.blue-dark.300}",
               },
               light: {
                  value: "{colors.blue-dark.700}",
               },
            },
            "utility-indigo-50": {
               dark: {
                  value: "{colors.indigo.950}",
               },
               light: {
                  value: "{colors.indigo.50}",
               },
            },
            "utility-indigo-100": {
               dark: {
                  value: "{colors.indigo.900}",
               },
               light: {
                  value: "{colors.indigo.100}",
               },
            },
            "utility-indigo-200": {
               dark: {
                  value: "{colors.indigo.800}",
               },
               light: {
                  value: "{colors.indigo.200}",
               },
            },
            "utility-indigo-300": {
               dark: {
                  value: "{colors.indigo.700}",
               },
               light: {
                  value: "{colors.indigo.300}",
               },
            },
            "utility-indigo-400": {
               dark: {
                  value: "{colors.indigo.600}",
               },
               light: {
                  value: "{colors.indigo.400}",
               },
            },
            "utility-indigo-500": {
               dark: {
                  value: "{colors.indigo.500}",
               },
               light: {
                  value: "{colors.indigo.500}",
               },
            },
            "utility-indigo-600": {
               dark: {
                  value: "{colors.indigo.400}",
               },
               light: {
                  value: "{colors.indigo.600}",
               },
            },
            "utility-indigo-700": {
               dark: {
                  value: "{colors.indigo.300}",
               },
               light: {
                  value: "{colors.indigo.700}",
               },
            },
            "utility-fuchsia-50": {
               dark: {
                  value: "{colors.fuchsia.950}",
               },
               light: {
                  value: "{colors.fuchsia.50}",
               },
            },
            "utility-fuchsia-100": {
               dark: {
                  value: "{colors.fuchsia.900}",
               },
               light: {
                  value: "{colors.fuchsia.100}",
               },
            },
            "utility-fuchsia-200": {
               dark: {
                  value: "{colors.fuchsia.800}",
               },
               light: {
                  value: "{colors.fuchsia.200}",
               },
            },
            "utility-fuchsia-300": {
               dark: {
                  value: "{colors.fuchsia.700}",
               },
               light: {
                  value: "{colors.fuchsia.300}",
               },
            },
            "utility-fuchsia-400": {
               dark: {
                  value: "{colors.fuchsia.600}",
               },
               light: {
                  value: "{colors.fuchsia.400}",
               },
            },
            "utility-fuchsia-500": {
               dark: {
                  value: "{colors.fuchsia.500}",
               },
               light: {
                  value: "{colors.fuchsia.500}",
               },
            },
            "utility-fuchsia-600": {
               dark: {
                  value: "{colors.fuchsia.400}",
               },
               light: {
                  value: "{colors.fuchsia.600}",
               },
            },
            "utility-fuchsia-700": {
               dark: {
                  value: "{colors.fuchsia.300}",
               },
               light: {
                  value: "{colors.fuchsia.700}",
               },
            },
            "utility-pink-50": {
               dark: {
                  value: "{colors.pink.950}",
               },
               light: {
                  value: "{colors.pink.50}",
               },
            },
            "utility-pink-100": {
               dark: {
                  value: "{colors.pink.900}",
               },
               light: {
                  value: "{colors.pink.100}",
               },
            },
            "utility-pink-200": {
               dark: {
                  value: "{colors.pink.800}",
               },
               light: {
                  value: "{colors.pink.200}",
               },
            },
            "utility-pink-300": {
               dark: {
                  value: "{colors.pink.700}",
               },
               light: {
                  value: "{colors.pink.300}",
               },
            },
            "utility-pink-400": {
               dark: {
                  value: "{colors.pink.600}",
               },
               light: {
                  value: "{colors.pink.400}",
               },
            },
            "utility-pink-500": {
               dark: {
                  value: "{colors.pink.500}",
               },
               light: {
                  value: "{colors.pink.500}",
               },
            },
            "utility-pink-600": {
               dark: {
                  value: "{colors.pink.400}",
               },
               light: {
                  value: "{colors.pink.600}",
               },
            },
            "utility-pink-700": {
               dark: {
                  value: "{colors.pink.300}",
               },
               light: {
                  value: "{colors.pink.700}",
               },
            },
            "utility-orange-dark-50": {
               dark: {
                  value: "{colors.orange-dark.950}",
               },
               light: {
                  value: "{colors.orange-dark.50}",
               },
            },
            "utility-orange-dark-100": {
               dark: {
                  value: "{colors.orange-dark.900}",
               },
               light: {
                  value: "{colors.orange-dark.100}",
               },
            },
            "utility-orange-dark-200": {
               dark: {
                  value: "{colors.orange-dark.800}",
               },
               light: {
                  value: "{colors.orange-dark.200}",
               },
            },
            "utility-orange-dark-300": {
               dark: {
                  value: "{colors.orange-dark.700}",
               },
               light: {
                  value: "{colors.orange-dark.300}",
               },
            },
            "utility-orange-dark-400": {
               dark: {
                  value: "{colors.orange-dark.600}",
               },
               light: {
                  value: "{colors.orange-dark.400}",
               },
            },
            "utility-orange-dark-500": {
               dark: {
                  value: "{colors.orange-dark.500}",
               },
               light: {
                  value: "{colors.orange-dark.500}",
               },
            },
            "utility-orange-dark-600": {
               dark: {
                  value: "{colors.orange-dark.400}",
               },
               light: {
                  value: "{colors.orange-dark.600}",
               },
            },
            "utility-orange-dark-700": {
               dark: {
                  value: "{colors.orange-dark.300}",
               },
               light: {
                  value: "{colors.orange-dark.700}",
               },
            },
            "utility-orange-50": {
               dark: {
                  value: "{colors.orange.950}",
               },
               light: {
                  value: "{colors.orange.50}",
               },
            },
            "utility-orange-100": {
               dark: {
                  value: "{colors.orange.900}",
               },
               light: {
                  value: "{colors.orange.100}",
               },
            },
            "utility-orange-200": {
               dark: {
                  value: "{colors.orange.800}",
               },
               light: {
                  value: "{colors.orange.200}",
               },
            },
            "utility-orange-300": {
               dark: {
                  value: "{colors.orange.700}",
               },
               light: {
                  value: "{colors.orange.300}",
               },
            },
            "utility-orange-400": {
               dark: {
                  value: "{colors.orange.600}",
               },
               light: {
                  value: "{colors.orange.400}",
               },
            },
            "utility-orange-500": {
               dark: {
                  value: "{colors.orange.500}",
               },
               light: {
                  value: "{colors.orange.500}",
               },
            },
            "utility-orange-600": {
               dark: {
                  value: "{colors.orange.400}",
               },
               light: {
                  value: "{colors.orange.600}",
               },
            },
            "utility-orange-700": {
               dark: {
                  value: "{colors.orange.300}",
               },
               light: {
                  value: "{colors.orange.700}",
               },
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
            "blue-dark": {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
               },
            },
            "blue-light": {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
               },
            },
            brand: {
               25: { value: "#FCFAFF" },
               50: { value: "#F9F5FF" },
               100: { value: "#F4EBFF" },
               200: { value: "#E9D7FE" },
               300: { value: "#D6BBFB" },
               400: { value: "#B692F6" },
               500: { value: "#9E77ED" },
               600: { value: "#7F56D9" },
               700: { value: "#6941C6" },
               800: { value: "#53389E" },
               900: { value: "#42307D" },
               950: { value: "#2C1C5F" },
            },
            cyan: {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
               },
            },
            error: {
               25: {
                  value: "#FFFBFA",
               },
               50: {
                  value: "#FEF3F2",
               },
               100: {
                  value: "#FEE4E2",
               },
               200: {
                  value: "#FECDCA",
               },
               300: {
                  value: "#FDA29B",
               },
               400: {
                  value: "#F97066",
               },
               500: {
                  value: "#F04438",
               },
               600: {
                  value: "#D92D20",
               },
               700: {
                  value: "#B42318",
               },
               800: {
                  value: "#912018",
               },
               900: {
                  value: "#7A271A",
               },
               950: {
                  value: "#55160C",
               },
            },
            fuchsia: {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
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
            "gray-blue": {
               25: {
                  value: "#FCFCFD",
               },
               50: {
                  value: "#F8F9FC",
               },
               100: {
                  value: "#EAECF5",
               },
               200: {
                  value: "#D5D9EB",
               },
               300: {
                  value: "#B3B8DB",
               },
               400: {
                  value: "#717BBC",
               },
               500: {
                  value: "#4E5BA6",
               },
               600: {
                  value: "#3E4784",
               },
               700: {
                  value: "#363F72",
               },
               800: {
                  value: "#293056",
               },
               900: {
                  value: "#101323",
               },
               950: {
                  value: "#0D0F1C",
               },
            },
            "gray-cool": {
               25: {
                  value: "#FCFCFD",
               },
               50: {
                  value: "#F9F9FB",
               },
               100: {
                  value: "#EFF1F5",
               },
               200: {
                  value: "#DCDFEA",
               },
               300: {
                  value: "#B9C0D4",
               },
               400: {
                  value: "#7D89B0",
               },
               500: {
                  value: "#5D6B98",
               },
               600: {
                  value: "#4A5578",
               },
               700: {
                  value: "#404968",
               },
               800: {
                  value: "#30374F",
               },
               900: {
                  value: "#111322",
               },
               950: {
                  value: "#0E101B",
               },
            },
            "gray-modern": {
               25: {
                  value: "#FCFCFD",
               },
               50: {
                  value: "#F8FAFC",
               },
               100: {
                  value: "#EEF2F6",
               },
               200: {
                  value: "#E3E8EF",
               },
               300: {
                  value: "#CDD5DF",
               },
               400: {
                  value: "#9AA4B2",
               },
               500: {
                  value: "#697586",
               },
               600: {
                  value: "#4B5565",
               },
               700: {
                  value: "#364152",
               },
               800: {
                  value: "#202939",
               },
               900: {
                  value: "#121926",
               },
               950: {
                  value: "#0D121C",
               },
            },
            "gray-neutral": {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
               },
            },
            "gray-iron": {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
               },
            },
            "gray-true": {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
               },
            },
            "gray-warm": {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
               },
            },
            green: {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
               },
            },
            "green-light": {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
               },
            },
            indigo: {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
               },
            },
            moss: {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
               },
            },
            orange: {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
               },
            },
            "orange-dark": {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
               },
            },
            pink: {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
               },
            },
            purple: {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
               },
            },
            rose: {
               25: {
                  value: "",
               },
               50: {
                  value: "",
               },
               100: {
                  value: "",
               },
               200: {
                  value: "",
               },
               300: {
                  value: "",
               },
               400: {
                  value: "",
               },
               500: {
                  value: "",
               },
               600: {
                  value: "",
               },
               700: {
                  value: "",
               },
               800: {
                  value: "",
               },
               900: {
                  value: "",
               },
               950: {
                  value: "",
               },
            },
            success: {
               25: {
                  value: "#F6FEF9",
               },
               50: {
                  value: "#ECFDF3",
               },
               100: {
                  value: "#DCFAE6",
               },
               200: {
                  value: "#A9EFC5",
               },
               300: {
                  value: "#75E0A7",
               },
               400: {
                  value: "#47CD89",
               },
               500: {
                  value: "#17B26A",
               },
               600: {
                  value: "#079455",
               },
               700: {
                  value: "#067647",
               },
               800: {
                  value: "#085D3A",
               },
               900: {
                  value: "#074D31",
               },
               950: {
                  value: "#053321",
               },
            },
            teal: {},
            violet: {},
            warning: {
               25: {
                  value: "#FFFCF5",
               },
               50: {
                  value: "#FFFAEB",
               },
               100: {
                  value: "#FEF0C7",
               },
               200: {
                  value: "#FEDF89",
               },
               300: {
                  value: "#FEC84B",
               },
               400: {
                  value: "#FDB022",
               },
               500: {
                  value: "#F79009",
               },
               600: {
                  value: "#DC6803",
               },
               700: {
                  value: "#B54708",
               },
               800: {
                  value: "#93370D",
               },
               900: {
                  value: "#7A2E0E",
               },
               950: {
                  value: "#4E1D09",
               },
            },
            white: {
               value: "#ffffff",
            },
            yellow: {},
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
         gradients: {
            brand: {
               1: {
                  value: "conic-gradient(from 259deg at 50% 50%, #7F56D9 0deg, rgba(127, 86, 217, 0.00) 360deg)",
               },
               2: {
                  value: "linear-gradient(90deg, #7F56D9 0%, #9E77ED 100%)",
               },
               3: {
                  value: "linear-gradient(45deg, #6941C6 0%, #7F56D9 100%)",
               },
               4: {
                  value: "linear-gradient(45deg, #53389E 0%, #7F56D9 100%)",
               },
               5: {
                  value: "linear-gradient(63deg, #53389E 16.72%, #7F56D9 83.39%)",
               },
               6: {
                  value: "linear-gradient(27deg, #53389E 8.33%, #6941C6 91.67%)",
               },
               7: {
                  value: "linear-gradient(45deg, #42307D 0%, #7F56D9 100%)",
               },
            },
            "color-linear": {
               1: { value: "" },
               2: { value: "" },
               3: { value: "" },
               4: { value: "" },
               5: { value: "" },
               6: { value: "" },
               7: { value: "" },
               8: { value: "" },
               9: { value: "" },
               10: { value: "" },
               11: { value: "" },
               12: { value: "" },
               13: { value: "" },
               14: { value: "" },
               15: { value: "" },
               16: { value: "" },
               17: { value: "" },
               18: { value: "" },
               19: { value: "" },
               20: { value: "" },
               21: { value: "" },
               22: { value: "" },
               23: { value: "" },
               24: { value: "" },
               25: { value: "" },
               26: { value: "" },
               27: { value: "" },
               28: { value: "" },
               29: { value: "" },
               30: { value: "" },
               31: { value: "" },
               32: { value: "" },
               33: { value: "" },
               34: { value: "" },
               35: { value: "" },
               36: { value: "" },
               37: { value: "" },
               38: { value: "" },
               39: { value: "" },
               40: { value: "" },
               41: { value: "" },
               42: { value: "" },
               43: { value: "" },
               44: { value: "" },
               45: { value: "" },
               46: { value: "" },
               47: { value: "" },
               48: { value: "" },
               49: { value: "" },
               50: { value: "" },
               51: { value: "" },
               52: { value: "" },
               53: { value: "" },
               54: { value: "" },
               55: { value: "" },
               56: { value: "" },
               57: { value: "" },
               58: { value: "" },
               59: { value: "" },
               60: { value: "" },
               61: { value: "" },
               62: { value: "" },
               63: { value: "" },
               64: { value: "" },
               65: { value: "" },
               66: { value: "" },
               67: { value: "" },
               68: { value: "" },
               69: { value: "" },
               70: { value: "" },
               71: { value: "" },
               72: { value: "" },
               73: { value: "" },
               74: { value: "" },
               75: { value: "" },
               76: { value: "" },
               77: { value: "" },
               78: { value: "" },
               79: { value: "" },
               80: { value: "" },
               81: { value: "" },
               82: { value: "" },
               83: { value: "" },
               84: { value: "" },
               85: { value: "" },
               86: { value: "" },
               87: { value: "" },
               88: { value: "" },
               89: { value: "" },
               90: { value: "" },
               91: { value: "" },
            },
            gray: {
               1: {
                  value: "conic-gradient(from 259deg at 50% 50%, #475467 0deg, rgba(71, 84, 103, 0.00) 360deg)",
               },
               2: {
                  value: "linear-gradient(90deg, #475467 0%, #667085 100%)",
               },
               3: {
                  value: "linear-gradient(45deg, #344054 0%, #475467 100%)",
               },
               4: {
                  value: "linear-gradient(45deg, #182230 0%, #475467 100%)",
               },
               5: {
                  value: "linear-gradient(63deg, #182230 16.72%, #475467 83.39%)",
               },
               6: {
                  value: "linear-gradient(27deg, #182230 8.33%, #344054 91.67%)",
               },
               7: {
                  value: "linear-gradient(45deg, #101828 0%, #475467 100%)",
               },
            },
            "gray-neutral-linear": {
               1: { value: "linear-gradient(180deg, #FFF 0%, #F3F5F7 100%)" },
               2: {
                  value: "linear-gradient(180deg, #F9FAFB 0%, #EDF0F3 100%)",
               },
               3: {
                  value: "linear-gradient(180deg, #F9FAFB 0%, #E7EBEF 100%)",
               },
               4: {
                  value: "linear-gradient(180deg, #F3F5F7 0%, #E0E5EB 100%)",
               },
               5: {
                  value: "linear-gradient(180deg, #EDF0F3 0%, #D4DBE2 100%)",
               },
               6: {
                  value: "linear-gradient(180deg, #E7EBEF 0%, #C8D1DA 100%)",
               },
               7: {
                  value: "linear-gradient(180deg, #E0E5EB 0%, #B6C2CE 100%)",
               },
            },
            "gray-true-linear": {
               1: {
                  value: "linear-gradient(180deg, #FFF 0%, #F5F5F5 100%)",
               },
               2: {
                  value: "linear-gradient(180deg, #FAFAFA 0%, #F0F0F0 100%)",
               },
               3: {
                  value: "linear-gradient(180deg, #FAFAFA 0%, #EBEBEB 100%)",
               },
               4: {
                  value: "linear-gradient(180deg, #F5F5F5 0%, #E5E5E5 100%)",
               },
               5: {
                  value: "linear-gradient(180deg, #F0F0F0 0%, #DBDBDB 100%)",
               },
               6: {
                  value: "linear-gradient(180deg, #EBEBEB 0%, #D1D1D1 100%)",
               },
               7: {
                  value: "linear-gradient(180deg, #E5E5E5 0%, #C2C2C2 100%)",
               },
            },
            mesh: {
               1: { value: "" },
               2: { value: "" },
               3: { value: "" },
               4: { value: "" },
               5: { value: "" },
               6: { value: "" },
               7: { value: "" },
               8: { value: "" },
               9: { value: "" },
               10: { value: "" },
               11: { value: "" },
               12: { value: "" },
               13: { value: "" },
               14: { value: "" },
               15: { value: "" },
               16: { value: "" },
               17: { value: "" },
               18: { value: "" },
               19: { value: "" },
               20: { value: "" },
               21: { value: "" },
               22: { value: "" },
               23: { value: "" },
               24: { value: "" },
               25: { value: "" },
               26: { value: "" },
               27: { value: "" },
               28: { value: "" },
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

         shadows: {
            "ring-brand": {
               value: "0px 0px 0px 4px rgba(158, 119, 237, 0.24)",
            },
            "ring-brand-shadow-xs": {
               value: "0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(158, 119, 237, 0.24)",
            },
            "ring-brand-shadow-sm": {
               value: "0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 0px 0px 4px rgba(158, 119, 237, 0.24)",
            },
            "ring-error": {
               value: "0px 0px 0px 4px rgba(240, 68, 56, 0.24)",
            },
            "ring-gray": {
               value: "0px 0px 0px 4px rgba(152, 162, 179, 0.14);",
            },
            "ring-gray-secondary": {
               value: "0px 0px 0px 4px rgba(152, 162, 179, 0.20)",
            },
            "ring-gray-shadow-xs": {
               value: "0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(152, 162, 179, 0.14)",
            },
            "ring-gray-shadow-sm": {
               value: "0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 0px 0px 4px rgba(152, 162, 179, 0.14)",
            },
            "ring-error-shadow-xs": {
               value: "0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(240, 68, 56, 0.24) ",
            },

            // box-shadow coordinates as follows [horizontal, vertical, blur, spread, color]
            // Figma design uses hex code for gray.900 and converting to rgba, if you change gray.900, update the rgba value
            "shadow-xs": {
               value: "0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.1)",
            },
            "shadow-sm": {
               value: "0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.1)",
            },
            "shadow-md": {
               value: "0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.1)",
            },
            "shadow-lg": {
               value: "0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)",
            },
            "shadow-xl": {
               value: "0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)",
            },
            "shadow-2xl": {
               value: "0px 24px 48px -12px rgba(16, 24, 40, 0.18)",
            },
            "shadow-3xl": {
               value: "0px 32px 64px -12px rgba(16, 24, 40, 0.14)",
            },
         },
         sizes: {
            "container-padding-mobile": {
               value: "1rem",
            },
            "container-padding-desktop": {
               value: "2rem",
            },
            "container-max-width-desktop": {
               value: "80rem",
            },
            "paragraph-max-width": {
               value: "45rem",
            },
            "width-xxs": { value: "20rem" },
            "width-xs": { value: "24rem" },
            "width-sm": { value: "30rem" },
            "width-md": { value: "35rem" },
            "width-lg": { value: "40rem" },
            "width-xl": { value: "48rem" },
            "width-2xl": { value: "64rem" },
            "width-3xl": { value: "80rem" },
            "width-4xl": { value: "90rem" },
            "width-5xl": { value: "100rem" },
            "width-6xl": { value: "120rem" },
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
});
