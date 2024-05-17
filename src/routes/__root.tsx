import { generalStore } from "@/services/generalStore";
import { useMatches } from "@tanstack/react-router";
import {
   Outlet,
   createRootRoute,
   useRouterState,
} from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import {
   type ProviderProps,
   Provider as TinybaseProvider,
} from "tinybase/debug/ui-react";
import { StoreInspector } from "tinybase/debug/ui-react-dom";

const nonGameplayRoutes = ["/about"];

import { ConditionalWrapper, Page404 } from "@/components/general";
import Dashboard from "@/components/general/Dashboard";
import { Box } from "styled-system/jsx";

const Root = () => {
   const { dbClient, colorMode } = useStore(generalStore);
   const router = useRouterState();
   const matches = useMatches();
   const match = matches?.[0] || null;

   const isNotFoundRoute = match?.globalNotFound;

   console.log("colorMode", colorMode);

   return (
      <TinybaseProvider store={dbClient.store as ProviderProps["store"]}>
         <StoreInspector position="right" open={false} />
         <Box data-attr="ROOT-COLOR-MODE-WRAPPER" data-color-mode={colorMode}>
            <Box
               bg={{ _light: "bg-primary.light", _dark: "bg-primary.dark" }}
               color={{
                  _light: "text-primary.light",
                  _dark: "text-primary.dark",
               }}
               data-attr="ROOT-WRAPPER"
               minH="screen"
               textStyle={"text.md.regular"}
               maxH="screen"
            >
               <ConditionalWrapper
                  children={<Outlet />}
                  condition={
                     !isNotFoundRoute &&
                     !nonGameplayRoutes.includes(router.location.pathname) &&
                     Boolean(dbClient)
                  }
                  wrapper={(children) => <Dashboard>{children}</Dashboard>}
               />
               <TanStackRouterDevtools position="bottom-right" />
            </Box>
         </Box>
      </TinybaseProvider>
   );
};
//    <div data-theme={theme} data-color-mode={colorMode}>
//       <ConditionalWrapper
//          children={<Outlet />}
//          condition={
//             !isNotFoundRoute &&
//             !nonGameplayRoutes.includes(router.location.pathname) &&
//             Boolean(dbClient)
//          }
//          wrapper={(children) => (
//             <DashboardWrapper>{children}</DashboardWrapper>
//          )}
//       />
//       <TanStackRouterDevtools />
//    </div>
// </Box>

export const Route = createRootRoute({
   component: () => <Root />,
   notFoundComponent: () => <Page404 />,
});
