// import { FormNewGame } from "@/components/form";
// // import { Button } from "@/components/ui";
// import { generalStore } from "@/services/generalStore";
// import DbClient from "@/utils/db/DbClient";
// import { createFileRoute } from "@tanstack/react-router";
// import { useStore } from "@tanstack/react-store";
// // import { Divider } from "styled-system/jsx";

// import { Page404 } from "@/components/general";
import Dashboard from "@/components/general/Dashboard";
import { createFileRoute } from "@tanstack/react-router";
// import { css } from "styled-system/css";

// export const Route = createFileRoute("/")({
//    component: () => {
//       const gameNames = useStore(generalStore, (state) => state.gameNames);
//       return (
//          <div>
//             <div>
//                <h1>Baseball Simulator</h1>
//             </div>
//             {/* <Divider my="3" /> */}
//             <div>
//                <div>Database List</div>
//                {/* <ul>
//                   {gameNames?.map((gameName) => (
//                      <Button
//                         onClick={async () => {
//                            if (!gameName) {
//                               throw new Error("gameName is not defined");
//                            }
//                            const dbClient = new DbClient({
//                               name: gameName,
//                            });

//                            await dbClient.init();

//                            generalStore.setState((state) => {
//                               return {
//                                  ...state,
//                                  dbClient,
//                               };
//                            });
//                         }}
//                         key={gameName}
//                      >
//                         {gameName}
//                      </Button>
//                   ))}
//                </ul> */}
//             </div>
//             {/* <Divider my="3" /> */}
//             <div>
//                <div>New Game</div>
//                <FormNewGame />
//             </div>
//          </div>
//       );
//    },
// });

const Index = () => {
   return (
      <>
         <div>Hello</div>
      </>
   );
};

export const Route = createFileRoute("/")({
   component: () => <Dashboard />,
});
