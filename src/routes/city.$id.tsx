import { generalStore } from "@baseball-simulator/services/generalStore";
import {
   createFileRoute,
   redirect,
   useLoaderData,
} from "@tanstack/react-router";

const City = () => {
   const { city } = useLoaderData({ from: "/city/$id" });

   return <div>{city.name}</div>;
};

export const Route = createFileRoute("/city/$id")({
   loader: ({ params }) => {
      if (!generalStore.state.dbClient) {
         throw redirect({
            to: "/",
         });
      }

      return generalStore.state.dbClient.city({ id: params.id });
   },
   component: City,
});
