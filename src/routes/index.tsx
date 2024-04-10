import { dbClient } from "@baseball-simulator/services/db";
import { Link, createFileRoute, useLoaderData } from "@tanstack/react-router";

const Index = () => {
   const { simulations, numTotal } = useLoaderData({ from: "/" });
   return (
      <div>
         Baseball Simulator
         <br />
         <Link to="/about" style={{ textDecoration: "underline" }}>
            About Page
         </Link>
         <br />
         <div>Simulations</div>
         <ol>
            {simulations.map((simulation) => (
               <li key={simulation.id}>
                  <Link
                     params={{ id: simulation.id }}
                     to={"/simulation/$id"}
                     style={{ textDecoration: "underline" }}
                  >
                     {simulation.name}
                  </Link>
               </li>
            ))}

            <li>Total: {numTotal}</li>
         </ol>
      </div>
   );
};

export const Route = createFileRoute("/")({
   loader: () => dbClient.simulations(),
   component: Index,
});
