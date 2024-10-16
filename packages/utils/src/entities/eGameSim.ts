import {
	type InferInput,
	array,
	intersect,
	object,
	omit,
	parse,
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
} from "../types";
import type { OGameSimObserver } from "../types/tGameSim";

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
	teams: tuple([VConstructorGameSimTeam, VConstructorGameSimTeam]),
});

export type TConstructorGameSim = InferInput<typeof VConstructorGameSim>;

export default class GameSim {
	isNeutralPark: boolean;
	isTopOfInning: boolean;
	numBalls: number;
	numInning: number;
	numInningsInGame: number;
	numOuts: number;
	numStrikes: number;
	numTeamDefense: 0 | 1;
	numTeamOffense: 0 | 1;
	observers: OGameSimObserver[] = [];
	teams: [
		TConstructorGameSim["teams"][number],
		TConstructorGameSim["teams"][number],
	];

	constructor(_input: TConstructorGameSim) {
		const input = parse(VConstructorGameSim, _input);
		this.isNeutralPark = true;
		this.isTopOfInning = true;
		this.numBalls = 0;
		this.numInning = 1;
		this.numInningsInGame = 9;
		this.numOuts = 0;
		this.numStrikes = 0;
		this.numTeamDefense = 1;
		this.numTeamOffense = 0;

		// team0 is the away team, team1 is the home team
		this.teams = [input.teams[0], input.teams[1]];
	}
}
