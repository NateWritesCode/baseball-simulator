import { type InferInput, object, parse } from "valibot";
import { handleValibotParse } from "../functions";
import {
	type TConstructorGameSimUmpire,
	VConstructorGameSimUmpire,
} from "../types";
import {
	type OGameSimObserver,
	type TGameSimEvent,
	VGameSimEvent,
} from "../types/tGameSim";

const VConstructorGameSimUmpireState = object({
	umpire: VConstructorGameSimUmpire,
});
type TConstructorGameSimUmpireState = InferInput<
	typeof VConstructorGameSimUmpireState
>;

class GameSimUmpireState implements OGameSimObserver {
	public umpire: TConstructorGameSimUmpire;

	constructor(_input: TConstructorGameSimUmpireState) {
		const input = parse(VConstructorGameSimUmpireState, _input);

		this.umpire = input.umpire;
	}

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

export default GameSimUmpireState;
