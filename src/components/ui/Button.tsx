import { cva } from "@baseball-simulator/styled-system/css";
import { styled } from "@baseball-simulator/styled-system/jsx";

const buttonStyle = cva({
   base: {
      bg: "gray.200",
      borderRadius: "md",
      color: "gray.800",
      paddingX: "2",
      cursor: "pointer",
      transition: "transform 0.2s",
      _active: {
         transform: "translateY(2px)",
      },
   },
   variants: {
      size: {
         small: {
            fontSize: "1rem",
         },
         large: {
            fontSize: "2rem",
         },
      },
   },
});

const Button = styled("button", buttonStyle);

export default Button;
