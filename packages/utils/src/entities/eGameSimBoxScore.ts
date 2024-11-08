import { type InferInput, instance, number, object, parse } from "valibot";
import { handleValibotParse } from "../functions";
import type { TGameSimBoxScore } from "../types/tDb";
import {
	type OGameSimObserver,
	type TGameSimEvent,
	VGameSimEvent,
} from "../types/tGameSim";
import GameSimParkState from "./eGameSimParkState";
import GameSimTeamState from "./eGameSimTeamState";

const VConstructorGameSimBoxScore = object({
	idGame: number(),
	park: instance(GameSimParkState),
	teamAway: instance(GameSimTeamState),
	teamHome: instance(GameSimTeamState),
});
type TConstructorGameSimBoxScore = InferInput<
	typeof VConstructorGameSimBoxScore
>;

class GameSimBoxScore implements OGameSimObserver {
	dateTimeEnd = "";
	dateTimeStart = "";
	idGame: number;
	inningRuns: number[][];
	isTopOfInning: boolean;

	park: GameSimParkState;
	teamAway: GameSimTeamState;
	teamHome: GameSimTeamState;

	constructor(_input: TConstructorGameSimBoxScore) {
		const input = parse(VConstructorGameSimBoxScore, _input);

		this.idGame = input.idGame;
		this.inningRuns = [[], []];
		this.isTopOfInning = true;
		this.park = input.park;
		this.teamAway = input.teamAway;
		this.teamHome = input.teamHome;
	}

	close = () => {
		// const db = new Database(DB_PATH, {
		// 	strict: true,
		// });

		const isHomeTeamWinner =
			this.teamHome.statistics.batting.runs >
			this.teamAway.statistics.batting.runs;

		const pitcherLoss = isHomeTeamWinner
			? this.teamAway.playerStates[this.teamAway.positions.p]
			: this.teamHome.playerStates[this.teamHome.positions.p];
		const pitcherWin = isHomeTeamWinner
			? this.teamHome.playerStates[this.teamHome.positions.p]
			: this.teamAway.playerStates[this.teamAway.positions.p];

		const boxScore: TGameSimBoxScore = {
			dateTimeEnd: this.dateTimeEnd,
			dateTimeStart: this.dateTimeStart,
			idGame: this.idGame,
			inningRuns: this.inningRuns,
			park: this.park.park.name,
			pitcherLoss: {
				idPlayer: pitcherLoss.player.idPlayer,
				firstName: pitcherLoss.player.firstName,
				lastName: pitcherLoss.player.lastName,
			},
			pitcherWin: {
				idPlayer: pitcherWin.player.idPlayer,
				firstName: pitcherWin.player.firstName,
				lastName: pitcherWin.player.lastName,
			},
			teamAway: {
				abbreviation: this.teamAway.team.abbreviation,
				city: this.teamAway.team.city.name,
				errors: this.teamAway.statistics.fielding.e,
				hits: this.teamAway.statistics.batting.h,
				idTeam: this.teamAway.team.idTeam,
				nickname: this.teamAway.team.nickname,
				runs: this.teamAway.statistics.batting.runs,
			},
			teamHome: {
				abbreviation: this.teamHome.team.abbreviation,
				city: this.teamHome.team.city.name,
				errors: this.teamHome.statistics.fielding.e,
				hits: this.teamHome.statistics.batting.h,
				idTeam: this.teamHome.team.idTeam,
				nickname: this.teamHome.team.nickname,
				runs: this.teamHome.statistics.batting.runs,
			},
		};

		// const query = /*sql*/ db.query(`
		// 	update games set boxScore = $boxScore where idGame = $idGame;
		// `);

		// query.run({
		// 	boxScore: JSON.stringify(boxScore),
		// 	idGame: this.idGame,
		// });

		// db.close();

		return boxScore;
	};

	notifyGameEvent(_input: TGameSimEvent) {
		const [input, error] = handleValibotParse({
			data: _input,
			schema: VGameSimEvent,
		});

		if (error || !input) {
			throw new Error("Invalid input");
		}

		const gameSimEvent = input.gameSimEvent;

		switch (gameSimEvent) {
			case "atBatEnd": {
				break;
			}
			case "atBatStart": {
				break;
			}
			case "double": {
				break;
			}
			case "foul": {
				break;
			}
			case "gameEnd": {
				const data = input.data;
				this.dateTimeEnd = data.dateTime;
				break;
			}
			case "gameStart": {
				const data = input.data;
				this.dateTimeStart = data.dateTime;
				break;
			}
			case "halfInningEnd": {
				if (this.isTopOfInning) {
					this.isTopOfInning = false;
				}
				break;
			}
			case "halfInningStart": {
				if (this.isTopOfInning) {
					this.inningRuns[0].push(0);
				} else {
					this.inningRuns[1].push(0);
				}

				break;
			}
			case "hitByPitch": {
				break;
			}
			case "homeRun": {
				break;
			}
			case "out": {
				break;
			}
			case "pitch": {
				break;
			}
			case "run": {
				if (this.isTopOfInning) {
					this.inningRuns[0][this.inningRuns[0].length - 1]++;
				} else {
					this.inningRuns[1][this.inningRuns[1].length - 1]++;
				}

				break;
			}
			case "single": {
				break;
			}
			case "strikeout": {
				break;
			}
			case "triple": {
				break;
			}
			case "walk": {
				break;
			}
			default: {
				const exhaustiveCheck: never = gameSimEvent;
				throw new Error(exhaustiveCheck);
			}
		}
	}
}

export default GameSimBoxScore;
