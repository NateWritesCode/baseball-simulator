import { handleValibotParse } from "@baseball-simulator/utils/functions";
import type { TGameSimResult } from "@baseball-simulator/utils/types";
import {
	VConstructorGameSimCoach,
	VConstructorGameSimUmpire,
	VDbCities,
	VDbGameSimEvents,
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
import { cpus } from "node:os";
import { array, intersect, object, omit, pick } from "valibot";
import type { WorkerData } from "./gameSimWorker";

const VGames = array(omit(VDbGames, ["boxScore"]));

const simulate = new Hono<{ Variables: TMiddleware["Variables"] }>().post(
	"/simulate",
	async (c) => {
		const db = c.var.db;

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
                idGameGroup,
                idTeamAway,
                idTeamHome
            from
                games
            where
                dateTime = (select dateTime from myUniverse)
            ;
        `;

		const [dataGames, errorGames] = handleValibotParse({
			data: db.query(queryGames).all(),
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
                abbreviation,
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

		const prepareTeams = db.query(queryTeams);

		const [dataTeams, dataError] = handleValibotParse({
			data: prepareTeams.all(...paramsTeams),
			schema: array(
				intersect([
					pick(VDbTeams, ["abbreviation", "idTeam", "nickname"]),
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
			data: db.query(queryPlayers).all(...paramsTeams),
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
                personsPhysical on persons.idPerson = personsPhysical.idPerson
            inner join
                coachesRatings on coaches.idCoach = coachesRatings.idCoach
            where
                coaches.idTeam in (${paramsTeams.map(() => "?").join(", ")})
            ;
        `;

		const [dataCoaches, errorCoaches] = handleValibotParse({
			data: db.query(queryCoaches).all(...paramsTeams),
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
                parks.centerFieldDirection,
                parks.idCity,
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
			data: db.query(queryParks).all(...paramsTeams),
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
                idWallSegment,
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
				.query(queryParksWallSegments)
				.all(...dataParks.map((park) => park.idPark)),
			schema: array(VDbParksWallSegments),
			shouldParseDotNotation: true,
		});

		if (errorParksWallSegments || !dataParksWallSegments) {
			return c.text("Internal Server Error", 500);
		}

		const numCpus = Math.max(1, cpus().length - 1);

		const workerPool: Worker[] = [];

		for (let i = 0; i < numCpus; i++) {
			const worker = new Worker(
				"/home/nathanh81/Projects/baseball-simulator/apps/server/src/routes/gameSimWorker.ts",
			);
			workerPool.push(worker);
		}

		let nextWorker = 0;

		const simulateGame = async (game: (typeof dataGames)[number]) => {
			return new Promise((resolve, reject) => {
				const worker = workerPool[nextWorker];
				nextWorker = (nextWorker + 1) % workerPool.length;

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
                            umpiresRatings.pitchFramingInfluence,
                            umpiresRatings.reactionTime
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
					data: db.query(queryUmpires).all(),
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
						coaches: dataCoaches.filter(
							(coach) => coach.idTeam === team.idTeam,
						),
						players: dataPlayers.filter(
							(player) => player.idTeam === team.idTeam,
						),
					}));

				const park = dataParks.find((park) => park.idTeam === game.idTeamHome);

				if (!park) {
					return c.text("Internal Server Error", 500);
				}

				worker.onmessage = (event) => resolve(event.data as TGameSimResult);
				worker.onerror = reject;

				const workerData: WorkerData = {
					game,
					teams,
					park,
					umpires: [
						dataUmpires[0],
						dataUmpires[1],
						dataUmpires[2],
						dataUmpires[3],
					],
					wallSegments: dataParksWallSegments,
				};

				worker.postMessage(workerData);
			});
		};

		const results: TGameSimResult[] = [];

		try {
			const chunkSize = workerPool.length;
			for (let i = 0; i < dataGames.length; i += chunkSize) {
				const chunk = dataGames.slice(i, i + chunkSize);
				const chunkResults = (await Promise.all(
					chunk.map(simulateGame),
				)) as TGameSimResult[];
				results.push(...chunkResults);
			}
		} catch (error) {
			console.error("Error during game simulation:", error);
			return c.text("Internal Server Error", 500);
		} finally {
			// Clean up workers
			for (const worker of workerPool) {
				worker.terminate();
			}
		}

		// After all simulations complete, do database writes in a transaction
		const saveResults = db.transaction(() => {
			// Save all game results
			for (const result of results) {
				// Save any necessary game results to database
				// Add your save logic here

				const queryStandings = db.query(
					/*sql*/ `
					update gameGroups
					set standings = json_patch(
						coalesce(standings, '{}'),
						json_object(
							cast($idTeam as text),
							json_object(
								cast($field as text),
								coalesce(json_extract(standings, '$.' || $idTeam || '.' || $field), 0) + 1
							)
						)
					)
					where idGameGroup = $idGameGroup
				`,
				);

				queryStandings.run({
					idGameGroup: result.idGameGroup,
					idTeam: result.idTeamWinning,
					field: "w",
				});

				queryStandings.run({
					idGameGroup: result.idGameGroup,
					idTeam: result.idTeamLosing,
					field: "l",
				});

				const queryInsertGameLog = db.query(/*sql*/ `
						insert into gameSimLogs (idGame, gameSimLog) values ($idGame, $gameSimLog)
					`);

				queryInsertGameLog.run({
					gameSimLog: JSON.stringify(result.log),
					idGame: result.idGame,
				});

				const keys = Object.keys(
					omit(VDbGameSimEvents, ["idGameSimEvent"]).entries,
				);

				const insertGameSimEvent = db.query(/*sql*/ `
						insert into gameSimEvents (${keys.join(", ")}) values (${keys.map((key) => `$${key}`).join(", ")})
					`);

				const insertGameSimEvents = db.transaction(() => {
					for (const gameSimEvent of result.gameSimEvents) {
						insertGameSimEvent.run(gameSimEvent);
					}
				});

				insertGameSimEvents(result.gameSimEvents);

				const queryBoxScore = db.query(/*sql*/ `
					update games set boxScore = $boxScore where idGame = $idGame;
				`);

				queryBoxScore.run({
					boxScore: JSON.stringify(result.boxScore),
					idGame: result.idGame,
				});

				const queryStatisticsBatting = db.query(/*sql*/ `
                    insert into statisticsPlayerGameGroupBatting
                    (
                        ab, doubles, h, hr, idGameGroup, idPlayer, idTeam,
                        k, lob, outs, rbi, runs, singles, triples
                    )
                    values (
                        $ab, $doubles, $h, $hr, $idGameGroup, $idPlayer, $idTeam,
                        $k, $lob, $outs, $rbi, $runs, $singles, $triples
                    )
                    on conflict (idGameGroup, idPlayer, idTeam) do update set
                        ab = statisticsPlayerGameGroupBatting.ab + $ab,
                        doubles = statisticsPlayerGameGroupBatting.doubles + $doubles,
                        h = statisticsPlayerGameGroupBatting.h + $h,
                        hr = statisticsPlayerGameGroupBatting.hr + $hr,
                        k = statisticsPlayerGameGroupBatting.k + $k,
                        lob = statisticsPlayerGameGroupBatting.lob + $lob,
                        outs = statisticsPlayerGameGroupBatting.outs + $outs,
                        rbi = statisticsPlayerGameGroupBatting.rbi + $rbi,
                        runs = statisticsPlayerGameGroupBatting.runs + $runs,
                        singles = statisticsPlayerGameGroupBatting.singles + $singles,
                        triples = statisticsPlayerGameGroupBatting.triples + $triples
		        `);

				const queryStatisticsPitching = db.query(/*sql*/ `
                    insert into statisticsPlayerGameGroupPitching
                    (
                        battersFaced, bb, doublesAllowed, hitsAllowed, hrsAllowed, idGameGroup, idPlayer, idTeam,
                        k, lob, outs, pitchesThrown, pitchesThrownBalls, pitchesThrownInPlay, pitchesThrownStrikes,
                        runs, runsEarned, singlesAllowed, triplesAllowed
                    )
                    values (
                        $battersFaced, $bb, $doublesAllowed, $hitsAllowed, $hrsAllowed, $idGameGroup, $idPlayer, $idTeam,
                        $k, $lob, $outs, $pitchesThrown, $pitchesThrownBalls, $pitchesThrownInPlay, $pitchesThrownStrikes,
                        $runs, $runsEarned, $singlesAllowed, $triplesAllowed
                    )
                    on conflict (idGameGroup, idPlayer, idTeam) do update set
                        battersFaced = statisticsPlayerGameGroupPitching.battersFaced + $battersFaced,
                        bb = statisticsPlayerGameGroupPitching.bb + $bb,
                        doublesAllowed = statisticsPlayerGameGroupPitching.doublesAllowed + $doublesAllowed,
                        hitsAllowed = statisticsPlayerGameGroupPitching.hitsAllowed + $hitsAllowed,
                        hrsAllowed = statisticsPlayerGameGroupPitching.hrsAllowed + $hrsAllowed,
                        k = statisticsPlayerGameGroupPitching.k + $k,
                        lob = statisticsPlayerGameGroupPitching.lob + $lob,
                        outs = statisticsPlayerGameGroupPitching.outs + $outs,
                        pitchesThrown = statisticsPlayerGameGroupPitching.pitchesThrown + $pitchesThrown,
                        pitchesThrownBalls = statisticsPlayerGameGroupPitching.pitchesThrownBalls + $pitchesThrownBalls,
                        pitchesThrownInPlay = statisticsPlayerGameGroupPitching.pitchesThrownInPlay + $pitchesThrownInPlay,
                        pitchesThrownStrikes = statisticsPlayerGameGroupPitching.pitchesThrownStrikes + $pitchesThrownStrikes,
                        runs = statisticsPlayerGameGroupPitching.runs + $runs,
                        runsEarned = statisticsPlayerGameGroupPitching.runsEarned + $runsEarned,
                        singlesAllowed = statisticsPlayerGameGroupPitching.singlesAllowed + $singlesAllowed,
                        triplesAllowed = statisticsPlayerGameGroupPitching.triplesAllowed + $triplesAllowed
		        `);

				const insertStatisticsBatting = db.transaction(() => {
					for (const player of result.players) {
						queryStatisticsBatting.run({
							ab: player.batting.ab,
							doubles: player.batting.doubles,
							h: player.batting.h,
							hr: player.batting.hr,
							idGameGroup: result.idGameGroup,
							idPlayer: player.idPlayer,
							idTeam: player.idTeam,
							k: player.batting.k,
							lob: player.batting.lob,
							outs: player.batting.outs,
							rbi: player.batting.rbi,
							runs: player.batting.runs,
							singles: player.batting.singles,
							triples: player.batting.triples,
						});
					}
				});

				const insertStatisticsPitching = db.transaction(() => {
					for (const player of result.players) {
						queryStatisticsPitching.run({
							battersFaced: player.pitching.battersFaced,
							bb: player.pitching.bb,
							doublesAllowed: player.pitching.doublesAllowed,
							hitsAllowed: player.pitching.hitsAllowed,
							hrsAllowed: player.pitching.hrsAllowed,
							idGameGroup: result.idGameGroup,
							idPlayer: player.idPlayer,
							idTeam: player.idTeam,
							k: player.pitching.k,
							lob: player.pitching.lob,
							outs: player.pitching.outs,
							pitchesThrown: player.pitching.pitchesThrown,
							pitchesThrownBalls: player.pitching.pitchesThrownBalls,
							pitchesThrownInPlay: player.pitching.pitchesThrownInPlay,
							pitchesThrownStrikes: player.pitching.pitchesThrownStrikes,
							runs: player.pitching.runs,
							runsEarned: player.pitching.runsEarned,
							singlesAllowed: player.pitching.singlesAllowed,
							triplesAllowed: player.pitching.triplesAllowed,
						});
					}
				});

				insertStatisticsBatting();
				insertStatisticsPitching();
			}

			// Advance the date only after all saves are complete
			const dbQueryAdvanceData = /* sql */ `
                        update universe
                        set
                            dateTime = datetime(dateTime, '+1 day')
                    `;
			db.query(dbQueryAdvanceData).run();
		});

		try {
			saveResults();

			return c.text("OK", 200);
		} catch (error) {
			console.error("Error saving results:", error);
			return c.text("Internal Server Error", 500);
		}
	},
);

export default simulate;
