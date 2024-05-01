// import { Pagination } from "@/components/ui";
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
// import { number, object, optional, parse } from "valibot";

import { createFileRoute } from "@tanstack/react-router";

// const Cities = () => {
//    const { numTotal, cities } = useLoaderData({ from: "/cities" });
//    const searchParams = useSearch({ from: "/cities" });
//    const { limit, offset } = searchParams;

//    return (
//       <Container maxW="4xl" mt="5">
//          {cities.map((city) => {
//             return (
//                <div key={city.id}>
//                   <Link
//                      to="/city/$id"
//                      params={{ id: city.id }}
//                      style={{ textDecoration: "underline" }}
//                   >
//                      {city.name}
//                   </Link>
//                   , {""}
//                   <Link
//                      to="/subregion/$id"
//                      params={{ id: city.subregion.id }}
//                      style={{ textDecoration: "underline" }}
//                   >
//                      {city.subregion.name}
//                   </Link>
//                   ,{" "}
//                   <Link
//                      to="/country/$id"
//                      params={{ id: city.country.id }}
//                      style={{ textDecoration: "underline" }}
//                   >
//                      {city.country.name}
//                   </Link>
//                </div>
//             );
//          })}
//          <Pagination
//             count={cities.length}
//             pageSize={limit}
//             siblingCount={1}
//             limit={limit}
//             myOffset={offset}
//             linkTo="/cities"
//          />
//       </Container>
//    );
// };

// export const Route = createFileRoute("/cities")({
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

//       return generalStore.state.dbClient.cities({ limit, offset });
//    },
//    component: Cities,
// });

const Cities = () => {
   return <div>Cities</div>;
};

export default Cities;

export const Route = createFileRoute("/cities")({
   component: () => <Cities />,
});
