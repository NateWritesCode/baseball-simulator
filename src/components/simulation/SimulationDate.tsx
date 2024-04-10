import { useCell } from "tinybase/debug/ui-react";

const SimulationDate = () => {
   const date = useCell("simulations", "simulation", "date");

   console.log('date', date);

   return <div>{date}</div>;
};

export default SimulationDate;
