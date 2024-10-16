import { type InferInput, number, object, parse } from "valibot";
import {
	type OGameSimObserver,
	type TGameSimEvent,
	VGameSimEvent,
} from "../types/tGameSim";

const VConstructorGameSimEventStore = object({
	idGame: number(),
});
type TConstructorGameSimEventStore = InferInput<
	typeof VConstructorGameSimEventStore
>;

export default class GameSimEventStore implements OGameSimObserver {
	idGame: number;

	constructor(_input: TConstructorGameSimEventStore) {
		const input = parse(VConstructorGameSimEventStore, _input);
		this.idGame = input.idGame;
	}

	notifyGameEvent(_input: TGameSimEvent) {
		const input = parse(VGameSimEvent, _input);

		const gameSimEvent = input.gameSimEvent;

		switch (gameSimEvent) {
			case "gameStart": {
				break;
			}
			case "gameEnd": {
				break;
			}
			default: {
				const exhaustiveCheck: never = gameSimEvent;
				throw new Error(exhaustiveCheck);
			}
		}
	}
}
