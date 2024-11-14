import { Flex, Spinner, Text, VStack } from "@chakra-ui/react";

const PageLoading = () => {
	return (
		<Flex
			minH={"calc(100dvh - var(--chakra-sizes-16))"}
			alignItems={"center"}
			justifyContent={"center"}
		>
			<VStack color="fg">
				<Spinner size="xl" />
				<Text fontSize="xl">Loading...</Text>
			</VStack>
		</Flex>
	);
};

export default PageLoading;
