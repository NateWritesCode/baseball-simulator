import { type InferInput, object, string } from "valibot";
import { VFormSchemaExplore } from "./tFormSchema";
import { VPicklistSimuationLengthOptions } from "./tPicklist";

export const VApiParamsGetIdGame = object({
	idGame: string(),
});
export type TApiParamsGetGameId = InferInput<typeof VApiParamsGetIdGame>;

export const VApiParamsGetIdPerson = object({
	idPerson: string(),
});
export type TApiParamsGetPerson = InferInput<typeof VApiParamsGetIdPerson>;

export const VApiParamsGetIdPlayer = object({
	idPlayer: string(),
});
export type TApiParamsGetPlayerId = InferInput<typeof VApiParamsGetIdPlayer>;

export const VApiParamsExplore = VFormSchemaExplore;
export type TApiParamsExplore = InferInput<typeof VApiParamsExplore>;

export const VApiParamsGetStandings = object({
	idGameGroup: string(),
});
export type TApiParamsGetStandings = InferInput<typeof VApiParamsGetStandings>;

export const VApiParamsSimulate = object({
	simulationLength: VPicklistSimuationLengthOptions,
});
export type TApiParamsSimulate = InferInput<typeof VApiParamsSimulate>;

export const VApiParamsPostSelectTeam = object({
	idLeague: string(),
});
export type TApiParamsPostSelectTeam = InferInput<
	typeof VApiParamsPostSelectTeam
>;

export const VApiParamsPostIdLeague = object({
	idLeague: string(),
});
export type TApiParamsPostIdLeague = InferInput<typeof VApiParamsPostIdLeague>;

export const VApiParamsPostIdTeam = object({
	idTeam: string(),
});

export type TApiParamsPostIdTeam = InferInput<typeof VApiParamsPostIdTeam>;

export const VApiParamsPostIdLeagueIdGameGroupLeaders = object({
	idGameGroup: string(),
	idLeague: string(),
});
export type TApiParamsPostIdLeagueIdGameGroupLeaders = InferInput<
	typeof VApiParamsPostIdLeagueIdGameGroupLeaders
>;
