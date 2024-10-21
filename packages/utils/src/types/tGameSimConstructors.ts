import {
	type InferInput,
	array,
	intersect,
	number,
	object,
	omit,
	pick,
	tuple,
} from "valibot";
import {
	VDbCities,
	VDbCoaches,
	VDbCoachesRatings,
	VDbPersons,
	VDbPersonsAlignment,
	VDbPersonsMental,
	VDbPersonsMyersBriggs,
	VDbPersonsPhysical,
	VDbPlayers,
	VDbPlayersBatting,
	VDbPlayersFielding,
	VDbPlayersPitches,
	VDbPlayersPitching,
	VDbPlayersRunning,
	VDbTeams,
	VDbUmpires,
	VDbUmpiresRatings,
} from "./tDb";

export const VConstructorGameSimCoach = intersect([
	pick(VDbCoaches, ["idCoach", "idTeam"]),
	pick(VDbPersons, [
		"dateOfBirth",
		"firstName",
		"idPerson",
		"lastName",
		"middleName",
		"nickname",
	]),
	pick(VDbCoachesRatings, ["ability"]),
	object({
		alignment: omit(VDbPersonsAlignment, ["idPerson"]),
		mental: omit(VDbPersonsMental, ["idPerson"]),
		myersBriggs: omit(VDbPersonsMyersBriggs, ["idPerson"]),
		physical: omit(VDbPersonsPhysical, ["idPerson"]),
	}),
]);
export type TConstructorGameSimCoach = InferInput<
	typeof VConstructorGameSimCoach
>;

export const VConstructorGameSimPlayer = intersect([
	pick(VDbPlayers, ["idPlayer", "idTeam"]),
	pick(VDbPersons, [
		"dateOfBirth",
		"firstName",
		"idPerson",
		"lastName",
		"middleName",
		"nickname",
	]),
	object({
		alignment: omit(VDbPersonsAlignment, ["idPerson"]),
		batting: omit(VDbPlayersBatting, ["idPlayer"]),
		fielding: omit(VDbPlayersFielding, ["idPlayer"]),
		mental: omit(VDbPersonsMental, ["idPerson"]),
		myersBriggs: omit(VDbPersonsMyersBriggs, ["idPerson"]),
		physical: omit(VDbPersonsPhysical, ["idPerson"]),
		pitches: omit(VDbPlayersPitches, ["idPlayer"]),
		pitching: omit(VDbPlayersPitching, ["idPlayer"]),
		running: omit(VDbPlayersRunning, ["idPlayer"]),
	}),
]);
export type TConstructorGameSimPlayer = InferInput<
	typeof VConstructorGameSimPlayer
>;

export const VConstructorGameSimTeam = intersect([
	pick(VDbTeams, ["idTeam", "nickname"]),
	object({
		city: pick(VDbCities, ["name"]),
		coaches: array(VConstructorGameSimCoach),
		players: array(VConstructorGameSimPlayer),
	}),
]);
export type TConstructorGameSimTeam = InferInput<
	typeof VConstructorGameSimTeam
>;

export const VConstructorGameSimUmpire = intersect([
	pick(VDbUmpires, ["idUmpire"]),
	pick(VDbUmpiresRatings, [
		"balkAccuracy",
		"checkSwingAccuracy",
		"consistency",
		"expandedZone",
		"favorFastballs",
		"favorOffspeed",
		"highZone",
		"insideZone",
		"lowZone",
		"outsideZone",
		"pitchFramingInfluence",
		"reactionTime",
	]),
	pick(VDbPersons, [
		"dateOfBirth",
		"firstName",
		"idPerson",
		"lastName",
		"middleName",
		"nickname",
	]),
	object({
		alignment: omit(VDbPersonsAlignment, ["idPerson"]),
		batting: omit(VDbPlayersBatting, ["idPlayer"]),
		fielding: omit(VDbPlayersFielding, ["idPlayer"]),
		mental: omit(VDbPersonsMental, ["idPerson"]),
		myersBriggs: omit(VDbPersonsMyersBriggs, ["idPerson"]),
		physical: omit(VDbPersonsPhysical, ["idPerson"]),
		pitches: omit(VDbPlayersPitches, ["idPlayer"]),
		pitching: omit(VDbPlayersPitching, ["idPlayer"]),
		running: omit(VDbPlayersRunning, ["idPlayer"]),
	}),
]);
export type TConstructorGameSimUmpire = InferInput<
	typeof VConstructorGameSimUmpire
>;

export const VConstructorGameSim = object({
	idGame: number(),
	teams: tuple([VConstructorGameSimTeam, VConstructorGameSimTeam]),
	umpires: tuple([
		VConstructorGameSimUmpire,
		VConstructorGameSimUmpire,
		VConstructorGameSimUmpire,
		VConstructorGameSimUmpire,
	]),
});

export type TConstructorGameSim = InferInput<typeof VConstructorGameSim>;
