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
            stroke="white"
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
      borderRadius: "radius-md",
      boxShadow: "shadow-xs",
      cursor: "pointer",
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
            background: "brand.600",
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

// interface IProps extends TType {
//    leftIcon?: React.ReactNode;
//    rightIcon?: React.ReactNode;
// }

// const MyButton: IProps = (props) => {
//    return <>{props.leftIcon}{props.children}</>;
// };

// export default MyButton;
