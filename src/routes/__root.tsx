import {
   ConditionalWrapper,
   DashboardWrapper,
} from "@baseball-simulator/components/general";
import { generalStore } from "@baseball-simulator/services/generalStore";
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

const nonGameplayRoutes = [
   // "/",
   "/about",
];

const Root = () => {
   const { dbClient, colorMode, theme } = useStore(generalStore);
   const router = useRouterState();
   const matches = useMatches();
   const match = matches?.[0] || null;

   const isNotFoundRoute = match?.globalNotFound;

   return (
      <TinybaseProvider store={dbClient.store as ProviderProps["store"]}>
         <StoreInspector position="right" open={false} />
         <div data-theme={theme} data-color-mode={colorMode}>
            <ConditionalWrapper
               children={<Outlet />}
               condition={
                  !isNotFoundRoute &&
                  !nonGameplayRoutes.includes(router.location.pathname) &&
                  Boolean(dbClient)
               }
               wrapper={(children) => (
                  <DashboardWrapper>{children}</DashboardWrapper>
               )}
            />
            <TanStackRouterDevtools />
         </div>
      </TinybaseProvider>
   );
};

export const Route = createRootRoute({
   component: () => <Root />,
});
