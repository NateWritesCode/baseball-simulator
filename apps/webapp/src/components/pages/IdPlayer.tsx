import PageError from "@/components/general/PageError";
import PageLoading from "@/components/general/PageLoading";
import PageNoDataFound from "@/components/general/PageNoDataFound";
import { honoClient } from "@/services/hono";
import type { TApiResponseGetIdPlayer } from "@baseball-simulator/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";

const IdPlayer = () => {
	const params = useParams<{ idPlayer: string }>();
	const { data, error, isError, isLoading } = useQuery({
		queryKey: ["player", params.idPlayer],
		queryFn: async () => {
			try {
				const res = await honoClient.player[":idPlayer"].$post({
					json: {
						idPlayer: params.idPlayer,
					},
					param: {
						idPlayer: params.idPlayer,
					},
				});

				if (!res.ok) {
					throw new Error("There was an error fetching the data");
				}

				return (await res.json()) as TApiResponseGetIdPlayer;
			} catch (error) {
				console.error("error", error);
				throw new Error("There was an error fetching the data");
			}
		},
		retry: 0,
	});

	const isNoDataFound = !data;

	if (isError) {
		return <PageError error={error.message} />;
	}

	if (isLoading) {
		return <PageLoading />;
	}

	if (isNoDataFound) {
		return <PageNoDataFound />;
	}

	return (
		<div>
			<div>
				{data.firstName} {data.lastName}
			</div>
		</div>
	);
};

export default IdPlayer;
