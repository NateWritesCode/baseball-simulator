import {
	type InferOutput,
	instance,
	literal,
	null_,
	nullable,
	nullish,
	number,
	object,
	variant,
} from "valibot";
import GameSimPlayerState from "../entities/eGameSimPlayerState";
import GameSimTeamState from "../entities/eGameSimTeamState";
import { VPicklistPitchNames, VPicklistPitchOutcomes } from "./tPicklist";

export const VGameSimEventAtBatEnd = object({
	data: object({
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("atBatEnd"),
});

export type TGameSimEventAtBatEnd = InferOutput<typeof VGameSimEventAtBatEnd>;

export const VGameSimEventAtBatStart = object({
	data: nullish(null_()),
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

export const VGameSimEventGameStart = object({
	data: nullish(null_()),
	gameSimEvent: literal("gameStart"),
});

export type TGameSimEventGameStart = InferOutput<typeof VGameSimEventGameStart>;

export const VGameSimEventGameEnd = object({
	data: nullish(null_()),
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

export const VGameSimEventPitchLocation = object({
	ax: number(),
	ay: number(),
	az: number(),
	pfxX: number(),
	pfxZ: number(),
	plateX: number(),
	plateZ: number(),
	releaseSpeed: number(),
	releasePosX: number(),
	releasePosY: number(),
	releasePosZ: number(),
	szBot: number(),
	szTop: number(),
	vx0: number(),
	vy0: number(),
	vz0: number(),
});

export type TGameSimEventPitchLocation = InferOutput<
	typeof VGameSimEventPitchLocation
>;

export const VGameSimEventPitch = object({
	data: object({
		playerHitter: instance(GameSimPlayerState),
		pitchLocation: VGameSimEventPitchLocation,
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
	VGameSimEventGameStart,
	VGameSimEventGameEnd,
	VGameSimEventHalfInningEnd,
	VGameSimEventHalfInningStart,
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
