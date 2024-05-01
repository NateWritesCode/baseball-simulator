import { createFileRoute } from "@tanstack/react-router";
// import { Box } from "styled-system/jsx";

// const PersonGenerator = () => {
//    return (
//       <Box height="500px">
//          <Box height="100%">Person Generator goes here</Box>
//       </Box>
//    );
// };

// export default PersonGenerator;

// export const Route = createFileRoute("/person-generator")({
//    component: () => <PersonGenerator />,
// });

const PersonGenerator = () => {
   return <div>PersonGenerator</div>;
};

export default PersonGenerator;

export const Route = createFileRoute("/person-generator")({
   component: () => <PersonGenerator />,
});
