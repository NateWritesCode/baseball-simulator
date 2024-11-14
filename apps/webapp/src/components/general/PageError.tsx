import { Alert } from "@/components/ui/alert";
import { Box, Flex } from "@chakra-ui/react";

const PageError = ({ error }: { error: string }) => {
	return (
		<Flex
			minH={"calc(100dvh - var(--chakra-sizes-16))"}
			alignItems={"center"}
			justifyContent={"center"}
		>
			<Box maxW="breakpoint-md">
				<Alert status="error" title={error} />
			</Box>
		</Flex>
	);
};

export default PageError;
