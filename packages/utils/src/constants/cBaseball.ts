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

export const PITCH_OUTCOMES = [
	"ball",
	"catcherInterference",
	"hitByPitch",
	"inPlay",
	"strikeCalled",
	"strikeSwinging",
] as const;

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

export const POSITIONS_WITH_DH = [...POSITIONS, "dh"] as const;

export const GAME_SIM_EVENTS = [
	"atBatStart",
	"atBatEnd",
	"balk",
	"ball",
	"catcherInterference",
	"double",
	"foul",
	"gameStart",
	"gameEnd",
	"halfInningEnd",
	"halfInningStart",
	"hitByPitch",
	"homeRun",
	"out",
	"pitch",
	"run",
	"single",
	"stealAttempt",
	"steal",
	"stealCaught",
	"strikeCalled",
	"strikeSwinging",
	"strikeout",
	"triple",
	"walk",
] as const;

export const HANDS = ["r", "l", "s"] as const;

export const LINEUP_TYPE = ["r", "l", "rDh", "lDh"] as const;

export const PITCHING_STAFF_ROTATION_MODE = [
	"highestRested",
	"strict",
] as const;

export const PITCHING_STAFF_BULLPEN_ROLE = [
	"closer",
	"setup",
	"middle",
	"long",
	"spot",
] as const;
