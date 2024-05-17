import { Button } from "@/components/ui";
import { Accordion } from "@ark-ui/react/accordion";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Box, Flex } from "styled-system/jsx";

const DashboardSideNav = () => {
   return (
      <Box>
         <DashboardSideNavAccordion
            childElements={[
               <DashboardSideNavDirectLink
                  displayText="Home"
                  key="home"
                  url="/league/major-league-baseball"
               />,
               <DashboardSideNavDirectLink
                  displayText="Standings"
                  key="standings"
                  url="/league/major-league-baseball/gameGroup/regular-season-2011/standings"
               />,
            ]}
            displayText="Major League Baseball"
         />
      </Box>
   );
};

export default DashboardSideNav;

const DashboardSideNavDirectLink = ({
   displayText,
   url,
}: { displayText: string; url: string }) => {
   const navigate = useNavigate();
   return (
      <Button
         display="flex"
         justifyContent="flex-start"
         gap="spacing-lg"
         px="spacing-sm"
         py="spacing-sm"
         borderStyle="none"
         w="100%"
         _active={{
            transform: "none",
         }}
         borderRadius={"radius-none"}
         colorPalette={{
            _light: "black",
            _dark: "black",
         }}
         iconLeading={
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               fill="none"
            >
               <path
                  d="M8 17H16M11.0177 2.764L4.23539 8.03912C3.78202 8.39175 3.55534 8.56806 3.39203 8.78886C3.24737 8.98444 3.1396 9.20478 3.07403 9.43905C3 9.70352 3 9.9907 3 10.5651V17.8C3 18.9201 3 19.4801 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4801 21 18.9201 21 17.8V10.5651C21 9.9907 21 9.70352 20.926 9.43905C20.8604 9.20478 20.7526 8.98444 20.608 8.78886C20.4447 8.56806 20.218 8.39175 19.7646 8.03913L12.9823 2.764C12.631 2.49075 12.4553 2.35412 12.2613 2.3016C12.0902 2.25526 11.9098 2.25526 11.7387 2.3016C11.5447 2.35412 11.369 2.49075 11.0177 2.764Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
               />
            </svg>
         }
         onClick={() => {
            navigate({ to: url });
         }}
      >
         <Box>{displayText}</Box>
      </Button>
   );
};

const DashboardSideNavAccordion = ({
   childElements,
   displayText,
}: {
   childElements: ReturnType<typeof DashboardSideNavDirectLink>[];
   displayText: string;
}) => {
   const [activeValues, setActiveValues] = useState<string[]>([]);
   return (
      <Accordion.Root
         onValueChange={({ value }) => {
            setActiveValues(value);
         }}
         collapsible
      >
         <Accordion.Item value={displayText}>
            <Accordion.ItemTrigger
               style={{
                  cursor: "pointer",
                  width: "100%",
               }}
            >
               <Flex
                  px="spacing-lg"
                  py="spacing-md"
                  alignItems="center"
                  gap="spacing-md"
                  flex="1 0 0"
                  alignSelf="stretch"
                  borderRadius={"radius-sm"}
                  w="100%"
               >
                  <Flex alignItems="center" gap="spacing-lg" flex="1 0 0">
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
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                           />
                        </svg>
                     </Box>
                     <Box textStyle={"text.md.semibold"}>{displayText}</Box>
                  </Flex>

                  <Box color="white">
                     <Accordion.ItemIndicator>
                        {activeValues.length > 0 ? (
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                           >
                              <path
                                 d="M5 12.5L10 7.5L15 12.5"
                                 stroke="currentColor"
                                 strokeWidth="1.66667"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              />
                           </svg>
                        ) : (
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                           >
                              <path
                                 d="M5 7.5L10 12.5L15 7.5"
                                 stroke="currentColor"
                                 strokeWidth="1.66667"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              />
                           </svg>
                        )}
                     </Accordion.ItemIndicator>
                  </Box>

                  {/* <Flex alignItems="center" gap="spacing-lg" flex="1 0 0">


                        </Flex> */}
               </Flex>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
               {/* biome-ignore lint/correctness/useJsxKeyInIterable: <explanation> */}
               {childElements.map((childElement) => childElement)}
            </Accordion.ItemContent>
         </Accordion.Item>
      </Accordion.Root>
   );
};
