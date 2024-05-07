import { Box, Flex } from "styled-system/jsx";
import { Button } from "../ui";

const Error404 = () => {
   return (
      <Flex
         alignItems="flex-start"
         bg="white"
         minH={[null, null, "[960px]"]}
         w={[null, null, "width-4xl"]}
      >
         <Flex
            alignItems="center"
            alignSelf="stretch"
            flex="[1 0 0]"
            gap="spacing-7xl"
            justifyContent="center"
            px="spacing-9xl"
            py="spacing-none"
         >
            <Flex
               alignItems="flex-start"
               flex="[1 0 0]"
               justifyContent="center"
               px="spacing-none"
               py="container-padding-desktop"
            >
               <Flex
                  maxWidth="width-md"
                  flexDirection="column"
                  alignItems="flex-start"
                  gap="spacing-6xl"
                  flex="[1 0 0]"
               >
                  <Flex
                     flexDirection="column"
                     alignItems="flex-start"
                     gap="spacing-3xl"
                     alignSelf="stretch"
                  >
                     <Box
                        alignSelf="stretch"
                        color="text-primary.light"
                        textStyle="display.xl.semibold"
                     >
                        Page not found
                     </Box>
                     <Box
                        alignSelf="stretch"
                        maxWidth="width-sm"
                        color="text-tertiary.light"
                        textStyle="text.xl.regular"
                     >
                        Sorry, the page you are looking for doesn't exist or has
                        been moved. Here are some helpful links:
                     </Box>
                  </Flex>
                  <Flex alignItems="flex-start" gap="spacing-lg">
                     <Button
                        colorPalette="gray.light"
                        hierarchy="secondary"
                        iconLeading={
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                           >
                              <path
                                 d="M15.8332 10.0001H4.1665M4.1665 10.0001L9.99984 15.8334M4.1665 10.0001L9.99984 4.16675"
                                 stroke="#344054"
                                 strokeWidth="1.66667"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              />
                           </svg>
                        }
                     >
                        Go back
                     </Button>
                     <Button colorPalette="brand">Take me home</Button>
                  </Flex>
               </Flex>
            </Flex>
         </Flex>
         <Box
            alignSelf="stretch"
            flex="[1 0 0]"
            background="[url(/images/camera_girl.png) lightgray 50% / cover no-repeat]"
         />
      </Flex>
   );
};

export default Error404;
