import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "@/utils/constants/cDb";
import {
   Pagination as ArkPagination,
   type PaginationRootProps,
} from "@ark-ui/react";
import { Link } from "@tanstack/react-router";

const Pagination = ({
   limit,
   numTotal,
   offset,
   to,
}: {
   limit?: number;
   numTotal: number;
   offset?: number;
   // to: keyof FileRoutesByPath;
   to: string;
}) => {
   const _limit = limit || DEFAULT_LIMIT;
   const _offset = offset || DEFAULT_OFFSET;

   return (
      <>
         <Link
            to={to}
            search={{ limit: _limit, offset: 0 }}
            style={{
               opacity: _offset === 0 ? 0.5 : 1,
            }}
            disabled={_offset === 0}
         >
            {"<<"}
         </Link>{" "}
         <Link
            to={to}
            search={{ limit: _limit, offset: _offset - _limit }}
            style={{
               opacity: !_offset || _offset === 0 ? 0.5 : 1,
            }}
            disabled={!_offset || _offset === 0}
         >
            {"<"}
         </Link>{" "}
         {(() => {
            const numPages = Math.ceil(numTotal / _limit);
            const currentPage = Math.floor(_offset / _limit) + 1;

            return (
               <>
                  page {currentPage} of {numPages}
               </>
            );
         })()} <Link
            to={to}
            search={{
               limit: _limit,
               offset: _offset + _limit,
            }}
            style={{
               opacity: _offset + _limit >= numTotal ? 0.5 : 1,
            }}
            disabled={_offset + _limit >= numTotal}
         >
            {">"}
         </Link>{" "}
         <Link
            to={to}
            search={{
               limit: _limit,
               offset: (() => {
                  const offset = Math.floor(numTotal / _limit) * _limit;

                  if (offset === numTotal) {
                     return offset - _limit;
                  }

                  return offset;
               })(),
            }}
            style={{
               opacity: _offset + _limit >= numTotal ? 0.5 : 1,
            }}
            disabled={_offset + _limit >= numTotal}
         >
            {">>"}
         </Link>
      </>
   );
};

export default Pagination;
