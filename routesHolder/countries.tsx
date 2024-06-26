// import Pagination from "@/components/general/Pagination";
// import { generalStore } from "@/services/generalStore";
// import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "@/utils/constants/cDb";
// import {
//    Link,
//    createFileRoute,
//    redirect,
//    useLoaderData,
//    useSearch,
// } from "@tanstack/react-router";
// import { Container } from "styled-system/jsx";
// import { useRow } from "tinybase/ui-react";
// import { number, object, optional, parse } from "valibot";

import { createFileRoute } from "@tanstack/react-router";

// const Countries = () => {
//    const { numTotal, countries } = useLoaderData({
//       from: "/countries",
//    });
//    const searchParams = useSearch({
//       from: "/countries",
//    });
//    const { limit, offset } = searchParams;

//    return (
//       <Container maxW="4xl" mt="5">
//          {countries.map((country) => {
//             return (
//                <div key={country.id}>
//                   <Link
//                      to="/country/$id"
//                      params={{ id: country.id }}
//                      style={{ textDecoration: "underline" }}
//                   >
//                      {country.name}
//                   </Link>
//                </div>
//             );
//          })}
//          <Pagination
//             limit={limit}
//             numTotal={numTotal}
//             offset={offset}
//             to="/countries"
//          />
//       </Container>
//    );
// };

// export const Route = createFileRoute("/countries")({
//    validateSearch: (search?: { limit?: number; offset?: number }) => {
//       return {
//          limit: search?.limit,
//          offset: search?.offset,
//       };
//    },
//    loaderDeps: ({ search }) => {
//       const { limit, offset } = parse(
//          object({
//             limit: optional(number(), DEFAULT_LIMIT),
//             offset: optional(number(), DEFAULT_OFFSET),
//          }),
//          search,
//       );

//       return { limit, offset };
//    },
//    loader: ({ deps: { limit, offset } }) => {
//       if (!generalStore.state.dbClient) {
//          throw redirect({
//             to: "/",
//          });
//       }

//       return generalStore.state.dbClient.countries({ limit, offset });
//    },
//    component: Countries,
// });

const Countries = () => {
   return <div>Countries</div>;
};

export default Countries;

export const Route = createFileRoute("/countries")({
   component: () => <Countries />,
});
