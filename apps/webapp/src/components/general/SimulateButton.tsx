import { honoClient } from "@/services/hono";
import { Button } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuLoader2, LuPlay } from "react-icons/lu";

const SimulateButton = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async () => {
			try {
				const res = await honoClient.simulate.simulate.$post();

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
		<Button
			disabled={isPending}
			onClick={() => {
				mutation.mutate();
			}}
		>
			{(() => {
				if (isPending) {
					return <LuLoader2 className="animate-spin mr-2 h-4 w-4" />;
				}

				return <LuPlay className="mr-2 h-4 w-4" />;
			})()}
			Simulate
		</Button>
	);
};

export default SimulateButton;
