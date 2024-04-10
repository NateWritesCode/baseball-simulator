import { dbClient } from "@baseball-simulator/services/db";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

const City = () => {
   const { city } = useLoaderData({ from: "/city/$id" });

   return <div>{city.name}</div>;
};

export const Route = createFileRoute("/city/$id")({
   loader: ({ params }) => {
      return dbClient.city({ id: params.id });
   },
   component: City,
});
