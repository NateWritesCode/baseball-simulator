const Pagination = () => {
   return <div>Pagination</div>;
};

export default Pagination;

// import { Button, IconButton } from "@/components/ui";
// import {
//    Pagination as ArkPagination,
//    type PaginationRootProps,
// } from "@ark-ui/react/pagination";
// import { Link } from "@tanstack/react-router";
// import { forwardRef } from "react";
// import { css, cx } from "styled-system/css";
// import { splitCssProps } from "styled-system/jsx";
// import { type PaginationVariantProps, pagination } from "styled-system/recipes";
// import type {
//    Assign,
//    JsxStyleProps,
//    SystemStyleObject,
// } from "styled-system/types";

// export interface PaginationProps
//    extends Assign<JsxStyleProps, PaginationRootProps>,
//       PaginationVariantProps {}

// export const Pagination = forwardRef<HTMLElement, PaginationProps>(
//    (props, ref) => {
//       const [variantProps, paginationProps] =
//          pagination.splitVariantProps(props);
//       const [cssProps, localProps] = splitCssProps(paginationProps);
//       const { className, ...rootProps } = localProps;
//       const styles = pagination(variantProps);

//       return (
//          <ArkPagination.Root
//             className={cx(
//                styles.root,
//                css(cssProps as SystemStyleObject),
//                className,
//             )}
//             ref={ref}
//             {...rootProps}
//          >
//             {({ pages }) => (
//                <>
//                   <ArkPagination.PrevTrigger
//                      className={styles.prevTrigger}
//                      asChild
//                   >
//                      <Link to href="https://espn.com">
//                         <IconButton variant="ghost" aria-label="Next Page">
//                            <ChevronLeftIcon />
//                         </IconButton>
//                      </Link>
//                   </ArkPagination.PrevTrigger>
//                   {pages.map((page, i) => {
//                      if (page.type === "page") {
//                         return (
//                            <ArkPagination.Item
//                               {...page}
//                               asChild
//                               key={page.type}
//                               className={styles.item}
//                            >
//                               <Button variant="outline">{page.value}</Button>
//                            </ArkPagination.Item>
//                         );
//                      }
//                      return (
//                         <ArkPagination.Ellipsis
//                            className={styles.ellipsis}
//                            key={i}
//                            index={i}
//                         >
//                            &#8230;
//                         </ArkPagination.Ellipsis>
//                      );
//                   })}
//                   {/* {pages.map((page, index) =>
//                      page.type === "page" ? (
//                         <ArkPagination.Item
//                            {...page}
//                            asChild
//                            key={page.type}
//                            className={styles.item}
//                         >
//                            <Button variant="outline">{page.value}</Button>
//                         </ArkPagination.Item>
//                      ) : (
//                         <ArkPagination.Ellipsis
//                            className={styles.ellipsis}
//                            key={index}
//                            index={index}
//                         >
//                            &#8230;
//                         </ArkPagination.Ellipsis>
//                      ),
//                   )} */}
//                   <ArkPagination.NextTrigger
//                      className={styles.nextTrigger}
//                      asChild
//                   >
//                      <IconButton variant="ghost" aria-label="Next Page">
//                         <ChevronRightIcon />
//                      </IconButton>
//                   </ArkPagination.NextTrigger>
//                </>
//             )}
//          </ArkPagination.Root>
//       );
//    },
// );

// Pagination.displayName = "Pagination";

// const ChevronLeftIcon = () => (
//    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//       <title>Chevron Left Icon</title>
//       <path
//          fill="none"
//          stroke="currentColor"
//          strokeLinecap="round"
//          strokeLinejoin="round"
//          strokeWidth="2"
//          d="m15 18l-6-6l6-6"
//       />
//    </svg>
// );

// const ChevronRightIcon = () => (
//    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//       <title>Chevron Right Icon</title>
//       <path
//          fill="none"
//          stroke="currentColor"
//          strokeLinecap="round"
//          strokeLinejoin="round"
//          strokeWidth="2"
//          d="m9 18l6-6l-6-6"
//       />
//    </svg>
// );
