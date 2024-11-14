import PageError from "@/components/general/PageError";
import PageLoading from "@/components/general/PageLoading";
import PageNoDataFound from "@/components/general/PageNoDataFound";
import { honoClient } from "@/services/hono";
import type { TApiResponsePostIdLeague } from "@baseball-simulator/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";

const IdLeague = () => {
	const params = useParams<{ idLeague: string }>();
	const { data, error, isError, isLoading } = useQuery({
		queryKey: ["league", params.idLeague],
		queryFn: async () => {
			try {
				const res = await honoClient.league[":idLeague"].$post({
					json: {
						idLeague: params.idLeague,
					},
					param: {
						idLeague: params.idLeague,
					},
				});

				if (!res.ok) {
					throw new Error("There was an error fetching the data");
				}

				return (await res.json()) as TApiResponsePostIdLeague;
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
				<pre>{JSON.stringify(data, null, 2)}</pre>
			</div>
		</div>
	);
};

export default IdLeague;
