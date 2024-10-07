import type { TApiResponseGetIdPlayer } from "@baseball-simulator/utils/types";
import { useQuery } from "@tanstack/react-query";
import PageError from "@webapp/components/general/PageError";
import PageLoading from "@webapp/components/general/PageLoading";
import PageNoDataFound from "@webapp/components/general/PageNoDataFound";
import { honoClient } from "@webapp/services/hono";
import { useParams } from "wouter";

const IdPlayer = () => {
	const params = useParams<{ idPlayer: string }>();
	const { data, error, isError, isLoading } = useQuery({
		queryKey: ["player", params.idPlayer],
		queryFn: async () => {
			const res = await honoClient.player[":idPlayer"].$get({
				json: {
					idPlayer: params.idPlayer,
				},
				param: {
					idPlayer: params.idPlayer,
				},
			});
			return (await res.json()) as TApiResponseGetIdPlayer;
		},
	});

	const isNoDataFound = !data;

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
			<div>
				{data.firstName} {data.lastName}
			</div>
		</div>
	);
};

export default IdPlayer;
