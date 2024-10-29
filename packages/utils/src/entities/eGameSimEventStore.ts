import fs from "node:fs";
import { type InferInput, number, object, parse, string } from "valibot";
import { handleValibotParse } from "../functions";
import {
	type OGameSimObserver,
	type TGameSimEvent,
	VGameSimEvent,
	VGameSimEventAtBatEnd,
	VGameSimEventDouble,
	VGameSimEventHalfInningEnd,
	VGameSimEventHalfInningStart,
	VGameSimEventHomeRun,
	VGameSimEventOut,
	VGameSimEventPitch,
	VGameSimEventRun,
	VGameSimEventSingle,
	VGameSimEventTriple,
	VGameSimStrikeout,
	VGameSimWalk,
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
	gameSimEvents: TGameSimEvent[] = [];
	idGame: number;

	constructor(_input: TConstructorGameSimEventStore) {
		const input = parse(VConstructorGameSimEventStore, _input);
		// this.filePathSave = input.filePathSave;
		this.idGame = input.idGame;

		const keys = [
			...new Set([
				...Object.keys(VGameSimEventAtBatEnd.entries.data.entries),
				// ...Object.keys(VGameSimEventAtBatStart.entries.data.entries),
				...Object.keys(VGameSimEventDouble.entries.data.entries),
				// ...Object.keys(VGameSimEventGameEnd.entries.data.entries),
				// ...Object.keys(VGameSimEventGameStart.entries.data.entries),
				...Object.keys(VGameSimEventHalfInningEnd.entries.data.entries),
				...Object.keys(VGameSimEventHalfInningStart.entries.data.entries),
				...Object.keys(VGameSimEventHomeRun.entries.data.entries),
				...Object.keys(VGameSimEventOut.entries.data.entries),
				...Object.keys(VGameSimEventPitch.entries.data.entries),
				...Object.keys(VGameSimEventRun.entries.data.entries),
				...Object.keys(VGameSimEventSingle.entries.data.entries),
				...Object.keys(VGameSimStrikeout.entries.data.entries),
				...Object.keys(VGameSimEventTriple.entries.data.entries),
				...Object.keys(VGameSimWalk.entries.data.entries),
			]),
		];
	}

	close = () => {
		console.log("filePathSave", this.filePathSave);

		const filePath = `${this.filePathSave}/${this.idGame}.psv`;

		if (!fs.existsSync(this.filePathSave)) {
			fs.mkdirSync(this.filePathSave);
		}

		const file = Bun.file(`${this.filePathSave}/${this.idGame}.psv`);
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
