import { Box } from "styled-system/jsx";
import { HStack } from "styled-system/jsx";
import { Button } from "../ui";

const Error404 = () => {
   return (
      <Box p="10">
         <HStack>
            <Button colorPalette="error" iconLeading iconTrailing size="sm">
               Button CTA
            </Button>
            <Button colorPalette="error" iconLeading iconTrailing size="md">
               Button CTA
            </Button>
            <Button colorPalette="error" iconLeading iconTrailing size="lg">
               Button CTA
            </Button>
            <Button colorPalette="error" iconLeading iconTrailing size="xl">
               Button CTA
            </Button>
            <Button colorPalette="error" iconLeading iconTrailing size="2xl">
               Button CTA
            </Button>
         </HStack>
      </Box>
   );
};

export default Error404;
