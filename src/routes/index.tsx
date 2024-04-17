import { FormNewGame } from "@baseball-simulator/components/form";
import { Button } from "@baseball-simulator/components/ui";
import { generalStore } from "@baseball-simulator/services/generalStore";
import { Divider } from "@baseball-simulator/styled-system/jsx";
import DbClient from "@baseball-simulator/utils/db/DbClient";
import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";

export const Route = createFileRoute("/")({
   component: () => {
      const gameNames = useStore(generalStore, (state) => state.gameNames);
      return (
         <div>
            <div>
               <h1>Baseball Simulator</h1>
            </div>
            <Divider my="3" />
            <div>
               <div>Database List</div>
               <ul>
                  {gameNames?.map((gameName) => (
                     <Button
                        onClick={async () => {
                           if (!gameName) {
                              throw new Error("gameName is not defined");
                           }
                           const dbClient = new DbClient({
                              name: gameName,
                           });

                           await dbClient.init();

                           generalStore.setState((state) => {
                              return {
                                 ...state,
                                 dbClient,
                              };
                           });
                        }}
                        key={gameName}
                     >
                        {gameName}
                     </Button>
                  ))}
               </ul>
            </div>
            <Divider my="3" />
            <div>
               <div>New Game</div>
               <FormNewGame />
            </div>
         </div>
      );
   },
});
