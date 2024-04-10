import { Box } from "@baseball-simulator/styled-system/jsx";
import { createFileRoute } from "@tanstack/react-router";

const PersonGenerator = () => {
   return (
      <Box height="500px">
         <Box height="100%">Person Generator goes here</Box>
      </Box>
   );
};

export default PersonGenerator;

export const Route = createFileRoute("/person-generator")({
   component: () => <PersonGenerator />,
});
