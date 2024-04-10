import { dbClient } from "@baseball-simulator/services/db";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

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
      return dbClient.country({ id: params.id });
   },
   component: Country,
});
