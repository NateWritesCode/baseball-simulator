import PageError from "@/components/general/PageError";
import PageLoading from "@/components/general/PageLoading";
import PageNoDataFound from "@/components/general/PageNoDataFound";
import { honoClient } from "@/services/hono";
import type { TApiResponseGetUniverse } from "@baseball-simulator/utils/types";
import { Box } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams } from "wouter";

const UniverseDate = () => {
	const params = useParams<{ idGame: string }>();
	const { data, error, isError, isLoading } = useQuery({
		queryKey: ["universe"],
		queryFn: async () => {
			try {
				const res = await honoClient.universe.$get({
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

				return (await res.json()) as TApiResponseGetUniverse;
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

	const dateTime = data.dateTime;

	if (!dateTime) {
		return <PageNoDataFound />;
	}

	return <Box>{dayjs(dateTime).format("MMMM D, YYYY")}</Box>;
};

export default UniverseDate;
