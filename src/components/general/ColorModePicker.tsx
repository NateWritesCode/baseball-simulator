// import { Button } from "@/components/ui";
// import { generalStore } from "@/services/generalStore";
// import { useStore } from "@tanstack/react-store";

// const ColorModePicker = () => {
//    const { colorMode } = useStore(generalStore);

//    return (
//       <Button
//          onClick={() =>
//             generalStore.setState((state) => ({
//                ...state,
//                colorMode: state.colorMode === "dark" ? "light" : "dark",
//             }))
//          }
//          bg={colorMode === "dark" ? "gray.800" : "gray.200"}
//          color={colorMode === "dark" ? "gray.200" : "gray.800"}
//       >
//          {colorMode === "dark" ? "Light" : "Dark"}
//       </Button>
//    );
// };

// export default ColorModePicker;

const ColorModePicker = () => {
   return <div>ColorModePicker</div>;
};

export default ColorModePicker;
