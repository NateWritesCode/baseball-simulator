import {
	type InferOutput,
	array,
	instance,
	intersect,
	literal,
	null_,
	nullable,
	number,
	object,
	pick,
	picklist,
	record,
	string,
	union,
	variant,
} from "valibot";
import GameSimPlayerState from "../entities/eGameSimPlayerState";
import GameSimTeamState from "../entities/eGameSimTeamState";
import { VDbPitchLocation, VDbPlayers, VGameSimBoxScore } from "./tDb";
import { VPicklistPitchNames, VPicklistPitchOutcomes } from "./tPicklist";

export const VPicklistGameSimWeatherWindDirection = picklist([
	"N",
	"NE",
	"E",
	"SE",
	"S",
	"SW",
	"W",
	"NW",
]);
export type TPicklistGameSimWeatherWindDirection = InferOutput<
	typeof VPicklistGameSimWeatherWindDirection
>;

export const VGameSimWeatherConditions = object({
	cloudCover: number(),
	humidity: number(),
	precipitation: number(),
	snow: number(),
	temperature: number(),
	windDescription: VPicklistGameSimWeatherWindDirection,
	windDirection: number(),
	windSpeed: number(),
});
export type TGameSimWeatherConditions = InferOutput<
	typeof VGameSimWeatherConditions
>;

