import type { ComponentProps, ReactNode } from "react";
import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

const button = cva({
   base: {
      alignItems: "center",
      appearance: "none",
      borderRadius: "radius-md",
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
   compoundVariants: [{ hierarchy: "link", css: { px: "0", py: "0" } }],
   defaultVariants: {
      hierarchy: "primary",
      size: "sm",
   },
   variants: {
      hierarchy: {
         primary: {
            bg: "colorPalette.600",
            borderColor: "colorPalette.600",
            borderStyle: "solid",
            borderWidth: "1px",
            boxShadow: "shadow-xs",
            color: "white",
            _disabled: {
               bg: "gray.light.100",
               borderColor: "gray.light.200",
               color: "gray.light.400",
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
         secondary: {
            bg: "white",
            borderColor: "colorPalette.300",
            borderStyle: "solid",
            borderWidth: "1px",
            boxShadow: "shadow-xs",
            color: "colorPalette.700",
            _disabled: {
               bg: "white",
               borderColor: "gray.light.200",
               color: "gray.light.400",
            },
            _focus: {
               boxShadow:
                  "[0px 1px 2px 0px color-mix(in srgb, var(--colors-gray-light-900) 5%, transparent), 0px 0px 0px 4px color-mix(in srgb, var(--colors-color-palette-500) 24%, transparent)]",
            },
            _hover: {
               bg: "colorPalette.50",
               color: "colorPalette.800",
            },
         },
         tertiary: {
            color: "colorPalette.600",
            _disabled: {
               color: "gray.light.400",
            },
            _focus: {},
            _hover: {
               bg: "colorPalette.50",
               color: "colorPalette.700",
            },
         },
         link: {
            color: "colorPalette.600",
            _disabled: {
               color: "gray.light.400",
            },
            _focus: {},
            _hover: {
               color: "colorPalette.700",
            },
         },
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
   iconLeading?: ReactNode;
   iconTrailing?: ReactNode;
}

const Button = (props: ButtonProps) => {
   const { children, iconLeading, iconTrailing, ...rest } = props;
   return (
      <StyledButton {...rest}>
         {iconLeading && iconLeading}
         {props.children}
         {iconTrailing && iconTrailing}
      </StyledButton>
   );
};

export default Button;
