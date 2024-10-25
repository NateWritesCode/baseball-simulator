import { type InferInput, number, object, parse, string } from "valibot";
import { handleValibotParse } from "../functions";
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
	filePathSave =
		"/home/nathanh81/Projects/baseball-simulator/apps/server/src/data/eventStore";
	idGame: number;

	constructor(_input: TConstructorGameSimEventStore) {
		const input = parse(VConstructorGameSimEventStore, _input);
		// this.filePathSave = input.filePathSave;
		this.idGame = input.idGame;
	}

	close = () => {
		console.log("filePathSave", this.filePathSave);
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
