import type { TApiResponseGetIdPerson } from "@baseball-simulator/utils/types";
import { useQuery } from "@tanstack/react-query";
import PageError from "@webapp/components/general/PageError";
import PageLoading from "@webapp/components/general/PageLoading";
import PageNoDataFound from "@webapp/components/general/PageNoDataFound";
import { honoClient } from "@webapp/services/hono";
import { useParams } from "wouter";

const IdPerson = () => {
	const params = useParams<{ idPerson: string }>();
	const { data, error, isError, isLoading } = useQuery({
		queryKey: ["player", params.idPerson],
		queryFn: async () => {
			try {
				const res = await honoClient.person[":idPerson"].$post({
					json: {
						idPerson: params.idPerson,
					},
					param: {
						idPerson: params.idPerson,
					},
				});

				if (!res.ok) {
					throw new Error("There was an error fetching the data");
				}

				return (await res.json()) as TApiResponseGetIdPerson;
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

export default IdPerson;
