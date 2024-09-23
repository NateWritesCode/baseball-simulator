import { type InferInput, object, string } from "valibot";

export const VApiParamsGetIdPlayer = object({
	idPlayer: string(),
});
export type TApiParamsGetPlayerId = InferInput<typeof VApiParamsGetIdPlayer>;
