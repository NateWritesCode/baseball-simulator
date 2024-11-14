import {
	type InferInput,
	type InferOutput,
	array,
	intersect,
	object,
	omit,
	pick,
} from "valibot";
import {
	VDbCities,
	VDbCountries,
	VDbGameGroupsStandings,
	VDbGames,
	VDbPersons,
	VDbPersonsAlignment,
	VDbPersonsMental,
	VDbPersonsMyersBriggs,
	VDbPersonsPhysical,
	VDbPlayers,
	VDbStates,
	VDbTeams,
} from "./tDb";
import {
	VDbQueryLeagueGameGroupLeaders,
	VDbQuerySelectLeague,
	VDbQuerySelectTeam,
	VDbQueryStandingsTeams,
	VDbQueryUniverseDateTime,
} from "./tDbQueries";

export const VApiResponseGetIdGame = intersect([
	pick(VDbGames, ["boxScore", "idGame"]),
]);

export type TApiResponseGetIdGame = InferOutput<typeof VApiResponseGetIdGame>;

export const VApiResponseGetPerson = array(
	intersect([pick(VDbPersons, ["firstName", "idPerson", "lastName"])]),
);
export type TApiResponseGetPerson = InferInput<typeof VApiResponseGetPerson>;

export const VApiResponseGetIdPerson = intersect([
	pick(VDbPersons, [
		"dateOfBirth",
		"firstName",
		"idPerson",
		"lastName",
		"middleName",
		"nickname",
	]),
	object({
		birthplace: object({
			city: pick(VDbCities, ["idCity", "name"]),
			country: pick(VDbCountries, ["idCountry", "name"]),
			state: pick(VDbStates, ["idState", "name"]),
		}),
	}),
	object({
		alignment: omit(VDbPersonsAlignment, ["idPerson"]),
	}),
	object({
		mental: omit(VDbPersonsMental, ["idPerson"]),
	}),
	object({
		myersBriggs: omit(VDbPersonsMyersBriggs, ["idPerson"]),
	}),
	object({
		physical: omit(VDbPersonsPhysical, ["idPerson"]),
	}),
]);

export type TApiResponseGetIdPerson = InferInput<
	typeof VApiResponseGetIdPerson
>;

export const VApiResponseGetPlayer = array(
	intersect([
		pick(VDbPersons, ["firstName", "lastName"]),
		pick(VDbPlayers, ["idPlayer"]),
	]),
);
export type TApiResponseGetPlayer = InferInput<typeof VApiResponseGetPlayer>;

export const VApiResponseGetIdPlayer = intersect([
	pick(VDbPlayers, ["idPlayer"]),
	pick(VDbPersons, ["firstName", "lastName"]),
]);

export type TApiResponseGetIdPlayer = InferInput<
	typeof VApiResponseGetIdPlayer
>;

export const VApiResponseGetStandings = array(
	intersect([
		VDbQueryStandingsTeams.item,
		pick(VDbGameGroupsStandings, ["w", "l"]),
	]),
);
export type TApiResponseGetStandings = InferInput<
	typeof VApiResponseGetStandings
>;

export const VApiResponseGetUniverse = VDbQueryUniverseDateTime;
export type TApiResponseGetUniverse = InferInput<
	typeof VApiResponseGetUniverse
>;

export const VApiResponsePostSelectTeam = VDbQuerySelectTeam;
export type TApiResponsePostSelectTeam = InferInput<
	typeof VApiResponsePostSelectTeam
>;

export const VApiResponsePostSelectLeague = VDbQuerySelectLeague;
export type TApiResponsePostSelectLeague = InferInput<
	typeof VApiResponsePostSelectLeague
>;

export const VApiResponsePostIdLeague = pick(VDbTeams, ["idLeague"]);
export type TApiResponsePostIdLeague = InferInput<
	typeof VApiResponsePostIdLeague
>;

export const VApiResponsePostIdTeam = pick(VDbTeams, ["idTeam"]);
export type TApiResponsePostIdTeam = InferInput<typeof VApiResponsePostIdTeam>;

export const VApiResponsePostIdLeagueIdGameGroupLeaders =
	VDbQueryLeagueGameGroupLeaders;
export type TApiResponsePostIdLeagueIdGameGroupLeaders = InferInput<
	typeof VApiResponsePostIdLeagueIdGameGroupLeaders
>;
