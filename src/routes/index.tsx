import { FormNewGame } from "@baseball-simulator/components/form";
import { Button } from "@baseball-simulator/components/ui";
import { generalStore } from "@baseball-simulator/services/generalStore";
import { Divider } from "@baseball-simulator/styled-system/jsx";
import DbClient from "@baseball-simulator/utils/db/DbClient";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
   component: () => {
      const [dbList, setDbList] = useState<IDBDatabaseInfo[] | null>(null);

      useEffect(() => {
         const callAsync = async () => {
            const dbList = await indexedDB.databases();

            console.log("dbList", dbList);

            setDbList(dbList);
         };
         callAsync();
      }, []);

      return (
         <div>
            <div>
               <h1>Baseball Simulator</h1>
            </div>
            <Divider my="3" />
            <div>
               <div>Database List</div>
               <ul>
                  {dbList?.map((db) => (
                     <Button
                        onClick={async () => {
                           if (!db.name) {
                              throw new Error("db.name is not defined");
                           }
                           const dbClient = new DbClient({
                              name: db.name,
                           });

                           await dbClient.init();

                           generalStore.setState((state) => {
                              return {
                                 ...state,
                                 dbClient,
                              };
                           });
                        }}
                        key={db.name}
                     >
                        {db.name}
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
