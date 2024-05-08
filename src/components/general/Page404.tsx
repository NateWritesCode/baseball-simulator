import { Box, Flex } from "styled-system/jsx";
import { Button } from "../ui";

const DATA_ATTR = "PAGE-404";

const Error404 = () => {
   return (
      <Flex
         data-attr={`${DATA_ATTR}-CONTAINER`}
         alignItems="flex-start"
         alignSelf="stretch"
         bg={{ _light: "bg-primary.light", _dark: "bg-primary.dark" }}
         flexDirection={{
            xlDown: "column",
            xl: "row",
         }}
         gap={{
            xlDown: "spacing-7xl",
         }}
         minH={{
            xlDown: undefined,
            xl: "screen",
         }}
         px={{
            xlDown: "spacing-7xl",
            xl: undefined,
         }}
         py={{
            xlDown: "0px",
            xl: undefined,
         }}
         w={{
            xlDown: undefined,
            xl: "width-3xl",
         }}
      >
         <Flex
            data-attr={`${DATA_ATTR}-CONTAINER-A-INFO-AND-BUTTONS`}
            alignItems="center"
            alignSelf="stretch"
            flex="[1 0 0]"
            gap="spacing-7xl"
            justifyContent="center"
            px="spacing-9xl"
            py="spacing-none"
         >
            <Flex
               data-attr={`${DATA_ATTR}-CONTAINER-B-INFO-AND-BUTTONS`}
               alignItems="flex-start"
               flex="[1 0 0]"
               justifyContent="center"
               px="spacing-none"
               py="container-padding-xl"
            >
               <Flex
                  data-attr={`${DATA_ATTR}-CONTAINER-C-INFO-AND-BUTTONS`}
                  maxWidth="width-md"
                  flexDirection="column"
                  alignItems="flex-start"
                  gap="spacing-6xl"
                  flex="[1 0 0]"
               >
                  <Flex
                     data-attr={`${DATA_ATTR}-SECTION-HEADING-AND-TEXT`}
                     flexDirection="column"
                     alignItems="flex-start"
                     gap="spacing-3xl"
                     alignSelf="stretch"
                  >
                     <Box
                        data-attr={`${DATA_ATTR}-HEADING`}
                        alignSelf="stretch"
                        color={{
                           _light: "text-primary.light",
                           _dark: "text-primary.dark",
                        }}
                        // textStyle="display.xl.semibold"
                        textStyle={{
                           xl: "display.xl.semibold",
                           xlDown: "display.md.semibold",
                        }}
                     >
                        Page not found
                     </Box>
                     <Box
                        data-attr={`${DATA_ATTR}-TEXT`}
                        alignSelf="stretch"
                        maxWidth="width-sm"
                        color={{
                           _light: "text-tertiary.light",
                           _dark: "text-tertiary.dark",
                        }}
                        textStyle={{
                           xl: "text.xl.regular",
                           xlDown: "text.lg.regular",
                        }}
                     >
                        Sorry, the page you are looking for doesn't exist or has
                        been moved. Here are some helpful links:
                     </Box>
                  </Flex>
                  <Flex
                     data-attr={`${DATA_ATTR}-SECTION-BUTTONS`}
                     alignItems="flex-start"
                     gap="spacing-lg"
                     flexDirection={{
                        xlDown: "column-reverse",
                        xl: "row",
                     }}
                     alignSelf={{
                        xlDown: "stretch",
                        xl: undefined,
                     }}
                  >
                     <Button
                        data-attr={`${DATA_ATTR}-BUTTON-GO-BACK`}
                        alignSelf={{
                           xlDown: "stretch",
                           xl: undefined,
                        }}
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
                        onClick={() => {
                           if (typeof window === "undefined") {
                              return;
                           }

                           window.history.back();
                        }}
                     >
                        Go back
                     </Button>
                     <Button
                        data-attr={`${DATA_ATTR}-BUTTON-TAKE-ME-HOME`}
                        alignSelf={{
                           xlDown: "stretch",
                           xl: undefined,
                        }}
                        colorPalette="brand"
                        onClick={() => {
                           if (typeof window === "undefined") {
                              return;
                           }

                           window.location.href = "/";
                        }}
                     >
                        Take me home
                     </Button>
                  </Flex>
               </Flex>
            </Flex>
         </Flex>
         <Box
            data-attr={`${DATA_ATTR}CONTAINER-IMAGE`}
            alignItems={{
               xlDown: "flex-start",
               xl: undefined,
            }}
            alignSelf={"stretch"}
            display={{
               xlDown: "flex",
               xl: "flex",
            }}
            flex="1 0 0"
            px={{
               xlDown: "spacing-none",
               xl: undefined,
            }}
            py={{
               xlDown: "container-padding-sm",
               xl: undefined,
            }}
         >
            <Box
               data-attr={`${DATA_ATTR}-IMAGE`}
               background={
                  "url(/images/camera_girl.png) lightgray 50% / cover no-repeat"
               }
               flex="1 0 0"
               height={{
                  xlDown: "480px",
                  xl: undefined,
               }}
            />
         </Box>
      </Flex>
   );
};

export default Error404;
