import { dbClient } from "@baseball-simulator/services/db";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

const Simulation = () => {
   const { simulation } = useLoaderData({ from: "/simulation/$idSimulation" });

   return <div>{simulation.name}</div>;
};

export const Route = createFileRoute("/simulation/$idSimulation")({
   loader: ({ params }) => {
      return { simulation: { name: "Simulation Name" } };
      //   return dbClient.simulation({ id: params.id });
   },
   component: Simulation,
});
