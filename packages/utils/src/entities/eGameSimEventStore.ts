import { type InferInput, number, object, omit, parse, string } from "valibot";
import { handleValibotParse } from "../functions";
import { VDbGameSimEvents } from "../types";
import {
	type OGameSimObserver,
	type TGameSimEvent,
	VGameSimEvent,
} from "../types/tGameSim";

const VConstructorGameSimEventStore = object({
	filePathSave: string(),
	idGame: number(),
});
type TConstructorGameSimEventStore = InferInput<
	typeof VConstructorGameSimEventStore
>;

export default class GameSimEventStore implements OGameSimObserver {
	gameSimEvents: TGameSimEvent[] = [];
	idGame: number;

	constructor(_input: TConstructorGameSimEventStore) {
		const input = parse(VConstructorGameSimEventStore, _input);
		// this.filePathSave = input.filePathSave;
		this.idGame = input.idGame;
	}

	close = () => {
		// const db = new Database(DB_PATH, {
		// 	strict: true,
		// });

		const keys = Object.keys(
			omit(VDbGameSimEvents, ["idGameSimEvent"]).entries,
		);

		const gameSimEvents: Record<string, string | number | null>[] = [];

		for (const _gameSimEvent of this.gameSimEvents) {
			const gameSimEvent = _gameSimEvent.gameSimEvent;
			const values: Record<string, string | number | null> = {};

			for (const key of keys) {
				values[key] = null;
			}

			values.gameSimEvent = gameSimEvent;
			values.idGame = this.idGame;

			switch (gameSimEvent) {
				case "atBatEnd": {
					const data = _gameSimEvent.data;
					values.idTeamDefense = data.teamDefense.team.idTeam;
					values.idTeamOffense = data.teamOffense.team.idTeam;
					break;
				}
				case "atBatStart": {
					break;
				}
				case "double": {
					const data = _gameSimEvent.data;
					values.idTeamDefense = data.teamDefense.team.idTeam;
					values.idTeamOffense = data.teamOffense.team.idTeam;
					values.idPlayerHitter = data.playerHitter.player.idPlayer;
					values.idPlayerPitcher = data.playerPitcher.player.idPlayer;
					values.idPlayerRunner1 = data.playerRunner1?.player.idPlayer || null;
					values.idPlayerRunner2 = data.playerRunner2?.player.idPlayer || null;
					values.idPlayerRunner3 = data.playerRunner3?.player.idPlayer || null;
					break;
				}
				case "foul": {
					const data = _gameSimEvent.data;
					values.idTeamDefense = data.teamDefense.team.idTeam;
					values.idTeamOffense = data.teamOffense.team.idTeam;
					values.idPlayerHitter = data.playerHitter.player.idPlayer;
					values.idPlayerPitcher = data.playerPitcher.player.idPlayer;
					break;
				}
				case "gameEnd": {
					break;
				}
				case "gameStart": {
					break;
				}
				case "halfInningEnd": {
					break;
				}
				case "halfInningStart": {
					break;
				}
				case "homeRun": {
					const data = _gameSimEvent.data;
					values.idTeamDefense = data.teamDefense.team.idTeam;
					values.idTeamOffense = data.teamOffense.team.idTeam;
					values.idPlayerHitter = data.playerHitter.player.idPlayer;
					values.idPlayerPitcher = data.playerPitcher.player.idPlayer;
					values.idPlayerRunner1 = data.playerRunner1?.player.idPlayer || null;
					values.idPlayerRunner2 = data.playerRunner2?.player.idPlayer || null;
					values.idPlayerRunner3 = data.playerRunner3?.player.idPlayer || null;
					break;
				}
				case "out": {
					const data = _gameSimEvent.data;
					values.idTeamDefense = data.teamDefense.team.idTeam;
					values.idTeamOffense = data.teamOffense.team.idTeam;
					values.idPlayerHitter = data.playerHitter.player.idPlayer;
					values.idPlayerPitcher = data.playerPitcher.player.idPlayer;
					values.idPlayerRunner1 = data.playerRunner1?.player.idPlayer || null;
					values.idPlayerRunner2 = data.playerRunner2?.player.idPlayer || null;
					values.idPlayerRunner3 = data.playerRunner3?.player.idPlayer || null;
					break;
				}
				case "pitch": {
					const data = _gameSimEvent.data;
					values.idTeamDefense = data.teamDefense.team.idTeam;
					values.idTeamOffense = data.teamOffense.team.idTeam;
					values.idPlayerHitter = data.playerHitter.player.idPlayer;
					values.idPlayerPitcher = data.playerPitcher.player.idPlayer;
					values.pitchLocation = JSON.stringify(data.pitchLocation);
					values.pitchName = data.pitchName;
					values.pitchOutcome = data.pitchOutcome;
					break;
				}
				case "run": {
					const data = _gameSimEvent.data;
					values.idTeamDefense = data.teamDefense.team.idTeam;
					values.idTeamOffense = data.teamOffense.team.idTeam;
					values.idPlayerHitter = data.playerHitter.player.idPlayer;
					values.idPlayerPitcher = data.playerPitcher.player.idPlayer;
					values.idPlayerRunner = data.playerRunner.player.idPlayer;
					break;
				}
				case "single": {
					const data = _gameSimEvent.data;
					values.idTeamDefense = data.teamDefense.team.idTeam;
					values.idTeamOffense = data.teamOffense.team.idTeam;
					values.idPlayerHitter = data.playerHitter.player.idPlayer;
					values.idPlayerPitcher = data.playerPitcher.player.idPlayer;
					values.idPlayerRunner1 = data.playerRunner1?.player.idPlayer || null;
					values.idPlayerRunner2 = data.playerRunner2?.player.idPlayer || null;
					values.idPlayerRunner3 = data.playerRunner3?.player.idPlayer || null;
					break;
				}
				case "strikeout": {
					const data = _gameSimEvent.data;
					values.idTeamDefense = data.teamDefense.team.idTeam;
					values.idTeamOffense = data.teamOffense.team.idTeam;
					values.idPlayerHitter = data.playerHitter.player.idPlayer;
					values.idPlayerPitcher = data.playerPitcher.player.idPlayer;
					break;
				}
				case "triple": {
					const data = _gameSimEvent.data;
					values.idTeamDefense = data.teamDefense.team.idTeam;
					values.idTeamOffense = data.teamOffense.team.idTeam;
					values.idPlayerHitter = data.playerHitter.player.idPlayer;
					values.idPlayerPitcher = data.playerPitcher.player.idPlayer;
					values.idPlayerRunner1 = data.playerRunner1?.player.idPlayer || null;
					values.idPlayerRunner2 = data.playerRunner2?.player.idPlayer || null;
					values.idPlayerRunner3 = data.playerRunner3?.player.idPlayer || null;
					break;
				}
				case "walk": {
					const data = _gameSimEvent.data;
					values.idTeamDefense = data.teamDefense.team.idTeam;
					values.idTeamOffense = data.teamOffense.team.idTeam;
					values.idPlayerHitter = data.playerHitter.player.idPlayer;
					values.idPlayerPitcher = data.playerPitcher.player.idPlayer;
					break;
				}
				default: {
					const exhaustiveCheck: never = gameSimEvent;
					throw new Error(exhaustiveCheck);
				}
			}

			gameSimEvents.push(values);
		}

		return gameSimEvents;
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

		this.gameSimEvents.push(input);

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
				break;
			}
			case "gameStart": {
				break;
			}
			case "halfInningEnd": {
				break;
			}
			case "halfInningStart": {
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
