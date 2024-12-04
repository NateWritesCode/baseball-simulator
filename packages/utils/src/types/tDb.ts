import {
	type InferOutput,
	array,
	intersect,
	maxLength,
	minLength,
	nullable,
	number,
	object,
	pick,
	pipe,
	record,
	regex,
	string,
	transform,
} from "valibot";
import {
	VPicklistDirections,
	VPicklistHands,
	VPicklistLineupType,
	VPicklistPitchOutcomes,
	VPicklistPitchingStaffBullpenRole,
	VPicklistPitchingStaffRotationMode,
	VPicklistPositionsWithDh,
	VPicklistRoofType,
	VPicklistSurfaceType,
} from "./tPicklist";
import { VRegexDateTimeIsoString } from "./tRegex";

export const VDbPitchLocation = object({
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

export type TDbPitchLocation = InferOutput<typeof VDbPitchLocation>;

export const VDbGameGroupsStandings = object({
	idDivision: nullable(number()),
	idLeague: number(),
	idSubLeague: nullable(number()),
	l: number(),
	w: number(),
});

export const VDbGameGroups = object({
	idGameGroup: number(),
	idLeague: number(),
	name: string(),
	standings: pipe(
		nullable(string()),
		transform((input) => {
			if (input) {
				return JSON.parse(input);
			}

			return null;
		}),
		record(string(), VDbGameGroupsStandings),
	),
});

export const VGameSimBoxScore = object({
	dateTimeEnd: string(),
	dateTimeStart: string(),
	idGame: number(),
	inningRuns: array(array(number())),
	park: string(),
	pitcherLoss: object({
		idPlayer: number(),
		firstName: string(),
		lastName: string(),
	}),
	pitcherWin: object({
		idPlayer: number(),
		firstName: string(),
		lastName: string(),
	}),
	teamAway: object({
		abbreviation: string(),
		city: string(),
		errors: number(),
		hits: number(),
		idTeam: number(),
		nickname: string(),
		runs: number(),
	}),
	teamHome: object({
		abbreviation: string(),
		city: string(),
		errors: number(),
		hits: number(),
		idTeam: number(),
		nickname: string(),
		runs: number(),
	}),
});

export type TGameSimBoxScore = InferOutput<typeof VGameSimBoxScore>;

export const VDbCities = object({
	idCity: number(),
	idState: number(),
	latitude: number(),
	longitude: number(),
	name: string(),
});

export const VDbCoaches = object({
	idCoach: number(),
	idPerson: number(),
	idTeam: nullable(number()),
});

export const VDbCoachesRatings = object({
	ability: number(),
	idCoach: number(),
});

export const VDbContinents = object({
	abbreviation: string(),
	idContinent: number(),
	name: string(),
});

export const VDbCountries = object({
	abbreviation: string(),
	idContinent: number(),
	idCountry: number(),
	name: string(),
});

export const VDbDivisions = object({
	abbreviation: string(),
	direction: nullable(VPicklistDirections),
	idDivision: number(),
	idLeague: number(),
	idSubLeague: number(),
	name: string(),
});

// const boxScore = {
// 	dateTimeEnd: this.dateTimeEnd,
// 	dateTimeStart: this.dateTimeStart,
// 	idGame: this.idGame,
// 	inningRuns: this.inningRuns,
// 	park: this.park.park.name,
// 	pitcherLoss: {
// 		idPlayer: pitcherLoss.player.idPlayer,
// 		name: `${pitcherLoss.player.firstName} ${pitcherLoss.player.lastName}`,
// 	},
// 	pitcherWin: {
// 		idPlayer: pitcherWin.player.idPlayer,
// 		name: `${pitcherWin.player.firstName} ${pitcherWin.player.lastName}`,
// 	},
// 	teamAway: {
// 		city: this.teamAway.team.city.name,
// 		errors: this.teamAway.statistics.fielding.e,
// 		hits: this.teamAway.statistics.batting.h,
// 		nickname: this.teamAway.team.nickname,
// 		runs: this.teamAway.statistics.batting.runs,
// 	},
// 	teamHome: {
// 		city: this.teamHome.team.city.name,
// 		errors: this.teamHome.statistics.fielding.e,
// 		hits: this.teamHome.statistics.batting.h,
// 		nickname: this.teamHome.team.nickname,
// 		runs: this.teamHome.statistics.batting.runs,
// 	},
// };

export const VDbGames = object({
	boxScore: nullable(
		pipe(
			string(),
			transform((input) => JSON.parse(input)),
			VGameSimBoxScore,
		),
	),
	dateTime: string(),
	idGame: number(),
	idGameGroup: number(),
	idTeamAway: number(),
	idTeamHome: number(),
});

export const VDbGameSimEvents = object({
	gameSimEvent: string(),
	idGame: number(),
	idGameSimEvent: number(),
	idPlayerHitter: nullable(number()),
	idPlayerPitcher: nullable(number()),
	idPlayerRunner1: nullable(number()),
	idPlayerRunner2: nullable(number()),
	idPlayerRunner3: nullable(number()),
	idTeamDefense: number(),
	idTeamOffense: number(),
	pitchLocation: pipe(
		nullable(string()),
		transform((input) => {
			if (input) {
				return JSON.parse(input);
			}

			return null;
		}),
		nullable(VDbPitchLocation),
	),
	pitchName: nullable(string()),
	pitchOutcome: nullable(VPicklistPitchOutcomes),
});

export const VDbLeagues = object({
	abbreviation: string(),
	idLeague: number(),
	name: string(),
});

export const VDbPlayers = object({
	bats: VPicklistHands,
	idPerson: number(),
	idPlayer: number(),
	idTeam: nullable(number()),
	throws: VPicklistHands,
});

export const VDParks = object({
	backstopDistance: number(),
	capacityMax: number(),
	centerFieldDirection: number(),
	idCity: number(),
	idPark: number(),
	idTeam: nullable(number()),
	name: string(),
	roofType: VPicklistRoofType,
	surfaceType: VPicklistSurfaceType,
});

export const VDbParksFieldCoordinates = object({
	basePath: number(),
	batterLeftX: number(),
	batterLeftY: number(),
	batterRightX: number(),
	batterRightY: number(),
	coachesBoxFirstX: number(),
	coachesBoxFirstY: number(),
	coachesBoxThirdX: number(),
	coachesBoxThirdY: number(),
	firstBaseX: number(),
	firstBaseY: number(),
	foulLineLeftFieldX: number(),
	foulLineLeftFieldY: number(),
	foulLineRightFieldX: number(),
	foulLineRightFieldY: number(),
	homePlateX: number(),
	homePlateY: number(),
	idPark: number(),
	onDeckLeftX: number(),
	onDeckLeftY: number(),
	onDeckRightX: number(),
	onDeckRightY: number(),
	pitchersPlateX: number(),
	pitchersPlateY: number(),
	secondBaseX: number(),
	secondBaseY: number(),
	thirdBaseX: number(),
	thirdBaseY: number(),
});

export const VDbParksWallSegments = object({
	height: number(),
	idPark: number(),
	idWallSegment: number(),
	segmentEndX: number(),
	segmentEndY: number(),
	segmentStartX: number(),
	segmentStartY: number(),
});

export const VDbPersons = object({
	biography: string(),
	dateOfBirth: pipe(string(), regex(/^\d{4}-\d{2}-\d{2}$/)),
	firstName: string(),
	idPerson: number(),
	lastName: string(),
	middleName: nullable(string()),
	nickname: nullable(string()),
});

export const VDbPersonsAlignment = object({
	chaotic: number(),
	evil: number(),
	good: number(),
	idPerson: number(),
	lawful: number(),
	neutralMorality: number(),
	neutralOrder: number(),
});
export const VDbPersonsMental = object({
	charisma: number(),
	constitution: number(),
	idPerson: number(),
	intelligence: number(),
	loyalty: number(),
	wisdom: number(),
	workEthic: number(),
});
export const VDbPersonsMyersBriggs = object({
	extroversion: number(),
	feeling: number(),
	idPerson: number(),
	introversion: number(),
	intuition: number(),
	judging: number(),
	perceiving: number(),
	sensing: number(),
	thinking: number(),
});
export const VDbPersonsPhysical = object({
	height: number(),
	idPerson: number(),
	weight: number(),
});

export const VDbPlayersBatting = object({
	avoidKs: number(),
	avoidKsVL: number(),
	avoidKsVR: number(),
	contact: number(),
	contactVL: number(),
	contactVR: number(),
	eye: number(),
	eyeVL: number(),
	eyeVR: number(),
	gap: number(),
	gapVL: number(),
	gapVR: number(),
	idPlayer: number(),
	power: number(),
	powerVL: number(),
	powerVR: number(),
});

export const VDbPlayersFielding = object({
	c: number(),
	catcherAbility: number(),
	catcherArm: number(),
	catcherFraming: number(),
	cf: number(),
	fb: number(),
	idPlayer: number(),
	infieldArm: number(),
	infieldError: number(),
	infieldRange: number(),
	infieldDoublePlay: number(),
	lf: number(),
	outfieldArm: number(),
	outfieldError: number(),
	outfieldRange: number(),
	rf: number(),
	sb: number(),
	ss: number(),
	tb: number(),
});

export const VDbPlayersPitching = object({
	control: number(),
	controlVL: number(),
	controlVR: number(),
	idPlayer: number(),
	movement: number(),
	movementVL: number(),
	movementVR: number(),
	stamina: number(),
	stuff: number(),
	stuffVL: number(),
	stuffVR: number(),
});

export const VDbPlayersPitches = object({
	changeup: number(),
	curveball: number(),
	cutter: number(),
	eephus: number(),
	fastball: number(),
	forkball: number(),
	idPlayer: number(),
	knuckleball: number(),
	knuckleCurve: number(),
	screwball: number(),
	sinker: number(),
	slider: number(),
	slurve: number(),
	splitter: number(),
	sweeper: number(),
});

export const VDbPlayersRunning = object({
	baserunning: number(),
	idPlayer: number(),
	speed: number(),
	stealing: number(),
});

export const VDbStates = object({
	abbreviation: string(),
	idCountry: number(),
	idState: number(),
	name: string(),
});

export const VDbStatisticsPlayerGameGroupBatting = object({
	ab: number(),
	doubles: number(),
	h: number(),
	hr: number(),
	idGameGroup: number(),
	idPlayer: number(),
	idTeam: number(),
	k: number(),
	lob: number(),
	outs: number(),
	rbi: number(),
	runs: number(),
	singles: number(),
	triples: number(),
});

export const VDbStatisticsPlayerGameGroupFielding = object({
	errors: number(),
	idGameGroup: number(),
	idPlayer: number(),
	idTeam: number(),
});

export const VDbStatisticsPlayerGameGroupPitching = object({
	battersFaced: number(),
	bb: number(),
	doublesAllowed: number(),
	hitsAllowed: number(),
	hr: number(),
	idGameGroup: number(),
	idPlayer: number(),
	idTeam: number(),
	lob: number(),
	outs: number(),
	pitchesThrown: number(),
	pitchesThrownBalls: number(),
	pitchesThrownInPlay: number(),
	pitchesThrownStrikes: number(),
	runs: number(),
	runsEarned: number(),
	singlesAllowed: number(),
	triplesAllowed: number(),
});

export const VDbSubLeagues = object({
	abbreviation: string(),
	idLeague: number(),
	idSubLeague: number(),
	name: string(),
});

export const VDbTeams = object({
	abbreviation: string(),
	colorPrimary: string(),
	colorSecondary: string(),
	idCity: number(),
	idDivision: number(),
	idLeague: number(),
	idTeam: number(),
	idSubLeague: number(),
	nickname: string(),
});

export const VDbUmpires = object({
	idPerson: number(),
	idUmpire: number(),
});

export const VDbUmpiresRatings = object({
	balkAccuracy: number(),
	checkSwingAccuracy: number(),
	consistency: number(),
	expandedZone: number(),
	favorFastballs: number(),
	favorOffspeed: number(),
	highZone: number(),
	idUmpire: number(),
	insideZone: number(),
	lowZone: number(),
	outsideZone: number(),
	pitchFramingInfluence: number(),
	reactionTime: number(),
});

export const VDbUniverse = object({
	dateTime: pipe(
		string(),
		transform((input) => new Date(input).toISOString()),
		VRegexDateTimeIsoString,
	),
});

export const VDbLineup = pipe(
	string(),
	transform((input) => {
		if (input) {
			return JSON.parse(input);
		}

		return null;
	}),
	pipe(
		array(
			intersect([
				pick(VDbPlayers, ["idPlayer"]),
				object({
					position: VPicklistPositionsWithDh,
				}),
			]),
		),
		minLength(8, "Lineup must have 8 players"),
		maxLength(9, "Lineup must have 9 players"),
	),
);

export const VDbPitchingStaff = pipe(
	string(),
	transform((input) => {
		if (input) {
			return JSON.parse(input);
		}

		return null;
	}),
	object({
		bullpen: array(
			intersect([
				pick(VDbPlayers, ["idPlayer"]),
				object({
					role: VPicklistPitchingStaffBullpenRole,
				}),
			]),
		),
		rotation: array(pick(VDbPlayers, ["idPlayer"])),
		rotationMode: VPicklistPitchingStaffRotationMode,
	}),
);

export const VDbTeamPitchingStaffs = intersect([
	pick(VDbTeams, ["idTeam"]),
	VDbPitchingStaff,
]);

export const VDbTeamLineups = intersect([
	pick(VDbTeams, ["idTeam"]),
	object({ lineup: VDbLineup, lineupType: VPicklistLineupType }),
]);
