import {
	type InferInput,
	array,
	intersect,
	nullable,
	number,
	object,
	omit,
	pick,
	string,
	tuple,
} from "valibot";
import {
	VDbCities,
	VDbCoaches,
	VDbCoachesRatings,
	VDbParksFieldCoordinates,
	VDbParksWallSegments,
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
import { VPicklistRoofType, VPicklistSurfaceType } from "./tPicklist";

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

export const VQueryConstructorGameSimPark = intersect([
	object({
		backstopDistance: number(),
		capacityMax: number(),
		centerFieldDirection: number(),
		idCity: number(),
		idPark: number(),
		idTeam: nullable(number()),
		name: string(),
		roofType: VPicklistRoofType,
		surfaceType: VPicklistSurfaceType,
	}),
	VDbParksFieldCoordinates,
	object({
		city: pick(VDbCities, ["latitude", "longitude", "idCity", "name"]),
	}),
]);

export const VConstructorGameSimParkWallSegments = object({
	wallSegments: array(VDbParksWallSegments),
});

export const VConstructorGameSimPark = intersect([
	VQueryConstructorGameSimPark,
	VConstructorGameSimParkWallSegments,
]);

export type TConstructorGameSimPark = InferInput<
	typeof VConstructorGameSimPark
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
	pick(VDbTeams, ["abbreviation", "idTeam", "nickname"]),
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
		mental: omit(VDbPersonsMental, ["idPerson"]),
		myersBriggs: omit(VDbPersonsMyersBriggs, ["idPerson"]),
		physical: omit(VDbPersonsPhysical, ["idPerson"]),
	}),
]);
export type TConstructorGameSimUmpire = InferInput<
	typeof VConstructorGameSimUmpire
>;

export const VConstructorGameSim = object({
	dateTime: string(),
	idGame: number(),
	idGameGroup: nullable(number()),
	park: VConstructorGameSimPark,
	teams: tuple([VConstructorGameSimTeam, VConstructorGameSimTeam]),
	umpires: tuple([
		VConstructorGameSimUmpire,
		VConstructorGameSimUmpire,
		VConstructorGameSimUmpire,
		VConstructorGameSimUmpire,
	]),
});

export type TConstructorGameSim = InferInput<typeof VConstructorGameSim>;
