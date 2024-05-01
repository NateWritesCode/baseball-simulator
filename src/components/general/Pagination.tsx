// import { Button, IconButton } from "@/components/ui/";
// import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "@/utils/constants/cDb";
// import {
//    Pagination as ArkPagination,
//    type PaginationRootProps,
// } from "@ark-ui/react/pagination";
// import { forwardRef } from "react";
// import { css, cx } from "styled-system/css";
// import { splitCssProps } from "styled-system/jsx";
// import { type PaginationVariantProps, pagination } from "styled-system/recipes";
// import type { Assign, JsxStyleProps } from "styled-system/types";

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
//             className={cx(styles.root, css(cssProps), className)}
//             ref={ref}
//             {...rootProps}
//          >
//             {({ pages }) => (
//                <>
//                   <ArkPagination.PrevTrigger
//                      className={styles.prevTrigger}
//                      asChild
//                   >
//                      <IconButton variant="ghost" aria-label="Next Page">
//                         <ChevronLeftIcon />
//                      </IconButton>
//                   </ArkPagination.PrevTrigger>
//                   {pages.map((page, index) =>
//                      page.type === "page" ? (
//                         <ArkPagination.Item
//                            className={styles.item}
//                            key={index}
//                            {...page}
//                            asChild
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
//                   )}
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

// // const Pagination = ({
// //    limit,
// //    numTotal,
// //    offset,
// //    to,
// // }: {
// //    limit?: number;
// //    numTotal: number;
// //    offset?: number;
// //    // to: keyof FileRoutesByPath;
// //    to: string;
// // }) => {
// //    const _limit = limit || DEFAULT_LIMIT;
// //    const _offset = offset || DEFAULT_OFFSET;

// //    return (
// //       <>
// //          <Link
// //             to={to}
// //             search={{ limit: _limit, offset: 0 }}
// //             style={{
// //                opacity: _offset === 0 ? 0.5 : 1,
// //             }}
// //             disabled={_offset === 0}
// //          >
// //             {"<<"}
// //          </Link>{" "}
// //          <Link
// //             to={to}
// //             search={{ limit: _limit, offset: _offset - _limit }}
// //             style={{
// //                opacity: !_offset || _offset === 0 ? 0.5 : 1,
// //             }}
// //             disabled={!_offset || _offset === 0}
// //          >
// //             {"<"}
// //          </Link>{" "}
// //          {(() => {
// //             const numPages = Math.ceil(numTotal / _limit);
// //             const currentPage = Math.floor(_offset / _limit) + 1;

// //             return (
// //                <>
// //                   page {currentPage} of {numPages}
// //                </>
// //             );
// //          })()} <Link
// //             to={to}
// //             search={{
// //                limit: _limit,
// //                offset: _offset + _limit,
// //             }}
// //             style={{
// //                opacity: _offset + _limit >= numTotal ? 0.5 : 1,
// //             }}
// //             disabled={_offset + _limit >= numTotal}
// //          >
// //             {">"}
// //          </Link>{" "}
// //          <Link
// //             to={to}
// //             search={{
// //                limit: _limit,
// //                offset: (() => {
// //                   const offset = Math.floor(numTotal / _limit) * _limit;

// //                   if (offset === numTotal) {
// //                      return offset - _limit;
// //                   }

// //                   return offset;
// //                })(),
// //             }}
// //             style={{
// //                opacity: _offset + _limit >= numTotal ? 0.5 : 1,
// //             }}
// //             disabled={_offset + _limit >= numTotal}
// //          >
// //             {">>"}
// //          </Link>
// //       </>
// //    );
// // };

// export default Pagination;

// // import { Pagination as ArkPagination, type PaginationRootProps } from '@ark-ui/react/pagination'
// // import { forwardRef } from 'react'
// // import { css, cx } from 'styled-system/css'
// // import { splitCssProps } from 'styled-system/jsx'
// // import { type PaginationVariantProps, pagination } from 'styled-system/recipes'
// // import type { Assign, JsxStyleProps } from 'styled-system/types'
// // import { Button } from '~/components/ui/button'
// // import { IconButton } from '~/components/ui/icon-button'

// // export interface PaginationProps
// //   extends Assign<JsxStyleProps, PaginationRootProps>,
// //     PaginationVariantProps {}

// // export const Pagination = forwardRef<HTMLElement, PaginationProps>((props, ref) => {
// //   const [variantProps, paginationProps] = pagination.splitVariantProps(props)
// //   const [cssProps, localProps] = splitCssProps(paginationProps)
// //   const { className, ...rootProps } = localProps
// //   const styles = pagination(variantProps)

// //   return (
// //     <ArkPagination.Root
// //       className={cx(styles.root, css(cssProps), className)}
// //       ref={ref}
// //       {...rootProps}
// //     >
// //       {({ pages }) => (
// //         <>
// //           <ArkPagination.PrevTrigger className={styles.prevTrigger} asChild>
// //             <IconButton variant="ghost" aria-label="Next Page">
// //               <ChevronLeftIcon />
// //             </IconButton>
// //           </ArkPagination.PrevTrigger>
// //           {pages.map((page, index) =>
// //             page.type === 'page' ? (
// //               <ArkPagination.Item className={styles.item} key={index} {...page} asChild>
// //                 <Button variant="outline">{page.value}</Button>
// //               </ArkPagination.Item>
// //             ) : (
// //               <ArkPagination.Ellipsis className={styles.ellipsis} key={index} index={index}>
// //                 &#8230;
// //               </ArkPagination.Ellipsis>
// //             ),
// //           )}
// //           <ArkPagination.NextTrigger className={styles.nextTrigger} asChild>
// //             <IconButton variant="ghost" aria-label="Next Page">
// //               <ChevronRightIcon />
// //             </IconButton>
// //           </ArkPagination.NextTrigger>
// //         </>
// //       )}
// //     </ArkPagination.Root>
// //   )
// // })

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

const Pagination = () => {
   return <div>Pagination</div>;
};

export default Pagination;
