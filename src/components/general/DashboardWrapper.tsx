import { NavbarGameplay } from "@baseball-simulator/components/general";
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
