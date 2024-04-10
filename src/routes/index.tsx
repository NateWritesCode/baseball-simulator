import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
   component: () => {
      return (
         <div>
            <h1>Baseball Simulator</h1>
         </div>
      );
   },
});
