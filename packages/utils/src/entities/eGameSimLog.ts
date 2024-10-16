import { type InferInput, number, object, parse } from "valibot";
import {
	type OGameSimObserver,
	type TGameSimEvent,
	VGameSimEvent,
} from "../types";
import { Logger } from "./";

const VConstructorGameSimLog = object({
	idGame: number(),
});
type TConstructorGameSimLog = InferInput<typeof VConstructorGameSimLog>;

class GameSimLog implements OGameSimObserver {
	gameLog: string[][] = [];
	idGame: number;

	constructor(_input: TConstructorGameSimLog) {
		const input = parse(VConstructorGameSimLog, _input);

		this.idGame = input.idGame;
	}

	logDanger = (info: string[]) => {
		Logger.danger.apply(null, info);
		this.gameLog.push(info);
	};

	logInfo = (info: string[]) => {
		const shouldLog = true;

		if (shouldLog) {
			Logger.info.apply(null, info);
		}
		this.gameLog.push(info);
	};

	notifyGameEvent(_input: TGameSimEvent) {
		const input = parse(VGameSimEvent, _input);

		const gameSimEvent = input.gameSimEvent;

		switch (gameSimEvent) {
			case "gameEnd": {
				break;
			}
			case "gameStart": {
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
