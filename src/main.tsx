import Error404 from "@baseball-simulator/components/general/Error404";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import "./main.css";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
   defaultNotFoundComponent: () => {
      return <Error404 />;
   },
   routeTree,
   defaultPreload: "intent",
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
   const root = ReactDOM.createRoot(rootElement);
   root.render(<RouterProvider router={router} />);
}
