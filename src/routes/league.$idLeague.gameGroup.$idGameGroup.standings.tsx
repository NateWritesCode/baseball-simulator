import { generalStore } from "@/services/generalStore";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
   "/league/$idLeague/gameGroup/$idGameGroup/standings",
)({
   loader: ({ params }) => {
      if (!generalStore.state.dbClient) {
         throw redirect({
            to: "/",
         });
      }

      return generalStore.state.dbClient.leagueGameGroupStandings({
         idLeague: params.idLeague,
         idGameGroup: params.idGameGroup,
      });
   },

   component: () => <div>Hello /league/$id/standings!</div>,
});
