import PageError from "@/components/general/PageError";
import PageLoading from "@/components/general/PageLoading";
import PageNoDataFound from "@/components/general/PageNoDataFound";
import {
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectRoot,
	SelectTrigger,
	SelectValueText,
} from "@/components/ui/select";
import { honoClient } from "@/services/hono";
import { storeGeneral, storeGeneralSet } from "@/services/storeGeneral";
import type { TApiResponsePostSelectTeam } from "@baseball-simulator/utils/types";
import { createListCollection } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";

const SelectTeam = () => {
	const idLeagueActive = useStore(
		storeGeneral,
		(state) => state.idLeagueActive,
	);
	const idTeamActive = useStore(storeGeneral, (state) => state.idTeamActive);
	const { data, error, isError, isLoading } = useQuery({
		queryKey: ["selectTeam"],
		queryFn: async () => {
			const res = await honoClient.team.selectTeam[":idLeague"].$post({
				param: {
					idLeague: String(idLeagueActive),
				},
				json: {
					idLeague: String(idLeagueActive),
				},
			});
			return (await res.json()) as TApiResponsePostSelectTeam;
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

	const collection = createListCollection({
		items: data.map(({ city, idTeam, nickname }) => ({
			label: `${city.name} ${nickname}`,
			value: String(idTeam),
		})),
	});

	const defaultValue = collection.items.find(
		(item) => item.value === String(idTeamActive),
	);

	if (!defaultValue) {
		return <PageError error="League not found" />;
	}

	return (
		<SelectRoot
			collection={collection}
			defaultValue={[defaultValue.value]}
			onValueChange={({ value }) => {
				storeGeneralSet({
					idTeamActive: Number(value),
				});
			}}
			size="sm"
		>
			<SelectLabel />
			<SelectTrigger>
				<SelectValueText />
			</SelectTrigger>
			<SelectContent>
				{collection.items
					.sort((a, b) => {
						if (a.label < b.label) {
							return -1;
						}
						if (a.label > b.label) {
							return 1;
						}
						return 0;
					})
					.map((item) => {
						return (
							<SelectItem item={item} key={item.value}>
								{item.label}
							</SelectItem>
						);
					})}
			</SelectContent>
		</SelectRoot>
	);
};

export default SelectTeam;
