import Pagination from "@baseball-simulator/components/general/Pagination";
import { generalStore } from "@baseball-simulator/services/generalStore";
import { Container } from "@baseball-simulator/styled-system/jsx";
import {
   DEFAULT_LIMIT,
   DEFAULT_OFFSET,
} from "@baseball-simulator/utils/constants/cDb";
import {
   Link,
   createFileRoute,
   redirect,
   useLoaderData,
   useSearch,
} from "@tanstack/react-router";
import { number, object, optional, parse } from "valibot";

const Persons = () => {
   const { numTotal, persons } = useLoaderData({ from: "/persons" });
   const searchParams = useSearch({ from: "/persons" });
   const { limit, offset } = searchParams;

   return (
      <Container maxW="4xl" mt="5">
         {persons.map((person) => {
            return (
               <div key={person.id}>
                  <Link
                     to="/person/$id"
                     params={{ id: person.id }}
                     style={{ textDecoration: "underline" }}
                  >
                     {person.firstName} {person.lastName}
                  </Link>
               </div>
            );
         })}
         <Pagination
            limit={limit}
            numTotal={numTotal}
            offset={offset}
            to="/persons"
         />
      </Container>
   );
};

export const Route = createFileRoute("/persons")({
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

      generalStore.state.dbClient.persons({ limit, offset });
   },
   component: Persons,
});
