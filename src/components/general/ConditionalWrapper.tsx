import type { FC, ReactNode } from "react";

interface ConditionalWrapperProps {
   condition: boolean;
   wrapper: (children: ReactNode) => JSX.Element;
   children: ReactNode;
}

const ConditionalWrapper: FC<ConditionalWrapperProps> = ({
   condition,
   wrapper,
   children,
}) => (condition ? wrapper(children) : children);

export default ConditionalWrapper;
