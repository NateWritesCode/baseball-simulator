import PageError from "@/components/general/PageError";
import PageLoading from "@/components/general/PageLoading";
import PageNoDataFound from "@/components/general/PageNoDataFound";
import { honoClient } from "@/services/hono";
import type { TApiResponsePostIdTeam } from "@baseball-simulator/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";

const IdTeam = () => {
	const params = useParams<{ idTeam: string }>();
	const { data, error, isError, isLoading } = useQuery({
		queryKey: ["team", params.idTeam],
		queryFn: async () => {
			try {
				const res = await honoClient.team[":idTeam"].$post({
					json: {
						idTeam: params.idTeam,
					},
					param: {
						idTeam: params.idTeam,
					},
				});

				if (!res.ok) {
					throw new Error("There was an error fetching the data");
				}

				return (await res.json()) as TApiResponsePostIdTeam;
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

export default IdTeam;
