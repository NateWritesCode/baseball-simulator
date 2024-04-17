import { cva } from "@baseball-simulator/styled-system/css";
import { styled } from "@baseball-simulator/styled-system/jsx";

const inputStyle = cva({
   base: {
      bg: "white",
      borderRadius: "md",
      color: "gray.800",
      paddingX: "2",
      border: "1px solid #ddd",
   },
});

const Input = styled("input", inputStyle);

export default Input;
