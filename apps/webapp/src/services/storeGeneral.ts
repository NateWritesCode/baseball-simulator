import { Store } from "@tanstack/store";
import { type InferOutput, number, object } from "valibot";

const VStoreGeneral = object({
	idGameGroupActive: number(),
	idLeagueActive: number(),
	idTeamActive: number(),
});
type TStoreGeneral = InferOutput<typeof VStoreGeneral>;

export const storeGeneral = new Store({
	idGameGroupActive: 1,
	idLeagueActive: 1,
	idTeamActive: 1,
});

export const storeGeneralSet = (data: Partial<TStoreGeneral>) => {
	storeGeneral.setState((state) => {
		return {
			...state,
			...data,
		};
	});
};
