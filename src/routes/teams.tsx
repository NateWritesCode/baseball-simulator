import Pagination from "@/components/general/Pagination";
import { generalStore } from "@/services/generalStore";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "@/utils/constants/cDb";
import {
   Link,
   createFileRoute,
   redirect,
   useLoaderData,
   useSearch,
} from "@tanstack/react-router";
import { Container } from "styled-system/jsx";
import { number, object, optional, parse } from "valibot";

const Teams = () => {
   const { numTotal, teams } = useLoaderData({ from: "/teams" });
   const searchParams = useSearch({ from: "/teams" });
   const { limit, offset } = searchParams;

   return (
      <Container maxW="4xl">
         {teams.map((team) => {
            return (
               <div key={team.id}>
                  <Link
                     to={"/team/$id"}
                     params={{ id: team.id }}
                     style={{ textDecoration: "underline" }}
                  >
                     {team.name}
                  </Link>
               </div>
            );
         })}
         <Pagination
            limit={limit}
            numTotal={numTotal}
            offset={offset}
            to="/subregions"
         />
      </Container>
   );
};

export const Route = createFileRoute("/teams")({
   validateSearch: (search?: { limit?: number; offset?: number }) => {
      return {
         limit: search?.limit,
         offset: search?.offset,
      };
   },
   loaderDeps: ({ search }) => {
      const { limit, offset } = parse(
         object({
            limit: optional(number(), DEFAULT_LIMIT),
            offset: optional(number(), DEFAULT_OFFSET),
         }),
         search,
      );

      return { limit, offset };
   },
   loader: ({ deps: { limit, offset } }) => {
      if (!generalStore.state.dbClient) {
         throw redirect({
            to: "/",
         });
      }

      return generalStore.state.dbClient.teams({ limit, offset });
   },
   component: Teams,
});

export default Teams;
