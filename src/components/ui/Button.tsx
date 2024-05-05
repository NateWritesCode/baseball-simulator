import type { ComponentProps, ReactNode } from "react";
import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";
import { StyledComponent } from "styled-system/jsx";

const button = cva({
   base: {
      alignItems: "center",
      borderRadius: "radius-md",
      boxShadow: "shadow-xs",
      display: "inline-flex",
      justifyContent: "center",
      _disabled: {},
      _focus: {},
   },
   variants: {
      hierarchy: {
         "link-gray": {},
         "link-color": {},
         primary: {
            bg: "brand.600",
            borderColor: "brand.600",
            borderStyle: "solid",
            borderWidth: "1px",
            color: "white",
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
         md: {},
         lg: {},
         xl: {},
         "2xl": {},
      },
   },
});

const StyledButton = styled("button", button, {
   dataAttr: true,
});

type TType = typeof StyledButton;

interface ButtonProps extends ComponentProps<TType> {
   leftIcon?: ReactNode;
   rightIcon?: ReactNode;
}

const Button = (props: ButtonProps) => {
   return <StyledButton>{props.children}</StyledButton>;
};

export default Button;

// interface IProps extends TType {
//    leftIcon?: React.ReactNode;
//    rightIcon?: React.ReactNode;
// }

// const MyButton: IProps = (props) => {
//    return <>{props.leftIcon}{props.children}</>;
// };

// export default MyButton;
