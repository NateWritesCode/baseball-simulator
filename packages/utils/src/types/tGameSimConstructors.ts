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
} from "./tDb";

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
		players: array(VConstructorGameSimPlayer),
	}),
]);
export type TConstructorGameSimTeam = InferInput<
	typeof VConstructorGameSimTeam
>;

export const VConstructorGameSim = object({
	idGame: number(),
	teams: tuple([VConstructorGameSimTeam, VConstructorGameSimTeam]),
});

export type TConstructorGameSim = InferInput<typeof VConstructorGameSim>;
