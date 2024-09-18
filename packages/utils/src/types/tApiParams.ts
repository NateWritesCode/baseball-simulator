import { object, string, type InferInput } from "valibot";

export const VApiParamsPlayer = object({
	id: string(),
});
export type TApiParamsPlayer = InferInput<typeof VApiParamsPlayer>;
