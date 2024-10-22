import { type InferInput, object, parse } from "valibot";
import { handleValibotParse } from "../functions";
import {
	type TConstructorGameSimCoach,
	VConstructorGameSimCoach,
} from "../types";
import {
	type OGameSimObserver,
	type TGameSimEvent,
	VGameSimEvent,
} from "../types/tGameSim";

const VConstructorGameSimCoachState = object({
	coach: VConstructorGameSimCoach,
});
type TConstructorGameSimCoachState = InferInput<
	typeof VConstructorGameSimCoachState
>;

class GameSimCoachState implements OGameSimObserver {
	public coach: TConstructorGameSimCoach;

	constructor(_input: TConstructorGameSimCoachState) {
		const input = parse(VConstructorGameSimCoachState, _input);

		this.coach = input.coach;
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

export default GameSimCoachState;
