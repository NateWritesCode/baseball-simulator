import {
	type InferOutput,
	literal,
	null_,
	nullish,
	object,
	variant,
} from "valibot";

const VGameSimEventGameStart = object({
	data: nullish(null_()),
	gameSimEvent: literal("gameStart"),
});

const VGameSimEventGameEnd = object({
	data: nullish(null_()),
	gameSimEvent: literal("gameEnd"),
});

export const VGameSimEvent = variant("gameSimEvent", [
	VGameSimEventGameStart,
	VGameSimEventGameEnd,
]);

export type TGameSimEvent = InferOutput<typeof VGameSimEvent>;

export interface OGameSimObserver {
	notifyGameEvent(input: TGameSimEvent): void;
}
