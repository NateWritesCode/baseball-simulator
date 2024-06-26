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
// import { number, object, optional, parse } from "valibot";

// const Subregions = () => {
//    const { numTotal, subregions } = useLoaderData({ from: "/subregions" });
//    const searchParams = useSearch({ from: "/subregions" });
//    const { limit, offset } = searchParams;

//    return (
//       <Container maxW="4xl" mt="5">
//          {subregions.map((subregion) => {
//             return (
//                <div key={subregion.id}>
//                   <Link
//                      to="/subregion/$id"
//                      params={{ id: subregion.id }}
//                      style={{ textDecoration: "underline" }}
//                   >
//                      {subregion.name}
//                   </Link>
//                   ,{" "}
//                   <Link
//                      to="/country/$id"
//                      params={{ id: subregion.country.id }}
//                      style={{ textDecoration: "underline" }}
//                   >
//                      {subregion.country.name}
//                   </Link>
//                </div>
//             );
//          })}
//          <Pagination
//             limit={limit}
//             numTotal={numTotal}
//             offset={offset}
//             to="/subregions"
//          />
//       </Container>
//    );
// };

// export const Route = createFileRoute("/subregions")({
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

//       return generalStore.state.dbClient.subregions({ limit, offset });
//    },
//    component: Subregions,
// });

const Subregions = () => {
   return <div>Subregions</div>;
};

export default Subregions;
