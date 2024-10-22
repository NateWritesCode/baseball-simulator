import { nullable, number, object, pipe, regex, string } from "valibot";
import { VPicklistRoofType, VPicklistSurfaceType } from "./tPicklist";

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

export const VDbGames = object({
	dateTime: string(),
	idGame: number(),
	idTeamAway: number(),
	idTeamHome: number(),
});

export const VDbPlayers = object({
	idPerson: number(),
	idPlayer: number(),
	idTeam: nullable(number()),
});

export const VDParks = object({
	backstopDistance: number(),
	capacityMax: number(),
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
