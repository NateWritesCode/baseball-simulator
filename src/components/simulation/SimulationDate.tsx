import { useCell } from "tinybase/debug/ui-react";

const SimulationDate = () => {
   const date = useCell("simulation", "simulation", "date");

   return <div>{date}</div>;
};

export default SimulationDate;
