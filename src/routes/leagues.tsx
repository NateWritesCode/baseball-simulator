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

const Leagues = () => {
   const { numTotal, leagues } = useLoaderData({ from: "/leagues" });
   const searchParams = useSearch({ from: "/leagues" });
   const { limit, offset } = searchParams;

   return (
      <Container maxW="4xl">
         {leagues.map((league) => {
            return (
               <div key={league.id}>
                  <Link
                     to={"/league/$id"}
                     params={{ id: league.id }}
                     style={{ textDecoration: "underline" }}
                  >
                     {league.name}
                  </Link>
               </div>
            );
         })}
         <Pagination
            limit={limit}
            numTotal={numTotal}
            offset={offset}
            to="/leagues"
         />
      </Container>
   );
};

export const Route = createFileRoute("/leagues")({
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

      return generalStore.state.dbClient.leagues({ limit, offset });
   },
   component: Leagues,
});

export default Leagues;
