import { useMutation } from "@tanstack/react-query";
import { Button } from "@webapp/components/ui/button";
import { honoClient } from "@webapp/services/hono";
import { Loader2, Play } from "lucide-react";

const SimulateButton = () => {
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
					return <Loader2 className="animate-spin mr-2 h-4 w-4" />;
				}

				return <Play className="mr-2 h-4 w-4" />;
			})()}
			Simulate
		</Button>
	);
};

export default SimulateButton;
