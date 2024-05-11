import "./main.css";
import { generalStore } from "@/services/generalStore";
import DbClient from "@/utils/db/DbClient";
import "@fontsource-variable/inter";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Page404 } from "./components/general";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
   defaultPreload: "intent",
   defaultNotFoundComponent: () => {
      return <Page404 />;
   },
   routeTree,
});

declare module "@tanstack/react-router" {
   interface Register {
      router: typeof router;
   }
}

const rootElement = document.getElementById("app");

if (!rootElement) {
   throw new Error("No root element found");
}

if (!rootElement.innerHTML) {
   (async () => {
      const indexedDbs = await indexedDB.databases();
      const gameNames = indexedDbs.map((db) => {
         if (!db.name) {
            throw new Error("db.name is not defined");
         }

         return db.name;
      });

      let dbClient: DbClient | null = null;

      if (gameNames.length === 0) {
         dbClient = new DbClient({ name: "default" });
         await dbClient.init();
      } else {
         dbClient = new DbClient({ name: gameNames[0] });
         await dbClient.init();
      }

      generalStore.setState((state) => {
         return {
            ...state,
            dbClient,
            gameNames,
         };
      });

      const root = ReactDOM.createRoot(rootElement);

      root.render(
         <StrictMode>
            <Suspense fallback={<> </>}>
               <RouterProvider router={router} />
            </Suspense>
         </StrictMode>,
      );
   })();
}
