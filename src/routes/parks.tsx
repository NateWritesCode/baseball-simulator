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

const Parks = () => {
   const { numTotal, parks } = useLoaderData({ from: "/parks" });
   const searchParams = useSearch({ from: "/parks" });
   const { limit, offset } = searchParams;

   return (
      <Container maxW="4xl">
         {parks.map((park) => {
            return (
               <div key={park.id}>
                  <Link
                     to={"/park/$id"}
                     params={{ id: park.id }}
                     style={{ textDecoration: "underline" }}
                  >
                     {park.name}
                  </Link>
               </div>
            );
         })}
         <Pagination
            limit={limit}
            numTotal={numTotal}
            offset={offset}
            to="/parks"
         />
      </Container>
   );
};

export const Route = createFileRoute("/parks")({
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

      return generalStore.state.dbClient.parks({ limit, offset });
   },
   component: Parks,
});

export default Parks;
