import { Button } from "@/components/ui";
import { generalStore } from "@/services/generalStore";
import { useStore } from "@tanstack/react-store";
import { useState } from "react";

const getCurrentColorMode = () => {
   const element = document.querySelector("[data-color-mode]");
   const currentColorMode = element?.getAttribute("data-color-mode");

   if (currentColorMode === "dark") {
      return "dark";
   }

   return "light";
};

const DarkModeToggle = () => {
   const { colorMode } = useStore(generalStore);

   return (
      <Button
         onClick={() =>
            generalStore.setState((state) => ({
               ...state,
               colorMode: state.colorMode === "dark" ? "light" : "dark",
            }))
         }
         bg={colorMode === "dark" ? "gray.800" : "gray.200"}
         color={colorMode === "dark" ? "gray.200" : "gray.800"}
      >
         {colorMode === "dark" ? "Light" : "Dark"}
      </Button>
   );
   // const [colorMode, setColorMode] = useState<"light" | "dark">(
   //    getCurrentColorMode(),
   // );

   // return (
   //    <>
   //       Dark Mode:{" "}
   //       <Button
   //          hierarchy="secondary"
   //          onClick={() => {
   //             const newColorMode = colorMode === "dark" ? "light" : "dark";
   //             document.documentElement.setAttribute(
   //                "data-color-mode",
   //                newColorMode,
   //             );
   //             setColorMode(newColorMode);
   //          }}
   //       >
   //          {colorMode === "dark" ? "Light" : "Dark"}
   //       </Button>
   //    </>
   // );
};

export default DarkModeToggle;
