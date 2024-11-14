import {
	type InferOutput,
	array,
	intersect,
	nullable,
	number,
	object,
	pick,
	picklist,
} from "valibot";
import {
	VDbCities,
	VDbDivisions,
	VDbGameGroups,
	VDbLeagues,
	VDbPersons,
	VDbSubLeagues,
	VDbTeams,
	VDbUniverse,
} from "./tDb";

export const VDbQueryStandings = pick(VDbGameGroups, ["standings"]);
export type TDbQueryStandings = InferOutput<typeof VDbQueryStandings>;

export const VDbQueryStandingsTeams = array(
	intersect([
		object({
			city: pick(VDbCities, ["name"]),
			division: nullable(
				pick(VDbDivisions, ["idDivision", "direction", "name"]),
			),
			league: pick(VDbLeagues, ["idLeague", "name"]),
			subLeague: pick(VDbSubLeagues, ["idSubLeague", "name"]),
		}),
		pick(VDbTeams, ["idTeam", "nickname"]),
	]),
);

export type TDdQueryStandingsTeams = InferOutput<typeof VDbQueryStandingsTeams>;

export const VDbQueryUniverseDateTime = pick(VDbUniverse, ["dateTime"]);
export type TDbQueryUniverseDateTime = InferOutput<
	typeof VDbQueryUniverseDateTime
>;

export const VDbQuerySelectTeam = array(
	intersect([
		object({
			city: pick(VDbCities, ["name"]),
		}),
		pick(VDbTeams, ["idTeam", "nickname"]),
	]),
);
export type TDbQuerySelectTeam = InferOutput<typeof VDbQuerySelectTeam>;

export const VDbQuerySelectLeague = array(
	pick(VDbLeagues, ["idLeague", "name"]),
);
export type TDbQuerySelectLeague = InferOutput<typeof VDbQuerySelectLeague>;

export const VDbQueryLeagueGameGroupLeaders = array(
	intersect([
		object({
			numRank: number(),
			statCategory: picklist(["batting", "pitching"]),
			statType: picklist([
				"avg",
				"bb/9",
				"era",
				"hr",
				"k/9",
				"k/bb",
				"rbi",
				"sb",
			]),
			statValue: number(),
			team: object({
				city: pick(VDbCities, ["name"]),
				idTeam: number(),
				nickname: VDbTeams.entries.nickname,
			}),
		}),
		pick(VDbPersons, ["firstName", "idPerson", "lastName"]),
	]),
);
export type TDbQueryLeagueGameGroupLeaders = InferOutput<
	typeof VDbQueryLeagueGameGroupLeaders
>;
