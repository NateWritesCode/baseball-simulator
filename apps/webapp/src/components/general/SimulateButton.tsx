import {
	MenuContent,
	MenuItem,
	MenuRoot,
	MenuTrigger,
} from "@/components/ui/menu";
import { honoClient } from "@/services/hono";
import { SIMULATION_LENGTH_OPTIONS } from "@baseball-simulator/utils/constants";
import type {
	TApiParamsSimulate,
	TPicklistSimuationLengthOptions,
} from "@baseball-simulator/utils/types";
import { Box, Button, Icon } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuLoader2, LuPlay } from "react-icons/lu";

const SimulateButton = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async ({ simulationLength }: TApiParamsSimulate) => {
			try {
				const res = await honoClient.simulate.simulate.$post({
					json: {
						simulationLength,
					},
				});

				if (!res.ok) {
					throw new Error("There was an error fetching the data");
				}

				return null;
			} catch (error) {
				console.error("error", error);
				throw new Error("There was an error fetching the data");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
	});

	const { isPending } = mutation;

	return (
		<MenuRoot
			onSelect={({ value }) => {
				const simulationLength = value as TPicklistSimuationLengthOptions;

				mutation.mutate({ simulationLength });
			}}
		>
			<MenuTrigger asChild>
				<Button
					colorPalette={{
						base: "white",
						_dark: "black",
					}}
					disabled={isPending}
					size={{ base: "sm", md: "md" }}
					variant={"outline"}
				>
					{(() => {
						if (isPending) {
							return (
								<Icon
									fontSize={"lg"}
									mr="1"
									data-state="open"
									_open={{
										animation: "spin 1s linear infinite",
									}}
								>
									<LuLoader2 />
								</Icon>
							);
						}

						return (
							<Icon fontSize={"lg"}>
								<LuPlay />
							</Icon>
						);
					})()}
					<Box as="span" display={["none", "none", "block"]}>
						Simulate
					</Box>
				</Button>
			</MenuTrigger>
			<MenuContent>
				{SIMULATION_LENGTH_OPTIONS.map((menuItem) => {
					return (
						<MenuItem key={menuItem} value={menuItem}>
							{(() => {
								switch (menuItem) {
									case "oneDay": {
										return "Day";
									}
									case "oneHalfWeek": {
										return "Half Week";
									}
									case "oneWeek": {
										return "Week";
									}
									case "oneMonth": {
										return "Month";
									}
									case "oneYear": {
										return "Year";
									}
									default: {
										const exhaustiveCheck: never = menuItem;
										throw new Error(exhaustiveCheck);
									}
								}
							})()}
						</MenuItem>
					);
				})}
			</MenuContent>
		</MenuRoot>

		// <Button
		// 	colorPalette={{
		// 		base: "white",
		// 		_dark: "black",
		// 	}}
		// 	disabled={isPending}
		// 	onClick={() => {
		// 		mutation.mutate();
		// 	}}
		// 	size={{ base: "sm", md: "md" }}
		// 	variant={"outline"}
		// >
		// 	{(() => {
		// 		if (isPending) {
		// 			return <LuLoader2 className="animate-spin mr-2 h-4 w-4" />;
		// 		}

		// 		return <LuPlay className="mr-2 h-4 w-4" />;
		// 	})()}
		// 	<Box as="span" display={["none", "none", "block"]}>
		// 		Simulate
		// 	</Box>
		// </Button>
	);
};

export default SimulateButton;
