import type { TApiResponseGetPlayer } from "@baseball-simulator/utils/types";
import { useQuery } from "@tanstack/react-query";
import PageError from "@webapp/components/general/PageError";
import PageLoading from "@webapp/components/general/PageLoading";
import PageNoDataFound from "@webapp/components/general/PageNoDataFound";
import { honoClient } from "@webapp/services/hono";

const Player = () => {
	const { data, error, isError, isLoading } = useQuery({
		queryKey: ["player"],
		queryFn: async () => {
			const res = await honoClient.player.$get();
			return (await res.json()) as TApiResponseGetPlayer;
		},
	});

	const isNoDataFound = !data || data.length === 0;

	if (isLoading) {
		return <PageLoading />;
	}

	if (isNoDataFound) {
		return <PageNoDataFound />;
	}

	if (isError) {
		return <PageError error={error.message} />;
	}

	return (
		<div>
			{data.map(({ firstName, idPlayer, lastName }) => {
				return (
					<div key={`${firstName}-${lastName}`}>
						<a href={`/player/${idPlayer}`}>
							{firstName} {lastName}
						</a>
					</div>
				);
			})}
		</div>
	);
};

export default Player;
