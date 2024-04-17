import { generalStore } from "@baseball-simulator/services/generalStore";
import { Box, Container } from "@baseball-simulator/styled-system/jsx";
import { SimulatorAge } from "@baseball-simulator/utils/simulator";
import { createFileRoute } from "@tanstack/react-router";
import {
   AnimatedAxis,
   AnimatedGrid,
   AnimatedLineSeries,
   Tooltip,
   XYChart,
} from "@visx/xychart";
import { useEffect, useState } from "react";

const tickLabelOffset = 10;

const accessors = {
   xAccessor: (d: { x: number }) => Math.round(d.x / 365),
   yAccessor: (d: { y: number }) => {
      const totalInches = (d.y / 1000) * (8 * 12 - 10) + 10;
      return totalInches;
   },
};

const Test = () => {
   const [data, setData] = useState<{
      chartData: { x: number; y: number }[][];
   } | null>(null);

   useEffect(() => {
      if (!generalStore.state.dbClient) {
         return;
      }

      const { persons } = generalStore.state.dbClient.persons({
         limit: 10,
         offset: 0,
      });

      const date = generalStore.state.dbClient.store.getCell(
         "simulation",
         "simulation",
         "date",
      );

      if (!date) {
         return;
      }

      const chartData: { x: number; y: number }[][] = [];

      for (const person of persons) {
         const simulatorAge = new SimulatorAge({
            date,
            person,
         });

         const _chartData = simulatorAge.simulate();
         chartData.push(_chartData);
      }

      setData({ chartData });
   }, []);

   if (!data) {
      return <div>Loading...</div>;
   }

   console.log("data", data);

   return (
      <Container maxW="4xl" pt="10">
         {" "}
         <XYChart
            height={500}
            margin={{ left: 60, top: 35, bottom: 38, right: 27 }}
            xScale={{ type: "linear" }}
            yScale={{ type: "linear" }}
         >
            <AnimatedGrid
               columns={false}
               numTicks={4}
               lineStyle={{
                  stroke: "#e1e1e1",
                  strokeLinecap: "round",
                  strokeWidth: 1,
               }}
               strokeDasharray="0, 4"
            />
            <AnimatedAxis
               hideAxisLine
               hideTicks
               orientation="bottom"
               tickLabelProps={() => ({ dy: tickLabelOffset })}
               left={30}
               numTicks={10}
            />
            <AnimatedAxis
               hideAxisLine
               hideTicks
               orientation="left"
               numTicks={10}
               tickLabelProps={() => ({ dx: -10 })}
            />

            {data.chartData.map((chartData, i) => {
               const key = `${Math.random()}-${i}`;
               return (
                  <AnimatedLineSeries
                     stroke={(() => {
                        const r = Math.floor(Math.random() * 255);
                        const g = Math.floor(Math.random() * 255);
                        const b = Math.floor(Math.random() * 255);
                        return `rgb(${r},${g},${b})`;
                     })()}
                     key={key}
                     dataKey={key}
                     data={chartData}
                     {...accessors}
                  />
               );
            })}
            <Tooltip
               snapTooltipToDatumX
               snapTooltipToDatumY
               showSeriesGlyphs
               glyphStyle={{
                  fill: "#008561",
                  strokeWidth: 0,
               }}
               renderTooltip={({ tooltipData }) => {
                  return (
                     <Box>
                        {JSON.stringify(tooltipData)}
                        {/* {Object.entries(tooltipData.datumByKey).map(
                           (lineDataArray) => {
                              const [key, value] = lineDataArray;

                              return (
                                 <div className="row" key={key}>
                                    <div className="date">
                                       {format(
                                          accessors.xAccessor(value.datum),
                                          "MMM d",
                                       )}
                                    </div>
                                    <div className="value">
                                       <ColoredSquare color="#008561" />
                                       {accessors.yAccessor(value.datum)}
                                    </div>
                                 </div>
                              );
                           },
                        )} */}
                     </Box>
                  );
               }}
            />
         </XYChart>
      </Container>
   );
};

export const Route = createFileRoute("/test")({
   component: () => <Test />,
});
