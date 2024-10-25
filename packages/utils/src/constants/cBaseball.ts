export const PITCHES_THROWN_STANDARD_MAX = 120;

export const PITCH_IN_PLAY_EVENTS = [
	"caughtStealing2B",
	"double",
	"doublePlay",
	"fieldError",
	"fieldersChoice",
	"fieldersChoiceOut",
	"fieldOut",
	"forceOut",
	"groundedIntoDoublePlay",
	"hitByPitch",
	"homeRun",
	"intentionalWalk",
	"otherOut",
	"pickoff1B",
	"pickoff2B",
	"runnerDoublePlay",
	"sacBunt",
	"sacFly",
	"single",
	"strikeout",
	"strikeoutDoublePlay",
	"triple",
	"triplePlay",
	"walk",
	"wildPitch",
] as const;

export const PITCH_NAMES = [
	"changeup",
	"curveball",
	"cutter",
	"eephus",
	"fastball",
	"forkball",
	"knuckleball",
	"knuckleCurve",
	"screwball",
	"sinker",
	"slider",
	"slurve",
	"splitter",
	"sweeper",
] as const;

export const PITCH_OUTCOMES = ["BALL", "IN_PLAY", "STRIKE"] as const;

export const POSITIONS = [
	"p",
	"c",
	"fb",
	"sb",
	"tb",
	"ss",
	"lf",
	"cf",
	"rf",
] as const;