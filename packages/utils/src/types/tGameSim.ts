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

const VGameSimEventAtBatEnd = object({
	data: object({
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("atBatEnd"),
});

const VGameSimEventAtBatStart = object({
	data: nullish(null_()),
	gameSimEvent: literal("atBatStart"),
});

const VGameSimEventDouble = object({
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

const VGameSimEventGameStart = object({
	data: nullish(null_()),
	gameSimEvent: literal("gameStart"),
});

const VGameSimEventGameEnd = object({
	data: nullish(null_()),
	gameSimEvent: literal("gameEnd"),
});

const VGameSimEventHalfInningEnd = object({
	data: object({
		playerRunner1: nullable(instance(GameSimPlayerState)),
		playerRunner2: nullable(instance(GameSimPlayerState)),
		playerRunner3: nullable(instance(GameSimPlayerState)),
	}),
	gameSimEvent: literal("halfInningEnd"),
});

const VGameSimEventHalfInningStart = object({
	data: object({
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("halfInningStart"),
});

const VGameSimEventHomeRun = object({
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

const VGameSimEventOut = object({
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

const VGameSimEventPitch = object({
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

const VGameSimEventRun = object({
	data: object({
		playerHitter: instance(GameSimPlayerState),
		playerPitcher: instance(GameSimPlayerState),
		playerRunner: instance(GameSimPlayerState),
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("run"),
});

const VGameSimEventSingle = object({
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

const VGameSimStrikeout = object({
	data: object({
		playerHitter: instance(GameSimPlayerState),
		playerPitcher: instance(GameSimPlayerState),
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("strikeout"),
});

const VGameSimEventTriple = object({
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

const VGameSimWalk = object({
	data: object({
		playerHitter: instance(GameSimPlayerState),
		playerPitcher: instance(GameSimPlayerState),
		teamDefense: instance(GameSimTeamState),
		teamOffense: instance(GameSimTeamState),
	}),
	gameSimEvent: literal("walk"),
});

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
