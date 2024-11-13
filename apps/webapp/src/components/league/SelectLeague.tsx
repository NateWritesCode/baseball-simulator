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
import type { TApiResponsePostSelectLeague } from "@baseball-simulator/utils/types";
import { createListCollection } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";

const SelectLeague = () => {
	const idLeagueActive = useStore(
		storeGeneral,
		(state) => state.idLeagueActive,
	);
	const { data, error, isError, isLoading } = useQuery({
		queryKey: ["selectLeague"],
		queryFn: async () => {
			const res = await honoClient.league.selectLeague.$get();
			return (await res.json()) as TApiResponsePostSelectLeague;
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
		items: data.map(({ idLeague, name }) => ({
			label: name,
			value: String(idLeague),
		})),
	});

	const defaultValue = collection.items.find(
		(item) => item.value === String(idLeagueActive),
	);

	if (!defaultValue) {
		return <PageError error="League not found" />;
	}

	return (
		<SelectRoot
			size="sm"
			collection={collection}
			defaultValue={[defaultValue.value]}
			onValueChange={({ value }) => {
				storeGeneralSet({
					idLeagueActive: Number(value),
				});
			}}
		>
			<SelectLabel />
			<SelectTrigger>
				<SelectValueText />
			</SelectTrigger>
			<SelectContent>
				{collection.items.map((item) => {
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

export default SelectLeague;
