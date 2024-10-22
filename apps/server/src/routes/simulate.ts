import { GameSim } from "@baseball-simulator/utils/entities";
import { handleValibotParse } from "@baseball-simulator/utils/functions";
import {
	VConstructorGameSimCoach,
	VConstructorGameSimUmpire,
	VDbCities,
	VDbGames,
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
	VQueryConstructorGameSimPark,
} from "@baseball-simulator/utils/types";
import type { TMiddleware } from "@server/server";
import { Hono } from "hono";
import { array, intersect, object, omit, pick } from "valibot";

const VGames = array(VDbGames);

const queryGames = /* sql */ `
    with myUniverse as (
        select
            dateTime
        from
            universe
    )
    select
        dateTime,
        idGame,
        idTeamAway,
        idTeamHome
    from
        games
    where
        dateTime = (select dateTime from myUniverse)
    ;
`;

const simulate = new Hono<{ Variables: TMiddleware["Variables"] }>().post(
	"/simulate",
	async (c) => {
		const db = c.var.db;

		const [dataGames, errorGames] = handleValibotParse({
			data: db.prepare(queryGames).all(),
			schema: VGames,
		});

		if (errorGames || !dataGames) {
			return c.text("Internal Server Error", 500);
		}

		const paramsTeams = dataGames
			.map((game) => game.idTeamAway)
			.concat(dataGames.map((game) => game.idTeamHome))
			.map((idTeam) => idTeam);

		const queryTeams = /* sql */ `
            select
                idTeam,
                cities.name as 'city.name',
                nickname
            from
                teams
            inner join
                cities on teams.idCity = cities.idCity
            where
                idTeam in (${paramsTeams.map(() => "?").join(", ")})
            ;
        `;

		const prepareTeams = db.prepare(queryTeams);

		const [dataTeams, dataError] = handleValibotParse({
			data: prepareTeams.all(...paramsTeams),
			schema: array(
				intersect([
					pick(VDbTeams, ["idTeam", "nickname"]),
					object({
						city: pick(VDbCities, ["name"]),
					}),
				]),
			),
			shouldParseDotNotation: true,
		});

		if (dataError || !dataTeams) {
			return c.text("Internal Server Error", 500);
		}

		const queryPlayers = /* sql */ `
            select
                persons.dateOfBirth,
                persons.firstName,
                persons.idPerson,
                persons.lastName,
                persons.middleName,
                persons.nickname,
                players.idPlayer,
                players.idTeam,
                personsAlignment.chaotic as "alignment.chaotic",
                personsAlignment.evil as "alignment.evil",
                personsAlignment.good as "alignment.good",
                personsAlignment.lawful as "alignment.lawful",
                personsAlignment.neutralMorality as "alignment.neutralMorality",
                personsAlignment.neutralOrder as "alignment.neutralOrder",
                personsMyersBriggs.extroversion as "myersBriggs.extroversion",
                personsMyersBriggs.feeling as "myersBriggs.feeling",
                personsMyersBriggs.introversion as "myersBriggs.introversion",
                personsMyersBriggs.intuition as "myersBriggs.intuition",
                personsMyersBriggs.judging as "myersBriggs.judging",
                personsMyersBriggs.perceiving as "myersBriggs.perceiving",
                personsMyersBriggs.sensing as "myersBriggs.sensing",
                personsMyersBriggs.thinking as "myersBriggs.thinking",
                personsMental.charisma as "mental.charisma",
                personsMental.constitution as "mental.constitution",
                personsMental.intelligence as "mental.intelligence",
                personsMental.loyalty as "mental.loyalty",
                personsMental.wisdom as "mental.wisdom",
                personsMental.workEthic as "mental.workEthic",
                personsPhysical.height as "physical.height",
                personsPhysical.weight as "physical.weight",
                playersBatting.avoidKs as "batting.avoidKs",
                playersBatting.avoidKsVL as "batting.avoidKsVL",
                playersBatting.avoidKsVR as "batting.avoidKsVR",
                playersBatting.contact as "batting.contact",
                playersBatting.contactVL as "batting.contactVL",
                playersBatting.contactVR as "batting.contactVR",
                playersBatting.eye as "batting.eye",
                playersBatting.eyeVL as "batting.eyeVL",
                playersBatting.eyeVR as "batting.eyeVR",
                playersBatting.gap as "batting.gap",
                playersBatting.gapVL as "batting.gapVL",
                playersBatting.gapVR as "batting.gapVR",
                playersBatting.power as "batting.power",
                playersBatting.powerVL as "batting.powerVL",
                playersBatting.powerVR as "batting.powerVR",
                playersFielding.c as "fielding.c",
                playersFielding.catcherAbility as "fielding.catcherAbility",
                playersFielding.catcherArm as "fielding.catcherArm",
                playersFielding.catcherFraming as "fielding.catcherFraming",
                playersFielding.cf as "fielding.cf",
                playersFielding.fb as "fielding.fb",
                playersFielding.infieldArm as "fielding.infieldArm",
                playersFielding.infieldError as "fielding.infieldError",
                playersFielding.infieldRange as "fielding.infieldRange",
                playersFielding.infieldDoublePlay as "fielding.infieldDoublePlay",
                playersFielding.lf as "fielding.lf",
                playersFielding.outfieldArm as "fielding.outfieldArm",
                playersFielding.outfieldError as "fielding.outfieldError",
                playersFielding.outfieldRange as "fielding.outfieldRange",
                playersFielding.rf as "fielding.rf",
                playersFielding.sb as "fielding.sb",
                playersFielding.ss as "fielding.ss",
                playersFielding.tb as "fielding.tb",
                playersPitching.control as "pitching.control",
                playersPitching.controlVL as "pitching.controlVL",
                playersPitching.controlVR as "pitching.controlVR",
                playersPitching.movement as "pitching.movement",
                playersPitching.movementVL as "pitching.movementVL",
                playersPitching.movementVR as "pitching.movementVR",
                playersPitching.stamina as "pitching.stamina",
                playersPitching.stuff as "pitching.stuff",
                playersPitching.stuffVL as "pitching.stuffVL",
                playersPitching.stuffVR as "pitching.stuffVR",
                playersPitches.changeup as "pitches.changeup",
                playersPitches.curveball as "pitches.curveball",
                playersPitches.cutter as "pitches.cutter",
                playersPitches.eephus as "pitches.eephus",
                playersPitches.fastball as "pitches.fastball",
                playersPitches.forkball as "pitches.forkball",
                playersPitches.knuckleball as "pitches.knuckleball",
                playersPitches.knuckleCurve as "pitches.knuckleCurve",
                playersPitches.screwball as "pitches.screwball",
                playersPitches.sinker as "pitches.sinker",
                playersPitches.slider as "pitches.slider",
                playersPitches.slurve as "pitches.slurve",
                playersPitches.splitter as "pitches.splitter",
                playersPitches.sweeper as "pitches.sweeper",
                playersRunning.baserunning as "running.baserunning",
                playersRunning.speed as "running.speed",
                playersRunning.stealing as "running.stealing"
            from
                players
            left join playersBatting on players.idPlayer = playersBatting.idPlayer
            left join playersFielding on players.idPlayer = playersFielding.idPlayer
            left join playersPitching on players.idPlayer = playersPitching.idPlayer
            left join playersPitches on players.idPlayer = playersPitches.idPlayer
            left join playersRunning on players.idPlayer = playersRunning.idPlayer
            left join persons on players.idPerson = persons.idPerson
            left join personsAlignment on persons.idPerson = personsAlignment.idPerson
            left join personsMyersBriggs on persons.idPerson = personsMyersBriggs.idPerson
            left join personsMental on persons.idPerson = personsMental.idPerson
            left join personsPhysical on persons.idPerson = personsPhysical.idPerson
            where
                players.idTeam in (${paramsTeams.map(() => "?").join(", ")})
            ;
`;

		const [dataPlayers, errorPlayers] = handleValibotParse({
			data: db.prepare(queryPlayers).all(...paramsTeams),
			schema: array(
				intersect([
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
				]),
			),
			shouldParseDotNotation: true,
		});

		if (errorPlayers || !dataPlayers) {
			return c.text("Internal Server Error", 500);
		}

		const queryCoaches = /* sql */ `
            select
                persons.dateOfBirth,
                persons.firstName,
                persons.idPerson,
                persons.lastName,
                persons.middleName,
                persons.nickname,
                personsAlignment.chaotic as "alignment.chaotic",
                personsAlignment.evil as "alignment.evil",
                personsAlignment.good as "alignment.good",
                personsAlignment.lawful as "alignment.lawful",
                personsAlignment.neutralMorality as "alignment.neutralMorality",
                personsAlignment.neutralOrder as "alignment.neutralOrder",
                personsMyersBriggs.extroversion as "myersBriggs.extroversion",
                personsMyersBriggs.feeling as "myersBriggs.feeling",
                personsMyersBriggs.introversion as "myersBriggs.introversion",
                personsMyersBriggs.intuition as "myersBriggs.intuition",
                personsMyersBriggs.judging as "myersBriggs.judging",
                personsMyersBriggs.perceiving as "myersBriggs.perceiving",
                personsMyersBriggs.sensing as "myersBriggs.sensing",
                personsMyersBriggs.thinking as "myersBriggs.thinking",
                personsMental.charisma as "mental.charisma",
                personsMental.constitution as "mental.constitution",
                personsMental.intelligence as "mental.intelligence",
                personsMental.loyalty as "mental.loyalty",
                personsMental.wisdom as "mental.wisdom",
                personsMental.workEthic as "mental.workEthic",
                personsPhysical.height as "physical.height",
                personsPhysical.weight as "physical.weight",
                coaches.idCoach,
                coaches.idPerson,
                coaches.idTeam,
                coachesRatings.ability
            from
                coaches
            inner join
                persons on coaches.idPerson = persons.idPerson
            inner join
                personsAlignment on persons.idPerson = personsAlignment.idPerson
            inner join
                personsMyersBriggs on persons.idPerson = personsMyersBriggs.idPerson
            inner join
                personsMental on persons.idPerson = personsMental.idPerson
            inner join
                personsPhysical on persons.idPerson = personsPhysical
            inner join
                coachesRatings on coaches.idCoach = coachesRatings.idCoach
            where
                coaches.idTeam in (${paramsTeams.map(() => "?").join(", ")})
            ;
        `;

		const [dataCoaches, errorCoaches] = handleValibotParse({
			data: db.prepare(queryCoaches).all(...paramsTeams),
			schema: array(VConstructorGameSimCoach),
			shouldParseDotNotation: true,
		});

		if (errorCoaches || !dataCoaches) {
			return c.text("Internal Server Error", 500);
		}

		const queryParks = /* sql */ `
            select
                cities.idCity as 'city.idCity',
                cities.latitude as 'city.latitude',
                cities.longitude as 'city.longitude',
                cities.name as 'city.name',
                parks.backstopDistance,
                parks.capacityMax,
                parks.idPark,
                parks.idTeam,
                parks.name,
                parks.roofType,
                parks.surfaceType,
                parksFieldCoordinates.basePath,
                parksFieldCoordinates.batterLeftX,
                parksFieldCoordinates.batterLeftY,
                parksFieldCoordinates.batterRightX,
                parksFieldCoordinates.batterRightY,
                parksFieldCoordinates.coachesBoxFirstX,
                parksFieldCoordinates.coachesBoxFirstY,
                parksFieldCoordinates.coachesBoxThirdX,
                parksFieldCoordinates.coachesBoxThirdY,
                parksFieldCoordinates.firstBaseX,
                parksFieldCoordinates.firstBaseY,
                parksFieldCoordinates.foulLineLeftFieldX,
                parksFieldCoordinates.foulLineLeftFieldY,
                parksFieldCoordinates.foulLineRightFieldX,
                parksFieldCoordinates.foulLineRightFieldY,
                parksFieldCoordinates.homePlateX,
                parksFieldCoordinates.homePlateY,
                parksFieldCoordinates.idPark,
                parksFieldCoordinates.onDeckLeftX,
                parksFieldCoordinates.onDeckLeftY,
                parksFieldCoordinates.onDeckRightX,
                parksFieldCoordinates.onDeckRightY,
                parksFieldCoordinates.pitchersPlateX,
                parksFieldCoordinates.pitchersPlateY,
                parksFieldCoordinates.secondBaseX,
                parksFieldCoordinates.secondBaseY,
                parksFieldCoordinates.thirdBaseX,
                parksFieldCoordinates.thirdBaseY
            from parks
            inner join cities on parks.idCity = cities.idCity
            inner join parksFieldCoordinates on parks.idPark = parksFieldCoordinates.idPark
            where 
                parks.idTeam in (${paramsTeams.map(() => "?").join(", ")})

        `;

		const [dataParks, errorParks] = handleValibotParse({
			data: db.prepare(queryParks).all(...paramsTeams),
			schema: array(VQueryConstructorGameSimPark),
			shouldParseDotNotation: true,
		});

		if (errorParks || !dataParks) {
			return c.text("Internal Server Error", 500);
		}

		const queryParksWallSegments = /* sql */ `
            select
                height,
                idPark,
                segmentEndX,
                segmentEndY,
                segmentStartX,
                segmentStartY
            from
                parksWallSegments
            where
                idPark in (${dataParks.map(() => "?").join(", ")})
            ;
        `;

		const [dataParksWallSegments, errorParksWallSegments] = handleValibotParse({
			data: db
				.prepare(queryParksWallSegments)
				.all(...dataParks.map((park) => park.idPark)),
			schema: array(VDbParksWallSegments),
			shouldParseDotNotation: true,
		});

		if (errorParksWallSegments || !dataParksWallSegments) {
			return c.text("Internal Server Error", 500);
		}

		console.info("Starting simulation");
		for (const game of dataGames.slice(0, 1)) {
			const queryUmpires = /* sql */ `
                    select
                        persons.dateOfBirth,
                        persons.firstName,
                        persons.idPerson,
                        persons.lastName,
                        persons.middleName,
                        persons.nickname,
                        personsAlignment.chaotic as "alignment.chaotic",
                        personsAlignment.evil as "alignment.evil",
                        personsAlignment.good as "alignment.good",
                        personsAlignment.lawful as "alignment.lawful",
                        personsAlignment.neutralMorality as "alignment.neutralMorality",
                        personsAlignment.neutralOrder as "alignment.neutralOrder",
                        personsMyersBriggs.extroversion as "myersBriggs.extroversion",
                        personsMyersBriggs.feeling as "myersBriggs.feeling",
                        personsMyersBriggs.introversion as "myersBriggs.introversion",
                        personsMyersBriggs.intuition as "myersBriggs.intuition",
                        personsMyersBriggs.judging as "myersBriggs.judging",
                        personsMyersBriggs.perceiving as "myersBriggs.perceiving",
                        personsMyersBriggs.sensing as "myersBriggs.sensing",
                        personsMyersBriggs.thinking as "myersBriggs.thinking",
                        personsMental.charisma as "mental.charisma",
                        personsMental.constitution as "mental.constitution",
                        personsMental.intelligence as "mental.intelligence",
                        personsMental.loyalty as "mental.loyalty",
                        personsMental.wisdom as "mental.wisdom",
                        personsMental.workEthic as "mental.workEthic",
                        personsPhysical.height as "physical.height",
                        personsPhysical.weight as "physical.weight",
                        umpires.idUmpire,
                        umpiresRatings.balkAccuracy,
                        umpiresRatings.checkSwingAccuracy,
                        umpiresRatings.consistency,
                        umpiresRatings.expandedZone,
                        umpiresRatings.favorFastballs,
                        umpiresRatings.favorOffspeed,
                        umpiresRatings.highZone,
                        umpiresRatings.insideZone,
                        umpiresRatings.lowZone,
                        umpiresRatings.outsideZone,
                        umpiresRatings.pitchFramingInfluence
                        umpiresRatings.reactionTime,
                    from
                        umpires
                    inner join
                        persons on umpires.idPerson = persons.idPerson
                    inner join
                        personsAlignment on persons.idPerson = personsAlignment.idPerson
                    inner join
                        personsMyersBriggs on persons.idPerson = personsMyersBriggs.idPerson
                    inner join
                        personsMental on persons.idPerson = personsMental.idPerson
                    inner join
                        personsPhysical on persons.idPerson = personsPhysical.idPerson
                    inner join
                        umpiresRatings on umpires.idUmpire = umpiresRatings.idUmpire
                    limit 
                        4
                    
                    ;
                `;

			const [dataUmpires, errorUmpires] = handleValibotParse({
				data: db.prepare(queryUmpires).all(),
				schema: array(VConstructorGameSimUmpire),
				shouldParseDotNotation: true,
			});

			if (errorUmpires || !dataUmpires) {
				return c.text("Internal Server Error", 500);
			}

			const teams = dataTeams
				.filter(
					(t) => t.idTeam === game.idTeamAway || t.idTeam === game.idTeamHome,
				)
				.sort((a) => (a.idTeam === game.idTeamAway ? -1 : 1))
				.map((team) => ({
					...team,
					coaches: dataCoaches.filter((coach) => coach.idTeam === team.idTeam),
					players: dataPlayers.filter(
						(player) => player.idTeam === team.idTeam,
					),
				}));

			const gameSim = new GameSim({
				idGame: game.idGame,
				park: {
					...dataParks.find((park) => park.idTeam === game.idTeamHome),
					wallSegments: dataParksWallSegments,
				},
				teams: [teams[0], teams[1]],
				umpires: [
					dataUmpires[0],
					dataUmpires[1],
					dataUmpires[2],
					dataUmpires[3],
				],
			});

			gameSim.simulate();
		}
		const timeEnd = performance.now();

		console.info(
			`Simulation took $timeEnd - timeStartms for ${dataGames.length} games`,
		);

		return c.text("OK", 200);
	},
);

export default simulate;
