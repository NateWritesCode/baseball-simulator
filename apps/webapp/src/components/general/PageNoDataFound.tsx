import { Alert } from "@/components/ui/alert";
import { Box, Flex } from "@chakra-ui/react";

const PageNoDataFound = () => {
	return (
		<Flex
			minH={"calc(100dvh - var(--chakra-sizes-16))"}
			alignItems={"center"}
			justifyContent={"center"}
		>
			<Box maxW="breakpoint-md">
				<Alert status="warning" title="No Data Found!" />
			</Box>
		</Flex>
	);
};

export default PageNoDataFound;
