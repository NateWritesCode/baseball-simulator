import {
	type InferOutput,
	array,
	intersect,
	nullable,
	object,
	pick,
} from "valibot";
import {
	VDbCities,
	VDbDivisions,
	VDbGameGroups,
	VDbLeagues,
	VDbSubLeagues,
	VDbTeams,
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
