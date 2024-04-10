import { dbClient } from "@baseball-simulator/services/db";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

const Subregion = () => {
   const { subregion } = useLoaderData({ from: "/subregion/$id" });

   return <div>{subregion.name}</div>;
};

export const Route = createFileRoute("/subregion/$id")({
   loader: ({ params }) => {
      return dbClient.subregion({ id: params.id });
   },
   component: Subregion,
});
