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

const SubLeagues = () => {
   const { numTotal, subLeagues } = useLoaderData({ from: "/subLeagues" });
   const searchParams = useSearch({ from: "/subLeagues" });
   const { limit, offset } = searchParams;

   return (
      <Container maxW="4xl">
         {subLeagues.map((subLeague) => {
            return (
               <div key={subLeague.id}>
                  <Link
                     to={"/subLeague/$id"}
                     params={{ id: subLeague.id }}
                     style={{ textDecoration: "underline" }}
                  >
                     {subLeague.name}
                  </Link>
               </div>
            );
         })}
         <Pagination
            limit={limit}
            numTotal={numTotal}
            offset={offset}
            to="/subLeagues"
         />
      </Container>
   );
};

export const Route = createFileRoute("/subLeagues")({
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

      return generalStore.state.dbClient.subLeagues({ limit, offset });
   },
   component: SubLeagues,
});

export default SubLeagues;
