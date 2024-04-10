import { useCell } from "tinybase/debug/ui-react";

const PlanetDate = () => {
   const date = useCell("planets", "planet", "date");

   return <div>{date}</div>;
};

export default PlanetDate;
