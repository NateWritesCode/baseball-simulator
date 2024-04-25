import { NavbarGameplay } from "@/components/general";
import type { FC, ReactNode } from "react";

const DashboardWrapper: FC<{ children: ReactNode }> = ({ children }) => {
   return (
      <div>
         <NavbarGameplay />
         {children}
      </div>
   );
};

export default DashboardWrapper;
