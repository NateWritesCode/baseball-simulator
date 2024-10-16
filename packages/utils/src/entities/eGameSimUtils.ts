import { type InferInput, instance, nullable, object, parse } from "valibot";
import GameSimPlayerState from "./eGameSimPlayerState";

const VInputGetNumRunnersOnBase = object({
	playerRunner1: nullable(instance(GameSimPlayerState)),
	playerRunner2: nullable(instance(GameSimPlayerState)),
	playerRunner3: nullable(instance(GameSimPlayerState)),
});
type TInputGetNumRunnersOnBase = InferInput<typeof VInputGetNumRunnersOnBase>;

class GameSimUtils {
	protected getNumRunnersOnBase(_input: TInputGetNumRunnersOnBase) {
		const { playerRunner1, playerRunner2, playerRunner3 } = parse(
			VInputGetNumRunnersOnBase,
			_input,
		);

		let counter = 0;

		if (playerRunner1) {
			counter++;
		}

		if (playerRunner2) {
			counter++;
		}

		if (playerRunner3) {
			counter++;
		}

		return counter;
	}
}

export default GameSimUtils;
