import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
   component: () => {
      return (
         <div>
            <h1>Sports Planet</h1>
         </div>
      );
   },
});