export const VGameSimEventAtBatEnd = object({
	data: object({
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("atBatEnd"),
});

export type TGameSimEventAtBatEnd = InferOutput<typeof VGameSimEventAtBatEnd>;

export const VGameSimEventAtBatStart = object({
	data: object({
		playerHitter: instance(GameSimPlayerState),
		playerPitcher: instance(GameSimPlayerState),
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("atBatStart"),
});

export type TGameSimEventAtBatStart = InferOutput<
	typeof VGameSimEventAtBatStart
>;

export const VGameSimEventDouble = object({
	data: object({
		playerHitter: instance(GameSimPlayerState),
		playerPitcher: instance(GameSimPlayerState),
		playerRunner1: nullable(instance(GameSimPlayerState)),
		playerRunner2: nullable(instance(GameSimPlayerState)),
		playerRunner3: nullable(instance(GameSimPlayerState)),
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("double"),
});

export type TGameSimEventDouble = InferOutput<typeof VGameSimEventDouble>;

export const VGameSimEventFoul = object({
	data: object({
		playerHitter: instance(GameSimPlayerState),
		playerPitcher: instance(GameSimPlayerState),
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("foul"),
});

export const VGameSimEventGameStart = object({
	data: object({
		dateTime: string(),
		weather: VGameSimWeatherConditions,
	}),
	gameSimEvent: literal("gameStart"),
});

export type TGameSimEventGameStart = InferOutput<typeof VGameSimEventGameStart>;

export const VGameSimEventGameEnd = object({
	data: object({
		dateTime: string(),
	}),
	gameSimEvent: literal("gameEnd"),
});

export type TGameSimEventGameEnd = InferOutput<typeof VGameSimEventGameEnd>;

export const VGameSimEventHalfInningEnd = object({
	data: object({
		playerRunner1: nullable(instance(GameSimPlayerState)),
		playerRunner2: nullable(instance(GameSimPlayerState)),
		playerRunner3: nullable(instance(GameSimPlayerState)),
	}),
	gameSimEvent: literal("halfInningEnd"),
});

export type TGameSimEventHalfInningEnd = InferOutput<
	typeof VGameSimEventHalfInningEnd
>;

export const VGameSimEventHalfInningStart = object({
	data: object({
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("halfInningStart"),
});

export type TGameSimEventHalfInningStart = InferOutput<
	typeof VGameSimEventHalfInningStart
>;

export const VGameSimHitByPitch = object({
	data: object({
		playerHitter: instance(GameSimPlayerState),
		playerPitcher: instance(GameSimPlayerState),
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("hitByPitch"),
});

export const VGameSimEventHomeRun = object({
	data: object({
		playerHitter: instance(GameSimPlayerState),
		playerPitcher: instance(GameSimPlayerState),
		playerRunner1: nullable(instance(GameSimPlayerState)),
		playerRunner2: nullable(instance(GameSimPlayerState)),
		playerRunner3: nullable(instance(GameSimPlayerState)),
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("homeRun"),
});

export type TGameSimEventHomeRun = InferOutput<typeof VGameSimEventHomeRun>;

export const VGameSimEventOut = object({
	data: object({
		playerHitter: instance(GameSimPlayerState),
		playerPitcher: instance(GameSimPlayerState),
		playerRunner1: nullable(instance(GameSimPlayerState)),
		playerRunner2: nullable(instance(GameSimPlayerState)),
		playerRunner3: nullable(instance(GameSimPlayerState)),
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("out"),
});

export type TGameSimEventOut = InferOutput<typeof VGameSimEventOut>;

export const VGameSimEventPitch = object({
	data: object({
		playerHitter: instance(GameSimPlayerState),
		pitchLocation: VDbPitchLocation,
		pitchName: VPicklistPitchNames,
		pitchOutcome: VPicklistPitchOutcomes,
		playerPitcher: instance(GameSimPlayerState),
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("pitch"),
});

export type TGameSimEventPitch = InferOutput<typeof VGameSimEventPitch>;

export const VGameSimEventRun = object({
	data: object({
		playerHitter: instance(GameSimPlayerState),
		playerPitcher: instance(GameSimPlayerState),
		playerRunner: instance(GameSimPlayerState),
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("run"),
});

export type TGameSimEventRun = InferOutput<typeof VGameSimEventRun>;

export const VGameSimEventSingle = object({
	data: object({
		playerHitter: instance(GameSimPlayerState),
		playerPitcher: instance(GameSimPlayerState),
		playerRunner1: nullable(instance(GameSimPlayerState)),
		playerRunner2: nullable(instance(GameSimPlayerState)),
		playerRunner3: nullable(instance(GameSimPlayerState)),
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("single"),
});

export type TGameSimEventSingle = InferOutput<typeof VGameSimEventSingle>;

export const VGameSimStrikeout = object({
	data: object({
		playerHitter: instance(GameSimPlayerState),
		playerPitcher: instance(GameSimPlayerState),
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("strikeout"),
});

export type TGameSimStrikeout = InferOutput<typeof VGameSimStrikeout>;

export const VGameSimEventTriple = object({
	data: object({
		playerHitter: instance(GameSimPlayerState),
		playerPitcher: instance(GameSimPlayerState),
		playerRunner1: nullable(instance(GameSimPlayerState)),
		playerRunner2: nullable(instance(GameSimPlayerState)),
		playerRunner3: nullable(instance(GameSimPlayerState)),
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("triple"),
});

export type TGameSimEventTriple = InferOutput<typeof VGameSimEventTriple>;

export const VGameSimWalk = object({
	data: object({
		playerHitter: instance(GameSimPlayerState),
		playerPitcher: instance(GameSimPlayerState),
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("walk"),
});

export type TGameSimWalk = InferOutput<typeof VGameSimWalk>;

export const VGameSimEvent = variant("gameSimEvent", [
	VGameSimEventAtBatEnd,
	VGameSimEventAtBatStart,
	VGameSimEventDouble,
	VGameSimEventFoul,
	VGameSimEventGameStart,
	VGameSimEventGameEnd,
	VGameSimEventHalfInningEnd,
	VGameSimEventHalfInningStart,
	VGameSimHitByPitch,
	VGameSimEventHomeRun,
	VGameSimEventOut,
	VGameSimEventPitch,
	VGameSimEventRun,
	VGameSimEventSingle,
	VGameSimStrikeout,
	VGameSimEventTriple,
	VGameSimWalk,
]);

export type TGameSimEvent = InferOutput<typeof VGameSimEvent>;

export interface OGameSimObserver {
	notifyGameEvent(input: TGameSimEvent): void;
}

const VGameSimBattingStatistics = object({
	ab: number(),
	doubles: number(),
	h: number(),
	hr: number(),
	k: number(),
	lob: number(),
	outs: number(),
	rbi: number(),
	runs: number(),
	singles: number(),
	triples: number(),
});

export type TGameSimBattingStatistics = InferOutput<
	typeof VGameSimBattingStatistics
>;

export const VGameSimPitchingStatistics = object({
	battersFaced: number(),
	bb: number(),
	doublesAllowed: number(),
	k: number(),
	pitchesThrown: number(),
	pitchesThrownBalls: number(),
	pitchesThrownInPlay: number(),
	pitchesThrownStrikes: number(),
	hitsAllowed: number(),
	hrsAllowed: number(),
	lob: number(),
	outs: number(),
	runs: number(),
	runsEarned: number(),
	singlesAllowed: number(),
	triplesAllowed: number(),
});
export type TGameSimPitchingStatistics = InferOutput<
	typeof VGameSimPitchingStatistics
>;

export const VGameSimResult = object({
	boxScore: VGameSimBoxScore,
	gameSimEvents: array(record(string(), union([string(), number(), null_()]))),
	idGame: number(),
	idGameGroup: nullable(number()),
	idTeamLosing: number(),
	idTeamWinning: number(),
	log: array(array(string())),
	players: array(
		intersect([
			pick(VDbPlayers, ["idPlayer"]),
			object({
				batting: VGameSimBattingStatistics,
				idGameGroup: nullable(number()),
				idTeam: nullable(number()),
				pitching: VGameSimPitchingStatistics,
			}),
		]),
	),
});

export type TGameSimResult = InferOutput<typeof VGameSimResult>;
