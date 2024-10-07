import type { TApiResponseGetPerson } from "@baseball-simulator/utils/types";
import { useQuery } from "@tanstack/react-query";
import PageError from "@webapp/components/general/PageError";
import PageLoading from "@webapp/components/general/PageLoading";
import PageNoDataFound from "@webapp/components/general/PageNoDataFound";
import { honoClient } from "@webapp/services/hono";

const Person = () => {
	const { data, error, isError, isLoading } = useQuery({
		queryKey: ["person"],
		queryFn: async () => {
			const res = await honoClient.person.$get();
			return (await res.json()) as TApiResponseGetPerson;
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
			{data.map(({ firstName, idPerson, lastName }) => {
				return (
					<div key={idPerson}>
						<a href={`/person/${idPerson}`}>
							{firstName} {lastName}
						</a>
					</div>
				);
			})}
		</div>
	);
};

export default Person;
