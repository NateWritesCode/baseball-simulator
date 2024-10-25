import fs from "node:fs";
import { type InferInput, number, object, parse, string } from "valibot";
import { handleValibotParse } from "../functions";
import {
	type OGameSimObserver,
	type TGameSimEvent,
	VGameSimEvent,
} from "../types/tGameSim";
import Logger from "./eLogger";

const VConstructorGameSimLog = object({
	filePathSave: string(),
	idGame: number(),
});
type TConstructorGameSimLog = InferInput<typeof VConstructorGameSimLog>;

class GameSimLog implements OGameSimObserver {
	filePathSave =
		"/home/nathanh81/Projects/baseball-simulator/apps/server/src/data/log";
	gameLog: string[][] = [];
	idGame: number;

	constructor(_input: TConstructorGameSimLog) {
		const input = parse(VConstructorGameSimLog, _input);

		this.idGame = input.idGame;
	}

	close = () => {
		fs.writeFileSync(
			`${this.filePathSave}/${this.idGame}.json`,
			JSON.stringify(this.gameLog),
		);
	};

	logDanger = (info: string[]) => {
		Logger.danger.apply(null, info);
		this.gameLog.push(info);
	};

	logInfo = (info: string[]) => {
		const shouldLog = false;

		if (shouldLog) {
			Logger.info.apply(null, info);
		}
		this.gameLog.push(info);
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
				const { playerHitter } = input.data;
				this.logInfo([
					`${playerHitter.player.firstName} ${playerHitter.player.lastName} hit a double`,
				]);
				break;
			}
			case "gameEnd": {
				this.logDanger(["Game Ended"]);
				break;
			}
			case "gameStart": {
				this.logDanger(["Game Started"]);
				break;
			}
			case "halfInningEnd": {
				break;
			}
			case "halfInningStart": {
				const { teamDefense, teamOffense } = input.data;

				this.logDanger([
					`Half inning started: ${teamDefense.team.nickname} is on defense and ${teamOffense.team.nickname} is on offense`,
				]);

				break;
			}
			case "homeRun": {
				const { playerHitter } = input.data;
				this.logInfo([
					`${playerHitter.player.firstName} ${playerHitter.player.lastName} hit a home run`,
				]);
				break;
			}
			case "out": {
				const { playerHitter } = input.data;
				this.logInfo([
					`${playerHitter.player.firstName} ${playerHitter.player.lastName} is out`,
				]);
				break;
			}
			case "pitch": {
				const { pitchName, pitchLocation } = input.data;

				this.logInfo([
					`Pitch thrown: ${pitchName} at ${JSON.stringify(pitchLocation.releaseSpeed)}`,
				]);
				break;
			}
			case "run": {
				const { playerRunner, teamOffense } = input.data;

				this.logInfo([
					`${teamOffense.team.nickname} ${playerRunner.player.firstName} ${playerRunner.player.lastName} scored a run`,
				]);

				break;
			}
			case "single": {
				const { playerHitter } = input.data;
				this.logInfo([
					`${playerHitter.player.firstName} ${playerHitter.player.lastName} hit a single`,
				]);
				break;
			}
			case "strikeout": {
				const { playerHitter } = input.data;
				this.logInfo([
					`${playerHitter.player.firstName} ${playerHitter.player.lastName} struck out`,
				]);
				break;
			}
			case "triple": {
				const { playerHitter } = input.data;
				this.logInfo([
					`${playerHitter.player.firstName} ${playerHitter.player.lastName} hit a triple`,
				]);
				break;
			}
			case "walk": {
				const { playerHitter } = input.data;
				this.logInfo([
					`${playerHitter.player.firstName} ${playerHitter.player.lastName} walked`,
				]);
				break;
			}
			default: {
				const exhaustiveCheck: never = gameSimEvent;
				throw new Error(exhaustiveCheck);
			}
		}
	}
}

export default GameSimLog;
