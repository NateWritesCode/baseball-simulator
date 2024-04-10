import { Navbar } from "@baseball-simulator/components/general";
import { dbStore } from "@baseball-simulator/services/db";
import { generalStore } from "@baseball-simulator/services/generalStore";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import {
   type ProviderProps,
   Provider as TinybaseProvider,
} from "tinybase/debug/ui-react";
import { StoreInspector } from "tinybase/debug/ui-react-dom";

const Root = () => {
   const { colorMode, theme } = useStore(generalStore);

   return (
      <TinybaseProvider store={dbStore as ProviderProps["store"]}>
         <StoreInspector position="right" open={false} />
         <div data-theme={theme} data-color-mode={colorMode}>
            <Navbar />
            <Outlet />
            <TanStackRouterDevtools />
         </div>
      </TinybaseProvider>
   );
};

export const Route = createRootRoute({
   component: () => <Root />,
});
