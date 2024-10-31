import type { TApiResponseGetIdGame } from "@baseball-simulator/utils/types";
import { useQuery } from "@tanstack/react-query";
import PageError from "@webapp/components/general/PageError";
import PageLoading from "@webapp/components/general/PageLoading";
import PageNoDataFound from "@webapp/components/general/PageNoDataFound";
import { honoClient } from "@webapp/services/hono";
import { useParams } from "wouter";

const IdGame = () => {
	const params = useParams<{ idGame: string }>();
	const { data, error, isError, isLoading } = useQuery({
		queryKey: ["game", params.idGame],
		queryFn: async () => {
			try {
				const res = await honoClient.game[":idGame"].$post({
					json: {
						idGame: params.idGame,
					},
					param: {
						idGame: params.idGame,
					},
				});

				if (!res.ok) {
					throw new Error("There was an error fetching the data");
				}

				return (await res.json()) as TApiResponseGetIdGame;
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
			<pre>{JSON.stringify(data, null, 4)}</pre>
		</div>
	);
};

export default IdGame;
