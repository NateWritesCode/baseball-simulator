import { Accordion } from "@ark-ui/react/accordion";
import { Box, Flex } from "styled-system/jsx";

const NavItem = () => {
   return (
      <Accordion.Root defaultValue={["Home"]} multiple>
         {["Home", "Settings", "Views"].map((item) => (
            <Accordion.Item key={item} value={item}>
               <Accordion.ItemTrigger>
                  <Flex
                     px="spacing-lg"
                     py="spacing-md"
                     alignItems="center"
                     gap="spacing-md"
                     flex="1 0 0"
                     alignSelf="stretch"
                     borderRadius={"radius-sm"}
                     w="272"
                  >
                     <Flex alignItems="center" gap="spacing-lg" flex="1 0 0">
                        <Box h="10px" w="10px">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              fill="none"
                           >
                              <circle cx="5" cy="5" r="4" fill="#17B26A" />
                           </svg>
                        </Box>
                        <Box>
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                           >
                              <path
                                 d="M18 20V10M12 20V4M6 20V14"
                                 stroke="#667085"
                                 strokeWidth="2"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              />
                           </svg>
                        </Box>
                        <Box
                           color={{
                              _dark: "text-secondary.dark",
                              _light: "text-secondary.light",
                           }}
                           textStyle={"text.md.semibold"}
                        >
                           {item}
                        </Box>
                     </Flex>
                     <Flex
                        py="spacing-xxs"
                        px="spacing-md"
                        alignItems={"center"}
                        borderRadius="radius-full"
                        borderWidth="1px"
                        borderStyle={"solid"}
                        borderColor={{
                           _dark: "utility-gray-200.dark",
                           _light: "utility-gray-200.light",
                        }}
                        bg={{
                           _dark: "utility-gray-50.dark",
                           _light: "utility-gray-50.light",
                        }}
                     >
                        10
                     </Flex>

                     <Box color="white">
                        <Accordion.ItemIndicator>
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                           >
                              <path
                                 d="M5 7.5L10 12.5L15 7.5"
                                 stroke="#667085"
                                 stroke-width="1.66667"
                                 stroke-linecap="round"
                                 stroke-linejoin="round"
                              />
                           </svg>
                        </Accordion.ItemIndicator>
                     </Box>

                     {/* <Flex alignItems="center" gap="spacing-lg" flex="1 0 0">


                        </Flex> */}
                  </Flex>
               </Accordion.ItemTrigger>
               <Accordion.ItemContent>
                  {item} is a JavaScript library for building user interfaces.
               </Accordion.ItemContent>
            </Accordion.Item>
         ))}
      </Accordion.Root>
   );
};

export default NavItem;
