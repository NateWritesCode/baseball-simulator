import type { ComponentProps, ReactNode } from "react";
import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";
import { StyledComponent } from "styled-system/jsx";

const Placeholder = () => {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
      >
         <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
         />
      </svg>
   );
};

const button = cva({
   base: {
      alignItems: "center",
      appearance: "none",
      borderRadius: "radius-md",
      // boxShadow: "[0px 1px 16px 0px var(--colors-color-palette-950)]",
      boxShadow: "shadow-xs",
      colorPalette: "brand",
      cursor: "pointer",
      display: "inline-flex",
      justifyContent: "center",
      minWidth: "[0]",
      outline: "none",
      userSelect: "none",
      verticalAlign: "middle",
      whiteSpace: "nowrap",
      _disabled: {
         cursor: "not-allowed",
         pointerEvents: "none",
      },
   },
   defaultVariants: {
      hierarchy: "primary",
      size: "sm",
   },
   variants: {
      hierarchy: {
         "link-gray": {},
         "link-color": {},
         primary: {
            bg: "colorPalette.600",
            borderColor: "colorPalette.600",
            borderStyle: "solid",
            borderWidth: "1px",
            color: "white",
            _disabled: {
               bg: "gray.light.100",
               borderColor: "gray.light.200",
               color: "gray.light.400",
               _hover: {
                  bg: "gray.light.100",
                  borderColor: "gray.light.200",
                  color: "gray.light.400",
               },
            },
            _focus: {
               boxShadow:
                  "[0px 1px 2px 0px color-mix(in srgb, var(--colors-gray-light-900) 5%, transparent), 0px 0px 0px 4px color-mix(in srgb, var(--colors-color-palette-500) 24%, transparent)]",
            },
            _hover: {
               bg: "colorPalette.700",
               borderColor: "colorPalette.700",
            },
         },
         "secondary-color": {},
         "secondary-gray": {},
         "tertiary-color": {},
         "tertiary-gray": {},
      },
      size: {
         sm: {
            gap: "spacing-xs",
            px: "spacing-md",
            py: "spacing-lg",
            textStyle: "text.sm.semibold",
         },
         md: {
            gap: "spacing-xs",
            px: "[10px]",
            py: "[14px]",
            textStyle: "text.sm.semibold",
         },
         lg: {
            gap: "spacing-sm",
            px: "[10px]",
            py: "spacing-xl",
            textStyle: "text.md.semibold",
         },
         xl: {
            gap: "spacing-sm",
            px: "spacing-lg",
            py: "[18px]",
            textStyle: "text.md.semibold",
         },
         "2xl": {
            gap: "[10px]",
            px: "spacing-xl",
            py: "[22px]",
            textStyle: "text.lg.semibold",
         },
      },
   },
});

const StyledButton = styled("button", button, {
   dataAttr: true,
});

type TType = typeof StyledButton;

interface ButtonProps extends ComponentProps<TType> {
   iconLeading?: boolean;
   iconTrailing?: boolean;
}

const Button = (props: ButtonProps) => {
   const { children, iconLeading, iconTrailing, ...rest } = props;
   return (
      <StyledButton {...rest}>
         {iconLeading && <Placeholder />}
         {props.children}
         {iconTrailing && <Placeholder />}
      </StyledButton>
   );
};

export default Button;
