import PageError from "@/components/general/PageError";
import PageLoading from "@/components/general/PageLoading";
import PageNoDataFound from "@/components/general/PageNoDataFound";
import { honoClient } from "@/services/hono";
import type { TApiResponseGetIdGame } from "@baseball-simulator/utils/types";
import { useQuery } from "@tanstack/react-query";
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

	const boxScore = data.boxScore;

	if (!boxScore) {
		return <PageNoDataFound />;
	}

	return (
		<div className="container mx-auto">
			<div className="flex flex-col">
				<div className="flex justify-between">
					<div>
						{boxScore.teamAway.city} {boxScore.teamAway.nickname}
					</div>
					<div>{boxScore.teamAway.runs}</div>
					<div>Final</div>
					<div>{boxScore.teamHome.runs}</div>
					<div>
						{boxScore.teamHome.city} {boxScore.teamHome.nickname}
					</div>
				</div>
			</div>
		</div>
	);
};

export default IdGame;
