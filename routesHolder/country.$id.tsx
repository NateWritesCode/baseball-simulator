import { generalStore } from "@/services/generalStore";
import {
   createFileRoute,
   redirect,
   useLoaderData,
} from "@tanstack/react-router";

const Country = () => {
   const { country } = useLoaderData({ from: "/country/$id" });

   return (
      <div>
         {country.id}, {country.name}, {country.code}
      </div>
   );
};

export const Route = createFileRoute("/country/$id")({
   loader: ({ params }) => {
      if (!generalStore.state.dbClient) {
         throw redirect({
            to: "/",
         });
      }

      return generalStore.state.dbClient.country({ id: params.id });
   },
   component: Country,
});
