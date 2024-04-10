import { Box, Flex } from "@baseball-simulator/styled-system/jsx";
import { Link } from "@tanstack/react-router";
import { PlanetDate, SimulateButton } from "../planet";
import ColorModePicker from "./ColorModePicker";

const Navbar = () => {
   return (
      <>
         <Flex justifyContent={"space-between"}>
            <Flex>
               <Box mx="2">
                  <Link to="/">Home</Link>{" "}
               </Box>
               <Box mx="2">
                  <Link to="/persons">Persons</Link>{" "}
               </Box>
               <Box mx="2">
                  <Link to="/cities">Cities</Link>{" "}
               </Box>
               <Box mx="2">
                  <Link to="/subregions">Subregions</Link>{" "}
               </Box>
               <Box mx="2">
                  <Link to="/countries">Countries</Link>{" "}
               </Box>
               <Box mx="2">
                  <Link to="/person-generator">Person Generator</Link>{" "}
               </Box>
            </Flex>
            <Flex>
               <Box mx="2">
                  <PlanetDate />
               </Box>
               <Box mx="2">
                  <SimulateButton />
               </Box>
               <Box mx="2">
                  <ColorModePicker />
               </Box>
            </Flex>
         </Flex>
         <hr />
      </>
   );
};

export default Navbar;
