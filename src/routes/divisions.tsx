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

const Divisions = () => {
   const { numTotal, divisions } = useLoaderData({ from: "/divisions" });
   const searchParams = useSearch({ from: "/divisions" });
   const { limit, offset } = searchParams;

   return (
      <Container maxW="4xl">
         {divisions.map((division) => {
            return (
               <div key={division.id}>
                  <Link
                     to={"/division/$id"}
                     params={{ id: division.id }}
                     style={{ textDecoration: "underline" }}
                  >
                     {division.name}
                  </Link>
               </div>
            );
         })}
         <Pagination
            limit={limit}
            numTotal={numTotal}
            offset={offset}
            to="/divisions"
         />
      </Container>
   );
};

export const Route = createFileRoute("/divisions")({
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

      return generalStore.state.dbClient.divisions({ limit, offset });
   },
   component: Divisions,
});

export default Divisions;
