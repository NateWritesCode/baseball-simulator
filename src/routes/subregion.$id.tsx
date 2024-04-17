import { generalStore } from "@baseball-simulator/services/generalStore";
import {
   createFileRoute,
   redirect,
   useLoaderData,
} from "@tanstack/react-router";

const Subregion = () => {
   const { subregion } = useLoaderData({ from: "/subregion/$id" });

   return <div>{subregion.name}</div>;
};

export const Route = createFileRoute("/subregion/$id")({
   loader: ({ params }) => {
      if (!generalStore.state.dbClient) {
         throw redirect({
            to: "/",
         });
      }
      return generalStore.state.dbClient.subregion({ id: params.id });
   },
   component: Subregion,
});
